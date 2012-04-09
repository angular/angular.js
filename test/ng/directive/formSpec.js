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


  it('should remove the widget when element removed', function() {
    doc = $compile(
      '<form name="myForm">' +
        '<input type="text" name="alias" ng-model="value" store-model-ctrl/>' +
      '</form>')(scope);

    var form = scope.myForm;
    control.$setValidity('required', false);
    expect(form.alias).toBe(control);
    expect(form.$error.required).toEqual([control]);

    doc.find('input').remove();
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


  it('should prevent form submission', function() {
    var startingUrl = '' + window.location;
    doc = jqLite('<form name="myForm"><input type="submit" value="submit" />');
    $compile(doc)(scope);

    browserTrigger(doc.find('input'));
    waitsFor(
        function() { return true; },
        'let browser breath, so that the form submision can manifest itself', 10);

    runs(function() {
      expect('' + window.location).toEqual(startingUrl);
    });
  });


  it('should not prevent form submission if action attribute present', function() {
    var callback = jasmine.createSpy('submit').andCallFake(function(event) {
      expect(event.isDefaultPrevented()).toBe(false);
      event.preventDefault();
    });

    doc = $compile('<form name="x" action="some.py" />')(scope);
    doc.bind('submit', callback);

    browserTrigger(doc, 'submit');
    expect(callback).toHaveBeenCalledOnce();
  });


  it('should publish form to scope when name attr is defined', function() {
    doc = $compile('<form name="myForm"></form>')(scope);
    expect(scope.myForm).toBeTruthy();
    expect(doc.data('$formController')).toBeTruthy();
    expect(doc.data('$formController')).toEqual(scope.myForm);
  });


  it('should allow form name to be an expression', function() {
    doc = $compile('<form name="obj.myForm"></form>')(scope);

    expect(scope['obj.myForm']).toBeTruthy();
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


    it('should deregister a input when its removed from DOM', function() {
      doc = jqLite(
        '<form name="parent">' +
          '<div class="ng-form" name="child">' +
            '<input ng:model="modelA" name="inputA" required>' +
          '</div>' +
        '</form>');
      $compile(doc)(scope);
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
      doc.find('input').remove(); //remove child

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
  })


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
});
