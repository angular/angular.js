'use strict';

describe("markups", function() {

  it('should translate {{}} in text', inject(function($rootScope, $compile) {
    var element = $compile('<div>hello {{name}}!</div>')($rootScope)
    expect(sortedHtml(element)).toEqual('<div>hello <span ng:bind="name"></span>!</div>');
    $rootScope.name = 'Misko';
    $rootScope.$digest();
    expect(sortedHtml(element)).toEqual('<div>hello <span ng:bind="name">Misko</span>!</div>');
  }));

  it('should translate {{}} in terminal nodes', inject(function($rootScope, $compile) {
    var element = $compile('<select ng:model="x"><option value="">Greet {{name}}!</option></select>')($rootScope)
    $rootScope.$digest();
    expect(sortedHtml(element).replace(' selected="true"', '')).
      toEqual('<select ng:model="x">' +
                '<option ng:bind-template="Greet {{name}}!">Greet !</option>' +
              '</select>');
    $rootScope.name = 'Misko';
    $rootScope.$digest();
    expect(sortedHtml(element).replace(' selected="true"', '')).
      toEqual('<select ng:model="x">' +
                '<option ng:bind-template="Greet {{name}}!">Greet Misko!</option>' +
              '</select>');
  }));

  it('should translate {{}} in attributes', inject(function($rootScope, $compile) {
    var element = $compile('<div src="http://server/{{path}}.png"/>')($rootScope)
    expect(element.attr('ng:bind-attr')).toEqual('{"src":"http://server/{{path}}.png"}');
    $rootScope.path = 'a/b';
    $rootScope.$digest();
    expect(element.attr('src')).toEqual("http://server/a/b.png");
  }));

  describe('OPTION value', function() {
    beforeEach(function() {
      this.addMatchers({
        toHaveValue: function(expected){
          this.message = function() {
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


    it('should populate value attribute on OPTION', inject(function($rootScope, $compile) {
      var element = $compile('<select ng:model="x"><option>abc</option></select>')($rootScope)
      expect(element).toHaveValue('abc');
    }));

    it('should ignore value if already exists', inject(function($rootScope, $compile) {
      var element = $compile('<select ng:model="x"><option value="abc">xyz</option></select>')($rootScope)
      expect(element).toHaveValue('abc');
    }));

    it('should set value even if newlines present', inject(function($rootScope, $compile) {
      var element = $compile('<select ng:model="x"><option attr="\ntext\n" \n>\nabc\n</option></select>')($rootScope)
      expect(element).toHaveValue('\nabc\n');
    }));

    it('should set value even if self closing HTML', inject(function($rootScope, $compile) {
      // IE removes the \n from option, which makes this test pointless
      if (msie) return;
      var element = $compile('<select ng:model="x"><option>\n</option></select>')($rootScope)
      expect(element).toHaveValue('\n');
    }));

  });

  it('should bind href', inject(function($rootScope, $compile) {
    var element = $compile('<a ng:href="{{url}}"></a>')($rootScope)
    expect(sortedHtml(element)).toEqual('<a ng:bind-attr="{"href":"{{url}}"}"></a>');
  }));

  it('should bind disabled', inject(function($rootScope, $compile) {
    var element = $compile('<button ng:disabled="{{isDisabled}}">Button</button>')($rootScope)
    $rootScope.isDisabled = false;
    $rootScope.$digest();
    expect(element.attr('disabled')).toBeFalsy();
    $rootScope.isDisabled = true;
    $rootScope.$digest();
    expect(element.attr('disabled')).toBeTruthy();
  }));

  it('should bind checked', inject(function($rootScope, $compile) {
    var element = $compile('<input type="checkbox" ng:checked="{{isChecked}}" />')($rootScope)
    $rootScope.isChecked = false;
    $rootScope.$digest();
    expect(element.attr('checked')).toBeFalsy();
    $rootScope.isChecked=true;
    $rootScope.$digest();
    expect(element.attr('checked')).toBeTruthy();
  }));

  it('should bind selected', inject(function($rootScope, $compile) {
    var element = $compile('<select><option value=""></option><option ng:selected="{{isSelected}}">Greetings!</option></select>')($rootScope)
    jqLite(document.body).append(element)
    $rootScope.isSelected=false;
    $rootScope.$digest();
    expect(element.children()[1].selected).toBeFalsy();
    $rootScope.isSelected=true;
    $rootScope.$digest();
    expect(element.children()[1].selected).toBeTruthy();
  }));

  it('should bind readonly', inject(function($rootScope, $compile) {
    var element = $compile('<input type="text" ng:readonly="{{isReadonly}}" />')($rootScope)
    $rootScope.isReadonly=false;
    $rootScope.$digest();
    expect(element.attr('readOnly')).toBeFalsy();
    $rootScope.isReadonly=true;
    $rootScope.$digest();
    expect(element.attr('readOnly')).toBeTruthy();
  }));

  it('should bind multiple', inject(function($rootScope, $compile) {
    var element = $compile('<select ng:multiple="{{isMultiple}}"></select>')($rootScope)
    $rootScope.isMultiple=false;
    $rootScope.$digest();
    expect(element.attr('multiple')).toBeFalsy();
    $rootScope.isMultiple='multiple';
    $rootScope.$digest();
    expect(element.attr('multiple')).toBeTruthy();
  }));

  it('should bind src', inject(function($rootScope, $compile) {
    var element = $compile('<div ng:src="{{url}}" />')($rootScope)
    $rootScope.url = 'http://localhost/';
    $rootScope.$digest();
    expect(element.attr('src')).toEqual('http://localhost/');
  }));

  it('should bind href and merge with other attrs', inject(function($rootScope, $compile) {
    var element = $compile('<a ng:href="{{url}}" rel="{{rel}}"></a>')($rootScope)
    expect(sortedHtml(element)).toEqual('<a ng:bind-attr="{"href":"{{url}}","rel":"{{rel}}"}"></a>');
  }));

  it('should bind Text with no Bindings', inject(function($compile) {
    var $rootScope;
    function newScope (){
      return $rootScope = angular.injector()('$rootScope');
    }
    forEach(['checked', 'disabled', 'multiple', 'readonly', 'selected'], function(name) {
      var element = $compile('<div ng:' + name + '="some"></div>')(newScope())
      expect(element.attr('ng:bind-attr')).toBe('{"' + name +'":"some"}');
      $rootScope.$digest();
      expect(element.attr(name)).toBe(name);
      dealoc(element);
    });

    var element = $compile('<div ng:src="some"></div>')(newScope())
    $rootScope.$digest();
    expect(sortedHtml(element)).toEqual('<div ng:bind-attr="{"src":"some"}" src="some"></div>');
    dealoc(element);

    var element = $compile('<div ng:href="some"></div>')(newScope())
    $rootScope.$digest();
    expect(sortedHtml(element)).toEqual('<div href="some" ng:bind-attr="{"href":"some"}"></div>');
    dealoc(element);
  }));

  it('should Parse Text With No Bindings', inject(function($rootScope, $compile) {
    var parts = parseBindings("a");
    assertEquals(parts.length, 1);
    assertEquals(parts[0], "a");
    assertTrue(!binding(parts[0]));
  }));

  it('should Parse Empty Text', inject(function($rootScope, $compile) {
    var parts = parseBindings("");
    assertEquals(parts.length, 1);
    assertEquals(parts[0], "");
    assertTrue(!binding(parts[0]));
  }));

  it('should Parse Inner Binding', inject(function($rootScope, $compile) {
    var parts = parseBindings("a{{b}}C");
    assertEquals(parts.length, 3);
    assertEquals(parts[0], "a");
    assertTrue(!binding(parts[0]));
    assertEquals(parts[1], "{{b}}");
    assertEquals(binding(parts[1]), "b");
    assertEquals(parts[2], "C");
    assertTrue(!binding(parts[2]));
  }));

  it('should Parse Ending Binding', inject(function($rootScope, $compile) {
    var parts = parseBindings("a{{b}}");
    assertEquals(parts.length, 2);
    assertEquals(parts[0], "a");
    assertTrue(!binding(parts[0]));
    assertEquals(parts[1], "{{b}}");
    assertEquals(binding(parts[1]), "b");
  }));

  it('should Parse Begging Binding', inject(function($rootScope, $compile) {
    var parts = parseBindings("{{b}}c");
    assertEquals(parts.length, 2);
    assertEquals(parts[0], "{{b}}");
    assertEquals(binding(parts[0]), "b");
    assertEquals(parts[1], "c");
    assertTrue(!binding(parts[1]));
  }));

  it('should Parse Loan Binding', inject(function($rootScope, $compile) {
    var parts = parseBindings("{{b}}");
    assertEquals(parts.length, 1);
    assertEquals(parts[0], "{{b}}");
    assertEquals(binding(parts[0]), "b");
  }));

  it('should Parse Two Bindings', inject(function($rootScope, $compile) {
    var parts = parseBindings("{{b}}{{c}}");
    assertEquals(parts.length, 2);
    assertEquals(parts[0], "{{b}}");
    assertEquals(binding(parts[0]), "b");
    assertEquals(parts[1], "{{c}}");
    assertEquals(binding(parts[1]), "c");
  }));

  it('should Parse Two Bindings With Text In Middle', inject(function($rootScope, $compile) {
    var parts = parseBindings("{{b}}x{{c}}");
    assertEquals(parts.length, 3);
    assertEquals(parts[0], "{{b}}");
    assertEquals(binding(parts[0]), "b");
    assertEquals(parts[1], "x");
    assertTrue(!binding(parts[1]));
    assertEquals(parts[2], "{{c}}");
    assertEquals(binding(parts[2]), "c");
  }));

  it('should Parse Multiline', inject(function($rootScope, $compile) {
    var parts = parseBindings('"X\nY{{A\nB}}C\nD"');
    assertTrue(!!binding('{{A\nB}}'));
    assertEquals(parts.length, 3);
    assertEquals(parts[0], '"X\nY');
    assertEquals(parts[1], '{{A\nB}}');
    assertEquals(parts[2], 'C\nD"');
  }));

  it('should Has Binding', inject(function($rootScope, $compile) {
    assertTrue(hasBindings(parseBindings("{{a}}")));
    assertTrue(!hasBindings(parseBindings("a")));
    assertTrue(hasBindings(parseBindings("{{b}}x{{c}}")));
  }));

});

