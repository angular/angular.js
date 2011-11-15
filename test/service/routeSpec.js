'use strict';

describe('$route', function() {
  it('should route and fire change event', inject(function($route, $location, $rootScope) {
    var log = '',
        lastRoute,
        nextRoute;

    function BookChapter() {
      log += '<init>;';
    }

    $route.when('/Book/:book/Chapter/:chapter',
      {controller: BookChapter, template: 'Chapter.html'});
    $route.when('/Blank');
    $rootScope.$on('$beforeRouteChange', function(event, next, current) {
      log += 'before();';
      expect(current).toBe($route.current);
      lastRoute = current;
      nextRoute = next;
    });
    $rootScope.$on('$afterRouteChange', function(event, current, last) {
      log += 'after();';
      expect(current).toBe($route.current);
      expect(lastRoute).toBe(last);
      expect(nextRoute).toBe(current);
    });

    $location.path('/Book/Moby/Chapter/Intro').search('p=123');
    $rootScope.$digest();
    expect(log).toEqual('before();<init>;after();');
    expect($route.current.params).toEqual({book:'Moby', chapter:'Intro', p:'123'});
    var lastId = $route.current.scope.$id;

    log = '';
    $location.path('/Blank').search('ignore');
    $rootScope.$digest();
    expect(log).toEqual('before();after();');
    expect($route.current.params).toEqual({ignore:true});
    expect($route.current.scope.$id).not.toEqual(lastId);

    log = '';
    $location.path('/NONE');
    $rootScope.$digest();
    expect(log).toEqual('before();after();');
    expect($route.current).toEqual(null);

    $route.when('/NONE', {template:'instant update'});
    $rootScope.$digest();
    expect($route.current.template).toEqual('instant update');
  }));


  it('should match a route that contains special chars in the path',
      inject(function($route, $location, $rootScope) {
    $route.when('/$test.23/foo(bar)/:baz', {template: 'test.html'});

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
  }));


  it('should change route even when only search param changes',
      inject(function($route, $location, $rootScope) {
    var callback = jasmine.createSpy('onRouteChange');

    $route.when('/test', {template: 'test.html'});
    $rootScope.$on('$beforeRouteChange', callback);
    $location.path('/test');
    $rootScope.$digest();
    callback.reset();

    $location.search({any: true});
    $rootScope.$digest();

    expect(callback).toHaveBeenCalled();
  }));


  it('should allow routes to be defined with just templates without controllers',
      inject(function($route, $location, $rootScope) {
    var onChangeSpy = jasmine.createSpy('onChange');

    $route.when('/foo', {template: 'foo.html'});
    $rootScope.$on('$beforeRouteChange', onChangeSpy);
    expect($route.current).toBeUndefined();
    expect(onChangeSpy).not.toHaveBeenCalled();

    $location.path('/foo');
    $rootScope.$digest();

    expect($route.current.template).toEqual('foo.html');
    expect($route.current.controller).toBeUndefined();
    expect(onChangeSpy).toHaveBeenCalled();
  }));


  it('should handle unknown routes with "otherwise" route definition',
      inject(function($route, $location, $rootScope) {
    var onChangeSpy = jasmine.createSpy('onChange');

    function NotFoundCtrl() {this.notFoundProp = 'not found!';}

    $route.when('/foo', {template: 'foo.html'});
    $route.otherwise({template: '404.html', controller: NotFoundCtrl});
    $rootScope.$on('$beforeRouteChange', onChangeSpy);
    expect($route.current).toBeUndefined();
    expect(onChangeSpy).not.toHaveBeenCalled();

    $location.path('/unknownRoute');
    $rootScope.$digest();

    expect($route.current.template).toBe('404.html');
    expect($route.current.controller).toBe(NotFoundCtrl);
    expect($route.current.scope.notFoundProp).toBe('not found!');
    expect(onChangeSpy).toHaveBeenCalled();

    onChangeSpy.reset();
    $location.path('/foo');
    $rootScope.$digest();

    expect($route.current.template).toEqual('foo.html');
    expect($route.current.controller).toBeUndefined();
    expect($route.current.scope.notFoundProp).toBeUndefined();
    expect(onChangeSpy).toHaveBeenCalled();
  }));


  it('should $destroy old routes', inject(function($route, $location, $rootScope) {
    $route.when('/foo', {template: 'foo.html', controller: function() {this.name = 'FOO';}});
    $route.when('/bar', {template: 'bar.html', controller: function() {this.name = 'BAR';}});
    $route.when('/baz', {template: 'baz.html'});

    expect($rootScope.$childHead).toEqual(null);

    $location.path('/foo');
    $rootScope.$digest();
    expect($rootScope.$$childHead.$id).toBeTruthy();
    expect($rootScope.$$childHead.$id).toEqual($rootScope.$$childTail.$id);

    $location.path('/bar');
    $rootScope.$digest();
    expect($rootScope.$$childHead.$id).toBeTruthy();
    expect($rootScope.$$childHead.$id).toEqual($rootScope.$$childTail.$id);

    $location.path('/baz');
    $rootScope.$digest();
    expect($rootScope.$$childHead.$id).toBeTruthy();
    expect($rootScope.$$childHead.$id).toEqual($rootScope.$$childTail.$id);

    $location.path('/');
    $rootScope.$digest();
    expect($rootScope.$$childHead).toEqual(null);
    expect($rootScope.$$childTail).toEqual(null);
  }));


  it('should infer arguments in injection', inject(function($route, $location, $rootScope) {
    $route.when('/test', {controller: function($route){ this.$route = $route; }});
    $location.path('/test');
    $rootScope.$digest();
    expect($route.current.scope.$route).toBe($route);
  }));


  describe('redirection', function() {
    it('should support redirection via redirectTo property by updating $location',
        inject(function($route, $location, $rootScope) {
      var onChangeSpy = jasmine.createSpy('onChange');

      $route.when('/', {redirectTo: '/foo'});
      $route.when('/foo', {template: 'foo.html'});
      $route.when('/bar', {template: 'bar.html'});
      $route.when('/baz', {redirectTo: '/bar'});
      $route.otherwise({template: '404.html'});
      $rootScope.$on('$beforeRouteChange', onChangeSpy);
      expect($route.current).toBeUndefined();
      expect(onChangeSpy).not.toHaveBeenCalled();

      $location.path('/');
      $rootScope.$digest();
      expect($location.path()).toBe('/foo');
      expect($route.current.template).toBe('foo.html');
      expect(onChangeSpy.callCount).toBe(2);

      onChangeSpy.reset();
      $location.path('/baz');
      $rootScope.$digest();
      expect($location.path()).toBe('/bar');
      expect($route.current.template).toBe('bar.html');
      expect(onChangeSpy.callCount).toBe(2);
    }));


    it('should interpolate route vars in the redirected path from original path',
        inject(function($route, $location, $rootScope) {
      $route.when('/foo/:id/foo/:subid/:extraId', {redirectTo: '/bar/:id/:subid/23'});
      $route.when('/bar/:id/:subid/:subsubid', {template: 'bar.html'});

      $location.path('/foo/id1/foo/subid3/gah');
      $rootScope.$digest();

      expect($location.path()).toEqual('/bar/id1/subid3/23');
      expect($location.search()).toEqual({extraId: 'gah'});
      expect($route.current.template).toEqual('bar.html');
    }));


    it('should interpolate route vars in the redirected path from original search',
        inject(function($route, $location, $rootScope) {
      $route.when('/bar/:id/:subid/:subsubid', {template: 'bar.html'});
      $route.when('/foo/:id/:extra', {redirectTo: '/bar/:id/:subid/99'});

      $location.path('/foo/id3/eId').search('subid=sid1&appended=true');
      $rootScope.$digest();

      expect($location.path()).toEqual('/bar/id3/sid1/99');
      expect($location.search()).toEqual({appended: 'true', extra: 'eId'});
      expect($route.current.template).toEqual('bar.html');
    }));


    it('should allow custom redirectTo function to be used',
        inject(function($route, $location, $rootScope) {
      $route.when('/bar/:id/:subid/:subsubid', {template: 'bar.html'});
      $route.when('/foo/:id', {redirectTo: customRedirectFn});

      $location.path('/foo/id3').search('subid=sid1&appended=true');
      $rootScope.$digest();

      expect($location.path()).toEqual('/custom');

      function customRedirectFn(routePathParams, path, search) {
        expect(routePathParams).toEqual({id: 'id3'});
        expect(path).toEqual($location.path());
        expect(search).toEqual($location.search());
        return '/custom';
      }
    }));


    it('should replace the url when redirecting', inject(function($route, $location, $rootScope) {
      $route.when('/bar/:id', {template: 'bar.html'});
      $route.when('/foo/:id/:extra', {redirectTo: '/bar/:id'});

      var replace;
      $rootScope.$watch(function() {
        if (isUndefined(replace)) replace = $location.$$replace;
      });

      $location.path('/foo/id3/eId');
      $rootScope.$digest();

      expect($location.path()).toEqual('/bar/id3');
      expect(replace).toBe(true);
    }));
  });


  describe('reloadOnSearch', function() {
    it('should reload a route when reloadOnSearch is enabled and .search() changes',
        inject(function($route, $location, $rootScope, $routeParams) {
      var reloaded = jasmine.createSpy('route reload');

      $route.when('/foo', {controller: FooCtrl});
      $rootScope.$on('$beforeRouteChange', reloaded);

      function FooCtrl() {
        reloaded();
      }

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
    }));


    it('should not reload a route when reloadOnSearch is disabled and only .search() changes',
        inject(function($route, $location, $rootScope) {
      var reloaded = jasmine.createSpy('route reload'),
          routeUpdateEvent = jasmine.createSpy('route reload');

      $route.when('/foo', {controller: FooCtrl, reloadOnSearch: false});
      $rootScope.$on('$beforeRouteChange', reloaded);

      function FooCtrl() {
        reloaded();
        this.$on('$routeUpdate', routeUpdateEvent);
      }

      expect(reloaded).not.toHaveBeenCalled();

      $location.path('/foo');
      $rootScope.$digest();
      expect(reloaded).toHaveBeenCalled();
      expect(routeUpdateEvent).not.toHaveBeenCalled();
      reloaded.reset();

      // don't trigger reload
      $location.search({foo: 'bar'});
      $rootScope.$digest();
      expect(reloaded).not.toHaveBeenCalled();
      expect(routeUpdateEvent).toHaveBeenCalled();
    }));


    it('should reload reloadOnSearch route when url differs only in route path param',
        inject(function($route, $location, $rootScope) {
      var reloaded = jasmine.createSpy('routeReload'),
          onRouteChange = jasmine.createSpy('onRouteChange');

      $route.when('/foo/:fooId', {controller: FooCtrl, reloadOnSearch: false});
      $rootScope.$on('$beforeRouteChange', onRouteChange);

      function FooCtrl() {
        reloaded();
      }

      expect(reloaded).not.toHaveBeenCalled();
      expect(onRouteChange).not.toHaveBeenCalled();

      $location.path('/foo/aaa');
      $rootScope.$digest();
      expect(reloaded).toHaveBeenCalled();
      expect(onRouteChange).toHaveBeenCalled();
      reloaded.reset();
      onRouteChange.reset();

      $location.path('/foo/bbb');
      $rootScope.$digest();
      expect(reloaded).toHaveBeenCalled();
      expect(onRouteChange).toHaveBeenCalled();
      reloaded.reset();
      onRouteChange.reset();

      $location.search({foo: 'bar'});
      $rootScope.$digest();
      expect(reloaded).not.toHaveBeenCalled();
      expect(onRouteChange).not.toHaveBeenCalled();
    }));


    it('should update params when reloadOnSearch is disabled and .search() changes',
        inject(function($route, $location, $rootScope) {
      var routeParams = jasmine.createSpy('routeParams');

      $route.when('/foo', {controller: FooCtrl});
      $route.when('/bar/:barId', {controller: FooCtrl, reloadOnSearch: false});

      function FooCtrl() {
        this.$watch(function() {
          return $route.current.params;
        }, function(scope, value) {
          routeParams(value);
        });
      }

      expect(routeParams).not.toHaveBeenCalled();

      $location.path('/foo');
      $rootScope.$digest();
      expect(routeParams).toHaveBeenCalledWith({});
      routeParams.reset();

      // trigger reload
      $location.search({foo: 'bar'});
      $rootScope.$digest();
      expect(routeParams).toHaveBeenCalledWith({foo: 'bar'});
      routeParams.reset();

      $location.path('/bar/123').search({});
      $rootScope.$digest();
      expect(routeParams).toHaveBeenCalledWith({barId: '123'});
      routeParams.reset();

      // don't trigger reload
      $location.search({foo: 'bar'});
      $rootScope.$digest();
      expect(routeParams).toHaveBeenCalledWith({barId: '123', foo: 'bar'});
    }));


    describe('reload', function() {

      it('should reload even if reloadOnSearch is false',
          inject(function($route, $location, $rootScope, $routeParams) {
        var count = 0;

        $route.when('/bar/:barId', {controller: FooCtrl, reloadOnSearch: false});

        function FooCtrl() { count ++; }

        $location.path('/bar/123');
        $rootScope.$digest();
        expect($routeParams).toEqual({barId:'123'});
        expect(count).toEqual(1);

        $location.path('/bar/123').search('a=b');
        $rootScope.$digest();
        expect($routeParams).toEqual({barId:'123', a:'b'});
        expect(count).toEqual(1);

        $route.reload();
        $rootScope.$digest();
        expect($routeParams).toEqual({barId:'123', a:'b'});
        expect(count).toEqual(2);
      }));
    });
  });
});
