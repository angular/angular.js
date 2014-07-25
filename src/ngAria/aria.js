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

  function watchAttr(attrName, ariaName) {
    var ariaDashName = dashCase(ariaName);
    return function(scope, elem, attr) {
      if (!config[ariaName] || elem.attr(ariaDashName)) {
        return;
      }
      var destroyWatcher = attr.$observe(attrName, function(newVal) {
        elem.attr(ariaDashName, !angular.isUndefined(newVal));
      });
      scope.$on('$destroy', destroyWatcher);
    };
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

  function watchNgModelProperty (prop, watchFn) {
    var ariaAttrName = 'aria-' + prop,
        configName = 'aria' + prop[0].toUpperCase() + prop.substr(1);
    return function watchNgModelPropertyLinkFn(scope, elem, attr, ngModel) {
      if (!config[configName] || elem.attr(ariaAttrName) || !ngModel) {
        return;
      }
      scope.$watch(watchFn(ngModel), function(newVal) {
        elem.attr(ariaAttrName, !!newVal);
      });
    };
  }

  this.$get = function() {
    return {
      watchExpr: watchExpr,
      ariaChecked: watchExpr('ngModel', 'ariaChecked'),
      ariaDisabled: watchExpr('ngDisabled', 'ariaDisabled'),
      ariaRequired: watchNgModelProperty('required', function(ngModel) {
        return function ngAriaModelWatch() {
          return ngModel.$error.required;
        };
      }),
      ariaInvalid: watchNgModelProperty('invalid', function(ngModel) {
        return function ngAriaModelWatch() {
          return ngModel.$invalid;
        };
      }),
      ariaValue: function(scope, elem, attr, ngModel) {
        if (config.ariaValue) {
          if (attr.min && !elem.attr('aria-valuemin')) {
            elem.attr('aria-valuemin', attr.min);
          }
          if (attr.max && !elem.attr('aria-valuemax')) {
            elem.attr('aria-valuemax', attr.max);
          }
          if (ngModel && !elem.attr('aria-valuenow')) {
            scope.$watch(function ngAriaModelWatch() {
              return ngModel.$modelValue;
            }, function ngAriaValueNowReaction(newVal) {
              elem.attr('aria-valuenow', newVal);
            });
          }
        }
      },
      radio: function(scope, elem, attr, ngModel) {
        if (config.ariaChecked && ngModel && !elem.attr('aria-checked')) {
          var needsTabIndex = config.tabindex && !elem.attr('tabindex');
          scope.$watch(function() {
            return ngModel.$modelValue;
          }, function(newVal) {
            elem.attr('aria-checked', newVal === attr.value);
            if (needsTabIndex) {
              elem.attr('tabindex', 0 - (newVal !== attr.value));
            }
          });
        }
      },
      multiline: function(scope, elem, attr) {
        if (config.ariaMultiline && !elem.attr('aria-multiline')) {
          elem.attr('aria-multiline', true);
        }
      },
      roleChecked: function(scope, elem, attr) {
        if (config.ariaChecked && attr.checked && !elem.attr('aria-checked')) {
          elem.attr('aria-checked', true);
        }
      },
      tabindex: function(scope, elem, attr) {
        if (config.tabindex && !elem.attr('tabindex')) {
          elem.attr('tabindex', 0);
        }
      }
    };
  };
}

var ngAriaRequired = ['$aria', function($aria) {
  return {
    require: '?ngModel',
    link: $aria.ariaRequired
  };
}];

var ngAriaTabindex = ['$aria', function($aria) {
  return $aria.tabindex;
}];

ngAriaModule.directive('ngShow', ['$aria', function($aria) {
  return $aria.watchExpr('ngShow', 'ariaHidden', true);
}])
.directive('ngHide', ['$aria', function($aria) {
  return $aria.watchExpr('ngHide', 'ariaHidden', false);
}])
.directive('input', ['$aria', function($aria) {
  return {
    restrict: 'E',
    require: '?ngModel',
    link: function(scope, elem, attr, ngModel) {
      if (attr.type === 'checkbox') {
        $aria.ariaChecked(scope, elem, attr);
      } else if (attr.type === 'radio') {
        $aria.radio(scope, elem, attr, ngModel);
      } else if (attr.type === 'range') {
        $aria.ariaValue(scope, elem, attr, ngModel);
      }
      $aria.ariaInvalid(scope, elem, attr, ngModel);
    }
  };
}])
.directive('textarea', ['$aria', function($aria) {
  return {
    restrict: 'E',
    require: '?ngModel',
    link: function(scope, elem, attr, ngModel) {
      $aria.ariaInvalid(scope, elem, attr, ngModel);
      $aria.multiline(scope, elem, attr);
    }
  };
}])
.directive('ngRequired', ngAriaRequired)
.directive('required', ngAriaRequired)
.directive('ngDisabled', ['$aria', function($aria) {
  return $aria.ariaDisabled;
}])
.directive('role', ['$aria', function($aria) {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function(scope, elem, attr, ngModel) {
      if (attr.role === 'textbox') {
        $aria.multiline(scope, elem, attr);
      } else if (attr.role === 'progressbar' || attr.role === 'slider') {
        $aria.ariaValue(scope, elem, attr, ngModel);
      } else if (attr.role === 'checkbox' || attr.role === 'menuitemcheckbox') {
        $aria.roleChecked(scope, elem, attr);
        $aria.tabindex(scope, elem, attr);
      } else if (attr.role === 'radio' || attr.role === 'menuitemradio') {
        $aria.radio(scope, elem, attr, ngModel);
      } else if (attr.role === 'button') {
        $aria.tabindex(scope, elem, attr);
      }
    }
  };
}])
.directive('ngClick', ngAriaTabindex)
.directive('ngDblclick', ngAriaTabindex);
