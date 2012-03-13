'use strict';

describe('form', function() {
  var doc, control, scope, $compile;

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

  beforeEach(inject(function($injector) {
    $compile = $injector.get('$compile');
    scope = $injector.get('$rootScope');
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
    expect(form.$error.required).toBeUndefined();
    expect(form.alias).toBeUndefined();
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

    expect(scope.obj).toBeDefined();
    expect(scope.obj.myForm).toBeTruthy();
  });


  it('should chain nested forms', function() {
    doc = jqLite(
        '<ng:form name="parent">' +
          '<ng:form name="child">' +
            '<input ng:model="modelA" name="inputA">' +
          '</ng:form>' +
        '</ng:form>');
    $compile(doc)(scope);

    var parent = scope.parent;
    var child = scope.child;
    var input = child.inputA;

    input.$setValidity('MyError', false);
    expect(parent.$error.MyError).toEqual([child]);
    expect(child.$error.MyError).toEqual([input]);

    input.$setValidity('MyError', true);
    expect(parent.$error.MyError).toBeUndefined();
    expect(child.$error.MyError).toBeUndefined();
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

    inputA.val('val1');
    browserTrigger(inputA, 'blur');
    inputB.val('val2');
    browserTrigger(inputB, 'blur');

    expect(scope.firstName).toBe('val1');
    expect(scope.lastName).toBe('val2');

    expect(scope.formA.$error.required).toBeUndefined();
    expect(scope.formB.$error.required).toBeUndefined();
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
    expect(parent.$error.myRule).toBeUndefined();
    expect(child.$error.myRule).toBeUndefined();
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

      control.$setValidity('ERROR', false);
      scope.$apply();
      expect(doc).toBeInvalid();

      control.$setValidity('ANOTHER', false);
      scope.$apply();

      control.$setValidity('ERROR', true);
      scope.$apply();
      expect(doc).toBeInvalid();

      control.$setValidity('ANOTHER', true);
      scope.$apply();
      expect(doc).toBeValid();
    });


    it('should have ng-pristine/ng-dirty css class', function() {
      expect(doc).toBePristine();

      control.$setViewValue('');
      scope.$apply();
      expect(doc).toBeDirty();
    });
  });
});
