'use strict';

describe('form', function() {
  var doc, widget, scope, $compile;

  beforeEach(module(function($compileProvider) {
    $compileProvider.directive('storeModelCtrl', function() {
      return {
        require: 'ngModel',
        link: function(scope, elm, attr, ctrl) {
          widget = ctrl;
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
    expect(doc.data('$form')).toBeTruthy();
    expect(doc.data('$form') instanceof FormController).toBe(true);
  });


  it('should remove the widget when element removed', function() {
    doc = $compile(
        '<form name="form">' +
          '<input type="text" name="alias" ng:model="value" store-model-ctrl/>' +
        '</form>')(scope);

    var form = scope.form;
    widget.setValidity('REQUIRED', false);
    expect(form.alias).toBe(widget);
    expect(form.error.REQUIRED).toEqual([widget]);

    doc.find('input').remove();
    expect(form.error.REQUIRED).toBeUndefined();
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


  it('should publish form to scope', function() {
    doc = $compile('<form name="myForm"></form>')(scope);
    expect(scope.myForm).toBeTruthy();
    expect(doc.data('$form')).toBeTruthy();
    expect(doc.data('$form')).toEqual(scope.myForm);
  });


  it('should allow name to be an expression', function() {
    doc = $compile('<form name="obj.myForm"></form>')(scope);

    expect(scope.obj).toBeDefined();
    expect(scope.obj.myForm).toBeTruthy();
  });


  it('should chain nested forms', function() {
    doc = jqLite(
        '<ng:form name="parent">' +
          '<ng:form name="child">' +
            '<input type="text" ng:model="text" name="text">' +
          '</ng:form>' +
        '</ng:form>');
    $compile(doc)(scope);

    var parent = scope.parent;
    var child = scope.child;
    var input = child.text;

    input.setValidity('MyError', false);
    expect(parent.error.MyError).toEqual([input]);
    expect(child.error.MyError).toEqual([input]);

    input.setValidity('MyError', true);
    expect(parent.error.MyError).toBeUndefined();
    expect(child.error.MyError).toBeUndefined();
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

    input.setValidity('myRule', false);
    expect(input.error.myRule).toEqual(true);
    expect(child.error.myRule).toEqual([input]);
    expect(parent.error.myRule).toEqual([input]);

    input.setValidity('myRule', true);
    expect(parent.error.myRule).toBeUndefined();
    expect(child.error.myRule).toBeUndefined();
  });


  it('should publish widgets', function() {
    doc = jqLite('<form name="form"><input type="text" name="w1" ng:model="some" /></form>');
    $compile(doc)(scope);

    var widget = scope.form.w1;
    expect(widget).toBeDefined();
    expect(widget.pristine).toBe(true);
    expect(widget.dirty).toBe(false);
    expect(widget.valid).toBe(true);
    expect(widget.invalid).toBe(false);
  });


  describe('validation', function() {

    beforeEach(function() {
      doc = $compile(
          '<form name="form">' +
            '<input type="text" ng:model="name" name="name" store-model-ctrl/>' +
          '</form>')(scope);

      scope.$digest();
    });


    it('should have ng-valid/ng-invalid css class', function() {
      expect(doc).toBeValid();

      widget.setValidity('ERROR', false);
      scope.$apply();
      expect(doc).toBeInvalid();

      widget.setValidity('ANOTHER', false);
      scope.$apply();

      widget.setValidity('ERROR', true);
      scope.$apply();
      expect(doc).toBeInvalid();

      widget.setValidity('ANOTHER', true);
      scope.$apply();
      expect(doc).toBeValid();
    });


    it('should have ng-pristine/ng-dirty css class', function() {
      expect(doc).toBePristine();

      widget.touch();
      scope.$apply();
      expect(doc).toBeDirty();
    });
  });
});
