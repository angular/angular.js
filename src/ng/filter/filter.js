'use strict';

/**
 * @ngdoc filter
 * @name filter
 * @kind function
 *
 * @description
 * Selects a subset of items from `array` and returns it as a new array.
 *
 * @param {Array} array The source array.
 * <div class="alert alert-info">
 *   **Note**: If the array contains objects that reference themselves, filtering is not possible.
 * </div>
 * @param {string|Object|function()} expression The predicate to be used for selecting items from
 *   `array`.
 *
 *   Can be one of:
 *
 *   - `string`: The string is used for matching against the contents of the `array`. All strings or
 *     objects with string properties in `array` that match this string will be returned. This also
 *     applies to nested object properties.
 *     The predicate can be negated by prefixing the string with `!`.
 *
 *   - `Object`: A pattern object can be used to filter specific properties on objects contained
 *     by `array`. For example `{name:"M", phone:"1"}` predicate will return an array of items
 *     which have property `name` containing "M" and property `phone` containing "1". A special
 *     property name (`$` by default) can be used (e.g. as in `{$: "text"}`) to accept a match
 *     against any property of the object or its nested object properties. That's equivalent to the
 *     simple substring match with a `string` as described above. The special property name can be
 *     overwritten, using the `anyPropertyKey` parameter.
 *     The predicate can be negated by prefixing the string with `!`.
 *     For example `{name: "!M"}` predicate will return an array of items which have property `name`
 *     not containing "M".
 *
 *     Note that a named property will match properties on the same level only, while the special
 *     `$` property will match properties on the same level or deeper. E.g. an array item like
 *     `{name: {first: 'John', last: 'Doe'}}` will **not** be matched by `{name: 'John'}`, but
 *     **will** be matched by `{$: 'John'}`.
 *
 *   - `function(value, index, array)`: A predicate function can be used to write arbitrary filters.
 *     The function is called for each element of the array, with the element, its index, and
 *     the entire array itself as arguments.
 *
 *     The final result is an array of those elements that the predicate returned true for.
 *
 * @param {function(actual, expected)|true|false} [comparator] Comparator which is used in
 *     determining if values retrieved using `expression` (when it is not a function) should be
 *     considered a match based on the expected value (from the filter expression) and actual
 *     value (from the object in the array).
 *
 *   Can be one of:
 *
 *   - `function(actual, expected)`:
 *     The function will be given the object value and the predicate value to compare and
 *     should return true if both values should be considered equal.
 *
 *   - `true`: A shorthand for `function(actual, expected) { return angular.equals(actual, expected)}`.
 *     This is essentially strict comparison of expected and actual.
 *
 *   - `false`: A short hand for a function which will look for a substring match in a case
 *     insensitive way. Primitive values are converted to strings. Objects are not compared against
 *     primitives, unless they have a custom `toString` method (e.g. `Date` objects).
 *
 *
 *   Defaults to `false`.
 *
 * @param {string} [anyPropertyKey] The special property name that matches against any property.
 *     By default `$`.
 *
 * @example
   <example name="filter-filter">
     <file name="index.html">
       <div ng-init="friends = [{name:'John', phone:'555-1276'},
                                {name:'Mary', phone:'800-BIG-MARY'},
                                {name:'Mike', phone:'555-4321'},
                                {name:'Adam', phone:'555-5678'},
                                {name:'Julie', phone:'555-8765'},
                                {name:'Juliette', phone:'555-5678'}]"></div>

       <label>Search: <input ng-model="searchText"></label>
       <table id="searchTextResults">
         <tr><th>Name</th><th>Phone</th></tr>
         <tr ng-repeat="friend in friends | filter:searchText">
           <td>{{friend.name}}</td>
           <td>{{friend.phone}}</td>
         </tr>
       </table>
       <hr>
       <label>Any: <input ng-model="search.$"></label> <br>
       <label>Name only <input ng-model="search.name"></label><br>
       <label>Phone only <input ng-model="search.phone"></label><br>
       <label>Equality <input type="checkbox" ng-model="strict"></label><br>
       <table id="searchObjResults">
         <tr><th>Name</th><th>Phone</th></tr>
         <tr ng-repeat="friendObj in friends | filter:search:strict">
           <td>{{friendObj.name}}</td>
           <td>{{friendObj.phone}}</td>
         </tr>
       </table>
     </file>
     <file name="protractor.js" type="protractor">
       var expectFriendNames = function(expectedNames, key) {
         element.all(by.repeater(key + ' in friends').column(key + '.name')).then(function(arr) {
           arr.forEach(function(wd, i) {
             expect(wd.getText()).toMatch(expectedNames[i]);
           });
         });
       };

       it('should search across all fields when filtering with a string', function() {
         var searchText = element(by.model('searchText'));
         searchText.clear();
         searchText.sendKeys('m');
         expectFriendNames(['Mary', 'Mike', 'Adam'], 'friend');

         searchText.clear();
         searchText.sendKeys('76');
         expectFriendNames(['John', 'Julie'], 'friend');
       });

       it('should search in specific fields when filtering with a predicate object', function() {
         var searchAny = element(by.model('search.$'));
         searchAny.clear();
         searchAny.sendKeys('i');
         expectFriendNames(['Mary', 'Mike', 'Julie', 'Juliette'], 'friendObj');
       });
       it('should use a equal comparison when comparator is true', function() {
         var searchName = element(by.model('search.name'));
         var strict = element(by.model('strict'));
         searchName.clear();
         searchName.sendKeys('Julie');
         strict.click();
         expectFriendNames(['Julie'], 'friendObj');
       });
     </file>
   </example>
 */

function filterFilter() {
  return function(array, expression, comparator, anyPropertyKey) {
    if (!isArrayLike(array)) {
      if (array == null) {
        return array;
      } else {
        throw minErr('filter')('notarray', 'Expected array but received: {0}', array);
      }
    }

    anyPropertyKey = anyPropertyKey || '$';
    var expressionType = getTypeForFilter(expression);
    var predicateFn;
    var matchAgainstAnyProp;

    switch (expressionType) {
      case 'function':
        predicateFn = expression;
        break;
      case 'boolean':
      case 'null':
      case 'number':
      case 'string':
        matchAgainstAnyProp = true;
        // falls through
      case 'object':
        predicateFn = createPredicateFn(expression, comparator, anyPropertyKey, matchAgainstAnyProp);
        break;
      default:
        return array;
    }

    return Array.prototype.filter.call(array, predicateFn);
  };
}

// Helper functions for `filterFilter`
function createPredicateFn(expression, comparator, anyPropertyKey, matchAgainstAnyProp) {
  var shouldMatchPrimitives = isObject(expression) && (anyPropertyKey in expression);
  var predicateFn;

  if (comparator === true) {
    comparator = equals;
  } else if (!isFunction(comparator)) {
    comparator = function(actual, expected) {
      if (isUndefined(actual)) {
        // No substring matching against `undefined`
        return false;
      }
      if ((actual === null) || (expected === null)) {
        // No substring matching against `null`; only match against `null`
        return actual === expected;
      }
      if (isObject(expected) || (isObject(actual) && !hasCustomToString(actual))) {
        // Should not compare primitives against objects, unless they have custom `toString` method
        return false;
      }

      actual = lowercase('' + actual);
      expected = lowercase('' + expected);
      return actual.indexOf(expected) !== -1;
    };
  }

  predicateFn = function(item) {
    if (shouldMatchPrimitives && !isObject(item)) {
      return deepCompare(item, expression[anyPropertyKey], comparator, anyPropertyKey, false);
    }
    return deepCompare(item, expression, comparator, anyPropertyKey, matchAgainstAnyProp);
  };

  return predicateFn;
}

function deepCompare(actual, expected, comparator, anyPropertyKey, matchAgainstAnyProp, dontMatchWholeObject) {
  var actualType = getTypeForFilter(actual);
  var expectedType = getTypeForFilter(expected);

  if ((expectedType === 'string') && (expected.charAt(0) === '!')) {
    return !deepCompare(actual, expected.substring(1), comparator, anyPropertyKey, matchAgainstAnyProp);
  } else if (isArray(actual)) {
    // In case `actual` is an array, consider it a match
    // if ANY of it's items matches `expected`
    return actual.some(function(item) {
      return deepCompare(item, expected, comparator, anyPropertyKey, matchAgainstAnyProp);
    });
  }

  switch (actualType) {
    case 'object':
      var key;
      if (matchAgainstAnyProp) {
        for (key in actual) {
          // Under certain, rare, circumstances, key may not be a string and `charAt` will be undefined
          // See: https://github.com/angular/angular.js/issues/15644
          if (key.charAt && (key.charAt(0) !== '$') &&
              deepCompare(actual[key], expected, comparator, anyPropertyKey, true)) {
            return true;
          }
        }
        return dontMatchWholeObject ? false : deepCompare(actual, expected, comparator, anyPropertyKey, false);
      } else if (expectedType === 'object') {
        for (key in expected) {
          var expectedVal = expected[key];
          if (isFunction(expectedVal) || isUndefined(expectedVal)) {
            continue;
          }

          var matchAnyProperty = key === anyPropertyKey;
          var actualVal = matchAnyProperty ? actual : actual[key];
          if (!deepCompare(actualVal, expectedVal, comparator, anyPropertyKey, matchAnyProperty, matchAnyProperty)) {
            return false;
          }
        }
        return true;
      } else {
        return comparator(actual, expected);
      }
    case 'function':
      return false;
    default:
      return comparator(actual, expected);
  }
}

// Used for easily differentiating between `null` and actual `object`
function getTypeForFilter(val) {
  return (val === null) ? 'null' : typeof val;
}
