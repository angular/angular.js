'use strict';

describe('Binder', function(){
  beforeEach(function(){
    var self = this;

    this.compile = function(html, parent, logErrors) {
      if (self.element) dealoc(self.element);
      var element;
      if (parent) {
        parent.html(html);
        element = parent.children();
      } else {
        element = jqLite(html);
      }
      self.element = element;
      return angular.compile(element)(angular.scope(null,
              logErrors ? {'$exceptionHandler': $exceptionHandlerMockFactory()} : null));
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

  it('BindUpdate', function(){
    var scope = this.compile('<div ng:init="a=123"/>');
    scope.$digest();
    assertEquals(123, scope.a);
  });

  it('ExecuteInitialization', function(){
    var scope = this.compile('<div ng:init="a=123">');
    assertEquals(scope.a, 123);
  });

  it('ExecuteInitializationStatements', function(){
    var scope = this.compile('<div ng:init="a=123;b=345">');
    assertEquals(scope.a, 123);
    assertEquals(scope.b, 345);
  });

  it('ApplyTextBindings', function(){
    var scope = this.compile('<div ng:bind="model.a">x</div>');
    scope.model = {a:123};
    scope.$apply();
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
    scope.$apply();
    var a = scope.$element;
    assertEquals(a.attr('a'), 'a');
    assertEquals(a.attr('b'), 'a+b=3');
  });

  it('InputTypeButtonActionExecutesInScope', function(){
    var savedCalled = false;
    var scope = this.compile('<input type="button" ng:click="person.save()" value="Apply">');
    scope.person = {};
    scope.person.save = function(){
      savedCalled = true;
    };
    browserTrigger(scope.$element, 'click');
    assertTrue(savedCalled);
  });

  it('InputTypeButtonActionExecutesInScope2', function(){
    var log = "";
    var scope = this.compile('<input type="image" ng:click="action()">');
    scope.action = function(){
      log += 'click;';
    };
    expect(log).toEqual('');
    browserTrigger(scope.$element, 'click');
    expect(log).toEqual('click;');
  });

  it('ButtonElementActionExecutesInScope', function(){
    var savedCalled = false;
    var scope = this.compile('<button ng:click="person.save()">Apply</button>');
    scope.person = {};
    scope.person.save = function(){
      savedCalled = true;
    };
    browserTrigger(scope.$element, 'click');
    assertTrue(savedCalled);
  });

  it('RepeaterUpdateBindings', function(){
    var scope = this.compile('<ul><LI ng:repeat="item in model.items" ng:bind="item.a"/></ul>');
    var form = scope.$element;
    var items = [{a:"A"}, {a:"B"}];
    scope.model = {items:items};

    scope.$apply();
    assertEquals('<ul>' +
          '<#comment></#comment>' +
          '<li ng:bind="item.a">A</li>' +
          '<li ng:bind="item.a">B</li>' +
          '</ul>', sortedHtml(form));

    items.unshift({a:'C'});
    scope.$apply();
    assertEquals('<ul>' +
          '<#comment></#comment>' +
          '<li ng:bind="item.a">C</li>' +
          '<li ng:bind="item.a">A</li>' +
          '<li ng:bind="item.a">B</li>' +
          '</ul>', sortedHtml(form));

    items.shift();
    scope.$apply();
    assertEquals('<ul>' +
          '<#comment></#comment>' +
          '<li ng:bind="item.a">A</li>' +
          '<li ng:bind="item.a">B</li>' +
          '</ul>', sortedHtml(form));

    items.shift();
    items.shift();
    scope.$apply();
  });

  it('RepeaterContentDoesNotBind', function(){
    var scope = this.compile('<ul><LI ng:repeat="item in model.items"><span ng:bind="item.a"></span></li></ul>');
    scope.model = {items:[{a:"A"}]};
    scope.$apply();
    assertEquals('<ul>' +
          '<#comment></#comment>' +
          '<li><span ng:bind="item.a">A</span></li>' +
          '</ul>', sortedHtml(scope.$element));
  });

  it('DoNotOverwriteCustomAction', function(){
    var html = this.compileToHtml('<input type="submit" value="Save" action="foo();">');
    assertTrue(html.indexOf('action="foo();"') > 0 );
  });

  it('RepeaterAdd', function(){
    var scope = this.compile('<div><input type="text" ng:model="item.x" ng:repeat="item in items"></div>');
    scope.items = [{x:'a'}, {x:'b'}];
    scope.$apply();
    var first = childNode(scope.$element, 1);
    var second = childNode(scope.$element, 2);
    expect(first.val()).toEqual('a');
    expect(second.val()).toEqual('b');

    first.val('ABC');
    browserTrigger(first, 'keydown');
    scope.$service('$browser').defer.flush();
    expect(scope.items[0].x).toEqual('ABC');
  });

  it('ItShouldRemoveExtraChildrenWhenIteratingOverHash', function(){
    var scope = this.compile('<div><div ng:repeat="i in items">{{i}}</div></div>');
    var items = {};
    scope.items = items;

    scope.$apply();
    expect(scope.$element[0].childNodes.length - 1).toEqual(0);

    items.name = "misko";
    scope.$apply();
    expect(scope.$element[0].childNodes.length - 1).toEqual(1);

    delete items.name;
    scope.$apply();
    expect(scope.$element[0].childNodes.length - 1).toEqual(0);
  });

  it('IfTextBindingThrowsErrorDecorateTheSpan', function(){
    var scope = this.compile('<div>{{error.throw()}}</div>', null, true);
    var errorLogs = scope.$service('$exceptionHandler').errors;

    scope.error = {
        'throw': function(){throw "ErrorMsg1";}
    };
    scope.$apply();

    scope.error['throw'] = function(){throw "MyError";};
    errorLogs.length = 0;
    scope.$apply();
    assertEquals(['MyError'], errorLogs.shift());

    scope.error['throw'] = function(){return "ok";};
    scope.$apply();
    assertEquals(0, errorLogs.length);
  });

  it('IfAttrBindingThrowsErrorDecorateTheAttribute', function(){
    var scope = this.compile('<div attr="before {{error.throw()}} after"></div>', null, true);
    var errorLogs = scope.$service('$exceptionHandler').errors;
    var count = 0;

    scope.error = {
        'throw': function(){throw new Error("ErrorMsg" + (++count));}
    };
    scope.$apply();
    expect(errorLogs.length).not.toEqual(0);
    expect(errorLogs.shift()).toMatch(/ErrorMsg1/);
    errorLogs.length = 0;

    scope.error['throw'] =  function(){ return 'X';};
    scope.$apply();
    expect(errorLogs.length).toMatch(0);
  });

  it('NestedRepeater', function(){
    var scope = this.compile('<div><div ng:repeat="m in model" name="{{m.name}}">' +
                     '<ul name="{{i}}" ng:repeat="i in m.item"></ul>' +
                   '</div></div>');

    scope.model = [{name:'a', item:['a1', 'a2']}, {name:'b', item:['b1', 'b2']}];
    scope.$apply();

    assertEquals('<div>'+
        '<#comment></#comment>'+
        '<div name="a" ng:bind-attr="{"name":"{{m.name}}"}">'+
          '<#comment></#comment>'+
          '<ul name="a1" ng:bind-attr="{"name":"{{i}}"}"></ul>'+
          '<ul name="a2" ng:bind-attr="{"name":"{{i}}"}"></ul>'+
        '</div>'+
        '<div name="b" ng:bind-attr="{"name":"{{m.name}}"}">'+
          '<#comment></#comment>'+
          '<ul name="b1" ng:bind-attr="{"name":"{{i}}"}"></ul>'+
          '<ul name="b2" ng:bind-attr="{"name":"{{i}}"}"></ul>'+
        '</div></div>', sortedHtml(scope.$element));
  });

  it('HideBindingExpression', function(){
    var scope = this.compile('<div ng:hide="hidden == 3"/>');

    scope.hidden = 3;
    scope.$apply();

    assertHidden(scope.$element);

    scope.hidden = 2;
    scope.$apply();

    assertVisible(scope.$element);
  });

  it('HideBinding', function(){
    var scope = this.compile('<div ng:hide="hidden"/>');

    scope.hidden = 'true';
    scope.$apply();

    assertHidden(scope.$element);

    scope.hidden = 'false';
    scope.$apply();

    assertVisible(scope.$element);

    scope.hidden = '';
    scope.$apply();

    assertVisible(scope.$element);
  });

  it('ShowBinding', function(){
    var scope = this.compile('<div ng:show="show"/>');

    scope.show = 'true';
    scope.$apply();

    assertVisible(scope.$element);

    scope.show = 'false';
    scope.$apply();

    assertHidden(scope.$element);

    scope.show = '';
    scope.$apply();

    assertHidden(scope.$element);
  });


  it('BindClass', function(){
    var scope = this.compile('<div ng:class="clazz"/>');

    scope.clazz = 'testClass';
    scope.$apply();

    assertEquals('<div class="testClass" ng:class="clazz"></div>', sortedHtml(scope.$element));

    scope.clazz = ['a', 'b'];
    scope.$apply();

    assertEquals('<div class="a b" ng:class="clazz"></div>', sortedHtml(scope.$element));
  });

  it('BindClassEvenOdd', function(){
    var scope = this.compile('<div><div ng:repeat="i in [0,1]" ng:class-even="\'e\'" ng:class-odd="\'o\'"></div></div>');
    scope.$apply();
    var d1 = jqLite(scope.$element[0].childNodes[1]);
    var d2 = jqLite(scope.$element[0].childNodes[2]);
    expect(d1.hasClass('o')).toBeTruthy();
    expect(d2.hasClass('e')).toBeTruthy();
    assertEquals(
        '<div><#comment></#comment>' +
        '<div class="o" ng:class-even="\'e\'" ng:class-odd="\'o\'"></div>' +
        '<div class="e" ng:class-even="\'e\'" ng:class-odd="\'o\'"></div></div>',
        sortedHtml(scope.$element));
  });

  it('BindStyle', function(){
    var scope = this.compile('<div ng:style="style"/>');

    scope.$eval('style={height: "10px"}');
    scope.$apply();

    assertEquals("10px", scope.$element.css('height'));

    scope.$eval('style={}');
    scope.$apply();
  });

  it('ActionOnAHrefThrowsError', function(){
    var scope = this.compile('<a ng:click="action()">Add Phone</a>', null, true);
    scope.action = function(){
      throw new Error('MyError');
    };
    var input = scope.$element;
    browserTrigger(input, 'click');
    expect(scope.$service('$exceptionHandler').errors[0]).toMatch(/MyError/);
  });

  it('ShoulIgnoreVbNonBindable', function(){
    var scope = this.compile("<div>{{a}}" +
        "<div ng:non-bindable>{{a}}</div>" +
        "<div ng:non-bindable=''>{{b}}</div>" +
        "<div ng:non-bindable='true'>{{c}}</div></div>");
    scope.a = 123;
    scope.$apply();
    assertEquals('123{{a}}{{b}}{{c}}', scope.$element.text());
  });

  it('ShouldTemplateBindPreElements', function () {
    var scope = this.compile('<pre>Hello {{name}}!</pre>');
    scope.name = "World";
    scope.$apply();

    assertEquals('<pre ng:bind-template="Hello {{name}}!">Hello World!</pre>', sortedHtml(scope.$element));
  });

  it('FillInOptionValueWhenMissing', function(){
    var scope = this.compile(
        '<select ng:model="foo">' +
          '<option selected="true">{{a}}</option>' +
          '<option value="">{{b}}</option>' +
          '<option>C</option>' +
        '</select>');
    scope.a = 'A';
    scope.b = 'B';
    scope.$apply();
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

  it('DeleteAttributeIfEvaluatesFalse', function(){
    var scope = this.compile('<div>' +
        '<input ng:model="a0" ng:bind-attr="{disabled:\'{{true}}\'}">' +
        '<input ng:model="a1" ng:bind-attr="{disabled:\'{{false}}\'}">' +
        '<input ng:model="b0" ng:bind-attr="{disabled:\'{{1}}\'}">' +
        '<input ng:model="b1" ng:bind-attr="{disabled:\'{{0}}\'}">' +
        '<input ng:model="c0" ng:bind-attr="{disabled:\'{{[0]}}\'}">' +
        '<input ng:model="c1" ng:bind-attr="{disabled:\'{{[]}}\'}"></div>');
    scope.$apply();
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
        '<input type="button" ng:click=":garbage:"/></div>', null, true);
    var first = jqLite(scope.$element[0].childNodes[0]);
    var second = jqLite(scope.$element[0].childNodes[1]);
    var errorLogs = scope.$service('$log').error.logs;

    browserTrigger(first, 'click');
    assertEquals("ABC", scope.greeting);
    expect(errorLogs).toEqual([]);

    browserTrigger(second, 'click');
    expect(scope.$service('$exceptionHandler').errors[0]).
      toMatchError(/Syntax Error: Token ':' not a primary expression/);
  });

  it('ItShouldSelectTheCorrectRadioBox', function(){
    var scope = this.compile('<div>' +
        '<input type="radio" ng:model="sex" value="female">' +
        '<input type="radio" ng:model="sex" value="male"></div>');
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
    scope.$apply();
    assertEquals('<ul>' +
        '<#comment></#comment>' +
        '<li ng:bind=\"k + v\">a0</li>' +
        '<li ng:bind=\"k + v\">b1</li>' +
        '</ul>',
        sortedHtml(scope.$element));
  });

  it('ItShouldFireChangeListenersBeforeUpdate', function(){
    var scope = this.compile('<div ng:bind="name"></div>');
    scope.name = "";
    scope.$watch("watched", "name=123");
    scope.watched = "change";
    scope.$apply();
    assertEquals(123, scope.name);
    assertEquals(
        '<div ng:bind="name">123</div>',
        sortedHtml(scope.$element));
  });

  it('ItShouldHandleMultilineBindings', function(){
    var scope = this.compile('<div>{{\n 1 \n + \n 2 \n}}</div>');
    scope.$apply();
    assertEquals("3", scope.$element.text());
  });

});
