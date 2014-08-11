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

    expect(form.$error.required).toBe(false);
    expect(form.alias).toBeUndefined();
  });


  it('should use ngForm value as form name', function() {
    doc = $compile(
      '<div ng-form="myForm">' +
        '<input type="text" name="alias" ng-model="value"/>' +
      '</div>')(scope);

    expect(scope.myForm).toBeDefined();
    expect(scope.myForm.alias).toBeDefined();
  });

  it('should use ngForm value as form name when nested inside form', function () {
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

    expect(scope.formA.$error.required).toBe(false);
    expect(scope.formB.$error.required).toBe(false);
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
      '<form name="form">'+
        '<input name="hasOwnProperty" ng-model="some" />'+
        '<input name="other" ng-model="someOther" />'+
      '</form>');
    expect(function() {
      $compile(doc)(scope);
    }).toThrowMinErr('ng', 'badname');
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

      // native dom event listeners in IE8 fire in LIFO order so we have to register them
      // there in different order than in other browsers
      if (msie==8) addEventListenerFn(doc[0], 'submit', assertPreventDefaultListener);

      $compile(doc)(scope);

      scope.submitMe = function() {
        submitted = true;
      };

      if (msie!=8) addEventListenerFn(doc[0], 'submit', assertPreventDefaultListener);

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

      // native dom event listeners in IE8 fire in LIFO order so we have to register them
      // there in different order than in other browsers
      if (msie == 8) addEventListenerFn(form[0], 'submit', assertPreventDefaultListener);

      $compile(doc)(scope);

      if (msie != 8) addEventListenerFn(form[0], 'submit', assertPreventDefaultListener);

      browserTrigger(doc.find('button'), 'click');

      // let the browser process all events (and potentially reload the page)
      setTimeout(function() { nextTurn = true;}, 100);

      waitsFor(function() { return nextTurn; });


      // I can't get IE8 to automatically trigger submit in this test, in production it does it
      // properly
      if (msie == 8) browserTrigger(form, 'submit');

      runs(function() {
        expect(doc.html()).toBe('');
        expect(destroyed).toBe(true);
        expect(submitted).toBe(false); // this is known corner-case that is not currently handled
                                       // the issue is that the submit listener is destroyed before
                                       // the event propagates there. we can fix this if we see
                                       // the issue in the wild, I'm not going to bother to do it
                                       // now. (i)

        // IE9 and IE10 are special and don't fire submit event when form was destroyed
        if (msie < 9) {
          expect(reloadPrevented).toBe(true);
          $timeout.flush();
        }

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
      expect(parent.$error.MyError).toBe(false);
      expect(child.$error.MyError).toBe(false);

      child.$setDirty();
      expect(parent.$dirty).toBeTruthy();
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
      expect(parent.$error.required).toBe(false);
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
      expect(parent.$error.required).toBe(false);
    });


    it('should deregister a input when it is removed from DOM', function() {
      doc = jqLite(
        '<form name="parent">' +
          '<div class="ng-form" name="child">' +
            '<input ng-if="inputPresent" ng-model="modelA" name="inputA" required>' +
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
      expect(child.$error.required).toEqual([input]);
      expect(doc.hasClass('ng-invalid')).toBe(true);
      expect(doc.hasClass('ng-invalid-required')).toBe(true);
      expect(doc.find('div').hasClass('ng-invalid')).toBe(true);
      expect(doc.find('div').hasClass('ng-invalid-required')).toBe(true);

      //remove child input
      scope.inputPresent = false;
      scope.$apply();

      expect(parent.$error.required).toBe(false);
      expect(child.$error.required).toBe(false);
      expect(doc.hasClass('ng-valid')).toBe(true);
      expect(doc.hasClass('ng-valid-required')).toBe(true);
      expect(doc.find('div').hasClass('ng-valid')).toBe(true);
      expect(doc.find('div').hasClass('ng-valid-required')).toBe(true);
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
      expect(parent.$error.myRule).toBe(false);
      expect(child.$error.myRule).toBe(false);
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
      expect(doc).toBeInvalid();
      expect(doc.hasClass('ng-valid-error')).toBe(false);
      expect(doc.hasClass('ng-invalid-error')).toBe(true);

      control.$setValidity('another', false);
      expect(doc.hasClass('ng-valid-error')).toBe(false);
      expect(doc.hasClass('ng-invalid-error')).toBe(true);
      expect(doc.hasClass('ng-valid-another')).toBe(false);
      expect(doc.hasClass('ng-invalid-another')).toBe(true);

      control.$setValidity('error', true);
      expect(doc).toBeInvalid();
      expect(doc.hasClass('ng-valid-error')).toBe(true);
      expect(doc.hasClass('ng-invalid-error')).toBe(false);
      expect(doc.hasClass('ng-valid-another')).toBe(false);
      expect(doc.hasClass('ng-invalid-another')).toBe(true);

      control.$setValidity('another', true);
      expect(doc).toBeValid();
      expect(doc.hasClass('ng-valid-error')).toBe(true);
      expect(doc.hasClass('ng-invalid-error')).toBe(false);
      expect(doc.hasClass('ng-valid-another')).toBe(true);
      expect(doc.hasClass('ng-invalid-another')).toBe(false);
    });


    it('should have ng-pristine/ng-dirty css class', function() {
      expect(doc).toBePristine();

      control.$setViewValue('');
      scope.$apply();
      expect(doc).toBeDirty();
    });
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
      expect(form).toBePristine();
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
});

describe('form animations', function() {
  beforeEach(module('ngAnimateMock'));

  function assertValidAnimation(animation, event, className) {
    expect(animation.event).toBe(event);
    expect(animation.args[1]).toBe(className);
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

    assertValidAnimation($animate.queue[0], 'setClass', 'ng-invalid', 'ng-valid');
    assertValidAnimation($animate.queue[1], 'setClass', 'ng-invalid-required', 'ng-valid-required');
  }));

  it('should trigger an animation when valid', inject(function($animate) {
    form.$setValidity('required', false);

    $animate.queue = [];

    form.$setValidity('required', true);

    assertValidAnimation($animate.queue[0], 'setClass', 'ng-valid', 'ng-invalid');
    assertValidAnimation($animate.queue[1], 'setClass', 'ng-valid-required', 'ng-invalid-required');
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

    assertValidAnimation($animate.queue[0], 'removeClass', 'ng-dirty');
    assertValidAnimation($animate.queue[1], 'addClass', 'ng-pristine');
  }));

  it('should trigger custom errors as addClass/removeClass when invalid/valid', inject(function($animate) {
    form.$setValidity('custom-error', false);

    assertValidAnimation($animate.queue[0], 'setClass', 'ng-invalid', 'ng-valid');
    assertValidAnimation($animate.queue[1], 'setClass', 'ng-invalid-custom-error', 'ng-valid-custom-error');

    $animate.queue = [];
    form.$setValidity('custom-error', true);

    assertValidAnimation($animate.queue[0], 'setClass', 'ng-valid', 'ng-invalid');
    assertValidAnimation($animate.queue[1], 'setClass', 'ng-valid-custom-error', 'ng-invalid-custom-error');
  }));
});
