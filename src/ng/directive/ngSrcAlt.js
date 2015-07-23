'use strict';

/**
 * @ngdoc directive
 * @name ngSrcAlt
 * @restrict A
 *
 * @description
 * Executes if the URL in the src attribute throws an 404 error and replaces the value of the src attribute with the value in the expression.
 * @param {expression} ngSrcAlt
 *
 * {@link guide/expression Expression} which evals to an
 * string which contains an URL.
 */
var ngSrcAltDirective = ngDirective({
    restrict: 'A',
    priority: 99, // it needs to run after the attributes are interpolated
    link: function ($scope, $element, $attr) {
        var regex_isString = /(^['"]|['"]$)/g,
            isValue = regex_isString.test($attr.ngSrcAlt);
        $element.bind('error', function () {
            var value = isValue ? $attr.ngSrcAlt.replace(regex_isString, '') : $scope[$attr.ngSrcAlt];
            if ($attr.src !== value) {
                $attr.$set('src', value);
            }
        });
    }
});
