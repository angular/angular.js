'use strict';

/**
 * @ngdoc filter
 * @name slice
 * @function
 *
 * @description
 * Creates a new array or string containing only the elements specified. The elements are extracted
 * from an index value up to either the end of the array or string, or to the optional end index specified.
 *
 * @param {Array|string} input Source array or string to be limited.
 * @param {string|number} begin The zero-based index to begin extracting from the array or string. 
 *     If the `begin` number is positive, slice counts to `begin` starting with 0. If the `begin`
 *     number is negative, `slice` extracts that number of items from the end of the source array/string.
 * @param {string|number} end The zero-based index to end extracting from the array or string.
 * @returns {Array|string} A new sub-array or substring starting at the index `begin`  or less if input array
 *     had less than `limit` elements.
 *
 * @example
   <example>
     <file name="index.html">
       <script>
         function Ctrl($scope) {
           $scope.numbers = [1,2,3,4,5,6,7,8,9];
           $scope.letters = "abcdefghi";
           $scope.begin = 3;
           $scope.end = 6;
         }
       </script>
       <div ng-controller="Ctrl">
         Slice input from index <input type="integer" ng-model="begin"> to <input type="integer" ng-model="end">
         <p>Output numbers: {{ numbers | slice:begin:end }}</p>
         <p>Output letters: {{ letters | slice:begin:end }}</p>
       </div>
     </file>
     <file name="protractor.js" type="protractor">
       var beginInput = element(by.model('begin'));
       var endInput = element(by.model('end'));
       var slicedNumbers = element(by.binding('numbers | slice:begin:end'));
       var slicedLetters = element(by.binding('letters | slice:begin:end'));

       it('should limit the number array to first three items', function() {
         expect(beginInput.getAttribute('value')).toBe('3');
         expect(endInput.getAttribute('value')).toBe('6');
         expect(slicedNumbers.getText()).toEqual('Output numbers: [4,5,6]');
         expect(slicedLetters.getText()).toEqual('Output letters: def');
       });

       it('should update the output when -3 is entered', function() {
         beginInput.clear();
         beginInput.sendKeys('-3');
         endInput.clear();
         endInput.sendKeys('');
         expect(slicedNumbers.getText()).toEqual('Output numbers: [7,8,9]');
         expect(slicedLetters.getText()).toEqual('Output letters: ghi');
       });

       it('should not exceed the maximum size of input array', function() {
         beginInput.clear();
         beginInput.sendKeys('0');
         endInput.clear();
         endInput.sendKeys('100');
         expect(slicedNumbers.getText()).toEqual('Output numbers: [1,2,3,4,5,6,7,8,9]');
         expect(slicedLetters.getText()).toEqual('Output letters: abcdefghi');
       });
     </file>
   </example>
 */
function sliceFilter(){
  return function(input, begin, end) {
    if (!isArray(input) && !isString(input)) return input;

    begin = int(begin);

    // Slice needs end to be undefined if blank or invalid, or it can give it a value of 0
    if ((isString(end) && end) || isNumber(end)) {
      end = int(end);
    } else {
      end = undefined;
    }

    return input.slice(begin, end);
  };
}
