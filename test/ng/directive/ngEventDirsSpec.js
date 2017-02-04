'use strict';

describe('event directives', function() {
  var element;


  afterEach(function() {
    dealoc(element);
  });


  describe('ngSubmit', function() {

    it('should get called on form submit', inject(function($rootScope, $compile) {
      element = $compile('<form action="/foo" ng-submit="submitted = true">' +
        '<input type="submit"/>' +
        '</form>')($rootScope);
      $rootScope.$digest();

      // prevent submit within the test harness
      element.on('submit', function(e) { e.preventDefault(); });

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

      element = $compile('<form action="/foo" ng-submit="formSubmission($event)">' +
        '<input type="submit"/>' +
        '</form>')($rootScope);
      $rootScope.$digest();

      // prevent submit within the test harness
      element.on('submit', function(e) { e.preventDefault(); });

      expect($rootScope.formSubmitted).not.toBeDefined();

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

  describe('hooks', function() {

    describe('interceptor hook', function() {

      describe('execution', function() {
        beforeEach(function() {
          var that = this;
          module(function($compileProvider) {
            that.spy = jasmine.createSpy('interceptor').andCallFake(function(e) {
            });

            $compileProvider.directive('testInterceptor', function() {
              return {
                restrict: 'A',
                require: 'ngClick',
                link: function(scope, element, attrs, ngClick) {
                  ngClick.$interceptors.push(that.spy);
                }
              };
            });
          });
        });

        it('should be called before the event handler', function() {
          var that = this;
          inject(function($rootScope, $compile) {
            var element = $compile('<button test-interceptor ng-click="call()">Click</button>')($rootScope);
            $rootScope.call = jasmine.createSpy('call').andCallFake(function() {
              $rootScope.value = 'newValue';
            });

            element.triggerHandler('click');
            expect(that.spy).toHaveBeenCalled();
            expect($rootScope.call).toHaveBeenCalled();
          });
        });
      });

      describe('cancellation', function() {
        beforeEach(function() {
          var that = this;
          module(function($compileProvider) {
            that.spy = jasmine.createSpy('interceptor').andCallFake(function(e) {
              return false;
            });

            $compileProvider.directive('testInterceptor', function() {
              return {
                restrict: 'A',
                require: 'ngClick',
                link: function(scope, element, attrs, ngClick) {
                  ngClick.$interceptors.push(that.spy);
                }
              };
            });
          });
        });

        it('should only cancel calling event handler by returning false', function() {
          var that = this;
          inject(function($rootScope, $compile) {
            var element = $compile('<button test-interceptor ng-click="call()">Click</button>')($rootScope);
            $rootScope.call = jasmine.createSpy('call').andCallFake(function() {
              $rootScope.value = 'newValue';
            });

            element.triggerHandler('click');
            expect(that.spy).toHaveBeenCalled();
            expect($rootScope.call).not.toHaveBeenCalled();
          });
        });
      });

      describe('handler function', function() {
        beforeEach(function() {
          var that = this;
          module(function($compileProvider) {
            that.spy = jasmine.createSpy('interceptor');
            $compileProvider.directive('testInterceptor', function() {
              return {
                restrict: 'A',
                require: 'ngClick',
                link: function(scope, element, attrs, ngClick) {
                  ngClick.$interceptors.push(that.spy);
                }
              };
            });
          });
        });

        it('should have access to the event', function() {
          var that = this;
          inject(function($rootScope, $compile) {
            var element = $compile('<button test-interceptor ng-click="call()">Click</button>')($rootScope);
            $rootScope.call = jasmine.createSpy('call').andCallFake(function() {
              $rootScope.value = 'newValue';
            });

            element.triggerHandler('click');

            expect(that.spy).toHaveBeenCalled();
            var arg = that.spy.calls[0].args[0];
            expect(arg).not.toBeUndefined();
            expect(arg.target).toEqual(element[0]);
          });
        });
      });
    });

    describe('result watch hook', function() {
      describe('handler function', function() {
        beforeEach(function() {
          var that = this;
          module(function($compileProvider) {
            that.spy = jasmine.createSpy('resultWatcher');
            $compileProvider.directive('testResultWatcher', function() {
              return {
                restrict: 'A',
                require: 'ngClick',
                link: function(scope, element, attrs, ngClick) {
                  ngClick.$callResultWatchers.push(that.spy);
                }
              };
            });
          });
        });

        it('should be called with the return value of the event handler', function() {
          var that = this;
          inject(function($rootScope, $compile) {
            var element = $compile('<button test-result-watcher ng-click="call()">Click</button>')($rootScope);
            $rootScope.call = jasmine.createSpy('call').andCallFake(function() {
              return 'cake';
            });

            element.triggerHandler('click');

            expect(that.spy).toHaveBeenCalled();
            expect($rootScope.call).toHaveBeenCalled();
            expect(that.spy.calls[0].args[0]).toEqual('cake');
          });
        });
      });
    });
  });

});
