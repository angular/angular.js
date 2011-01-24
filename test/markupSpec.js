describe("markups", function(){

  var compile, element, scope;

  beforeEach(function() {
    scope = null;
    element = null;
    var compiler = new Compiler(angularTextMarkup, angularAttrMarkup, angularDirective, angularWidget);
    compile = function(html) {
      element = jqLite(html);
      scope = compiler.compile(element)(element);
      scope.$init();
    };
  });

  afterEach(function(){
    dealoc(element);
  });

  it('should translate {{}} in text', function(){
    compile('<div>hello {{name}}!</div>');
    expect(sortedHtml(element)).toEqual('<div>hello <span ng:bind="name"></span>!</div>');
    scope.$set('name', 'Misko');
    scope.$eval();
    expect(sortedHtml(element)).toEqual('<div>hello <span ng:bind="name">Misko</span>!</div>');
  });

  it('should translate {{}} in terminal nodes', function(){
    compile('<select name="x"><option value="">Greet {{name}}!</option></select>');
    expect(sortedHtml(element).replace(' selected="true"', '')).toEqual('<select name="x"><option ng:bind-template="Greet {{name}}!">Greet !</option></select>');
    scope.$set('name', 'Misko');
    scope.$eval();
    expect(sortedHtml(element).replace(' selected="true"', '')).toEqual('<select name="x"><option ng:bind-template="Greet {{name}}!">Greet Misko!</option></select>');
  });

  it('should translate {{}} in attributes', function(){
    compile('<img src="http://server/{{path}}.png"/>');
    expect(element.attr('ng:bind-attr')).toEqual('{"src":"http://server/{{path}}.png"}');
    scope.$set('path', 'a/b');
    scope.$eval();
    expect(element.attr('src')).toEqual("http://server/a/b.png");
  });

  it('should populate value attribute on OPTION', function(){
    compile('<select name="x"><option>a</option></select>');
    expect(sortedHtml(element).replace(' selected="true"', '')).toEqual('<select name="x"><option value="a">a</option></select>');
  });

  it('should bind href', function() {
    compile('<a ng:href="{{url}}"></a>');
    expect(sortedHtml(element)).toEqual('<a ng:bind-attr="{"href":"{{url}}"}"></a>');
  });

  it('should bind src', function() {
    compile('<img ng:src="{{url}}" />');
    scope.url = 'http://localhost/';
    scope.$eval();
    expect(sortedHtml(element)).toEqual('<img ng:bind-attr="{"src":"{{url}}"}" src="http://localhost/"></img>');
  });

  it('should bind href and merge with other attrs', function() {
    compile('<a ng:href="{{url}}" rel="{{rel}}"></a>');
    expect(sortedHtml(element)).toEqual('<a ng:bind-attr="{"href":"{{url}}","rel":"{{rel}}"}"></a>');
  });

  it('should Parse Text With No Bindings', function(){
    var parts = parseBindings("a");
    assertEquals(parts.length, 1);
    assertEquals(parts[0], "a");
    assertTrue(!binding(parts[0]));
  });

  it('should Parse Empty Text', function(){
    var parts = parseBindings("");
    assertEquals(parts.length, 1);
    assertEquals(parts[0], "");
    assertTrue(!binding(parts[0]));
  });

  it('should Parse Inner Binding', function(){
    var parts = parseBindings("a{{b}}C");
    assertEquals(parts.length, 3);
    assertEquals(parts[0], "a");
    assertTrue(!binding(parts[0]));
    assertEquals(parts[1], "{{b}}");
    assertEquals(binding(parts[1]), "b");
    assertEquals(parts[2], "C");
    assertTrue(!binding(parts[2]));
  });

  it('should Parse Ending Binding', function(){
    var parts = parseBindings("a{{b}}");
    assertEquals(parts.length, 2);
    assertEquals(parts[0], "a");
    assertTrue(!binding(parts[0]));
    assertEquals(parts[1], "{{b}}");
    assertEquals(binding(parts[1]), "b");
  });

  it('should Parse Begging Binding', function(){
    var parts = parseBindings("{{b}}c");
    assertEquals(parts.length, 2);
    assertEquals(parts[0], "{{b}}");
    assertEquals(binding(parts[0]), "b");
    assertEquals(parts[1], "c");
    assertTrue(!binding(parts[1]));
  });

  it('should Parse Loan Binding', function(){
    var parts = parseBindings("{{b}}");
    assertEquals(parts.length, 1);
    assertEquals(parts[0], "{{b}}");
    assertEquals(binding(parts[0]), "b");
  });

  it('should Parse Two Bindings', function(){
    var parts = parseBindings("{{b}}{{c}}");
    assertEquals(parts.length, 2);
    assertEquals(parts[0], "{{b}}");
    assertEquals(binding(parts[0]), "b");
    assertEquals(parts[1], "{{c}}");
    assertEquals(binding(parts[1]), "c");
  });

  it('should Parse Two Bindings With Text In Middle', function(){
    var parts = parseBindings("{{b}}x{{c}}");
    assertEquals(parts.length, 3);
    assertEquals(parts[0], "{{b}}");
    assertEquals(binding(parts[0]), "b");
    assertEquals(parts[1], "x");
    assertTrue(!binding(parts[1]));
    assertEquals(parts[2], "{{c}}");
    assertEquals(binding(parts[2]), "c");
  });

  it('should Parse Multiline', function(){
    var parts = parseBindings('"X\nY{{A\nB}}C\nD"');
    assertTrue(!!binding('{{A\nB}}'));
    assertEquals(parts.length, 3);
    assertEquals(parts[0], '"X\nY');
    assertEquals(parts[1], '{{A\nB}}');
    assertEquals(parts[2], 'C\nD"');
  });

  it('should Has Binding', function(){
    assertTrue(hasBindings(parseBindings("{{a}}")));
    assertTrue(!hasBindings(parseBindings("a")));
    assertTrue(hasBindings(parseBindings("{{b}}x{{c}}")));
  });

});

