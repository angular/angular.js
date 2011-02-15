describe('$route', function() {
  var scope;

  beforeEach(function(){
    scope = angular.scope();
  });


  afterEach(function(){
    dealoc(scope);
  });


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


  it('should return fn registered with onChange()', function() {
    var scope = angular.scope(),
        $route = scope.$service('$route'),
        fn = function() {};

    expect($route.onChange(fn)).toBe(fn);
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


  describe('redirection', function() {

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
      $browser.defer.flush(); //triger route change - match the route we redirected to

      expect($location.hash).toBe('/foo');
      expect($route.current.template).toBe('foo.html');
      expect(onChangeSpy.callCount).toBe(1);

      onChangeSpy.reset();
      $location.updateHash('');
      scope.$eval(); //match the redirect route + update $browser
      $browser.defer.flush(); //match the route we redirected to

      expect($location.hash).toBe('/foo');
      expect($route.current.template).toBe('foo.html');
      expect(onChangeSpy.callCount).toBe(1);

      onChangeSpy.reset();
      $location.updateHash('/baz');
      scope.$eval(); //match the redirect route + update $browser
      $browser.defer.flush(); //match the route we redirected to

      expect($location.hash).toBe('/bar');
      expect($route.current.template).toBe('bar.html');
      expect(onChangeSpy.callCount).toBe(1);
    });


    it('should interpolate route variables in the redirected hashPath from the original hashPath',
        function() {
      var scope = angular.scope(),
          $location = scope.$service('$location'),
          $browser = scope.$service('$browser'),
          $route = scope.$service('$route');

      $route.when('/foo/:id/foo/:subid/:extraId', {redirectTo: '/bar/:id/:subid/23'});
      $route.when('/bar/:id/:subid/:subsubid', {template: 'bar.html'});
      scope.$eval();

      $location.updateHash('/foo/id1/foo/subid3/gah');
      scope.$eval(); //triggers initial route change - match the redirect route
      $browser.defer.flush(); //triger route change - match the route we redirected to

      expect($location.hash).toBe('/bar/id1/subid3/23?extraId=gah');
      expect($route.current.template).toBe('bar.html');
    });


    it('should interpolate route variables in the redirected hashPath from the original hashSearch',
        function() {
      var scope = angular.scope(),
          $location = scope.$service('$location'),
          $browser = scope.$service('$browser'),
          $route = scope.$service('$route');

      $route.when('/bar/:id/:subid/:subsubid', {template: 'bar.html'});
      $route.when('/foo/:id/:extra', {redirectTo: '/bar/:id/:subid/99'});
      scope.$eval();

      $location.hash = '/foo/id3/eId?subid=sid1&appended=true';
      scope.$eval(); //triggers initial route change - match the redirect route
      $browser.defer.flush(); //triger route change - match the route we redirected to

      expect($location.hash).toBe('/bar/id3/sid1/99?appended=true&extra=eId');
      expect($route.current.template).toBe('bar.html');
    });


    it('should allow custom redirectTo function to be used', function() {
      var scope = angular.scope(),
          $location = scope.$service('$location'),
          $browser = scope.$service('$browser'),
          $route = scope.$service('$route');

      $route.when('/bar/:id/:subid/:subsubid', {template: 'bar.html'});
      $route.when('/foo/:id',
                  {redirectTo: customRedirectFn});
      scope.$eval();

      $location.hash = '/foo/id3?subid=sid1&appended=true';
      scope.$eval(); //triggers initial route change - match the redirect route
      $browser.defer.flush(); //triger route change - match the route we redirected to

      expect($location.hash).toBe('custom');

      function customRedirectFn(routePathParams, hash, hashPath, hashSearch) {
        expect(routePathParams).toEqual({id: 'id3'});
        expect(hash).toEqual($location.hash);
        expect(hashPath).toEqual($location.hashPath);
        expect(hashSearch).toEqual($location.hashSearch);
        return 'custom';
      }
    });
  });
});
