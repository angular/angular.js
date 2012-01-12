'use strict';

describe("directive", function() {

  var $filterProvider;

  beforeEach(module(['$filterProvider', function(provider){
    $filterProvider = provider;
  }]));

  it("should ng:init", inject(function($rootScope, $compile) {
    var element = $compile('<div ng:init="a=123"></div>')($rootScope);
    expect($rootScope.a).toEqual(123);
  }));

  describe('ng:bind', function() {
    it('should set text', inject(function($rootScope, $compile) {
      var element = $compile('<div ng:bind="a"></div>')($rootScope);
      expect(element.text()).toEqual('');
      $rootScope.a = 'misko';
      $rootScope.$digest();
      expect(element.hasClass('ng-binding')).toEqual(true);
      expect(element.text()).toEqual('misko');
    }));

    it('should set text to blank if undefined', inject(function($rootScope, $compile) {
      var element = $compile('<div ng:bind="a"></div>')($rootScope);
      $rootScope.a = 'misko';
      $rootScope.$digest();
      expect(element.text()).toEqual('misko');
      $rootScope.a = undefined;
      $rootScope.$digest();
      expect(element.text()).toEqual('');
    }));

    it('should set html', inject(function($rootScope, $compile) {
      var element = $compile('<div ng:bind="html|html"></div>')($rootScope);
      $rootScope.html = '<div unknown>hello</div>';
      $rootScope.$digest();
      expect(lowercase(element.html())).toEqual('<div>hello</div>');
    }));

    it('should set unsafe html', inject(function($rootScope, $compile) {
      var element = $compile('<div ng:bind="html|html:\'unsafe\'"></div>')($rootScope);
      $rootScope.html = '<div onclick="">hello</div>';
      $rootScope.$digest();
      expect(lowercase(element.html())).toEqual('<div onclick="">hello</div>');
    }));

    it('should set element element', inject(function($rootScope, $compile) {
      $filterProvider.register('myElement', valueFn(function() {
        return jqLite('<a>hello</a>');
      }));
      var element = $compile('<div ng:bind="0|myElement"></div>')($rootScope);
      $rootScope.$digest();
      expect(lowercase(element.html())).toEqual('<a>hello</a>');
    }));


    it('should suppress rendering of falsy values', inject(function($rootScope, $compile) {
      var element = $compile('<div>{{ null }}{{ undefined }}{{ "" }}-{{ 0 }}{{ false }}</div>')($rootScope);
      $rootScope.$digest();
      expect(element.text()).toEqual('-0false');
    }));

    it('should render object as JSON ignore $$', inject(function($rootScope, $compile) {
      var element = $compile('<div>{{ {key:"value", $$key:"hide"}  }}</div>')($rootScope);
      $rootScope.$digest();
      expect(fromJson(element.text())).toEqual({key:'value'});
    }));
  });

  describe('ng:bind-template', function() {
    it('should ng:bind-template', inject(function($rootScope, $compile) {
      var element = $compile('<div ng:bind-template="Hello {{name}}!"></div>')($rootScope);
      $rootScope.name = 'Misko';
      $rootScope.$digest();
      expect(element.hasClass('ng-binding')).toEqual(true);
      expect(element.text()).toEqual('Hello Misko!');
    }));

    it('should have $element set to current bind element', inject(function($rootScope, $compile) {
      var innerText;
      $filterProvider.register('myFilter', valueFn(function(text) {
        innerText = innerText || this.$element.text();
        return text;
      }));
      var element = $compile('<div>before<span ng:bind-template="{{\'HELLO\'|myFilter}}">INNER</span>after</div>')($rootScope);
      $rootScope.$digest();
      expect(element.text()).toEqual("beforeHELLOafter");
      expect(innerText).toEqual('INNER');
    }));

    it('should render object as JSON ignore $$', inject(function($rootScope, $compile) {
      var element = $compile('<pre>{{ {key:"value", $$key:"hide"}  }}</pre>')($rootScope);
      $rootScope.$digest();
      expect(fromJson(element.text())).toEqual({key:'value'});
    }));

  });

  describe('ng:bind-attr', function() {
    it('should bind attributes', inject(function($rootScope, $compile) {
      var element = $compile('<div ng:bind-attr="{src:\'http://localhost/mysrc\', alt:\'myalt\'}"/>')($rootScope);
      $rootScope.$digest();
      expect(element.attr('src')).toEqual('http://localhost/mysrc');
      expect(element.attr('alt')).toEqual('myalt');
    }));

    it('should not pretty print JSON in attributes', inject(function($rootScope, $compile) {
      var element = $compile('<img alt="{{ {a:1} }}"/>')($rootScope);
      $rootScope.$digest();
      expect(element.attr('alt')).toEqual('{"a":1}');
    }));
  });

  it('should remove special attributes on false', inject(function($rootScope, $compile) {
    var element = $compile('<input ng:bind-attr="{disabled:\'{{disabled}}\', readonly:\'{{readonly}}\', checked:\'{{checked}}\'}"/>')($rootScope);
    var input = element[0];
    expect(input.disabled).toEqual(false);
    expect(input.readOnly).toEqual(false);
    expect(input.checked).toEqual(false);

    $rootScope.disabled = true;
    $rootScope.readonly = true;
    $rootScope.checked = true;
    $rootScope.$digest();

    expect(input.disabled).toEqual(true);
    expect(input.readOnly).toEqual(true);
    expect(input.checked).toEqual(true);
  }));

  describe('ng:click', function() {
    it('should get called on a click', inject(function($rootScope, $compile) {
      var element = $compile('<div ng:click="clicked = true"></div>')($rootScope);
      $rootScope.$digest();
      expect($rootScope.clicked).toBeFalsy();

      browserTrigger(element, 'click');
      expect($rootScope.clicked).toEqual(true);
    }));

    it('should stop event propagation', inject(function($rootScope, $compile) {
      var element = $compile('<div ng:click="outer = true"><div ng:click="inner = true"></div></div>')($rootScope);
      $rootScope.$digest();
      expect($rootScope.outer).not.toBeDefined();
      expect($rootScope.inner).not.toBeDefined();

      var innerDiv = element.children()[0];

      browserTrigger(innerDiv, 'click');
      expect($rootScope.outer).not.toBeDefined();
      expect($rootScope.inner).toEqual(true);
    }));
  });


  describe('ng:submit', function() {
    it('should get called on form submit', inject(function($rootScope, $compile) {
      var element = $compile('<form action="" ng:submit="submitted = true">' +
        '<input type="submit"/>' +
        '</form>')($rootScope);
      $rootScope.$digest();
      expect($rootScope.submitted).not.toBeDefined();

      browserTrigger(element.children()[0]);
      expect($rootScope.submitted).toEqual(true);
    }));
  });

  describe('ng:class', function() {
    it('should add new and remove old classes dynamically', inject(function($rootScope, $compile) {
      var element = $compile('<div class="existing" ng:class="dynClass"></div>')($rootScope);
      $rootScope.dynClass = 'A';
      $rootScope.$digest();
      expect(element.hasClass('existing')).toBe(true);
      expect(element.hasClass('A')).toBe(true);

      $rootScope.dynClass = 'B';
      $rootScope.$digest();
      expect(element.hasClass('existing')).toBe(true);
      expect(element.hasClass('A')).toBe(false);
      expect(element.hasClass('B')).toBe(true);

      delete $rootScope.dynClass;
      $rootScope.$digest();
      expect(element.hasClass('existing')).toBe(true);
      expect(element.hasClass('A')).toBe(false);
      expect(element.hasClass('B')).toBe(false);
    }));


    it('should support adding multiple classes via an array', inject(function($rootScope, $compile) {
      var element = $compile('<div class="existing" ng:class="[\'A\', \'B\']"></div>')($rootScope);
      $rootScope.$digest();
      expect(element.hasClass('existing')).toBeTruthy();
      expect(element.hasClass('A')).toBeTruthy();
      expect(element.hasClass('B')).toBeTruthy();
    }));


    it('should support adding multiple classes via a space delimited string', inject(function($rootScope, $compile) {
      var element = $compile('<div class="existing" ng:class="\'A B\'"></div>')($rootScope);
      $rootScope.$digest();
      expect(element.hasClass('existing')).toBeTruthy();
      expect(element.hasClass('A')).toBeTruthy();
      expect(element.hasClass('B')).toBeTruthy();
    }));


    it('should preserve class added post compilation with pre-existing classes', inject(function($rootScope, $compile) {
      var element = $compile('<div class="existing" ng:class="dynClass"></div>')($rootScope);
      $rootScope.dynClass = 'A';
      $rootScope.$digest();
      expect(element.hasClass('existing')).toBe(true);

      // add extra class, change model and eval
      element.addClass('newClass');
      $rootScope.dynClass = 'B';
      $rootScope.$digest();

      expect(element.hasClass('existing')).toBe(true);
      expect(element.hasClass('B')).toBe(true);
      expect(element.hasClass('newClass')).toBe(true);
    }));


    it('should preserve class added post compilation without pre-existing classes"', inject(function($rootScope, $compile) {
      var element = $compile('<div ng:class="dynClass"></div>')($rootScope);
      $rootScope.dynClass = 'A';
      $rootScope.$digest();
      expect(element.hasClass('A')).toBe(true);

      // add extra class, change model and eval
      element.addClass('newClass');
      $rootScope.dynClass = 'B';
      $rootScope.$digest();

      expect(element.hasClass('B')).toBe(true);
      expect(element.hasClass('newClass')).toBe(true);
    }));


    it('should preserve other classes with similar name"', inject(function($rootScope, $compile) {
      var element = $compile('<div class="ui-panel ui-selected" ng:class="dynCls"></div>')($rootScope);
      $rootScope.dynCls = 'panel';
      $rootScope.$digest();
      $rootScope.dynCls = 'foo';
      $rootScope.$digest();
      expect(element[0].className).toBe('ui-panel ui-selected ng-directive foo');
    }));


    it('should not add duplicate classes', inject(function($rootScope, $compile) {
      var element = $compile('<div class="panel bar" ng:class="dynCls"></div>')($rootScope);
      $rootScope.dynCls = 'panel';
      $rootScope.$digest();
      expect(element[0].className).toBe('panel bar ng-directive');
    }));


    it('should remove classes even if it was specified via class attribute', inject(function($rootScope, $compile) {
      var element = $compile('<div class="panel bar" ng:class="dynCls"></div>')($rootScope);
      $rootScope.dynCls = 'panel';
      $rootScope.$digest();
      $rootScope.dynCls = 'window';
      $rootScope.$digest();
      expect(element[0].className).toBe('bar ng-directive window');
    }));


    it('should remove classes even if they were added by another code', inject(function($rootScope, $compile) {
      var element = $compile('<div ng:class="dynCls"></div>')($rootScope);
      $rootScope.dynCls = 'foo';
      $rootScope.$digest();
      element.addClass('foo');
      $rootScope.dynCls = '';
      $rootScope.$digest();
      expect(element[0].className).toBe('ng-directive');
    }));


    it('should convert undefined and null values to an empty string', inject(function($rootScope, $compile) {
      var element = $compile('<div ng:class="dynCls"></div>')($rootScope);
      $rootScope.dynCls = [undefined, null];
      $rootScope.$digest();
      expect(element[0].className).toBe('ng-directive');
    }));
  });


  it('should ng:class odd/even', inject(function($rootScope, $compile) {
    var element = $compile('<ul><li ng:repeat="i in [0,1]" class="existing" ng:class-odd="\'odd\'" ng:class-even="\'even\'"></li><ul>')($rootScope);
    $rootScope.$digest();
    var e1 = jqLite(element[0].childNodes[1]);
    var e2 = jqLite(element[0].childNodes[2]);
    expect(e1.hasClass('existing')).toBeTruthy();
    expect(e1.hasClass('odd')).toBeTruthy();
    expect(e2.hasClass('existing')).toBeTruthy();
    expect(e2.hasClass('even')).toBeTruthy();
  }));


  it('should allow both ng:class and ng:class-odd/even on the same element', inject(function($rootScope, $compile) {
    var element = $compile('<ul>' +
      '<li ng:repeat="i in [0,1]" ng:class="\'plainClass\'" ' +
      'ng:class-odd="\'odd\'" ng:class-even="\'even\'"></li>' +
      '<ul>')($rootScope);
    $rootScope.$apply();
    var e1 = jqLite(element[0].childNodes[1]);
    var e2 = jqLite(element[0].childNodes[2]);

    expect(e1.hasClass('plainClass')).toBeTruthy();
    expect(e1.hasClass('odd')).toBeTruthy();
    expect(e1.hasClass('even')).toBeFalsy();
    expect(e2.hasClass('plainClass')).toBeTruthy();
    expect(e2.hasClass('even')).toBeTruthy();
    expect(e2.hasClass('odd')).toBeFalsy();
  }));


  it('should allow both ng:class and ng:class-odd/even with multiple classes', inject(function($rootScope, $compile) {
    var element = $compile('<ul>' +
      '<li ng:repeat="i in [0,1]" ng:class="[\'A\', \'B\']" ' +
      'ng:class-odd="[\'C\', \'D\']" ng:class-even="[\'E\', \'F\']"></li>' +
      '<ul>')($rootScope);
    $rootScope.$apply();
    var e1 = jqLite(element[0].childNodes[1]);
    var e2 = jqLite(element[0].childNodes[2]);

    expect(e1.hasClass('A')).toBeTruthy();
    expect(e1.hasClass('B')).toBeTruthy();
    expect(e1.hasClass('C')).toBeTruthy();
    expect(e1.hasClass('D')).toBeTruthy();
    expect(e1.hasClass('E')).toBeFalsy();
    expect(e1.hasClass('F')).toBeFalsy();

    expect(e2.hasClass('A')).toBeTruthy();
    expect(e2.hasClass('B')).toBeTruthy();
    expect(e2.hasClass('E')).toBeTruthy();
    expect(e2.hasClass('F')).toBeTruthy();
    expect(e2.hasClass('C')).toBeFalsy();
    expect(e2.hasClass('D')).toBeFalsy();
  }));


  describe('ng:style', function() {

    it('should set', inject(function($rootScope, $compile) {
      var element = $compile('<div ng:style="{height: \'40px\'}"></div>')($rootScope);
      $rootScope.$digest();
      expect(element.css('height')).toEqual('40px');
    }));


    it('should silently ignore undefined style', inject(function($rootScope, $compile) {
      var element = $compile('<div ng:style="myStyle"></div>')($rootScope);
      $rootScope.$digest();
      expect(element.hasClass('ng-exception')).toBeFalsy();
    }));


    describe('preserving styles set before and after compilation', function() {
      var scope, preCompStyle, preCompVal, postCompStyle, postCompVal, element;

      beforeEach(inject(function($rootScope, $compile) {
        preCompStyle = 'width';
        preCompVal = '300px';
        postCompStyle = 'height';
        postCompVal = '100px';
        element = jqLite('<div ng:style="styleObj"></div>');
        element.css(preCompStyle, preCompVal);
        jqLite(document.body).append(element);
        $compile(element)($rootScope);
        scope = $rootScope;
        scope.styleObj = {'margin-top': '44px'};
        scope.$apply();
        element.css(postCompStyle, postCompVal);
      }));

      afterEach(function() {
        element.remove();
      });


      it('should not mess up stuff after compilation', function() {
        element.css('margin', '44px');
        expect(element.css(preCompStyle)).toBe(preCompVal);
        expect(element.css('margin-top')).toBe('44px');
        expect(element.css(postCompStyle)).toBe(postCompVal);
      });


      it('should not mess up stuff after $apply with no model changes', function() {
        element.css('padding-top', '33px');
        scope.$apply();
        expect(element.css(preCompStyle)).toBe(preCompVal);
        expect(element.css('margin-top')).toBe('44px');
        expect(element.css(postCompStyle)).toBe(postCompVal);
        expect(element.css('padding-top')).toBe('33px');
      });


      it('should not mess up stuff after $apply with non-colliding model changes', function() {
        scope.styleObj = {'padding-top': '99px'};
        scope.$apply();
        expect(element.css(preCompStyle)).toBe(preCompVal);
        expect(element.css('margin-top')).not.toBe('44px');
        expect(element.css('padding-top')).toBe('99px');
        expect(element.css(postCompStyle)).toBe(postCompVal);
      });


      it('should overwrite original styles after a colliding model change', function() {
        scope.styleObj = {'height': '99px', 'width': '88px'};
        scope.$apply();
        expect(element.css(preCompStyle)).toBe('88px');
        expect(element.css(postCompStyle)).toBe('99px');
        scope.styleObj = {};
        scope.$apply();
        expect(element.css(preCompStyle)).not.toBe('88px');
        expect(element.css(postCompStyle)).not.toBe('99px');
      });
    });
  });


  describe('ng:show', function() {
    it('should show and hide an element', inject(function($rootScope, $compile) {
      var element = jqLite('<div ng:show="exp"></div>');
      var element = $compile(element)($rootScope);
      $rootScope.$digest();
      expect(isCssVisible(element)).toEqual(false);
      $rootScope.exp = true;
      $rootScope.$digest();
      expect(isCssVisible(element)).toEqual(true);
    }));


    it('should make hidden element visible', inject(function($rootScope, $compile) {
      var element = jqLite('<div style="display: none" ng:show="exp"></div>');
      var element = $compile(element)($rootScope);
      expect(isCssVisible(element)).toBe(false);
      $rootScope.exp = true;
      $rootScope.$digest();
      expect(isCssVisible(element)).toBe(true);
    }));
  });

  describe('ng:hide', function() {
    it('should hide an element', inject(function($rootScope, $compile) {
      var element = jqLite('<div ng:hide="exp"></div>');
      var element = $compile(element)($rootScope);
      expect(isCssVisible(element)).toBe(true);
      $rootScope.exp = true;
      $rootScope.$digest();
      expect(isCssVisible(element)).toBe(false);
    }));
  });

  describe('ng:controller', function() {

    var temp;

    beforeEach(function() {
      temp = window.temp = {};
      temp.Greeter = function() {
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

    afterEach(function() {
      window.temp = undefined;
    });

    it('should bind', inject(function($rootScope, $compile) {
      var element = $compile('<div ng:controller="temp.Greeter"></div>')($rootScope);
      expect($rootScope.greeter.greeting).toEqual('hello');
      expect($rootScope.greeter.greet('misko')).toEqual('hello misko!');
    }));

    it('should support nested controllers', inject(function($rootScope, $compile) {
      temp.ChildGreeter = function() {
        this.greeting = 'hey';
        this.$root.childGreeter = this;
      };
      temp.ChildGreeter.prototype = {
        greet: function() {
          return this.greeting + ' dude' + this.suffix;
        }
      };
      var element = $compile('<div ng:controller="temp.Greeter"><div ng:controller="temp.ChildGreeter">{{greet("misko")}}</div></div>')($rootScope);
      expect($rootScope.greeting).not.toBeDefined();
      expect($rootScope.greeter.greeting).toEqual('hello');
      expect($rootScope.greeter.greet('misko')).toEqual('hello misko!');
      expect($rootScope.greeter.greeting).toEqual('hello');
      expect($rootScope.childGreeter.greeting).toEqual('hey');
      expect($rootScope.childGreeter.$parent.greeting).toEqual('hello');
      $rootScope.$digest();
      expect(element.text()).toEqual('hey dude!');
    }));

    it('should infer injection arguments', inject(function($rootScope, $compile, $http) {
      temp.MyController = function($http) {
        this.$root.someService = $http;
      };
      var element = $compile('<div ng:controller="temp.MyController"></div>')($rootScope);
      expect($rootScope.someService).toBe($http);
    }));
  });

  describe('ng:cloak', function() {

    it('should get removed when an element is compiled', inject(function($rootScope, $compile) {
      var element = jqLite('<div ng:cloak></div>');
      expect(element.attr('ng:cloak')).toBe('');
      $compile(element);
      expect(element.attr('ng:cloak')).toBeUndefined();
    }));


    it('should remove ng-cloak class from a compiled element', inject(function($rootScope, $compile) {
      var element = jqLite('<div ng:cloak class="foo ng-cloak bar"></div>');

      expect(element.hasClass('foo')).toBe(true);
      expect(element.hasClass('ng-cloak')).toBe(true);
      expect(element.hasClass('bar')).toBe(true);

      $compile(element);

      expect(element.hasClass('foo')).toBe(true);
      expect(element.hasClass('ng-cloak')).toBe(false);
      expect(element.hasClass('bar')).toBe(true);
    }));
  });
});
