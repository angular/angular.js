'use strict';

describe('event directives', function() {
  var element;


  afterEach(function() {
    dealoc(element);
  });


  describe('ngSubmit', function() {

    it('should get called on form submit', inject(function($rootScope, $compile) {
      element = $compile(
        '<form action="/foo" ng-submit="submitted = true">' +
          '<input type="submit" />' +
        '</form>')($rootScope);
      $rootScope.$digest();

      // Support: Chrome 60+
      // We need to add the form to the DOM in order for `submit` events to be properly fired.
      window.document.body.appendChild(element[0]);

      // prevent submit within the test harness
      element.on('submit', function(e) { e.preventDefault(); });

      expect($rootScope.submitted).toBeUndefined();

      browserTrigger(element.children()[0]);
      expect($rootScope.submitted).toEqual(true);
    }));

    it('should expose event on form submit', inject(function($rootScope, $compile) {
      $rootScope.formSubmission = function(e) {
        if (e) {
          $rootScope.formSubmitted = 'foo';
        }
      };

      element = $compile(
        '<form action="/foo" ng-submit="formSubmission($event)">' +
          '<input type="submit" />' +
        '</form>')($rootScope);
      $rootScope.$digest();

      // Support: Chrome 60+ (on Windows)
      // We need to add the form to the DOM in order for `submit` events to be properly fired.
      window.document.body.appendChild(element[0]);

      // prevent submit within the test harness
      element.on('submit', function(e) { e.preventDefault(); });

      expect($rootScope.formSubmitted).toBeUndefined();

      browserTrigger(element.children()[0]);
      expect($rootScope.formSubmitted).toEqual('foo');
    }));
  });

  describe('focus', function() {

    describe('call the listener asynchronously during $apply', function() {
      function run(scope) {
        inject(function($compile) {
          element = $compile('<input type="text" ng-focus="focus()">')(scope);
          scope.focus = jasmine.createSpy('focus');

          scope.$apply(function() {
            element.triggerHandler('focus');
            expect(scope.focus).not.toHaveBeenCalled();
          });

          expect(scope.focus).toHaveBeenCalledOnce();
        });
      }

      it('should call the listener with non isolate scopes', inject(function($rootScope) {
        run($rootScope.$new());
      }));

      it('should call the listener with isolate scopes', inject(function($rootScope) {
        run($rootScope.$new(true));
      }));

    });

    it('should call the listener synchronously inside of $apply if outside of $apply',
        inject(function($rootScope, $compile) {
      element = $compile('<input type="text" ng-focus="focus()" ng-model="value">')($rootScope);
      $rootScope.focus = jasmine.createSpy('focus').and.callFake(function() {
        $rootScope.value = 'newValue';
      });

      element.triggerHandler('focus');

      expect($rootScope.focus).toHaveBeenCalledOnce();
      expect(element.val()).toBe('newValue');
    }));

  });

  describe('DOM event object', function() {
    it('should allow access to the $event object', inject(function($rootScope, $compile) {
      var scope = $rootScope.$new();
      element = $compile('<button ng-click="e = $event">BTN</button>')(scope);
      element.triggerHandler('click');
      expect(scope.e.target).toBe(element[0]);
    }));
  });

  describe('blur', function() {

    describe('call the listener asynchronously during $apply', function() {
      function run(scope) {
        inject(function($compile) {
          element = $compile('<input type="text" ng-blur="blur()">')(scope);
          scope.blur = jasmine.createSpy('blur');

          scope.$apply(function() {
            element.triggerHandler('blur');
            expect(scope.blur).not.toHaveBeenCalled();
          });

          expect(scope.blur).toHaveBeenCalledOnce();
        });
      }

      it('should call the listener with non isolate scopes', inject(function($rootScope) {
        run($rootScope.$new());
      }));

      it('should call the listener with isolate scopes', inject(function($rootScope) {
        run($rootScope.$new(true));
      }));

    });

    it('should call the listener synchronously inside of $apply if outside of $apply',
        inject(function($rootScope, $compile) {
      element = $compile('<input type="text" ng-blur="blur()" ng-model="value">')($rootScope);
      $rootScope.blur = jasmine.createSpy('blur').and.callFake(function() {
        $rootScope.value = 'newValue';
      });

      element.triggerHandler('blur');

      expect($rootScope.blur).toHaveBeenCalledOnce();
      expect(element.val()).toBe('newValue');
    }));
  });


  it('should call the listener synchronously if the event is triggered inside of a digest',
      inject(function($rootScope, $compile) {
    var watchedVal;

    element = $compile('<button type="button" ng-click="click()">Button</button>')($rootScope);
    $rootScope.$watch('value', function(newValue) {
      watchedVal = newValue;
    });
    $rootScope.click = jasmine.createSpy('click').and.callFake(function() {
      $rootScope.value = 'newValue';
    });

    $rootScope.$apply(function() {
      element.triggerHandler('click');
    });

    expect($rootScope.click).toHaveBeenCalledOnce();
    expect(watchedVal).toEqual('newValue');
  }));


  it('should call the listener synchronously if the event is triggered outside of a digest',
      inject(function($rootScope, $compile) {
    var watchedVal;

    element = $compile('<button type="button" ng-click="click()">Button</button>')($rootScope);
    $rootScope.$watch('value', function(newValue) {
      watchedVal = newValue;
    });
    $rootScope.click = jasmine.createSpy('click').and.callFake(function() {
      $rootScope.value = 'newValue';
    });

    element.triggerHandler('click');

    expect($rootScope.click).toHaveBeenCalledOnce();
    expect(watchedVal).toEqual('newValue');
  }));


  describe('throwing errors in event handlers', function() {

    it('should not stop execution if the event is triggered outside a digest', function() {

      module(function($exceptionHandlerProvider) {
        $exceptionHandlerProvider.mode('log');
      });

      inject(function($rootScope, $compile, $exceptionHandler, $log) {

        element = $compile('<button ng-click="click()">Click</button>')($rootScope);
        expect($log.assertEmpty());
        $rootScope.click = function() {
          throw new Error('listener error');
        };

        $rootScope.do = function() {
          element.triggerHandler('click');
          $log.log('done');
        };

        $rootScope.do();

        expect($exceptionHandler.errors).toEqual([Error('listener error')]);
        expect($log.log.logs).toEqual([['done']]);
        $log.reset();
      });
    });


    it('should not stop execution if the event is triggered inside a digest', function() {

      module(function($exceptionHandlerProvider) {
        $exceptionHandlerProvider.mode('log');
      });

      inject(function($rootScope, $compile, $exceptionHandler, $log) {

        element = $compile('<button ng-click="click()">Click</button>')($rootScope);
        expect($log.assertEmpty());
        $rootScope.click = function() {
          throw new Error('listener error');
        };

        $rootScope.do = function() {
          element.triggerHandler('click');
          $log.log('done');
        };

        $rootScope.$apply(function() {
          $rootScope.do();
        });

        expect($exceptionHandler.errors).toEqual([Error('listener error')]);
        expect($log.log.logs).toEqual([['done']]);
        $log.reset();
      });
    });


    it('should not stop execution if the event is triggered in a watch expression function', function() {

      module(function($exceptionHandlerProvider) {
        $exceptionHandlerProvider.mode('log');
      });

      inject(function($rootScope, $compile, $exceptionHandler, $log) {

        element = $compile('<button ng-click="click()">Click</button>')($rootScope);
        $rootScope.click = function() {
          throw new Error('listener error');
        };

        $rootScope.$watch(function() {
          element.triggerHandler('click');
          $log.log('done');
        });

        $rootScope.$digest();

        expect($exceptionHandler.errors).toEqual([Error('listener error'), Error('listener error')]);
        expect($log.log.logs).toEqual([['done'], ['done']]);
        $log.reset();
      });
    });
  });
});
