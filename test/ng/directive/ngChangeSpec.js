'use strict';

/* globals getInputCompileHelper: false */

describe('ngChange', function() {

  var helper, $rootScope;

  beforeEach(function() {
    helper = getInputCompileHelper(this);
  });

  afterEach(function() {
    helper.dealoc();
  });


  beforeEach(inject(function(_$rootScope_) {
    $rootScope = _$rootScope_;
  }));

  it('should $eval expression after new value is set in the model', function() {
    helper.compileInput('<input type="text" ng-model="value" ng-change="change()" />');

    $rootScope.change = jasmine.createSpy('change').andCallFake(function() {
      expect($rootScope.value).toBe('new value');
    });

    helper.changeInputValueTo('new value');
    expect($rootScope.change).toHaveBeenCalledOnce();
  });


  it('should not $eval the expression if changed from model', function() {
    helper.compileInput('<input type="text" ng-model="value" ng-change="change()" />');

    $rootScope.change = jasmine.createSpy('change');
    $rootScope.$apply('value = true');

    expect($rootScope.change).not.toHaveBeenCalled();
  });


  it('should $eval ngChange expression on checkbox', function() {
    var inputElm = helper.compileInput('<input type="checkbox" ng-model="foo" ng-change="changeFn()">');

    $rootScope.changeFn = jasmine.createSpy('changeFn');
    expect($rootScope.changeFn).not.toHaveBeenCalled();

    browserTrigger(inputElm, 'click');
    expect($rootScope.changeFn).toHaveBeenCalledOnce();
  });


  it('should be able to change the model and via that also update the view', function() {
    var inputElm = helper.compileInput('<input type="text" ng-model="value" ng-change="value=\'b\'" />');

    helper.changeInputValueTo('a');
    expect(inputElm.val()).toBe('b');
  });
});
