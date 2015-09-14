'use strict';

describe('$aria', function() {
  var scope, $compile, element;

  beforeEach(module('ngAria'));

  afterEach(function() {
    dealoc(element);
  });

  function injectScopeAndCompiler() {
    return inject(function(_$compile_, _$rootScope_) {
      $compile = _$compile_;
      scope = _$rootScope_;
    });
  }

  function compileElement(inputHtml) {
    element = $compile(inputHtml)(scope);
    scope.$digest();
  }

  describe('aria-hidden', function() {
    beforeEach(injectScopeAndCompiler);

    it('should attach aria-hidden to ng-show', function() {
      compileElement('<div ng-show="val"></div>');
      scope.$apply('val = false');
      expect(element.attr('aria-hidden')).toBe('true');

      scope.$apply('val = true');
      expect(element.attr('aria-hidden')).toBe('false');
    });

    it('should attach aria-hidden to ng-hide', function() {
      compileElement('<div ng-hide="val"></div>');
      scope.$apply('val = false');
      expect(element.attr('aria-hidden')).toBe('false');

      scope.$apply('val = true');
      expect(element.attr('aria-hidden')).toBe('true');
    });

    it('should not change aria-hidden if it is already present on ng-show', function() {
      compileElement('<div ng-show="val" aria-hidden="userSetValue"></div>');
      expect(element.attr('aria-hidden')).toBe('userSetValue');

      scope.$apply('val = true');
      expect(element.attr('aria-hidden')).toBe('userSetValue');
    });

    it('should not change aria-hidden if it is already present on ng-hide', function() {
      compileElement('<div ng-hide="val" aria-hidden="userSetValue"></div>');
      expect(element.attr('aria-hidden')).toBe('userSetValue');

      scope.$apply('val = true');
      expect(element.attr('aria-hidden')).toBe('userSetValue');
    });

    it('should always set aria-hidden to a boolean value', function() {
      compileElement('<div ng-hide="val"></div>');

      scope.$apply('val = "test angular"');
      expect(element.attr('aria-hidden')).toBe('true');

      scope.$apply('val = null');
      expect(element.attr('aria-hidden')).toBe('false');

      scope.$apply('val = {}');
      expect(element.attr('aria-hidden')).toBe('true');


      compileElement('<div ng-show="val"></div>');

      scope.$apply('val = "test angular"');
      expect(element.attr('aria-hidden')).toBe('false');

      scope.$apply('val = null');
      expect(element.attr('aria-hidden')).toBe('true');

      scope.$apply('val = {}');
      expect(element.attr('aria-hidden')).toBe('false');
    });
  });


  describe('aria-hidden when disabled', function() {
    beforeEach(configAriaProvider({
      ariaHidden: false
    }));
    beforeEach(injectScopeAndCompiler);

    it('should not attach aria-hidden', function() {
      scope.$apply('val = false');
      compileElement('<div ng-show="val"></div>');
      expect(element.attr('aria-hidden')).toBeUndefined();

      compileElement('<div ng-hide="val"></div>');
      expect(element.attr('aria-hidden')).toBeUndefined();
    });
  });

  describe('aria-checked', function() {
    beforeEach(injectScopeAndCompiler);

    it('should attach itself to input type="checkbox"', function() {
      compileElement('<input type="checkbox" ng-model="val">');

      scope.$apply('val = true');
      expect(element.attr('aria-checked')).toBe('true');

      scope.$apply('val = false');
      expect(element.attr('aria-checked')).toBe('false');
    });

    it('should handle checkbox with string model values using ng(True|False)Value', function() {
      var element = $compile('<input type="checkbox" ng-model="val" ng-true-value="\'yes\'" ' +
        'ng-false-value="\'no\'">'
      )(scope);

      scope.$apply('val="yes"');
      expect(element.eq(0).attr('aria-checked')).toBe('true');

      scope.$apply('val="no"');
      expect(element.eq(0).attr('aria-checked')).toBe('false');
    });

    it('should handle checkbox with integer model values using ngTrueValue', function() {
      var element = $compile('<input type="checkbox" ng-model="val" ng-true-value="0">')(scope);

      scope.$apply('val=0');
      expect(element.eq(0).attr('aria-checked')).toBe('true');

      scope.$apply('val=1');
      expect(element.eq(0).attr('aria-checked')).toBe('false');
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

    it('should handle radios with integer model values', function() {
      var element = $compile('<input type="radio" ng-model="val" value="0">' +
          '<input type="radio" ng-model="val" value="1">')(scope);

      scope.$apply('val=0');
      expect(element.eq(0).attr('aria-checked')).toBe('true');
      expect(element.eq(1).attr('aria-checked')).toBe('false');

      scope.$apply('val=1');
      expect(element.eq(0).attr('aria-checked')).toBe('false');
      expect(element.eq(1).attr('aria-checked')).toBe('true');
    });

    it('should handle radios with boolean model values using ngValue', function() {
      var element = $compile('<input type="radio" ng-model="val" ng-value="valExp">' +
          '<input type="radio" ng-model="val" ng-value="valExp2">')(scope);

      scope.$apply(function() {
        scope.valExp = true;
        scope.valExp2 = false;
        scope.val = true;
      });
      expect(element.eq(0).attr('aria-checked')).toBe('true');
      expect(element.eq(1).attr('aria-checked')).toBe('false');

      scope.$apply('val = false');
      expect(element.eq(0).attr('aria-checked')).toBe('false');
      expect(element.eq(1).attr('aria-checked')).toBe('true');
    });

    it('should attach itself to role="radio"', function() {
      scope.val = 'one';
      compileElement('<div role="radio" ng-model="val" value="one"></div>');
      expect(element.attr('aria-checked')).toBe('true');

      scope.$apply("val = 'two'");
      expect(element.attr('aria-checked')).toBe('false');
    });

    it('should attach itself to role="checkbox"', function() {
      scope.val = true;
      compileElement('<div role="checkbox" ng-model="val"></div>');
      expect(element.attr('aria-checked')).toBe('true');

      scope.$apply('val = false');
      expect(element.attr('aria-checked')).toBe('false');
    });

    it('should attach itself to role="menuitemradio"', function() {
      scope.val = 'one';
      compileElement('<div role="menuitemradio" ng-model="val" value="one"></div>');
      expect(element.attr('aria-checked')).toBe('true');

      scope.$apply("val = 'two'");
      expect(element.attr('aria-checked')).toBe('false');
    });

    it('should attach itself to role="menuitemcheckbox"', function() {
      scope.val = true;
      compileElement('<div role="menuitemcheckbox" ng-model="val"></div>');
      expect(element.attr('aria-checked')).toBe('true');

      scope.$apply('val = false');
      expect(element.attr('aria-checked')).toBe('false');
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

  describe('roles for custom inputs', function() {
    beforeEach(injectScopeAndCompiler);

    it('should add missing role="button" to custom input', function() {
      compileElement('<div ng-click="someFunction()"></div>');
      expect(element.attr('role')).toBe('button');
    });

    it('should not add role="button" to anchor', function() {
      compileElement('<a ng-click="someFunction()"></a>');
      expect(element.attr('role')).not.toBe('button');
    });

    it('should add missing role="checkbox" to custom input', function() {
      compileElement('<div type="checkbox" ng-model="val"></div>');
      expect(element.attr('role')).toBe('checkbox');
    });

    it('should not add a role to a native checkbox', function() {
      compileElement('<input type="checkbox" ng-model="val"></div>');
      expect(element.attr('role')).toBe(undefined);
    });

    it('should add missing role="radio" to custom input', function() {
      compileElement('<div type="radio" ng-model="val"></div>');
      expect(element.attr('role')).toBe('radio');
    });

    it('should not add a role to a native radio button', function() {
      compileElement('<input type="radio" ng-model="val"></div>');
      expect(element.attr('role')).toBe(undefined);
    });

    it('should add missing role="slider" to custom input', function() {
      compileElement('<div type="range" ng-model="val"></div>');
      expect(element.attr('role')).toBe('slider');
    });

    it('should not add a role to a native range input', function() {
      compileElement('<input type="range" ng-model="val"></div>');
      expect(element.attr('role')).toBe(undefined);
    });
  });

  describe('aria-checked when disabled', function() {
    beforeEach(configAriaProvider({
      ariaChecked: false
    }));
    beforeEach(injectScopeAndCompiler);

    it('should not attach aria-checked', function() {
      compileElement("<div role='radio' ng-model='val' value='{{val}}'></div>");
      expect(element.attr('aria-checked')).toBeUndefined();

      compileElement("<div role='menuitemradio' ng-model='val' value='{{val}}'></div>");
      expect(element.attr('aria-checked')).toBeUndefined();

      compileElement("<div role='checkbox' checked='checked'></div>");
      expect(element.attr('aria-checked')).toBeUndefined();

      compileElement("<div role='menuitemcheckbox' checked='checked'></div>");
      expect(element.attr('aria-checked')).toBeUndefined();
    });
  });

  describe('aria-disabled', function() {
    beforeEach(injectScopeAndCompiler);

    it('should attach itself to input elements', function() {
      scope.$apply('val = false');
      compileElement("<input ng-disabled='val'>");
      expect(element.attr('aria-disabled')).toBe('false');

      scope.$apply('val = true');
      expect(element.attr('aria-disabled')).toBe('true');
    });

    it('should attach itself to textarea elements', function() {
      scope.$apply('val = false');
      compileElement('<textarea ng-disabled="val"></textarea>');
      expect(element.attr('aria-disabled')).toBe('false');

      scope.$apply('val = true');
      expect(element.attr('aria-disabled')).toBe('true');
    });

    it('should attach itself to button elements', function() {
      scope.$apply('val = false');
      compileElement('<button ng-disabled="val"></button>');
      expect(element.attr('aria-disabled')).toBe('false');

      scope.$apply('val = true');
      expect(element.attr('aria-disabled')).toBe('true');
    });

    it('should attach itself to select elements', function() {
      scope.$apply('val = false');
      compileElement('<select ng-disabled="val"></select>');
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


    it('should always set aria-disabled to a boolean value', function() {
      compileElement('<div ng-disabled="val"></div>');

      scope.$apply('val = "test angular"');
      expect(element.attr('aria-disabled')).toBe('true');

      scope.$apply('val = null');
      expect(element.attr('aria-disabled')).toBe('false');

      scope.$apply('val = {}');
      expect(element.attr('aria-disabled')).toBe('true');
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
      compileElement('<input ng-model="txtInput" ng-minlength="10">');
      scope.$apply("txtInput='LTten'");
      expect(element.attr('aria-invalid')).toBe('true');

      scope.$apply("txtInput='morethantencharacters'");
      expect(element.attr('aria-invalid')).toBe('false');
    });

    it('should not attach itself if aria-invalid is already present', function() {
      compileElement('<input ng-model="txtInput" ng-minlength="10" aria-invalid="userSetValue">');
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
      compileElement('<input ng-model="txtInput" ng-minlength="10">');
      expect(element.attr('aria-invalid')).toBeUndefined();
    });
  });

  describe('aria-required', function() {
    beforeEach(injectScopeAndCompiler);

    it('should attach aria-required to input', function() {
      compileElement('<input ng-model="val" required>');
      expect(element.attr('aria-required')).toBe('true');

      scope.$apply("val='input is valid now'");
      expect(element.attr('aria-required')).toBe('false');
    });

    it('should attach aria-required to textarea', function() {
      compileElement('<textarea ng-model="val" required></textarea>');
      expect(element.attr('aria-required')).toBe('true');

      scope.$apply("val='input is valid now'");
      expect(element.attr('aria-required')).toBe('false');
    });

    it('should attach aria-required to select', function() {
      compileElement('<select ng-model="val" required></select>');
      expect(element.attr('aria-required')).toBe('true');

      scope.$apply("val='input is valid now'");
      expect(element.attr('aria-required')).toBe('false');
    });

    it('should attach aria-required to ngRequired', function() {
      compileElement('<input ng-model="val" ng-required="true">');
      expect(element.attr('aria-required')).toBe('true');

      scope.$apply("val='input is valid now'");
      expect(element.attr('aria-required')).toBe('false');
    });

    it('should not attach itself if aria-required is already present', function() {
      compileElement("<input ng-model='val' required aria-required='userSetValue'>");
      expect(element.attr('aria-required')).toBe('userSetValue');

      compileElement("<textarea ng-model='val' required aria-required='userSetValue'></textarea>");
      expect(element.attr('aria-required')).toBe('userSetValue');

      compileElement("<select ng-model='val' required aria-required='userSetValue'></select>");
      expect(element.attr('aria-required')).toBe('userSetValue');

      compileElement("<input ng-model='val' ng-required='true' aria-required='userSetValue'>");
      expect(element.attr('aria-required')).toBe('userSetValue');
    });
  });

  describe('aria-required when disabled', function() {
    beforeEach(configAriaProvider({
      ariaRequired: false
    }));
    beforeEach(injectScopeAndCompiler);

    it('should not add the aria-required attribute', function() {
      compileElement("<input ng-model='val' required>");
      expect(element.attr('aria-required')).toBeUndefined();

      compileElement("<textarea ng-model='val' required></textarea>");
      expect(element.attr('aria-required')).toBeUndefined();

      compileElement("<select ng-model='val' required></select>");
      expect(element.attr('aria-required')).toBeUndefined();
    });
  });

  describe('aria-multiline', function() {
    beforeEach(injectScopeAndCompiler);

    it('should attach itself to textarea', function() {
      compileElement('<textarea ng-model="val"></textarea>');
      expect(element.attr('aria-multiline')).toBe('true');
    });

    it('should attach itself role="textbox"', function() {
      compileElement('<div role="textbox" ng-model="val"></div>');
      expect(element.attr('aria-multiline')).toBe('true');
    });

    it('should not attach itself if aria-multiline is already present', function() {
      compileElement('<textarea aria-multiline="userSetValue"></textarea>');
      expect(element.attr('aria-multiline')).toBe('userSetValue');

      compileElement('<div role="textbox" aria-multiline="userSetValue"></div>');
      expect(element.attr('aria-multiline')).toBe('userSetValue');
    });
  });

  describe('aria-multiline when disabled', function() {
    beforeEach(configAriaProvider({
      ariaMultiline: false
    }));
    beforeEach(injectScopeAndCompiler);

    it('should not attach itself to textarea', function() {
      compileElement('<textarea></textarea>');
      expect(element.attr('aria-multiline')).toBeUndefined();
    });

    it('should not attach itself role="textbox"', function() {
      compileElement('<div role="textbox"></div>');
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


    it('should update `aria-valuemin/max` when `min/max` changes dynamically', function() {
      scope.$apply('min = 25; max = 75');
      compileElement('<input type="range" ng-model="val" min="{{min}}" max="{{max}}" />');

      expect(element.attr('aria-valuemin')).toBe('25');
      expect(element.attr('aria-valuemax')).toBe('75');

      scope.$apply('min = 0');
      expect(element.attr('aria-valuemin')).toBe('0');

      scope.$apply('max = 100');
      expect(element.attr('aria-valuemax')).toBe('100');
    });


    it('should update `aria-valuemin/max` when `ng-min/ng-max` changes dynamically', function() {
      scope.$apply('min = 25; max = 75');
      compileElement('<input type="range" ng-model="val" ng-min="min" ng-max="max" />');

      expect(element.attr('aria-valuemin')).toBe('25');
      expect(element.attr('aria-valuemax')).toBe('75');

      scope.$apply('min = 0');
      expect(element.attr('aria-valuemin')).toBe('0');

      scope.$apply('max = 100');
      expect(element.attr('aria-valuemax')).toBe('100');
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

      compileElement('<input type="range" ng-model="val" min="0" max="100">');
      expect(element.attr('aria-valuenow')).toBeUndefined();
      expect(element.attr('aria-valuemin')).toBeUndefined();
      expect(element.attr('aria-valuemax')).toBeUndefined();

      compileElement('<div role="progressbar" min="0" max="100" ng-model="val">');
      expect(element.attr('aria-valuenow')).toBeUndefined();
      expect(element.attr('aria-valuemin')).toBeUndefined();
      expect(element.attr('aria-valuemax')).toBeUndefined();
    });
  });

  describe('tabindex', function() {
    beforeEach(injectScopeAndCompiler);

    it('should not attach to native controls', function() {
      var element = [
        $compile("<button ng-click='something'></button>")(scope),
        $compile("<a ng-href='#/something'>")(scope),
        $compile("<input ng-model='val'>")(scope),
        $compile("<textarea ng-model='val'></textarea>")(scope),
        $compile("<select ng-model='val'></select>")(scope),
        $compile("<details ng-model='val'></details>")(scope)
      ];
      expectAriaAttrOnEachElement(element, 'tabindex', undefined);
    });

    it('should not attach to random ng-model elements', function() {
      compileElement('<div ng-model="val"></div>');
      expect(element.attr('tabindex')).toBeUndefined();
    });

    it('should attach tabindex to custom inputs', function() {
      compileElement('<div type="checkbox" ng-model="val"></div>');
      expect(element.attr('tabindex')).toBe('0');

      compileElement('<div role="checkbox" ng-model="val"></div>');
      expect(element.attr('tabindex')).toBe('0');

      compileElement('<div type="range" ng-model="val"></div>');
      expect(element.attr('tabindex')).toBe('0');
    });

    it('should attach to ng-click and ng-dblclick', function() {
      compileElement('<div ng-click="someAction()"></div>');
      expect(element.attr('tabindex')).toBe('0');

      compileElement('<div ng-dblclick="someAction()"></div>');
      expect(element.attr('tabindex')).toBe('0');
    });

    it('should not attach tabindex if it is already on an element', function() {
      compileElement('<div role="button" tabindex="userSetValue"></div>');
      expect(element.attr('tabindex')).toBe('userSetValue');

      compileElement('<div role="checkbox" tabindex="userSetValue"></div>');
      expect(element.attr('tabindex')).toBe('userSetValue');

      compileElement('<div ng-click="someAction()" tabindex="userSetValue"></div>');
      expect(element.attr('tabindex')).toBe('userSetValue');

      compileElement('<div ng-dblclick="someAction()" tabindex="userSetValue"></div>');
      expect(element.attr('tabindex')).toBe('userSetValue');
    });
  });

  describe('accessible actions', function() {
    beforeEach(injectScopeAndCompiler);

    var clickFn;

    it('should trigger a click from the keyboard', function() {
      scope.someAction = function() {};

      var elements = $compile('<section>' +
                  '<div class="div-click" ng-click="someAction(\'div\')" tabindex="0"></div>' +
                  '<ul><li ng-click="someAction( \'li\')" tabindex="0"></li></ul>' +
                  '</section>')(scope);

      scope.$digest();

      clickFn = spyOn(scope, 'someAction');

      var divElement = elements.find('div');
      var liElement = elements.find('li');

      divElement.triggerHandler({type: 'keypress', keyCode: 32});
      liElement.triggerHandler({type: 'keypress', keyCode: 32});

      expect(clickFn).toHaveBeenCalledWith('div');
      expect(clickFn).toHaveBeenCalledWith('li');
    });

    it('should trigger a click in browsers that provide event.which instead of event.keyCode', function() {
      scope.someAction = function() {};

      var elements = $compile('<section>' +
      '<div class="div-click" ng-click="someAction(\'div\')" tabindex="0"></div>' +
      '<ul><li ng-click="someAction( \'li\')" tabindex="0"></li></ul>' +
      '</section>')(scope);

      scope.$digest();

      clickFn = spyOn(scope, 'someAction');

      var divElement = elements.find('div');
      var liElement = elements.find('li');

      divElement.triggerHandler({type: 'keypress', which: 32});
      liElement.triggerHandler({type: 'keypress', which: 32});

      expect(clickFn).toHaveBeenCalledWith('div');
      expect(clickFn).toHaveBeenCalledWith('li');
    });

    it('should not override existing ng-keypress', function() {
      scope.someOtherAction = function() {};
      var keypressFn = spyOn(scope, 'someOtherAction');

      scope.someAction = function() {};
      clickFn = spyOn(scope, 'someAction');
      compileElement('<div ng-click="someAction()" ng-keypress="someOtherAction()" tabindex="0"></div>');

      element.triggerHandler({type: 'keypress', keyCode: 32});

      expect(clickFn).not.toHaveBeenCalled();
      expect(keypressFn).toHaveBeenCalled();
    });

    it('should update bindings when keypress handled', function() {
      compileElement('<div ng-click="text = \'clicked!\'">{{text}}</div>');
      expect(element.text()).toBe('');
      spyOn(scope.$root, '$digest').andCallThrough();
      element.triggerHandler({ type: 'keypress', keyCode: 13 });
      expect(element.text()).toBe('clicked!');
      expect(scope.$root.$digest).toHaveBeenCalledOnce();
    });

    it('should pass $event to ng-click handler as local', function() {
      compileElement('<div ng-click="event = $event">{{event.type}}' +
                      '{{event.keyCode}}</div>');
      expect(element.text()).toBe('');
      element.triggerHandler({ type: 'keypress', keyCode: 13 });
      expect(element.text()).toBe('keypress13');
    });

    it('should not bind keypress to elements not in the default config', function() {
      compileElement('<button ng-click="event = $event">{{event.type}}{{event.keyCode}}</button>');
      expect(element.text()).toBe('');
      element.triggerHandler({ type: 'keypress', keyCode: 13 });
      expect(element.text()).toBe('');
    });
  });

  describe('actions when bindRoleForClick is set to false', function() {
    beforeEach(configAriaProvider({
      bindRoleForClick: false
    }));
    beforeEach(injectScopeAndCompiler);

    it('should not add a button role', function() {
      compileElement('<radio-group ng-click="something"></radio-group>');
      expect(element.attr('role')).toBeUndefined();
    });
  });

  describe('actions when bindKeypress is set to false', function() {
    beforeEach(configAriaProvider({
      bindKeypress: false
    }));
    beforeEach(injectScopeAndCompiler);

    it('should not a trigger click', function() {
      scope.someAction = function() {};
      var clickFn = spyOn(scope, 'someAction');

      element = $compile('<div ng-click="someAction()" tabindex="0"></div>')(scope);

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
      compileElement('<div role="button"></div>');
      expect(element.attr('tabindex')).toBeUndefined();

      compileElement('<div role="checkbox"></div>');
      expect(element.attr('tabindex')).toBeUndefined();

      compileElement('<div ng-click="someAction()"></div>');
      expect(element.attr('tabindex')).toBeUndefined();

      compileElement('<div ng-dblclick="someAction()"></div>');
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
