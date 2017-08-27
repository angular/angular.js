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

    it('should not attach itself to native input type="checkbox"', function() {
      compileElement('<input type="checkbox" ng-model="val">');

      scope.$apply('val = true');
      expect(element.attr('aria-checked')).toBeUndefined();

      scope.$apply('val = false');
      expect(element.attr('aria-checked')).toBeUndefined();
    });

    it('should attach itself to custom checkbox', function() {
      compileElement('<div role="checkbox" ng-model="val"></div>');

      scope.$apply('val = "checked"');
      expect(element.attr('aria-checked')).toBe('true');

      scope.$apply('val = null');
      expect(element.attr('aria-checked')).toBe('false');
    });

    it('should use `$isEmpty()` to determine if the checkbox is checked',
      function() {
        compileElement('<div role="checkbox" ng-model="val"></div>');
        var ctrl = element.controller('ngModel');
        ctrl.$isEmpty = function(value) {
          return value === 'not-checked';
        };

        scope.$apply('val = true');
        expect(ctrl.$modelValue).toBe(true);
        expect(element.attr('aria-checked')).toBe('true');

        scope.$apply('val = false');
        expect(ctrl.$modelValue).toBe(false);
        expect(element.attr('aria-checked')).toBe('true');

        scope.$apply('val = "not-checked"');
        expect(ctrl.$modelValue).toBe('not-checked');
        expect(element.attr('aria-checked')).toBe('false');

        scope.$apply('val = "checked"');
        expect(ctrl.$modelValue).toBe('checked');
        expect(element.attr('aria-checked')).toBe('true');
      }
    );

    it('should not handle native checkbox with ngChecked', function() {
      var element = $compile('<input type="checkbox" ng-checked="val">')(scope);

      scope.$apply('val = true');
      expect(element.attr('aria-checked')).toBeUndefined();

      scope.$apply('val = false');
      expect(element.attr('aria-checked')).toBeUndefined();
    });

    it('should handle custom checkbox with ngChecked', function() {
      var element = $compile('<div role="checkbox" ng-checked="val">')(scope);

      scope.$apply('val = true');
      expect(element.eq(0).attr('aria-checked')).toBe('true');

      scope.$apply('val = false');
      expect(element.eq(0).attr('aria-checked')).toBe('false');
    });

    it('should not attach to native input type="radio"', function() {
      var element = $compile('<input type="radio" ng-model="val" value="one">' +
                             '<input type="radio" ng-model="val" value="two">')(scope);

      scope.$apply('val=\'one\'');
      expect(element.eq(0).attr('aria-checked')).toBeUndefined();
      expect(element.eq(1).attr('aria-checked')).toBeUndefined();

      scope.$apply('val=\'two\'');
      expect(element.eq(0).attr('aria-checked')).toBeUndefined();
      expect(element.eq(1).attr('aria-checked')).toBeUndefined();
    });

    it('should attach to custom radio controls', function() {
      var element = $compile('<div role="radio" ng-model="val" value="one"></div>' +
          '<div role="radio" ng-model="val" value="two"></div>')(scope);

      scope.$apply('val=\'one\'');
      expect(element.eq(0).attr('aria-checked')).toBe('true');
      expect(element.eq(1).attr('aria-checked')).toBe('false');

      scope.$apply('val=\'two\'');
      expect(element.eq(0).attr('aria-checked')).toBe('false');
      expect(element.eq(1).attr('aria-checked')).toBe('true');
    });

    it('should handle custom radios with integer model values', function() {
      var element = $compile('<div role="radio" ng-model="val" value="0"></div>' +
          '<div role="radio" ng-model="val" value="1"></div>')(scope);

      scope.$apply('val=0');
      expect(element.eq(0).attr('aria-checked')).toBe('true');
      expect(element.eq(1).attr('aria-checked')).toBe('false');

      scope.$apply('val=1');
      expect(element.eq(0).attr('aria-checked')).toBe('false');
      expect(element.eq(1).attr('aria-checked')).toBe('true');
    });

    it('should handle radios with boolean model values using ngValue', function() {
      var element = $compile('<div role="radio" ng-model="val" ng-value="valExp"></div>' +
          '<div role="radio" ng-model="val" ng-value="valExp2"></div>')(scope);

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

    it('should attach itself to role="menuitemradio"', function() {
      scope.val = 'one';
      compileElement('<div role="menuitemradio" ng-model="val" value="one"></div>');
      expect(element.attr('aria-checked')).toBe('true');

      scope.$apply('val = \'two\'');
      expect(element.attr('aria-checked')).toBe('false');
    });

    it('should attach itself to role="menuitemcheckbox"', function() {
      compileElement('<div role="menuitemcheckbox" ng-model="val"></div>');

      scope.$apply('val = "checked"');
      expect(element.attr('aria-checked')).toBe('true');

      scope.$apply('val = null');
      expect(element.attr('aria-checked')).toBe('false');
    });

    it('should not attach itself if an aria-checked value is already present', function() {
      var element = [
        $compile('<div role=\'radio\' ng-model=\'val\' value=\'{{val3}}\' aria-checked=\'userSetValue\'></div>')(scope),
        $compile('<div role=\'menuitemradio\' ng-model=\'val\' value=\'{{val3}}\' aria-checked=\'userSetValue\'></div>')(scope),
        $compile('<div role=\'checkbox\' checked=\'checked\' aria-checked=\'userSetValue\'></div>')(scope),
        $compile('<div role=\'menuitemcheckbox\' checked=\'checked\' aria-checked=\'userSetValue\'></div>')(scope)
      ];
      scope.$apply('val1=true;val2=\'one\';val3=\'1\'');
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
      compileElement('<input type="checkbox" ng-model="val"/>');
      expect(element.attr('role')).toBeUndefined();
    });

    it('should add missing role="radio" to custom input', function() {
      compileElement('<div type="radio" ng-model="val"></div>');
      expect(element.attr('role')).toBe('radio');
    });

    it('should not add a role to a native radio button', function() {
      compileElement('<input type="radio" ng-model="val"/>');
      expect(element.attr('role')).toBeUndefined();
    });

    it('should add missing role="slider" to custom input', function() {
      compileElement('<div type="range" ng-model="val"></div>');
      expect(element.attr('role')).toBe('slider');
    });

    it('should not add a role to a native range input', function() {
      compileElement('<input type="range" ng-model="val"/>');
      expect(element.attr('role')).toBeUndefined();
    });

    they('should not add role to native $prop controls', {
      input: '<input type="text" ng-model="val">',
      select: '<select type="checkbox" ng-model="val"></select>',
      textarea: '<textarea type="checkbox" ng-model="val"></textarea>',
      button: '<button ng-click="doClick()"></button>',
      summary: '<summary ng-click="doClick()"></summary>',
      details: '<details ng-click="doClick()"></details>',
      a: '<a ng-click="doClick()"></a>'
    }, function(tmpl) {
      var element = $compile(tmpl)(scope);
      expect(element.attr('role')).toBeUndefined();
    });
  });

  describe('aria-checked when disabled', function() {
    beforeEach(configAriaProvider({
      ariaChecked: false
    }));
    beforeEach(injectScopeAndCompiler);

    it('should not attach aria-checked', function() {
      compileElement('<div role=\'radio\' ng-model=\'val\' value=\'{{val}}\'></div>');
      expect(element.attr('aria-checked')).toBeUndefined();

      compileElement('<div role=\'menuitemradio\' ng-model=\'val\' value=\'{{val}}\'></div>');
      expect(element.attr('aria-checked')).toBeUndefined();

      compileElement('<div role=\'checkbox\' checked=\'checked\'></div>');
      expect(element.attr('aria-checked')).toBeUndefined();

      compileElement('<div role=\'menuitemcheckbox\' checked=\'checked\'></div>');
      expect(element.attr('aria-checked')).toBeUndefined();
    });
  });

  describe('aria-disabled', function() {
    beforeEach(injectScopeAndCompiler);

    they('should not attach itself to native $prop controls', {
      input: '<input ng-disabled="val">',
      textarea: '<textarea ng-disabled="val"></textarea>',
      select: '<select ng-disabled="val"></select>',
      button: '<button ng-disabled="val"></button>'
    }, function(tmpl) {
      var element = $compile(tmpl)(scope);
      scope.$apply('val = true');

      expect(element.attr('disabled')).toBeDefined();
      expect(element.attr('aria-disabled')).toBeUndefined();
    });

    it('should attach itself to custom controls', function() {
      compileElement('<div ng-disabled="val"></div>');
      expect(element.attr('aria-disabled')).toBe('false');

      scope.$apply('val = true');
      expect(element.attr('aria-disabled')).toBe('true');

    });

    it('should not attach itself if an aria-disabled attribute is already present', function() {
      compileElement('<div ng-disabled="val" aria-disabled="userSetValue"></div>');

      expect(element.attr('aria-disabled')).toBe('userSetValue');
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
      compileElement('<div ng-disabled="val"></div>');

      scope.$apply('val = true');
      expect(element.attr('aria-disabled')).toBeUndefined();
    });
  });

  describe('aria-invalid', function() {
    beforeEach(injectScopeAndCompiler);

    it('should attach aria-invalid to input', function() {
      compileElement('<input ng-model="txtInput" ng-minlength="10">');
      scope.$apply('txtInput=\'LTten\'');
      expect(element.attr('aria-invalid')).toBe('true');

      scope.$apply('txtInput=\'morethantencharacters\'');
      expect(element.attr('aria-invalid')).toBe('false');
    });

    it('should attach aria-invalid to custom controls', function() {
      compileElement('<div ng-model="txtInput" role="textbox" ng-minlength="10"></div>');
      scope.$apply('txtInput=\'LTten\'');
      expect(element.attr('aria-invalid')).toBe('true');

      scope.$apply('txtInput=\'morethantencharacters\'');
      expect(element.attr('aria-invalid')).toBe('false');
    });

    it('should not attach itself if aria-invalid is already present', function() {
      compileElement('<input ng-model="txtInput" ng-minlength="10" aria-invalid="userSetValue">');
      scope.$apply('txtInput=\'LTten\'');
      expect(element.attr('aria-invalid')).toBe('userSetValue');
    });
  });

  describe('aria-invalid when disabled', function() {
    beforeEach(configAriaProvider({
      ariaInvalid: false
    }));
    beforeEach(injectScopeAndCompiler);

    it('should not attach aria-invalid if the option is disabled', function() {
      scope.$apply('txtInput=\'LTten\'');
      compileElement('<input ng-model="txtInput" ng-minlength="10">');
      expect(element.attr('aria-invalid')).toBeUndefined();
    });
  });

  describe('aria-readonly', function() {
    beforeEach(injectScopeAndCompiler);

    they('should not attach itself to native $prop controls', {
      input: '<input ng-readonly="val">',
      textarea: '<textarea ng-readonly="val"></textarea>',
      select: '<select ng-readonly="val"></select>',
      button: '<button ng-readonly="val"></button>'
    }, function(tmpl) {
      var element = $compile(tmpl)(scope);
      scope.$apply('val = true');

      expect(element.attr('readonly')).toBeDefined();
      expect(element.attr('aria-readonly')).toBeUndefined();
    });

    it('should attach itself to custom controls', function() {
      compileElement('<div ng-readonly="val"></div>');
      expect(element.attr('aria-readonly')).toBe('false');

      scope.$apply('val = true');
      expect(element.attr('aria-readonly')).toBe('true');

    });

    it('should not attach itself if an aria-readonly attribute is already present', function() {
      compileElement('<div ng-readonly="val" aria-readonly="userSetValue"></div>');

      expect(element.attr('aria-readonly')).toBe('userSetValue');
    });

    it('should always set aria-readonly to a boolean value', function() {
      compileElement('<div ng-readonly="val"></div>');

      scope.$apply('val = "test angular"');
      expect(element.attr('aria-readonly')).toBe('true');

      scope.$apply('val = null');
      expect(element.attr('aria-readonly')).toBe('false');

      scope.$apply('val = {}');
      expect(element.attr('aria-readonly')).toBe('true');
    });
  });

  describe('aria-readonly when disabled', function() {
    beforeEach(configAriaProvider({
      ariaReadonly: false
    }));
    beforeEach(injectScopeAndCompiler);

    it('should not add the aria-readonly attribute', function() {
      compileElement('<input ng-model=\'val\' readonly>');
      expect(element.attr('aria-readonly')).toBeUndefined();

      compileElement('<div ng-model=\'val\' ng-readonly=\'true\'></div>');
      expect(element.attr('aria-readonly')).toBeUndefined();
    });
  });

  describe('aria-required', function() {
    beforeEach(injectScopeAndCompiler);

    it('should not attach to input', function() {
      compileElement('<input ng-model="val" required>');
      expect(element.attr('aria-required')).toBeUndefined();
    });

    it('should attach to custom controls with ngModel and required', function() {
      compileElement('<div ng-model="val" role="checkbox" required></div>');
      expect(element.attr('aria-required')).toBe('true');
    });

    it('should set aria-required to false when ng-required is false', function() {
      compileElement('<div role=\'checkbox\' ng-required=\'false\' ng-model=\'val\'></div>');
      expect(element.attr('aria-required')).toBe('false');
    });

    it('should attach to custom controls with ngRequired', function() {
      compileElement('<div role="checkbox" ng-model="val" ng-required="true"></div>');
      expect(element.attr('aria-required')).toBe('true');
    });

    it('should not attach itself if aria-required is already present', function() {
      compileElement('<div role=\'checkbox\' ng-model=\'val\' ng-required=\'true\' aria-required=\'userSetValue\'></div>');
      expect(element.attr('aria-required')).toBe('userSetValue');
    });
  });

  describe('aria-required when disabled', function() {
    beforeEach(configAriaProvider({
      ariaRequired: false
    }));
    beforeEach(injectScopeAndCompiler);

    it('should not add the aria-required attribute', function() {
      compileElement('<input ng-model=\'val\' required>');
      expect(element.attr('aria-required')).toBeUndefined();

      compileElement('<div ng-model=\'val\' ng-required=\'true\'></div>');
      expect(element.attr('aria-required')).toBeUndefined();
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
      expectAriaAttrOnEachElement(element, 'aria-valuenow', '50');
      expectAriaAttrOnEachElement(element, 'aria-valuemin', '0');
      expectAriaAttrOnEachElement(element, 'aria-valuemax', '100');

      scope.$apply('val = 90');
      expectAriaAttrOnEachElement(element, 'aria-valuenow', '90');
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
      expectAriaAttrOnEachElement(element, 'aria-live', 'assertive');
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

    they('should not attach to native control $prop', {
      'button': '<button ng-click=\'something\'></button>',
      'a': '<a ng-href=\'#/something\'>',
      'input[text]': '<input type=\'text\' ng-model=\'val\'>',
      'input[radio]': '<input type=\'radio\' ng-model=\'val\'>',
      'input[checkbox]': '<input type=\'checkbox\' ng-model=\'val\'>',
      'textarea': '<textarea ng-model=\'val\'></textarea>',
      'select': '<select ng-model=\'val\'></select>',
      'details': '<details ng-model=\'val\'></details>'
    }, function(html) {
        compileElement(html);
        expect(element.attr('tabindex')).toBeUndefined();
    });

    it('should not attach to random ng-model elements', function() {
      compileElement('<div ng-model="val"></div>');
      expect(element.attr('tabindex')).toBeUndefined();
    });

    it('should attach tabindex to custom inputs', function() {
      compileElement('<div role="checkbox" ng-model="val"></div>');
      expect(element.attr('tabindex')).toBe('0');

      compileElement('<div role="slider" ng-model="val"></div>');
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

      divElement.triggerHandler({type: 'keydown', keyCode: 32});
      liElement.triggerHandler({type: 'keydown', keyCode: 32});

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

      divElement.triggerHandler({type: 'keydown', which: 32});
      liElement.triggerHandler({type: 'keydown', which: 32});

      expect(clickFn).toHaveBeenCalledWith('div');
      expect(clickFn).toHaveBeenCalledWith('li');
    });

    it('should not bind to key events if there is existing ng-keydown', function() {
      scope.onClick = jasmine.createSpy('onClick');
      scope.onKeydown = jasmine.createSpy('onKeydown');

      var tmpl = '<div ng-click="onClick()" ng-keydown="onKeydown()" tabindex="0"></div>';
      compileElement(tmpl);

      element.triggerHandler({type: 'keydown', keyCode: 32});

      expect(scope.onKeydown).toHaveBeenCalled();
      expect(scope.onClick).not.toHaveBeenCalled();
    });

    it('should not bind to key events if there is existing ng-keypress', function() {
      scope.onClick = jasmine.createSpy('onClick');
      scope.onKeypress = jasmine.createSpy('onKeypress');

      var tmpl = '<div ng-click="onClick()" ng-keypress="onKeypress()" tabindex="0"></div>';
      compileElement(tmpl);

      element.triggerHandler({type: 'keypress', keyCode: 32});

      expect(scope.onKeypress).toHaveBeenCalled();
      expect(scope.onClick).not.toHaveBeenCalled();
    });

    it('should not bind to key events if there is existing ng-keyup', function() {
      scope.onClick = jasmine.createSpy('onClick');
      scope.onKeyup = jasmine.createSpy('onKeyup');

      var tmpl = '<div ng-click="onClick()" ng-keyup="onKeyup()" tabindex="0"></div>';
      compileElement(tmpl);

      element.triggerHandler({type: 'keyup', keyCode: 32});

      expect(scope.onKeyup).toHaveBeenCalled();
      expect(scope.onClick).not.toHaveBeenCalled();
    });

    it('should update bindings when keydown is handled', function() {
      compileElement('<div ng-click="text = \'clicked!\'">{{text}}</div>');
      expect(element.text()).toBe('');
      spyOn(scope.$root, '$digest').and.callThrough();
      element.triggerHandler({ type: 'keydown', keyCode: 13 });
      expect(element.text()).toBe('clicked!');
      expect(scope.$root.$digest).toHaveBeenCalledOnce();
    });

    it('should pass $event to ng-click handler as local', function() {
      compileElement('<div ng-click="event = $event">{{event.type}}' +
                      '{{event.keyCode}}</div>');
      expect(element.text()).toBe('');
      element.triggerHandler({ type: 'keydown', keyCode: 13 });
      expect(element.text()).toBe('keydown13');
    });

    it('should not bind keydown to natively interactive elements', function() {
      compileElement('<button ng-click="event = $event">{{event.type}}{{event.keyCode}}</button>');
      expect(element.text()).toBe('');
      element.triggerHandler({ type: 'keydown', keyCode: 13 });
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

  describe('actions when bindKeydown is set to false', function() {
    beforeEach(configAriaProvider({
      bindKeydown: false
    }));
    beforeEach(injectScopeAndCompiler);

    it('should not trigger click', function() {
      scope.someAction = jasmine.createSpy('someAction');

      element = $compile('<div ng-click="someAction()" tabindex="0"></div>')(scope);

      element.triggerHandler({type: 'keydown', keyCode: 13});
      element.triggerHandler({type: 'keydown', keyCode: 32});
      element.triggerHandler({type: 'keypress', keyCode: 13});
      element.triggerHandler({type: 'keypress', keyCode: 32});
      element.triggerHandler({type: 'keyup', keyCode: 13});
      element.triggerHandler({type: 'keyup', keyCode: 32});

      expect(scope.someAction).not.toHaveBeenCalled();

      element.triggerHandler({type: 'click', keyCode: 32});

      expect(scope.someAction).toHaveBeenCalledOnce();
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

  describe('ngModel', function() {
    it('should not break when manually compiling', function() {
      module(function($compileProvider) {
        $compileProvider.directive('foo', function() {
          return {
            priority: 10,
            terminal: true,
            link: function(scope, elem) {
              $compile(elem, null, 10)(scope);
            }
          };
        });
      });

      injectScopeAndCompiler();
      compileElement('<div role="checkbox" ng-model="value" foo />');

      // Just check an arbitrary feature to make sure it worked
      expect(element.attr('tabindex')).toBe('0');
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
