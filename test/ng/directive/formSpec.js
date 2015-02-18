/* global FormController: false */
'use strict';

describe('form', function() {
  var doc, control, scope, $compile, changeInputValue;

  beforeEach(module(function($compileProvider) {
    $compileProvider.directive('storeModelCtrl', function() {
      return {
        require: 'ngModel',
        link: function(scope, elm, attr, ctrl) {
          control = ctrl;
        }
      };
    });
  }));

  beforeEach(inject(function($injector, $sniffer) {
    $compile = $injector.get('$compile');
    scope = $injector.get('$rootScope');

    changeInputValue = function(elm, value) {
      elm.val(value);
      browserTrigger(elm, $sniffer.hasEvent('input') ? 'input' : 'change');
    };
  }));

  afterEach(function() {
    dealoc(doc);
  });


  it('should instantiate form and attach it to DOM', function() {
    doc = $compile('<form>')(scope);
    expect(doc.data('$formController')).toBeTruthy();
    expect(doc.data('$formController') instanceof FormController).toBe(true);
  });


  it('should remove form control references from the form when nested control is removed from the DOM', function() {
    doc = $compile(
      '<form name="myForm">' +
        '<input ng-if="inputPresent" name="alias" ng-model="value" store-model-ctrl/>' +
      '</form>')(scope);
    scope.inputPresent = true;
    scope.$digest();

    var form = scope.myForm;
    control.$setValidity('required', false);
    expect(form.alias).toBe(control);
    expect(form.$error.required).toEqual([control]);

    // remove nested control
    scope.inputPresent = false;
    scope.$apply();

    expect(form.$error.required).toBeFalsy();
    expect(form.alias).toBeUndefined();
  });

  it('should remove scope reference when form with no parent form is removed from the DOM', function() {
    var formController;
    scope.ctrl = {};
    doc = $compile(
      '<div><form name="ctrl.myForm" ng-if="formPresent">' +
        '<input name="alias" ng-model="value" />' +
      '</form></div>')(scope);

    scope.$digest();
    expect(scope.ctrl.myForm).toBeUndefined();

    scope.$apply('formPresent = true');
    expect(scope.ctrl.myForm).toBeDefined();

    formController = doc.find('form').controller('form');
    expect(scope.ctrl.myForm).toBe(formController);

    scope.$apply('formPresent = false');
    expect(scope.ctrl.myForm).toBeUndefined();
  });

  it('should use ngForm value as form name', function() {
    doc = $compile(
      '<div ng-form="myForm">' +
        '<input type="text" name="alias" ng-model="value"/>' +
      '</div>')(scope);

    expect(scope.myForm).toBeDefined();
    expect(scope.myForm.alias).toBeDefined();
  });

  it('should use ngForm value as form name when nested inside form', function() {
    doc = $compile(
      '<form name="myForm">' +
        '<div ng-form="nestedForm"><input type="text" name="alias" ng-model="value"/></div>' +
      '</form>')(scope);

    expect(scope.myForm).toBeDefined();
    expect(scope.myForm.nestedForm).toBeDefined();
    expect(scope.myForm.nestedForm.alias).toBeDefined();
  });


  it('should publish form to scope when name attr is defined', function() {
    doc = $compile('<form name="myForm"></form>')(scope);
    expect(scope.myForm).toBeTruthy();
    expect(doc.data('$formController')).toBeTruthy();
    expect(doc.data('$formController')).toEqual(scope.myForm);
  });


  it('should support expression in form name', function() {
    doc = $compile('<form name="obj.myForm"></form>')(scope);

    expect(scope.obj).toBeDefined();
    expect(scope.obj.myForm).toBeTruthy();
  });


  it('should support two forms on a single scope', function() {
    doc = $compile(
      '<div>' +
        '<form name="formA">' +
          '<input name="firstName" ng-model="firstName" required>' +
        '</form>' +
        '<form name="formB">' +
          '<input name="lastName" ng-model="lastName" required>' +
        '</form>' +
      '</div>'
    )(scope);

    scope.$apply();

    expect(scope.formA.$error.required.length).toBe(1);
    expect(scope.formA.$error.required).toEqual([scope.formA.firstName]);
    expect(scope.formB.$error.required.length).toBe(1);
    expect(scope.formB.$error.required).toEqual([scope.formB.lastName]);

    var inputA = doc.find('input').eq(0),
        inputB = doc.find('input').eq(1);

    changeInputValue(inputA, 'val1');
    changeInputValue(inputB, 'val2');

    expect(scope.firstName).toBe('val1');
    expect(scope.lastName).toBe('val2');

    expect(scope.formA.$error.required).toBeFalsy();
    expect(scope.formB.$error.required).toBeFalsy();
  });


  it('should publish widgets', function() {
    doc = jqLite('<form name="form"><input type="text" name="w1" ng-model="some" /></form>');
    $compile(doc)(scope);

    var widget = scope.form.w1;
    expect(widget).toBeDefined();
    expect(widget.$pristine).toBe(true);
    expect(widget.$dirty).toBe(false);
    expect(widget.$valid).toBe(true);
    expect(widget.$invalid).toBe(false);
  });


  it('should throw an exception if an input has name="hasOwnProperty"', function() {
    doc = jqLite(
      '<form name="form">' +
        '<input name="hasOwnProperty" ng-model="some" />' +
        '<input name="other" ng-model="someOther" />' +
      '</form>');
    expect(function() {
      $compile(doc)(scope);
    }).toThrowMinErr('ng', 'badname');
  });

  describe('triggering commit value on submit', function() {
    it('should trigger update on form submit', function() {
      var form = $compile(
          '<form name="test" ng-model-options="{ updateOn: \'\' }" >' +
            '<input type="text" ng-model="name" />' +
          '</form>')(scope);
      scope.$digest();

      var inputElm = form.find('input').eq(0);
      changeInputValue(inputElm, 'a');
      expect(scope.name).toEqual(undefined);
      browserTrigger(form, 'submit');
      expect(scope.name).toEqual('a');
      dealoc(form);
    });

    it('should trigger update on form submit with nested forms', function() {
      var form = $compile(
          '<form name="test" ng-model-options="{ updateOn: \'\' }" >' +
            '<div class="ng-form" name="child">' +
              '<input type="text" ng-model="name" />' +
            '</div>' +
          '</form>')(scope);
      scope.$digest();

      var inputElm = form.find('input').eq(0);
      changeInputValue(inputElm, 'a');
      expect(scope.name).toEqual(undefined);
      browserTrigger(form, 'submit');
      expect(scope.name).toEqual('a');
      dealoc(form);
    });

    it('should trigger update before ng-submit is invoked', function() {
      var form = $compile(
          '<form name="test" ng-submit="submit()" ' +
              'ng-model-options="{ updateOn: \'\' }" >' +
            '<input type="text" ng-model="name" />' +
          '</form>')(scope);
      scope.$digest();

      var inputElm = form.find('input').eq(0);
      changeInputValue(inputElm, 'a');
      scope.submit = jasmine.createSpy('submit').andCallFake(function() {
        expect(scope.name).toEqual('a');
      });
      browserTrigger(form, 'submit');
      expect(scope.submit).toHaveBeenCalled();
      dealoc(form);
    });
  });

  describe('rollback view value', function() {
    it('should trigger rollback on form controls', function() {
      var form = $compile(
          '<form name="test" ng-model-options="{ updateOn: \'\' }" >' +
            '<input type="text" ng-model="name" />' +
            '<button ng-click="test.$rollbackViewValue()" />' +
          '</form>')(scope);
      scope.$digest();

      var inputElm = form.find('input').eq(0);
      changeInputValue(inputElm, 'a');
      expect(inputElm.val()).toBe('a');
      browserTrigger(form.find('button'), 'click');
      expect(inputElm.val()).toBe('');
      dealoc(form);
    });

    it('should trigger rollback on form controls with nested forms', function() {
      var form = $compile(
          '<form name="test" ng-model-options="{ updateOn: \'\' }" >' +
            '<div class="ng-form" name="child">' +
              '<input type="text" ng-model="name" />' +
            '</div>' +
            '<button ng-click="test.$rollbackViewValue()" />' +
          '</form>')(scope);
      scope.$digest();

      var inputElm = form.find('input').eq(0);
      changeInputValue(inputElm, 'a');
      expect(inputElm.val()).toBe('a');
      browserTrigger(form.find('button'), 'click');
      expect(inputElm.val()).toBe('');
      dealoc(form);
    });
  });

  describe('preventing default submission', function() {

    it('should prevent form submission', function() {
      var nextTurn = false,
          submitted = false,
          reloadPrevented;

      doc = jqLite('<form ng-submit="submitMe()">' +
                     '<input type="submit" value="submit">' +
                   '</form>');

      var assertPreventDefaultListener = function(e) {
        reloadPrevented = e.defaultPrevented || (e.returnValue === false);
      };

      $compile(doc)(scope);

      scope.submitMe = function() {
        submitted = true;
      };

      addEventListenerFn(doc[0], 'submit', assertPreventDefaultListener);

      browserTrigger(doc.find('input'));

      // let the browser process all events (and potentially reload the page)
      setTimeout(function() { nextTurn = true;});

      waitsFor(function() { return nextTurn; });

      runs(function() {
        expect(reloadPrevented).toBe(true);
        expect(submitted).toBe(true);

        // prevent mem leak in test
        removeEventListenerFn(doc[0], 'submit', assertPreventDefaultListener);
      });
    });


    it('should prevent the default when the form is destroyed by a submission via a click event',
        inject(function($timeout) {
      doc = jqLite('<div>' +
                      '<form ng-submit="submitMe()">' +
                        '<button ng-click="destroy()"></button>' +
                      '</form>' +
                    '</div>');

      var form = doc.find('form'),
          destroyed = false,
          nextTurn = false,
          submitted = false,
          reloadPrevented;

      scope.destroy = function() {
        // yes, I know, scope methods should not do direct DOM manipulation, but I wanted to keep
        // this test small. Imagine that the destroy action will cause a model change (e.g.
        // $location change) that will cause some directive to destroy the dom (e.g. ngView+$route)
        doc.empty();
        destroyed = true;
      };

      scope.submitMe = function() {
        submitted = true;
      };

      var assertPreventDefaultListener = function(e) {
        reloadPrevented = e.defaultPrevented || (e.returnValue === false);
      };

      $compile(doc)(scope);

      addEventListenerFn(form[0], 'submit', assertPreventDefaultListener);

      browserTrigger(doc.find('button'), 'click');

      // let the browser process all events (and potentially reload the page)
      setTimeout(function() { nextTurn = true;}, 100);

      waitsFor(function() { return nextTurn; });

      runs(function() {
        expect(doc.html()).toBe('');
        expect(destroyed).toBe(true);
        expect(submitted).toBe(false); // this is known corner-case that is not currently handled
                                       // the issue is that the submit listener is destroyed before
                                       // the event propagates there. we can fix this if we see
                                       // the issue in the wild, I'm not going to bother to do it
                                       // now. (i)

        // prevent mem leak in test
        removeEventListenerFn(form[0], 'submit', assertPreventDefaultListener);
      });
    }));


    it('should NOT prevent form submission if action attribute present', function() {
      var callback = jasmine.createSpy('submit').andCallFake(function(event) {
        expect(event.isDefaultPrevented()).toBe(false);
        event.preventDefault();
      });

      doc = $compile('<form action="some.py"></form>')(scope);
      doc.on('submit', callback);

      browserTrigger(doc, 'submit');
      expect(callback).toHaveBeenCalledOnce();
    });
  });


  describe('nested forms', function() {

    it('should chain nested forms', function() {
      doc = jqLite(
          '<ng:form name="parent">' +
            '<ng:form name="child">' +
              '<input ng:model="modelA" name="inputA">' +
              '<input ng:model="modelB" name="inputB">' +
            '</ng:form>' +
          '</ng:form>');
      $compile(doc)(scope);

      var parent = scope.parent,
          child = scope.child,
          inputA = child.inputA,
          inputB = child.inputB;

      inputA.$setValidity('MyError', false);
      inputB.$setValidity('MyError', false);
      expect(parent.$error.MyError).toEqual([child]);
      expect(child.$error.MyError).toEqual([inputA, inputB]);

      inputA.$setValidity('MyError', true);
      expect(parent.$error.MyError).toEqual([child]);
      expect(child.$error.MyError).toEqual([inputB]);

      inputB.$setValidity('MyError', true);
      expect(parent.$error.MyError).toBeFalsy();
      expect(child.$error.MyError).toBeFalsy();

      child.$setDirty();
      expect(parent.$dirty).toBeTruthy();

      child.$setSubmitted();
      expect(parent.$submitted).toBeTruthy();
    });


    it('should deregister a child form when its DOM is removed', function() {
      doc = jqLite(
        '<form name="parent">' +
          '<div class="ng-form" name="child">' +
          '<input ng:model="modelA" name="inputA" required>' +
          '</div>' +
          '</form>');
      $compile(doc)(scope);
      scope.$apply();

      var parent = scope.parent,
        child = scope.child;

      expect(parent).toBeDefined();
      expect(child).toBeDefined();
      expect(parent.$error.required).toEqual([child]);
      doc.children().remove(); //remove child

      expect(parent.child).toBeUndefined();
      expect(scope.child).toBeUndefined();
      expect(parent.$error.required).toBeFalsy();
    });


    it('should deregister a child form whose name is an expression when its DOM is removed', function() {
      doc = jqLite(
        '<form name="parent">' +
          '<div class="ng-form" name="child.form">' +
          '<input ng:model="modelA" name="inputA" required>' +
          '</div>' +
          '</form>');
      $compile(doc)(scope);
      scope.$apply();

      var parent = scope.parent,
        child = scope.child.form;

      expect(parent).toBeDefined();
      expect(child).toBeDefined();
      expect(parent.$error.required).toEqual([child]);
      doc.children().remove(); //remove child

      expect(parent.child).toBeUndefined();
      expect(scope.child.form).toBeUndefined();
      expect(parent.$error.required).toBeFalsy();
    });


    it('should deregister a input when it is removed from DOM', function() {
      doc = jqLite(
        '<form name="parent">' +
          '<div class="ng-form" name="child">' +
            '<input ng-if="inputPresent" ng-model="modelA" name="inputA" required maxlength="10">' +
          '</div>' +
        '</form>');
      $compile(doc)(scope);
      scope.inputPresent = true;
      scope.$apply();

      var parent = scope.parent,
          child = scope.child,
          input = child.inputA;

      expect(parent).toBeDefined();
      expect(child).toBeDefined();

      expect(parent.$error.required).toEqual([child]);
      expect(parent.$$success.maxlength).toEqual([child]);

      expect(child.$error.required).toEqual([input]);
      expect(child.$$success.maxlength).toEqual([input]);

      expect(doc.hasClass('ng-invalid')).toBe(true);
      expect(doc.hasClass('ng-invalid-required')).toBe(true);
      expect(doc.hasClass('ng-valid-maxlength')).toBe(true);
      expect(doc.find('div').hasClass('ng-invalid')).toBe(true);
      expect(doc.find('div').hasClass('ng-invalid-required')).toBe(true);
      expect(doc.find('div').hasClass('ng-valid-maxlength')).toBe(true);

      //remove child input
      scope.$apply('inputPresent = false');

      expect(parent.$error.required).toBeFalsy();
      expect(parent.$$success.maxlength).toBeFalsy();

      expect(child.$error.required).toBeFalsy();
      expect(child.$$success.maxlength).toBeFalsy();

      expect(doc.hasClass('ng-valid')).toBe(true);
      expect(doc.hasClass('ng-valid-required')).toBe(false);
      expect(doc.hasClass('ng-invalid-required')).toBe(false);
      expect(doc.hasClass('ng-valid-maxlength')).toBe(false);
      expect(doc.hasClass('ng-invalid-maxlength')).toBe(false);

      expect(doc.find('div').hasClass('ng-valid')).toBe(true);
      expect(doc.find('div').hasClass('ng-valid-required')).toBe(false);
      expect(doc.find('div').hasClass('ng-invalid-required')).toBe(false);
      expect(doc.find('div').hasClass('ng-valid-maxlength')).toBe(false);
      expect(doc.find('div').hasClass('ng-invalid-maxlength')).toBe(false);
    });

    it('should deregister a input that is $pending when it is removed from DOM', function() {
      doc = jqLite(
        '<form name="parent">' +
          '<div class="ng-form" name="child">' +
            '<input ng-if="inputPresent" ng-model="modelA" name="inputA">' +
          '</div>' +
        '</form>');
      $compile(doc)(scope);
      scope.$apply('inputPresent = true');

      var parent = scope.parent;
      var child = scope.child;
      var input = child.inputA;

      scope.$apply(child.inputA.$setValidity('fake', undefined));

      expect(parent).toBeDefined();
      expect(child).toBeDefined();

      expect(parent.$pending.fake).toEqual([child]);
      expect(child.$pending.fake).toEqual([input]);

      expect(doc.hasClass('ng-pending')).toBe(true);
      expect(doc.find('div').hasClass('ng-pending')).toBe(true);

      //remove child input
      scope.$apply('inputPresent = false');

      expect(parent.$pending).toBeUndefined();
      expect(child.$pending).toBeUndefined();

      expect(doc.hasClass('ng-pending')).toBe(false);
      expect(doc.find('div').hasClass('ng-pending')).toBe(false);
    });

  it('should leave the parent form invalid when deregister a removed input', function() {
    doc = jqLite(
      '<form name="parent">' +
        '<div class="ng-form" name="child">' +
          '<input ng-if="inputPresent" ng-model="modelA" name="inputA" required>' +
          '<input ng-model="modelB" name="inputB" required>' +
        '</div>' +
      '</form>');
    $compile(doc)(scope);
    scope.inputPresent = true;
    scope.$apply();

    var parent = scope.parent,
        child = scope.child,
        inputA = child.inputA,
        inputB = child.inputB;

    expect(parent).toBeDefined();
    expect(child).toBeDefined();
    expect(parent.$error.required).toEqual([child]);
    expect(child.$error.required).toEqual([inputB, inputA]);

    //remove child input
    scope.inputPresent = false;
    scope.$apply();

    expect(parent.$error.required).toEqual([child]);
    expect(child.$error.required).toEqual([inputB]);
  });

    it('should chain nested forms in repeater', function() {
      doc = jqLite(
         '<ng:form name=parent>' +
          '<ng:form ng:repeat="f in forms" name=child>' +
            '<input type=text ng:model=text name=text>' +
           '</ng:form>' +
         '</ng:form>');
      $compile(doc)(scope);

      scope.$apply(function() {
        scope.forms = [1];
      });

      var parent = scope.parent;
      var child = doc.find('input').scope().child;
      var input = child.text;

      expect(parent).toBeDefined();
      expect(child).toBeDefined();
      expect(input).toBeDefined();

      input.$setValidity('myRule', false);
      expect(input.$error.myRule).toEqual(true);
      expect(child.$error.myRule).toEqual([input]);
      expect(parent.$error.myRule).toEqual([child]);

      input.$setValidity('myRule', true);
      expect(parent.$error.myRule).toBeFalsy();
      expect(child.$error.myRule).toBeFalsy();
    });
  });


  describe('validation', function() {

    beforeEach(function() {
      doc = $compile(
          '<form name="form">' +
            '<input ng-model="name" name="name" store-model-ctrl/>' +
          '</form>')(scope);

      scope.$digest();
    });


    it('should have ng-valid/ng-invalid css class', function() {
      expect(doc).toBeValid();

      control.$setValidity('error', false);
      scope.$digest();
      expect(doc).toBeInvalid();
      expect(doc.hasClass('ng-valid-error')).toBe(false);
      expect(doc.hasClass('ng-invalid-error')).toBe(true);

      control.$setValidity('another', false);
      scope.$digest();
      expect(doc.hasClass('ng-valid-error')).toBe(false);
      expect(doc.hasClass('ng-invalid-error')).toBe(true);
      expect(doc.hasClass('ng-valid-another')).toBe(false);
      expect(doc.hasClass('ng-invalid-another')).toBe(true);

      control.$setValidity('error', true);
      scope.$digest();
      expect(doc).toBeInvalid();
      expect(doc.hasClass('ng-valid-error')).toBe(true);
      expect(doc.hasClass('ng-invalid-error')).toBe(false);
      expect(doc.hasClass('ng-valid-another')).toBe(false);
      expect(doc.hasClass('ng-invalid-another')).toBe(true);

      control.$setValidity('another', true);
      scope.$digest();
      expect(doc).toBeValid();
      expect(doc.hasClass('ng-valid-error')).toBe(true);
      expect(doc.hasClass('ng-invalid-error')).toBe(false);
      expect(doc.hasClass('ng-valid-another')).toBe(true);
      expect(doc.hasClass('ng-invalid-another')).toBe(false);

      // validators are skipped, e.g. becuase of a parser error
      control.$setValidity('error', null);
      control.$setValidity('another', null);
      scope.$digest();
      expect(doc.hasClass('ng-valid-error')).toBe(false);
      expect(doc.hasClass('ng-invalid-error')).toBe(false);
      expect(doc.hasClass('ng-valid-another')).toBe(false);
      expect(doc.hasClass('ng-invalid-another')).toBe(false);
    });

    it('should have ng-pristine/ng-dirty css class', function() {
      expect(doc).toBePristine();

      control.$setViewValue('');
      scope.$apply();
      expect(doc).toBeDirty();
    });
  });

  describe('$pending', function() {
    beforeEach(function() {
      doc = $compile('<form name="form"></form>')(scope);
      scope.$digest();
    });

    it('should set valid and invalid to undefined when a validation error state is set as pending', inject(function($q, $rootScope) {
      var defer, form = doc.data('$formController');

      var ctrl = {};
      form.$setValidity('matias', undefined, ctrl);

      expect(form.$valid).toBeUndefined();
      expect(form.$invalid).toBeUndefined();
      expect(form.$pending.matias).toEqual([ctrl]);

      form.$setValidity('matias', true, ctrl);

      expect(form.$valid).toBe(true);
      expect(form.$invalid).toBe(false);
      expect(form.$pending).toBeUndefined();

      form.$setValidity('matias', false, ctrl);

      expect(form.$valid).toBe(false);
      expect(form.$invalid).toBe(true);
      expect(form.$pending).toBeUndefined();
    }));
  });

  describe('$setPristine', function() {

    it('should reset pristine state of form and controls', function() {

      doc = $compile(
          '<form name="testForm">' +
            '<input ng-model="named1" name="foo">' +
            '<input ng-model="named2" name="bar">' +
          '</form>')(scope);

      scope.$digest();

      var form = doc,
          formCtrl = scope.testForm,
          input1 = form.find('input').eq(0),
          input1Ctrl = input1.controller('ngModel'),
          input2 = form.find('input').eq(1),
          input2Ctrl = input2.controller('ngModel');

      input1Ctrl.$setViewValue('xx');
      input2Ctrl.$setViewValue('yy');
      scope.$apply();
      expect(form).toBeDirty();
      expect(input1).toBeDirty();
      expect(input2).toBeDirty();


      formCtrl.$setPristine();
      scope.$digest();
      expect(form).toBePristine();
      expect(formCtrl.$pristine).toBe(true);
      expect(formCtrl.$dirty).toBe(false);
      expect(input1).toBePristine();
      expect(input1Ctrl.$pristine).toBe(true);
      expect(input1Ctrl.$dirty).toBe(false);
      expect(input2).toBePristine();
      expect(input2Ctrl.$pristine).toBe(true);
      expect(input2Ctrl.$dirty).toBe(false);
    });


    it('should reset pristine state of anonymous form controls', function() {

      doc = $compile(
          '<form name="testForm">' +
            '<input ng-model="anonymous">' +
          '</form>')(scope);

      scope.$digest();

      var form = doc,
          formCtrl = scope.testForm,
          input = form.find('input').eq(0),
          inputCtrl = input.controller('ngModel');

      inputCtrl.$setViewValue('xx');
      scope.$apply();
      expect(form).toBeDirty();
      expect(input).toBeDirty();

      formCtrl.$setPristine();
      scope.$digest();
      expect(form).toBePristine();
      expect(formCtrl.$pristine).toBe(true);
      expect(formCtrl.$dirty).toBe(false);
      expect(input).toBePristine();
      expect(inputCtrl.$pristine).toBe(true);
      expect(inputCtrl.$dirty).toBe(false);
    });


    it('should reset pristine state of nested forms', function() {

      doc = $compile(
          '<form name="testForm">' +
            '<div ng-form>' +
              '<input ng-model="named" name="foo">' +
            '</div>' +
          '</form>')(scope);

      scope.$digest();

      var form = doc,
          formCtrl = scope.testForm,
          nestedForm = form.find('div'),
          nestedFormCtrl = nestedForm.controller('form'),
          nestedInput = form.find('input').eq(0),
          nestedInputCtrl = nestedInput.controller('ngModel');

      nestedInputCtrl.$setViewValue('xx');
      scope.$apply();
      expect(form).toBeDirty();
      expect(nestedForm).toBeDirty();
      expect(nestedInput).toBeDirty();

      formCtrl.$setPristine();
      scope.$digest();
      expect(form).toBePristine();
      scope.$digest();
      expect(formCtrl.$pristine).toBe(true);
      expect(formCtrl.$dirty).toBe(false);
      expect(nestedForm).toBePristine();
      expect(nestedFormCtrl.$pristine).toBe(true);
      expect(nestedFormCtrl.$dirty).toBe(false);
      expect(nestedInput).toBePristine();
      expect(nestedInputCtrl.$pristine).toBe(true);
      expect(nestedInputCtrl.$dirty).toBe(false);
    });
  });

  describe('$setUntouched', function() {
    it('should trigger setUntouched on form controls', function() {
      var form = $compile(
          '<form name="myForm">' +
            '<input name="alias" type="text" ng-model="name" />' +
          '</form>')(scope);
      scope.$digest();

      scope.myForm.alias.$setTouched();
      expect(scope.myForm.alias.$touched).toBe(true);
      scope.myForm.$setUntouched();
      expect(scope.myForm.alias.$touched).toBe(false);
      dealoc(form);
    });

    it('should trigger setUntouched on form controls with nested forms', function() {
      var form = $compile(
          '<form name="myForm">' +
            '<div class="ng-form" name="childForm">' +
              '<input name="alias" type="text" ng-model="name" />' +
            '</div>' +
          '</form>')(scope);
      scope.$digest();

      scope.myForm.childForm.alias.$setTouched();
      expect(scope.myForm.childForm.alias.$touched).toBe(true);
      scope.myForm.$setUntouched();
      expect(scope.myForm.childForm.alias.$touched).toBe(false);
      dealoc(form);
    });
  });


  it('should rename nested form controls when interpolated name changes', function() {
    scope.idA = 'A';
    scope.idB = 'X';

    doc = $compile(
      '<form name="form">' +
        '<div ng-form="nested{{idA}}">' +
          '<div ng-form name="nested{{idB}}"' +
          '</div>' +
        '</div>' +
      '</form'
    )(scope);

    scope.$digest();
    var formA = scope.form.nestedA;
    expect(formA).toBeDefined();
    expect(formA.$name).toBe('nestedA');

    var formX = formA.nestedX;
    expect(formX).toBeDefined();
    expect(formX.$name).toBe('nestedX');

    scope.idA = 'B';
    scope.idB = 'Y';
    scope.$digest();

    expect(scope.form.nestedA).toBeUndefined();
    expect(scope.form.nestedB).toBe(formA);
    expect(formA.nestedX).toBeUndefined();
    expect(formA.nestedY).toBe(formX);
  });


  it('should rename forms with no parent when interpolated name changes', function() {
    var element = $compile('<form name="name{{nameID}}"></form>')(scope);
    var element2 = $compile('<div ng-form="ngform{{nameID}}"></div>')(scope);
    scope.nameID = "A";
    scope.$digest();
    var form = element.controller('form');
    var form2 = element2.controller('form');
    expect(scope.nameA).toBe(form);
    expect(scope.ngformA).toBe(form2);
    expect(form.$name).toBe('nameA');
    expect(form2.$name).toBe('ngformA');

    scope.nameID = "B";
    scope.$digest();
    expect(scope.nameA).toBeUndefined();
    expect(scope.ngformA).toBeUndefined();
    expect(scope.nameB).toBe(form);
    expect(scope.ngformB).toBe(form2);
    expect(form.$name).toBe('nameB');
    expect(form2.$name).toBe('ngformB');
  });

  it('should rename forms with an initially blank name', function() {
    var element = $compile('<form name="{{name}}"></form>')(scope);
    scope.$digest();
    var form = element.controller('form');
    expect(scope['']).toBe(form);
    expect(form.$name).toBe('');
    scope.name = 'foo';
    scope.$digest();
    expect(scope.foo).toBe(form);
    expect(form.$name).toBe('foo');
    expect(scope.foo).toBe(form);
  });

  describe('$setSubmitted', function() {
    beforeEach(function() {
      doc = $compile(
          '<form name="form" ng-submit="submitted = true">' +
            '<input type="text" ng-model="name" required />' +
            '<input type="submit" />' +
          '</form>')(scope);

      scope.$digest();
    });

    it('should not init in submitted state', function() {
      expect(scope.form.$submitted).toBe(false);
    });

    it('should be in submitted state when submitted', function() {
      browserTrigger(doc, 'submit');
      expect(scope.form.$submitted).toBe(true);
    });

    it('should revert submitted back to false when $setPristine is called on the form', function() {
      scope.form.$submitted = true;
      scope.form.$setPristine();
      expect(scope.form.$submitted).toBe(false);
    });
  });
});

describe('form animations', function() {
  beforeEach(module('ngAnimateMock'));

  function assertValidAnimation(animation, event, classNameAdded, classNameRemoved) {
    expect(animation.event).toBe(event);
    expect(animation.args[1]).toBe(classNameAdded);
    expect(animation.args[2]).toBe(classNameRemoved);
  }

  var doc, scope, form;
  beforeEach(inject(function($rootScope, $compile, $rootElement, $animate) {
    scope = $rootScope.$new();
    doc = jqLite('<form name="myForm"></form>');
    $rootElement.append(doc);
    $compile(doc)(scope);
    $animate.queue = [];
    form = scope.myForm;
  }));

  afterEach(function() {
    dealoc(doc);
  });

  it('should trigger an animation when invalid', inject(function($animate) {
    form.$setValidity('required', false);

    assertValidAnimation($animate.queue[0], 'removeClass', 'ng-valid');
    assertValidAnimation($animate.queue[1], 'addClass', 'ng-invalid');
    assertValidAnimation($animate.queue[2], 'addClass', 'ng-invalid-required');
  }));

  it('should trigger an animation when valid', inject(function($animate) {
    form.$setValidity('required', false);

    $animate.queue = [];

    form.$setValidity('required', true);

    assertValidAnimation($animate.queue[0], 'addClass', 'ng-valid');
    assertValidAnimation($animate.queue[1], 'removeClass', 'ng-invalid');
    assertValidAnimation($animate.queue[2], 'addClass', 'ng-valid-required');
  }));

  it('should trigger an animation when dirty', inject(function($animate) {
    form.$setDirty();

    assertValidAnimation($animate.queue[0], 'removeClass', 'ng-pristine');
    assertValidAnimation($animate.queue[1], 'addClass', 'ng-dirty');
  }));

  it('should trigger an animation when pristine', inject(function($animate) {
    form.$setDirty();

    $animate.queue = [];

    form.$setPristine();

    assertValidAnimation($animate.queue[0], 'setClass', 'ng-pristine', 'ng-dirty ng-submitted');
  }));

  it('should trigger custom errors as addClass/removeClass when invalid/valid', inject(function($animate) {
    form.$setValidity('custom-error', false);

    assertValidAnimation($animate.queue[0], 'removeClass', 'ng-valid');
    assertValidAnimation($animate.queue[1], 'addClass', 'ng-invalid');
    assertValidAnimation($animate.queue[2], 'addClass', 'ng-invalid-custom-error');

    $animate.queue = [];
    form.$setValidity('custom-error', true);

    assertValidAnimation($animate.queue[0], 'addClass', 'ng-valid');
    assertValidAnimation($animate.queue[1], 'removeClass', 'ng-invalid');
    assertValidAnimation($animate.queue[2], 'addClass', 'ng-valid-custom-error');
    assertValidAnimation($animate.queue[3], 'removeClass', 'ng-invalid-custom-error');
  }));
});
