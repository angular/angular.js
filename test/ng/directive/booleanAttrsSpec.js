'use strict';

describe('boolean attr directives', function() {
  var element;

  afterEach(function() {
    dealoc(element);
  });


  it('should properly evaluate 0 as false', inject(function($rootScope, $compile) {
    // jQuery does not treat 0 as false, when setting attr()
    element = $compile('<button ng-disabled="isDisabled">Button</button>')($rootScope)
    $rootScope.isDisabled = 0;
    $rootScope.$digest();
    expect(element.attr('disabled')).toBeFalsy();
    $rootScope.isDisabled = 1;
    $rootScope.$digest();
    expect(element.attr('disabled')).toBeTruthy();
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

  it('should bind open', inject(function($rootScope, $compile) {
    element = $compile('<details ng-open="isOpen"></details>')($rootScope)
    $rootScope.isOpen=false;
    $rootScope.$digest();
    expect(element.attr('open')).toBeFalsy();
    $rootScope.isOpen=true;
    $rootScope.$digest();
    expect(element.attr('open')).toBeTruthy();
  }));
});


describe('ngSrc', function() {

  it('should interpolate the expression and bind to src', inject(function($compile, $rootScope) {
    var element = $compile('<div ng-src="some/{{id}}"></div>')($rootScope);

    $rootScope.$digest();
    expect(element.attr('src')).toEqual('some/');

    $rootScope.$apply(function() {
      $rootScope.id = 1;
    });
    expect(element.attr('src')).toEqual('some/1');

    dealoc(element);
  }));

  if (msie) {
    it('should update the element property as well as the attribute', inject(
        function($compile, $rootScope) {
      // on IE, if "ng:src" directive declaration is used and "src" attribute doesn't exist
      // then calling element.setAttribute('src', 'foo') doesn't do anything, so we need
      // to set the property as well to achieve the desired effect

      var element = $compile('<div ng-src="some/{{id}}"></div>')($rootScope);

      $rootScope.$digest();
      expect(element.prop('src')).toEqual('some/');

      $rootScope.$apply(function() {
        $rootScope.id = 1;
      });
      expect(element.prop('src')).toEqual('some/1');

      dealoc(element);
    }));
  }
});


describe('ngHref', function() {
  var element;

  afterEach(function() {
    dealoc(element);
  });


  it('should interpolate the expression and bind to href', inject(function($compile, $rootScope) {
    element = $compile('<div ng-href="some/{{id}}"></div>')($rootScope)
    $rootScope.$digest();
    expect(element.attr('href')).toEqual('some/');

    $rootScope.$apply(function() {
      $rootScope.id = 1;
    });
    expect(element.attr('href')).toEqual('some/1');
  }));


  it('should bind href and merge with other attrs', inject(function($rootScope, $compile) {
    element = $compile('<a ng-href="{{url}}" rel="{{rel}}"></a>')($rootScope);
    $rootScope.url = 'http://server';
    $rootScope.rel = 'REL';
    $rootScope.$digest();
    expect(element.attr('href')).toEqual('http://server');
    expect(element.attr('rel')).toEqual('REL');
  }));


  it('should bind href even if no interpolation', inject(function($rootScope, $compile) {
    element = $compile('<a ng-href="http://server"></a>')($rootScope)
    $rootScope.$digest();
    expect(element.attr('href')).toEqual('http://server');
  }));
});
