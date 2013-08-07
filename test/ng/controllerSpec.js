'use strict';

describe('$controller', function() {
  var $provide, $controllerProvider, $controller;

  beforeEach(module(function(_$provide_, _$controllerProvider_) {
    $provide = _$provide_;
    $controllerProvider = _$controllerProvider_;
  }));


  beforeEach(inject(function(_$controller_) {
    $controller = _$controller_;
  }));


  describe('provider', function() {

    it('should allow registration of controllers', function() {
      var FooCtrl = function($scope) { $scope.foo = 'bar' },
        scope = {},
        ctrl;

      $controllerProvider.register('FooCtrl', FooCtrl);
      ctrl = $controller('FooCtrl', {$scope: scope});

      expect(scope.foo).toBe('bar');
      expect(ctrl instanceof FooCtrl).toBe(true);
    });


    it('should allow registration of map of controllers', function() {
      var FooCtrl = function($scope) { $scope.foo = 'foo' },
          BarCtrl = function($scope) { $scope.bar = 'bar' },
          scope = {},
          ctrl;

      $controllerProvider.register({FooCtrl: FooCtrl, BarCtrl: BarCtrl} );

      ctrl = $controller('FooCtrl', {$scope: scope});
      expect(scope.foo).toBe('foo');
      expect(ctrl instanceof FooCtrl).toBe(true);

      ctrl = $controller('BarCtrl', {$scope: scope});
      expect(scope.bar).toBe('bar');
      expect(ctrl instanceof BarCtrl).toBe(true);
    });


    it('should allow registration of controllers annotated with arrays', function() {
      var FooCtrl = function($scope) { $scope.foo = 'bar' },
          scope = {},
          ctrl;

      $controllerProvider.register('FooCtrl', ['$scope', FooCtrl]);
      ctrl = $controller('FooCtrl', {$scope: scope});

      expect(scope.foo).toBe('bar');
      expect(ctrl instanceof FooCtrl).toBe(true);
    });
  });


  it('should return instance of given controller class', function() {
    var MyClass = function() {},
        ctrl = $controller(MyClass);

    expect(ctrl).toBeDefined();
    expect(ctrl instanceof MyClass).toBe(true);
  });

  it('should inject arguments', inject(function($http) {
    var MyClass = function($http) {
      this.$http = $http;
    };

    var ctrl = $controller(MyClass);
    expect(ctrl.$http).toBe($http);
  }));


  it('should inject given scope', function() {
    var MyClass = function($scope) {
      this.$scope = $scope;
    };

    var scope = {},
        ctrl = $controller(MyClass, {$scope: scope});

    expect(ctrl.$scope).toBe(scope);
  });


  it('should instantiate controller defined on window', inject(function($window) {
    var scope = {};
    var Foo = function() {};

    $window.a = {Foo: Foo};

    var foo = $controller('a.Foo', {$scope: scope});
    expect(foo).toBeDefined();
    expect(foo instanceof Foo).toBe(true);
  }));


  it('should resolve named controllers using $injector', function() {
    var FooCtrl,
        scope = {},
        ctrl;

    $provide.factory("Ctrl", function() {
      return FooCtrl = function($scope, name) {
        $scope.name = name;
      };
    });

    ctrl = $controller("Ctrl as c", {$scope: scope, name: "foo"});
    expect(ctrl).toBeDefined();
    expect(ctrl instanceof FooCtrl).toBe(true);
    expect(scope.c).toBe(ctrl);
    expect(scope.name).toBe("foo");
  });


  describe('ctrl as syntax', function() {

    it('should publish controller instance into scope', function() {
      var scope = {};

      $controllerProvider.register('FooCtrl', function() { this.mark = 'foo'; });

      var foo = $controller('FooCtrl as foo', {$scope: scope});
      expect(scope.foo).toBe(foo);
      expect(scope.foo.mark).toBe('foo');
    });


    it('should allow controllers with dots', function() {
      var scope = {};

      $controllerProvider.register('a.b.FooCtrl', function() { this.mark = 'foo'; });

      var foo = $controller('a.b.FooCtrl as foo', {$scope: scope});
      expect(scope.foo).toBe(foo);
      expect(scope.foo.mark).toBe('foo');
    });


    it('should throw an error if $scope is not provided', function() {
      $controllerProvider.register('a.b.FooCtrl', function() { this.mark = 'foo'; });

      expect(function() {
        $controller('a.b.FooCtrl as foo');
      }).toThrow("[$controller:noscp] Cannot export controller 'a.b.FooCtrl' as 'foo'! No $scope object provided via `locals`.");

    });
  });
});
