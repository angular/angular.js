'use strict';

describe('boolean attr directives', function() {
  var element;

  afterEach(function() {
    dealoc(element);
  });


  it('should bind href', inject(function($rootScope, $compile) {
    element = $compile('<a ng-href="{{url}}"></a>')($rootScope)
    $rootScope.url = 'http://server';
    $rootScope.$digest();
    expect(element.attr('href')).toEqual('http://server');
  }));


  it('should bind href even if no interpolation', inject(function($rootScope, $compile) {
    element = $compile('<a ng-href="http://server"></a>')($rootScope)
    $rootScope.$digest();
    expect(element.attr('href')).toEqual('http://server');
  }));


  it('should bind disabled', inject(function($rootScope, $compile) {
    element = $compile('<button ng-disabled="isDisabled">Button</button>')($rootScope)
    $rootScope.isDisabled = false;
    $rootScope.$digest();
    expect(element.attr('disabled')).toBeFalsy();
    $rootScope.isDisabled = true;
    $rootScope.$digest();
    expect(element.attr('disabled')).toBeTruthy();
  }));


  it('should bind checked', inject(function($rootScope, $compile) {
    element = $compile('<input type="checkbox" ng-checked="isChecked" />')($rootScope)
    $rootScope.isChecked = false;
    $rootScope.$digest();
    expect(element.attr('checked')).toBeFalsy();
    $rootScope.isChecked=true;
    $rootScope.$digest();
    expect(element.attr('checked')).toBeTruthy();
  }));


  it('should bind selected', inject(function($rootScope, $compile) {
    element = $compile('<select><option value=""></option><option ng-selected="isSelected">Greetings!</option></select>')($rootScope)
    jqLite(document.body).append(element)
    $rootScope.isSelected=false;
    $rootScope.$digest();
    expect(element.children()[1].selected).toBeFalsy();
    $rootScope.isSelected=true;
    $rootScope.$digest();
    expect(element.children()[1].selected).toBeTruthy();
  }));


  it('should bind readonly', inject(function($rootScope, $compile) {
    element = $compile('<input type="text" ng-readonly="isReadonly" />')($rootScope)
    $rootScope.isReadonly=false;
    $rootScope.$digest();
    expect(element.attr('readOnly')).toBeFalsy();
    $rootScope.isReadonly=true;
    $rootScope.$digest();
    expect(element.attr('readOnly')).toBeTruthy();
  }));


  it('should bind multiple', inject(function($rootScope, $compile) {
    element = $compile('<select ng-multiple="isMultiple"></select>')($rootScope)
    $rootScope.isMultiple=false;
    $rootScope.$digest();
    expect(element.attr('multiple')).toBeFalsy();
    $rootScope.isMultiple='multiple';
    $rootScope.$digest();
    expect(element.attr('multiple')).toBeTruthy();
  }));


  it('should bind src', inject(function($rootScope, $compile) {
    element = $compile('<div ng-src="{{url}}" />')($rootScope)
    $rootScope.url = 'http://localhost/';
    $rootScope.$digest();
    expect(element.attr('src')).toEqual('http://localhost/');
  }));


  it('should bind href and merge with other attrs', inject(function($rootScope, $compile) {
    element = $compile('<a ng-href="{{url}}" rel="{{rel}}"></a>')($rootScope);
    $rootScope.url = 'http://server';
    $rootScope.rel = 'REL';
    $rootScope.$digest();
    expect(element.attr('href')).toEqual('http://server');
    expect(element.attr('rel')).toEqual('REL');
  }));
});


describe('ng-src', function() {

  it('should interpolate the expression and bind to src', inject(function($compile, $rootScope) {
    var element = $compile('<div ng-src="some/{{id}}"></div>')($rootScope)
    $rootScope.$digest();
    expect(element.attr('src')).toEqual('some/');

    $rootScope.$apply(function() {
      $rootScope.id = 1;
    });
    expect(element.attr('src')).toEqual('some/1');

    dealoc(element);
  }));
});


describe('ng-href', function() {

  it('should interpolate the expression and bind to href', inject(function($compile, $rootScope) {
    var element = $compile('<div ng-href="some/{{id}}"></div>')($rootScope)
    $rootScope.$digest();
    expect(element.attr('href')).toEqual('some/');

    $rootScope.$apply(function() {
      $rootScope.id = 1;
    });
    expect(element.attr('href')).toEqual('some/1');

    dealoc(element);
  }));
});
