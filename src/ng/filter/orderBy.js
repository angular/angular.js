'use strict';

/**
 * @ngdoc filter
 * @name orderBy
 * @kind function
 *
 * @description
 * Returns an array containing the items from the specified `collection`, ordered by a `comparator`
 * function based on the values computed using the `expression` predicate.
 *
 * For example, `[{id: 'foo'}, {id: 'bar'}] | orderBy:'id'` would result in
 * `[{id: 'bar'}, {id: 'foo'}]`.
 *
 * The `collection` can be an Array or array-like object (e.g. NodeList, jQuery object, TypedArray,
 * String, etc).
 *
 * The `expression` can be a single predicate, or a list of predicates each serving as a tie-breaker
 * for the preceding one. The `expression` is evaluated against each item and the output is used
 * for comparing with other items.
 *
 * You can change the sorting order by setting `reverse` to `true`. By default, items are sorted in
 * ascending order.
 *
 * The comparison is done using the `comparator` function. If none is specified, a default, built-in
 * comparator is used (see below for details - in a nutshell, it compares numbers numerically and
 * strings alphabetically).
 *
 * ### Under the hood
 *
 * Ordering the specified `collection` happens in two phases:
 *
 * 1. All items are passed through the predicate (or predicates), and the returned values are saved
 *    along with their type (`string`, `number` etc). For example, an item `{label: 'foo'}`, passed
 *    through a predicate that extracts the value of the `label` property, would be transformed to:
 *    ```
 *    {
 *      value: 'foo',
 *      type: 'string',
 *      index: ...
 *    }
 *    ```
 * 2. The comparator function is used to sort the items, based on the derived values, types and
 *    indices.
 *
 * If you use a custom comparator, it will be called with pairs of objects of the form
 * `{value: ..., type: '...', index: ...}` and is expected to return `0` if the objects are equal
 * (as far as the comparator is concerned), `-1` if the 1st one should be ranked higher than the
 * second, or `1` otherwise.
 *
 * In order to ensure that the sorting will be deterministic across platforms, if none of the
 * specified predicates can distinguish between two items, `orderBy` will automatically introduce a
 * dummy predicate that returns the item's index as `value`.
 * (If you are using a custom comparator, make sure it can handle this predicate as well.)
 *
 * Finally, in an attempt to simplify things, if a predicate returns an object as the extracted
 * value for an item, `orderBy` will try to convert that object to a primitive value, before passing
 * it to the comparator. The following rules govern the conversion:
 *
 * 1. If the object has a `valueOf()` method that returns a primitive, its return value will be
 *    used instead.<br />
 *    (If the object has a `valueOf()` method that returns another object, then the returned object
 *    will be used in subsequent steps.)
 * 2. If the object has a custom `toString()` method (i.e. not the one inherited from `Object`) that
 *    returns a primitive, its return value will be used instead.<br />
 *    (If the object has a `toString()` method that returns another object, then the returned object
 *    will be used in subsequent steps.)
 * 3. No conversion; the object itself is used.
 *
 * ### The default comparator
 *
 * The default, built-in comparator should be sufficient for most usecases. In short, it compares
 * numbers numerically, strings alphabetically (and case-insensitively), for objects falls back to
 * using their index in the original collection, and sorts values of different types by type.
 *
 * More specifically, it follows these steps to determine the relative order of items:
 *
 * 1. If the compared values are of different types, compare the types themselves alphabetically.
 * 2. If both values are of type `string`, compare them alphabetically in a case- and
 *    locale-insensitive way.
 * 3. If both values are objects, compare their indices instead.
 * 4. Otherwise, return:
 *    -  `0`, if the values are equal (by strict equality comparison, i.e. using `===`).
 *    - `-1`, if the 1st value is "less than" the 2nd value (compared using the `<` operator).
 *    -  `1`, otherwise.
 *
 * **Note:** If you notice numbers not being sorted as expected, make sure they are actually being
 *           saved as numbers and not strings.
 * **Note:** For the purpose of sorting, `null` values are treated as the string `'null'` (i.e.
 *           `type: 'string'`, `value: 'null'`). This may cause unexpected sort order relative to
 *           other values.
 *
 * @param {Array|ArrayLike} collection - The collection (array or array-like object) to sort.
 * @param {(Function|string|Array.<Function|string>)=} expression - A predicate (or list of
 *    predicates) to be used by the comparator to determine the order of elements.
 *
 *    Can be one of:
 *
 *    - `Function`: A getter function. This function will be called with each item as argument and
 *      the return value will be used for sorting.
 *    - `string`: An AngularJS expression. This expression will be evaluated against each item and the
 *      result will be used for sorting. For example, use `'label'` to sort by a property called
 *      `label` or `'label.substring(0, 3)'` to sort by the first 3 characters of the `label`
 *      property.<br />
 *      (The result of a constant expression is interpreted as a property name to be used for
 *      comparison. For example, use `'"special name"'` (note the extra pair of quotes) to sort by a
 *      property called `special name`.)<br />
 *      An expression can be optionally prefixed with `+` or `-` to control the sorting direction,
 *      ascending or descending. For example, `'+label'` or `'-label'`. If no property is provided,
 *      (e.g. `'+'` or `'-'`), the collection element itself is used in comparisons.
 *    - `Array`: An array of function and/or string predicates. If a predicate cannot determine the
 *      relative order of two items, the next predicate is used as a tie-breaker.
 *
 * **Note:** If the predicate is missing or empty then it defaults to `'+'`.
 *
 * @param {boolean=} reverse - If `true`, reverse the sorting order.
 * @param {(Function)=} comparator - The comparator function used to determine the relative order of
 *    value pairs. If omitted, the built-in comparator will be used.
 *
 * @returns {Array} - The sorted array.
 *
 *
 * @example
 * ### Ordering a table with `ngRepeat`
 *
 * The example below demonstrates a simple {@link ngRepeat ngRepeat}, where the data is sorted by
 * age in descending order (expression is set to `'-age'`). The `comparator` is not set, which means
 * it defaults to the built-in comparator.
 *
   <example name="orderBy-static" module="orderByExample1">
     <file name="index.html">
       <div ng-controller="ExampleController">
         <table class="friends">
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
     <file name="script.js">
       angular.module('orderByExample1', [])
         .controller('ExampleController', ['$scope', function($scope) {
           $scope.friends = [
             {name: 'John',   phone: '555-1212',  age: 10},
             {name: 'Mary',   phone: '555-9876',  age: 19},
             {name: 'Mike',   phone: '555-4321',  age: 21},
             {name: 'Adam',   phone: '555-5678',  age: 35},
             {name: 'Julie',  phone: '555-8765',  age: 29}
           ];
         }]);
     </file>
     <file name="style.css">
       .friends {
         border-collapse: collapse;
       }

       .friends th {
         border-bottom: 1px solid;
       }
       .friends td, .friends th {
         border-left: 1px solid;
         padding: 5px 10px;
       }
       .friends td:first-child, .friends th:first-child {
         border-left: none;
       }
     </file>
     <file name="protractor.js" type="protractor">
       // Element locators
       var names = element.all(by.repeater('friends').column('friend.name'));

       it('should sort friends by age in reverse order', function() {
         expect(names.get(0).getText()).toBe('Adam');
         expect(names.get(1).getText()).toBe('Julie');
         expect(names.get(2).getText()).toBe('Mike');
         expect(names.get(3).getText()).toBe('Mary');
         expect(names.get(4).getText()).toBe('John');
       });
     </file>
   </example>
 * <hr />
 *
 * @example
 * ### Changing parameters dynamically
 *
 * All parameters can be changed dynamically. The next example shows how you can make the columns of
 * a table sortable, by binding the `expression` and `reverse` parameters to scope properties.
 *
   <example name="orderBy-dynamic" module="orderByExample2">
     <file name="index.html">
       <div ng-controller="ExampleController">
         <pre>Sort by = {{propertyName}}; reverse = {{reverse}}</pre>
         <hr/>
         <button ng-click="propertyName = null; reverse = false">Set to unsorted</button>
         <hr/>
         <table class="friends">
           <tr>
             <th>
               <button ng-click="sortBy('name')">Name</button>
               <span class="sortorder" ng-show="propertyName === 'name'" ng-class="{reverse: reverse}"></span>
             </th>
             <th>
               <button ng-click="sortBy('phone')">Phone Number</button>
               <span class="sortorder" ng-show="propertyName === 'phone'" ng-class="{reverse: reverse}"></span>
             </th>
             <th>
               <button ng-click="sortBy('age')">Age</button>
               <span class="sortorder" ng-show="propertyName === 'age'" ng-class="{reverse: reverse}"></span>
             </th>
           </tr>
           <tr ng-repeat="friend in friends | orderBy:propertyName:reverse">
             <td>{{friend.name}}</td>
             <td>{{friend.phone}}</td>
             <td>{{friend.age}}</td>
           </tr>
         </table>
       </div>
     </file>
     <file name="script.js">
       angular.module('orderByExample2', [])
         .controller('ExampleController', ['$scope', function($scope) {
           var friends = [
             {name: 'John',   phone: '555-1212',  age: 10},
             {name: 'Mary',   phone: '555-9876',  age: 19},
             {name: 'Mike',   phone: '555-4321',  age: 21},
             {name: 'Adam',   phone: '555-5678',  age: 35},
             {name: 'Julie',  phone: '555-8765',  age: 29}
           ];

           $scope.propertyName = 'age';
           $scope.reverse = true;
           $scope.friends = friends;

           $scope.sortBy = function(propertyName) {
             $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
             $scope.propertyName = propertyName;
           };
         }]);
     </file>
     <file name="style.css">
       .friends {
         border-collapse: collapse;
       }

       .friends th {
         border-bottom: 1px solid;
       }
       .friends td, .friends th {
         border-left: 1px solid;
         padding: 5px 10px;
       }
       .friends td:first-child, .friends th:first-child {
         border-left: none;
       }

       .sortorder:after {
         content: '\25b2';   // BLACK UP-POINTING TRIANGLE
       }
       .sortorder.reverse:after {
         content: '\25bc';   // BLACK DOWN-POINTING TRIANGLE
       }
     </file>
     <file name="protractor.js" type="protractor">
       // Element locators
       var unsortButton = element(by.partialButtonText('unsorted'));
       var nameHeader = element(by.partialButtonText('Name'));
       var phoneHeader = element(by.partialButtonText('Phone'));
       var ageHeader = element(by.partialButtonText('Age'));
       var firstName = element(by.repeater('friends').column('friend.name').row(0));
       var lastName = element(by.repeater('friends').column('friend.name').row(4));

       it('should sort friends by some property, when clicking on the column header', function() {
         expect(firstName.getText()).toBe('Adam');
         expect(lastName.getText()).toBe('John');

         phoneHeader.click();
         expect(firstName.getText()).toBe('John');
         expect(lastName.getText()).toBe('Mary');

         nameHeader.click();
         expect(firstName.getText()).toBe('Adam');
         expect(lastName.getText()).toBe('Mike');

         ageHeader.click();
         expect(firstName.getText()).toBe('John');
         expect(lastName.getText()).toBe('Adam');
       });

       it('should sort friends in reverse order, when clicking on the same column', function() {
         expect(firstName.getText()).toBe('Adam');
         expect(lastName.getText()).toBe('John');

         ageHeader.click();
         expect(firstName.getText()).toBe('John');
         expect(lastName.getText()).toBe('Adam');

         ageHeader.click();
         expect(firstName.getText()).toBe('Adam');
         expect(lastName.getText()).toBe('John');
       });

       it('should restore the original order, when clicking "Set to unsorted"', function() {
         expect(firstName.getText()).toBe('Adam');
         expect(lastName.getText()).toBe('John');

         unsortButton.click();
         expect(firstName.getText()).toBe('John');
         expect(lastName.getText()).toBe('Julie');
       });
     </file>
   </example>
 * <hr />
 *
 * @example
 * ### Using `orderBy` inside a controller
 *
 * It is also possible to call the `orderBy` filter manually, by injecting `orderByFilter`, and
 * calling it with the desired parameters. (Alternatively, you could inject the `$filter` factory
 * and retrieve the `orderBy` filter with `$filter('orderBy')`.)
 *
   <example name="orderBy-call-manually" module="orderByExample3">
     <file name="index.html">
       <div ng-controller="ExampleController">
         <pre>Sort by = {{propertyName}}; reverse = {{reverse}}</pre>
         <hr/>
         <button ng-click="sortBy(null)">Set to unsorted</button>
         <hr/>
         <table class="friends">
           <tr>
             <th>
               <button ng-click="sortBy('name')">Name</button>
               <span class="sortorder" ng-show="propertyName === 'name'" ng-class="{reverse: reverse}"></span>
             </th>
             <th>
               <button ng-click="sortBy('phone')">Phone Number</button>
               <span class="sortorder" ng-show="propertyName === 'phone'" ng-class="{reverse: reverse}"></span>
             </th>
             <th>
               <button ng-click="sortBy('age')">Age</button>
               <span class="sortorder" ng-show="propertyName === 'age'" ng-class="{reverse: reverse}"></span>
             </th>
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
       angular.module('orderByExample3', [])
         .controller('ExampleController', ['$scope', 'orderByFilter', function($scope, orderBy) {
           var friends = [
             {name: 'John',   phone: '555-1212',  age: 10},
             {name: 'Mary',   phone: '555-9876',  age: 19},
             {name: 'Mike',   phone: '555-4321',  age: 21},
             {name: 'Adam',   phone: '555-5678',  age: 35},
             {name: 'Julie',  phone: '555-8765',  age: 29}
           ];

           $scope.propertyName = 'age';
           $scope.reverse = true;
           $scope.friends = orderBy(friends, $scope.propertyName, $scope.reverse);

           $scope.sortBy = function(propertyName) {
             $scope.reverse = (propertyName !== null && $scope.propertyName === propertyName)
                 ? !$scope.reverse : false;
             $scope.propertyName = propertyName;
             $scope.friends = orderBy(friends, $scope.propertyName, $scope.reverse);
           };
         }]);
     </file>
     <file name="style.css">
       .friends {
         border-collapse: collapse;
       }

       .friends th {
         border-bottom: 1px solid;
       }
       .friends td, .friends th {
         border-left: 1px solid;
         padding: 5px 10px;
       }
       .friends td:first-child, .friends th:first-child {
         border-left: none;
       }

       .sortorder:after {
         content: '\25b2';   // BLACK UP-POINTING TRIANGLE
       }
       .sortorder.reverse:after {
         content: '\25bc';   // BLACK DOWN-POINTING TRIANGLE
       }
     </file>
     <file name="protractor.js" type="protractor">
       // Element locators
       var unsortButton = element(by.partialButtonText('unsorted'));
       var nameHeader = element(by.partialButtonText('Name'));
       var phoneHeader = element(by.partialButtonText('Phone'));
       var ageHeader = element(by.partialButtonText('Age'));
       var firstName = element(by.repeater('friends').column('friend.name').row(0));
       var lastName = element(by.repeater('friends').column('friend.name').row(4));

       it('should sort friends by some property, when clicking on the column header', function() {
         expect(firstName.getText()).toBe('Adam');
         expect(lastName.getText()).toBe('John');

         phoneHeader.click();
         expect(firstName.getText()).toBe('John');
         expect(lastName.getText()).toBe('Mary');

         nameHeader.click();
         expect(firstName.getText()).toBe('Adam');
         expect(lastName.getText()).toBe('Mike');

         ageHeader.click();
         expect(firstName.getText()).toBe('John');
         expect(lastName.getText()).toBe('Adam');
       });

       it('should sort friends in reverse order, when clicking on the same column', function() {
         expect(firstName.getText()).toBe('Adam');
         expect(lastName.getText()).toBe('John');

         ageHeader.click();
         expect(firstName.getText()).toBe('John');
         expect(lastName.getText()).toBe('Adam');

         ageHeader.click();
         expect(firstName.getText()).toBe('Adam');
         expect(lastName.getText()).toBe('John');
       });

       it('should restore the original order, when clicking "Set to unsorted"', function() {
         expect(firstName.getText()).toBe('Adam');
         expect(lastName.getText()).toBe('John');

         unsortButton.click();
         expect(firstName.getText()).toBe('John');
         expect(lastName.getText()).toBe('Julie');
       });
     </file>
   </example>
 * <hr />
 *
 * @example
 * ### Using a custom comparator
 *
 * If you have very specific requirements about the way items are sorted, you can pass your own
 * comparator function. For example, you might need to compare some strings in a locale-sensitive
 * way. (When specifying a custom comparator, you also need to pass a value for the `reverse`
 * argument - passing `false` retains the default sorting order, i.e. ascending.)
 *
   <example name="orderBy-custom-comparator" module="orderByExample4">
     <file name="index.html">
       <div ng-controller="ExampleController">
         <div class="friends-container custom-comparator">
           <h3>Locale-sensitive Comparator</h3>
           <table class="friends">
             <tr>
               <th>Name</th>
               <th>Favorite Letter</th>
             </tr>
             <tr ng-repeat="friend in friends | orderBy:'favoriteLetter':false:localeSensitiveComparator">
               <td>{{friend.name}}</td>
               <td>{{friend.favoriteLetter}}</td>
             </tr>
           </table>
         </div>
         <div class="friends-container default-comparator">
           <h3>Default Comparator</h3>
           <table class="friends">
             <tr>
               <th>Name</th>
               <th>Favorite Letter</th>
             </tr>
             <tr ng-repeat="friend in friends | orderBy:'favoriteLetter'">
               <td>{{friend.name}}</td>
               <td>{{friend.favoriteLetter}}</td>
             </tr>
           </table>
         </div>
       </div>
     </file>
     <file name="script.js">
       angular.module('orderByExample4', [])
         .controller('ExampleController', ['$scope', function($scope) {
           $scope.friends = [
             {name: 'John',   favoriteLetter: 'Ä'},
             {name: 'Mary',   favoriteLetter: 'Ü'},
             {name: 'Mike',   favoriteLetter: 'Ö'},
             {name: 'Adam',   favoriteLetter: 'H'},
             {name: 'Julie',  favoriteLetter: 'Z'}
           ];

           $scope.localeSensitiveComparator = function(v1, v2) {
             // If we don't get strings, just compare by index
             if (v1.type !== 'string' || v2.type !== 'string') {
               return (v1.index < v2.index) ? -1 : 1;
             }

             // Compare strings alphabetically, taking locale into account
             return v1.value.localeCompare(v2.value);
           };
         }]);
     </file>
     <file name="style.css">
       .friends-container {
         display: inline-block;
         margin: 0 30px;
       }

       .friends {
         border-collapse: collapse;
       }

       .friends th {
         border-bottom: 1px solid;
       }
       .friends td, .friends th {
         border-left: 1px solid;
         padding: 5px 10px;
       }
       .friends td:first-child, .friends th:first-child {
         border-left: none;
       }
     </file>
     <file name="protractor.js" type="protractor">
       // Element locators
       var container = element(by.css('.custom-comparator'));
       var names = container.all(by.repeater('friends').column('friend.name'));

       it('should sort friends by favorite letter (in correct alphabetical order)', function() {
         expect(names.get(0).getText()).toBe('John');
         expect(names.get(1).getText()).toBe('Adam');
         expect(names.get(2).getText()).toBe('Mike');
         expect(names.get(3).getText()).toBe('Mary');
         expect(names.get(4).getText()).toBe('Julie');
       });
     </file>
   </example>
 *
 */
orderByFilter.$inject = ['$parse'];
function orderByFilter($parse) {
  return function(array, sortPredicate, reverseOrder, compareFn) {

    if (array == null) return array;
    if (!isArrayLike(array)) {
      throw minErr('orderBy')('notarray', 'Expected array but received: {0}', array);
    }

    if (!isArray(sortPredicate)) { sortPredicate = [sortPredicate]; }
    if (sortPredicate.length === 0) { sortPredicate = ['+']; }

    var predicates = processPredicates(sortPredicate);

    var descending = reverseOrder ? -1 : 1;

    // Define the `compare()` function. Use a default comparator if none is specified.
    var compare = isFunction(compareFn) ? compareFn : defaultCompare;

    // The next three lines are a version of a Swartzian Transform idiom from Perl
    // (sometimes called the Decorate-Sort-Undecorate idiom)
    // See https://en.wikipedia.org/wiki/Schwartzian_transform
    var compareValues = Array.prototype.map.call(array, getComparisonObject);
    compareValues.sort(doComparison);
    array = compareValues.map(function(item) { return item.value; });

    return array;

    function getComparisonObject(value, index) {
      // NOTE: We are adding an extra `tieBreaker` value based on the element's index.
      // This will be used to keep the sort stable when none of the input predicates can
      // distinguish between two elements.
      return {
        value: value,
        tieBreaker: {value: index, type: 'number', index: index},
        predicateValues: predicates.map(function(predicate) {
          return getPredicateValue(predicate.get(value), index);
        })
      };
    }

    function doComparison(v1, v2) {
      for (var i = 0, ii = predicates.length; i < ii; i++) {
        var result = compare(v1.predicateValues[i], v2.predicateValues[i]);
        if (result) {
          return result * predicates[i].descending * descending;
        }
      }

      return compare(v1.tieBreaker, v2.tieBreaker) * descending;
    }
  };

  function processPredicates(sortPredicates) {
    return sortPredicates.map(function(predicate) {
      var descending = 1, get = identity;

      if (isFunction(predicate)) {
        get = predicate;
      } else if (isString(predicate)) {
        if ((predicate.charAt(0) === '+' || predicate.charAt(0) === '-')) {
          descending = predicate.charAt(0) === '-' ? -1 : 1;
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
      return {get: get, descending: descending};
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

  function objectValue(value) {
    // If `valueOf` is a valid function use that
    if (isFunction(value.valueOf)) {
      value = value.valueOf();
      if (isPrimitive(value)) return value;
    }
    // If `toString` is a valid function and not the one from `Object.prototype` use that
    if (hasCustomToString(value)) {
      value = value.toString();
      if (isPrimitive(value)) return value;
    }

    return value;
  }

  function getPredicateValue(value, index) {
    var type = typeof value;
    if (value === null) {
      type = 'string';
      value = 'null';
    } else if (type === 'object') {
      value = objectValue(value);
    }
    return {value: value, type: type, index: index};
  }

  function defaultCompare(v1, v2) {
    var result = 0;
    var type1 = v1.type;
    var type2 = v2.type;

    if (type1 === type2) {
      var value1 = v1.value;
      var value2 = v2.value;

      if (type1 === 'string') {
        // Compare strings case-insensitively
        value1 = value1.toLowerCase();
        value2 = value2.toLowerCase();
      } else if (type1 === 'object') {
        // For basic objects, use the position of the object
        // in the collection instead of the value
        if (isObject(value1)) value1 = v1.index;
        if (isObject(value2)) value2 = v2.index;
      }

      if (value1 !== value2) {
        result = value1 < value2 ? -1 : 1;
      }
    } else {
      result = type1 < type2 ? -1 : 1;
    }

    return result;
  }
}
