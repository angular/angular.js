var URL_MATCH = /^(file|ftp|http|https):\/\/(\w+:{0,1}\w*@)?([\w\.-]*)(:([0-9]+))?(\/[^\?#]*)?(\?([^#]*))?(#(.*))?$/,
    HASH_MATCH = /^([^\?]*)?(\?([^\?]*))?$/,
    DEFAULT_PORTS = {'http': 80, 'https': 443, 'ftp':21},
    EAGER = 'eager',
    EAGER_PUBLISHED = EAGER + '-published';

function angularServiceInject(name, fn, inject, eager) {
  angularService(name, fn, {$inject:inject, $creation:eager});
}

angularServiceInject("$window", bind(window, identity, window), [], EAGER_PUBLISHED);
angularServiceInject("$document", function(window){
  return jqLite(window.document);
}, ['$window'], EAGER_PUBLISHED);

angularServiceInject("$location", function(browser) {
  var scope = this,
      location = {toString:toString, update:update, updateHash: updateHash},
      lastLocationHref = browser.getUrl(),
      lastLocationHash;

  browser.addPollFn(function(){
    if (lastLocationHref !== browser.getUrl()) {
      update(lastLocationHref = browser.getUrl());
      scope.$eval();
    }
  });

  this.$onEval(PRIORITY_FIRST, updateBrowser);
  this.$onEval(PRIORITY_LAST, updateBrowser);

  update(lastLocationHref);
  lastLocationHash = location.hash;

  return location;

  // PUBLIC METHODS

  /**
   * Update location object
   * Does not immediately update the browser
   * Browser is updated at the end of $eval()
   *
   * @example
   * scope.$location.update('http://www.angularjs.org/path#hash?search=x');
   * scope.$location.update({host: 'www.google.com', protocol: 'https'});
   * scope.$location.update({hashPath: '/path', hashSearch: {a: 'b', x: true}});
   *
   * @param {(string|Object)} href Full href as a string or hash object with properties
   */
  function update(href) {
    if (isString(href)) {
      extend(location, parseHref(href));
    } else {
      if (isDefined(href.hash)) {
        extend(href, parseHash(href.hash));
      }

      extend(location, href);

      if (isDefined(href.hashPath || href.hashSearch)) {
        location.hash = composeHash(location);
      }

      location.href = composeHref(location);
    }
  }

  /**
   * Update location hash
   * @see update()
   *
   * @example
   * scope.$location.updateHash('/hp')
   *   ==> update({hashPath: '/hp'})
   *
   * scope.$location.updateHash({a: true, b: 'val'})
   *   ==> update({hashSearch: {a: true, b: 'val'}})
   *
   * scope.$location.updateHash('/hp', {a: true})
   *   ==> update({hashPath: '/hp', hashSearch: {a: true}})
   *
   * @param {(string|Object)} path A hashPath or hashSearch object
   * @param {Object=} search A hashSearch object
   */
  function updateHash(path, search) {
    var hash = {};

    if (isString(path)) {
      hash.hashPath = path;
      if (isDefined(search))
        hash.hashSearch = search;
    } else
      hash.hashSearch = path;

    update(hash);
  }

  /**
   * Returns string representation - href
   *
   * @return {string} Location's href property
   */
  function toString() {
    updateLocation();
    return location.href;
  }

  // INNER METHODS

  /**
   * Update location object
   *
   * User is allowed to change properties, so after property change,
   * location object is not in consistent state.
   *
   * @example
   * scope.$location.href = 'http://www.angularjs.org/path#a/b'
   * immediately after this call, other properties are still the old ones...
   *
   * This method checks the changes and update location to the consistent state
   */
  function updateLocation() {
    if (location.href == lastLocationHref) {
      if (location.hash == lastLocationHash) {
        location.hash = composeHash(location);
      }
      location.href = composeHref(location);
    }
    update(location.href);
  }

  /**
   * If location has changed, update the browser
   * This method is called at the end of $eval() phase
   */
  function updateBrowser() {
    updateLocation();

    if (location.href != lastLocationHref) {
      browser.setUrl(lastLocationHref = location.href);
      lastLocationHash = location.hash;
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
    var port = (loc.port == DEFAULT_PORTS[loc.protocol] ? _null : loc.port);

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
    return escape(loc.hashPath) + (hashSearch ? '?' + hashSearch : '');
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
      loc.href = href.replace('#$', '');
      loc.protocol = match[1];
      loc.host = match[3] || '';
      loc.port = match[5] || DEFAULT_PORTS[loc.protocol] || _null;
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
}, ['$browser'], EAGER_PUBLISHED);


angularServiceInject("$log", function($window){
  var console = $window.console || {log: noop, warn: noop, info: noop, error: noop},
      log = console.log || noop;
  return {
    log: bind(console, log),
    warn: bind(console, console.warn || log),
    info: bind(console, console.info || log),
    error: bind(console, console.error || log)
  };
}, ['$window'], EAGER_PUBLISHED);

angularServiceInject('$exceptionHandler', function($log){
  return function(e) {
    $log.error(e);
  };
}, ['$log'], EAGER_PUBLISHED);

angularServiceInject("$hover", function(browser, document) {
  var tooltip, self = this, error, width = 300, arrowWidth = 10, body = jqLite(document[0].body);
  browser.hover(function(element, show){
    if (show && (error = element.attr(NG_EXCEPTION) || element.attr(NG_VALIDATION_ERROR))) {
      if (!tooltip) {
        tooltip = {
            callout: jqLite('<div id="ng-callout"></div>'),
            arrow: jqLite('<div></div>'),
            title: jqLite('<div class="ng-title"></div>'),
            content: jqLite('<div class="ng-content"></div>')
        };
        tooltip.callout.append(tooltip.arrow);
        tooltip.callout.append(tooltip.title);
        tooltip.callout.append(tooltip.content);
        body.append(tooltip.callout);
      }
      var docRect = body[0].getBoundingClientRect(),
          elementRect = element[0].getBoundingClientRect(),
          leftSpace = docRect.right - elementRect.right - arrowWidth;
      tooltip.title.text(element.hasClass("ng-exception") ? "EXCEPTION:" : "Validation error...");
      tooltip.content.text(error);
      if (leftSpace < width) {
        tooltip.arrow.addClass('ng-arrow-right');
        tooltip.arrow.css({left: (width + 1)+'px'});
        tooltip.callout.css({
          position: 'fixed',
          left: (elementRect.left - arrowWidth - width - 4) + "px",
          top: (elementRect.top - 3) + "px",
          width: width + "px"
        });
      } else {
        tooltip.arrow.addClass('ng-arrow-left');
        tooltip.callout.css({
          position: 'fixed',
          left: (elementRect.right + arrowWidth) + "px",
          top: (elementRect.top - 3) + "px",
          width: width + "px"
        });
      }
    } else if (tooltip) {
      tooltip.callout.remove();
      tooltip = _null;
    }
  });
}, ['$browser', '$document'], EAGER);


/* Keeps references to all invalid widgets found during validation. Can be queried to find if there
 * are invalid widgets currently displayed
 */
angularServiceInject("$invalidWidgets", function(){
  var invalidWidgets = [];


  /** Remove an element from the array of invalid widgets */
  invalidWidgets.markValid = function(element){
    var index = indexOf(invalidWidgets, element);
    if (index != -1)
      invalidWidgets.splice(index, 1);
  };


  /** Add an element to the array of invalid widgets */
  invalidWidgets.markInvalid = function(element){
    var index = indexOf(invalidWidgets, element);
    if (index === -1)
      invalidWidgets.push(element);
  };


  /** Return count of all invalid widgets that are currently visible */
  invalidWidgets.visible = function() {
    var count = 0;
    foreach(invalidWidgets, function(widget){
      count = count + (isVisible(widget) ? 1 : 0);
    });
    return count;
  };


  /* At the end of each eval removes all invalid widgets that are not part of the current DOM. */
  this.$onEval(PRIORITY_LAST, function() {
    for(var i = 0; i < invalidWidgets.length;) {
      var widget = invalidWidgets[i];
      if (isOrphan(widget[0])) {
        invalidWidgets.splice(i, 1);
        if (widget.dealoc) widget.dealoc();
      } else {
        i++;
      }
    }
  });


  /**
   * Traverses DOM element's (widget's) parents and considers the element to be an orphant if one of
   * it's parents isn't the current window.document.
   */
  function isOrphan(widget) {
    if (widget == window.document) return false;
    var parent = widget.parentNode;
    return !parent || isOrphan(parent);
  }

  return invalidWidgets;
}, [], EAGER_PUBLISHED);



function switchRouteMatcher(on, when, dstName) {
  var regex = '^' + when.replace(/[\.\\\(\)\^\$]/g, "\$1") + '$',
      params = [],
      dst = {};
  foreach(when.split(/\W/), function(param){
    if (param) {
      var paramRegExp = new RegExp(":" + param + "([\\W])");
      if (regex.match(paramRegExp)) {
        regex = regex.replace(paramRegExp, "([^\/]*)$1");
        params.push(param);
      }
    }
  });
  var match = on.match(new RegExp(regex));
  if (match) {
    foreach(params, function(name, index){
      dst[name] = match[index + 1];
    });
    if (dstName) this.$set(dstName, dst);
  }
  return match ? dst : _null;
}

angularServiceInject('$route', function(location){
  var routes = {},
      onChange = [],
      matcher = switchRouteMatcher,
      parentScope = this,
      dirty = 0,
      $route = {
        routes: routes,
        onChange: bind(onChange, onChange.push),
        when:function (path, params){
          if (angular.isUndefined(path)) return routes;
          var route = routes[path];
          if (!route) route = routes[path] = {};
          if (params) angular.extend(route, params);
          dirty++;
          return route;
        }
      };
  function updateRoute(){
    var childScope;
    $route.current = _null;
    angular.foreach(routes, function(routeParams, route) {
      if (!childScope) {
        var pathParams = matcher(location.hashPath, route);
        if (pathParams) {
          childScope = angular.scope(parentScope);
          $route.current = angular.extend({}, routeParams, {
            scope: childScope,
            params: angular.extend({}, location.hashSearch, pathParams)
          });
        }
      }
    });
    angular.foreach(onChange, parentScope.$tryEval);
    if (childScope) {
      childScope.$become($route.current.controller);
    }
  }
  this.$watch(function(){return dirty + location.hash;}, updateRoute);
  return $route;
}, ['$location'], EAGER_PUBLISHED);

angularServiceInject('$xhr', function($browser, $error, $log){
  var self = this;
  return function(method, url, post, callback){
    if (isFunction(post)) {
      callback = post;
      post = _null;
    }
    if (post && isObject(post)) {
      post = toJson(post);
    }
    $browser.xhr(method, url, post, function(code, response){
      try {
        if (isString(response) && /^\s*[\[\{]/.exec(response) && /[\}\]]\s*$/.exec(response)) {
          response = fromJson(response);
        }
        if (code == 200) {
          callback(code, response);
        } else {
          $error(
            {method: method, url:url, data:post, callback:callback},
            {status: code, body:response});
        }
      } catch (e) {
        $log.error(e);
      } finally {
        self.$eval();
      }
    });
  };
}, ['$browser', '$xhr.error', '$log']);

angularServiceInject('$xhr.error', function($log){
  return function(request, response){
    $log.error('ERROR: XHR: ' + request.url, request, response);
  };
}, ['$log']);

angularServiceInject('$xhr.bulk', function($xhr, $error, $log){
  var requests = [],
      scope = this;
  function bulkXHR(method, url, post, callback) {
    if (isFunction(post)) {
      callback = post;
      post = _null;
    }
    var currentQueue;
    foreach(bulkXHR.urls, function(queue){
      if (isFunction(queue.match) ? queue.match(url) : queue.match.exec(url)) {
        currentQueue = queue;
      }
    });
    if (currentQueue) {
      if (!currentQueue.requests) currentQueue.requests = [];
      currentQueue.requests.push({method: method, url: url, data:post, callback:callback});
    } else {
      $xhr(method, url, post, callback);
    }
  }
  bulkXHR.urls = {};
  bulkXHR.flush = function(callback){
    foreach(bulkXHR.urls, function(queue, url){
      var currentRequests = queue.requests;
      if (currentRequests && currentRequests.length) {
        queue.requests = [];
        queue.callbacks = [];
        $xhr('POST', url, {requests:currentRequests}, function(code, response){
          foreach(response, function(response, i){
            try {
              if (response.status == 200) {
                (currentRequests[i].callback || noop)(response.status, response.response);
              } else {
                $error(currentRequests[i], response);
              }
            } catch(e) {
              $log.error(e);
            }
          });
          (callback || noop)();
        });
        scope.$eval();
      }
    });
  };
  this.$onEval(PRIORITY_LAST, bulkXHR.flush);
  return bulkXHR;
}, ['$xhr', '$xhr.error', '$log']);

angularServiceInject('$xhr.cache', function($xhr){
  var inflight = {}, self = this;
  function cache(method, url, post, callback, verifyCache){
    if (isFunction(post)) {
      callback = post;
      post = _null;
    }
    if (method == 'GET') {
      var data;
      if (data = cache.data[url]) {
        callback(200, copy(data.value));
        if (!verifyCache)
          return;
      }

      if (data = inflight[url]) {
        data.callbacks.push(callback);
      } else {
        inflight[url] = {callbacks: [callback]};
        cache.delegate(method, url, post, function(status, response){
          if (status == 200)
            cache.data[url] = { value: response };
          var callbacks = inflight[url].callbacks;
          delete inflight[url];
          foreach(callbacks, function(callback){
            try {
              (callback||noop)(status, copy(response));
            } catch(e) {
              self.$log.error(e);
            }
          });
        });
      }

    } else {
      cache.data = {};
      cache.delegate(method, url, post, callback);
    }
  }
  cache.data = {};
  cache.delegate = $xhr;
  return cache;
}, ['$xhr.bulk']);

angularServiceInject('$resource', function($xhr){
  var resource = new ResourceFactory($xhr);
  return bind(resource, resource.route);
}, ['$xhr.cache']);


/**
 * $cookies service provides read/write access to the browser cookies. Currently only session
 * cookies are supported.
 *
 * Only a simple Object is exposed and by adding or removing properties to/from this object, new
 * cookies are created or deleted from the browser at the end of the current eval.
 */
angularServiceInject('$cookies', function($browser) {
  var rootScope = this,
      cookies = {},
      lastCookies = {},
      lastBrowserCookies;

  //creates a poller fn that copies all cookies from the $browser to service & inits the service
  $browser.addPollFn(function() {
    var currentCookies = $browser.cookies();
    if (lastBrowserCookies != currentCookies) { //relies on browser.cookies() impl
      lastBrowserCookies = currentCookies;
      copy(currentCookies, lastCookies);
      copy(currentCookies, cookies);
      rootScope.$eval();
    }
  })();

  //at the end of each eval, push cookies
  this.$onEval(PRIORITY_LAST, push);

  return cookies;


  /**
   * Pushes all the cookies from the service to the browser and verifies if all cookies were stored.
   */
  function push(){
    var name,
        browserCookies,
        updated;

    //delete any cookies deleted in $cookies
    for (name in lastCookies) {
      if (isUndefined(cookies[name])) {
        $browser.cookies(name, _undefined);
      }
    }

    //update all cookies updated in $cookies
    for(name in cookies) {
      if (cookies[name] !== lastCookies[name]) {
        $browser.cookies(name, cookies[name]);
        updated = true;
      }
    }

    //verify what was actually stored
    if (updated){
      updated = !updated;
      browserCookies = $browser.cookies();

      for (name in cookies) {
        if (cookies[name] !== browserCookies[name]) {
          //delete or reset all cookies that the browser dropped from $cookies
          if (isUndefined(browserCookies[name])) {
            delete cookies[name];
          } else {
            cookies[name] = browserCookies[name];
          }
          updated = true;
        }

      }

      if (updated) {
        rootScope.$eval();
      }
    }
  }
}, ['$browser'], EAGER_PUBLISHED);


/**
 * $cookieStore provides a key-value (string-object) storage that is backed by session cookies.
 * Objects put or retrieved from this storage are automatically serialized or deserialized.
 */
angularServiceInject('$cookieStore', function($store) {

  return {
    get: function(/**string*/key) {
      return fromJson($store[key]);
    },

    put: function(/**string*/key, /**Object*/value) {
      $store[key] = toJson(value);
    },

    remove: function(/**string*/key) {
      delete $store[key];
    }
  };

}, ['$cookies']);
