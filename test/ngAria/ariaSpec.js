'use strict';

describe('$aria', function() {
  var scope, $compile, element;

  beforeEach(module('ngAria'));

  function injectScopeAndCompiler() {
    return inject(function(_$compile_, _$rootScope_) {
      $compile = _$compile_;
      scope = _$rootScope_;
    });
  }

  function compileInput(inputHtml) {
    element = $compile(inputHtml)(scope);
    scope.$digest();
  }

  describe('aria-hidden', function() {
    beforeEach(injectScopeAndCompiler);

    it('should attach aria-hidden to ng-show', function() {
      compileInput('<div ng-show="val"></div>');
      scope.$apply('val = false');
      expect(element.attr('aria-hidden')).toBe('true');

      scope.$apply('val = true');
      expect(element.attr('aria-hidden')).toBe('false');
    });

    it('should attach aria-hidden to ng-hide', function() {
      compileInput('<div ng-hide="val"></div>');
      scope.$apply('val = false');
      expect(element.attr('aria-hidden')).toBe('false');

      scope.$apply('val = true');
      expect(element.attr('aria-hidden')).toBe('true');
    });

    it('should not change aria-hidden if it is already present on ng-show', function() {
      compileInput('<div ng-show="val" aria-hidden="userSetValue"></div>');
      expect(element.attr('aria-hidden')).toBe('userSetValue');

      scope.$apply('val = true');
      expect(element.attr('aria-hidden')).toBe('userSetValue');
    });

    it('should not change aria-hidden if it is already present on ng-hide', function() {
      compileInput('<div ng-hide="val" aria-hidden="userSetValue"></div>');
      expect(element.attr('aria-hidden')).toBe('userSetValue');

      scope.$apply('val = true');
      expect(element.attr('aria-hidden')).toBe('userSetValue');
    });
  });


  describe('aria-hidden when disabled', function() {
    beforeEach(configAriaProvider({
      ariaHidden: false
    }));
    beforeEach(injectScopeAndCompiler);

    it('should not attach aria-hidden', function() {
      scope.$apply('val = false');
      compileInput('<div ng-show="val"></div>');
      expect(element.attr('aria-hidden')).toBeUndefined();

      compileInput('<div ng-hide="val"></div>');
      expect(element.attr('aria-hidden')).toBeUndefined();
    });
  });

  describe('aria-checked', function() {
    beforeEach(injectScopeAndCompiler);

    it('should attach itself to input type="checkbox"', function() {
      compileInput('<input type="checkbox" ng-model="val">');

      scope.$apply('val = true');
      expect(element.attr('aria-checked')).toBe('true');

      scope.$apply('val = false');
      expect(element.attr('aria-checked')).toBe('false');
    });

    it('should attach itself to input type="radio"', function() {
      var element = $compile('<input type="radio" ng-model="val" value="one">' +
          '<input type="radio" ng-model="val" value="two">')(scope);

      scope.$apply("val='one'");
      expect(element.eq(0).attr('aria-checked')).toBe('true');
      expect(element.eq(1).attr('aria-checked')).toBe('false');

      scope.$apply("val='two'");
      expect(element.eq(0).attr('aria-checked')).toBe('false');
      expect(element.eq(1).attr('aria-checked')).toBe('true');
    });

    it('should attach itself to role="radio"', function() {
      scope.$apply("val = 'one'");
      compileInput('<div role="radio" ng-model="val" value="{{val}}"></div>');
      expect(element.attr('aria-checked')).toBe('true');
    });

    it('should attach itself to role="checkbox"', function() {
      scope.val = true;
      compileInput('<div role="checkbox" ng-model="val"></div>');
      expect(element.attr('aria-checked')).toBe('true');
    });

    it('should attach itself to role="menuitemradio"', function() {
      scope.val = 'one';
      compileInput('<div role="menuitemradio" ng-model="val" value="{{val}}"></div>');
      expect(element.attr('aria-checked')).toBe('true');
    });

    it('should attach itself to role="menuitemcheckbox"', function() {
      scope.val = true;
      compileInput('<div role="menuitemcheckbox" ng-model="val"></div>');
      expect(element.attr('aria-checked')).toBe('true');
    });

    it('should not attach itself if an aria-checked value is already present', function() {
      var element = [
        $compile("<input type='checkbox' ng-model='val1' aria-checked='userSetValue'>")(scope),
        $compile("<input type='radio' ng-model='val2' value='one' aria-checked='userSetValue'><input type='radio' ng-model='val2' value='two'>")(scope),
        $compile("<div role='radio' ng-model='val' value='{{val3}}' aria-checked='userSetValue'></div>")(scope),
        $compile("<div role='menuitemradio' ng-model='val' value='{{val3}}' aria-checked='userSetValue'></div>")(scope),
        $compile("<div role='checkbox' checked='checked' aria-checked='userSetValue'></div>")(scope),
        $compile("<div role='menuitemcheckbox' checked='checked' aria-checked='userSetValue'></div>")(scope)
      ];
      scope.$apply("val1=true;val2='one';val3='1'");
      expectAriaAttrOnEachElement(element, 'aria-checked', 'userSetValue');
    });
  });

  describe('aria-checked when disabled', function() {
    beforeEach(configAriaProvider({
      ariaChecked: false
    }));
    beforeEach(injectScopeAndCompiler);

    it('should not attach aria-checked', function() {
      compileInput("<div role='radio' ng-model='val' value='{{val}}'></div>");
      expect(element.attr('aria-checked')).toBeUndefined();

      compileInput("<div role='menuitemradio' ng-model='val' value='{{val}}'></div>");
      expect(element.attr('aria-checked')).toBeUndefined();

      compileInput("<div role='checkbox' checked='checked'></div>");
      expect(element.attr('aria-checked')).toBeUndefined();

      compileInput("<div role='menuitemcheckbox' checked='checked'></div>");
      expect(element.attr('aria-checked')).toBeUndefined();
    });
  });

  describe('aria-disabled', function() {
    beforeEach(injectScopeAndCompiler);

    it('should attach itself to input elements', function() {
      scope.$apply('val = false');
      compileInput("<input ng-disabled='val'>");
      expect(element.attr('aria-disabled')).toBe('false');

      scope.$apply('val = true');
      expect(element.attr('aria-disabled')).toBe('true');
    });

    it('should attach itself to textarea elements', function() {
      scope.$apply('val = false');
      compileInput('<textarea ng-disabled="val"></textarea>');
      expect(element.attr('aria-disabled')).toBe('false');

      scope.$apply('val = true');
      expect(element.attr('aria-disabled')).toBe('true');
    });

    it('should attach itself to button elements', function() {
      scope.$apply('val = false');
      compileInput('<button ng-disabled="val"></button>');
      expect(element.attr('aria-disabled')).toBe('false');

      scope.$apply('val = true');
      expect(element.attr('aria-disabled')).toBe('true');
    });

    it('should attach itself to select elements', function() {
      scope.$apply('val = false');
      compileInput('<select ng-disabled="val"></select>');
      expect(element.attr('aria-disabled')).toBe('false');

      scope.$apply('val = true');
      expect(element.attr('aria-disabled')).toBe('true');
    });

    it('should not attach itself if an aria-disabled attribute is already present', function() {
      var element = [
        $compile("<input aria-disabled='userSetValue' ng-disabled='val'>")(scope),
        $compile("<textarea aria-disabled='userSetValue' ng-disabled='val'></textarea>")(scope),
        $compile("<button aria-disabled='userSetValue' ng-disabled='val'></button>")(scope),
        $compile("<select aria-disabled='userSetValue' ng-disabled='val'></select>")(scope)
      ];

      scope.$apply('val = true');
      expectAriaAttrOnEachElement(element, 'aria-disabled', 'userSetValue');
    });
  });

  describe('aria-disabled when disabled', function() {
    beforeEach(configAriaProvider({
      ariaDisabled: false
    }));
    beforeEach(injectScopeAndCompiler);

    it('should not attach aria-disabled', function() {
      var element = [
        $compile("<input ng-disabled='val'>")(scope),
        $compile("<textarea ng-disabled='val'></textarea>")(scope),
        $compile("<button ng-disabled='val'></button>")(scope),
        $compile("<select ng-disabled='val'></select>")(scope)
      ];

      scope.$apply('val = false');
      expectAriaAttrOnEachElement(element, 'aria-disabled', undefined);
    });
  });

  describe('aria-invalid', function() {
    beforeEach(injectScopeAndCompiler);

    it('should attach aria-invalid to input', function() {
      compileInput('<input ng-model="txtInput" ng-minlength="10">');
      scope.$apply("txtInput='LTten'");
      expect(element.attr('aria-invalid')).toBe('true');

      scope.$apply("txtInput='morethantencharacters'");
      expect(element.attr('aria-invalid')).toBe('false');
    });

    it('should not attach itself if aria-invalid is already present', function() {
      compileInput('<input ng-model="txtInput" ng-minlength="10" aria-invalid="userSetValue">');
      scope.$apply("txtInput='LTten'");
      expect(element.attr('aria-invalid')).toBe('userSetValue');
    });
  });

  describe('aria-invalid when disabled', function() {
    beforeEach(configAriaProvider({
      ariaInvalid: false
    }));
    beforeEach(injectScopeAndCompiler);

    it('should not attach aria-invalid if the option is disabled', function() {
      scope.$apply("txtInput='LTten'");
      compileInput('<input ng-model="txtInput" ng-minlength="10">');
      expect(element.attr('aria-invalid')).toBeUndefined();
    });
  });

  describe('aria-required', function() {
    beforeEach(injectScopeAndCompiler);

    it('should attach aria-required to input', function() {
      compileInput('<input ng-model="val" required>');
      expect(element.attr('aria-required')).toBe('true');

      scope.$apply("val='input is valid now'");
      expect(element.attr('aria-required')).toBe('false');
    });

    it('should attach aria-required to textarea', function() {
      compileInput('<textarea ng-model="val" required></textarea>');
      expect(element.attr('aria-required')).toBe('true');

      scope.$apply("val='input is valid now'");
      expect(element.attr('aria-required')).toBe('false');
    });

    it('should attach aria-required to select', function() {
      compileInput('<select ng-model="val" required></select>');
      expect(element.attr('aria-required')).toBe('true');

      scope.$apply("val='input is valid now'");
      expect(element.attr('aria-required')).toBe('false');
    });

    it('should attach aria-required to ngRequired', function() {
      compileInput('<input ng-model="val" ng-required="true">');
      expect(element.attr('aria-required')).toBe('true');

      scope.$apply("val='input is valid now'");
      expect(element.attr('aria-required')).toBe('false');
    });

    it('should not attach itself if aria-required is already present', function() {
      compileInput("<input ng-model='val' required aria-required='userSetValue'>");
      expect(element.attr('aria-required')).toBe('userSetValue');

      compileInput("<textarea ng-model='val' required aria-required='userSetValue'></textarea>");
      expect(element.attr('aria-required')).toBe('userSetValue');

      compileInput("<select ng-model='val' required aria-required='userSetValue'></select>");
      expect(element.attr('aria-required')).toBe('userSetValue');

      compileInput("<input ng-model='val' ng-required='true' aria-required='userSetValue'>");
      expect(element.attr('aria-required')).toBe('userSetValue');
    });
  });

  describe('aria-required when disabled', function() {
    beforeEach(configAriaProvider({
      ariaRequired: false
    }));
    beforeEach(injectScopeAndCompiler);

    it('should not add the aria-required attribute', function() {
      compileInput("<input ng-model='val' required>");
      expect(element.attr('aria-required')).toBeUndefined();

      compileInput("<textarea ng-model='val' required></textarea>");
      expect(element.attr('aria-required')).toBeUndefined();

      compileInput("<select ng-model='val' required></select>");
      expect(element.attr('aria-required')).toBeUndefined();
    });
  });

  describe('aria-multiline', function() {
    beforeEach(injectScopeAndCompiler);

    it('should attach itself to textarea', function() {
      compileInput('<textarea ng-model="val"></textarea>');
      expect(element.attr('aria-multiline')).toBe('true');
    });

    it('should attach itself role="textbox"', function() {
      compileInput('<div role="textbox" ng-model="val"></div>');
      expect(element.attr('aria-multiline')).toBe('true');
    });

    it('should not attach itself if aria-multiline is already present', function() {
      compileInput('<textarea aria-multiline="userSetValue"></textarea>');
      expect(element.attr('aria-multiline')).toBe('userSetValue');

      compileInput('<div role="textbox" aria-multiline="userSetValue"></div>');
      expect(element.attr('aria-multiline')).toBe('userSetValue');
    });
  });

  describe('aria-multiline when disabled', function() {
    beforeEach(configAriaProvider({
      ariaMultiline: false
    }));
    beforeEach(injectScopeAndCompiler);

    it('should not attach itself to textarea', function() {
      compileInput('<textarea></textarea>');
      expect(element.attr('aria-multiline')).toBeUndefined();
    });

    it('should not attach itself role="textbox"', function() {
      compileInput('<div role="textbox"></div>');
      expect(element.attr('aria-multiline')).toBeUndefined();
    });
  });

  describe('aria-value', function() {
    beforeEach(injectScopeAndCompiler);

    it('should attach to input type="range"', function() {
      var element = [
        $compile('<input type="range" ng-model="val" min="0" max="100">')(scope),
        $compile('<div role="progressbar" min="0" max="100" ng-model="val">')(scope),
        $compile('<div role="slider" min="0" max="100" ng-model="val">')(scope)
      ];

      scope.$apply('val = 50');
      expectAriaAttrOnEachElement(element, 'aria-valuenow', "50");
      expectAriaAttrOnEachElement(element, 'aria-valuemin', "0");
      expectAriaAttrOnEachElement(element, 'aria-valuemax', "100");

      scope.$apply('val = 90');
      expectAriaAttrOnEachElement(element, 'aria-valuenow', "90");
    });

    it('should not attach if aria-value* is already present', function() {
      var element = [
        $compile('<input type="range" ng-model="val" min="0" max="100" aria-valuenow="userSetValue1" aria-valuemin="userSetValue2" aria-valuemax="userSetValue3">')(scope),
        $compile('<div role="progressbar" min="0" max="100" ng-model="val" aria-valuenow="userSetValue1" aria-valuemin="userSetValue2" aria-valuemax="userSetValue3">')(scope),
        $compile('<div role="slider" min="0" max="100" ng-model="val" aria-valuenow="userSetValue1" aria-valuemin="userSetValue2" aria-valuemax="userSetValue3">')(scope)
      ];

      scope.$apply('val = 50');
      expectAriaAttrOnEachElement(element, 'aria-valuenow', 'userSetValue1');
      expectAriaAttrOnEachElement(element, 'aria-valuemin', 'userSetValue2');
      expectAriaAttrOnEachElement(element, 'aria-valuemax', 'userSetValue3');
    });
  });

  describe('announcing ngMessages', function() {
    beforeEach(injectScopeAndCompiler);

    it('should attach aria-live', function() {
      var element = [
        $compile('<div ng-messages="myForm.myName.$error">')(scope)
      ];
      expectAriaAttrOnEachElement(element, 'aria-live', "assertive");
    });
  });

  describe('aria-value when disabled', function() {
    beforeEach(configAriaProvider({
      ariaValue: false
    }));
    beforeEach(injectScopeAndCompiler);

    it('should not attach itself', function() {
      scope.$apply('val = 50');

      compileInput('<input type="range" ng-model="val" min="0" max="100">');
      expect(element.attr('aria-valuenow')).toBeUndefined();
      expect(element.attr('aria-valuemin')).toBeUndefined();
      expect(element.attr('aria-valuemax')).toBeUndefined();

      compileInput('<div role="progressbar" min="0" max="100" ng-model="val">');
      expect(element.attr('aria-valuenow')).toBeUndefined();
      expect(element.attr('aria-valuemin')).toBeUndefined();
      expect(element.attr('aria-valuemax')).toBeUndefined();
    });
  });

  describe('tabindex', function() {
    beforeEach(injectScopeAndCompiler);

    it('should attach tabindex to role="checkbox", ng-click, and ng-dblclick', function() {
      compileInput('<div role="checkbox" ng-model="val"></div>');
      expect(element.attr('tabindex')).toBe('0');

      compileInput('<div ng-click="someAction()"></div>');
      expect(element.attr('tabindex')).toBe('0');

      compileInput('<div ng-dblclick="someAction()"></div>');
      expect(element.attr('tabindex')).toBe('0');
    });

    it('should not attach tabindex if it is already on an element', function() {
      compileInput('<div role="button" tabindex="userSetValue"></div>');
      expect(element.attr('tabindex')).toBe('userSetValue');

      compileInput('<div role="checkbox" tabindex="userSetValue"></div>');
      expect(element.attr('tabindex')).toBe('userSetValue');

      compileInput('<div ng-click="someAction()" tabindex="userSetValue"></div>');
      expect(element.attr('tabindex')).toBe('userSetValue');

      compileInput('<div ng-dblclick="someAction()" tabindex="userSetValue"></div>');
      expect(element.attr('tabindex')).toBe('userSetValue');
    });

    it('should set proper tabindex values for radiogroup', function() {
      compileInput('<div role="radiogroup">' +
                     '<div role="radio" ng-model="val" value="one">1</div>' +
                     '<div role="radio" ng-model="val" value="two">2</div>' +
                   '</div>');

      var one = element.contents().eq(0);
      var two = element.contents().eq(1);

      scope.$apply("val = 'one'");
      expect(one.attr('tabindex')).toBe('0');
      expect(two.attr('tabindex')).toBe('-1');

      scope.$apply("val = 'two'");
      expect(one.attr('tabindex')).toBe('-1');
      expect(two.attr('tabindex')).toBe('0');

      dealoc(element);
    });
  });

  describe('accessible actions', function() {
    beforeEach(injectScopeAndCompiler);

    var clickFn;

    it('should a trigger click from the keyboard', function() {
      scope.someAction = function() {};
      compileInput('<div ng-click="someAction()" tabindex="0"></div>');
      clickFn = spyOn(scope, 'someAction');

      element.triggerHandler({type: 'keypress', keyCode: 32});

      expect(clickFn).toHaveBeenCalled();
    });

    it('should not override existing ng-keypress', function() {
      scope.someOtherAction = function() {};
      var keypressFn = spyOn(scope, 'someOtherAction');

      scope.someAction = function() {};
      clickFn = spyOn(scope, 'someAction');
      compileInput('<div ng-click="someAction()" ng-keypress="someOtherAction()" tabindex="0"></div>');

      element.triggerHandler({type: 'keypress', keyCode: 32});

      expect(clickFn).not.toHaveBeenCalled();
      expect(keypressFn).toHaveBeenCalled();
    });
  });

  describe('actions when bindKeypress set to false', function() {
    beforeEach(configAriaProvider({
      bindKeypress: false
    }));
    beforeEach(injectScopeAndCompiler);

    it('should not a trigger click from the keyboard', function() {
      scope.someAction = function() {};
      var clickFn = spyOn(scope, 'someAction');

      element = $compile('<div ng-click="someAction()" tabindex="0">></div>')(scope);

      element.triggerHandler({type: 'keypress', keyCode: 32});

      expect(clickFn).not.toHaveBeenCalled();
    });
  });

  describe('tabindex when disabled', function() {
    beforeEach(configAriaProvider({
      tabindex: false
    }));
    beforeEach(injectScopeAndCompiler);

    it('should not add a tabindex attribute', function() {
      compileInput('<div role="button"></div>');
      expect(element.attr('tabindex')).toBeUndefined();

      compileInput('<div role="checkbox"></div>');
      expect(element.attr('tabindex')).toBeUndefined();

      compileInput('<div ng-click="someAction()"></div>');
      expect(element.attr('tabindex')).toBeUndefined();

      compileInput('<div ng-dblclick="someAction()"></div>');
      expect(element.attr('tabindex')).toBeUndefined();
    });
  });
});

function expectAriaAttrOnEachElement(elem, ariaAttr, expected) {
  angular.forEach(elem, function(val) {
    expect(angular.element(val).attr(ariaAttr)).toBe(expected);
  });
}

function configAriaProvider(config) {
  return function() {
    angular.module('ariaTest', ['ngAria']).config(function($ariaProvider) {
      $ariaProvider.config(config);
    });
    module('ariaTest');
  };
}
