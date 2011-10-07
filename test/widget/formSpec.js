'use strict';

describe('form', function() {
  var doc;

  afterEach(function() {
    dealoc(doc);
  });


  it('should attach form to DOM', function() {
    doc = angular.element('<form>');
    var scope = angular.compile(doc)();
    expect(doc.data('$form')).toBeTruthy();
  });


  it('should prevent form submission', function() {
    var startingUrl = '' + window.location;
    doc = angular.element('<form name="myForm"><input type=submit val=submit>');
    var scope = angular.compile(doc)();
    browserTrigger(doc.find('input'));
    waitsFor(
        function() { return true; },
        'let browser breath, so that the form submision can manifest itself', 10);
    runs(function() {
      expect('' + window.location).toEqual(startingUrl);
    });
  });


  it('should publish form to scope', function() {
    doc = angular.element('<form name="myForm">');
    var scope = angular.compile(doc)();
    expect(scope.myForm).toBeTruthy();
    expect(doc.data('$form')).toBeTruthy();
    expect(doc.data('$form')).toEqual(scope.myForm);
  });


  it('should have ng-valide/ng-invalid style', function() {
    doc = angular.element('<form name="myForm"><input type=text ng:model=text required>');
    var scope = angular.compile(doc)();
    scope.text = 'misko';
    scope.$digest();

    expect(doc.hasClass('ng-valid')).toBe(true);
    expect(doc.hasClass('ng-invalid')).toBe(false);

    scope.text = '';
    scope.$digest();
    expect(doc.hasClass('ng-valid')).toBe(false);
    expect(doc.hasClass('ng-invalid')).toBe(true);
  });


  it('should chain nested forms', function() {
    doc = angular.element('<ng:form name=parent><ng:form name=child><input type=text ng:model=text name=text>');
    var scope = angular.compile(doc)();
    var parent = scope.parent;
    var child = scope.child;
    var input = child.text;

    input.$emit('$invalid', 'MyError');
    expect(parent.$error.MyError).toEqual([input]);
    expect(child.$error.MyError).toEqual([input]);

    input.$emit('$valid', 'MyError');
    expect(parent.$error.MyError).toBeUndefined();
    expect(child.$error.MyError).toBeUndefined();
  });


  it('should chain nested forms in repeater', function() {
    doc = angular.element('<ng:form name=parent>' +
        '<ng:form ng:repeat="f in forms" name=child><input type=text ng:model=text name=text>');
    var scope = angular.compile(doc)();
    scope.forms = [1];
    scope.$digest();

    var parent = scope.parent;
    var child = doc.find('input').scope().child;
    var input = child.text;
    expect(parent).toBeDefined();
    expect(child).toBeDefined();
    expect(input).toBeDefined();

    input.$emit('$invalid', 'myRule');
    expect(input.$error.myRule).toEqual(true);
    expect(child.$error.myRule).toEqual([input]);
    expect(parent.$error.myRule).toEqual([input]);

    input.$emit('$valid', 'myRule');
    expect(parent.$error.myRule).toBeUndefined();
    expect(child.$error.myRule).toBeUndefined();
  });
});
