'use strict';


/**
 * @ngdoc directive
 * @name angular.module.ngSanitize.directive.ngBindHtml
 *
 * @description
 * Creates a binding that will sanitize the result of evaluating the `expression` with the
 * {@link angular.module.ngSanitize.$sanitize $sanitize} service and innerHTML the result into the current element.
 *
 * See {@link angular.module.ngSanitize.$sanitize $sanitize} docs for examples.
 *
 * @element ANY
 * @param {expression} ngBindHtml {@link guide/dev_guide.expressions Expression} to evaluate.
 */
angular.module('ngSanitize').directive('ngBindHtml', ['$sanitize', function($sanitize) {
  return function(scope, element, attr) {
    element.addClass('ng-binding').data('$binding', attr.ngBindHtml);
    scope.$watch(attr.ngBindHtml, function(value) {
      value = $sanitize(value);
      element.html(value || '');
    });
  };
}]);
