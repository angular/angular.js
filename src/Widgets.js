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
      lastError;
  required = required || required == '';
  if (!validator) throw "Validator named '" + validatorName + "' not found.";
  function validate(value) {
    var error = required && !trim(value) ? "Required" : validator({self:scope, scope:{get:scope.$get, set:scope.$set}}, value);
    if (error !== lastError) {
      elementError(element, NG_VALIDATION_ERROR, error);
      lastError = error;
    }
    return value;
  }
  return {
    get: function(){ return validate(element.val()); },
    set: function(value){ element.val(validate(value)); }
  };
}

function checkedAccessor(scope, element) {
  var domElement = element[0];
  return {
    get: function(){
      return !!domElement.checked;
    },
    set: function(value){
      domElement.checked = !!value;
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

var textWidget = inputWidget('keyup change', modelAccessor, valueAccessor, ''),
    buttonWidget = inputWidget('click', noopAccessor, noopAccessor, undefined),
    INPUT_TYPE = {
      'text':            textWidget,
      'textarea':        textWidget,
      'hidden':          textWidget,
      'password':        textWidget,
      'button':          buttonWidget,
      'submit':          buttonWidget,
      'reset':           buttonWidget,
      'image':           buttonWidget,
      'checkbox':        inputWidget('click', modelAccessor, checkedAccessor, false),
      'radio':           inputWidget('click', modelAccessor, radioAccessor, undefined),
      'select-one':      inputWidget('click', modelAccessor, valueAccessor, null),
      'select-multiple': inputWidget('click', modelAccessor, optionsAccessor, [])
//      'file':            fileWidget???
    };

function inputWidget(events, modelAccessor, viewAccessor, initValue) {
  return function(element) {
    var scope = this,
        model = modelAccessor(scope, element),
        view = viewAccessor(scope, element),
        action = element.attr('ng-action') || '',
        value = view.get() || copy(initValue);
    if (isUndefined(model.get()) && isDefined(value)) model.set(value);
    this.$eval(element.attr('ng-init')||'');
    element.bind(events, function(){
      model.set(view.get());
      scope.$tryEval(action, element);
      scope.$root.$eval();
      // if we have no initValue than we are just a button,
      // therefore we want to prevent default action
      return isDefined(initValue);
    });
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
