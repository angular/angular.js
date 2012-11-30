'use strict';

describe('$route', function() {
  var $httpBackend;

  beforeEach(module(function() {
    return function(_$httpBackend_) {
      $httpBackend = _$httpBackend_;
      $httpBackend.when('GET', 'Chapter.html').respond('chapter');
      $httpBackend.when('GET', 'test.html').respond('test');
      $httpBackend.when('GET', 'foo.html').respond('foo');
      $httpBackend.when('GET', 'baz.html').respond('baz');
      $httpBackend.when('GET', 'bar.html').respond('bar');
      $httpBackend.when('GET', '404.html').respond('not found');
    };
  }));

  it('should route and fire change event', function() {
    var log = '',
        lastRoute,
        nextRoute;

    module(function($routeProvider) {
      $routeProvider.when('/Book/:book/Chapter/:chapter',
          {controller: noop, templateUrl: 'Chapter.html'});
      $routeProvider.when('/Blank', {});
    });
    inject(function($route, $location, $rootScope) {
      $rootScope.$on('$routeChangeStart', function(event, next, current) {
        log += 'before();';
        expect(current).toBe($route.current);
        lastRoute = current;
        nextRoute = next;
      });
      $rootScope.$on('$routeChangeSuccess', function(event, current, last) {
        log += 'after();';
        expect(current).toBe($route.current);
        expect(lastRoute).toBe(last);
        expect(nextRoute).toBe(current);
      });

      $location.path('/Book/Moby/Chapter/Intro').search('p=123');
      $rootScope.$digest();
      $httpBackend.flush();
      expect(log).toEqual('before();after();');
      expect($route.current.params).toEqual({book:'Moby', chapter:'Intro', p:'123'});

      log = '';
      $location.path('/Blank').search('ignore');
      $rootScope.$digest();
      expect(log).toEqual('before();after();');
      expect($route.current.params).toEqual({ignore:true});

      log = '';
      $location.path('/NONE');
      $rootScope.$digest();
      expect(log).toEqual('before();after();');
      expect($route.current).toEqual(null);
    });
  });


  it('should not change route when location is canceled', function() {
    module(function($routeProvider) {
      $routeProvider.when('/somePath', {template: 'some path'});
    });
    inject(function($route, $location, $rootScope, $log) {
      $rootScope.$on('$locationChangeStart', function(event) {
        $log.info('$locationChangeStart');
        event.preventDefault();
      });

      $rootScope.$on('$beforeRouteChange', function(event) {
        throw new Error('Should not get here');
      });

      $location.path('/somePath');
      $rootScope.$digest();

      expect($log.info.logs.shift()).toEqual(['$locationChangeStart']);
    });
  });


  it('should match a route that contains special chars in the path', function() {
    module(function($routeProvider) {
      $routeProvider.when('/$test.23/foo(bar)/:baz', {templateUrl: 'test.html'});
    });
    inject(function($route, $location, $rootScope) {

      $location.path('/test');
      $rootScope.$digest();
      expect($route.current).toBeUndefined();

      $location.path('/$testX23/foo(bar)/222');
      $rootScope.$digest();
      expect($route.current).toBeUndefined();

      $location.path('/$test.23/foo(bar)/222');
      $rootScope.$digest();
      expect($route.current).toBeDefined();

      $location.path('/$test.23/foo\\(bar)/222');
      $rootScope.$digest();
      expect($route.current).toBeUndefined();
    });
  });


  it('should change route even when only search param changes', function() {
    module(function($routeProvider) {
      $routeProvider.when('/test', {templateUrl: 'test.html'});
    });

    inject(function($route, $location, $rootScope) {
      var callback = jasmine.createSpy('onRouteChange');

      $rootScope.$on('$routeChangeStart', callback);
      $location.path('/test');
      $rootScope.$digest();
      callback.reset();

      $location.search({any: true});
      $rootScope.$digest();

      expect(callback).toHaveBeenCalled();
    });
  });


  it('should allow routes to be defined with just templates without controllers', function() {
    module(function($routeProvider) {
      $routeProvider.when('/foo', {templateUrl: 'foo.html'});
    });

    inject(function($route, $location, $rootScope) {
      var onChangeSpy = jasmine.createSpy('onChange');

      $rootScope.$on('$routeChangeStart', onChangeSpy);
      expect($route.current).toBeUndefined();
      expect(onChangeSpy).not.toHaveBeenCalled();

      $location.path('/foo');
      $rootScope.$digest();

      expect($route.current.templateUrl).toEqual('foo.html');
      expect($route.current.controller).toBeUndefined();
      expect(onChangeSpy).toHaveBeenCalled();
    });
  });


  it('should handle unknown routes with "otherwise" route definition', function() {
    function NotFoundCtrl() {}

    module(function($routeProvider){
      $routeProvider.when('/foo', {templateUrl: 'foo.html'});
      $routeProvider.otherwise({templateUrl: '404.html', controller: NotFoundCtrl});
    });

    inject(function($route, $location, $rootScope) {
      var onChangeSpy = jasmine.createSpy('onChange');

      $rootScope.$on('$routeChangeStart', onChangeSpy);
      expect($route.current).toBeUndefined();
      expect(onChangeSpy).not.toHaveBeenCalled();

      $location.path('/unknownRoute');
      $rootScope.$digest();

      expect($route.current.templateUrl).toBe('404.html');
      expect($route.current.controller).toBe(NotFoundCtrl);
      expect(onChangeSpy).toHaveBeenCalled();

      onChangeSpy.reset();
      $location.path('/foo');
      $rootScope.$digest();

      expect($route.current.templateUrl).toEqual('foo.html');
      expect($route.current.controller).toBeUndefined();
      expect(onChangeSpy).toHaveBeenCalled();
    });
  });


  it('should chain whens and otherwise', function() {
    module(function($routeProvider){
      $routeProvider.when('/foo', {templateUrl: 'foo.html'}).
                     otherwise({templateUrl: 'bar.html'}).
                     when('/baz', {templateUrl: 'baz.html'});
    });

    inject(function($route, $location, $rootScope) {
      $rootScope.$digest();
      expect($route.current.templateUrl).toBe('bar.html');

      $location.url('/baz');
      $rootScope.$digest();
      expect($route.current.templateUrl).toBe('baz.html');
    });
  });


  describe('events', function() {
    it('should not fire $after/beforeRouteChange during bootstrap (if no route)', function() {
      var routeChangeSpy = jasmine.createSpy('route change');

      module(function($routeProvider) {
        $routeProvider.when('/one', {}); // no otherwise defined
      });

      inject(function($rootScope, $route, $location) {
        $rootScope.$on('$routeChangeStart', routeChangeSpy);
        $rootScope.$on('$routeChangeSuccess', routeChangeSpy);

        $rootScope.$digest();
        expect(routeChangeSpy).not.toHaveBeenCalled();

        $location.path('/no-route-here');
        $rootScope.$digest();
        expect(routeChangeSpy).not.toHaveBeenCalled();
      });
    });

    it('should fire $routeChangeStart and resolve promises', function() {
      var deferA,
          deferB;

      module(function($provide, $routeProvider) {
        $provide.factory('b', function($q) {
          deferB = $q.defer();
          return deferB.promise;
        });
        $routeProvider.when('/path', { templateUrl: 'foo.html', resolve: {
          a: ['$q', function($q) {
            deferA = $q.defer();
            return deferA.promise;
          }],
          b: 'b'
        } });
      });

      inject(function($location, $route, $rootScope, $httpBackend) {
        var log = '';

        $httpBackend.expectGET('foo.html').respond('FOO');

        $location.path('/path');
        $rootScope.$digest();
        expect(log).toEqual('');
        $httpBackend.flush();
        expect(log).toEqual('');
        deferA.resolve();
        $rootScope.$digest();
        expect(log).toEqual('');
        deferB.resolve();
        $rootScope.$digest();
        expect($route.current.locals.$template).toEqual('FOO');
      });
    });


    it('should fire $routeChangeError event on resolution error', function() {
      var deferA;

      module(function($provide, $routeProvider) {
        $routeProvider.when('/path', { template: 'foo', resolve: {
          a: function($q) {
            deferA = $q.defer();
            return deferA.promise;
          }
        } });
      });

      inject(function($location, $route, $rootScope) {
        var log = '';

        $rootScope.$on('$routeChangeStart', function() { log += 'before();'; });
        $rootScope.$on('$routeChangeError', function(e, n, l, reason) { log += 'failed(' + reason + ');'; });

        $location.path('/path');
        $rootScope.$digest();
        expect(log).toEqual('before();');

        deferA.reject('MyError');
        $rootScope.$digest();
        expect(log).toEqual('before();failed(MyError);');
      });
    });


    it('should fetch templates', function() {
      module(function($routeProvider) {
        $routeProvider.
          when('/r1', { templateUrl: 'r1.html' }).
          when('/r2', { templateUrl: 'r2.html' });
      });

      inject(function($route, $httpBackend, $location, $rootScope) {
        var log = '';
        $rootScope.$on('$routeChangeStart', function(e, next) { log += '$before(' + next.templateUrl + ');'});
        $rootScope.$on('$routeChangeSuccess', function(e, next) { log += '$after(' + next.templateUrl + ');'});

        $httpBackend.expectGET('r1.html').respond('R1');
        $httpBackend.expectGET('r2.html').respond('R2');

        $location.path('/r1');
        $rootScope.$digest();
        expect(log).toBe('$before(r1.html);');

        $location.path('/r2');
        $rootScope.$digest();
        expect(log).toBe('$before(r1.html);$before(r2.html);');

        $httpBackend.flush();
        expect(log).toBe('$before(r1.html);$before(r2.html);$after(r2.html);');
        expect(log).not.toContain('$after(r1.html);');
      });
    });


    it('should not update $routeParams until $routeChangeSuccess', function() {
      module(function($routeProvider) {
        $routeProvider.
          when('/r1/:id', { templateUrl: 'r1.html' }).
          when('/r2/:id', { templateUrl: 'r2.html' });
      });

      inject(function($route, $httpBackend, $location, $rootScope, $routeParams) {
        var log = '';
        $rootScope.$on('$routeChangeStart', function(e, next) { log += '$before' + toJson($routeParams) + ';'});
        $rootScope.$on('$routeChangeSuccess', function(e, next) { log += '$after' + toJson($routeParams) + ';'});

        $httpBackend.whenGET('r1.html').respond('R1');
        $httpBackend.whenGET('r2.html').respond('R2');

        $location.path('/r1/1');
        $rootScope.$digest();
        expect(log).toBe('$before{};');
        $httpBackend.flush();
        expect(log).toBe('$before{};$after{"id":"1"};');

        log = '';

        $location.path('/r2/2');
        $rootScope.$digest();
        expect(log).toBe('$before{"id":"1"};');
        $httpBackend.flush();
        expect(log).toBe('$before{"id":"1"};$after{"id":"2"};');
      });
    });


    it('should drop in progress route change when new route change occurs', function() {
      module(function($routeProvider) {
        $routeProvider.
          when('/r1', { templateUrl: 'r1.html' }).
          when('/r2', { templateUrl: 'r2.html' });
      });

      inject(function($route, $httpBackend, $location, $rootScope) {
        var log = '';
        $rootScope.$on('$routeChangeStart', function(e, next) { log += '$before(' + next.templateUrl + ');'});
        $rootScope.$on('$routeChangeSuccess', function(e, next) { log += '$after(' + next.templateUrl + ');'});

        $httpBackend.expectGET('r1.html').respond('R1');
        $httpBackend.expectGET('r2.html').respond('R2');

        $location.path('/r1');
        $rootScope.$digest();
        expect(log).toBe('$before(r1.html);');

        $location.path('/r2');
        $rootScope.$digest();
        expect(log).toBe('$before(r1.html);$before(r2.html);');

        $httpBackend.flush();
        expect(log).toBe('$before(r1.html);$before(r2.html);$after(r2.html);');
        expect(log).not.toContain('$after(r1.html);');
      });
    });


    it('should drop in progress route change when new route change occurs and old fails', function() {
      module(function($routeProvider) {
        $routeProvider.
          when('/r1', { templateUrl: 'r1.html' }).
          when('/r2', { templateUrl: 'r2.html' });
      });

      inject(function($route, $httpBackend, $location, $rootScope) {
        var log = '';
        $rootScope.$on('$routeChangeError', function(e, next, last, error) {
          log += '$failed(' + next.templateUrl + ', ' + error.status + ');';
        });
        $rootScope.$on('$routeChangeStart', function(e, next) { log += '$before(' + next.templateUrl + ');'});
        $rootScope.$on('$routeChangeSuccess', function(e, next) { log += '$after(' + next.templateUrl + ');'});

        $httpBackend.expectGET('r1.html').respond(404, 'R1');
        $httpBackend.expectGET('r2.html').respond('R2');

        $location.path('/r1');
        $rootScope.$digest();
        expect(log).toBe('$before(r1.html);');

        $location.path('/r2');
        $rootScope.$digest();
        expect(log).toBe('$before(r1.html);$before(r2.html);');

        $httpBackend.flush();
        expect(log).toBe('$before(r1.html);$before(r2.html);$after(r2.html);');
        expect(log).not.toContain('$after(r1.html);');
      });
    });


    it('should catch local factory errors', function() {
      var myError = new Error('MyError');
      module(function($routeProvider, $exceptionHandlerProvider) {
        $exceptionHandlerProvider.mode('log');
        $routeProvider.when('/locals', {
          resolve: {
            a: function($q) {
              throw myError;
            }
          }
        });
      });

      inject(function($location, $route, $rootScope, $exceptionHandler) {
        $location.path('/locals');
        $rootScope.$digest();
        expect($exceptionHandler.errors).toEqual([myError]);
      });
    });
  });


  it('should match route with and without trailing slash', function() {
    module(function($routeProvider){
      $routeProvider.when('/foo', {templateUrl: 'foo.html'});
      $routeProvider.when('/bar/', {templateUrl: 'bar.html'});
    });

    inject(function($route, $location, $rootScope) {
      $location.path('/foo');
      $rootScope.$digest();
      expect($location.path()).toBe('/foo');
      expect($route.current.templateUrl).toBe('foo.html');

      $location.path('/foo/');
      $rootScope.$digest();
      expect($location.path()).toBe('/foo');
      expect($route.current.templateUrl).toBe('foo.html');

      $location.path('/bar');
      $rootScope.$digest();
      expect($location.path()).toBe('/bar/');
      expect($route.current.templateUrl).toBe('bar.html');

      $location.path('/bar/');
      $rootScope.$digest();
      expect($location.path()).toBe('/bar/');
      expect($route.current.templateUrl).toBe('bar.html');
    });
  });


  describe('redirection', function() {
    it('should support redirection via redirectTo property by updating $location', function() {
      module(function($routeProvider) {
        $routeProvider.when('/', {redirectTo: '/foo'});
        $routeProvider.when('/foo', {templateUrl: 'foo.html'});
        $routeProvider.when('/bar', {templateUrl: 'bar.html'});
        $routeProvider.when('/baz', {redirectTo: '/bar'});
        $routeProvider.otherwise({templateUrl: '404.html'});
      });

      inject(function($route, $location, $rootScope) {
        var onChangeSpy = jasmine.createSpy('onChange');

        $rootScope.$on('$routeChangeStart', onChangeSpy);
        expect($route.current).toBeUndefined();
        expect(onChangeSpy).not.toHaveBeenCalled();

        $location.path('/');
        $rootScope.$digest();
        expect($location.path()).toBe('/foo');
        expect($route.current.templateUrl).toBe('foo.html');
        expect(onChangeSpy.callCount).toBe(2);

        onChangeSpy.reset();
        $location.path('/baz');
        $rootScope.$digest();
        expect($location.path()).toBe('/bar');
        expect($route.current.templateUrl).toBe('bar.html');
        expect(onChangeSpy.callCount).toBe(2);
      });
    });


    it('should interpolate route vars in the redirected path from original path', function() {
      module(function($routeProvider) {
        $routeProvider.when('/foo/:id/foo/:subid/:extraId', {redirectTo: '/bar/:id/:subid/23'});
        $routeProvider.when('/bar/:id/:subid/:subsubid', {templateUrl: 'bar.html'});
      });

      inject(function($route, $location, $rootScope) {
        $location.path('/foo/id1/foo/subid3/gah');
        $rootScope.$digest();

        expect($location.path()).toEqual('/bar/id1/subid3/23');
        expect($location.search()).toEqual({extraId: 'gah'});
        expect($route.current.templateUrl).toEqual('bar.html');
      });
    });


    it('should interpolate route vars in the redirected path from original search', function() {
      module(function($routeProvider) {
        $routeProvider.when('/bar/:id/:subid/:subsubid', {templateUrl: 'bar.html'});
        $routeProvider.when('/foo/:id/:extra', {redirectTo: '/bar/:id/:subid/99'});
      });

      inject(function($route, $location, $rootScope) {
        $location.path('/foo/id3/eId').search('subid=sid1&appended=true');
        $rootScope.$digest();

        expect($location.path()).toEqual('/bar/id3/sid1/99');
        expect($location.search()).toEqual({appended: 'true', extra: 'eId'});
        expect($route.current.templateUrl).toEqual('bar.html');
      });
    });


    it('should allow custom redirectTo function to be used', function() {
      function customRedirectFn(routePathParams, path, search) {
        expect(routePathParams).toEqual({id: 'id3'});
        expect(path).toEqual('/foo/id3');
        expect(search).toEqual({ subid: 'sid1', appended: 'true' });
        return '/custom';
      }

      module(function($routeProvider){
        $routeProvider.when('/bar/:id/:subid/:subsubid', {templateUrl: 'bar.html'});
        $routeProvider.when('/foo/:id', {redirectTo: customRedirectFn});
      });

      inject(function($route, $location, $rootScope) {
        $location.path('/foo/id3').search('subid=sid1&appended=true');
        $rootScope.$digest();

        expect($location.path()).toEqual('/custom');
      });
    });


    it('should replace the url when redirecting',  function() {
      module(function($routeProvider) {
        $routeProvider.when('/bar/:id', {templateUrl: 'bar.html'});
        $routeProvider.when('/foo/:id/:extra', {redirectTo: '/bar/:id'});
      });
      inject(function($browser, $route, $location, $rootScope) {
        var $browserUrl = spyOnlyCallsWithArgs($browser, 'url').andCallThrough();

        $location.path('/foo/id3/eId');
        $rootScope.$digest();

        expect($location.path()).toEqual('/bar/id3');
        expect($browserUrl.mostRecentCall.args)
            .toEqual(['http://server/#/bar/id3?extra=eId', true]);
      });
    });
  });


  describe('reloadOnSearch', function() {
    it('should reload a route when reloadOnSearch is enabled and .search() changes', function() {
      var reloaded = jasmine.createSpy('route reload');

      module(function($routeProvider) {
        $routeProvider.when('/foo', {controller: noop});
      });

      inject(function($route, $location, $rootScope, $routeParams) {
        $rootScope.$on('$routeChangeStart', reloaded);
        $location.path('/foo');
        $rootScope.$digest();
        expect(reloaded).toHaveBeenCalled();
        expect($routeParams).toEqual({});
        reloaded.reset();

        // trigger reload
        $location.search({foo: 'bar'});
        $rootScope.$digest();
        expect(reloaded).toHaveBeenCalled();
        expect($routeParams).toEqual({foo:'bar'});
      });
    });


    it('should not reload a route when reloadOnSearch is disabled and only .search() changes', function() {
      var routeChange = jasmine.createSpy('route change'),
          routeUpdate = jasmine.createSpy('route update');

      module(function($routeProvider) {
        $routeProvider.when('/foo', {controller: noop, reloadOnSearch: false});
      });

      inject(function($route, $location, $rootScope) {
        $rootScope.$on('$routeChangeStart', routeChange);
        $rootScope.$on('$routeChangeSuccess', routeChange);
        $rootScope.$on('$routeUpdate', routeUpdate);

        expect(routeChange).not.toHaveBeenCalled();

        $location.path('/foo');
        $rootScope.$digest();
        expect(routeChange).toHaveBeenCalled();
        expect(routeChange.callCount).toBe(2);
        expect(routeUpdate).not.toHaveBeenCalled();
        routeChange.reset();

        // don't trigger reload
        $location.search({foo: 'bar'});
        $rootScope.$digest();
        expect(routeChange).not.toHaveBeenCalled();
        expect(routeUpdate).toHaveBeenCalled();
      });
    });


    it('should reload reloadOnSearch route when url differs only in route path param', function() {
      var routeChange = jasmine.createSpy('route change');

      module(function($routeProvider) {
        $routeProvider.when('/foo/:fooId', {controller: noop, reloadOnSearch: false});
      });

      inject(function($route, $location, $rootScope) {
        $rootScope.$on('$routeChangeStart', routeChange);
        $rootScope.$on('$routeChangeSuccess', routeChange);

        expect(routeChange).not.toHaveBeenCalled();

        $location.path('/foo/aaa');
        $rootScope.$digest();
        expect(routeChange).toHaveBeenCalled();
        expect(routeChange.callCount).toBe(2);
        routeChange.reset();

        $location.path('/foo/bbb');
        $rootScope.$digest();
        expect(routeChange).toHaveBeenCalled();
        expect(routeChange.callCount).toBe(2);
        routeChange.reset();

        $location.search({foo: 'bar'});
        $rootScope.$digest();
        expect(routeChange).not.toHaveBeenCalled();
      });
    });


    it('should update params when reloadOnSearch is disabled and .search() changes', function() {
      var routeParamsWatcher = jasmine.createSpy('routeParamsWatcher');

      module(function($routeProvider) {
        $routeProvider.when('/foo', {controller: noop});
        $routeProvider.when('/bar/:barId', {controller: noop, reloadOnSearch: false});
      });

      inject(function($route, $location, $rootScope, $routeParams) {
        $rootScope.$watch(function() {
          return $routeParams;
        }, function(value) {
          routeParamsWatcher(value);
        }, true);

        expect(routeParamsWatcher).not.toHaveBeenCalled();

        $location.path('/foo');
        $rootScope.$digest();
        expect(routeParamsWatcher).toHaveBeenCalledWith({});
        routeParamsWatcher.reset();

        // trigger reload
        $location.search({foo: 'bar'});
        $rootScope.$digest();
        expect(routeParamsWatcher).toHaveBeenCalledWith({foo: 'bar'});
        routeParamsWatcher.reset();

        $location.path('/bar/123').search({});
        $rootScope.$digest();
        expect(routeParamsWatcher).toHaveBeenCalledWith({barId: '123'});
        routeParamsWatcher.reset();

        // don't trigger reload
        $location.search({foo: 'bar'});
        $rootScope.$digest();
        expect(routeParamsWatcher).toHaveBeenCalledWith({barId: '123', foo: 'bar'});
      });
    });


    describe('reload', function() {

      it('should reload even if reloadOnSearch is false', function() {
        var routeChangeSpy = jasmine.createSpy('route change');

        module(function($routeProvider) {
          $routeProvider.when('/bar/:barId', {controller: noop, reloadOnSearch: false});
        });

        inject(function($route, $location, $rootScope, $routeParams) {
          $rootScope.$on('$routeChangeSuccess', routeChangeSpy);

          $location.path('/bar/123');
          $rootScope.$digest();
          expect($routeParams).toEqual({barId:'123'});
          expect(routeChangeSpy).toHaveBeenCalledOnce();
          routeChangeSpy.reset();

          $location.path('/bar/123').search('a=b');
          $rootScope.$digest();
          expect($routeParams).toEqual({barId:'123', a:'b'});
          expect(routeChangeSpy).not.toHaveBeenCalled();

          $route.reload();
          $rootScope.$digest();
          expect($routeParams).toEqual({barId:'123', a:'b'});
          expect(routeChangeSpy).toHaveBeenCalledOnce();
        });
      });
    });

    describe('advancedMatching', function() {

      it('should properly match path parts', function() {
        module(function($routeProvider) {
          $routeProvider.when('/foo/<path:subid>/<string:subsubid>', {templateUrl: 'foo.html'});
        });

        inject(function($route, $location, $rootScope) {
          $location.path('/foo/id3/eId/rest/of/url/');
          $rootScope.$digest();

          expect($location.path()).toEqual('/foo/id3/eId/rest/of/url');
          expect($route.current.params).toEqual({subid: 'id3/eId/rest/of', subsubid: 'url'});
          expect($route.current.templateUrl).toEqual('foo.html');
        });
      });

      it('should properly match trailing paths', function() {
        module(function($routeProvider) {
          $routeProvider.when('/bar/:id/<string:subid>/<path:subsubid>', {templateUrl: 'bar.html'});
        });

        inject(function($route, $location, $rootScope) {
          $location.path('/bar/id3/eId/rest/of/url/');
          $rootScope.$digest();

          expect($location.path()).toEqual('/bar/id3/eId/rest/of/url/');
          expect($route.current.params).toEqual({ id : 'id3', subid : 'eId', subsubid : 'rest/of/url/' });
          expect($route.current.templateUrl).toEqual('bar.html');
        });
      });

      it('should properly filter based on match type', function() {
        module(function($routeProvider) {
          $routeProvider.when('/bar/<int:subid>/:astring', {templateUrl: 'bar.html'});
        });

        inject(function($route, $location, $rootScope) {
          $location.path('/bar/word/trailing');
          $rootScope.$digest();

          expect($location.path()).toEqual('/bar/word/trailing');
          expect($route.current).not.toBeDefined();
        });
      });

      it('should properly resolve ambiguous urls in order', function() {
        module(function($routeProvider) {
          $routeProvider.when('/bar/<int:subid>/const', {templateUrl: 'bar.html'});
          $routeProvider.when('/bar/<int:subid>/:astring', {templateUrl: 'foo.html'});
        });

        inject(function($route, $location, $rootScope) {
          $location.path('/bar/500/const');
          $rootScope.$digest();

          expect($route.current.templateUrl).toEqual('bar.html');
        });
      });

    });

  });
});
