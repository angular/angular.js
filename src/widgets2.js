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
      scope.$eval(expr + '=' + toJson(formatter['parse'](value)));
    }
  };
}

function valueAccessor(element) {
  var validatorName = element.attr('ng-validate') || NOOP,
      validator = angularValidator(validatorName),
      required = element.attr('ng-required'),
      lastError;
  required = required || required == '';
  if (!validator) throw "Validator named '" + validatorName + "' not found.";
  function validate(value) {
    var error = required && !trim(value) ? "Required" : validator(value);
    if (error !== lastError) {
      if (error) {
        element.addClass(NG_VALIDATION_ERROR);
        element.attr(NG_ERROR, error);
      } else {
        element.removeClass(NG_VALIDATION_ERROR);
        element.removeAttr(NG_ERROR);
      }
      lastError = error;
    }
    return value;
  }
  return {
    get: function(){ return validate(element.val()); },
    set: function(value){ element.val(validate(value)); }
  };
}

function checkedAccessor(element) {
  var domElement = element[0];
  return {
    get: function(){ return !!domElement.checked; },
    set: function(value){ domElement.checked = !!value; }
  };
}

function radioAccessor(element) {
  var domElement = element[0];
  return {
    get: function(){ return domElement.checked ? domElement.value : null; },
    set: function(value){ domElement.checked = value == domElement.value; }
  };
}

function optionsAccessor(element) {
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

var NG_ERROR = 'ng-error',
    NG_VALIDATION_ERROR = 'ng-validation-error',
    textWidget = inputWidget('keyup change', modelAccessor, valueAccessor, ''),
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
        view = viewAccessor(element),
        action = element.attr('ng-action') || '',
        value = view.get() || copy(initValue);
    if (isDefined(value)) model.set(value);
    this.$eval(element.attr('ng-init')||'');
    element.bind(events, function(){
      model.set(view.get());
      scope.$tryEval(action, element);
    });
    scope.$watch(model.get, view.set);
  };
}

function inputWidgetSelector(element){
  return INPUT_TYPE[lowercase(element[0].type)] || noop;
}

angularWidget('INPUT', inputWidgetSelector);
angularWidget('TEXTAREA', inputWidgetSelector);
angularWidget('BUTTON', inputWidgetSelector);
angularWidget('SELECT', function(element){
  this.descend(true);
  return inputWidgetSelector.call(this, element);
});
