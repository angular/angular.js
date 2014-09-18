'use strict';

function expectAriaAttr(elem, ariaAttr, expected){
  angular.forEach(elem, function(val){
    expect(angular.element(val).attr(ariaAttr)).toBe(expected);
  });
}

describe('$aria', function(){

  describe('aria-hidden', function(){
    beforeEach(module('ngAria'));

    it('should attach aria-hidden to ng-show', inject(function($compile, $rootScope){
      var element = $compile("<div ng-show='val'></div>")($rootScope);
      $rootScope.$apply('val=false');
      expectAriaAttr(element, 'aria-hidden', 'true');
      $rootScope.$apply('val=true');
      expectAriaAttr(element, 'aria-hidden', 'false');
    }));

    it('should attach aria-hidden to ng-hide', inject(function($compile, $rootScope){
      var element = $compile("<div ng-hide='val'></div>")($rootScope);
      $rootScope.$apply('val=false');
      expectAriaAttr(element, 'aria-hidden', 'false');
      $rootScope.$apply('val=true');
      expectAriaAttr(element, 'aria-hidden', 'true');
    }));

    it('should not attach if an aria-hidden is already present', inject(function($compile, $rootScope){
      var element = [
        $compile('<div ng-show="val" aria-hidden="userSetValue"></div>')($rootScope),
        $compile('<div ng-hide="val" aria-hidden="userSetValue"></div>')($rootScope)
      ];
      $rootScope.$apply('val=true');
      expectAriaAttr(element, 'aria-hidden', 'userSetValue');
    }));

    describe('disabled', function(){
      beforeEach(function(){
        angular.module('ariaTest', ['ngAria']).config(function($ariaProvider){
          $ariaProvider.config({
            ariaHidden : false
          });
        });

        module('ariaTest');
      });

      it('should not attach aria-hidden if the option is disabled', inject(function($compile, $rootScope){
        var element = [
          $compile("<div ng-show='val'></div>")($rootScope),
          $compile("<div ng-hide='val'></div>")($rootScope)
        ];
        $rootScope.$apply('val=false');
        expectAriaAttr(element, 'aria-hidden', undefined);
      }));
    });
  });

  describe('aria-checked', function(){
    beforeEach(module('ngAria'));

    it('should attach itself to input type=checkbox', inject(function($compile, $rootScope){
      var element = $compile("<input type='checkbox' ng-model='val' ng-init='val = true'>")($rootScope);
      $rootScope.$apply('val=true');
      expectAriaAttr(element, 'aria-checked', 'true');
      $rootScope.$apply('val=false');
      expectAriaAttr(element, 'aria-checked', 'false');
    }));

    it('should attach itself to input type=radio', inject(function($compile, $rootScope){
      var element = $compile("<input type='radio' ng-model='val' value='one'><input type='radio' ng-model='val' value='two'>")($rootScope);
      $rootScope.$apply("val='one'");
      expect(angular.element(element).eq(0).attr('aria-checked')).toBe('true');
      expect(angular.element(element).eq(1).attr('aria-checked')).toBe('false');

      $rootScope.$apply("val='two'");
      expect(angular.element(element).eq(0).attr('aria-checked')).toBe('false');
      expect(angular.element(element).eq(1).attr('aria-checked')).toBe('true');
    }));

    it('should attach itself to role="radio", role="checkbox", role="menuitemradio" and role="menuitemcheckbox"', inject(function($compile, $rootScope){
      var element = [
        $compile("<div role='radio' ng-model='val' value='{{val}}'></div>")($rootScope),
        $compile("<div role='menuitemradio' ng-model='val' value='{{val}}'></div>")($rootScope),
        $compile("<div role='checkbox' checked='checked'></div>")($rootScope),
        $compile("<div role='menuitemcheckbox' checked='checked'></div>")($rootScope)
      ];
      $rootScope.$apply("val='one'");
      expectAriaAttr(element, 'aria-checked', 'true');
    }));

    it('should not attach itself if an aria-checked value is already present', inject(function($compile, $rootScope){
      var element = [
        $compile("<input type='checkbox' ng-model='val1' aria-checked='userSetValue'>")($rootScope),
        $compile("<input type='radio' ng-model='val2' value='one' aria-checked='userSetValue'><input type='radio' ng-model='val2' value='two'>")($rootScope),
        $compile("<div role='radio' ng-model='val' value='{{val3}}' aria-checked='userSetValue'></div>")($rootScope),
        $compile("<div role='menuitemradio' ng-model='val' value='{{val3}}' aria-checked='userSetValue'></div>")($rootScope),
        $compile("<div role='checkbox' checked='checked' aria-checked='userSetValue'></div>")($rootScope),
        $compile("<div role='menuitemcheckbox' checked='checked' aria-checked='userSetValue'></div>")($rootScope)
      ];
      $rootScope.$apply("val1=true;val2='one';val3='1'");
      expectAriaAttr(element, 'aria-checked', 'userSetValue');
    }));

    describe('disabled', function(){
      beforeEach(function(){
        angular.module('ariaTest', ['ngAria']).config(function($ariaProvider){
          $ariaProvider.config({
            ariaChecked : false
          });
        });

        module('ariaTest');
      });

      it('should not attach aria-checked if the option is disabled', inject(function($compile, $rootScope){
        var element = [
          $compile("<div role='radio' ng-model='val' value='{{val}}'></div>")($rootScope),
          $compile("<div role='menuitemradio' ng-model='val' value='{{val}}'></div>")($rootScope),
          $compile("<div role='checkbox' checked='checked'></div>")($rootScope),
          $compile("<div role='menuitemcheckbox' checked='checked'></div>")($rootScope)
        ];
        $rootScope.$digest();
        expectAriaAttr(element, 'aria-checked', undefined);
      }));
    });
  });

  describe('aria-disabled', function(){
    beforeEach(module('ngAria'));

    it('should attach itself to input, textarea, button and select', inject(function($compile, $rootScope){
      var element = [
        $compile("<input ng-disabled='val'>")($rootScope),
        $compile("<textarea ng-disabled='val'></textarea>")($rootScope),
        $compile("<button ng-disabled='val'></button>")($rootScope),
        $compile("<select ng-disabled='val'></select>")($rootScope)
      ];
      $rootScope.$apply('val=false');
      expectAriaAttr(element, 'aria-disabled', 'false');

      $rootScope.$apply('val=true');
      expectAriaAttr(element, 'aria-disabled', 'true');
    }));

    it('should not attach itself if an aria tag is already present', inject(function($compile, $rootScope){
      var element = [
        $compile("<input aria-disabled='userSetValue' ng-disabled='val'>")($rootScope),
        $compile("<textarea aria-disabled='userSetValue' ng-disabled='val'></textarea>")($rootScope),
        $compile("<button aria-disabled='userSetValue' ng-disabled='val'></button>")($rootScope),
        $compile("<select aria-disabled='userSetValue' ng-disabled='val'></select>")($rootScope)
      ];

      $rootScope.$apply('val=true');
      expectAriaAttr(element, 'aria-disabled', 'userSetValue');
    }));

    describe('disabled', function(){
      beforeEach(function(){
        angular.module('ariaTest', ['ngAria']).config(function($ariaProvider){
          $ariaProvider.config({
            ariaDisabled : false
          });
        });

        module('ariaTest');
      });

      it('should not attach aria-disabled if the option is disabled', inject(function($compile, $rootScope){
        var element = [
          $compile("<input ng-disabled='val'>")($rootScope),
          $compile("<textarea ng-disabled='val'></textarea>")($rootScope),
          $compile("<button ng-disabled='val'></button>")($rootScope),
          $compile("<select ng-disabled='val'></select>")($rootScope)
        ];

        $rootScope.$apply('val=false');
        expectAriaAttr(element, 'aria-disabled', undefined);
      }));
    });
  });

  describe('aria-invalid', function(){
    beforeEach(module('ngAria'));

    it('should attach aria-invalid to input', inject(function($compile, $rootScope){
      var element = $compile("<input ng-model='txtInput' ng-minlength='10'>")($rootScope);
      $rootScope.$apply("txtInput='LTten'");
      expectAriaAttr(element, 'aria-invalid', 'true');

      $rootScope.$apply("txtInput='morethantencharacters'");
      expectAriaAttr(element, 'aria-invalid', 'false');
    }));

    it('should not attach itself if aria-invalid is already present', inject(function($compile, $rootScope){
      var element = $compile("<input ng-model='txtInput' ng-minlength='10' aria-invalid='userSetValue'>")($rootScope);
      $rootScope.$apply("txtInput='LTten'");
      expectAriaAttr(element, 'aria-invalid', 'userSetValue');
    }));

    describe('disabled', function(){
      beforeEach(function(){
        angular.module('ariaTest', ['ngAria']).config(function($ariaProvider){
          $ariaProvider.config({
            ariaInvalid : false
          });
        });

        module('ariaTest');
      });

      it('should not attach aria-invalid if the option is disabled', inject(function($compile, $rootScope){
        var element = $compile("<input ng-model='txtInput' ng-minlength='10'>")($rootScope);
        $rootScope.$apply("txtInput='LTten'");
        expectAriaAttr(element, 'aria-invalid', undefined);
      }));
    });
  });

  describe('aria-required', function(){
    beforeEach(module('ngAria'));

    it('should attach aria-required to input, textarea, select and ngRequired', inject(function($compile, $rootScope){
      var element = [
        $compile("<input ng-model='val' required>")($rootScope),
        $compile("<textarea ng-model='val' required></textarea>")($rootScope),
        $compile("<select ng-model='val' required></select>")($rootScope),
        $compile("<input ng-model='val' ng-required='true'>")($rootScope)
      ];
      $rootScope.$digest();
      expectAriaAttr(element, 'aria-required', 'true');

      element = [
        $compile("<input ng-model='val'>")($rootScope),
        $compile("<textarea ng-model='val'></textarea>")($rootScope),
        $compile("<select ng-model='val'></select>")($rootScope),
        $compile("<input ng-model='val' ng-required='false'>")($rootScope)
      ];
      $rootScope.$apply("val='input is valid now'");
      expectAriaAttr(element, 'aria-required', 'false');
    }));

    it('should not attach itself if aria-required is already present', inject(function($compile, $rootScope){
      var element = [
        $compile("<input ng-model='val' required aria-required='userSetValue'>")($rootScope),
        $compile("<textarea ng-model='val' required aria-required='userSetValue'></textarea>")($rootScope),
        $compile("<select ng-model='val' required aria-required='userSetValue'></select>")($rootScope),
        $compile("<input ng-model='val' ng-required='true' aria-required='userSetValue'>")($rootScope)
      ];

      $rootScope.$digest();
      expectAriaAttr(element, 'aria-required', 'userSetValue');
    }));

    describe('disabled', function(){
      beforeEach(function(){
        angular.module('ariaTest', ['ngAria']).config(function($ariaProvider){
          $ariaProvider.config({
            ariaRequired : false
          });
        });

        module('ariaTest');
      });

      it('should not attach aria-required when the option is disabled', inject(function($compile, $rootScope){
        var element = [
          $compile("<input ng-model='val' required>")($rootScope),
          $compile("<textarea ng-model='val' required></textarea>")($rootScope),
          $compile("<select ng-model='val' required></select>")($rootScope)
        ];

        $rootScope.$digest();
        expectAriaAttr(element, 'aria-required', undefined);
      }));
    });
  });

  describe('aria-multiline', function(){
    beforeEach(module('ngAria'));

    it('should attach aria-multiline to textbox and role="textbox"', inject(function($compile, $rootScope){
      var element = [
        $compile("<textarea></textarea>")($rootScope),
        $compile("<div role='textbox'></div>")($rootScope)
      ];

      $rootScope.$digest();
      expectAriaAttr(element, 'aria-multiline', 'true');
    }));

    it('should not attach if aria-multiline is already present', inject(function($compile, $rootScope){
      var element = [
        $compile("<textarea aria-multiline='userSetValue'></textarea>")($rootScope),
        $compile("<div role='textbox' aria-multiline='userSetValue'></div>")($rootScope)
      ];

      $rootScope.$digest();
      expectAriaAttr(element, 'aria-multiline', 'userSetValue');
    }));

    describe('disabled', function(){
      beforeEach(function(){
        angular.module('ariaTest', ['ngAria']).config(function($ariaProvider){
          $ariaProvider.config({
            ariaMultiline : false
          });
        });

        module('ariaTest');
      });

      it('should not attach itself to textbox or role="textbox" when disabled', inject(function($compile, $rootScope){
        var element = [
          $compile("<textarea></textarea>")($rootScope),
          $compile("<div role='textbox'></div>")($rootScope)
        ];

        $rootScope.$digest();
        expectAriaAttr(element, 'aria-multiline', undefined);
      }));
    });
  });

  describe('aria-value', function(){
    beforeEach(module('ngAria'));

    it('should attach to input type="range"', inject(function($compile, $rootScope){
      var element = [
        $compile('<input type="range" ng-model="val" min="0" max="100">')($rootScope),
        $compile('<div role="progressbar" min="0" max="100" ng-model="val">')($rootScope),
        $compile('<div role="slider" min="0" max="100" ng-model="val">')($rootScope)
      ];

      $rootScope.$apply('val=50');
      expectAriaAttr(element, 'aria-valuenow', "50");
      expectAriaAttr(element, 'aria-valuemin', "0");
      expectAriaAttr(element, 'aria-valuemax', "100");

      $rootScope.$apply('val=90');
      expectAriaAttr(element, 'aria-valuenow', "90");
    }));

    it('should not attach if aria-value* is already present', inject(function($compile, $rootScope){
      var element = [
        $compile('<input type="range" ng-model="val" min="0" max="100" aria-valuenow="userSetValue1" aria-valuemin="userSetValue2" aria-valuemax="userSetValue3">')($rootScope),
        $compile('<div role="progressbar" min="0" max="100" ng-model="val" aria-valuenow="userSetValue1" aria-valuemin="userSetValue2" aria-valuemax="userSetValue3">')($rootScope),
        $compile('<div role="slider" min="0" max="100" ng-model="val" aria-valuenow="userSetValue1" aria-valuemin="userSetValue2" aria-valuemax="userSetValue3">')($rootScope)
      ];

      $rootScope.$apply('val=50');
      expectAriaAttr(element, 'aria-valuenow', "userSetValue1");
      expectAriaAttr(element, 'aria-valuemin', "userSetValue2");
      expectAriaAttr(element, 'aria-valuemax', "userSetValue3");
    }));

    describe('disabled', function(){
      beforeEach(function(){
        angular.module('ariaTest', ['ngAria']).config(function($ariaProvider){
          $ariaProvider.config({
            ariaValue : false
          });
        });

        module('ariaTest');
      });

      it('should not attach itself when the option is disabled', inject(function($compile, $rootScope){
        var element = [
          $compile('<input type="range" ng-model="val" min="0" max="100">')($rootScope),
          $compile('<div role="progressbar" min="0" max="100" ng-model="val">')($rootScope)
        ];

        $rootScope.$apply('val=50');
        expectAriaAttr(element, 'aria-valuenow', undefined);
        expectAriaAttr(element, 'aria-valuemin', undefined);
        expectAriaAttr(element, 'aria-valuemax', undefined);
      }));
    });
  });

  describe('tabindex', function(){
    beforeEach(module('ngAria'));

    it('should attach tabindex to role=button, role=checkbox, ng-click and ng-dblclick', inject(function($compile, $rootScope){
      var element = [
        $compile("<div role='button'></div>")($rootScope),
        $compile("<div role='checkbox'></div>")($rootScope),
        $compile("<div ng-click='someAction()'></div>")($rootScope),
        $compile("<div ng-dblclick='someAction()'></div>")($rootScope)
      ];
      $rootScope.$digest();

      expectAriaAttr(element, 'tabindex', '0');
    }));

    it('should not attach tabindex to role=button, role=checkbox and ng-click if they are already present', inject(function($compile, $rootScope){
      var element = [
        $compile("<div role='button' tabindex='userSetValue'></div>")($rootScope),
        $compile("<div role='checkbox' tabindex='userSetValue'></div>")($rootScope),
        $compile("<div ng-click='someAction()' tabindex='userSetValue'></div>")($rootScope),
        $compile("<div ng-dblclick='someAction()' tabindex='userSetValue'></div>")($rootScope)
      ];
      $rootScope.$digest();

      expectAriaAttr(element, 'tabindex', 'userSetValue');
    }));

    it('should set proper tabindex values for radiogroup', inject(function($compile, $rootScope){
      var element = $compile("<div role='radiogroup'><div role='radio' ng-model='val' value='one'>1</div><div role='radio' ng-model='val' value='two'>2</div></div>")($rootScope);

      $rootScope.$apply("val='one'");
      expect(angular.element(angular.element(element).children()[0]).attr('tabindex')).toBe('0');
      expect(angular.element(angular.element(element).children()[1]).attr('tabindex')).toBe('-1');

      $rootScope.$apply("val='two'");
      expect(angular.element(angular.element(element).children()[0]).attr('tabindex')).toBe('-1');
      expect(angular.element(angular.element(element).children()[1]).attr('tabindex')).toBe('0');

      dealoc(element);
    }));

    describe('disabled', function(){
      beforeEach(function(){
        angular.module('ariaTest', ['ngAria']).config(function($ariaProvider){
          $ariaProvider.config({
            tabindex : false
          });
        });

        module('ariaTest');
      });
      it('should not attach when disabled', inject(function($compile, $rootScope){
        var element = [
          $compile("<div role='button'></div>")($rootScope),
          $compile("<div role='checkbox'></div>")($rootScope),
          $compile("<div ng-click='someAction()'></div>")($rootScope),
          $compile("<div ng-dblclick='someAction()'></div>")($rootScope)
        ];
        $rootScope.$digest();
        expectAriaAttr(element, 'tabindex', undefined);
      }));
    });
  });
});
