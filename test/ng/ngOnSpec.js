'use strict';

describe('ngOn* event binding', function() {
  it('should add event listener of specified name', inject(function($compile, $rootScope) {
    $rootScope.name = 'Misko';
    var element = $compile('<span ng-on-foo="name = name + 3"></span>')($rootScope);
    element.triggerHandler('foo');
    expect($rootScope.name).toBe('Misko3');
  }));

  it('should use angular.element(x).on() API to add listener', inject(function($compile, $rootScope) {
    spyOn(angular.element.prototype, 'on');

    var element = $compile('<span ng-on-foo="name = name + 3"></span>')($rootScope);

    expect(angular.element.prototype.on).toHaveBeenCalledWith('foo', jasmine.any(Function));
  }));

  it('should allow access to the $event object', inject(function($rootScope, $compile) {
    var element = $compile('<span ng-on-foo="e = $event"></span>')($rootScope);
    element.triggerHandler('foo');
    expect($rootScope.e.target).toBe(element[0]);
  }));

  it('should call the listener synchronously', inject(function($compile, $rootScope) {
    var element = $compile('<span ng-on-foo="fooEvent()"></span>')($rootScope);
    $rootScope.fooEvent = jasmine.createSpy('fooEvent');

    element.triggerHandler('foo');

    expect($rootScope.fooEvent).toHaveBeenCalledOnce();
  }));

  it('should support multiple events on a single element', inject(function($compile, $rootScope) {
    var element = $compile('<span ng-on-foo="fooEvent()" ng-on-bar="barEvent()"></span>')($rootScope);
    $rootScope.fooEvent = jasmine.createSpy('fooEvent');
    $rootScope.barEvent = jasmine.createSpy('barEvent');

    element.triggerHandler('foo');
    expect($rootScope.fooEvent).toHaveBeenCalled();
    expect($rootScope.barEvent).not.toHaveBeenCalled();

    $rootScope.fooEvent.calls.reset();
    $rootScope.barEvent.calls.reset();

    element.triggerHandler('bar');
    expect($rootScope.fooEvent).not.toHaveBeenCalled();
    expect($rootScope.barEvent).toHaveBeenCalled();
  }));

  it('should work with different prefixes', inject(function($rootScope, $compile) {
    var cb = $rootScope.cb = jasmine.createSpy('ng-on cb');
    var element = $compile('<span ng:on:test="cb(1)" ng-On-test2="cb(2)" ng_On_test3="cb(3)"></span>')($rootScope);

    element.triggerHandler('test');
    expect(cb).toHaveBeenCalledWith(1);

    element.triggerHandler('test2');
    expect(cb).toHaveBeenCalledWith(2);

    element.triggerHandler('test3');
    expect(cb).toHaveBeenCalledWith(3);
  }));

  it('should work if they are prefixed with x- or data- and different prefixes', inject(function($rootScope, $compile) {
    var cb = $rootScope.cb = jasmine.createSpy('ng-on cb');
    var element = $compile('<span data-ng-on-test2="cb(2)" x-ng-on-test3="cb(3)" data-ng:on-test4="cb(4)" ' +
      'x_ng-on-test5="cb(5)" data:ng-on-test6="cb(6)"></span>')($rootScope);

    element.triggerHandler('test2');
    expect(cb).toHaveBeenCalledWith(2);

    element.triggerHandler('test3');
    expect(cb).toHaveBeenCalledWith(3);

    element.triggerHandler('test4');
    expect(cb).toHaveBeenCalledWith(4);

    element.triggerHandler('test5');
    expect(cb).toHaveBeenCalledWith(5);

    element.triggerHandler('test6');
    expect(cb).toHaveBeenCalledWith(6);
  }));

  it('should work independently of attributes with the same name', inject(function($rootScope, $compile) {
    var element = $compile('<span ng-on-asdf="cb()" asdf="foo" />')($rootScope);
    var cb = $rootScope.cb = jasmine.createSpy('ng-on cb');
    $rootScope.$digest();
    element.triggerHandler('asdf');
    expect(cb).toHaveBeenCalled();
    expect(element.attr('asdf')).toBe('foo');
  }));

  it('should work independently of (ng-)attributes with the same name', inject(function($rootScope, $compile) {
    var element = $compile('<span ng-on-asdf="cb()" ng-attr-asdf="foo" />')($rootScope);
    var cb = $rootScope.cb = jasmine.createSpy('ng-on cb');
    $rootScope.$digest();
    element.triggerHandler('asdf');
    expect(cb).toHaveBeenCalled();
    expect(element.attr('asdf')).toBe('foo');
  }));

  it('should work independently of properties with the same name', inject(function($rootScope, $compile) {
    var element = $compile('<span ng-on-asdf="cb()" ng-prop-asdf="123" />')($rootScope);
    var cb = $rootScope.cb = jasmine.createSpy('ng-on cb');
    $rootScope.$digest();
    element.triggerHandler('asdf');
    expect(cb).toHaveBeenCalled();
    expect(element.prop('asdf')).toBe(123);
  }));

  it('should use the full ng-on-* attribute name in $attr mappings', function() {
    var attrs;
    module(function($compileProvider) {
      $compileProvider.directive('attrExposer', valueFn({
        link: function($scope, $element, $attrs) {
          attrs = $attrs;
        }
      }));
    });
    inject(function($compile, $rootScope) {
      $compile('<div attr-exposer ng-on-title="cb(1)" ng-on-super-title="cb(2)" ng-on-my-camel_title="cb(3)">')($rootScope);

      expect(attrs.title).toBeUndefined();
      expect(attrs.$attr.title).toBeUndefined();
      expect(attrs.ngOnTitle).toBe('cb(1)');
      expect(attrs.$attr.ngOnTitle).toBe('ng-on-title');

      expect(attrs.superTitle).toBeUndefined();
      expect(attrs.$attr.superTitle).toBeUndefined();
      expect(attrs.ngOnSuperTitle).toBe('cb(2)');
      expect(attrs.$attr.ngOnSuperTitle).toBe('ng-on-super-title');

      expect(attrs.myCamelTitle).toBeUndefined();
      expect(attrs.$attr.myCamelTitle).toBeUndefined();
      expect(attrs.ngOnMyCamelTitle).toBe('cb(3)');
      expect(attrs.$attr.ngOnMyCamelTitle).toBe('ng-on-my-camel_title');
    });
  });

  it('should not conflict with (ng-attr-)attribute mappings of the same name', function() {
    var attrs;
    module(function($compileProvider) {
      $compileProvider.directive('attrExposer', valueFn({
        link: function($scope, $element, $attrs) {
          attrs = $attrs;
        }
      }));
    });
    inject(function($compile, $rootScope) {
      $compile('<div attr-exposer ng-on-title="42" ng-attr-title="foo" title="bar">')($rootScope);
      expect(attrs.title).toBe('foo');
      expect(attrs.$attr.title).toBe('title');
      expect(attrs.$attr.ngOnTitle).toBe('ng-on-title');
    });
  });

  it('should correctly bind to kebab-cased event names', inject(function($compile, $rootScope) {
    var element = $compile('<span ng-on-foo-bar="cb()"></span>')($rootScope);
    var cb = $rootScope.cb = jasmine.createSpy('ng-on cb');
    $rootScope.$digest();

    element.triggerHandler('foobar');
    element.triggerHandler('fooBar');
    element.triggerHandler('foo_bar');
    element.triggerHandler('foo:bar');
    expect(cb).not.toHaveBeenCalled();

    element.triggerHandler('foo-bar');
    expect(cb).toHaveBeenCalled();
  }));

  it('should correctly bind to camelCased event names', inject(function($compile, $rootScope) {
    var element = $compile('<span ng-on-foo_bar="cb()"></span>')($rootScope);
    var cb = $rootScope.cb = jasmine.createSpy('ng-on cb');
    $rootScope.$digest();

    element.triggerHandler('foobar');
    element.triggerHandler('foo-bar');
    element.triggerHandler('foo_bar');
    element.triggerHandler('foo:bar');
    expect(cb).not.toHaveBeenCalled();

    element.triggerHandler('fooBar');
    expect(cb).toHaveBeenCalled();
  }));
});
