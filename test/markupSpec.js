'use strict';

describe("markups", function(){

  var compile, element, scope;

  beforeEach(function() {
    scope = null;
    element = null;
    compile = function(html) {
      element = jqLite(html);
      scope = angular.compile(element)();
    };
  });

  afterEach(function(){
    dealoc(element);
  });

  it('should translate {{}} in text', function(){
    compile('<div>hello {{name}}!</div>');
    expect(sortedHtml(element)).toEqual('<div>hello <span ng:bind="name"></span>!</div>');
    scope.name = 'Misko';
    scope.$digest();
    expect(sortedHtml(element)).toEqual('<div>hello <span ng:bind="name">Misko</span>!</div>');
  });

  it('should translate {{}} in terminal nodes', function(){
    compile('<select name="x"><option value="">Greet {{name}}!</option></select>');
    scope.$digest();
    expect(sortedHtml(element).replace(' selected="true"', '')).toEqual('<select name="x"><option ng:bind-template="Greet {{name}}!">Greet !</option></select>');
    scope.name = 'Misko';
    scope.$digest();
    expect(sortedHtml(element).replace(' selected="true"', '')).toEqual('<select name="x"><option ng:bind-template="Greet {{name}}!">Greet Misko!</option></select>');
  });

  it('should translate {{}} in attributes', function(){
    compile('<div src="http://server/{{path}}.png"/>');
    expect(element.attr('ng:bind-attr')).toEqual('{"src":"http://server/{{path}}.png"}');
    scope.path = 'a/b';
    scope.$digest();
    expect(element.attr('src')).toEqual("http://server/a/b.png");
  });

  describe('OPTION value', function(){
    beforeEach(function(){
      this.addMatchers({
        toHaveValue: function(expected){
          this.message = function(){
            return 'Expected "' + this.actual.html() + '" to have value="' + expected + '".';
          };

          var value;
          htmlParser(this.actual.html(), {
            start:function(tag, attrs){
              value = attrs.value;
            },
            end:noop,
            chars:noop
          });
          return trim(value) == trim(expected);
        }
      });
    });

    afterEach(function() {
      if (element) element.remove();
    });


    it('should populate value attribute on OPTION', function(){
      compile('<select name="x"><option>abc</option></select>');
      expect(element).toHaveValue('abc');
    });

    it('should ignore value if already exists', function(){
      compile('<select name="x"><option value="abc">xyz</option></select>');
      expect(element).toHaveValue('abc');
    });

    it('should set value even if newlines present', function(){
      compile('<select name="x"><option attr="\ntext\n" \n>\nabc\n</option></select>');
      expect(element).toHaveValue('\nabc\n');
    });

    it('should set value even if self closing HTML', function(){
      // IE removes the \n from option, which makes this test pointless
      if (msie) return;
      compile('<select name="x"><option>\n</option></select>');
      expect(element).toHaveValue('\n');
    });

  });

  it('should bind href', function() {
    compile('<a ng:href="{{url}}"></a>');
    expect(sortedHtml(element)).toEqual('<a ng:bind-attr="{"href":"{{url}}"}"></a>');
  });

  it('should bind disabled', function() {
    compile('<button ng:disabled="{{isDisabled}}">Button</button>');
    scope.isDisabled = false;
    scope.$digest();
    expect(element.attr('disabled')).toBeFalsy();
    scope.isDisabled = true;
    scope.$digest();
    expect(element.attr('disabled')).toBeTruthy();
  });

  it('should bind checked', function() {
    compile('<input type="checkbox" ng:checked="{{isChecked}}" />');
    scope.isChecked = false;
    scope.$digest();
    expect(element.attr('checked')).toBeFalsy();
    scope.isChecked=true;
    scope.$digest();
    expect(element.attr('checked')).toBeTruthy();
  });

  it('should bind selected', function() {
    compile('<select><option value=""></option><option ng:selected="{{isSelected}}">Greetings!</option></select>');
    jqLite(document.body).append(element)
    scope.isSelected=false;
    scope.$digest();
    expect(element.children()[1].selected).toBeFalsy();
    scope.isSelected=true;
    scope.$digest();
    expect(element.children()[1].selected).toBeTruthy();
  });

  it('should bind readonly', function() {
    compile('<input type="text" ng:readonly="{{isReadonly}}" />');
    scope.isReadonly=false;
    scope.$digest();
    expect(element.attr('readOnly')).toBeFalsy();
    scope.isReadonly=true;
    scope.$digest();
    expect(element.attr('readOnly')).toBeTruthy();
  });

  it('should bind multiple', function() {
    compile('<select ng:multiple="{{isMultiple}}"></select>');
    scope.isMultiple=false;
    scope.$digest();
    expect(element.attr('multiple')).toBeFalsy();
    scope.isMultiple='multiple';
    scope.$digest();
    expect(element.attr('multiple')).toBeTruthy();
  });

  it('should bind src', function() {
    compile('<div ng:src="{{url}}" />');
    scope.url = 'http://localhost/';
    scope.$digest();
    expect(element.attr('src')).toEqual('http://localhost/');
  });

  it('should bind href and merge with other attrs', function() {
    compile('<a ng:href="{{url}}" rel="{{rel}}"></a>');
    expect(sortedHtml(element)).toEqual('<a ng:bind-attr="{"href":"{{url}}","rel":"{{rel}}"}"></a>');
  });

  it('should bind Text with no Bindings', function() {
    forEach('src,href,checked,disabled,multiple,readonly,selected'.split(','), function(name) {
      compile('<div ng:' + name +'="some"></div>');
      expect(sortedHtml(element)).toEqual('<div ng:bind-attr="{"' + name +'":"some"}"></div>');
      dealoc(element);
    });
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

