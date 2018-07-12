'use strict';

describe('boolean attr directives', function() {
  var element;

  afterEach(function() {
    dealoc(element);
  });


  it('should properly evaluate 0 as false', inject(function($rootScope, $compile) {
    // jQuery does not treat 0 as false, when setting attr()
    element = $compile('<button ng-disabled="isDisabled">Button</button>')($rootScope);
    $rootScope.isDisabled = 0;
    $rootScope.$digest();
    expect(element.attr('disabled')).toBeFalsy();
    $rootScope.isDisabled = 1;
    $rootScope.$digest();
    expect(element.attr('disabled')).toBeTruthy();
  }));


  it('should bind disabled', inject(function($rootScope, $compile) {
    element = $compile('<button ng-disabled="isDisabled">Button</button>')($rootScope);
    $rootScope.isDisabled = false;
    $rootScope.$digest();
    expect(element.attr('disabled')).toBeFalsy();
    $rootScope.isDisabled = true;
    $rootScope.$digest();
    expect(element.attr('disabled')).toBeTruthy();
  }));


  it('should bind checked', inject(function($rootScope, $compile) {
    element = $compile('<input type="checkbox" ng-checked="isChecked" />')($rootScope);
    $rootScope.isChecked = false;
    $rootScope.$digest();
    expect(element.attr('checked')).toBeFalsy();
    $rootScope.isChecked = true;
    $rootScope.$digest();
    expect(element.attr('checked')).toBeTruthy();
  }));


  it('should not bind checked when ngModel is present', inject(function($rootScope, $compile, $document, $rootElement) {
    // test for https://github.com/angular/angular.js/issues/10662
    element = $compile('<input type="checkbox" ng-model="value" ng-false-value="\'false\'" ' +
      'ng-true-value="\'true\'" ng-checked="value" />')($rootScope);

    // Append the app to the document so that "click" triggers "change"
    // Support: Chrome, Safari 8, 9
    jqLite($document[0].body).append($rootElement.append(element));

    $rootScope.value = 'true';
    $rootScope.$digest();
    expect(element[0].checked).toBe(true);
    browserTrigger(element, 'click');
    expect(element[0].checked).toBe(false);
    expect($rootScope.value).toBe('false');
    browserTrigger(element, 'click');
    expect(element[0].checked).toBe(true);
    expect($rootScope.value).toBe('true');
  }));


  it('should bind selected', inject(function($rootScope, $compile) {
    element = $compile('<select><option value=""></option><option ng-selected="isSelected">Greetings!</option></select>')($rootScope);
    jqLite(window.document.body).append(element);
    $rootScope.isSelected = false;
    $rootScope.$digest();
    expect(element.children()[1].selected).toBeFalsy();
    $rootScope.isSelected = true;
    $rootScope.$digest();
    expect(element.children()[1].selected).toBeTruthy();
  }));


  it('should bind readonly', inject(function($rootScope, $compile) {
    element = $compile('<input type="text" ng-readonly="isReadonly" />')($rootScope);
    $rootScope.isReadonly = false;
    $rootScope.$digest();
    expect(element.attr('readOnly')).toBeFalsy();
    $rootScope.isReadonly = true;
    $rootScope.$digest();
    expect(element.attr('readOnly')).toBeTruthy();
  }));


  it('should bind open', inject(function($rootScope, $compile) {
    element = $compile('<details ng-open="isOpen"></details>')($rootScope);
    $rootScope.isOpen = false;
    $rootScope.$digest();
    expect(element.attr('open')).toBeFalsy();
    $rootScope.isOpen = true;
    $rootScope.$digest();
    expect(element.attr('open')).toBeTruthy();
  }));


  describe('multiple', function() {
    it('should NOT bind to multiple via ngMultiple', inject(function($rootScope, $compile) {
      element = $compile('<select ng-multiple="isMultiple"></select>')($rootScope);
      $rootScope.isMultiple = false;
      $rootScope.$digest();
      expect(element.attr('multiple')).toBeFalsy();
      $rootScope.isMultiple = 'multiple';
      $rootScope.$digest();
      expect(element.attr('multiple')).toBeFalsy(); // ignore
    }));


    it('should throw an exception if binding to multiple attribute', inject(function($rootScope, $compile) {
      expect(function() {
        $compile('<select multiple="{{isMultiple}}"></select>');
      }).toThrowMinErr('$compile', 'selmulti', 'Binding to the \'multiple\' attribute is not supported. ' +
                 'Element: <select multiple="{{isMultiple}}">');

    }));
  });
});
