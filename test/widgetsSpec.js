describe("widgets", function(){

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

  it('should fail', function(){
    fail('iueoi');
  });

});
