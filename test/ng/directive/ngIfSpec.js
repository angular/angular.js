'use strict';

describe('ngIf', function () {
  var $scope, $compile, element, $compileProvider;

  beforeEach(module(function(_$compileProvider_) {
    $compileProvider = _$compileProvider_;
  }));
  beforeEach(inject(function ($rootScope, _$compile_) {
    $scope = $rootScope.$new();
    $compile = _$compile_;
    element = $compile('<div></div>')($scope);
  }));

  afterEach(function () {
    dealoc(element);
  });

  function makeIf(expr) {
    element.append($compile('<div class="my-class" ng-if="' + expr + '"><div>Hi</div></div>')($scope));
    $scope.$apply();
  }

  it('should immediately remove element if condition is false', function () {
    makeIf('false');
    expect(element.children().length).toBe(0);
  });

  it('should leave the element if condition is true', function () {
    makeIf('true');
    expect(element.children().length).toBe(1);
  });

  it('should not add the element twice if the condition goes from true to true', function () {
    $scope.hello = 'true1';
    makeIf('hello');
    expect(element.children().length).toBe(1);
    $scope.$apply('hello = "true2"');
    expect(element.children().length).toBe(1);
  });

  it('should not recreate the element if the condition goes from true to true', function () {
    $scope.hello = 'true1';
    makeIf('hello');
    element.children().data('flag', true);
    $scope.$apply('hello = "true2"');
    expect(element.children().data('flag')).toBe(true);
  });

  it('should create then remove the element if condition changes', function () {
    $scope.hello = true;
    makeIf('hello');
    expect(element.children().length).toBe(1);
    $scope.$apply('hello = false');
    expect(element.children().length).toBe(0);
  });

  it('should create a new scope every time the expression evaluates to true', function () {
    $scope.$apply('value = true');
    element.append($compile(
      '<div ng-if="value"><span ng-init="value=false"></span></div>'
    )($scope));
    $scope.$apply();
    expect(element.children('div').length).toBe(1);
  });

  it('should destroy the child scope every time the expression evaluates to false', function() {
    $scope.value = true;
    element.append($compile(
        '<div ng-if="value"></div>'
    )($scope));
    $scope.$apply();

    var childScope = element.children().scope();
    var destroyed = false;

    childScope.$on('$destroy', function() {
      destroyed = true;
    });

    $scope.value = false;
    $scope.$apply();

    expect(destroyed).toBe(true);
  });

  it('should play nice with other elements beside it', function () {
    $scope.values = [1, 2, 3, 4];
    element.append($compile(
      '<div ng-repeat="i in values"></div>' +
        '<div ng-if="values.length==4"></div>' +
        '<div ng-repeat="i in values"></div>'
    )($scope));
    $scope.$apply();
    expect(element.children().length).toBe(9);
    $scope.$apply('values.splice(0,1)');
    expect(element.children().length).toBe(6);
    $scope.$apply('values.push(1)');
    expect(element.children().length).toBe(9);
  });

  it('should play nice with ngInclude on the same element', inject(function($templateCache) {
    $templateCache.put('test.html', [200, '{{value}}', {}]);

    $scope.value = 'first';
    element.append($compile(
      '<div ng-if="value==\'first\'" ng-include="\'test.html\'"></div>'
    )($scope));
    $scope.$apply();
    expect(element.text()).toBe('first');

    $scope.value = 'later';
    $scope.$apply();
    expect(element.text()).toBe('');
  }));

  it('should work with multiple elements', function() {
    $scope.show = true;
    $scope.things = [1, 2, 3];
    element.append($compile(
      '<div>before;</div>' +
        '<div ng-if-start="show">start;</div>' +
        '<div ng-repeat="thing in things">{{thing}};</div>' +
        '<div ng-if-end>end;</div>' +
        '<div>after;</div>'
    )($scope));
    $scope.$apply();
    expect(element.text()).toBe('before;start;1;2;3;end;after;');

    $scope.things.push(4);
    $scope.$apply();
    expect(element.text()).toBe('before;start;1;2;3;4;end;after;');

    $scope.show = false;
    $scope.$apply();
    expect(element.text()).toBe('before;after;');
  });

  it('should restore the element to its compiled state', function() {
    $scope.value = true;
    makeIf('value');
    expect(element.children().length).toBe(1);
    jqLite(element.children()[0]).removeClass('my-class');
    expect(element.children()[0].className).not.toContain('my-class');
    $scope.$apply('value = false');
    expect(element.children().length).toBe(0);
    $scope.$apply('value = true');
    expect(element.children().length).toBe(1);
    expect(element.children()[0].className).toContain('my-class');
  });

  it('should work when combined with an ASYNC template that loads after the first digest', inject(function($httpBackend, $compile, $rootScope) {
    $compileProvider.directive('test', function() {
      return {
        templateUrl: 'test.html'
      };
    });
    $httpBackend.whenGET('test.html').respond('hello');
    element.append('<div ng-if="show" test></div>');
    $compile(element)($rootScope);
    $rootScope.show = true;
    $rootScope.$apply();
    expect(element.text()).toBe('');

    $httpBackend.flush();
    expect(element.text()).toBe('hello');

    $rootScope.show = false;
    $rootScope.$apply();
    // Note: there are still comments in element!
    expect(element.children().length).toBe(0);
    expect(element.text()).toBe('');
  }));
});

describe('ngIf and transcludes', function() {
  it('should allow access to directive controller from children when used in a replace template', function() {
    var controller;
    module(function($compileProvider) {
      var directive = $compileProvider.directive;
      directive('template', valueFn({
        template: '<div ng-if="true"><span test></span></div>',
        replace: true,
        controller: function() {
          this.flag = true;
        }
      }));
      directive('test', valueFn({
        require: '^template',
        link: function(scope, el, attr, ctrl) {
          controller = ctrl;
        }
      }));
    });
    inject(function($compile, $rootScope) {
      var element = $compile('<div><div template></div></div>')($rootScope);
      $rootScope.$apply();
      expect(controller.flag).toBe(true);
      dealoc(element);
    });
  });


  it('should use the correct transcluded scope', function() {
    module(function($compileProvider) {
      $compileProvider.directive('iso', valueFn({
        link: function(scope) {
          scope.val = 'value in iso scope';
        },
        restrict: 'A',
        transclude: true,
        template: '<div ng-if="true">val={{val}}-<div ng-transclude></div></div>',
        scope: {}
      }));
    });
    inject(function($compile, $rootScope) {
      $rootScope.val = 'transcluded content';
      var element = $compile('<div iso><span ng-bind="val"></span></div>')($rootScope);
      $rootScope.$digest();
      expect(trim(element.text())).toEqual('val=value in iso scope-transcluded content');
      dealoc(element);
    });
  });
});

describe('ngIf animations', function () {
  var body, element, $rootElement;

  function html(content) {
    $rootElement.html(content);
    element = $rootElement.children().eq(0);
    return element;
  }

  beforeEach(module('ngAnimateMock'));

  beforeEach(module(function() {
    // we need to run animation on attached elements;
    return function(_$rootElement_) {
      $rootElement = _$rootElement_;
      body = jqLite(document.body);
      body.append($rootElement);
    };
  }));

  afterEach(function(){
    dealoc(body);
    dealoc(element);
  });

  beforeEach(module(function($animateProvider, $provide) {
    return function($animate) {
      $animate.enabled(true);
    };
  }));

  it('should fire off the enter animation',
    inject(function($compile, $rootScope, $animate) {
      var item;
      var $scope = $rootScope.$new();
      element = $compile(html(
        '<div>' +
          '<div ng-if="value"><div>Hi</div></div>' +
        '</div>'
      ))($scope);

      $rootScope.$digest();
      $scope.$apply('value = true');

      item = $animate.queue.shift();
      expect(item.event).toBe('enter');
      expect(item.element.text()).toBe('Hi');

      expect(element.children().length).toBe(1);
    })
  );

  it('should fire off the leave animation',
    inject(function ($compile, $rootScope, $animate) {
      var item;
      var $scope = $rootScope.$new();
      element = $compile(html(
        '<div>' +
          '<div ng-if="value"><div>Hi</div></div>' +
        '</div>'
      ))($scope);
      $scope.$apply('value = true');

      item = $animate.queue.shift();
      expect(item.event).toBe('enter');
      expect(item.element.text()).toBe('Hi');

      expect(element.children().length).toBe(1);
      $scope.$apply('value = false');

      item = $animate.queue.shift();
      expect(item.event).toBe('leave');
      expect(item.element.text()).toBe('Hi');

      expect(element.children().length).toBe(0);
    })
  );

  it('should destroy the previous leave animation if a new one takes place', function() {
    module(function($provide) {
      $provide.value('$animate', {
        enabled : function() { return true; },
        leave : function() {
          //DOM operation left blank
        },
        enter : function(element, parent) {
          parent.append(element);
        }
      });
    });
    inject(function ($compile, $rootScope, $animate) {
      var item;
      var $scope = $rootScope.$new();
      element = $compile(html(
        '<div>' +
          '<div ng-if="value">Yo</div>' +
        '</div>'
      ))($scope);

      $scope.$apply('value = true');

      var destroyed, inner = element.children(0);
      inner.on('$destroy', function() {
        destroyed = true;
      });

      $scope.$apply('value = false');

      $scope.$apply('value = true');

      $scope.$apply('value = false');

      expect(destroyed).toBe(true);
    });
  });

});
