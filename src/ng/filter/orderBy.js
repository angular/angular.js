'use strict';

/**
 * @ngdoc filter
 * @name orderBy
 * @kind function
 *
 * @description
 * Orders a specified `array` by the `expression` predicate. It is ordered alphabetically
 * for strings and numerically for numbers. Note: if you notice numbers are not being sorted
 * as expected, make sure they are actually being saved as numbers and not strings.
 *
 * @param {Array} array The array to sort.
 * @param {function(*)|string|Array.<(function(*)|string)>=} expression A predicate to be
 *    used by the comparator to determine the order of elements.
 *
 *    Can be one of:
 *
 *    - `function`: Getter function. The result of this function will be sorted using the
 *      `<`, `===`, `>` operator.
 *    - `string`: An Angular expression. The result of this expression is used to compare elements
 *      (for example `name` to sort by a property called `name` or `name.substr(0, 3)` to sort by
 *      3 first characters of a property called `name`). The result of a constant expression
 *      is interpreted as a property name to be used in comparisons (for example `"special name"`
 *      to sort object by the value of their `special name` property). An expression can be
 *      optionally prefixed with `+` or `-` to control ascending or descending sort order
 *      (for example, `+name` or `-name`). If no property is provided, (e.g. `'+'`) then the array
 *      element itself is used to compare where sorting.
 *    - `Array`: An array of function or string predicates. The first predicate in the array
 *      is used for sorting, but when two items are equivalent, the next predicate is used.
 *
 *    If the predicate is missing or empty then it defaults to `'+'`.
 *
 * @param {boolean=} reverse Reverse the order of the array.
 * @returns {Array} Sorted copy of the source array.
 *
 *
 * @example
 * The example below demonstrates a simple ngRepeat, where the data is sorted
 * by age in descending order (predicate is set to `'-age'`).
 * `reverse` is not set, which means it defaults to `false`.
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
           }]);
       </script>
       <div ng-controller="ExampleController">
         <table class="friend">
           <tr>
             <th>Name</th>
             <th>Phone Number</th>
             <th>Age</th>
           </tr>
           <tr ng-repeat="friend in friends | orderBy:'-age'">
             <td>{{friend.name}}</td>
             <td>{{friend.phone}}</td>
             <td>{{friend.age}}</td>
           </tr>
         </table>
       </div>
     </file>
   </example>
 *
 * The predicate and reverse parameters can be controlled dynamically through scope properties,
 * as shown in the next example.
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
             $scope.predicate = 'age';
             $scope.reverse = true;
             $scope.order = function(predicate) {
               $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
               $scope.predicate = predicate;
             };
           }]);
       </script>
       <style type="text/css">
         .sortorder:after {
           content: '\25b2';
         }
         .sortorder.reverse:after {
           content: '\25bc';
         }
       </style>
       <div ng-controller="ExampleController">
         <pre>Sorting predicate = {{predicate}}; reverse = {{reverse}}</pre>
         <hr/>
         [ <a href="" ng-click="predicate=''">unsorted</a> ]
         <table class="friend">
           <tr>
             <th>
               <a href="" ng-click="order('name')">Name</a>
               <span class="sortorder" ng-show="predicate === 'name'" ng-class="{reverse:reverse}"></span>
             </th>
             <th>
               <a href="" ng-click="order('phone')">Phone Number</a>
               <span class="sortorder" ng-show="predicate === 'phone'" ng-class="{reverse:reverse}"></span>
             </th>
             <th>
               <a href="" ng-click="order('age')">Age</a>
               <span class="sortorder" ng-show="predicate === 'age'" ng-class="{reverse:reverse}"></span>
             </th>
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
orderByFilter.$inject = ['$parse'];
function orderByFilter($parse) {
  return function(array, sortPredicate, reverseOrder) {

    if (!(isArrayLike(array))) return array;

    if (!isArray(sortPredicate)) { sortPredicate = [sortPredicate]; }
    if (sortPredicate.length === 0) { sortPredicate = ['+']; }

    var predicates = processPredicates(sortPredicate, reverseOrder);
    // Add a predicate at the end that evaluates to the element index. This makes the
    // sort stable as it works as a tie-breaker when all the input predicates cannot
    // distinguish between two elements.
    predicates.push({ get: function() { return {}; }, descending: reverseOrder ? -1 : 1});

    // The next three lines are a version of a Swartzian Transform idiom from Perl
    // (sometimes called the Decorate-Sort-Undecorate idiom)
    // See https://en.wikipedia.org/wiki/Schwartzian_transform
    var compareValues = Array.prototype.map.call(array, getComparisonObject);
    compareValues.sort(doComparison);
    array = compareValues.map(function(item) { return item.value; });

    return array;

    function getComparisonObject(value, index) {
      return {
        value: value,
        predicateValues: predicates.map(function(predicate) {
          return getPredicateValue(predicate.get(value), index);
        })
      };
    }

    function doComparison(v1, v2) {
      var result = 0;
      for (var index=0, length = predicates.length; index < length; ++index) {
        result = compare(v1.predicateValues[index], v2.predicateValues[index]) * predicates[index].descending;
        if (result) break;
      }
      return result;
    }
  };

  function processPredicates(sortPredicate, reverseOrder) {
    reverseOrder = reverseOrder ? -1 : 1;
    return sortPredicate.map(function(predicate) {
      var descending = 1, get = identity;

      if (isFunction(predicate)) {
        get = predicate;
      } else if (isString(predicate)) {
        if ((predicate.charAt(0) == '+' || predicate.charAt(0) == '-')) {
          descending = predicate.charAt(0) == '-' ? -1 : 1;
          predicate = predicate.substring(1);
        }
        if (predicate !== '') {
          get = $parse(predicate);
          if (get.constant) {
            var key = get();
            get = function(value) { return value[key]; };
          }
        }
      }
      return { get: get, descending: descending * reverseOrder };
    });
  }

  function isPrimitive(value) {
    switch (typeof value) {
      case 'number': /* falls through */
      case 'boolean': /* falls through */
      case 'string':
        return true;
      default:
        return false;
    }
  }

  function objectValue(value, index) {
    // If `valueOf` is a valid function use that
    if (typeof value.valueOf === 'function') {
      value = value.valueOf();
      if (isPrimitive(value)) return value;
    }
    // If `toString` is a valid function and not the one from `Object.prototype` use that
    if (hasCustomToString(value)) {
      value = value.toString();
      if (isPrimitive(value)) return value;
    }
    // We have a basic object so we use the position of the object in the collection
    return index;
  }

  function getPredicateValue(value, index) {
    var type = typeof value;
    if (value === null) {
      type = 'string';
      value = 'null';
    } else if (type === 'string') {
      value = value.toLowerCase();
    } else if (type === 'object') {
      value = objectValue(value, index);
    }
    return { value: value, type: type };
  }

  function compare(v1, v2) {
    var result = 0;
    if (v1.type === v2.type) {
      if (v1.value !== v2.value) {
        result = v1.value < v2.value ? -1 : 1;
      }
    } else {
      result = v1.type < v2.type ? -1 : 1;
    }
    return result;
  }
}
