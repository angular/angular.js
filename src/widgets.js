function modelAccessor(scope, element) {
  var expr = element.attr('name'),
      farmatterName = element.attr('ng-format') || NOOP,
      formatter = angularFormatter(farmatterName);
  if (!expr) throw "Required field 'name' not found.";
  if (!formatter) throw "Formatter named '" + farmatterName + "' not found.";
  return {
    get: function() {
      return formatter['format'](scope.$eval(expr));
    },
    set: function(value) {
      scope.$tryEval(expr + '=' + toJson(formatter['parse'](value)), element);
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
      lastError,
      invalidWidgets = scope.$invalidWidgets || {markValid:noop, markInvalid:noop};
  required = required || required === '';
  if (!validator) throw "Validator named '" + validatorName + "' not found.";
  function validate(value) {
    var force = false;
    if (isUndefined(value)) {
      value = element.val();
      force = true;
    }
    if (element[0].disabled || isString(element.attr('readonly'))) {
      elementError(element, NG_VALIDATION_ERROR, null);
      invalidWidgets.markValid(element);
      return value;
    }
    var error,
        validateScope = extend(new (extend(function(){}, {prototype:scope}))(), {$element:element});
    error = required && !trim(value) ?
          "Required" :
           (trim(value) ? validator({state:validateScope, scope:{get:validateScope.$get, set:validateScope.$set}}, value) : null);
    if (error !== lastError || force) {
      elementError(element, NG_VALIDATION_ERROR, error);
      lastError = error;
      if (error)
        invalidWidgets.markInvalid(element);
      else
        invalidWidgets.markValid(element);
    }
    return value;
  }
  element.data('$validate', validate);
  return {
    get: function(){ return validate(element.val()); },
    set: function(value){ element.val(validate(value)); }
  };
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

var textWidget = inputWidget('keyup change', modelAccessor, valueAccessor, initWidgetValue('')),
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
    var value = view.get() || copy(initValue);
    if (isUndefined(model.get()) && isDefined(value))
      model.set(value);
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
      this.$watch(function(){return changeCounter;}, function(){
        var src = this.$eval(srcExp),
        useScope = this.$eval(scopeExp);
        if (src) {
          scope.$browser.xhr('GET', src, function(code, response){
            element.html(response);
            childScope = useScope || createScope(scope);
            compiler.compile(element)(element, childScope);
            childScope.$init();
            scope.$root.$eval();
          });
        }
      });
      scope.$onEval(function(){
        if (childScope) childScope.$eval();
      });
    };
  }
});

angularWidget('NG:SWITCH', function ngSwitch(element){
  var compiler = this,
      watchExpr = element.attr("on"),
      whenExpr = (element.attr("using") || 'equals').split(":");
      whenFn = ngSwitch[whenExpr.shift()];
      changeExpr = element.attr('change') || '',
      cases = [];
  if (!whenFn) throw "Using expression '" + usingExpr + "' unknown.";
  eachNode(element, function(caseElement){
    var when = caseElement.attr('ng-switch-when');
    if (when) {
      cases.push({
        when: function(scope, value){
          var args = [value, when];
          foreach(whenExpr, function(arg){
            args.push(arg);
          });
          return whenFn.apply(scope, args);
        },
        change: changeExpr,
        element: caseElement,
        template: compiler.compile(caseElement)
      });
    }
  });
  element.html('');
  return function(element){
    var scope = this, childScope;
    this.$watch(watchExpr, function(value){
      element.html('');
      childScope = createScope(scope);
      foreach(cases, function(switchCase){
        if (switchCase.when(childScope, value)) {
          element.append(switchCase.element);
          childScope.$tryEval(switchCase.change, element);
          switchCase.template(switchCase.element, childScope);
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
