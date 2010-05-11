function modelAccessor(scope, element) {
  var expr = element.attr('name');
  if (!expr) throw "Required field 'name' not found.";
  return {
    get: function() {
      return scope.$eval(expr);
    },
    set: function(value) {
      if (value !== undefined) {
        scope.$tryEval(expr + '=' + toJson(value), element);
      }
    }
  };
}

function compileValidator(expr) {
  return new Parser(expr).validator()();
}

function valueAccessor(scope, element) {
  var validatorName = element.attr('ng-validate') || NOOP,
      validator = compileValidator(validatorName),
      required = element.attr('ng-required'),
      farmatterName = element.attr('ng-format') || NOOP,
      formatter = angularFormatter(farmatterName),
      format, parse, lastError;
      invalidWidgets = scope.$invalidWidgets || {markValid:noop, markInvalid:noop};
  if (!validator) throw "Validator named '" + validatorName + "' not found.";
  if (!formatter) throw "Formatter named '" + farmatterName + "' not found.";
  format = formatter.format;
  parse = formatter.parse;
  required = required || required === '';

  element.data('$validate', validate);
  return {
    get: function(){
      if (lastError)
        elementError(element, NG_VALIDATION_ERROR, null);
      try {
        return parse(element.val());
      } catch (e) {
        lastError = e;
        elementError(element, NG_VALIDATION_ERROR, e);
      }
    },
    set: function(value) {
      var oldValue = element.val(),
          newValue = format(value);
      if (oldValue != newValue) {
        element.val(newValue);
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
      var error,
          validateScope = extend(new (extend(function(){}, {prototype:scope}))(), {$element:element});
      error = required && !value ?
            "Required" :
            (value ? validator({state:validateScope, scope:{get:validateScope.$get, set:validateScope.$set}}, value) : null);
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
  var options = element[0].options;
  return {
    get: function(){
      var values = [];
      foreach(options, function(option){
        if (option.selected) values.push(option.value);
      });
      return values;
    },
    set: function(values){
      var keys = {};
      foreach(values, function(value){ keys[value] = true; });
      foreach(options, function(option){
        option.selected = keys[option.value];
      });
    }
  };
}

function noopAccessor() { return { get: noop, set: noop }; }

var textWidget = inputWidget('keyup change', modelAccessor, valueAccessor, initWidgetValue()),
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
      'checkbox':        inputWidget('click', modelAccessor, checkedAccessor, initWidgetValue(false)),
      'radio':           inputWidget('click', modelAccessor, radioAccessor, radioInit),
      'select-one':      inputWidget('change', modelAccessor, valueAccessor, initWidgetValue(null)),
      'select-multiple': inputWidget('change', modelAccessor, optionsAccessor, initWidgetValue([]))
//      'file':            fileWidget???
    };

function initWidgetValue(initValue) {
  return function (model, view) {
    var value = view.get();
    if (!value && isDefined(initValue))
      value = copy(initValue);
    if (isUndefined(model.get()) && isDefined(value)) {
      model.set(value);
    }
  };
}

function radioInit(model, view, element) {
 var modelValue = model.get(), viewValue = view.get(), input = element[0];
 input.name = this.$id + '@' + input.name;
 if (isUndefined(modelValue)) model.set(null);
 if (viewValue !== null) model.set(viewValue);
}

function inputWidget(events, modelAccessor, viewAccessor, initFn) {
  return function(element) {
    var scope = this,
        model = modelAccessor(scope, element),
        view = viewAccessor(scope, element),
        action = element.attr('ng-change') || '';
    initFn.call(scope, model, view, element);
    this.$eval(element.attr('ng-init')||'');
    // Don't register a handler if we are a button (noopAccessor) and there is no action
    if (action || modelAccessor !== noopAccessor) {
      element.bind(events, function(){
        model.set(view.get());
        scope.$tryEval(action, element);
        scope.$root.$eval();
        // if we have noop initFn than we are just a button,
        // therefore we want to prevent default action
        return initFn != noop;
      });
    }
    view.set(model.get());
    scope.$watch(model.get, view.set);
  };
}

function inputWidgetSelector(element){
  this.directives(true);
  return INPUT_TYPE[lowercase(element[0].type)] || noop;
}

angularWidget('INPUT', inputWidgetSelector);
angularWidget('TEXTAREA', inputWidgetSelector);
angularWidget('BUTTON', inputWidgetSelector);
angularWidget('SELECT', function(element){
  this.descend(true);
  return inputWidgetSelector.call(this, element);
});


angularWidget('NG:INCLUDE', function(element){
  var compiler = this,
      srcExp = element.attr("src"),
      scopeExp = element.attr("scope") || '';
  if (element[0]['ng-compiled']) {
    this.descend(true);
    this.directives(true);
  } else {
    element[0]['ng-compiled'] = true;
    return function(element){
      var scope = this, childScope;
      var changeCounter = 0;
      function incrementChange(){ changeCounter++;}
      this.$watch(srcExp, incrementChange);
      this.$watch(scopeExp, incrementChange);
      scope.$onEval(function(){
        if (childScope) childScope.$eval();
      });
      this.$watch(function(){return changeCounter;}, function(){
        var src = this.$eval(srcExp),
        useScope = this.$eval(scopeExp);
        if (src) {
          scope.$xhr.cache('GET', src, function(code, response){
            element.html(response);
            childScope = useScope || createScope(scope);
            compiler.compile(element)(element, childScope);
            childScope.$init();
          });
        }
      });
    };
  }
});

var ngSwitch = angularWidget('NG:SWITCH', function (element){
  var compiler = this,
      watchExpr = element.attr("on"),
      usingExpr = (element.attr("using") || 'equals'),
      usingExprParams = usingExpr.split(":"),
      usingFn = ngSwitch[usingExprParams.shift()],
      changeExpr = element.attr('change') || '',
      cases = [];
  if (!usingFn) throw "Using expression '" + usingExpr + "' unknown.";
  eachNode(element, function(caseElement){
    var when = caseElement.attr('ng-switch-when');
    if (when) {
      cases.push({
        when: function(scope, value){
          var args = [value, when];
          foreach(usingExprParams, function(arg){
            args.push(arg);
          });
          return usingFn.apply(scope, args);
        },
        change: changeExpr,
        element: caseElement,
        template: compiler.compile(caseElement)
      });
    }
  });

  // this needs to be here for IE
  foreach(cases, function(_case){
    _case.element.remove();
  });

  element.html('');
  return function(element){
    var scope = this, childScope;
    this.$watch(watchExpr, function(value){
      element.html('');
      childScope = createScope(scope);
      foreach(cases, function(switchCase){
        if (switchCase.when(childScope, value)) {
          var caseElement = switchCase.element.clone();
          element.append(caseElement);
          childScope.$tryEval(switchCase.change, element);
          switchCase.template(caseElement, childScope);
          if (scope.$invalidWidgets)
            scope.$invalidWidgets.clearOrphans();
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
    return on == when;
  },
  route: function(on, when, dstName) {
    var regex = '^' + when.replace(/[\.\\\(\)\^\$]/g, "\$1") + '$',
        params = [],
        dst = {};
    foreach(when.split(/\W/), function(param){
      if (param) {
        var paramRegExp = new RegExp(":" + param + "([\\W])");
        if (regex.match(paramRegExp)) {
          regex = regex.replace(paramRegExp, "([^\/]*)$1");
          params.push(param);
        }
      }
    });
    var match = on.match(new RegExp(regex));
    if (match) {
      foreach(params, function(name, index){
        dst[name] = match[index + 1];
      });
      if (dstName) this.$set(dstName, dst);
    }
    return match ? dst : null;
  }
});
