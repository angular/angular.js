'use strict';

/* globals
    generateInputCompilerHelper: false,
    defaultModelOptions: false
 */
describe('ngModelOptions', function() {

  describe('defaultModelOptions', function() {
    it('should provide default values', function() {
      expect(defaultModelOptions.getOption('updateOn')).toEqual('');
      expect(defaultModelOptions.getOption('updateOnDefault')).toEqual(true);
      expect(defaultModelOptions.getOption('debounce')).toBe(0);
      expect(defaultModelOptions.getOption('getterSetter')).toBe(false);
      expect(defaultModelOptions.getOption('allowInvalid')).toBe(false);
      expect(defaultModelOptions.getOption('timezone')).toBe(null);
    });
  });

  describe('directive', function() {

    describe('basic usage', function() {

      var helper = {}, $rootScope, $compile, $timeout, $q;

      generateInputCompilerHelper(helper);

      beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_, _$q_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
        $q = _$q_;
      }));


      describe('should fall back to `defaultModelOptions`', function() {
        it('if there is no `ngModelOptions` directive', function() {
          var inputElm = helper.compileInput(
              '<input type="text" ng-model="name" name="alias" />');

          var inputOptions = $rootScope.form.alias.$options;
          expect(inputOptions.getOption('updateOn')).toEqual(defaultModelOptions.getOption('updateOn'));
          expect(inputOptions.getOption('updateOnDefault')).toEqual(defaultModelOptions.getOption('updateOnDefault'));
          expect(inputOptions.getOption('debounce')).toEqual(defaultModelOptions.getOption('debounce'));
          expect(inputOptions.getOption('getterSetter')).toEqual(defaultModelOptions.getOption('getterSetter'));
          expect(inputOptions.getOption('allowInvalid')).toEqual(defaultModelOptions.getOption('allowInvalid'));
          expect(inputOptions.getOption('timezone')).toEqual(defaultModelOptions.getOption('timezone'));
        });


        it('if `ngModelOptions` on the same element does not specify the option', function() {
          var inputElm = helper.compileInput(
              '<input type="text" ng-model="name" name="alias" ng-model-options="{ updateOn: \'blur\' }"/>');

          var inputOptions = $rootScope.form.alias.$options;
          expect(inputOptions.getOption('debounce')).toEqual(defaultModelOptions.getOption('debounce'));
          expect(inputOptions.getOption('updateOnDefault')).toBe(false);
          expect(inputOptions.getOption('updateOnDefault')).not.toEqual(defaultModelOptions.getOption('updateOnDefault'));
        });


        it('if the first `ngModelOptions` ancestor does not specify the option', function() {
          var form = $compile('<form name="form" ng-model-options="{ updateOn: \'blur\' }">' +
                                    '<input name="alias" ng-model="x">' +
                                  '</form>')($rootScope);
          var inputOptions = $rootScope.form.alias.$options;

          expect(inputOptions.getOption('debounce')).toEqual(defaultModelOptions.getOption('debounce'));
          expect(inputOptions.getOption('updateOnDefault')).toBe(false);
          expect(inputOptions.getOption('updateOnDefault')).not.toEqual(defaultModelOptions.getOption('updateOnDefault'));
          dealoc(form);
        });
      });


      describe('sharing and inheritance', function() {

        it('should not inherit options from ancestor `ngModelOptions` directives by default', function() {
          var container = $compile(
                    '<div ng-model-options="{ allowInvalid: true }">' +
                      '<form ng-model-options="{ updateOn: \'blur\' }">' +
                        '<input ng-model-options="{ updateOn: \'default\' }">' +
                      '</form>' +
                    '</div>')($rootScope);

          var form = container.find('form');
          var input = container.find('input');

          var containerOptions = container.controller('ngModelOptions').$options;
          var formOptions = form.controller('ngModelOptions').$options;
          var inputOptions = input.controller('ngModelOptions').$options;

          expect(containerOptions.getOption('allowInvalid')).toEqual(true);
          expect(formOptions.getOption('allowInvalid')).toEqual(false);
          expect(inputOptions.getOption('allowInvalid')).toEqual(false);

          expect(containerOptions.getOption('updateOn')).toEqual('');
          expect(containerOptions.getOption('updateOnDefault')).toEqual(true);
          expect(formOptions.getOption('updateOn')).toEqual('blur');
          expect(formOptions.getOption('updateOnDefault')).toEqual(false);
          expect(inputOptions.getOption('updateOn')).toEqual('');
          expect(inputOptions.getOption('updateOnDefault')).toEqual(true);

          dealoc(container);
        });

        it('should inherit options that are marked with "$inherit" from the nearest ancestor `ngModelOptions` directive', function() {
          var container = $compile(
                    '<div ng-model-options="{ allowInvalid: true }">' +
                      '<form ng-model-options="{ updateOn: \'blur\', allowInvalid: \'$inherit\' }">' +
                        '<input ng-model-options="{ updateOn: \'default\' }">' +
                      '</form>' +
                    '</div>')($rootScope);

          var form = container.find('form');
          var input = container.find('input');

          var containerOptions = container.controller('ngModelOptions').$options;
          var formOptions = form.controller('ngModelOptions').$options;
          var inputOptions = input.controller('ngModelOptions').$options;

          expect(containerOptions.getOption('allowInvalid')).toEqual(true);
          expect(formOptions.getOption('allowInvalid')).toEqual(true);
          expect(inputOptions.getOption('allowInvalid')).toEqual(false);

          expect(containerOptions.getOption('updateOn')).toEqual('');
          expect(containerOptions.getOption('updateOnDefault')).toEqual(true);
          expect(formOptions.getOption('updateOn')).toEqual('blur');
          expect(formOptions.getOption('updateOnDefault')).toEqual(false);
          expect(inputOptions.getOption('updateOn')).toEqual('');
          expect(inputOptions.getOption('updateOnDefault')).toEqual(true);

          dealoc(container);
        });

        it('should inherit all unspecified options if the options object contains a `"*"` property with value "$inherit"', function() {
          var container = $compile(
                    '<div ng-model-options="{ allowInvalid: true, debounce: 100, updateOn: \'keyup\' }">' +
                      '<form ng-model-options="{ updateOn: \'blur\', \'*\': \'$inherit\' }">' +
                        '<input ng-model-options="{ updateOn: \'default\' }">' +
                      '</form>' +
                    '</div>')($rootScope);

          var form = container.find('form');
          var input = container.find('input');

          var containerOptions = container.controller('ngModelOptions').$options;
          var formOptions = form.controller('ngModelOptions').$options;
          var inputOptions = input.controller('ngModelOptions').$options;

          expect(containerOptions.getOption('allowInvalid')).toEqual(true);
          expect(formOptions.getOption('allowInvalid')).toEqual(true);
          expect(inputOptions.getOption('allowInvalid')).toEqual(false);

          expect(containerOptions.getOption('debounce')).toEqual(100);
          expect(formOptions.getOption('debounce')).toEqual(100);
          expect(inputOptions.getOption('debounce')).toEqual(0);

          expect(containerOptions.getOption('updateOn')).toEqual('keyup');
          expect(containerOptions.getOption('updateOnDefault')).toEqual(false);
          expect(formOptions.getOption('updateOn')).toEqual('blur');
          expect(formOptions.getOption('updateOnDefault')).toEqual(false);
          expect(inputOptions.getOption('updateOn')).toEqual('');
          expect(inputOptions.getOption('updateOnDefault')).toEqual(true);

          dealoc(container);
        });

        it('should correctly inherit default and another specified event for `updateOn`', function() {
          var container = $compile(
                    '<div ng-model-options="{updateOn: \'default blur\'}">' +
                      '<input ng-model-options="{\'*\': \'$inherit\'}">' +
                    '</div>')($rootScope);

          var input = container.find('input');
          var inputOptions = input.controller('ngModelOptions').$options;

          expect(inputOptions.getOption('updateOn')).toEqual('blur');
          expect(inputOptions.getOption('updateOnDefault')).toEqual(true);

          dealoc(container);
        });


        it('should `updateOnDefault` as well if we have `updateOn: "$inherit"`', function() {
          var container = $compile(
                    '<div ng-model-options="{updateOn: \'keyup\'}">' +
                      '<input ng-model-options="{updateOn: \'$inherit\'}">' +
                      '<div ng-model-options="{updateOn: \'default blur\'}">' +
                        '<input ng-model-options="{updateOn: \'$inherit\'}">' +
                      '</div>' +
                    '</div>')($rootScope);

          var input1 = container.find('input').eq(0);
          var inputOptions1 = input1.controller('ngModelOptions').$options;

          expect(inputOptions1.getOption('updateOn')).toEqual('keyup');
          expect(inputOptions1.getOption('updateOnDefault')).toEqual(false);

          var input2 = container.find('input').eq(1);
          var inputOptions2 = input2.controller('ngModelOptions').$options;

          expect(inputOptions2.getOption('updateOn')).toEqual('blur');
          expect(inputOptions2.getOption('updateOnDefault')).toEqual(true);

          dealoc(container);
        });


        it('should make a copy of the options object', function() {
          $rootScope.options = {updateOn: 'default'};
          var inputElm = helper.compileInput(
              '<input type="text" ng-model="name" name="alias" ' +
                'ng-model-options="options"' +
              '/>');
          expect($rootScope.options).toEqual({updateOn: 'default'});
          expect($rootScope.form.alias.$options).not.toBe($rootScope.options);
        });

        it('should be retrieved from an ancestor element containing an `ngModelOptions` directive', function() {
          var doc = $compile(
              '<form name="test" ' +
                  'ng-model-options="{ debounce: 10000, updateOn: \'blur\' }" >' +
                '<input type="text" ng-model="name" name="alias" />' +
              '</form>')($rootScope);
          $rootScope.$digest();

          var inputElm = doc.find('input');
          helper.changeGivenInputTo(inputElm, 'a');
          expect($rootScope.name).toEqual(undefined);
          browserTrigger(inputElm, 'blur');
          expect($rootScope.name).toBeUndefined();
          $timeout.flush(2000);
          expect($rootScope.name).toBeUndefined();
          $timeout.flush(9000);
          expect($rootScope.name).toEqual('a');
          dealoc(doc);
        });

        it('should allow sharing options between multiple inputs', function() {
          $rootScope.options = {updateOn: 'default'};
          var inputElm = helper.compileInput(
              '<input type="text" ng-model="name1" name="alias1" ' +
                'ng-model-options="options"' +
              '/>' +
              '<input type="text" ng-model="name2" name="alias2" ' +
                'ng-model-options="options"' +
              '/>');

          helper.changeGivenInputTo(inputElm.eq(0), 'a');
          helper.changeGivenInputTo(inputElm.eq(1), 'b');
          expect($rootScope.name1).toEqual('a');
          expect($rootScope.name2).toEqual('b');
        });
      });


      describe('updateOn', function() {
        it('should allow overriding the model update trigger event on text inputs', function() {
          var inputElm = helper.compileInput(
              '<input type="text" ng-model="name" name="alias" ' +
                'ng-model-options="{ updateOn: \'blur\' }"' +
              '/>');

          helper.changeInputValueTo('a');
          expect($rootScope.name).toBeUndefined();
          browserTrigger(inputElm, 'blur');
          expect($rootScope.name).toEqual('a');
        });


        it('should not dirty the input if nothing was changed before updateOn trigger', function() {
          var inputElm = helper.compileInput(
              '<input type="text" ng-model="name" name="alias" ' +
                'ng-model-options="{ updateOn: \'blur\' }"' +
              '/>');

          browserTrigger(inputElm, 'blur');
          expect($rootScope.form.alias.$pristine).toBeTruthy();
        });


        it('should allow overriding the model update trigger event on text areas', function() {
          var inputElm = helper.compileInput(
              '<textarea ng-model="name" name="alias" ' +
                'ng-model-options="{ updateOn: \'blur\' }"' +
              '/>');

          helper.changeInputValueTo('a');
          expect($rootScope.name).toBeUndefined();
          browserTrigger(inputElm, 'blur');
          expect($rootScope.name).toEqual('a');
        });


        it('should bind the element to a list of events', function() {
          var inputElm = helper.compileInput(
              '<input type="text" ng-model="name" name="alias" ' +
                'ng-model-options="{ updateOn: \'blur mousemove\' }"' +
              '/>');

          helper.changeInputValueTo('a');
          expect($rootScope.name).toBeUndefined();
          browserTrigger(inputElm, 'blur');
          expect($rootScope.name).toEqual('a');

          helper.changeInputValueTo('b');
          expect($rootScope.name).toEqual('a');
          browserTrigger(inputElm, 'mousemove');
          expect($rootScope.name).toEqual('b');
        });


        it('should allow keeping the default update behavior on text inputs', function() {
          var inputElm = helper.compileInput(
              '<input type="text" ng-model="name" name="alias" ' +
                'ng-model-options="{ updateOn: \'default\' }"' +
              '/>');

          helper.changeInputValueTo('a');
          expect($rootScope.name).toEqual('a');
        });


        it('should allow overriding the model update trigger event on checkboxes', function() {
          var inputElm = helper.compileInput(
              '<input type="checkbox" ng-model="checkbox" ' +
                'ng-model-options="{ updateOn: \'blur\' }"' +
              '/>');

          browserTrigger(inputElm, 'click');
          expect($rootScope.checkbox).toBeUndefined();

          browserTrigger(inputElm, 'blur');
          expect($rootScope.checkbox).toBe(true);

          browserTrigger(inputElm, 'click');
          expect($rootScope.checkbox).toBe(true);
        });


        it('should allow keeping the default update behavior on checkboxes', function() {
          var inputElm = helper.compileInput(
              '<input type="checkbox" ng-model="checkbox" ' +
                'ng-model-options="{ updateOn: \'blur default\' }"' +
              '/>');

          browserTrigger(inputElm, 'click');
          expect($rootScope.checkbox).toBe(true);

          browserTrigger(inputElm, 'click');
          expect($rootScope.checkbox).toBe(false);
        });


        it('should allow overriding the model update trigger event on radio buttons', function() {
          var inputElm = helper.compileInput(
              '<input type="radio" ng-model="color" value="white" ' +
                'ng-model-options="{ updateOn: \'blur\'}"' +
              '/>' +
              '<input type="radio" ng-model="color" value="red" ' +
                'ng-model-options="{ updateOn: \'blur\'}"' +
              '/>' +
              '<input type="radio" ng-model="color" value="blue" ' +
                'ng-model-options="{ updateOn: \'blur\'}"' +
              '/>');

          $rootScope.$apply('color = \'white\'');
          browserTrigger(inputElm[2], 'click');
          expect($rootScope.color).toBe('white');

          browserTrigger(inputElm[2], 'blur');
          expect($rootScope.color).toBe('blue');

        });


        it('should allow keeping the default update behavior on radio buttons', function() {
          var inputElm = helper.compileInput(
              '<input type="radio" ng-model="color" value="white" ' +
                'ng-model-options="{ updateOn: \'blur default\' }"' +
              '/>' +
              '<input type="radio" ng-model="color" value="red" ' +
                'ng-model-options="{ updateOn: \'blur default\' }"' +
              '/>' +
              '<input type="radio" ng-model="color" value="blue" ' +
                'ng-model-options="{ updateOn: \'blur default\' }"' +
              '/>');

          $rootScope.$apply('color = \'white\'');
          browserTrigger(inputElm[2], 'click');
          expect($rootScope.color).toBe('blue');
        });
      });


      describe('debounce', function() {
        it('should trigger only after timeout in text inputs', function() {
          var inputElm = helper.compileInput(
              '<input type="text" ng-model="name" name="alias" ' +
                'ng-model-options="{ debounce: 10000 }"' +
              '/>');

          helper.changeInputValueTo('a');
          helper.changeInputValueTo('b');
          helper.changeInputValueTo('c');
          expect($rootScope.name).toEqual(undefined);
          $timeout.flush(2000);
          expect($rootScope.name).toEqual(undefined);
          $timeout.flush(9000);
          expect($rootScope.name).toEqual('c');
        });


        it('should trigger only after timeout in checkboxes', function() {
          var inputElm = helper.compileInput(
              '<input type="checkbox" ng-model="checkbox" ' +
                'ng-model-options="{ debounce: 10000 }"' +
              '/>');

          browserTrigger(inputElm, 'click');
          expect($rootScope.checkbox).toBeUndefined();
          $timeout.flush(2000);
          expect($rootScope.checkbox).toBeUndefined();
          $timeout.flush(9000);
          expect($rootScope.checkbox).toBe(true);
        });


        it('should trigger only after timeout in radio buttons', function() {
          var inputElm = helper.compileInput(
              '<input type="radio" ng-model="color" value="white" />' +
              '<input type="radio" ng-model="color" value="red" ' +
                'ng-model-options="{ debounce: 20000 }"' +
              '/>' +
              '<input type="radio" ng-model="color" value="blue" ' +
                'ng-model-options="{ debounce: 30000 }"' +
              '/>');

          browserTrigger(inputElm[0], 'click');
          expect($rootScope.color).toBe('white');
          browserTrigger(inputElm[1], 'click');
          expect($rootScope.color).toBe('white');
          $timeout.flush(12000);
          expect($rootScope.color).toBe('white');
          $timeout.flush(10000);
          expect($rootScope.color).toBe('red');

        });


        it('should not trigger digest while debouncing', function() {
          var inputElm = helper.compileInput(
              '<input type="text" ng-model="name" name="alias" ' +
                'ng-model-options="{ debounce: 10000 }"' +
              '/>');

          var watchSpy = jasmine.createSpy('watchSpy');
          $rootScope.$watch(watchSpy);

          helper.changeInputValueTo('a');
          expect(watchSpy).not.toHaveBeenCalled();

          $timeout.flush(10000);
          expect(watchSpy).toHaveBeenCalled();
        });


        it('should allow selecting different debounce timeouts for each event',
          function() {
          var inputElm = helper.compileInput(
              '<input type="text" ng-model="name" name="alias" ' +
                'ng-model-options="{' +
                  'updateOn: \'default blur mouseup\', ' +
                  'debounce: { default: 10000, blur: 5000 }' +
                '}"' +
              '/>');

          helper.changeInputValueTo('a');
          expect($rootScope.name).toBeUndefined();
          $timeout.flush(6000);
          expect($rootScope.name).toBeUndefined();
          $timeout.flush(4000);
          expect($rootScope.name).toEqual('a');

          helper.changeInputValueTo('b');
          browserTrigger(inputElm, 'blur');
          $timeout.flush(4000);
          expect($rootScope.name).toEqual('a');
          $timeout.flush(2000);
          expect($rootScope.name).toEqual('b');

          helper.changeInputValueTo('c');
          browserTrigger(helper.inputElm, 'mouseup');
          // counter-intuitively `default` in `debounce` is a catch-all
          expect($rootScope.name).toEqual('b');
          $timeout.flush(10000);
          expect($rootScope.name).toEqual('c');
        });


        it('should trigger immediately for the event if not listed in the debounce list',
          function() {
          var inputElm = helper.compileInput(
              '<input type="text" ng-model="name" name="alias" ' +
                'ng-model-options="{' +
                  'updateOn: \'default blur foo\', ' +
                  'debounce: { blur: 5000 }' +
                '}"' +
              '/>');

          helper.changeInputValueTo('a');
          expect($rootScope.name).toEqual('a');

          helper.changeInputValueTo('b');
          browserTrigger(inputElm, 'foo');
          expect($rootScope.name).toEqual('b');
        });

        it('should allow selecting different debounce timeouts for each event on checkboxes', function() {
          var inputElm = helper.compileInput('<input type="checkbox" ng-model="checkbox" ' +
            'ng-model-options="{ ' +
              'updateOn: \'default blur\', debounce: { default: 10000, blur: 5000 } }"' +
            '/>');

          inputElm[0].checked = false;
          browserTrigger(inputElm, 'click');
          expect($rootScope.checkbox).toBeUndefined();
          $timeout.flush(8000);
          expect($rootScope.checkbox).toBeUndefined();
          $timeout.flush(3000);
          expect($rootScope.checkbox).toBe(true);
          inputElm[0].checked = true;
          browserTrigger(inputElm, 'click');
          browserTrigger(inputElm, 'blur');
          $timeout.flush(3000);
          expect($rootScope.checkbox).toBe(true);
          $timeout.flush(3000);
          expect($rootScope.checkbox).toBe(false);
        });


        it('should allow selecting 0 for non-default debounce timeouts for each event on checkboxes', function() {
          var inputElm = helper.compileInput('<input type="checkbox" ng-model="checkbox" ' +
            'ng-model-options="{ ' +
              'updateOn: \'default blur\', debounce: { default: 10000, blur: 0 } }"' +
            '/>');

          inputElm[0].checked = false;
          browserTrigger(inputElm, 'click');
          expect($rootScope.checkbox).toBeUndefined();
          $timeout.flush(8000);
          expect($rootScope.checkbox).toBeUndefined();
          $timeout.flush(3000);
          expect($rootScope.checkbox).toBe(true);
          inputElm[0].checked = true;
          browserTrigger(inputElm, 'click');
          browserTrigger(inputElm, 'blur');
          $timeout.flush(0);
          expect($rootScope.checkbox).toBe(false);
        });


        it('should flush debounced events when calling $commitViewValue directly', function() {
          var inputElm = helper.compileInput(
            '<input type="text" ng-model="name" name="alias" ' +
              'ng-model-options="{ debounce: 1000 }" />');

          helper.changeInputValueTo('a');
          expect($rootScope.name).toEqual(undefined);
          $rootScope.form.alias.$commitViewValue();
          expect($rootScope.name).toEqual('a');
        });

        it('should cancel debounced events when calling $commitViewValue', function() {
          var inputElm = helper.compileInput(
            '<input type="text" ng-model="name" name="alias" ' +
              'ng-model-options="{ debounce: 1000 }"/>');

          helper.changeInputValueTo('a');
          $rootScope.form.alias.$commitViewValue();
          expect($rootScope.name).toEqual('a');

          $rootScope.form.alias.$setPristine();
          $timeout.flush(1000);
          expect($rootScope.form.alias.$pristine).toBeTruthy();
        });


        it('should reset input val if rollbackViewValue called during pending update', function() {
          var inputElm = helper.compileInput(
            '<input type="text" ng-model="name" name="alias" ' +
              'ng-model-options="{ updateOn: \'blur\' }" />');

          helper.changeInputValueTo('a');
          expect(inputElm.val()).toBe('a');
          $rootScope.form.alias.$rollbackViewValue();
          expect(inputElm.val()).toBe('');
          browserTrigger(inputElm, 'blur');
          expect(inputElm.val()).toBe('');
        });


        it('should allow canceling pending updates', function() {
          var inputElm = helper.compileInput(
            '<input type="text" ng-model="name" name="alias" ' +
              'ng-model-options="{ updateOn: \'blur\' }" />');

          helper.changeInputValueTo('a');
          expect($rootScope.name).toEqual(undefined);
          $rootScope.form.alias.$rollbackViewValue();
          expect($rootScope.name).toEqual(undefined);
          browserTrigger(inputElm, 'blur');
          expect($rootScope.name).toEqual(undefined);
        });


        it('should allow canceling debounced updates', function() {
          var inputElm = helper.compileInput(
            '<input type="text" ng-model="name" name="alias" ' +
              'ng-model-options="{ debounce: 10000 }" />');

          helper.changeInputValueTo('a');
          expect($rootScope.name).toEqual(undefined);
          $timeout.flush(2000);
          $rootScope.form.alias.$rollbackViewValue();
          expect($rootScope.name).toEqual(undefined);
          $timeout.flush(10000);
          expect($rootScope.name).toEqual(undefined);
        });


        it('should handle model updates correctly even if rollbackViewValue is not invoked', function() {
          var inputElm = helper.compileInput(
            '<input type="text" ng-model="name" name="alias" ' +
              'ng-model-options="{ updateOn: \'blur\' }" />');

          helper.changeInputValueTo('a');
          $rootScope.$apply('name = \'b\'');
          browserTrigger(inputElm, 'blur');
          expect($rootScope.name).toBe('b');
        });


        it('should reset input val if rollbackViewValue called during debounce', function() {
          var inputElm = helper.compileInput(
            '<input type="text" ng-model="name" name="alias" ' +
              'ng-model-options="{ debounce: 2000 }" />');

          helper.changeInputValueTo('a');
          expect(inputElm.val()).toBe('a');
          $rootScope.form.alias.$rollbackViewValue();
          expect(inputElm.val()).toBe('');
          $timeout.flush(3000);
          expect(inputElm.val()).toBe('');
        });
      });


      describe('getterSetter', function() {
        it('should not try to invoke a model if getterSetter is false', function() {
          var inputElm = helper.compileInput(
            '<input type="text" ng-model="name" ' +
              'ng-model-options="{ getterSetter: false }" />');

          var spy = $rootScope.name = jasmine.createSpy('setterSpy');
          helper.changeInputValueTo('a');
          expect(spy).not.toHaveBeenCalled();
          expect(inputElm.val()).toBe('a');
        });


        it('should not try to invoke a model if getterSetter is not set', function() {
          var inputElm = helper.compileInput('<input type="text" ng-model="name" />');

          var spy = $rootScope.name = jasmine.createSpy('setterSpy');
          helper.changeInputValueTo('a');
          expect(spy).not.toHaveBeenCalled();
          expect(inputElm.val()).toBe('a');
        });


        it('should try to invoke a function model if getterSetter is true', function() {
          var inputElm = helper.compileInput(
            '<input type="text" ng-model="name" ' +
              'ng-model-options="{ getterSetter: true }" />');

          var spy = $rootScope.name = jasmine.createSpy('setterSpy').and.callFake(function() {
            return 'b';
          });
          $rootScope.$apply();
          expect(inputElm.val()).toBe('b');

          helper.changeInputValueTo('a');
          expect(inputElm.val()).toBe('b');
          expect(spy).toHaveBeenCalledWith('a');
          expect($rootScope.name).toBe(spy);
        });


        it('should assign to non-function models if getterSetter is true', function() {
          var inputElm = helper.compileInput(
            '<input type="text" ng-model="name" ' +
              'ng-model-options="{ getterSetter: true }" />');

          $rootScope.name = 'c';
          helper.changeInputValueTo('d');
          expect(inputElm.val()).toBe('d');
          expect($rootScope.name).toBe('d');
        });


        it('should fail on non-assignable model binding if getterSetter is false', function() {
          expect(function() {
            var inputElm = helper.compileInput('<input type="text" ng-model="accessor(user, \'name\')" />');
          }).toThrowMinErr('ngModel', 'nonassign', 'Expression \'accessor(user, \'name\')\' is non-assignable.');
        });


        it('should not fail on non-assignable model binding if getterSetter is true', function() {
          var inputElm = helper.compileInput(
            '<input type="text" ng-model="accessor(user, \'name\')" ' +
              'ng-model-options="{ getterSetter: true }" />');
        });


        it('should invoke a model in the correct context if getterSetter is true', function() {
          var inputElm = helper.compileInput(
            '<input type="text" ng-model="someService.getterSetter" ' +
              'ng-model-options="{ getterSetter: true }" />');

          $rootScope.someService = {
            value: 'a',
            getterSetter: function(newValue) {
              this.value = newValue || this.value;
              return this.value;
            }
          };
          spyOn($rootScope.someService, 'getterSetter').and.callThrough();
          $rootScope.$apply();

          expect(inputElm.val()).toBe('a');
          expect($rootScope.someService.getterSetter).toHaveBeenCalledWith();
          expect($rootScope.someService.value).toBe('a');

          helper.changeInputValueTo('b');
          expect($rootScope.someService.getterSetter).toHaveBeenCalledWith('b');
          expect($rootScope.someService.value).toBe('b');

          $rootScope.someService.value = 'c';
          $rootScope.$apply();
          expect(inputElm.val()).toBe('c');
          expect($rootScope.someService.getterSetter).toHaveBeenCalledWith();
        });
      });


      describe('allowInvalid', function() {
        it('should assign invalid values to the scope if allowInvalid is true', function() {
          var inputElm = helper.compileInput('<input type="text" name="input" ng-model="value" maxlength="1" ' +
                      'ng-model-options="{allowInvalid: true}" />');
          helper.changeInputValueTo('12345');

          expect($rootScope.value).toBe('12345');
          expect(inputElm).toBeInvalid();
        });


        it('should not assign not parsable values to the scope if allowInvalid is true', function() {
          var inputElm = helper.compileInput('<input type="number" name="input" ng-model="value" ' +
                      'ng-model-options="{allowInvalid: true}" />', {
            valid: false,
            badInput: true
          });
          helper.changeInputValueTo('abcd');

          expect($rootScope.value).toBeUndefined();
          expect(inputElm).toBeInvalid();
        });


        it('should update the scope before async validators execute if allowInvalid is true', function() {
          var inputElm = helper.compileInput('<input type="text" name="input" ng-model="value" ' +
                      'ng-model-options="{allowInvalid: true}" />');
          var defer;
          $rootScope.form.input.$asyncValidators.promiseValidator = function(value) {
            defer = $q.defer();
            return defer.promise;
          };
          helper.changeInputValueTo('12345');

          expect($rootScope.value).toBe('12345');
          expect($rootScope.form.input.$pending.promiseValidator).toBe(true);
          defer.reject();
          $rootScope.$digest();
          expect($rootScope.value).toBe('12345');
          expect(inputElm).toBeInvalid();
        });


        it('should update the view before async validators execute if allowInvalid is true', function() {
          var inputElm = helper.compileInput('<input type="text" name="input" ng-model="value" ' +
                      'ng-model-options="{allowInvalid: true}" />');
          var defer;
          $rootScope.form.input.$asyncValidators.promiseValidator = function(value) {
            defer = $q.defer();
            return defer.promise;
          };
          $rootScope.$apply('value = \'12345\'');

          expect(inputElm.val()).toBe('12345');
          expect($rootScope.form.input.$pending.promiseValidator).toBe(true);
          defer.reject();
          $rootScope.$digest();
          expect(inputElm.val()).toBe('12345');
          expect(inputElm).toBeInvalid();
        });


        it('should not call ng-change listeners twice if the model did not change with allowInvalid', function() {
          var inputElm = helper.compileInput('<input type="text" name="input" ng-model="value" ' +
                      'ng-model-options="{allowInvalid: true}" ng-change="changed()" />');
          $rootScope.changed = jasmine.createSpy('changed');
          $rootScope.form.input.$parsers.push(function(value) {
            return 'modelValue';
          });

          helper.changeInputValueTo('input1');
          expect($rootScope.value).toBe('modelValue');
          expect($rootScope.changed).toHaveBeenCalledOnce();

          helper.changeInputValueTo('input2');
          expect($rootScope.value).toBe('modelValue');
          expect($rootScope.changed).toHaveBeenCalledOnce();
        });
      });
    });


    describe('on directives with `replace: true`', function() {

      var $rootScope, $compile;

      beforeEach(module(function($compileProvider) {
        $compileProvider.directive('foo', valueFn({
          replace: true,
          template: '<input type="text" ng-model-options="{debounce: 1000}" />'
        }));
      }));

      beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
      }));


      it('should get initialized in time for `ngModel` on the original element', function() {
        var inputElm = $compile('<foo ng-model="value"></foo>')($rootScope);
        var ngModelCtrl = inputElm.controller('ngModel');

        expect(ngModelCtrl.$options.getOption('debounce')).toBe(1000);
      });
    });
  });
});
