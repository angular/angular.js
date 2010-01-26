BinderTest = TestCase('BinderTest');

function compile(content, initialScope, config) {
  var h = html(content);
  config = config || {autoSubmit:true};
  var scope = new Scope(initialScope, "ROOT");
  h.data('scope', scope);
  var datastore = new DataStore();
  var binder = new Binder(h[0], new WidgetFactory(), datastore, new MockLocation(), config);
  scope.set("$updateView", _(binder.updateView).bind(binder));
  scope.set("$anchor", binder.anchor);
  binder.entity(scope);
  binder.compile();
  return {node:h, binder:binder, scope:scope, datastore:datastore};
}

function compileToHtml(content) {
  return compile(content).node.sortedHtml();
}

BinderTest.prototype.testParseTextWithNoBindings = function(){
  var parts = Binder.parseBindings("a");
  assertEquals(parts.length, 1);
  assertEquals(parts[0], "a");
  assertTrue(!Binder.binding(parts[0]));
};

BinderTest.prototype.testParseEmptyText = function(){
  var parts = Binder.parseBindings("");
  assertEquals(parts.length, 1);
  assertEquals(parts[0], "");
  assertTrue(!Binder.binding(parts[0]));
};

BinderTest.prototype.testParseInnerBinding = function(){
  var parts = Binder.parseBindings("a{{b}}c");
  assertEquals(parts.length, 3);
  assertEquals(parts[0], "a");
  assertTrue(!Binder.binding(parts[0]));
  assertEquals(parts[1], "{{b}}");
  assertEquals(Binder.binding(parts[1]), "b");
  assertEquals(parts[2], "c");
  assertTrue(!Binder.binding(parts[2]));
};

BinderTest.prototype.testParseEndingBinding = function(){
  var parts = Binder.parseBindings("a{{b}}");
  assertEquals(parts.length, 2);
  assertEquals(parts[0], "a");
  assertTrue(!Binder.binding(parts[0]));
  assertEquals(parts[1], "{{b}}");
  assertEquals(Binder.binding(parts[1]), "b");
};

BinderTest.prototype.testParseBeggingBinding = function(){
  var parts = Binder.parseBindings("{{b}}c");
  assertEquals(parts.length, 2);
  assertEquals(parts[0], "{{b}}");
  assertEquals(Binder.binding(parts[0]), "b");
  assertEquals(parts[1], "c");
  assertTrue(!Binder.binding(parts[1]));
};

BinderTest.prototype.testParseLoanBinding = function(){
  var parts = Binder.parseBindings("{{b}}");
  assertEquals(parts.length, 1);
  assertEquals(parts[0], "{{b}}");
  assertEquals(Binder.binding(parts[0]), "b");
};

BinderTest.prototype.testParseTwoBindings = function(){
  var parts = Binder.parseBindings("{{b}}{{c}}");
  assertEquals(parts.length, 2);
  assertEquals(parts[0], "{{b}}");
  assertEquals(Binder.binding(parts[0]), "b");
  assertEquals(parts[1], "{{c}}");
  assertEquals(Binder.binding(parts[1]), "c");
};

BinderTest.prototype.testParseTwoBindingsWithTextInMiddle = function(){
  var parts = Binder.parseBindings("{{b}}x{{c}}");
  assertEquals(parts.length, 3);
  assertEquals(parts[0], "{{b}}");
  assertEquals(Binder.binding(parts[0]), "b");
  assertEquals(parts[1], "x");
  assertTrue(!Binder.binding(parts[1]));
  assertEquals(parts[2], "{{c}}");
  assertEquals(Binder.binding(parts[2]), "c");
};

BinderTest.prototype.testParseMultiline = function(){
  var parts = Binder.parseBindings('"X\nY{{A\nB}}C\nD"');
  assertTrue(!!Binder.binding('{{A\nB}}'));
  assertEquals(parts.length, 3);
  assertEquals(parts[0], '"X\nY');
  assertEquals(parts[1], '{{A\nB}}');
  assertEquals(parts[2], 'C\nD"');
};

BinderTest.prototype.testHasBinding = function(){
  assertTrue(Binder.hasBinding("{{a}}"));
  assertTrue(!Binder.hasBinding("a"));
  assertTrue(Binder.hasBinding("{{b}}x{{c}}"));
};


BinderTest.prototype.tearDown = function(){
  jQuery("*", document).die();
  jQuery(document).unbind();
};

BinderTest.prototype.testChangingTextfieldUpdatesModel = function(){
  var state = compile('<input type="text" name="model.price" value="abc">', {model:{}});
  state.binder.updateView();
  assertEquals('abc', state.scope.get('model').price);
};

BinderTest.prototype.testChangingTextareaUpdatesModel = function(){
  var c = compile('<textarea name="model.note">abc</textarea>');
  c.binder.updateView();
  assertEquals(c.scope.get('model').note, 'abc');
};

BinderTest.prototype.testChangingRadioUpdatesModel = function(){
  var c = compile('<input type="radio" name="model.price" value="A" checked>' +
        '<input type="radio" name="model.price" value="B">');
  c.binder.updateView();
  assertEquals(c.scope.get('model').price, 'A');
};

BinderTest.prototype.testChangingCheckboxUpdatesModel = function(){
  var form = compile('<input type="checkbox" name="model.price" value="A" checked>');
  form.scope.set('model', {});
  form.binder.updateView();
  assertEquals('A', form.scope.get('model').price);
};

BinderTest.prototype.testBindUpdate = function() {
  var c = compile('<div ng-eval="a=123"/>');
  c.binder.updateView();
  assertEquals(123, c.scope.get('a'));
};

BinderTest.prototype.testChangingSelectNonSelectedUpdatesModel = function(){
  var form = compile('<select name="model.price"><option value="A">A</option><option value="B">B</option></select>');
  form.scope.set('model', {});
  form.binder.updateView();
  assertEquals('A', form.scope.get('model').price);
};

BinderTest.prototype.testChangingMultiselectUpdatesModel = function(){
  var form = compile('<select name="Invoice.options" multiple="multiple">' +
          '<option value="A" selected>Gift wrap</option>' +
          '<option value="B" selected>Extra padding</option>' +
          '<option value="C">Expedite</option>' +
          '</select>');
  form.scope.set("Invoice", {});
  form.binder.updateView();
  assertJsonEquals(["A", "B"], form.scope.get('Invoice').options);
};

BinderTest.prototype.testChangingSelectSelectedUpdatesModel = function(){
  var form = compile('<select name="model.price"><option>A</option><option selected value="b">B</option></select>');
  form.scope.set('model', {});
  form.binder.updateView();
  assertEquals(form.scope.get('model').price, 'b');
};

BinderTest.prototype.testExecuteInitialization = function() {
  var form = html('<div ng-init="a=123">');
  var scope = new Scope();
  form.data('scope', scope);
  var binder = new Binder(form.get(0));
  binder.executeInit();
  assertEquals(scope.get('a'), 123);
};

BinderTest.prototype.testExecuteInitializationStatements = function() {
  var form = html('<div ng-init="a=123;b=345">');
  var scope = new Scope();
  form.data('scope', scope);
  var binder = new Binder(form.get(0));
  binder.executeInit();
  assertEquals(scope.get('a'), 123);
  assertEquals(scope.get('b'), 345);
};

BinderTest.prototype.testApplyTextBindings = function(){
  var form = compile('<div ng-bind="model.a">x</div>');
  form.scope.set('model', {a:123});
  form.binder.compile();
  form.binder.updateView();
  assertEquals('123', form.node.text());
};

BinderTest.prototype.testReplaceBindingInTextWithSpan = function() {
  assertEquals(compileToHtml("<b>a{{b}}c</b>"), '<b>a<span ng-bind="b"></span>c</b>');
  assertEquals(compileToHtml("<b>{{b}}</b>"), '<b><span ng-bind="b"></span></b>');
};

BinderTest.prototype.testReplaceBindingCreatesCorrectNumberOfWidgets = function() {
  var h = html("space{{a}}<b>{{a}}a{{a}}</b>{{a}}");
  h.data('scope', new Scope());
  var binder = new Binder(h.get(0), new WidgetFactory());
  binder.compile();

  assertEquals(4, h.scope().widgets.length);
};

BinderTest.prototype.testBindingSpaceConfusesIE = function() {
  if (!msie) return;
  var span = document.createElement("span");
  span.innerHTML = '&nbsp;';
  var nbsp = span.firstChild.nodeValue;
  assertEquals(
      '<b><span ng-bind="a"></span><span>'+nbsp+'</span><span ng-bind="b"></span></b>',
      compileToHtml("<b>{{a}} {{b}}</b>"));
  assertEquals(
      '<span ng-bind="A"></span><span>'+nbsp+'x </span><span ng-bind="B"></span><span>'+nbsp+'(</span><span ng-bind="C"></span>',
      compileToHtml("{{A}} x {{B}} ({{C}})"));
};

BinderTest.prototype.testBindingOfAttributes = function() {
  var form = html("<a href='http://s/a{{b}}c' foo='x'></a>");
  form.data('scope', new Scope());
  var binder = new Binder(form.get(0));
  binder.compile();
  var attrbinding = form.find("a").attr("ng-bind-attr");
  var bindings = fromJson(attrbinding);
  assertEquals("http://s/a{{b}}c", decodeURI(bindings.href));
  assertTrue(!bindings.foo);
};

BinderTest.prototype.testMarkMultipleAttributes = function() {
  var form = html("<a href='http://s/a{{b}}c' foo='{{d}}'></a>");
  form.data('scope', new Scope());
  var binder = new Binder(form.get(0));
  binder.compile();
  var attrbinding = form.find("a").attr("ng-bind-attr");
  var bindings = fromJson(attrbinding);
  assertEquals(decodeURI(bindings.href), "http://s/a{{b}}c");
  assertEquals(bindings.foo, "{{d}}");
};

BinderTest.prototype.testAttributesNoneBound = function() {
  var form = html("<a href='abc' foo='def'></a>");
  form.data('scope', new Scope());
  var binder = new Binder(form.get(0));
  binder.compile();
  var a = form.find("a");
  assertEquals(a.get(0).nodeName, "A");
  assertTrue(!a.attr("ng-bind-attr"));
};

BinderTest.prototype.testExistingAttrbindingIsAppended = function() {
  var form = html("<a href='http://s/{{abc}}' ng-bind-attr='{\"b\":\"{{def}}\"}'></a>");
  form.data('scope', new Scope());
  var binder = new Binder(form.get(0));
  binder.compile();
  var a = form.find("a");
  assertEquals('{"b":"{{def}}","href":"http://s/{{abc}}"}', a.attr('ng-bind-attr'));
};

BinderTest.prototype.testAttributesAreEvaluated = function(){
  var c = compile('<a ng-bind-attr=\'{"a":"a", "b":"a+b={{a+b}}"}\'></a>');
  var binder = c.binder, form = c.node;
  c.scope.eval('a=1;b=2');
  binder.updateView();
  var a = form.find("a");
  assertEquals(a.attr('a'), 'a');
  assertEquals(a.attr('b'), 'a+b=3');
};

BinderTest.prototype.testInputsAreUpdated = function(){
  var a =
     compile('<input type="tEXt" name="A.text"/>' +
            '<textarea name="A.textarea"></textarea>' +
            '<input name="A.radio" type="rADio" value="r"/>' +
            '<input name="A.radioOff" type="rADio" value="r"/>' +
            '<input name="A.checkbox" type="checkbox" value="c" />' +
            '<input name="A.checkboxOff" type="checkbox" value="c" />' +
            '<select name="A.select"><option>a</option><option value="S">b</option></select>');
  var binder = a.binder, form = a.node;
  a.scope.set('A', {text:"t1", textarea:"t2", radio:"r", checkbox:"c", select:"S"});
  binder.compile();
  binder.updateView();
  assertEquals(form.find("input[type=text]").attr('value'), 't1');
  assertEquals(form.find("textarea").attr('value'), 't2');
  assertTrue(form.find("input[name=A.radio]").attr('checked'));
  assertTrue(!form.find("input[name=A.radioOff]").attr('checked'));
  assertTrue(form.find("input[name=A.checkbox]").attr('checked'));
  assertTrue(!form.find("input[name=A.checkboxOff]").attr('checked'));
  assertEquals(form.find("select").attr('value'), 'S');
  assertEquals(form.find("option[selected]").text(), 'b');
};

BinderTest.prototype.testInputTypeButtonActionExecutesInScope =  function(){
  var savedCalled = false;
  var c = compile('<input id="apply" type="button" ng-action="person.save()" value="Apply">');
  c.scope.set("person.save", function(){
    savedCalled = true;
  });
  c.node.find("#apply").click();
  assertTrue(savedCalled);
};

BinderTest.prototype.testInputTypeButtonActionExecutesInScope =  function(){
  expectAsserts(1);
  var c = compile('<input id="apply" type="image" ng-action="action()">');
  c.scope.set("action", function(){
    assertTrue(true);
  });
  c.node.find("#apply").click();
};

BinderTest.prototype.testButtonElementActionExecutesInScope =  function(){
  var savedCalled = false;
  var c = compile('<button id="apply" ng-action="person.save()">Apply</button>');
  c.scope.set("person.save", function(){
    savedCalled = true;
  });
  c.node.find("#apply").click();
  assertTrue(savedCalled);
};

BinderTest.prototype.testParseEmptyAnchor = function(){
  var binder = compile("<div/>").binder;
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

BinderTest.prototype.testParseAnchor = function(){
  var binder = compile("<div/>").binder;
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

BinderTest.prototype.testWriteAnchor = function(){
  var binder = compile("<div/>").binder;
  binder.location.set('a');
  binder.anchor.a = 'b';
  binder.anchor.c = ' ';
  binder.anchor.d = true;
  binder.updateAnchor();
  assertEquals(binder.location.get(), "a#a=b&c=%20&d");
};

BinderTest.prototype.testWriteAnchorAsPartOfTheUpdateView = function(){
  var binder = compile("<div/>").binder;
  binder.location.set('a');
  binder.anchor.a = 'b';
  binder.updateView();
  assertEquals(binder.location.get(), "a#a=b");
};

BinderTest.prototype.testRepeaterUpdateBindings = function(){
  var a = compile('<ul><LI ng-repeat="item in model.items" ng-bind="item.a"/></ul>');
  var form = a.node;
  var items = [{a:"A"}, {a:"B"}];
  a.scope.set('model', {items:items});

  a.binder.updateView();
  assertEquals('<ul>' +
        '<#comment></#comment>' +
        '<li ng-bind="item.a" ng-repeat-index="0">A</li>' +
        '<li ng-bind="item.a" ng-repeat-index="1">B</li>' +
        '</ul>', form.sortedHtml());

  items.unshift({a:'C'});
  a.binder.updateView();
  assertEquals('<ul>' +
        '<#comment></#comment>' +
        '<li ng-bind="item.a" ng-repeat-index="0">C</li>' +
        '<li ng-bind="item.a" ng-repeat-index="1">A</li>' +
        '<li ng-bind="item.a" ng-repeat-index="2">B</li>' +
        '</ul>', form.sortedHtml());

  items.shift();
  a.binder.updateView();
  assertEquals('<ul>' +
        '<#comment></#comment>' +
        '<li ng-bind="item.a" ng-repeat-index="0">A</li>' +
        '<li ng-bind="item.a" ng-repeat-index="1">B</li>' +
        '</ul>', form.sortedHtml());
};

BinderTest.prototype.testRepeaterContentDoesNotBind = function(){
  var a = compile('<ul><LI ng-repeat="item in model.items"><span ng-bind="item.a"/></li></ul>');
  a.scope.set('model', {items:[{a:"A"}]});
  a.binder.updateView();
  assertEquals('<ul>' +
        '<#comment></#comment>' +
        '<li ng-repeat-index="0"><span ng-bind="item.a">A</span></li>' +
        '</ul>', a.node.sortedHtml());
};

BinderTest.prototype.testShouldBindActionsOnRepeaterClone = function(){
  var c = compile('<a ng-repeat="item in items" href="#" ng-action="result.value = item">link</a>');
  jQuery(c).die();
  c.scope.set('result.value', false);
  c.scope.set('items', ['abc', 'xyz']);
  c.scope.updateView();
  assertEquals(2, c.node.find("a").size());
  c.node.find("a:last").click();
  assertEquals('xyz', c.scope.get('result.value'));
};



BinderTest.prototype.testRepeaterInputContentDoesNotBind =  function(){
  var form =
    html('<ul><LI repeater="item in model.items">' +
          '<input type="text" name="item.a" value="OLD"/></li></ul>');
  var binder = new Binder(form.get(0), null, new MockLocation());
  var items = [{a:"A"}];
  form.data('scope', new Scope({model:{items:items}}));

  assertEquals(form.find(":input").attr("value"), "OLD");
};

BinderTest.prototype.testExpandEntityTag = function(){
  assertEquals(
      '<div ng-entity="Person" ng-watch="$anchor.a:1"></div>',
      compileToHtml('<div ng-entity="Person" ng-watch="$anchor.a:1"/>'));
};

BinderTest.prototype.testExpandEntityTagWithDefaults = function(){
  assertEquals(
      '<div ng-entity="Person:{a:\"a\"}" ng-watch=""></div>',
      compileToHtml('<div ng-entity=\'Person:{a:"a"}\'/>'));
};

BinderTest.prototype.testExpandEntityTagWithName = function(){
  var c = compile('<div ng-entity="friend=Person"/>');
  assertEquals(
      '<div ng-entity="friend=Person" ng-watch="$anchor.friend:{friend=Person.load($anchor.friend);friend.$$anchor=\"friend\";};"></div>',
      c.node.sortedHtml());
  assertEquals("Person", c.scope.get("friend.$entity"));
  assertEquals("friend", c.scope.get("friend.$$anchor"));
};

BinderTest.prototype.testExpandSubmitButtonToAction = function(){
  var html = compileToHtml('<input type="submit" value="Save">');
  assertTrue(html, html.indexOf('ng-action="$save()"') > 0 );
  assertTrue(html, html.indexOf('ng-bind-attr="{"disabled":"{{$invalidWidgets}}"}"') > 0 );
};

BinderTest.prototype.testDoNotOverwriteCustomAction = function(){
  var html = compileToHtml('<input type="submit" value="Save" action="foo();">');
  assertTrue(html.indexOf('action="foo();"') > 0 );
};

BinderTest.prototype.testReplaceFileUploadWithSwf = function(){
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

BinderTest.prototype.testRepeaterAdd = function(){
  var c = compile('<div><input type="text" name="item.x" ng-repeat="item in items"></div>');
  var doc = c.node;
  c.scope.set('items', [{x:'a'}, {x:'b'}]);
  c.binder.compile();
  c.binder.updateView();
  assertEquals('a', doc.find(':input')[0].value);
  assertEquals('b', doc.find(':input')[1].value);

  var first = doc.find('[ng-repeat-index="0"]');
  first[0].value = 'ABC';
  first.trigger('keyup');
  assertEquals(doc.scope().get('items')[0].x, 'ABC');
};

BinderTest.prototype.testIfTextBindingThrowsErrorDecorateTheSpan = function(){
  var a = compile('<div>{{error.throw()}}</div>');
  var doc = a.node.find('div');

  a.scope.set('error.throw', function(){throw "ErrorMsg1";});
  a.binder.updateView();
  var span = doc.find('span');
  assertTrue(span.hasClass('ng-exception'));
  assertEquals('ErrorMsg1', fromJson(span.text()));
  assertEquals('"ErrorMsg1"', span.attr('ng-error'));

  a.scope.set('error.throw', function(){throw "MyError";});
  a.binder.updateView();
  span = doc.find('span');
  assertTrue(span.hasClass('ng-exception'));
  assertTrue(span.text(), span.text().match('MyError') !== null);
  assertEquals('"MyError"', span.attr('ng-error'));

  a.scope.set('error.throw', function(){return "ok";});
  a.binder.updateView();
  assertFalse(span.hasClass('ng-exception'));
  assertEquals('ok', span.text());
  assertEquals(null, span.attr('ng-error'));
};

BinderTest.prototype.testIfAttrBindingThrowsErrorDecorateTheSpan = function(){
  var a = compile('<div attr="before {{error.throw()}} after"></div>');
  var doc = a.node.find("div");

  a.scope.set('error.throw', function(){throw "ErrorMsg";});
  a.binder.updateView();
  assertTrue('ng-exception', doc.hasClass('ng-exception'));
  assertEquals('before ["ErrorMsg"] after', doc.attr('attr'));
  assertEquals('"ErrorMsg"', doc.attr('ng-error'));

  a.scope.set('error.throw', function(){ return 'X';});
  a.binder.updateView();
  assertFalse('!ng-exception', doc.hasClass('ng-exception'));
  assertEquals('before X after', doc.attr('attr'));
  assertEquals(null, doc.attr('ng-error'));

};

BinderTest.prototype.testNestedRepeater = function() {
  var a = compile('<div ng-repeat="m in model" name="{{m.name}}">' +
                   '<ul name="{{i}}" ng-repeat="i in m.item"></ul>' +
                 '</div>');

  a.scope.set('model', [{name:'a', item:['a1', 'a2']}, {name:'b', item:['b1', 'b2']}]);
  a.binder.updateView();

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
      '</div>', a.node.sortedHtml());
};

BinderTest.prototype.testRadioButtonGetsPrefixed = function () {
  var a = compile('<input ng-repeat="m in model" type="radio" name="m.a" value="on"/>');
  a.scope.set('model', ['a1', 'a2']);
  a.binder.updateView();

  assertEquals(
      //'<#comment></#comment>'+
      '<input name="0:m.a" ng-repeat-index="0" type="radio" value="on"></input>'+
      '<input name="1:m.a" ng-repeat-index="1" type="radio" value="on"></input>',
      a.node.sortedHtml());
};

BinderTest.prototype.testHideBindingExpression = function() {
  var a = compile('<div ng-hide="hidden == 3"/>');

  a.scope.set('hidden', 3);
  a.binder.updateView();

  assertHidden(a.node.children());

  a.scope.set('hidden', 2);
  a.binder.updateView();

  assertVisible(a.node.children());
};

BinderTest.prototype.testHideBinding = function() {
  var c = compile('<div ng-hide="hidden"/>');

  c.scope.set('hidden', 'true');
  c.binder.updateView();

  assertHidden(c.node.children());

  c.scope.set('hidden', 'false');
  c.binder.updateView();

  assertVisible(c.node.children());

  c.scope.set('hidden', '');
  c.binder.updateView();

  assertVisible(c.node.children());
};

BinderTest.prototype.testShowBinding = function() {
  var c = compile('<div ng-show="show"/>');

  c.scope.set('show', 'true');
  c.binder.updateView();

  assertVisible(c.node.children());

  c.scope.set('show', 'false');
  c.binder.updateView();

  assertHidden(c.node.children());

  c.scope.set('show', '');
  c.binder.updateView();

  assertHidden(c.node.children());
};

BinderTest.prototype.testBindClassUndefined = function() {
  var doc = compile('<div ng-class="undefined"/>');
  doc.binder.updateView();

  assertEquals(
      '<div ng-class="undefined"></div>',
      doc.node.sortedHtml());
};

BinderTest.prototype.testBindClass = function() {
  var c = compile('<div ng-class="class"/>');

  c.scope.set('class', 'testClass');
  c.binder.updateView();

  assertEquals(c.node.sortedHtml(),
      '<div class="testClass" ng-class="class"></div>');

  c.scope.set('class', ['a', 'b']);
  c.binder.updateView();

  assertEquals(c.node.sortedHtml(),
      '<div class="a,b" ng-class="class"></div>');
};

BinderTest.prototype.testBindClassEvenOdd = function() {
  var x = compile('<div ng-repeat="i in [0,1]" ng-class-even="\'e\'" ng-class-odd="\'o\'"/>');
  x.binder.updateView();
  assertEquals(
      '<div class="o" ng-class-even="\'e\'" ng-class-odd="\'o\'" ng-repeat-index="0"></div>' +
      '<div class="e" ng-class-even="\'e\'" ng-class-odd="\'o\'" ng-repeat-index="1"></div>',
      x.node.sortedHtml());
};

BinderTest.prototype.testBindStyle = function() {
  var c = compile('<div ng-style="style"/>');

  c.scope.eval('style={color:"red"}');
  c.binder.updateView();

  assertEquals("red", c.node.find('div').css('color'));

  c.scope.eval('style={}');
  c.binder.updateView();

  assertEquals(c.node.sortedHtml(), '<div ng-style="style"></div>');
};

BinderTest.prototype.testActionOnAHrefThrowsError = function(){
  var model = {books:[]};
  var state = compile('<a ng-action="throw {a:\'abc\', b:2};">Add Phone</a>', model);
  var input = state.node.find('a');
  input.click();
  assertEquals('abc', fromJson(input.attr('ng-error')).a);
  assertNotNull(input.data('qtip'));
  assertTrue("should have an error class", input.hasClass('ng-exception'));

  input.attr('ng-action', '0');
  input.click();
  assertFalse('error class should be cleared', input.hasClass('ng-exception'));
};

BinderTest.prototype.testShoulIgnoreVbNonBindable = function(){
  var c = compile("{{a}}" +
      "<div ng-non-bindable>{{a}}</div>" +
      "<div ng-non-bindable=''>{{b}}</div>" +
      "<div ng-non-bindable='true'>{{c}}</div>");
  c.scope.set('a', 123);
  c.scope.updateView();
  assertEquals('123{{a}}{{b}}{{c}}', c.node.text());
};

BinderTest.prototype.testOptionShouldUpdateParentToGetProperBinding = function() {
  var c = compile('<select name="s"><option ng-repeat="i in [0,1]" value="{{i}}" ng-bind="i"></option></select>');
  c.scope.set('s', 1);
  c.binder.updateView();
  assertEquals(1, c.node.find('select')[0].selectedIndex);
};

BinderTest.prototype.testRepeaterShouldBindInputsDefaults = function () {
  var c = compile('<input value="123" name="item.name" ng-repeat="item in items">');
  c.scope.set('items', [{}, {name:'misko'}]);
  c.binder.updateView();

  assertEquals("123", c.scope.eval('items[0].name'));
  assertEquals("misko", c.scope.eval('items[1].name'));
};

BinderTest.prototype.testRepeaterShouldCreateArray = function () {
  var c = compile('<input value="123" name="item.name" ng-repeat="item in items">');
  c.binder.updateView();

  assertEquals(0, c.scope.get('items').length);
};

BinderTest.prototype.testShouldTemplateBindPreElements = function () {
  var c = compile('<pre>Hello {{name}}!</pre>');
  c.scope.set("name", "World");
  c.binder.updateView();

  assertEquals('<pre ng-bind-template="Hello {{name}}!">Hello World!</pre>', c.node.sortedHtml());
};

BinderTest.prototype.testDissableAutoSubmit = function() {
  var c = compile('<input type="submit" value="S"/>', null, {autoSubmit:true});
  assertEquals(
      '<input ng-action="$save()" ng-bind-attr="{"disabled":"{{$invalidWidgets}}"}" type="submit" value="S"></input>',
      c.node.sortedHtml());

  c = compile('<input type="submit" value="S"/>', null, {autoSubmit:false});
  assertEquals(
      '<input type="submit" value="S"></input>',
      c.node.sortedHtml());
};

BinderTest.prototype.testSettingAnchorToNullOrUndefinedRemovesTheAnchorFromURL = function() {
  var c = compile('');
  c.binder.location.set("http://server/#a=1&b=2");
  c.binder.parseAnchor();
  assertEquals('1', c.binder.anchor.a);
  assertEquals('2', c.binder.anchor.b);

  c.binder.anchor.a = null;
  c.binder.anchor.b = null;
  c.binder.updateAnchor();
  assertEquals('http://server/#', c.binder.location.get());
};

BinderTest.prototype.testFillInOptionValueWhenMissing = function() {
  var c = compile('<select><option selected="true">A</option><option value="">B</option></select>');
  assertEquals(
      '<select><option selected="true" value="A">A</option><option>B</option></select>',
      c.node.sortedHtml());
};

BinderTest.prototype.testValidateForm = function() {
  var c = compile('<input name="name" ng-required>' +
      '<div ng-repeat="item in items"><input name="item.name" ng-required/></div>');
  var items = [{}, {}];
  c.scope.set("items", items);
  c.binder.updateView();
  assertEquals(3, c.scope.get("$invalidWidgets.length"));

  c.scope.set('name', 'abc');
  c.binder.updateView();
  assertEquals(2, c.scope.get("$invalidWidgets.length"));

  items[0].name = 'abc';
  c.binder.updateView();
  assertEquals(1, c.scope.get("$invalidWidgets.length"));

  items[1].name = 'abc';
  c.binder.updateView();
  assertEquals(0, c.scope.get("$invalidWidgets.length"));
};

BinderTest.prototype.testDeleteAttributeIfEvaluatesFalse = function() {
  var c = compile(
      '<input name="a0" ng-bind-attr="{disabled:\'{{true}}\'}"><input name="a1" ng-bind-attr="{disabled:\'{{false}}\'}">' +
      '<input name="b0" ng-bind-attr="{disabled:\'{{1}}\'}"><input name="b1" ng-bind-attr="{disabled:\'{{0}}\'}">' +
      '<input name="c0" ng-bind-attr="{disabled:\'{{[0]}}\'}"><input name="c1" ng-bind-attr="{disabled:\'{{[]}}\'}">');
  c.binder.updateView();
  var html = c.node.html();
  assertEquals(html + 0, 1, c.node.find("input[name='a0']:disabled").size());
  assertEquals(html + 1, 1, c.node.find("input[name='b0']:disabled").size());
  assertEquals(html + 2, 1, c.node.find("input[name='c0']:disabled").size());

  assertEquals(html + 3, 0, c.node.find("input[name='a1']:disabled").size());
  assertEquals(html + 4, 0, c.node.find("input[name='b1']:disabled").size());
  assertEquals(html + 5, 0, c.node.find("input[name='c1']:disabled").size());
};

BinderTest.prototype.testRepeaterErrorShouldBePlacedOnInstanceNotOnTemplateComment = function () {
  var c = compile(
    '<input name="person.{{name}}" ng-repeat="name in [\'a\', \'b\']" />');
  c.binder.updateView();
  assertTrue(c.node.find("input").hasClass("ng-exception"));
};

BinderTest.prototype.XtestItShouldApplyAttirbutesBeforeTheWidgetsAreMaterialized = function() {
  var c = compile(
      '<input name="person.{{name}}" ng-repeat="name in [\'a\', \'b\']" />');
  c.scope.set('person', {a:'misko', b:'adam'});
  c.binder.updateView();
  assertEquals("", c.node.html());
};

BinderTest.prototype.testItShouldCallListenersWhenAnchorChanges = function() {
  var log = "";
  var c = compile('<div ng-watch="$anchor.counter:count = count+1">');
  c.scope.set("count", 0);
  c.scope.addWatchListener("$anchor.counter", function(newValue, oldValue){
    log += oldValue + "->" + newValue + ";";
  });
  assertEquals(0, c.scope.get("count"));
  c.binder.location.url = "#counter=1";
  c.binder.onUrlChange();
  assertEquals(1, c.scope.get("count"));

  c.binder.location.url = "#counter=1";
  c.binder.onUrlChange();
  assertEquals(1, c.scope.get("count"));

  c.binder.location.url = "#counter=2";
  c.binder.onUrlChange();
  assertEquals(2, c.scope.get("count"));

  c.binder.location.url = "#counter=2";
  c.binder.onUrlChange();
  assertEquals(2, c.scope.get("count"));

  c.binder.location.url = "#";
  c.binder.onUrlChange();
  assertEquals("undefined->1;1->2;2->undefined;", log);
  assertEquals(3, c.scope.get("count"));
};

BinderTest.prototype.testParseQueryString = function(){
  var binder = new Binder();
  assertJsonEquals({"a":"1"}, binder.parseQueryString("a=1"));
  assertJsonEquals({"a":"1", "b":"two"}, binder.parseQueryString("a=1&b=two"));
  assertJsonEquals({}, binder.parseQueryString(""));

  assertJsonEquals({"a":"1", "b":""}, binder.parseQueryString("a=1&b="));
  assertJsonEquals({"a":"1", "b":""}, binder.parseQueryString("a=1&b"));
  assertJsonEquals({"a":"1", "b":" 2 "}, binder.parseQueryString("a=1&b=%202%20"));
  assertJsonEquals({"a a":"1", "b":"2"}, binder.parseQueryString("a%20a=1&b=2"));

};

BinderTest.prototype.testSetBinderAnchorTriggersListeners = function(){
  expectAsserts(2);
  var doc = html("<div/>")[0];
  var binder = new Binder(doc, null, null, new MockLocation());
  var scope = new Scope({$binder:binder, $anchor:binder.anchor});
  jQuery(doc).data('scope', scope);

  scope.addWatchListener("$anchor.name", function(newVal, oldVal) {
    assertEquals("new", newVal);
    assertEquals(undefined, oldVal);
  });

  binder.anchor.name = "new";
  binder.onUrlChange("http://base#name=new");
};

BinderTest.prototype.testItShouldDisplayErrorWhenActionIsSyntacticlyIncorect = function(){
  var c = compile(
      '<input type="button" ng-action="greeting=\'ABC\'"/>' +
      '<input type="button" ng-action=":garbage:"/>');
  c.node.find("input").click();
  assertEquals("ABC", c.scope.get('greeting'));
  assertTrue(c.node.find(":input:last").hasClass("ng-exception"));
};

BinderTest.prototype.testItShouldSelectTheCorrectRadioBox = function() {
  var c = compile(
      '<input type="radio" name="sex" value="female"/>' +
      '<input type="radio" name="sex" value="male"/>');

  c.node.find("input[value=female]").click();
  assertEquals("female", c.scope.get("sex"));
  assertEquals(1, c.node.find("input:checked").size());
  assertEquals("female", c.node.find("input:checked").attr("value"));

  c.node.find("input[value=male]").click();
  assertEquals("male", c.scope.get("sex"));
  assertEquals(1, c.node.find("input:checked").size());
  assertEquals("male", c.node.find("input:checked").attr("value"));
};

BinderTest.prototype.testItShouldListenOnRightScope = function() {
  var c = compile(
      '<div ng-init="counter=0; gCounter=0" ng-watch="w:counter=counter+1">' +
      '<div ng-repeat="n in [1,2,4]" ng-watch="w:counter=counter+1;w:$root.gCounter=$root.gCounter+n"/>');
  c.binder.executeInit();
  c.binder.updateView();
  assertEquals(0, c.scope.get("counter"));
  assertEquals(0, c.scope.get("gCounter"));

  c.scope.set("w", "something");
  c.binder.updateView();
  assertEquals(1, c.scope.get("counter"));
  assertEquals(7, c.scope.get("gCounter"));
};

BinderTest.prototype.testItShouldRepeatOnHashes = function() {
  var x = compile('<div ng-repeat="(k,v) in {a:0,b:1}" ng-bind=\"k + v\"></div>');
  x.binder.updateView();
  assertEquals(
      '<div ng-bind=\"k + v\" ng-repeat-index="0">a0</div>' +
      '<div ng-bind=\"k + v\" ng-repeat-index="1">b1</div>',
      x.node.sortedHtml());
};

BinderTest.prototype.testItShouldFireChangeListenersBeforeUpdate = function(){
  var x = compile('<div ng-bind="name"></div>');
  x.scope.set("name", "");
  x.scope.set("watched", "change");
  x.scope.watch("watched:name=123");
  x.scope.updateView();
  assertEquals(123, x.scope.get("name"));
  assertEquals(
      '<div ng-bind="name">123</div>',
      x.node.sortedHtml());
};

BinderTest.prototype.testItShouldHandleMultilineBindings = function(){
  var x = compile('<div>{{\n 1 \n + \n 2 \n}}</div>');
  x.scope.updateView();
  assertEquals("3", x.node.text());
};

BinderTest.prototype.testItBindHiddenInputFields = function(){
  var x = compile('<input type="hidden" name="myName" value="abc" />');
  x.scope.updateView();
  assertEquals("abc", x.scope.get("myName"));
};

BinderTest.prototype.testItShouldRenderMultiRootHtmlInBinding = function() {
  var x = compile('<div>before {{a|html}}after</div>');
  x.scope.set("a", "a<b>c</b>d");
  x.binder.updateView();
  assertEquals(
      '<div>before <span ng-bind="a|html">a<b>c</b>d</span>after</div>', 
      x.node.sortedHtml());
};
