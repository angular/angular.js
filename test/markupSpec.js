describe("markups", function(){

  var compile, element, scope;

  beforeEach(function() {
    scope = null;
    element = null;
    var compiler = new Compiler(angularTextMarkup, angularAttrMarkup, angularDirective, angularWidget);
    compile = function(html) {
      element = jqLite(html);
      var view = compiler.compile(element)(element);
      view.init();
      scope = view.scope;
    };
  });

  afterEach(function(){
    if (element) {
      element.remove();
    }
    expect(_(jqCache).size()).toEqual(0);
  });

  it('should translate {{}} in text', function(){
    compile('<div>hello {{name}}!</div>');
    expect(element.html()).toEqual('hello <span ng-bind="name"></span>!');
    scope.set('name', 'Misko');
    scope.updateView();
    expect(element.html()).toEqual('hello <span ng-bind="name">Misko</span>!');
  });

  it('should translate {{}} in terminal nodes', function(){
    compile('<select><option>Greet {{name}}!</option></select>');
    expect(element.html()).toEqual('<option ng-bind-template="Greet {{name}}!"></option>');
    scope.set('name', 'Misko');
    scope.updateView();
    expect(element.html()).toEqual('<option ng-bind-template="Greet {{name}}!">Greet Misko!</option>');
  });

  it('should translate {{}} in attributes', function(){
    compile('<img src="http://server/{{path}}.png"/>');
    expect(element.attr('src')).toEqual();
    expect(element.attr('ng-bind-attr')).toEqual('{"src":"http://server/{{path}}.png"}');
    scope.set('path', 'a/b');
    scope.updateView();
    expect(element.attr('src')).toEqual("http://server/a/b.png");
  });

});
