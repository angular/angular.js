'use strict';

describe('Binder', function() {

  function childNode(element, index) {
    return jqLite(element[0].childNodes[index]);
  }

  beforeEach(function() {
    this.compileToHtml = function (content) {
      var html;
      inject(function($rootScope, $compile){
        content = jqLite(content);
        $compile(content)($rootScope);
        html = sortedHtml(content);
      }).call(this);
      return html;
    };
  });

  afterEach(function() {
    if (this.element && this.element.dealoc) {
      this.element.dealoc();
    }
  });

  it('BindUpdate', inject(function($rootScope, $compile) {
    $compile('<div ng:init="a=123"/>')($rootScope);
    $rootScope.$digest();
    expect($rootScope.a).toBe(123);
  }));

  it('ExecuteInitialization', inject(function($rootScope, $compile) {
    $compile('<div ng:init="a=123">')($rootScope);
    expect($rootScope.a).toBe(123);
  }));

  it('ExecuteInitializationStatements', inject(function($rootScope, $compile) {
    $compile('<div ng:init="a=123;b=345">')($rootScope);
    expect($rootScope.a).toBe(123);
    expect($rootScope.b).toBe(345);
  }));

  it('ApplyTextBindings', inject(function($rootScope, $compile) {
    var element = $compile('<div ng:bind="model.a">x</div>')($rootScope);
    $rootScope.model = {a:123};
    $rootScope.$apply();
    expect(element.text()).toBe('123');
  }));

  it('ReplaceBindingInTextWithSpan preserve surounding text', function() {
    expect(this.compileToHtml("<b>a{{b}}c</b>")).toBe('<b>a<span ng:bind="b"></span>c</b>');
  });

  it('ReplaceBindingInTextWithSpan', function() {
    expect(this.compileToHtml("<b>{{b}}</b>")).toBe('<b><span ng:bind="b"></span></b>');
  });

  it('BindingSpaceConfusesIE', inject(function($rootScope, $compile) {
    if (!msie) return;
    var span = document.createElement("span");
    span.innerHTML = '&nbsp;';
    var nbsp = span.firstChild.nodeValue;
    expect(this.compileToHtml("<b>{{a}} {{b}}</b>")).
        toBe('<b><span ng:bind="a"></span><span>' + nbsp + '</span><span ng:bind="b"></span></b>');
    dealoc(($rootScope));
    expect(this.compileToHtml("<b>{{A}} x {{B}} ({{C}})</b>")).
        toBe('<b><span ng:bind="A"></span><span>' + nbsp + 'x </span><span ng:bind="B"></span>' +
             '<span>' + nbsp + '(</span><span ng:bind="C"></span>)</b>');
  }));

  it('BindingOfAttributes', inject(function($rootScope, $compile) {
    var element = $compile("<a href='http://s/a{{b}}c' foo='x'></a>")($rootScope);
    var attrbinding = element.attr("ng:bind-attr");
    var bindings = fromJson(attrbinding);
    expect(decodeURI(bindings.href)).toBe("http://s/a{{b}}c");
    expect(bindings.foo).toBeFalsy();
  }));

  it('MarkMultipleAttributes', inject(function($rootScope, $compile) {
    var element = $compile('<a href="http://s/a{{b}}c" foo="{{d}}"></a>')($rootScope);
    var attrbinding = element.attr("ng:bind-attr");
    var bindings = fromJson(attrbinding);
    expect(bindings.foo).toBe("{{d}}");
    expect(decodeURI(bindings.href)).toBe("http://s/a{{b}}c");
  }));

  it('AttributesNoneBound', inject(function($rootScope, $compile) {
    var a = $compile("<a href='abc' foo='def'></a>")($rootScope);
    expect(a[0].nodeName).toBe("A");
    expect(a.attr("ng:bind-attr")).toBeFalsy();
  }));

  it('ExistingAttrbindingIsAppended', inject(function($rootScope, $compile) {
    var a = $compile("<a href='http://s/{{abc}}' ng:bind-attr='{\"b\":\"{{def}}\"}'></a>")($rootScope);
    expect(a.attr('ng:bind-attr')).toBe('{"b":"{{def}}","href":"http://s/{{abc}}"}');
  }));

  it('AttributesAreEvaluated', inject(function($rootScope, $compile) {
    var a = $compile('<a ng:bind-attr=\'{"a":"a", "b":"a+b={{a+b}}"}\'></a>')($rootScope);
    $rootScope.$eval('a=1;b=2');
    $rootScope.$apply();
    expect(a.attr('a')).toBe('a');
    expect(a.attr('b')).toBe('a+b=3');
  }));

  it('InputTypeButtonActionExecutesInScope', inject(function($rootScope, $compile) {
    var savedCalled = false;
    var element = $compile(
      '<input type="button" ng:click="person.save()" value="Apply">')($rootScope);
    $rootScope.person = {};
    $rootScope.person.save = function() {
      savedCalled = true;
    };
    browserTrigger(element, 'click');
    expect(savedCalled).toBe(true);
  }));

  it('InputTypeButtonActionExecutesInScope2', inject(function($rootScope, $compile) {
    var log = "";
    var element = $compile('<input type="image" ng:click="action()">')($rootScope);
    $rootScope.action = function() {
      log += 'click;';
    };
    expect(log).toEqual('');
    browserTrigger(element, 'click');
    expect(log).toEqual('click;');
  }));

  it('ButtonElementActionExecutesInScope', inject(function($rootScope, $compile) {
    var savedCalled = false;
    var element = $compile('<button ng:click="person.save()">Apply</button>')($rootScope);
    $rootScope.person = {};
    $rootScope.person.save = function() {
      savedCalled = true;
    };
    browserTrigger(element, 'click');
    expect(savedCalled).toBe(true);
  }));

  it('RepeaterUpdateBindings', inject(function($rootScope, $compile) {
    var form = $compile(
      '<ul>' +
        '<LI ng:repeat="item in model.items" ng:bind="item.a"></LI>' +
      '</ul>')($rootScope);
    var items = [{a:"A"}, {a:"B"}];
    $rootScope.model = {items:items};

    $rootScope.$apply();
    expect(sortedHtml(form)).toBe(
        '<ul>' +
          '<#comment></#comment>' +
          '<li ng:bind="item.a">A</li>' +
          '<li ng:bind="item.a">B</li>' +
        '</ul>');

    items.unshift({a:'C'});
    $rootScope.$apply();
    expect(sortedHtml(form)).toBe(
        '<ul>' +
          '<#comment></#comment>' +
          '<li ng:bind="item.a">C</li>' +
          '<li ng:bind="item.a">A</li>' +
          '<li ng:bind="item.a">B</li>' +
        '</ul>');

    items.shift();
    $rootScope.$apply();
    expect(sortedHtml(form)).toBe(
        '<ul>' +
          '<#comment></#comment>' +
          '<li ng:bind="item.a">A</li>' +
          '<li ng:bind="item.a">B</li>' +
        '</ul>');

    items.shift();
    items.shift();
    $rootScope.$apply();
  }));

  it('RepeaterContentDoesNotBind', inject(function($rootScope, $compile) {
    var element = $compile(
      '<ul>' +
        '<LI ng:repeat="item in model.items"><span ng:bind="item.a"></span></li>' +
      '</ul>')($rootScope);
    $rootScope.model = {items:[{a:"A"}]};
    $rootScope.$apply();
    expect(sortedHtml(element)).toBe(
        '<ul>' +
          '<#comment></#comment>' +
          '<li><span ng:bind="item.a">A</span></li>' +
        '</ul>');
  }));

  it('DoNotOverwriteCustomAction', function() {
    var html = this.compileToHtml('<input type="submit" value="Save" action="foo();">');
    expect(html.indexOf('action="foo();"')).toBeGreaterThan(0);
  });

  it('RepeaterAdd', inject(function($rootScope, $compile, $browser) {
    var element = $compile('<div><input type="text" ng:model="item.x" ng:repeat="item in items"></div>')($rootScope);
    $rootScope.items = [{x:'a'}, {x:'b'}];
    $rootScope.$apply();
    var first = childNode(element, 1);
    var second = childNode(element, 2);
    expect(first.val()).toEqual('a');
    expect(second.val()).toEqual('b');

    first.val('ABC');
    browserTrigger(first, 'keydown');
    $browser.defer.flush();
    expect($rootScope.items[0].x).toEqual('ABC');
  }));

  it('ItShouldRemoveExtraChildrenWhenIteratingOverHash', inject(function($rootScope, $compile) {
    var element = $compile('<div><div ng:repeat="i in items">{{i}}</div></div>')($rootScope);
    var items = {};
    $rootScope.items = items;

    $rootScope.$apply();
    expect(element[0].childNodes.length - 1).toEqual(0);

    items.name = "misko";
    $rootScope.$apply();
    expect(element[0].childNodes.length - 1).toEqual(1);

    delete items.name;
    $rootScope.$apply();
    expect(element[0].childNodes.length - 1).toEqual(0);
  }));

  it('IfTextBindingThrowsErrorDecorateTheSpan', inject(
    function($exceptionHandlerProvider){
      $exceptionHandlerProvider.mode('log');
    },
    function($rootScope, $exceptionHandler, $compile) {
      $compile('<div>{{error.throw()}}</div>', null, true)($rootScope);
      var errorLogs = $exceptionHandler.errors;

      $rootScope.error = {
          'throw': function() {throw "ErrorMsg1";}
      };
      $rootScope.$apply();

      $rootScope.error['throw'] = function() {throw "MyError";};
      errorLogs.length = 0;
      $rootScope.$apply();
      expect(errorLogs.shift()).toBe('MyError');

      $rootScope.error['throw'] = function() {return "ok";};
      $rootScope.$apply();
      expect(errorLogs.length).toBe(0);
    })
  );

  it('IfAttrBindingThrowsErrorDecorateTheAttribute', inject(function($exceptionHandlerProvider){
    $exceptionHandlerProvider.mode('log');
  }, function($rootScope, $exceptionHandler, $compile) {
    $compile('<div attr="before {{error.throw()}} after"></div>', null, true)($rootScope);
    var errorLogs = $exceptionHandler.errors;
    var count = 0;

    $rootScope.error = {
        'throw': function() {throw new Error("ErrorMsg" + (++count));}
    };
    $rootScope.$apply();
    expect(errorLogs.length).not.toEqual(0);
    expect(errorLogs.shift()).toMatch(/ErrorMsg1/);
    errorLogs.length = 0;

    $rootScope.error['throw'] =  function() { return 'X';};
    $rootScope.$apply();
    expect(errorLogs.length).toMatch(0);
  }));

  it('NestedRepeater', inject(function($rootScope, $compile) {
    var element = $compile(
      '<div>' +
        '<div ng:repeat="m in model" name="{{m.name}}">' +
           '<ul name="{{i}}" ng:repeat="i in m.item"></ul>' +
        '</div>' +
      '</div>')($rootScope);

    $rootScope.model = [{name:'a', item:['a1', 'a2']}, {name:'b', item:['b1', 'b2']}];
    $rootScope.$apply();

    expect(sortedHtml(element)).toBe(
        '<div>'+
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
          '</div>' +
        '</div>');
  }));

  it('HideBindingExpression', inject(function($rootScope, $compile) {
    var element = $compile('<div ng:hide="hidden == 3"/>')($rootScope);

    $rootScope.hidden = 3;
    $rootScope.$apply();

    assertHidden(element);

    $rootScope.hidden = 2;
    $rootScope.$apply();

    assertVisible(element);
  }));

  it('HideBinding', inject(function($rootScope, $compile) {
    var element = $compile('<div ng:hide="hidden"/>')($rootScope);

    $rootScope.hidden = 'true';
    $rootScope.$apply();

    assertHidden(element);

    $rootScope.hidden = 'false';
    $rootScope.$apply();

    assertVisible(element);

    $rootScope.hidden = '';
    $rootScope.$apply();

    assertVisible(element);
  }));

  it('ShowBinding', inject(function($rootScope, $compile) {
    var element = $compile('<div ng:show="show"/>')($rootScope);

    $rootScope.show = 'true';
    $rootScope.$apply();

    assertVisible(element);

    $rootScope.show = 'false';
    $rootScope.$apply();

    assertHidden(element);

    $rootScope.show = '';
    $rootScope.$apply();

    assertHidden(element);
  }));


  it('BindClass', inject(function($rootScope, $compile) {
    var element = $compile('<div ng:class="clazz"/>')($rootScope);

    $rootScope.clazz = 'testClass';
    $rootScope.$apply();

    expect(sortedHtml(element)).toBe('<div class="testClass" ng:class="clazz"></div>');

    $rootScope.clazz = ['a', 'b'];
    $rootScope.$apply();

    expect(sortedHtml(element)).toBe('<div class="a b" ng:class="clazz"></div>');
  }));

  it('BindClassEvenOdd', inject(function($rootScope, $compile) {
    var element = $compile(
      '<div>' +
        '<div ng:repeat="i in [0,1]" ng:class-even="\'e\'" ng:class-odd="\'o\'"></div>' +
      '</div>')($rootScope);
    $rootScope.$apply();
    var d1 = jqLite(element[0].childNodes[1]);
    var d2 = jqLite(element[0].childNodes[2]);
    expect(d1.hasClass('o')).toBeTruthy();
    expect(d2.hasClass('e')).toBeTruthy();
    expect(sortedHtml(element)).toBe(
        '<div><#comment></#comment>' +
        '<div class="o" ng:class-even="\'e\'" ng:class-odd="\'o\'"></div>' +
        '<div class="e" ng:class-even="\'e\'" ng:class-odd="\'o\'"></div></div>');
  }));

  it('BindStyle', inject(function($rootScope, $compile) {
    var element = $compile('<div ng:style="style"/>')($rootScope);

    $rootScope.$eval('style={height: "10px"}');
    $rootScope.$apply();

    expect(element.css('height')).toBe("10px");

    $rootScope.$eval('style={}');
    $rootScope.$apply();
  }));

  it('ActionOnAHrefThrowsError', inject(
    function($exceptionHandlerProvider){
      $exceptionHandlerProvider.mode('log');
    },
    function($rootScope, $exceptionHandler, $compile) {
      var input = $compile('<a ng:click="action()">Add Phone</a>')($rootScope);
      $rootScope.action = function() {
        throw new Error('MyError');
      };
      browserTrigger(input, 'click');
      expect($exceptionHandler.errors[0]).toMatch(/MyError/);
    })
  );

  it('ShoulIgnoreVbNonBindable', inject(function($rootScope, $compile) {
    var element = $compile(
      "<div>{{a}}" +
        "<div ng:non-bindable>{{a}}</div>" +
        "<div ng:non-bindable=''>{{b}}</div>" +
        "<div ng:non-bindable='true'>{{c}}</div>" +
      "</div>")($rootScope);
    $rootScope.a = 123;
    $rootScope.$apply();
    expect(element.text()).toBe('123{{a}}{{b}}{{c}}');
  }));

  it('ShouldTemplateBindPreElements', inject(function ($rootScope, $compile) {
    var element = $compile('<pre>Hello {{name}}!</pre>')($rootScope);
    $rootScope.name = "World";
    $rootScope.$apply();

    expect(      sortedHtml(element)).toBe(
      '<pre ng:bind-template="Hello {{name}}!">Hello World!</pre>');
  }));

  it('FillInOptionValueWhenMissing', inject(function($rootScope, $compile) {
    var element = $compile(
        '<select ng:model="foo">' +
          '<option selected="true">{{a}}</option>' +
          '<option value="">{{b}}</option>' +
          '<option>C</option>' +
        '</select>')($rootScope);
    $rootScope.a = 'A';
    $rootScope.b = 'B';
    $rootScope.$apply();
    var optionA = childNode(element, 0);
    var optionB = childNode(element, 1);
    var optionC = childNode(element, 2);

    expect(optionA.attr('value')).toEqual('A');
    expect(optionA.text()).toEqual('A');

    expect(optionB.attr('value')).toEqual('');
    expect(optionB.text()).toEqual('B');

    expect(optionC.attr('value')).toEqual('C');
    expect(optionC.text()).toEqual('C');
  }));

  it('DeleteAttributeIfEvaluatesFalse', inject(function($rootScope, $compile) {
    var element = $compile(
      '<div>' +
        '<input ng:model="a0" ng:bind-attr="{disabled:\'{{true}}\'}">' +
        '<input ng:model="a1" ng:bind-attr="{disabled:\'{{false}}\'}">' +
        '<input ng:model="b0" ng:bind-attr="{disabled:\'{{1}}\'}">' +
        '<input ng:model="b1" ng:bind-attr="{disabled:\'{{0}}\'}">' +
        '<input ng:model="c0" ng:bind-attr="{disabled:\'{{[0]}}\'}">' +
        '<input ng:model="c1" ng:bind-attr="{disabled:\'{{[]}}\'}">' +
      '</div>')($rootScope);
    $rootScope.$apply();
    function assertChild(index, disabled) {
      expect(!!childNode(element, index).attr('disabled')).toBe(disabled);
    }

    assertChild(0, true);
    assertChild(1, false);
    assertChild(2, true);
    assertChild(3, false);
    assertChild(4, true);
    assertChild(5, false);
  }));

  it('ItShouldDisplayErrorWhenActionIsSyntacticlyIncorrect', inject(
    function($exceptionHandlerProvider){
      $exceptionHandlerProvider.mode('log');
    },
    function($rootScope, $exceptionHandler, $log, $compile) {
      var element = $compile(
        '<div>' +
          '<input type="button" ng:click="greeting=\'ABC\'"/>' +
          '<input type="button" ng:click=":garbage:"/>' +
        '</div>')($rootScope);
      var first = jqLite(element.find('input')[0]);
      var second = jqLite(element.find('input')[1]);
      var errorLogs = $log.error.logs;

      browserTrigger(first, 'click');
      expect($rootScope.greeting).toBe("ABC");
      expect(errorLogs).toEqual([]);

      browserTrigger(second, 'click');
      expect($exceptionHandler.errors[0]).
        toMatchError(/Syntax Error: Token ':' not a primary expression/);
    })
  );

  it('ItShouldSelectTheCorrectRadioBox', inject(function($rootScope, $compile) {
    var element = $compile(
      '<div>' +
        '<input type="radio" ng:model="sex" value="female">' +
        '<input type="radio" ng:model="sex" value="male">' +
      '</div>')($rootScope);
    var female = jqLite(element[0].childNodes[0]);
    var male = jqLite(element[0].childNodes[1]);

    browserTrigger(female);
    expect($rootScope.sex).toBe("female");
    expect(female[0].checked).toBe(true);
    expect(male[0].checked).toBe(false);
    expect(female.val()).toBe("female");

    browserTrigger(male);
    expect($rootScope.sex).toBe("male");
    expect(female[0].checked).toBe(false);
    expect(male[0].checked).toBe(true);
    expect(male.val()).toBe("male");
  }));

  it('ItShouldRepeatOnHashes', inject(function($rootScope, $compile) {
    var element = $compile(
      '<ul>' +
        '<li ng:repeat="(k,v) in {a:0,b:1}" ng:bind=\"k + v\"></li>' +
      '</ul>')($rootScope);
    $rootScope.$apply();
    expect(sortedHtml(element)).toBe(
        '<ul>' +
          '<#comment></#comment>' +
          '<li ng:bind=\"k + v\">a0</li>' +
          '<li ng:bind=\"k + v\">b1</li>' +
        '</ul>');
  }));

  it('ItShouldFireChangeListenersBeforeUpdate', inject(function($rootScope, $compile) {
    var element = $compile('<div ng:bind="name"></div>')($rootScope);
    $rootScope.name = "";
    $rootScope.$watch("watched", "name=123");
    $rootScope.watched = "change";
    $rootScope.$apply();
    expect($rootScope.name).toBe(123);
    expect(sortedHtml(element)).toBe('<div ng:bind="name">123</div>');
  }));

  it('ItShouldHandleMultilineBindings', inject(function($rootScope, $compile) {
    var element = $compile('<div>{{\n 1 \n + \n 2 \n}}</div>')($rootScope);
    $rootScope.$apply();
    expect(element.text()).toBe("3");
  }));

});
