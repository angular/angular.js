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

  it("should ng-init", function() {
    var scope = compile('<div ng-init="a=123"></div>');
    expect(scope.a).toEqual(123);
  });

  it("should ng-eval", function() {
    var scope = compile('<div ng-init="a=0" ng-eval="a = a + 1"></div>');
    expect(scope.a).toEqual(1);
    scope.$eval();
    expect(scope.a).toEqual(2);
  });

  it('should ng-bind', function() {
    var scope = compile('<div ng-bind="a"></div>');
    expect(element.text()).toEqual('');
    scope.a = 'misko';
    scope.$eval();
    expect(element.text()).toEqual('misko');
  });

  it('should ng-bind html', function() {
    var scope = compile('<div ng-bind="html|html"></div>');
    scope.html = '<div>hello</div>';
    scope.$eval();
    expect(lowercase(element.html())).toEqual('<div>hello</div>');
  });

  it('should ng-bind-template', function() {
    var scope = compile('<div ng-bind-template="Hello {{name}}!"></div>');
    scope.$set('name', 'Misko');
    scope.$eval();
    expect(element.text()).toEqual('Hello Misko!');
  });

  it('should ng-bind-attr', function(){
    var scope = compile('<img ng-bind-attr="{src:\'mysrc\', alt:\'myalt\'}"/>');
    expect(element.attr('src')).toEqual('mysrc');
    expect(element.attr('alt')).toEqual('myalt');
  });

  it('should remove special attributes on false', function(){
    var scope = compile('<div ng-bind-attr="{disabled:\'{{disabled}}\', readonly:\'{{readonly}}\', checked:\'{{checked}}\'}"/>');
    expect(scope.$element.attr('disabled')).toEqual(null);
    expect(scope.$element.attr('readonly')).toEqual(null);
    expect(scope.$element.attr('checked')).toEqual(null);

    scope.disabled = true;
    scope.readonly = true;
    scope.checked = true;
    scope.$eval();

    expect(scope.$element.attr('disabled')).not.toEqual(null);
    expect(scope.$element.attr('readonly')).not.toEqual(null);
    expect(scope.$element.attr('checked')).not.toEqual(null);
  });

  it('should ng-non-bindable', function(){
    var scope = compile('<div ng-non-bindable><span ng-bind="name"></span></div>');
    scope.$set('name', 'misko');
    scope.$eval();
    expect(element.text()).toEqual('');
  });

  it('should ng-repeat over array', function(){
    var scope = compile('<ul><li ng-repeat="item in items" ng-init="suffix = \';\'" ng-bind="item + suffix"></li></ul>');

    scope.$set('items', ['misko', 'shyam']);
    scope.$eval();
    expect(element.text()).toEqual('misko;shyam;');

    scope.$set('items', ['adam', 'kai', 'brad']);
    scope.$eval();
    expect(element.text()).toEqual('adam;kai;brad;');

    scope.$set('items', ['brad']);
    scope.$eval();
    expect(element.text()).toEqual('brad;');
  });

  it('should ng-repeat over object', function(){
    var scope = compile('<ul><li ng-repeat="(key, value) in items" ng-bind="key + \':\' + value + \';\' "></li></ul>');
    scope.$set('items', {misko:'swe', shyam:'set'});
    scope.$eval();
    expect(element.text()).toEqual('misko:swe;shyam:set;');
  });

  it('should set ng-repeat to [] if undefinde', function(){
    var scope = compile('<ul><li ng-repeat="item in items"></li></ul>');
    expect(scope.items).toEqual([]);
  });

  it('should error on wrong parsing of ng-repeat', function(){
    var scope = compile('<ul><li ng-repeat="i dont parse"></li></ul>');
    var log = "";
    log += element.attr('ng-exception') + ';';
    log += element.hasClass('ng-exception') + ';';
    expect(log).toEqual("\"Expected ng-repeat in form of 'item in collection' but got 'i dont parse'.\";true;");
  });

  it('should ng-watch', function(){
    var scope = compile('<div ng-watch="i: count = count + 1" ng-init="count = 0">');
    scope.$eval();
    scope.$eval();
    expect(scope.$get('count')).toEqual(0);

    scope.$set('i', 0);
    scope.$eval();
    scope.$eval();
    expect(scope.$get('count')).toEqual(1);
  });

  it('should ng-click', function(){
    var scope = compile('<div ng-click="clicked = true"></div>');
    scope.$eval();
    expect(scope.$get('clicked')).toBeFalsy();

    element.trigger('click');
    expect(scope.$get('clicked')).toEqual(true);
  });

  it('should ng-class', function(){
    var scope = compile('<div class="existing" ng-class="[\'A\', \'B\']"></div>');
    scope.$eval();
    expect(element.hasClass('existing')).toBeTruthy();
    expect(element.hasClass('A')).toBeTruthy();
    expect(element.hasClass('B')).toBeTruthy();
  });

  it('should ng-class odd/even', function(){
    var scope = compile('<ul><li ng-repeat="i in [0,1]" class="existing" ng-class-odd="\'odd\'" ng-class-even="\'even\'"></li><ul>');
    scope.$eval();
    var e1 = jqLite(element[0].childNodes[1]);
    var e2 = jqLite(element[0].childNodes[2]);
    expect(e1.hasClass('existing')).toBeTruthy();
    expect(e1.hasClass('odd')).toBeTruthy();
    expect(e2.hasClass('existing')).toBeTruthy();
    expect(e2.hasClass('even')).toBeTruthy();
  });

  it('should ng-style', function(){
    var scope = compile('<div ng-style="{color:\'red\'}"></div>');
    scope.$eval();
    expect(element.css('color')).toEqual('red');
  });

  it('should ng-show', function(){
    var scope = compile('<div ng-hide="hide"></div>');
    scope.$eval();
    expect(isCssVisible(scope.$element)).toEqual(true);
    scope.$set('hide', true);
    scope.$eval();
    expect(isCssVisible(scope.$element)).toEqual(false);
  });

  it('should ng-hide', function(){
    var scope = compile('<div ng-show="show"></div>');
    scope.$eval();
    expect(isCssVisible(scope.$element)).toEqual(false);
    scope.$set('show', true);
    scope.$eval();
    expect(isCssVisible(scope.$element)).toEqual(true);
  });

  describe('ng-controller', function(){
    it('should bind', function(){
      window.Greeter = function(){
        this.greeting = 'hello';
      };
      window.Greeter.prototype = {
        init: function(){
          this.suffix = '!';
        },
        greet: function(name) {
          return this.greeting + ' ' + name + this.suffix;
        }
      };
      var scope = compile('<div ng-controller="Greeter"></div>');
      expect(scope.greeting).toEqual('hello');
      expect(scope.greet('misko')).toEqual('hello misko!');
      window.Greeter = undefined;
    });
  });

  it('should eval things according to ng-eval-order', function(){
    var scope = compile(
          '<div ng-init="log=\'\'">' +
            '{{log = log + \'e\'}}' +
            '<span ng-eval-order="first" ng-eval="log = log + \'a\'">' +
              '{{log = log + \'b\'}}' +
              '<span src="{{log = log + \'c\'}}"></span>' +
              '<span bind-template="{{log = log + \'d\'}}"></span>' +
            '</span>' +
          '</div>');
    expect(scope.log).toEqual('abcde');
  });

});
