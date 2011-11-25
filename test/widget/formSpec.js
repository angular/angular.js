'use strict';

describe('form', function() {
  var doc;

  afterEach(function() {
    dealoc(doc);
  });


  it('should attach form to DOM', inject(function($rootScope, $compile) {
    doc = angular.element('<form>');
    $compile(doc)($rootScope);
    expect(doc.data('$form')).toBeTruthy();
  }));


  it('should prevent form submission', inject(function($rootScope, $compile) {
    var startingUrl = '' + window.location;
    doc = angular.element('<form name="myForm"><input type=submit val=submit>');
    $compile(doc)($rootScope);
    browserTrigger(doc.find('input'));
    waitsFor(
        function() { return true; },
        'let browser breath, so that the form submision can manifest itself', 10);
    runs(function() {
      expect('' + window.location).toEqual(startingUrl);
    });
  }));


  it('should not prevent form submission if action attribute present',
      inject(function($compile, $rootScope) {
    var callback = jasmine.createSpy('submit').andCallFake(function(event) {
      expect(event.isDefaultPrevented()).toBe(false);
      event.preventDefault();
    });

    doc = angular.element('<form name="x" action="some.py" />');
    $compile(doc)($rootScope);
    doc.bind('submit', callback);

    browserTrigger(doc, 'submit');
    expect(callback).toHaveBeenCalledOnce();
  }));


  it('should publish form to scope', inject(function($rootScope, $compile) {
    doc = angular.element('<form name="myForm"></form>');
    $compile(doc)($rootScope);
    expect($rootScope.myForm).toBeTruthy();
    expect(doc.data('$form')).toBeTruthy();
    expect(doc.data('$form')).toEqual($rootScope.myForm);
  }));


  it('should have ng-valide/ng-invalid style', inject(function($rootScope, $compile) {
    doc = angular.element('<form name="myForm"><input type=text ng:model=text required>');
    $compile(doc)($rootScope);
    $rootScope.text = 'misko';
    $rootScope.$digest();

    expect(doc.hasClass('ng-valid')).toBe(true);
    expect(doc.hasClass('ng-invalid')).toBe(false);

    $rootScope.text = '';
    $rootScope.$digest();
    expect(doc.hasClass('ng-valid')).toBe(false);
    expect(doc.hasClass('ng-invalid')).toBe(true);
  }));


  it('should chain nested forms', inject(function($rootScope, $compile) {
    doc = angular.element(
        '<ng:form name=parent>' +
          '<ng:form name=child>' +
            '<input type=text ng:model=text name=text>' +
          '</ng:form>' +
        '</ng:form>');
    $compile(doc)($rootScope);
    var parent = $rootScope.parent;
    var child = $rootScope.child;
    var input = child.text;

    input.$emit('$invalid', 'MyError');
    expect(parent.$error.MyError).toEqual([input]);
    expect(child.$error.MyError).toEqual([input]);

    input.$emit('$valid', 'MyError');
    expect(parent.$error.MyError).toBeUndefined();
    expect(child.$error.MyError).toBeUndefined();
  }));


  it('should chain nested forms in repeater', inject(function($rootScope, $compile) {
    doc = angular.element(
       '<ng:form name=parent>' +
        '<ng:form ng:repeat="f in forms" name=child>' +
          '<input type=text ng:model=text name=text>' +
         '</ng:form>' +
       '</ng:form>');
    $compile(doc)($rootScope);
    $rootScope.forms = [1];
    $rootScope.$digest();

    var parent = $rootScope.parent;
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
  }));
});
