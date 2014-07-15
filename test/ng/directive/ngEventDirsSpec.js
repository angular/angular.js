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

  describe('ngBlur', function() {
    it('should get called when ngKeydown triggers blur', inject(function($rootScope, $compile) {
      $rootScope.blur = function() {
        browserTrigger(element, 'blur');
      };

      element = $compile('<input type="text" ng-blur="blurred = true" ng-keydown="blur()" />')($rootScope);

      $rootScope.$digest();
      expect($rootScope.blurred).not.toBeDefined();

      browserTrigger(element, 'keydown');
      expect($rootScope.blurred).toEqual(true);
    }));
  });

  describe('ngFocus', function() {
    it('should get called when ngClick triggers focus', inject(function($rootScope, $compile) {
      $rootScope.focus = function() {
        browserTrigger(element.children()[0], 'focus');
      };

      element = $compile('<div><input type="text" ng-focus="focused = true" />' +
        '<button type="button" ng-click="focus()"></button></div>')($rootScope);

      $rootScope.$digest();
      expect($rootScope.focused).not.toBeDefined();

      browserTrigger(element.children()[1], 'click');
      expect($rootScope.focused).toEqual(true);
    }));
  });

});
