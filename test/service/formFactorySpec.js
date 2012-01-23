'use strict';

describe('$formFactory', function() {

  it('should have global form', inject(function($rootScope, $formFactory) {
    expect($formFactory.rootForm).toBeTruthy();
    expect($formFactory.rootForm.$createWidget).toBeTruthy();
  }));


  describe('new form', function() {
    var form;
    var scope;
    var log;

    function WidgetCtrl($formFactory, $scope) {
      log += '<init>';
      $scope.$render = function() {
        log += '$render();';
      };
      $scope.$on('$validate', function(e){
        log += '$validate();';
      });

      this.$formFactory = $formFactory;
    }

    WidgetCtrl.$inject = ['$formFactory', '$scope'];

    WidgetCtrl.prototype = {
      getFormFactory: function() {
        return this.$formFactory;
      }
    };

    beforeEach(inject(function($rootScope, $formFactory) {
      log = '';
      scope = $rootScope.$new();
      form = $formFactory(scope);
    }));

    describe('$createWidget', function() {
      var widget;

      beforeEach(function() {
        widget = form.$createWidget({
          scope:scope,
          model:'text',
          alias:'text',
          controller:WidgetCtrl
        });
      });


      describe('data flow', function() {
        it('should have status properties', inject(function($rootScope, $formFactory) {
          expect(widget.$error).toEqual({});
          expect(widget.$valid).toBe(true);
          expect(widget.$invalid).toBe(false);
        }));


        it('should update view when model changes', inject(function($rootScope, $formFactory) {
          scope.text = 'abc';
          scope.$digest();
          expect(log).toEqual('<init>$validate();$render();');
          expect(widget.$modelValue).toEqual('abc');

          scope.text = 'xyz';
          scope.$digest();
          expect(widget.$modelValue).toEqual('xyz');

        }));
      });


      describe('validation', function() {
        it('should update state on error', inject(function($rootScope, $formFactory) {
          widget.$emit('$invalid', 'E');
          expect(widget.$valid).toEqual(false);
          expect(widget.$invalid).toEqual(true);

          widget.$emit('$valid', 'E');
          expect(widget.$valid).toEqual(true);
          expect(widget.$invalid).toEqual(false);
        }));


        it('should have called the model setter before the validation', inject(function($rootScope, $formFactory) {
          var modelValue;
          widget.$on('$validate', function() {
            modelValue = scope.text;
          });
          widget.$emit('$viewChange', 'abc');
          expect(modelValue).toEqual('abc');
        }));


        describe('form', function() {
          it('should invalidate form when widget is invalid', inject(function($rootScope, $formFactory) {
            expect(form.$error).toEqual({});
            expect(form.$valid).toEqual(true);
            expect(form.$invalid).toEqual(false);

            widget.$emit('$invalid', 'REASON');

            expect(form.$error.REASON).toEqual([widget]);
            expect(form.$valid).toEqual(false);
            expect(form.$invalid).toEqual(true);

            var widget2 = form.$createWidget({
              scope:scope, model:'text',
              alias:'text',
              controller:WidgetCtrl
            });
            widget2.$emit('$invalid', 'REASON');

            expect(form.$error.REASON).toEqual([widget, widget2]);
            expect(form.$valid).toEqual(false);
            expect(form.$invalid).toEqual(true);

            widget.$emit('$valid', 'REASON');

            expect(form.$error.REASON).toEqual([widget2]);
            expect(form.$valid).toEqual(false);
            expect(form.$invalid).toEqual(true);

            widget2.$emit('$valid', 'REASON');

            expect(form.$error).toEqual({});
            expect(form.$valid).toEqual(true);
            expect(form.$invalid).toEqual(false);
          }));
        });

      });

      describe('id assignment', function() {
        it('should default to name expression', inject(function($rootScope, $formFactory) {
          expect(form.text).toEqual(widget);
        }));


        it('should use ng:id', inject(function($rootScope, $formFactory) {
          widget = form.$createWidget({
            scope:scope,
            model:'text',
            alias:'my.id',
            controller:WidgetCtrl
          });
          expect(form['my.id']).toEqual(widget);
        }));


        it('should not override existing names', inject(function($rootScope, $formFactory) {
          var widget2 = form.$createWidget({
            scope:scope,
            model:'text',
            alias:'text',
            controller:WidgetCtrl
          });
          expect(form.text).toEqual(widget);
          expect(widget2).not.toEqual(widget);
        }));
      });

      describe('dealocation', function() {
        it('should dealocate', inject(function($rootScope, $formFactory) {
          var widget2 = form.$createWidget({
            scope:scope,
            model:'text',
            alias:'myId',
            controller:WidgetCtrl
          });
          expect(form.myId).toEqual(widget2);
          var widget3 = form.$createWidget({
            scope:scope,
            model:'text',
            alias:'myId',
            controller:WidgetCtrl
          });
          expect(form.myId).toEqual(widget2);

          widget3.$destroy();
          expect(form.myId).toEqual(widget2);

          widget2.$destroy();
          expect(form.myId).toBeUndefined();
        }));


        it('should remove invalid fields from errors, when child widget removed', inject(function($rootScope, $formFactory) {
          widget.$emit('$invalid', 'MyError');

          expect(form.$error.MyError).toEqual([widget]);
          expect(form.$invalid).toEqual(true);

          widget.$destroy();

          expect(form.$error.MyError).toBeUndefined();
          expect(form.$invalid).toEqual(false);
        }));
      });
    });
  });
});
