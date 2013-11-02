'use strict';

/**
 * @ngdoc function
 * @name ng.filter:limitFromTo
 * @function
 *
 * @description
 * Creates a new array or string containing only a specified number of elements with an extra
 * parameter specifying the starting point..
 * The elements are taken from either the beginning or the end of the source array or string, as 
 * specified by the value and sign (positive or negative) of `limit`.
 *
 * Note: This function is used to augment the `Array` type in Angular expressions. See
 * {@link ng.$filter} for more information about Angular arrays.
 *
 * @param {Array|string} input Source array or string to be limited.
 * @param {string|number} limit The length of the returned array or string. If the `limit` number 
 *     is positive, `limit` number of items from the beginning of the source array/string are copied.
 *     If the number is negative, `limit` number  of items from the end of the source array/string 
 *     are copied. The `limit` will be trimmed if it exceeds `array.length`
 * @param {string|number} offset The starting point for the included array. Must be positive.
 * @returns {Array|string} A new sub-array or substring of length `limit` or less if input array
 *     had less than `limit` elements.
 *
 * @example
   <doc:example>
     <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.numbers = [1,2,3,4,5,6,7,8,9];
           $scope.letters = "abcdefghi";
           $scope.numLimit = 3;
           $scope.numOffset = 3;
           $scope.letterLimit = 3;
         }
       </script>
       <div ng-controller="Ctrl">
         Limit {{numbers}} to: <input type="integer" ng-model="numLimit">
         <p>Output numbers: {{ numbers | limitFromTo:numLimit:numOffset }}</p>
         Limit {{letters}} to: <input type="integer" ng-model="letterLimit">
         <p>Output letters: {{ letters | limitFromTo:letterLimit:numOffset }}</p>
       </div>
     </doc:source>
     <doc:scenario>
       it('should limit the number array to first three items', function() {
         expect(element('.doc-example-live input[ng-model=numLimit]').val()).toBe('3');
         expect(element('.doc-example-live input[ng-model=letterLimit]').val()).toBe('3');
         expect(binding('numbers | limitFromTo:numLimit:numOffset')).toEqual('[1,2,3]');
         expect(binding('letters | limitFromTo:letterLimit:numOffset')).toEqual('abc');
       });

       it('should update the output when -3 is entered', function() {
         input('numLimit').enter(-3);
         input('letterLimit').enter(-3);
         input('numOffset').enter(0);
         expect(binding('numbers | limitFromTo:numLimit:numOffset')).toEqual('[7,8,9]');
         expect(binding('letters | limitFromTo:letterLimit:numOffset')).toEqual('ghi');
       });

       it('should not exceed the maximum size of input array', function() {
         input('numLimit').enter(100);
         input('letterLimit').enter(100);
         input('numOffset').enter(0);
         expect(binding('numbers | limitFromTo:numLimit:numOffset')).toEqual('[1,2,3,4,5,6,7,8,9]');
         expect(binding('letters | limitFromTo:letterLimit:numOffset')).toEqual('abcdefghi');
       });
     </doc:scenario>
   </doc:example>
 */
function limitFromToFilter(){
    return function(input, offset, limit) {
    if (!isArray(input) && !isString(input)) return input;
    
    limit = int(limit);

    if (isString(input)) {
      //NaN check on limit
      if (limit) {
        return limit >= 0 ? input.slice(offset, limit) : input.slice(limit, input.length);
      } else {
        return "";
      }
    }

    var out = [],
      i, n;

    // if abs(limit) exceeds maximum length, trim it
    if (limit > input.length)
      limit = input.length;
    else if (limit < -input.length)
      limit = -input.length;

    if (limit > 0) {
      i = offset;
      n = limit;
    } else {
      i = input.length + limit;
      n = input.length;
    }

    for (; i<n; i++) {
      out.push(input[i]);
    }

    return out;
  };
}
