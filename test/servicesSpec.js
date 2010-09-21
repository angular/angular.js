describe("service", function(){
  var scope, $xhrError, $log, mockServices;

  beforeEach(function(){
    $xhrError = jasmine.createSpy('$xhr.error');
    $log = {};
    scope = createScope(null, angularService, {
      '$xhr.error': $xhrError,
      '$log': $log
    });
  });

  afterEach(function(){
    if (scope && scope.$element)
      scope.$element.remove();
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
      var scope = createScope(null, angularService, {$window: {console:{log:log, warn:warn, info:info, error:error}}, $document:[{cookie:''}]});
      scope.$log.log();
      scope.$log.warn();
      scope.$log.info();
      scope.$log.error();
      expect(logger).toEqual('log;warn;info;error;');
    });

    it('should use console.log if other not present', function(){
      var logger = "";
      function log(){ logger+= 'log;'; }
      var scope = createScope(null, angularService, {$window: {console:{log:log}}, $document:[{cookie:''}]});
      scope.$log.log();
      scope.$log.warn();
      scope.$log.info();
      scope.$log.error();
      expect(logger).toEqual('log;log;log;log;');
    });

    it('should use noop if no console', function(){
      var scope = createScope(null, angularService, {$window: {}, $document:[{cookie:''}]});
      scope.$log.log();
      scope.$log.warn();
      scope.$log.info();
      scope.$log.error();
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
    it("should inject $location", function(){
      scope.$location.parse('http://host:123/p/a/t/h.html?query=value#path?key=value');
      expect(scope.$location.href).toEqual("http://host:123/p/a/t/h.html?query=value#path?key=value");
      expect(scope.$location.protocol).toEqual("http");
      expect(scope.$location.host).toEqual("host");
      expect(scope.$location.port).toEqual("123");
      expect(scope.$location.path).toEqual("/p/a/t/h.html");
      expect(scope.$location.search).toEqual({query:'value'});
      expect(scope.$location.hash).toEqual('path?key=value');
      expect(scope.$location.hashPath).toEqual('path');
      expect(scope.$location.hashSearch).toEqual({key:'value'});

      scope.$location.hashPath = 'page=http://path';
      scope.$location.hashSearch = {k:'a=b'};

      expect(scope.$location.toString()).toEqual('http://host:123/p/a/t/h.html?query=value#page%3Dhttp%3A//path?k=a%3Db');
    });

    it('should parse file://', function(){
      scope.$location.parse('file:///Users/Shared/misko/work/angular.js/scenario/widgets.html');
      expect(scope.$location.href).toEqual("file:///Users/Shared/misko/work/angular.js/scenario/widgets.html");
      expect(scope.$location.protocol).toEqual("file");
      expect(scope.$location.host).toEqual("");
      expect(scope.$location.port).toEqual(null);
      expect(scope.$location.path).toEqual("/Users/Shared/misko/work/angular.js/scenario/widgets.html");
      expect(scope.$location.search).toEqual({});
      expect(scope.$location.hash).toEqual('');
      expect(scope.$location.hashPath).toEqual('');
      expect(scope.$location.hashSearch).toEqual({});

      expect(scope.$location.toString()).toEqual('file:///Users/Shared/misko/work/angular.js/scenario/widgets.html');
    });

    it('should update url on hash change', function(){
      scope.$location.parse('http://server/#path?a=b');
      scope.$location.hash = '';
      expect(scope.$location.toString()).toEqual('http://server/#');
      expect(scope.$location.hashPath).toEqual('');
    });

    it('should update url on hashPath change', function(){
      scope.$location.parse('http://server/#path?a=b');
      scope.$location.hashPath = '';
      expect(scope.$location.toString()).toEqual('http://server/#?a=b');
      expect(scope.$location.hash).toEqual('?a=b');
    });

    it("should parse url which contains - in host", function(){
      scope.$location.parse('http://a-b1.c-d.09/path');
      expect(scope.$location.href).toEqual('http://a-b1.c-d.09/path');
      expect(scope.$location.protocol).toEqual('http');
      expect(scope.$location.host).toEqual('a-b1.c-d.09');
      expect(scope.$location.path).toEqual('/path');
    });

    it('should update hash before any processing', function(){
      var scope = compile('<div>');
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
  });

  describe("$invalidWidgets", function(){
    it("should count number of invalid widgets", function(){
      var scope = compile('<input name="price" ng:required ng:validate="number"></input>').$init();
      expect(scope.$invalidWidgets.length).toEqual(1);
      scope.price = 123;
      scope.$eval();
      expect(scope.$invalidWidgets.length).toEqual(0);
      scope.$element.remove();
      scope.price = 'abc';
      scope.$eval();
      expect(scope.$invalidWidgets.length).toEqual(1);

      jqLite(document.body).append(scope.$element);
      scope.$invalidWidgets.clearOrphans();
      expect(scope.$invalidWidgets.length).toEqual(1);

      jqLite(document.body).html('');
      scope.$invalidWidgets.clearOrphans();
      expect(scope.$invalidWidgets.length).toEqual(0);
    });
  });


  describe("$route", function(){
    it('should route and fire change event', function(){
      var log = '';
      function BookChapter() {
        this.log = '<init>';
      }
      BookChapter.prototype.init = function(){
        log += 'init();';
      };
      var scope = compile('<div></div>').$init();
      scope.$route.when('/Book/:book/Chapter/:chapter', {controller: BookChapter, template:'Chapter.html'});
      scope.$route.when('/Blank');
      scope.$route.onChange(function(){
        log += 'onChange();';
      });
      scope.$location.parse('http://server#/Book/Moby/Chapter/Intro?p=123');
      scope.$eval();
      expect(log).toEqual('onChange();init();');
      expect(scope.$route.current.params).toEqual({book:'Moby', chapter:'Intro', p:'123'});
      expect(scope.$route.current.scope.log).toEqual('<init>');
      var lastId = scope.$route.current.scope.$id;

      log = '';
      scope.$location.parse('http://server#/Blank?ignore');
      scope.$eval();
      expect(log).toEqual('onChange();');
      expect(scope.$route.current.params).toEqual({ignore:true});
      expect(scope.$route.current.scope.$id).not.toEqual(lastId);

      log = '';
      scope.$location.parse('http://server#/NONE');
      scope.$eval();
      expect(log).toEqual('onChange();');
      expect(scope.$route.current).toEqual(null);

      scope.$route.when('/NONE', {template:'instant update'});
      scope.$eval();
      expect(scope.$route.current.template).toEqual('instant update');
    });
  });

  describe('$resource', function(){
    it('should publish to root scope', function(){
      expect(scope.$resource).toBeTruthy();
    });
  });

  describe('$xhr', function(){
    var log, xhr;
    function callback(code, response) {
      expect(code).toEqual(200);
      log = log + toJson(response) + ';';
    }

    beforeEach(function(){
      log = '';
      xhr = scope.$browser.xhr;
    });

    it('should forward the request to $browser and decode JSON', function(){
      xhr.expectGET('/reqGET').respond('first');
      xhr.expectGET('/reqGETjson').respond('["second"]');
      xhr.expectPOST('/reqPOST', {post:'data'}).respond('third');

      scope.$xhr('GET', '/reqGET', null, callback);
      scope.$xhr('GET', '/reqGETjson', null, callback);
      scope.$xhr('POST', '/reqPOST', {post:'data'}, callback);

      xhr.flush();

      expect(log).toEqual('"third";["second"];"first";');
    });

    it('should handle non 200 status codes by forwarding to error handler', function(){
      xhr.expectPOST('/req', 'MyData').respond(500, 'MyError');
      scope.$xhr('POST', '/req', 'MyData', callback);
      xhr.flush();
      var cb = $xhrError.mostRecentCall.args[0].callback;
      expect(typeof cb).toEqual($function);
      expect($xhrError).wasCalledWith(
          {url:'/req', method:'POST', data:'MyData', callback:cb},
          {status:500, body:'MyError'});
    });

    it('should handle exceptions in callback', function(){
      $log.error = jasmine.createSpy('$log.error');
      xhr.expectGET('/reqGET').respond('first');
      scope.$xhr('GET', '/reqGET', null, function(){ throw "MyException"; });
      xhr.flush();

      expect($log.error).wasCalledWith("MyException");
    });

    describe('bulk', function(){
      it('should collect requests', function(){
        scope.$xhr.bulk.urls["/"] = {match:/.*/};
        scope.$xhr.bulk('GET', '/req1', null, callback);
        scope.$xhr.bulk('POST', '/req2', {post:'data'}, callback);

        xhr.expectPOST('/', {
          requests:[{method:'GET',  url:'/req1', data: null},
                    {method:'POST', url:'/req2', data:{post:'data'} }]
        }).respond([
          {status:200, response:'first'},
          {status:200, response:'second'}
        ]);
        scope.$xhr.bulk.flush(function(){ log += 'DONE';});
        xhr.flush();
        expect(log).toEqual('"first";"second";DONE');
      });

      it('should handle non 200 status code by forwarding to error handler', function(){
        scope.$xhr.bulk.urls['/'] = {match:/.*/};
        scope.$xhr.bulk('GET', '/req1', null, callback);
        scope.$xhr.bulk('POST', '/req2', {post:'data'}, callback);

        xhr.expectPOST('/', {
          requests:[{method:'GET',  url:'/req1', data: null},
                    {method:'POST', url:'/req2', data:{post:'data'} }]
        }).respond([
          {status:404, response:'NotFound'},
          {status:200, response:'second'}
        ]);
        scope.$xhr.bulk.flush(function(){ log += 'DONE';});
        xhr.flush();

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
      beforeEach(function(){ cache = scope.$xhr.cache; });

      it('should cache requests', function(){
        xhr.expectGET('/url').respond('first');
        cache('GET', '/url', null, callback);
        xhr.flush();
        xhr.expectGET('/url').respond('ERROR');
        cache('GET', '/url', null, callback);
        xhr.flush();
        expect(log).toEqual('"first";"first";');
        cache('GET', '/url', null, callback, false);
        xhr.flush();
        expect(log).toEqual('"first";"first";"first";');
      });

      it('should first return cache request, then return server request', function(){
        xhr.expectGET('/url').respond('first');
        cache('GET', '/url', null, callback, true);
        xhr.flush();
        xhr.expectGET('/url').respond('ERROR');
        cache('GET', '/url', null, callback, true);
        expect(log).toEqual('"first";"first";');
        xhr.flush();
        expect(log).toEqual('"first";"first";"ERROR";');
      });

      it('should serve requests from cache', function(){
        cache.data.url = {value:'123'};
        cache('GET', 'url', null, callback);
        expect(log).toEqual('"123";');
        cache('GET', 'url', null, callback, false);
        expect(log).toEqual('"123";"123";');
      });

      it('should keep track of in flight requests and request only once', function(){
        scope.$xhr.bulk.urls['/bulk'] = {
          match:function(url){
            return url == '/url';
          }
        };
        xhr.expectPOST('/bulk', {
          requests:[{method:'GET',  url:'/url', data: null}]
        }).respond([
          {status:200, response:'123'}
        ]);
        cache('GET', '/url', null, callback);
        cache('GET', '/url', null, callback);
        cache.delegate.flush();
        xhr.flush();
        expect(log).toEqual('"123";"123";');
      });

      it('should clear cache on non GET', function(){
        xhr.expectPOST('abc', {}).respond({});
        cache.data.url = {value:123};
        cache('POST', 'abc', {});
        expect(cache.data.url).toBeUndefined();
      });
    });

  });


  describe('$cookies', function() {

    it('should provide access to existing cookies via object properties', function(){
      expect(scope.$cookies).toEqual({});

      scope.$browser.cookies('brandNew', 'cookie');
      scope.$browser.poll();

      expect(scope.$cookies).toEqual({'brandNew':'cookie'});
    });


    it('should create or update a cookie when a value is assigned to a property', function() {
      scope.$cookies.oatmealCookie = 'nom nom';
      scope.$eval();

      expect(scope.$browser.cookies()).toEqual({'oatmealCookie':'nom nom'});

      scope.$cookies.oatmealCookie = 'gone';
      scope.$eval();

      expect(scope.$browser.cookies()).toEqual({'oatmealCookie':'gone'});
    });


    it('should turn non-string into String when creating a cookie', function() {
      scope.$cookies.nonString = [1, 2, 3];
      scope.$eval();
      expect(scope.$browser.cookies()).toEqual({'nonString':'1,2,3'});
    });


    it('should drop any null or undefined properties', function() {
      scope.$cookies.nullVal = null;
      scope.$cookies.undefVal = undefined;
      scope.$eval();

      expect(scope.$browser.cookies()).toEqual({});
    });


    it('should remove a cookie when a $cookies property is deleted', function() {
      scope.$cookies.oatmealCookie = 'nom nom';
      scope.$eval();
      expect(scope.$browser.cookies()).toEqual({'oatmealCookie':'nom nom'});

      delete scope.$cookies.oatmealCookie;
      scope.$eval();

      expect(scope.$browser.cookies()).toEqual({});
    });
  });


  describe('$sessionStore', function() {

    it('should serialize objects to json', function() {
      scope.$sessionStore.put('objectCookie', {id: 123, name: 'blah'});
      scope.$eval(); //force eval in test
      expect(scope.$browser.cookies()).toEqual({'objectCookie': '{"id":123,"name":"blah"}'});
    });


    it('should deserialize json to object', function() {
      scope.$browser.cookies('objectCookie', '{"id":123,"name":"blah"}');
      scope.$browser.poll();
      expect(scope.$sessionStore.get('objectCookie')).toEqual({id: 123, name: 'blah'});
    });


    it('should delete objects from the store when remove is called', function() {
      scope.$sessionStore.put('gonner', { "I'll":"Be Back"});
      scope.$eval(); //force eval in test
      expect(scope.$browser.cookies()).toEqual({'gonner': '{"I\'ll":"Be Back"}'});
    });

  });
});
