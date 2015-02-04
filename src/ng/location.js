'use strict';

var PATH_MATCH = /^([^\?#]*)(\?([^#]*))?(#(.*))?$/,
    DEFAULT_PORTS = {'http': 80, 'https': 443, 'ftp': 21};
var $locationMinErr = minErr('$location');


/**
 * Encode path using encodeUriSegment, ignoring forward slashes
 *
 * @param {string} path Path to encode
 * @returns {string}
 */
function encodePath(path) {
  var segments = path.split('/'),
      i = segments.length;

  while (i--) {
    segments[i] = encodeUriSegment(segments[i]);
  }

  return segments.join('/');
}

function parseAbsoluteUrl(absoluteUrl, locationObj) {
  var parsedUrl = urlResolve(absoluteUrl);

  locationObj.$$protocol = parsedUrl.protocol;
  locationObj.$$host = parsedUrl.hostname;
  locationObj.$$port = toInt(parsedUrl.port) || DEFAULT_PORTS[parsedUrl.protocol] || null;
}


function parseAppUrl(relativeUrl, locationObj) {
  var prefixed = (relativeUrl.charAt(0) !== '/');
  if (prefixed) {
    relativeUrl = '/' + relativeUrl;
  }
  var match = urlResolve(relativeUrl);
  locationObj.$$path = decodeURIComponent(prefixed && match.pathname.charAt(0) === '/' ?
      match.pathname.substring(1) : match.pathname);
  locationObj.$$search = parseKeyValue(match.search);
  locationObj.$$hash = decodeURIComponent(match.hash);

  // make sure path starts with '/';
  if (locationObj.$$path && locationObj.$$path.charAt(0) != '/') {
    locationObj.$$path = '/' + locationObj.$$path;
  }
}


/**
 *
 * @param {string} begin
 * @param {string} whole
 * @returns {string} returns text from whole after begin or undefined if it does not begin with
 *                   expected string.
 */
function beginsWith(begin, whole) {
  if (whole.indexOf(begin) === 0) {
    return whole.substr(begin.length);
  }
}


function stripHash(url) {
  var index = url.indexOf('#');
  return index == -1 ? url : url.substr(0, index);
}

function trimEmptyHash(url) {
  return url.replace(/(#.+)|#$/, '$1');
}


function stripFile(url) {
  return url.substr(0, stripHash(url).lastIndexOf('/') + 1);
}

/* return the server only (scheme://host:port) */
function serverBase(url) {
  return url.substring(0, url.indexOf('/', url.indexOf('//') + 2));
}


/**
 * LocationHtml5Url represents an url
 * This object is exposed as $location service when HTML5 mode is enabled and supported
 *
 * @constructor
 * @param {string} appBase application base URL
 * @param {string} basePrefix url path prefix
 */
function LocationHtml5Url(appBase, basePrefix) {
  this.$$html5 = true;
  basePrefix = basePrefix || '';
  var appBaseNoFile = stripFile(appBase);
  parseAbsoluteUrl(appBase, this);


  /**
   * Parse given html5 (regular) url string into properties
   * @param {string} url HTML5 url
   * @private
   */
  this.$$parse = function(url) {
    var pathUrl = beginsWith(appBaseNoFile, url);
    if (!isString(pathUrl)) {
      throw $locationMinErr('ipthprfx', 'Invalid url "{0}", missing path prefix "{1}".', url,
          appBaseNoFile);
    }

    parseAppUrl(pathUrl, this);

    if (!this.$$path) {
      this.$$path = '/';
    }

    this.$$compose();
  };

  /**
   * Compose url and update `absUrl` property
   * @private
   */
  this.$$compose = function() {
    var search = toKeyValue(this.$$search),
        hash = this.$$hash ? '#' + encodeUriSegment(this.$$hash) : '';

    this.$$url = encodePath(this.$$path) + (search ? '?' + search : '') + hash;
    this.$$absUrl = appBaseNoFile + this.$$url.substr(1); // first char is always '/'
  };

  this.$$parseLinkUrl = function(url, relHref) {
    if (relHref && relHref[0] === '#') {
      // special case for links to hash fragments:
      // keep the old url and only replace the hash fragment
      this.hash(relHref.slice(1));
      return true;
    }
    var appUrl, prevAppUrl;
    var rewrittenUrl;

    if ((appUrl = beginsWith(appBase, url)) !== undefined) {
      prevAppUrl = appUrl;
      if ((appUrl = beginsWith(basePrefix, appUrl)) !== undefined) {
        rewrittenUrl = appBaseNoFile + (beginsWith('/', appUrl) || appUrl);
      } else {
        rewrittenUrl = appBase + prevAppUrl;
      }
    } else if ((appUrl = beginsWith(appBaseNoFile, url)) !== undefined) {
      rewrittenUrl = appBaseNoFile + appUrl;
    } else if (appBaseNoFile == url + '/') {
      rewrittenUrl = appBaseNoFile;
    }
    if (rewrittenUrl) {
      this.$$parse(rewrittenUrl);
    }
    return !!rewrittenUrl;
  };
}


/**
 * LocationHashbangUrl represents url
 * This object is exposed as $location service when developer doesn't opt into html5 mode.
 * It also serves as the base class for html5 mode fallback on legacy browsers.
 *
 * @constructor
 * @param {string} appBase application base URL
 * @param {string} hashPrefix hashbang prefix
 */
function LocationHashbangUrl(appBase, hashPrefix) {
  var appBaseNoFile = stripFile(appBase);

  parseAbsoluteUrl(appBase, this);


  /**
   * Parse given hashbang url into properties
   * @param {string} url Hashbang url
   * @private
   */
  this.$$parse = function(url) {
    var withoutBaseUrl = beginsWith(appBase, url) || beginsWith(appBaseNoFile, url);
    var withoutHashUrl;

    if (withoutBaseUrl.charAt(0) === '#') {

      // The rest of the url starts with a hash so we have
      // got either a hashbang path or a plain hash fragment
      withoutHashUrl = beginsWith(hashPrefix, withoutBaseUrl);
      if (isUndefined(withoutHashUrl)) {
        // There was no hashbang prefix so we just have a hash fragment
        withoutHashUrl = withoutBaseUrl;
      }

    } else {
      // There was no hashbang path nor hash fragment:
      // If we are in HTML5 mode we use what is left as the path;
      // Otherwise we ignore what is left
      withoutHashUrl = this.$$html5 ? withoutBaseUrl : '';
    }

    parseAppUrl(withoutHashUrl, this);

    this.$$path = removeWindowsDriveName(this.$$path, withoutHashUrl, appBase);

    this.$$compose();

    /*
     * In Windows, on an anchor node on documents loaded from
     * the filesystem, the browser will return a pathname
     * prefixed with the drive name ('/C:/path') when a
     * pathname without a drive is set:
     *  * a.setAttribute('href', '/foo')
     *   * a.pathname === '/C:/foo' //true
     *
     * Inside of Angular, we're always using pathnames that
     * do not include drive names for routing.
     */
    function removeWindowsDriveName(path, url, base) {
      /*
      Matches paths for file protocol on windows,
      such as /C:/foo/bar, and captures only /foo/bar.
      */
      var windowsFilePathExp = /^\/[A-Z]:(\/.*)/;

      var firstPathSegmentMatch;

      //Get the relative path from the input URL.
      if (url.indexOf(base) === 0) {
        url = url.replace(base, '');
      }

      // The input URL intentionally contains a first path segment that ends with a colon.
      if (windowsFilePathExp.exec(url)) {
        return path;
      }

      firstPathSegmentMatch = windowsFilePathExp.exec(path);
      return firstPathSegmentMatch ? firstPathSegmentMatch[1] : path;
    }
  };

  /**
   * Compose hashbang url and update `absUrl` property
   * @private
   */
  this.$$compose = function() {
    var search = toKeyValue(this.$$search),
        hash = this.$$hash ? '#' + encodeUriSegment(this.$$hash) : '';

    this.$$url = encodePath(this.$$path) + (search ? '?' + search : '') + hash;
    this.$$absUrl = appBase + (this.$$url ? hashPrefix + this.$$url : '');
  };

  this.$$parseLinkUrl = function(url, relHref) {
    if (stripHash(appBase) == stripHash(url)) {
      this.$$parse(url);
      return true;
    }
    return false;
  };
}


/**
 * LocationHashbangUrl represents url
 * This object is exposed as $location service when html5 history api is enabled but the browser
 * does not support it.
 *
 * @constructor
 * @param {string} appBase application base URL
 * @param {string} hashPrefix hashbang prefix
 */
function LocationHashbangInHtml5Url(appBase, hashPrefix) {
  this.$$html5 = true;
  LocationHashbangUrl.apply(this, arguments);

  var appBaseNoFile = stripFile(appBase);

  this.$$parseLinkUrl = function(url, relHref) {
    if (relHref && relHref[0] === '#') {
      // special case for links to hash fragments:
      // keep the old url and only replace the hash fragment
      this.hash(relHref.slice(1));
      return true;
    }

    var rewrittenUrl;
    var appUrl;

    if (appBase == stripHash(url)) {
      rewrittenUrl = url;
    } else if ((appUrl = beginsWith(appBaseNoFile, url))) {
      rewrittenUrl = appBase + hashPrefix + appUrl;
    } else if (appBaseNoFile === url + '/') {
      rewrittenUrl = appBaseNoFile;
    }
    if (rewrittenUrl) {
      this.$$parse(rewrittenUrl);
    }
    return !!rewrittenUrl;
  };

  this.$$compose = function() {
    var search = toKeyValue(this.$$search),
        hash = this.$$hash ? '#' + encodeUriSegment(this.$$hash) : '';

    this.$$url = encodePath(this.$$path) + (search ? '?' + search : '') + hash;
    // include hashPrefix in $$absUrl when $$url is empty so IE8 & 9 do not reload page because of removal of '#'
    this.$$absUrl = appBase + hashPrefix + this.$$url;
  };

}


var locationPrototype = {

  /**
   * Are we in html5 mode?
   * @private
   */
  $$html5: false,

  /**
   * Has any change been replacing?
   * @private
   */
  $$replace: false,

  /**
   * @ngdoc method
   * @name $location#absUrl
   *
   * @description
   * This method is getter only.
   *
   * Return full url representation with all segments encoded according to rules specified in
   * [RFC 3986](http://www.ietf.org/rfc/rfc3986.txt).
   *
   *
   * ```js
   * // given url http://example.com/#/some/path?foo=bar&baz=xoxo
   * var absUrl = $location.absUrl();
   * // => "http://example.com/#/some/path?foo=bar&baz=xoxo"
   * ```
   *
   * @return {string} full url
   */
  absUrl: locationGetter('$$absUrl'),

  /**
   * @ngdoc method
   * @name $location#url
   *
   * @description
   * This method is getter / setter.
   *
   * Return url (e.g. `/path?a=b#hash`) when called without any parameter.
   *
   * Change path, search and hash, when called with parameter and return `$location`.
   *
   *
   * ```js
   * // given url http://example.com/#/some/path?foo=bar&baz=xoxo
   * var url = $location.url();
   * // => "/some/path?foo=bar&baz=xoxo"
   * ```
   *
   * @param {string=} url New url without base prefix (e.g. `/path?a=b#hash`)
   * @return {string} url
   */
  url: function(url) {
    if (isUndefined(url)) {
      return this.$$url;
    }

    var match = PATH_MATCH.exec(url);
    if (match[1] || url === '') this.path(decodeURIComponent(match[1]));
    if (match[2] || match[1] || url === '') this.search(match[3] || '');
    this.hash(match[5] || '');

    return this;
  },

  /**
   * @ngdoc method
   * @name $location#protocol
   *
   * @description
   * This method is getter only.
   *
   * Return protocol of current url.
   *
   *
   * ```js
   * // given url http://example.com/#/some/path?foo=bar&baz=xoxo
   * var protocol = $location.protocol();
   * // => "http"
   * ```
   *
   * @return {string} protocol of current url
   */
  protocol: locationGetter('$$protocol'),

  /**
   * @ngdoc method
   * @name $location#host
   *
   * @description
   * This method is getter only.
   *
   * Return host of current url.
   *
   *
   * ```js
   * // given url http://example.com/#/some/path?foo=bar&baz=xoxo
   * var host = $location.host();
   * // => "example.com"
   * ```
   *
   * @return {string} host of current url.
   */
  host: locationGetter('$$host'),

  /**
   * @ngdoc method
   * @name $location#port
   *
   * @description
   * This method is getter only.
   *
   * Return port of current url.
   *
   *
   * ```js
   * // given url http://example.com/#/some/path?foo=bar&baz=xoxo
   * var port = $location.port();
   * // => 80
   * ```
   *
   * @return {Number} port
   */
  port: locationGetter('$$port'),

  /**
   * @ngdoc method
   * @name $location#path
   *
   * @description
   * This method is getter / setter.
   *
   * Return path of current url when called without any parameter.
   *
   * Change path when called with parameter and return `$location`.
   *
   * Note: Path should always begin with forward slash (/), this method will add the forward slash
   * if it is missing.
   *
   *
   * ```js
   * // given url http://example.com/#/some/path?foo=bar&baz=xoxo
   * var path = $location.path();
   * // => "/some/path"
   * ```
   *
   * @param {(string|number)=} path New path
   * @return {string} path
   */
  path: locationGetterSetter('$$path', function(path) {
    path = path !== null ? path.toString() : '';
    return path.charAt(0) == '/' ? path : '/' + path;
  }),

  /**
   * @ngdoc method
   * @name $location#search
   *
   * @description
   * This method is getter / setter.
   *
   * Return search part (as object) of current url when called without any parameter.
   *
   * Change search part when called with parameter and return `$location`.
   *
   *
   * ```js
   * // given url http://example.com/#/some/path?foo=bar&baz=xoxo
   * var searchObject = $location.search();
   * // => {foo: 'bar', baz: 'xoxo'}
   *
   * // set foo to 'yipee'
   * $location.search('foo', 'yipee');
   * // $location.search() => {foo: 'yipee', baz: 'xoxo'}
   * ```
   *
   * @param {string|Object.<string>|Object.<Array.<string>>} search New search params - string or
   * hash object.
   *
   * When called with a single argument the method acts as a setter, setting the `search` component
   * of `$location` to the specified value.
   *
   * If the argument is a hash object containing an array of values, these values will be encoded
   * as duplicate search parameters in the url.
   *
   * @param {(string|Number|Array<string>|boolean)=} paramValue If `search` is a string or number, then `paramValue`
   * will override only a single search property.
   *
   * If `paramValue` is an array, it will override the property of the `search` component of
   * `$location` specified via the first argument.
   *
   * If `paramValue` is `null`, the property specified via the first argument will be deleted.
   *
   * If `paramValue` is `true`, the property specified via the first argument will be added with no
   * value nor trailing equal sign.
   *
   * @return {Object} If called with no arguments returns the parsed `search` object. If called with
   * one or more arguments returns `$location` object itself.
   */
  search: function(search, paramValue) {
    switch (arguments.length) {
      case 0:
        return this.$$search;
      case 1:
        if (isString(search) || isNumber(search)) {
          search = search.toString();
          this.$$search = parseKeyValue(search);
        } else if (isObject(search)) {
          search = copy(search, {});
          // remove object undefined or null properties
          forEach(search, function(value, key) {
            if (value == null) delete search[key];
          });

          this.$$search = search;
        } else {
          throw $locationMinErr('isrcharg',
              'The first argument of the `$location#search()` call must be a string or an object.');
        }
        break;
      default:
        if (isUndefined(paramValue) || paramValue === null) {
          delete this.$$search[search];
        } else {
          this.$$search[search] = paramValue;
        }
    }

    this.$$compose();
    return this;
  },

  /**
   * @ngdoc method
   * @name $location#hash
   *
   * @description
   * This method is getter / setter.
   *
   * Return hash fragment when called without any parameter.
   *
   * Change hash fragment when called with parameter and return `$location`.
   *
   *
   * ```js
   * // given url http://example.com/#/some/path?foo=bar&baz=xoxo#hashValue
   * var hash = $location.hash();
   * // => "hashValue"
   * ```
   *
   * @param {(string|number)=} hash New hash fragment
   * @return {string} hash
   */
  hash: locationGetterSetter('$$hash', function(hash) {
    return hash !== null ? hash.toString() : '';
  }),

  /**
   * @ngdoc method
   * @name $location#replace
   *
   * @description
   * If called, all changes to $location during current `$digest` will be replacing current history
   * record, instead of adding new one.
   */
  replace: function() {
    this.$$replace = true;
    return this;
  }
};

forEach([LocationHashbangInHtml5Url, LocationHashbangUrl, LocationHtml5Url], function(Location) {
  Location.prototype = Object.create(locationPrototype);

  /**
   * @ngdoc method
   * @name $location#state
   *
   * @description
   * This method is getter / setter.
   *
   * Return the history state object when called without any parameter.
   *
   * Change the history state object when called with one parameter and return `$location`.
   * The state object is later passed to `pushState` or `replaceState`.
   *
   * NOTE: This method is supported only in HTML5 mode and only in browsers supporting
   * the HTML5 History API (i.e. methods `pushState` and `replaceState`). If you need to support
   * older browsers (like IE9 or Android < 4.0), don't use this method.
   *
   * @param {object=} state State object for pushState or replaceState
   * @return {object} state
   */
  Location.prototype.state = function(state) {
    if (!arguments.length) {
      return this.$$state;
    }

    if (Location !== LocationHtml5Url || !this.$$html5) {
      throw $locationMinErr('nostate', 'History API state support is available only ' +
        'in HTML5 mode and only in browsers supporting HTML5 History API');
    }
    // The user might modify `stateObject` after invoking `$location.state(stateObject)`
    // but we're changing the $$state reference to $browser.state() during the $digest
    // so the modification window is narrow.
    this.$$state = isUndefined(state) ? null : state;

    return this;
  };
});


function locationGetter(property) {
  return function() {
    return this[property];
  };
}


function locationGetterSetter(property, preprocess) {
  return function(value) {
    if (isUndefined(value)) {
      return this[property];
    }

    this[property] = preprocess(value);
    this.$$compose();

    return this;
  };
}


/**
 * @ngdoc service
 * @name $location
 *
 * @requires $rootElement
 *
 * @description
 * The $location service parses the URL in the browser address bar (based on the
 * [window.location](https://developer.mozilla.org/en/window.location)) and makes the URL
 * available to your application. Changes to the URL in the address bar are reflected into
 * $location service and changes to $location are reflected into the browser address bar.
 *
 * **The $location service:**
 *
 * - Exposes the current URL in the browser address bar, so you can
 *   - Watch and observe the URL.
 *   - Change the URL.
 * - Synchronizes the URL with the browser when the user
 *   - Changes the address bar.
 *   - Clicks the back or forward button (or clicks a History link).
 *   - Clicks on a link.
 * - Represents the URL object as a set of methods (protocol, host, port, path, search, hash).
 *
 * For more information see {@link guide/$location Developer Guide: Using $location}
 */

/**
 * @ngdoc provider
 * @name $locationProvider
 * @description
 * Use the `$locationProvider` to configure how the application deep linking paths are stored.
 */
function $LocationProvider() {
  var hashPrefix = '',
      html5Mode = {
        enabled: false,
        requireBase: true,
        rewriteLinks: true
      };

  /**
   * @ngdoc method
   * @name $locationProvider#hashPrefix
   * @description
   * @param {string=} prefix Prefix for hash part (containing path and search)
   * @returns {*} current value if used as getter or itself (chaining) if used as setter
   */
  this.hashPrefix = function(prefix) {
    if (isDefined(prefix)) {
      hashPrefix = prefix;
      return this;
    } else {
      return hashPrefix;
    }
  };

  /**
   * @ngdoc method
   * @name $locationProvider#html5Mode
   * @description
   * @param {(boolean|Object)=} mode If boolean, sets `html5Mode.enabled` to value.
   *   If object, sets `enabled`, `requireBase` and `rewriteLinks` to respective values. Supported
   *   properties:
   *   - **enabled** – `{boolean}` – (default: false) If true, will rely on `history.pushState` to
   *     change urls where supported. Will fall back to hash-prefixed paths in browsers that do not
   *     support `pushState`.
   *   - **requireBase** - `{boolean}` - (default: `true`) When html5Mode is enabled, specifies
   *     whether or not a <base> tag is required to be present. If `enabled` and `requireBase` are
   *     true, and a base tag is not present, an error will be thrown when `$location` is injected.
   *     See the {@link guide/$location $location guide for more information}
   *   - **rewriteLinks** - `{boolean}` - (default: `true`) When html5Mode is enabled,
   *     enables/disables url rewriting for relative links.
   *
   * @returns {Object} html5Mode object if used as getter or itself (chaining) if used as setter
   */
  this.html5Mode = function(mode) {
    if (isBoolean(mode)) {
      html5Mode.enabled = mode;
      return this;
    } else if (isObject(mode)) {

      if (isBoolean(mode.enabled)) {
        html5Mode.enabled = mode.enabled;
      }

      if (isBoolean(mode.requireBase)) {
        html5Mode.requireBase = mode.requireBase;
      }

      if (isBoolean(mode.rewriteLinks)) {
        html5Mode.rewriteLinks = mode.rewriteLinks;
      }

      return this;
    } else {
      return html5Mode;
    }
  };

  /**
   * @ngdoc event
   * @name $location#$locationChangeStart
   * @eventType broadcast on root scope
   * @description
   * Broadcasted before a URL will change.
   *
   * This change can be prevented by calling
   * `preventDefault` method of the event. See {@link ng.$rootScope.Scope#$on} for more
   * details about event object. Upon successful change
   * {@link ng.$location#$locationChangeSuccess $locationChangeSuccess} is fired.
   *
   * The `newState` and `oldState` parameters may be defined only in HTML5 mode and when
   * the browser supports the HTML5 History API.
   *
   * @param {Object} angularEvent Synthetic event object.
   * @param {string} newUrl New URL
   * @param {string=} oldUrl URL that was before it was changed.
   * @param {string=} newState New history state object
   * @param {string=} oldState History state object that was before it was changed.
   */

  /**
   * @ngdoc event
   * @name $location#$locationChangeSuccess
   * @eventType broadcast on root scope
   * @description
   * Broadcasted after a URL was changed.
   *
   * The `newState` and `oldState` parameters may be defined only in HTML5 mode and when
   * the browser supports the HTML5 History API.
   *
   * @param {Object} angularEvent Synthetic event object.
   * @param {string} newUrl New URL
   * @param {string=} oldUrl URL that was before it was changed.
   * @param {string=} newState New history state object
   * @param {string=} oldState History state object that was before it was changed.
   */

  this.$get = ['$rootScope', '$browser', '$sniffer', '$rootElement', '$window',
      function($rootScope, $browser, $sniffer, $rootElement, $window) {
    var $location,
        LocationMode,
        baseHref = $browser.baseHref(), // if base[href] is undefined, it defaults to ''
        initialUrl = $browser.url(),
        appBase;

    if (html5Mode.enabled) {
      if (!baseHref && html5Mode.requireBase) {
        throw $locationMinErr('nobase',
          "$location in HTML5 mode requires a <base> tag to be present!");
      }
      appBase = serverBase(initialUrl) + (baseHref || '/');
      LocationMode = $sniffer.history ? LocationHtml5Url : LocationHashbangInHtml5Url;
    } else {
      appBase = stripHash(initialUrl);
      LocationMode = LocationHashbangUrl;
    }
    $location = new LocationMode(appBase, '#' + hashPrefix);
    $location.$$parseLinkUrl(initialUrl, initialUrl);

    $location.$$state = $browser.state();

    var IGNORE_URI_REGEXP = /^\s*(javascript|mailto):/i;

    function setBrowserUrlWithFallback(url, replace, state) {
      var oldUrl = $location.url();
      var oldState = $location.$$state;
      try {
        $browser.url(url, replace, state);

        // Make sure $location.state() returns referentially identical (not just deeply equal)
        // state object; this makes possible quick checking if the state changed in the digest
        // loop. Checking deep equality would be too expensive.
        $location.$$state = $browser.state();
      } catch (e) {
        // Restore old values if pushState fails
        $location.url(oldUrl);
        $location.$$state = oldState;

        throw e;
      }
    }

    $rootElement.on('click', function(event) {
      // TODO(vojta): rewrite link when opening in new tab/window (in legacy browser)
      // currently we open nice url link and redirect then

      if (!html5Mode.rewriteLinks || event.ctrlKey || event.metaKey || event.shiftKey || event.which == 2 || event.button == 2) return;

      var elm = jqLite(event.target);

      // traverse the DOM up to find first A tag
      while (nodeName_(elm[0]) !== 'a') {
        // ignore rewriting if no A tag (reached root element, or no parent - removed from document)
        if (elm[0] === $rootElement[0] || !(elm = elm.parent())[0]) return;
      }

      var absHref = elm.prop('href');
      // get the actual href attribute - see
      // http://msdn.microsoft.com/en-us/library/ie/dd347148(v=vs.85).aspx
      var relHref = elm.attr('href') || elm.attr('xlink:href');

      if (isObject(absHref) && absHref.toString() === '[object SVGAnimatedString]') {
        // SVGAnimatedString.animVal should be identical to SVGAnimatedString.baseVal, unless during
        // an animation.
        absHref = urlResolve(absHref.animVal).href;
      }

      // Ignore when url is started with javascript: or mailto:
      if (IGNORE_URI_REGEXP.test(absHref)) return;

      if (absHref && !elm.attr('target') && !event.isDefaultPrevented()) {
        if ($location.$$parseLinkUrl(absHref, relHref)) {
          // We do a preventDefault for all urls that are part of the angular application,
          // in html5mode and also without, so that we are able to abort navigation without
          // getting double entries in the location history.
          event.preventDefault();
          // update location manually
          if ($location.absUrl() != $browser.url()) {
            $rootScope.$apply();
            // hack to work around FF6 bug 684208 when scenario runner clicks on links
            $window.angular['ff-684208-preventDefault'] = true;
          }
        }
      }
    });


    // rewrite hashbang url <> html5 url
    if (trimEmptyHash($location.absUrl()) != trimEmptyHash(initialUrl)) {
      $browser.url($location.absUrl(), true);
    }

    var initializing = true;

    // update $location when $browser url changes
    $browser.onUrlChange(function(newUrl, newState) {
      $rootScope.$evalAsync(function() {
        var oldUrl = $location.absUrl();
        var oldState = $location.$$state;
        var defaultPrevented;

        $location.$$parse(newUrl);
        $location.$$state = newState;

        defaultPrevented = $rootScope.$broadcast('$locationChangeStart', newUrl, oldUrl,
            newState, oldState).defaultPrevented;

        // if the location was changed by a `$locationChangeStart` handler then stop
        // processing this location change
        if ($location.absUrl() !== newUrl) return;

        if (defaultPrevented) {
          $location.$$parse(oldUrl);
          $location.$$state = oldState;
          setBrowserUrlWithFallback(oldUrl, false, oldState);
        } else {
          initializing = false;
          afterLocationChange(oldUrl, oldState);
        }
      });
      if (!$rootScope.$$phase) $rootScope.$digest();
    });

    // update browser
    $rootScope.$watch(function $locationWatch() {
      var oldUrl = trimEmptyHash($browser.url());
      var newUrl = trimEmptyHash($location.absUrl());
      var oldState = $browser.state();
      var currentReplace = $location.$$replace;
      var urlOrStateChanged = oldUrl !== newUrl ||
        ($location.$$html5 && $sniffer.history && oldState !== $location.$$state);

      if (initializing || urlOrStateChanged) {
        initializing = false;

        $rootScope.$evalAsync(function() {
          var newUrl = $location.absUrl();
          var defaultPrevented = $rootScope.$broadcast('$locationChangeStart', newUrl, oldUrl,
              $location.$$state, oldState).defaultPrevented;

          // if the location was changed by a `$locationChangeStart` handler then stop
          // processing this location change
          if ($location.absUrl() !== newUrl) return;

          if (defaultPrevented) {
            $location.$$parse(oldUrl);
            $location.$$state = oldState;
          } else {
            if (urlOrStateChanged) {
              setBrowserUrlWithFallback(newUrl, currentReplace,
                                        oldState === $location.$$state ? null : $location.$$state);
            }
            afterLocationChange(oldUrl, oldState);
          }
        });
      }

      $location.$$replace = false;

      // we don't need to return anything because $evalAsync will make the digest loop dirty when
      // there is a change
    });

    return $location;

    function afterLocationChange(oldUrl, oldState) {
      $rootScope.$broadcast('$locationChangeSuccess', $location.absUrl(), oldUrl,
        $location.$$state, oldState);
    }
}];
}
