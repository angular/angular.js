describe("directives", function(){

  var compile, element;

  beforeEach(function() {
    var compiler = new Compiler(angularTextMarkup, angularAttrMarkup, angularDirective, angularWidget);
    compile = function(html) {
      element = jqLite(html);
      var view = compiler.compile(element)(element);
      view.init();
      return view.scope;
    };
  });

  afterEach(function() {
    element.remove();
    expect(_(jqCache).size()).toEqual(0);
  });

  it("should ng-init", function() {
    var scope = compile('<div ng-init="a=123"></div>');
    expect(scope.get('a')).toEqual(123);
  });

  it("should ng-eval", function() {
    var scope = compile('<div ng-init="a=0" ng-eval="a = a + 1"></div>');
    expect(scope.get('a')).toEqual(0);
    scope.updateView();
    expect(scope.get('a')).toEqual(1);
    scope.updateView();
    expect(scope.get('a')).toEqual(2);
  });

  it('should ng-bind', function() {
    var scope = compile('<div ng-bind="a"></div>');
    expect(element.text()).toEqual('');
    scope.set('a', 'misko');
    scope.updateView();
    expect(element.text()).toEqual('misko');
  });

  it('should ng-bind-template', function() {
    var scope = compile('<div ng-bind-template="Hello {{name}}!"></div>');
    expect(element.text()).toEqual('');
    scope.set('name', 'Misko');
    scope.updateView();
    expect(element.text()).toEqual('Hello Misko!');
  });

  it('should ng-bind-attr', function(){
    var scope = compile('<img ng-bind-attr="{src:\'mysrc\', alt:\'myalt\'}"/>');
    expect(element.attr('src')).toEqual(null);
    expect(element.attr('alt')).toEqual(null);
    scope.updateView();
    expect(element.attr('src')).toEqual('mysrc');
    expect(element.attr('alt')).toEqual('myalt');
  });

  it('should ng-non-bindable', function(){
    var scope = compile('<div ng-non-bindable><span ng-bind="name"></span></div>');
    scope.set('name', 'misko');
    scope.updateView();
    expect(element.text()).toEqual('');
  });

  it('should ng-repeat over array', function(){
    var scope = compile('<ul><li ng-repeat="item in items" ng-init="suffix = \';\'" ng-bind="item + suffix"></li></ul>');

    scope.set('items', ['misko', 'shyam']);
    scope.updateView();
    expect(element.text()).toEqual('misko;shyam;');

    scope.set('items', ['adam', 'kai', 'brad']);
    scope.updateView();
    expect(element.text()).toEqual('adam;kai;brad;');

    scope.set('items', ['brad']);
    scope.updateView();
    expect(element.text()).toEqual('brad;');
  });

  it('should ng-repeat over object', function(){
    var scope = compile('<ul><li ng-repeat="(key, value) in items" ng-bind="key + \':\' + value + \';\' "></li></ul>');
    scope.set('items', {misko:'swe', shyam:'set'});
    scope.updateView();
    expect(element.text()).toEqual('misko:swe;shyam:set;');
  });

  it('should error on wrong parsing of ng-repeat', function(){
    var scope = compile('<ul><li ng-repeat="i dont parse"></li></ul>');
    var log = "";
    eachNode(element, function(li){
      log += li.attr('ng-error') + ';';
      log += li.hasClass('ng-exception') + ';';
    });
    expect(log).toEqual("\"Expected ng-repeat in form of 'item in collection' but got 'i dont parse'.\";true;");
  });

  it('should ng-watch', function(){
    var scope = compile('<div ng-watch="i: count = count + 1" ng-init="count = 0">');
    scope.updateView();
    scope.updateView();
    expect(scope.get('count')).toEqual(0);

    scope.set('i', 0);
    scope.updateView();
    scope.updateView();
    expect(scope.get('count')).toEqual(1);
  });

  it('should ng-action', function(){
    var scope = compile('<div ng-action="clicked = true"></div>');
    scope.updateView();
    expect(scope.get('clicked')).toBeFalsy();

    element.click();
    expect(scope.get('clicked')).toEqual(true);
  });

  it('should ng-class', function(){
    var scope = compile('<div class="existing" ng-class="[\'A\', \'B\']"></div>');
    scope.updateView();
    expect(element.hasClass('existing')).toBeTruthy();
    expect(element.hasClass('A')).toBeTruthy();
    expect(element.hasClass('B')).toBeTruthy();
  });

  it('should ng-class odd/even', function(){
    var scope = compile('<ul><li ng-repeat="i in [0,1]" class="existing" ng-class-odd="\'odd\'" ng-class-even="\'even\'"></li><ul>');
    scope.updateView();
    var e1 = jQuery(element.parent()[0]).find('li:first');
    var e2 = jQuery(element.parent()[0]).find('li:last');
    expect(e1.hasClass('existing')).toBeTruthy();
    expect(e1.hasClass('even')).toBeTruthy();
    expect(e2.hasClass('existing')).toBeTruthy();
    expect(e2.hasClass('odd')).toBeTruthy();
  });

  it('should ng-style', function(){
    var scope = compile('<div ng-style="{color:\'red\'}"></div>');
    scope.updateView();
    expect(element.css('color')).toEqual('red');
  });

  it('should ng-show', function(){
    var scope = compile('<div ng-hide="hide"></div>');
    scope.updateView();
    expect(element.css('display')).toEqual('');
    scope.set('hide', true);
    scope.updateView();
    expect(element.css('display')).toEqual('none');
  });

  it('should ng-hide', function(){
    var scope = compile('<div ng-show="show"></div>');
    scope.updateView();
    expect(element.css('display')).toEqual('none');
    scope.set('show', true);
    scope.updateView();
    expect(element.css('display')).toEqual('');
  });
});
