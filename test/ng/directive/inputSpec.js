'use strict';

describe('NgModelController', function() {
  /* global NgModelController: false */
  var ctrl, scope, ngModelAccessor, element, parentFormCtrl;

  beforeEach(inject(function($rootScope, $controller) {
    var attrs = {name: 'testAlias', ngModel: 'value'};

    parentFormCtrl = {
      $setValidity: jasmine.createSpy('$setValidity'),
      $setDirty: jasmine.createSpy('$setDirty')
    };

    element = jqLite('<form><input></form>');
    element.data('$formController', parentFormCtrl);

    scope = $rootScope;
    ngModelAccessor = jasmine.createSpy('ngModel accessor');
    ctrl = $controller(NgModelController, {
      $scope: scope,
      $element: element.find('input'),
      $attrs: attrs
    });
  }));


  afterEach(function() {
    dealoc(element);
  });


  it('should fail on non-assignable model binding', inject(function($controller) {
    var exception;

    try {
      $controller(NgModelController, {
        $scope: null,
        $element: jqLite('<input ng-model="1+2">'),
        $attrs: {
          ngModel: '1+2'
        }
      });
    } catch (e) {
      exception = e;
    }

    expect(exception.message).
        toMatch(/^\[ngModel:nonassign\] Expression '1\+2' is non\-assignable\. Element: <input( value="")? ng-model="1\+2">/);
  }));


  it('should init the properties', function() {
    expect(ctrl.$untouched).toBe(true);
    expect(ctrl.$touched).toBe(false);
    expect(ctrl.$dirty).toBe(false);
    expect(ctrl.$pristine).toBe(true);
    expect(ctrl.$valid).toBe(true);
    expect(ctrl.$invalid).toBe(false);

    expect(ctrl.$viewValue).toBeDefined();
    expect(ctrl.$modelValue).toBeDefined();

    expect(ctrl.$formatters).toEqual([]);
    expect(ctrl.$parsers).toEqual([]);

    expect(ctrl.$name).toBe('testAlias');
  });


  describe('setValidity', function() {

    it('should propagate invalid to the parent form only when valid', function() {
      expect(parentFormCtrl.$setValidity).not.toHaveBeenCalled();
      ctrl.$setValidity('ERROR', false);
      expect(parentFormCtrl.$setValidity).toHaveBeenCalledOnceWith('ERROR', false, ctrl);

      parentFormCtrl.$setValidity.reset();
      ctrl.$setValidity('ERROR', false);
      expect(parentFormCtrl.$setValidity).not.toHaveBeenCalled();
    });


    it('should set and unset the error', function() {
      ctrl.$setValidity('required', false);
      expect(ctrl.$error.required).toBe(true);

      ctrl.$setValidity('required', true);
      expect(ctrl.$error.required).toBe(false);
    });


    it('should set valid/invalid', function() {
      ctrl.$setValidity('first', false);
      expect(ctrl.$valid).toBe(false);
      expect(ctrl.$invalid).toBe(true);

      ctrl.$setValidity('second', false);
      expect(ctrl.$valid).toBe(false);
      expect(ctrl.$invalid).toBe(true);

      ctrl.$setValidity('second', true);
      expect(ctrl.$valid).toBe(false);
      expect(ctrl.$invalid).toBe(true);

      ctrl.$setValidity('first', true);
      expect(ctrl.$valid).toBe(true);
      expect(ctrl.$invalid).toBe(false);
    });


    it('should emit $valid only when $invalid', function() {
      ctrl.$setValidity('error', true);
      expect(parentFormCtrl.$setValidity).toHaveBeenCalledOnceWith('error', true, ctrl);
      parentFormCtrl.$setValidity.reset();

      ctrl.$setValidity('error', false);
      expect(parentFormCtrl.$setValidity).toHaveBeenCalledOnceWith('error', false, ctrl);
      parentFormCtrl.$setValidity.reset();
      ctrl.$setValidity('error', true);
      expect(parentFormCtrl.$setValidity).toHaveBeenCalledOnceWith('error', true, ctrl);
    });
  });

  describe('setPristine', function() {

    it('should set control to its pristine state', function() {
      ctrl.$setViewValue('edit');
      expect(ctrl.$dirty).toBe(true);
      expect(ctrl.$pristine).toBe(false);

      ctrl.$setPristine();
      expect(ctrl.$dirty).toBe(false);
      expect(ctrl.$pristine).toBe(true);
    });
  });

  describe('setUntouched', function() {

    it('should set control to its untouched state', function() {
      ctrl.$setTouched();

      ctrl.$setUntouched();
      expect(ctrl.$touched).toBe(false);
      expect(ctrl.$untouched).toBe(true);
    });
  });

  describe('setTouched', function() {

    it('should set control to its touched state', function() {
      ctrl.$setUntouched();

      ctrl.$setTouched();
      expect(ctrl.$touched).toBe(true);
      expect(ctrl.$untouched).toBe(false);
    });
  });

  describe('view -> model', function() {

    it('should set the value to $viewValue', function() {
      ctrl.$setViewValue('some-val');
      expect(ctrl.$viewValue).toBe('some-val');
    });


    it('should pipeline all registered parsers and set result to $modelValue', function() {
      var log = [];

      ctrl.$parsers.push(function(value) {
        log.push(value);
        return value + '-a';
      });

      ctrl.$parsers.push(function(value) {
        log.push(value);
        return value + '-b';
      });

      ctrl.$setViewValue('init');
      expect(log).toEqual(['init', 'init-a']);
      expect(ctrl.$modelValue).toBe('init-a-b');
    });


    it('should fire viewChangeListeners when the value changes in the view (even if invalid)',
        function() {
      var spy = jasmine.createSpy('viewChangeListener');
      ctrl.$viewChangeListeners.push(spy);
      ctrl.$setViewValue('val');
      expect(spy).toHaveBeenCalledOnce();
      spy.reset();

      // invalid
      ctrl.$parsers.push(function() {return undefined;});
      ctrl.$setViewValue('val2');
      expect(spy).toHaveBeenCalledOnce();
    });


    it('should reset the model when the view is invalid', function() {
      ctrl.$setViewValue('aaaa');
      expect(ctrl.$modelValue).toBe('aaaa');

      // add a validator that will make any input invalid
      ctrl.$parsers.push(function() {return undefined;});
      expect(ctrl.$modelValue).toBe('aaaa');
      ctrl.$setViewValue('bbbb');
      expect(ctrl.$modelValue).toBeUndefined();
    });


    it('should call parentForm.$setDirty only when pristine', function() {
      ctrl.$setViewValue('');
      expect(ctrl.$pristine).toBe(false);
      expect(ctrl.$dirty).toBe(true);
      expect(parentFormCtrl.$setDirty).toHaveBeenCalledOnce();

      parentFormCtrl.$setDirty.reset();
      ctrl.$setViewValue('');
      expect(ctrl.$pristine).toBe(false);
      expect(ctrl.$dirty).toBe(true);
      expect(parentFormCtrl.$setDirty).not.toHaveBeenCalled();
    });
  });


  describe('model -> view', function() {

    it('should set the value to $modelValue', function() {
      scope.$apply('value = 10');
      expect(ctrl.$modelValue).toBe(10);
    });


    it('should pipeline all registered formatters in reversed order and set result to $viewValue',
        function() {
      var log = [];

      ctrl.$formatters.unshift(function(value) {
        log.push(value);
        return value + 2;
      });

      ctrl.$formatters.unshift(function(value) {
        log.push(value);
        return value + '';
      });

      scope.$apply('value = 3');
      expect(log).toEqual([3, 5]);
      expect(ctrl.$viewValue).toBe('5');
    });


    it('should $render only if value changed', function() {
      spyOn(ctrl, '$render');

      scope.$apply('value = 3');
      expect(ctrl.$render).toHaveBeenCalledOnce();
      ctrl.$render.reset();

      ctrl.$formatters.push(function() {return 3;});
      scope.$apply('value = 5');
      expect(ctrl.$render).not.toHaveBeenCalled();
    });


    it('should clear the view even if invalid', function() {
      spyOn(ctrl, '$render');

      ctrl.$formatters.push(function() {return undefined;});
      scope.$apply('value = 5');
      expect(ctrl.$render).toHaveBeenCalledOnce();
    });
  });

  describe('$validators', function() {

    it('should perform validations when $validate() is called', function() {
      ctrl.$validators.uppercase = function(value) {
        return (/^[A-Z]+$/).test(value);
      };

      ctrl.$modelValue = 'test';
      ctrl.$$invalidModelValue = undefined;
      ctrl.$validate();

      expect(ctrl.$valid).toBe(false);

      ctrl.$modelValue = 'TEST';
      ctrl.$$invalidModelValue = undefined;
      ctrl.$validate();

      expect(ctrl.$valid).toBe(true);
    });

    it('should always perform validations using the parsed model value', function() {
      var captures;
      ctrl.$validators.raw = function() {
        captures = arguments;
        return captures[0];
      };

      ctrl.$parsers.push(function(value) {
        return value.toUpperCase();
      });

      ctrl.$setViewValue('my-value');

      expect(captures).toEqual(['MY-VALUE', 'my-value']);
    });

    it('should always perform validations using the formatted view value', function() {
      var captures;
      ctrl.$validators.raw = function() {
        captures = arguments;
        return captures[0];
      };

      ctrl.$formatters.push(function(value) {
        return value + '...';
      });

      scope.$apply('value = "matias"');

      expect(captures).toEqual(['matias', 'matias...']);
    });

    it('should only perform validations if the view value is different', function() {
      var count = 0;
      ctrl.$validators.countMe = function() {
        count++;
      };

      ctrl.$setViewValue('my-value');
      expect(count).toBe(1);

      ctrl.$setViewValue('my-value');
      expect(count).toBe(1);

      ctrl.$setViewValue('your-value');
      expect(count).toBe(2);
    });

    it('should perform validations twice each time the model value changes within a digest', function() {
      var count = 0;
      ctrl.$validators.number = function(value) {
        count++;
        return (/^\d+$/).test(value);
      };

      scope.$apply('value = ""');
      expect(count).toBe(1);

      scope.$apply('value = 1');
      expect(count).toBe(2);

      scope.$apply('value = 1');
      expect(count).toBe(2);

      scope.$apply('value = ""');
      expect(count).toBe(3);
    });

    it('should only validate to true if all validations are true', function() {
      var curry = function(v) {
        return function() {
          return v;
        };
      };

      ctrl.$modelValue = undefined;
      ctrl.$validators.a = curry(true);
      ctrl.$validators.b = curry(true);
      ctrl.$validators.c = curry(false);

      ctrl.$validate();
      expect(ctrl.$valid).toBe(false);

      ctrl.$validators.c = curry(true);

      ctrl.$validate();
      expect(ctrl.$valid).toBe(true);
    });

    it('should register invalid validations on the $error object', function() {
      var curry = function(v) {
        return function() {
          return v;
        };
      };

      ctrl.$modelValue = undefined;
      ctrl.$validators.unique = curry(false);
      ctrl.$validators.tooLong = curry(false);
      ctrl.$validators.notNumeric = curry(true);

      ctrl.$validate();

      expect(ctrl.$error.unique).toBe(true);
      expect(ctrl.$error.tooLong).toBe(true);
      expect(ctrl.$error.notNumeric).not.toBe(true);
    });
  });
});

describe('ngModel', function() {

  it('should set css classes (ng-valid, ng-invalid, ng-pristine, ng-dirty, ng-untouched, ng-touched)',
      inject(function($compile, $rootScope, $sniffer) {
    var element = $compile('<input type="email" ng-model="value" />')($rootScope);

    $rootScope.$digest();
    expect(element).toBeValid();
    expect(element).toBePristine();
    expect(element).toBeUntouched();
    expect(element.hasClass('ng-valid-email')).toBe(true);
    expect(element.hasClass('ng-invalid-email')).toBe(false);

    $rootScope.$apply("value = 'invalid-email'");
    expect(element).toBeInvalid();
    expect(element).toBePristine();
    expect(element.hasClass('ng-valid-email')).toBe(false);
    expect(element.hasClass('ng-invalid-email')).toBe(true);

    element.val('invalid-again');
    browserTrigger(element, ($sniffer.hasEvent('input')) ? 'input' : 'change');
    expect(element).toBeInvalid();
    expect(element).toBeDirty();
    expect(element.hasClass('ng-valid-email')).toBe(false);
    expect(element.hasClass('ng-invalid-email')).toBe(true);

    element.val('vojta@google.com');
    browserTrigger(element, $sniffer.hasEvent('input') ? 'input' : 'change');
    expect(element).toBeValid();
    expect(element).toBeDirty();
    expect(element.hasClass('ng-valid-email')).toBe(true);
    expect(element.hasClass('ng-invalid-email')).toBe(false);

    browserTrigger(element, 'blur');
    expect(element).toBeTouched();

    dealoc(element);
  }));


  it('should set invalid classes on init', inject(function($compile, $rootScope) {
    var element = $compile('<input type="email" ng-model="value" required />')($rootScope);
    $rootScope.$digest();

    expect(element).toBeInvalid();
    expect(element).toHaveClass('ng-invalid-required');
  }));


  it('should set the control touched state on "blur" event', inject(function($compile, $rootScope) {
    var element = $compile('<form name="myForm">' +
                             '<input name="myControl" ng-model="value" >' +
                           '</form>')($rootScope);
    var inputElm = element.find('input');
    var control = $rootScope.myForm.myControl;

    expect(control.$touched).toBe(false);
    expect(control.$untouched).toBe(true);

    browserTrigger(inputElm, 'blur');
    expect(control.$touched).toBe(true);
    expect(control.$untouched).toBe(false);

    dealoc(element);
  }));

  it('should not cause a digest on "blur" event if control is already touched',
      inject(function($compile, $rootScope) {

    var element = $compile('<form name="myForm">' +
                             '<input name="myControl" ng-model="value" >' +
                           '</form>')($rootScope);
    var inputElm = element.find('input');
    var control = $rootScope.myForm.myControl;

    control.$setTouched();
    spyOn($rootScope, '$apply');
    browserTrigger(inputElm, 'blur');

    expect($rootScope.$apply).not.toHaveBeenCalled();

    dealoc(element);
  }));

  it('should register/deregister a nested ngModel with parent form when entering or leaving DOM',
      inject(function($compile, $rootScope) {

    var element = $compile('<form name="myForm">' +
                             '<input ng-if="inputPresent" name="myControl" ng-model="value" required >' +
                           '</form>')($rootScope);
    var isFormValid;

    $rootScope.inputPresent = false;
    $rootScope.$watch('myForm.$valid', function(value) { isFormValid = value; });

    $rootScope.$apply();

    expect($rootScope.myForm.$valid).toBe(true);
    expect(isFormValid).toBe(true);
    expect($rootScope.myForm.myControl).toBeUndefined();

    $rootScope.inputPresent = true;
    $rootScope.$apply();

    expect($rootScope.myForm.$valid).toBe(false);
    expect(isFormValid).toBe(false);
    expect($rootScope.myForm.myControl).toBeDefined();

    $rootScope.inputPresent = false;
    $rootScope.$apply();

    expect($rootScope.myForm.$valid).toBe(true);
    expect(isFormValid).toBe(true);
    expect($rootScope.myForm.myControl).toBeUndefined();

    dealoc(element);
  }));


  it('should register/deregister a nested ngModel with parent form when entering or leaving DOM with animations',
      function() {

    // ngAnimate performs the dom manipulation after digest, and since the form validity can be affected by a form
    // control going away we must ensure that the deregistration happens during the digest while we are still doing
    // dirty checking.
    module('ngAnimate');

    inject(function($compile, $rootScope) {
      var element = $compile('<form name="myForm">' +
                               '<input ng-if="inputPresent" name="myControl" ng-model="value" required >' +
                             '</form>')($rootScope);
      var isFormValid;

      $rootScope.inputPresent = false;
      // this watch ensure that the form validity gets updated during digest (so that we can observe it)
      $rootScope.$watch('myForm.$valid', function(value) { isFormValid = value; });

      $rootScope.$apply();

      expect($rootScope.myForm.$valid).toBe(true);
      expect(isFormValid).toBe(true);
      expect($rootScope.myForm.myControl).toBeUndefined();

      $rootScope.inputPresent = true;
      $rootScope.$apply();

      expect($rootScope.myForm.$valid).toBe(false);
      expect(isFormValid).toBe(false);
      expect($rootScope.myForm.myControl).toBeDefined();

      $rootScope.inputPresent = false;
      $rootScope.$apply();

      expect($rootScope.myForm.$valid).toBe(true);
      expect(isFormValid).toBe(true);
      expect($rootScope.myForm.myControl).toBeUndefined();

      dealoc(element);
    });
  });

  it('should keep previously defined watches consistent when changes in validity are made',
   inject(function($compile, $rootScope) {

    var isFormValid;
    $rootScope.$watch('myForm.$valid', function(value) { isFormValid = value; });

    var element = $compile('<form name="myForm">' +
      '<input  name="myControl" ng-model="value" required >' +
      '</form>')($rootScope);

    $rootScope.$apply();
    expect(isFormValid).toBe(false);
    expect($rootScope.myForm.$valid).toBe(false);

    $rootScope.value='value';
    $rootScope.$apply();
    expect(isFormValid).toBe(true);
    expect($rootScope.myForm.$valid).toBe(true);

    dealoc(element);
  }));

});


describe('input', function() {
  var formElm, inputElm, scope, $compile, $sniffer, $browser, changeInputValueTo, currentSpec;

  function compileInput(inputHtml, mockValidity) {
    inputElm = jqLite(inputHtml);
    if (isObject(mockValidity)) {
      VALIDITY_STATE_PROPERTY = 'ngMockValidity';
      inputElm.prop(VALIDITY_STATE_PROPERTY, mockValidity);
      currentSpec.after(function() {
        VALIDITY_STATE_PROPERTY = 'validity';
      });
    }
    formElm = jqLite('<form name="form"></form>');
    formElm.append(inputElm);
    $compile(formElm)(scope);
    scope.$digest();
  }

  var attrs;
  beforeEach(function() { currentSpec = this; });
  afterEach(function() { currentSpec = null; });
  beforeEach(module(function($compileProvider) {
    $compileProvider.directive('attrCapture', function() {
      return function(scope, element, $attrs) {
        attrs = $attrs;
      };
    });
  }));

  beforeEach(inject(function($injector, _$sniffer_, _$browser_) {
    $sniffer = _$sniffer_;
    $browser = _$browser_;
    $compile = $injector.get('$compile');
    scope = $injector.get('$rootScope');

    changeInputValueTo = function(value) {
      inputElm.val(value);
      browserTrigger(inputElm, $sniffer.hasEvent('input') ? 'input' : 'change');
    };
  }));

  afterEach(function() {
    dealoc(formElm);
  });


  it('should bind to a model', function() {
    compileInput('<input type="text" ng-model="name" name="alias" ng-change="change()" />');

    scope.$apply("name = 'misko'");

    expect(inputElm.val()).toBe('misko');
  });


  it('should not set readonly or disabled property on ie7', function() {
    this.addMatchers({
      toBeOff: function(attributeName) {
        var actualValue = this.actual.attr(attributeName);
        this.message = function() {
          return "Attribute '" + attributeName + "' expected to be off but was '" + actualValue +
            "' in: " + angular.mock.dump(this.actual);
        };

        return !actualValue || actualValue == 'false';
      }
    });

    compileInput('<input type="text" ng-model="name" name="alias"/>');
    expect(inputElm.prop('readOnly')).toBe(false);
    expect(inputElm.prop('disabled')).toBe(false);

    expect(inputElm).toBeOff('readOnly');
    expect(inputElm).toBeOff('readonly');
    expect(inputElm).toBeOff('disabled');
  });


  it('should update the model on "blur" event', function() {
    compileInput('<input type="text" ng-model="name" name="alias" ng-change="change()" />');

    changeInputValueTo('adam');
    expect(scope.name).toEqual('adam');
  });

  if (!msie || msie >= 9) {
    describe('compositionevents', function() {
      it('should not update the model between "compositionstart" and "compositionend" on non android', inject(function($sniffer) {
        $sniffer.android = false;

        compileInput('<input type="text" ng-model="name" name="alias"" />');
        changeInputValueTo('a');
        expect(scope.name).toEqual('a');
        browserTrigger(inputElm, 'compositionstart');
        changeInputValueTo('adam');
        expect(scope.name).toEqual('a');
        browserTrigger(inputElm, 'compositionend');
        changeInputValueTo('adam');
        expect(scope.name).toEqual('adam');
      }));

      it('should update the model between "compositionstart" and "compositionend" on android', inject(function($sniffer) {
        $sniffer.android = true;

        compileInput('<input type="text" ng-model="name" name="alias"" />');
        changeInputValueTo('a');
        expect(scope.name).toEqual('a');
        browserTrigger(inputElm, 'compositionstart');
        changeInputValueTo('adam');
        expect(scope.name).toEqual('adam');
        browserTrigger(inputElm, 'compositionend');
        changeInputValueTo('adam2');
        expect(scope.name).toEqual('adam2');
      }));
    });
  }

  it('should update the model on "compositionend"', function() {
    compileInput('<input type="text" ng-model="name" name="alias" />');
    if (!msie || msie >= 9) {
      browserTrigger(inputElm, 'compositionstart');
      changeInputValueTo('caitp');
      expect(scope.name).toBeUndefined();
      browserTrigger(inputElm, 'compositionend');
      expect(scope.name).toEqual('caitp');
    }
  });

  it('should not dirty the model on an input event in response to a placeholder change', inject(function($sniffer) {
    if (msie && $sniffer.hasEvent('input')) {
      compileInput('<input type="text" ng-model="name" name="name" />');
      inputElm.attr('placeholder', 'Test');
      browserTrigger(inputElm, 'input');

      expect(inputElm.attr('placeholder')).toBe('Test');
      expect(inputElm).toBePristine();

      inputElm.attr('placeholder', 'Test Again');
      browserTrigger(inputElm, 'input');

      expect(inputElm.attr('placeholder')).toBe('Test Again');
      expect(inputElm).toBePristine();
    }
  }));

  describe('"change" event', function() {
    function assertBrowserSupportsChangeEvent(inputEventSupported) {
      // Force browser to report a lack of an 'input' event
      $sniffer.hasEvent = function(eventName) {
        if (eventName === 'input' && !inputEventSupported) {
          return false;
        }
        return true;
      };
      compileInput('<input type="text" ng-model="name" name="alias" />');

      inputElm.val('mark');
      browserTrigger(inputElm, 'change');
      expect(scope.name).toEqual('mark');
    }

    it('should update the model event if the browser does not support the "input" event',function() {
      assertBrowserSupportsChangeEvent(false);
    });

    it('should update the model event if the browser supports the "input" ' +
      'event so that form auto complete works',function() {
      assertBrowserSupportsChangeEvent(true);
    });

    if (!_jqLiteMode) {
      it('should not cause the double $digest when triggering an event using jQuery', function() {
        $sniffer.hasEvent = function(eventName) {
          return eventName !== 'input';
        };

        compileInput('<input type="text" ng-model="name" name="alias" ng-change="change()" />');

        scope.field = 'fake field';
        scope.$watch('field', function() {
          // We need to use _originalTrigger since trigger is modified by Angular Scenario.
          inputElm._originalTrigger('change');
        });
        scope.$apply();
      });
    }
  });

  describe('"paste" and "cut" events', function() {
    beforeEach(function() {
      // Force browser to report a lack of an 'input' event
      $sniffer.hasEvent = function(eventName) {
        return eventName !== 'input';
      };
    });

    it('should update the model on "paste" event', function() {
      compileInput('<input type="text" ng-model="name" name="alias" ng-change="change()" />');

      inputElm.val('mark');
      browserTrigger(inputElm, 'paste');
      $browser.defer.flush();
      expect(scope.name).toEqual('mark');
    });

    it('should update the model on "cut" event', function() {
      compileInput('<input type="text" ng-model="name" name="alias" ng-change="change()" />');

      inputElm.val('john');
      browserTrigger(inputElm, 'cut');
      $browser.defer.flush();
      expect(scope.name).toEqual('john');
    });

  });


  it('should update the model and trim the value', function() {
    compileInput('<input type="text" ng-model="name" name="alias" ng-change="change()" />');

    changeInputValueTo('  a  ');
    expect(scope.name).toEqual('a');
  });


  it('should update the model and not trim the value', function() {
    compileInput('<input type="text" ng-model="name" name="alias" ng-trim="false" />');

    changeInputValueTo('  a  ');
    expect(scope.name).toEqual('  a  ');
  });


  describe('ngModelOptions attributes', function() {

    it('should allow overriding the model update trigger event on text inputs', function() {
      compileInput(
          '<input type="text" ng-model="name" name="alias" '+
            'ng-model-options="{ updateOn: \'blur\' }"'+
          '/>');

      changeInputValueTo('a');
      expect(scope.name).toBeUndefined();
      browserTrigger(inputElm, 'blur');
      expect(scope.name).toEqual('a');
    });

    it('should not dirty the input if nothing was changed before updateOn trigger', function() {
      compileInput(
          '<input type="text" ng-model="name" name="alias" '+
            'ng-model-options="{ updateOn: \'blur\' }"'+
          '/>');

      browserTrigger(inputElm, 'blur');
      expect(scope.form.alias.$pristine).toBeTruthy();
    });

    it('should allow overriding the model update trigger event on text areas', function() {
      compileInput(
          '<textarea ng-model="name" name="alias" '+
            'ng-model-options="{ updateOn: \'blur\' }"'+
          '/>');

      changeInputValueTo('a');
      expect(scope.name).toBeUndefined();
      browserTrigger(inputElm, 'blur');
      expect(scope.name).toEqual('a');
    });

    it('should bind the element to a list of events', function() {
      compileInput(
          '<input type="text" ng-model="name" name="alias" '+
            'ng-model-options="{ updateOn: \'blur mousemove\' }"'+
          '/>');

      changeInputValueTo('a');
      expect(scope.name).toBeUndefined();
      browserTrigger(inputElm, 'blur');
      expect(scope.name).toEqual('a');

      changeInputValueTo('b');
      expect(scope.name).toEqual('a');
      browserTrigger(inputElm, 'mousemove');
      expect(scope.name).toEqual('b');
    });


    it('should allow keeping the default update behavior on text inputs', function() {
      compileInput(
          '<input type="text" ng-model="name" name="alias" '+
            'ng-model-options="{ updateOn: \'default\' }"'+
          '/>');

      changeInputValueTo('a');
      expect(scope.name).toEqual('a');
    });


    it('should allow overriding the model update trigger event on checkboxes', function() {
      compileInput(
          '<input type="checkbox" ng-model="checkbox" '+
            'ng-model-options="{ updateOn: \'blur\' }"'+
          '/>');

      browserTrigger(inputElm, 'click');
      expect(scope.checkbox).toBe(undefined);

      browserTrigger(inputElm, 'blur');
      expect(scope.checkbox).toBe(true);

      browserTrigger(inputElm, 'click');
      expect(scope.checkbox).toBe(true);
    });


    it('should allow keeping the default update behavior on checkboxes', function() {
      compileInput(
          '<input type="checkbox" ng-model="checkbox" '+
            'ng-model-options="{ updateOn: \'blur default\' }"'+
          '/>');

      browserTrigger(inputElm, 'click');
      expect(scope.checkbox).toBe(true);

      browserTrigger(inputElm, 'click');
      expect(scope.checkbox).toBe(false);
    });


    it('should allow overriding the model update trigger event on radio buttons', function() {
      compileInput(
          '<input type="radio" ng-model="color" value="white" '+
            'ng-model-options="{ updateOn: \'blur\'}"'+
          '/>' +
          '<input type="radio" ng-model="color" value="red" '+
            'ng-model-options="{ updateOn: \'blur\'}"'+
          '/>' +
          '<input type="radio" ng-model="color" value="blue" '+
            'ng-model-options="{ updateOn: \'blur\'}"'+
          '/>');

      scope.$apply("color = 'white'");
      browserTrigger(inputElm[2], 'click');
      expect(scope.color).toBe('white');

      browserTrigger(inputElm[2], 'blur');
      expect(scope.color).toBe('blue');

    });


    it('should allow keeping the default update behavior on radio buttons', function() {
      compileInput(
          '<input type="radio" ng-model="color" value="white" '+
            'ng-model-options="{ updateOn: \'blur default\' }"'+
          '/>' +
          '<input type="radio" ng-model="color" value="red" '+
            'ng-model-options="{ updateOn: \'blur default\' }"'+
          '/>' +
          '<input type="radio" ng-model="color" value="blue" '+
            'ng-model-options="{ updateOn: \'blur default\' }"'+
          '/>');

      scope.$apply("color = 'white'");
      browserTrigger(inputElm[2], 'click');
      expect(scope.color).toBe('blue');
    });


    it('should trigger only after timeout in text inputs', inject(function($timeout) {
      compileInput(
          '<input type="text" ng-model="name" name="alias" '+
            'ng-model-options="{ debounce: 10000 }"'+
          '/>');

      changeInputValueTo('a');
      changeInputValueTo('b');
      changeInputValueTo('c');
      expect(scope.name).toEqual(undefined);
      $timeout.flush(2000);
      expect(scope.name).toEqual(undefined);
      $timeout.flush(9000);
      expect(scope.name).toEqual('c');
    }));


    it('should trigger only after timeout in checkboxes', inject(function($timeout) {
      compileInput(
          '<input type="checkbox" ng-model="checkbox" '+
            'ng-model-options="{ debounce: 10000 }"'+
          '/>');

      browserTrigger(inputElm, 'click');
      expect(scope.checkbox).toBe(undefined);
      $timeout.flush(2000);
      expect(scope.checkbox).toBe(undefined);
      $timeout.flush(9000);
      expect(scope.checkbox).toBe(true);
    }));


    it('should trigger only after timeout in radio buttons', inject(function($timeout) {
      compileInput(
          '<input type="radio" ng-model="color" value="white" />' +
          '<input type="radio" ng-model="color" value="red" '+
            'ng-model-options="{ debounce: 20000 }"'+
          '/>' +
          '<input type="radio" ng-model="color" value="blue" '+
            'ng-model-options="{ debounce: 30000 }"'+
          '/>');

      browserTrigger(inputElm[0], 'click');
      expect(scope.color).toBe('white');
      browserTrigger(inputElm[1], 'click');
      expect(scope.color).toBe('white');
      $timeout.flush(12000);
      expect(scope.color).toBe('white');
      $timeout.flush(10000);
      expect(scope.color).toBe('red');

    }));

    it('should allow selecting different debounce timeouts for each event',
      inject(function($timeout) {
      compileInput(
          '<input type="text" ng-model="name" name="alias" '+
            'ng-model-options="{'+
              'updateOn: \'default blur\', '+
              'debounce: { default: 10000, blur: 5000 }'+
            '}"'+
          '/>');

      changeInputValueTo('a');
      expect(scope.checkbox).toBe(undefined);
      $timeout.flush(6000);
      expect(scope.checkbox).toBe(undefined);
      $timeout.flush(4000);
      expect(scope.name).toEqual('a');
      changeInputValueTo('b');
      browserTrigger(inputElm, 'blur');
      $timeout.flush(4000);
      expect(scope.name).toEqual('a');
      $timeout.flush(2000);
      expect(scope.name).toEqual('b');
    }));


    it('should allow selecting different debounce timeouts for each event on checkboxes', inject(function($timeout) {
      compileInput('<input type="checkbox" ng-model="checkbox" '+
        'ng-model-options="{ '+
          'updateOn: \'default blur\', debounce: { default: 10000, blur: 5000 } }"'+
        '/>');

      inputElm[0].checked = false;
      browserTrigger(inputElm, 'click');
      expect(scope.checkbox).toBe(undefined);
      $timeout.flush(8000);
      expect(scope.checkbox).toBe(undefined);
      $timeout.flush(3000);
      expect(scope.checkbox).toBe(true);
      inputElm[0].checked = true;
      browserTrigger(inputElm, 'click');
      browserTrigger(inputElm, 'blur');
      $timeout.flush(3000);
      expect(scope.checkbox).toBe(true);
      $timeout.flush(3000);
      expect(scope.checkbox).toBe(false);
    }));

    it('should allow selecting 0 for non-default debounce timeouts for each event on checkboxes', inject(function($timeout) {
      compileInput('<input type="checkbox" ng-model="checkbox" '+
        'ng-model-options="{ '+
          'updateOn: \'default blur\', debounce: { default: 10000, blur: 0 } }"'+
        '/>');

      inputElm[0].checked = false;
      browserTrigger(inputElm, 'click');
      expect(scope.checkbox).toBe(undefined);
      $timeout.flush(8000);
      expect(scope.checkbox).toBe(undefined);
      $timeout.flush(3000);
      expect(scope.checkbox).toBe(true);
      inputElm[0].checked = true;
      browserTrigger(inputElm, 'click');
      browserTrigger(inputElm, 'blur');
      $timeout.flush(0);
      expect(scope.checkbox).toBe(false);
    }));

    it('should inherit model update settings from ancestor elements', inject(function($timeout) {
      var doc = $compile(
          '<form name="test" '+
              'ng-model-options="{ debounce: 10000, updateOn: \'blur\' }" >' +
            '<input type="text" ng-model="name" name="alias" />'+
          '</form>')(scope);
      scope.$digest();

      inputElm = doc.find('input').eq(0);
      changeInputValueTo('a');
      expect(scope.name).toEqual(undefined);
      browserTrigger(inputElm, 'blur');
      expect(scope.name).toBe(undefined);
      $timeout.flush(2000);
      expect(scope.name).toBe(undefined);
      $timeout.flush(9000);
      expect(scope.name).toEqual('a');
      dealoc(doc);
    }));

    it('should flush debounced events when calling $commitViewValue directly', function() {
      compileInput(
        '<input type="text" ng-model="name" name="alias" '+
          'ng-model-options="{ debounce: 1000 }" />');

      changeInputValueTo('a');
      expect(scope.name).toEqual(undefined);
      scope.form.alias.$commitViewValue();
      expect(scope.name).toEqual('a');
    });

    it('should cancel debounced events when calling $commitViewValue', inject(function($timeout) {
      compileInput(
        '<input type="text" ng-model="name" name="alias" '+
          'ng-model-options="{ debounce: 1000 }"/>');

      changeInputValueTo('a');
      scope.form.alias.$commitViewValue();
      expect(scope.name).toEqual('a');

      scope.form.alias.$setPristine();
      $timeout.flush(1000);
      expect(scope.form.alias.$pristine).toBeTruthy();
    }));

    it('should reset input val if rollbackViewValue called during pending update', function() {
      compileInput(
        '<input type="text" ng-model="name" name="alias" '+
          'ng-model-options="{ updateOn: \'blur\' }" />');

      changeInputValueTo('a');
      expect(inputElm.val()).toBe('a');
      scope.form.alias.$rollbackViewValue();
      expect(inputElm.val()).toBe('');
      browserTrigger(inputElm, 'blur');
      expect(inputElm.val()).toBe('');
    });

    it('should allow canceling pending updates', inject(function($timeout) {
      compileInput(
        '<input type="text" ng-model="name" name="alias" '+
          'ng-model-options="{ updateOn: \'blur\' }" />');

      changeInputValueTo('a');
      expect(scope.name).toEqual(undefined);
      scope.form.alias.$rollbackViewValue();
      expect(scope.name).toEqual(undefined);
      browserTrigger(inputElm, 'blur');
      expect(scope.name).toEqual(undefined);
    }));

    it('should allow canceling debounced updates', inject(function($timeout) {
      compileInput(
        '<input type="text" ng-model="name" name="alias" '+
          'ng-model-options="{ debounce: 10000 }" />');

      changeInputValueTo('a');
      expect(scope.name).toEqual(undefined);
      $timeout.flush(2000);
      scope.form.alias.$rollbackViewValue();
      expect(scope.name).toEqual(undefined);
      $timeout.flush(10000);
      expect(scope.name).toEqual(undefined);
    }));

    it('should handle model updates correctly even if rollbackViewValue is not invoked', function() {
      compileInput(
        '<input type="text" ng-model="name" name="alias" '+
          'ng-model-options="{ updateOn: \'blur\' }" />');

      changeInputValueTo('a');
      scope.$apply("name = 'b'");
      browserTrigger(inputElm, 'blur');
      expect(scope.name).toBe('b');
    });

    it('should reset input val if rollbackViewValue called during debounce', inject(function($timeout) {
      compileInput(
        '<input type="text" ng-model="name" name="alias" '+
          'ng-model-options="{ debounce: 2000 }" />');

      changeInputValueTo('a');
      expect(inputElm.val()).toBe('a');
      scope.form.alias.$rollbackViewValue();
      expect(inputElm.val()).toBe('');
      $timeout.flush(3000);
      expect(inputElm.val()).toBe('');
    }));

    it('should not try to invoke a model if getterSetter is false', function() {
      compileInput(
        '<input type="text" ng-model="name" '+
          'ng-model-options="{ getterSetter: false }" />');

      var spy = scope.name = jasmine.createSpy('setterSpy');
      changeInputValueTo('a');
      expect(spy).not.toHaveBeenCalled();
      expect(inputElm.val()).toBe('a');
    });

    it('should not try to invoke a model if getterSetter is not set', function() {
      compileInput('<input type="text" ng-model="name" />');

      var spy = scope.name = jasmine.createSpy('setterSpy');
      changeInputValueTo('a');
      expect(spy).not.toHaveBeenCalled();
      expect(inputElm.val()).toBe('a');
    });

    it('should always try to invoke a model if getterSetter is true', function() {
      compileInput(
        '<input type="text" ng-model="name" '+
          'ng-model-options="{ getterSetter: true }" />');

      var spy = scope.name = jasmine.createSpy('setterSpy').andCallFake(function () {
        return 'b';
      });
      scope.$apply();
      expect(inputElm.val()).toBe('b');

      changeInputValueTo('a');
      expect(inputElm.val()).toBe('b');
      expect(spy).toHaveBeenCalledWith('a');
      expect(scope.name).toBe(spy);

      scope.name = 'c';
      changeInputValueTo('d');
      expect(inputElm.val()).toBe('d');
      expect(scope.name).toBe('d');
    });

  });

  it('should allow complex reference binding', function() {
    compileInput('<input type="text" ng-model="obj[\'abc\'].name"/>');

    scope.$apply("obj = { abc: { name: 'Misko'} }");
    expect(inputElm.val()).toEqual('Misko');
  });


  it('should ignore input without ngModel directive', function() {
    compileInput('<input type="text" name="whatever" required />');

    changeInputValueTo('');
    expect(inputElm.hasClass('ng-valid')).toBe(false);
    expect(inputElm.hasClass('ng-invalid')).toBe(false);
    expect(inputElm.hasClass('ng-pristine')).toBe(false);
    expect(inputElm.hasClass('ng-dirty')).toBe(false);
  });


  it('should report error on assignment error', function() {
    expect(function() {
      compileInput('<input type="text" ng-model="throw \'\'">');
    }).toThrowMinErr("$parse", "syntax", "Syntax Error: Token '''' is an unexpected token at column 7 of the expression [throw ''] starting at [''].");
  });


  it("should render as blank if null", function() {
    compileInput('<input type="text" ng-model="age" />');

    scope.$apply('age = null');

    expect(scope.age).toBeNull();
    expect(inputElm.val()).toEqual('');
  });


  it('should render 0 even if it is a number', function() {
    compileInput('<input type="text" ng-model="value" />');
    scope.$apply('value = 0');

    expect(inputElm.val()).toBe('0');
  });


  describe('pattern', function() {

    it('should validate in-lined pattern', function() {
      compileInput('<input type="text" ng-model="value" ng-pattern="/^\\d\\d\\d-\\d\\d-\\d\\d\\d\\d$/" />');

      changeInputValueTo('x000-00-0000x');
      expect(inputElm).toBeInvalid();

      changeInputValueTo('000-00-0000');
      expect(inputElm).toBeValid();

      changeInputValueTo('000-00-0000x');
      expect(inputElm).toBeInvalid();

      changeInputValueTo('123-45-6789');
      expect(inputElm).toBeValid();

      changeInputValueTo('x');
      expect(inputElm).toBeInvalid();
    });

    it('should listen on ng-pattern when pattern is observed', function() {
      var value, patternVal = /^\w+$/;
      compileInput('<input type="text" ng-model="value" ng-pattern="pat" attr-capture />');
      attrs.$observe('pattern', function(v) {
        value = attrs.pattern;
      });

      scope.$apply(function() {
        scope.pat = patternVal;
      });

      expect(value).toBe(patternVal);
    });

    it('should validate in-lined pattern with modifiers', function() {
      compileInput('<input type="text" ng-model="value" ng-pattern="/^abc?$/i" />');

      changeInputValueTo('aB');
      expect(inputElm).toBeValid();

      changeInputValueTo('xx');
      expect(inputElm).toBeInvalid();
    });


    it('should validate pattern from scope', function() {
      scope.regexp = /^\d\d\d-\d\d-\d\d\d\d$/;
      compileInput('<input type="text" ng-model="value" ng-pattern="regexp" />');

      changeInputValueTo('x000-00-0000x');
      expect(inputElm).toBeInvalid();

      changeInputValueTo('000-00-0000');
      expect(inputElm).toBeValid();

      changeInputValueTo('000-00-0000x');
      expect(inputElm).toBeInvalid();

      changeInputValueTo('123-45-6789');
      expect(inputElm).toBeValid();

      changeInputValueTo('x');
      expect(inputElm).toBeInvalid();

      scope.$apply(function() {
        scope.regexp = /abc?/;
      });

      changeInputValueTo('ab');
      expect(inputElm).toBeValid();

      changeInputValueTo('xx');
      expect(inputElm).toBeInvalid();
    });

    it('should perform validations when the ngPattern scope value changes', function() {
      scope.regexp = /^[a-z]+$/;
      compileInput('<input type="text" ng-model="value" ng-pattern="regexp" />');

      changeInputValueTo('abcdef');
      expect(inputElm).toBeValid();

      changeInputValueTo('123');
      expect(inputElm).toBeInvalid();

      scope.$apply(function() {
        scope.regexp = /^\d+$/;
      });

      expect(inputElm).toBeValid();

      changeInputValueTo('abcdef');
      expect(inputElm).toBeInvalid();

      scope.$apply(function() {
        scope.regexp = '';
      });

      expect(inputElm).toBeValid();
    });

    it('should register "pattern" with the model validations when the pattern attribute is used', function() {
      compileInput('<input type="text" name="input" ng-model="value" pattern="^\\d+$" />');

      changeInputValueTo('abcd');
      expect(inputElm).toBeInvalid();
      expect(scope.form.input.$error.pattern).toBe(true);

      changeInputValueTo('12345');
      expect(inputElm).toBeValid();
      expect(scope.form.input.$error.pattern).not.toBe(true);
    });

    it('should not throw an error when scope pattern can\'t be found', function() {
      expect(function() {
        compileInput('<input type="text" ng-model="foo" ng-pattern="fooRegexp" />');
        scope.$apply("foo = 'bar'");
      }).not.toThrowMatching(/^\[ngPattern:noregexp\] Expected fooRegexp to be a RegExp but was/);
    });

    it('should throw an error when the scope pattern is not a regular expression', function() {
      expect(function() {
        compileInput('<input type="text" ng-model="foo" ng-pattern="fooRegexp" />');
        scope.$apply(function() {
          scope.fooRegexp = {};
          scope.foo = 'bar';
        });
      }).toThrowMatching(/^\[ngPattern:noregexp\] Expected fooRegexp to be a RegExp but was/);
    });
  });


  describe('minlength', function() {

    it('should invalidate values that are shorter than the given minlength', function() {
      compileInput('<input type="text" ng-model="value" ng-minlength="3" />');

      changeInputValueTo('aa');
      expect(inputElm).toBeInvalid();

      changeInputValueTo('aaa');
      expect(inputElm).toBeValid();
    });

    it('should listen on ng-minlength when minlength is observed', function() {
      var value = 0;
      compileInput('<input type="text" ng-model="value" ng-minlength="min" attr-capture />');
      attrs.$observe('minlength', function(v) {
        value = int(attrs.minlength);
      });

      scope.$apply('min = 5');

      expect(value).toBe(5);
    });

    it('should observe the standard minlength attribute and register it as a validator on the model', function() {
      compileInput('<input type="text" name="input" ng-model="value" minlength="{{ min }}" />');
      scope.$apply('min = 10');

      changeInputValueTo('12345');
      expect(inputElm).toBeInvalid();
      expect(scope.form.input.$error.minlength).toBe(true);

      scope.$apply('min = 5');

      expect(inputElm).toBeValid();
      expect(scope.form.input.$error.minlength).not.toBe(true);
    });
  });


  describe('maxlength', function() {

    it('should invalidate values that are longer than the given maxlength', function() {
      compileInput('<input type="text" ng-model="value" ng-maxlength="5" />');

      changeInputValueTo('aaaaaaaa');
      expect(inputElm).toBeInvalid();

      changeInputValueTo('aaa');
      expect(inputElm).toBeValid();
    });

    it('should listen on ng-maxlength when maxlength is observed', function() {
      var value = 0;
      compileInput('<input type="text" ng-model="value" ng-maxlength="max" attr-capture />');
      attrs.$observe('maxlength', function(v) {
        value = int(attrs.maxlength);
      });

      scope.$apply('max = 10');

      expect(value).toBe(10);
    });

    it('should observe the standard maxlength attribute and register it as a validator on the model', function() {
      compileInput('<input type="text" name="input" ng-model="value" maxlength="{{ max }}" />');
      scope.$apply('max = 1');

      changeInputValueTo('12345');
      expect(inputElm).toBeInvalid();
      expect(scope.form.input.$error.maxlength).toBe(true);

      scope.$apply('max = 6');

      expect(inputElm).toBeValid();
      expect(scope.form.input.$error.maxlength).not.toBe(true);
    });

    it('should assign the correct model after an observed validator became valid', function() {
      compileInput('<input type="text" name="input" ng-model="value" maxlength="{{ max }}" />');

      scope.$apply('max = 1');
      changeInputValueTo('12345');
      expect(scope.value).toBeUndefined();

      scope.$apply('max = 6');
      expect(scope.value).toBe('12345');
    });

    it('should assign the correct model after an observed validator became invalid', function() {
      compileInput('<input type="text" name="input" ng-model="value" maxlength="{{ max }}" />');

      scope.$apply('max = 6');
      changeInputValueTo('12345');
      expect(scope.value).toBe('12345');

      scope.$apply('max = 1');
      expect(scope.value).toBeUndefined();
    });

    it('should leave the value as invalid if observed maxlength changed, but is still invalid', function() {
      compileInput('<input type="text" name="input" ng-model="value" maxlength="{{ max }}" />');
      scope.$apply('max = 1');

      changeInputValueTo('12345');
      expect(inputElm).toBeInvalid();
      expect(scope.form.input.$error.maxlength).toBe(true);
      expect(scope.value).toBeUndefined();

      scope.$apply('max = 3');

      expect(inputElm).toBeInvalid();
      expect(scope.form.input.$error.maxlength).toBe(true);
      expect(scope.value).toBeUndefined();
    });

    it('should not notify if observed maxlength changed, but is still invalid', function() {
      compileInput('<input type="text" name="input" ng-model="value" ng-change="ngChangeSpy()" ' +
                   'maxlength="{{ max }}" />');

      scope.$apply('max = 1');
      changeInputValueTo('12345');

      scope.ngChangeSpy = jasmine.createSpy();
      scope.$apply('max = 3');

      expect(scope.ngChangeSpy).not.toHaveBeenCalled();
    });

    it('should leave the model untouched when validating before model initialization', function() {
      scope.value = '12345';
      compileInput('<input type="text" name="input" ng-model="value" minlength="3" />');
      expect(scope.value).toBe('12345');
    });

  });


  // INPUT TYPES
  describe('month', function (){
    it('should render blank if model is not a Date object', function() {
      compileInput('<input type="month" ng-model="january"/>');

      scope.$apply(function(){
        scope.january = '2013-01';
      });

      expect(inputElm.val()).toBe('');
    });

    it('should set the view if the model is a valid Date object', function (){
      compileInput('<input type="month" ng-model="march"/>');

      scope.$apply(function(){
        scope.march = new Date(2013, 2, 1);
      });

      expect(inputElm.val()).toBe('2013-03');
    });

    it('should set the model undefined if the input is an invalid month string', function () {
      compileInput('<input type="month" ng-model="value"/>');

      scope.$apply(function(){
        scope.value = new Date(2013, 0, 1);
      });


      expect(inputElm.val()).toBe('2013-01');

      try {
        //set to text for browsers with datetime-local validation.
        inputElm[0].setAttribute('type', 'text');
      } catch(e) {
        //for IE8
      }

      changeInputValueTo('stuff');
      expect(inputElm.val()).toBe('stuff');
      expect(scope.value).toBeUndefined();
      expect(inputElm).toBeInvalid();
    });

    it('should render as blank if null', function() {
      compileInput('<input type="month" ng-model="test" />');

      scope.$apply('test = null');

      expect(scope.test).toBeNull();
      expect(inputElm.val()).toEqual('');
    });

    it('should come up blank when no value specified', function() {
      compileInput('<input type="month" ng-model="test" />');

      expect(inputElm.val()).toBe('');

      scope.$apply('test = null');

      expect(scope.test).toBeNull();
      expect(inputElm.val()).toBe('');
    });


    it('should parse empty string to null', function() {
      compileInput('<input type="month" ng-model="test" />');

      scope.$apply(function() {
        scope.test = new Date(2011, 0, 1);
      });

      changeInputValueTo('');
      expect(scope.test).toBeNull();
      expect(inputElm).toBeValid();
    });

    it('should use UTC if specified in the options', function() {
      compileInput('<input type="month" ng-model="value" ng-model-options="{timezone: \'UTC\'}" />');

      changeInputValueTo('2013-07');
      expect(+scope.value).toBe(Date.UTC(2013, 6, 1));

      scope.$apply(function() {
        scope.value = new Date(Date.UTC(2014, 6, 1));
      });
      expect(inputElm.val()).toBe('2014-07');
    });


    describe('min', function (){
      beforeEach(function (){
        compileInput('<input type="month" ng-model="value" name="alias" min="2013-01" />');
      });

      it('should invalidate', function (){
        changeInputValueTo('2012-12');
        expect(inputElm).toBeInvalid();
        expect(scope.value).toBeFalsy();
        expect(scope.form.alias.$error.min).toBeTruthy();
      });

      it('should validate', function (){
        changeInputValueTo('2013-07');
        expect(inputElm).toBeValid();
        expect(+scope.value).toBe(+new Date(2013, 6, 1));
        expect(scope.form.alias.$error.min).toBeFalsy();
      });
    });

    describe('max', function(){
      beforeEach(function (){
        compileInput('<input type="month" ng-model="value" name="alias" max="2013-01" />');
      });

      it('should validate', function (){
        changeInputValueTo('2012-03');
        expect(inputElm).toBeValid();
        expect(+scope.value).toBe(+new Date(2012, 2, 1));
        expect(scope.form.alias.$error.max).toBeFalsy();
      });

      it('should invalidate', function (){
        changeInputValueTo('2013-05');
        expect(inputElm).toBeInvalid();
        expect(scope.value).toBeUndefined();
        expect(scope.form.alias.$error.max).toBeTruthy();
      });
    });
  });

  describe('week', function (){
    it('should set render blank if model is not a Date object', function() {
      compileInput('<input type="week" ng-model="secondWeek"/>');

      scope.$apply(function(){
        scope.secondWeek = '2013-W02';
      });

      expect(inputElm.val()).toBe('');
    });

    it('should set the view if the model is a valid Date object', function (){
      compileInput('<input type="week" ng-model="secondWeek"/>');

      scope.$apply(function(){
        scope.secondWeek = new Date(2013, 0, 11);
      });

      expect(inputElm.val()).toBe('2013-W02');
    });

    it('should set the model undefined if the input is an invalid week string', function () {
      compileInput('<input type="week" ng-model="value"/>');

      scope.$apply(function(){
        scope.value = new Date(2013, 0, 11);
      });


      expect(inputElm.val()).toBe('2013-W02');

      try {
        //set to text for browsers with datetime-local validation.
        inputElm[0].setAttribute('type', 'text');
      } catch(e) {
        //for IE8
      }

      changeInputValueTo('stuff');
      expect(inputElm.val()).toBe('stuff');
      expect(scope.value).toBeUndefined();
      expect(inputElm).toBeInvalid();
    });

    it('should render as blank if null', function() {
      compileInput('<input type="week" ng-model="test" />');

      scope.$apply('test = null');

      expect(scope.test).toBeNull();
      expect(inputElm.val()).toEqual('');
    });

    it('should come up blank when no value specified', function() {
      compileInput('<input type="week" ng-model="test" />');

      expect(inputElm.val()).toBe('');

      scope.$apply('test = null');

      expect(scope.test).toBeNull();
      expect(inputElm.val()).toBe('');
    });


    it('should parse empty string to null', function() {
      compileInput('<input type="week" ng-model="test" />');

      scope.$apply(function() {
        scope.test = new Date(2011, 0, 1);
      });

      changeInputValueTo('');
      expect(scope.test).toBeNull();
      expect(inputElm).toBeValid();
    });

    it('should use UTC if specified in the options', function() {
      compileInput('<input type="week" ng-model="value" ng-model-options="{timezone: \'UTC\'}" />');

      changeInputValueTo('2013-W03');
      expect(+scope.value).toBe(Date.UTC(2013, 0, 17));

      scope.$apply(function() {
        scope.value = new Date(Date.UTC(2014, 0, 17));
      });
      expect(inputElm.val()).toBe('2014-W03');
    });

    describe('min', function (){
      beforeEach(function (){
        compileInput('<input type="week" ng-model="value" name="alias" min="2013-W01" />');
      });

      it('should invalidate', function (){
        changeInputValueTo('2012-W12');
        expect(inputElm).toBeInvalid();
        expect(scope.value).toBeFalsy();
        expect(scope.form.alias.$error.min).toBeTruthy();
      });

      it('should validate', function (){
        changeInputValueTo('2013-W03');
        expect(inputElm).toBeValid();
        expect(+scope.value).toBe(+new Date(2013, 0, 17));
        expect(scope.form.alias.$error.min).toBeFalsy();
      });
    });

    describe('max', function(){
      beforeEach(function (){
        compileInput('<input type="week" ng-model="value" name="alias" max="2013-W01" />');
      });

      it('should validate', function (){
        changeInputValueTo('2012-W01');
        expect(inputElm).toBeValid();
        expect(+scope.value).toBe(+new Date(2012, 0, 5));
        expect(scope.form.alias.$error.max).toBeFalsy();
      });

      it('should invalidate', function (){
        changeInputValueTo('2013-W03');
        expect(inputElm).toBeInvalid();
        expect(scope.value).toBeUndefined();
        expect(scope.form.alias.$error.max).toBeTruthy();
      });
    });
  });

  describe('datetime-local', function () {
    it('should render blank if model is not a Date object', function() {
      compileInput('<input type="datetime-local" ng-model="lunchtime"/>');

      scope.$apply(function(){
        scope.lunchtime = '2013-12-16T11:30:00';
      });

      expect(inputElm.val()).toBe('');
    });

    it('should set the view if the model if a valid Date object.', function(){
      compileInput('<input type="datetime-local" ng-model="tenSecondsToNextYear"/>');

      scope.$apply(function (){
        scope.tenSecondsToNextYear = new Date(2013, 11, 31, 23, 59, 0);
      });

      expect(inputElm.val()).toBe('2013-12-31T23:59:00');
    });

    it('should set the model undefined if the view is invalid', function (){
      compileInput('<input type="datetime-local" ng-model="breakMe"/>');

      scope.$apply(function (){
        scope.breakMe = new Date(2009, 0, 6, 16, 25, 0);
      });

      expect(inputElm.val()).toBe('2009-01-06T16:25:00');

      try {
        //set to text for browsers with datetime-local validation.
        inputElm[0].setAttribute('type', 'text');
      } catch(e) {
        //for IE8
      }

      changeInputValueTo('stuff');
      expect(inputElm.val()).toBe('stuff');
      expect(scope.breakMe).toBeUndefined();
      expect(inputElm).toBeInvalid();
    });

    it('should render as blank if null', function() {
      compileInput('<input type="datetime-local" ng-model="test" />');

      scope.$apply('test = null');

      expect(scope.test).toBeNull();
      expect(inputElm.val()).toEqual('');
    });

    it('should come up blank when no value specified', function() {
      compileInput('<input type="datetime-local" ng-model="test" />');

      expect(inputElm.val()).toBe('');

      scope.$apply('test = null');

      expect(scope.test).toBeNull();
      expect(inputElm.val()).toBe('');
    });


    it('should parse empty string to null', function() {
      compileInput('<input type="datetime-local" ng-model="test" />');

      scope.$apply(function() {
        scope.test = new Date(2011, 0, 1);
      });

      changeInputValueTo('');
      expect(scope.test).toBeNull();
      expect(inputElm).toBeValid();
    });

    it('should use UTC if specified in the options', function() {
      compileInput('<input type="datetime-local" ng-model="value" ng-model-options="{timezone: \'UTC\'}" />');

      changeInputValueTo('2000-01-01T01:02');
      expect(+scope.value).toBe(Date.UTC(2000, 0, 1, 1, 2, 0));

      scope.$apply(function() {
        scope.value = new Date(Date.UTC(2001, 0, 1, 1, 2, 0));
      });
      expect(inputElm.val()).toBe('2001-01-01T01:02:00');
    });

    it('should allow to specify the seconds', function() {
      compileInput('<input type="datetime-local" ng-model="value"" />');

      changeInputValueTo('2000-01-01T01:02:03');
      expect(+scope.value).toBe(+new Date(2000, 0, 1, 1, 2, 3));

      scope.$apply(function() {
        scope.value = new Date(2001, 0, 1, 1, 2, 3);
      });
      expect(inputElm.val()).toBe('2001-01-01T01:02:03');
    });

    it('should allow to skip the seconds', function() {
      compileInput('<input type="datetime-local" ng-model="value"" />');

      changeInputValueTo('2000-01-01T01:02');
      expect(+scope.value).toBe(+new Date(2000, 0, 1, 1, 2, 0));
    });

    describe('min', function (){
      beforeEach(function (){
        compileInput('<input type="datetime-local" ng-model="value" name="alias" min="2000-01-01T12:30:00" />');
      });

      it('should invalidate', function (){
        changeInputValueTo('1999-12-31T01:02:00');
        expect(inputElm).toBeInvalid();
        expect(scope.value).toBeFalsy();
        expect(scope.form.alias.$error.min).toBeTruthy();
      });

      it('should validate', function (){
        changeInputValueTo('2000-01-01T23:02:00');
        expect(inputElm).toBeValid();
        expect(+scope.value).toBe(+new Date(2000, 0, 1, 23, 2, 0));
        expect(scope.form.alias.$error.min).toBeFalsy();
      });
    });

    describe('max', function (){
      beforeEach(function (){
        compileInput('<input type="datetime-local" ng-model="value" name="alias" max="2019-01-01T01:02:00" />');
      });

      it('should invalidate', function (){
        changeInputValueTo('2019-12-31T01:02:00');
        expect(inputElm).toBeInvalid();
        expect(scope.value).toBeFalsy();
        expect(scope.form.alias.$error.max).toBeTruthy();
      });

      it('should validate', function() {
        changeInputValueTo('2000-01-01T01:02:00');
        expect(inputElm).toBeValid();
        expect(+scope.value).toBe(+new Date(2000, 0, 1, 1, 2, 0));
        expect(scope.form.alias.$error.max).toBeFalsy();
      });
    });

    it('should validate even if max value changes on-the-fly', function(done) {
      scope.max = '2013-01-01T01:02:00';
      compileInput('<input type="datetime-local" ng-model="value" name="alias" max="{{max}}" />');

      changeInputValueTo('2014-01-01T12:34:00');
      expect(inputElm).toBeInvalid();

      scope.max = '2001-01-01T01:02:00';
      scope.$digest(function () {
        expect(inputElm).toBeValid();
        done();
      });
    });

    it('should validate even if min value changes on-the-fly', function(done) {
      scope.min = '2013-01-01T01:02:00';
      compileInput('<input type="datetime-local" ng-model="value" name="alias" min="{{min}}" />');

      changeInputValueTo('2010-01-01T12:34:00');
      expect(inputElm).toBeInvalid();

      scope.min = '2014-01-01T01:02:00';
      scope.$digest(function () {
        expect(inputElm).toBeValid();
        done();
      });
    });
  });

  describe('time', function () {
    it('should render blank if model is not a Date object', function() {
      compileInput('<input type="time" ng-model="lunchtime"/>');

      scope.$apply(function(){
        scope.lunchtime = '11:30:00';
      });

      expect(inputElm.val()).toBe('');
    });

    it('should set the view if the model if a valid Date object.', function(){
      compileInput('<input type="time" ng-model="threeFortyOnePm"/>');

      scope.$apply(function (){
        scope.threeFortyOnePm = new Date(1970, 0, 1, 15, 41, 0);
      });

      expect(inputElm.val()).toBe('15:41:00');
    });

    it('should set the model undefined if the view is invalid', function (){
      compileInput('<input type="time" ng-model="breakMe"/>');

      scope.$apply(function (){
        scope.breakMe = new Date(1970, 0, 1, 16, 25, 0);
      });

      expect(inputElm.val()).toBe('16:25:00');

      try {
        //set to text for browsers with time validation.
        inputElm[0].setAttribute('type', 'text');
      } catch(e) {
        //for IE8
      }

      changeInputValueTo('stuff');
      expect(inputElm.val()).toBe('stuff');
      expect(scope.breakMe).toBeUndefined();
      expect(inputElm).toBeInvalid();
    });

    it('should render as blank if null', function() {
      compileInput('<input type="time" ng-model="test" />');

      scope.$apply('test = null');

      expect(scope.test).toBeNull();
      expect(inputElm.val()).toEqual('');
    });

    it('should come up blank when no value specified', function() {
      compileInput('<input type="time" ng-model="test" />');

      expect(inputElm.val()).toBe('');

      scope.$apply('test = null');

      expect(scope.test).toBeNull();
      expect(inputElm.val()).toBe('');
    });


    it('should parse empty string to null', function() {
      compileInput('<input type="time" ng-model="test" />');

      scope.$apply(function() {
        scope.test = new Date(2011, 0, 1);
      });

      changeInputValueTo('');
      expect(scope.test).toBeNull();
      expect(inputElm).toBeValid();
    });

    it('should use UTC if specified in the options', function() {
      compileInput('<input type="time" ng-model="value" ng-model-options="{timezone: \'UTC\'}" />');

      changeInputValueTo('23:02:00');
      expect(+scope.value).toBe(Date.UTC(1970, 0, 1, 23, 2, 0));

      scope.$apply(function() {
        scope.value = new Date(Date.UTC(1971, 0, 1, 23, 2, 0));
      });
      expect(inputElm.val()).toBe('23:02:00');
    });

    it('should allow to specify the seconds', function() {
      compileInput('<input type="time" ng-model="value"" />');

      changeInputValueTo('01:02:03');
      expect(+scope.value).toBe(+new Date(1970, 0, 1, 1, 2, 3));

      scope.$apply(function() {
        scope.value = new Date(1970, 0, 1, 1, 2, 3);
      });
      expect(inputElm.val()).toBe('01:02:03');
    });

    it('should allow to skip the seconds', function() {
      compileInput('<input type="time" ng-model="value"" />');

      changeInputValueTo('01:02');
      expect(+scope.value).toBe(+new Date(1970, 0, 1, 1, 2, 0));
    });

    describe('min', function (){
      beforeEach(function (){
        compileInput('<input type="time" ng-model="value" name="alias" min="09:30:00" />');
      });

      it('should invalidate', function (){
        changeInputValueTo('01:02:00');
        expect(inputElm).toBeInvalid();
        expect(scope.value).toBeFalsy();
        expect(scope.form.alias.$error.min).toBeTruthy();
      });

      it('should validate', function (){
        changeInputValueTo('23:02:00');
        expect(inputElm).toBeValid();
        expect(+scope.value).toBe(+new Date(1970, 0, 1, 23, 2, 0));
        expect(scope.form.alias.$error.min).toBeFalsy();
      });
    });

    describe('max', function (){
      beforeEach(function (){
        compileInput('<input type="time" ng-model="value" name="alias" max="22:30:00" />');
      });

      it('should invalidate', function (){
        changeInputValueTo('23:00:00');
        expect(inputElm).toBeInvalid();
        expect(scope.value).toBeFalsy();
        expect(scope.form.alias.$error.max).toBeTruthy();
      });

      it('should validate', function() {
        changeInputValueTo('05:30:00');
        expect(inputElm).toBeValid();
        expect(+scope.value).toBe(+new Date(1970, 0, 1, 5, 30, 0));
        expect(scope.form.alias.$error.max).toBeFalsy();
      });
    });

    it('should validate even if max value changes on-the-fly', function(done) {
      scope.max = '21:02:00';
      compileInput('<input type="time" ng-model="value" name="alias" max="{{max}}" />');

      changeInputValueTo('22:34:00');
      expect(inputElm).toBeInvalid();

      scope.max = '12:34:00';
      scope.$digest(function () {
        expect(inputElm).toBeValid();
        done();
      });
    });

    it('should validate even if min value changes on-the-fly', function(done) {
      scope.min = '08:45:00';
      compileInput('<input type="time" ng-model="value" name="alias" min="{{min}}" />');

      changeInputValueTo('06:15:00');
      expect(inputElm).toBeInvalid();

      scope.min = '13:50:00';
      scope.$digest(function () {
        expect(inputElm).toBeValid();
        done();
      });
    });
  });

  describe('date', function () {
    it('should render blank if model is not a Date object.', function() {
      compileInput('<input type="date" ng-model="birthday"/>');

      scope.$apply(function(){
        scope.birthday = '1977-10-22';
      });

      expect(inputElm.val()).toBe('');
    });

    it('should set the view if the model if a valid Date object.', function(){
      compileInput('<input type="date" ng-model="christmas"/>');

      scope.$apply(function (){
        scope.christmas = new Date(2013, 11, 25);
      });

      expect(inputElm.val()).toBe('2013-12-25');
    });

    it('should set the model undefined if the view is invalid', function (){
      compileInput('<input type="date" ng-model="arrMatey"/>');

      scope.$apply(function (){
        scope.arrMatey = new Date(2014, 8, 14);
      });

      expect(inputElm.val()).toBe('2014-09-14');

      try {
        //set to text for browsers with date validation.
        inputElm[0].setAttribute('type', 'text');
      } catch(e) {
        //for IE8
      }

      changeInputValueTo('1-2-3');
      expect(inputElm.val()).toBe('1-2-3');
      expect(scope.arrMatey).toBeUndefined();
      expect(inputElm).toBeInvalid();
    });

    it('should render as blank if null', function() {
      compileInput('<input type="date" ng-model="test" />');

      scope.$apply('test = null');

      expect(scope.test).toBeNull();
      expect(inputElm.val()).toEqual('');
    });

    it('should come up blank when no value specified', function() {
      compileInput('<input type="date" ng-model="test" />');

      expect(inputElm.val()).toBe('');

      scope.$apply('test = null');

      expect(scope.test).toBeNull();
      expect(inputElm.val()).toBe('');
    });


    it('should parse empty string to null', function() {
      compileInput('<input type="date" ng-model="test" />');

      scope.$apply(function() {
        scope.test = new Date(2011, 0, 1);
      });

      changeInputValueTo('');
      expect(scope.test).toBeNull();
      expect(inputElm).toBeValid();
    });

    it('should use UTC if specified in the options', function() {
      compileInput('<input type="date" ng-model="value" ng-model-options="{timezone: \'UTC\'}" />');

      changeInputValueTo('2000-01-01');
      expect(+scope.value).toBe(Date.UTC(2000, 0, 1));

      scope.$apply(function() {
        scope.value = new Date(Date.UTC(2001, 0, 1));
      });
      expect(inputElm.val()).toBe('2001-01-01');
    });

    describe('min', function (){
      beforeEach(function (){
        compileInput('<input type="date" ng-model="value" name="alias" min="2000-01-01" />');
      });

      it('should invalidate', function (){
        changeInputValueTo('1999-12-31');
        expect(inputElm).toBeInvalid();
        expect(scope.value).toBeFalsy();
        expect(scope.form.alias.$error.min).toBeTruthy();
      });

      it('should validate', function (){
        changeInputValueTo('2000-01-01');
        expect(inputElm).toBeValid();
        expect(+scope.value).toBe(+new Date(2000, 0, 1));
        expect(scope.form.alias.$error.min).toBeFalsy();
      });
    });

    describe('max', function (){
      beforeEach(function (){
        compileInput('<input type="date" ng-model="value" name="alias" max="2019-01-01" />');
      });

      it('should invalidate', function (){
        changeInputValueTo('2019-12-31');
        expect(inputElm).toBeInvalid();
        expect(scope.value).toBeFalsy();
        expect(scope.form.alias.$error.max).toBeTruthy();
      });

      it('should validate', function() {
        changeInputValueTo('2000-01-01');
        expect(inputElm).toBeValid();
        expect(+scope.value).toBe(+new Date(2000, 0, 1));
        expect(scope.form.alias.$error.max).toBeFalsy();
      });
    });

    it('should validate even if max value changes on-the-fly', function(done) {
      scope.max = '2013-01-01';
      compileInput('<input type="date" ng-model="value" name="alias" max="{{max}}" />');

      changeInputValueTo('2014-01-01');
      expect(inputElm).toBeInvalid();

      scope.max = '2001-01-01';
      scope.$digest(function () {
        expect(inputElm).toBeValid();
        done();
      });
    });

    it('should validate even if min value changes on-the-fly', function(done) {
      scope.min = '2013-01-01';
      compileInput('<input type="date" ng-model="value" name="alias" min="{{min}}" />');

      changeInputValueTo('2010-01-01');
      expect(inputElm).toBeInvalid();

      scope.min = '2014-01-01';
      scope.$digest(function () {
        expect(inputElm).toBeValid();
        done();
      });
    });
  });

  describe('number', function() {

    it('should reset the model if view is invalid', function() {
      compileInput('<input type="number" ng-model="age"/>');

      scope.$apply('age = 123');
      expect(inputElm.val()).toBe('123');

      try {
        // to allow non-number values, we have to change type so that
        // the browser which have number validation will not interfere with
        // this test. IE8 won't allow it hence the catch.
        inputElm[0].setAttribute('type', 'text');
      } catch (e) {}

      changeInputValueTo('123X');
      expect(inputElm.val()).toBe('123X');
      expect(scope.age).toBeUndefined();
      expect(inputElm).toBeInvalid();
    });


    it('should render as blank if null', function() {
      compileInput('<input type="number" ng-model="age" />');

      scope.$apply('age = null');

      expect(scope.age).toBeNull();
      expect(inputElm.val()).toEqual('');
    });

    it('should come up blank when no value specified', function() {
      compileInput('<input type="number" ng-model="age" />');

      expect(inputElm.val()).toBe('');

      scope.$apply('age = null');

      expect(scope.age).toBeNull();
      expect(inputElm.val()).toBe('');
    });


    it('should parse empty string to null', function() {
      compileInput('<input type="number" ng-model="age" />');

      scope.$apply('age = 10');

      changeInputValueTo('');
      expect(scope.age).toBeNull();
      expect(inputElm).toBeValid();
    });


    it('should invalidate number if suffering from bad input', function() {
      compileInput('<input type="number" ng-model="age" />', {
        valid: false,
        badInput: true
      });

      changeInputValueTo('10a');
      expect(scope.age).toBeUndefined();
      expect(inputElm).toBeInvalid();
    });


    it('should validate number if transition from bad input to empty string', function() {
      var validity = {
        valid: false,
        badInput: true
      };
      compileInput('<input type="number" ng-model="age" />', validity);
      changeInputValueTo('10a');
      validity.badInput = false;
      validity.valid = true;
      changeInputValueTo('');
      expect(scope.age).toBeNull();
      expect(inputElm).toBeValid();
    });


    describe('min', function() {

      it('should validate', function() {
        compileInput('<input type="number" ng-model="value" name="alias" min="10" />');

        changeInputValueTo('1');
        expect(inputElm).toBeInvalid();
        expect(scope.value).toBeFalsy();
        expect(scope.form.alias.$error.min).toBeTruthy();

        changeInputValueTo('100');
        expect(inputElm).toBeValid();
        expect(scope.value).toBe(100);
        expect(scope.form.alias.$error.min).toBeFalsy();
      });

      it('should validate even if min value changes on-the-fly', function(done) {
        scope.min = 10;
        compileInput('<input type="number" ng-model="value" name="alias" min="{{min}}" />');

        changeInputValueTo('5');
        expect(inputElm).toBeInvalid();

        scope.min = 0;
        scope.$digest(function () {
          expect(inputElm).toBeValid();
          done();
        });
      });
    });


    describe('max', function() {

      it('should validate', function() {
        compileInput('<input type="number" ng-model="value" name="alias" max="10" />');

        changeInputValueTo('20');
        expect(inputElm).toBeInvalid();
        expect(scope.value).toBeFalsy();
        expect(scope.form.alias.$error.max).toBeTruthy();

        changeInputValueTo('0');
        expect(inputElm).toBeValid();
        expect(scope.value).toBe(0);
        expect(scope.form.alias.$error.max).toBeFalsy();
      });

      it('should validate even if max value changes on-the-fly', function(done) {
        scope.max = 10;
        compileInput('<input type="number" ng-model="value" name="alias" max="{{max}}" />');

        changeInputValueTo('5');
        expect(inputElm).toBeValid();

        scope.max = 0;
        scope.$digest(function () {
          expect(inputElm).toBeInvalid();
          done();
        });
      });
    });


    describe('required', function() {

      it('should be valid even if value is 0', function() {
        compileInput('<input type="number" ng-model="value" name="alias" required />');

        changeInputValueTo('0');
        expect(inputElm).toBeValid();
        expect(scope.value).toBe(0);
        expect(scope.form.alias.$error.required).toBeFalsy();
      });

      it('should be valid even if value 0 is set from model', function() {
        compileInput('<input type="number" ng-model="value" name="alias" required />');

        scope.$apply('value = 0');

        expect(inputElm).toBeValid();
        expect(inputElm.val()).toBe('0');
        expect(scope.form.alias.$error.required).toBeFalsy();
      });

      it('should register required on non boolean elements', function() {
        compileInput('<div ng-model="value" name="alias" required>');

        scope.$apply("value = ''");

        expect(inputElm).toBeInvalid();
        expect(scope.form.alias.$error.required).toBeTruthy();
      });
    });
  });

  describe('email', function() {

    it('should validate e-mail', function() {
      compileInput('<input type="email" ng-model="email" name="alias" />');

      var widget = scope.form.alias;
      changeInputValueTo('vojta@google.com');

      expect(scope.email).toBe('vojta@google.com');
      expect(inputElm).toBeValid();
      expect(widget.$error.email).toBe(false);

      changeInputValueTo('invalid@');
      expect(scope.email).toBeUndefined();
      expect(inputElm).toBeInvalid();
      expect(widget.$error.email).toBeTruthy();
    });


    describe('EMAIL_REGEXP', function() {
      /* global EMAIL_REGEXP: false */
      it('should validate email', function() {
        expect(EMAIL_REGEXP.test('a@b.com')).toBe(true);
        expect(EMAIL_REGEXP.test('a@b.museum')).toBe(true);
        expect(EMAIL_REGEXP.test('a@B.c')).toBe(true);
        expect(EMAIL_REGEXP.test('a@.b.c')).toBe(false);
        expect(EMAIL_REGEXP.test('a@-b.c')).toBe(false);
        expect(EMAIL_REGEXP.test('a@b-.c')).toBe(false);
        expect(EMAIL_REGEXP.test('a@3b.c')).toBe(true);
        expect(EMAIL_REGEXP.test('a@b')).toBe(true);
      });
    });
  });


  describe('url', function() {

    it('should validate url', function() {
      compileInput('<input type="url" ng-model="url" name="alias" />');
      var widget = scope.form.alias;

      changeInputValueTo('http://www.something.com');
      expect(scope.url).toBe('http://www.something.com');
      expect(inputElm).toBeValid();
      expect(widget.$error.url).toBe(false);

      changeInputValueTo('invalid.com');
      expect(scope.url).toBeUndefined();
      expect(inputElm).toBeInvalid();
      expect(widget.$error.url).toBeTruthy();
    });


    describe('URL_REGEXP', function() {
      /* global URL_REGEXP: false */
      it('should validate url', function() {
        expect(URL_REGEXP.test('http://server:123/path')).toBe(true);
        expect(URL_REGEXP.test('a@B.c')).toBe(false);
      });
    });
  });


  describe('radio', function() {

    it('should update the model', function() {
      compileInput(
          '<input type="radio" ng-model="color" value="white" />' +
          '<input type="radio" ng-model="color" value="red" />' +
          '<input type="radio" ng-model="color" value="blue" />');

      scope.$apply("color = 'white'");
      expect(inputElm[0].checked).toBe(true);
      expect(inputElm[1].checked).toBe(false);
      expect(inputElm[2].checked).toBe(false);

      scope.$apply("color = 'red'");
      expect(inputElm[0].checked).toBe(false);
      expect(inputElm[1].checked).toBe(true);
      expect(inputElm[2].checked).toBe(false);

      browserTrigger(inputElm[2], 'click');
      expect(scope.color).toBe('blue');
    });


    it('should allow {{expr}} as value', function() {
      scope.some = 11;
      compileInput(
          '<input type="radio" ng-model="value" value="{{some}}" />' +
          '<input type="radio" ng-model="value" value="{{other}}" />');

      scope.$apply(function() {
        scope.value = 'blue';
        scope.some = 'blue';
        scope.other = 'red';
      });

      expect(inputElm[0].checked).toBe(true);
      expect(inputElm[1].checked).toBe(false);

      browserTrigger(inputElm[1], 'click');
      expect(scope.value).toBe('red');

      scope.$apply("other = 'non-red'");

      expect(inputElm[0].checked).toBe(false);
      expect(inputElm[1].checked).toBe(false);
    });
  });


  describe('checkbox', function() {

    it('should ignore checkbox without ngModel directive', function() {
      compileInput('<input type="checkbox" name="whatever" required />');

      changeInputValueTo('');
      expect(inputElm.hasClass('ng-valid')).toBe(false);
      expect(inputElm.hasClass('ng-invalid')).toBe(false);
      expect(inputElm.hasClass('ng-pristine')).toBe(false);
      expect(inputElm.hasClass('ng-dirty')).toBe(false);
    });


    it('should format booleans', function() {
      compileInput('<input type="checkbox" ng-model="name" />');

      scope.$apply("name = false");
      expect(inputElm[0].checked).toBe(false);

      scope.$apply("name = true");
      expect(inputElm[0].checked).toBe(true);
    });


    it('should support type="checkbox" with non-standard capitalization', function() {
      compileInput('<input type="checkBox" ng-model="checkbox" />');

      browserTrigger(inputElm, 'click');
      expect(scope.checkbox).toBe(true);

      browserTrigger(inputElm, 'click');
      expect(scope.checkbox).toBe(false);
    });


    it('should allow custom enumeration', function() {
      compileInput('<input type="checkbox" ng-model="name" ng-true-value="\'y\'" ' +
          'ng-false-value="\'n\'">');

      scope.$apply("name = 'y'");
      expect(inputElm[0].checked).toBe(true);

      scope.$apply("name = 'n'");
      expect(inputElm[0].checked).toBe(false);

      scope.$apply("name = 'something else'");
      expect(inputElm[0].checked).toBe(false);

      browserTrigger(inputElm, 'click');
      expect(scope.name).toEqual('y');

      browserTrigger(inputElm, 'click');
      expect(scope.name).toEqual('n');
    });


    it('should throw if ngTrueValue is present and not a constant expression', function() {
      expect(function() {
        compileInput('<input type="checkbox" ng-model="value" ng-true-value="yes" />');
      }).toThrowMinErr('ngModel', 'constexpr', "Expected constant expression for `ngTrueValue`, but saw `yes`.");
    });


    it('should throw if ngFalseValue is present and not a constant expression', function() {
      expect(function() {
        compileInput('<input type="checkbox" ng-model="value" ng-false-value="no" />');
      }).toThrowMinErr('ngModel', 'constexpr', "Expected constant expression for `ngFalseValue`, but saw `no`.");
    });


    it('should not throw if ngTrueValue or ngFalseValue are not present', function() {
      expect(function() {
        compileInput('<input type="checkbox" ng-model="value" />');
      }).not.toThrow();
    });


    it('should be required if false', function() {
      compileInput('<input type="checkbox" ng:model="value" required />');

      browserTrigger(inputElm, 'click');
      expect(inputElm[0].checked).toBe(true);
      expect(inputElm).toBeValid();

      browserTrigger(inputElm, 'click');
      expect(inputElm[0].checked).toBe(false);
      expect(inputElm).toBeInvalid();
    });
  });


  describe('textarea', function() {

    it("should process textarea", function() {
      compileInput('<textarea ng-model="name"></textarea>');
      inputElm = formElm.find('textarea');

      scope.$apply("name = 'Adam'");
      expect(inputElm.val()).toEqual('Adam');

      changeInputValueTo('Shyam');
      expect(scope.name).toEqual('Shyam');

      changeInputValueTo('Kai');
      expect(scope.name).toEqual('Kai');
    });


    it('should ignore textarea without ngModel directive', function() {
      compileInput('<textarea name="whatever" required></textarea>');
      inputElm = formElm.find('textarea');

      changeInputValueTo('');
      expect(inputElm.hasClass('ng-valid')).toBe(false);
      expect(inputElm.hasClass('ng-invalid')).toBe(false);
      expect(inputElm.hasClass('ng-pristine')).toBe(false);
      expect(inputElm.hasClass('ng-dirty')).toBe(false);
    });
  });


  describe('ngList', function() {

    it('should parse text into an array', function() {
      compileInput('<input type="text" ng-model="list" ng-list />');

      // model -> view
      scope.$apply("list = ['x', 'y', 'z']");
      expect(inputElm.val()).toBe('x, y, z');

      // view -> model
      changeInputValueTo('1, 2, 3');
      expect(scope.list).toEqual(['1', '2', '3']);
    });


    it("should not clobber text if model changes due to itself", function() {
      // When the user types 'a,b' the 'a,' stage parses to ['a'] but if the
      // $parseModel function runs it will change to 'a', in essence preventing
      // the user from ever typing ','.
      compileInput('<input type="text" ng-model="list" ng-list />');

      changeInputValueTo('a ');
      expect(inputElm.val()).toEqual('a ');
      expect(scope.list).toEqual(['a']);

      changeInputValueTo('a ,');
      expect(inputElm.val()).toEqual('a ,');
      expect(scope.list).toEqual(['a']);

      changeInputValueTo('a , ');
      expect(inputElm.val()).toEqual('a , ');
      expect(scope.list).toEqual(['a']);

      changeInputValueTo('a , b');
      expect(inputElm.val()).toEqual('a , b');
      expect(scope.list).toEqual(['a', 'b']);
    });


    it('should convert empty string to an empty array', function() {
      compileInput('<input type="text" ng-model="list" ng-list />');

      changeInputValueTo('');
      expect(scope.list).toEqual([]);
    });

    it('should be invalid if required and empty', function() {
      compileInput('<input type="text" ng-list ng-model="list" required>');
      changeInputValueTo('');
      expect(scope.list).toBeUndefined();
      expect(inputElm).toBeInvalid();
      changeInputValueTo('a,b');
      expect(scope.list).toEqual(['a','b']);
      expect(inputElm).toBeValid();
    });

    describe('with a custom separator', function() {
      it('should split on the custom separator', function() {
        compileInput('<input type="text" ng-model="list" ng-list=":" />');

        changeInputValueTo('a,a');
        expect(scope.list).toEqual(['a,a']);

        changeInputValueTo('a:b');
        expect(scope.list).toEqual(['a', 'b']);
      });


      it("should join the list back together with the custom separator", function() {
        compileInput('<input type="text" ng-model="list" ng-list=" : " />');

        scope.$apply(function() {
          scope.list = ['x', 'y', 'z'];
        });
        expect(inputElm.val()).toBe('x : y : z');
      });
    });

    describe('(with ngTrim undefined or true)', function() {

      it('should ignore separator whitespace when splitting', function() {
        compileInput('<input type="text" ng-model="list" ng-list="  |  " />');

        changeInputValueTo('a|b');
        expect(scope.list).toEqual(['a', 'b']);
      });

      it('should trim whitespace from each list item', function() {
        compileInput('<input type="text" ng-model="list" ng-list="|" />');

        changeInputValueTo('a | b');
        expect(scope.list).toEqual(['a', 'b']);
      });
    });

    describe('(with ngTrim set to false)', function() {

      it('should use separator whitespace when splitting', function() {
        compileInput('<input type="text" ng-model="list" ng-trim="false" ng-list="  |  " />');

        changeInputValueTo('a|b');
        expect(scope.list).toEqual(['a|b']);

        changeInputValueTo('a  |  b');
        expect(scope.list).toEqual(['a','b']);

      });

      it("should not trim whitespace from each list item", function() {
        compileInput('<input type="text" ng-model="list" ng-trim="false" ng-list="|" />');
        changeInputValueTo('a  |  b');
        expect(scope.list).toEqual(['a  ','  b']);
      });

      it("should support splitting on newlines", function() {
        compileInput('<textarea type="text" ng-model="list" ng-trim="false" ng-list="&#10;"></textarea');
        changeInputValueTo('a\nb');
        expect(scope.list).toEqual(['a','b']);
      });
    });
  });

  describe('required', function() {

    it('should allow bindings via ngRequired', function() {
      compileInput('<input type="text" ng-model="value" ng-required="required" />');

      scope.$apply("required = false");

      changeInputValueTo('');
      expect(inputElm).toBeValid();


      scope.$apply("required = true");
      expect(inputElm).toBeInvalid();

      scope.$apply("value = 'some'");
      expect(inputElm).toBeValid();

      changeInputValueTo('');
      expect(inputElm).toBeInvalid();

      scope.$apply("required = false");
      expect(inputElm).toBeValid();
    });


    it('should invalid initial value with bound required', function() {
      compileInput('<input type="text" ng-model="value" required="{{required}}" />');

      scope.$apply('required = true');

      expect(inputElm).toBeInvalid();
    });


    it('should be $invalid but $pristine if not touched', function() {
      compileInput('<input type="text" ng-model="name" name="alias" required />');

      scope.$apply("name = null");

      expect(inputElm).toBeInvalid();
      expect(inputElm).toBePristine();

      changeInputValueTo('');
      expect(inputElm).toBeInvalid();
      expect(inputElm).toBeDirty();
    });


    it('should allow empty string if not required', function() {
      compileInput('<input type="text" ng-model="foo" />');
      changeInputValueTo('a');
      changeInputValueTo('');
      expect(scope.foo).toBe('');
    });


    it('should set $invalid when model undefined', function() {
      compileInput('<input type="text" ng-model="notDefined" required />');
      expect(inputElm).toBeInvalid();
    });


    it('should set $valid even if model fails other validators', function() {
      compileInput('<input type="email" ng-model="value" required />');
      changeInputValueTo('bademail');

      expect(inputElm).toHaveClass('ng-valid-required');
      expect(inputElm.controller('ngModel').$error.required).toBe(false);
      expect(inputElm).toBeInvalid(); // invalid because of the email validator
    });


    it('should allow `false` as a valid value when the input type is not "checkbox"', function() {
      compileInput('<input type="radio" ng-value="true" ng-model="answer" required />' +
        '<input type="radio" ng-value="false" ng-model="answer" required />');

      scope.$apply();
      expect(inputElm).toBeInvalid();

      scope.$apply("answer = true");
      expect(inputElm).toBeValid();

      scope.$apply("answer = false");
      expect(inputElm).toBeValid();
    });
  });


  describe('ngChange', function() {

    it('should $eval expression after new value is set in the model', function() {
      compileInput('<input type="text" ng-model="value" ng-change="change()" />');

      scope.change = jasmine.createSpy('change').andCallFake(function() {
        expect(scope.value).toBe('new value');
      });

      changeInputValueTo('new value');
      expect(scope.change).toHaveBeenCalledOnce();
    });

    it('should not $eval the expression if changed from model', function() {
      compileInput('<input type="text" ng-model="value" ng-change="change()" />');

      scope.change = jasmine.createSpy('change');
      scope.$apply('value = true');

      expect(scope.change).not.toHaveBeenCalled();
    });


    it('should $eval ngChange expression on checkbox', function() {
      compileInput('<input type="checkbox" ng-model="foo" ng-change="changeFn()">');

      scope.changeFn = jasmine.createSpy('changeFn');
      expect(scope.changeFn).not.toHaveBeenCalled();

      browserTrigger(inputElm, 'click');
      expect(scope.changeFn).toHaveBeenCalledOnce();
    });
  });


  describe('ngValue', function() {

    it('should update the dom "value" property and attribute', function() {
      compileInput('<input type="submit" ng-value="value">');

      scope.$apply("value = 'something'");

      expect(inputElm[0].value).toBe('something');
      expect(inputElm[0].getAttribute('value')).toBe('something');
    });


    it('should evaluate and set constant expressions', function() {
      compileInput('<input type="radio" ng-model="selected" ng-value="true">' +
                   '<input type="radio" ng-model="selected" ng-value="false">' +
                   '<input type="radio" ng-model="selected" ng-value="1">');

      browserTrigger(inputElm[0], 'click');
      expect(scope.selected).toBe(true);

      browserTrigger(inputElm[1], 'click');
      expect(scope.selected).toBe(false);

      browserTrigger(inputElm[2], 'click');
      expect(scope.selected).toBe(1);
    });


    it('should watch the expression', function() {
      compileInput('<input type="radio" ng-model="selected" ng-value="value">');

      scope.$apply(function() {
        scope.selected = scope.value = {some: 'object'};
      });
      expect(inputElm[0].checked).toBe(true);

      scope.$apply(function() {
        scope.value = {some: 'other'};
      });
      expect(inputElm[0].checked).toBe(false);

      browserTrigger(inputElm, 'click');
      expect(scope.selected).toBe(scope.value);
    });


    it('should work inside ngRepeat', function() {
      compileInput(
        '<input type="radio" ng-repeat="i in items" ng-model="$parent.selected" ng-value="i.id">');

      scope.$apply(function() {
        scope.items = [{id: 1}, {id: 2}];
        scope.selected = 1;
      });

      inputElm = formElm.find('input');
      expect(inputElm[0].checked).toBe(true);
      expect(inputElm[1].checked).toBe(false);

      browserTrigger(inputElm.eq(1), 'click');
      expect(scope.selected).toBe(2);
    });


    it('should work inside ngRepeat with primitive values', function() {
      compileInput(
        '<div ng-repeat="i in items">' +
          '<input type="radio" name="sel_{{i.id}}" ng-model="i.selected" ng-value="true">' +
          '<input type="radio" name="sel_{{i.id}}" ng-model="i.selected" ng-value="false">' +
        '</div>');

      scope.$apply(function() {
        scope.items = [{id: 1, selected: true}, {id: 2, selected: false}];
      });

      inputElm = formElm.find('input');
      expect(inputElm[0].checked).toBe(true);
      expect(inputElm[1].checked).toBe(false);
      expect(inputElm[2].checked).toBe(false);
      expect(inputElm[3].checked).toBe(true);

      browserTrigger(inputElm.eq(1), 'click');
      expect(scope.items[0].selected).toBe(false);
    });


    it('should work inside ngRepeat without name attribute', function() {
      compileInput(
        '<div ng-repeat="i in items">' +
          '<input type="radio" ng-model="i.selected" ng-value="true">' +
          '<input type="radio" ng-model="i.selected" ng-value="false">' +
        '</div>');

      scope.$apply(function() {
        scope.items = [{id: 1, selected: true}, {id: 2, selected: false}];
      });

      inputElm = formElm.find('input');
      expect(inputElm[0].checked).toBe(true);
      expect(inputElm[1].checked).toBe(false);
      expect(inputElm[2].checked).toBe(false);
      expect(inputElm[3].checked).toBe(true);

      browserTrigger(inputElm.eq(1), 'click');
      expect(scope.items[0].selected).toBe(false);
    });
  });


  describe('password', function() {
    // Under no circumstances should input[type=password] trim inputs
    it('should not trim if ngTrim is unspecified', function() {
      compileInput('<input type="password" ng-model="password">');
      changeInputValueTo(' - - untrimmed - - ');
      expect(scope.password.length).toBe(' - - untrimmed - - '.length);
    });


    it('should not trim if ngTrim !== false', function() {
      compileInput('<input type="password" ng-model="password" ng-trim="true">');
      changeInputValueTo(' - - untrimmed - - ');
      expect(scope.password.length).toBe(' - - untrimmed - - '.length);
    });


    it('should not trim if ngTrim === false', function() {
      compileInput('<input type="password" ng-model="password" ng-trim="false">');
      changeInputValueTo(' - - untrimmed - - ');
      expect(scope.password.length).toBe(' - - untrimmed - - '.length);
    });
  });
});

describe('NgModel animations', function() {
  beforeEach(module('ngAnimateMock'));

  function findElementAnimations(element, queue) {
    var node = element[0];
    var animations = [];
    for(var i = 0; i < queue.length; i++) {
      var animation = queue[i];
      if(animation.element[0] == node) {
        animations.push(animation);
      }
    }
    return animations;
  }

  function assertValidAnimation(animation, event, className) {
    expect(animation.event).toBe(event);
    expect(animation.args[1]).toBe(className);
  }

  var doc, input, scope, model;
  beforeEach(inject(function($rootScope, $compile, $rootElement, $animate) {
    scope = $rootScope.$new();
    doc = jqLite('<form name="myForm">' +
                 '  <input type="text" ng-model="input" name="myInput" />' +
                 '</form>');
    $rootElement.append(doc);
    $compile(doc)(scope);
    $animate.queue = [];

    input = doc.find('input');
    model = scope.myForm.myInput;
  }));

  afterEach(function() {
    dealoc(input);
  });

  it('should trigger an animation when invalid', inject(function($animate) {
    model.$setValidity('required', false);

    var animations = findElementAnimations(input, $animate.queue);
    assertValidAnimation(animations[0], 'removeClass', 'ng-valid');
    assertValidAnimation(animations[1], 'addClass', 'ng-invalid');
    assertValidAnimation(animations[2], 'removeClass', 'ng-valid-required');
    assertValidAnimation(animations[3], 'addClass', 'ng-invalid-required');
  }));

  it('should trigger an animation when valid', inject(function($animate) {
    model.$setValidity('required', false);

    $animate.queue = [];

    model.$setValidity('required', true);

    var animations = findElementAnimations(input, $animate.queue);
    assertValidAnimation(animations[0], 'removeClass', 'ng-invalid');
    assertValidAnimation(animations[1], 'addClass', 'ng-valid');
    assertValidAnimation(animations[2], 'removeClass', 'ng-invalid-required');
    assertValidAnimation(animations[3], 'addClass', 'ng-valid-required');
  }));

  it('should trigger an animation when dirty', inject(function($animate) {
    model.$setViewValue('some dirty value');

    var animations = findElementAnimations(input, $animate.queue);
    assertValidAnimation(animations[0], 'removeClass', 'ng-pristine');
    assertValidAnimation(animations[1], 'addClass', 'ng-dirty');
  }));

  it('should trigger an animation when pristine', inject(function($animate) {
    model.$setPristine();

    var animations = findElementAnimations(input, $animate.queue);
    assertValidAnimation(animations[0], 'removeClass', 'ng-dirty');
    assertValidAnimation(animations[1], 'addClass', 'ng-pristine');
  }));

  it('should trigger an animation when untouched', inject(function($animate) {
    model.$setUntouched();

    var animations = findElementAnimations(input, $animate.queue);
    assertValidAnimation(animations[0], 'setClass', 'ng-untouched');
    expect(animations[0].args[2]).toBe('ng-touched');
  }));

  it('should trigger an animation when touched', inject(function($animate) {
    model.$setTouched();

    var animations = findElementAnimations(input, $animate.queue);
    assertValidAnimation(animations[0], 'setClass', 'ng-touched', 'ng-untouched');
    expect(animations[0].args[2]).toBe('ng-untouched');
  }));

  it('should trigger custom errors as addClass/removeClass when invalid/valid', inject(function($animate) {
    model.$setValidity('custom-error', false);

    var animations = findElementAnimations(input, $animate.queue);
    assertValidAnimation(animations[0], 'removeClass', 'ng-valid');
    assertValidAnimation(animations[1], 'addClass', 'ng-invalid');
    assertValidAnimation(animations[2], 'removeClass', 'ng-valid-custom-error');
    assertValidAnimation(animations[3], 'addClass', 'ng-invalid-custom-error');

    $animate.queue = [];
    model.$setValidity('custom-error', true);

    animations = findElementAnimations(input, $animate.queue);
    assertValidAnimation(animations[0], 'removeClass', 'ng-invalid');
    assertValidAnimation(animations[1], 'addClass', 'ng-valid');
    assertValidAnimation(animations[2], 'removeClass', 'ng-invalid-custom-error');
    assertValidAnimation(animations[3], 'addClass', 'ng-valid-custom-error');
  }));
});
