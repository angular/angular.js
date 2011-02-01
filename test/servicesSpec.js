describe("service", function(){
  var scope, $xhrError, $log, mockServices, $browser, $browserXhr, $xhrBulk, $xhr;

  beforeEach(function(){
    $xhrError = jasmine.createSpy('$xhr.error');
    $log = {};
    scope = createScope({}, angularService, {
      '$xhr.error': $xhrError,
      '$log': $log
    });
    $browser = scope.$service('$browser');
    $browserXhr = $browser.xhr;
    $xhrBulk = scope.$service('$xhr.bulk');
    $xhr = scope.$service('$xhr');
  });

  afterEach(function(){
    dealoc(scope);
  });



  it("should inject $window", function(){
    expect(scope.$service('$window')).toEqual(window);
  });

  describe("$log", function(){
    it('should use console if present', function(){
      var logger = "";
      function log(){ logger+= 'log;'; }
      function warn(){ logger+= 'warn;'; }
      function info(){ logger+= 'info;'; }
      function error(){ logger+= 'error;'; }
      var scope = createScope({}, {$log: $logFactory},
                                  {$exceptionHandler: rethrow,
                                   $window: {console: {log: log,
                                                       warn: warn,
                                                       info: info,
                                                       error: error}}}),
          $log = scope.$service('$log');

      $log.log();
      $log.warn();
      $log.info();
      $log.error();
      expect(logger).toEqual('log;warn;info;error;');
    });

    it('should use console.log() if other not present', function(){
      var logger = "";
      function log(){ logger+= 'log;'; }
      var scope = createScope({}, {$log: $logFactory},
                                  {$window: {console:{log:log}},
                                   $exceptionHandler: rethrow});
      var $log = scope.$service('$log');
      $log.log();
      $log.warn();
      $log.info();
      $log.error();
      expect(logger).toEqual('log;log;log;log;');
    });

    it('should use noop if no console', function(){
      var scope = createScope({}, {$log: $logFactory},
                                  {$window: {},
                                   $exceptionHandler: rethrow}),
          $log = scope.$service('$log');
      $log.log();
      $log.warn();
      $log.info();
      $log.error();
    });

    describe('error', function(){
      var e, $log, errorArgs;
      beforeEach(function(){
        e = new Error('');
        e.message = undefined;
        e.sourceURL = undefined;
        e.line = undefined;
        e.stack = undefined;

        $log = $logFactory({console:{error:function(){
          errorArgs = arguments;
        }}});
      });

      it('should pass error if does not have trace', function(){
        $log.error('abc', e);
        expect(errorArgs).toEqual(['abc', e]);
      });

      it('should print stack', function(){
        e.stack = 'stack';
        $log.error('abc', e);
        expect(errorArgs).toEqual(['abc', 'stack']);
      });

      it('should print line', function(){
        e.message = 'message';
        e.sourceURL = 'sourceURL';
        e.line = '123';
        $log.error('abc', e);
        expect(errorArgs).toEqual(['abc', 'message\nsourceURL:123']);
      });

    });

  });

  describe("$exceptionHandler", function(){
    it('should log errors', function(){
      var scope = createScope({}, {$exceptionHandler: $exceptionHandlerFactory},
                                  {$log: $logMock}),
          $log = scope.$service('$log'),
          $exceptionHandler = scope.$service('$exceptionHandler');

      $exceptionHandler('myError');
      expect($log.error.logs.shift()).toEqual(['myError']);
    });
  });

  describe("$location", function(){
    var $location;

    beforeEach(function() {
      $location = scope.$service('$location');
    });


    it("should update location object immediately when update is called", function() {
      var href = 'http://host:123/p/a/t/h.html?query=value#path?key=value&flag&key2=';
      $location.update(href);
      expect($location.href).toEqual(href);
      expect($location.protocol).toEqual("http");
      expect($location.host).toEqual("host");
      expect($location.port).toEqual("123");
      expect($location.path).toEqual("/p/a/t/h.html");
      expect($location.search).toEqual({query:'value'});
      expect($location.hash).toEqual('path?key=value&flag&key2=');
      expect($location.hashPath).toEqual('path');
      expect($location.hashSearch).toEqual({key: 'value', flag: true, key2: ''});
    });


    it('should update location when browser url changed', function() {
      var origUrl = $location.href;
      expect(origUrl).toEqual($browser.getUrl());

      var newUrl = 'http://somenew/url#foo';
      $browser.setUrl(newUrl);
      $browser.poll();
      expect($location.href).toEqual(newUrl);
    });


    it('should update browser at the end of $eval', function() {
      var origBrowserUrl = $browser.getUrl();
      $location.update('http://www.angularjs.org/');
      $location.update({path: '/a/b'});
      expect($location.href).toEqual('http://www.angularjs.org/a/b');
      expect($browser.getUrl()).toEqual(origBrowserUrl);
      scope.$eval();
      expect($browser.getUrl()).toEqual('http://www.angularjs.org/a/b');
    });


    it('should update hashPath and hashSearch on hash update', function(){
      $location.update('http://server/#path?a=b');
      expect($location.hashPath).toEqual('path');
      expect($location.hashSearch).toEqual({a:'b'});

      $location.update({hash: ''});
      expect($location.hashPath).toEqual('');
      expect($location.hashSearch).toEqual({});
    });


    it('should update hash on hashPath or hashSearch update', function() {
      $location.update('http://server/#path?a=b');
      scope.$eval();
      $location.update({hashPath: '', hashSearch: {}});

      expect($location.hash).toEqual('');
    });


    it('should update hashPath and hashSearch on $location.hash change upon eval', function(){
      $location.update('http://server/#path?a=b');
      scope.$eval();

      $location.hash = '';
      scope.$eval();

      expect($location.href).toEqual('http://server/');
      expect($location.hashPath).toEqual('');
      expect($location.hashSearch).toEqual({});
    });


    it('should update hash on $location.hashPath or $location.hashSearch change upon eval',
        function() {
      $location.update('http://server/#path?a=b');
      scope.$eval();
      $location.hashPath = '';
      $location.hashSearch = {};

      scope.$eval();

      expect($location.href).toEqual('http://server/');
      expect($location.hash).toEqual('');
    });


    it('should sync $location upon eval before watches are fired', function(){
      scope.$location = scope.$service('$location'); //publish to the scope for $watch

      var log = '';
      scope.$watch('$location.hash', function(){
        log += this.$location.hashPath + ';';
      });
      expect(log).toEqual(';');

      log = '';
      scope.$location.hash = '/abc';
      scope.$eval();
      expect(scope.$location.hash).toEqual('/abc');
      expect(log).toEqual('/abc;');
    });


    describe('sync', function() {
      it('should update hash with escaped hashPath', function() {
        $location.hashPath = 'foo=bar';
        scope.$eval();
        expect($location.hash).toBe('foo%3Dbar');
      });


      it('should give $location.href the highest precedence', function() {
        $location.hashPath = 'hashPath';
        $location.hashSearch = {hash:'search'};
        $location.hash = 'hash';
        $location.port = '333';
        $location.host = 'host';
        $location.href = 'https://hrefhost:23/hrefpath';

        scope.$eval();

        expect($location).toEqualData({href: 'https://hrefhost:23/hrefpath',
                                       protocol: 'https',
                                       host: 'hrefhost',
                                       port: '23',
                                       path: '/hrefpath',
                                       search: {},
                                       hash: '',
                                       hashPath: '',
                                       hashSearch: {}
                                      });
      });


      it('should give $location.hash second highest precedence', function() {
        $location.hashPath = 'hashPath';
        $location.hashSearch = {hash:'search'};
        $location.hash = 'hash';
        $location.port = '333';
        $location.host = 'host';
        $location.path = '/path';

        scope.$eval();

        expect($location).toEqualData({href: 'http://host:333/path#hash',
                                       protocol: 'http',
                                       host: 'host',
                                       port: '333',
                                       path: '/path',
                                       search: {},
                                       hash: 'hash',
                                       hashPath: 'hash',
                                       hashSearch: {}
                                      });
      });
    });

    describe('update()', function() {
      it('should accept hash object and update only given properties', function() {
        $location.update("http://host:123/p/a/t/h.html?query=value#path?key=value&flag&key2=");
        $location.update({host: 'new', port: 24});

        expect($location.host).toEqual('new');
        expect($location.port).toEqual(24);
        expect($location.protocol).toEqual('http');
        expect($location.href).toEqual("http://new:24/p/a/t/h.html?query=value#path?key=value&flag&key2=");
      });

      it('should remove # if hash is empty', function() {
        $location.update('http://www.angularjs.org/index.php#');
        expect($location.href).toEqual('http://www.angularjs.org/index.php');
      });

      it('should clear hash when updating to hash-less URL', function() {
        $location.update('http://server');
        expect($location.href).toBe('http://server');
        expect($location.hash).toBe('');
      });
    });


    describe('updateHash()', function() {
      it('should accept single string argument to update path', function() {
        $location.updateHash('path');
        expect($location.hash).toEqual('path');
        expect($location.hashPath).toEqual('path');
      });

      it('should accept single object argument to update search', function() {
        $location.updateHash({a: 'b'});
        expect($location.hash).toEqual('?a=b');
        expect($location.hashSearch).toEqual({a: 'b'});
      });

      it('should accept path string and search object arguments to update both', function() {
        $location.updateHash('path', {a: 'b'});
        expect($location.hash).toEqual('path?a=b');
        expect($location.hashSearch).toEqual({a: 'b'});
        expect($location.hashPath).toEqual('path');
      });

      it('should update href and hash when updating to empty string', function() {
        $location.updateHash('');
        expect($location.href).toBe('http://server');
        expect($location.hash).toBe('');

        scope.$eval();

        expect($location.href).toBe('http://server');
        expect($location.hash).toBe('');
      });
    });
  });

  describe("$invalidWidgets", function(){
    it("should count number of invalid widgets", function(){
      scope = compile('<input name="price" ng:required ng:validate="number"></input>');
      jqLite(document.body).append(scope.$element);
      scope.$init();
      var $invalidWidgets = scope.$service('$invalidWidgets');
      expect($invalidWidgets.length).toEqual(1);

      scope.price = 123;
      scope.$eval();
      expect($invalidWidgets.length).toEqual(0);

      scope.$element.remove();
      scope.price = 'abc';
      scope.$eval();
      expect($invalidWidgets.length).toEqual(0);

      jqLite(document.body).append(scope.$element);
      scope.price = 'abcd'; //force revalidation, maybe this should be done automatically?
      scope.$eval();
      expect($invalidWidgets.length).toEqual(1);

      jqLite(document.body).html('');
      scope.$eval();
      expect($invalidWidgets.length).toEqual(0);
    });
  });


  describe("$route", function(){
    it('should route and fire change event', function(){
      var log = '',
          $location, $route;

      function BookChapter() {
        this.log = '<init>';
      }
      scope = compile('<div></div>').$init();
      $location = scope.$service('$location');
      $route = scope.$service('$route');
      $route.when('/Book/:book/Chapter/:chapter', {controller: BookChapter, template:'Chapter.html'});
      $route.when('/Blank');
      $route.onChange(function(){
        log += 'onChange();';
      });
      $location.update('http://server#/Book/Moby/Chapter/Intro?p=123');
      scope.$eval();
      expect(log).toEqual('onChange();');
      expect($route.current.params).toEqual({book:'Moby', chapter:'Intro', p:'123'});
      expect($route.current.scope.log).toEqual('<init>');
      var lastId = $route.current.scope.$id;

      log = '';
      $location.update('http://server#/Blank?ignore');
      scope.$eval();
      expect(log).toEqual('onChange();');
      expect($route.current.params).toEqual({ignore:true});
      expect($route.current.scope.$id).not.toEqual(lastId);

      log = '';
      $location.update('http://server#/NONE');
      scope.$eval();
      expect(log).toEqual('onChange();');
      expect($route.current).toEqual(null);

      $route.when('/NONE', {template:'instant update'});
      scope.$eval();
      expect($route.current.template).toEqual('instant update');
    });

    it('should allow routes to be defined with just templates without controllers', function() {
      var scope = angular.scope(),
          $location = scope.$service('$location'),
          $route = scope.$service('$route'),
          onChangeSpy = jasmine.createSpy('onChange');

      $route.when('/foo', {template: 'foo.html'});
      $route.onChange(onChangeSpy);
      expect($route.current).toBeNull();
      expect(onChangeSpy).not.toHaveBeenCalled();

      $location.updateHash('/foo');
      scope.$eval();

      expect($route.current.template).toEqual('foo.html');
      expect($route.current.controller).toBeUndefined();
      expect(onChangeSpy).toHaveBeenCalled();
    });

    it('should handle unknown routes with "otherwise" route definition', function() {
      var scope = angular.scope(),
          $location = scope.$service('$location'),
          $route = scope.$service('$route'),
          onChangeSpy = jasmine.createSpy('onChange');

      function NotFoundCtrl() {this.notFoundProp = 'not found!'}

      $route.when('/foo', {template: 'foo.html'});
      $route.otherwise({template: '404.html', controller: NotFoundCtrl});
      $route.onChange(onChangeSpy);
      expect($route.current).toBeNull();
      expect(onChangeSpy).not.toHaveBeenCalled();

      $location.updateHash('/unknownRoute');
      scope.$eval();

      expect($route.current.template).toBe('404.html');
      expect($route.current.controller).toBe(NotFoundCtrl);
      expect($route.current.scope.notFoundProp).toBe('not found!');
      expect(onChangeSpy).toHaveBeenCalled();

      onChangeSpy.reset();
      $location.updateHash('/foo');
      scope.$eval();

      expect($route.current.template).toEqual('foo.html');
      expect($route.current.controller).toBeUndefined();
      expect($route.current.scope.notFoundProp).toBeUndefined();
      expect(onChangeSpy).toHaveBeenCalled();
    });

    it('should support redirection via redirectTo property by updating $location', function() {
      var scope = angular.scope(),
          $location = scope.$service('$location'),
          $browser = scope.$service('$browser'),
          $route = scope.$service('$route'),
          onChangeSpy = jasmine.createSpy('onChange');

      $route.when('', {redirectTo: '/foo'});
      $route.when('/foo', {template: 'foo.html'});
      $route.when('/bar', {template: 'bar.html'});
      $route.when('/baz', {redirectTo: '/bar'});
      $route.otherwise({template: '404.html'});
      $route.onChange(onChangeSpy);
      expect($route.current).toBeNull();
      expect(onChangeSpy).not.toHaveBeenCalled();

      scope.$eval(); //triggers initial route change - match the redirect route
      $browser.poll(); //triger route change - match the route we redirected to

      expect($location.hash).toBe('/foo');
      expect($route.current.template).toBe('foo.html');
      expect(onChangeSpy.callCount).toBe(1);

      onChangeSpy.reset();
      $location.updateHash('');
      scope.$eval(); //match the redirect route + update $browser
      $browser.poll(); //match the route we redirected to


      expect($location.hash).toBe('/foo');
      expect($route.current.template).toBe('foo.html');
      expect(onChangeSpy.callCount).toBe(1);

      onChangeSpy.reset();
      $location.updateHash('/baz');
      scope.$eval(); //match the redirect route + update $browser
      $browser.poll(); //match the route we redirected to

      expect($location.hash).toBe('/bar');
      expect($route.current.template).toBe('bar.html');
      expect(onChangeSpy.callCount).toBe(1);
    });
  });


  describe('$defer', function() {
    var $defer, $exceptionHandler;

    beforeEach(function(){
      scope = createScope({}, angularService, {
        '$exceptionHandler': jasmine.createSpy('$exceptionHandler')
      });

      $browser = scope.$service('$browser');
      $defer = scope.$service('$defer');
      $exceptionHandler = scope.$service('$exceptionHandler');
    });


    it('should delegate functions to $browser.defer', function() {
      var counter = 0;
      $defer(function() { counter++; });

      expect(counter).toBe(0);

      $browser.defer.flush();
      expect(counter).toBe(1);

      $browser.defer.flush(); //does nothing
      expect(counter).toBe(1);

      expect($exceptionHandler).not.toHaveBeenCalled();
    });


    it('should delegate exception to the $exceptionHandler service', function() {
      $defer(function() {throw "Test Error";});
      expect($exceptionHandler).not.toHaveBeenCalled();

      $browser.defer.flush();
      expect($exceptionHandler).toHaveBeenCalledWith("Test Error");
    });


    it('should call eval after each callback is executed', function() {
      var eval = this.spyOn(scope, '$eval').andCallThrough();

      $defer(function() {});
      expect(eval).wasNotCalled();

      $browser.defer.flush();
      expect(eval).wasCalled();

      eval.reset(); //reset the spy;

      $defer(function() {});
      $defer(function() {});
      $browser.defer.flush();
      expect(eval.callCount).toBe(2);
    });


    it('should call eval even if an exception is thrown in callback', function() {
      var eval = this.spyOn(scope, '$eval').andCallThrough();

      $defer(function() {throw "Test Error";});
      expect(eval).wasNotCalled();

      $browser.defer.flush();
      expect(eval).wasCalled();
    });
  });


  describe('$xhr', function(){
    var log;
    function callback(code, response) {
      expect(code).toEqual(200);
      log = log + toJson(response) + ';';
    }

    beforeEach(function(){
      log = '';
    });

    it('should forward the request to $browser and decode JSON', function(){
      $browserXhr.expectGET('/reqGET').respond('first');
      $browserXhr.expectGET('/reqGETjson').respond('["second"]');
      $browserXhr.expectPOST('/reqPOST', {post:'data'}).respond('third');

      $xhr('GET', '/reqGET', null, callback);
      $xhr('GET', '/reqGETjson', null, callback);
      $xhr('POST', '/reqPOST', {post:'data'}, callback);

      $browserXhr.flush();

      expect(log).toEqual('"third";["second"];"first";');
    });

    it('should handle non 200 status codes by forwarding to error handler', function(){
      $browserXhr.expectPOST('/req', 'MyData').respond(500, 'MyError');
      $xhr('POST', '/req', 'MyData', callback);
      $browserXhr.flush();
      var cb = $xhrError.mostRecentCall.args[0].callback;
      expect(typeof cb).toEqual($function);
      expect($xhrError).wasCalledWith(
          {url:'/req', method:'POST', data:'MyData', callback:cb},
          {status:500, body:'MyError'});
    });

    it('should handle exceptions in callback', function(){
      $log.error = jasmine.createSpy('$log.error');
      $browserXhr.expectGET('/reqGET').respond('first');
      $xhr('GET', '/reqGET', null, function(){ throw "MyException"; });
      $browserXhr.flush();

      expect($log.error).wasCalledWith("MyException");
    });

    describe('bulk', function(){
      it('should collect requests', function(){
        $xhrBulk.urls["/"] = {match:/.*/};
        $xhrBulk('GET', '/req1', null, callback);
        $xhrBulk('POST', '/req2', {post:'data'}, callback);

        $browserXhr.expectPOST('/', {
          requests:[{method:'GET',  url:'/req1', data: null},
                    {method:'POST', url:'/req2', data:{post:'data'} }]
        }).respond([
          {status:200, response:'first'},
          {status:200, response:'second'}
        ]);
        $xhrBulk.flush(function(){ log += 'DONE';});
        $browserXhr.flush();
        expect(log).toEqual('"first";"second";DONE');
      });

      it('should handle non 200 status code by forwarding to error handler', function(){
        $xhrBulk.urls['/'] = {match:/.*/};
        $xhrBulk('GET', '/req1', null, callback);
        $xhrBulk('POST', '/req2', {post:'data'}, callback);

        $browserXhr.expectPOST('/', {
          requests:[{method:'GET',  url:'/req1', data: null},
                    {method:'POST', url:'/req2', data:{post:'data'} }]
        }).respond([
          {status:404, response:'NotFound'},
          {status:200, response:'second'}
        ]);
        $xhrBulk.flush(function(){ log += 'DONE';});
        $browserXhr.flush();

        expect($xhrError).wasCalled();
        var cb = $xhrError.mostRecentCall.args[0].callback;
        expect(typeof cb).toEqual($function);
        expect($xhrError).wasCalledWith(
            {url:'/req1', method:'GET', data:null, callback:cb},
            {status:404, response:'NotFound'});

        expect(log).toEqual('"second";DONE');
      });
    });

    describe('cache', function(){
      var cache;
      beforeEach(function(){ cache = scope.$service('$xhr.cache'); });

      it('should cache requests', function(){
        $browserXhr.expectGET('/url').respond('first');
        cache('GET', '/url', null, callback);
        $browserXhr.flush();

        $browserXhr.expectGET('/url').respond('ERROR');
        cache('GET', '/url', null, callback);
        $browser.defer.flush();
        $browserXhr.flush();
        expect(log).toEqual('"first";"first";');

        cache('GET', '/url', null, callback, false);
        $browser.defer.flush();
        expect(log).toEqual('"first";"first";"first";');
      });

      it('should first return cache request, then return server request', function(){
        $browserXhr.expectGET('/url').respond('first');
        cache('GET', '/url', null, callback, true);
        $browserXhr.flush();

        $browserXhr.expectGET('/url').respond('ERROR');
        cache('GET', '/url', null, callback, true);
        $browser.defer.flush();
        expect(log).toEqual('"first";"first";');

        $browserXhr.flush();
        expect(log).toEqual('"first";"first";"ERROR";');
      });

      it('should serve requests from cache', function(){
        cache.data.url = {value:'123'};
        cache('GET', 'url', null, callback);
        $browser.defer.flush();
        expect(log).toEqual('"123";');

        cache('GET', 'url', null, callback, false);
        $browser.defer.flush();
        expect(log).toEqual('"123";"123";');
      });

      it('should keep track of in flight requests and request only once', function(){
        scope.$service('$xhr.bulk').urls['/bulk'] = {
          match:function(url){
            return url == '/url';
          }
        };
        $browserXhr.expectPOST('/bulk', {
          requests:[{method:'GET',  url:'/url', data: null}]
        }).respond([
          {status:200, response:'123'}
        ]);
        cache('GET', '/url', null, callback);
        cache('GET', '/url', null, callback);
        cache.delegate.flush();
        $browserXhr.flush();
        expect(log).toEqual('"123";"123";');
      });

      it('should clear cache on non GET', function(){
        $browserXhr.expectPOST('abc', {}).respond({});
        cache.data.url = {value:123};
        cache('POST', 'abc', {});
        expect(cache.data.url).toBeUndefined();
      });

      it('should call callback asynchronously for both cache hit and cache miss', function() {
        $browserXhr.expectGET('/url').respond('+');
        cache('GET', '/url', null, callback);
        expect(log).toEqual(''); //callback hasn't executed

        $browserXhr.flush();
        expect(log).toEqual('"+";'); //callback has executed

        cache('GET', '/url', null, callback);
        expect(log).toEqual('"+";'); //callback hasn't executed

        $browser.defer.flush();
        expect(log).toEqual('"+";"+";'); //callback has executed
      });

      it('should call eval after callbacks for both cache hit and cache miss execute', function() {
        var eval = this.spyOn(scope, '$eval').andCallThrough();

        $browserXhr.expectGET('/url').respond('+');
        cache('GET', '/url', null, callback);
        expect(eval).wasNotCalled();

        $browserXhr.flush();
        expect(eval).wasCalled();

        eval.reset(); //reset the spy

        cache('GET', '/url', null, callback);
        expect(eval).wasNotCalled();

        $browser.defer.flush();
        expect(eval).wasCalled();
      });
    });

  });


  describe('$cookies', function() {

    var scope, $browser;

    beforeEach(function() {
      $browser = new MockBrowser();
      $browser.cookieHash['preexisting'] = 'oldCookie';
      scope = createScope(null, angularService, {$browser: $browser});
      scope.$cookies = scope.$service('$cookies');
    });


    it('should provide access to existing cookies via object properties and keep them in sync',
        function(){
      expect(scope.$cookies).toEqual({'preexisting': 'oldCookie'});

      // access internal cookie storage of the browser mock directly to simulate behavior of
      // document.cookie
      $browser.cookieHash['brandNew'] = 'cookie';
      $browser.poll();

      expect(scope.$cookies).toEqual({'preexisting': 'oldCookie', 'brandNew':'cookie'});

      $browser.cookieHash['brandNew'] = 'cookie2';
      $browser.poll();
      expect(scope.$cookies).toEqual({'preexisting': 'oldCookie', 'brandNew':'cookie2'});

      delete $browser.cookieHash['brandNew'];
      $browser.poll();
      expect(scope.$cookies).toEqual({'preexisting': 'oldCookie'});
    });


    it('should create or update a cookie when a value is assigned to a property', function() {
      scope.$cookies.oatmealCookie = 'nom nom';
      scope.$eval();

      expect($browser.cookies()).
        toEqual({'preexisting': 'oldCookie', 'oatmealCookie':'nom nom'});

      scope.$cookies.oatmealCookie = 'gone';
      scope.$eval();

      expect($browser.cookies()).
        toEqual({'preexisting': 'oldCookie', 'oatmealCookie': 'gone'});
    });


    it('should drop or reset any cookie that was set to a non-string value', function() {
      scope.$cookies.nonString = [1, 2, 3];
      scope.$cookies.nullVal = null;
      scope.$cookies.undefVal = undefined;
      scope.$cookies.preexisting = function(){};
      scope.$eval();
      expect($browser.cookies()).toEqual({'preexisting': 'oldCookie'});
      expect(scope.$cookies).toEqual({'preexisting': 'oldCookie'});
    });


    it('should remove a cookie when a $cookies property is deleted', function() {
      scope.$cookies.oatmealCookie = 'nom nom';
      scope.$eval();
      $browser.poll();
      expect($browser.cookies()).
        toEqual({'preexisting': 'oldCookie', 'oatmealCookie':'nom nom'});

      delete scope.$cookies.oatmealCookie;
      scope.$eval();

      expect($browser.cookies()).toEqual({'preexisting': 'oldCookie'});
    });


    it('should drop or reset cookies that browser refused to store', function() {
      var i, longVal;

      for (i=0; i<5000; i++) {
        longVal += '*';
      }

      //drop if no previous value
      scope.$cookies.longCookie = longVal;
      scope.$eval();
      expect(scope.$cookies).toEqual({'preexisting': 'oldCookie'});


      //reset if previous value existed
      scope.$cookies.longCookie = 'shortVal';
      scope.$eval();
      expect(scope.$cookies).toEqual({'preexisting': 'oldCookie', 'longCookie': 'shortVal'});
      scope.$cookies.longCookie = longVal;
      scope.$eval();
      expect(scope.$cookies).toEqual({'preexisting': 'oldCookie', 'longCookie': 'shortVal'});
    });
  });


  describe('$cookieStore', function() {

    it('should serialize objects to json', function() {
      scope.$service('$cookieStore').put('objectCookie', {id: 123, name: 'blah'});
      scope.$eval(); //force eval in test
      expect($browser.cookies()).toEqual({'objectCookie': '{"id":123,"name":"blah"}'});
    });


    it('should deserialize json to object', function() {
      $browser.cookies('objectCookie', '{"id":123,"name":"blah"}');
      $browser.poll();
      expect(scope.$service('$cookieStore').get('objectCookie')).toEqual({id: 123, name: 'blah'});
    });


    it('should delete objects from the store when remove is called', function() {
      scope.$service('$cookieStore').put('gonner', { "I'll":"Be Back"});
      scope.$eval(); //force eval in test
      expect($browser.cookies()).toEqual({'gonner': '{"I\'ll":"Be Back"}'});
    });

  });


  describe('URL_MATCH', function() {

    it('should parse basic url', function() {
      var match = URL_MATCH.exec('http://www.angularjs.org/path?search#hash?x=x');

      expect(match[1]).toEqual('http');
      expect(match[3]).toEqual('www.angularjs.org');
      expect(match[6]).toEqual('/path');
      expect(match[8]).toEqual('search');
      expect(match[10]).toEqual('hash?x=x');
    });

    it('should parse file://', function(){
      var match = URL_MATCH.exec('file:///Users/Shared/misko/work/angular.js/scenario/widgets.html');

      expect(match[1]).toEqual('file');
      expect(match[3]).toEqual('');
      expect(match[5]).toBeFalsy();
      expect(match[6]).toEqual('/Users/Shared/misko/work/angular.js/scenario/widgets.html');
      expect(match[8]).toBeFalsy();
    });

    it('should parse url with "-" in host', function(){
      var match = URL_MATCH.exec('http://a-b1.c-d.09/path');

      expect(match[1]).toEqual('http');
      expect(match[3]).toEqual('a-b1.c-d.09');
      expect(match[5]).toBeFalsy();
      expect(match[6]).toEqual('/path');
      expect(match[8]).toBeFalsy();
    });

    it('should parse host without "/" at the end', function() {
      var match = URL_MATCH.exec('http://host.org');
      expect(match[3]).toEqual('host.org');

      match = URL_MATCH.exec('http://host.org#');
      expect(match[3]).toEqual('host.org');

      match = URL_MATCH.exec('http://host.org?');
      expect(match[3]).toEqual('host.org');
    });

    it('should match with just "/" path', function() {
      var match = URL_MATCH.exec('http://server/#?book=moby');

      expect(match[10]).toEqual('?book=moby');
    });
  });

  describe('$updateView', function(){
    var scope, browser, evalCount, $updateView;

    beforeEach(function(){
      browser = new MockBrowser();
      // Pretend that you are real Browser so that we see the delays
      browser.isMock = false;
      browser.defer = jasmine.createSpy('defer');

      scope = angular.scope(null, null, {$browser:browser});
      $updateView = scope.$service('$updateView');
      scope.$onEval(function(){ evalCount++; });
      evalCount = 0;
    });

    it('should eval root scope after a delay', function(){
      $updateView();
      expect(evalCount).toEqual(0);
      expect(browser.defer).toHaveBeenCalled();
      expect(browser.defer.mostRecentCall.args[1]).toEqual(25);
      browser.defer.mostRecentCall.args[0]();
      expect(evalCount).toEqual(1);
    });

    it('should allow changing of delay time', function(){
      var oldValue = angular.service('$updateView').delay;
      angular.service('$updateView').delay = 50;
      $updateView();
      expect(evalCount).toEqual(0);
      expect(browser.defer).toHaveBeenCalled();
      expect(browser.defer.mostRecentCall.args[1]).toEqual(50);
      angular.service('$updateView').delay = oldValue;
    });

    it('should ignore multiple requests for update', function(){
      $updateView();
      $updateView();
      expect(evalCount).toEqual(0);
      expect(browser.defer).toHaveBeenCalled();
      expect(browser.defer.callCount).toEqual(1);
      browser.defer.mostRecentCall.args[0]();
      expect(evalCount).toEqual(1);
    });

    it('should update immediatelly in test/mock mode', function(){
      scope = angular.scope();
      scope.$onEval(function(){ evalCount++; });
      expect(evalCount).toEqual(0);
      scope.$service('$updateView')();
      expect(evalCount).toEqual(1);
    });
  });
});
