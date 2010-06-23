WidgetTest = TestCase('WidgetTest');

WidgetTest.prototype.testRequired = function () {
  var view = $('<input name="a" ng-required>');
  var scope = new Scope({$invalidWidgets:[]});
  var cntl = new TextController(view[0], 'a', angularFormatter.noop);
  cntl.updateView(scope);
  assertTrue(view.hasClass('ng-validation-error'));
  assertEquals("Required Value", view.attr('ng-error'));
  scope.set('a', 'A');
  cntl.updateView(scope);
  assertFalse(view.hasClass('ng-validation-error'));
  assertEquals("undefined", typeof view.attr('ng-error'));
};

WidgetTest.prototype.testValidator = function () {
  var view = $('<input name="a" ng-validate="testValidator:\'ABC\'">');
  var scope = new Scope({$invalidWidgets:[]});
  var cntl = new TextController(view[0], 'a', angularFormatter.noop);
  angular.validator.testValidator = function(value, expect){
    return value == expect ? false : "Error text";
  };

  scope.set('a', '');
  cntl.updateView(scope);
  assertEquals(view.hasClass('ng-validation-error'), false);
  assertEquals(null, view.attr('ng-error'));

  scope.set('a', 'X');
  cntl.updateView(scope);
  assertEquals(view.hasClass('ng-validation-error'), true);
  assertEquals(view.attr('ng-error'), "Error text");
  assertEquals("Error text", view.attr('ng-error'));

  scope.set('a', 'ABC');
  cntl.updateView(scope);
  assertEquals(view.hasClass('ng-validation-error'), false);
  assertEquals(view.attr('ng-error'), null);
  assertEquals(null, view.attr('ng-error'));

  delete angular.validator['testValidator'];
};

WidgetTest.prototype.testRequiredValidator = function () {
  var view = $('<input name="a" ng-required ng-validate="testValidator:\'ABC\'">');
  var scope = new Scope({$invalidWidgets:[]});
  var cntl = new TextController(view[0], 'a', angularFormatter.noop);
  angular.validator.testValidator = function(value, expect){
    return value == expect ? null : "Error text";
  };

  scope.set('a', '');
  cntl.updateView(scope);
  assertEquals(view.hasClass('ng-validation-error'), true);
  assertEquals("Required Value", view.attr('ng-error'));

  scope.set('a', 'X');
  cntl.updateView(scope);
  assertEquals(view.hasClass('ng-validation-error'), true);
  assertEquals("Error text", view.attr('ng-error'));

  scope.set('a', 'ABC');
  cntl.updateView(scope);
  assertEquals(view.hasClass('ng-validation-error'), false);
  assertEquals(null, view.attr('ng-error'));

  delete angular.validator['testValidator'];
};

TextControllerTest = TestCase("TextControllerTest");

TextControllerTest.prototype.testDatePicker = function() {
  var input = $('<input type="text" ng-widget="datepicker">');
  input.data('scope', new Scope());
  var body = $(document.body);
  body.append(input);
  var binder = new Binder(input[0], new WidgetFactory());
  assertTrue('before', input.data('datepicker') === undefined);
  binder.compile();
  assertTrue('after', input.data('datepicker') !== null);
  assertTrue(body.html(), input.hasClass('hasDatepicker'));
};

RepeaterUpdaterTest = TestCase("RepeaterUpdaterTest");

RepeaterUpdaterTest.prototype.testRemoveThenAdd = function() {
  var view = $("<div><span/></div>");
  var template = function () {
    return $("<li/>");
  };
  var repeater = new RepeaterUpdater(view.find("span"), "a in b", template, "");
  var scope = new Scope();
  scope.set('b', [1,2]);

  repeater.updateView(scope);

  scope.set('b', []);
  repeater.updateView(scope);

  scope.set('b', [1]);
  repeater.updateView(scope);
  assertEquals(1, view.find("li").size());
};

RepeaterUpdaterTest.prototype.testShouldBindWidgetOnRepeaterClone = function(){
  //fail();
};

RepeaterUpdaterTest.prototype.testShouldThrowInformativeSyntaxError= function(){
  expectAsserts(1);
  try {
    var repeater = new RepeaterUpdater(null, "a=b");
  } catch (e) {
    assertEquals("Expected ng-repeat in form of 'item in collection' but got 'a=b'.", e);
  }
};

SelectControllerTest = TestCase("SelectControllerTest");

SelectControllerTest.prototype.testShouldUpdateModelNullOnNothingSelected = function(){
  var scope = new Scope();
  var view = {selectedIndex:-1, options:[]};
  var cntl = new SelectController(view, 'abc');
  cntl.updateModel(scope);
  assertNull(scope.get('abc'));
};

SelectControllerTest.prototype.testShouldUpdateModelWhenNothingSelected = function(){
  var scope = new Scope();
  var view = {value:'123'};
  var cntl = new SelectController(view, 'abc');
  cntl.updateView(scope);
  assertEquals("123", scope.get('abc'));
};

BindUpdaterTest = TestCase("BindUpdaterTest");

BindUpdaterTest.prototype.testShouldDisplayNothingForUndefined = function () {
  var view = $('<span />');
  var controller = new BindUpdater(view[0], "{{a}}");
  var scope = new Scope();

  scope.set('a', undefined);
  controller.updateView(scope);
  assertEquals("", view.text());

  scope.set('a', null);
  controller.updateView(scope);
  assertEquals("", view.text());
};

BindUpdaterTest.prototype.testShouldDisplayJsonForNonStrings = function () {
  var view = $('<span />');
  var controller = new BindUpdater(view[0], "{{obj}}");

  controller.updateView(new Scope({obj:[]}));
  assertEquals("[]", view.text());

  controller.updateView(new Scope({obj:{text:'abc'}}));
  assertEquals('abc', fromJson(view.text()).text);
};


BindUpdaterTest.prototype.testShouldInsertHtmlNode = function () {
  var view = $('<span />');
  var controller = new BindUpdater(view[0], "<fake>&{{obj}}</fake>");
  var scope = new Scope();

  scope.set("obj", $('<div>myDiv</div>')[0]);
  controller.updateView(scope);
  assertEquals("<fake>&myDiv</fake>", view.text());
};


BindUpdaterTest.prototype.testShouldDisplayTextMethod = function () {
  var view = $('<div />');
  var controller = new BindUpdater(view[0], "{{obj}}");
  var scope = new Scope();

  scope.set("obj", new angular.filter.Meta({text:function(){return "abc";}}));
  controller.updateView(scope);
  assertEquals("abc", view.text());

  scope.set("obj", new angular.filter.Meta({text:"123"}));
  controller.updateView(scope);
  assertEquals("123", view.text());

  scope.set("obj", {text:"123"});
  controller.updateView(scope);
  assertEquals("123", fromJson(view.text()).text);
};

BindUpdaterTest.prototype.testShouldDisplayHtmlMethod = function () {
  var view = $('<div />');
  var controller = new BindUpdater(view[0], "{{obj}}");
  var scope = new Scope();

  scope.set("obj", new angular.filter.Meta({html:function(){return "a<div>b</div>c";}}));
  controller.updateView(scope);
  assertEquals("abc", view.text());

  scope.set("obj", new angular.filter.Meta({html:"1<div>2</div>3"}));
  controller.updateView(scope);
  assertEquals("123", view.text());

  scope.set("obj", {html:"123"});
  controller.updateView(scope);
  assertEquals("123", fromJson(view.text()).html);
};

BindUpdaterTest.prototype.testUdateBoolean = function() {
  var view = $('<div />');
  var controller = new BindUpdater(view[0], "{{true}}, {{false}}");
  controller.updateView(new Scope());
  assertEquals('true, false', view.text());
};

BindAttrUpdaterTest = TestCase("BindAttrUpdaterTest");

BindAttrUpdaterTest.prototype.testShouldLoadBlankImageWhenBindingIsUndefined = function () {
  var view = $('<img />');
  var controller = new BindAttrUpdater(view[0], {src: '{{imageUrl}}'});

  var scope = new Scope();
  scope.set('imageUrl', undefined);
  scope.set('$config.blankImage', 'http://server/blank.gif');

  controller.updateView(scope);
  assertEquals("http://server/blank.gif", view.attr('src'));
};

RepeaterUpdaterTest.prototype.testShouldNotDieWhenRepeatExpressionIsNull = function() {
  var rep = new RepeaterUpdater(null, "$item in items", null, null);
  var scope = new Scope();
  scope.set('items', undefined);
  rep.updateView(scope);
};

RepeaterUpdaterTest.prototype.testShouldIterateOverKeys = function() {
  var rep = new RepeaterUpdater(null, "($k,_v) in items", null, null);
  assertEquals("items", rep.iteratorExp);
  assertEquals("_v", rep.valueExp);
  assertEquals("$k", rep.keyExp);
};

EvalUpdaterTest = TestCase("EvalUpdaterTest");
EvalUpdaterTest.prototype.testEvalThrowsException = function(){
  var view = $('<div/>');
  var eval = new EvalUpdater(view[0], 'undefined()');

  eval.updateView(new Scope());
  assertTrue(!!view.attr('ng-error'));
  assertTrue(view.hasClass('ng-exception'));

  eval.exp = "1";
  eval.updateView(new Scope());
  assertFalse(!!view.attr('ng-error'));
  assertFalse(view.hasClass('ng-exception'));
};

RadioControllerTest = TestCase("RadioController");
RadioControllerTest.prototype.testItShouldTreatTrueStringAsBoolean = function () {
  var view = $('<input type="radio" name="select" value="true"/>');
  var radio = new RadioController(view[0], 'select');
  var scope = new Scope({select:true});
  radio.updateView(scope);
  assertTrue(view[0].checked);
};
