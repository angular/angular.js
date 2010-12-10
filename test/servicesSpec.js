describe("service", function(){
  var scope, $xhrError, $log, mockServices, inject, $browser, $browserXhr, $xhrBulk, $xhr, $route;

  beforeEach(function(){
    $xhrError = jasmine.createSpy('$xhr.error');
    $log = {};
    scope = createScope({}, angularService, {
      '$xhr.error': $xhrError,
      '$log': $log
    });
    inject = scope.$inject;
    $browser = inject('$browser');
    $browserXhr = $browser.xhr;
    $xhrBulk = scope.$inject('$xhr.bulk');
    $xhr = scope.$inject('$xhr');
    $route = scope.$inject('$route');
  });

  afterEach(function(){
    dealoc(scope);
  });



  it("should inject $window", function(){
    expect(scope.$window).toEqual(window);
  });

  xit('should add stylesheets', function(){
    scope.$document = {
      getElementsByTagName: function(name){
        expect(name).toEqual('LINK');
        return [];
      }
    };
    scope.$document.addStyleSheet('css/angular.css');
  });

  describe("$log", function(){
    it('should use console if present', function(){
      var logger = "";
      function log(){ logger+= 'log;'; }
      function warn(){ logger+= 'warn;'; }
      function info(){ logger+= 'info;'; }
      function error(){ logger+= 'error;'; }
      var scope = createScope({}, angularService, {$window: {console:{log:log, warn:warn, info:info, error:error}}, $document:[{cookie:''}]});
      scope.$log.log();
      scope.$log.warn();
      scope.$log.info();
      scope.$log.error();
      expect(logger).toEqual('log;warn;info;error;');
    });

    it('should use console.log if other not present', function(){
      var logger = "";
      function log(){ logger+= 'log;'; }
      var scope = createScope({}, angularService, {$window: {console:{log:log}}, $document:[{cookie:''}]});
      scope.$log.log();
      scope.$log.warn();
      scope.$log.info();
      scope.$log.error();
      expect(logger).toEqual('log;log;log;log;');
    });

    it('should use noop if no console', function(){
      var scope = createScope({}, angularService, {$window: {}, $document:[{cookie:''}]});
      scope.$log.log();
      scope.$log.warn();
      scope.$log.info();
      scope.$log.error();
    });
    
    describe('Error', function(){
      var e, $log, $console, errorArgs;
      beforeEach(function(){
        e = new Error('');
        e.message = undefined;
        e.sourceURL = undefined;
        e.line = undefined;
        e.stack = undefined;
        
        $console = angular.service('$log')({console:{error:function(){
          errorArgs = arguments;
        }}});
      });
      
      it('should pass error if does not have trace', function(){
        $console.error('abc', e);
        expect(errorArgs).toEqual(['abc', e]);
      });

      it('should print stack', function(){
        e.stack = 'stack';
        $console.error('abc', e);
        expect(errorArgs).toEqual(['abc', 'stack']);
      });

      it('should print line', function(){
        e.message = 'message';
        e.sourceURL = 'sourceURL';
        e.line = '123';
        $console.error('abc', e);
        expect(errorArgs).toEqual(['abc', 'message\nsourceURL:123']);
      });
      
    });
    
  });

  describe("$exceptionHandler", function(){
    it('should log errors', function(){
      var error = '';
      $log.error = function(m) { error += m; };
      scope.$exceptionHandler('myError');
      expect(error).toEqual('myError');
    });
  });

  describe("$location", function(){
    it("should inject $location", function() {
      expect(scope.$location).toBeDefined();
    });

    it("update should update location object immediately", function() {
      var href = 'http://host:123/p/a/t/h.html?query=value#path?key=value&flag&key2=';
      scope.$location.update(href);
      expect(scope.$location.href).toEqual(href);
      expect(scope.$location.protocol).toEqual("http");
      expect(scope.$location.host).toEqual("host");
      expect(scope.$location.port).toEqual("123");
      expect(scope.$location.path).toEqual("/p/a/t/h.html");
      expect(scope.$location.search).toEqual({query:'value'});
      expect(scope.$location.hash).toEqual('path?key=value&flag&key2=');
      expect(scope.$location.hashPath).toEqual('path');
      expect(scope.$location.hashSearch).toEqual({key: 'value', flag: true, key2: ''});
    });

    it('toString() should return actual representation', function() {
      var href = 'http://host:123/p/a/t/h.html?query=value#path?key=value&flag&key2=';
      scope.$location.update(href);
      expect(scope.$location.toString()).toEqual(href);
      scope.$eval();

      scope.$location.host = 'new';
      scope.$location.path = '';
      expect(scope.$location.toString()).toEqual('http://new:123?query=value#path?key=value&flag&key2=');
    });

    it('toString() should not update browser', function() {
      var url = $browser.getUrl();
      scope.$location.update('http://www.angularjs.org');
      expect(scope.$location.toString()).toEqual('http://www.angularjs.org');
      expect($browser.getUrl()).toEqual(url);
    });

    it('should update browser at the end of $eval', function() {
      var url = $browser.getUrl();
      scope.$location.update('http://www.angularjs.org/');
      scope.$location.update({path: '/a/b'});
      expect(scope.$location.toString()).toEqual('http://www.angularjs.org/a/b');
      expect($browser.getUrl()).toEqual(url);
      scope.$eval();
      expect($browser.getUrl()).toEqual('http://www.angularjs.org/a/b');
    });

    it('should update hashPath and hashSearch on hash update', function(){
      scope.$location.update('http://server/#path?a=b');
      scope.$eval();
      scope.$location.update({hash: ''});

      expect(scope.$location.hashPath).toEqual('');
      expect(scope.$location.hashSearch).toEqual({});
    });

    it('should update hash on hashPath or hashSearch update', function() {
      scope.$location.update('http://server/#path?a=b');
      scope.$eval();
      scope.$location.update({hashPath: '', hashSearch: {}});

      expect(scope.$location.hash).toEqual('');
    });

    it('should update hashPath and hashSearch on hash property change', function(){
      scope.$location.update('http://server/#path?a=b');
      scope.$eval();
      scope.$location.hash = '';

      expect(scope.$location.toString()).toEqual('http://server/');
      expect(scope.$location.hashPath).toEqual('');
      expect(scope.$location.hashSearch).toEqual({});
    });

    it('should update hash on hashPath or hashSearch property change', function() {
      scope.$location.update('http://server/#path?a=b');
      scope.$eval();
      scope.$location.hashPath = '';
      scope.$location.hashSearch = {};

      expect(scope.$location.toString()).toEqual('http://server/');
      expect(scope.$location.hash).toEqual('');
    });

    it('should update hash before any processing', function(){
      scope = compile('<div>');
      var log = '';
      scope.$watch('$location.hash', function(){
        log += this.$location.hashPath + ';';
      });
      expect(log).toEqual(';');

      log = '';
      scope.$location.hash = '/abc';
      scope.$eval();
      expect(log).toEqual('/abc;');
    });

    it('udpate() should accept hash object and update only given properties', function() {
      scope.$location.update("http://host:123/p/a/t/h.html?query=value#path?key=value&flag&key2=");
      scope.$location.update({host: 'new', port: 24});

      expect(scope.$location.host).toEqual('new');
      expect(scope.$location.port).toEqual(24);
      expect(scope.$location.protocol).toEqual('http');
      expect(scope.$location.href).toEqual("http://new:24/p/a/t/h.html?query=value#path?key=value&flag&key2=");
    });

    it('updateHash() should accept one string argument to update path', function() {
      scope.$location.updateHash('path');
      expect(scope.$location.hash).toEqual('path');
      expect(scope.$location.hashPath).toEqual('path');
    });

    it('updateHash() should accept one hash argument to update search', function() {
      scope.$location.updateHash({a: 'b'});
      expect(scope.$location.hash).toEqual('?a=b');
      expect(scope.$location.hashSearch).toEqual({a: 'b'});
    });

    it('updateHash() should accept path and search both', function() {
      scope.$location.updateHash('path', {a: 'b'});
      expect(scope.$location.hash).toEqual('path?a=b');
      expect(scope.$location.hashSearch).toEqual({a: 'b'});
      expect(scope.$location.hashPath).toEqual('path');
    });
    
    it('should remove # if hash is empty', function() {
      scope.$location.update('http://www.angularjs.org/index.php#');
      expect(scope.$location.href).toEqual('http://www.angularjs.org/index.php');
    });
    
    it('should not change browser\'s url with empty hash', function() {
      $browser.setUrl('http://www.angularjs.org/index.php#');
      spyOn($browser, 'setUrl');
      $browser.poll();
      expect($browser.setUrl).not.toHaveBeenCalled();
    });
  });

  describe("$invalidWidgets", function(){
    it("should count number of invalid widgets", function(){
      scope = compile('<input name="price" ng:required ng:validate="number"></input>');
      jqLite(document.body).append(scope.$element);
      scope.$init();
      expect(scope.$invalidWidgets.length).toEqual(1);

      scope.price = 123;
      scope.$eval();
      expect(scope.$invalidWidgets.length).toEqual(0);

      scope.$element.remove();
      scope.price = 'abc';
      scope.$eval();
      expect(scope.$invalidWidgets.length).toEqual(0);

      jqLite(document.body).append(scope.$element);
      scope.price = 'abcd'; //force revalidation, maybe this should be done automatically?
      scope.$eval();
      expect(scope.$invalidWidgets.length).toEqual(1);

      jqLite(document.body).html('');
      scope.$eval();
      expect(scope.$invalidWidgets.length).toEqual(0);
    });
  });


  describe("$route", function(){
    it('should route and fire change event', function(){
      var log = '';
      function BookChapter() {
        this.log = '<init>';
      }
      scope = compile('<div></div>').$init();
      $route = scope.$inject('$route');
      $route.when('/Book/:book/Chapter/:chapter', {controller: BookChapter, template:'Chapter.html'});
      $route.when('/Blank');
      $route.onChange(function(){
        log += 'onChange();';
      });
      scope.$location.update('http://server#/Book/Moby/Chapter/Intro?p=123');
      scope.$eval();
      expect(log).toEqual('onChange();');
      expect($route.current.params).toEqual({book:'Moby', chapter:'Intro', p:'123'});
      expect($route.current.scope.log).toEqual('<init>');
      var lastId = $route.current.scope.$id;

      log = '';
      scope.$location.update('http://server#/Blank?ignore');
      scope.$eval();
      expect(log).toEqual('onChange();');
      expect($route.current.params).toEqual({ignore:true});
      expect($route.current.scope.$id).not.toEqual(lastId);

      log = '';
      scope.$location.update('http://server#/NONE');
      scope.$eval();
      expect(log).toEqual('onChange();');
      expect($route.current).toEqual(null);

      $route.when('/NONE', {template:'instant update'});
      scope.$eval();
      expect($route.current.template).toEqual('instant update');
    });
  });

  describe('$resource', function(){
    it('should publish to root scope', function(){
      expect(scope.$inject('$resource')).toBeTruthy();
    });
  });


  describe('$defer', function() {
    var $defer, $exceptionHandler;

    beforeEach(function(){
      scope = createScope({}, angularService, {
        '$exceptionHandler': jasmine.createSpy('$exceptionHandler')
      });

      $browser = scope.$inject('$browser');
      $defer = scope.$inject('$defer');
      $exceptionHandler = scope.$inject('$exceptionHandler');
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

      $defer(function() {throw "Test Error"});
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
      beforeEach(function(){ cache = scope.$inject('$xhr.cache'); });

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
        scope.$inject('$xhr.bulk').urls['/bulk'] = {
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
      })
    });

  });


  describe('$cookies', function() {

    var scope, $browser;

    beforeEach(function() {
      $browser = new MockBrowser();
      $browser.cookieHash['preexisting'] = 'oldCookie';
      scope = createScope(null, angularService, {$browser: $browser});
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


    it('should ignore non-string values when asked to create a cookie', function() {
      scope.$cookies.nonString = [1, 2, 3];
      scope.$eval();
      expect($browser.cookies()).toEqual({'preexisting': 'oldCookie'});
      expect(scope.$cookies).toEqual({'preexisting': 'oldCookie'});
    });


    it('should drop any null or undefined properties', function() {
      scope.$cookies.nullVal = null;
      scope.$cookies.undefVal = undefined;
      scope.$eval();

      expect($browser.cookies()).toEqual({'preexisting': 'oldCookie'});
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
      scope.$inject('$cookieStore').put('objectCookie', {id: 123, name: 'blah'});
      scope.$eval(); //force eval in test
      expect($browser.cookies()).toEqual({'objectCookie': '{"id":123,"name":"blah"}'});
    });


    it('should deserialize json to object', function() {
      $browser.cookies('objectCookie', '{"id":123,"name":"blah"}');
      $browser.poll();
      expect(scope.$inject('$cookieStore').get('objectCookie')).toEqual({id: 123, name: 'blah'});
    });


    it('should delete objects from the store when remove is called', function() {
      scope.$inject('$cookieStore').put('gonner', { "I'll":"Be Back"});
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
});
