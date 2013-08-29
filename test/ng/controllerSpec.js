'use strict';

describe('$controller', function() {
  var $controllerProvider, $controller, $s1, $s2, $s3;

  beforeEach(module(function(_$controllerProvider_, $provide) {
    $controllerProvider = _$controllerProvider_;
    $provide.service('s1', function() { this.foo = 'wat'; });
    $provide.service('s2', function() { this.foo = 'bat'; });
    $provide.service('s3', function() { this.foo = 'cat'; });
  }));


  beforeEach(inject(function(_$controller_, s1, s2, s3) {
    $controller = _$controller_;
    $s1 = s1;
    $s2 = s2;
    $s3 = s3;
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

    it('should allow array-registered controllers to reuse previously-defined controllers with different injectables', function() {
      var FooCtrl = function(s1) { s1.foo = 'bar'; },
          scope = {},
          ctrl;

      $controllerProvider.register('FooCtrl', ['s1', FooCtrl]);
      $controllerProvider.register('BarCtrl', ['s2', 'FooCtrl']);
      ctrl = $controller('BarCtrl', {s2: $s2});

      expect($s2.foo).toBe('bar');
      expect(ctrl instanceof FooCtrl).toBe(true);
    });

    it('should not matter how many controllers are in the chain', function() {
      var FooCtrl = function(s1) { s1.foo = 'bar'; },
          ctrl;

      $controllerProvider.register('FooCtrl', ['s1', FooCtrl]);
      $controllerProvider.register('BarCtrl', ['s2', 'FooCtrl']);
      $controllerProvider.register('BazCtrl', ['s3', 'BarCtrl']);
      ctrl = $controller('BazCtrl', {s3: $s3});

      expect($s3.foo).toBe('bar');
      expect(ctrl instanceof FooCtrl).toBe(true);
    });

    it('should fail if circular declarations are detected', function() {
      var FooCtrl = function(s1) { s1.foo = 'bar'; },
          ctrl;

      $controllerProvider.register('FooCtrl', ['s1', 'BazCtrl']);
      $controllerProvider.register('BarCtrl', ['s2', 'FooCtrl']);
      $controllerProvider.register('BazCtrl', ['s3', 'BarCtrl']);
      
      expect(function() {$controller('BazCtrl', {s3: $s3});}).toThrowMinErr("$controller", "noscp", "Circular declaration found with controller 'FooCtrl' -> 'BazCtrl'");
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
      }).toThrowMinErr("$controller", "noscp", "Cannot export controller 'a.b.FooCtrl' as 'foo'! No $scope object provided via `locals`.");

    });
  });
});
