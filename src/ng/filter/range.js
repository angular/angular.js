'use strict';

/**
 * @ngdoc filter
 * @name range
 * @kind function
 *
 * @description
 * Creates an array of numbers that can be used to create a loop.
 * This is quite useful for creating a loop without actually having a corresponding array in the $scope
 */

function rangeFilter() {
    return function(start, end, step) {
        var result = [], i;
        if (angular.isUndefined(start)) {
            start = 0;
        }
        if (angular.isUndefined(end)) {
            if ( start > 0) {
                end = start;
                start = 0;
            } else {
                end = 0;
            }
        }
        if (angular.isUndefined(step)) {
            step = start < end ? 1 : -1;
        }
        if ( 0 < step ) {
            for (i = start; i < end; i += step) {
                result.push(i);
            }
        } else {
            for (i = start; i > end; i += step) {
                result.push(i);
            }
        }
        return result;
    };
}
