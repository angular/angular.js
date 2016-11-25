'use strict';

/* globals generateInputCompilerHelper: false */

describe('ngModel', function() {

  describe('NgModelController', function() {
    /* global NgModelController: false */
    var ctrl, scope, ngModelAccessor, element, parentFormCtrl;

    beforeEach(inject(function($rootScope, $controller) {
      var attrs = {name: 'testAlias', ngModel: 'value'};

      parentFormCtrl = {
        $$setPending: jasmine.createSpy('$$setPending'),
        $setValidity: jasmine.createSpy('$setValidity'),
        $setDirty: jasmine.createSpy('$setDirty'),
        $$clearControlValidity: noop
      };

      element = jqLite('<form><input></form>');

      scope = $rootScope;
      ngModelAccessor = jasmine.createSpy('ngModel accessor');
      ctrl = $controller(NgModelController, {
        $scope: scope,
        $element: element.find('input'),
        $attrs: attrs
      });

      //Assign the mocked parentFormCtrl to the model controller
      ctrl.$$parentForm = parentFormCtrl;
    }));


    afterEach(function() {
      dealoc(element);
    });


    it('should init the properties', function() {
      expect(ctrl.$untouched).toBe(true);
      expect(ctrl.$touched).toBe(false);
      expect(ctrl.$dirty).toBe(false);
      expect(ctrl.$pristine).toBe(true);
      expect(ctrl.$valid).toBe(true);
      expect(ctrl.$invalid).toBe(false);

      expect(ctrl.$viewValue).toBeDefined();
      expect(ctrl.$modelValue).toBeDefined();

      expect(ctrl.$formatters).toEqual([]);
      expect(ctrl.$parsers).toEqual([]);

      expect(ctrl.$name).toBe('testAlias');
    });


    describe('setValidity', function() {

      function expectOneError() {
        expect(ctrl.$error).toEqual({someError: true});
        expect(ctrl.$$success).toEqual({});
        expect(ctrl.$pending).toBeUndefined();
      }

      function expectOneSuccess() {
        expect(ctrl.$error).toEqual({});
        expect(ctrl.$$success).toEqual({someError: true});
        expect(ctrl.$pending).toBeUndefined();
      }

      function expectOnePending() {
        expect(ctrl.$error).toEqual({});
        expect(ctrl.$$success).toEqual({});
        expect(ctrl.$pending).toEqual({someError: true});
      }

      function expectCleared() {
        expect(ctrl.$error).toEqual({});
        expect(ctrl.$$success).toEqual({});
        expect(ctrl.$pending).toBeUndefined();
      }


      it('should propagate validity to the parent form', function() {
        expect(parentFormCtrl.$setValidity).not.toHaveBeenCalled();
        ctrl.$setValidity('ERROR', false);
        expect(parentFormCtrl.$setValidity).toHaveBeenCalledOnceWith('ERROR', false, ctrl);
      });


      it('should transition from states correctly', function() {
        expectCleared();

        ctrl.$setValidity('someError', false);
        expectOneError();

        ctrl.$setValidity('someError', undefined);
        expectOnePending();

        ctrl.$setValidity('someError', true);
        expectOneSuccess();

        ctrl.$setValidity('someError', null);
        expectCleared();
      });


      it('should set valid/invalid with multiple errors', function() {
        ctrl.$setValidity('first', false);
        expect(ctrl.$valid).toBe(false);
        expect(ctrl.$invalid).toBe(true);

        ctrl.$setValidity('second', false);
        expect(ctrl.$valid).toBe(false);
        expect(ctrl.$invalid).toBe(true);

        ctrl.$setValidity('third', undefined);
        expect(ctrl.$valid).toBeUndefined();
        expect(ctrl.$invalid).toBeUndefined();

        ctrl.$setValidity('third', null);
        expect(ctrl.$valid).toBe(false);
        expect(ctrl.$invalid).toBe(true);

        ctrl.$setValidity('second', true);
        expect(ctrl.$valid).toBe(false);
        expect(ctrl.$invalid).toBe(true);

        ctrl.$setValidity('first', true);
        expect(ctrl.$valid).toBe(true);
        expect(ctrl.$invalid).toBe(false);
      });
    });

    describe('setPristine', function() {

      it('should set control to its pristine state', function() {
        ctrl.$setViewValue('edit');
        expect(ctrl.$dirty).toBe(true);
        expect(ctrl.$pristine).toBe(false);

        ctrl.$setPristine();
        expect(ctrl.$dirty).toBe(false);
        expect(ctrl.$pristine).toBe(true);
      });
    });

    describe('setDirty', function() {

      it('should set control to its dirty state', function() {
        expect(ctrl.$pristine).toBe(true);
        expect(ctrl.$dirty).toBe(false);

        ctrl.$setDirty();
        expect(ctrl.$pristine).toBe(false);
        expect(ctrl.$dirty).toBe(true);
      });


      it('should set parent form to its dirty state', function() {
        ctrl.$setDirty();
        expect(parentFormCtrl.$setDirty).toHaveBeenCalled();
      });
    });

    describe('setUntouched', function() {

      it('should set control to its untouched state', function() {
        ctrl.$setTouched();

        ctrl.$setUntouched();
        expect(ctrl.$touched).toBe(false);
        expect(ctrl.$untouched).toBe(true);
      });
    });

    describe('setTouched', function() {

      it('should set control to its touched state', function() {
        ctrl.$setUntouched();

        ctrl.$setTouched();
        expect(ctrl.$touched).toBe(true);
        expect(ctrl.$untouched).toBe(false);
      });
    });

    describe('view -> model', function() {

      it('should set the value to $viewValue', function() {
        ctrl.$setViewValue('some-val');
        expect(ctrl.$viewValue).toBe('some-val');
      });


      it('should pipeline all registered parsers and set result to $modelValue', function() {
        var log = [];

        ctrl.$parsers.push(function(value) {
          log.push(value);
          return value + '-a';
        });

        ctrl.$parsers.push(function(value) {
          log.push(value);
          return value + '-b';
        });

        ctrl.$setViewValue('init');
        expect(log).toEqual(['init', 'init-a']);
        expect(ctrl.$modelValue).toBe('init-a-b');
      });


      it('should fire viewChangeListeners when the value changes in the view (even if invalid)',
          function() {
        var spy = jasmine.createSpy('viewChangeListener');
        ctrl.$viewChangeListeners.push(spy);
        ctrl.$setViewValue('val');
        expect(spy).toHaveBeenCalledOnce();
        spy.calls.reset();

        // invalid
        ctrl.$parsers.push(function() {return undefined;});
        ctrl.$setViewValue('val2');
        expect(spy).toHaveBeenCalledOnce();
      });


      it('should reset the model when the view is invalid', function() {
        ctrl.$setViewValue('aaaa');
        expect(ctrl.$modelValue).toBe('aaaa');

        // add a validator that will make any input invalid
        ctrl.$parsers.push(function() {return undefined;});
        expect(ctrl.$modelValue).toBe('aaaa');
        ctrl.$setViewValue('bbbb');
        expect(ctrl.$modelValue).toBeUndefined();
      });


      it('should not reset the model when the view is invalid due to an external validator', function() {
        ctrl.$setViewValue('aaaa');
        expect(ctrl.$modelValue).toBe('aaaa');

        ctrl.$setValidity('someExternalError', false);
        ctrl.$setViewValue('bbbb');
        expect(ctrl.$modelValue).toBe('bbbb');
      });


      it('should not reset the view when the view is invalid', function() {
        // this test fails when the view changes the model and
        // then the model listener in ngModel picks up the change and
        // tries to update the view again.

        // add a validator that will make any input invalid
        ctrl.$parsers.push(function() {return undefined;});
        spyOn(ctrl, '$render');

        // first digest
        ctrl.$setViewValue('bbbb');
        expect(ctrl.$modelValue).toBeUndefined();
        expect(ctrl.$viewValue).toBe('bbbb');
        expect(ctrl.$render).not.toHaveBeenCalled();
        expect(scope.value).toBeUndefined();

        // further digests
        scope.$apply('value = "aaa"');
        expect(ctrl.$viewValue).toBe('aaa');
        ctrl.$render.calls.reset();

        ctrl.$setViewValue('cccc');
        expect(ctrl.$modelValue).toBeUndefined();
        expect(ctrl.$viewValue).toBe('cccc');
        expect(ctrl.$render).not.toHaveBeenCalled();
        expect(scope.value).toBeUndefined();
      });


      it('should call parentForm.$setDirty only when pristine', function() {
        ctrl.$setViewValue('');
        expect(ctrl.$pristine).toBe(false);
        expect(ctrl.$dirty).toBe(true);
        expect(parentFormCtrl.$setDirty).toHaveBeenCalledOnce();

        parentFormCtrl.$setDirty.calls.reset();
        ctrl.$setViewValue('');
        expect(ctrl.$pristine).toBe(false);
        expect(ctrl.$dirty).toBe(true);
        expect(parentFormCtrl.$setDirty).not.toHaveBeenCalled();
      });


      it('should remove all other errors when any parser returns undefined', function() {
        var a, b, val = function(val, x) {
          return x ? val : x;
        };

        ctrl.$parsers.push(function(v) { return val(v, a); });
        ctrl.$parsers.push(function(v) { return val(v, b); });

        ctrl.$validators.high = function(value) {
          return !isDefined(value) || value > 5;
        };

        ctrl.$validators.even = function(value) {
          return !isDefined(value) || value % 2 === 0;
        };

        a = b = true;

        ctrl.$setViewValue('3');
        expect(ctrl.$error).toEqual({ high: true, even: true });

        ctrl.$setViewValue('10');
        expect(ctrl.$error).toEqual({});

        a = undefined;

        ctrl.$setViewValue('12');
        expect(ctrl.$error).toEqual({ parse: true });

        a = true;
        b = undefined;

        ctrl.$setViewValue('14');
        expect(ctrl.$error).toEqual({ parse: true });

        a = undefined;
        b = undefined;

        ctrl.$setViewValue('16');
        expect(ctrl.$error).toEqual({ parse: true });

        a = b = false; //not undefined

        ctrl.$setViewValue('2');
        expect(ctrl.$error).toEqual({ high: true });
      });


      it('should not remove external validators when a parser failed', function() {
        ctrl.$parsers.push(function(v) { return undefined; });
        ctrl.$setValidity('externalError', false);
        ctrl.$setViewValue('someValue');
        expect(ctrl.$error).toEqual({ externalError: true, parse: true });
      });


      it('should remove all non-parse-related CSS classes from the form when a parser fails',
        inject(function($compile, $rootScope) {

        var element = $compile('<form name="myForm">' +
                                 '<input name="myControl" ng-model="value" >' +
                               '</form>')($rootScope);
        var inputElm = element.find('input');
        var ctrl = $rootScope.myForm.myControl;

        var parserIsFailing = false;
        ctrl.$parsers.push(function(value) {
          return parserIsFailing ? undefined : value;
        });

        ctrl.$validators.alwaysFail = function() {
          return false;
        };

        ctrl.$setViewValue('123');
        scope.$digest();

        expect(element).toHaveClass('ng-valid-parse');
        expect(element).not.toHaveClass('ng-invalid-parse');
        expect(element).toHaveClass('ng-invalid-always-fail');

        parserIsFailing = true;
        ctrl.$setViewValue('12345');
        scope.$digest();

        expect(element).not.toHaveClass('ng-valid-parse');
        expect(element).toHaveClass('ng-invalid-parse');
        expect(element).not.toHaveClass('ng-invalid-always-fail');

        dealoc(element);
      }));


      it('should set the ng-invalid-parse and ng-valid-parse CSS class when parsers fail and pass', function() {
        var pass = true;
        ctrl.$parsers.push(function(v) {
          return pass ? v : undefined;
        });

        var input = element.find('input');

        ctrl.$setViewValue('1');
        expect(input).toHaveClass('ng-valid-parse');
        expect(input).not.toHaveClass('ng-invalid-parse');

        pass = undefined;

        ctrl.$setViewValue('2');
        expect(input).not.toHaveClass('ng-valid-parse');
        expect(input).toHaveClass('ng-invalid-parse');
      });


      it('should update the model after all async validators resolve', inject(function($q) {
        var defer;
        ctrl.$asyncValidators.promiseValidator = function(value) {
          defer = $q.defer();
          return defer.promise;
        };

        // set view value on first digest
        ctrl.$setViewValue('b');

        expect(ctrl.$modelValue).toBeUndefined();
        expect(scope.value).toBeUndefined();

        defer.resolve();
        scope.$digest();

        expect(ctrl.$modelValue).toBe('b');
        expect(scope.value).toBe('b');

        // set view value on further digests
        ctrl.$setViewValue('c');

        expect(ctrl.$modelValue).toBe('b');
        expect(scope.value).toBe('b');

        defer.resolve();
        scope.$digest();

        expect(ctrl.$modelValue).toBe('c');
        expect(scope.value).toBe('c');
      }));
    });


    describe('model -> view', function() {

      it('should set the value to $modelValue', function() {
        scope.$apply('value = 10');
        expect(ctrl.$modelValue).toBe(10);
      });


      it('should pipeline all registered formatters in reversed order and set result to $viewValue',
          function() {
        var log = [];

        ctrl.$formatters.unshift(function(value) {
          log.push(value);
          return value + 2;
        });

        ctrl.$formatters.unshift(function(value) {
          log.push(value);
          return value + '';
        });

        scope.$apply('value = 3');
        expect(log).toEqual([3, 5]);
        expect(ctrl.$viewValue).toBe('5');
      });


      it('should $render only if value changed', function() {
        spyOn(ctrl, '$render');

        scope.$apply('value = 3');
        expect(ctrl.$render).toHaveBeenCalledOnce();
        ctrl.$render.calls.reset();

        ctrl.$formatters.push(function() {return 3;});
        scope.$apply('value = 5');
        expect(ctrl.$render).not.toHaveBeenCalled();
      });


      it('should clear the view even if invalid', function() {
        spyOn(ctrl, '$render');

        ctrl.$formatters.push(function() {return undefined;});
        scope.$apply('value = 5');
        expect(ctrl.$render).toHaveBeenCalledOnce();
      });


      it('should render immediately even if there are async validators', inject(function($q) {
        spyOn(ctrl, '$render');
        ctrl.$asyncValidators.someValidator = function() {
          return $q.defer().promise;
        };

        scope.$apply('value = 5');
        expect(ctrl.$viewValue).toBe(5);
        expect(ctrl.$render).toHaveBeenCalledOnce();
      }));


      it('should not rerender nor validate in case view value is not changed', function() {
        ctrl.$formatters.push(function(value) {
          return 'nochange';
        });

        spyOn(ctrl, '$render');
        ctrl.$validators.spyValidator = jasmine.createSpy('spyValidator');
        scope.$apply('value = "first"');
        scope.$apply('value = "second"');
        expect(ctrl.$validators.spyValidator).toHaveBeenCalledOnce();
        expect(ctrl.$render).toHaveBeenCalledOnce();
      });


      it('should always format the viewValue as a string for a blank input type when the value is present',
        inject(function($compile, $rootScope, $sniffer) {

        var form = $compile('<form name="form"><input name="field" ng-model="val" /></form>')($rootScope);

        $rootScope.val = 123;
        $rootScope.$digest();
        expect($rootScope.form.field.$viewValue).toBe('123');

        $rootScope.val = null;
        $rootScope.$digest();
        expect($rootScope.form.field.$viewValue).toBe(null);

        dealoc(form);
      }));


      it('should always format the viewValue as a string for a `text` input type when the value is present',
        inject(function($compile, $rootScope, $sniffer) {

        var form = $compile('<form name="form"><input type="text" name="field" ng-model="val" /></form>')($rootScope);
        $rootScope.val = 123;
        $rootScope.$digest();
        expect($rootScope.form.field.$viewValue).toBe('123');

        $rootScope.val = null;
        $rootScope.$digest();
        expect($rootScope.form.field.$viewValue).toBe(null);

        dealoc(form);
      }));


      it('should always format the viewValue as a string for an `email` input type when the value is present',
        inject(function($compile, $rootScope, $sniffer) {

        var form = $compile('<form name="form"><input type="email" name="field" ng-model="val" /></form>')($rootScope);
        $rootScope.val = 123;
        $rootScope.$digest();
        expect($rootScope.form.field.$viewValue).toBe('123');

        $rootScope.val = null;
        $rootScope.$digest();
        expect($rootScope.form.field.$viewValue).toBe(null);

        dealoc(form);
      }));


      it('should always format the viewValue as a string for a `url` input type when the value is present',
        inject(function($compile, $rootScope, $sniffer) {

        var form = $compile('<form name="form"><input type="url" name="field" ng-model="val" /></form>')($rootScope);
        $rootScope.val = 123;
        $rootScope.$digest();
        expect($rootScope.form.field.$viewValue).toBe('123');

        $rootScope.val = null;
        $rootScope.$digest();
        expect($rootScope.form.field.$viewValue).toBe(null);

        dealoc(form);
      }));


      it('should set NaN as the $modelValue when an asyncValidator is present',
        inject(function($q) {

        ctrl.$asyncValidators.test = function() {
          return $q(function(resolve, reject) {
            resolve();
          });
        };

        scope.$apply('value = 10');
        expect(ctrl.$modelValue).toBe(10);

        expect(function() {
          scope.$apply(function() {
            scope.value = NaN;
          });
        }).not.toThrow();

        expect(ctrl.$modelValue).toBeNaN();

      }));
    });


    describe('validation', function() {

      describe('$validate', function() {

        it('should perform validations when $validate() is called', function() {
          scope.$apply('value = ""');

          var validatorResult = false;
          ctrl.$validators.someValidator = function(value) {
            return validatorResult;
          };

          ctrl.$validate();

          expect(ctrl.$valid).toBe(false);

          validatorResult = true;
          ctrl.$validate();

          expect(ctrl.$valid).toBe(true);
        });


        it('should pass the last parsed modelValue to the validators', function() {
          ctrl.$parsers.push(function(modelValue) {
            return modelValue + 'def';
          });

          ctrl.$setViewValue('abc');

          ctrl.$validators.test = function(modelValue, viewValue) {
            return true;
          };

          spyOn(ctrl.$validators, 'test');

          ctrl.$validate();

          expect(ctrl.$validators.test).toHaveBeenCalledWith('abcdef', 'abc');
        });


        it('should set the model to undefined when it becomes invalid', function() {
          var valid = true;
          ctrl.$validators.test = function(modelValue, viewValue) {
            return valid;
          };

          scope.$apply('value = "abc"');
          expect(scope.value).toBe('abc');

          valid = false;
          ctrl.$validate();

          expect(scope.value).toBeUndefined();
        });


        it('should update the model when it becomes valid', function() {
          var valid = true;
          ctrl.$validators.test = function(modelValue, viewValue) {
            return valid;
          };

          scope.$apply('value = "abc"');
          expect(scope.value).toBe('abc');

          valid = false;
          ctrl.$validate();
          expect(scope.value).toBeUndefined();

          valid = true;
          ctrl.$validate();
          expect(scope.value).toBe('abc');
        });


        it('should not update the model when it is valid, but there is a parse error', function() {
          ctrl.$parsers.push(function(modelValue) {
            return undefined;
          });

          ctrl.$setViewValue('abc');
          expect(ctrl.$error.parse).toBe(true);
          expect(scope.value).toBeUndefined();

          ctrl.$validators.test = function(modelValue, viewValue) {
            return true;
          };

          ctrl.$validate();
          expect(ctrl.$error).toEqual({parse: true});
          expect(scope.value).toBeUndefined();
        });


        it('should not set an invalid model to undefined when validity is the same', function() {
          ctrl.$validators.test = function() {
            return false;
          };

          scope.$apply('value = "invalid"');
          expect(ctrl.$valid).toBe(false);
          expect(scope.value).toBe('invalid');

          ctrl.$validate();
          expect(ctrl.$valid).toBe(false);
          expect(scope.value).toBe('invalid');
        });


        it('should not change a model that has a formatter', function() {
          ctrl.$validators.test = function() {
            return true;
          };

          ctrl.$formatters.push(function(modelValue) {
            return 'xyz';
          });

          scope.$apply('value = "abc"');
          expect(ctrl.$viewValue).toBe('xyz');

          ctrl.$validate();
          expect(scope.value).toBe('abc');
        });


        it('should not change a model that has a parser', function() {
          ctrl.$validators.test = function() {
            return true;
          };

          ctrl.$parsers.push(function(modelValue) {
            return 'xyz';
          });

          scope.$apply('value = "abc"');

          ctrl.$validate();
          expect(scope.value).toBe('abc');
        });
      });


      describe('view -> model update', function() {

        it('should always perform validations using the parsed model value', function() {
          var captures;
          ctrl.$validators.raw = function() {
            captures = Array.prototype.slice.call(arguments);
            return captures[0];
          };

          ctrl.$parsers.push(function(value) {
            return value.toUpperCase();
          });

          ctrl.$setViewValue('my-value');

          expect(captures).toEqual(['MY-VALUE', 'my-value']);
        });


        it('should always perform validations using the formatted view value', function() {
          var captures;
          ctrl.$validators.raw = function() {
            captures = Array.prototype.slice.call(arguments);
            return captures[0];
          };

          ctrl.$formatters.push(function(value) {
            return value + '...';
          });

          scope.$apply('value = "matias"');

          expect(captures).toEqual(['matias', 'matias...']);
        });


        it('should only perform validations if the view value is different', function() {
          var count = 0;
          ctrl.$validators.countMe = function() {
            count++;
          };

          ctrl.$setViewValue('my-value');
          expect(count).toBe(1);

          ctrl.$setViewValue('my-value');
          expect(count).toBe(1);

          ctrl.$setViewValue('your-value');
          expect(count).toBe(2);
        });
      });


      it('should perform validations twice each time the model value changes within a digest', function() {
        var count = 0;
        ctrl.$validators.number = function(value) {
          count++;
          return (/^\d+$/).test(value);
        };

        scope.$apply('value = ""');
        expect(count).toBe(1);

        scope.$apply('value = 1');
        expect(count).toBe(2);

        scope.$apply('value = 1');
        expect(count).toBe(2);

        scope.$apply('value = ""');
        expect(count).toBe(3);
      });


      it('should only validate to true if all validations are true', function() {
        ctrl.$modelValue = undefined;
        ctrl.$validators.a = valueFn(true);
        ctrl.$validators.b = valueFn(true);
        ctrl.$validators.c = valueFn(false);

        ctrl.$validate();
        expect(ctrl.$valid).toBe(false);

        ctrl.$validators.c = valueFn(true);

        ctrl.$validate();
        expect(ctrl.$valid).toBe(true);
      });

      it('should treat all responses as boolean for synchronous validators', function() {
        var expectValid = function(value, expected) {
          ctrl.$modelValue = undefined;
          ctrl.$validators.a = valueFn(value);

          ctrl.$validate();
          expect(ctrl.$valid).toBe(expected);
        };

        // False tests
        expectValid(false, false);
        expectValid(undefined, false);
        expectValid(null, false);
        expectValid(0, false);
        expectValid(NaN, false);
        expectValid('', false);

        // True tests
        expectValid(true, true);
        expectValid(1, true);
        expectValid('0', true);
        expectValid('false', true);
        expectValid([], true);
        expectValid({}, true);
      });


      it('should register invalid validations on the $error object', function() {
        ctrl.$modelValue = undefined;
        ctrl.$validators.unique = valueFn(false);
        ctrl.$validators.tooLong = valueFn(false);
        ctrl.$validators.notNumeric = valueFn(true);

        ctrl.$validate();

        expect(ctrl.$error.unique).toBe(true);
        expect(ctrl.$error.tooLong).toBe(true);
        expect(ctrl.$error.notNumeric).not.toBe(true);
      });


      it('should render a validator asynchronously when a promise is returned', inject(function($q) {
        var defer;
        ctrl.$asyncValidators.promiseValidator = function(value) {
          defer = $q.defer();
          return defer.promise;
        };

        scope.$apply('value = ""');

        expect(ctrl.$valid).toBeUndefined();
        expect(ctrl.$invalid).toBeUndefined();
        expect(ctrl.$pending.promiseValidator).toBe(true);

        defer.resolve();
        scope.$digest();

        expect(ctrl.$valid).toBe(true);
        expect(ctrl.$invalid).toBe(false);
        expect(ctrl.$pending).toBeUndefined();

        scope.$apply('value = "123"');

        defer.reject();
        scope.$digest();

        expect(ctrl.$valid).toBe(false);
        expect(ctrl.$invalid).toBe(true);
        expect(ctrl.$pending).toBeUndefined();
      }));


      it('should throw an error when a promise is not returned for an asynchronous validator', inject(function($q) {
        ctrl.$asyncValidators.async = function(value) {
          return true;
        };

        expect(function() {
          scope.$apply('value = "123"');
        }).toThrowMinErr('ngModel', 'nopromise',
          'Expected asynchronous validator to return a promise but got \'true\' instead.');
      }));


      it('should only run the async validators once all the sync validators have passed',
        inject(function($q) {

        var stages = {};

        stages.sync = { status1: false, status2: false, count: 0 };
        ctrl.$validators.syncValidator1 = function(modelValue, viewValue) {
          stages.sync.count++;
          return stages.sync.status1;
        };

        ctrl.$validators.syncValidator2 = function(modelValue, viewValue) {
          stages.sync.count++;
          return stages.sync.status2;
        };

        stages.async = { defer: null, count: 0 };
        ctrl.$asyncValidators.asyncValidator = function(modelValue, viewValue) {
          stages.async.defer = $q.defer();
          stages.async.count++;
          return stages.async.defer.promise;
        };

        scope.$apply('value = "123"');

        expect(ctrl.$valid).toBe(false);
        expect(ctrl.$invalid).toBe(true);

        expect(stages.sync.count).toBe(2);
        expect(stages.async.count).toBe(0);

        stages.sync.status1 = true;

        scope.$apply('value = "456"');

        expect(stages.sync.count).toBe(4);
        expect(stages.async.count).toBe(0);

        stages.sync.status2 = true;

        scope.$apply('value = "789"');

        expect(stages.sync.count).toBe(6);
        expect(stages.async.count).toBe(1);

        stages.async.defer.resolve();
        scope.$apply();

        expect(ctrl.$valid).toBe(true);
        expect(ctrl.$invalid).toBe(false);
      }));


      it('should ignore expired async validation promises once delivered', inject(function($q) {
        var defer, oldDefer, newDefer;
        ctrl.$asyncValidators.async = function(value) {
          defer = $q.defer();
          return defer.promise;
        };

        scope.$apply('value = ""');
        oldDefer = defer;
        scope.$apply('value = "123"');
        newDefer = defer;

        newDefer.reject();
        scope.$digest();
        oldDefer.resolve();
        scope.$digest();

        expect(ctrl.$valid).toBe(false);
        expect(ctrl.$invalid).toBe(true);
        expect(ctrl.$pending).toBeUndefined();
      }));


      it('should clear and ignore all pending promises when the model value changes', inject(function($q) {
        ctrl.$validators.sync = function(value) {
          return true;
        };

        var defers = [];
        ctrl.$asyncValidators.async = function(value) {
          var defer = $q.defer();
          defers.push(defer);
          return defer.promise;
        };

        scope.$apply('value = "123"');
        expect(ctrl.$pending).toEqual({async: true});
        expect(ctrl.$valid).toBeUndefined();
        expect(ctrl.$invalid).toBeUndefined();
        expect(defers.length).toBe(1);
        expect(isObject(ctrl.$pending)).toBe(true);

        scope.$apply('value = "456"');
        expect(ctrl.$pending).toEqual({async: true});
        expect(ctrl.$valid).toBeUndefined();
        expect(ctrl.$invalid).toBeUndefined();
        expect(defers.length).toBe(2);
        expect(isObject(ctrl.$pending)).toBe(true);

        defers[1].resolve();
        scope.$digest();
        expect(ctrl.$valid).toBe(true);
        expect(ctrl.$invalid).toBe(false);
        expect(isObject(ctrl.$pending)).toBe(false);
      }));


      it('should clear and ignore all pending promises when a parser fails', inject(function($q) {
        var failParser = false;
        ctrl.$parsers.push(function(value) {
          return failParser ? undefined : value;
        });

        var defer;
        ctrl.$asyncValidators.async = function(value) {
          defer = $q.defer();
          return defer.promise;
        };

        ctrl.$setViewValue('x..y..z');
        expect(ctrl.$valid).toBeUndefined();
        expect(ctrl.$invalid).toBeUndefined();

        failParser = true;

        ctrl.$setViewValue('1..2..3');
        expect(ctrl.$valid).toBe(false);
        expect(ctrl.$invalid).toBe(true);
        expect(isObject(ctrl.$pending)).toBe(false);

        defer.resolve();
        scope.$digest();

        expect(ctrl.$valid).toBe(false);
        expect(ctrl.$invalid).toBe(true);
        expect(isObject(ctrl.$pending)).toBe(false);
      }));


      it('should clear all errors from async validators if a parser fails', inject(function($q) {
        var failParser = false;
        ctrl.$parsers.push(function(value) {
          return failParser ? undefined : value;
        });

        ctrl.$asyncValidators.async = function(value) {
          return $q.reject();
        };

        ctrl.$setViewValue('x..y..z');
        expect(ctrl.$error).toEqual({async: true});

        failParser = true;

        ctrl.$setViewValue('1..2..3');
        expect(ctrl.$error).toEqual({parse: true});
      }));


      it('should clear all errors from async validators if a sync validator fails', inject(function($q) {
        var failValidator = false;
        ctrl.$validators.sync = function(value) {
          return !failValidator;
        };

        ctrl.$asyncValidators.async = function(value) {
          return $q.reject();
        };

        ctrl.$setViewValue('x..y..z');
        expect(ctrl.$error).toEqual({async: true});

        failValidator = true;

        ctrl.$setViewValue('1..2..3');
        expect(ctrl.$error).toEqual({sync: true});
      }));


      it('should be possible to extend Object prototype and still be able to do form validation',
        inject(function($compile, $rootScope) {
        // eslint-disable-next-line no-extend-native
        Object.prototype.someThing = function() {};
        var element = $compile('<form name="myForm">' +
                                 '<input type="text" name="username" ng-model="username" minlength="10" required />' +
                               '</form>')($rootScope);
        var inputElm = element.find('input');

        var formCtrl = $rootScope.myForm;
        var usernameCtrl = formCtrl.username;

        $rootScope.$digest();
        expect(usernameCtrl.$invalid).toBe(true);
        expect(formCtrl.$invalid).toBe(true);

        usernameCtrl.$setViewValue('valid-username');
        $rootScope.$digest();

        expect(usernameCtrl.$invalid).toBe(false);
        expect(formCtrl.$invalid).toBe(false);
        delete Object.prototype.someThing;

        dealoc(element);
      }));

      it('should re-evaluate the form validity state once the asynchronous promise has been delivered',
        inject(function($compile, $rootScope, $q) {

        var element = $compile('<form name="myForm">' +
                                 '<input type="text" name="username" ng-model="username" minlength="10" required />' +
                                 '<input type="number" name="age" ng-model="age" min="10" required />' +
                               '</form>')($rootScope);
        var inputElm = element.find('input');

        var formCtrl = $rootScope.myForm;
        var usernameCtrl = formCtrl.username;
        var ageCtrl = formCtrl.age;

        var usernameDefer;
        usernameCtrl.$asyncValidators.usernameAvailability = function() {
          usernameDefer = $q.defer();
          return usernameDefer.promise;
        };

        $rootScope.$digest();
        expect(usernameCtrl.$invalid).toBe(true);
        expect(formCtrl.$invalid).toBe(true);

        usernameCtrl.$setViewValue('valid-username');
        $rootScope.$digest();

        expect(formCtrl.$pending.usernameAvailability).toBeTruthy();
        expect(usernameCtrl.$invalid).toBeUndefined();
        expect(formCtrl.$invalid).toBeUndefined();

        usernameDefer.resolve();
        $rootScope.$digest();
        expect(usernameCtrl.$invalid).toBe(false);
        expect(formCtrl.$invalid).toBe(true);

        ageCtrl.$setViewValue(22);
        $rootScope.$digest();

        expect(usernameCtrl.$invalid).toBe(false);
        expect(ageCtrl.$invalid).toBe(false);
        expect(formCtrl.$invalid).toBe(false);

        usernameCtrl.$setViewValue('valid');
        $rootScope.$digest();

        expect(usernameCtrl.$invalid).toBe(true);
        expect(ageCtrl.$invalid).toBe(false);
        expect(formCtrl.$invalid).toBe(true);

        usernameCtrl.$setViewValue('another-valid-username');
        $rootScope.$digest();

        usernameDefer.resolve();
        $rootScope.$digest();

        expect(usernameCtrl.$invalid).toBe(false);
        expect(formCtrl.$invalid).toBe(false);
        expect(formCtrl.$pending).toBeFalsy();
        expect(ageCtrl.$invalid).toBe(false);

        dealoc(element);
      }));


      it('should always use the most recent $viewValue for validation', function() {
        ctrl.$parsers.push(function(value) {
          if (value && value.substr(-1) === 'b') {
            value = 'a';
            ctrl.$setViewValue(value);
            ctrl.$render();
          }

          return value;
        });

        ctrl.$validators.mock = function(modelValue) {
          return true;
        };

        spyOn(ctrl.$validators, 'mock').and.callThrough();

        ctrl.$setViewValue('ab');

        expect(ctrl.$validators.mock).toHaveBeenCalledWith('a', 'a');
        expect(ctrl.$validators.mock).toHaveBeenCalledTimes(2);
      });


      it('should validate even if the modelValue did not change', function() {
        ctrl.$parsers.push(function(value) {
          if (value && value.substr(-1) === 'b') {
            value = 'a';
          }

          return value;
        });

        ctrl.$validators.mock = function(modelValue) {
          return true;
        };

        spyOn(ctrl.$validators, 'mock').and.callThrough();

        ctrl.$setViewValue('a');

        expect(ctrl.$validators.mock).toHaveBeenCalledWith('a', 'a');
        expect(ctrl.$validators.mock).toHaveBeenCalledTimes(1);

        ctrl.$setViewValue('ab');

        expect(ctrl.$validators.mock).toHaveBeenCalledWith('a', 'ab');
        expect(ctrl.$validators.mock).toHaveBeenCalledTimes(2);
      });

      it('should validate correctly when $parser name equals $validator key', function() {

        ctrl.$validators.parserOrValidator = function(value) {
          switch (value) {
            case 'allInvalid':
            case 'parseValid-validatorsInvalid':
            case 'stillParseValid-validatorsInvalid':
              return false;
            default:
              return true;
          }
        };

        ctrl.$validators.validator = function(value) {
          switch (value) {
            case 'allInvalid':
            case 'parseValid-validatorsInvalid':
            case 'stillParseValid-validatorsInvalid':
              return false;
            default:
              return true;
          }
        };

        ctrl.$$parserName = 'parserOrValidator';
        ctrl.$parsers.push(function(value) {
          switch (value) {
            case 'allInvalid':
            case 'stillAllInvalid':
            case 'parseInvalid-validatorsValid':
            case 'stillParseInvalid-validatorsValid':
              return undefined;
            default:
              return value;
          }
        });

        //Parser and validators are invalid
        scope.$apply('value = "allInvalid"');
        expect(scope.value).toBe('allInvalid');
        expect(ctrl.$error).toEqual({parserOrValidator: true, validator: true});

        ctrl.$validate();
        expect(scope.value).toEqual('allInvalid');
        expect(ctrl.$error).toEqual({parserOrValidator: true, validator: true});

        ctrl.$setViewValue('stillAllInvalid');
        expect(scope.value).toBeUndefined();
        expect(ctrl.$error).toEqual({parserOrValidator: true});

        ctrl.$validate();
        expect(scope.value).toBeUndefined();
        expect(ctrl.$error).toEqual({parserOrValidator: true});

        //Parser is valid, validators are invalid
        scope.$apply('value = "parseValid-validatorsInvalid"');
        expect(scope.value).toBe('parseValid-validatorsInvalid');
        expect(ctrl.$error).toEqual({parserOrValidator: true, validator: true});

        ctrl.$validate();
        expect(scope.value).toBe('parseValid-validatorsInvalid');
        expect(ctrl.$error).toEqual({parserOrValidator: true, validator: true});

        ctrl.$setViewValue('stillParseValid-validatorsInvalid');
        expect(scope.value).toBeUndefined();
        expect(ctrl.$error).toEqual({parserOrValidator: true, validator: true});

        ctrl.$validate();
        expect(scope.value).toBeUndefined();
        expect(ctrl.$error).toEqual({parserOrValidator: true, validator: true});

        //Parser is invalid, validators are valid
        scope.$apply('value = "parseInvalid-validatorsValid"');
        expect(scope.value).toBe('parseInvalid-validatorsValid');
        expect(ctrl.$error).toEqual({});

        ctrl.$validate();
        expect(scope.value).toBe('parseInvalid-validatorsValid');
        expect(ctrl.$error).toEqual({});

        ctrl.$setViewValue('stillParseInvalid-validatorsValid');
        expect(scope.value).toBeUndefined();
        expect(ctrl.$error).toEqual({parserOrValidator: true});

        ctrl.$validate();
        expect(scope.value).toBeUndefined();
        expect(ctrl.$error).toEqual({parserOrValidator: true});
      });

    });
  });


  describe('CSS classes', function() {
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    it('should set ng-empty or ng-not-empty when the view value changes',
          inject(function($compile, $rootScope, $sniffer) {

      var element = $compile('<input ng-model="value" />')($rootScope);

      $rootScope.$digest();
      expect(element).toBeEmpty();

      $rootScope.value = 'XXX';
      $rootScope.$digest();
      expect(element).toBeNotEmpty();

      element.val('');
      browserTrigger(element, $sniffer.hasEvent('input') ? 'input' : 'change');
      expect(element).toBeEmpty();

      element.val('YYY');
      browserTrigger(element, $sniffer.hasEvent('input') ? 'input' : 'change');
      expect(element).toBeNotEmpty();
    }));


    it('should set css classes (ng-valid, ng-invalid, ng-pristine, ng-dirty, ng-untouched, ng-touched)',
        inject(function($compile, $rootScope, $sniffer) {
      var element = $compile('<input type="email" ng-model="value" />')($rootScope);

      $rootScope.$digest();
      expect(element).toBeValid();
      expect(element).toBePristine();
      expect(element).toBeUntouched();
      expect(element.hasClass('ng-valid-email')).toBe(true);
      expect(element.hasClass('ng-invalid-email')).toBe(false);

      $rootScope.$apply('value = \'invalid-email\'');
      expect(element).toBeInvalid();
      expect(element).toBePristine();
      expect(element.hasClass('ng-valid-email')).toBe(false);
      expect(element.hasClass('ng-invalid-email')).toBe(true);

      element.val('invalid-again');
      browserTrigger(element, ($sniffer.hasEvent('input')) ? 'input' : 'change');
      expect(element).toBeInvalid();
      expect(element).toBeDirty();
      expect(element.hasClass('ng-valid-email')).toBe(false);
      expect(element.hasClass('ng-invalid-email')).toBe(true);

      element.val('vojta@google.com');
      browserTrigger(element, $sniffer.hasEvent('input') ? 'input' : 'change');
      expect(element).toBeValid();
      expect(element).toBeDirty();
      expect(element.hasClass('ng-valid-email')).toBe(true);
      expect(element.hasClass('ng-invalid-email')).toBe(false);

      browserTrigger(element, 'blur');
      expect(element).toBeTouched();

      dealoc(element);
    }));


    it('should set invalid classes on init', inject(function($compile, $rootScope) {
      var element = $compile('<input type="email" ng-model="value" required />')($rootScope);
      $rootScope.$digest();

      expect(element).toBeInvalid();
      expect(element).toHaveClass('ng-invalid-required');

      dealoc(element);
    }));

  });


  describe('custom formatter and parser that are added by a directive in post linking', function() {
    var inputElm, scope;

    beforeEach(module(function($compileProvider) {
      $compileProvider.directive('customFormat', function() {
        return {
          require: 'ngModel',
          link: function(scope, element, attrs, ngModelCtrl) {
            ngModelCtrl.$formatters.push(function(value) {
              return value.part;
            });
            ngModelCtrl.$parsers.push(function(value) {
              return {part: value};
            });
          }
        };
      });
    }));


    afterEach(function() {
      dealoc(inputElm);
    });


    function createInput(type) {
      inject(function($compile, $rootScope) {
        scope = $rootScope;
        inputElm = $compile('<input type="' + type + '" ng-model="val" custom-format/>')($rootScope);
      });
    }


    it('should use them after the builtin ones for text inputs', function() {
      createInput('text');
      scope.$apply('val = {part: "a"}');
      expect(inputElm.val()).toBe('a');

      inputElm.val('b');
      browserTrigger(inputElm, 'change');
      expect(scope.val).toEqual({part: 'b'});
    });


    it('should use them after the builtin ones for number inputs', function() {
      createInput('number');
      scope.$apply('val = {part: 1}');
      expect(inputElm.val()).toBe('1');

      inputElm.val('2');
      browserTrigger(inputElm, 'change');
      expect(scope.val).toEqual({part: 2});
    });


    it('should use them after the builtin ones for date inputs', function() {
      createInput('date');
      scope.$apply(function() {
        scope.val = {part: new Date(2000, 10, 8)};
      });
      expect(inputElm.val()).toBe('2000-11-08');

      inputElm.val('2001-12-09');
      browserTrigger(inputElm, 'change');
      expect(scope.val).toEqual({part: new Date(2001, 11, 9)});
    });
  });


  describe('$touched', function() {

    it('should set the control touched state on "blur" event', inject(function($compile, $rootScope) {
      var element = $compile('<form name="myForm">' +
                               '<input name="myControl" ng-model="value" >' +
                             '</form>')($rootScope);
      var inputElm = element.find('input');
      var control = $rootScope.myForm.myControl;

      expect(control.$touched).toBe(false);
      expect(control.$untouched).toBe(true);

      browserTrigger(inputElm, 'blur');
      expect(control.$touched).toBe(true);
      expect(control.$untouched).toBe(false);

      dealoc(element);
    }));


    it('should not cause a digest on "blur" event if control is already touched',
        inject(function($compile, $rootScope) {

      var element = $compile('<form name="myForm">' +
                               '<input name="myControl" ng-model="value" >' +
                             '</form>')($rootScope);
      var inputElm = element.find('input');
      var control = $rootScope.myForm.myControl;

      control.$setTouched();
      spyOn($rootScope, '$apply');
      browserTrigger(inputElm, 'blur');

      expect($rootScope.$apply).not.toHaveBeenCalled();

      dealoc(element);
    }));


    it('should digest asynchronously on "blur" event if a apply is already in progress',
        inject(function($compile, $rootScope) {

      var element = $compile('<form name="myForm">' +
                               '<input name="myControl" ng-model="value" >' +
                             '</form>')($rootScope);
      var inputElm = element.find('input');
      var control = $rootScope.myForm.myControl;

      $rootScope.$apply(function() {
        expect(control.$touched).toBe(false);
        expect(control.$untouched).toBe(true);

        browserTrigger(inputElm, 'blur');

        expect(control.$touched).toBe(false);
        expect(control.$untouched).toBe(true);
      });

      expect(control.$touched).toBe(true);
      expect(control.$untouched).toBe(false);

      dealoc(element);
    }));
  });


  describe('nested in a form', function() {

    it('should register/deregister a nested ngModel with parent form when entering or leaving DOM',
        inject(function($compile, $rootScope) {

      var element = $compile('<form name="myForm">' +
                               '<input ng-if="inputPresent" name="myControl" ng-model="value" required >' +
                             '</form>')($rootScope);
      var isFormValid;

      $rootScope.inputPresent = false;
      $rootScope.$watch('myForm.$valid', function(value) { isFormValid = value; });

      $rootScope.$apply();

      expect($rootScope.myForm.$valid).toBe(true);
      expect(isFormValid).toBe(true);
      expect($rootScope.myForm.myControl).toBeUndefined();

      $rootScope.inputPresent = true;
      $rootScope.$apply();

      expect($rootScope.myForm.$valid).toBe(false);
      expect(isFormValid).toBe(false);
      expect($rootScope.myForm.myControl).toBeDefined();

      $rootScope.inputPresent = false;
      $rootScope.$apply();

      expect($rootScope.myForm.$valid).toBe(true);
      expect(isFormValid).toBe(true);
      expect($rootScope.myForm.myControl).toBeUndefined();

      dealoc(element);
    }));


    it('should register/deregister a nested ngModel with parent form when entering or leaving DOM with animations',
        function() {

      // ngAnimate performs the dom manipulation after digest, and since the form validity can be affected by a form
      // control going away we must ensure that the deregistration happens during the digest while we are still doing
      // dirty checking.
      module('ngAnimate');

      inject(function($compile, $rootScope) {
        var element = $compile('<form name="myForm">' +
                                 '<input ng-if="inputPresent" name="myControl" ng-model="value" required >' +
                               '</form>')($rootScope);
        var isFormValid;

        $rootScope.inputPresent = false;
        // this watch ensure that the form validity gets updated during digest (so that we can observe it)
        $rootScope.$watch('myForm.$valid', function(value) { isFormValid = value; });

        $rootScope.$apply();

        expect($rootScope.myForm.$valid).toBe(true);
        expect(isFormValid).toBe(true);
        expect($rootScope.myForm.myControl).toBeUndefined();

        $rootScope.inputPresent = true;
        $rootScope.$apply();

        expect($rootScope.myForm.$valid).toBe(false);
        expect(isFormValid).toBe(false);
        expect($rootScope.myForm.myControl).toBeDefined();

        $rootScope.inputPresent = false;
        $rootScope.$apply();

        expect($rootScope.myForm.$valid).toBe(true);
        expect(isFormValid).toBe(true);
        expect($rootScope.myForm.myControl).toBeUndefined();

        dealoc(element);
      });
    });


    it('should keep previously defined watches consistent when changes in validity are made',
     inject(function($compile, $rootScope) {

      var isFormValid;
      $rootScope.$watch('myForm.$valid', function(value) { isFormValid = value; });

      var element = $compile('<form name="myForm">' +
        '<input  name="myControl" ng-model="value" required >' +
        '</form>')($rootScope);

      $rootScope.$apply();
      expect(isFormValid).toBe(false);
      expect($rootScope.myForm.$valid).toBe(false);

      $rootScope.value = 'value';
      $rootScope.$apply();
      expect(isFormValid).toBe(true);
      expect($rootScope.myForm.$valid).toBe(true);

      dealoc(element);
    }));
  });


  describe('animations', function() {

    function findElementAnimations(element, queue) {
      var node = element[0];
      var animations = [];
      for (var i = 0; i < queue.length; i++) {
        var animation = queue[i];
        if (animation.element[0] === node) {
          animations.push(animation);
        }
      }
      return animations;
    }


    function assertValidAnimation(animation, event, classNameA, classNameB) {
      expect(animation.event).toBe(event);
      expect(animation.args[1]).toBe(classNameA);
      if (classNameB) expect(animation.args[2]).toBe(classNameB);
    }

    var doc, input, scope, model;


    beforeEach(module('ngAnimateMock'));


    beforeEach(inject(function($rootScope, $compile, $rootElement, $animate) {
      scope = $rootScope.$new();
      doc = jqLite('<form name="myForm">' +
                   '  <input type="text" ng-model="input" name="myInput" />' +
                   '</form>');
      $rootElement.append(doc);
      $compile(doc)(scope);
      $animate.queue = [];

      input = doc.find('input');
      model = scope.myForm.myInput;
    }));


    afterEach(function() {
      dealoc(input);
    });


    it('should trigger an animation when invalid', inject(function($animate) {
      model.$setValidity('required', false);

      var animations = findElementAnimations(input, $animate.queue);
      assertValidAnimation(animations[0], 'removeClass', 'ng-valid');
      assertValidAnimation(animations[1], 'addClass', 'ng-invalid');
      assertValidAnimation(animations[2], 'addClass', 'ng-invalid-required');
    }));


    it('should trigger an animation when valid', inject(function($animate) {
      model.$setValidity('required', false);

      $animate.queue = [];

      model.$setValidity('required', true);

      var animations = findElementAnimations(input, $animate.queue);
      assertValidAnimation(animations[0], 'addClass', 'ng-valid');
      assertValidAnimation(animations[1], 'removeClass', 'ng-invalid');
      assertValidAnimation(animations[2], 'addClass', 'ng-valid-required');
      assertValidAnimation(animations[3], 'removeClass', 'ng-invalid-required');
    }));


    it('should trigger an animation when dirty', inject(function($animate) {
      model.$setViewValue('some dirty value');

      var animations = findElementAnimations(input, $animate.queue);
      assertValidAnimation(animations[0], 'removeClass', 'ng-empty');
      assertValidAnimation(animations[1], 'addClass', 'ng-not-empty');
      assertValidAnimation(animations[2], 'removeClass', 'ng-pristine');
      assertValidAnimation(animations[3], 'addClass', 'ng-dirty');
    }));


    it('should trigger an animation when pristine', inject(function($animate) {
      model.$setPristine();

      var animations = findElementAnimations(input, $animate.queue);
      assertValidAnimation(animations[0], 'removeClass', 'ng-dirty');
      assertValidAnimation(animations[1], 'addClass', 'ng-pristine');
    }));


    it('should trigger an animation when untouched', inject(function($animate) {
      model.$setUntouched();

      var animations = findElementAnimations(input, $animate.queue);
      assertValidAnimation(animations[0], 'setClass', 'ng-untouched');
      expect(animations[0].args[2]).toBe('ng-touched');
    }));


    it('should trigger an animation when touched', inject(function($animate) {
      model.$setTouched();

      var animations = findElementAnimations(input, $animate.queue);
      assertValidAnimation(animations[0], 'setClass', 'ng-touched', 'ng-untouched');
      expect(animations[0].args[2]).toBe('ng-untouched');
    }));


    it('should trigger custom errors as addClass/removeClass when invalid/valid', inject(function($animate) {
      model.$setValidity('custom-error', false);

      var animations = findElementAnimations(input, $animate.queue);
      assertValidAnimation(animations[0], 'removeClass', 'ng-valid');
      assertValidAnimation(animations[1], 'addClass', 'ng-invalid');
      assertValidAnimation(animations[2], 'addClass', 'ng-invalid-custom-error');

      $animate.queue = [];
      model.$setValidity('custom-error', true);

      animations = findElementAnimations(input, $animate.queue);
      assertValidAnimation(animations[0], 'addClass', 'ng-valid');
      assertValidAnimation(animations[1], 'removeClass', 'ng-invalid');
      assertValidAnimation(animations[2], 'addClass', 'ng-valid-custom-error');
      assertValidAnimation(animations[3], 'removeClass', 'ng-invalid-custom-error');
    }));
  });
});
