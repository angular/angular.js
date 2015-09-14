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
      var FooCtrl = function($scope) { $scope.foo = 'bar'; },
        scope = {},
        ctrl;

      $controllerProvider.register('FooCtrl', FooCtrl);
      ctrl = $controller('FooCtrl', {$scope: scope});

      expect(scope.foo).toBe('bar');
      expect(ctrl instanceof FooCtrl).toBe(true);
    });

    it('should allow registration of bound controller functions', function() {
      var FooCtrl = function($scope) { $scope.foo = 'bar'; },
        scope = {},
        ctrl;

      var BoundFooCtrl = FooCtrl.bind(null);

      $controllerProvider.register('FooCtrl', ['$scope', BoundFooCtrl]);
      ctrl = $controller('FooCtrl', {$scope: scope});

      expect(scope.foo).toBe('bar');
    });

    it('should allow registration of map of controllers', function() {
      var FooCtrl = function($scope) { $scope.foo = 'foo'; },
          BarCtrl = function($scope) { $scope.bar = 'bar'; },
          scope = {},
          ctrl;

      $controllerProvider.register({FooCtrl: FooCtrl, BarCtrl: BarCtrl});

      ctrl = $controller('FooCtrl', {$scope: scope});
      expect(scope.foo).toBe('foo');
      expect(ctrl instanceof FooCtrl).toBe(true);

      ctrl = $controller('BarCtrl', {$scope: scope});
      expect(scope.bar).toBe('bar');
      expect(ctrl instanceof BarCtrl).toBe(true);
    });


    it('should allow registration of controllers annotated with arrays', function() {
      var FooCtrl = function($scope) { $scope.foo = 'bar'; },
          scope = {},
          ctrl;

      $controllerProvider.register('FooCtrl', ['$scope', FooCtrl]);
      ctrl = $controller('FooCtrl', {$scope: scope});

      expect(scope.foo).toBe('bar');
      expect(ctrl instanceof FooCtrl).toBe(true);
    });


    it('should throw an exception if a controller is called "hasOwnProperty"', function() {
      expect(function() {
        $controllerProvider.register('hasOwnProperty', function($scope) {});
      }).toThrowMinErr('ng', 'badname', "hasOwnProperty is not a valid controller name");
    });


    it('should instantiate a controller defined on window if allowGlobals is set',
      inject(function($window) {
        var scope = {};
        var Foo = function() {};

        $controllerProvider.allowGlobals();

        $window.a = {Foo: Foo};

        var foo = $controller('a.Foo', {$scope: scope});
        expect(foo).toBeDefined();
        expect(foo instanceof Foo).toBe(true);
    }));


    it('should throw ctrlfmt if name contains spaces', function() {
      expect(function() {
        $controller('ctrl doom');
      }).toThrowMinErr("$controller", "ctrlfmt",
                       "Badly formed controller string 'ctrl doom'. " +
                       "Must match `__name__ as __id__` or `__name__`.");
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


  it('should not instantiate a controller defined on window', inject(function($window) {
    var scope = {};
    var Foo = function() {};

    $window.a = {Foo: Foo};

    expect(function() {
      $controller('a.Foo', {$scope: scope});
    }).toThrow();
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


    it('should throw ctrlfmt if identifier contains non-ident characters', function() {
      expect(function() {
        $controller('ctrl as foo<bar');
      }).toThrowMinErr("$controller", "ctrlfmt",
                       "Badly formed controller string 'ctrl as foo<bar'. " +
                       "Must match `__name__ as __id__` or `__name__`.");
    });


    it('should throw ctrlfmt if identifier contains spaces', function() {
      expect(function() {
        $controller('ctrl as foo bar');
      }).toThrowMinErr("$controller", "ctrlfmt",
                       "Badly formed controller string 'ctrl as foo bar'. " +
                       "Must match `__name__ as __id__` or `__name__`.");
    });


    it('should throw ctrlfmt if identifier missing after " as "', function() {
      expect(function() {
        $controller('ctrl as ');
      }).toThrowMinErr("$controller", "ctrlfmt",
                       "Badly formed controller string 'ctrl as '. " +
                       "Must match `__name__ as __id__` or `__name__`.");
      expect(function() {
        $controller('ctrl as');
      }).toThrowMinErr("$controller", "ctrlfmt",
                       "Badly formed controller string 'ctrl as'. " +
                       "Must match `__name__ as __id__` or `__name__`.");
    });
  });
});
