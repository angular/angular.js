'use strict';

/**
 * @ngdoc filter
 * @name range
 * @kind function
 *
 * @description
 * Creates an array of numbers that can be used to create a loop.
 * Orders a specified `array` by the `expression` predicate. It is ordered alphabetically
 * for strings and numerically for numbers. Note: if you notice numbers are not being sorted
 * correctly, make sure they are actually being saved as numbers and not strings.
 *
 * @param {Array} array The array to sort.
 * @param {function(*)|string|Array.<(function(*)|string)>} expression A predicate to be
 *    used by the comparator to determine the order of elements.
 *
 *    Can be one of:
 *
 *    - `function`: Getter function. The result of this function will be sorted using the
 *      `<`, `=`, `>` operator.
 *    - `string`: An Angular expression. The result of this expression is used to compare elements
 *      (for example `name` to sort by a property called `name` or `name.substr(0, 3)` to sort by
 *      3 first characters of a property called `name`). The result of a constant expression
 *      is interpreted as a property name to be used in comparisons (for example `"special name"`
 *      to sort object by the value of their `special name` property). An expression can be
 *      optionally prefixed with `+` or `-` to control ascending or descending sort order
 *      (for example, `+name` or `-name`).
 *    - `Array`: An array of function or string predicates. The first predicate in the array
 *      is used for sorting, but when two items are equivalent, the next predicate is used.
 *
 * @param {boolean=} reverse Reverse the order of the array.
 * @returns {Array} Sorted copy of the source array.
 *
 * @example
 <example module="orderByExample">
 <file name="index.html">
 <script>
 angular.module('orderByExample', [])
 .controller('ExampleController', ['$scope', function($scope) {
             $scope.friends =
                 [{name:'John', phone:'555-1212', age:10},
                  {name:'Mary', phone:'555-9876', age:19},
                  {name:'Mike', phone:'555-4321', age:21},
                  {name:'Adam', phone:'555-5678', age:35},
                  {name:'Julie', phone:'555-8765', age:29}];
             $scope.predicate = '-age';
           }]);
 </script>
 <div ng-controller="ExampleController">
 <pre>Sorting predicate = {{predicate}}; reverse = {{reverse}}</pre>
 <hr/>
 [ <a href="" ng-click="predicate=''">unsorted</a> ]
 <table class="friend">
 <tr>
 <th><a href="" ng-click="predicate = 'name'; reverse=false">Name</a>
 (<a href="" ng-click="predicate = '-name'; reverse=false">^</a>)</th>
 <th><a href="" ng-click="predicate = 'phone'; reverse=!reverse">Phone Number</a></th>
 <th><a href="" ng-click="predicate = 'age'; reverse=!reverse">Age</a></th>
 </tr>
 <tr ng-repeat="friend in friends | orderBy:predicate:reverse">
 <td>{{friend.name}}</td>
 <td>{{friend.phone}}</td>
 <td>{{friend.age}}</td>
 </tr>
 </table>
 </div>
 </file>
 </example>
 *
 * It's also possible to call the orderBy filter manually, by injecting `$filter`, retrieving the
 * filter routine with `$filter('orderBy')`, and calling the returned filter routine with the
 * desired parameters.
 *
 * Example:
 *
 * @example
 <example module="orderByExample">
 <file name="index.html">
 <div ng-controller="ExampleController">
 <table class="friend">
 <tr>
 <th><a href="" ng-click="reverse=false;order('name', false)">Name</a>
 (<a href="" ng-click="order('-name',false)">^</a>)</th>
 <th><a href="" ng-click="reverse=!reverse;order('phone', reverse)">Phone Number</a></th>
 <th><a href="" ng-click="reverse=!reverse;order('age',reverse)">Age</a></th>
 </tr>
 <tr ng-repeat="friend in friends">
 <td>{{friend.name}}</td>
 <td>{{friend.phone}}</td>
 <td>{{friend.age}}</td>
 </tr>
 </table>
 </div>
 </file>

 <file name="script.js">
 angular.module('orderByExample', [])
 .controller('ExampleController', ['$scope', '$filter', function($scope, $filter) {
          var orderBy = $filter('orderBy');
          $scope.friends = [
            { name: 'John',    phone: '555-1212',    age: 10 },
            { name: 'Mary',    phone: '555-9876',    age: 19 },
            { name: 'Mike',    phone: '555-4321',    age: 21 },
            { name: 'Adam',    phone: '555-5678',    age: 35 },
            { name: 'Julie',   phone: '555-8765',    age: 29 }
          ];
          $scope.order = function(predicate, reverse) {
            $scope.friends = orderBy($scope.friends, predicate, reverse);
          };
          $scope.order('-age',false);
        }]);
 </file>
 </example>
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
