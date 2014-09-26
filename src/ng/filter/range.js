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

rangeFilter.$inject = ['$parse'];
function rangeFilter() {
    return function(start, end, step) {
        var result = [];
        if (isUndefined(end)) {
            end = start;
            start = 0;
        }
        if (isUndefined(step)) {
            step = min < max ? 1 : -1;
        }
        if ( step < 0 ) {
            if (start < end) {
                return result;
            }
        } else {
            if (end < start) {
                return result;
            }
        }
        for (var i = start; i <= end; i += step) {
            result.push(i);
        }
        return result;
    };
}
