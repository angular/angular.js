describe("directives", function(){

  var compile, model, element;

  beforeEach(function() {
    var compiler = new Compiler(angularTextMarkup, angularAttrMarkup, angularDirective, angularWidget);
    compile = function(html) {
      element = jqLite(html);
      model = compiler.compile(element)(element);
      model.$init();
      return model;
    };
  });

  afterEach(function() {
    if (model && model.$element) model.$element.remove();
    expect(size(jqCache)).toEqual(0);
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

  it('should ng:bind-attr', function(){
    var scope = compile('<img ng:bind-attr="{src:\'http://localhost/mysrc\', alt:\'myalt\'}"/>');
    expect(element.attr('src')).toEqual('http://localhost/mysrc');
    expect(element.attr('alt')).toEqual('myalt');
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

  it('should ng:non-bindable', function(){
    var scope = compile('<div ng:non-bindable><span ng:bind="name"></span></div>');
    scope.$set('name', 'misko');
    scope.$eval();
    expect(element.text()).toEqual('');
  });


  describe('ng:repeat', function() {

    it('should ng:repeat over array', function(){
      var scope = compile('<ul><li ng:repeat="item in items" ng:init="suffix = \';\'" ng:bind="item + suffix"></li></ul>');

      Array.prototype.extraProperty = "should be ignored";
      scope.items = ['misko', 'shyam'];
      scope.$eval();
      expect(element.text()).toEqual('misko;shyam;');
      delete Array.prototype.extraProperty;

      scope.items = ['adam', 'kai', 'brad'];
      scope.$eval();
      expect(element.text()).toEqual('adam;kai;brad;');

      scope.items = ['brad'];
      scope.$eval();
      expect(element.text()).toEqual('brad;');
    });

    it('should ng:repeat over object', function(){
      var scope = compile('<ul><li ng:repeat="(key, value) in items" ng:bind="key + \':\' + value + \';\' "></li></ul>');
      scope.$set('items', {misko:'swe', shyam:'set'});
      scope.$eval();
      expect(element.text()).toEqual('misko:swe;shyam:set;');
    });

    it('should error on wrong parsing of ng:repeat', function(){
      var scope = compile('<ul><li ng:repeat="i dont parse"></li></ul>');
      var log = "";
      log += element.attr('ng-exception') + ';';
      log += element.hasClass('ng-exception') + ';';
      expect(log).toEqual("\"Expected ng:repeat in form of 'item in collection' but got 'i dont parse'.\";true;");
    });

    it('should expose iterator offset as $index when iterating over arrays', function() {
      var scope = compile('<ul><li ng:repeat="item in items" ' +
                                  'ng:bind="item + $index + \'|\'"></li></ul>');
      scope.items = ['misko', 'shyam', 'frodo'];
      scope.$eval();
      expect(element.text()).toEqual('misko0|shyam1|frodo2|');
    });

    it('should expose iterator offset as $index when iterating over objects', function() {
      var scope = compile('<ul><li ng:repeat="(key, val) in items" ' +
                                  'ng:bind="key + \':\' + val + $index + \'|\'"></li></ul>');
      scope.items = {'misko':'m', 'shyam':'s', 'frodo':'f'};
      scope.$eval();
      expect(element.text()).toEqual('misko:m0|shyam:s1|frodo:f2|');
    });

    it('should expose iterator position as $position when iterating over arrays', function() {
      var scope = compile('<ul><li ng:repeat="item in items" ' +
                                  'ng:bind="item + \':\' + $position + \'|\'"></li></ul>');
      scope.items = ['misko', 'shyam', 'doug', 'frodo'];
      scope.$eval();
      expect(element.text()).toEqual('misko:first|shyam:middle|doug:middle|frodo:last|');
    });

    it('should expose iterator position as $position when iterating over objects', function() {
      var scope = compile('<ul><li ng:repeat="(key, val) in items" ' +
                                  'ng:bind="key + \':\' + val + \':\' + $position + \'|\'"></li></ul>');
      scope.items = {'misko':'m', 'shyam':'s', 'doug':'d', 'frodo':'f'};
      scope.$eval();
      expect(element.text()).toEqual('misko:m:first|shyam:s:middle|doug:d:middle|frodo:f:last|');
    });
  });


  it('should ng:watch', function(){
    var scope = compile('<div ng:watch="i: count = count + 1" ng:init="count = 0">');
    scope.$eval();
    scope.$eval();
    expect(scope.$get('count')).toEqual(1);

    scope.$set('i', 0);
    scope.$eval();
    scope.$eval();
    expect(scope.$get('count')).toEqual(2);
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

  it('should ng:class', function(){
    var scope = compile('<div class="existing" ng:class="[\'A\', \'B\']"></div>');
    scope.$eval();
    expect(element.hasClass('existing')).toBeTruthy();
    expect(element.hasClass('A')).toBeTruthy();
    expect(element.hasClass('B')).toBeTruthy();
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
      var scope = compile('<div ng:style="{color:\'red\'}"></div>');
      scope.$eval();
      expect(element.css('color')).toEqual('red');
    });

    it('should silently ignore undefined style', function() {
      var scope = compile('<div ng:style="myStyle"></div>');
      scope.$eval();
      expect(element.hasClass('ng-exception')).toBeFalsy();
    });

    it('should preserve and remove previous style', function(){
      var scope = compile('<div style="color:red;" ng:style="myStyle"></div>');
      scope.$eval();
      expect(getStyle(element)).toEqual({color:'red'});
      scope.myStyle = {color:'blue', width:'10px'};
      scope.$eval();
      expect(getStyle(element)).toEqual({color:'blue', width:'10px'});
      scope.myStyle = {};
      scope.$eval();
      expect(getStyle(element)).toEqual({color:'red'});
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
