'use strict';

/**
 * @ngdoc object
 * @name angular.module.ng.$formFactory
 *
 * @description
 * Use `$formFactory` to create a new instance of a {@link angular.module.ng.$formFactory.Form Form}
 * controller or to find the nearest form instance for a given DOM element.
 *
 * The form instance is a collection of widgets, and is responsible for life cycle and validation
 * of widget.
 *
 * Keep in mind that both form and widget instances are {@link api/angular.module.ng.$rootScope.Scope scopes}.
 *
 * @param {Form=} parentForm The form which should be the parent form of the new form controller.
 *   If none specified default to the `rootForm`.
 * @returns {Form} A new {@link angular.module.ng.$formFactory.Form Form} instance.
 *
 * @example
 *
 * This example shows how one could write a widget which would enable data-binding on
 * `contenteditable` feature of HTML.
 *
    <doc:example module="formModule">
      <doc:source>
        <script>
          function EditorCntl($scope) {
            $scope.htmlContent = '<b>Hello</b> <i>World</i>!';
          }

          HTMLEditorWidget.$inject = ['$scope', '$element', '$sanitize'];
          function HTMLEditorWidget(scope, element, $sanitize) {
            scope.$parseModel = function() {
              // need to protect for script injection
              try {
                scope.$viewValue = $sanitize(
                  scope.$modelValue || '');
                if (this.$error.HTML) {
                  // we were invalid, but now we are OK.
                  scope.$emit('$valid', 'HTML');
                }
              } catch (e) {
                // if HTML not parsable invalidate form.
                scope.$emit('$invalid', 'HTML');
              }
            }

            scope.$render = function() {
              element.html(this.$viewValue);
            }

            element.bind('keyup', function() {
              scope.$apply(function() {
                scope.$emit('$viewChange', element.html());
              });
            });
          }

       angular.module('formModule', [], function($compileProvider){
         $compileProvider.directive('ngHtmlEditorModel', function ($formFactory) {
           return function(scope, element, attr) {
             var form = $formFactory.forElement(element),
                 widget;
             element.attr('contentEditable', true);
             widget = form.$createWidget({
               scope: scope,
               model: attr.ngHtmlEditorModel,
               controller: HTMLEditorWidget,
               controllerArgs: {$element: element}});
             // if the element is destroyed, then we need to
             // notify the form.
             element.bind('$destroy', function() {
               widget.$destroy();
             });
           };
         });
       });
     </script>
     <form name='editorForm' ng:controller="EditorCntl">
       <div ng:html-editor-model="htmlContent"></div>
       <hr/>
       HTML: <br/>
       <textarea ng:model="htmlContent" cols="80"></textarea>
       <hr/>
       <pre>editorForm = {{editorForm|json}}</pre>
     </form>
   </doc:source>
   <doc:scenario>
     it('should enter invalid HTML', function() {
       expect(element('form[name=editorForm]').prop('className')).toMatch(/ng-valid/);
       input('htmlContent').enter('<');
       expect(element('form[name=editorForm]').prop('className')).toMatch(/ng-invalid/);
     });
   </doc:scenario>
 </doc:example>
 */

/**
 * @ngdoc object
 * @name angular.module.ng.$formFactory.Form
 * @description
 * The `Form` is a controller which keeps track of the validity of the widgets contained within it.
 */

function $FormFactoryProvider() {
  var $parse;
  this.$get = ['$rootScope', '$parse', '$controller',
      function($rootScope, $parse_, $controller) {
    $parse = $parse_;
    /**
     * @ngdoc proprety
     * @name rootForm
     * @propertyOf angular.module.ng.$formFactory
     * @description
     * Static property on `$formFactory`
     *
     * Each application ({@link guide/dev_guide.scopes.internals root scope}) gets a root form which
     * is the top-level parent of all forms.
     */
    formFactory.rootForm = formFactory($rootScope);


    /**
     * @ngdoc method
     * @name forElement
     * @methodOf angular.module.ng.$formFactory
     * @description
     * Static method on `$formFactory` service.
     *
     * Retrieve the closest form for a given element or defaults to the `root` form. Used by the
     * {@link angular.module.ng.$compileProvider.directive.form form} element.
     * @param {Element} element The element where the search for form should initiate.
     */
    formFactory.forElement = function(element) {
      return element.inheritedData('$form') || formFactory.rootForm;
    };
    return formFactory;

    function formFactory(parent) {
      var scope = (parent || formFactory.rootForm).$new();
      $controller(FormController, {$scope: scope});
      return scope;
    }

  }];

  function propertiesUpdate(widget) {
    widget.$valid = !(widget.$invalid =
      !(widget.$readonly || widget.$disabled || equals(widget.$error, {})));
  }

  /**
   * @ngdoc property
   * @name $error
   * @propertyOf angular.module.ng.$formFactory.Form
   * @description
   * Property of the form and widget instance.
   *
   * Summary of all of the errors on the page. If a widget emits `$invalid` with `REQUIRED` key,
   * then the `$error` object will have a `REQUIRED` key with an array of widgets which have
   * emitted this key. `form.$error.REQUIRED == [ widget ]`.
   */

  /**
   * @ngdoc property
   * @name $invalid
   * @propertyOf angular.module.ng.$formFactory.Form
   * @description
   * Property of the form and widget instance.
   *
   * True if any of the widgets of the form are invalid.
   */

  /**
   * @ngdoc property
   * @name $valid
   * @propertyOf angular.module.ng.$formFactory.Form
   * @description
   * Property of the form and widget instance.
   *
   * True if all of the widgets of the form are valid.
   */

  /**
   * @ngdoc event
   * @name angular.module.ng.$formFactory.Form#$valid
   * @eventOf angular.module.ng.$formFactory.Form
   * @eventType listen on form
   * @description
   * Upon receiving the `$valid` event from the widget update the `$error`, `$valid` and `$invalid`
   * properties of both the widget as well as the from.
   *
   * @param {string} validationKey The validation key to be used when updating the `$error` object.
   *    The validation key is what will allow the template to bind to a specific validation error
   *    such as `<div ng:show="form.$error.KEY">error for key</div>`.
   */

  /**
   * @ngdoc event
   * @name angular.module.ng.$formFactory.Form#$invalid
   * @eventOf angular.module.ng.$formFactory.Form
   * @eventType listen on form
   * @description
   * Upon receiving the `$invalid` event from the widget update the `$error`, `$valid` and `$invalid`
   * properties of both the widget as well as the from.
   *
   * @param {string} validationKey The validation key to be used when updating the `$error` object.
   *    The validation key is what will allow the template to bind to a specific validation error
   *    such as `<div ng:show="form.$error.KEY">error for key</div>`.
   */

  /**
   * @ngdoc event
   * @name angular.module.ng.$formFactory.Form#$validate
   * @eventOf angular.module.ng.$formFactory.Form
   * @eventType emit on widget
   * @description
   * Emit the `$validate` event on the widget, giving a widget a chance to emit a
   * `$valid` / `$invalid` event base on its state. The `$validate` event is triggered when the
   * model or the view changes.
   */

  /**
   * @ngdoc event
   * @name angular.module.ng.$formFactory.Form#$viewChange
   * @eventOf angular.module.ng.$formFactory.Form
   * @eventType listen on widget
   * @description
   * A widget is responsible for emitting this event whenever the view changes do to user interaction.
   * The event takes a `$viewValue` parameter, which is the new value of the view. This
   * event triggers a call to `$parseView()` as well as `$validate` event on widget.
   *
   * @param {*} viewValue The new value for the view which will be assigned to `widget.$viewValue`.
   */

  FormController.$inject = ['$scope', '$injector'];
  function FormController($scope, $injector) {
    this.$injector = $injector;

    var form = this.form = $scope,
        $error = form.$error = {};

    form.$on('$destroy', function(event){
      var widget = event.targetScope;
      if (widget.$widgetId) {
        delete form[widget.$widgetId];
      }
      forEach($error, removeWidget, widget);
    });

    form.$on('$valid', function(event, error){
      var widget = event.targetScope;
      delete widget.$error[error];
      propertiesUpdate(widget);
      removeWidget($error[error], error, widget);
    });

    form.$on('$invalid', function(event, error){
      var widget = event.targetScope;
      addWidget(error, widget);
      widget.$error[error] = true;
      propertiesUpdate(widget);
    });

    propertiesUpdate(form);
    form.$createWidget = bind(this, this.$createWidget);

    function removeWidget(queue, errorKey, widget) {
      if (queue) {
        widget = widget || this; // so that we can be used in forEach;
        for (var i = 0, length = queue.length; i < length; i++) {
          if (queue[i] === widget) {
            queue.splice(i, 1);
            if (!queue.length) {
              delete $error[errorKey];
            }
          }
        }
        propertiesUpdate(form);
      }
    }

    function addWidget(errorKey, widget) {
      var queue = $error[errorKey];
      if (queue) {
        for (var i = 0, length = queue.length; i < length; i++) {
          if (queue[i] === widget) {
            return;
          }
        }
      } else {
        $error[errorKey] = queue = [];
      }
      queue.push(widget);
      propertiesUpdate(form);
    }
  }


  /**
   * @ngdoc method
   * @name $createWidget
   * @methodOf angular.module.ng.$formFactory.Form
   * @description
   *
   * Use form's `$createWidget` instance method to create new widgets. The widgets can be created
   * using an alias which makes the accessible from the form and available for data-binding,
   * useful for displaying validation error messages.
   *
   * The creation of a widget sets up:
   *
   *   - `$watch` of `expression` on `model` scope. This code path syncs the model to the view.
   *      The `$watch` listener will:
   *
   *     - assign the new model value of `expression` to `widget.$modelValue`.
   *     - call `widget.$parseModel` method if present. The `$parseModel` is responsible for copying
   *       the `widget.$modelValue` to `widget.$viewValue` and optionally converting the data.
   *       (For example to convert a number into string)
   *     - emits `$validate` event on widget giving a widget a chance to emit `$valid` / `$invalid`
   *       event.
   *     - call `widget.$render()` method on widget. The `$render` method is responsible for
   *       reading the `widget.$viewValue` and updating the DOM.
   *
   *   - Listen on `$viewChange` event from the `widget`. This code path syncs the view to the model.
   *     The `$viewChange` listener will:
   *
   *     - assign the value to `widget.$viewValue`.
   *     - call `widget.$parseView` method if present. The `$parseView` is responsible for copying
   *       the `widget.$viewValue` to `widget.$modelValue` and optionally converting the data.
   *       (For example to convert a string into number)
   *     - emits `$validate` event on widget giving a widget a chance to emit `$valid` / `$invalid`
   *       event.
   *     - Assign the  `widget.$modelValue` to the `expression` on the `model` scope.
   *
   *   - Creates these set of properties on the `widget` which are updated as a response to the
   *     `$valid` / `$invalid` events:
   *
   *     - `$error` -  object - validation errors will be published as keys on this object.
   *       Data-binding to this property is useful for displaying the validation errors.
   *     - `$valid` - boolean - true if there are no validation errors
   *     - `$invalid` - boolean - opposite of `$valid`.
   * @param {Object} params Named parameters:
   *
   *   - `scope` - `{Scope}` -  The scope to which the model for this widget is attached.
   *   - `model` - `{string}` - The name of the model property on model scope.
   *   - `controller` - {WidgetController} - The controller constructor function.
   *      The controller constructor should create these instance methods.
   *     - `$parseView()`: optional method responsible for copying `$viewVale` to `$modelValue`.
   *         The method may fire `$valid`/`$invalid` events.
   *     - `$parseModel()`: optional method responsible for copying `$modelVale` to `$viewValue`.
   *         The method may fire `$valid`/`$invalid` events.
   *     - `$render()`: required method which needs to update the DOM of the widget to match the
   *         `$viewValue`.
   *
   *   - `controllerArgs` - `{Array}` (Optional) -  Any extra arguments will be curried to the
   *     WidgetController constructor.
   *   - `onChange` - `{(string|function())}` (Optional) - Expression to execute when user changes the
   *     value.
   *   - `alias` - `{string}` (Optional) - The name of the form property under which the widget
   *     instance should be published. The name should be unique for each form.
   * @returns {Widget} Instance of a widget scope.
   */
  FormController.prototype.$createWidget = function(params) {
    var form = this.form,
        modelScope = params.scope,
        onChange = params.onChange,
        alias = params.alias,
        scopeGet = $parse(params.model),
        scopeSet = scopeGet.assign,
        widget = form.$new();

    this.$injector.instantiate(params.controller, extend({$scope: widget}, params.controllerArgs));

    if (!scopeSet) {
      throw Error("Expression '" + params.model + "' is not assignable!");
    }

    widget.$error = {};
    // Set the state to something we know will change to get the process going.
    widget.$modelValue = Number.NaN;
    // watch for scope changes and update the view appropriately
    modelScope.$watch(scopeGet, function(value) {
      if (!equals(widget.$modelValue, value)) {
        widget.$modelValue = value;
        widget.$parseModel ? widget.$parseModel() : (widget.$viewValue = value);
        widget.$emit('$validate');
        widget.$render && widget.$render();
      }
    });

    widget.$on('$viewChange', function(event, viewValue){
      if (!equals(widget.$viewValue, viewValue)) {
        widget.$viewValue = viewValue;
        widget.$parseView ? widget.$parseView() : (widget.$modelValue = widget.$viewValue);
        scopeSet(modelScope, widget.$modelValue);
        if (onChange) modelScope.$eval(onChange);
        widget.$emit('$validate');
      }
    });

    propertiesUpdate(widget);

    // assign the widgetModel to the form
    if (alias && !form.hasOwnProperty(alias)) {
      form[alias] = widget;
      widget.$widgetId = alias;
    } else {
      alias = null;
    }

    return widget;
  };
}
