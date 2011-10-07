'use strict';

/**
 * @ngdoc service
 * @name angular.service.$formFactory
 *
 * @description
 * Use `$formFactory` to create a new instance of a {@link guide/dev_guide.forms form}
 * controller or to find the nearest form instance for a given DOM element.
 *
 * The form instance is a collection of widgets, and is responsible for life cycle and validation
 * of widget.
 *
 * Keep in mind that both form and widget instances are {@link api/angular.scope scopes}.
 *
 * @param {Form=} parentForm The form which should be the parent form of the new form controller.
 *   If none specified default to the `rootForm`.
 * @returns {Form} A new <a href="#form">form</a> instance.
 *
 * @example
 *
 * This example shows how one could write a widget which would enable data-binding on
 * `contenteditable` feature of HTML.
 *
    <doc:example>
      <doc:source>
        <script>
          function EditorCntl() {
            this.html = '<b>Hello</b> <i>World</i>!';
          }

          function HTMLEditorWidget(element) {
            var self = this;
            var htmlFilter = angular.filter('html');

            this.$parseModel = function() {
              // need to protect for script injection
              try {
                this.$viewValue = htmlFilter(this.$modelValue || '').get();
                if (this.$error.HTML) {
                  // we were invalid, but now we are OK.
                  this.$emit('$valid', 'HTML');
                }
              } catch (e) {
                // if HTML not parsable invalidate form.
                this.$emit('$invalid', 'HTML');
              }
            }

            this.$render = function() {
              element.html(this.$viewValue);
            }

            element.bind('keyup', function() {
              self.$apply(function() {
                self.$emit('$viewChange', element.html());
              });
            });
          }

          angular.directive('ng:contenteditable', function() {
            function linkFn($formFactory, element) {
              var exp = element.attr('ng:contenteditable'),
                  form = $formFactory.forElement(element),
                  widget;
              element.attr('contentEditable', true);
              widget = form.$createWidget({
                scope: this,
                model: exp,
                controller: HTMLEditorWidget,
                controllerArgs: [element]});
              // if the element is destroyed, then we need to notify the form.
              element.bind('$destroy', function() {
                widget.$destroy();
              });
            }
            linkFn.$inject = ['$formFactory'];
            return linkFn;
          });
        </script>
        <form name='editorForm' ng:controller="EditorCntl">
          <div ng:contenteditable="html"></div>
          <hr/>
          HTML: <br/>
          <textarea ng:model="html" cols=80></textarea>
          <hr/>
          <pre>editorForm = {{editorForm}}</pre>
        </form>
      </doc:source>
      <doc:scenario>
        it('should enter invalid HTML', function() {
          expect(element('form[name=editorForm]').prop('className')).toMatch(/ng-valid/);
          input('html').enter('<');
          expect(element('form[name=editorForm]').prop('className')).toMatch(/ng-invalid/);
        });
      </doc:scenario>
    </doc:example>
 */
angularServiceInject('$formFactory', function() {


  /**
   * @ngdoc proprety
   * @name rootForm
   * @propertyOf angular.service.$formFactory
   * @description
   * Static property on `$formFactory`
   *
   * Each application ({@link guide/dev_guide.scopes.internals root scope}) gets a root form which
   * is the top-level parent of all forms.
   */
  formFactory.rootForm = formFactory(this);


  /**
   * @ngdoc method
   * @name forElement
   * @methodOf angular.service.$formFactory
   * @description
   * Static method on `$formFactory` service.
   *
   * Retrieve the closest form for a given element or defaults to the `root` form. Used by the
   * {@link angular.widget.form form} element.
   * @param {Element} element The element where the search for form should initiate.
   */
  formFactory.forElement = function(element) {
    return element.inheritedData('$form') || formFactory.rootForm;
  };
  return formFactory;

  function formFactory(parent) {
    return (parent || formFactory.rootForm).$new(FormController);
  }

});

function propertiesUpdate(widget) {
  widget.$valid = !(widget.$invalid =
    !(widget.$readonly || widget.$disabled || equals(widget.$error, {})));
}

/**
 * @ngdoc property
 * @name $error
 * @propertyOf angular.service.$formFactory
 * @description
 * Property of the form and widget instance.
 *
 * Summary of all of the errors on the page. If a widget emits `$invalid` with `REQUIRED` key,
 * then the `$error` object will have a `REQUIRED` key with an array of widgets which have
 * emitted this key. `form.$error.REQUIRED == [ widget ]`.
 */

/**
 * @workInProgress
 * @ngdoc property
 * @name $invalid
 * @propertyOf angular.service.$formFactory
 * @description
 * Property of the form and widget instance.
 *
 * True if any of the widgets of the form are invalid.
 */

/**
 * @workInProgress
 * @ngdoc property
 * @name $valid
 * @propertyOf angular.service.$formFactory
 * @description
 * Property of the form and widget instance.
 *
 * True if all of the widgets of the form are valid.
 */

/**
 * @ngdoc event
 * @name angular.service.$formFactory#$valid
 * @eventOf angular.service.$formFactory
 * @eventType listen on form
 * @description
 * Upon receiving the `$valid` event from the widget update the `$error`, `$valid` and `$invalid`
 * properties of both the widget as well as the from.
 *
 * @param {String} validationKey The validation key to be used when updating the `$error` object.
 *    The validation key is what will allow the template to bind to a specific validation error
 *    such as `<div ng:show="form.$error.KEY">error for key</div>`.
 */

/**
 * @ngdoc event
 * @name angular.service.$formFactory#$invalid
 * @eventOf angular.service.$formFactory
 * @eventType listen on form
 * @description
 * Upon receiving the `$invalid` event from the widget update the `$error`, `$valid` and `$invalid`
 * properties of both the widget as well as the from.
 *
 * @param {String} validationKey The validation key to be used when updating the `$error` object.
 *    The validation key is what will allow the template to bind to a specific validation error
 *    such as `<div ng:show="form.$error.KEY">error for key</div>`.
 */

/**
 * @ngdoc event
 * @name angular.service.$formFactory#$validate
 * @eventOf angular.service.$formFactory
 * @eventType emit on widget
 * @description
 * Emit the `$validate` event on the widget, giving a widget a chance to emit a
 * `$valid` / `$invalid` event base on its state. The `$validate` event is triggered when the
 * model or the view changes.
 */

/**
 * @ngdoc event
 * @name angular.service.$formFactory#$viewChange
 * @eventOf angular.service.$formFactory
 * @eventType listen on widget
 * @description
 * A widget is responsible for emitting this event whenever the view changes do to user interaction.
 * The event takes a `$viewValue` parameter, which is the new value of the view. This
 * event triggers a call to `$parseView()` as well as `$validate` event on widget.
 *
 * @param {*} viewValue The new value for the view which will be assigned to `widget.$viewValue`.
 */

function FormController() {
  var form = this,
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
 * @methodOf angular.service.$formFactory
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
  var form = this,
      modelScope = params.scope,
      onChange = params.onChange,
      alias = params.alias,
      scopeGet = parser(params.model).assignable(),
      scopeSet = scopeGet.assign,
      widget = this.$new(params.controller, params.controllerArgs);

  widget.$error = {};
  // Set the state to something we know will change to get the process going.
  widget.$modelValue = Number.NaN;
  // watch for scope changes and update the view appropriately
  modelScope.$watch(scopeGet, function(scope, value) {
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
