var URL_MATCH = /^(file|ftp|http|https):\/\/(\w+:{0,1}\w*@)?([\w\.-]*)(:([0-9]+))?(\/[^\?#]*)?(\?([^#]*))?(#(.*))?$/,
    HASH_MATCH = /^([^\?]*)?(\?([^\?]*))?$/,
    DEFAULT_PORTS = {'http': 80, 'https': 443, 'ftp':21},
    EAGER = true;

function angularServiceInject(name, fn, inject, eager) {
  angularService(name, fn, {$inject:inject, $eager:eager});
}

/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$window
 * 
 * @description
 * Is reference to the browser's <b>window</b> object. While <b>window</b>
 * is globally available in JavaScript, it causes testability problems, because
 * it is a global variable. In <b><angular/></b> we always refer to it through the
 * $window service, so it may be overriden, removed or mocked for testing.
 * 
 * All expressions are evaluated with respect to current scope so they don't
 * suffer from window globality.
 * 
 * @example
   <input ng:init="greeting='Hello World!'" type="text" name="greeting" />
   <button ng:click="$window.alert(greeting)">ALERT</button>
 */
angularServiceInject("$window", bind(window, identity, window), [], EAGER);

/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$document
 * @requires $window
 * 
 * @description
 * Reference to the browser window.document, but wrapped into angular.element().
 */
angularServiceInject("$document", function(window){
  return jqLite(window.document);
}, ['$window'], EAGER);

/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$location
 * @requires $browser
 * 
 * @property {string} href
 * @property {string} protocol
 * @property {string} host
 * @property {number} port
 * @property {string} path
 * @property {Object.<string|boolean>} search
 * @property {string} hash
 * @property {string} hashPath
 * @property {Object.<string|boolean>} hashSearch
 * 
 * @description
 * Parses the browser location url and makes it available to your application.
 * Any changes to the url are reflected into $location service and changes to
 * $location are reflected to url.
 * Notice that using browser's forward/back buttons changes the $location.
 * 
 * @example
   <a href="#">clear hash</a> | 
   <a href="#myPath?name=misko">test hash</a><br/>
   <input type='text' name="$location.hash"/>
   <pre>$location = {{$location}}</pre>
 */
angularServiceInject("$location", function($browser) {
  var scope = this,
      location = {toString:toString, update:update, updateHash: updateHash},
      lastBrowserUrl = $browser.getUrl(),
      lastLocationHref,
      lastLocationHash;

  $browser.onHashChange(function() {
    update(lastBrowserUrl = $browser.getUrl());
    updateLastLocation();
    scope.$eval();
  });

  this.$onEval(PRIORITY_FIRST, updateBrowser);
  this.$onEval(PRIORITY_LAST, updateBrowser);

  update(lastBrowserUrl);
  updateLastLocation();

  return location;

  // PUBLIC METHODS

  /**
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$location#update
   * @methodOf angular.service.$location
   * 
   * @description
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
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$location#updateHash
   * @methodOf angular.service.$location
   * 
   * @description
   * Update location hash part
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
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$location#toString
   * @methodOf angular.service.$location
   * 
   * @description
   * Returns string representation - href
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
   * Update information about last location
   */
  function updateLastLocation() {
    lastLocationHref = location.href;
    lastLocationHash = location.hash;
  }

  /**
   * If location has changed, update the browser
   * This method is called at the end of $eval() phase
   */
  function updateBrowser() {
    updateLocation();

    if (location.href != lastLocationHref) {    	
      $browser.setUrl(lastBrowserUrl = location.href);
      updateLastLocation();
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
}, ['$browser']);


/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$log
 * @requires $window
 * 
 * @description
 * Is simple service for logging. Default implementation writes the message
 * into the browser's console (if present).
 * 
 * This is useful for debugging.
 * 
 * @example
   <p>Reload this page with open console, enter text and hit the log button...</p>
   Message:
   <input type="text" name="message" value="Hello World!"/>
   <button ng:click="$log.log(message)">log</button>
   <button ng:click="$log.warn(message)">warn</button>
   <button ng:click="$log.info(message)">info</button>
   <button ng:click="$log.error(message)">error</button>
 */
angularServiceInject("$log", function($window){
  return {
    /**
     * @workInProgress
     * @ngdoc method
     * @name angular.service.$log#log
     * @methodOf angular.service.$log
     * 
     * @description
     * Write a log message
     */
    log: consoleLog('log'),
    
    /**
     * @workInProgress
     * @ngdoc method
     * @name angular.service.$log#warn
     * @methodOf angular.service.$log
     * 
     * @description
     * Write a warning message
     */
    warn: consoleLog('warn'),
    
    /**
     * @workInProgress
     * @ngdoc method
     * @name angular.service.$log#info
     * @methodOf angular.service.$log
     * 
     * @description
     * Write an information message
     */
    info: consoleLog('info'),
    
    /**
     * @workInProgress
     * @ngdoc method
     * @name angular.service.$log#error
     * @methodOf angular.service.$log
     * 
     * @description
     * Write an error message
     */
    error: consoleLog('error')
  };
  
  function consoleLog(type) {
    var console = $window.console || {};
    var logFn = console[type] || console.log || noop;
    if (logFn.apply) {
      return function(){
        var args = [];
        forEach(arguments, function(arg){
          args.push(formatError(arg));
        });
        return logFn.apply(console, args);
      };
    } else {
      // we are IE, in which case there is nothing we can do
      return logFn;
    }
  }
}, ['$window'], EAGER);

/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$exceptionHandler
 * @requires $log
 * 
 * @description
 * Any uncaught exception in <angular/> is delegated to this service.
 * The default implementation simply delegates to $log.error which logs it into
 * the browser console.
 * 
 * When unit testing it is useful to have uncaught exceptions propagate
 * to the test so the test will fail rather than silently log the exception
 * to the browser console. For this purpose you can override this service with
 * a simple rethrow. 
 * 
 * @example
 */
angularServiceInject('$exceptionHandler', function($log){
  return function(e) {
    $log.error(e);
  };
}, ['$log'], EAGER);

/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$updateView
 * @requires $browser
 *
 * @description
 * Calling `$updateView` enqueues the eventual update of the view. (Update the DOM to reflect the
 * model). The update is eventual, since there are often multiple updates to the model which may
 * be deferred. The default update delayed is 25 ms. This means that the view lags the model by
 * that time. (25ms is small enough that it is perceived as instantaneous by the user). The delay
 * can be adjusted by setting the delay property of the service.
 *
 * <pre>angular.service('$updateView').delay = 10</pre>
 *
 * The delay is there so that multiple updates to the model which occur sufficiently close
 * together can be merged into a single update.
 *
 * You don't usually call '$updateView' directly since angular does it for you in most cases,
 * but there are some cases when you need to call it.
 *
 *  - `$updateView()` called automatically by angular:
 *    - Your Application Controllers: Your controller code is called by angular and hence
 *      angular is aware that you may have changed the model.
 *    - Your Services: Your service is usually called by your controller code, hence same rules
 *      apply.
 *  - May need to call `$updateView()` manually:
 *    - Widgets / Directives: If you listen to any DOM events or events on any third party
 *      libraries, then angular is not aware that you may have changed state state of the
 *      model, and hence you need to call '$updateView()' manually.
 *    - 'setTimeout'/'XHR':  If you call 'setTimeout' (instead of {@link angular.service.$defer})
 *      or 'XHR' (instead of {@link angular.service.$xhr}) then you may be changing the model
 *      without angular knowledge and you may need to call '$updateView()' directly.
 *
 * NOTE: if you wish to update the view immediately (without delay), you can do so by calling
 * {@link scope.$eval} at any time from your code:
 * <pre>scope.$root.$eval()</pre>
 *
 * In unit-test mode the update is instantaneous and synchronous to simplify writing tests.
 *
 */

function serviceUpdateViewFactory($browser){
  var rootScope = this;
  var scheduled;
  function update(){
    scheduled = false;
    rootScope.$eval();
  }
  return $browser.isMock ? update : function(){
    if (!scheduled) {
      scheduled = true;
      $browser.defer(update, serviceUpdateViewFactory.delay);
    }
  };
}
serviceUpdateViewFactory.delay = 25;

angularServiceInject('$updateView', serviceUpdateViewFactory, ['$browser']);

/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$hover
 * @requires $browser
 * @requires $document
 * 
 * @description
 * 
 * @example
 */
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

/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$invalidWidgets
 * 
 * @description
 * Keeps references to all invalid widgets found during validation.
 * Can be queried to find whether there are any invalid widgets currently displayed.
 * 
 * @example
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
    forEach(invalidWidgets, function(widget){
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
}, [], EAGER);



function switchRouteMatcher(on, when, dstName) {
  var regex = '^' + when.replace(/[\.\\\(\)\^\$]/g, "\$1") + '$',
      params = [],
      dst = {};
  forEach(when.split(/\W/), function(param){
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
    forEach(params, function(name, index){
      dst[name] = match[index + 1];
    });
    if (dstName) this.$set(dstName, dst);
  }
  return match ? dst : _null;
}

/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$route
 * @requires $location
 * 
 * @property {Object} current Name of the current route
 * @property {Array.<Object>} routes List of configured routes
 * 
 * @description
 * Watches $location.hashPath and tries to map the hash to an existing route
 * definition. It is used for deep-linking URLs to controllers and views (HTML partials).
 * 
 * $route is typically used in conjunction with ng:include widget. 
 * 
 * @example
<p>
	This example shows how changing the URL hash causes the <tt>$route</tt>
	to match a route against the URL, and the <tt>[[ng:include]]</tt> pulls in the partial.
	Try changing the URL in the input box to see changes.
</p>
   
<script>
	angular.service('myApp', function($route) {
	  $route.when('/Book/:bookId', {template:'rsrc/book.html', controller:BookCntl});
	  $route.when('/Book/:bookId/ch/:chapterId', {template:'rsrc/chapter.html', controller:ChapterCntl});
	  $route.onChange(function() {
	    $route.current.scope.params = $route.current.params;
	  });
	}, {$inject: ['$route']});
	
	function BookCntl() {
	  this.name = "BookCntl";
	}
	
	function ChapterCntl() {
	  this.name = "ChapterCntl";
	}
</script>

Chose: 
<a href="#/Book/Moby">Moby</a> | 
<a href="#/Book/Moby/ch/1">Moby: Ch1</a> | 
<a href="#/Book/Gatsby">Gatsby</a> | 
<a href="#/Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a><br/>
<input type="text" name="$location.hashPath" size="80" />
<pre>$location={{$location}}</pre>
<pre>$route.current.template={{$route.current.template}}</pre>
<pre>$route.current.params={{$route.current.params}}</pre>
<pre>$route.current.scope.name={{$route.current.scope.name}}</pre>
<hr/>
<ng:include src="$route.current.template" scope="$route.current.scope"/>
 */
angularServiceInject('$route', function(location) {
  var routes = {},
      onChange = [],
      matcher = switchRouteMatcher,
      parentScope = this,
      dirty = 0,
      $route = {
        routes: routes,
        
        /**
         * @workInProgress
         * @ngdoc method
         * @name angular.service.$route#onChange
         * @methodOf angular.service.$route
         * 
         * @param {function()} fn Function that will be called on route change
         * 
         * @description
         * Register a handler function that will be called when route changes
         */
        onChange: bind(onChange, onChange.push),
        
        /**
         * @workInProgress
         * @ngdoc method
         * @name angular.service.$route#when
         * @methodOf angular.service.$route
         * 
         * @param {string} path Route path (matched against $location.hash)
         * @param {Object} params Mapping information to be assigned to `$route.current` on route
         *    match.
         * @returns {Object} route object
         * 
         * @description
         * Add new route
         */
        when:function (path, params) {
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
    angular.forEach(routes, function(routeParams, route) {
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
    angular.forEach(onChange, parentScope.$tryEval);
    if (childScope) {
      childScope.$become($route.current.controller);
    }
  }
  this.$watch(function(){return dirty + location.hash;}, updateRoute);
  return $route;
}, ['$location']);

/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$xhr
 * @requires $browser
 * @requires $xhr.error
 * @requires $log
 * 
 * @description
 * 
 * @example
 */
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
          response = fromJson(response, true);
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

/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$xhr.error
 * @requires $log
 * 
 * @description
 * 
 * @example
 */
angularServiceInject('$xhr.error', function($log){
  return function(request, response){
    $log.error('ERROR: XHR: ' + request.url, request, response);
  };
}, ['$log']);

/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$xhr.bulk
 * @requires $xhr
 * @requires $xhr.error
 * @requires $log
 * 
 * @description
 * 
 * @example
 */
angularServiceInject('$xhr.bulk', function($xhr, $error, $log){
  var requests = [],
      scope = this;
  function bulkXHR(method, url, post, callback) {
    if (isFunction(post)) {
      callback = post;
      post = _null;
    }
    var currentQueue;
    forEach(bulkXHR.urls, function(queue){
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
    forEach(bulkXHR.urls, function(queue, url){
      var currentRequests = queue.requests;
      if (currentRequests && currentRequests.length) {
        queue.requests = [];
        queue.callbacks = [];
        $xhr('POST', url, {requests:currentRequests}, function(code, response){
          forEach(response, function(response, i){
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


/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$defer
 * @requires $browser
 * @requires $log
 *
 * @description
 * Delegates to {@link angular.service.$browser.defer $browser.defer}, but wraps the `fn` function
 * into a try/catch block and delegates any exceptions to
 * {@link angular.services.$exceptionHandler $exceptionHandler} service.
 *
 * In tests you can use `$browser.defer.flush()` to flush the queue of deferred functions.
 *
 * @param {function()} fn A function, who's execution should be deferred.
 */
angularServiceInject('$defer', function($browser, $exceptionHandler, $updateView) {
  var scope = this;

  return function(fn) {
    $browser.defer(function() {
      try {
        fn();
      } catch(e) {
        $exceptionHandler(e);
      } finally {
        $updateView();
      }
    });
  };
}, ['$browser', '$exceptionHandler', '$updateView']);


/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$xhr.cache
 * @requires $xhr
 * 
 * @description
 * 
 * @example
 */
angularServiceInject('$xhr.cache', function($xhr, $defer){
  var inflight = {}, self = this;
  function cache(method, url, post, callback, verifyCache){
    if (isFunction(post)) {
      callback = post;
      post = _null;
    }
    if (method == 'GET') {
      var data, dataCached;
      if (dataCached = cache.data[url]) {
        $defer(function() { callback(200, copy(dataCached.value)); });
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
          forEach(callbacks, function(callback){
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
}, ['$xhr.bulk', '$defer']);


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.service.$resource
 * @requires $xhr
 *
 * @description
 * Is a factory which creates a resource object which lets you interact with 
 * <a href="http://en.wikipedia.org/wiki/Representational_State_Transfer" target="_blank">RESTful</a>
 * server-side data sources.
 * Resource object has action methods which provide high-level behaviors without
 * the need to interact with the low level $xhr or XMLHttpRequest().
 *
 * <pre>
     // Define CreditCard class
     var CreditCard = $resource('/user/:userId/card/:cardId',
      {userId:123, cardId:'@id'}, {
       charge: {method:'POST', params:{charge:true}}
      });

     // We can retrieve a collection from the server
     var cards = CreditCard.query();
     // GET: /user/123/card
     // server returns: [ {id:456, number:'1234', name:'Smith'} ];

     var card = cards[0];
     // each item is an instance of CreditCard
     expect(card instanceof CreditCard).toEqual(true);
     card.name = "J. Smith";
     // non GET methods are mapped onto the instances
     card.$save();
     // POST: /user/123/card/456 {id:456, number:'1234', name:'J. Smith'}
     // server returns: {id:456, number:'1234', name: 'J. Smith'};

     // our custom method is mapped as well.
     card.$charge({amount:9.99});
     // POST: /user/123/card/456?amount=9.99&charge=true {id:456, number:'1234', name:'J. Smith'}
     // server returns: {id:456, number:'1234', name: 'J. Smith'};

     // we can create an instance as well
     var newCard = new CreditCard({number:'0123'});
     newCard.name = "Mike Smith";
     newCard.$save();
     // POST: /user/123/card {number:'0123', name:'Mike Smith'}
     // server returns: {id:789, number:'01234', name: 'Mike Smith'};
     expect(newCard.id).toEqual(789);
 * </pre>
 *
 * The object returned from this function execution is a resource "class" which has "static" method
 * for each action in the definition.
 *
 * Calling these methods invoke `$xhr` on the `url` template with the given `method` and `params`.
 * When the data is returned from the server then the object is an instance of the resource type and
 * all of the non-GET methods are available with `$` prefix. This allows you to easily support CRUD
 * operations (create, read, update, delete) on server-side data.

   <pre>
     var User = $resource('/user/:userId', {userId:'@id'});
     var user = User.get({userId:123}, function(){
       user.abc = true;
       user.$save();
     });
   </pre>
 *
 *     It's worth noting that the callback for `get`, `query` and other method gets passed in the
 *     response that came from the server, so one could rewrite the above example as:
 *
   <pre>
     var User = $resource('/user/:userId', {userId:'@id'});
     User.get({userId:123}, function(u){
       u.abc = true;
       u.$save();
     });
   </pre>
 *
 *
 * @param {string} url A parameterized URL template with parameters prefixed by `:` as in
 *     `/user/:username`.
 * @param {Object=} paramDefaults Default values for `url` parameters. These can be overridden in
 *     `actions` methods.
 * @param {Object.<Object>=} actions Map of actions available for the resource.
 *
 *     Each resource comes preconfigured with `get`, `save`, `query`, `remove`, and `delete` to
 *     mimic the RESTful philosophy.
 *
 *     To create your own actions, pass in a map keyed on action names (e.g. `'charge'`) with
 *     elements consisting of these properties:
 *
 *     - `{string} method`:  Request method type. Valid methods are: `GET`, `POST`, `PUT`, `DELETE`,
 *        and [`JSON`](http://en.wikipedia.org/wiki/JSON#JSONP) (also known as JSONP).
 *     - `{Object=} params`: Set of pre-bound parameters for the action.
 *     - `{boolean=} isArray`: If true then the returned object for this action is an array, see the
 *       pre-binding section.
 *     - `{boolean=} verifyCache`: If true then items returned from cache, are double checked by
 *       running the query again and updating the resource asynchroniously.
 *
 *     Each service comes preconfigured with the following overridable actions:
 *     <pre>
 *       { 'get':    {method:'GET'},
           'save':   {method:'POST'},
           'query':  {method:'GET', isArray:true},
           'remove': {method:'DELETE'},
           'delete': {method:'DELETE'} };
 *     </pre>
 *
 * @returns {Object} A resource "class".
 *
 * @example
   <script>
     function BuzzController($resource) {
       this.Activity = $resource(
         'https://www.googleapis.com/buzz/v1/activities/:userId/:visibility/:activityId/:comments',
         {alt:'json', callback:'JSON_CALLBACK'},
         {get:{method:'JSON', params:{visibility:'@self'}}, replies: {method:'JSON', params:{visibility:'@self', comments:'@comments'}}}
       );
     }
     
     BuzzController.prototype = {
       fetch: function() {
         this.activities = this.Activity.get({userId:this.userId});
       },
       expandReplies: function(activity) {
         activity.replies = this.Activity.replies({userId:this.userId, activityId:activity.id});
       }
     };
     BuzzController.$inject = ['$resource'];
   </script>

   <div ng:controller="BuzzController">
     <input name="userId" value="googlebuzz"/>
     <button ng:click="fetch()">fetch</button>
     <hr/>
     <div ng:repeat="item in activities.data.items">
       <h1 style="font-size: 15px;">
	       <img src="{{item.actor.thumbnailUrl}}" style="max-height:30px;max-width:30px;"/>
	       <a href="{{item.actor.profileUrl}}">{{item.actor.name}}</a>
	       <a href ng:click="expandReplies(item)" style="float: right;">Expand replies: {{item.links.replies[0].count}}</a>
       </h1>
       {{item.object.content | html}}
       <div ng:repeat="reply in item.replies.data.items" style="margin-left: 20px;">
         <img src="{{reply.actor.thumbnailUrl}}" style="max-height:30px;max-width:30px;"/>
         <a href="{{reply.actor.profileUrl}}">{{reply.actor.name}}</a>: {{reply.content | html}}
       </div>
     </div>
   </div>
 */
angularServiceInject('$resource', function($xhr){
  var resource = new ResourceFactory($xhr);
  return bind(resource, resource.route);
}, ['$xhr.cache']);

/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$cookies
 * @requires $browser
 * 
 * @description
 * Provides read/write access to browser's cookies.
 * 
 * Only a simple Object is exposed and by adding or removing properties to/from
 * this object, new cookies are created/deleted at the end of current $eval.
 * 
 * @example
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
}, ['$browser']);

/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$cookieStore
 * @requires $cookies
 * 
 * @description
 * Provides a key-value (string-object) storage, that is backed by session cookies.
 * Objects put or retrieved from this storage are automatically serialized or
 * deserialized by angular's toJson/fromJson.
 * @example
 */
angularServiceInject('$cookieStore', function($store) {

  return {
    /**
     * @workInProgress
     * @ngdoc method
     * @name angular.service.$cookieStore#get
     * @methodOf angular.service.$cookieStore
     * 
     * @description
     * Returns the value of given cookie key
     * 
     * @param {string} key Id to use for lookup.
     * @returns {Object} Deserialized cookie value.
     */
    get: function(key) {
      return fromJson($store[key]);
    },

    /**
     * @workInProgress
     * @ngdoc method
     * @name angular.service.$cookieStore#put
     * @methodOf angular.service.$cookieStore
     * 
     * @description
     * Sets a value for given cookie key
     * 
     * @param {string} key Id for the `value`.
     * @param {Object} value Value to be stored.
     */
    put: function(key, value) {
      $store[key] = toJson(value);
    },

    /**
     * @workInProgress
     * @ngdoc method
     * @name angular.service.$cookieStore#remove
     * @methodOf angular.service.$cookieStore
     * 
     * @description
     * Remove given cookie
     * 
     * @param {string} key Id of the key-value pair to delete.
     */
    remove: function(key) {
      delete $store[key];
    }
  };

}, ['$cookies']);
