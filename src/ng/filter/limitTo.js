'use strict';

/**
 * @ngdoc function
 * @name ng.filter:limitTo
 * @function
 *
 * @description
 * Creates a new array or string containing only a specified number of elements. The elements
 * are taken from either the beginning or the end or specified beginning index of the source array
 * or string, as specified by the value and sign (positive or negative) of `limit`.
 *
 * @param {Array|string} input Source array or string to be limited.
 * @param {string|number} limit The length of the returned array or string. If the `limit` number
 *     is positive, `limit` number of items from the beginning of the source array/string are copied.
 *     If the number is negative, `limit` number  of items from the end of the source array/string
 *     are copied. The `limit` will be trimmed if it exceeds `array.length`
 * @param {string|number} begin Index at which to begin limitation. As a negative index, `begin`
 *     indicates an offset from the end of `input`. Defaults to `0`.
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
           $scope.letterLimit = 3;
         }
       </script>
       <div ng-controller="Ctrl">
         Limit {{numbers}} to: <input type="integer" ng-model="numLimit">
         <p>Output numbers: {{ numbers | limitTo:numLimit }}</p>
         Limit {{letters}} to: <input type="integer" ng-model="letterLimit">
         <p>Output letters: {{ letters | limitTo:letterLimit }}</p>
       </div>
     </doc:source>
     <doc:protractor>
       var numLimitInput = element(by.model('numLimit'));
       var letterLimitInput = element(by.model('letterLimit'));
       var limitedNumbers = element(by.binding('numbers | limitTo:numLimit'));
       var limitedLetters = element(by.binding('letters | limitTo:letterLimit'));

       it('should limit the number array to first three items', function() {
         expect(numLimitInput.getAttribute('value')).toBe('3');
         expect(letterLimitInput.getAttribute('value')).toBe('3');
         expect(limitedNumbers.getText()).toEqual('Output numbers: [1,2,3]');
         expect(limitedLetters.getText()).toEqual('Output letters: abc');
       });

       it('should update the output when -3 is entered', function() {
         numLimitInput.clear();
         numLimitInput.sendKeys('-3');
         letterLimitInput.clear();
         letterLimitInput.sendKeys('-3');
         expect(limitedNumbers.getText()).toEqual('Output numbers: [7,8,9]');
         expect(limitedLetters.getText()).toEqual('Output letters: ghi');
       });

       it('should not exceed the maximum size of input array', function() {
         numLimitInput.clear();
         numLimitInput.sendKeys('100');
         letterLimitInput.clear();
         letterLimitInput.sendKeys('100');
         expect(limitedNumbers.getText()).toEqual('Output numbers: [1,2,3,4,5,6,7,8,9]');
         expect(limitedLetters.getText()).toEqual('Output letters: abcdefghi');
       });
     </doc:protractor>
   </doc:example>
 */
function limitToFilter(){
  return function(input, limit, begin) {
    if (!isArray(input) && !isString(input)) return input;

    limit = int(limit);
    begin = (!begin || isNaN(begin)) ? 0 : int(begin);
    begin = (begin < 0 && begin >= -input.length) ? input.length + begin : begin;

    if (isString(input)) {
      //NaN check on limit
      if (limit) {
        if (limit >= 0) {
          return input.slice(begin, begin + limit);
        } else {
          if (begin === 0) {
            return input.slice(limit, input.length);
          } else {
            return input.slice(Math.max(0, begin + limit), begin);
          }
        }
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
      i = begin;
      n = begin + limit;
    } else {
      if (begin) {
        i = limit + begin;
        n = begin;
      } else {
        i = input.length + limit;
        n = input.length;
      }
    }

    for (; i<n; i++) {
      if (input[i]) {
        out.push(input[i]);
      }
    }

    return out;
  };
}
