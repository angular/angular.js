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
    if (element) element.remove();
    expect(size(jqCache)).toEqual(0);
  });

  it('should translate {{}} in text', function(){
    compile('<div>hello {{name}}!</div>');
    expect(sortedHtml(element)).toEqual('<div>hello <span ng-bind="name"></span>!</div>');
    scope.$set('name', 'Misko');
    scope.$eval();
    expect(sortedHtml(element)).toEqual('<div>hello <span ng-bind="name">Misko</span>!</div>');
  });

  it('should translate {{}} in terminal nodes', function(){
    compile('<select name="x"><option value="">Greet {{name}}!</option></select>');
    expect(sortedHtml(element)).toEqual('<select name="x"><option ng-bind-template="Greet {{name}}!">Greet !</option></select>');
    scope.$set('name', 'Misko');
    scope.$eval();
    expect(sortedHtml(element)).toEqual('<select name="x"><option ng-bind-template="Greet {{name}}!">Greet Misko!</option></select>');
  });

  it('should translate {{}} in attributes', function(){
    compile('<img src="http://server/{{path}}.png"/>');
    expect(element.attr('ng-bind-attr')).toEqual('{"src":"http://server/{{path}}.png"}');
    scope.$set('path', 'a/b');
    scope.$eval();
    expect(element.attr('src')).toEqual("http://server/a/b.png");
  });

  it('should populate value attribute on OPTION', function(){
    compile('<select name="x"><option>A</option></select>');
    expect(element.html()).toEqual('<option value="A">A</option>');
  });

  it('should process all bindings when we have leading space', function(){
    compile('<a> {{a}}<br/>{{b}}</a>');
    expect(sortedHtml(scope.$element)).toEqual('<a> <span ng-bind="a"></span><br></br><span ng-bind="b"></span></a>');
  });

});


var BindingMarkupTest = TestCase("BindingMarkupTest");

BindingMarkupTest.prototype.testParseTextWithNoBindings = function(){
  var parts = parseBindings("a");
  assertEquals(parts.length, 1);
  assertEquals(parts[0], "a");
  assertTrue(!binding(parts[0]));
};

BindingMarkupTest.prototype.testParseEmptyText = function(){
  var parts = parseBindings("");
  assertEquals(parts.length, 1);
  assertEquals(parts[0], "");
  assertTrue(!binding(parts[0]));
};

BindingMarkupTest.prototype.testParseInnerBinding = function(){
  var parts = parseBindings("a{{b}}c");
  assertEquals(parts.length, 3);
  assertEquals(parts[0], "a");
  assertTrue(!binding(parts[0]));
  assertEquals(parts[1], "{{b}}");
  assertEquals(binding(parts[1]), "b");
  assertEquals(parts[2], "c");
  assertTrue(!binding(parts[2]));
};

BindingMarkupTest.prototype.testParseEndingBinding = function(){
  var parts = parseBindings("a{{b}}");
  assertEquals(parts.length, 2);
  assertEquals(parts[0], "a");
  assertTrue(!binding(parts[0]));
  assertEquals(parts[1], "{{b}}");
  assertEquals(binding(parts[1]), "b");
};

BindingMarkupTest.prototype.testParseBeggingBinding = function(){
  var parts = parseBindings("{{b}}c");
  assertEquals(parts.length, 2);
  assertEquals(parts[0], "{{b}}");
  assertEquals(binding(parts[0]), "b");
  assertEquals(parts[1], "c");
  assertTrue(!binding(parts[1]));
};

BindingMarkupTest.prototype.testParseLoanBinding = function(){
  var parts = parseBindings("{{b}}");
  assertEquals(parts.length, 1);
  assertEquals(parts[0], "{{b}}");
  assertEquals(binding(parts[0]), "b");
};

BindingMarkupTest.prototype.testParseTwoBindings = function(){
  var parts = parseBindings("{{b}}{{c}}");
  assertEquals(parts.length, 2);
  assertEquals(parts[0], "{{b}}");
  assertEquals(binding(parts[0]), "b");
  assertEquals(parts[1], "{{c}}");
  assertEquals(binding(parts[1]), "c");
};

BindingMarkupTest.prototype.testParseTwoBindingsWithTextInMiddle = function(){
  var parts = parseBindings("{{b}}x{{c}}");
  assertEquals(parts.length, 3);
  assertEquals(parts[0], "{{b}}");
  assertEquals(binding(parts[0]), "b");
  assertEquals(parts[1], "x");
  assertTrue(!binding(parts[1]));
  assertEquals(parts[2], "{{c}}");
  assertEquals(binding(parts[2]), "c");
};

BindingMarkupTest.prototype.testParseMultiline = function(){
  var parts = parseBindings('"X\nY{{A\nB}}C\nD"');
  assertTrue(!!binding('{{A\nB}}'));
  assertEquals(parts.length, 3);
  assertEquals(parts[0], '"X\nY');
  assertEquals(parts[1], '{{A\nB}}');
  assertEquals(parts[2], 'C\nD"');
};

BindingMarkupTest.prototype.testHasBinding = function(){
  assertTrue(hasBindings("{{a}}"));
  assertTrue(!hasBindings("a"));
  assertTrue(hasBindings("{{b}}x{{c}}"));
};
