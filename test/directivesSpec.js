describe("directives", function(){

  var compile, element;

  beforeEach(function() {
    var compiler = new Compiler(angularMarkup, angularDirective, angularWidget);
    compile = function(html) {
      element = jqLite(html);
      var view = compiler.compile(element.element)(element.element);
      view.init();
      return view.scope;
    };
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

  it('should ng-repeat over object', function(){});
  it('should error on wrong parsing of ng-repeat', function(){});
});
