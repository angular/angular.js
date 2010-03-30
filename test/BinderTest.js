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
  if (this.element) this.element.remove();
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
  var form = this.compile('<input type="checkbox" name="model.price" value="true" checked ng-format="boolean">');
  assertEquals(true, form.scope.model.price);
};

BinderTest.prototype.testBindUpdate = function() {
  var c = this.compile('<div ng-eval="a=123"/>');
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
  var c = this.compile('<div ng-init="a=123">');
  assertEquals(c.scope.$get('a'), 123);
};

BinderTest.prototype.testExecuteInitializationStatements = function() {
  var c = this.compile('<div ng-init="a=123;b=345">');
  assertEquals(c.scope.$get('a'), 123);
  assertEquals(c.scope.$get('b'), 345);
};

BinderTest.prototype.testApplyTextBindings = function(){
  var form = this.compile('<div ng-bind="model.a">x</div>');
  form.scope.$set('model', {a:123});
  form.scope.$eval();
  assertEquals('123', form.node.text());
};

BinderTest.prototype.testReplaceBindingInTextWithSpan = function() {
  assertEquals(this.compileToHtml("<b>a{{b}}c</b>"), '<b>a<span ng-bind="b"></span>c</b>');
  assertEquals(this.compileToHtml("<b>{{b}}</b>"), '<b><span ng-bind="b"></span></b>');
};

BinderTest.prototype.XtestBindingSpaceConfusesIE = function() {
  //if (!msie) return;
  var span = document.createElement("span");
  span.innerHTML = '&nbsp;';
  var nbsp = span.firstChild.nodeValue;
  assertEquals(
      '<b><span ng-bind="a"></span><span>'+nbsp+'</span><span ng-bind="b"></span></b>',
      this.compileToHtml("<b>{{a}} {{b}}</b>"));
  assertEquals(
      '<span ng-bind="A"></span><span>'+nbsp+'x </span><span ng-bind="B"></span><span>'+nbsp+'(</span><span ng-bind="C"></span>',
      this.compileToHtml("{{A}} x {{B}} ({{C}})"));
};

BinderTest.prototype.testBindingOfAttributes = function() {
  var c = this.compile("<a href='http://s/a{{b}}c' foo='x'></a>");
  var attrbinding = c.node.attr("ng-bind-attr");
  var bindings = fromJson(attrbinding);
  assertEquals("http://s/a{{b}}c", decodeURI(bindings.href));
  assertTrue(!bindings.foo);
};

BinderTest.prototype.testMarkMultipleAttributes = function() {
  var c = this.compile('<a href="http://s/a{{b}}c" foo="{{d}}"></a>');
  var attrbinding = c.node.attr("ng-bind-attr");
  var bindings = fromJson(attrbinding);
  assertEquals(bindings.foo, "{{d}}");
  assertEquals(decodeURI(bindings.href), "http://s/a{{b}}c");
};

BinderTest.prototype.testAttributesNoneBound = function() {
  var c = this.compile("<a href='abc' foo='def'></a>");
  var a = c.node;
  assertEquals(a[0].nodeName, "A");
  assertTrue(!a.attr("ng-bind-attr"));
};

BinderTest.prototype.testExistingAttrbindingIsAppended = function() {
  var c = this.compile("<a href='http://s/{{abc}}' ng-bind-attr='{\"b\":\"{{def}}\"}'></a>");
  var a = c.node;
  assertEquals('{"b":"{{def}}","href":"http://s/{{abc}}"}', a.attr('ng-bind-attr'));
};

BinderTest.prototype.testAttributesAreEvaluated = function(){
  var c = this.compile('<a ng-bind-attr=\'{"a":"a", "b":"a+b={{a+b}}"}\'></a>');
  var binder = c.binder, form = c.node;
  c.scope.$eval('a=1;b=2');
  c.scope.$eval();
  var a = c.node;
  assertEquals(a.attr('a'), 'a');
  assertEquals(a.attr('b'), 'a+b=3');
};

BinderTest.prototype.XtestInputsAreUpdated = function(){
  var a =
     this.compile('<div>' +
         '<input type="tEXt" name="A.text"/>' +
          '<textarea name="A.textarea"></textarea>' +
          '<input name="A.radio" type="rADio" value="r"/>' +
          '<input name="A.radioOff" type="rADio" value="r"/>' +
          '<input name="A.checkbox" type="checkbox" value="c" />' +
          '<input name="A.checkboxOff" type="checkbox" value="c" />' +
          '<select name="A.select"><option>a</option><option value="S">b</option></select>' +
        '</div>');
  var form = a.node;
  a.scope.$set('A', {text:"t1", textarea:"t2", radio:"r", checkbox:"c", select:"S"});
  a.scope.$eval();
  assertEquals(form.find("input[type=text]").attr('value'), 't1');
  assertEquals(form.find("textarea").attr('value'), 't2');
  assertTrue(form.find("input[name=A.radio]").attr('checked'));
  assertTrue(!form.find("input[name=A.radioOff]").attr('checked'));
  assertTrue(form.find("input[name=A.checkbox]").attr('checked'));
  assertTrue(!form.find("input[name=A.checkboxOff]").attr('checked'));
  assertEquals(form.find("select").attr('value'), 'S');
  assertEquals(form.find("option[selected]").text(), 'b');
};

BinderTest.prototype.xtestInputTypeButtonActionExecutesInScope =  function(){
  var savedCalled = false;
  var c = this.compile('<input type="button" ng-action="person.save()" value="Apply">');
  c.scope.$set("person.save", function(){
    savedCalled = true;
  });
  c.node.click();
  assertTrue(savedCalled);
};

BinderTest.prototype.testInputTypeButtonActionExecutesInScope =  function(){
  expectAsserts(1);
  var c = this.compile('<input type="image" ng-action="action()">');
  c.scope.$set("action", function(){
    assertTrue(true);
  });
  c.node.click();
};

BinderTest.prototype.testButtonElementActionExecutesInScope =  function(){
  var savedCalled = false;
  var c = this.compile('<button ng-action="person.save()">Apply</button>');
  c.scope.$set("person.save", function(){
    savedCalled = true;
  });
  c.node.click();
  assertTrue(savedCalled);
};

BinderTest.prototype.XtestParseEmptyAnchor = function(){
  var binder = this.compile("<div/>").binder;
  var location = binder.location;
  var anchor = binder.anchor;
  location.url = "a#x=1";
  binder.parseAnchor();
  assertEquals(1, binder.anchor.x);
  location.url = "a#";
  binder.parseAnchor();
  assertTrue("old values did not get removed", !binder.anchor.x);
  assertTrue("anchor gor replaced", anchor === binder.anchor);
  assertEquals('undefined', typeof (anchor[""]));
};

BinderTest.prototype.XtestParseAnchor = function(){
  var binder = this.compile("<div/>").binder;
  var location = binder.location;
  location.url = "a#x=1";
  binder.parseAnchor();
  assertEquals(binder.anchor.x, "1");
  location.url = "a#a=b&c=%20&d";
  binder.parseAnchor();
  assertEquals(binder.anchor.a, 'b');
  assertEquals(binder.anchor.c, ' ');
  assertTrue(binder.anchor.d !== null);
  assertTrue(!binder.anchor.x);
};

BinderTest.prototype.XtestWriteAnchor = function(){
  var binder = this.compile("<div/>").binder;
  binder.location.set('a');
  binder.anchor.a = 'b';
  binder.anchor.c = ' ';
  binder.anchor.d = true;
  binder.updateAnchor();
  assertEquals(binder.location.get(), "a#a=b&c=%20&d");
};

BinderTest.prototype.XtestWriteAnchorAsPartOfTheUpdateView = function(){
  var binder = this.compile("<div/>").binder;
  binder.location.set('a');
  binder.anchor.a = 'b';
  binder.updateView();
  assertEquals(binder.location.get(), "a#a=b");
};

BinderTest.prototype.XtestRepeaterUpdateBindings = function(){
  var a = this.compile('<ul><LI ng-repeat="item in model.items" ng-bind="item.a"/></ul>');
  var form = a.node;
  var items = [{a:"A"}, {a:"B"}];
  var initialDataCount = _(jQuery.cache).size();
  assertTrue("" + initialDataCount, initialDataCount > 0);
  a.scope.$set('model', {items:items});

  a.scope.$eval();
  assertEquals('<ul>' +
        '<#comment></#comment>' +
        '<li ng-bind="item.a" ng-repeat-index="0">A</li>' +
        '<li ng-bind="item.a" ng-repeat-index="1">B</li>' +
        '</ul>', sortedHtml(form));

  items.unshift({a:'C'});
  a.scope.$eval();
  assertEquals('<ul>' +
        '<#comment></#comment>' +
        '<li ng-bind="item.a" ng-repeat-index="0">C</li>' +
        '<li ng-bind="item.a" ng-repeat-index="1">A</li>' +
        '<li ng-bind="item.a" ng-repeat-index="2">B</li>' +
        '</ul>', sortedHtml(form));

  items.shift();
  a.scope.$eval();
  assertEquals('<ul>' +
        '<#comment></#comment>' +
        '<li ng-bind="item.a" ng-repeat-index="0">A</li>' +
        '<li ng-bind="item.a" ng-repeat-index="1">B</li>' +
        '</ul>', sortedHtml(form));

  items.shift();
  items.shift();
  a.scope.$eval();
  var currentDataCount = _(jQuery.cache).size();
  assertEquals("I have leaked " + (currentDataCount - initialDataCount), initialDataCount, currentDataCount);
};

BinderTest.prototype.XtestRepeaterContentDoesNotBind = function(){
  var a = this.compile('<ul><LI ng-repeat="item in model.items"><span ng-bind="item.a"></span></li></ul>');
  a.scope.$set('model', {items:[{a:"A"}]});
  a.scope.$eval();
  assertEquals('<ul>' +
        '<#comment></#comment>' +
        '<li ng-repeat-index="0"><span ng-bind="item.a">A</span></li>' +
        '</ul>', sortedHtml(a.node));
};

BinderTest.prototype.XtestShouldBindActionsOnRepeaterClone = function(){
  var c = this.compile('<a ng-repeat="item in items" href="#" ng-action="result.value = item">link</a>');
  jQuery(c).die();
  c.scope.$set('result.value', false);
  c.scope.$set('items', ['abc', 'xyz']);
  c.scope.updateView();
  assertEquals(2, c.node.find("a").size());
  c.node.find("a:last").click();
  assertEquals('xyz', c.scope.$get('result.value'));
};



BinderTest.prototype.XtestRepeaterInputContentDoesNotBind =  function(){
  var c = compil('<ul><LI repeater="item in model.items">' +
                 '<input type="text" name="item.a" value="OLD"/></li></ul>');
  c.scope.items = [{a:"A"}];
  assertEquals(c.node.find(":input").attr("value"), "OLD");
};

BinderTest.prototype.XtestExpandEntityTag = function(){
  assertEquals(
      '<div ng-entity="Person" ng-watch="$anchor.a:1"></div>',
      this.compileToHtml('<div ng-entity="Person" ng-watch="$anchor.a:1"/>'));
};

BinderTest.prototype.XtestExpandEntityTagWithDefaults = function(){
  assertEquals(
      '<div ng-entity="Person:{a:\"a\"}" ng-watch=""></div>',
      this.compileToHtml('<div ng-entity=\'Person:{a:"a"}\'/>'));
};

BinderTest.prototype.XtestExpandEntityTagWithName = function(){
  var c = this.compile('<div ng-entity="friend=Person"/>');
  assertEquals(
      '<div ng-entity="friend=Person" ng-watch="$anchor.friend:{friend=Person.load($anchor.friend);friend.$$anchor=\"friend\";};"></div>',
      sortedHtml(c.node));
  assertEquals("Person", c.scope.$get("friend.$entity"));
  assertEquals("friend", c.scope.$get("friend.$$anchor"));
};

BinderTest.prototype.XtestExpandSubmitButtonToAction = function(){
  var html = this.compileToHtml('<input type="submit" value="Save">');
  assertTrue(html, html.indexOf('ng-action="$save()"') > 0 );
  assertTrue(html, html.indexOf('ng-bind-attr="{"disabled":"{{$invalidWidgets}}"}"') > 0 );
};

BinderTest.prototype.XtestDoNotOverwriteCustomAction = function(){
  var html = this.compileToHtml('<input type="submit" value="Save" action="foo();">');
  assertTrue(html.indexOf('action="foo();"') > 0 );
};

BinderTest.prototype.XtestReplaceFileUploadWithSwf = function(){
  expectAsserts(1);
  var form = jQuery("body").append('<div id="testTag"><input type="file"></div>');
  form.data('scope', new Scope());
  var factory = {};
  var binder = new Binder(form.get(0), factory, new MockLocation());
  factory.createController = function(node){
    assertEquals(node.attr('type'), 'file');
    return {updateModel:function(){}};
  };
  binder.compile();
  jQuery("#testTag").remove();
};

BinderTest.prototype.XtestRepeaterAdd = function(){
  var c = this.compile('<div><input type="text" name="item.x" ng-repeat="item in items"></div>');
  var doc = c.node;
  c.scope.$set('items', [{x:'a'}, {x:'b'}]);
  c.binder.compile();
  c.scope.$eval();
  assertEquals('a', doc.find(':input')[0].value);
  assertEquals('b', doc.find(':input')[1].value);

  var first = doc.find('[ng-repeat-index="0"]');
  first[0].value = 'ABC';
  first.trigger('keyup');
  assertEquals(doc.scope().get('items')[0].x, 'ABC');
};

BinderTest.prototype.XtestItShouldRemoveExtraChildrenWhenIteratingOverHash = function(){
  var c = this.compile('<div ng-repeat="i in items">{{i}}</div>');
  var items = {};
  c.scope.$set("items", items);

  c.scope.$eval();
  expect(c.node.find("div").size()).toEqual(0);

  items.name = "misko";
  c.scope.$eval();
  expect(c.node.find("div").size()).toEqual(1);

  delete items.name;
  c.scope.$eval();
  expect(c.node.find("div").size()).toEqual(0);
};

BinderTest.prototype.XtestIfTextBindingThrowsErrorDecorateTheSpan = function(){
  var a = this.compile('<div>{{error.throw()}}</div>');
  var doc = a.node.find('div');

  a.scope.$set('error.throw', function(){throw "ErrorMsg1";});
  a.scope.$eval();
  var span = doc.find('span');
  assertTrue(span.hasClass('ng-exception'));
  assertEquals('ErrorMsg1', fromJson(span.text()));
  assertEquals('"ErrorMsg1"', span.attr('ng-error'));

  a.scope.$set('error.throw', function(){throw "MyError";});
  a.scope.$eval();
  span = doc.find('span');
  assertTrue(span.hasClass('ng-exception'));
  assertTrue(span.text(), span.text().match('MyError') !== null);
  assertEquals('"MyError"', span.attr('ng-error'));

  a.scope.$set('error.throw', function(){return "ok";});
  a.scope.$eval();
  assertFalse(span.hasClass('ng-exception'));
  assertEquals('ok', span.text());
  assertEquals(null, span.attr('ng-error'));
};

BinderTest.prototype.XtestIfAttrBindingThrowsErrorDecorateTheSpan = function(){
  var a = this.compile('<div attr="before {{error.throw()}} after"></div>');
  var doc = a.node.find("div");

  a.scope.$set('error.throw', function(){throw "ErrorMsg";});
  a.scope.$eval();
  assertTrue('ng-exception', doc.hasClass('ng-exception'));
  assertEquals('before ["ErrorMsg"] after', doc.attr('attr'));
  assertEquals('"ErrorMsg"', doc.attr('ng-error'));

  a.scope.$set('error.throw', function(){ return 'X';});
  a.scope.$eval();
  assertFalse('!ng-exception', doc.hasClass('ng-exception'));
  assertEquals('before X after', doc.attr('attr'));
  assertEquals(null, doc.attr('ng-error'));

};

BinderTest.prototype.XtestNestedRepeater = function() {
  var a = this.compile('<div ng-repeat="m in model" name="{{m.name}}">' +
                   '<ul name="{{i}}" ng-repeat="i in m.item"></ul>' +
                 '</div>');

  a.scope.$set('model', [{name:'a', item:['a1', 'a2']}, {name:'b', item:['b1', 'b2']}]);
  a.scope.$eval();

  assertEquals(
      //'<#comment></#comment>'+
      '<div name="a" ng-bind-attr="{"name":"{{m.name}}"}" ng-repeat-index="0">'+
        '<#comment></#comment>'+
        '<ul name="a1" ng-bind-attr="{"name":"{{i}}"}" ng-repeat-index="0"></ul>'+
        '<ul name="a2" ng-bind-attr="{"name":"{{i}}"}" ng-repeat-index="1"></ul>'+
      '</div>'+
      '<div name="b" ng-bind-attr="{"name":"{{m.name}}"}" ng-repeat-index="1">'+
        '<#comment></#comment>'+
        '<ul name="b1" ng-bind-attr="{"name":"{{i}}"}" ng-repeat-index="0"></ul>'+
        '<ul name="b2" ng-bind-attr="{"name":"{{i}}"}" ng-repeat-index="1"></ul>'+
      '</div>', sortedHtml(a.node));
};

BinderTest.prototype.XtestRadioButtonGetsPrefixed = function () {
  var a = this.compile('<input ng-repeat="m in model" type="radio" name="m.a" value="on"/>');
  a.scope.$set('model', ['a1', 'a2']);
  a.scope.$eval();

  assertEquals(
      //'<#comment></#comment>'+
      '<input name="0:m.a" ng-repeat-index="0" type="radio" value="on"></input>'+
      '<input name="1:m.a" ng-repeat-index="1" type="radio" value="on"></input>',
      sortedHtml(a.node));
};

BinderTest.prototype.XtestHideBindingExpression = function() {
  var a = this.compile('<div ng-hide="hidden == 3"/>');

  a.scope.$set('hidden', 3);
  a.scope.$eval();

  assertHidden(a.node.children());

  a.scope.$set('hidden', 2);
  a.scope.$eval();

  assertVisible(a.node.children());
};

BinderTest.prototype.XtestHideBinding = function() {
  var c = this.compile('<div ng-hide="hidden"/>');

  c.scope.$set('hidden', 'true');
  c.scope.$eval();

  assertHidden(c.node.children());

  c.scope.$set('hidden', 'false');
  c.scope.$eval();

  assertVisible(c.node.children());

  c.scope.$set('hidden', '');
  c.scope.$eval();

  assertVisible(c.node.children());
};

BinderTest.prototype.XtestShowBinding = function() {
  var c = this.compile('<div ng-show="show"/>');

  c.scope.$set('show', 'true');
  c.scope.$eval();

  assertVisible(c.node.children());

  c.scope.$set('show', 'false');
  c.scope.$eval();

  assertHidden(c.node.children());

  c.scope.$set('show', '');
  c.scope.$eval();

  assertHidden(c.node.children());
};

BinderTest.prototype.XtestBindClassUndefined = function() {
  var doc = this.compile('<div ng-class="undefined"/>');
  doc.scope.$eval();

  assertEquals(
      '<div ng-class="undefined"></div>',
      sortedHtml(doc.node));
};

BinderTest.prototype.XtestBindClass = function() {
  var c = this.compile('<div ng-class="class"/>');

  c.scope.$set('class', 'testClass');
  c.scope.$eval();

  assertEquals(sortedHtml(c.node),
      '<div class="testClass" ng-class="class"></div>');

  c.scope.$set('class', ['a', 'b']);
  c.scope.$eval();

  assertEquals(sortedHtml(c.node),
      '<div class="a,b" ng-class="class"></div>');
};

BinderTest.prototype.XtestBindClassEvenOdd = function() {
  var x = this.compile('<div ng-repeat="i in [0,1]" ng-class-even="\'e\'" ng-class-odd="\'o\'"/>');
  x.scope.$eval();
  assertEquals(
      '<div class="o" ng-class-even="\'e\'" ng-class-odd="\'o\'" ng-repeat-index="0"></div>' +
      '<div class="e" ng-class-even="\'e\'" ng-class-odd="\'o\'" ng-repeat-index="1"></div>',
      sortedHtml(x.node));
};

BinderTest.prototype.XtestBindStyle = function() {
  var c = this.compile('<div ng-style="style"/>');

  c.scope.eval('style={color:"red"}');
  c.scope.$eval();

  assertEquals("red", c.node.find('div').css('color'));

  c.scope.eval('style={}');
  c.scope.$eval();

  assertEquals(sortedHtml(c.node), '<div ng-style="style"></div>');
};

BinderTest.prototype.XtestActionOnAHrefThrowsError = function(){
  var model = {books:[]};
  var state = this.compile('<a ng-action="throw {a:\'abc\', b:2};">Add Phone</a>', model);
  var input = state.node.find('a');
  input.click();
  assertEquals('abc', fromJson(input.attr('ng-error')).a);
  assertTrue("should have an error class", input.hasClass('ng-exception'));

  input.attr('ng-action', '0');
  input.click();
  assertFalse('error class should be cleared', input.hasClass('ng-exception'));
};

BinderTest.prototype.XtestShoulIgnoreVbNonBindable = function(){
  var c = this.compile("{{a}}" +
      "<div ng-non-bindable>{{a}}</div>" +
      "<div ng-non-bindable=''>{{b}}</div>" +
      "<div ng-non-bindable='true'>{{c}}</div>");
  c.scope.$set('a', 123);
  c.scope.updateView();
  assertEquals('123{{a}}{{b}}{{c}}', c.node.text());
};

BinderTest.prototype.XtestOptionShouldUpdateParentToGetProperBinding = function() {
  var c = this.compile('<select name="s"><option ng-repeat="i in [0,1]" value="{{i}}" ng-bind="i"></option></select>');
  c.scope.$set('s', 1);
  c.scope.$eval();
  assertEquals(1, c.node.find('select')[0].selectedIndex);
};

BinderTest.prototype.XtestRepeaterShouldBindInputsDefaults = function () {
  var c = this.compile('<input value="123" name="item.name" ng-repeat="item in items">');
  c.scope.$set('items', [{}, {name:'misko'}]);
  c.scope.$eval();

  assertEquals("123", c.scope.eval('items[0].name'));
  assertEquals("misko", c.scope.eval('items[1].name'));
};

BinderTest.prototype.XtestRepeaterShouldCreateArray = function () {
  var c = this.compile('<input value="123" name="item.name" ng-repeat="item in items">');
  c.scope.$eval();

  assertEquals(0, c.scope.$get('items').length);
};

BinderTest.prototype.XtestShouldTemplateBindPreElements = function () {
  var c = this.compile('<pre>Hello {{name}}!</pre>');
  c.scope.$set("name", "World");
  c.scope.$eval();

  assertEquals('<pre ng-bind-template="Hello {{name}}!">Hello World!</pre>', sortedHtml(c.node));
};

BinderTest.prototype.XtestDissableAutoSubmit = function() {
  var c = this.compile('<input type="submit" value="S"/>', null, {autoSubmit:true});
  assertEquals(
      '<input ng-action="$save()" ng-bind-attr="{"disabled":"{{$invalidWidgets}}"}" type="submit" value="S"></input>',
      sortedHtml(c.node));

  c = this.compile('<input type="submit" value="S"/>', null, {autoSubmit:false});
  assertEquals(
      '<input type="submit" value="S"></input>',
      sortedHtml(c.node));
};

BinderTest.prototype.XtestSettingAnchorToNullOrUndefinedRemovesTheAnchorFromURL = function() {
  var c = this.compile('');
  c.binder.location.set("http://server/#a=1&b=2");
  c.binder.parseAnchor();
  assertEquals('1', c.binder.anchor.a);
  assertEquals('2', c.binder.anchor.b);

  c.binder.anchor.a = null;
  c.binder.anchor.b = null;
  c.binder.updateAnchor();
  assertEquals('http://server/#', c.binder.location.get());
};

BinderTest.prototype.XtestFillInOptionValueWhenMissing = function() {
  var c = this.compile(
      '<select><option selected="true">{{a}}</option><option value="">{{b}}</option><option>C</option></select>');
  c.scope.$set('a', 'A');
  c.scope.$set('b', 'B');
  c.scope.$eval();

  expect(c.node.find("option:first").attr('value')).toEqual('A');
  expect(c.node.find("option:first").text()).toEqual('A');

  expect(c.node.find("option:nth-child(2)").attr('value')).toEqual('');
  expect(c.node.find("option:nth-child(2)").text()).toEqual('B');

  expect(c.node.find("option:last").attr('value')).toEqual('C');
  expect(c.node.find("option:last").text()).toEqual('C');
};

BinderTest.prototype.XtestValidateForm = function() {
  var c = this.compile('<input name="name" ng-required>' +
      '<div ng-repeat="item in items"><input name="item.name" ng-required/></div>');
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

BinderTest.prototype.XtestValidateOnlyVisibleItems = function(){
  var c = this.compile('<input name="name" ng-required><input ng-show="show" name="name" ng-required>');
  c.scope.$set("show", true);
  c.scope.$eval();
  assertEquals(2, c.scope.$get("$invalidWidgets.length"));

  c.scope.$set("show", false);
  c.scope.$eval();
  assertEquals(1, c.scope.$get("$invalidWidgets.length"));
};

BinderTest.prototype.XtestDeleteAttributeIfEvaluatesFalse = function() {
  var c = this.compile(
      '<input name="a0" ng-bind-attr="{disabled:\'{{true}}\'}"><input name="a1" ng-bind-attr="{disabled:\'{{false}}\'}">' +
      '<input name="b0" ng-bind-attr="{disabled:\'{{1}}\'}"><input name="b1" ng-bind-attr="{disabled:\'{{0}}\'}">' +
      '<input name="c0" ng-bind-attr="{disabled:\'{{[0]}}\'}"><input name="c1" ng-bind-attr="{disabled:\'{{[]}}\'}">');
  c.scope.$eval();
  var html = c.node.html();
  assertEquals(html + 0, 1, c.node.find("input[name='a0']:disabled").size());
  assertEquals(html + 1, 1, c.node.find("input[name='b0']:disabled").size());
  assertEquals(html + 2, 1, c.node.find("input[name='c0']:disabled").size());

  assertEquals(html + 3, 0, c.node.find("input[name='a1']:disabled").size());
  assertEquals(html + 4, 0, c.node.find("input[name='b1']:disabled").size());
  assertEquals(html + 5, 0, c.node.find("input[name='c1']:disabled").size());
};

BinderTest.prototype.XtestRepeaterErrorShouldBePlacedOnInstanceNotOnTemplateComment = function () {
  var c = this.compile(
    '<input name="person.{{name}}" ng-repeat="name in [\'a\', \'b\']" />');
  c.scope.$eval();
  assertTrue(c.node.find("input").hasClass("ng-exception"));
};

BinderTest.prototype.XtestItShouldApplyAttirbutesBeforeTheWidgetsAreMaterialized = function() {
  var c = this.compile(
      '<input name="person.{{name}}" ng-repeat="name in [\'a\', \'b\']" />');
  c.scope.$set('person', {a:'misko', b:'adam'});
  c.scope.$eval();
  assertEquals("", c.node.html());
};

BinderTest.prototype.XtestItShouldCallListenersWhenAnchorChanges = function() {
  var log = "";
  var c = this.compile('<div ng-watch="$anchor.counter:count = count+1">');
  c.scope.$set("count", 0);
  c.scope.addWatchListener("$anchor.counter", function(newValue, oldValue){
    log += oldValue + "->" + newValue + ";";
  });
  assertEquals(0, c.scope.$get("count"));
  c.binder.location.url = "#counter=1";
  c.binder.onUrlChange();
  assertEquals(1, c.scope.$get("count"));

  c.binder.location.url = "#counter=1";
  c.binder.onUrlChange();
  assertEquals(1, c.scope.$get("count"));

  c.binder.location.url = "#counter=2";
  c.binder.onUrlChange();
  assertEquals(2, c.scope.$get("count"));

  c.binder.location.url = "#counter=2";
  c.binder.onUrlChange();
  assertEquals(2, c.scope.$get("count"));

  c.binder.location.url = "#";
  c.binder.onUrlChange();
  assertEquals("undefined->1;1->2;2->undefined;", log);
  assertEquals(3, c.scope.$get("count"));
};

BinderTest.prototype.XtestParseQueryString = function(){
  var binder = new Binder();
  assertJsonEquals({"a":"1"}, binder.parseQueryString("a=1"));
  assertJsonEquals({"a":"1", "b":"two"}, binder.parseQueryString("a=1&b=two"));
  assertJsonEquals({}, binder.parseQueryString(""));

  assertJsonEquals({"a":"1", "b":""}, binder.parseQueryString("a=1&b="));
  assertJsonEquals({"a":"1", "b":""}, binder.parseQueryString("a=1&b"));
  assertJsonEquals({"a":"1", "b":" 2 "}, binder.parseQueryString("a=1&b=%202%20"));
  assertJsonEquals({"a a":"1", "b":"2"}, binder.parseQueryString("a%20a=1&b=2"));

};

BinderTest.prototype.XtestSetBinderAnchorTriggersListeners = function(){
  expectAsserts(2);
  var doc = this.compile("<div/>");

  doc.scope.addWatchListener("$anchor.name", function(newVal, oldVal) {
    assertEquals("new", newVal);
    assertEquals(undefined, oldVal);
  });

  doc.binder.anchor.name = "new";
  doc.binder.onUrlChange("http://base#name=new");
};

BinderTest.prototype.XtestItShouldDisplayErrorWhenActionIsSyntacticlyIncorect = function(){
  var c = this.compile(
      '<input type="button" ng-action="greeting=\'ABC\'"/>' +
      '<input type="button" ng-action=":garbage:"/>');
  c.node.find("input").click();
  assertEquals("ABC", c.scope.$get('greeting'));
  assertTrue(c.node.find(":input:last").hasClass("ng-exception"));
};

BinderTest.prototype.XtestItShouldSelectTheCorrectRadioBox = function() {
  var c = this.compile(
      '<input type="radio" name="sex" value="female"/>' +
      '<input type="radio" name="sex" value="male"/>');

  c.node.find("input[value=female]").click();
  assertEquals("female", c.scope.$get("sex"));
  assertEquals(1, c.node.find("input:checked").size());
  assertEquals("female", c.node.find("input:checked").attr("value"));

  c.node.find("input[value=male]").click();
  assertEquals("male", c.scope.$get("sex"));
  assertEquals(1, c.node.find("input:checked").size());
  assertEquals("male", c.node.find("input:checked").attr("value"));
};

BinderTest.prototype.XtestItShouldListenOnRightScope = function() {
  var c = this.compile(
      '<div ng-init="counter=0; gCounter=0" ng-watch="w:counter=counter+1">' +
      '<div ng-repeat="n in [1,2,4]" ng-watch="w:counter=counter+1;w:$root.gCounter=$root.gCounter+n"/>');
  c.binder.executeInit();
  c.scope.$eval();
  assertEquals(0, c.scope.$get("counter"));
  assertEquals(0, c.scope.$get("gCounter"));

  c.scope.$set("w", "something");
  c.scope.$eval();
  assertEquals(1, c.scope.$get("counter"));
  assertEquals(7, c.scope.$get("gCounter"));
};

BinderTest.prototype.XtestItShouldRepeatOnHashes = function() {
  var x = this.compile('<div ng-repeat="(k,v) in {a:0,b:1}" ng-bind=\"k + v\"></div>');
  x.scope.$eval();
  assertEquals(
      '<div ng-bind=\"k + v\" ng-repeat-index="0">a0</div>' +
      '<div ng-bind=\"k + v\" ng-repeat-index="1">b1</div>',
      sortedHtml(x.node));
};

BinderTest.prototype.XtestItShouldFireChangeListenersBeforeUpdate = function(){
  var x = this.compile('<div ng-bind="name"></div>');
  x.scope.$set("name", "");
  x.scope.$set("watched", "change");
  x.scope.watch("watched:name=123");
  x.scope.updateView();
  assertEquals(123, x.scope.$get("name"));
  assertEquals(
      '<div ng-bind="name">123</div>',
      sortedHtml(x.node));
};

BinderTest.prototype.XtestItShouldHandleMultilineBindings = function(){
  var x = this.compile('<div>{{\n 1 \n + \n 2 \n}}</div>');
  x.scope.updateView();
  assertEquals("3", x.node.text());
};

BinderTest.prototype.XtestItBindHiddenInputFields = function(){
  var x = this.compile('<input type="hidden" name="myName" value="abc" />');
  x.scope.updateView();
  assertEquals("abc", x.scope.$get("myName"));
};

BinderTest.prototype.XtestItShouldRenderMultiRootHtmlInBinding = function() {
  var x = this.compile('<div>before {{a|html}}after</div>');
  x.scope.$set("a", "a<b>c</b>d");
  x.scope.$eval();
  assertEquals(
      '<div>before <span ng-bind="a|html">a<b>c</b>d</span>after</div>',
      sortedHtml(x.node));
};

BinderTest.prototype.XtestItShouldUseFormaterForText = function() {
  var x = this.compile('<input name="a" ng-format="list" value="a,b">');
  x.scope.$eval();
  assertEquals(['a','b'], x.scope.$get('a'));
  var input = x.node.find('input');
  input[0].value = ' x,,yz';
  input.change();
  assertEquals(['x','yz'], x.scope.$get('a'));
  x.scope.$set('a', [1 ,2, 3]);
  x.scope.$eval();
  assertEquals('1, 2, 3', input[0].value);
};
