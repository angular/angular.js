describe("directive", function(){

  var compile, model, element;

  beforeEach(function() {
    compile = function(html) {
      element = jqLite(html);
      return model = angular.compile(element)();
    };
  });

  afterEach(function() {
    dealoc(model);
  });

  it("should ng:init", function() {
    var scope = compile('<div ng:init="a=123"></div>');
    expect(scope.a).toEqual(123);
  });

  it("should ng:eval", function() {
    var scope = compile('<div ng:init="a=0" ng:eval="a = a + 1"></div>');
    expect(scope.a).toEqual(1);
    scope.$eval();
    expect(scope.a).toEqual(2);
  });

  describe('ng:bind', function(){
    it('should set text', function() {
      var scope = compile('<div ng:bind="a"></div>');
      expect(element.text()).toEqual('');
      scope.a = 'misko';
      scope.$eval();
      expect(element.hasClass('ng-binding')).toEqual(true);
      expect(element.text()).toEqual('misko');
    });

    it('should set text to blank if undefined', function() {
      var scope = compile('<div ng:bind="a"></div>');
      scope.a = 'misko';
      scope.$eval();
      expect(element.text()).toEqual('misko');
      scope.a = undefined;
      scope.$eval();
      expect(element.text()).toEqual('');
    });

    it('should set html', function() {
      var scope = compile('<div ng:bind="html|html"></div>');
      scope.html = '<div unknown>hello</div>';
      scope.$eval();
      expect(lowercase(element.html())).toEqual('<div>hello</div>');
    });

    it('should set unsafe html', function() {
      var scope = compile('<div ng:bind="html|html:\'unsafe\'"></div>');
      scope.html = '<div onclick="">hello</div>';
      scope.$eval();
      expect(lowercase(element.html())).toEqual('<div onclick="">hello</div>');
    });

    it('should set element element', function() {
      angularFilter.myElement = function() {
        return jqLite('<a>hello</a>');
      };
      var scope = compile('<div ng:bind="0|myElement"></div>');
      scope.$eval();
      expect(lowercase(element.html())).toEqual('<a>hello</a>');
    });

    it('should have $element set to current bind element', function(){
      angularFilter.myFilter = function(){
        this.$element.addClass("filter");
        return 'HELLO';
      };
      var scope = compile('<div>before<div ng:bind="0|myFilter"></div>after</div>');
      expect(sortedHtml(scope.$element)).toEqual('<div>before<div class="filter" ng:bind="0|myFilter">HELLO</div>after</div>');
    });


    it('should suppress rendering of falsy values', function(){
      var scope = compile('<div>{{ null }}{{ undefined }}{{ "" }}-{{ 0 }}{{ false }}</div>');
      expect(scope.$element.text()).toEqual('-0false');
    });

  });

  describe('ng:bind-template', function(){
    it('should ng:bind-template', function() {
      var scope = compile('<div ng:bind-template="Hello {{name}}!"></div>');
      scope.$set('name', 'Misko');
      scope.$eval();
      expect(element.hasClass('ng-binding')).toEqual(true);
      expect(element.text()).toEqual('Hello Misko!');
    });

    it('should have $element set to current bind element', function(){
      var innerText = 'blank';
      angularFilter.myFilter = function(text){
        innerText = this.$element.text();
        return text;
      };
      var scope = compile('<div>before<span ng:bind-template="{{\'HELLO\'|myFilter}}">INNER</span>after</div>');
      expect(scope.$element.text()).toEqual("beforeHELLOafter");
      expect(innerText).toEqual('INNER');
    });

  });

  describe('ng:bind-attr', function(){
    it('should bind attributes', function(){
      var scope = compile('<img ng:bind-attr="{src:\'http://localhost/mysrc\', alt:\'myalt\'}"/>');
      expect(element.attr('src')).toEqual('http://localhost/mysrc');
      expect(element.attr('alt')).toEqual('myalt');
    });

    it('should not pretty print JSON in attributes', function(){
      var scope = compile('<img alt="{{ {a:1} }}"/>');
      expect(element.attr('alt')).toEqual('{"a":1}');
    });
  });

  it('should remove special attributes on false', function(){
    var scope = compile('<input ng:bind-attr="{disabled:\'{{disabled}}\', readonly:\'{{readonly}}\', checked:\'{{checked}}\'}"/>');
    var input = scope.$element[0];
    expect(input.disabled).toEqual(false);
    expect(input.readOnly).toEqual(false);
    expect(input.checked).toEqual(false);

    scope.disabled = true;
    scope.readonly = true;
    scope.checked = true;
    scope.$eval();

    expect(input.disabled).toEqual(true);
    expect(input.readOnly).toEqual(true);
    expect(input.checked).toEqual(true);
  });

  describe('ng:click', function(){
    it('should get called on a click', function(){
      var scope = compile('<div ng:click="clicked = true"></div>');
      scope.$eval();
      expect(scope.$get('clicked')).toBeFalsy();

      browserTrigger(element, 'click');
      expect(scope.$get('clicked')).toEqual(true);
    });

    it('should stop event propagation', function() {
      var scope = compile('<div ng:click="outer = true"><div ng:click="inner = true"></div></div>');
      scope.$eval();
      expect(scope.outer).not.toBeDefined();
      expect(scope.inner).not.toBeDefined();

      var innerDiv = element.children()[0];

      browserTrigger(innerDiv, 'click');
      expect(scope.outer).not.toBeDefined();
      expect(scope.inner).toEqual(true);
    });
  });


  describe('ng:submit', function() {
    it('should get called on form submit', function() {
      var scope = compile('<form action="" ng:submit="submitted = true">' +
                            '<input type="submit"/>' +
                          '</form>');
      scope.$eval();
      expect(scope.submitted).not.toBeDefined();

      browserTrigger(element.children()[0]);
      expect(scope.submitted).toEqual(true);
    });
  });


  describe('ng:class', function() {
    it('should change current class or remove old classes dynamically', function() {
      var scope = compile('<div class="existing" ng:class="dynClass"></div>');
      scope.dynClass = 'A';
      scope.$eval();
      expect(element.hasClass('existing')).toBe(true);
      expect(element.hasClass('A')).toBe(true);

      scope.dynClass = 'B';
      scope.$eval();
      expect(element.hasClass('existing')).toBe(true);
      expect(element.hasClass('A')).toBe(false);
      expect(element.hasClass('B')).toBe(true);

      delete scope.dynClass;
      scope.$eval();
      expect(element.hasClass('existing')).toBe(true);
      expect(element.hasClass('A')).toBe(false);
      expect(element.hasClass('B')).toBe(false);
    });

    it('should support adding multiple classes', function(){
      var scope = compile('<div class="existing" ng:class="[\'A\', \'B\']"></div>');
      scope.$eval();
      expect(element.hasClass('existing')).toBeTruthy();
      expect(element.hasClass('A')).toBeTruthy();
      expect(element.hasClass('B')).toBeTruthy();
    });

    it('should preserve class added post compilation', function() {
      var scope = compile('<div class="existing" ng:class="dynClass"></div>');
      scope.dynClass = 'A';
      scope.$eval();
      expect(element.hasClass('existing')).toBe(true);

      // add extra class, change model and eval
      element.addClass('newClass');
      scope.dynClass = 'B';
      scope.$eval();

      expect(element.hasClass('existing')).toBe(true);
      expect(element.hasClass('B')).toBe(true);
      expect(element.hasClass('newClass')).toBe(true);
    });

    it('should preserve class added post compilation even without existing classes"', function() {
      var scope = compile('<div ng:class="dynClass"></div>');
      scope.dynClass = 'A';
      scope.$eval();
      expect(element.hasClass('A')).toBe(true);

      // add extra class, change model and eval
      element.addClass('newClass');
      scope.dynClass = 'B';
      scope.$eval();

      expect(element.hasClass('B')).toBe(true);
      expect(element.hasClass('newClass')).toBe(true);
    });

    it('should preserve right classes"', function() {
      var scope = compile('<div class="ui-panel ui-selected" ng:class="dynCls"></div>');
      scope.dynCls = 'panel';
      scope.dynCls = 'foo';
      scope.$eval();
      expect(element.attr('class')).toBe('ui-panel ui-selected ng-directive foo');
    });
  });


  it('should ng:class odd/even', function(){
    var scope = compile('<ul><li ng:repeat="i in [0,1]" class="existing" ng:class-odd="\'odd\'" ng:class-even="\'even\'"></li><ul>');
    scope.$eval();
    var e1 = jqLite(element[0].childNodes[1]);
    var e2 = jqLite(element[0].childNodes[2]);
    expect(e1.hasClass('existing')).toBeTruthy();
    expect(e1.hasClass('odd')).toBeTruthy();
    expect(e2.hasClass('existing')).toBeTruthy();
    expect(e2.hasClass('even')).toBeTruthy();
  });

  describe('ng:style', function(){
    it('should set', function(){
      var scope = compile('<div ng:style="{height: \'40px\'}"></div>');
      scope.$eval();
      expect(element.css('height')).toEqual('40px');
    });

    it('should silently ignore undefined style', function() {
      var scope = compile('<div ng:style="myStyle"></div>');
      scope.$eval();
      expect(element.hasClass('ng-exception')).toBeFalsy();
    });

    it('should preserve and remove previous style', function(){
      var scope = compile('<div style="height: 10px;" ng:style="myStyle"></div>');
      scope.$eval();
      expect(getStyle(element)).toEqual({height: '10px'});
      scope.myStyle = {height: '20px', width: '10px'};
      scope.$eval();
      expect(getStyle(element)).toEqual({height: '20px', width: '10px'});
      scope.myStyle = {};
      scope.$eval();
      expect(getStyle(element)).toEqual({height: '10px'});
    });
  });

  it('should silently ignore undefined ng:style', function() {
    var scope = compile('<div ng:style="myStyle"></div>');
    scope.$eval();
    expect(element.hasClass('ng-exception')).toBeFalsy();
  });

  it('should ng:show', function(){
    var scope = compile('<div ng:hide="hide"></div>');
    scope.$eval();
    expect(isCssVisible(scope.$element)).toEqual(true);
    scope.$set('hide', true);
    scope.$eval();
    expect(isCssVisible(scope.$element)).toEqual(false);
  });

  it('should ng:hide', function(){
    var scope = compile('<div ng:show="show"></div>');
    scope.$eval();
    expect(isCssVisible(scope.$element)).toEqual(false);
    scope.$set('show', true);
    scope.$eval();
    expect(isCssVisible(scope.$element)).toEqual(true);
  });

  describe('ng:controller', function(){

    var temp;

    beforeEach(function(){
      temp = window.temp = {};
      temp.Greeter = function(){
        this.$root.greeter = this;
        this.greeting = 'hello';
        this.suffix = '!';
      };
      temp.Greeter.prototype = {
        greet: function(name) {
          return this.greeting + ' ' + name + this.suffix;
        }
      };
    });

    afterEach(function(){
      window.temp = undefined;
    });

    it('should bind', function(){
      var scope = compile('<div ng:controller="temp.Greeter"></div>');
      expect(scope.greeter.greeting).toEqual('hello');
      expect(scope.greeter.greet('misko')).toEqual('hello misko!');
    });

    it('should support nested controllers', function(){
      temp.ChildGreeter = function(){
        this.greeting = 'hey';
        this.$root.childGreeter = this;
      };
      temp.ChildGreeter.prototype = {
        greet: function() {
          return this.greeting + ' dude' + this.suffix;
        }
      };
      var scope = compile('<div ng:controller="temp.Greeter"><div ng:controller="temp.ChildGreeter">{{greet("misko")}}</div></div>');
      expect(scope.greeting).not.toBeDefined();
      expect(scope.greeter.greeting).toEqual('hello');
      expect(scope.greeter.greet('misko')).toEqual('hello misko!');
      expect(scope.greeter.greeting).toEqual('hello');
      expect(scope.childGreeter.greeting).toEqual('hey');
      expect(scope.childGreeter.$parent.greeting).toEqual('hello');
      expect(scope.$element.text()).toEqual('hey dude!');
    });

  });

  it('should eval things according to ng:eval-order', function(){
    var scope = compile(
          '<div ng:init="log=\'\'">' +
            '{{log = log + \'e\'}}' +
            '<span ng:eval-order="first" ng:eval="log = log + \'a\'">' +
              '{{log = log + \'b\'}}' +
              '<span src="{{log = log + \'c\'}}"></span>' +
              '<span bind-template="{{log = log + \'d\'}}"></span>' +
            '</span>' +
          '</div>');
    expect(scope.log).toEqual('abcde');
  });

});
