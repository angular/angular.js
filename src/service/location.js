'use strict';

var URL_MATCH = /^(file|ftp|http|https):\/\/(\w+:{0,1}\w*@)?([\w\.-]*)(:([0-9]+))?(\/[^\?#]*)?(\?([^#]*))?(#(.*))?$/,
    HASH_MATCH = /^([^\?]*)?(\?([^\?]*))?$/,
    DEFAULT_PORTS = {'http': 80, 'https': 443, 'ftp':21};

/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$location
 * @requires $browser
 *
 * @property {string} href The full URL of the current location.
 * @property {string} protocol The protocol part of the URL (e.g. http or https).
 * @property {string} host The host name, ip address or FQDN of the current location.
 * @property {number} port The port number of the current location (e.g. 80, 443, 8080).
 * @property {string} path The path of the current location (e.g. /myapp/inbox).
 * @property {Object.<string|boolean>} search Map of query parameters (e.g. {user:"foo", page:23}).
 * @property {string} hash The fragment part of the URL of the current location (e.g. #foo).
 * @property {string} hashPath Similar to `path`, but located in the `hash` fragment
 *     (e.g. ../foo#/some/path  => /some/path).
 * @property {Object.<string|boolean>} hashSearch Similar to `search` but located in `hash`
 *     fragment (e.g. .../foo#/some/path?hashQuery=param  =>  {hashQuery: "param"}).
 *
 * @description
 * Parses the browser location url and makes it available to your application.
 * Any changes to the url are reflected into `$location` service and changes to
 * `$location` are reflected in the browser location url.
 *
 * Notice that using browser's forward/back buttons changes the $location.
 *
 * @example
   <doc:example>
     <doc:source>
       <div ng:init="$location = $service('$location')">
         <a id="ex-test" href="#myPath?name=misko">test hash</a>|
         <a id="ex-reset" href="#!/api/angular.service.$location">reset hash</a><br/>
         <input type='text' name="$location.hash" size="30">
         <pre>$location = {{$location}}</pre>
       </div>
     </doc:source>
     <doc:scenario>
       it('should initialize the input field', function() {
         expect(using('.doc-example-live').input('$location.hash').val()).
           toBe('!/api/angular.service.$location');
       });


       it('should bind $location.hash to the input field', function() {
         using('.doc-example-live').input('$location.hash').enter('foo');
         expect(browser().location().hash()).toBe('foo');
       });


       it('should set the hash to a test string with test link is presed', function() {
         using('.doc-example-live').element('#ex-test').click();
         expect(using('.doc-example-live').input('$location.hash').val()).
           toBe('myPath?name=misko');
       });

       it('should reset $location when reset link is pressed', function() {
         using('.doc-example-live').input('$location.hash').enter('foo');
         using('.doc-example-live').element('#ex-reset').click();
         expect(using('.doc-example-live').input('$location.hash').val()).
           toBe('!/api/angular.service.$location');
       });

     </doc:scenario>
    </doc:example>
 */
angularServiceInject("$location", function($browser) {
  var scope = this,
      location = {update:update, updateHash: updateHash},
      lastLocation = {};

  $browser.onHashChange(function() { //register
    update($browser.getUrl());
    copy(location, lastLocation);
    scope.$eval();
  })(); //initialize

  this.$onEval(PRIORITY_FIRST, sync);
  this.$onEval(PRIORITY_LAST, updateBrowser);

  return location;

  // PUBLIC METHODS

  /**
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$location#update
   * @methodOf angular.service.$location
   *
   * @description
   * Updates the location object.
   *
   * Does not immediately update the browser. Instead the browser is updated at the end of $eval()
   * cycle.
   *
   * <pre>
       $location.update('http://www.angularjs.org/path#hash?search=x');
       $location.update({host: 'www.google.com', protocol: 'https'});
       $location.update({hashPath: '/path', hashSearch: {a: 'b', x: true}});
     </pre>
   *
   * @param {string|Object} href Full href as a string or object with properties
   */
  function update(href) {
    if (isString(href)) {
      extend(location, parseHref(href));
    } else {
      if (isDefined(href.hash)) {
        extend(href, isString(href.hash) ? parseHash(href.hash) : href.hash);
      }

      extend(location, href);

      if (isDefined(href.hashPath || href.hashSearch)) {
        location.hash = composeHash(location);
      }

      location.href = composeHref(location);
    }
  }

  /**
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$location#updateHash
   * @methodOf angular.service.$location
   *
   * @description
   * Updates the hash fragment part of the url.
   *
   * @see update()
   *
   * <pre>
       scope.$location.updateHash('/hp')
         ==> update({hashPath: '/hp'})
       scope.$location.updateHash({a: true, b: 'val'})
         ==> update({hashSearch: {a: true, b: 'val'}})
       scope.$location.updateHash('/hp', {a: true})
         ==> update({hashPath: '/hp', hashSearch: {a: true}})
     </pre>
   *
   * @param {string|Object} path A hashPath or hashSearch object
   * @param {Object=} search A hashSearch object
   */
  function updateHash(path, search) {
    var hash = {};

    if (isString(path)) {
      hash.hashPath = path;
      hash.hashSearch = search || {};
    } else
      hash.hashSearch = path;

    hash.hash = composeHash(hash);

    update({hash: hash});
  }


  // INNER METHODS

  /**
   * Synchronizes all location object properties.
   *
   * User is allowed to change properties, so after property change,
   * location object is not in consistent state.
   *
   * Properties are synced with the following precedence order:
   *
   * - `$location.href`
   * - `$location.hash`
   * - everything else
   *
   * Keep in mind that if the following code is executed:
   *
   * scope.$location.href = 'http://www.angularjs.org/path#a/b'
   *
   * immediately afterwards all other properties are still the old ones...
   *
   * This method checks the changes and update location to the consistent state
   */
  function sync() {
    if (!equals(location, lastLocation)) {
      if (location.href != lastLocation.href) {
        update(location.href);
        return;
      }
      if (location.hash != lastLocation.hash) {
        var hash = parseHash(location.hash);
        updateHash(hash.hashPath, hash.hashSearch);
      } else {
        location.hash = composeHash(location);
        location.href = composeHref(location);
      }
      update(location.href);
    }
  }


  /**
   * If location has changed, update the browser
   * This method is called at the end of $eval() phase
   */
  function updateBrowser() {
    sync();

    if ($browser.getUrl() != location.href) {
      $browser.setUrl(location.href);
      copy(location, lastLocation);
    }
  }

  /**
   * Compose href string from a location object
   *
   * @param {Object} loc The location object with all properties
   * @return {string} Composed href
   */
  function composeHref(loc) {
    var url = toKeyValue(loc.search);
    var port = (loc.port == DEFAULT_PORTS[loc.protocol] ? null : loc.port);

    return loc.protocol  + '://' + loc.host +
          (port ? ':' + port : '') + loc.path +
          (url ? '?' + url : '') + (loc.hash ? '#' + loc.hash : '');
  }

  /**
   * Compose hash string from location object
   *
   * @param {Object} loc Object with hashPath and hashSearch properties
   * @return {string} Hash string
   */
  function composeHash(loc) {
    var hashSearch = toKeyValue(loc.hashSearch);
    //TODO: temporary fix for issue #158
    return escape(loc.hashPath).replace(/%21/gi, '!').replace(/%3A/gi, ':').replace(/%24/gi, '$') +
          (hashSearch ? '?' + hashSearch : '');
  }

  /**
   * Parse href string into location object
   *
   * @param {string} href
   * @return {Object} The location object
   */
  function parseHref(href) {
    var loc = {};
    var match = URL_MATCH.exec(href);

    if (match) {
      loc.href = href.replace(/#$/, '');
      loc.protocol = match[1];
      loc.host = match[3] || '';
      loc.port = match[5] || DEFAULT_PORTS[loc.protocol] || null;
      loc.path = match[6] || '';
      loc.search = parseKeyValue(match[8]);
      loc.hash = match[10] || '';

      extend(loc, parseHash(loc.hash));
    }

    return loc;
  }

  /**
   * Parse hash string into object
   *
   * @param {string} hash
   */
  function parseHash(hash) {
    var h = {};
    var match = HASH_MATCH.exec(hash);

    if (match) {
      h.hash = hash;
      h.hashPath = unescape(match[1] || '');
      h.hashSearch = parseKeyValue(match[3]);
    }

    return h;
  }
}, ['$browser']);
