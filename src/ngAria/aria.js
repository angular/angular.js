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
function $AriaProvider() {
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
  this.config = function(newConfig) {
    config = angular.extend(config, newConfig);
  };

  function dashCase(input) {
    return input.replace(/[A-Z]/g, function(letter, pos) {
      return (pos ? '-' : '') + letter.toLowerCase();
    });
  }

  function watchExpr(attrName, ariaName, negate) {
    var ariaDashName = dashCase(ariaName);
    return function(scope, elem, attr) {
      if (config[ariaName] && !attr[ariaName]) {
        scope.$watch(attr[attrName], function(boolVal) {
          if (negate) {
            boolVal = !boolVal;
          }
          elem.attr(ariaDashName, boolVal);
        });
      }
    };
  }

  this.$get = function() {
    return {
      config: function (key) {
        return config[key];
      },
      $$watchExpr: watchExpr
    };
  };
}

var ngAriaTabindex = ['$aria', function($aria) {
  return function(scope, elem, attr) {
    if ($aria.config('tabindex') && !elem.attr('tabindex')) {
      elem.attr('tabindex', 0);
    }
  };
}];

ngAriaModule.directive('ngShow', ['$aria', function($aria) {
  return $aria.$$watchExpr('ngShow', 'ariaHidden', true);
}])
.directive('ngHide', ['$aria', function($aria) {
  return $aria.$$watchExpr('ngHide', 'ariaHidden', false);
}])
.directive('ngModel', ['$aria', function($aria) {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function(scope, elem, attr, ngModel) {
      var type = attr.type,
          role = attr.role;

      var checkboxLike  = (type || role) === 'checkbox' || role === 'menuitemcheckbox',
          radioLike     = (type || role) === 'radio'    || role === 'menuitemradio',
          rangeLike     = type === 'range'              || role === 'progressbar' || role === 'slider',
          multilineLike = (type || role) === 'textbox'  || elem[0].nodeName === 'TEXTAREA';

      function shouldAttachAriaAttr(name) {
        return $aria.config('aria' + name[0].toUpperCase() + name.substr(1)) && !elem.attr('aria-' + name);
      }

      var needsTabIndex = $aria.config('tabindex') && !elem.attr('tabindex');

      if ((checkboxLike || radioLike) && shouldAttachAriaAttr('checked')) {

        var checkboxReaction;

        if (radioLike) {
          if (needsTabIndex) {
            checkboxReaction = function(newVal) {
              var boolVal = newVal === attr.value;
              elem.attr('aria-checked', boolVal);
              elem.attr('tabindex', 0 - !boolVal);
            };
            needsTabIndex = false;
          } else {
            checkboxReaction = function(newVal) {
              elem.attr('aria-checked', newVal === attr.value);
            };
          }
        } else {
          checkboxReaction = function(newVal) {
            elem.attr('aria-checked', !!newVal);
          };
        }

        scope.$watch(function() {
          return ngModel.$modelValue;
        }, checkboxReaction);

      } else if (rangeLike && $aria.config('ariaValue')) {
        if (attr.min && !elem.attr('aria-valuemin')) {
          elem.attr('aria-valuemin', attr.min);
        }
        if (attr.max && !elem.attr('aria-valuemax')) {
          elem.attr('aria-valuemax', attr.max);
        }
        if (!elem.attr('aria-valuenow')) {
          scope.$watch(function ngAriaModelWatch() {
            return ngModel.$modelValue;
          }, function ngAriaValueNowReaction(newVal) {
            elem.attr('aria-valuenow', newVal);
          });
        }
      } else if (multilineLike && shouldAttachAriaAttr('multiline')) {
        elem.attr('aria-multiline', true);
      }

      if (needsTabIndex) {
        elem.attr('tabindex', 0);
      }

      if (ngModel.$validators.required && shouldAttachAriaAttr('required')) {
        scope.$watch(function ngAriaRequiredWatch() {
          return ngModel.$error.required;
        }, function(newVal) {
          elem.attr('aria-required', !!newVal);
        });
      }

      if (shouldAttachAriaAttr('invalid')) {
        scope.$watch(function ngAriaInvalidWatch() {
          return ngModel.$invalid;
        }, function(newVal) {
          elem.attr('aria-invalid', !!newVal);
        });
      }
    }
  };
}])
.directive('ngDisabled', ['$aria', function($aria) {
  return $aria.$$watchExpr('ngDisabled', 'ariaDisabled');
}])
.directive('ngClick', ngAriaTabindex)
.directive('ngDblclick', ngAriaTabindex);
