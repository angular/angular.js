function scopeAccessor(scope, element) {
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

function domAccessor(element) {
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

var NG_ERROR = 'ng-error',
    NG_VALIDATION_ERROR = 'ng-validation-error',
    TEXT_META = ['', 'keyup change'],
    INPUT_META = {
      'text':     TEXT_META,
      'textarea': TEXT_META,
      'hidden':   TEXT_META,
      'password': TEXT_META
    };

function inputWidget(meta) {
  return meta ? function(element) {
    var scope = scopeAccessor(this, element),
        dom = domAccessor(element);
    scope.set(dom.get() || meta[0]);
    element.bind(meta[1], function(){
      scope.set(dom.get());
    });
    this.$watch(scope.get, dom.set);
  } : 0;
}

angularWidget('INPUT', function input(element){
  return inputWidget(INPUT_META[lowercase(element[0].type)]);
});

angularWidget('TEXTAREA', function(){
  return inputWidget(INPUT_META['text']);
});




/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////



//widget related
//ng-validate, ng-required, ng-formatter
//ng-error

//ng-scope ng-controller????

// <input type="text" name="bla" ng-action=""> -> <ng:textinput name="" ng-action=""/>
angular.widget("inputtext", function(element) {
  var expression = element.attr('name');
  var formatter = this.formatter(element.attr('formatter'));
  var validator = this.validator(element.attr('validator'));

  function validate(value) {
    var error = validator(element);
    if (error) {
      element.addClass("ng-error");
      scope.markInvalid(this);  //move out of scope
    } else {
      scope.clearInvalid(this);
    }
  }


  element.keyup(this.withScope(function(){
    this.$evalSet(expression, formatter.parse(element.val()));
    validate(element.val());
  }));

  return {watch: expression, apply: function(newValue){
    element.val(formatter.format(newValue));
    validate(element.val());
  }};

});

angular.widget("inputfile", function(element) {

});

angular.widget("inputradio", function(element) {

});


// <ng:colorpicker name="chosenColor" >
angular.widget("colorpicker", function(element) {
  var name = element.attr('datasource');
  var formatter = this.formatter(element.attr('ng-formatter'));

  element.colorPicker(this.withScope(function(selectedColor){
    this.$evalSet(name, formatter.parse(selectedColor));
  }));

  return function(){
    this.$watch(expression, function(cmyk){
      element.setColor(formatter.format(cmyk));
    });
  };
});

angular.widget("template", function(element) {
  var srcExpression = element.attr('src');
  var self = this;
  return {watch:srcExpression, apply:function(src){
    $.load(src, function(html){
      self.destroy(element);
      element.html(html);
      self.compile(element);
    });
  }};
});


/**
 *
 * {
 *   withScope:  //safely executes, with a try/catch.  applies scope
 *   compile:
 *   widget:
 *   directive:
 *   validator:
 *   formatter:
 *
 *
 *   config:
 *   loadCSS:
 *   loadScript:
 *   loadTemplate:
 * }
 *
 **/
