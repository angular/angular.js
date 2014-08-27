'use strict';

describe('event directives', function() {
  var element;


  afterEach(function() {
    dealoc(element);
  });


  describe('ngSubmit', function() {

    it('should get called on form submit', inject(function($rootScope, $compile) {
      element = $compile('<form action="" ng-submit="submitted = true">' +
        '<input type="submit"/>' +
        '</form>')($rootScope);
      $rootScope.$digest();
      expect($rootScope.submitted).not.toBeDefined();

      browserTrigger(element.children()[0]);
      expect($rootScope.submitted).toEqual(true);
    }));

    it('should expose event on form submit', inject(function($rootScope, $compile) {
      $rootScope.formSubmission = function(e) {
        if (e) {
          $rootScope.formSubmitted = 'foo';
        }
      };

      element = $compile('<form action="" ng-submit="formSubmission($event)">' +
        '<input type="submit"/>' +
        '</form>')($rootScope);
      $rootScope.$digest();
      expect($rootScope.formSubmitted).not.toBeDefined();

      browserTrigger(element.children()[0]);
      expect($rootScope.formSubmitted).toEqual('foo');
    }));
  });

  describe('focus', function() {

    it('should call the listener asynchronously during $apply',
        inject(function($rootScope, $compile) {
      element = $compile('<input type="text" ng-focus="focus()">')($rootScope);
      $rootScope.focus = jasmine.createSpy('focus');

      $rootScope.$apply(function() {
        element.triggerHandler('focus');
        expect($rootScope.focus).not.toHaveBeenCalled();
      });

      expect($rootScope.focus).toHaveBeenCalledOnce();
    }));

    it('should call the listener synchronously inside of $apply if outside of $apply',
        inject(function($rootScope, $compile) {
      element = $compile('<input type="text" ng-focus="focus()" ng-model="value">')($rootScope);
      $rootScope.focus = jasmine.createSpy('focus').andCallFake(function() {
        $rootScope.value = 'newValue';
      });

      element.triggerHandler('focus');

      expect($rootScope.focus).toHaveBeenCalledOnce();
      expect(element.val()).toBe('newValue');
    }));

  });

  describe('blur', function() {

    it('should call the listener asynchronously during $apply',
        inject(function($rootScope, $compile) {
      element = $compile('<input type="text" ng-blur="blur()">')($rootScope);
      $rootScope.blur = jasmine.createSpy('blur');

      $rootScope.$apply(function() {
        element.triggerHandler('blur');
        expect($rootScope.blur).not.toHaveBeenCalled();
      });

      expect($rootScope.blur).toHaveBeenCalledOnce();
    }));

    it('should call the listener synchronously inside of $apply if outside of $apply',
        inject(function($rootScope, $compile) {
      element = $compile('<input type="text" ng-blur="blur()" ng-model="value">')($rootScope);
      $rootScope.blur = jasmine.createSpy('blur').andCallFake(function() {
        $rootScope.value = 'newValue';
      });

      element.triggerHandler('blur');

      expect($rootScope.blur).toHaveBeenCalledOnce();
      expect(element.val()).toBe('newValue');
    }));

  });
});
