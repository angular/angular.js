'use strict';

describe('ngController', function() {
  var element;

  beforeEach(module(function($controllerProvider) {
    $controllerProvider.register('PublicModule', function() {
      this.mark = 'works';
    });
  }));
  beforeEach(inject(function($window) {
    $window.Greeter = function($scope) {
      // private stuff (not exported to scope)
      this.prefix = 'Hello ';

      // public stuff (exported to scope)
      var ctrl = this;
      $scope.name = 'Misko';
      $scope.greet = function(name) {
        return ctrl.prefix + name + ctrl.suffix;
      };

      $scope.protoGreet = bind(this, this.protoGreet);
    };
    $window.Greeter.prototype = {
      suffix: '!',
      protoGreet: function(name) {
        return this.prefix + name + this.suffix;
      }
    };

    $window.Child = function($scope) {
      $scope.name = 'Adam';
    };

    $window.Public = function() {
      this.mark = 'works';
    }
  }));

  afterEach(function() {
    dealoc(element);
  });


  it('should instantiate controller and bind methods', inject(function($compile, $rootScope) {
    element = $compile('<div ng-controller="Greeter">{{greet(name)}}</div>')($rootScope);
    $rootScope.$digest();
    expect(element.text()).toBe('Hello Misko!');
  }));


  it('should publish controller into scope', inject(function($compile, $rootScope) {
    element = $compile('<div ng-controller="Public as p">{{p.mark}}</div>')($rootScope);
    $rootScope.$digest();
    expect(element.text()).toBe('works');
  }));


  it('should publish controller into scope from module', inject(function($compile, $rootScope) {
    element = $compile('<div ng-controller="PublicModule as p">{{p.mark}}</div>')($rootScope);
    $rootScope.$digest();
    expect(element.text()).toBe('works');
  }));


  it('should allow nested controllers', inject(function($compile, $rootScope) {
    element = $compile('<div ng-controller="Greeter"><div ng-controller="Child">{{greet(name)}}</div></div>')($rootScope);
    $rootScope.$digest();
    expect(element.text()).toBe('Hello Adam!');
    dealoc(element);

    element = $compile('<div ng-controller="Greeter"><div ng-controller="Child">{{protoGreet(name)}}</div></div>')($rootScope);
    $rootScope.$digest();
    expect(element.text()).toBe('Hello Adam!');
  }));


  it('should instantiate controller defined on scope', inject(function($compile, $rootScope) {
    $rootScope.Greeter = function($scope) {
      $scope.name = 'Vojta';
    };

    element = $compile('<div ng-controller="Greeter">{{name}}</div>')($rootScope);
    $rootScope.$digest();
    expect(element.text()).toBe('Vojta');
  }));
});
