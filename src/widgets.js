'use strict';

/**
 * @workInProgress
 * @ngdoc overview
 * @name angular.widget
 * @description
 *
 * An angular widget can be either a custom attribute that modifies an existing DOM element or an
 * entirely new DOM element.
 *
 * During html compilation, widgets are processed after {@link angular.markup markup}, but before
 * {@link angular.directive directives}.
 *
 * Following is the list of built-in angular widgets:
 *
 * * {@link angular.widget.@ng:format ng:format} - Formats data for display to user and for storage.
 * * {@link angular.widget.@ng:non-bindable ng:non-bindable} - Blocks angular from processing an
 *   HTML element.
 * * {@link angular.widget.@ng:repeat ng:repeat} - Creates and manages a collection of cloned HTML
 *   elements.
 * * {@link angular.widget.@ng:required ng:required} - Verifies presence of user input.
 * * {@link angular.widget.@ng:validate ng:validate} - Validates content of user input.
 * * {@link angular.widget.HTML HTML input elements} - Standard HTML input elements data-bound by
 *   angular.
 * * {@link angular.widget.ng:view ng:view} - Works with $route to "include" partial templates
 * * {@link angular.widget.ng:switch ng:switch} - Conditionally changes DOM structure
 * * {@link angular.widget.ng:include ng:include} - Includes an external HTML fragment
 *
 * For more information about angular widgets, see {@link guide/dev_guide.compiler.widgets
 * Understanding Angular Widgets} in the angular Developer Guide.
 */

/**
 * @workInProgress
 * @ngdoc widget
 * @name angular.widget.HTML
 *
 * @description
 * The most common widgets you will use will be in the form of the
 * standard HTML set. These widgets are bound using the `name` attribute
 * to an expression. In addition, they can have `ng:validate`, `ng:required`,
 * `ng:format`, `ng:change` attribute to further control their behavior.
 *
 * @usageContent
 *   see example below for usage
 *
 *   <input type="text|checkbox|..." ... />
 *   <textarea ... />
 *   <select ...>
 *     <option>...</option>
 *   </select>
 *
 * @example
    <doc:example>
      <doc:source>
        <table style="font-size:.9em;">
          <tr>
            <th>Name</th>
            <th>Format</th>
            <th>HTML</th>
            <th>UI</th>
            <th ng:non-bindable>{{input#}}</th>
          </tr>
          <tr>
            <th>text</th>
            <td>String</td>
            <td><tt>&lt;input type="text" name="input1"&gt;</tt></td>
            <td><input type="text" name="input1" size="4"></td>
            <td><tt>{{input1|json}}</tt></td>
          </tr>
          <tr>
            <th>textarea</th>
            <td>String</td>
            <td><tt>&lt;textarea name="input2"&gt;&lt;/textarea&gt;</tt></td>
            <td><textarea name="input2" cols='6'></textarea></td>
            <td><tt>{{input2|json}}</tt></td>
          </tr>
          <tr>
            <th>radio</th>
            <td>String</td>
            <td><tt>
              &lt;input type="radio" name="input3" value="A"&gt;<br>
              &lt;input type="radio" name="input3" value="B"&gt;
            </tt></td>
            <td>
              <input type="radio" name="input3" value="A">
              <input type="radio" name="input3" value="B">
            </td>
            <td><tt>{{input3|json}}</tt></td>
          </tr>
          <tr>
            <th>checkbox</th>
            <td>Boolean</td>
            <td><tt>&lt;input type="checkbox" name="input4" value="checked"&gt;</tt></td>
            <td><input type="checkbox" name="input4" value="checked"></td>
            <td><tt>{{input4|json}}</tt></td>
          </tr>
          <tr>
            <th>pulldown</th>
            <td>String</td>
            <td><tt>
              &lt;select name="input5"&gt;<br>
              &nbsp;&nbsp;&lt;option value="c"&gt;C&lt;/option&gt;<br>
              &nbsp;&nbsp;&lt;option value="d"&gt;D&lt;/option&gt;<br>
              &lt;/select&gt;<br>
            </tt></td>
            <td>
              <select name="input5">
                <option value="c">C</option>
                <option value="d">D</option>
              </select>
            </td>
            <td><tt>{{input5|json}}</tt></td>
          </tr>
          <tr>
            <th>multiselect</th>
            <td>Array</td>
            <td><tt>
              &lt;select name="input6" multiple size="4"&gt;<br>
              &nbsp;&nbsp;&lt;option value="e"&gt;E&lt;/option&gt;<br>
              &nbsp;&nbsp;&lt;option value="f"&gt;F&lt;/option&gt;<br>
              &lt;/select&gt;<br>
            </tt></td>
            <td>
              <select name="input6" multiple size="4">
                <option value="e">E</option>
                <option value="f">F</option>
              </select>
            </td>
            <td><tt>{{input6|json}}</tt></td>
          </tr>
        </table>
      </doc:source>
      <doc:scenario>

        it('should exercise text', function(){
         input('input1').enter('Carlos');
         expect(binding('input1')).toEqual('"Carlos"');
        });
        it('should exercise textarea', function(){
         input('input2').enter('Carlos');
         expect(binding('input2')).toEqual('"Carlos"');
        });
        it('should exercise radio', function(){
         expect(binding('input3')).toEqual('null');
         input('input3').select('A');
         expect(binding('input3')).toEqual('"A"');
         input('input3').select('B');
         expect(binding('input3')).toEqual('"B"');
        });
        it('should exercise checkbox', function(){
         expect(binding('input4')).toEqual('false');
         input('input4').check();
         expect(binding('input4')).toEqual('true');
        });
        it('should exercise pulldown', function(){
         expect(binding('input5')).toEqual('"c"');
         select('input5').option('d');
         expect(binding('input5')).toEqual('"d"');
        });
        it('should exercise multiselect', function(){
         expect(binding('input6')).toEqual('[]');
         select('input6').options('e');
         expect(binding('input6')).toEqual('["e"]');
         select('input6').options('e', 'f');
         expect(binding('input6')).toEqual('["e","f"]');
        });
      </doc:scenario>
    </doc:example>
 */

function modelAccessor(scope, element) {
  var expr = element.attr('name');
  var exprFn, assignFn;
  if (expr) {
    exprFn = parser(expr).assignable();
    assignFn = exprFn.assign;
    if (!assignFn) throw new Error("Expression '" + expr + "' is not assignable.");
    return {
      get: function() {
        return exprFn(scope);
      },
      set: function(value) {
        if (value !== undefined) {
          assignFn(scope, value);
        }
      }
    };
  }
}

function modelFormattedAccessor(scope, element) {
  var accessor = modelAccessor(scope, element),
      formatterName = element.attr('ng:format') || NOOP,
      formatter = compileFormatter(formatterName);
  if (accessor) {
    return {
      get: function() {
        return formatter.format(scope, accessor.get());
      },
      set: function(value) {
        return accessor.set(formatter.parse(scope, value));
      }
    };
  }
}

function compileValidator(expr) {
  return parser(expr).validator()();
}

function compileFormatter(expr) {
  return parser(expr).formatter()();
}

/**
 * @workInProgress
 * @ngdoc widget
 * @name angular.widget.@ng:validate
 *
 * @description
 * The `ng:validate` attribute widget validates the user input. If the input does not pass
 * validation, the `ng-validation-error` CSS class and the `ng:error` attribute are set on the input
 * element. Check out {@link angular.validator validators} to find out more.
 *
 * @param {string} validator The name of a built-in or custom {@link angular.validator validator} to
 *     to be used.
 *
 * @element INPUT
 * @css ng-validation-error
 *
 * @example
 * This example shows how the input element becomes red when it contains invalid input. Correct
 * the input to make the error disappear.
 *
    <doc:example>
      <doc:source>
        I don't validate:
        <input type="text" name="value" value="NotANumber"><br/>

        I need an integer or nothing:
        <input type="text" name="value" ng:validate="integer"><br/>
      </doc:source>
      <doc:scenario>
         it('should check ng:validate', function(){
           expect(element('.doc-example-live :input:last').attr('className')).
             toMatch(/ng-validation-error/);

           input('value').enter('123');
           expect(element('.doc-example-live :input:last').attr('className')).
             not().toMatch(/ng-validation-error/);
         });
      </doc:scenario>
    </doc:example>
 */
/**
 * @workInProgress
 * @ngdoc widget
 * @name angular.widget.@ng:required
 *
 * @description
 * The `ng:required` attribute widget validates that the user input is present. It is a special case
 * of the {@link angular.widget.@ng:validate ng:validate} attribute widget.
 *
 * @element INPUT
 * @css ng-validation-error
 *
 * @example
 * This example shows how the input element becomes red when it contains invalid input. Correct
 * the input to make the error disappear.
 *
    <doc:example>
      <doc:source>
        I cannot be blank: <input type="text" name="value" ng:required><br/>
      </doc:source>
      <doc:scenario>
       it('should check ng:required', function(){
         expect(element('.doc-example-live :input').attr('className')).toMatch(/ng-validation-error/);
         input('value').enter('123');
         expect(element('.doc-example-live :input').attr('className')).not().toMatch(/ng-validation-error/);
       });
      </doc:scenario>
    </doc:example>
 */
/**
 * @workInProgress
 * @ngdoc widget
 * @name angular.widget.@ng:format
 *
 * @description
 * The `ng:format` attribute widget formats stored data to user-readable text and parses the text
 * back to the stored form. You might find this useful, for example, if you collect user input in a
 * text field but need to store the data in the model as a list. Check out
 * {@link angular.formatter formatters} to learn more.
 *
 * @param {string} formatter The name of the built-in or custom {@link angular.formatter formatter}
 *     to be used.
 *
 * @element INPUT
 *
 * @example
 * This example shows how the user input is converted from a string and internally represented as an
 * array.
 *
    <doc:example>
      <doc:source>
        Enter a comma separated list of items:
        <input type="text" name="list" ng:format="list" value="table, chairs, plate">
        <pre>list={{list}}</pre>
      </doc:source>
      <doc:scenario>
       it('should check ng:format', function(){
         expect(binding('list')).toBe('list=["table","chairs","plate"]');
         input('list').enter(',,, a ,,,');
         expect(binding('list')).toBe('list=["a"]');
       });
      </doc:scenario>
    </doc:example>
 */
function valueAccessor(scope, element) {
  var validatorName = element.attr('ng:validate') || NOOP,
      validator = compileValidator(validatorName),
      requiredExpr = element.attr('ng:required'),
      formatterName = element.attr('ng:format') || NOOP,
      formatter = compileFormatter(formatterName),
      format, parse, lastError, required,
      invalidWidgets = scope.$service('$invalidWidgets') || {markValid:noop, markInvalid:noop};
  if (!validator) throw "Validator named '" + validatorName + "' not found.";
  format = formatter.format;
  parse = formatter.parse;
  if (requiredExpr) {
    scope.$watch(requiredExpr, function(scope, newValue) {
      required = newValue;
      validate();
    });
  } else {
    required = requiredExpr === '';
  }

  element.data($$validate, validate);
  return {
    get: function(){
      if (lastError)
        elementError(element, NG_VALIDATION_ERROR, null);
      try {
        var value = parse(scope, element.val());
        validate();
        return value;
      } catch (e) {
        lastError = e;
        elementError(element, NG_VALIDATION_ERROR, e);
      }
    },
    set: function(value) {
      var oldValue = element.val(),
          newValue = format(scope, value);
      if (oldValue != newValue) {
        element.val(newValue || ''); // needed for ie
      }
      validate();
    }
  };

  function validate() {
    var value = trim(element.val());
    if (element[0].disabled || element[0].readOnly) {
      elementError(element, NG_VALIDATION_ERROR, null);
      invalidWidgets.markValid(element);
    } else {
      var error, validateScope = inherit(scope, {$element:element});
      error = required && !value
              ? 'Required'
              : (value ? validator(validateScope, value) : null);
      elementError(element, NG_VALIDATION_ERROR, error);
      lastError = error;
      if (error) {
        invalidWidgets.markInvalid(element);
      } else {
        invalidWidgets.markValid(element);
      }
    }
  }
}

function checkedAccessor(scope, element) {
  var domElement = element[0], elementValue = domElement.value;
  return {
    get: function(){
      return !!domElement.checked;
    },
    set: function(value){
      domElement.checked = toBoolean(value);
    }
  };
}

function radioAccessor(scope, element) {
  var domElement = element[0];
  return {
    get: function(){
      return domElement.checked ? domElement.value : null;
    },
    set: function(value){
      domElement.checked = value == domElement.value;
    }
  };
}

function optionsAccessor(scope, element) {
  var formatterName = element.attr('ng:format') || NOOP,
      formatter = compileFormatter(formatterName);
  return {
    get: function(){
      var values = [];
      forEach(element[0].options, function(option){
        if (option.selected) values.push(formatter.parse(scope, option.value));
      });
      return values;
    },
    set: function(values){
      var keys = {};
      forEach(values, function(value){
        keys[formatter.format(scope, value)] = true;
      });
      forEach(element[0].options, function(option){
        option.selected = keys[option.value];
      });
    }
  };
}

function noopAccessor() { return { get: noop, set: noop }; }

/*
 * TODO: refactor
 *
 * The table below is not quite right. In some cases the formatter is on the model side
 * and in some cases it is on the view side. This is a historical artifact
 *
 * The concept of model/view accessor is useful for anyone who is trying to develop UI, and
 * so it should be exposed to others. There should be a form object which keeps track of the
 * accessors and also acts as their factory. It should expose it as an object and allow
 * the validator to publish errors to it, so that the the error messages can be bound to it.
 *
 */
var textWidget = inputWidget('keydown change', modelAccessor, valueAccessor, initWidgetValue(), true),
    INPUT_TYPE = {
      'text':            textWidget,
      'textarea':        textWidget,
      'hidden':          textWidget,
      'password':        textWidget,
      'checkbox':        inputWidget('click', modelFormattedAccessor, checkedAccessor, initWidgetValue(false)),
      'radio':           inputWidget('click', modelFormattedAccessor, radioAccessor, radioInit),
      'select-one':      inputWidget('change', modelAccessor, valueAccessor, initWidgetValue(null)),
      'select-multiple': inputWidget('change', modelAccessor, optionsAccessor, initWidgetValue([]))
//      'file':            fileWidget???
    };


function initWidgetValue(initValue) {
  return function (model, view) {
    var value = view.get();
    if (!value && isDefined(initValue)) {
      value = copy(initValue);
    }
    if (isUndefined(model.get()) && isDefined(value)) {
      model.set(value);
    }
  };
}

function radioInit(model, view, element) {
 var modelValue = model.get(), viewValue = view.get(), input = element[0];
 input.checked = false;
 input.name = this.$id + '@' + input.name;
 if (isUndefined(modelValue)) {
   model.set(modelValue = null);
 }
 if (modelValue == null && viewValue !== null) {
   model.set(viewValue);
 }
 view.set(modelValue);
}

/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:change
 *
 * @description
 * The directive executes an expression whenever the input widget changes.
 *
 * @element INPUT
 * @param {expression} expression to execute.
 *
 * @example
 * @example
    <doc:example>
      <doc:source>
        <div ng:init="checkboxCount=0; textCount=0"></div>
        <input type="text" name="text" ng:change="textCount = 1 + textCount">
           changeCount {{textCount}}<br/>
        <input type="checkbox" name="checkbox" ng:change="checkboxCount = 1 + checkboxCount">
           changeCount {{checkboxCount}}<br/>
      </doc:source>
      <doc:scenario>
         it('should check ng:change', function(){
           expect(binding('textCount')).toBe('0');
           expect(binding('checkboxCount')).toBe('0');

           using('.doc-example-live').input('text').enter('abc');
           expect(binding('textCount')).toBe('1');
           expect(binding('checkboxCount')).toBe('0');


           using('.doc-example-live').input('checkbox').check();
           expect(binding('textCount')).toBe('1');
           expect(binding('checkboxCount')).toBe('1');
         });
      </doc:scenario>
    </doc:example>
 */
function inputWidget(events, modelAccessor, viewAccessor, initFn, textBox) {
  return annotate('$defer', function($defer, element) {
    var scope = this,
        model = modelAccessor(scope, element),
        view = viewAccessor(scope, element),
        ngChange = element.attr('ng:change') || noop,
        lastValue;
    if (model) {
      initFn.call(scope, model, view, element);
      scope.$eval(element.attr('ng:init') || noop);
      element.bind(events, function(event){
        function handler(){
          var value = view.get();
          if (!textBox || value != lastValue) {
            model.set(value);
            lastValue = model.get();
            scope.$eval(ngChange);
          }
        }
        event.type == 'keydown' ? $defer(handler) : scope.$apply(handler);
      });
      scope.$watch(model.get, function(scope, value) {
        if (!equals(lastValue, value)) {
          view.set(lastValue = value);
        }
      });
    }
  });
}

function inputWidgetSelector(element){
  this.directives(true);
  this.descend(true);
  return INPUT_TYPE[lowercase(element[0].type)] || noop;
}

angularWidget('input', inputWidgetSelector);
angularWidget('textarea', inputWidgetSelector);


/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:options
 *
 * @description
 * Dynamically generate a list of `<option>` elements for a `<select>` element using an array or
 * an object obtained by evaluating the `ng:options` expression.
 *
 * When an item in the select menu is select, the value of array element or object property
 * represented by the selected option will be bound to the model identified by the `name` attribute
 * of the parent select element.
 *
 * Optionally, a single hard-coded `<option>` element, with the value set to an empty string, can
 * be nested into the `<select>` element. This element will then represent `null` or "not selected"
 * option. See example below for demonstration.
 *
 * Note: `ng:options` provides iterator facility for `<option>` element which must be used instead
 * of {@link angular.widget.@ng:repeat ng:repeat}. `ng:repeat` is not suitable for use with
 * `<option>` element because of the following reasons:
 *
 *   * value attribute of the option element that we need to bind to requires a string, but the
 *     source of data for the iteration might be in a form of array containing objects instead of
 *     strings
 *   * {@link angular.widget.@ng:repeat ng:repeat} unrolls after the select binds causing
 *     incorect rendering on most browsers.
 *   * binding to a value not in list confuses most browsers.
 *
 * @element select
 * @param {comprehension_expression} comprehension in one of the following forms:
 *
 *   * for array data sources:
 *     * `label` **`for`** `value` **`in`** `array`
 *     * `select` **`as`** `label` **`for`** `value` **`in`** `array`
 *     * `label`  **`group by`** `group` **`for`** `value` **`in`** `array`
 *     * `select` **`as`** `label` **`group by`** `group` **`for`** `value` **`in`** `array`
 *   * for object data sources:
 *     * `label` **`for (`**`key` **`,`** `value`**`) in`** `object`
 *     * `select` **`as`** `label` **`for (`**`key` **`,`** `value`**`) in`** `object`
 *     * `label` **`group by`** `group` **`for (`**`key`**`,`** `value`**`) in`** `object`
 *     * `select` **`as`** `label` **`group by`** `group`
 *         **`for` `(`**`key`**`,`** `value`**`) in`** `object`
 *
 * Where:
 *
 *   * `array` / `object`: an expression which evaluates to an array / object to iterate over.
 *   * `value`: local variable which will refer to each item in the `array` or each property value
 *      of `object` during iteration.
 *   * `key`: local variable which will refer to a property name in `object` during iteration.
 *   * `label`: The result of this expression will be the label for `<option>` element. The
 *     `expression` will most likely refer to the `value` variable (e.g. `value.propertyName`).
 *   * `select`: The result of this expression will be bound to the model of the parent `<select>`
 *      element. If not specified, `select` expression will default to `value`.
 *   * `group`: The result of this expression will be used to group options using the `<optgroup>`
 *      DOM element.
 *
 * @example
    <doc:example>
      <doc:source>
        <script>
        function MyCntrl(){
          this.colors = [
            {name:'black', shade:'dark'},
            {name:'white', shade:'light'},
            {name:'red', shade:'dark'},
            {name:'blue', shade:'dark'},
            {name:'yellow', shade:'light'}
          ];
          this.color = this.colors[2]; // red
        }
        </script>
        <div ng:controller="MyCntrl">
          <ul>
            <li ng:repeat="color in colors">
              Name: <input name="color.name">
              [<a href ng:click="colors.$remove(color)">X</a>]
            </li>
            <li>
              [<a href ng:click="colors.push({})">add</a>]
            </li>
          </ul>
          <hr/>
          Color (null not allowed):
          <select name="color" ng:options="c.name for c in colors"></select><br>

          Color (null allowed):
          <div  class="nullable">
            <select name="color" ng:options="c.name for c in colors">
              <option value="">-- chose color --</option>
            </select>
          </div><br/>

          Color grouped by shade:
          <select name="color" ng:options="c.name group by c.shade for c in colors">
          </select><br/>


          Select <a href ng:click="color={name:'not in list'}">bogus</a>.<br>
          <hr/>
          Currently selected: {{ {selected_color:color}  }}
          <div style="border:solid 1px black; height:20px"
               ng:style="{'background-color':color.name}">
          </div>
        </div>
      </doc:source>
      <doc:scenario>
         it('should check ng:options', function(){
           expect(binding('color')).toMatch('red');
           select('color').option('0');
           expect(binding('color')).toMatch('black');
           using('.nullable').select('color').option('');
           expect(binding('color')).toMatch('null');
         });
      </doc:scenario>
    </doc:example>
 */
//                       00001111100000000000222200000000000000000000003333000000000000044444444444444444000000000555555555555555550000000666666666666666660000000000000007777
var NG_OPTIONS_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w\d]*)|(?:\(\s*([\$\w][\$\w\d]*)\s*,\s*([\$\w][\$\w\d]*)\s*\)))\s+in\s+(.*)$/;
angularWidget('select', function(element){
  this.descend(true);
  this.directives(true);

  var isMultiselect = element.attr('multiple'),
      expression = element.attr('ng:options'),
      onChange = expressionCompile(element.attr('ng:change') || ""),
      match;

  if (!expression) {
    return inputWidgetSelector.call(this, element);
  }
  if (! (match = expression.match(NG_OPTIONS_REGEXP))) {
    throw Error(
      "Expected ng:options in form of '_select_ (as _label_)? for (_key_,)?_value_ in _collection_'" +
      " but got '" + expression + "'.");
  }

  var displayFn = expressionCompile(match[2] || match[1]),
      valueName = match[4] || match[6],
      keyName = match[5],
      groupByFn = expressionCompile(match[3] || ''),
      valueFn = expressionCompile(match[2] ? match[1] : valueName),
      valuesFn = expressionCompile(match[7]),
      // we can't just jqLite('<option>') since jqLite is not smart enough
      // to create it in <select> and IE barfs otherwise.
      optionTemplate = jqLite(document.createElement('option')),
      optGroupTemplate = jqLite(document.createElement('optgroup')),
      nullOption = false; // if false then user will not be able to select it

  return function(selectElement){

    // This is an array of array of existing option groups in DOM. We try to reuse these if possible
    // optionGroupsCache[0] is the options with no option group
    // optionGroupsCache[?][0] is the parent: either the SELECT or OPTGROUP element
    var optionGroupsCache = [[{element: selectElement, label:''}]],
        scope = this,
        model = modelAccessor(scope, element);

    // find existing special options
    forEach(selectElement.children(), function(option){
      if (option.value == '')
        // User is allowed to select the null.
        nullOption = {label:jqLite(option).text(), id:''};
    });
    selectElement.html(''); // clear contents

    selectElement.bind('change', function(){
      var optionGroup,
          collection = valuesFn(scope) || [],
          key = selectElement.val(),
          tempScope = scope.$new(),
          value, optionElement, index, groupIndex, length, groupLength;

      try {
        if (isMultiselect) {
          value = [];
          for (groupIndex = 0, groupLength = optionGroupsCache.length;
               groupIndex < groupLength;
               groupIndex++) {
            // list of options for that group. (first item has the parent)
            optionGroup = optionGroupsCache[groupIndex];

            for(index = 1, length = optionGroup.length; index < length; index++) {
              if ((optionElement = optionGroup[index].element)[0].selected) {
                if (keyName) tempScope[keyName] = key;
                tempScope[valueName] = collection[optionElement.val()];
                value.push(valueFn(tempScope));
              }
            }
          }
        } else {
          if (key == '?') {
            value = undefined;
          } else if (key == ''){
            value = null;
          } else {
            tempScope[valueName] = collection[key];
            if (keyName) tempScope[keyName] = key;
            value = valueFn(tempScope);
          }
        }
        if (isDefined(value) && model.get() !== value) {
          model.set(value);
          onChange(scope);
        }
        scope.$root.$apply();
      } finally {
        tempScope = null; // TODO(misko): needs to be $destroy
      }
    });

    scope.$watch(function(scope) {
      var optionGroups = {'':[]}, // Temporary location for the option groups before we render them
          optionGroupNames = [''],
          optionGroupName,
          optionGroup,
          option,
          existingParent, existingOptions, existingOption,
          values = valuesFn(scope) || [],
          keys = values,
          key,
          groupLength, length,
          fragment,
          groupIndex, index,
          optionElement,
          optionScope = scope.$new(),
          modelValue = model.get(),
          selected,
          selectedSet = false, // nothing is selected yet
          isMulti = isMultiselect,
          lastElement,
          element;

      try {
        if (isMulti) {
          selectedSet = new HashMap();
          if (modelValue && isNumber(length = modelValue.length)) {
            for (index = 0; index < length; index++) {
              selectedSet.put(modelValue[index], true);
            }
          }
        } else if (modelValue === null || nullOption) {
          // if we are not multiselect, and we are null then we have to add the nullOption
          optionGroups[''].push(extend({selected:modelValue === null, id:'', label:''}, nullOption));
          selectedSet = true;
        }

        // If we have a keyName then we are iterating over on object. Grab the keys and sort them.
        if(keyName) {
          keys = [];
          for (key in values) {
            if (values.hasOwnProperty(key))
              keys.push(key);
          }
          keys.sort();
        }

        // We now build up the list of options we need (we merge later)
        for (index = 0; length = keys.length, index < length; index++) {
          optionScope[valueName] = values[keyName ? optionScope[keyName]=keys[index]:index];
          optionGroupName = groupByFn(optionScope) || '';
          if (!(optionGroup = optionGroups[optionGroupName])) {
            optionGroup = optionGroups[optionGroupName] = [];
            optionGroupNames.push(optionGroupName);
          }
          if (isMulti) {
            selected = !!selectedSet.remove(valueFn(optionScope));
          } else {
            selected = modelValue === valueFn(optionScope);
            selectedSet = selectedSet || selected; // see if at least one item is selected
          }
          optionGroup.push({
              id: keyName ? keys[index] : index,   // either the index into array or key from object
              label: displayFn(optionScope) || '', // what will be seen by the user
              selected: selected                   // determine if we should be selected
            });
        }
        optionGroupNames.sort();
        if (!isMulti && !selectedSet) {
          // nothing was selected, we have to insert the undefined item
          optionGroups[''].unshift({id:'?', label:'', selected:true});
        }

        // Now we need to update the list of DOM nodes to match the optionGroups we computed above
        for (groupIndex = 0, groupLength = optionGroupNames.length;
             groupIndex < groupLength;
             groupIndex++) {
          // current option group name or '' if no group
          optionGroupName = optionGroupNames[groupIndex];

          // list of options for that group. (first item has the parent)
          optionGroup = optionGroups[optionGroupName];

          if (optionGroupsCache.length <= groupIndex) {
            // we need to grow the optionGroups
            optionGroupsCache.push(
                existingOptions = [
                  existingParent = {
                      element: optGroupTemplate.clone().attr('label', optionGroupName),
                      label: optionGroup.label
                    }
                ]
            );
            selectElement.append(existingParent.element);
          } else {
            existingOptions = optionGroupsCache[groupIndex];
            existingParent = existingOptions[0];  // either SELECT (no group) or OPTGROUP element

            // update the OPTGROUP label if not the same.
            if (existingParent.label != optionGroupName) {
              existingParent.element.attr('label', existingParent.label = optionGroupName);
            }
          }

          lastElement = null;  // start at the begining
          for(index = 0, length = optionGroup.length; index < length; index++) {
            option = optionGroup[index];
            if ((existingOption = existingOptions[index+1])) {
              // reuse elements
              lastElement = existingOption.element;
              if (existingOption.label !== option.label) {
                lastElement.text(existingOption.label = option.label);
              }
              if (existingOption.id !== option.id) {
                lastElement.val(existingOption.id = option.id);
              }
              if (existingOption.selected !== option.selected) {
                lastElement.attr('selected', option.selected);
              }
            } else {
              // grow elements
              // jQuery(v1.4.2) Bug: We should be able to chain the method calls, but
              // in this version of jQuery on some browser the .text() returns a string
              // rather then the element.
              (element = optionTemplate.clone())
                .val(option.id)
                .attr('selected', option.selected)
                .text(option.label);
              existingOptions.push(existingOption = {
                element: element,
                label: option.label,
                id: option.id,
                checked: option.selected
              });
              if (lastElement) {
                lastElement.after(element);
              } else {
                existingParent.element.append(element);
              }
              lastElement = element;
            }
          }
          // remove any excessive OPTIONs in a group
          index++; // increment since the existingOptions[0] is parent element not OPTION
          while(existingOptions.length > index) {
            existingOptions.pop().element.remove();
          }
        }
        // remove any excessive OPTGROUPs from select
        while(optionGroupsCache.length > groupIndex) {
          optionGroupsCache.pop()[0].element.remove();
        }
      } finally {
        optionScope.$destroy();
      }
    });
  };
});


/**
 * @workInProgress
 * @ngdoc widget
 * @name angular.widget.ng:include
 *
 * @description
 * Fetches, compiles and includes an external HTML fragment.
 *
 * Keep in mind that Same Origin Policy applies to included resources
 * (e.g. ng:include won't work for file:// access).
 *
 * @param {string} src angular expression evaluating to URL. If the source is a string constant,
 *                 make sure you wrap it in quotes, e.g. `src="'myPartialTemplate.html'"`.
 * @param {Scope=} [scope=new_child_scope] optional expression which evaluates to an
 *                 instance of angular.scope to set the HTML fragment to.
 * @param {string=} onload Expression to evaluate when a new partial is loaded.
 *
 * @example
    <doc:example>
      <doc:source jsfiddle="false">
       <select name="url">
        <option value="examples/ng-include/template1.html">template1.html</option>
        <option value="examples/ng-include/template2.html">template2.html</option>
        <option value="">(blank)</option>
       </select>
       url of the template: <tt><a href="{{url}}">{{url}}</a></tt>
       <hr/>
       <ng:include src="url"></ng:include>
      </doc:source>
      <doc:scenario>
        it('should load template1.html', function(){
         expect(element('.doc-example-live ng\\:include').text()).
           toBe('Content of template1.html\n');
        });
        it('should load template2.html', function(){
         select('url').option('examples/ng-include/template2.html');
         expect(element('.doc-example-live ng\\:include').text()).
           toBe('Content of template2.html\n');
        });
        it('should change to blank', function(){
         select('url').option('');
         expect(element('.doc-example-live ng\\:include').text()).toEqual('');
        });
      </doc:scenario>
    </doc:example>
 */
angularWidget('ng:include', function(element){
  var compiler = this,
      srcExp = element.attr("src"),
      scopeExp = element.attr("scope") || '',
      onloadExp = element[0].getAttribute('onload') || ''; //workaround for jquery bug #7537
  if (element[0]['ng:compiled']) {
    this.descend(true);
    this.directives(true);
  } else {
    element[0]['ng:compiled'] = true;
    return extend(function(xhr, element){
      var scope = this,
          changeCounter = 0,
          releaseScopes = [],
          childScope,
          oldScope;

      function incrementChange(){ changeCounter++;}
      this.$watch(srcExp, incrementChange);
      this.$watch(function(scope){
        var newScope = scope.$eval(scopeExp);
        if (newScope !== oldScope) {
          oldScope = newScope;
          incrementChange();
        }
      });
      this.$watch(function(){return changeCounter;}, function(scope) {
        var src = scope.$eval(srcExp),
            useScope = scope.$eval(scopeExp);

        while(releaseScopes.length) {
          releaseScopes.pop().$destroy();
        }
        if (src) {
          xhr('GET', src, null, function(code, response){
            element.html(response);
            if (useScope) {
              childScope = useScope;
            } else {
              releaseScopes.push(childScope = scope.$new());
            }
            compiler.compile(element)(childScope);
            scope.$eval(onloadExp);
          }, false, true);
        } else {
          childScope = null;
          element.html('');
        }
      });
    }, {$inject:['$xhr.cache']});
  }
});

/**
 * @workInProgress
 * @ngdoc widget
 * @name angular.widget.ng:switch
 *
 * @description
 * Conditionally change the DOM structure.
 *
 * @usageContent
 * <any ng:switch-when="matchValue1">...</any>
 *   <any ng:switch-when="matchValue2">...</any>
 *   ...
 *   <any ng:switch-default>...</any>
 *
 * @param {*} on expression to match against <tt>ng:switch-when</tt>.
 * @paramDescription
 * On child elments add:
 *
 * * `ng:switch-when`: the case statement to match against. If match then this
 *   case will be displayed.
 * * `ng:switch-default`: the default case when no other casses match.
 *
 * @example
    <doc:example>
      <doc:source>
        <select name="switch">
          <option>settings</option>
          <option>home</option>
          <option>other</option>
        </select>
        <tt>switch={{switch}}</tt>
        </hr>
        <ng:switch on="switch" >
          <div ng:switch-when="settings">Settings Div</div>
          <span ng:switch-when="home">Home Span</span>
          <span ng:switch-default>default</span>
        </ng:switch>
        </code>
      </doc:source>
      <doc:scenario>
        it('should start in settings', function(){
         expect(element('.doc-example-live ng\\:switch').text()).toEqual('Settings Div');
        });
        it('should change to home', function(){
         select('switch').option('home');
         expect(element('.doc-example-live ng\\:switch').text()).toEqual('Home Span');
        });
        it('should select deafault', function(){
         select('switch').option('other');
         expect(element('.doc-example-live ng\\:switch').text()).toEqual('default');
        });
      </doc:scenario>
    </doc:example>
 */
angularWidget('ng:switch', function (element) {
  var compiler = this,
      watchExpr = element.attr("on"),
      changeExpr = element.attr('change'),
      casesTemplate = {},
      defaultCaseTemplate,
      children = element.children(),
      length = children.length,
      child,
      when;

  if (!watchExpr) throw new Error("Missing 'on' attribute.");
  while(length--) {
    child = jqLite(children[length]);
    // this needs to be here for IE
    child.remove();
    when = child.attr('ng:switch-when');
    if (isString(when)) {
      casesTemplate[when] = compiler.compile(child);
    } else if (isString(child.attr('ng:switch-default'))) {
      defaultCaseTemplate = compiler.compile(child);
    }
  }
  children = null; // release memory;
  element.html('');

  return function(element){
    var changeCounter = 0;
    var childScope;
    var selectedTemplate;

    this.$watch(watchExpr, function(scope, value) {
      element.html('');
      if ((selectedTemplate = casesTemplate[value] || defaultCaseTemplate)) {
        changeCounter++;
        if (childScope) childScope.$destroy();
        childScope = scope.$new();
        childScope.$eval(changeExpr);
      }
    });

    this.$watch(function(){return changeCounter;}, function() {
      element.html('');
      if (selectedTemplate) {
        selectedTemplate(childScope, function(caseElement) {
          element.append(caseElement);
        });
      }
    });
  };
});


/*
 * Modifies the default behavior of html A tag, so that the default action is prevented when href
 * attribute is empty.
 *
 * The reasoning for this change is to allow easy creation of action links with ng:click without
 * changing the location or causing page reloads, e.g.:
 * <a href="" ng:click="model.$save()">Save</a>
 */
angularWidget('a', function() {
  this.descend(true);
  this.directives(true);

  return function(element) {
    var hasNgHref = ((element.attr('ng:bind-attr') || '').indexOf('"href":') !== -1);

    // turn <a href ng:click="..">link</a> into a link in IE
    // but only if it doesn't have name attribute, in which case it's an anchor
    if (!hasNgHref && !element.attr('name') && !element.attr('href')) {
      element.attr('href', '');
    }

    if (element.attr('href') === '' && !hasNgHref) {
      element.bind('click', function(event){
        event.preventDefault();
      });
    }
  };
});


/**
 * @workInProgress
 * @ngdoc widget
 * @name angular.widget.@ng:repeat
 *
 * @description
 * The `ng:repeat` widget instantiates a template once per item from a collection. The collection is
 * enumerated with the `ng:repeat-index` attribute, starting from 0. Each template instance gets
 * its own scope, where the given loop variable is set to the current collection item, and `$index`
 * is set to the item index or key.
 *
 * Special properties are exposed on the local scope of each template instance, including:
 *
 *   * `$index` – `{number}` – iterator offset of the repeated element (0..length-1)
 *   * `$position` – `{string}` – position of the repeated element in the iterator. One of:
 *        * `'first'`,
 *        * `'middle'`
 *        * `'last'`
 *
 * Note: Although `ng:repeat` looks like a directive, it is actually an attribute widget.
 *
 * @element ANY
 * @param {string} repeat_expression The expression indicating how to enumerate a collection. Two
 *   formats are currently supported:
 *
 *   * `variable in expression` – where variable is the user defined loop variable and `expression`
 *     is a scope expression giving the collection to enumerate.
 *
 *     For example: `track in cd.tracks`.
 *
 *   * `(key, value) in expression` – where `key` and `value` can be any user defined identifiers,
 *     and `expression` is the scope expression giving the collection to enumerate.
 *
 *     For example: `(name, age) in {'adam':10, 'amalie':12}`.
 *
 * @example
 * This example initializes the scope to a list of names and
 * then uses `ng:repeat` to display every person:
    <doc:example>
      <doc:source>
        <div ng:init="friends = [{name:'John', age:25}, {name:'Mary', age:28}]">
          I have {{friends.length}} friends. They are:
          <ul>
            <li ng:repeat="friend in friends">
              [{{$index + 1}}] {{friend.name}} who is {{friend.age}} years old.
            </li>
          </ul>
        </div>
      </doc:source>
      <doc:scenario>
         it('should check ng:repeat', function(){
           var r = using('.doc-example-live').repeater('ul li');
           expect(r.count()).toBe(2);
           expect(r.row(0)).toEqual(["1","John","25"]);
           expect(r.row(1)).toEqual(["2","Mary","28"]);
         });
      </doc:scenario>
    </doc:example>
 */
angularWidget('@ng:repeat', function(expression, element){
  element.removeAttr('ng:repeat');
  element.replaceWith(jqLite('<!-- ng:repeat: ' + expression + ' -->'));
  var linker = this.compile(element);
  return function(iterStartElement){
    var match = expression.match(/^\s*(.+)\s+in\s+(.*)\s*$/),
        lhs, rhs, valueIdent, keyIdent;
    if (! match) {
      throw Error("Expected ng:repeat in form of '_item_ in _collection_' but got '" +
      expression + "'.");
    }
    lhs = match[1];
    rhs = match[2];
    match = lhs.match(/^([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\)$/);
    if (!match) {
      throw Error("'item' in 'item in collection' should be identifier or (key, value) but got '" +
      keyValue + "'.");
    }
    valueIdent = match[3] || match[1];
    keyIdent = match[2];

    var childScopes = [];
    var childElements = [iterStartElement];
    var parentScope = this;
    this.$watch(function(scope){
      var index = 0,
          childCount = childScopes.length,
          collection = scope.$eval(rhs),
          collectionLength = size(collection, true),
          fragment = document.createDocumentFragment(),
          addFragmentTo = (childCount < collectionLength) ? childElements[childCount] : null,
          childScope,
          key;

      for (key in collection) {
        if (collection.hasOwnProperty(key)) {
          if (index < childCount) {
            // reuse existing child
            childScope = childScopes[index];
            childScope[valueIdent] = collection[key];
            if (keyIdent) childScope[keyIdent] = key;
            childScope.$position = index == 0
                ? 'first'
                : (index == collectionLength - 1 ? 'last' : 'middle');
            childScope.$eval();
          } else {
            // grow children
            childScope = parentScope.$new();
            childScope[valueIdent] = collection[key];
            if (keyIdent) childScope[keyIdent] = key;
            childScope.$index = index;
            childScope.$position = index == 0
                ? 'first'
                : (index == collectionLength - 1 ? 'last' : 'middle');
            childScopes.push(childScope);
            linker(childScope, function(clone){
              clone.attr('ng:repeat-index', index);
              fragment.appendChild(clone[0]);
              // TODO(misko): Temporary hack - maybe think about it - removed after we add fragment after $digest()
              // This causes double $digest for children
              // The first flush will couse a lot of DOM access (initial)
              // Second flush shuld be noop since nothing has change hence no DOM access.
              childScope.$digest();
              childElements[index + 1] = clone;
            });
          }
          index ++;
        }
      }

      //attach new nodes buffered in doc fragment
      if (addFragmentTo) {
        // TODO(misko): For performance reasons, we should do the addition after all other widgets
        // have run. For this should happend after $digest() is done!
        addFragmentTo.after(jqLite(fragment));
      }

      // shrink children
      while(childScopes.length > index) {
        // can not use $destroy(true) since  there may be multiple iterators on same parent.
        childScopes.pop().$destroy();
        childElements.pop().remove();
      }
    });
  };
});


/**
 * @workInProgress
 * @ngdoc widget
 * @name angular.widget.@ng:non-bindable
 *
 * @description
 * Sometimes it is necessary to write code which looks like bindings but which should be left alone
 * by angular. Use `ng:non-bindable` to make angular ignore a chunk of HTML.
 *
 * Note: `ng:non-bindable` looks like a directive, but is actually an attribute widget.
 *
 * @element ANY
 *
 * @example
 * In this example there are two location where a simple binding (`{{}}`) is present, but the one
 * wrapped in `ng:non-bindable` is left alone.
 *
 * @example
    <doc:example>
      <doc:source>
        <div>Normal: {{1 + 2}}</div>
        <div ng:non-bindable>Ignored: {{1 + 2}}</div>
      </doc:source>
      <doc:scenario>
       it('should check ng:non-bindable', function(){
         expect(using('.doc-example-live').binding('1 + 2')).toBe('3');
         expect(using('.doc-example-live').element('div:last').text()).
           toMatch(/1 \+ 2/);
       });
      </doc:scenario>
    </doc:example>
 */
angularWidget("@ng:non-bindable", noop);


/**
 * @ngdoc widget
 * @name angular.widget.ng:view
 *
 * @description
 * # Overview
 * `ng:view` is a widget that complements the {@link angular.service.$route $route} service by
 * including the rendered template of the current route into the main layout (`index.html`) file.
 * Every time the current route changes, the included view changes with it according to the
 * configuration of the `$route` service.
 *
 * This widget provides functionality similar to {@link angular.widget.ng:include ng:include} when
 * used like this:
 *
 *     <ng:include src="$route.current.template" scope="$route.current.scope"></ng:include>
 *
 *
 * # Advantages
 * Compared to `ng:include`, `ng:view` offers these advantages:
 *
 * - shorter syntax
 * - more efficient execution
 * - doesn't require `$route` service to be available on the root scope
 *
 *
 * @example
    <doc:example>
      <doc:source jsfiddle="false">
         <script>
           function MyCtrl($route) {
             $route.when('/overview',
               { controller: OverviewCtrl,
                 template: 'guide/dev_guide.overview.html'});
             $route.when('/bootstrap',
               { controller: BootstrapCtrl,
                 template: 'guide/dev_guide.bootstrap.auto_bootstrap.html'});
           };
           MyCtrl.$inject = ['$route'];

           function BootstrapCtrl(){}
           function OverviewCtrl(){}
         </script>
         <div ng:controller="MyCtrl">
           <a href="#/overview">overview</a> |
           <a href="#/bootstrap">bootstrap</a> |
           <a href="#/undefined">undefined</a>

           <br/>

           The view is included below:
           <hr/>
           <ng:view></ng:view>
         </div>
      </doc:source>
      <doc:scenario>
        it('should load templates', function(){
          element('.doc-example-live a:contains(overview)').click();
          expect(element('.doc-example-live ng\\:view').text()).toMatch(/Developer Guide: Overview/);

          element('.doc-example-live a:contains(bootstrap)').click();
          expect(element('.doc-example-live ng\\:view').text()).toMatch(/Developer Guide: Initializing Angular: Automatic Initiialization/);
        });
      </doc:scenario>
    </doc:example>
 */
angularWidget('ng:view', function(element) {
  var compiler = this;

  if (!element[0]['ng:compiled']) {
    element[0]['ng:compiled'] = true;
    return annotate('$xhr.cache', '$route', function($xhr, $route, element){
      var template;
      var changeCounter = 0;

      this.$on('$afterRouteChange', function(){
        changeCounter++;
      });

      this.$watch(function(){return changeCounter;}, function() {
        var template = $route.current && $route.current.template;
        if (template) {
          //xhr's callback must be async, see commit history for more info
          $xhr('GET', template, function(code, response) {
            element.html(response);
            compiler.compile(element)($route.current.scope);
          });
        } else {
          element.html('');
        }
      });
    });
  } else {
    compiler.descend(true);
    compiler.directives(true);
  }
});


/**
 * @ngdoc widget
 * @name angular.widget.ng:pluralize
 *
 * @description
 * # Overview
 * ng:pluralize is a widget that displays messages according to en-US localization rules.
 * These rules are bundled with angular.js and the rules can be overridden
 * (see {@link guide/dev_guide.i18n Angular i18n} dev guide). You configure ng:pluralize by
 * specifying the mappings between
 * {@link http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
 * plural categories} and the strings to be displayed.
 *
 * # Plural categories and explicit number rules
 * There are two
 * {@link http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
 * plural categories} in Angular's default en-US locale: "one" and "other".
 *
 * While a pural category may match many numbers (for example, in en-US locale, "other" can match
 * any number that is not 1), an explicit number rule can only match one number. For example, the
 * explicit number rule for "3" matches the number 3. You will see the use of plural categories
 * and explicit number rules throughout later parts of this documentation.
 *
 * # Configuring ng:pluralize
 * You configure ng:pluralize by providing 2 attributes: `count` and `when`.
 * You can also provide an optional attribute, `offset`.
 *
 * The value of the `count` attribute can be either a string or an {@link guide/dev_guide.expressions
 * Angular expression}; these are evaluated on the current scope for its binded value.
 *
 * The `when` attribute specifies the mappings between plural categories and the actual
 * string to be displayed. The value of the attribute should be a JSON object so that Angular
 * can interpret it correctly.
 *
 * The following example shows how to configure ng:pluralize:
 *
 * <pre>
 * <ng:pluralize count="personCount"
                 when="{'0': 'Nobody is viewing.',
 *                      'one': '1 person is viewing.',
 *                      'other': '{} people are viewing.'}">
 * </ng:pluralize>
 *</pre>
 *
 * In the example, `"0: Nobody is viewing."` is an explicit number rule. If you did not
 * specify this rule, 0 would be matched to the "other" category and "0 people are viewing"
 * would be shown instead of "Nobody is viewing". You can specify an explicit number rule for
 * other numbers, for example 12, so that instead of showing "12 people are viewing", you can
 * show "a dozen people are viewing".
 *
 * You can use a set of closed braces(`{}`) as a placeholder for the number that you want substituted
 * into pluralized strings. In the previous example, Angular will replace `{}` with
 * <span ng:non-bindable>`{{personCount}}`</span>. The closed braces `{}` is a placeholder
 * for <span ng:non-bindable>{{numberExpression}}</span>.
 *
 * # Configuring ng:pluralize with offset
 * The `offset` attribute allows further customization of pluralized text, which can result in
 * a better user experience. For example, instead of the message "4 people are viewing this document",
 * you might display "John, Kate and 2 others are viewing this document".
 * The offset attribute allows you to offset a number by any desired value.
 * Let's take a look at an example:
 *
 * <pre>
 * <ng:pluralize count="personCount" offset=2
 *               when="{'0': 'Nobody is viewing.',
 *                      '1': '{{person1}} is viewing.',
 *                      '2': '{{person1}} and {{person2}} are viewing.',
 *                      'one': '{{person1}}, {{person2}} and one other person are viewing.',
 *                      'other': '{{person1}}, {{person2}} and {} other people are viewing.'}">
 * </ng:pluralize>
 * </pre>
 *
 * Notice that we are still using two plural categories(one, other), but we added
 * three explicit number rules 0, 1 and 2.
 * When one person, perhaps John, views the document, "John is viewing" will be shown.
 * When three people view the document, no explicit number rule is found, so
 * an offset of 2 is taken off 3, and Angular uses 1 to decide the plural category.
 * In this case, plural category 'one' is matched and "John, Marry and one other person are viewing"
 * is shown.
 *
 * Note that when you specify offsets, you must provide explicit number rules for
 * numbers from 0 up to and including the offset. If you use an offset of 3, for example,
 * you must provide explicit number rules for 0, 1, 2 and 3. You must also provide plural strings for
 * plural categories "one" and "other".
 *
 * @param {string|expression} count The variable to be bounded to.
 * @param {string} when The mapping between plural category to its correspoding strings.
 * @param {number=} offset Offset to deduct from the total number.
 *
 * @example
    <doc:example>
      <doc:source>
        Person 1:<input type="text" name="person1" value="Igor" /><br/>
        Person 2:<input type="text" name="person2" value="Misko" /><br/>
        Number of People:<input type="text" name="personCount" value="1" /><br/>

        <!--- Example with simple pluralization rules for en locale --->
        Without Offset:
        <ng:pluralize count="personCount"
                      when="{'0': 'Nobody is viewing.',
                             'one': '1 person is viewing.',
                             'other': '{} people are viewing.'}">
        </ng:pluralize><br>

        <!--- Example with offset --->
        With Offset(2):
        <ng:pluralize count="personCount" offset=2
                      when="{'0': 'Nobody is viewing.',
                             '1': '{{person1}} is viewing.',
                             '2': '{{person1}} and {{person2}} are viewing.',
                             'one': '{{person1}}, {{person2}} and one other person are viewing.',
                             'other': '{{person1}}, {{person2}} and {} other people are viewing.'}">
        </ng:pluralize>
      </doc:source>
      <doc:scenario>
        it('should show correct pluralized string', function(){
          expect(element('.doc-example-live .ng-pluralize:first').text()).
                                             toBe('1 person is viewing.');
          expect(element('.doc-example-live .ng-pluralize:last').text()).
                                                toBe('Igor is viewing.');

          using('.doc-example-live').input('personCount').enter('0');
          expect(element('.doc-example-live .ng-pluralize:first').text()).
                                               toBe('Nobody is viewing.');
          expect(element('.doc-example-live .ng-pluralize:last').text()).
                                              toBe('Nobody is viewing.');

          using('.doc-example-live').input('personCount').enter('2');
          expect(element('.doc-example-live .ng-pluralize:first').text()).
                                            toBe('2 people are viewing.');
          expect(element('.doc-example-live .ng-pluralize:last').text()).
                              toBe('Igor and Misko are viewing.');

          using('.doc-example-live').input('personCount').enter('3');
          expect(element('.doc-example-live .ng-pluralize:first').text()).
                                            toBe('3 people are viewing.');
          expect(element('.doc-example-live .ng-pluralize:last').text()).
                              toBe('Igor, Misko and one other person are viewing.');

          using('.doc-example-live').input('personCount').enter('4');
          expect(element('.doc-example-live .ng-pluralize:first').text()).
                                            toBe('4 people are viewing.');
          expect(element('.doc-example-live .ng-pluralize:last').text()).
                              toBe('Igor, Misko and 2 other people are viewing.');
        });

        it('should show data-binded names', function(){
          using('.doc-example-live').input('personCount').enter('4');
          expect(element('.doc-example-live .ng-pluralize:last').text()).
              toBe('Igor, Misko and 2 other people are viewing.');

          using('.doc-example-live').input('person1').enter('Di');
          using('.doc-example-live').input('person2').enter('Vojta');
          expect(element('.doc-example-live .ng-pluralize:last').text()).
              toBe('Di, Vojta and 2 other people are viewing.');
        });
      </doc:scenario>
    </doc:example>
 */
angularWidget('ng:pluralize', function(element) {
  var numberExp = element.attr('count'),
      whenExp = element.attr('when'),
      offset = element.attr('offset') || 0;

  return annotate('$locale', function($locale, element) {
    var scope = this,
        whens = scope.$eval(whenExp),
        whensExpFns = {};

    forEach(whens, function(expression, key) {
      whensExpFns[key] = compileBindTemplate(expression.replace(/{}/g,
                                             '{{' + numberExp + '-' + offset + '}}'));
    });

    scope.$watch(function() {
      var value = parseFloat(scope.$eval(numberExp));

      if (!isNaN(value)) {
        //if explicit number rule such as 1, 2, 3... is defined, just use it. Otherwise,
        //check it against pluralization rules in $locale service
        if (!whens[value]) value = $locale.pluralCat(value - offset);
         return whensExpFns[value](scope, element, true);
      } else {
        return '';
      }
    }, function(scope, newVal) {
      element.text(newVal);
    });
  });
});
