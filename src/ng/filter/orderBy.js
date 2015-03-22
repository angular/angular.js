'use strict';

/**
 * @ngdoc filter
 * @name orderBy
 * @kind function
 *
 * @description
 * Orders a specified `array` by the `expression` predicate. It is ordered alphabetically
 * for strings and numerically for numbers. Note: if you notice numbers are not being sorted
 * correctly, make sure they are actually being saved as numbers and not strings.
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
orderByFilter.$inject = ['$parse'];
function orderByFilter($parse) {
  return function(array, sortPredicate, reverseOrder) {
    if (!(isArrayLike(array))) return array;
    sortPredicate = isArray(sortPredicate) ? sortPredicate : [sortPredicate];
    if (sortPredicate.length === 0) { sortPredicate = ['+']; }
    sortPredicate = sortPredicate.map(function(predicate) {
      var descending = false, get = predicate || identity;
      if (isString(predicate)) {
        if ((predicate.charAt(0) == '+' || predicate.charAt(0) == '-')) {
          descending = predicate.charAt(0) == '-';
          predicate = predicate.substring(1);
        }
        if (predicate === '') {
          // Effectively no predicate was passed so we compare identity
          return reverseComparator(compare, descending);
        }
        get = $parse(predicate);
        if (get.constant) {
          var key = get();
          return reverseComparator(function(a, b) {
            return compare(a[key], b[key]);
          }, descending);
        }
      }
      return reverseComparator(function(a, b) {
        return compare(get(a),get(b));
      }, descending);
    });
    return slice.call(array).sort(reverseComparator(comparator, reverseOrder));

    function comparator(o1, o2) {
      for (var i = 0; i < sortPredicate.length; i++) {
        var comp = sortPredicate[i](o1, o2);
        if (comp !== 0) return comp;
      }
      return 0;
    }
    function reverseComparator(comp, descending) {
      return descending
          ? function(a, b) {return comp(b,a);}
          : comp;
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

    function objectToString(value) {
      if (value === null) return 'null';
      if (typeof value.valueOf === 'function') {
        value = value.valueOf();
        if (isPrimitive(value)) return value;
      }
      if (typeof value.toString === 'function') {
        value = value.toString();
        if (isPrimitive(value)) return value;
      }
      return '';
    }

    function compare(v1, v2) {
      var t1 = typeof v1;
      var t2 = typeof v2;
      if (t1 === t2 && t1 === "object") {
        v1 = objectToString(v1);
        v2 = objectToString(v2);
      }
      if (t1 === t2) {
        if (t1 === "string") {
           v1 = v1.toLowerCase();
           v2 = v2.toLowerCase();
        }
        if (v1 === v2) return 0;
        return v1 < v2 ? -1 : 1;
      } else {
        return t1 < t2 ? -1 : 1;
      }
    }
  };
}
