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
 * * __Angular expressions:__ Functions are bound to all objects and augment the Object type.
 * The names of these methods are prefixed with the '$' character in order to minimize naming
 * collisions. To call a method, invoke the function without the first argument, for example,
 * `myObject.$foo(param2)`.
 *
 * * __JavaScript code:__ Functions don't augment the Object type and must be invoked as functions
 * of `angular.Object` as `angular.Object.foo(myObject, param2)`.
 *
 *   * {@link angular.Object.copy angular.Object.copy()} - Creates a deep copy of the source
 *     parameter.
 *   * {@link angular.Object.equals angular.Object.equals()} - Determines if two objects or values
 *     are equivalent.
 *   * {@link angular.Object.size angular.Object.size()} - Determines the number of elements in
 *     strings, arrays, and objects.
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
 * * __Angular expressions:__ Functions are bound to the Array objects and augment the Array type
 * as array methods. The names of these methods are prefixed with the `$` character to minimize
 * naming collisions. To call a method, invoke myArrayObject.$foo(params).
 *
 *     Because Array type is a subtype of the Object type, all angular.Object functions augment
 *     the Array type in Angular expressions as well.
 *
 * * __JavaScript code:__ Functions do nor augment the Array type and must be invoked as functions
 * of `angular.Array` as `angular.Array.foo(myArrayObject, params)`.
 *
 * The following APIs are built in to the Angular Array object:
 *
 * * {@link angular.Array.add angular.Array.add()} - Optionally adds a new element to an array.
 * * {@link angular.Array.count angular.Array.count()} - Determines the number of elements in an
 *                                                       array.
 * * {@link angular.Array.filter angular.Array.filter()} - Returns the subset of elements specified
 *                                                         in the filter as a new array.
 * * {@link angular.Array.indexOf angular.Array.indexOf()} - Determines the index of an array
 *                                                           value.
 * * {@link angular.Array.limitTo angular.Array.limitTo()} - Creates a sub-array of an existing
 *                                                           array.
 * * {@link angular.Array.orderBy angular.Array.orderBy()} - Orders array elements.
 * * {@link angular.Array.remove angular.Array.remove()} - Removes array elements.
 * * {@link angular.Array.sum angular.Array.sum()} - Sums the numbers in an array.
 */
var angularArray = {


  /**
   * @ngdoc function
   * @name angular.Array.indexOf
   * @function
   *
   * @description
   * Determines the index of a `value` in an `array`.
   *
   * Note: This function is used to augment the `Array` type in Angular expressions. See
   * {@link angular.Array} for more information about Angular arrays.
   *
   * @param {Array} array Array to search.
   * @param {*} value Value to search for.
   * @returns {number} The position of the element in `array`. The position is 0-based.
   * If the value cannot be found, `-1` is returned.
   *
   * @example
      <doc:example>
        <doc:source>
         <script>
           function Ctrl() {
             this.books = ['Moby Dick', 'Great Gatsby', 'Romeo and Juliet'];
             this.bookName = 'Romeo and Juliet';
           }
         </script>
         <div ng:controller="Ctrl">
           <input ng:model='bookName'> <br>
           Index of '{{bookName}}' in the list {{books}} is <em>{{books.$indexOf(bookName)}}</em>.
         </div>
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
   * The `sum` function calculates the sum of all numbers in an `array`. If an `expression` is
   * supplied, `sum` evaluates each element in the `array` with the expression and then returns
   * the sum of the calculated values.
   *
   * Note: This function is used to augment the `Array` type in Angular expressions. See
   * {@link angular.Array} for more info about Angular arrays.
   *
   * @param {Array} array The source array.
   * @param {(string|function())=} expression Angular expression or a function to be evaluated for
   *  each element in `array`. The array element becomes the `this` during the evaluation.
   * @returns {number} Sum of items in the array.
   *
   * @example
      <doc:example>
       <doc:source>
        <script>
          function Ctrl() {
            this.invoice = {
              items:[ {
                   qty:10,
                   description:'gadget',
                   cost:9.95
                 }
              ]
            };
          }
        </script>
        <table class="invoice" ng:controller="Ctrl">
         <tr><th>Qty</th><th>Description</th><th>Cost</th><th>Total</th><th></th></tr>
         <tr ng:repeat="item in invoice.items">
           <td><input type="integer" ng:model="item.qty" size="4" required></td>
           <td><input type="text" ng:model="item.description"></td>
           <td><input type="number" ng:model="item.cost" required size="6"></td>
           <td>{{item.qty * item.cost | currency}}</td>
           <td>[<a href ng:click="invoice.items.$remove(item)">X</a>]</td>
         </tr>
         <tr>
           <td><a href ng:click="invoice.items.$add({qty:1, cost:0})">add item</a></td>
           <td></td>
           <td>Total:</td>
           <td>{{invoice.items.$sum('qty*cost') | currency}}</td>
         </tr>
        </table>
       </doc:source>
       <doc:scenario>
         //TODO: these specs are lame because I had to work around issues #164 and #167
         it('should initialize and calculate the totals', function() {
           expect(repeater('table.invoice tr', 'item in invoice.items').count()).toBe(3);
           expect(repeater('table.invoice tr', 'item in invoice.items').row(1)).
             toEqual(['$99.50']);
           expect(binding("invoice.items.$sum('qty*cost')")).toBe('$99.50');
           expect(binding("invoice.items.$sum('qty*cost')")).toBe('$99.50');
         });

         it('should add an entry and recalculate', function() {
           element('.doc-example-live a:contains("add item")').click();
           using('.doc-example-live tr:nth-child(3)').input('item.qty').enter('20');
           using('.doc-example-live tr:nth-child(3)').input('item.cost').enter('100');

           expect(repeater('table.invoice tr', 'item in invoice.items').row(2)).
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
   * Note: This function is used to augment the `Array` type in Angular expressions. See
   * {@link angular.Array} for more information about Angular arrays.
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
   * @name angular.Array.add
   * @function
   *
   * @description
   * The `add` function in Angualar is similar to JavaScript's `Array#push` method in that it
   * appends a new element to an array. Angular's function differs from the JavaScript method in
   * that specifying a value for the function is optional and the default for the function is an
   * empty object.
   *
   * Note: This function is used to augment the `Array` type in Angular expressions. See
   * {@link angular.Array} for more information about Angular arrays.
   *
   * @param {Array} array The array to be expanded.
   * @param {*=} [value={}] The value to be appended.
   * @returns {Array} The expanded array.
   *
   * @TODO simplify the example.
   *
   * @example
   * This example shows how you can use the `$add` method to populate an initially empty array
   * with objects created from user input.
     <doc:example>
       <doc:source>
         <script>
           function Ctrl() {
             this.people = [];
           }
         </script>
         <div ng:controller="Ctrl">
           [<a href="" ng:click="people.$add()">add empty</a>]
           [<a href="" ng:click="people.$add({name:'John', sex:'male'})">add 'John'</a>]
           [<a href="" ng:click="people.$add({name:'Mary', sex:'female'})">add 'Mary'</a>]

           <ul>
             <li ng:repeat="person in people">
               <input ng:model="person.name">
               <select ng:model="person.sex">
                 <option value="">--chose one--</option>
                 <option>male</option>
                 <option>female</option>
               </select>
               [<a href="" ng:click="people.$remove(person)">X</a>]
             </li>
           </ul>
           <pre>people = {{people}}</pre>
         </div>
       </doc:source>
       <doc:scenario>
         beforeEach(function() {
            expect(binding('people')).toBe('people = []');
         });

         it('should create an empty record when "add empty" is clicked', function() {
           element('.doc-example-live a:contains("add empty")').click();
           expect(binding('people')).toBe('people = [{\n  }]');
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
   * Determines the number of elements in an array. Provides an option for counting only those
   * elements for which a specified `condition` evaluates to `true`.
   *
   * Note: This function is used to augment the `Array` type in Angular expressions. See
   * {@link angular.Array} for more information about Angular arrays.
   *
   * @param {Array} array The array containing the elements to be counted.
   * @param {(function()|string)=} condition A function to be evaluated or
   *     an Angular expression to be compiled and evaluated. The element being
   *     iterated over is exposed to the `condition` as `this`.
   * @returns {number} Number of elements in the array. If a `condition` is specified, returns
   * the number of elements whose `condition` evaluates to `true`.
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
              <input type="text" ng:model="item.points"/> <!-- id="item{{$index}} -->
           </li>
         </ul>
         <p>Number of items which have one point: <em>{{ items.$count('points==1') }}</em></p>
         <p>Number of items which have more than one point:
         <em>{{items.$count('points&gt;1')}}</em></p>
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
  }
};


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
  }
};

var angularDate = {
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
 *  object is either result of calling $$hashKey function on the object or uniquely generated id,
 *         that is also assigned to the $$hashKey property of the object.
 *
 * @param obj
 * @returns {String} hash string such that the same input will have the same hash string.
 *         The resulting string key is in 'type:hashKey' format.
 */
function hashKey(obj) {
  var objType = typeof obj;
  var key = obj;
  if (objType == 'object') {
    if (typeof (key = obj.$$hashKey) == 'function') {
      // must invoke on object to keep the right this
      key = obj.$$hashKey();
    } else if (key === undefined) {
      key = obj.$$hashKey = nextUid();
    }
  }
  return objType + ':' + key;
}

/**
 * HashMap which can use objects as keys
 */
function HashMap(array){
  forEach(array, this.put, this);
}
HashMap.prototype = {
  /**
   * Store key value pair
   * @param key key to store can be any type
   * @param value value to store can be any type
   */
  put: function(key, value) {
    this[hashKey(key)] = value;
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
   */
  remove: function(key) {
    var value = this[key = hashKey(key)];
    delete this[key];
    return value;
  }
};

/**
 * A map where multiple values can be added to the same key such that they form a queue.
 * @returns {HashQueueMap}
 */
function HashQueueMap() {}
HashQueueMap.prototype = {
  /**
   * Same as array push, but using an array as the value for the hash
   */
  push: function(key, value) {
    var array = this[key = hashKey(key)];
    if (!array) {
      this[key] = [value];
    } else {
      array.push(value);
    }
  },

  /**
   * Same as array shift, but using an array as the value for the hash
   */
  shift: function(key) {
    var array = this[key = hashKey(key)];
    if (array) {
      if (array.length == 1) {
        delete this[key];
        return array[0];
      } else {
        return array.shift();
      }
    }
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
