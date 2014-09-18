'use strict';

/**
 * @ngdoc module
 * @name ngAria
 * @description
 *
 * The `ngAria` module provides support for to embed aria tags that convey state or semantic information
 * about the application in order to allow assistive technologies to convey appropriate information to
 * persons with disabilities.
 *
 * <div doc-module-components="ngAria"></div>
 *
 * # Usage
 * To enable the addition of the aria tags, just require the module into your application and the tags will
 * hook into your ng-show/ng-hide, input, textarea, button, select and ng-required directives and adds the
 * appropriate aria-tags.
 *
 * Currently, the following aria tags are implemented:
 *
 * + aria-hidden
 * + aria-checked
 * + aria-disabled
 * + aria-required
 * + aria-invalid
 * + aria-multiline
 * + aria-valuenow
 * + aria-valuemin
 * + aria-valuemax
 * + tabindex
 *
 * You can disable individual aria tags by using the {@link ngAria.$ariaProvider#config config} method.
 */

 /* global -ngAriaModule */
var ngAriaModule = angular.module('ngAria', ['ng']).
                        provider('$aria', $AriaProvider);

/**
 * @ngdoc provider
 * @name $ariaProvider
 *
 * @description
 *
 * Used for configuring aria attributes.
 *
 * ## Dependencies
 * Requires the {@link ngAria `ngAria`} module to be installed.
 */
function $AriaProvider(){
  var config = {
    ariaHidden : true,
    ariaChecked: true,
    ariaDisabled: true,
    ariaRequired: true,
    ariaInvalid: true,
    ariaMultiline: true,
    ariaValue: true,
    tabindex: true
  };

  /**
   * @ngdoc method
   * @name $ariaProvider#config
   *
   * @param {object} config object to enable/disable specific aria tags
   *
   *  - **ariaHidden** – `{boolean}` – Enables/disables aria-hidden tags
   *  - **ariaChecked** – `{boolean}` – Enables/disables aria-checked tags
   *  - **ariaDisabled** – `{boolean}` – Enables/disables aria-disabled tags
   *  - **ariaRequired** – `{boolean}` – Enables/disables aria-required tags
   *  - **ariaInvalid** – `{boolean}` – Enables/disables aria-invalid tags
   *  - **ariaMultiline** – `{boolean}` – Enables/disables aria-multiline tags
   *  - **ariaValue** – `{boolean}` – Enables/disables aria-valuemin, aria-valuemax and aria-valuenow tags
   *  - **tabindex** – `{boolean}` – Enables/disables tabindex tags
   *
   * @description
   * Enables/disables various aria tags
   */
  this.config = function(newConfig){
    config = angular.extend(config, newConfig);
  };

  var convertCase = function(input){
    return input.replace(/[A-Z]/g, function(letter, pos){
      return (pos ? '-' : '') + letter.toLowerCase();
    });
  };

  var watchAttr = function(attrName, ariaName){
    return function(scope, elem, attr){
      if(config[ariaName] && !elem.attr(convertCase(ariaName))){
        if(attr[attrName]){
          elem.attr(convertCase(ariaName), true);
        }
        var destroyWatcher = attr.$observe(attrName, function(newVal){
          elem.attr(convertCase(ariaName), !angular.isUndefined(newVal));
        });
        scope.$on('$destroy', function(){
          destroyWatcher();
        });
      }
    };
  };

  var watchClass = function(className, ariaName){
    return function(scope, elem, attr){
      if(config[ariaName] && !elem.attr(convertCase(ariaName))){
        var destroyWatcher = scope.$watch(function(){
          return elem.attr('class');
        }, function(){
          elem.attr(convertCase(ariaName), elem.hasClass(className));
        });
        scope.$on('$destroy', function(){
          destroyWatcher();
        });
      }
    };
  };

  var watchExpr = function(expr, ariaName){
    return function(scope, elem, attr){
      if(config[ariaName] && !elem.attr(convertCase(ariaName))){
        var destroyWatch;
        var destroyObserve = attr.$observe(expr, function(value){
          if(angular.isFunction(destroyWatch)){
            destroyWatch();
          }
          destroyWatch = scope.$watch(value, function(newVal){
            elem.attr(convertCase(ariaName), newVal);
          });
        });
        scope.$on('$destroy', function(){
          destroyObserve();
        });
      }
    };
  };

  this.$get = function(){
    return {
      ariaHidden: watchClass('ng-hide', 'ariaHidden'),
      ariaChecked: watchExpr('ngModel', 'ariaChecked'),
      ariaDisabled: watchExpr('ngDisabled', 'ariaDisabled'),
      ariaNgRequired: watchExpr('ngRequired', 'ariaRequired'),
      ariaRequired: watchAttr('required', 'ariaRequired'),
      ariaInvalid: watchClass('ng-invalid', 'ariaInvalid'),
      ariaValue: function(scope, elem, attr, ngModel){
        if(config.ariaValue){
          if(attr.min && !elem.attr('aria-valuemin')){
            elem.attr('aria-valuemin', attr.min);
          }
          if(attr.max && !elem.attr('aria-valuemax')){
            elem.attr('aria-valuemax', attr.max);
          }
          if(ngModel && !elem.attr('aria-valuenow')){
            var destroyWatcher = scope.$watch(function(){
              return ngModel.$modelValue;
            }, function(newVal){
              elem.attr('aria-valuenow', newVal);
            });
            scope.$on('$destroy', function(){
              destroyWatcher();
            });
          }
        }
      },
      radio: function(scope, elem, attr, ngModel){
        if(config.ariaChecked && ngModel && !elem.attr('aria-checked')){
          var needsTabIndex = config.tabindex && !elem.attr('tabindex');
          var destroyWatcher = scope.$watch(function(){
            return ngModel.$modelValue;
          }, function(newVal){
            if(newVal === attr.value){
              elem.attr('aria-checked', true);
              if(needsTabIndex){
                elem.attr('tabindex', 0);
              }
            }else{
              elem.attr('aria-checked', false);
              if(needsTabIndex){
                elem.attr('tabindex', -1);
              }
            }
          });
          scope.$on('$destroy', function(){
            destroyWatcher();
          });
        }
      },
      multiline: function(scope, elem, attr){
        if(config.ariaMultiline && !elem.attr('aria-multiline')){
          elem.attr('aria-multiline', true);
        }
      },
      roleChecked: function(scope, elem, attr){
        if(config.ariaChecked && attr.checked && !elem.attr('aria-checked')){
          elem.attr('aria-checked', true);
        }
      },
      tabindex: function(scope, elem, attr){
        if(config.tabindex && !elem.attr('tabindex')){
          elem.attr('tabindex', 0);
        }
      }
    };
  };
}

ngAriaModule.directive('ngShow', ['$aria', function($aria){
  return $aria.ariaHidden;
}]).directive('ngHide', ['$aria', function($aria){
  return $aria.ariaHidden;
}]).directive('input', ['$aria', function($aria){
  return{
    restrict: 'E',
    require: '?ngModel',
    link: function(scope, elem, attr, ngModel){
      if(attr.type === 'checkbox'){
        $aria.ariaChecked(scope, elem, attr);
      }
      if(attr.type === 'radio'){
        $aria.radio(scope, elem, attr, ngModel);
      }
      $aria.ariaRequired(scope, elem, attr);
      $aria.ariaInvalid(scope, elem, attr);
      if(attr.type === 'range'){
        $aria.ariaValue(scope, elem, attr, ngModel);
      }
    }
  };
}]).directive('textarea', ['$aria', function($aria){
  return{
    restrict: 'E',
    link: function(scope, elem, attr){
      $aria.ariaRequired(scope, elem, attr);
      $aria.ariaInvalid(scope, elem, attr);
      $aria.multiline(scope, elem, attr);
    }
  };
}]).directive('select', ['$aria', function($aria){
  return{
    restrict: 'E',
    link: function(scope, elem, attr){
      $aria.ariaRequired(scope, elem, attr);
    }
  };
}])
.directive('ngRequired', ['$aria', function($aria){
  return $aria.ariaNgRequired;
}])
.directive('ngDisabled', ['$aria', function($aria){
  return $aria.ariaDisabled;
}])
.directive('role', ['$aria', function($aria){
  return{
    restrict: 'A',
    require: '?ngModel',
    link: function(scope, elem, attr, ngModel){
      if(attr.role === 'textbox'){
        $aria.multiline(scope, elem, attr);
      }
      if(attr.role === "progressbar" || attr.role === "slider"){
        $aria.ariaValue(scope, elem, attr, ngModel);
      }
      if(attr.role === "checkbox" || attr.role === "menuitemcheckbox"){
        $aria.roleChecked(scope, elem, attr);
        $aria.tabindex(scope, elem, attr);
      }
      if(attr.role === "radio" || attr.role === "menuitemradio"){
        $aria.radio(scope, elem, attr, ngModel);
      }
      if(attr.role === "button"){
        $aria.tabindex(scope, elem, attr);
      }
    }
  };
}])
.directive('ngClick', ['$aria', function($aria){
  return $aria.tabindex;
}])
.directive('ngDblclick', ['$aria', function($aria){
  return $aria.tabindex;
}]);
