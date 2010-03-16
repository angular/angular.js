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
  }
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
