'use strict';

/* globals getInputCompileHelper: false */

describe('input', function() {
  var helper, $compile, $rootScope, $browser, $sniffer, $timeout, $q;

  beforeEach(function() {
    helper = getInputCompileHelper(this);
  });

  afterEach(function() {
    helper.dealoc();
  });


  beforeEach(inject(function(_$compile_, _$rootScope_, _$browser_, _$sniffer_, _$timeout_, _$q_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $browser = _$browser_;
    $sniffer = _$sniffer_;
    $timeout = _$timeout_;
    $q = _$q_;
  }));


  it('should bind to a model', function() {
    var inputElm = helper.compileInput('<input type="text" ng-model="name" name="alias" ng-change="change()" />');

    $rootScope.$apply("name = 'misko'");

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

    var inputElm = helper.compileInput('<input type="text" ng-model="name" name="alias"/>');
    expect(inputElm.prop('readOnly')).toBe(false);
    expect(inputElm.prop('disabled')).toBe(false);

    expect(inputElm).toBeOff('readOnly');
    expect(inputElm).toBeOff('readonly');
    expect(inputElm).toBeOff('disabled');
  });


  it('should update the model on "blur" event', function() {
    var inputElm = helper.compileInput('<input type="text" ng-model="name" name="alias" ng-change="change()" />');

    helper.changeInputValueTo('adam');
    expect($rootScope.name).toEqual('adam');
  });


  it('should not add the property to the scope if name is unspecified', function() {
    helper.compileInput('<input type="text" ng-model="name">');

    expect($rootScope.form['undefined']).toBeUndefined();
    expect($rootScope.form.$addControl).not.toHaveBeenCalled();
    expect($rootScope.form.$$renameControl).not.toHaveBeenCalled();
  });

  describe('compositionevents', function() {
    it('should not update the model between "compositionstart" and "compositionend" on non android', function() {

      $sniffer.android = false;

      var inputElm = helper.compileInput('<input type="text" ng-model="name" name="alias"" />');
      helper.changeInputValueTo('a');
      expect($rootScope.name).toEqual('a');
      browserTrigger(inputElm, 'compositionstart');
      helper.changeInputValueTo('adam');
      expect($rootScope.name).toEqual('a');
      browserTrigger(inputElm, 'compositionend');
      helper.changeInputValueTo('adam');
      expect($rootScope.name).toEqual('adam');
    });


    it('should update the model between "compositionstart" and "compositionend" on android', function() {
      $sniffer.android = true;

      var inputElm = helper.compileInput('<input type="text" ng-model="name" name="alias"" />');
      helper.changeInputValueTo('a');
      expect($rootScope.name).toEqual('a');
      browserTrigger(inputElm, 'compositionstart');
      helper.changeInputValueTo('adam');
      expect($rootScope.name).toEqual('adam');
      browserTrigger(inputElm, 'compositionend');
      helper.changeInputValueTo('adam2');
      expect($rootScope.name).toEqual('adam2');
    });


    it('should update the model on "compositionend"', function() {
      var inputElm = helper.compileInput('<input type="text" ng-model="name" name="alias" />');
      browserTrigger(inputElm, 'compositionstart');
      helper.changeInputValueTo('caitp');
      expect($rootScope.name).toBeUndefined();
      browserTrigger(inputElm, 'compositionend');
      expect($rootScope.name).toEqual('caitp');
    });
  });


  describe("IE placeholder input events", function() {
    //IE fires an input event whenever a placeholder visually changes, essentially treating it as a value
    //Events:
    //  placeholder attribute change: *input*
    //  focus (which visually removes the placeholder value): focusin focus *input*
    //  blur (which visually creates the placeholder value):  focusout *input* blur
    //However none of these occur if the placeholder is not visible at the time of the event.
    //These tests try simulate various scenerios which do/do-not fire the extra input event

    it('should not dirty the model on an input event in response to a placeholder change', function() {
      var inputElm = helper.compileInput('<input type="text" placeholder="Test" attr-capture ng-model="unsetValue" name="name" />');
      msie && browserTrigger(inputElm, 'input');
      expect(inputElm.attr('placeholder')).toBe('Test');
      expect(inputElm).toBePristine();

      helper.attrs.$set('placeholder', '');
      msie && browserTrigger(inputElm, 'input');
      expect(inputElm.attr('placeholder')).toBe('');
      expect(inputElm).toBePristine();

      helper.attrs.$set('placeholder', 'Test Again');
      msie && browserTrigger(inputElm, 'input');
      expect(inputElm.attr('placeholder')).toBe('Test Again');
      expect(inputElm).toBePristine();

      helper.attrs.$set('placeholder', undefined);
      msie && browserTrigger(inputElm, 'input');
      expect(inputElm.attr('placeholder')).toBe(undefined);
      expect(inputElm).toBePristine();

      helper.changeInputValueTo('foo');
      expect(inputElm).toBeDirty();
    });


    it('should not dirty the model on an input event in response to a interpolated placeholder change', function() {
      var inputElm = helper.compileInput('<input type="text" placeholder="{{ph}}" ng-model="unsetValue" name="name" />');
      msie && browserTrigger(inputElm, 'input');
      expect(inputElm).toBePristine();

      $rootScope.ph = 1;
      $rootScope.$digest();
      msie && browserTrigger(inputElm, 'input');
      expect(inputElm).toBePristine();

      $rootScope.ph = "";
      $rootScope.$digest();
      msie && browserTrigger(inputElm, 'input');
      expect(inputElm).toBePristine();

      helper.changeInputValueTo('foo');
      expect(inputElm).toBeDirty();
    });


    it('should dirty the model on an input event while in focus even if the placeholder changes', function() {
      $rootScope.ph = 'Test';
      var inputElm = helper.compileInput('<input type="text" ng-attr-placeholder="{{ph}}" ng-model="unsetValue" name="name" />');
      expect(inputElm).toBePristine();

      browserTrigger(inputElm, 'focusin');
      browserTrigger(inputElm, 'focus');
      msie && browserTrigger(inputElm, 'input');
      expect(inputElm.attr('placeholder')).toBe('Test');
      expect(inputElm).toBePristine();

      $rootScope.ph = 'Test Again';
      $rootScope.$digest();
      expect(inputElm).toBePristine();

      helper.changeInputValueTo('foo');
      expect(inputElm).toBeDirty();
    });


    it('should not dirty the model on an input event in response to a ng-attr-placeholder change', function() {
      var inputElm = helper.compileInput('<input type="text" ng-attr-placeholder="{{ph}}" ng-model="unsetValue" name="name" />');
      expect(inputElm).toBePristine();

      $rootScope.ph = 1;
      $rootScope.$digest();
      msie && browserTrigger(inputElm, 'input');
      expect(inputElm).toBePristine();

      $rootScope.ph = "";
      $rootScope.$digest();
      msie && browserTrigger(inputElm, 'input');
      expect(inputElm).toBePristine();

      helper.changeInputValueTo('foo');
      expect(inputElm).toBeDirty();
    });


    it('should not dirty the model on an input event in response to a focus', function() {
      var inputElm = helper.compileInput('<input type="text" placeholder="Test" ng-model="unsetValue" name="name" />');
      msie && browserTrigger(inputElm, 'input');
      expect(inputElm.attr('placeholder')).toBe('Test');
      expect(inputElm).toBePristine();

      browserTrigger(inputElm, 'focusin');
      browserTrigger(inputElm, 'focus');
      msie && browserTrigger(inputElm, 'input');
      expect(inputElm.attr('placeholder')).toBe('Test');
      expect(inputElm).toBePristine();

      helper.changeInputValueTo('foo');
      expect(inputElm).toBeDirty();
    });


    it('should not dirty the model on an input event in response to a blur', function() {
      var inputElm = helper.compileInput('<input type="text" placeholder="Test" ng-model="unsetValue" name="name" />');
      msie && browserTrigger(inputElm, 'input');
      expect(inputElm.attr('placeholder')).toBe('Test');
      expect(inputElm).toBePristine();

      browserTrigger(inputElm, 'focusin');
      browserTrigger(inputElm, 'focus');
      msie && browserTrigger(inputElm, 'input');
      expect(inputElm).toBePristine();

      browserTrigger(inputElm, 'focusout');
      msie && browserTrigger(inputElm, 'input');
      browserTrigger(inputElm, 'blur');
      expect(inputElm).toBePristine();

      helper.changeInputValueTo('foo');
      expect(inputElm).toBeDirty();
    });


    it('should dirty the model on an input event if there is a placeholder and value', function() {
      $rootScope.name = 'foo';
      var inputElm = helper.compileInput('<input type="text" placeholder="Test" ng-model="name" value="init" name="name" />');
      expect(inputElm.val()).toBe($rootScope.name);
      expect(inputElm).toBePristine();

      helper.changeInputValueTo('bar');
      expect(inputElm).toBeDirty();
    });


    it('should dirty the model on an input event if there is a placeholder and value after focusing', function() {
      $rootScope.name = 'foo';
      var inputElm = helper.compileInput('<input type="text" placeholder="Test" ng-model="name" value="init" name="name" />');
      expect(inputElm.val()).toBe($rootScope.name);
      expect(inputElm).toBePristine();

      browserTrigger(inputElm, 'focusin');
      browserTrigger(inputElm, 'focus');
      helper.changeInputValueTo('bar');
      expect(inputElm).toBeDirty();
    });


    it('should dirty the model on an input event if there is a placeholder and value after bluring', function() {
      $rootScope.name = 'foo';
      var inputElm = helper.compileInput('<input type="text" placeholder="Test" ng-model="name" value="init" name="name" />');
      expect(inputElm.val()).toBe($rootScope.name);
      expect(inputElm).toBePristine();

      browserTrigger(inputElm, 'focusin');
      browserTrigger(inputElm, 'focus');
      expect(inputElm).toBePristine();

      browserTrigger(inputElm, 'focusout');
      browserTrigger(inputElm, 'blur');
      helper.changeInputValueTo('bar');
      expect(inputElm).toBeDirty();
    });
  });


  describe('interpolated names', function() {

    it('should interpolate input names', function() {
      $rootScope.nameID = '47';
      var inputElm = helper.compileInput('<input type="text" ng-model="name" name="name{{nameID}}" />');
      expect($rootScope.form.name47.$pristine).toBeTruthy();
      helper.changeInputValueTo('caitp');
      expect($rootScope.form.name47.$dirty).toBeTruthy();
    });


    it('should rename form controls in form when interpolated name changes', function() {
      $rootScope.nameID = "A";
      var inputElm = helper.compileInput('<input type="text" ng-model="name" name="name{{nameID}}" />');
      expect($rootScope.form.nameA.$name).toBe('nameA');
      var oldModel = $rootScope.form.nameA;
      $rootScope.nameID = "B";
      $rootScope.$digest();
      expect($rootScope.form.nameA).toBeUndefined();
      expect($rootScope.form.nameB).toBe(oldModel);
      expect($rootScope.form.nameB.$name).toBe('nameB');
    });


    it('should rename form controls in null form when interpolated name changes', function() {
      $rootScope.nameID = "A";
      var inputElm = helper.compileInput('<input type="text" ng-model="name" name="name{{nameID}}" />');
      var model = inputElm.controller('ngModel');
      expect(model.$name).toBe('nameA');

      $rootScope.nameID = "B";
      $rootScope.$digest();
      expect(model.$name).toBe('nameB');
    });
  });

  describe('"change" event', function() {
    var assertBrowserSupportsChangeEvent;

    beforeEach(function() {
      assertBrowserSupportsChangeEvent = function(inputEventSupported) {
        // Force browser to report a lack of an 'input' event
        $sniffer.hasEvent = function(eventName) {
          return !(eventName === 'input' && !inputEventSupported);
        };
        var inputElm = helper.compileInput('<input type="text" ng-model="name" name="alias" />');

        inputElm.val('mark');
        browserTrigger(inputElm, 'change');
        expect($rootScope.name).toEqual('mark');
      };
    });


    it('should update the model event if the browser does not support the "input" event',function() {
      assertBrowserSupportsChangeEvent(false);
    });


    it('should update the model event if the browser supports the "input" ' +
      'event so that form auto complete works',function() {
      assertBrowserSupportsChangeEvent(true);
    });


    if (!_jqLiteMode) {
      describe('double $digest when triggering an event using jQuery', function() {
        var run;

        beforeEach(function() {
          run = function(scope) {

            $sniffer.hasEvent = function(eventName) { return eventName !== 'input'; };

            scope = scope || $rootScope;

            var inputElm = helper.compileInput('<input type="text" ng-model="name" name="alias" ng-change="change()" />', false, scope);

            scope.field = 'fake field';
            scope.$watch('field', function() {
              // We need to use _originalTrigger since trigger is modified by Angular Scenario.
              inputElm._originalTrigger('change');
            });
            scope.$apply();
          };
        });

        it('should not cause the double $digest with non isolate scopes', function() {
          run();
        });

        it('should not cause the double $digest with isolate scopes', function() {
          run($rootScope.$new(true));
        });
      });
    }
  });

  describe('"keydown", "paste" and "cut" events', function() {
    beforeEach(function() {
      // Force browser to report a lack of an 'input' event
      $sniffer.hasEvent = function(eventName) {
        return eventName !== 'input';
      };
    });


    it('should update the model on "paste" event if the input value changes', function() {
      var inputElm = helper.compileInput('<input type="text" ng-model="name" name="alias" ng-change="change()" />');

      browserTrigger(inputElm, 'keydown');
      $browser.defer.flush();
      expect(inputElm).toBePristine();

      inputElm.val('mark');
      browserTrigger(inputElm, 'paste');
      $browser.defer.flush();
      expect($rootScope.name).toEqual('mark');
    });


    it('should update the model on "cut" event', function() {
      var inputElm = helper.compileInput('<input type="text" ng-model="name" name="alias" ng-change="change()" />');

      inputElm.val('john');
      browserTrigger(inputElm, 'cut');
      $browser.defer.flush();
      expect($rootScope.name).toEqual('john');
    });


    it('should cancel the delayed dirty if a change occurs', function() {
      var inputElm = helper.compileInput('<input type="text" ng-model="name" />');
      var ctrl = inputElm.controller('ngModel');

      browserTrigger(inputElm, 'keydown', {target: inputElm[0]});
      inputElm.val('f');
      browserTrigger(inputElm, 'change');
      expect(inputElm).toBeDirty();

      ctrl.$setPristine();
      $rootScope.$apply();

      $browser.defer.flush();
      expect(inputElm).toBePristine();
    });
  });


  describe('ngTrim', function() {

    it('should update the model and trim the value', function() {
      var inputElm = helper.compileInput('<input type="text" ng-model="name" name="alias" ng-change="change()" />');

      helper.changeInputValueTo('  a  ');
      expect($rootScope.name).toEqual('a');
    });


    it('should update the model and not trim the value', function() {
      var inputElm = helper.compileInput('<input type="text" ng-model="name" name="alias" ng-trim="false" />');

      helper.changeInputValueTo('  a  ');
      expect($rootScope.name).toEqual('  a  ');
    });
  });


  it('should allow complex reference binding', function() {
    var inputElm = helper.compileInput('<input type="text" ng-model="obj[\'abc\'].name"/>');

    $rootScope.$apply("obj = { abc: { name: 'Misko'} }");
    expect(inputElm.val()).toEqual('Misko');
  });


  it('should ignore input without ngModel directive', function() {
    var inputElm = helper.compileInput('<input type="text" name="whatever" required />');

    helper.changeInputValueTo('');
    expect(inputElm.hasClass('ng-valid')).toBe(false);
    expect(inputElm.hasClass('ng-invalid')).toBe(false);
    expect(inputElm.hasClass('ng-pristine')).toBe(false);
    expect(inputElm.hasClass('ng-dirty')).toBe(false);
  });


  it('should report error on assignment error', function() {
    expect(function() {
      var inputElm = helper.compileInput('<input type="text" ng-model="throw \'\'">');
    }).toThrowMinErr("$parse", "syntax", "Syntax Error: Token '''' is an unexpected token at column 7 of the expression [throw ''] starting at [''].");
  });


  it("should render as blank if null", function() {
    var inputElm = helper.compileInput('<input type="text" ng-model="age" />');

    $rootScope.$apply('age = null');

    expect($rootScope.age).toBeNull();
    expect(inputElm.val()).toEqual('');
  });


  it('should render 0 even if it is a number', function() {
    var inputElm = helper.compileInput('<input type="text" ng-model="value" />');
    $rootScope.$apply('value = 0');

    expect(inputElm.val()).toBe('0');
  });


  it('should render the $viewValue when $modelValue is empty', function() {
    var inputElm = helper.compileInput('<input type="text" ng-model="value" />');

    var ctrl = inputElm.controller('ngModel');

    ctrl.$modelValue = null;

    expect(ctrl.$isEmpty(ctrl.$modelValue)).toBe(true);

    ctrl.$viewValue = 'abc';
    ctrl.$render();

    expect(inputElm.val()).toBe('abc');
  });


  // INPUT TYPES
  describe('month', function() {
    it('should throw if model is not a Date object', function() {
      var inputElm = helper.compileInput('<input type="month" ng-model="january"/>');

      expect(function() {
        $rootScope.$apply(function() {
          $rootScope.january = '2013-01';
        });
      }).toThrowMinErr('ngModel', 'datefmt', 'Expected `2013-01` to be a date');
    });


    it('should set the view if the model is a valid Date object', function() {
      var inputElm = helper.compileInput('<input type="month" ng-model="march"/>');

      $rootScope.$apply(function() {
        $rootScope.march = new Date(2013, 2, 1);
      });

      expect(inputElm.val()).toBe('2013-03');
    });


    it('should set the model undefined if the input is an invalid month string', function() {
      var inputElm = helper.compileInput('<input type="month" ng-model="value"/>');

      $rootScope.$apply(function() {
        $rootScope.value = new Date(2013, 0, 1);
      });


      expect(inputElm.val()).toBe('2013-01');

      //set to text for browsers with datetime-local validation.
      inputElm[0].setAttribute('type', 'text');

      helper.changeInputValueTo('stuff');
      expect(inputElm.val()).toBe('stuff');
      expect($rootScope.value).toBeUndefined();
      expect(inputElm).toBeInvalid();
    });


    it('should render as blank if null', function() {
      var inputElm = helper.compileInput('<input type="month" ng-model="test" />');

      $rootScope.$apply('test = null');

      expect($rootScope.test).toBeNull();
      expect(inputElm.val()).toEqual('');
    });


    it('should come up blank when no value specified', function() {
      var inputElm = helper.compileInput('<input type="month" ng-model="test" />');

      expect(inputElm.val()).toBe('');

      $rootScope.$apply('test = null');

      expect($rootScope.test).toBeNull();
      expect(inputElm.val()).toBe('');
    });


    it('should parse empty string to null', function() {
      var inputElm = helper.compileInput('<input type="month" ng-model="test" />');

      $rootScope.$apply(function() {
        $rootScope.test = new Date(2011, 0, 1);
      });

      helper.changeInputValueTo('');
      expect($rootScope.test).toBeNull();
      expect(inputElm).toBeValid();
    });


    it('should use UTC if specified in the options', function() {
      var inputElm = helper.compileInput('<input type="month" ng-model="value" ng-model-options="{timezone: \'UTC\'}" />');

      helper.changeInputValueTo('2013-07');
      expect(+$rootScope.value).toBe(Date.UTC(2013, 6, 1));

      $rootScope.$apply(function() {
        $rootScope.value = new Date(Date.UTC(2014, 6, 1));
      });
      expect(inputElm.val()).toBe('2014-07');
    });


    it('should use any timezone if specified in the options', function() {
      var inputElm = helper.compileInput('<input type="month" ng-model="value" ng-model-options="{timezone: \'+0500\'}" />');

      helper.changeInputValueTo('2013-07');
      expect(+$rootScope.value).toBe(Date.UTC(2013, 5, 30, 19, 0, 0));

      $rootScope.$apply(function() {
        $rootScope.value = new Date(Date.UTC(2014, 5, 30, 19, 0, 0));
      });
      expect(inputElm.val()).toBe('2014-07');
    });


    it('should label parse errors as `month`', function() {
      var inputElm = helper.compileInput('<input type="month" ng-model="val" name="alias" />', {
        valid: false,
        badInput: true
      });

      helper.changeInputValueTo('xxx');
      expect(inputElm).toBeInvalid();
      expect($rootScope.form.alias.$error.month).toBeTruthy();
    });


    it('should only change the month of a bound date', function() {
      var inputElm = helper.compileInput('<input type="month" ng-model="value" ng-model-options="{timezone: \'UTC\'}" />');

      $rootScope.$apply(function() {
        $rootScope.value = new Date(Date.UTC(2013, 7, 1, 1, 0, 0, 0));
      });
      helper.changeInputValueTo('2013-12');
      expect(+$rootScope.value).toBe(Date.UTC(2013, 11, 1, 1, 0, 0, 0));
      expect(inputElm.val()).toBe('2013-12');
    });

    it('should only change the month of a bound date in any timezone', function() {
      var inputElm = helper.compileInput('<input type="month" ng-model="value" ng-model-options="{timezone: \'+0500\'}" />');

      $rootScope.$apply(function() {
        $rootScope.value = new Date(Date.UTC(2013, 6, 31, 20, 0, 0));
      });
      helper.changeInputValueTo('2013-09');
      expect(+$rootScope.value).toBe(Date.UTC(2013, 7, 31, 20, 0, 0));
      expect(inputElm.val()).toBe('2013-09');
    });

    describe('min', function() {
      var inputElm;
      beforeEach(function() {
        $rootScope.minVal = '2013-01';
        inputElm = helper.compileInput('<input type="month" ng-model="value" name="alias" min="{{ minVal }}" />');
      });

      it('should invalidate', function() {
        helper.changeInputValueTo('2012-12');
        expect(inputElm).toBeInvalid();
        expect($rootScope.value).toBeFalsy();
        expect($rootScope.form.alias.$error.min).toBeTruthy();
      });

      it('should validate', function() {
        helper.changeInputValueTo('2013-07');
        expect(inputElm).toBeValid();
        expect(+$rootScope.value).toBe(+new Date(2013, 6, 1));
        expect($rootScope.form.alias.$error.min).toBeFalsy();
      });

      it('should revalidate when the min value changes', function() {
        helper.changeInputValueTo('2013-07');
        expect(inputElm).toBeValid();
        expect($rootScope.form.alias.$error.min).toBeFalsy();

        $rootScope.minVal = '2014-01';
        $rootScope.$digest();

        expect(inputElm).toBeInvalid();
        expect($rootScope.form.alias.$error.min).toBeTruthy();
      });

      it('should validate if min is empty', function() {
        $rootScope.minVal = undefined;
        $rootScope.value = new Date(-9999, 0, 1, 0, 0, 0);
        $rootScope.$digest();

        expect($rootScope.form.alias.$error.min).toBeFalsy();
      });
    });

    describe('max', function() {
      var inputElm;
      beforeEach(function() {
        $rootScope.maxVal = '2013-01';
        inputElm = helper.compileInput('<input type="month" ng-model="value" name="alias" max="{{ maxVal }}" />');
      });

      it('should validate', function() {
        helper.changeInputValueTo('2012-03');
        expect(inputElm).toBeValid();
        expect(+$rootScope.value).toBe(+new Date(2012, 2, 1));
        expect($rootScope.form.alias.$error.max).toBeFalsy();
      });

      it('should invalidate', function() {
        helper.changeInputValueTo('2013-05');
        expect(inputElm).toBeInvalid();
        expect($rootScope.value).toBeUndefined();
        expect($rootScope.form.alias.$error.max).toBeTruthy();
      });

      it('should revalidate when the max value changes', function() {
        helper.changeInputValueTo('2012-07');
        expect(inputElm).toBeValid();
        expect($rootScope.form.alias.$error.max).toBeFalsy();

        $rootScope.maxVal = '2012-01';
        $rootScope.$digest();

        expect(inputElm).toBeInvalid();
        expect($rootScope.form.alias.$error.max).toBeTruthy();
      });

      it('should validate if max is empty', function() {
        $rootScope.maxVal = undefined;
        $rootScope.value = new Date(9999, 11, 31, 23, 59, 59);
        $rootScope.$digest();

        expect($rootScope.form.alias.$error.max).toBeFalsy();
      });
    });
  });


  describe('week', function() {
    it('should throw if model is not a Date object', function() {
      var inputElm = helper.compileInput('<input type="week" ng-model="secondWeek"/>');

      expect(function() {
        $rootScope.$apply(function() {
          $rootScope.secondWeek = '2013-W02';
        });
      }).toThrowMinErr('ngModel', 'datefmt', 'Expected `2013-W02` to be a date');
    });


    it('should set the view if the model is a valid Date object', function() {
      var inputElm = helper.compileInput('<input type="week" ng-model="secondWeek"/>');

      $rootScope.$apply(function() {
        $rootScope.secondWeek = new Date(2013, 0, 11);
      });

      expect(inputElm.val()).toBe('2013-W02');
    });


    it('should not affect the hours or minutes of a bound date', function() {
      var inputElm = helper.compileInput('<input type="week" ng-model="secondWeek"/>');

      $rootScope.$apply(function() {
        $rootScope.secondWeek = new Date(2013, 0, 11, 1, 0, 0, 0);
      });

      helper.changeInputValueTo('2013-W03');

      expect(+$rootScope.secondWeek).toBe(+new Date(2013, 0, 17, 1, 0, 0, 0));
    });


    it('should set the model undefined if the input is an invalid week string', function() {
      var inputElm = helper.compileInput('<input type="week" ng-model="value"/>');

      $rootScope.$apply(function() {
        $rootScope.value = new Date(2013, 0, 11);
      });


      expect(inputElm.val()).toBe('2013-W02');

      //set to text for browsers with datetime-local validation.
      inputElm[0].setAttribute('type', 'text');

      helper.changeInputValueTo('stuff');
      expect(inputElm.val()).toBe('stuff');
      expect($rootScope.value).toBeUndefined();
      expect(inputElm).toBeInvalid();
    });


    it('should render as blank if null', function() {
      var inputElm = helper.compileInput('<input type="week" ng-model="test" />');

      $rootScope.$apply('test = null');

      expect($rootScope.test).toBeNull();
      expect(inputElm.val()).toEqual('');
    });


    it('should come up blank when no value specified', function() {
      var inputElm = helper.compileInput('<input type="week" ng-model="test" />');

      expect(inputElm.val()).toBe('');

      $rootScope.$apply('test = null');

      expect($rootScope.test).toBeNull();
      expect(inputElm.val()).toBe('');
    });


    it('should parse empty string to null', function() {
      var inputElm = helper.compileInput('<input type="week" ng-model="test" />');

      $rootScope.$apply(function() {
        $rootScope.test = new Date(2011, 0, 1);
      });

      helper.changeInputValueTo('');
      expect($rootScope.test).toBeNull();
      expect(inputElm).toBeValid();
    });


    it('should use UTC if specified in the options', function() {
      var inputElm = helper.compileInput('<input type="week" ng-model="value" ng-model-options="{timezone: \'UTC\'}" />');

      helper.changeInputValueTo('2013-W03');
      expect(+$rootScope.value).toBe(Date.UTC(2013, 0, 17));

      $rootScope.$apply(function() {
        $rootScope.value = new Date(Date.UTC(2014, 0, 17));
      });
      expect(inputElm.val()).toBe('2014-W03');
    });


    it('should use any timezone if specified in the options', function() {
      var inputElm = helper.compileInput('<input type="week" ng-model="value" ng-model-options="{timezone: \'+0500\'}" />');

      helper.changeInputValueTo('2013-W03');
      expect(+$rootScope.value).toBe(Date.UTC(2013, 0, 16, 19, 0, 0));

      $rootScope.$apply(function() {
        $rootScope.value = new Date(Date.UTC(2014, 0, 16, 19, 0, 0));
      });
      expect(inputElm.val()).toBe('2014-W03');
    });


    it('should label parse errors as `week`', function() {
      var inputElm = helper.compileInput('<input type="week" ng-model="val" name="alias" />', {
        valid: false,
        badInput: true
      });

      helper.changeInputValueTo('yyy');
      expect(inputElm).toBeInvalid();
      expect($rootScope.form.alias.$error.week).toBeTruthy();
    });

    describe('min', function() {
      var inputElm;
      beforeEach(function() {
        $rootScope.minVal = '2013-W01';
        inputElm = helper.compileInput('<input type="week" ng-model="value" name="alias" min="{{ minVal }}" />');
      });

      it('should invalidate', function() {
        helper.changeInputValueTo('2012-W12');
        expect(inputElm).toBeInvalid();
        expect($rootScope.value).toBeFalsy();
        expect($rootScope.form.alias.$error.min).toBeTruthy();
      });

      it('should validate', function() {
        helper.changeInputValueTo('2013-W03');
        expect(inputElm).toBeValid();
        expect(+$rootScope.value).toBe(+new Date(2013, 0, 17));
        expect($rootScope.form.alias.$error.min).toBeFalsy();
      });

      it('should revalidate when the min value changes', function() {
        helper.changeInputValueTo('2013-W03');
        expect(inputElm).toBeValid();
        expect($rootScope.form.alias.$error.min).toBeFalsy();

        $rootScope.minVal = '2014-W01';
        $rootScope.$digest();

        expect(inputElm).toBeInvalid();
        expect($rootScope.form.alias.$error.min).toBeTruthy();
      });

      it('should validate if min is empty', function() {
        $rootScope.minVal = undefined;
        $rootScope.value = new Date(-9999, 0, 1, 0, 0, 0);
        $rootScope.$digest();

        expect($rootScope.form.alias.$error.min).toBeFalsy();
      });
    });

    describe('max', function() {
      var inputElm;

      beforeEach(function() {
        $rootScope.maxVal = '2013-W01';
        inputElm = helper.compileInput('<input type="week" ng-model="value" name="alias" max="{{ maxVal }}" />');
      });

      it('should validate', function() {
        helper.changeInputValueTo('2012-W01');
        expect(inputElm).toBeValid();
        expect(+$rootScope.value).toBe(+new Date(2012, 0, 5));
        expect($rootScope.form.alias.$error.max).toBeFalsy();
      });

      it('should invalidate', function() {
        helper.changeInputValueTo('2013-W03');
        expect(inputElm).toBeInvalid();
        expect($rootScope.value).toBeUndefined();
        expect($rootScope.form.alias.$error.max).toBeTruthy();
      });

      it('should revalidate when the max value changes', function() {
        helper.changeInputValueTo('2012-W03');
        expect(inputElm).toBeValid();
        expect($rootScope.form.alias.$error.max).toBeFalsy();

        $rootScope.maxVal = '2012-W01';
        $rootScope.$digest();

        expect(inputElm).toBeInvalid();
        expect($rootScope.form.alias.$error.max).toBeTruthy();
      });

      it('should validate if max is empty', function() {
        $rootScope.maxVal = undefined;
        $rootScope.value = new Date(9999, 11, 31, 23, 59, 59);
        $rootScope.$digest();

        expect($rootScope.form.alias.$error.max).toBeFalsy();
      });
    });
  });


  describe('datetime-local', function() {
    it('should throw if model is not a Date object', function() {
      var inputElm = helper.compileInput('<input type="datetime-local" ng-model="lunchtime"/>');

      expect(function() {
        $rootScope.$apply(function() {
          $rootScope.lunchtime = '2013-12-16T11:30:00';
        });
      }).toThrowMinErr('ngModel', 'datefmt', 'Expected `2013-12-16T11:30:00` to be a date');
    });


    it('should set the view if the model if a valid Date object.', function() {
      var inputElm = helper.compileInput('<input type="datetime-local" ng-model="halfSecondToNextYear"/>');

      $rootScope.$apply(function() {
        $rootScope.halfSecondToNextYear = new Date(2013, 11, 31, 23, 59, 59, 500);
      });

      expect(inputElm.val()).toBe('2013-12-31T23:59:59.500');
    });


    it('should set the model undefined if the view is invalid', function() {
      var inputElm = helper.compileInput('<input type="datetime-local" ng-model="breakMe"/>');

      $rootScope.$apply(function() {
        $rootScope.breakMe = new Date(2009, 0, 6, 16, 25, 0);
      });

      expect(inputElm.val()).toBe('2009-01-06T16:25:00.000');

      //set to text for browsers with datetime-local validation.
      inputElm[0].setAttribute('type', 'text');

      helper.changeInputValueTo('stuff');
      expect(inputElm.val()).toBe('stuff');
      expect($rootScope.breakMe).toBeUndefined();
      expect(inputElm).toBeInvalid();
    });


    it('should render as blank if null', function() {
      var inputElm = helper.compileInput('<input type="datetime-local" ng-model="test" />');

      $rootScope.$apply('test = null');

      expect($rootScope.test).toBeNull();
      expect(inputElm.val()).toEqual('');
    });


    it('should come up blank when no value specified', function() {
      var inputElm = helper.compileInput('<input type="datetime-local" ng-model="test" />');

      expect(inputElm.val()).toBe('');

      $rootScope.$apply('test = null');

      expect($rootScope.test).toBeNull();
      expect(inputElm.val()).toBe('');
    });


    it('should parse empty string to null', function() {
      var inputElm = helper.compileInput('<input type="datetime-local" ng-model="test" />');

      $rootScope.$apply(function() {
        $rootScope.test = new Date(2011, 0, 1);
      });

      helper.changeInputValueTo('');
      expect($rootScope.test).toBeNull();
      expect(inputElm).toBeValid();
    });


    it('should use UTC if specified in the options', function() {
      var inputElm = helper.compileInput('<input type="datetime-local" ng-model="value" ng-model-options="{timezone: \'UTC\'}" />');

      helper.changeInputValueTo('2000-01-01T01:02');
      expect(+$rootScope.value).toBe(Date.UTC(2000, 0, 1, 1, 2, 0));

      $rootScope.$apply(function() {
        $rootScope.value = new Date(Date.UTC(2001, 0, 1, 1, 2, 0));
      });
      expect(inputElm.val()).toBe('2001-01-01T01:02:00.000');
    });


    it('should use any timezone if specified in the options', function() {
      var inputElm = helper.compileInput('<input type="datetime-local" ng-model="value" ng-model-options="{timezone: \'+0500\'}" />');

      helper.changeInputValueTo('2000-01-01T06:02');
      expect(+$rootScope.value).toBe(Date.UTC(2000, 0, 1, 1, 2, 0));

      $rootScope.$apply(function() {
        $rootScope.value = new Date(Date.UTC(2001, 0, 1, 1, 2, 0));
      });
      expect(inputElm.val()).toBe('2001-01-01T06:02:00.000');
    });


    it('should fallback to default timezone in case an unknown timezone was passed', function() {
      var inputElm = helper.compileInput(
        '<input type="datetime-local" ng-model="value1" ng-model-options="{timezone: \'WTF\'}" />' +
        '<input type="datetime-local" ng-model="value2" />');

      helper.changeGivenInputTo(inputElm.eq(0), '2000-01-01T06:02');
      helper.changeGivenInputTo(inputElm.eq(1), '2000-01-01T06:02');
      expect($rootScope.value1).toEqual($rootScope.value2);
    });


    it('should allow to specify the milliseconds', function() {
      var inputElm = helper.compileInput('<input type="datetime-local" ng-model="value"" />');

      helper.changeInputValueTo('2000-01-01T01:02:03.500');
      expect(+$rootScope.value).toBe(+new Date(2000, 0, 1, 1, 2, 3, 500));
    });


    it('should allow to specify single digit milliseconds', function() {
      var inputElm = helper.compileInput('<input type="datetime-local" ng-model="value"" />');

      helper.changeInputValueTo('2000-01-01T01:02:03.4');
      expect(+$rootScope.value).toBe(+new Date(2000, 0, 1, 1, 2, 3, 400));
    });


    it('should allow to specify the seconds', function() {
      var inputElm = helper.compileInput('<input type="datetime-local" ng-model="value"" />');

      helper.changeInputValueTo('2000-01-01T01:02:03');
      expect(+$rootScope.value).toBe(+new Date(2000, 0, 1, 1, 2, 3));

      $rootScope.$apply(function() {
        $rootScope.value = new Date(2001, 0, 1, 1, 2, 3);
      });
      expect(inputElm.val()).toBe('2001-01-01T01:02:03.000');
    });


    it('should allow to skip the seconds', function() {
      var inputElm = helper.compileInput('<input type="datetime-local" ng-model="value"" />');

      helper.changeInputValueTo('2000-01-01T01:02');
      expect(+$rootScope.value).toBe(+new Date(2000, 0, 1, 1, 2, 0));
    });


    it('should label parse errors as `datetimelocal`', function() {
      var inputElm = helper.compileInput('<input type="datetime-local" ng-model="val" name="alias" />', {
        valid: false,
        badInput: true
      });

      helper.changeInputValueTo('zzz');
      expect(inputElm).toBeInvalid();
      expect($rootScope.form.alias.$error.datetimelocal).toBeTruthy();
    });

    describe('min', function() {
      var inputElm;
      beforeEach(function() {
        $rootScope.minVal = '2000-01-01T12:30:00';
        inputElm = helper.compileInput('<input type="datetime-local" ng-model="value" name="alias" min="{{ minVal }}" />');
      });

      it('should invalidate', function() {
        helper.changeInputValueTo('1999-12-31T01:02:00');
        expect(inputElm).toBeInvalid();
        expect($rootScope.value).toBeFalsy();
        expect($rootScope.form.alias.$error.min).toBeTruthy();
      });

      it('should validate', function() {
        helper.changeInputValueTo('2000-01-01T23:02:00');
        expect(inputElm).toBeValid();
        expect(+$rootScope.value).toBe(+new Date(2000, 0, 1, 23, 2, 0));
        expect($rootScope.form.alias.$error.min).toBeFalsy();
      });

      it('should revalidate when the min value changes', function() {
        helper.changeInputValueTo('2000-02-01T01:02:00');
        expect(inputElm).toBeValid();
        expect($rootScope.form.alias.$error.min).toBeFalsy();

        $rootScope.minVal = '2010-01-01T01:02:00';
        $rootScope.$digest();

        expect(inputElm).toBeInvalid();
        expect($rootScope.form.alias.$error.min).toBeTruthy();
      });

      it('should validate if min is empty', function() {
        $rootScope.minVal = undefined;
        $rootScope.value = new Date(-9999, 0, 1, 0, 0, 0);
        $rootScope.$digest();

        expect($rootScope.form.alias.$error.min).toBeFalsy();
      });
    });

    describe('max', function() {
      var inputElm;
      beforeEach(function() {
        $rootScope.maxVal = '2019-01-01T01:02:00';
        inputElm = helper.compileInput('<input type="datetime-local" ng-model="value" name="alias" max="{{ maxVal }}" />');
      });

      it('should invalidate', function() {
        helper.changeInputValueTo('2019-12-31T01:02:00');
        expect(inputElm).toBeInvalid();
        expect($rootScope.value).toBeFalsy();
        expect($rootScope.form.alias.$error.max).toBeTruthy();
      });

      it('should validate', function() {
        helper.changeInputValueTo('2000-01-01T01:02:00');
        expect(inputElm).toBeValid();
        expect(+$rootScope.value).toBe(+new Date(2000, 0, 1, 1, 2, 0));
        expect($rootScope.form.alias.$error.max).toBeFalsy();
      });

      it('should revalidate when the max value changes', function() {
        helper.changeInputValueTo('2000-02-01T01:02:00');
        expect(inputElm).toBeValid();
        expect($rootScope.form.alias.$error.max).toBeFalsy();

        $rootScope.maxVal = '2000-01-01T01:02:00';
        $rootScope.$digest();

        expect(inputElm).toBeInvalid();
        expect($rootScope.form.alias.$error.max).toBeTruthy();
      });

      it('should validate if max is empty', function() {
        $rootScope.maxVal = undefined;
        $rootScope.value = new Date(9999, 11, 31, 23, 59, 59);
        $rootScope.$digest();

        expect($rootScope.form.alias.$error.max).toBeFalsy();
      });
    });


    it('should validate even if max value changes on-the-fly', function() {
      $rootScope.max = '2013-01-01T01:02:00';
      var inputElm = helper.compileInput('<input type="datetime-local" ng-model="value" name="alias" max="{{max}}" />');

      helper.changeInputValueTo('2014-01-01T12:34:00');
      expect(inputElm).toBeInvalid();

      $rootScope.max = '2001-01-01T01:02:00';
      $rootScope.$digest();

      expect(inputElm).toBeInvalid();

      $rootScope.max = '2024-01-01T01:02:00';
      $rootScope.$digest();

      expect(inputElm).toBeValid();
    });


    it('should validate even if min value changes on-the-fly', function() {
      $rootScope.min = '2013-01-01T01:02:00';
      var inputElm = helper.compileInput('<input type="datetime-local" ng-model="value" name="alias" min="{{min}}" />');

      helper.changeInputValueTo('2010-01-01T12:34:00');
      expect(inputElm).toBeInvalid();

      $rootScope.min = '2014-01-01T01:02:00';
      $rootScope.$digest();

      expect(inputElm).toBeInvalid();

      $rootScope.min = '2009-01-01T01:02:00';
      $rootScope.$digest();

      expect(inputElm).toBeValid();
    });


    it('should validate even if ng-max value changes on-the-fly', function() {
      $rootScope.max = '2013-01-01T01:02:00';
      var inputElm = helper.compileInput('<input type="datetime-local" ng-model="value" name="alias" ng-max="max" />');

      helper.changeInputValueTo('2014-01-01T12:34:00');
      expect(inputElm).toBeInvalid();

      $rootScope.max = '2001-01-01T01:02:00';
      $rootScope.$digest();

      expect(inputElm).toBeInvalid();

      $rootScope.max = '2024-01-01T01:02:00';
      $rootScope.$digest();

      expect(inputElm).toBeValid();
    });


    it('should validate even if ng-min value changes on-the-fly', function() {
      $rootScope.min = '2013-01-01T01:02:00';
      var inputElm = helper.compileInput('<input type="datetime-local" ng-model="value" name="alias" ng-min="min" />');

      helper.changeInputValueTo('2010-01-01T12:34:00');
      expect(inputElm).toBeInvalid();

      $rootScope.min = '2014-01-01T01:02:00';
      $rootScope.$digest();

      expect(inputElm).toBeInvalid();

      $rootScope.min = '2009-01-01T01:02:00';
      $rootScope.$digest();

      expect(inputElm).toBeValid();
    });
  });


  describe('time', function() {
    it('should throw if model is not a Date object', function() {
      var inputElm = helper.compileInput('<input type="time" ng-model="lunchtime"/>');

      expect(function() {
        $rootScope.$apply(function() {
          $rootScope.lunchtime = '11:30:00';
        });
      }).toThrowMinErr('ngModel', 'datefmt', 'Expected `11:30:00` to be a date');
    });


    it('should set the view if the model if a valid Date object.', function() {
      var inputElm = helper.compileInput('<input type="time" ng-model="threeFortyOnePm"/>');

      $rootScope.$apply(function() {
        $rootScope.threeFortyOnePm = new Date(1970, 0, 1, 15, 41, 0, 500);
      });

      expect(inputElm.val()).toBe('15:41:00.500');
    });


    it('should set the model undefined if the view is invalid', function() {
      var inputElm = helper.compileInput('<input type="time" ng-model="breakMe"/>');

      $rootScope.$apply(function() {
        $rootScope.breakMe = new Date(1970, 0, 1, 16, 25, 0);
      });

      expect(inputElm.val()).toBe('16:25:00.000');

      //set to text for browsers with time validation.
      inputElm[0].setAttribute('type', 'text');

      helper.changeInputValueTo('stuff');
      expect(inputElm.val()).toBe('stuff');
      expect($rootScope.breakMe).toBeUndefined();
      expect(inputElm).toBeInvalid();
    });


    it('should render as blank if null', function() {
      var inputElm = helper.compileInput('<input type="time" ng-model="test" />');

      $rootScope.$apply('test = null');

      expect($rootScope.test).toBeNull();
      expect(inputElm.val()).toEqual('');
    });


    it('should come up blank when no value specified', function() {
      var inputElm = helper.compileInput('<input type="time" ng-model="test" />');

      expect(inputElm.val()).toBe('');

      $rootScope.$apply('test = null');

      expect($rootScope.test).toBeNull();
      expect(inputElm.val()).toBe('');
    });


    it('should parse empty string to null', function() {
      var inputElm = helper.compileInput('<input type="time" ng-model="test" />');

      $rootScope.$apply(function() {
        $rootScope.test = new Date(2011, 0, 1);
      });

      helper.changeInputValueTo('');
      expect($rootScope.test).toBeNull();
      expect(inputElm).toBeValid();
    });


    it('should use UTC if specified in the options', function() {
      var inputElm = helper.compileInput('<input type="time" ng-model="value" ng-model-options="{timezone: \'UTC\'}" />');

      helper.changeInputValueTo('23:02:00');
      expect(+$rootScope.value).toBe(Date.UTC(1970, 0, 1, 23, 2, 0));

      $rootScope.$apply(function() {
        $rootScope.value = new Date(Date.UTC(1971, 0, 1, 23, 2, 0));
      });
      expect(inputElm.val()).toBe('23:02:00.000');
    });


    it('should use any timezone if specified in the options', function() {
      var inputElm = helper.compileInput('<input type="time" ng-model="value" ng-model-options="{timezone: \'+0500\'}" />');

      helper.changeInputValueTo('23:02:00');
      expect(+$rootScope.value).toBe(Date.UTC(1970, 0, 1, 18, 2, 0));

      $rootScope.$apply(function() {
        $rootScope.value = new Date(Date.UTC(1971, 0, 1, 18, 2, 0));
      });
      expect(inputElm.val()).toBe('23:02:00.000');
    });


    it('should allow to specify the milliseconds', function() {
      var inputElm = helper.compileInput('<input type="time" ng-model="value"" />');

      helper.changeInputValueTo('01:02:03.500');
      expect(+$rootScope.value).toBe(+new Date(1970, 0, 1, 1, 2, 3, 500));
    });


    it('should allow to specify single digit milliseconds', function() {
      var inputElm = helper.compileInput('<input type="time" ng-model="value"" />');

      helper.changeInputValueTo('01:02:03.4');
      expect(+$rootScope.value).toBe(+new Date(1970, 0, 1, 1, 2, 3, 400));
    });


    it('should allow to specify the seconds', function() {
      var inputElm = helper.compileInput('<input type="time" ng-model="value"" />');

      helper.changeInputValueTo('01:02:03');
      expect(+$rootScope.value).toBe(+new Date(1970, 0, 1, 1, 2, 3));

      $rootScope.$apply(function() {
        $rootScope.value = new Date(1970, 0, 1, 1, 2, 3);
      });
      expect(inputElm.val()).toBe('01:02:03.000');
    });


    it('should allow to skip the seconds', function() {
      var inputElm = helper.compileInput('<input type="time" ng-model="value"" />');

      helper.changeInputValueTo('01:02');
      expect(+$rootScope.value).toBe(+new Date(1970, 0, 1, 1, 2, 0));
    });


    it('should label parse errors as `time`', function() {
      var inputElm = helper.compileInput('<input type="time" ng-model="val" name="alias" />', {
        valid: false,
        badInput: true
      });

      helper.changeInputValueTo('mmm');
      expect(inputElm).toBeInvalid();
      expect($rootScope.form.alias.$error.time).toBeTruthy();
    });


    it('should only change hours and minute of a bound date', function() {
      var inputElm = helper.compileInput('<input type="time" ng-model="value"" />');

      $rootScope.$apply(function() {
        $rootScope.value = new Date(2013, 2, 3, 1, 0, 0);
      });

      helper.changeInputValueTo('01:02');
      expect(+$rootScope.value).toBe(+new Date(2013, 2, 3, 1, 2, 0));
    });

    describe('min', function() {
      var inputElm;
      beforeEach(function() {
        $rootScope.minVal = '09:30:00';
        inputElm = helper.compileInput('<input type="time" ng-model="value" name="alias" min="{{ minVal }}" />');
      });

      it('should invalidate', function() {
        helper.changeInputValueTo('01:02:00');
        expect(inputElm).toBeInvalid();
        expect($rootScope.value).toBeFalsy();
        expect($rootScope.form.alias.$error.min).toBeTruthy();
      });

      it('should validate', function() {
        helper.changeInputValueTo('23:02:00');
        expect(inputElm).toBeValid();
        expect(+$rootScope.value).toBe(+new Date(1970, 0, 1, 23, 2, 0));
        expect($rootScope.form.alias.$error.min).toBeFalsy();
      });

      it('should revalidate when the min value changes', function() {
        helper.changeInputValueTo('23:02:00');
        expect(inputElm).toBeValid();
        expect($rootScope.form.alias.$error.min).toBeFalsy();

        $rootScope.minVal = '23:55:00';
        $rootScope.$digest();

        expect(inputElm).toBeInvalid();
        expect($rootScope.form.alias.$error.min).toBeTruthy();
      });

      it('should validate if min is empty', function() {
        $rootScope.minVal = undefined;
        $rootScope.value = new Date(-9999, 0, 1, 0, 0, 0);
        $rootScope.$digest();

        expect($rootScope.form.alias.$error.min).toBeFalsy();
      });
    });

    describe('max', function() {
      var inputElm;
      beforeEach(function() {
        $rootScope.maxVal = '22:30:00';
        inputElm = helper.compileInput('<input type="time" ng-model="value" name="alias" max="{{ maxVal }}" />');
      });

      it('should invalidate', function() {
        helper.changeInputValueTo('23:00:00');
        expect(inputElm).toBeInvalid();
        expect($rootScope.value).toBeFalsy();
        expect($rootScope.form.alias.$error.max).toBeTruthy();
      });

      it('should validate', function() {
        helper.changeInputValueTo('05:30:00');
        expect(inputElm).toBeValid();
        expect(+$rootScope.value).toBe(+new Date(1970, 0, 1, 5, 30, 0));
        expect($rootScope.form.alias.$error.max).toBeFalsy();
      });

     it('should validate if max is empty', function() {
        $rootScope.maxVal = undefined;
        $rootScope.value = new Date(9999, 11, 31, 23, 59, 59);
        $rootScope.$digest();

        expect($rootScope.form.alias.$error.max).toBeFalsy();
      });
    });


    it('should validate even if max value changes on-the-fly', function() {
      $rootScope.max = '04:02:00';
      var inputElm = helper.compileInput('<input type="time" ng-model="value" name="alias" max="{{max}}" />');

      helper.changeInputValueTo('05:34:00');
      expect(inputElm).toBeInvalid();

      $rootScope.max = '06:34:00';
      $rootScope.$digest();

      expect(inputElm).toBeValid();
    });


    it('should validate even if min value changes on-the-fly', function() {
      $rootScope.min = '08:45:00';
      var inputElm = helper.compileInput('<input type="time" ng-model="value" name="alias" min="{{min}}" />');

      helper.changeInputValueTo('06:15:00');
      expect(inputElm).toBeInvalid();

      $rootScope.min = '05:50:00';
      $rootScope.$digest();

      expect(inputElm).toBeValid();
    });


    it('should validate even if ng-max value changes on-the-fly', function() {
      $rootScope.max = '04:02:00';
      var inputElm = helper.compileInput('<input type="time" ng-model="value" name="alias" ng-max="max" />');

      helper.changeInputValueTo('05:34:00');
      expect(inputElm).toBeInvalid();

      $rootScope.max = '06:34:00';
      $rootScope.$digest();

      expect(inputElm).toBeValid();
    });


    it('should validate even if ng-min value changes on-the-fly', function() {
      $rootScope.min = '08:45:00';
      var inputElm = helper.compileInput('<input type="time" ng-model="value" name="alias" ng-min="min" />');

      helper.changeInputValueTo('06:15:00');
      expect(inputElm).toBeInvalid();

      $rootScope.min = '05:50:00';
      $rootScope.$digest();

      expect(inputElm).toBeValid();
    });
  });


  describe('date', function() {
    it('should throw if model is not a Date object.', function() {
      var inputElm = helper.compileInput('<input type="date" ng-model="birthday"/>');

      expect(function() {
        $rootScope.$apply(function() {
          $rootScope.birthday = '1977-10-22';
        });
      }).toThrowMinErr('ngModel', 'datefmt', 'Expected `1977-10-22` to be a date');
    });


    it('should set the view to empty when the model is an InvalidDate', function() {
      var inputElm = helper.compileInput('<input type="date" ng-model="val"/>');
      // reset the element type to text otherwise newer browsers
      // would always set the input.value to empty for invalid dates...
      inputElm.attr('type', 'text');

      $rootScope.$apply(function() {
        $rootScope.val = new Date('a');
      });

      expect(inputElm.val()).toBe('');
    });


    it('should set the view if the model if a valid Date object.', function() {
      var inputElm = helper.compileInput('<input type="date" ng-model="christmas"/>');

      $rootScope.$apply(function() {
        $rootScope.christmas = new Date(2013, 11, 25);
      });

      expect(inputElm.val()).toBe('2013-12-25');
    });


    it('should set the model undefined if the view is invalid', function() {
      var inputElm = helper.compileInput('<input type="date" ng-model="arrMatey"/>');

      $rootScope.$apply(function() {
        $rootScope.arrMatey = new Date(2014, 8, 14);
      });

      expect(inputElm.val()).toBe('2014-09-14');

      //set to text for browsers with date validation.
      inputElm[0].setAttribute('type', 'text');

      helper.changeInputValueTo('1-2-3');
      expect(inputElm.val()).toBe('1-2-3');
      expect($rootScope.arrMatey).toBeUndefined();
      expect(inputElm).toBeInvalid();
    });


    it('should render as blank if null', function() {
      var inputElm = helper.compileInput('<input type="date" ng-model="test" />');

      $rootScope.$apply('test = null');

      expect($rootScope.test).toBeNull();
      expect(inputElm.val()).toEqual('');
    });


    it('should come up blank when no value specified', function() {
      var inputElm = helper.compileInput('<input type="date" ng-model="test" />');

      expect(inputElm.val()).toBe('');

      $rootScope.$apply('test = null');

      expect($rootScope.test).toBeNull();
      expect(inputElm.val()).toBe('');
    });


    it('should parse empty string to null', function() {
      var inputElm = helper.compileInput('<input type="date" ng-model="test" />');

      $rootScope.$apply(function() {
        $rootScope.test = new Date(2011, 0, 1);
      });

      helper.changeInputValueTo('');
      expect($rootScope.test).toBeNull();
      expect(inputElm).toBeValid();
    });


    it('should use UTC if specified in the options', function() {
      var inputElm = helper.compileInput('<input type="date" ng-model="value" ng-model-options="{timezone: \'UTC\'}" />');

      helper.changeInputValueTo('2000-01-01');
      expect(+$rootScope.value).toBe(Date.UTC(2000, 0, 1));

      $rootScope.$apply(function() {
        $rootScope.value = new Date(Date.UTC(2001, 0, 1));
      });
      expect(inputElm.val()).toBe('2001-01-01');
    });


    it('should use any timezone if specified in the options', function() {
      var inputElm = helper.compileInput('<input type="date" ng-model="value" ng-model-options="{timezone: \'+0500\'}" />');

      helper.changeInputValueTo('2000-01-01');
      expect(+$rootScope.value).toBe(Date.UTC(1999, 11, 31, 19, 0, 0));

      $rootScope.$apply(function() {
        $rootScope.value = new Date(Date.UTC(2000, 11, 31, 19, 0, 0));
      });
      expect(inputElm.val()).toBe('2001-01-01');
    });


    it('should label parse errors as `date`', function() {
      var inputElm = helper.compileInput('<input type="date" ng-model="val" name="alias" />', {
        valid: false,
        badInput: true
      });

      helper.changeInputValueTo('nnn');
      expect(inputElm).toBeInvalid();
      expect($rootScope.form.alias.$error.date).toBeTruthy();
    });


    it('should work with multiple date types bound to the same model', function() {
      var formElm = jqLite('<form name="form"></form>');

      var timeElm = jqLite('<input type="time" ng-model="val" />'),
          monthElm = jqLite('<input type="month" ng-model="val" />'),
          weekElm = jqLite('<input type="week" ng-model="val" />');

      formElm.append(timeElm);
      formElm.append(monthElm);
      formElm.append(weekElm);

      $compile(formElm)($rootScope);

      $rootScope.$apply(function() {
        $rootScope.val = new Date(2013, 1, 2, 3, 4, 5, 6);
      });

      expect(timeElm.val()).toBe('03:04:05.006');
      expect(monthElm.val()).toBe('2013-02');
      expect(weekElm.val()).toBe('2013-W05');

      helper.changeGivenInputTo(monthElm, '2012-02');
      expect(monthElm.val()).toBe('2012-02');
      expect(timeElm.val()).toBe('03:04:05.006');
      expect(weekElm.val()).toBe('2012-W05');

      helper.changeGivenInputTo(timeElm, '04:05:06');
      expect(monthElm.val()).toBe('2012-02');
      expect(timeElm.val()).toBe('04:05:06');
      expect(weekElm.val()).toBe('2012-W05');

      helper.changeGivenInputTo(weekElm, '2014-W01');
      expect(monthElm.val()).toBe('2014-01');
      expect(timeElm.val()).toBe('04:05:06.000');
      expect(weekElm.val()).toBe('2014-W01');

      expect(+$rootScope.val).toBe(+new Date(2014, 0, 2, 4, 5, 6, 0));

      dealoc(formElm);
    });

    describe('min', function() {

      it('should invalidate', function() {
        var inputElm = helper.compileInput('<input type="date" ng-model="value" name="alias" min="2000-01-01" />');
        helper.changeInputValueTo('1999-12-31');
        expect(inputElm).toBeInvalid();
        expect($rootScope.value).toBeFalsy();
        expect($rootScope.form.alias.$error.min).toBeTruthy();
      });

      it('should validate', function() {
        var inputElm = helper.compileInput('<input type="date" ng-model="value" name="alias" min="2000-01-01" />');
        helper.changeInputValueTo('2000-01-01');
        expect(inputElm).toBeValid();
        expect(+$rootScope.value).toBe(+new Date(2000, 0, 1));
        expect($rootScope.form.alias.$error.min).toBeFalsy();
      });

      it('should parse ISO-based date strings as a valid min date value', function() {
        var inputElm = helper.compileInput('<input name="myControl" type="date" min="{{ min }}" ng-model="value">');

        $rootScope.value = new Date(2010, 1, 1, 0, 0, 0);
        $rootScope.min = new Date(2014, 10, 10, 0, 0, 0);
        $rootScope.$digest();

        expect($rootScope.form.myControl.$error.min).toBeTruthy();
      });

      it('should validate if min is empty', function() {
        var inputElm = helper.compileInput(
            '<input type="date" name="alias" ng-model="value" min />');

        $rootScope.value = new Date(-9999, 0, 1, 0, 0, 0);
        $rootScope.$digest();

        expect($rootScope.form.alias.$error.min).toBeFalsy();
      });
    });

    describe('max', function() {

      it('should invalidate', function() {
        var inputElm = helper.compileInput('<input type="date" ng-model="value" name="alias" max="2019-01-01" />');
        helper.changeInputValueTo('2019-12-31');
        expect(inputElm).toBeInvalid();
        expect($rootScope.value).toBeFalsy();
        expect($rootScope.form.alias.$error.max).toBeTruthy();
      });

      it('should validate', function() {
        var inputElm = helper.compileInput('<input type="date" ng-model="value" name="alias" max="2019-01-01" />');
        helper.changeInputValueTo('2000-01-01');
        expect(inputElm).toBeValid();
        expect(+$rootScope.value).toBe(+new Date(2000, 0, 1));
        expect($rootScope.form.alias.$error.max).toBeFalsy();
      });

      it('should parse ISO-based date strings as a valid max date value', function() {
        var inputElm = helper.compileInput('<input name="myControl" type="date" max="{{ max }}" ng-model="value">');

        $rootScope.value = new Date(2020, 1, 1, 0, 0, 0);
        $rootScope.max = new Date(2014, 10, 10, 0, 0, 0);
        $rootScope.$digest();

        expect($rootScope.form.myControl.$error.max).toBeTruthy();
      });

      it('should validate if max is empty', function() {
        var inputElm = helper.compileInput(
            '<input type="date" name="alias" ng-model="value" max />');

        $rootScope.value = new Date(9999, 11, 31, 23, 59, 59);
        $rootScope.$digest();

        expect($rootScope.form.alias.$error.max).toBeFalsy();
      });
    });


    it('should validate even if max value changes on-the-fly', function() {
      $rootScope.max = '2013-01-01';
      var inputElm = helper.compileInput('<input type="date" ng-model="value" name="alias" max="{{max}}" />');

      helper.changeInputValueTo('2014-01-01');
      expect(inputElm).toBeInvalid();

      $rootScope.max = '2001-01-01';
      $rootScope.$digest();

      expect(inputElm).toBeInvalid();

      $rootScope.max = '2021-01-01';
      $rootScope.$digest();

      expect(inputElm).toBeValid();
    });


    it('should validate even if min value changes on-the-fly', function() {
      $rootScope.min = '2013-01-01';
      var inputElm = helper.compileInput('<input type="date" ng-model="value" name="alias" min="{{min}}" />');

      helper.changeInputValueTo('2010-01-01');
      expect(inputElm).toBeInvalid();

      $rootScope.min = '2014-01-01';
      $rootScope.$digest();

      expect(inputElm).toBeInvalid();

      $rootScope.min = '2009-01-01';
      $rootScope.$digest();

      expect(inputElm).toBeValid();
    });


    it('should validate even if ng-max value changes on-the-fly', function() {
      $rootScope.max = '2013-01-01';
      var inputElm = helper.compileInput('<input type="date" ng-model="value" name="alias" ng-max="max" />');

      helper.changeInputValueTo('2014-01-01');
      expect(inputElm).toBeInvalid();

      $rootScope.max = '2001-01-01';
      $rootScope.$digest();

      expect(inputElm).toBeInvalid();

      $rootScope.max = '2021-01-01';
      $rootScope.$digest();

      expect(inputElm).toBeValid();
    });


    it('should validate even if ng-min value changes on-the-fly', function() {
      $rootScope.min = '2013-01-01';
      var inputElm = helper.compileInput('<input type="date" ng-model="value" name="alias" ng-min="min" />');

      helper.changeInputValueTo('2010-01-01');
      expect(inputElm).toBeInvalid();

      $rootScope.min = '2014-01-01';
      $rootScope.$digest();

      expect(inputElm).toBeInvalid();

      $rootScope.min = '2009-01-01';
      $rootScope.$digest();

      expect(inputElm).toBeValid();
    });
  });


  describe('number', function() {

    it('should reset the model if view is invalid', function() {
      var inputElm = helper.compileInput('<input type="number" ng-model="age"/>');

      $rootScope.$apply('age = 123');
      expect(inputElm.val()).toBe('123');

      // to allow non-number values, we have to change type so that
      // the browser which have number validation will not interfere with
      // this test.
      inputElm[0].setAttribute('type', 'text');

      helper.changeInputValueTo('123X');
      expect(inputElm.val()).toBe('123X');
      expect($rootScope.age).toBeUndefined();
      expect(inputElm).toBeInvalid();
    });


    it('should render as blank if null', function() {
      var inputElm = helper.compileInput('<input type="number" ng-model="age" />');

      $rootScope.$apply('age = null');

      expect($rootScope.age).toBeNull();
      expect(inputElm.val()).toEqual('');
    });


    it('should come up blank when no value specified', function() {
      var inputElm = helper.compileInput('<input type="number" ng-model="age" />');

      expect(inputElm.val()).toBe('');

      $rootScope.$apply('age = null');

      expect($rootScope.age).toBeNull();
      expect(inputElm.val()).toBe('');
    });


    it('should parse empty string to null', function() {
      var inputElm = helper.compileInput('<input type="number" ng-model="age" />');

      $rootScope.$apply('age = 10');

      helper.changeInputValueTo('');
      expect($rootScope.age).toBeNull();
      expect(inputElm).toBeValid();
    });


    it('should only invalidate the model if suffering from bad input when the data is parsed', function() {
      var inputElm = helper.compileInput('<input type="number" ng-model="age" />', {
        valid: false,
        badInput: true
      });

      expect($rootScope.age).toBeUndefined();
      expect(inputElm).toBeValid();

      helper.changeInputValueTo('this-will-fail-because-of-the-badInput-flag');

      expect($rootScope.age).toBeUndefined();
      expect(inputElm).toBeInvalid();
    });


    it('should validate number if transition from bad input to empty string', function() {
      var validity = {
        valid: false,
        badInput: true
      };
      var inputElm = helper.compileInput('<input type="number" ng-model="age" />', validity);
      helper.changeInputValueTo('10a');
      validity.badInput = false;
      validity.valid = true;
      helper.changeInputValueTo('');
      expect($rootScope.age).toBeNull();
      expect(inputElm).toBeValid();
    });


    it('should validate with undefined viewValue when $validate() called', function() {
      var inputElm = helper.compileInput('<input type="number" name="alias" ng-model="value" />');

      $rootScope.form.alias.$validate();

      expect(inputElm).toBeValid();
      expect($rootScope.form.alias.$error.number).toBeUndefined();
    });


    it('should throw if the model value is not a number', function() {
      expect(function() {
        $rootScope.value = 'one';
        var inputElm = helper.compileInput('<input type="number" ng-model="value" />');
      }).toThrowMinErr('ngModel', 'numfmt', "Expected `one` to be a number");
    });


    it('should parse exponential notation', function() {
      var inputElm = helper.compileInput('<input type="number" name="alias" ng-model="value" />');

      // #.###e+##
      $rootScope.form.alias.$setViewValue("1.23214124123412412e+26");
      expect(inputElm).toBeValid();
      expect($rootScope.value).toBe(1.23214124123412412e+26);

      // #.###e##
      $rootScope.form.alias.$setViewValue("1.23214124123412412e26");
      expect(inputElm).toBeValid();
      expect($rootScope.value).toBe(1.23214124123412412e26);

      // #.###e-##
      $rootScope.form.alias.$setViewValue("1.23214124123412412e-26");
      expect(inputElm).toBeValid();
      expect($rootScope.value).toBe(1.23214124123412412e-26);

      // ####e+##
      $rootScope.form.alias.$setViewValue("123214124123412412e+26");
      expect(inputElm).toBeValid();
      expect($rootScope.value).toBe(123214124123412412e26);

      // ####e##
      $rootScope.form.alias.$setViewValue("123214124123412412e26");
      expect(inputElm).toBeValid();
      expect($rootScope.value).toBe(123214124123412412e26);

      // ####e-##
      $rootScope.form.alias.$setViewValue("123214124123412412e-26");
      expect(inputElm).toBeValid();
      expect($rootScope.value).toBe(123214124123412412e-26);

      // #.###E+##
      $rootScope.form.alias.$setViewValue("1.23214124123412412E+26");
      expect(inputElm).toBeValid();
      expect($rootScope.value).toBe(1.23214124123412412e+26);

      // #.###E##
      $rootScope.form.alias.$setViewValue("1.23214124123412412E26");
      expect(inputElm).toBeValid();
      expect($rootScope.value).toBe(1.23214124123412412e26);

      // #.###E-##
      $rootScope.form.alias.$setViewValue("1.23214124123412412E-26");
      expect(inputElm).toBeValid();
      expect($rootScope.value).toBe(1.23214124123412412e-26);

      // ####E+##
      $rootScope.form.alias.$setViewValue("123214124123412412E+26");
      expect(inputElm).toBeValid();
      expect($rootScope.value).toBe(123214124123412412e26);

      // ####E##
      $rootScope.form.alias.$setViewValue("123214124123412412E26");
      expect(inputElm).toBeValid();
      expect($rootScope.value).toBe(123214124123412412e26);

      // ####E-##
      $rootScope.form.alias.$setViewValue("123214124123412412E-26");
      expect(inputElm).toBeValid();
      expect($rootScope.value).toBe(123214124123412412e-26);
    });


    describe('min', function() {

      it('should validate', function() {
        var inputElm = helper.compileInput('<input type="number" ng-model="value" name="alias" min="10" />');

        helper.changeInputValueTo('1');
        expect(inputElm).toBeInvalid();
        expect($rootScope.value).toBeFalsy();
        expect($rootScope.form.alias.$error.min).toBeTruthy();

        helper.changeInputValueTo('100');
        expect(inputElm).toBeValid();
        expect($rootScope.value).toBe(100);
        expect($rootScope.form.alias.$error.min).toBeFalsy();
      });

      it('should validate even if min value changes on-the-fly', function() {
        $rootScope.min = undefined;
        var inputElm = helper.compileInput('<input type="number" ng-model="value" name="alias" min="{{min}}" />');
        expect(inputElm).toBeValid();

        helper.changeInputValueTo('15');
        expect(inputElm).toBeValid();

        $rootScope.min = 10;
        $rootScope.$digest();
        expect(inputElm).toBeValid();

        $rootScope.min = 20;
        $rootScope.$digest();
        expect(inputElm).toBeInvalid();

        $rootScope.min = null;
        $rootScope.$digest();
        expect(inputElm).toBeValid();

        $rootScope.min = '20';
        $rootScope.$digest();
        expect(inputElm).toBeInvalid();

        $rootScope.min = 'abc';
        $rootScope.$digest();
        expect(inputElm).toBeValid();
      });
    });

    describe('ngMin', function() {

      it('should validate', function() {
        var inputElm = helper.compileInput('<input type="number" ng-model="value" name="alias" ng-min="50" />');

        helper.changeInputValueTo('1');
        expect(inputElm).toBeInvalid();
        expect($rootScope.value).toBeFalsy();
        expect($rootScope.form.alias.$error.min).toBeTruthy();

        helper.changeInputValueTo('100');
        expect(inputElm).toBeValid();
        expect($rootScope.value).toBe(100);
        expect($rootScope.form.alias.$error.min).toBeFalsy();
      });

      it('should validate even if the ngMin value changes on-the-fly', function() {
        $rootScope.min = undefined;
        var inputElm = helper.compileInput('<input type="number" ng-model="value" name="alias" ng-min="min" />');
        expect(inputElm).toBeValid();

        helper.changeInputValueTo('15');
        expect(inputElm).toBeValid();

        $rootScope.min = 10;
        $rootScope.$digest();
        expect(inputElm).toBeValid();

        $rootScope.min = 20;
        $rootScope.$digest();
        expect(inputElm).toBeInvalid();

        $rootScope.min = null;
        $rootScope.$digest();
        expect(inputElm).toBeValid();

        $rootScope.min = '20';
        $rootScope.$digest();
        expect(inputElm).toBeInvalid();

        $rootScope.min = 'abc';
        $rootScope.$digest();
        expect(inputElm).toBeValid();
      });
    });


    describe('max', function() {

      it('should validate', function() {
        var inputElm = helper.compileInput('<input type="number" ng-model="value" name="alias" max="10" />');

        helper.changeInputValueTo('20');
        expect(inputElm).toBeInvalid();
        expect($rootScope.value).toBeUndefined();
        expect($rootScope.form.alias.$error.max).toBeTruthy();

        helper.changeInputValueTo('0');
        expect(inputElm).toBeValid();
        expect($rootScope.value).toBe(0);
        expect($rootScope.form.alias.$error.max).toBeFalsy();
      });

      it('should validate even if max value changes on-the-fly', function() {
        $rootScope.max = undefined;
        var inputElm = helper.compileInput('<input type="number" ng-model="value" name="alias" max="{{max}}" />');
        expect(inputElm).toBeValid();

        helper.changeInputValueTo('5');
        expect(inputElm).toBeValid();

        $rootScope.max = 10;
        $rootScope.$digest();
        expect(inputElm).toBeValid();

        $rootScope.max = 0;
        $rootScope.$digest();
        expect(inputElm).toBeInvalid();

        $rootScope.max = null;
        $rootScope.$digest();
        expect(inputElm).toBeValid();

        $rootScope.max = '4';
        $rootScope.$digest();
        expect(inputElm).toBeInvalid();

        $rootScope.max = 'abc';
        $rootScope.$digest();
        expect(inputElm).toBeValid();
      });
    });

    describe('ngMax', function() {

      it('should validate', function() {
        var inputElm = helper.compileInput('<input type="number" ng-model="value" name="alias" ng-max="5" />');

        helper.changeInputValueTo('20');
        expect(inputElm).toBeInvalid();
        expect($rootScope.value).toBeUndefined();
        expect($rootScope.form.alias.$error.max).toBeTruthy();

        helper.changeInputValueTo('0');
        expect(inputElm).toBeValid();
        expect($rootScope.value).toBe(0);
        expect($rootScope.form.alias.$error.max).toBeFalsy();
      });

      it('should validate even if the ngMax value changes on-the-fly', function() {
        $rootScope.max = undefined;
        var inputElm = helper.compileInput('<input type="number" ng-model="value" name="alias" ng-max="max" />');
        expect(inputElm).toBeValid();

        helper.changeInputValueTo('5');
        expect(inputElm).toBeValid();

        $rootScope.max = 10;
        $rootScope.$digest();
        expect(inputElm).toBeValid();

        $rootScope.max = 0;
        $rootScope.$digest();
        expect(inputElm).toBeInvalid();

        $rootScope.max = null;
        $rootScope.$digest();
        expect(inputElm).toBeValid();

        $rootScope.max = '4';
        $rootScope.$digest();
        expect(inputElm).toBeInvalid();

        $rootScope.max = 'abc';
        $rootScope.$digest();
        expect(inputElm).toBeValid();
      });
    });


    describe('required', function() {

      it('should be valid even if value is 0', function() {
        var inputElm = helper.compileInput('<input type="number" ng-model="value" name="alias" required />');

        helper.changeInputValueTo('0');
        expect(inputElm).toBeValid();
        expect($rootScope.value).toBe(0);
        expect($rootScope.form.alias.$error.required).toBeFalsy();
      });

      it('should be valid even if value 0 is set from model', function() {
        var inputElm = helper.compileInput('<input type="number" ng-model="value" name="alias" required />');

        $rootScope.$apply('value = 0');

        expect(inputElm).toBeValid();
        expect(inputElm.val()).toBe('0');
        expect($rootScope.form.alias.$error.required).toBeFalsy();
      });

      it('should register required on non boolean elements', function() {
        var inputElm = helper.compileInput('<div ng-model="value" name="alias" required>');

        $rootScope.$apply("value = ''");

        expect(inputElm).toBeInvalid();
        expect($rootScope.form.alias.$error.required).toBeTruthy();
      });

      it('should not invalidate number if ng-required=false and viewValue has not been committed', function() {
        var inputElm = helper.compileInput('<input type="number" ng-model="value" name="alias" ng-required="required">');

        $rootScope.$apply("required = false");

        expect(inputElm).toBeValid();
      });
    });

    describe('ngRequired', function() {

      describe('when the ngRequired expression initially evaluates to true', function() {

        it('should be valid even if value is 0', function() {
          var inputElm = helper.compileInput('<input type="number" ng-model="value" name="numberInput" ng-required="true" />');

          helper.changeInputValueTo('0');
          expect(inputElm).toBeValid();
          expect($rootScope.value).toBe(0);
          expect($rootScope.form.numberInput.$error.required).toBeFalsy();
        });

        it('should be valid even if value 0 is set from model', function() {
          var inputElm = helper.compileInput('<input type="number" ng-model="value" name="numberInput" ng-required="true" />');

          $rootScope.$apply('value = 0');

          expect(inputElm).toBeValid();
          expect(inputElm.val()).toBe('0');
          expect($rootScope.form.numberInput.$error.required).toBeFalsy();
        });

        it('should register required on non boolean elements', function() {
          var inputElm = helper.compileInput('<div ng-model="value" name="numberInput" ng-required="true">');

          $rootScope.$apply("value = ''");

          expect(inputElm).toBeInvalid();
          expect($rootScope.form.numberInput.$error.required).toBeTruthy();
        });

        it('should change from invalid to valid when the value is empty and the ngRequired expression changes to false', function() {
          var inputElm = helper.compileInput('<input type="number" ng-model="value" name="numberInput" ng-required="ngRequiredExpr" />');

          $rootScope.$apply('ngRequiredExpr = true');

          expect(inputElm).toBeInvalid();
          expect($rootScope.value).toBeUndefined();
          expect($rootScope.form.numberInput.$error.required).toBeTruthy();

          $rootScope.$apply('ngRequiredExpr = false');

          expect(inputElm).toBeValid();
          expect($rootScope.value).toBeUndefined();
          expect($rootScope.form.numberInput.$error.required).toBeFalsy();
        });
      });

      describe('when the ngRequired expression initially evaluates to false', function() {

        it('should be valid even if value is empty', function() {
          var inputElm = helper.compileInput('<input type="number" ng-model="value" name="numberInput" ng-required="false" />');

          expect(inputElm).toBeValid();
          expect($rootScope.value).toBeUndefined();
          expect($rootScope.form.numberInput.$error.required).toBeFalsy();
          expect($rootScope.form.numberInput.$error.number).toBeFalsy();
        });

        it('should be valid if value is non-empty', function() {
          var inputElm = helper.compileInput('<input type="number" ng-model="value" name="numberInput" ng-required="false" />');

          helper.changeInputValueTo('42');
          expect(inputElm).toBeValid();
          expect($rootScope.value).toBe(42);
          expect($rootScope.form.numberInput.$error.required).toBeFalsy();
        });

        it('should not register required on non boolean elements', function() {
          var inputElm = helper.compileInput('<div ng-model="value" name="numberInput" ng-required="false">');

          $rootScope.$apply("value = ''");

          expect(inputElm).toBeValid();
          expect($rootScope.form.numberInput.$error.required).toBeFalsy();
        });

        it('should change from valid to invalid when the value is empty and the ngRequired expression changes to true', function() {
          var inputElm = helper.compileInput('<input type="number" ng-model="value" name="numberInput" ng-required="ngRequiredExpr" />');

          $rootScope.$apply('ngRequiredExpr = false');

          expect(inputElm).toBeValid();
          expect($rootScope.value).toBeUndefined();
          expect($rootScope.form.numberInput.$error.required).toBeFalsy();

          $rootScope.$apply('ngRequiredExpr = true');

          expect(inputElm).toBeInvalid();
          expect($rootScope.value).toBeUndefined();
          expect($rootScope.form.numberInput.$error.required).toBeTruthy();
        });
      });
    });

    describe('minlength', function() {

      it('should invalidate values that are shorter than the given minlength', function() {
        var inputElm = helper.compileInput('<input type="number" ng-model="value" ng-minlength="3" />');

        helper.changeInputValueTo('12');
        expect(inputElm).toBeInvalid();

        helper.changeInputValueTo('123');
        expect(inputElm).toBeValid();
      });

      it('should listen on ng-minlength when minlength is observed', function() {
        var value = 0;
        var inputElm = helper.compileInput('<input type="number" ng-model="value" ng-minlength="min" attr-capture />');
        helper.attrs.$observe('minlength', function(v) {
          value = toInt(helper.attrs.minlength);
        });

        $rootScope.$apply(function() {
          $rootScope.min = 5;
        });

        expect(value).toBe(5);
      });

      it('should observe the standard minlength attribute and register it as a validator on the model', function() {
        var inputElm = helper.compileInput('<input type="number" name="input" ng-model="value" minlength="{{ min }}" />');
        $rootScope.$apply(function() {
          $rootScope.min = 10;
        });

        helper.changeInputValueTo('12345');
        expect(inputElm).toBeInvalid();
        expect($rootScope.form.input.$error.minlength).toBe(true);

        $rootScope.$apply(function() {
          $rootScope.min = 5;
        });

        expect(inputElm).toBeValid();
        expect($rootScope.form.input.$error.minlength).not.toBe(true);
      });
    });


    describe('maxlength', function() {

      it('should invalidate values that are longer than the given maxlength', function() {
        var inputElm = helper.compileInput('<input type="number" ng-model="value" ng-maxlength="5" />');

        helper.changeInputValueTo('12345678');
        expect(inputElm).toBeInvalid();

        helper.changeInputValueTo('123');
        expect(inputElm).toBeValid();
      });

      it('should listen on ng-maxlength when maxlength is observed', function() {
        var value = 0;
        var inputElm = helper.compileInput('<input type="number" ng-model="value" ng-maxlength="max" attr-capture />');
        helper.attrs.$observe('maxlength', function(v) {
          value = toInt(helper.attrs.maxlength);
        });

        $rootScope.$apply(function() {
          $rootScope.max = 10;
        });

        expect(value).toBe(10);
      });

      it('should observe the standard maxlength attribute and register it as a validator on the model', function() {
        var inputElm = helper.compileInput('<input type="number" name="input" ng-model="value" maxlength="{{ max }}" />');
        $rootScope.$apply(function() {
          $rootScope.max = 1;
        });

        helper.changeInputValueTo('12345');
        expect(inputElm).toBeInvalid();
        expect($rootScope.form.input.$error.maxlength).toBe(true);

        $rootScope.$apply(function() {
          $rootScope.max = 6;
        });

        expect(inputElm).toBeValid();
        expect($rootScope.form.input.$error.maxlength).not.toBe(true);
      });
    });
  });


  describe('email', function() {

    it('should validate e-mail', function() {
      var inputElm = helper.compileInput('<input type="email" ng-model="email" name="alias" />');

      var widget = $rootScope.form.alias;
      helper.changeInputValueTo('vojta@google.com');

      expect($rootScope.email).toBe('vojta@google.com');
      expect(inputElm).toBeValid();
      expect(widget.$error.email).toBeFalsy();

      helper.changeInputValueTo('invalid@');
      expect($rootScope.email).toBeUndefined();
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
      var inputElm = helper.compileInput('<input type="url" ng-model="url" name="alias" />');
      var widget = $rootScope.form.alias;

      helper.changeInputValueTo('http://www.something.com');
      expect($rootScope.url).toBe('http://www.something.com');
      expect(inputElm).toBeValid();
      expect(widget.$error.url).toBeFalsy();

      helper.changeInputValueTo('invalid.com');
      expect($rootScope.url).toBeUndefined();
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
      var inputElm = helper.compileInput(
          '<input type="radio" ng-model="color" value="white" />' +
          '<input type="radio" ng-model="color" value="red" />' +
          '<input type="radio" ng-model="color" value="blue" />');

      $rootScope.$apply("color = 'white'");
      expect(inputElm[0].checked).toBe(true);
      expect(inputElm[1].checked).toBe(false);
      expect(inputElm[2].checked).toBe(false);

      $rootScope.$apply("color = 'red'");
      expect(inputElm[0].checked).toBe(false);
      expect(inputElm[1].checked).toBe(true);
      expect(inputElm[2].checked).toBe(false);

      browserTrigger(inputElm[2], 'click');
      expect($rootScope.color).toBe('blue');
    });


    it('should allow {{expr}} as value', function() {
      $rootScope.some = 11;
      var inputElm = helper.compileInput(
          '<input type="radio" ng-model="value" value="{{some}}" />' +
          '<input type="radio" ng-model="value" value="{{other}}" />');

      $rootScope.$apply(function() {
        $rootScope.value = 'blue';
        $rootScope.some = 'blue';
        $rootScope.other = 'red';
      });

      expect(inputElm[0].checked).toBe(true);
      expect(inputElm[1].checked).toBe(false);

      browserTrigger(inputElm[1], 'click');
      expect($rootScope.value).toBe('red');

      $rootScope.$apply("other = 'non-red'");

      expect(inputElm[0].checked).toBe(false);
      expect(inputElm[1].checked).toBe(false);
    });
  });


  describe('checkbox', function() {

    it('should ignore checkbox without ngModel directive', function() {
      var inputElm = helper.compileInput('<input type="checkbox" name="whatever" required />');

      helper.changeInputValueTo('');
      expect(inputElm.hasClass('ng-valid')).toBe(false);
      expect(inputElm.hasClass('ng-invalid')).toBe(false);
      expect(inputElm.hasClass('ng-pristine')).toBe(false);
      expect(inputElm.hasClass('ng-dirty')).toBe(false);
    });


    it('should format booleans', function() {
      var inputElm = helper.compileInput('<input type="checkbox" ng-model="name" />');

      $rootScope.$apply("name = false");
      expect(inputElm[0].checked).toBe(false);

      $rootScope.$apply("name = true");
      expect(inputElm[0].checked).toBe(true);
    });


    it('should support type="checkbox" with non-standard capitalization', function() {
      var inputElm = helper.compileInput('<input type="checkBox" ng-model="checkbox" />');

      browserTrigger(inputElm, 'click');
      expect($rootScope.checkbox).toBe(true);

      browserTrigger(inputElm, 'click');
      expect($rootScope.checkbox).toBe(false);
    });


    it('should allow custom enumeration', function() {
      var inputElm = helper.compileInput('<input type="checkbox" ng-model="name" ng-true-value="\'y\'" ' +
          'ng-false-value="\'n\'">');

      $rootScope.$apply("name = 'y'");
      expect(inputElm[0].checked).toBe(true);

      $rootScope.$apply("name = 'n'");
      expect(inputElm[0].checked).toBe(false);

      $rootScope.$apply("name = 'something else'");
      expect(inputElm[0].checked).toBe(false);

      browserTrigger(inputElm, 'click');
      expect($rootScope.name).toEqual('y');

      browserTrigger(inputElm, 'click');
      expect($rootScope.name).toEqual('n');
    });


    it('should throw if ngTrueValue is present and not a constant expression', function() {
      expect(function() {
        var inputElm = helper.compileInput('<input type="checkbox" ng-model="value" ng-true-value="yes" />');
      }).toThrowMinErr('ngModel', 'constexpr', "Expected constant expression for `ngTrueValue`, but saw `yes`.");
    });


    it('should throw if ngFalseValue is present and not a constant expression', function() {
      expect(function() {
        var inputElm = helper.compileInput('<input type="checkbox" ng-model="value" ng-false-value="no" />');
      }).toThrowMinErr('ngModel', 'constexpr', "Expected constant expression for `ngFalseValue`, but saw `no`.");
    });


    it('should not throw if ngTrueValue or ngFalseValue are not present', function() {
      expect(function() {
        var inputElm = helper.compileInput('<input type="checkbox" ng-model="value" />');
      }).not.toThrow();
    });


    it('should be required if false', function() {
      var inputElm = helper.compileInput('<input type="checkbox" ng-model="value" required />');

      browserTrigger(inputElm, 'click');
      expect(inputElm[0].checked).toBe(true);
      expect(inputElm).toBeValid();

      browserTrigger(inputElm, 'click');
      expect(inputElm[0].checked).toBe(false);
      expect(inputElm).toBeInvalid();
    });


    it('should pass validation for "required" when trueValue is a string', function() {
      var inputElm = helper.compileInput('<input type="checkbox" required name="cb"' +
        'ng-model="value" ng-true-value="\'yes\'" />');

      expect(inputElm).toBeInvalid();
      expect($rootScope.form.cb.$error.required).toBe(true);

      browserTrigger(inputElm, 'click');
      expect(inputElm[0].checked).toBe(true);
      expect(inputElm).toBeValid();
      expect($rootScope.form.cb.$error.required).toBeUndefined();
    });
  });


  describe('textarea', function() {

    it("should process textarea", function() {
      var inputElm = helper.compileInput('<textarea ng-model="name"></textarea>');

      $rootScope.$apply("name = 'Adam'");
      expect(inputElm.val()).toEqual('Adam');

      helper.changeInputValueTo('Shyam');
      expect($rootScope.name).toEqual('Shyam');

      helper.changeInputValueTo('Kai');
      expect($rootScope.name).toEqual('Kai');
    });


    it('should ignore textarea without ngModel directive', function() {
      var inputElm = helper.compileInput('<textarea name="whatever" required></textarea>');

      helper.changeInputValueTo('');
      expect(inputElm.hasClass('ng-valid')).toBe(false);
      expect(inputElm.hasClass('ng-invalid')).toBe(false);
      expect(inputElm.hasClass('ng-pristine')).toBe(false);
      expect(inputElm.hasClass('ng-dirty')).toBe(false);
    });
  });


  describe('ngValue', function() {

    it('should update the dom "value" property and attribute', function() {
      var inputElm = helper.compileInput('<input type="submit" ng-value="value">');

      $rootScope.$apply("value = 'something'");

      expect(inputElm[0].value).toBe('something');
      expect(inputElm[0].getAttribute('value')).toBe('something');
    });


    it('should evaluate and set constant expressions', function() {
      var inputElm = helper.compileInput('<input type="radio" ng-model="selected" ng-value="true">' +
                   '<input type="radio" ng-model="selected" ng-value="false">' +
                   '<input type="radio" ng-model="selected" ng-value="1">');

      browserTrigger(inputElm[0], 'click');
      expect($rootScope.selected).toBe(true);

      browserTrigger(inputElm[1], 'click');
      expect($rootScope.selected).toBe(false);

      browserTrigger(inputElm[2], 'click');
      expect($rootScope.selected).toBe(1);
    });


    it('should watch the expression', function() {
      var inputElm = helper.compileInput('<input type="radio" ng-model="selected" ng-value="value">');

      $rootScope.$apply(function() {
        $rootScope.selected = $rootScope.value = {some: 'object'};
      });
      expect(inputElm[0].checked).toBe(true);

      $rootScope.$apply(function() {
        $rootScope.value = {some: 'other'};
      });
      expect(inputElm[0].checked).toBe(false);

      browserTrigger(inputElm, 'click');
      expect($rootScope.selected).toBe($rootScope.value);
    });


    it('should work inside ngRepeat', function() {
      helper.compileInput(
        '<input type="radio" ng-repeat="i in items" ng-model="$parent.selected" ng-value="i.id">');

      $rootScope.$apply(function() {
        $rootScope.items = [{id: 1}, {id: 2}];
        $rootScope.selected = 1;
      });

      var inputElms = helper.formElm.find('input');
      expect(inputElms[0].checked).toBe(true);
      expect(inputElms[1].checked).toBe(false);

      browserTrigger(inputElms.eq(1), 'click');
      expect($rootScope.selected).toBe(2);
    });


    it('should work inside ngRepeat with primitive values', function() {
      helper.compileInput(
        '<div ng-repeat="i in items">' +
          '<input type="radio" name="sel_{{i.id}}" ng-model="i.selected" ng-value="true">' +
          '<input type="radio" name="sel_{{i.id}}" ng-model="i.selected" ng-value="false">' +
        '</div>');

      $rootScope.$apply(function() {
        $rootScope.items = [{id: 1, selected: true}, {id: 2, selected: false}];
      });

      var inputElms = helper.formElm.find('input');
      expect(inputElms[0].checked).toBe(true);
      expect(inputElms[1].checked).toBe(false);
      expect(inputElms[2].checked).toBe(false);
      expect(inputElms[3].checked).toBe(true);

      browserTrigger(inputElms.eq(1), 'click');
      expect($rootScope.items[0].selected).toBe(false);
    });


    it('should work inside ngRepeat without name attribute', function() {
      helper.compileInput(
        '<div ng-repeat="i in items">' +
          '<input type="radio" ng-model="i.selected" ng-value="true">' +
          '<input type="radio" ng-model="i.selected" ng-value="false">' +
        '</div>');

      $rootScope.$apply(function() {
        $rootScope.items = [{id: 1, selected: true}, {id: 2, selected: false}];
      });

      var inputElms = helper.formElm.find('input');
      expect(inputElms[0].checked).toBe(true);
      expect(inputElms[1].checked).toBe(false);
      expect(inputElms[2].checked).toBe(false);
      expect(inputElms[3].checked).toBe(true);

      browserTrigger(inputElms.eq(1), 'click');
      expect($rootScope.items[0].selected).toBe(false);
    });
  });


  describe('password', function() {
    // Under no circumstances should input[type=password] trim inputs
    it('should not trim if ngTrim is unspecified', function() {
      var inputElm = helper.compileInput('<input type="password" ng-model="password">');
      helper.changeInputValueTo(' - - untrimmed - - ');
      expect($rootScope.password.length).toBe(' - - untrimmed - - '.length);
    });


    it('should not trim if ngTrim !== false', function() {
      var inputElm = helper.compileInput('<input type="password" ng-model="password" ng-trim="true">');
      helper.changeInputValueTo(' - - untrimmed - - ');
      expect($rootScope.password.length).toBe(' - - untrimmed - - '.length);
      dealoc(inputElm);
    });


    it('should not trim if ngTrim === false', function() {
      var inputElm = helper.compileInput('<input type="password" ng-model="password" ng-trim="false">');
      helper.changeInputValueTo(' - - untrimmed - - ');
      expect($rootScope.password.length).toBe(' - - untrimmed - - '.length);
      dealoc(inputElm);
    });
  });
});
