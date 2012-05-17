'use strict';

describe('$controller', function() {
  var $controllerProvider, $controller;

  beforeEach(module(function(_$controllerProvider_) {
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
});
