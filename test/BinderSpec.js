describe('Binder', function(){

  beforeEach(function(){
    var self = this;

    this.compile = function(html, parent) {
      if (self.element) dealoc(self.element);
      var element;
      if (parent) {
        parent.html(html);
        element = parent.children();
      } else {
        element = jqLite(html);
      }
      self.element = element;
      return angular.compile(element)();
    };
    this.compileToHtml = function (content) {
      return sortedHtml(this.compile(content).$element);
    };
  });

  afterEach(function(){
    if (this.element && this.element.dealoc) {
      this.element.dealoc();
    }
  });


  it('text-field should default to value attribute', function(){
    var scope = this.compile('<input type="text" name="model.price" value="abc">');
    scope.$eval();
    assertEquals('abc', scope.model.price);
  });

  it('ChangingTextareaUpdatesModel', function(){
    var scope = this.compile('<textarea name="model.note">abc</textarea>');
    scope.$eval();
    assertEquals(scope.model.note, 'abc');
  });

  it('ChangingRadioUpdatesModel', function(){
    var scope = this.compile('<div><input type="radio" name="model.price" value="A" checked>' +
          '<input type="radio" name="model.price" value="B"></div>');
    scope.$eval();
    assertEquals(scope.model.price, 'A');
  });

  it('ChangingCheckboxUpdatesModel', function(){
    var scope = this.compile('<input type="checkbox" name="model.price" value="true" checked ng:format="boolean"/>');
    assertEquals(true, scope.model.price);
  });

  it('BindUpdate', function(){
    var scope = this.compile('<div ng:eval="a=123"/>');
    assertEquals(123, scope.$get('a'));
  });

  it('ChangingSelectNonSelectedUpdatesModel', function(){
    var scope = this.compile('<select name="model.price"><option value="A">A</option><option value="B">B</option></select>');
    assertEquals('A', scope.model.price);
  });

  it('ChangingMultiselectUpdatesModel', function(){
    var scope = this.compile('<select name="Invoice.options" multiple="multiple">' +
            '<option value="A" selected>Gift wrap</option>' +
            '<option value="B" selected>Extra padding</option>' +
            '<option value="C">Expedite</option>' +
            '</select>');
    assertJsonEquals(["A", "B"], scope.$get('Invoice').options);
  });

  it('ChangingSelectSelectedUpdatesModel', function(){
    var scope = this.compile('<select name="model.price"><option>A</option><option selected value="b">B</option></select>');
    assertEquals(scope.model.price, 'b');
  });

  it('ExecuteInitialization', function(){
    var scope = this.compile('<div ng:init="a=123">');
    assertEquals(scope.$get('a'), 123);
  });

  it('ExecuteInitializationStatements', function(){
    var scope = this.compile('<div ng:init="a=123;b=345">');
    assertEquals(scope.$get('a'), 123);
    assertEquals(scope.$get('b'), 345);
  });

  it('ApplyTextBindings', function(){
    var scope = this.compile('<div ng:bind="model.a">x</div>');
    scope.$set('model', {a:123});
    scope.$eval();
    assertEquals('123', scope.$element.text());
  });

  it('ReplaceBindingInTextWithSpan', function(){
    assertEquals(this.compileToHtml("<b>a{{b}}c</b>"), '<b>a<span ng:bind="b"></span>c</b>');
    assertEquals(this.compileToHtml("<b>{{b}}</b>"), '<b><span ng:bind="b"></span></b>');
  });

  it('BindingSpaceConfusesIE', function(){
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
  });

  it('BindingOfAttributes', function(){
    var scope = this.compile("<a href='http://s/a{{b}}c' foo='x'></a>");
    var attrbinding = scope.$element.attr("ng:bind-attr");
    var bindings = fromJson(attrbinding);
    assertEquals("http://s/a{{b}}c", decodeURI(bindings.href));
    assertTrue(!bindings.foo);
  });

  it('MarkMultipleAttributes', function(){
    var scope = this.compile('<a href="http://s/a{{b}}c" foo="{{d}}"></a>');
    var attrbinding = scope.$element.attr("ng:bind-attr");
    var bindings = fromJson(attrbinding);
    assertEquals(bindings.foo, "{{d}}");
    assertEquals(decodeURI(bindings.href), "http://s/a{{b}}c");
  });

  it('AttributesNoneBound', function(){
    var scope = this.compile("<a href='abc' foo='def'></a>");
    var a = scope.$element;
    assertEquals(a[0].nodeName, "A");
    assertTrue(!a.attr("ng:bind-attr"));
  });

  it('ExistingAttrbindingIsAppended', function(){
    var scope = this.compile("<a href='http://s/{{abc}}' ng:bind-attr='{\"b\":\"{{def}}\"}'></a>");
    var a = scope.$element;
    assertEquals('{"b":"{{def}}","href":"http://s/{{abc}}"}', a.attr('ng:bind-attr'));
  });

  it('AttributesAreEvaluated', function(){
    var scope = this.compile('<a ng:bind-attr=\'{"a":"a", "b":"a+b={{a+b}}"}\'></a>');
    scope.$eval('a=1;b=2');
    scope.$eval();
    var a = scope.$element;
    assertEquals(a.attr('a'), 'a');
    assertEquals(a.attr('b'), 'a+b=3');
  });

  it('InputTypeButtonActionExecutesInScope', function(){
    var savedCalled = false;
    var scope = this.compile('<input type="button" ng:click="person.save()" value="Apply">');
    scope.$set("person.save", function(){
      savedCalled = true;
    });
    browserTrigger(scope.$element, 'click');
    assertTrue(savedCalled);
  });

  it('InputTypeButtonActionExecutesInScope2', function(){
    var log = "";
    var scope = this.compile('<input type="image" ng:click="action()">');
    scope.$set("action", function(){
      log += 'click;';
    });
    expect(log).toEqual('');
    browserTrigger(scope.$element, 'click');
    expect(log).toEqual('click;');
  });

  it('ButtonElementActionExecutesInScope', function(){
    var savedCalled = false;
    var scope = this.compile('<button ng:click="person.save()">Apply</button>');
    scope.$set("person.save", function(){
      savedCalled = true;
    });
    browserTrigger(scope.$element, 'click');
    assertTrue(savedCalled);
  });

  it('RepeaterUpdateBindings', function(){
    var scope = this.compile('<ul><LI ng:repeat="item in model.items" ng:bind="item.a"/></ul>');
    var form = scope.$element;
    var items = [{a:"A"}, {a:"B"}];
    scope.$set('model', {items:items});

    scope.$eval();
    assertEquals('<ul>' +
          '<#comment></#comment>' +
          '<li ng:bind="item.a" ng:repeat-index="0">A</li>' +
          '<li ng:bind="item.a" ng:repeat-index="1">B</li>' +
          '</ul>', sortedHtml(form));

    items.unshift({a:'C'});
    scope.$eval();
    assertEquals('<ul>' +
          '<#comment></#comment>' +
          '<li ng:bind="item.a" ng:repeat-index="0">C</li>' +
          '<li ng:bind="item.a" ng:repeat-index="1">A</li>' +
          '<li ng:bind="item.a" ng:repeat-index="2">B</li>' +
          '</ul>', sortedHtml(form));

    items.shift();
    scope.$eval();
    assertEquals('<ul>' +
          '<#comment></#comment>' +
          '<li ng:bind="item.a" ng:repeat-index="0">A</li>' +
          '<li ng:bind="item.a" ng:repeat-index="1">B</li>' +
          '</ul>', sortedHtml(form));

    items.shift();
    items.shift();
    scope.$eval();
  });

  it('RepeaterContentDoesNotBind', function(){
    var scope = this.compile('<ul><LI ng:repeat="item in model.items"><span ng:bind="item.a"></span></li></ul>');
    scope.$set('model', {items:[{a:"A"}]});
    scope.$eval();
    assertEquals('<ul>' +
          '<#comment></#comment>' +
          '<li ng:repeat-index="0"><span ng:bind="item.a">A</span></li>' +
          '</ul>', sortedHtml(scope.$element));
  });

  it('DoNotOverwriteCustomAction', function(){
    var html = this.compileToHtml('<input type="submit" value="Save" action="foo();">');
    assertTrue(html.indexOf('action="foo();"') > 0 );
  });

  it('RepeaterAdd', function(){
    var scope = this.compile('<div><input type="text" name="item.x" ng:repeat="item in items"></div>');
    scope.$set('items', [{x:'a'}, {x:'b'}]);
    scope.$eval();
    var first = childNode(scope.$element, 1);
    var second = childNode(scope.$element, 2);
    assertEquals('a', first.val());
    assertEquals('b', second.val());

    first.val('ABC');
    browserTrigger(first, 'keydown');
    scope.$service('$browser').defer.flush();
    assertEquals(scope.items[0].x, 'ABC');
  });

  it('ItShouldRemoveExtraChildrenWhenIteratingOverHash', function(){
    var scope = this.compile('<div><div ng:repeat="i in items">{{i}}</div></div>');
    var items = {};
    scope.$set("items", items);

    scope.$eval();
    expect(scope.$element[0].childNodes.length - 1).toEqual(0);

    items.name = "misko";
    scope.$eval();
    expect(scope.$element[0].childNodes.length - 1).toEqual(1);

    delete items.name;
    scope.$eval();
    expect(scope.$element[0].childNodes.length - 1).toEqual(0);
  });

  it('IfTextBindingThrowsErrorDecorateTheSpan', function(){
    var scope = this.compile('<div>{{error.throw()}}</div>');
    var doc = scope.$element;
    var errorLogs = scope.$service('$log').error.logs;

    scope.$set('error.throw', function(){throw "ErrorMsg1";});
    scope.$eval();
    var span = childNode(doc, 0);
    assertTrue(span.hasClass('ng-exception'));
    assertTrue(!!span.text().match(/ErrorMsg1/));
    assertTrue(!!span.attr('ng-exception').match(/ErrorMsg1/));
    assertEquals(['ErrorMsg1'], errorLogs.shift());

    scope.$set('error.throw', function(){throw "MyError";});
    scope.$eval();
    span = childNode(doc, 0);
    assertTrue(span.hasClass('ng-exception'));
    assertTrue(span.text(), span.text().match('MyError') !== null);
    assertEquals('MyError', span.attr('ng-exception'));
    assertEquals(['MyError'], errorLogs.shift());

    scope.$set('error.throw', function(){return "ok";});
    scope.$eval();
    assertFalse(span.hasClass('ng-exception'));
    assertEquals('ok', span.text());
    assertEquals(null, span.attr('ng-exception'));
    assertEquals(0, errorLogs.length);
  });

  it('IfAttrBindingThrowsErrorDecorateTheAttribute', function(){
    var scope = this.compile('<div attr="before {{error.throw()}} after"></div>');
    var doc = scope.$element;
    var errorLogs = scope.$service('$log').error.logs;

    scope.$set('error.throw', function(){throw "ErrorMsg";});
    scope.$eval();
    assertTrue('ng-exception', doc.hasClass('ng-exception'));
    assertEquals('"ErrorMsg"', doc.attr('ng-exception'));
    assertEquals('before "ErrorMsg" after', doc.attr('attr'));
    assertEquals(['ErrorMsg'], errorLogs.shift());

    scope.$set('error.throw', function(){ return 'X';});
    scope.$eval();
    assertFalse('!ng-exception', doc.hasClass('ng-exception'));
    assertEquals('before X after', doc.attr('attr'));
    assertEquals(null, doc.attr('ng-exception'));
    assertEquals(0, errorLogs.length);
  });

  it('NestedRepeater', function(){
    var scope = this.compile('<div><div ng:repeat="m in model" name="{{m.name}}">' +
                     '<ul name="{{i}}" ng:repeat="i in m.item"></ul>' +
                   '</div></div>');

    scope.$set('model', [{name:'a', item:['a1', 'a2']}, {name:'b', item:['b1', 'b2']}]);
    scope.$eval();

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
        '</div></div>', sortedHtml(scope.$element));
  });

  it('HideBindingExpression', function(){
    var scope = this.compile('<div ng:hide="hidden == 3"/>');

    scope.$set('hidden', 3);
    scope.$eval();

    assertHidden(scope.$element);

    scope.$set('hidden', 2);
    scope.$eval();

    assertVisible(scope.$element);
  });

  it('HideBinding', function(){
    var scope = this.compile('<div ng:hide="hidden"/>');

    scope.$set('hidden', 'true');
    scope.$eval();

    assertHidden(scope.$element);

    scope.$set('hidden', 'false');
    scope.$eval();

    assertVisible(scope.$element);

    scope.$set('hidden', '');
    scope.$eval();

    assertVisible(scope.$element);
  });

  it('ShowBinding', function(){
    var scope = this.compile('<div ng:show="show"/>');

    scope.$set('show', 'true');
    scope.$eval();

    assertVisible(scope.$element);

    scope.$set('show', 'false');
    scope.$eval();

    assertHidden(scope.$element);

    scope.$set('show', '');
    scope.$eval();

    assertHidden(scope.$element);
  });

  it('BindClassUndefined', function(){
    var scope = this.compile('<div ng:class="undefined"/>');
    scope.$eval();

    assertEquals(
        '<div class="undefined" ng:class="undefined"></div>',
        sortedHtml(scope.$element));
  });

  it('BindClass', function(){
    var scope = this.compile('<div ng:class="class"/>');

    scope.$set('class', 'testClass');
    scope.$eval();

    assertEquals('<div class="testClass" ng:class="class"></div>', sortedHtml(scope.$element));

    scope.$set('class', ['a', 'b']);
    scope.$eval();

    assertEquals('<div class="a b" ng:class="class"></div>', sortedHtml(scope.$element));
  });

  it('BindClassEvenOdd', function(){
    var scope = this.compile('<div><div ng:repeat="i in [0,1]" ng:class-even="\'e\'" ng:class-odd="\'o\'"></div></div>');
    scope.$eval();
    var d1 = jqLite(scope.$element[0].childNodes[1]);
    var d2 = jqLite(scope.$element[0].childNodes[2]);
    expect(d1.hasClass('o')).toBeTruthy();
    expect(d2.hasClass('e')).toBeTruthy();
    assertEquals(
        '<div><#comment></#comment>' +
        '<div class="o" ng:class-even="\'e\'" ng:class-odd="\'o\'" ng:repeat-index="0"></div>' +
        '<div class="e" ng:class-even="\'e\'" ng:class-odd="\'o\'" ng:repeat-index="1"></div></div>',
        sortedHtml(scope.$element));
  });

  it('BindStyle', function(){
    var scope = this.compile('<div ng:style="style"/>');

    scope.$eval('style={height: "10px"}');
    scope.$eval();

    assertEquals("10px", scope.$element.css('height'));

    scope.$eval('style={}');
    scope.$eval();
  });

  it('ActionOnAHrefThrowsError', function(){
    var scope = this.compile('<a ng:click="action()">Add Phone</a>');
    scope.action = function(){
      throw new Error('MyError');
    };
    var input = scope.$element;
    browserTrigger(input, 'click');
    var error = input.attr('ng-exception');
    assertTrue(!!error.match(/MyError/));
    assertTrue("should have an error class", input.hasClass('ng-exception'));
    assertTrue(!!scope.$service('$log').error.logs.shift()[0].message.match(/MyError/));

    // TODO: I think that exception should never get cleared so this portion of test makes no sense
    //c.scope.action = noop;
    //browserTrigger(input, 'click');
    //dump(input.attr('ng-error'));
    //assertFalse('error class should be cleared', input.hasClass('ng-exception'));
  });

  it('ShoulIgnoreVbNonBindable', function(){
    var scope = this.compile("<div>{{a}}" +
        "<div ng:non-bindable>{{a}}</div>" +
        "<div ng:non-bindable=''>{{b}}</div>" +
        "<div ng:non-bindable='true'>{{c}}</div></div>");
    scope.$set('a', 123);
    scope.$eval();
    assertEquals('123{{a}}{{b}}{{c}}', scope.$element.text());
  });

  it('OptionShouldUpdateParentToGetProperBinding', function(){
    var scope = this.compile('<select name="s"><option ng:repeat="i in [0,1]" value="{{i}}" ng:bind="i"></option></select>');
    scope.$set('s', 1);
    scope.$eval();
    assertEquals(1, scope.$element[0].selectedIndex);
  });

  it('RepeaterShouldBindInputsDefaults', function () {
    var scope = this.compile('<div><input value="123" name="item.name" ng:repeat="item in items"></div>');
    scope.$set('items', [{}, {name:'misko'}]);
    scope.$eval();

    assertEquals("123", scope.$eval('items[0].name'));
    assertEquals("misko", scope.$eval('items[1].name'));
  });

  it('ShouldTemplateBindPreElements', function () {
    var scope = this.compile('<pre>Hello {{name}}!</pre>');
    scope.$set("name", "World");
    scope.$eval();

    assertEquals('<pre ng:bind-template="Hello {{name}}!">Hello World!</pre>', sortedHtml(scope.$element));
  });

  it('FillInOptionValueWhenMissing', function(){
    var scope = this.compile(
        '<select name="foo"><option selected="true">{{a}}</option><option value="">{{b}}</option><option>C</option></select>');
    scope.$set('a', 'A');
    scope.$set('b', 'B');
    scope.$eval();
    var optionA = childNode(scope.$element, 0);
    var optionB = childNode(scope.$element, 1);
    var optionC = childNode(scope.$element, 2);

    expect(optionA.attr('value')).toEqual('A');
    expect(optionA.text()).toEqual('A');

    expect(optionB.attr('value')).toEqual('');
    expect(optionB.text()).toEqual('B');

    expect(optionC.attr('value')).toEqual('C');
    expect(optionC.text()).toEqual('C');
  });

  it('ValidateForm', function(){
    var scope = this.compile('<div id="test"><input name="name" ng:required>' +
            '<input ng:repeat="item in items" name="item.name" ng:required/></div>',
            jqLite(document.body));
    var items = [{}, {}];
    scope.$set("items", items);
    scope.$eval();
    assertEquals(3, scope.$service('$invalidWidgets').length);

    scope.$set('name', '');
    scope.$eval();
    assertEquals(3, scope.$service('$invalidWidgets').length);

    scope.$set('name', ' ');
    scope.$eval();
    assertEquals(3, scope.$service('$invalidWidgets').length);

    scope.$set('name', 'abc');
    scope.$eval();
    assertEquals(2, scope.$service('$invalidWidgets').length);

    items[0].name = 'abc';
    scope.$eval();
    assertEquals(1, scope.$service('$invalidWidgets').length);

    items[1].name = 'abc';
    scope.$eval();
    assertEquals(0, scope.$service('$invalidWidgets').length);
  });

  it('ValidateOnlyVisibleItems', function(){
    var scope = this.compile('<div><input name="name" ng:required><input ng:show="show" name="name" ng:required></div>', jqLite(document.body));
    scope.$set("show", true);
    scope.$eval();
    assertEquals(2, scope.$service('$invalidWidgets').length);

    scope.$set("show", false);
    scope.$eval();
    assertEquals(1, scope.$service('$invalidWidgets').visible());
  });

  it('DeleteAttributeIfEvaluatesFalse', function(){
    var scope = this.compile('<div>' +
        '<input name="a0" ng:bind-attr="{disabled:\'{{true}}\'}"><input name="a1" ng:bind-attr="{disabled:\'{{false}}\'}">' +
        '<input name="b0" ng:bind-attr="{disabled:\'{{1}}\'}"><input name="b1" ng:bind-attr="{disabled:\'{{0}}\'}">' +
        '<input name="c0" ng:bind-attr="{disabled:\'{{[0]}}\'}"><input name="c1" ng:bind-attr="{disabled:\'{{[]}}\'}"></div>');
    scope.$eval();
    function assertChild(index, disabled) {
      var child = childNode(scope.$element, index);
      assertEquals(sortedHtml(child), disabled, !!child.attr('disabled'));
    }

    assertChild(0, true);
    assertChild(1, false);
    assertChild(2, true);
    assertChild(3, false);
    assertChild(4, true);
    assertChild(5, false);
  });

  it('ItShouldDisplayErrorWhenActionIsSyntacticlyIncorrect', function(){
    var scope = this.compile('<div>' +
        '<input type="button" ng:click="greeting=\'ABC\'"/>' +
        '<input type="button" ng:click=":garbage:"/></div>');
    var first = jqLite(scope.$element[0].childNodes[0]);
    var second = jqLite(scope.$element[0].childNodes[1]);
    var errorLogs = scope.$service('$log').error.logs;

    browserTrigger(first, 'click');
    assertEquals("ABC", scope.greeting);
    expect(errorLogs).toEqual([]);

    browserTrigger(second, 'click');
    assertTrue(second.hasClass("ng-exception"));
    expect(errorLogs.shift()[0]).toMatchError(/Syntax Error: Token ':' not a primary expression/);
  });

  it('ItShouldSelectTheCorrectRadioBox', function(){
    var scope = this.compile('<div>' +
        '<input type="radio" name="sex" value="female"/>' +
        '<input type="radio" name="sex" value="male"/></div>');
    var female = jqLite(scope.$element[0].childNodes[0]);
    var male = jqLite(scope.$element[0].childNodes[1]);

    browserTrigger(female);
    assertEquals("female", scope.sex);
    assertEquals(true, female[0].checked);
    assertEquals(false, male[0].checked);
    assertEquals("female", female.val());

    browserTrigger(male);
    assertEquals("male", scope.sex);
    assertEquals(false, female[0].checked);
    assertEquals(true, male[0].checked);
    assertEquals("male", male.val());
  });

  it('ItShouldRepeatOnHashes', function(){
    var scope = this.compile('<ul><li ng:repeat="(k,v) in {a:0,b:1}" ng:bind=\"k + v\"></li></ul>');
    scope.$eval();
    assertEquals('<ul>' +
        '<#comment></#comment>' +
        '<li ng:bind=\"k + v\" ng:repeat-index="0">a0</li>' +
        '<li ng:bind=\"k + v\" ng:repeat-index="1">b1</li>' +
        '</ul>',
        sortedHtml(scope.$element));
  });

  it('ItShouldFireChangeListenersBeforeUpdate', function(){
    var scope = this.compile('<div ng:bind="name"></div>');
    scope.$set("name", "");
    scope.$watch("watched", "name=123");
    scope.$set("watched", "change");
    scope.$eval();
    assertEquals(123, scope.$get("name"));
    assertEquals(
        '<div ng:bind="name">123</div>',
        sortedHtml(scope.$element));
  });

  it('ItShouldHandleMultilineBindings', function(){
    var scope = this.compile('<div>{{\n 1 \n + \n 2 \n}}</div>');
    scope.$eval();
    assertEquals("3", scope.$element.text());
  });

  it('ItBindHiddenInputFields', function(){
    var scope = this.compile('<input type="hidden" name="myName" value="abc" />');
    scope.$eval();
    assertEquals("abc", scope.$get("myName"));
  });

  it('ItShouldUseFormaterForText', function(){
    var scope = this.compile('<input name="a" ng:format="list" value="a,b">');
    scope.$eval();
    assertEquals(['a','b'], scope.$get('a'));
    var input = scope.$element;
    input[0].value = ' x,,yz';
    browserTrigger(input, 'change');
    assertEquals(['x','yz'], scope.$get('a'));
    scope.$set('a', [1 ,2, 3]);
    scope.$eval();
    assertEquals('1, 2, 3', input[0].value);
  });

});
