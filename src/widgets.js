/**
 * @workInProgress
 * @ngdoc widget
 * @name angular.widget.HTML
 *
 * @description
 * The most common widgets you will use will be in the from of the
 * standard HTML set. These widgets are bound using the name attribute
 * to an expression. In addition they can have `ng:validate`, `ng:required`,
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
 
 * @scenario
 * it('should exercise text', function(){
 *   input('input1').enter('Carlos');
 *   expect(binding('input1')).toEqual('"Carlos"');
 * });
 * it('should exercise textarea', function(){
 *   input('input2').enter('Carlos');
 *   expect(binding('input2')).toEqual('"Carlos"');
 * });
 * it('should exercise radio', function(){
 *   expect(binding('input3')).toEqual('null');
 *   input('input3').select('A');
 *   expect(binding('input3')).toEqual('"A"');
 *   input('input3').select('B');
 *   expect(binding('input3')).toEqual('"B"');
 * });
 * it('should exercise checkbox', function(){
 *   expect(binding('input4')).toEqual('false');
 *   input('input4').check();
 *   expect(binding('input4')).toEqual('true');
 * });
 * it('should exercise pulldown', function(){
 *   expect(binding('input5')).toEqual('"c"');
 *   select('input5').option('d');
 *   expect(binding('input5')).toEqual('"d"');
 * });
 * it('should exercise multiselect', function(){
 *   expect(binding('input6')).toEqual('[]');
 *   select('input6').options('e');
 *   expect(binding('input6')).toEqual('["e"]');
 *   select('input6').options('e', 'f');
 *   expect(binding('input6')).toEqual('["e","f"]');
 * });
 */

function modelAccessor(scope, element) {
  var expr = element.attr('name');
  if (expr) {
    return {
      get: function() {
        return scope.$eval(expr);
      },
      set: function(value) {
        if (value !== _undefined) {
          return scope.$tryEval(expr + '=' + toJson(value), element);
        }
      }
    };
  }
}

function modelFormattedAccessor(scope, element) {
  var accessor = modelAccessor(scope, element),
      formatterName = element.attr('ng:format') || NOOP,
      formatter = angularFormatter(formatterName);
  if (!formatter) throw "Formatter named '" + formatterName + "' not found.";
  if (accessor) {
    return {
      get: function() {
        return formatter.format(accessor.get());
      },
      set: function(value) {
        return accessor.set(formatter.parse(value));
      }
    };
  }
}

function compileValidator(expr) {
  return parser(expr).validator()();
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
 * @exampleDescription
 * This example shows how the input element becomes red when it contains invalid input. Correct
 * the input to make the error disappear.
 *
 * @example
    I don't validate:
    <input type="text" name="value" value="NotANumber"><br/>

    I need an integer or nothing:
    <input type="text" name="value" ng:validate="integer"><br/>
 * 
 * @scenario
   it('should check ng:validate', function(){
     expect(element('.doc-example-live :input:last').attr('className')).
       toMatch(/ng-validation-error/);

     input('value').enter('123');
     expect(element('.doc-example-live :input:last').attr('className')).
       not().toMatch(/ng-validation-error/);
   });
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
 * @exampleDescription
 * This example shows how the input element becomes red when it contains invalid input. Correct
 * the input to make the error disappear.
 *
 * @example
    I cannot be blank: <input type="text" name="value" ng:required><br/>
 *
 * @scenario
   it('should check ng:required', function(){
     expect(element('.doc-example-live :input').attr('className')).toMatch(/ng-validation-error/);
     input('value').enter('123');
     expect(element('.doc-example-live :input').attr('className')).not().toMatch(/ng-validation-error/);
   });
 */
/**
 * @workInProgress
 * @ngdoc widget
 * @name angular.widget.@ng:format
 *
 * @description
 * The `ng:format` attribute widget formats stored data to user-readable text and parses the text
 * back to the stored form. You might find this useful for example if you collect user input in a
 * text field but need to store the data in the model as a list. Check out
 * {@link angular.formatter formatters} to learn more.
 *
 * @param {string} formatter The name of the built-in or custom {@link angular.formatter formatter}
 *     to be used.
 *
 * @element INPUT
 *
 * @exampleDescription
 * This example shows how the user input is converted from a string and internally represented as an
 * array.
 *
 * @example
    Enter a comma separated list of items: 
    <input type="text" name="list" ng:format="list" value="table, chairs, plate">
    <pre>list={{list}}</pre>
 * 
 * @scenario
   it('should check ng:format', function(){
     expect(binding('list')).toBe('list=["table","chairs","plate"]');
     input('list').enter(',,, a ,,,');
     expect(binding('list')).toBe('list=["a"]');
   });
 */
function valueAccessor(scope, element) {
  var validatorName = element.attr('ng:validate') || NOOP,
      validator = compileValidator(validatorName),
      requiredExpr = element.attr('ng:required'),
      formatterName = element.attr('ng:format') || NOOP,
      formatter = angularFormatter(formatterName),
      format, parse, lastError, required,
      invalidWidgets = scope.$service('$invalidWidgets') || {markValid:noop, markInvalid:noop};
  if (!validator) throw "Validator named '" + validatorName + "' not found.";
  if (!formatter) throw "Formatter named '" + formatterName + "' not found.";
  format = formatter.format;
  parse = formatter.parse;
  if (requiredExpr) {
    scope.$watch(requiredExpr, function(newValue) {
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
        elementError(element, NG_VALIDATION_ERROR, _null);
      try {
        var value = parse(element.val());
        validate();
        return value;
      } catch (e) {
        lastError = e;
        elementError(element, NG_VALIDATION_ERROR, e);
      }
    },
    set: function(value) {
      var oldValue = element.val(),
          newValue = format(value);
      if (oldValue != newValue) {
        element.val(newValue || ''); // needed for ie
      }
      validate();
    }
  };

  function validate() {
    var value = trim(element.val());
    if (element[0].disabled || element[0].readOnly) {
      elementError(element, NG_VALIDATION_ERROR, _null);
      invalidWidgets.markValid(element);
    } else {
      var error, validateScope = inherit(scope, {$element:element});
      error = required && !value ?
              'Required' :
              (value ? validator(validateScope, value) : _null);
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
      return domElement.checked ? domElement.value : _null;
    },
    set: function(value){
      domElement.checked = value == domElement.value;
    }
  };
}

function optionsAccessor(scope, element) {
  var options = element[0].options;
  return {
    get: function(){
      var values = [];
      forEach(options, function(option){
        if (option.selected) values.push(option.value);
      });
      return values;
    },
    set: function(values){
      var keys = {};
      forEach(values, function(value){ keys[value] = true; });
      forEach(options, function(option){
        option.selected = keys[option.value];
      });
    }
  };
}

function noopAccessor() { return { get: noop, set: noop }; }

var textWidget = inputWidget('keydown change', modelAccessor, valueAccessor, initWidgetValue(), true),
    buttonWidget = inputWidget('click', noopAccessor, noopAccessor, noop),
    INPUT_TYPE = {
      'text':            textWidget,
      'textarea':        textWidget,
      'hidden':          textWidget,
      'password':        textWidget,
      'button':          buttonWidget,
      'submit':          buttonWidget,
      'reset':           buttonWidget,
      'image':           buttonWidget,
      'checkbox':        inputWidget('click', modelFormattedAccessor, checkedAccessor, initWidgetValue(false)),
      'radio':           inputWidget('click', modelFormattedAccessor, radioAccessor, radioInit),
      'select-one':      inputWidget('change', modelFormattedAccessor, valueAccessor, initWidgetValue(_null)),
      'select-multiple': inputWidget('change', modelFormattedAccessor, optionsAccessor, initWidgetValue([]))
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
   model.set(modelValue = _null);
 }
 if (modelValue == _null && viewValue !== _null) {
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
 * @exampleDescription
 * @example
    <div ng:init="checkboxCount=0; textCount=0"></div>
    <input type="text" name="text" ng:change="textCount = 1 + textCount">
       changeCount {{textCount}}<br/>
    <input type="checkbox" name="checkbox" ng:change="checkboxCount = 1 + checkboxCount">
       changeCount {{checkboxCount}}<br/>
 * 
 * @scenario
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
 */
function inputWidget(events, modelAccessor, viewAccessor, initFn, textBox) {
  return injectService(['$updateView', '$defer'], function($updateView, $defer, element) {
    var scope = this,
        model = modelAccessor(scope, element),
        view = viewAccessor(scope, element),
        action = element.attr('ng:change') || '',
        lastValue;
    if (model) {
      initFn.call(scope, model, view, element);
      this.$eval(element.attr('ng:init')||'');
      element.bind(events, function(event){
        function handler(){
          var value = view.get();
          if (!textBox || value != lastValue) {
            model.set(value);
            lastValue = model.get();
            scope.$tryEval(action, element);
            $updateView();
          }
        }
        event.type == 'keydown' ? $defer(handler) : handler();
      });
      scope.$watch(model.get, function(value){
        if (lastValue !== value) {
          view.set(lastValue = value);
        }
      });
    }
  });
}

function inputWidgetSelector(element){
  this.directives(true);
  return INPUT_TYPE[lowercase(element[0].type)] || noop;
}

angularWidget('input', inputWidgetSelector);
angularWidget('textarea', inputWidgetSelector);
angularWidget('button', inputWidgetSelector);
angularWidget('select', function(element){
  this.descend(true);
  return inputWidgetSelector.call(this, element);
});


/*
 * Consider this:
 * <select name="selection">
 *   <option ng:repeat="x in [1,2]">{{x}}</option>
 * </select>
 * 
 * The issue is that the select gets evaluated before option is unrolled.
 * This means that the selection is undefined, but the browser
 * default behavior is to show the top selection in the list. 
 * To fix that we register a $update function on the select element
 * and the option creation then calls the $update function when it is 
 * unrolled. The $update function then calls this update function, which 
 * then tries to determine if the model is unassigned, and if so it tries to
 * chose one of the options from the list.
 */
angularWidget('option', function(){
  this.descend(true);
  this.directives(true);
  return function(element) {
    var select = element.parent();
    var scope = retrieveScope(select);
    var model = modelFormattedAccessor(scope, select);
    var view = valueAccessor(scope, select);
    var option = element;
    var lastValue = option.attr($value);
    var lastSelected = option.attr('ng-' + $selected);
    element.data($$update, function(){
      var value = option.attr($value);
      var selected = option.attr('ng-' + $selected);
      var modelValue = model.get();
      if (lastSelected != selected || lastValue != value) {
        lastSelected = selected;
        lastValue = value;
        if (selected || modelValue == _null || modelValue == _undefined) 
          model.set(value);
        if (value == modelValue) {
          view.set(lastValue);
        }
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
 * Include external HTML fragment.
 * 
 * Keep in mind that Same Origin Policy applies to included resources 
 * (e.g. ng:include won't work for file:// access).
 *
 * @param {string} src expression evaluating to URL.
 * @param {Scope=} [scope=new_child_scope] expression evaluating to angular.scope
 * @param {string=} onload Expression to evaluate when a new partial is loaded.
 *
 * @example
 *   <select name="url">
 *    <option value="angular.filter.date.html">date filter</option>
 *    <option value="angular.filter.html.html">html filter</option>
 *    <option value="">(blank)</option>
 *   </select>
 *   <tt>url = <a href="{{url}}">{{url}}</a></tt>
 *   <hr/>
 *   <ng:include src="url"></ng:include>
 *
 * @scenario
 * it('should load date filter', function(){
 *   expect(element('.doc-example ng\\:include').text()).toMatch(/angular\.filter\.date/);
 * });
 * it('should change to hmtl filter', function(){
 *   select('url').option('angular.filter.html.html');
 *   expect(element('.doc-example ng\\:include').text()).toMatch(/angular\.filter\.html/);
 * });
 * it('should change to blank', function(){
 *   select('url').option('(blank)');
 *   expect(element('.doc-example ng\\:include').text()).toEqual('');
 * });
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
      var scope = this, childScope;
      var changeCounter = 0;
      var preventRecursion = false;
      function incrementChange(){ changeCounter++;}
      this.$watch(srcExp, incrementChange);
      this.$watch(scopeExp, incrementChange);
      scope.$onEval(function(){
        if (childScope && !preventRecursion) {
          preventRecursion = true;
          try {
            childScope.$eval();
          } finally {
            preventRecursion = false;
          }
        }
      });
      this.$watch(function(){return changeCounter;}, function(){
        var src = this.$eval(srcExp),
            useScope = this.$eval(scopeExp);

        if (src) {
          xhr('GET', src, function(code, response){
            element.html(response);
            childScope = useScope || createScope(scope);
            compiler.compile(element)(element, childScope);
            childScope.$init();
            scope.$eval(onloadExp);
          });
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
 *
 * @scenario
 * it('should start in settings', function(){
 *   expect(element('.doc-example ng\\:switch').text()).toEqual('Settings Div');
 * });
 * it('should change to home', function(){
 *   select('switch').option('home');
 *   expect(element('.doc-example ng\\:switch').text()).toEqual('Home Span');
 * });
 * it('should select deafault', function(){
 *   select('switch').option('other');
 *   expect(element('.doc-example ng\\:switch').text()).toEqual('default');
 * });
 */
var ngSwitch = angularWidget('ng:switch', function (element){
  var compiler = this,
      watchExpr = element.attr("on"),
      usingExpr = (element.attr("using") || 'equals'),
      usingExprParams = usingExpr.split(":"),
      usingFn = ngSwitch[usingExprParams.shift()],
      changeExpr = element.attr('change') || '',
      cases = [];
  if (!usingFn) throw "Using expression '" + usingExpr + "' unknown.";
  if (!watchExpr) throw "Missing 'on' attribute.";
  eachNode(element, function(caseElement){
    var when = caseElement.attr('ng:switch-when');
    var switchCase = {
        change: changeExpr,
        element: caseElement,
        template: compiler.compile(caseElement)
      };
    if (isString(when)) {
      switchCase.when = function(scope, value){
        var args = [value, when];
        forEach(usingExprParams, function(arg){
          args.push(arg);
        });
        return usingFn.apply(scope, args);
      };
      cases.unshift(switchCase);
    } else if (isString(caseElement.attr('ng:switch-default'))) {
      switchCase.when = valueFn(true);
      cases.push(switchCase);
    }
  });

  // this needs to be here for IE
  forEach(cases, function(_case){
    _case.element.remove();
  });

  element.html('');
  return function(element){
    var scope = this, childScope;
    this.$watch(watchExpr, function(value){
      var found = false;
      element.html('');
      childScope = createScope(scope);
      forEach(cases, function(switchCase){
        if (!found && switchCase.when(childScope, value)) {
          found = true;
          var caseElement = quickClone(switchCase.element);
          element.append(caseElement);
          childScope.$tryEval(switchCase.change, element);
          switchCase.template(caseElement, childScope);
          childScope.$init();
        }
      });
    });
    scope.$onEval(function(){
      if (childScope) childScope.$eval();
    });
  };
}, {
  equals: function(on, when) {
    return ''+on == when;
  },
  route: switchRouteMatcher
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
    if (element.attr('href') === '') {
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
 * `ng:repeat` instantiates a template once per item from a collection. The collection is enumerated
 * with `ng:repeat-index` attribute starting from 0. Each template instance gets its own scope where
 * the given loop variable is set to the current collection item and `$index` is set to the item
 * index or key.
 *
 * There are special properties exposed on the local scope of each template instance:
 *
 *   * `$index` – `{number}` – iterator offset of the repeated element (0..length-1)
 *   * `$position` – {string} – position of the repeated element in the iterator. One of: `'first'`,
 *     `'middle'` or `'last'`.
 *
 * NOTE: `ng:repeat` looks like a directive, but is actually an attribute widget.
 *
 * @element ANY
 * @param {string} repeat_expression The expression indicating how to enumerate a collection. Two
 *   formats are currently supported:
 *
 *   * `variable in expression` – where variable is the user defined loop variable and `expression`
 *     is a scope expression giving the collection to enumerate.
 *
 *     For example: `track in cd.tracks`.
 *   * `(key, value) in expression` – where `key` and `value` can be any user defined identifiers,
 *     and `expression` is the scope expression giving the collection to enumerate.
 *
 *     For example: `(name, age) in {'adam':10, 'amalie':12}`.
 *
 * @exampleDescription
 * This example initializes the scope to a list of names and
 * than uses `ng:repeat` to display every person.
 * @example
    <div ng:init="friends = [{name:'John', age:25}, {name:'Mary', age:28}]">
      I have {{friends.length}} friends. They are:
      <ul>
        <li ng:repeat="friend in friends">
          [{{$index + 1}}] {{friend.name}} who is {{friend.age}} years old.
        </li>
      </ul>
    </div>
 * @scenario
   it('should check ng:repeat', function(){
     var r = using('.doc-example-live').repeater('ul li');
     expect(r.count()).toBe(2);
     expect(r.row(0)).toEqual(["1","John","25"]);
     expect(r.row(1)).toEqual(["2","Mary","28"]);
   });
 */
angularWidget("@ng:repeat", function(expression, element){
  element.removeAttr('ng:repeat');
  element.replaceWith(this.comment("ng:repeat: " + expression));
  var template = this.compile(element);
  return function(reference){
    var match = expression.match(/^\s*(.+)\s+in\s+(.*)\s*$/),
        lhs, rhs, valueIdent, keyIdent;
    if (! match) {
      throw Error("Expected ng:repeat in form of 'item in collection' but got '" +
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

    var children = [], currentScope = this;
    this.$onEval(function(){
      var index = 0,
          childCount = children.length,
          lastElement = reference,
          collection = this.$tryEval(rhs, reference),
          is_array = isArray(collection),
          collectionLength = 0,
          childScope,
          key;

      if (is_array) {
        collectionLength = collection.length;
      } else {
        for (key in collection)
          if (collection.hasOwnProperty(key))
            collectionLength++;
      }

      for (key in collection) {
        if (!is_array || collection.hasOwnProperty(key)) {
          if (index < childCount) {
            // reuse existing child
            childScope = children[index];
            childScope[valueIdent] = collection[key];
            if (keyIdent) childScope[keyIdent] = key;
          } else {
            // grow children
            childScope = template(quickClone(element), createScope(currentScope));
            childScope[valueIdent] = collection[key];
            if (keyIdent) childScope[keyIdent] = key;
            lastElement.after(childScope.$element);
            childScope.$index = index;
            childScope.$position = index == 0 ?
                                      'first' :
                                      (index == collectionLength - 1 ? 'last' : 'middle');
            childScope.$element.attr('ng:repeat-index', index);
            childScope.$init();
            children.push(childScope);
          }
          childScope.$eval();
          lastElement = childScope.$element;
          index ++;
        }
      }
      // shrink children
      while(children.length > index) {
        children.pop().$element.remove();
      }
    }, reference);
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
 * NOTE: `ng:non-bindable` looks like a directive, but is actually an attribute widget.
 *
 * @element ANY
 *
 * @exampleDescription
 * In this example there are two location where a siple binding (`{{}}`) is present, but the one
 * wrapped in `ng:non-bindable` is left alone.
 *
 * @example
    <div>Normal: {{1 + 2}}</div>
    <div ng:non-bindable>Ignored: {{1 + 2}}</div>
 *
 * @scenario
   it('should check ng:non-bindable', function(){
     expect(using('.doc-example-live').binding('1 + 2')).toBe('3');
     expect(using('.doc-example-live').element('div:last').text()).
       toMatch(/1 \+ 2/);
   });
 */
angularWidget("@ng:non-bindable", noop);
