var URL_MATCH = /^(file|ftp|http|https):\/\/(\w+:{0,1}\w*@)?([\w\.-]*)(:([0-9]+))?([^\?#]+)(\?([^#]*))?(#(.*))?$/,
    HASH_MATCH = /^([^\?]*)?(\?([^\?]*))?$/,
    DEFAULT_PORTS = {'http': 80, 'https': 443, 'ftp':21};

angularService("$window", bind(window, identity, window));
angularService("$document", function(window){
  return jqLite(window.document);
}, {inject:['$window']});

angularService("$location", function(browser){
  var scope = this,
      location = {parse:parseUrl, toString:toString, update:update},
      lastLocation = {};

  browser.watchUrl(function(url){
    update(url);
    scope.$root.$eval();
  });
  this.$onEval(PRIORITY_FIRST, update);
  this.$onEval(PRIORITY_LAST, update);
  update(browser.getUrl());
  return location;

  function update(href){
    if (href) {
      parseUrl(href);
    } else {
      href = check('href') || checkProtocol();
      var hash = check('hash');
      if (isUndefined(hash)) hash = checkHashPathSearch();
      if (isDefined(hash)) {
        href = (href || location.href).split('#')[0];
        href+= '#' + hash;
      }
      if (isDefined(href)) {
        parseUrl(href);
        browser.setUrl(href);
      }
    }
  }

  function check(param) {
    return lastLocation[param] == location[param] ? _undefined : location[param];
  }

  function checkProtocol(){
    if (lastLocation.protocol === location.protocol &&
        lastLocation.host === location.host &&
        lastLocation.port === location.port &&
        lastLocation.path === location.path &&
        equals(lastLocation.search, location.search))
      return _undefined;
    var url = toKeyValue(location.search);
    var port = (location.port == DEFAULT_PORTS[location.protocol] ? _null : location.port);
    return location.protocol  + '://' + location.host +
          (port ? ':' + port : '') + location.path +
          (url ? '?' + url : '');
  }

  function checkHashPathSearch(){
    if (lastLocation.hashPath === location.hashPath &&
        equals(lastLocation.hashSearch, location.hashSearch) )
      return _undefined;
    var url = toKeyValue(location.hashSearch);
    return escape(location.hashPath) + (url ? '?' + url : '');
  }

  function parseUrl(url){
    if (isDefined(url)) {
      var match = URL_MATCH.exec(url);
      if (match) {
        location.href = url.replace('#$', '');
        location.protocol = match[1];
        location.host = match[3] || '';
        location.port = match[5] || DEFAULT_PORTS[location.protocol] || _null;
        location.path = match[6];
        location.search = parseKeyValue(match[8]);
        location.hash = match[10] || '';
        match = HASH_MATCH.exec(location.hash);
        location.hashPath = unescape(match[1] || '');
        location.hashSearch = parseKeyValue(match[3]);

        copy(location, lastLocation);
      }
    }
  }

  function toString() {
    update();
    return location.href;
  }
}, {inject: ['$browser']});

angularService("$log", function($window){
  var console = $window.console || {log: noop, warn: noop, info: noop, error: noop},
      log = console.log || noop;
  return {
    log: bind(console, log),
    warn: bind(console, console.warn || log),
    info: bind(console, console.info || log),
    error: bind(console, console.error || log)
  };
}, {inject:['$window']});

angularService('$exceptionHandler', function($log){
  return function(e) {
    $log.error(e);
  };
}, {inject:['$log']});

angularService("$hover", function(browser, document) {
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
}, {inject:['$browser', '$document']});

angularService("$invalidWidgets", function(){
  var invalidWidgets = [];
  invalidWidgets.markValid = function(element){
    var index = indexOf(invalidWidgets, element);
    if (index != -1)
      invalidWidgets.splice(index, 1);
  };
  invalidWidgets.markInvalid = function(element){
    var index = indexOf(invalidWidgets, element);
    if (index === -1)
      invalidWidgets.push(element);
  };
  invalidWidgets.visible = function() {
    var count = 0;
    foreach(invalidWidgets, function(widget){
      count = count + (isVisible(widget) ? 1 : 0);
    });
    return count;
  };
  invalidWidgets.clearOrphans = function() {
    for(var i = 0; i < invalidWidgets.length;) {
      var widget = invalidWidgets[i];
      if (isOrphan(widget[0])) {
        invalidWidgets.splice(i, 1);
      } else {
        i++;
      }
    }
  };
  function isOrphan(widget) {
    if (widget == window.document) return false;
    var parent = widget.parentNode;
    return !parent || isOrphan(parent);
  }
  return invalidWidgets;
});

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

angularService('$route', function(location){
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
      parentScope.$tryEval(childScope.init);
    }
  }
  this.$watch(function(){return dirty + location.hash;}, updateRoute);
  return $route;
}, {inject: ['$location']});

angularService('$xhr', function($browser, $error, $log){
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
}, {inject:['$browser', '$xhr.error', '$log']});

angularService('$xhr.error', function($log){
  return function(request, response){
    $log.error('ERROR: XHR: ' + request.url, request, response);
  };
}, {inject:['$log']});

angularService('$xhr.bulk', function($xhr, $error, $log){
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
}, {inject:['$xhr', '$xhr.error', '$log']});

angularService('$xhr.cache', function($xhr){
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
}, {inject:['$xhr.bulk']});

angularService('$resource', function($xhr){
  var resource = new ResourceFactory($xhr);
  return bind(resource, resource.route);
}, {inject: ['$xhr.cache']});


angularService('$cookies', function($browser) {
  var cookies = {}, rootScope = this;
  $browser.watchCookies(function(newCookies){
    copy(newCookies, cookies);
    rootScope.$eval();
  });
  this.$onEval(PRIORITY_FIRST, update);
  this.$onEval(PRIORITY_LAST, update);
  return cookies;

  function update(){
    var name, browserCookies = $browser.cookies();
    for(name in cookies) {
      if (browserCookies[name] !== cookies[name]) {
        $browser.cookies(name, browserCookies[name] = cookies[name]);
      }
    }
    for(name in browserCookies) {
      if (browserCookies[name] !== cookies[name]) {
        $browser.cookies(name, _undefined);
        //TODO: write test for this delete
        //delete cookies[name];
      }
    }
  }
}, {inject: ['$browser']});


angularService('$sessionStore', function($store) {

  function SessionStore() {}

  SessionStore.prototype.get = function(key) {
    return fromJson($store[key]);
  };

  SessionStore.prototype.getAll = function() {
    var all = {},
        key;

    for (key in $store) {
      if (!$store.hasOwnProperty(key)) continue;
      all[key] = fromJson($store[key]);
    }

    return all;
  };


  SessionStore.prototype.put = function(key, value) {
    $store[key] = toJson(value);
  };


  SessionStore.prototype.remove = function(key) {
    delete $store[key];
  };


  return new SessionStore();

}, {inject: ['$cookies']});
