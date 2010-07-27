BinderTest = TestCase('BinderTest');

BinderTest.prototype.setUp = function(){
  var self = this;
  this.compile = function(html, initialScope, config) {
    var compiler = new Compiler(angularTextMarkup, angularAttrMarkup, angularDirective, angularWidget);
    var element = self.element = jqLite(html);
    var scope = compiler.compile(element)(element);
    extend(scope, initialScope);
    scope.$init();
    return {node:element, scope:scope};
  };
  this.compileToHtml = function (content) {
    return sortedHtml(this.compile(content).node);
  };
};

BinderTest.prototype.tearDown = function(){
  if (this.element && this.element.dealoc) {
    this.element.dealoc();
  }
};


BinderTest.prototype.testChangingTextfieldUpdatesModel = function(){
  var state = this.compile('<input type="text" name="model.price" value="abc">', {model:{}});
  state.scope.$eval();
  assertEquals('abc', state.scope.model.price);
};

BinderTest.prototype.testChangingTextareaUpdatesModel = function(){
  var c = this.compile('<textarea name="model.note">abc</textarea>');
  c.scope.$eval();
  assertEquals(c.scope.model.note, 'abc');
};

BinderTest.prototype.testChangingRadioUpdatesModel = function(){
  var c = this.compile('<input type="radio" name="model.price" value="A" checked>' +
        '<input type="radio" name="model.price" value="B">');
  c.scope.$eval();
  assertEquals(c.scope.model.price, 'A');
};

BinderTest.prototype.testChangingCheckboxUpdatesModel = function(){
  var form = this.compile('<input type="checkbox" name="model.price" value="true" checked ng:format="boolean"/>');
  assertEquals(true, form.scope.model.price);
};

BinderTest.prototype.testBindUpdate = function() {
  var c = this.compile('<div ng:eval="a=123"/>');
  assertEquals(123, c.scope.$get('a'));
};

BinderTest.prototype.testChangingSelectNonSelectedUpdatesModel = function(){
  var form = this.compile('<select name="model.price"><option value="A">A</option><option value="B">B</option></select>');
  assertEquals('A', form.scope.model.price);
};

BinderTest.prototype.testChangingMultiselectUpdatesModel = function(){
  var form = this.compile('<select name="Invoice.options" multiple="multiple">' +
          '<option value="A" selected>Gift wrap</option>' +
          '<option value="B" selected>Extra padding</option>' +
          '<option value="C">Expedite</option>' +
          '</select>');
  assertJsonEquals(["A", "B"], form.scope.$get('Invoice').options);
};

BinderTest.prototype.testChangingSelectSelectedUpdatesModel = function(){
  var form = this.compile('<select name="model.price"><option>A</option><option selected value="b">B</option></select>');
  assertEquals(form.scope.model.price, 'b');
};

BinderTest.prototype.testExecuteInitialization = function() {
  var c = this.compile('<div ng:init="a=123">');
  assertEquals(c.scope.$get('a'), 123);
};

BinderTest.prototype.testExecuteInitializationStatements = function() {
  var c = this.compile('<div ng:init="a=123;b=345">');
  assertEquals(c.scope.$get('a'), 123);
  assertEquals(c.scope.$get('b'), 345);
};

BinderTest.prototype.testApplyTextBindings = function(){
  var form = this.compile('<div ng:bind="model.a">x</div>');
  form.scope.$set('model', {a:123});
  form.scope.$eval();
  assertEquals('123', form.node.text());
};

BinderTest.prototype.testReplaceBindingInTextWithSpan = function() {
  assertEquals(this.compileToHtml("<b>a{{b}}c</b>"), '<b>a<span ng:bind="b"></span>c</b>');
  assertEquals(this.compileToHtml("<b>{{b}}</b>"), '<b><span ng:bind="b"></span></b>');
};

BinderTest.prototype.testBindingSpaceConfusesIE = function() {
  if (!msie) return;
  var span = document.createElement("span");
  span.innerHTML = '&nbsp;';
  var nbsp = span.firstChild.nodeValue;
  assertEquals(
      '<b><span ng:bind="a"></span><span>'+nbsp+'</span><span ng:bind="b"></span></b>',
      this.compileToHtml("<b>{{a}} {{b}}</b>"));
  assertEquals(
      '<b><span ng:bind="A"></span><span>'+nbsp+'x </span><span ng:bind="B"></span><span>'+nbsp+'(</span><span ng:bind="C"></span>)</b>',
      this.compileToHtml("<b>{{A}} x {{B}} ({{C}})</b>"));
};

BinderTest.prototype.testBindingOfAttributes = function() {
  var c = this.compile("<a href='http://s/a{{b}}c' foo='x'></a>");
  var attrbinding = c.node.attr("ng:bind-attr");
  var bindings = fromJson(attrbinding);
  assertEquals("http://s/a{{b}}c", decodeURI(bindings.href));
  assertTrue(!bindings.foo);
};

BinderTest.prototype.testMarkMultipleAttributes = function() {
  var c = this.compile('<a href="http://s/a{{b}}c" foo="{{d}}"></a>');
  var attrbinding = c.node.attr("ng:bind-attr");
  var bindings = fromJson(attrbinding);
  assertEquals(bindings.foo, "{{d}}");
  assertEquals(decodeURI(bindings.href), "http://s/a{{b}}c");
};

BinderTest.prototype.testAttributesNoneBound = function() {
  var c = this.compile("<a href='abc' foo='def'></a>");
  var a = c.node;
  assertEquals(a[0].nodeName, "A");
  assertTrue(!a.attr("ng:bind-attr"));
};

BinderTest.prototype.testExistingAttrbindingIsAppended = function() {
  var c = this.compile("<a href='http://s/{{abc}}' ng:bind-attr='{\"b\":\"{{def}}\"}'></a>");
  var a = c.node;
  assertEquals('{"b":"{{def}}","href":"http://s/{{abc}}"}', a.attr('ng:bind-attr'));
};

BinderTest.prototype.testAttributesAreEvaluated = function(){
  var c = this.compile('<a ng:bind-attr=\'{"a":"a", "b":"a+b={{a+b}}"}\'></a>');
  var binder = c.binder, form = c.node;
  c.scope.$eval('a=1;b=2');
  c.scope.$eval();
  var a = c.node;
  assertEquals(a.attr('a'), 'a');
  assertEquals(a.attr('b'), 'a+b=3');
};

BinderTest.prototype.testInputTypeButtonActionExecutesInScope =  function(){
  var savedCalled = false;
  var c = this.compile('<input type="button" ng:click="person.save()" value="Apply">');
  c.scope.$set("person.save", function(){
    savedCalled = true;
  });
  c.node.trigger('click');
  assertTrue(savedCalled);
};

BinderTest.prototype.testInputTypeButtonActionExecutesInScope2 =  function(){
  var log = "";
  var c = this.compile('<input type="image" ng:click="action()">');
  c.scope.$set("action", function(){
    log += 'click;';
  });
  expect(log).toEqual('');
  c.node.trigger('click');
  expect(log).toEqual('click;');
};

BinderTest.prototype.testButtonElementActionExecutesInScope =  function(){
  var savedCalled = false;
  var c = this.compile('<button ng:click="person.save()">Apply</button>');
  c.scope.$set("person.save", function(){
    savedCalled = true;
  });
  c.node.trigger('click');
  assertTrue(savedCalled);
};

BinderTest.prototype.testRepeaterUpdateBindings = function(){
  var a = this.compile('<ul><LI ng:repeat="item in model.items" ng:bind="item.a"/></ul>');
  var form = a.node;
  var items = [{a:"A"}, {a:"B"}];
  a.scope.$set('model', {items:items});

  a.scope.$eval();
  assertEquals('<ul>' +
        '<#comment></#comment>' +
        '<li ng:bind="item.a" ng:repeat-index="0">A</li>' +
        '<li ng:bind="item.a" ng:repeat-index="1">B</li>' +
        '</ul>', sortedHtml(form));

  items.unshift({a:'C'});
  a.scope.$eval();
  assertEquals('<ul>' +
        '<#comment></#comment>' +
        '<li ng:bind="item.a" ng:repeat-index="0">C</li>' +
        '<li ng:bind="item.a" ng:repeat-index="1">A</li>' +
        '<li ng:bind="item.a" ng:repeat-index="2">B</li>' +
        '</ul>', sortedHtml(form));

  items.shift();
  a.scope.$eval();
  assertEquals('<ul>' +
        '<#comment></#comment>' +
        '<li ng:bind="item.a" ng:repeat-index="0">A</li>' +
        '<li ng:bind="item.a" ng:repeat-index="1">B</li>' +
        '</ul>', sortedHtml(form));

  items.shift();
  items.shift();
  a.scope.$eval();
};

BinderTest.prototype.testRepeaterContentDoesNotBind = function(){
  var a = this.compile('<ul><LI ng:repeat="item in model.items"><span ng:bind="item.a"></span></li></ul>');
  a.scope.$set('model', {items:[{a:"A"}]});
  a.scope.$eval();
  assertEquals('<ul>' +
        '<#comment></#comment>' +
        '<li ng:repeat-index="0"><span ng:bind="item.a">A</span></li>' +
        '</ul>', sortedHtml(a.node));
};

BinderTest.prototype.testExpandEntityTag = function(){
  assertEquals(
      '<div ng-entity="Person" ng:watch="$anchor.a:1"></div>',
      this.compileToHtml('<div ng-entity="Person" ng:watch="$anchor.a:1"/>'));
};

BinderTest.prototype.testDoNotOverwriteCustomAction = function(){
  var html = this.compileToHtml('<input type="submit" value="Save" action="foo();">');
  assertTrue(html.indexOf('action="foo();"') > 0 );
};

BinderTest.prototype.testRepeaterAdd = function(){
  var c = this.compile('<div><input type="text" name="item.x" ng:repeat="item in items"></div>');
  var doc = c.node;
  c.scope.$set('items', [{x:'a'}, {x:'b'}]);
  c.scope.$eval();
  var first = childNode(c.node, 1);
  var second = childNode(c.node, 2);
  assertEquals('a', first.val());
  assertEquals('b', second.val());

  first.val('ABC');
  first.trigger('keyup');
  assertEquals(c.scope.items[0].x, 'ABC');
};

BinderTest.prototype.testItShouldRemoveExtraChildrenWhenIteratingOverHash = function(){
  var c = this.compile('<div><div ng:repeat="i in items">{{i}}</div></div>');
  var items = {};
  c.scope.$set("items", items);

  c.scope.$eval();
  expect(c.node[0].childNodes.length - 1).toEqual(0);

  items.name = "misko";
  c.scope.$eval();
  expect(c.node[0].childNodes.length - 1).toEqual(1);

  delete items.name;
  c.scope.$eval();
  expect(c.node[0].childNodes.length - 1).toEqual(0);
};

BinderTest.prototype.testIfTextBindingThrowsErrorDecorateTheSpan = function(){
  var a = this.compile('<div>{{error.throw()}}</div>');
  var doc = a.node;

  a.scope.$set('error.throw', function(){throw "ErrorMsg1";});
  a.scope.$eval();
  var span = childNode(doc, 0);
  assertTrue(span.hasClass('ng-exception'));
  assertEquals('ErrorMsg1', fromJson(span.text()));
  assertEquals('"ErrorMsg1"', span.attr('ng-exception'));

  a.scope.$set('error.throw', function(){throw "MyError";});
  a.scope.$eval();
  span = childNode(doc, 0);
  assertTrue(span.hasClass('ng-exception'));
  assertTrue(span.text(), span.text().match('MyError') !== null);
  assertEquals('"MyError"', span.attr('ng-exception'));

  a.scope.$set('error.throw', function(){return "ok";});
  a.scope.$eval();
  assertFalse(span.hasClass('ng-exception'));
  assertEquals('ok', span.text());
  assertEquals(null, span.attr('ng-exception'));
};

BinderTest.prototype.testIfAttrBindingThrowsErrorDecorateTheAttribute = function(){
  var a = this.compile('<div attr="before {{error.throw()}} after"></div>');
  var doc = a.node;

  a.scope.$set('error.throw', function(){throw "ErrorMsg";});
  a.scope.$eval();
  assertTrue('ng-exception', doc.hasClass('ng-exception'));
  assertEquals('"ErrorMsg"', doc.attr('ng-exception'));
  assertEquals('before "ErrorMsg" after', doc.attr('attr'));

  a.scope.$set('error.throw', function(){ return 'X';});
  a.scope.$eval();
  assertFalse('!ng-exception', doc.hasClass('ng-exception'));
  assertEquals('before X after', doc.attr('attr'));
  assertEquals(null, doc.attr('ng-exception'));

};

BinderTest.prototype.testNestedRepeater = function() {
  var a = this.compile('<div><div ng:repeat="m in model" name="{{m.name}}">' +
                   '<ul name="{{i}}" ng:repeat="i in m.item"></ul>' +
                 '</div></div>');

  a.scope.$set('model', [{name:'a', item:['a1', 'a2']}, {name:'b', item:['b1', 'b2']}]);
  a.scope.$eval();

  assertEquals('<div>'+
      '<#comment></#comment>'+
      '<div name="a" ng:bind-attr="{"name":"{{m.name}}"}" ng:repeat-index="0">'+
        '<#comment></#comment>'+
        '<ul name="a1" ng:bind-attr="{"name":"{{i}}"}" ng:repeat-index="0"></ul>'+
        '<ul name="a2" ng:bind-attr="{"name":"{{i}}"}" ng:repeat-index="1"></ul>'+
      '</div>'+
      '<div name="b" ng:bind-attr="{"name":"{{m.name}}"}" ng:repeat-index="1">'+
        '<#comment></#comment>'+
        '<ul name="b1" ng:bind-attr="{"name":"{{i}}"}" ng:repeat-index="0"></ul>'+
        '<ul name="b2" ng:bind-attr="{"name":"{{i}}"}" ng:repeat-index="1"></ul>'+
      '</div></div>', sortedHtml(a.node));
};

BinderTest.prototype.testHideBindingExpression = function() {
  var a = this.compile('<div ng:hide="hidden == 3"/>');

  a.scope.$set('hidden', 3);
  a.scope.$eval();

  assertHidden(a.node);

  a.scope.$set('hidden', 2);
  a.scope.$eval();

  assertVisible(a.node);
};

BinderTest.prototype.testHideBinding = function() {
  var c = this.compile('<div ng:hide="hidden"/>');

  c.scope.$set('hidden', 'true');
  c.scope.$eval();

  assertHidden(c.node);

  c.scope.$set('hidden', 'false');
  c.scope.$eval();

  assertVisible(c.node);

  c.scope.$set('hidden', '');
  c.scope.$eval();

  assertVisible(c.node);
};

BinderTest.prototype.testShowBinding = function() {
  var c = this.compile('<div ng:show="show"/>');

  c.scope.$set('show', 'true');
  c.scope.$eval();

  assertVisible(c.node);

  c.scope.$set('show', 'false');
  c.scope.$eval();

  assertHidden(c.node);

  c.scope.$set('show', '');
  c.scope.$eval();

  assertHidden(c.node);
};

BinderTest.prototype.testBindClassUndefined = function() {
  var doc = this.compile('<div ng:class="undefined"/>');
  doc.scope.$eval();

  assertEquals(
      '<div class="undefined" ng:class="undefined"></div>',
      sortedHtml(doc.node));
};

BinderTest.prototype.testBindClass = function() {
  var c = this.compile('<div ng:class="class"/>');

  c.scope.$set('class', 'testClass');
  c.scope.$eval();

  assertEquals('<div class="testClass" ng:class="class"></div>', sortedHtml(c.node));

  c.scope.$set('class', ['a', 'b']);
  c.scope.$eval();

  assertEquals('<div class="a b" ng:class="class"></div>', sortedHtml(c.node));
};

BinderTest.prototype.testBindClassEvenOdd = function() {
  var x = this.compile('<div><div ng:repeat="i in [0,1]" ng:class-even="\'e\'" ng:class-odd="\'o\'"/></div>');
  x.scope.$eval();
  var d1 = jqLite(x.node[0].childNodes[1]);
  var d2 = jqLite(x.node[0].childNodes[2]);
  expect(d1.hasClass('o')).toBeTruthy();
  expect(d2.hasClass('e')).toBeTruthy();
  assertEquals(
      '<div><#comment></#comment>' +
      '<div class="o" ng:class-even="\'e\'" ng:class-odd="\'o\'" ng:repeat-index="0"></div>' +
      '<div class="e" ng:class-even="\'e\'" ng:class-odd="\'o\'" ng:repeat-index="1"></div></div>',
      sortedHtml(x.node));
};

BinderTest.prototype.testBindStyle = function() {
  var c = this.compile('<div ng:style="style"/>');

  c.scope.$eval('style={color:"red"}');
  c.scope.$eval();

  assertEquals("red", c.node.css('color'));

  c.scope.$eval('style={}');
  c.scope.$eval();
};

BinderTest.prototype.testActionOnAHrefThrowsError = function(){
  var model = {books:[]};
  var c = this.compile('<a ng:click="action()">Add Phone</a>', model);
  c.scope.action = function(){
    throw {a:'abc', b:2};
  };
  var input = c.node;
  input.trigger('click');
  var error = fromJson(input.attr('ng-exception'));
  assertEquals("abc", error.a);
  assertEquals(2, error.b);
  assertTrue("should have an error class", input.hasClass('ng-exception'));

  // TODO: I think that exception should never get cleared so this portion of test makes no sense
  //c.scope.action = noop;
  //input.trigger('click');
  //dump(input.attr('ng-error'));
  //assertFalse('error class should be cleared', input.hasClass('ng-exception'));
};

BinderTest.prototype.testShoulIgnoreVbNonBindable = function(){
  var c = this.compile("<div>{{a}}" +
      "<div ng:non-bindable>{{a}}</div>" +
      "<div ng:non-bindable=''>{{b}}</div>" +
      "<div ng:non-bindable='true'>{{c}}</div></div>");
  c.scope.$set('a', 123);
  c.scope.$eval();
  assertEquals('123{{a}}{{b}}{{c}}', c.node.text());
};

BinderTest.prototype.testOptionShouldUpdateParentToGetProperBinding = function() {
  var c = this.compile('<select name="s"><option ng:repeat="i in [0,1]" value="{{i}}" ng:bind="i"></option></select>');
  c.scope.$set('s', 1);
  c.scope.$eval();
  assertEquals(1, c.node[0].selectedIndex);
};

BinderTest.prototype.testRepeaterShouldBindInputsDefaults = function () {
  var c = this.compile('<div><input value="123" name="item.name" ng:repeat="item in items"></div>');
  c.scope.$set('items', [{}, {name:'misko'}]);
  c.scope.$eval();

  assertEquals("123", c.scope.$eval('items[0].name'));
  assertEquals("misko", c.scope.$eval('items[1].name'));
};

BinderTest.prototype.testShouldTemplateBindPreElements = function () {
  var c = this.compile('<pre>Hello {{name}}!</pre>');
  c.scope.$set("name", "World");
  c.scope.$eval();

  assertEquals('<pre ng:bind-template="Hello {{name}}!">Hello World!</pre>', sortedHtml(c.node));
};

BinderTest.prototype.testFillInOptionValueWhenMissing = function() {
  var c = this.compile(
      '<select><option selected="true">{{a}}</option><option value="">{{b}}</option><option>C</option></select>');
  c.scope.$set('a', 'A');
  c.scope.$set('b', 'B');
  c.scope.$eval();
  var optionA = childNode(c.node, 0);
  var optionB = childNode(c.node, 1);
  var optionC = childNode(c.node, 2);

  expect(optionA.attr('value')).toEqual('A');
  expect(optionA.text()).toEqual('A');

  expect(optionB.attr('value')).toEqual('');
  expect(optionB.text()).toEqual('B');

  expect(optionC.attr('value')).toEqual('C');
  expect(optionC.text()).toEqual('C');
};

BinderTest.prototype.testValidateForm = function() {
  var c = this.compile('<div><input name="name" ng:required>' +
          '<div ng:repeat="item in items"><input name="item.name" ng:required/></div></div>');
  var items = [{}, {}];
  c.scope.$set("items", items);
  c.scope.$eval();
  assertEquals(3, c.scope.$get("$invalidWidgets.length"));

  c.scope.$set('name', '');
  c.scope.$eval();
  assertEquals(3, c.scope.$get("$invalidWidgets.length"));

  c.scope.$set('name', ' ');
  c.scope.$eval();
  assertEquals(3, c.scope.$get("$invalidWidgets.length"));

  c.scope.$set('name', 'abc');
  c.scope.$eval();
  assertEquals(2, c.scope.$get("$invalidWidgets.length"));

  items[0].name = 'abc';
  c.scope.$eval();
  assertEquals(1, c.scope.$get("$invalidWidgets.length"));

  items[1].name = 'abc';
  c.scope.$eval();
  assertEquals(0, c.scope.$get("$invalidWidgets.length"));
};

BinderTest.prototype.testValidateOnlyVisibleItems = function(){
  var c = this.compile('<div><input name="name" ng:required><input ng:show="show" name="name" ng:required></div>');
  jqLite(document.body).append(c.node);
  c.scope.$set("show", true);
  c.scope.$eval();
  assertEquals(2, c.scope.$get("$invalidWidgets.length"));

  c.scope.$set("show", false);
  c.scope.$eval();
  assertEquals(1, c.scope.$invalidWidgets.visible());
};

BinderTest.prototype.testDeleteAttributeIfEvaluatesFalse = function() {
  var c = this.compile('<div>' +
      '<input name="a0" ng:bind-attr="{disabled:\'{{true}}\'}"><input name="a1" ng:bind-attr="{disabled:\'{{false}}\'}">' +
      '<input name="b0" ng:bind-attr="{disabled:\'{{1}}\'}"><input name="b1" ng:bind-attr="{disabled:\'{{0}}\'}">' +
      '<input name="c0" ng:bind-attr="{disabled:\'{{[0]}}\'}"><input name="c1" ng:bind-attr="{disabled:\'{{[]}}\'}"></div>');
  c.scope.$eval();
  function assertChild(index, disabled) {
    var child = childNode(c.node, index);
    assertEquals(sortedHtml(child), disabled, !!child.attr('disabled'));
  }

  assertChild(0, true);
  assertChild(1, false);
  assertChild(2, true);
  assertChild(3, false);
  assertChild(4, true);
  assertChild(5, false);
};

BinderTest.prototype.testItShouldDisplayErrorWhenActionIsSyntacticlyIncorect = function(){
  var c = this.compile('<div>' +
      '<input type="button" ng:click="greeting=\'ABC\'"/>' +
      '<input type="button" ng:click=":garbage:"/></div>');
  var first = jqLite(c.node[0].childNodes[0]);
  var second = jqLite(c.node[0].childNodes[1]);

  first.trigger('click');
  assertEquals("ABC", c.scope.greeting);

  second.trigger('click');
  assertTrue(second.hasClass("ng-exception"));
};

BinderTest.prototype.testItShouldSelectTheCorrectRadioBox = function() {
  var c = this.compile('<div>' +
      '<input type="radio" name="sex" value="female"/>' +
      '<input type="radio" name="sex" value="male"/></div>');
  var female = jqLite(c.node[0].childNodes[0]);
  var male = jqLite(c.node[0].childNodes[1]);

  click(female);
  assertEquals("female", c.scope.sex);
  assertEquals(true, female[0].checked);
  assertEquals(false, male[0].checked);
  assertEquals("female", female.val());

  click(male);
  assertEquals("male", c.scope.sex);
  assertEquals(false, female[0].checked);
  assertEquals(true, male[0].checked);
  assertEquals("male", male.val());
};

BinderTest.prototype.testItShouldListenOnRightScope = function() {
  var c = this.compile(
      '<ul ng:init="counter=0; gCounter=0" ng:watch="w:counter=counter+1">' +
      '<li ng:repeat="n in [1,2,4]" ng:watch="w:counter=counter+1;w:$root.gCounter=$root.gCounter+n"/></ul>');
  c.scope.$eval();
  assertEquals(0, c.scope.$get("counter"));
  assertEquals(0, c.scope.$get("gCounter"));

  c.scope.$set("w", "something");
  c.scope.$eval();
  assertEquals(1, c.scope.$get("counter"));
  assertEquals(7, c.scope.$get("gCounter"));
};

BinderTest.prototype.testItShouldRepeatOnHashes = function() {
  var x = this.compile('<ul><li ng:repeat="(k,v) in {a:0,b:1}" ng:bind=\"k + v\"></li></ul>');
  x.scope.$eval();
  assertEquals('<ul>' +
      '<#comment></#comment>' +
      '<li ng:bind=\"k + v\" ng:repeat-index="0">a0</li>' +
      '<li ng:bind=\"k + v\" ng:repeat-index="1">b1</li>' +
      '</ul>',
      sortedHtml(x.node));
};

BinderTest.prototype.testItShouldFireChangeListenersBeforeUpdate = function(){
  var x = this.compile('<div ng:bind="name"></div>');
  x.scope.$set("name", "");
  x.scope.$watch("watched", "name=123");
  x.scope.$set("watched", "change");
  x.scope.$eval();
  assertEquals(123, x.scope.$get("name"));
  assertEquals(
      '<div ng:bind="name">123</div>',
      sortedHtml(x.node));
};

BinderTest.prototype.testItShouldHandleMultilineBindings = function(){
  var x = this.compile('<div>{{\n 1 \n + \n 2 \n}}</div>');
  x.scope.$eval();
  assertEquals("3", x.node.text());
};

BinderTest.prototype.testItBindHiddenInputFields = function(){
  var x = this.compile('<input type="hidden" name="myName" value="abc" />');
  x.scope.$eval();
  assertEquals("abc", x.scope.$get("myName"));
};

BinderTest.prototype.XtestItShouldRenderMultiRootHtmlInBinding = function() {
  var x = this.compile('<div>before {{a|html}}after</div>');
  x.scope.a = "a<b>c</b>d";
  x.scope.$eval();
  assertEquals(
      '<div>before <span ng:bind="a|html">a<b>c</b>d</span>after</div>',
      sortedHtml(x.node));
};

BinderTest.prototype.testItShouldUseFormaterForText = function() {
  var x = this.compile('<input name="a" ng:format="list" value="a,b">');
  x.scope.$eval();
  assertEquals(['a','b'], x.scope.$get('a'));
  var input = x.node;
  input[0].value = ' x,,yz';
  input.trigger('change');
  assertEquals(['x','yz'], x.scope.$get('a'));
  x.scope.$set('a', [1 ,2, 3]);
  x.scope.$eval();
  assertEquals('1, 2, 3', input[0].value);
};

