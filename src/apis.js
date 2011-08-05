'use strict';

var angularGlobal = {
  'typeOf':function(obj){
    if (obj === null) return $null;
    var type = typeof obj;
    if (type == $object) {
      if (obj instanceof Array) return $array;
      if (isDate(obj)) return $date;
      if (obj.nodeType == 1) return 'element';
    }
    return type;
  }
};


/**
 * @ngdoc overview
 * @name angular.Object
 * @function
 *
 * @description
 * A namespace for utility functions used to work with JavaScript objects. These functions are
 * exposed in two ways:
 *
 * __* Angular expressions:__ Functions are bound to all objects and augment the Object type. The
 * names of these methods are prefixed with the '$' character in order to minimize naming collisions.
 * To call a method, invoke the function without the first argument, e.g, `myObject.$foo(param2)`.
 *
 * __* JavaScript code:__ Functions don't augment the Object type and must be invoked as functions of
 * `angular.Object` as `angular.Object.foo(myObject, param2)`.
 *
 * * {@link angular.Object.copy angular.Object.copy()} - Creates a deep copy of the source parameter
 * * {@link angular.Object.equals angular.Object.equals()} - Determines if two objects or values are
 * equivalent
 * * {@link angular.Object.size angular.Object.size()} - Determines the number of elements in
 * strings, arrays, and objects.
 */
var angularCollection = {
  'copy': copy,
  'size': size,
  'equals': equals
};
var angularObject = {
  'extend': extend
};

/**
 * @ngdoc overview
 * @name angular.Array
 *
 * @description
 * A namespace for utility functions for the manipulation of JavaScript Array objects.
 *
 * These functions are exposed in two ways:
 *
 * * __Angular expressions:__ Functions are bound to the Array objects and augment the Array type as
 * array methods. The names of these methods are prefixed with $ character to minimize naming
 * collisions. To call a method, invoke myArrayObject.$foo(params).
 *
 *     Because Array type is a subtype of the Object type, all angular.Object functions augment
 *     theArray type in angular expressions as well.
 *
 * * __JavaScript code:__ Functions don't augment the Array type and must be invoked as functions of
 * `angular.Array` as `angular.Array.foo(myArrayObject, params)`.
 *
 * The following APIs are built-in to the angular Array object:
 *
 * * {@link angular.Array.add angular.Array.add()} - Optionally adds a new element to an array.
 * * {@link angular.Array.count angular.Array.count()} - Determines the number of elements in an
 * array.
 * * {@link angular.Array.filter angular.Array.filter()} - Returns a subset of items as a new array.
 * * {@link angular.Array.indexOf angular.Array.indexOf()} - Determines the index of an array value.
 * * {@link angular.Array.limitTo angular.Array.limitTo()} - Creates a new array off the front or
 * back of an existing array.
 * * {@link angular.Array.orderBy angular.Array.orderBy()} - Orders array elements
 * * {@link angular.Array.remove angular.Array.remove()} - Removes array elements
 * * {@link angular.Array.sum angular.Array.sum()} - Sums the number elements in an array
 */
var angularArray = {


  /**
   * @ngdoc function
   * @name angular.Array.indexOf
   * @function
   *
   * @description
   * Determines the index of `value` in `array`.
   *
   * Note: this function is used to augment the `Array` type in angular expressions. See
   * {@link angular.Array} for more info.
   *
   * @param {Array} array Array to search.
   * @param {*} value Value to search for.
   * @returns {number} The position of the element in `array`. The position is 0-based. `-1` is returned if the value can't be found.
   *
   * @example
      <doc:example>
        <doc:source>
         <div ng:init="books = ['Moby Dick', 'Great Gatsby', 'Romeo and Juliet']"></div>
         <input name='bookName' value='Romeo and Juliet'> <br>
         Index of '{{bookName}}' in the list {{books}} is <em>{{books.$indexOf(bookName)}}</em>.
        </doc:source>
        <doc:scenario>
         it('should correctly calculate the initial index', function() {
           expect(binding('books.$indexOf(bookName)')).toBe('2');
         });

         it('should recalculate', function() {
           input('bookName').enter('foo');
           expect(binding('books.$indexOf(bookName)')).toBe('-1');

           input('bookName').enter('Moby Dick');
           expect(binding('books.$indexOf(bookName)')).toBe('0');
         });
        </doc:scenario>
      </doc:example>
   */
  'indexOf': indexOf,


  /**
   * @ngdoc function
   * @name angular.Array.sum
   * @function
   *
   * @description
   * This function calculates the sum of all numbers in `array`. If the `expressions` is supplied,
   * it is evaluated once for each element in `array` and then the sum of these values is returned.
   *
   * Note: this function is used to augment the `Array` type in angular expressions. See
   * {@link angular.Array} for more info.
   *
   * @param {Array} array The source array.
   * @param {(string|function())=} expression Angular expression or a function to be evaluated for each
   *     element in `array`. The array element becomes the `this` during the evaluation.
   * @returns {number} Sum of items in the array.
   *
   * @example
      <doc:example>
        <doc:source>
         <table ng:init="invoice= {items:[{qty:10, description:'gadget', cost:9.95}]}">
           <tr><th>Qty</th><th>Description</th><th>Cost</th><th>Total</th><th></th></tr>
           <tr ng:repeat="item in invoice.items">
             <td><input name="item.qty" value="1" size="4" ng:required ng:validate="integer"></td>
            <td><input name="item.description"></td>
              <td><input name="item.cost" value="0.00" ng:required ng:validate="number" size="6"></td>
             <td>{{item.qty * item.cost | currency}}</td>
             <td>[<a href ng:click="invoice.items.$remove(item)">X</a>]</td>
           </tr>
           <tr>
             <td><a href ng:click="invoice.items.$add()">add item</a></td>
             <td></td>
             <td>Total:</td>
             <td>{{invoice.items.$sum('qty*cost') | currency}}</td>
           </tr>
         </table>
        </doc:source>
        <doc:scenario>
         //TODO: these specs are lame because I had to work around issues #164 and #167
         it('should initialize and calculate the totals', function() {
           expect(repeater('.doc-example-live table tr', 'item in invoice.items').count()).toBe(3);
           expect(repeater('.doc-example-live table tr', 'item in invoice.items').row(1)).
             toEqual(['$99.50']);
           expect(binding("invoice.items.$sum('qty*cost')")).toBe('$99.50');
           expect(binding("invoice.items.$sum('qty*cost')")).toBe('$99.50');
         });

         it('should add an entry and recalculate', function() {
           element('.doc-example-live a:contains("add item")').click();
           using('.doc-example-live tr:nth-child(3)').input('item.qty').enter('20');
           using('.doc-example-live tr:nth-child(3)').input('item.cost').enter('100');

           expect(repeater('.doc-example-live table tr', 'item in invoice.items').row(2)).
             toEqual(['$2,000.00']);
           expect(binding("invoice.items.$sum('qty*cost')")).toBe('$2,099.50');
         });
        </doc:scenario>
      </doc:example>
   */
  'sum':function(array, expression) {
    var fn = angularFunction.compile(expression);
    var sum = 0;
    for (var i = 0; i < array.length; i++) {
      var value = 1 * fn(array[i]);
      if (!isNaN(value)){
        sum += value;
      }
    }
    return sum;
  },


  /**
   * @ngdoc function
   * @name angular.Array.remove
   * @function
   *
   * @description
   * Modifies `array` by removing an element from it. The element will be looked up using the
   * {@link angular.Array.indexOf indexOf} function on the `array` and only the first instance of
   * the element will be removed.
   *
   * Note: this function is used to augment the `Array` type in angular expressions. See
   * {@link angular.Array} for more info.
   *
   * @param {Array} array Array from which an element should be removed.
   * @param {*} value Element to be removed.
   * @returns {*} The removed element.
   *
   * @example
     <doc:example>
       <doc:source>
         <ul ng:init="tasks=['Learn Angular', 'Read Documentation',
                             'Check out demos', 'Build cool applications']">
           <li ng:repeat="task in tasks">
             {{task}} [<a href="" ng:click="tasks.$remove(task)">X</a>]
           </li>
         </ul>
         <hr/>
         tasks = {{tasks}}
       </doc:source>
       <doc:scenario>
         it('should initialize the task list with for tasks', function() {
           expect(repeater('.doc-example-live ul li', 'task in tasks').count()).toBe(4);
           expect(repeater('.doc-example-live ul li', 'task in tasks').column('task')).
             toEqual(['Learn Angular', 'Read Documentation', 'Check out demos',
                      'Build cool applications']);
         });

         it('should initialize the task list with for tasks', function() {
           element('.doc-example-live ul li a:contains("X"):first').click();
           expect(repeater('.doc-example-live ul li', 'task in tasks').count()).toBe(3);

           element('.doc-example-live ul li a:contains("X"):last').click();
           expect(repeater('.doc-example-live ul li', 'task in tasks').count()).toBe(2);

           expect(repeater('.doc-example-live ul li', 'task in tasks').column('task')).
             toEqual(['Read Documentation', 'Check out demos']);
         });
       </doc:scenario>
     </doc:example>
   */
  'remove':function(array, value) {
    var index = indexOf(array, value);
    if (index >=0)
      array.splice(index, 1);
    return value;
  },


  /**
   * @ngdoc function
   * @name angular.Array.filter
   * @function
   *
   * @description
   * Selects a subset of items from `array` and returns it as a new array.
   *
   * Note: this function is used to augment the `Array` type in angular expressions. See
   * {@link angular.Array} for more info.
   *
   * @param {Array} array The source array.
   * @param {string|Object|function()} expression The predicate to be used for selecting items from
   *   `array`.
   *
   *   Can be one of:
   *
   *   - `string`: Predicate that results in a substring match using the value of `expression`
   *     string. All strings or objects with string properties in `array` that contain this string
   *     will be returned. The predicate can be negated by prefixing the string with `!`.
   *
   *   - `Object`: A pattern object can be used to filter specific properties on objects contained
   *     by `array`. For example `{name:"M", phone:"1"}` predicate will return an array of items
   *     which have property `name` containing "M" and property `phone` containing "1". A special
   *     property name `$` can be used (as in `{$:"text"}`) to accept a match against any
   *     property of the object. That's equivalent to the simple substring match with a `string`
   *     as described above.
   *
   *   - `function`: A predicate function can be used to write arbitrary filters. The function is
   *     called for each element of `array`. The final result is an array of those elements that
   *     the predicate returned true for.
   *
   * @example
     <doc:example>
       <doc:source>
         <div ng:init="friends = [{name:'John', phone:'555-1276'},
                                  {name:'Mary', phone:'800-BIG-MARY'},
                                  {name:'Mike', phone:'555-4321'},
                                  {name:'Adam', phone:'555-5678'},
                                  {name:'Julie', phone:'555-8765'}]"></div>

         Search: <input name="searchText"/>
         <table id="searchTextResults">
           <tr><th>Name</th><th>Phone</th><tr>
           <tr ng:repeat="friend in friends.$filter(searchText)">
             <td>{{friend.name}}</td>
             <td>{{friend.phone}}</td>
           <tr>
         </table>
         <hr>
         Any: <input name="search.$"/> <br>
         Name only <input name="search.name"/><br>
         Phone only <input name="search.phone"/><br>
         <table id="searchObjResults">
           <tr><th>Name</th><th>Phone</th><tr>
           <tr ng:repeat="friend in friends.$filter(search)">
             <td>{{friend.name}}</td>
             <td>{{friend.phone}}</td>
           <tr>
         </table>
       </doc:source>
       <doc:scenario>
         it('should search across all fields when filtering with a string', function() {
           input('searchText').enter('m');
           expect(repeater('#searchTextResults tr', 'friend in friends').column('name')).
             toEqual(['Mary', 'Mike', 'Adam']);

           input('searchText').enter('76');
           expect(repeater('#searchTextResults tr', 'friend in friends').column('name')).
             toEqual(['John', 'Julie']);
         });

         it('should search in specific fields when filtering with a predicate object', function() {
           input('search.$').enter('i');
           expect(repeater('#searchObjResults tr', 'friend in friends').column('name')).
             toEqual(['Mary', 'Mike', 'Julie']);
         });
       </doc:scenario>
     </doc:example>
   */
  'filter':function(array, expression) {
    var predicates = [];
    predicates.check = function(value) {
      for (var j = 0; j < predicates.length; j++) {
        if(!predicates[j](value)) {
          return false;
        }
      }
      return true;
    };
    var search = function(obj, text){
      if (text.charAt(0) === '!') {
        return !search(obj, text.substr(1));
      }
      switch (typeof obj) {
      case "boolean":
      case "number":
      case "string":
        return ('' + obj).toLowerCase().indexOf(text) > -1;
      case "object":
        for ( var objKey in obj) {
          if (objKey.charAt(0) !== '$' && search(obj[objKey], text)) {
            return true;
          }
        }
        return false;
      case "array":
        for ( var i = 0; i < obj.length; i++) {
          if (search(obj[i], text)) {
            return true;
          }
        }
        return false;
      default:
        return false;
      }
    };
    switch (typeof expression) {
      case "boolean":
      case "number":
      case "string":
        expression = {$:expression};
      case "object":
        for (var key in expression) {
          if (key == '$') {
            (function(){
              var text = (''+expression[key]).toLowerCase();
              if (!text) return;
              predicates.push(function(value) {
                return search(value, text);
              });
            })();
          } else {
            (function(){
              var path = key;
              var text = (''+expression[key]).toLowerCase();
              if (!text) return;
              predicates.push(function(value) {
                return search(getter(value, path), text);
              });
            })();
          }
        }
        break;
      case 'function':
        predicates.push(expression);
        break;
      default:
        return array;
    }
    var filtered = [];
    for ( var j = 0; j < array.length; j++) {
      var value = array[j];
      if (predicates.check(value)) {
        filtered.push(value);
      }
    }
    return filtered;
  },


  /**
   * @workInProgress
   * @ngdoc function
   * @name angular.Array.add
   * @function
   *
   * @description
   * `add` is a function similar to JavaScript's `Array#push` method, in that it appends a new
   * element to an array. The difference is that the value being added is optional and defaults to
   * an empty object.
   *
   * Note: this function is used to augment the `Array` type in angular expressions. See
   * {@link angular.Array} for more info.
   *
   * @param {Array} array The array expand.
   * @param {*=} [value={}] The value to be added.
   * @returns {Array} The expanded array.
   *
   * @TODO simplify the example.
   *
   * @example
   * This example shows how an initially empty array can be filled with objects created from user
   * input via the `$add` method.
     <doc:example>
       <doc:source>
         [<a href="" ng:click="people.$add()">add empty</a>]
         [<a href="" ng:click="people.$add({name:'John', sex:'male'})">add 'John'</a>]
         [<a href="" ng:click="people.$add({name:'Mary', sex:'female'})">add 'Mary'</a>]

         <ul ng:init="people=[]">
           <li ng:repeat="person in people">
             <input name="person.name">
             <select name="person.sex">
               <option value="">--chose one--</option>
               <option>male</option>
               <option>female</option>
             </select>
             [<a href="" ng:click="people.$remove(person)">X</a>]
           </li>
         </ul>
         <pre>people = {{people}}</pre>
       </doc:source>
       <doc:scenario>
         beforeEach(function() {
            expect(binding('people')).toBe('people = []');
         });

         it('should create an empty record when "add empty" is clicked', function() {
           element('.doc-example-live a:contains("add empty")').click();
           expect(binding('people')).toBe('people = [{\n  "name":"",\n  "sex":null}]');
         });

         it('should create a "John" record when "add \'John\'" is clicked', function() {
           element('.doc-example-live a:contains("add \'John\'")').click();
           expect(binding('people')).toBe('people = [{\n  "name":"John",\n  "sex":"male"}]');
         });

         it('should create a "Mary" record when "add \'Mary\'" is clicked', function() {
           element('.doc-example-live a:contains("add \'Mary\'")').click();
           expect(binding('people')).toBe('people = [{\n  "name":"Mary",\n  "sex":"female"}]');
         });

         it('should delete a record when "X" is clicked', function() {
            element('.doc-example-live a:contains("add empty")').click();
            element('.doc-example-live li a:contains("X"):first').click();
            expect(binding('people')).toBe('people = []');
         });
       </doc:scenario>
     </doc:example>
   */
  'add':function(array, value) {
    array.push(isUndefined(value)? {} : value);
    return array;
  },


  /**
   * @ngdoc function
   * @name angular.Array.count
   * @function
   *
   * @description
   * Determines the number of elements in an array. Optionally it will count only those elements
   * for which the `condition` evaluates to `true`.
   *
   * Note: this function is used to augment the `Array` type in angular expressions. See
   * {@link angular.Array} for more info.
   *
   * @param {Array} array The array to count elements in.
   * @param {(function()|string)=} condition A function to be evaluated or angular expression to be
   *     compiled and evaluated. The element that is currently being iterated over, is exposed to
   *     the `condition` as `this`.
   * @returns {number} Number of elements in the array (for which the condition evaluates to true).
   *
   * @example
     <doc:example>
       <doc:source>
         <pre ng:init="items = [{name:'knife', points:1},
                                {name:'fork', points:3},
                                {name:'spoon', points:1}]"></pre>
         <ul>
           <li ng:repeat="item in items">
              {{item.name}}: points=
              <input type="text" name="item.points"/> <!-- id="item{{$index}} -->
           </li>
         </ul>
         <p>Number of items which have one point: <em>{{ items.$count('points==1') }}</em></p>
         <p>Number of items which have more than one point: <em>{{items.$count('points&gt;1')}}</em></p>
       </doc:source>
       <doc:scenario>
         it('should calculate counts', function() {
           expect(binding('items.$count(\'points==1\')')).toEqual('2');
           expect(binding('items.$count(\'points>1\')')).toEqual('1');
         });

         it('should recalculate when updated', function() {
           using('.doc-example-live li:first-child').input('item.points').enter('23');
           expect(binding('items.$count(\'points==1\')')).toEqual('1');
           expect(binding('items.$count(\'points>1\')')).toEqual('2');
         });
       </doc:scenario>
     </doc:example>
   */
  'count':function(array, condition) {
    if (!condition) return array.length;
    var fn = angularFunction.compile(condition), count = 0;
    forEach(array, function(value){
      if (fn(value)) {
        count ++;
      }
    });
    return count;
  },


  /**
   * @ngdoc function
   * @name angular.Array.orderBy
   * @function
   *
   * @description
   * Orders `array` by the `expression` predicate.
   *
   * Note: this function is used to augment the `Array` type in angular expressions. See
   * {@link angular.Array} for more info.
   *
   * @param {Array} array The array to sort.
   * @param {function(*)|string|Array.<(function(*)|string)>} expression A predicate to be
   *    used by the comparator to determine the order of elements.
   *
   *    Can be one of:
   *
   *    - `function`: getter function. The result of this function will be sorted using the
   *      `<`, `=`, `>` operator
   *    - `string`: angular expression which evaluates to an object to order by, such as 'name' to
   *      sort by a property called 'name'. Optionally prefixed with `+` or `-` to control ascending
   *      or descending sort order (e.g. +name or -name).
   *    - `Array`: array of function or string predicates, such that a first predicate in the array
   *      is used for sorting, but when the items are equivalent next predicate is used.
   *
   * @param {boolean=} reverse Reverse the order the array.
   * @returns {Array} Sorted copy of the source array.
   *
   * @example
     <doc:example>
       <doc:source>
         <div ng:init="friends = [{name:'John', phone:'555-1212', age:10},
                                  {name:'Mary', phone:'555-9876', age:19},
                                  {name:'Mike', phone:'555-4321', age:21},
                                  {name:'Adam', phone:'555-5678', age:35},
                                  {name:'Julie', phone:'555-8765', age:29}]"></div>

         <pre>Sorting predicate = {{predicate}}; reverse = {{reverse}}</pre>
         <hr/>
         [ <a href="" ng:click="predicate=''">unsorted</a> ]
         <table ng:init="predicate='-age'">
           <tr>
             <th><a href="" ng:click="predicate = 'name'; reverse=false">Name</a>
                 (<a href ng:click="predicate = '-name'; reverse=false">^</a>)</th>
             <th><a href="" ng:click="predicate = 'phone'; reverse=!reverse">Phone Number</a></th>
             <th><a href="" ng:click="predicate = 'age'; reverse=!reverse">Age</a></th>
           <tr>
           <tr ng:repeat="friend in friends.$orderBy(predicate, reverse)">
             <td>{{friend.name}}</td>
             <td>{{friend.phone}}</td>
             <td>{{friend.age}}</td>
           <tr>
         </table>
       </doc:source>
       <doc:scenario>
         it('should be reverse ordered by aged', function() {
           expect(binding('predicate')).toBe('Sorting predicate = -age; reverse = ');
           expect(repeater('.doc-example-live table', 'friend in friends').column('friend.age')).
             toEqual(['35', '29', '21', '19', '10']);
           expect(repeater('.doc-example-live table', 'friend in friends').column('friend.name')).
             toEqual(['Adam', 'Julie', 'Mike', 'Mary', 'John']);
         });

         it('should reorder the table when user selects different predicate', function() {
           element('.doc-example-live a:contains("Name")').click();
           expect(repeater('.doc-example-live table', 'friend in friends').column('friend.name')).
             toEqual(['Adam', 'John', 'Julie', 'Mary', 'Mike']);
           expect(repeater('.doc-example-live table', 'friend in friends').column('friend.age')).
             toEqual(['35', '10', '29', '19', '21']);

           element('.doc-example-live a:contains("Phone")').click();
           expect(repeater('.doc-example-live table', 'friend in friends').column('friend.phone')).
             toEqual(['555-9876', '555-8765', '555-5678', '555-4321', '555-1212']);
           expect(repeater('.doc-example-live table', 'friend in friends').column('friend.name')).
             toEqual(['Mary', 'Julie', 'Adam', 'Mike', 'John']);
         });
       </doc:scenario>
     </doc:example>
   */
  'orderBy':function(array, sortPredicate, reverseOrder) {
    if (!sortPredicate) return array;
    sortPredicate = isArray(sortPredicate) ? sortPredicate: [sortPredicate];
    sortPredicate = map(sortPredicate, function(predicate){
      var descending = false, get = predicate || identity;
      if (isString(predicate)) {
        if ((predicate.charAt(0) == '+' || predicate.charAt(0) == '-')) {
          descending = predicate.charAt(0) == '-';
          predicate = predicate.substring(1);
        }
        get = expressionCompile(predicate);
      }
      return reverseComparator(function(a,b){
        return compare(get(a),get(b));
      }, descending);
    });
    var arrayCopy = [];
    for ( var i = 0; i < array.length; i++) { arrayCopy.push(array[i]); }
    return arrayCopy.sort(reverseComparator(comparator, reverseOrder));

    function comparator(o1, o2){
      for ( var i = 0; i < sortPredicate.length; i++) {
        var comp = sortPredicate[i](o1, o2);
        if (comp !== 0) return comp;
      }
      return 0;
    }
    function reverseComparator(comp, descending) {
      return toBoolean(descending)
          ? function(a,b){return comp(b,a);}
          : comp;
    }
    function compare(v1, v2){
      var t1 = typeof v1;
      var t2 = typeof v2;
      if (t1 == t2) {
        if (t1 == "string") v1 = v1.toLowerCase();
        if (t1 == "string") v2 = v2.toLowerCase();
        if (v1 === v2) return 0;
        return v1 < v2 ? -1 : 1;
      } else {
        return t1 < t2 ? -1 : 1;
      }
    }
  },


  /**
   * @ngdoc function
   * @name angular.Array.limitTo
   * @function
   *
   * @description
   * Creates a new array containing only the first, or last `limit` number of elements of the
   * source `array`.
   *
   * Note: this function is used to augment the `Array` type in angular expressions. See
   * {@link angular.Array} for more info.
   *
   * @param {Array} array Source array to be limited.
   * @param {string|Number} limit The length of the returned array. If the number is positive, the
   *     first `limit` items from the source array will be copied, if the number is negative, the
   *     last `limit` items will be copied.
   * @returns {Array} A new sub-array of length `limit`.
   *
   * @example
     <doc:example>
       <doc:source>
         <div ng:init="numbers = [1,2,3,4,5,6,7,8,9]">
           Limit [1,2,3,4,5,6,7,8,9] to: <input name="limit" value="3"/>
           <p>Output: {{ numbers.$limitTo(limit) | json }}</p>
         </div>
       </doc:source>
       <doc:scenario>
         it('should limit the numer array to first three items', function() {
           expect(element('.doc-example-live input[name=limit]').val()).toBe('3');
           expect(binding('numbers.$limitTo(limit) | json')).toEqual('[1,2,3]');
         });

         it('should update the output when -3 is entered', function() {
           input('limit').enter(-3);
           expect(binding('numbers.$limitTo(limit) | json')).toEqual('[7,8,9]');
         });
       </doc:scenario>
     </doc:example>
   */
  limitTo: function(array, limit) {
    limit = parseInt(limit, 10);
    var out = [],
        i, n;

    if (limit > 0) {
      i = 0;
      n = limit;
    } else {
      i = array.length + limit;
      n = array.length;
    }

    for (; i<n; i++) {
      out.push(array[i]);
    }

    return out;
  }
};

var R_ISO8061_STR = /^(\d{4})-(\d\d)-(\d\d)(?:T(\d\d)(?:\:(\d\d)(?:\:(\d\d)(?:\.(\d{3}))?)?)?Z)?$/;

var angularString = {
  'quote':function(string) {
    return '"' + string.replace(/\\/g, '\\\\').
                        replace(/"/g, '\\"').
                        replace(/\n/g, '\\n').
                        replace(/\f/g, '\\f').
                        replace(/\r/g, '\\r').
                        replace(/\t/g, '\\t').
                        replace(/\v/g, '\\v') +
             '"';
  },
  'quoteUnicode':function(string) {
    var str = angular['String']['quote'](string);
    var chars = [];
    for ( var i = 0; i < str.length; i++) {
      var ch = str.charCodeAt(i);
      if (ch < 128) {
        chars.push(str.charAt(i));
      } else {
        var encode = "000" + ch.toString(16);
        chars.push("\\u" + encode.substring(encode.length - 4));
      }
    }
    return chars.join('');
  },

  /**
   * Tries to convert input to date and if successful returns the date, otherwise returns the input.
   * @param {string} string
   * @return {(Date|string)}
   */
  'toDate':function(string){
    var match;
    if (isString(string) && (match = string.match(R_ISO8061_STR))){
      var date = new Date(0);
      date.setUTCFullYear(match[1], match[2] - 1, match[3]);
      date.setUTCHours(match[4]||0, match[5]||0, match[6]||0, match[7]||0);
      return date;
    }
    return string;
  }
};

var angularDate = {
    'toString':function(date){
       if (!date) return date;

       var isoString = date.toISOString ? date.toISOString() : '';

       return (isoString.length==24) ?
                isoString :
                padNumber(date.getUTCFullYear(), 4) + '-' +
                  padNumber(date.getUTCMonth() + 1, 2) + '-' +
                  padNumber(date.getUTCDate(), 2) + 'T' +
                  padNumber(date.getUTCHours(), 2) + ':' +
                  padNumber(date.getUTCMinutes(), 2) + ':' +
                  padNumber(date.getUTCSeconds(), 2) + '.' +
                  padNumber(date.getUTCMilliseconds(), 3) + 'Z';
    }
  };

var angularFunction = {
  'compile': function(expression) {
    if (isFunction(expression)){
      return expression;
    } else if (expression){
      return expressionCompile(expression);
    } else {
     return identity;
   }
  }
};

/**
 * Computes a hash of an 'obj'.
 * Hash of a:
 *  string is string
 *  number is number as string
 *  object is either call $hashKey function on object or assign unique hashKey id.
 *
 * @param obj
 * @returns {String} hash string such that the same input will have the same hash string
 */
function hashKey(obj) {
  var objType = typeof obj;
  var key = obj;
  if (objType == 'object') {
    if (typeof (key = obj.$hashKey) == 'function') {
      // must invoke on object to keep the right this
      key = obj.$hashKey();
    } else if (key === undefined) {
      key = obj.$hashKey = nextUid();
    }
  };
  return objType + ':' + key;
}

/**
 * HashMap which can use objects as keys
 */
function HashMap(){}
HashMap.prototype = {
  /**
   * Store key value pair
   * @param key key to store can be any type
   * @param value value to store can be any type
   * @returns old value if any
   */
  put: function(key, value) {
    var _key = hashKey(key);
    var oldValue = this[_key];
    this[_key] = value;
    return oldValue;
  },

  /**
   * @param key
   * @returns the value for the key
   */
  get: function(key) {
    return this[hashKey(key)];
  },

  /**
   * Remove the key/value pair
   * @param key
   * @returns value associated with key before it was removed
   */
  remove: function(key) {
    var _key = hashKey(key);
    var value = this[_key];
    delete this[_key];
    return value;
  }
};

function defineApi(dst, chain){
  angular[dst] = angular[dst] || {};
  forEach(chain, function(parent){
    extend(angular[dst], parent);
  });
}
defineApi('Global', [angularGlobal]);
defineApi('Collection', [angularGlobal, angularCollection]);
defineApi('Array', [angularGlobal, angularCollection, angularArray]);
defineApi('Object', [angularGlobal, angularCollection, angularObject]);
defineApi('String', [angularGlobal, angularString]);
defineApi('Date', [angularGlobal, angularDate]);
//IE bug
angular.Date.toString = angularDate.toString;
defineApi('Function', [angularGlobal, angularCollection, angularFunction]);
