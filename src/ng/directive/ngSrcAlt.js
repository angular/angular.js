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
        $element.bind('error', function () {
            $attr.$set('src', $attr['ngSrcAlt']);

            if (msie) {
                $element.prop('src-alt', $attr['src']);
            }
        });

    }
});
