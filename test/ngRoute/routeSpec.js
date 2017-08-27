'use strict';

describe('$routeProvider', function() {
  var $routeProvider;

  beforeEach(module('ngRoute'));
  beforeEach(module(function(_$routeProvider_) {
    $routeProvider = _$routeProvider_;
    $routeProvider.when('/foo', {template: 'Hello, world!'});
  }));


  it('should support enabling/disabling automatic instantiation upon initial load',
    inject(function() {
      expect($routeProvider.eagerInstantiationEnabled(true)).toBe($routeProvider);
      expect($routeProvider.eagerInstantiationEnabled()).toBe(true);

      expect($routeProvider.eagerInstantiationEnabled(false)).toBe($routeProvider);
      expect($routeProvider.eagerInstantiationEnabled()).toBe(false);

      expect($routeProvider.eagerInstantiationEnabled(true)).toBe($routeProvider);
      expect($routeProvider.eagerInstantiationEnabled()).toBe(true);
    })
  );


  it('should automatically instantiate `$route` upon initial load', function() {
    inject(function($location, $rootScope) {
      $location.path('/foo');
      $rootScope.$digest();
    });

    inject(function($route) {
      expect($route.current).toBeDefined();
    });
  });


  it('should not automatically instantiate `$route` if disabled', function() {
    module(function($routeProvider) {
      $routeProvider.eagerInstantiationEnabled(false);
    });

    inject(function($location, $rootScope) {
      $location.path('/foo');
      $rootScope.$digest();
    });

    inject(function($route) {
      expect($route.current).toBeUndefined();
    });
  });
});


describe('$route', function() {
  var $httpBackend,
      element;

  beforeEach(module('ngRoute'));

  beforeEach(module(function() {
    return function(_$httpBackend_) {
      $httpBackend = _$httpBackend_;
      $httpBackend.when('GET', 'Chapter.html').respond('chapter');
      $httpBackend.when('GET', 'test.html').respond('test');
      $httpBackend.when('GET', 'foo.html').respond('foo');
      $httpBackend.when('GET', 'baz.html').respond('baz');
      $httpBackend.when('GET', 'bar.html').respond('bar');
      $httpBackend.when('GET', 'http://example.com/trusted-template.html').respond('cross domain trusted template');
      $httpBackend.when('GET', '404.html').respond('not found');
    };
  }));

  afterEach(function() {
    dealoc(element);
  });

  it('should allow cancellation via $locationChangeStart via $routeChangeStart', function() {
    module(function($routeProvider) {
      $routeProvider.when('/Edit', {
        id: 'edit', template: 'Some edit functionality'
      });
      $routeProvider.when('/Home', {
        id: 'home'
      });
    });
    module(provideLog);
    inject(function($route, $location, $rootScope, $compile, log) {
      $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (next.id === 'home' && current.scope.unsavedChanges) {
          event.preventDefault();
        }
      });
      element = $compile('<div><div ng-view></div></div>')($rootScope);
      $rootScope.$apply(function() {
        $location.path('/Edit');
      });
      $rootScope.$on('$routeChangeSuccess', log.fn('routeChangeSuccess'));
      $rootScope.$on('$locationChangeSuccess', log.fn('locationChangeSuccess'));

      // aborted route change
      $rootScope.$apply(function() {
        $route.current.scope.unsavedChanges = true;
      });
      $rootScope.$apply(function() {
        $location.path('/Home');
      });
      expect($route.current.id).toBe('edit');
      expect($location.path()).toBe('/Edit');
      expect(log).toEqual([]);

      // successful route change
      $rootScope.$apply(function() {
        $route.current.scope.unsavedChanges = false;
      });
      $rootScope.$apply(function() {
        $location.path('/Home');
      });
      expect($route.current.id).toBe('home');
      expect($location.path()).toBe('/Home');
      expect(log).toEqual(['locationChangeSuccess', 'routeChangeSuccess']);
    });
  });

  it('should allow redirects while handling $routeChangeStart', function() {
    module(function($routeProvider) {
      $routeProvider.when('/some', {
        id: 'some', template: 'Some functionality'
      });
      $routeProvider.when('/redirect', {
        id: 'redirect'
      });
    });
    module(provideLog);
    inject(function($route, $location, $rootScope, $compile, log) {
      $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (next.id === 'some') {
          $location.path('/redirect');
        }
      });
      $compile('<div><div ng-view></div></div>')($rootScope);
      $rootScope.$on('$routeChangeStart', log.fn('routeChangeStart'));
      $rootScope.$on('$routeChangeError', log.fn('routeChangeError'));
      $rootScope.$on('$routeChangeSuccess', log.fn('routeChangeSuccess'));
      $rootScope.$apply(function() {
        $location.path('/some');
      });

      expect($route.current.id).toBe('redirect');
      expect($location.path()).toBe('/redirect');
      expect(log).toEqual(['routeChangeStart', 'routeChangeStart', 'routeChangeSuccess']);
    });
  });

  it('should route and fire change event', function() {
    var log = '',
        lastRoute,
        nextRoute;

    module(function($routeProvider) {
      $routeProvider.when('/Book/:book/Chapter/:chapter',
          {controller: angular.noop, templateUrl: 'Chapter.html'});
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
      expect($route.current).toEqual(undefined);
    });
  });

  it('should route and fire change event when catch-all params are used', function() {
    var log = '',
        lastRoute,
        nextRoute;

    module(function($routeProvider) {
      $routeProvider.when('/Book1/:book/Chapter/:chapter/:highlight*/edit',
          {controller: angular.noop, templateUrl: 'Chapter.html'});
      $routeProvider.when('/Book2/:book/:highlight*/Chapter/:chapter',
          {controller: angular.noop, templateUrl: 'Chapter.html'});
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

      $location.path('/Book1/Moby/Chapter/Intro/one/edit').search('p=123');
      $rootScope.$digest();
      $httpBackend.flush();
      expect(log).toEqual('before();after();');
      expect($route.current.params).toEqual({book:'Moby', chapter:'Intro', highlight:'one', p:'123'});

      log = '';
      $location.path('/Blank').search('ignore');
      $rootScope.$digest();
      expect(log).toEqual('before();after();');
      expect($route.current.params).toEqual({ignore:true});

      log = '';
      $location.path('/Book1/Moby/Chapter/Intro/one/two/edit').search('p=123');
      $rootScope.$digest();
      expect(log).toEqual('before();after();');
      expect($route.current.params).toEqual({book:'Moby', chapter:'Intro', highlight:'one/two', p:'123'});

      log = '';
      $location.path('/Book2/Moby/one/two/Chapter/Intro').search('p=123');
      $rootScope.$digest();
      expect(log).toEqual('before();after();');
      expect($route.current.params).toEqual({book:'Moby', chapter:'Intro', highlight:'one/two', p:'123'});

      log = '';
      $location.path('/NONE');
      $rootScope.$digest();
      expect(log).toEqual('before();after();');
      expect($route.current).toEqual(undefined);
    });
  });


  it('should route and fire change event correctly whenever the case insensitive flag is utilized', function() {
    var log = '',
        lastRoute,
        nextRoute;

    module(function($routeProvider) {
      $routeProvider.when('/Book1/:book/Chapter/:chapter/:highlight*/edit',
          {controller: angular.noop, templateUrl: 'Chapter.html', caseInsensitiveMatch: true});
      $routeProvider.when('/Book2/:book/:highlight*/Chapter/:chapter',
          {controller: angular.noop, templateUrl: 'Chapter.html'});
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

      $location.path('/Book1/Moby/Chapter/Intro/one/edit').search('p=123');
      $rootScope.$digest();
      $httpBackend.flush();
      expect(log).toEqual('before();after();');
      expect($route.current.params).toEqual({book:'Moby', chapter:'Intro', highlight:'one', p:'123'});

      log = '';
      $location.path('/BOOK1/Moby/CHAPTER/Intro/one/EDIT').search('p=123');
      $rootScope.$digest();
      expect(log).toEqual('before();after();');
      expect($route.current.params).toEqual({book:'Moby', chapter:'Intro', highlight:'one', p:'123'});

      log = '';
      $location.path('/Blank').search('ignore');
      $rootScope.$digest();
      expect(log).toEqual('before();after();');
      expect($route.current.params).toEqual({ignore:true});

      log = '';
      $location.path('/BLANK');
      $rootScope.$digest();
      expect(log).toEqual('before();after();');
      expect($route.current).toEqual(undefined);

      log = '';
      $location.path('/Book2/Moby/one/two/Chapter/Intro').search('p=123');
      $rootScope.$digest();
      expect(log).toEqual('before();after();');
      expect($route.current.params).toEqual({book:'Moby', chapter:'Intro', highlight:'one/two', p:'123'});

      log = '';
      $location.path('/BOOK2/Moby/one/two/CHAPTER/Intro').search('p=123');
      $rootScope.$digest();
      expect(log).toEqual('before();after();');
      expect($route.current).toEqual(undefined);
    });
  });

  it('should allow configuring caseInsensitiveMatch on the route provider level', function() {
    module(function($routeProvider) {
      $routeProvider.caseInsensitiveMatch = true;
      $routeProvider.when('/Blank', {template: 'blank'});
      $routeProvider.otherwise({template: 'other'});
    });
    inject(function($route, $location, $rootScope) {
      $location.path('/bLaNk');
      $rootScope.$digest();
      expect($route.current.template).toBe('blank');
    });
  });

  it('should allow overriding provider\'s caseInsensitiveMatch setting on the route level', function() {
    module(function($routeProvider) {
      $routeProvider.caseInsensitiveMatch = true;
      $routeProvider.when('/Blank', {template: 'blank', caseInsensitiveMatch: false});
      $routeProvider.otherwise({template: 'other'});
    });
    inject(function($route, $location, $rootScope) {
      $location.path('/bLaNk');
      $rootScope.$digest();
      expect($route.current.template).toBe('other');
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

      $rootScope.$on('$routeChangeSuccess', function(event) {
        throw new Error('Should not get here');
      });

      $location.path('/somePath');
      $rootScope.$digest();

      expect($log.info.logs.shift()).toEqual(['$locationChangeStart']);
    });
  });


  describe('should match a route that contains special chars in the path', function() {
    beforeEach(module(function($routeProvider) {
      $routeProvider.when('/$test.23/foo*(bar)/:baz', {templateUrl: 'test.html'});
    }));

    it('matches the full path', inject(function($route, $location, $rootScope) {
      $location.path('/test');
      $rootScope.$digest();
      expect($route.current).toBeUndefined();
    }));

    it('matches literal .', inject(function($route, $location, $rootScope) {
      $location.path('/$testX23/foo*(bar)/222');
      $rootScope.$digest();
      expect($route.current).toBeUndefined();
    }));

    it('matches literal *', inject(function($route, $location, $rootScope) {
      $location.path('/$test.23/foooo(bar)/222');
      $rootScope.$digest();
      expect($route.current).toBeUndefined();
    }));

    it('treats backslashes normally', inject(function($route, $location, $rootScope) {
      $location.path('/$test.23/foo*\\(bar)/222');
      $rootScope.$digest();
      expect($route.current).toBeUndefined();
    }));

    it('matches a URL with special chars', inject(function($route, $location, $rootScope) {
      $location.path('/$test.23/foo*(bar)/~!@#$%^&*()_+=-`');
      $rootScope.$digest();
      expect($route.current).toBeDefined();
    }));

    it('should use route params inherited from prototype chain', function() {
      function BaseRoute() {}
      BaseRoute.prototype.templateUrl = 'foo.html';

      module(function($routeProvider) {
        $routeProvider.when('/foo', new BaseRoute());
      });

      inject(function($route, $location, $rootScope) {
        $location.path('/foo');
        $rootScope.$digest();
        expect($route.current.templateUrl).toBe('foo.html');
      });
    });
  });


  describe('should match a route that contains optional params in the path', function() {
    beforeEach(module(function($routeProvider) {
      $routeProvider.when('/test/:opt?/:baz/edit', {templateUrl: 'test.html'});
    }));

    it('matches a URL with optional params', inject(function($route, $location, $rootScope) {
      $location.path('/test/optValue/bazValue/edit');
      $rootScope.$digest();
      expect($route.current).toBeDefined();
    }));

    it('matches a URL without optional param', inject(function($route, $location, $rootScope) {
      $location.path('/test//bazValue/edit');
      $rootScope.$digest();
      expect($route.current).toBeDefined();
    }));

    it('not match a URL with a required param', inject(function($route, $location, $rootScope) {
      $location.path('///edit');
      $rootScope.$digest();
      expect($route.current).not.toBeDefined();
    }));
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
      callback.calls.reset();

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


  it('should chain whens and otherwise', function() {
    module(function($routeProvider) {
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


  it('should skip routes with incomplete params', function() {
    module(function($routeProvider) {
      $routeProvider
        .otherwise({template: 'other'})
        .when('/pages/:page/:comment*', {template: 'comment'})
        .when('/pages/:page', {template: 'page'})
        .when('/pages', {template: 'index'})
        .when('/foo/', {template: 'foo'})
        .when('/foo/:bar', {template: 'bar'})
        .when('/foo/:bar*/:baz', {template: 'baz'});
    });

    inject(function($route, $location, $rootScope) {
      $location.url('/pages/');
      $rootScope.$digest();
      expect($route.current.template).toBe('index');

      $location.url('/pages/page/');
      $rootScope.$digest();
      expect($route.current.template).toBe('page');

      $location.url('/pages/page/1/');
      $rootScope.$digest();
      expect($route.current.template).toBe('comment');

      $location.url('/foo/');
      $rootScope.$digest();
      expect($route.current.template).toBe('foo');

      $location.url('/foo/bar/');
      $rootScope.$digest();
      expect($route.current.template).toBe('bar');

      $location.url('/foo/bar/baz/');
      $rootScope.$digest();
      expect($route.current.template).toBe('baz');

      $location.url('/something/');
      $rootScope.$digest();
      expect($route.current.template).toBe('other');
    });
  });


  describe('otherwise', function() {

    it('should handle unknown routes with "otherwise" route definition', function() {
      function NotFoundCtrl() {}

      module(function($routeProvider) {
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

        onChangeSpy.calls.reset();
        $location.path('/foo');
        $rootScope.$digest();

        expect($route.current.templateUrl).toEqual('foo.html');
        expect($route.current.controller).toBeUndefined();
        expect(onChangeSpy).toHaveBeenCalled();
      });
    });


    it('should update $route.current and $route.next when default route is matched', function() {
      module(function($routeProvider) {
        $routeProvider.when('/foo', {templateUrl: 'foo.html'});
        $routeProvider.otherwise({templateUrl: '404.html'});
      });

      inject(function($route, $location, $rootScope) {
        var currentRoute, nextRoute,
            onChangeSpy = jasmine.createSpy('onChange').and.callFake(function(e, next) {
          currentRoute = $route.current;
          nextRoute = next;
        });


        // init
        $rootScope.$on('$routeChangeStart', onChangeSpy);
        expect($route.current).toBeUndefined();
        expect(onChangeSpy).not.toHaveBeenCalled();


        // match otherwise route
        $location.path('/unknownRoute');
        $rootScope.$digest();

        expect(currentRoute).toBeUndefined();
        expect(nextRoute.templateUrl).toBe('404.html');
        expect($route.current.templateUrl).toBe('404.html');
        expect(onChangeSpy).toHaveBeenCalled();
        onChangeSpy.calls.reset();

        // match regular route
        $location.path('/foo');
        $rootScope.$digest();

        expect(currentRoute.templateUrl).toBe('404.html');
        expect(nextRoute.templateUrl).toBe('foo.html');
        expect($route.current.templateUrl).toEqual('foo.html');
        expect(onChangeSpy).toHaveBeenCalled();
        onChangeSpy.calls.reset();

        // match otherwise route again
        $location.path('/anotherUnknownRoute');
        $rootScope.$digest();

        expect(currentRoute.templateUrl).toBe('foo.html');
        expect(nextRoute.templateUrl).toBe('404.html');
        expect($route.current.templateUrl).toEqual('404.html');
        expect(onChangeSpy).toHaveBeenCalled();
      });
    });


    it('should interpret a string as a redirect route', function() {
      module(function($routeProvider) {
        $routeProvider.when('/foo', {templateUrl: 'foo.html'});
        $routeProvider.when('/baz', {templateUrl: 'baz.html'});
        $routeProvider.otherwise('/foo');
      });

      inject(function($route, $location, $rootScope) {
        $location.path('/unknownRoute');
        $rootScope.$digest();

        expect($location.path()).toBe('/foo');
        expect($route.current.templateUrl).toBe('foo.html');
      });
    });
  });


  describe('events', function() {
    it('should not fire $routeChangeStart/Success during bootstrap (if no route)', function() {
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

        $location.path('/one');
        $rootScope.$digest();
        expect(routeChangeSpy).toHaveBeenCalled();
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
        $rootScope.$on('$routeChangeStart', function(e, next) { log += '$before(' + next.templateUrl + ');'; });
        $rootScope.$on('$routeChangeSuccess', function(e, next) { log += '$after(' + next.templateUrl + ');'; });

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

    it('should NOT load cross domain templates by default', function() {
      module(function($routeProvider) {
        $routeProvider.when('/foo', { templateUrl: 'http://example.com/foo.html' });
      });

      inject(function($route, $location, $rootScope) {
        var onError = jasmine.createSpy('onError');
        var onSuccess = jasmine.createSpy('onSuccess');

        $rootScope.$on('$routeChangeError', onError);
        $rootScope.$on('$routeChangeSuccess', onSuccess);

        $location.path('/foo');
        $rootScope.$digest();

        expect(onSuccess).not.toHaveBeenCalled();
        expect(onError).toHaveBeenCalled();
        expect(onError.calls.mostRecent().args[3]).toEqualMinErr('$sce', 'insecurl',
            'Blocked loading resource from url not allowed by $sceDelegate policy.  ' +
            'URL: http://example.com/foo.html');
      });
    });

    it('should load cross domain templates that are trusted', function() {
      module(function($routeProvider, $sceDelegateProvider) {
        $routeProvider.when('/foo', { templateUrl: 'http://example.com/foo.html' });
        $sceDelegateProvider.resourceUrlWhitelist([/^http:\/\/example\.com\/foo\.html$/]);
      });

      inject(function($route, $location, $rootScope) {
        $httpBackend.whenGET('http://example.com/foo.html').respond('FOO BODY');
        $location.path('/foo');
        $rootScope.$digest();
        $httpBackend.flush();
        expect($route.current.locals.$template).toEqual('FOO BODY');
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
        $rootScope.$on('$routeChangeStart', function(e, next) { log += '$before' + angular.toJson($routeParams) + ';'; });
        $rootScope.$on('$routeChangeSuccess', function(e, next) { log += '$after' + angular.toJson($routeParams) + ';'; });

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
        $rootScope.$on('$routeChangeStart', function(e, next) { log += '$before(' + next.templateUrl + ');'; });
        $rootScope.$on('$routeChangeSuccess', function(e, next) { log += '$after(' + next.templateUrl + ');'; });

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


    it('should throw an error when a template is not found', function() {
      module(function($routeProvider, $exceptionHandlerProvider) {
        $exceptionHandlerProvider.mode('log');
        $routeProvider.
          when('/r1', { templateUrl: 'r1.html' }).
          when('/r2', { templateUrl: 'r2.html' }).
          when('/r3', { templateUrl: 'r3.html' });
      });

      inject(function($route, $httpBackend, $location, $rootScope, $exceptionHandler) {
        $httpBackend.expectGET('r1.html').respond(404, 'R1');
        $location.path('/r1');
        $rootScope.$digest();

        $httpBackend.flush();
        expect($exceptionHandler.errors.pop()).
            toEqualMinErr('$compile', 'tpload', 'Failed to load template: r1.html');

        $httpBackend.expectGET('r2.html').respond('');
        $location.path('/r2');
        $rootScope.$digest();

        $httpBackend.flush();
        expect($exceptionHandler.errors.length).toBe(0);

        $httpBackend.expectGET('r3.html').respond('abc');
        $location.path('/r3');
        $rootScope.$digest();

        $httpBackend.flush();
        expect($exceptionHandler.errors.length).toBe(0);
      });
    });


    it('should catch local factory errors', function() {
      var myError = new Error('MyError');
      module(function($routeProvider) {
        $routeProvider.when('/locals', {
          resolve: {
            a: function($q) {
              throw myError;
            }
          }
        });
      });

      inject(function($location, $route, $rootScope) {
        spyOn($rootScope, '$broadcast').and.callThrough();

        $location.path('/locals');
        $rootScope.$digest();

        expect($rootScope.$broadcast).toHaveBeenCalledWith(
            '$routeChangeError', jasmine.any(Object), undefined, myError);
      });
    });
  });


  it('should match route with and without trailing slash', function() {
    module(function($routeProvider) {
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


  it('should not get affected by modifying the route definition object after route registration',
    function() {
      module(function($routeProvider) {
        var rdo = {};

        rdo.templateUrl = 'foo.html';
        $routeProvider.when('/foo', rdo);

        rdo.templateUrl = 'bar.html';
        $routeProvider.when('/bar', rdo);
      });

      inject(function($location, $rootScope, $route) {
        $location.path('/bar');
        $rootScope.$digest();
        expect($location.path()).toBe('/bar');
        expect($route.current.templateUrl).toBe('bar.html');

        $location.path('/foo');
        $rootScope.$digest();
        expect($location.path()).toBe('/foo');
        expect($route.current.templateUrl).toBe('foo.html');
      });
    }
  );


  it('should use the property values of the passed in route definition object directly',
    function() {
      var $routeProvider;

      module(function(_$routeProvider_) {
        $routeProvider = _$routeProvider_;
      });

      inject(function($location, $rootScope, $route, $sce) {
        var sceWrappedUrl = $sce.trustAsResourceUrl('foo.html');
        $routeProvider.when('/foo', {templateUrl: sceWrappedUrl});

        $location.path('/foo');
        $rootScope.$digest();
        expect($location.path()).toBe('/foo');
        expect($route.current.templateUrl).toBe(sceWrappedUrl);
      });
    }
  );


  it('should support custom `$sce` implementations', function() {
    function MySafeResourceUrl(val) {
      var self = this;
      this._val = val;
      this.getVal = function() {
        return (this !== self) ? null : this._val;
      };
    }

    var $routeProvider;

    module(function($provide, _$routeProvider_) {
      $routeProvider = _$routeProvider_;

      $provide.decorator('$sce', function($delegate) {
        function getVal(v) { return v.getVal ? v.getVal() : v; }
        $delegate.trustAsResourceUrl = function(url) { return new MySafeResourceUrl(url); };
        $delegate.getTrustedResourceUrl = function(v) { return getVal(v); };
        $delegate.valueOf = function(v) { return getVal(v); };
        return $delegate;
      });
    });

    inject(function($location, $rootScope, $route, $sce) {
      $routeProvider.when('/foo', {templateUrl: $sce.trustAsResourceUrl('foo.html')});

      $location.path('/foo');
      $rootScope.$digest();
      expect($location.path()).toBe('/foo');
      expect($sce.valueOf($route.current.templateUrl)).toBe('foo.html');
    });
  });


  describe('redirection', function() {
    describe('via `redirectTo`', function() {
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
          expect(onChangeSpy).toHaveBeenCalledTimes(2);

          onChangeSpy.calls.reset();
          $location.path('/baz');
          $rootScope.$digest();
          expect($location.path()).toBe('/bar');
          expect($route.current.templateUrl).toBe('bar.html');
          expect(onChangeSpy).toHaveBeenCalledTimes(2);
        });
      });


      it('should interpolate route vars in the redirected path from original path', function() {
        module(function($routeProvider) {
          $routeProvider.when('/foo/:id/foo/:subid/:extraId', {redirectTo: '/bar/:id/:subid/23'});
          $routeProvider.when('/bar/:id/:subid/:subsubid', {templateUrl: 'bar.html'});
          $routeProvider.when('/baz/:id/:path*', {redirectTo: '/path/:path/:id'});
          $routeProvider.when('/path/:path*/:id', {templateUrl: 'foo.html'});
        });

        inject(function($route, $location, $rootScope) {
          $location.path('/foo/id1/foo/subid3/gah');
          $rootScope.$digest();

          expect($location.path()).toEqual('/bar/id1/subid3/23');
          expect($location.search()).toEqual({extraId: 'gah'});
          expect($route.current.templateUrl).toEqual('bar.html');

          $location.path('/baz/1/foovalue/barvalue');
          $rootScope.$digest();
          expect($location.path()).toEqual('/path/foovalue/barvalue/1');
          expect($route.current.templateUrl).toEqual('foo.html');
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


      it('should properly process route params which are both eager and optional', function() {
        module(function($routeProvider) {
          $routeProvider.when('/foo/:param1*?/:param2', {templateUrl: 'foo.html'});
        });

        inject(function($location, $rootScope, $route) {
          $location.path('/foo/bar1/bar2/bar3/baz');
          $rootScope.$digest();

          expect($location.path()).toEqual('/foo/bar1/bar2/bar3/baz');
          expect($route.current.params.param1).toEqual('bar1/bar2/bar3');
          expect($route.current.params.param2).toEqual('baz');
          expect($route.current.templateUrl).toEqual('foo.html');

          $location.path('/foo/baz');
          $rootScope.$digest();

          expect($location.path()).toEqual('/foo/baz');
          expect($route.current.params.param1).toEqual(undefined);
          expect($route.current.params.param2).toEqual('baz');
          expect($route.current.templateUrl).toEqual('foo.html');

        });
      });


      it('should properly interpolate optional and eager route vars ' +
         'when redirecting from path with trailing slash', function() {
        module(function($routeProvider) {
          $routeProvider.when('/foo/:id?/:subid?', {templateUrl: 'foo.html'});
          $routeProvider.when('/bar/:id*/:subid', {templateUrl: 'bar.html'});
        });

        inject(function($location, $rootScope, $route) {
          $location.path('/foo/id1/subid2/');
          $rootScope.$digest();

          expect($location.path()).toEqual('/foo/id1/subid2');
          expect($route.current.templateUrl).toEqual('foo.html');

          $location.path('/bar/id1/extra/subid2/');
          $rootScope.$digest();

          expect($location.path()).toEqual('/bar/id1/extra/subid2');
          expect($route.current.templateUrl).toEqual('bar.html');
        });
      });


      it('should allow custom redirectTo function to be used', function() {
        function customRedirectFn(routePathParams, path, search) {
          expect(routePathParams).toEqual({id: 'id3'});
          expect(path).toEqual('/foo/id3');
          expect(search).toEqual({subid: 'sid1', appended: 'true'});
          return '/custom';
        }

        module(function($routeProvider) {
          $routeProvider.when('/foo/:id', {redirectTo: customRedirectFn});
        });

        inject(function($route, $location, $rootScope) {
          $location.path('/foo/id3').search('subid=sid1&appended=true');
          $rootScope.$digest();

          expect($location.path()).toEqual('/custom');
        });
      });


      it('should broadcast `$routeChangeError` when redirectTo throws', function() {
        var error = new Error('Test');

        module(function($routeProvider) {
          $routeProvider.when('/foo', {redirectTo: function() { throw error; }});
        });

        inject(function($exceptionHandler, $location, $rootScope, $route) {
          spyOn($rootScope, '$broadcast').and.callThrough();

          $location.path('/foo');
          $rootScope.$digest();

          var lastCallArgs = $rootScope.$broadcast.calls.mostRecent().args;
          expect(lastCallArgs[0]).toBe('$routeChangeError');
          expect(lastCallArgs[3]).toBe(error);
        });
      });


      it('should replace the url when redirecting',  function() {
        module(function($routeProvider) {
          $routeProvider.when('/bar/:id', {templateUrl: 'bar.html'});
          $routeProvider.when('/foo/:id/:extra', {redirectTo: '/bar/:id'});
        });
        inject(function($browser, $route, $location, $rootScope) {
          var $browserUrl = spyOnlyCallsWithArgs($browser, 'url').and.callThrough();

          $location.path('/foo/id3/eId');
          $rootScope.$digest();

          expect($location.path()).toEqual('/bar/id3');
          expect($browserUrl.calls.mostRecent().args)
              .toEqual(['http://server/#!/bar/id3?extra=eId', true, null]);
        });
      });


      it('should not process route bits', function() {
        var firstController = jasmine.createSpy('first controller spy');
        var firstTemplate = jasmine.createSpy('first template spy').and.returnValue('redirected view');
        var firstResolve = jasmine.createSpy('first resolve spy');
        var secondController = jasmine.createSpy('second controller spy');
        var secondTemplate = jasmine.createSpy('second template spy').and.returnValue('redirected view');
        var secondResolve = jasmine.createSpy('second resolve spy');
        module(function($routeProvider) {
          $routeProvider.when('/redirect', {
            template: firstTemplate,
            redirectTo: '/redirected',
            resolve: { value: firstResolve },
            controller: firstController
          });
          $routeProvider.when('/redirected', {
            template: secondTemplate,
            resolve: { value: secondResolve },
            controller: secondController
          });
        });
        inject(function($route, $location, $rootScope, $compile) {
          var element = $compile('<div><ng-view></ng-view></div>')($rootScope);
          $location.path('/redirect');
          $rootScope.$digest();

          expect(firstController).not.toHaveBeenCalled();
          expect(firstTemplate).not.toHaveBeenCalled();
          expect(firstResolve).not.toHaveBeenCalled();

          expect(secondController).toHaveBeenCalled();
          expect(secondTemplate).toHaveBeenCalled();
          expect(secondResolve).toHaveBeenCalled();

          dealoc(element);
        });
      });


      it('should not redirect transition if `redirectTo` returns `undefined`', function() {
        var controller = jasmine.createSpy('first controller spy');
        var templateFn = jasmine.createSpy('first template spy').and.returnValue('redirected view');
        module(function($routeProvider) {
          $routeProvider.when('/redirect/to/undefined', {
            template: templateFn,
            redirectTo: function() {},
            controller: controller
          });
        });
        inject(function($route, $location, $rootScope, $compile) {
          var element = $compile('<div><ng-view></ng-view></div>')($rootScope);
          $location.path('/redirect/to/undefined');
          $rootScope.$digest();
          expect(controller).toHaveBeenCalled();
          expect(templateFn).toHaveBeenCalled();
          expect($location.path()).toEqual('/redirect/to/undefined');
          dealoc(element);
        });
      });
    });

    describe('via `resolveRedirectTo`', function() {
      var $compile;
      var $location;
      var $rootScope;
      var $route;

      beforeEach(module(function() {
        return function(_$compile_, _$location_, _$rootScope_, _$route_) {
          $compile = _$compile_;
          $location = _$location_;
          $rootScope = _$rootScope_;
          $route = _$route_;
        };
      }));


      it('should be ignored if `redirectTo` is also present', function() {
        var newUrl;
        var getNewUrl = function() { return newUrl; };

        var resolveRedirectToSpy = jasmine.createSpy('resolveRedirectTo').and.returnValue('/bar');
        var redirectToSpy = jasmine.createSpy('redirectTo').and.callFake(getNewUrl);
        var templateSpy = jasmine.createSpy('template').and.returnValue('Foo');

        module(function($routeProvider) {
          $routeProvider.
            when('/foo', {
              resolveRedirectTo: resolveRedirectToSpy,
              redirectTo: redirectToSpy,
              template: templateSpy
            }).
            when('/bar', {template: 'Bar'}).
            when('/baz', {template: 'Baz'});
        });

        inject(function() {
          newUrl = '/baz';
          $location.path('/foo');
          $rootScope.$digest();

          expect($location.path()).toBe('/baz');
          expect($route.current.template).toBe('Baz');
          expect(resolveRedirectToSpy).not.toHaveBeenCalled();
          expect(redirectToSpy).toHaveBeenCalled();
          expect(templateSpy).not.toHaveBeenCalled();

          redirectToSpy.calls.reset();

          newUrl = undefined;
          $location.path('/foo');
          $rootScope.$digest();

          expect($location.path()).toBe('/foo');
          expect($route.current.template).toBe(templateSpy);
          expect(resolveRedirectToSpy).not.toHaveBeenCalled();
          expect(redirectToSpy).toHaveBeenCalled();
          expect(templateSpy).toHaveBeenCalled();
        });
      });


      it('should redirect to the returned url', function() {
        module(function($routeProvider) {
          $routeProvider.
            when('/foo', {resolveRedirectTo: function() { return '/bar?baz=qux'; }}).
            when('/bar', {template: 'Bar'});
        });

        inject(function() {
          $location.path('/foo');
          $rootScope.$digest();

          expect($location.path()).toBe('/bar');
          expect($location.search()).toEqual({baz: 'qux'});
          expect($route.current.template).toBe('Bar');
        });
      });


      it('should support returning a promise', function() {
        module(function($routeProvider) {
          $routeProvider.
            when('/foo', {resolveRedirectTo: function($q) { return $q.resolve('/bar'); }}).
            when('/bar', {template: 'Bar'});
        });

        inject(function() {
          $location.path('/foo');
          $rootScope.$digest();

          expect($location.path()).toBe('/bar');
          expect($route.current.template).toBe('Bar');
        });
      });


      it('should support dependency injection', function() {
        module(function($provide, $routeProvider) {
          $provide.value('nextRoute', '/bar');

          $routeProvider.
            when('/foo', {
              resolveRedirectTo: function(nextRoute) {
                return nextRoute;
              }
            });
        });

        inject(function() {
          $location.path('/foo');
          $rootScope.$digest();

          expect($location.path()).toBe('/bar');
        });
      });


      it('should have access to the current routeParams via `$route.current.params`', function() {
        module(function($routeProvider) {
          $routeProvider.
            when('/foo/:bar/baz/:qux', {
              resolveRedirectTo: function($route) {
                expect($route.current.params).toEqual(jasmine.objectContaining({
                  bar: '1',
                  qux: '2'
                }));

                return '/passed';
              }
            });
        });

        inject(function() {
          $location.path('/foo/1/baz/2').search({bar: 'qux'});
          $rootScope.$digest();

          expect($location.path()).toBe('/passed');
        });
      });


      it('should not process route bits until the promise is resolved', function() {
        var spies = createSpies();
        var called = false;
        var deferred;

        module(function($routeProvider) {
          setupRoutes($routeProvider, spies, function($q) {
            called = true;
            deferred = $q.defer();
            return deferred.promise;
          });
        });

        inject(function() {
          var element = $compile('<div><ng-view></ng-view></div>')($rootScope);

          $location.path('/foo');
          $rootScope.$digest();

          expect($location.path()).toBe('/foo');
          expect(called).toBe(true);
          expect(spies.fooResolveSpy).not.toHaveBeenCalled();
          expect(spies.fooTemplateSpy).not.toHaveBeenCalled();
          expect(spies.fooControllerSpy).not.toHaveBeenCalled();
          expect(spies.barResolveSpy).not.toHaveBeenCalled();
          expect(spies.barTemplateSpy).not.toHaveBeenCalled();
          expect(spies.barControllerSpy).not.toHaveBeenCalled();

          deferred.resolve('/bar');
          $rootScope.$digest();
          expect($location.path()).toBe('/bar');
          expect(spies.fooResolveSpy).not.toHaveBeenCalled();
          expect(spies.fooTemplateSpy).not.toHaveBeenCalled();
          expect(spies.fooControllerSpy).not.toHaveBeenCalled();
          expect(spies.barResolveSpy).toHaveBeenCalled();
          expect(spies.barTemplateSpy).toHaveBeenCalled();
          expect(spies.barControllerSpy).toHaveBeenCalled();

          dealoc(element);
        });
      });


      it('should not redirect if `undefined` is returned', function() {
        var spies = createSpies();
        var called = false;

        module(function($routeProvider) {
          setupRoutes($routeProvider, spies, function() {
            called = true;
            return undefined;
          });
        });

        inject(function() {
          var element = $compile('<div><ng-view></ng-view></div>')($rootScope);

          $location.path('/foo');
          $rootScope.$digest();

          expect($location.path()).toBe('/foo');
          expect(called).toBe(true);
          expect(spies.fooResolveSpy).toHaveBeenCalled();
          expect(spies.fooTemplateSpy).toHaveBeenCalled();
          expect(spies.fooControllerSpy).toHaveBeenCalled();
          expect(spies.barResolveSpy).not.toHaveBeenCalled();
          expect(spies.barTemplateSpy).not.toHaveBeenCalled();
          expect(spies.barControllerSpy).not.toHaveBeenCalled();

          dealoc(element);
        });
      });


      it('should not redirect if the returned promise resolves to `undefined`', function() {
        var spies = createSpies();
        var called = false;

        module(function($routeProvider) {
          setupRoutes($routeProvider, spies, function($q) {
            called = true;
            return $q.resolve(undefined);
          });
        });

        inject(function() {
          var element = $compile('<div><ng-view></ng-view></div>')($rootScope);

          $location.path('/foo');
          $rootScope.$digest();

          expect($location.path()).toBe('/foo');
          expect(called).toBe(true);
          expect(spies.fooResolveSpy).toHaveBeenCalled();
          expect(spies.fooTemplateSpy).toHaveBeenCalled();
          expect(spies.fooControllerSpy).toHaveBeenCalled();
          expect(spies.barResolveSpy).not.toHaveBeenCalled();
          expect(spies.barTemplateSpy).not.toHaveBeenCalled();
          expect(spies.barControllerSpy).not.toHaveBeenCalled();

          dealoc(element);
        });
      });


      it('should not redirect if the returned promise gets rejected', function() {
        var spies = createSpies();
        var called = false;

        module(function($routeProvider) {
          setupRoutes($routeProvider, spies, function($q) {
            called = true;
            return $q.reject('');
          });
        });

        inject(function() {
          spyOn($rootScope, '$broadcast').and.callThrough();

          var element = $compile('<div><ng-view></ng-view></div>')($rootScope);

          $location.path('/foo');
          $rootScope.$digest();

          expect($location.path()).toBe('/foo');
          expect(called).toBe(true);
          expect(spies.fooResolveSpy).not.toHaveBeenCalled();
          expect(spies.fooTemplateSpy).not.toHaveBeenCalled();
          expect(spies.fooControllerSpy).not.toHaveBeenCalled();
          expect(spies.barResolveSpy).not.toHaveBeenCalled();
          expect(spies.barTemplateSpy).not.toHaveBeenCalled();
          expect(spies.barControllerSpy).not.toHaveBeenCalled();

          var lastCallArgs = $rootScope.$broadcast.calls.mostRecent().args;
          expect(lastCallArgs[0]).toBe('$routeChangeError');

          dealoc(element);
        });
      });


      it('should ignore previous redirection if newer transition happened', function() {
        var spies = createSpies();
        var called = false;
        var deferred;

        module(function($routeProvider) {
          setupRoutes($routeProvider, spies, function($q) {
            called = true;
            deferred = $q.defer();
            return deferred.promise;
          });
        });

        inject(function() {
          spyOn($location, 'url').and.callThrough();

          var element = $compile('<div><ng-view></ng-view></div>')($rootScope);

          $location.path('/foo');
          $rootScope.$digest();

          expect($location.path()).toBe('/foo');
          expect(called).toBe(true);
          expect(spies.fooResolveSpy).not.toHaveBeenCalled();
          expect(spies.fooTemplateSpy).not.toHaveBeenCalled();
          expect(spies.fooControllerSpy).not.toHaveBeenCalled();
          expect(spies.barResolveSpy).not.toHaveBeenCalled();
          expect(spies.barTemplateSpy).not.toHaveBeenCalled();
          expect(spies.barControllerSpy).not.toHaveBeenCalled();
          expect(spies.bazResolveSpy).not.toHaveBeenCalled();
          expect(spies.bazTemplateSpy).not.toHaveBeenCalled();
          expect(spies.bazControllerSpy).not.toHaveBeenCalled();

          $location.path('/baz');
          $rootScope.$digest();

          expect($location.path()).toBe('/baz');
          expect(spies.fooResolveSpy).not.toHaveBeenCalled();
          expect(spies.fooTemplateSpy).not.toHaveBeenCalled();
          expect(spies.fooControllerSpy).not.toHaveBeenCalled();
          expect(spies.barResolveSpy).not.toHaveBeenCalled();
          expect(spies.barTemplateSpy).not.toHaveBeenCalled();
          expect(spies.barControllerSpy).not.toHaveBeenCalled();
          expect(spies.bazResolveSpy).toHaveBeenCalledOnce();
          expect(spies.bazTemplateSpy).toHaveBeenCalledOnce();
          expect(spies.bazControllerSpy).toHaveBeenCalledOnce();

          deferred.resolve();
          $rootScope.$digest();

          expect($location.path()).toBe('/baz');
          expect(spies.fooResolveSpy).not.toHaveBeenCalled();
          expect(spies.fooTemplateSpy).not.toHaveBeenCalled();
          expect(spies.fooControllerSpy).not.toHaveBeenCalled();
          expect(spies.barResolveSpy).not.toHaveBeenCalled();
          expect(spies.barTemplateSpy).not.toHaveBeenCalled();
          expect(spies.barControllerSpy).not.toHaveBeenCalled();
          expect(spies.bazResolveSpy).toHaveBeenCalledOnce();
          expect(spies.bazTemplateSpy).toHaveBeenCalledOnce();
          expect(spies.bazControllerSpy).toHaveBeenCalledOnce();

          dealoc(element);
        });
      });


      // Helpers
      function createSpies() {
        return {
          fooResolveSpy: jasmine.createSpy('fooResolve'),
          fooTemplateSpy: jasmine.createSpy('fooTemplate').and.returnValue('Foo'),
          fooControllerSpy: jasmine.createSpy('fooController'),
          barResolveSpy: jasmine.createSpy('barResolve'),
          barTemplateSpy: jasmine.createSpy('barTemplate').and.returnValue('Bar'),
          barControllerSpy: jasmine.createSpy('barController'),
          bazResolveSpy: jasmine.createSpy('bazResolve'),
          bazTemplateSpy: jasmine.createSpy('bazTemplate').and.returnValue('Baz'),
          bazControllerSpy: jasmine.createSpy('bazController')
        };
      }

      function setupRoutes(routeProvider, spies, resolveRedirectToFn) {
        routeProvider.
          when('/foo', {
            resolveRedirectTo: resolveRedirectToFn,
            resolve: {_: spies.fooResolveSpy},
            template: spies.fooTemplateSpy,
            controller: spies.fooControllerSpy
          }).
          when('/bar', {
            resolve: {_: spies.barResolveSpy},
            template: spies.barTemplateSpy,
            controller: spies.barControllerSpy
          }).
          when('/baz', {
            resolve: {_: spies.bazResolveSpy},
            template: spies.bazTemplateSpy,
            controller: spies.bazControllerSpy
          });
      }
    });
  });


  describe('reloadOnSearch', function() {
    it('should reload a route when reloadOnSearch is enabled and .search() changes', function() {
      var reloaded = jasmine.createSpy('route reload');

      module(function($routeProvider) {
        $routeProvider.when('/foo', {controller: angular.noop});
      });

      inject(function($route, $location, $rootScope, $routeParams) {
        $rootScope.$on('$routeChangeStart', reloaded);
        $location.path('/foo');
        $rootScope.$digest();
        expect(reloaded).toHaveBeenCalled();
        expect($routeParams).toEqual({});
        reloaded.calls.reset();

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
        $routeProvider.when('/foo', {controller: angular.noop, reloadOnSearch: false});
      });

      inject(function($route, $location, $rootScope) {
        $rootScope.$on('$routeChangeStart', routeChange);
        $rootScope.$on('$routeChangeSuccess', routeChange);
        $rootScope.$on('$routeUpdate', routeUpdate);

        expect(routeChange).not.toHaveBeenCalled();

        $location.path('/foo');
        $rootScope.$digest();
        expect(routeChange).toHaveBeenCalled();
        expect(routeChange).toHaveBeenCalledTimes(2);
        expect(routeUpdate).not.toHaveBeenCalled();
        routeChange.calls.reset();

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
        $routeProvider.when('/foo/:fooId', {controller: angular.noop, reloadOnSearch: false});
      });

      inject(function($route, $location, $rootScope) {
        $rootScope.$on('$routeChangeStart', routeChange);
        $rootScope.$on('$routeChangeSuccess', routeChange);

        expect(routeChange).not.toHaveBeenCalled();

        $location.path('/foo/aaa');
        $rootScope.$digest();
        expect(routeChange).toHaveBeenCalled();
        expect(routeChange).toHaveBeenCalledTimes(2);
        routeChange.calls.reset();

        $location.path('/foo/bbb');
        $rootScope.$digest();
        expect(routeChange).toHaveBeenCalled();
        expect(routeChange).toHaveBeenCalledTimes(2);
        routeChange.calls.reset();

        $location.search({foo: 'bar'});
        $rootScope.$digest();
        expect(routeChange).not.toHaveBeenCalled();
      });
    });


    it('should update params when reloadOnSearch is disabled and .search() changes', function() {
      var routeParamsWatcher = jasmine.createSpy('routeParamsWatcher');

      module(function($routeProvider) {
        $routeProvider.when('/foo', {controller: angular.noop});
        $routeProvider.when('/bar/:barId', {controller: angular.noop, reloadOnSearch: false});
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
        routeParamsWatcher.calls.reset();

        // trigger reload
        $location.search({foo: 'bar'});
        $rootScope.$digest();
        expect(routeParamsWatcher).toHaveBeenCalledWith({foo: 'bar'});
        routeParamsWatcher.calls.reset();

        $location.path('/bar/123').search({});
        $rootScope.$digest();
        expect(routeParamsWatcher).toHaveBeenCalledWith({barId: '123'});
        routeParamsWatcher.calls.reset();

        // don't trigger reload
        $location.search({foo: 'bar'});
        $rootScope.$digest();
        expect(routeParamsWatcher).toHaveBeenCalledWith({barId: '123', foo: 'bar'});
      });
    });


    it('should allow using a function as a template', function() {
      var customTemplateWatcher = jasmine.createSpy('customTemplateWatcher');

      function customTemplateFn(routePathParams) {
        customTemplateWatcher(routePathParams);
        expect(routePathParams).toEqual({id: 'id3'});
        return '<h1>' + routePathParams.id + '</h1>';
      }

      module(function($routeProvider) {
        $routeProvider.when('/bar/:id/:subid/:subsubid', {templateUrl: 'bar.html'});
        $routeProvider.when('/foo/:id', {template: customTemplateFn});
      });

      inject(function($route, $location, $rootScope) {
        $location.path('/foo/id3');
        $rootScope.$digest();

        expect(customTemplateWatcher).toHaveBeenCalledWith({id: 'id3'});
      });
    });


    it('should allow using a function as a templateUrl', function() {
      var customTemplateUrlWatcher = jasmine.createSpy('customTemplateUrlWatcher');

      function customTemplateUrlFn(routePathParams) {
        customTemplateUrlWatcher(routePathParams);
        expect(routePathParams).toEqual({id: 'id3'});
        return 'foo.html';
      }

      module(function($routeProvider) {
        $routeProvider.when('/bar/:id/:subid/:subsubid', {templateUrl: 'bar.html'});
        $routeProvider.when('/foo/:id', {templateUrl: customTemplateUrlFn});
      });

      inject(function($route, $location, $rootScope) {
        $location.path('/foo/id3');
        $rootScope.$digest();

        expect(customTemplateUrlWatcher).toHaveBeenCalledWith({id: 'id3'});
        expect($route.current.loadedTemplateUrl).toEqual('foo.html');
      });
    });

    describe('reload', function() {
      var $location;
      var $log;
      var $rootScope;
      var $route;
      var routeChangeStartSpy;
      var routeChangeSuccessSpy;

      beforeEach(module(function($routeProvider) {
        $routeProvider.when('/bar/:barId', {
          template: '',
          controller: controller,
          reloadOnSearch: false
        });

        function controller($log) {
          $log.debug('initialized');
        }
      }));
      beforeEach(inject(function($compile, _$location_, _$log_, _$rootScope_, _$route_) {
        $location = _$location_;
        $log = _$log_;
        $rootScope = _$rootScope_;
        $route = _$route_;

        routeChangeStartSpy = jasmine.createSpy('routeChangeStart');
        routeChangeSuccessSpy = jasmine.createSpy('routeChangeSuccess');

        $rootScope.$on('$routeChangeStart', routeChangeStartSpy);
        $rootScope.$on('$routeChangeSuccess', routeChangeSuccessSpy);

        element = $compile('<div><div ng-view></div></div>')($rootScope);
      }));

      it('should reload the current route', function() {
        $location.path('/bar/123');
        $rootScope.$digest();
        expect($location.path()).toBe('/bar/123');
        expect(routeChangeStartSpy).toHaveBeenCalledOnce();
        expect(routeChangeSuccessSpy).toHaveBeenCalledOnce();
        expect($log.debug.logs).toEqual([['initialized']]);

        routeChangeStartSpy.calls.reset();
        routeChangeSuccessSpy.calls.reset();
        $log.reset();

        $route.reload();
        $rootScope.$digest();
        expect($location.path()).toBe('/bar/123');
        expect(routeChangeStartSpy).toHaveBeenCalledOnce();
        expect(routeChangeSuccessSpy).toHaveBeenCalledOnce();
        expect($log.debug.logs).toEqual([['initialized']]);

        $log.reset();
      });

      it('should support preventing a route reload', function() {
        $location.path('/bar/123');
        $rootScope.$digest();
        expect($location.path()).toBe('/bar/123');
        expect(routeChangeStartSpy).toHaveBeenCalledOnce();
        expect(routeChangeSuccessSpy).toHaveBeenCalledOnce();
        expect($log.debug.logs).toEqual([['initialized']]);

        routeChangeStartSpy.calls.reset();
        routeChangeSuccessSpy.calls.reset();
        $log.reset();

        routeChangeStartSpy.and.callFake(function(evt) { evt.preventDefault(); });

        $route.reload();
        $rootScope.$digest();
        expect($location.path()).toBe('/bar/123');
        expect(routeChangeStartSpy).toHaveBeenCalledOnce();
        expect(routeChangeSuccessSpy).not.toHaveBeenCalled();
        expect($log.debug.logs).toEqual([]);
      });

      it('should reload even if reloadOnSearch is false', inject(function($routeParams) {
        $location.path('/bar/123');
        $rootScope.$digest();
        expect($routeParams).toEqual({barId: '123'});
        expect(routeChangeSuccessSpy).toHaveBeenCalledOnce();
        expect($log.debug.logs).toEqual([['initialized']]);

        routeChangeSuccessSpy.calls.reset();
        $log.reset();

        $location.search('a=b');
        $rootScope.$digest();
        expect($routeParams).toEqual({barId: '123', a: 'b'});
        expect(routeChangeSuccessSpy).not.toHaveBeenCalled();
        expect($log.debug.logs).toEqual([]);

        $route.reload();
        $rootScope.$digest();
        expect($routeParams).toEqual({barId: '123', a: 'b'});
        expect(routeChangeSuccessSpy).toHaveBeenCalledOnce();
        expect($log.debug.logs).toEqual([['initialized']]);

        $log.reset();
      }));
    });
  });

  describe('update', function() {
    it('should support single-parameter route updating', function() {
      var routeChangeSpy = jasmine.createSpy('route change');

      module(function($routeProvider) {
        $routeProvider.when('/bar/:barId', {controller: angular.noop});
      });

      inject(function($route, $routeParams, $location, $rootScope) {
        $rootScope.$on('$routeChangeSuccess', routeChangeSpy);

        $location.path('/bar/1');
        $rootScope.$digest();
        routeChangeSpy.calls.reset();

        $route.updateParams({barId: '2'});
        $rootScope.$digest();

        expect($routeParams).toEqual({barId: '2'});
        expect(routeChangeSpy).toHaveBeenCalledOnce();
        expect($location.path()).toEqual('/bar/2');
      });
    });

    it('should support total multi-parameter route updating', function() {
      var routeChangeSpy = jasmine.createSpy('route change');

      module(function($routeProvider) {
        $routeProvider.when('/bar/:barId/:fooId/:spamId/:eggId', {controller: angular.noop});
      });

      inject(function($route, $routeParams, $location, $rootScope) {
        $rootScope.$on('$routeChangeSuccess', routeChangeSpy);

        $location.path('/bar/1/2/3/4');
        $rootScope.$digest();
        routeChangeSpy.calls.reset();

        $route.updateParams({barId: '5', fooId: '6', spamId: '7', eggId: '8'});
        $rootScope.$digest();

        expect($routeParams).toEqual({barId: '5', fooId: '6', spamId: '7', eggId: '8'});
        expect(routeChangeSpy).toHaveBeenCalledOnce();
        expect($location.path()).toEqual('/bar/5/6/7/8');
      });
    });

    it('should support partial multi-parameter route updating', function() {
      var routeChangeSpy = jasmine.createSpy('route change');

      module(function($routeProvider) {
        $routeProvider.when('/bar/:barId/:fooId/:spamId/:eggId', {controller: angular.noop});
      });

      inject(function($route, $routeParams, $location, $rootScope) {
        $rootScope.$on('$routeChangeSuccess', routeChangeSpy);

        $location.path('/bar/1/2/3/4');
        $rootScope.$digest();
        routeChangeSpy.calls.reset();

        $route.updateParams({barId: '5', fooId: '6'});
        $rootScope.$digest();

        expect($routeParams).toEqual({barId: '5', fooId: '6', spamId: '3', eggId: '4'});
        expect(routeChangeSpy).toHaveBeenCalledOnce();
        expect($location.path()).toEqual('/bar/5/6/3/4');
      });
    });


    it('should update query params when new properties are not in path', function() {
      var routeChangeSpy = jasmine.createSpy('route change');

      module(function($routeProvider) {
        $routeProvider.when('/bar/:barId/:fooId/:spamId/', {controller: angular.noop});
      });

      inject(function($route, $routeParams, $location, $rootScope) {
        $rootScope.$on('$routeChangeSuccess', routeChangeSpy);

        $location.path('/bar/1/2/3');
        $location.search({initial: 'true'});
        $rootScope.$digest();
        routeChangeSpy.calls.reset();

        $route.updateParams({barId: '5', fooId: '6', eggId: '4'});
        $rootScope.$digest();

        expect($routeParams).toEqual({barId: '5', fooId: '6', spamId: '3', eggId: '4', initial: 'true'});
        expect(routeChangeSpy).toHaveBeenCalledOnce();
        expect($location.path()).toEqual('/bar/5/6/3/');
        expect($location.search()).toEqual({eggId: '4', initial: 'true'});
      });
    });

    it('should not update query params when an optional property was previously not in path', function() {
      var routeChangeSpy = jasmine.createSpy('route change');

      module(function($routeProvider) {
        $routeProvider.when('/bar/:barId/:fooId/:spamId/:eggId?', {controller: angular.noop});
      });

      inject(function($route, $routeParams, $location, $rootScope) {
        $rootScope.$on('$routeChangeSuccess', routeChangeSpy);

        $location.path('/bar/1/2/3');
        $location.search({initial: 'true'});
        $rootScope.$digest();
        routeChangeSpy.calls.reset();

        $route.updateParams({barId: '5', fooId: '6', eggId: '4'});
        $rootScope.$digest();

        expect($routeParams).toEqual({barId: '5', fooId: '6', spamId: '3', eggId: '4', initial: 'true'});
        expect(routeChangeSpy).toHaveBeenCalledOnce();
        expect($location.path()).toEqual('/bar/5/6/3/4');
        expect($location.search()).toEqual({initial: 'true'});
      });
    });

    it('should complain if called without an existing route', inject(function($route) {
      expect(function() { $route.updateParams(); }).toThrowMinErr('ngRoute', 'norout');
    }));
  });

  describe('testability', function() {
    it('should wait for $resolve promises before calling callbacks', function() {
      var deferred;

      module(function($provide, $routeProvider) {
        $routeProvider.when('/path', {
          template: '',
          resolve: {
            a: function($q) {
              deferred = $q.defer();
              return deferred.promise;
            }
          }
        });
      });

      inject(function($location, $route, $rootScope, $httpBackend, $$testability) {
        $location.path('/path');
        $rootScope.$digest();

        var callback = jasmine.createSpy('callback');
        $$testability.whenStable(callback);
        expect(callback).not.toHaveBeenCalled();

        deferred.resolve();
        $rootScope.$digest();
        expect(callback).toHaveBeenCalled();
      });
    });

    it('should call callback after $resolve promises are rejected', function() {
      var deferred;

      module(function($provide, $routeProvider) {
        $routeProvider.when('/path', {
          template: '',
          resolve: {
            a: function($q) {
              deferred = $q.defer();
              return deferred.promise;
            }
          }
        });
      });

      inject(function($location, $route, $rootScope, $httpBackend, $$testability) {
        $location.path('/path');
        $rootScope.$digest();

        var callback = jasmine.createSpy('callback');
        $$testability.whenStable(callback);
        expect(callback).not.toHaveBeenCalled();

        deferred.reject();
        $rootScope.$digest();
        expect(callback).toHaveBeenCalled();
      });
    });

    it('should wait for resolveRedirectTo promises before calling callbacks', function() {
      var deferred;

      module(function($provide, $routeProvider) {
        $routeProvider.when('/path', {
          resolveRedirectTo: function($q) {
            deferred = $q.defer();
            return deferred.promise;
          }
        });
      });

      inject(function($location, $route, $rootScope, $httpBackend, $$testability) {
        $location.path('/path');
        $rootScope.$digest();

        var callback = jasmine.createSpy('callback');
        $$testability.whenStable(callback);
        expect(callback).not.toHaveBeenCalled();

        deferred.resolve();
        $rootScope.$digest();
        expect(callback).toHaveBeenCalled();
      });
    });

    it('should call callback after resolveRedirectTo promises are rejected', function() {
      var deferred;

      module(function($provide, $routeProvider) {
        $routeProvider.when('/path', {
          resolveRedirectTo: function($q) {
            deferred = $q.defer();
            return deferred.promise;
          }
        });
      });

      inject(function($location, $route, $rootScope, $httpBackend, $$testability) {
        $location.path('/path');
        $rootScope.$digest();

        var callback = jasmine.createSpy('callback');
        $$testability.whenStable(callback);
        expect(callback).not.toHaveBeenCalled();

        deferred.reject();
        $rootScope.$digest();
        expect(callback).toHaveBeenCalled();
      });
    });

    it('should wait for all route promises before calling callbacks', function() {
      var deferreds = {};

      module(function($provide, $routeProvider) {
        // While normally `$browser.defer()` modifies the `outstandingRequestCount`, the mocked
        // version (provided by `ngMock`) does not. This doesn't matter in most tests, but in this
        // case we need the `outstandingRequestCount` logic to ensure that we don't call the
        // `$$testability.whenStable()` callbacks part way through a `$rootScope.$evalAsync` block.
        // See ngRoute's commitRoute()'s finally() block for details.
        $provide.decorator('$browser', function($delegate) {
          var oldDefer = $delegate.defer;
          var newDefer = function(fn, delay) {
            var requestCountAwareFn = function() { $delegate.$$completeOutstandingRequest(fn); };
            $delegate.$$incOutstandingRequestCount();
            return oldDefer.call($delegate, requestCountAwareFn, delay);
          };

          $delegate.defer = angular.extend(newDefer, oldDefer);

          return $delegate;
        });

        addRouteWithAsyncRedirect('/foo', '/bar');
        addRouteWithAsyncRedirect('/bar', '/baz');
        addRouteWithAsyncRedirect('/baz', '/qux');
        $routeProvider.when('/qux', {
          template: '',
          resolve: {
            a: function($q) {
              var deferred = deferreds['/qux'] = $q.defer();
              return deferred.promise;
            }
          }
        });

        // Helpers
        function addRouteWithAsyncRedirect(fromPath, toPath) {
          $routeProvider.when(fromPath, {
            resolveRedirectTo: function($q) {
              var deferred = deferreds[fromPath] = $q.defer();
              return deferred.promise.then(function() { return toPath; });
            }
          });
        }
      });

      inject(function($browser, $location, $rootScope, $route, $$testability) {
        $location.path('/foo');
        $rootScope.$digest();

        var callback = jasmine.createSpy('callback');
        $$testability.whenStable(callback);
        expect(callback).not.toHaveBeenCalled();

        deferreds['/foo'].resolve();
        $browser.defer.flush();
        expect(callback).not.toHaveBeenCalled();

        deferreds['/bar'].resolve();
        $browser.defer.flush();
        expect(callback).not.toHaveBeenCalled();

        deferreds['/baz'].resolve();
        $browser.defer.flush();
        expect(callback).not.toHaveBeenCalled();

        deferreds['/qux'].resolve();
        $browser.defer.flush();
        expect(callback).toHaveBeenCalled();
      });
    });
  });
});
