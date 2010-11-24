var angularGlobal = {
  'typeOf':function(obj){
    if (obj === _null) return $null;
    var type = typeof obj;
    if (type == $object) {
      if (obj instanceof Array) return $array;
      if (isDate(obj)) return $date;
      if (obj.nodeType == 1) return $element;
    }
    return type;
  }
};

var angularCollection = {
  'copy': copy,
  'size': size,
  'equals': equals
};
var angularObject = {
  'extend': extend
};

/**
 * @workInProgress
 * @ngdoc overview
 * @name angular.Array
 *
 * @description
 * Utility functions for manipulation with JavaScript Array objects.
 *
 * These functions are exposed in two ways:
 *
 * - **in angular expressions**: the functions are bound to the Array objects and augment the Array
 *   type as array methods. The names of these methods are prefixed with `$` character to minimize
 *   naming collisions. To call a method, invoke `myArrayObject.$foo(params)`.
 *
 * - **in JavaScript code**: the functions don't augment the Array type and must be invoked as
 *   functions of `angular.Array` as `angular.Array.foo(myArrayObject, params)`.
 *
 */
var angularArray = {


  /**
   * @workInProgress
   * @ngdoc function
   * @name angular.Array.indexOf
   * @function
   *
   * @description
   * Determines the index of `value` in `array`.
   *
   * Note: this function is used to augment the Array type in angular expressions. See
   * {@link angular.Array} for more info.
   *
   * @param {Array} array Array to search.
   * @param {*} value Value to search for.
   * @returns {number} The position of the element in `array`. The position is 0-based. `-1` is returned if the value can't be found.
   *
   * @example
     <div ng:init="books = ['Moby Dick', 'Great Gatsby', 'Romeo and Juliet']"></div>
     <input name='bookName' value='Romeo and Juliet'> <br>
     Index of '{{bookName}}' in the list {{books}} is <em>{{books.$indexOf(bookName)}}</em>.

     @scenario
     it('should correctly calculate the initial index', function() {
       expect(binding('books.$indexOf(bookName)')).toBe('2');
     });

     it('should recalculate', function() {
       input('bookName').enter('foo');
       expect(binding('books.$indexOf(bookName)')).toBe('-1');

       input('bookName').enter('Moby Dick');
       expect(binding('books.$indexOf(bookName)')).toBe('0');
     });
   */
  'indexOf': indexOf,
  'sum':function(array, expression) {
    var fn = angular['Function']['compile'](expression);
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
   * @workInProgress
   * @ngdoc function
   * @name angular.Array.remove
   * @function
   *
   * @description
   * Modifies `array` by removing an element from it. The element will be looked up using the
   * {@link angular.Array.indexOf indexOf} function on the `array` and only the first instance of
   * the element will be removed.
   *
   * Note: this function is used to augment the Array type in angular expressions. See
   * {@link angular.Array} for more info.
   *
   * @param {Array} array Array from which an element should be removed.
   * @param {*} value Element to be removed.
   * @returns {*} The removed element.
   *
   * @example
     <ul ng:init="tasks=['Learn Angular', 'Read Documentation',
                         'Check out demos', 'Build cool applications']">
       <li ng:repeat="task in tasks">
         {{task}} [<a href="" ng:click="tasks.$remove(task)">X</a>]
       </li>
     </ul>
     <hr/>
     tasks = {{tasks}}

     @scenario
     it('should initialize the task list with for tasks', function() {
       expect(repeater('.doc-example ul li', 'task in tasks').count()).toBe(4);
       expect(repeater('.doc-example ul li', 'task in tasks').column('task')).
         toEqual(['Learn Angular', 'Read Documentation', 'Check out demos',
                  'Build cool applications']);
     });

     it('should initialize the task list with for tasks', function() {
       element('.doc-example ul li a:contains("X"):first').click();
       expect(repeater('.doc-example ul li', 'task in tasks').count()).toBe(3);

       element('.doc-example ul li a:contains("X"):last').click();
       expect(repeater('.doc-example ul li', 'task in tasks').count()).toBe(2);

       expect(repeater('.doc-example ul li', 'task in tasks').column('task')).
         toEqual(['Read Documentation', 'Check out demos']);
     });
   */
  'remove':function(array, value) {
    var index = indexOf(array, value);
    if (index >=0)
      array.splice(index, 1);
    return value;
  },


  /**
   * @workInProgress
   * @ngdoc function
   * @name angular.Array.filter
   * @function
   *
   * @description
   * Selects a subset of items from `array` and returns it as a new array.
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

     @scenario
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
      case $function:
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
   * element to an array, but it differs in that the value being added is optional and defaults to
   * an emty object.
   *
   * Note: this function is used to augment the Array type in angular expressions. See
   * {@link angular.Array} for more info.
   *
   * @param {Array} array The array expand.
   * @param {*=} [value={}] The value to be added.
   * @returns {Array} The expanded array.
   *
   * @exampleDescription
   * This example shows how an initially empty array can be filled with objects created from user
   * input via the `$add` method.
   *
   * @example
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

     @scenario
     beforeEach(function() {
        expect(binding('people')).toBe('people = []');
     });

     it('should create an empty record when "add empty" is clicked', function() {
       element('.doc-example a:contains("add empty")').click();
       expect(binding('people')).toBe('people = [{\n  "name":"",\n  "sex":null}]');
     });

     it('should create a "John" record when "add \'John\'" is clicked', function() {
       element('.doc-example a:contains("add \'John\'")').click();
       expect(binding('people')).toBe('people = [{\n  "name":"John",\n  "sex":"male"}]');
     });

     it('should create a "Mary" record when "add \'Mary\'" is clicked', function() {
       element('.doc-example a:contains("add \'Mary\'")').click();
       expect(binding('people')).toBe('people = [{\n  "name":"Mary",\n  "sex":"female"}]');
     });

     it('should delete a record when "X" is clicked', function() {
        element('.doc-example a:contains("add empty")').click();
        element('.doc-example li a:contains("X"):first').click();
        expect(binding('people')).toBe('people = []');
     });
   */
  'add':function(array, value) {
    array.push(isUndefined(value)? {} : value);
    return array;
  },


  /**
   * @workInProgress
   * @ngdoc function
   * @name angular.Array.count
   * @function
   *
   * @description
   * Determines the number of elements in an array. Optionally it will count only those elements
   * for which the `condition` evaluets to `true`.
   *
   * Note: this function is used to augment the Array type in angular expressions. See
   * {@link angular.Array} for more info.
   *
   * @param {Array} array The array to count elements in.
   * @param {(Function()|string)=} condition A function to be evaluated or angular expression to be
   *     compiled and evaluated. The element that is currently being iterated over, is exposed to
   *     the `condition` as `this`.
   * @returns {number} Number of elements in the array (for which the condition evaluates to true).
   *
   * @example
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

     @scenario
     it('should calculate counts', function() {
       expect(binding('items.$count(\'points==1\')')).toEqual(2);
       expect(binding('items.$count(\'points>1\')')).toEqual(1);
     });

     it('should recalculate when updated', function() {
       using('.doc-example li:first-child').input('item.points').enter('23');
       expect(binding('items.$count(\'points==1\')')).toEqual(1);
       expect(binding('items.$count(\'points>1\')')).toEqual(2);
     });
   */
  'count':function(array, condition) {
    if (!condition) return array.length;
    var fn = angular['Function']['compile'](condition), count = 0;
    foreach(array, function(value){
      if (fn(value)) {
        count ++;
      }
    });
    return count;
  },


  /**
   * @workInProgress
   * @ngdoc function
   * @name angular.Array.orderBy
   * @function
   *
   * @description
   * Orders `array` by the `expression` predicate.
   *
   * Note: this function is used to augment the Array type in angular expressions. See
   * {@link angular.Array} for more info.
   *
   * @param {Array} array The array to sort.
   * @param {function()|string|Array.<(function()|string)>} expression A predicate to be used by the
   *    comparator to determine the order of elements.
   *
   *    Can be one of:
   *
   *    - `function`: JavaScript's Array#sort comparator function
   *    - `string`: angular expression which evaluates to an object to order by, such as 'name' to
   *      sort by a property called 'name'. Optionally prefixed with `+` or `-` to control ascending
   *      or descending sort order (e.g. +name or -name).
   *    - `Array`: array of function or string predicates, such that a first predicate in the array
   *      is used for sorting, but when the items are equivalent next predicate is used.
   *
   * @param {boolean=} descend TODO
   * @returns {Array} Sorted copy of the source array.
   *
   * @example
     <div ng:init="friends = [{name:'John', phone:'555-1212', age:10},
                              {name:'Mary', phone:'555-9876', age:19},
                              {name:'Mike', phone:'555-4321', age:21},
                              {name:'Adam', phone:'555-5678', age:35},
                              {name:'Julie', phone:'555-8765', age:29}]"></div>

     <pre>Sorting predicate = {{predicate}}</pre>
     <hr/>
     <table ng:init="predicate='-age'">
       <tr>
         <th><a href="" ng:click="predicate = 'name'">Name</a>
             (<a href ng:click="predicate = '-name'">^</a>)</th>
         <th><a href="" ng:click="predicate = 'phone'">Phone</a>
             (<a href ng:click="predicate = '-phone'">^</a>)</th>
         <th><a href="" ng:click="predicate = 'age'">Age</a>
             (<a href ng:click="predicate = '-age'">^</a>)</th>
       <tr>
       <tr ng:repeat="friend in friends.$orderBy(predicate, true)">
         <td>{{friend.name}}</td>
         <td>{{friend.phone}}</td>
         <td>{{friend.age}}</td>
       <tr>
     </table>

     @scenario
     it('should be reverse ordered by aged', function() {
       expect(binding('predicate')).toBe('Sorting predicate = -age');
       expect(repeater('.doc-example table', 'friend in friends').column('friend.age')).
         toEqual(['35', '29', '21', '19', '10']);
       expect(repeater('.doc-example table', 'friend in friends').column('friend.name')).
         toEqual(['Adam', 'Julie', 'Mike', 'Mary', 'John']);
     });

     it('should reorder the table when user selects different predicate', function() {
       element('.doc-example a:contains("Name")').click();
       expect(repeater('.doc-example table', 'friend in friends').column('friend.name')).
         toEqual(['Adam', 'John', 'Julie', 'Mary', 'Mike']);
       expect(repeater('.doc-example table', 'friend in friends').column('friend.age')).
         toEqual(['35', '10', '29', '19', '21']);

       element('.doc-example a:contains("Phone")+a:contains("^")').click();
       expect(repeater('.doc-example table', 'friend in friends').column('friend.phone')).
         toEqual(['555-9876', '555-8765', '555-5678', '555-4321', '555-1212']);
       expect(repeater('.doc-example table', 'friend in friends').column('friend.name')).
         toEqual(['Mary', 'Julie', 'Adam', 'Mike', 'John']);
     });
   */
  //TODO: WTH is descend param for and how/when it should be used, how is it affected by +/- in
  //      predicate? the code below is impossible to read and specs are not very good.
  'orderBy':function(array, expression, descend) {
    expression = isArray(expression) ? expression: [expression];
    expression = map(expression, function($){
      var descending = false, get = $ || identity;
      if (isString($)) {
        if (($.charAt(0) == '+' || $.charAt(0) == '-')) {
          descending = $.charAt(0) == '-';
          $ = $.substring(1);
        }
        get = expressionCompile($).fnSelf;
      }
      return reverse(function(a,b){
        return compare(get(a),get(b));
      }, descending);
    });
    var arrayCopy = [];
    for ( var i = 0; i < array.length; i++) { arrayCopy.push(array[i]); }
    return arrayCopy.sort(reverse(comparator, descend));

    function comparator(o1, o2){
      for ( var i = 0; i < expression.length; i++) {
        var comp = expression[i](o1, o2);
        if (comp !== 0) return comp;
      }
      return 0;
    }
    function reverse(comp, descending) {
      return toBoolean(descending) ?
          function(a,b){return comp(b,a);} : comp;
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
   * @workInProgress
   * @ngdoc function
   * @name angular.Array.limitTo
   * @function
   *
   * @description
   * Creates a new array containing only the first, or last `limit` number of elements of the
   * source `array`.
   *
   * @param {Array} array Source array to be limited.
   * @param {string|Number} limit The length of the returned array. If the number is positive, the
   *     first `limit` items from the source array will be copied, if the number is negative, the
   *     last `limit` items will be copied.
   * @returns {Array} New array of length `limit`.
   *
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

var R_ISO8061_STR = /^(\d{4})-(\d\d)-(\d\d)(?:T(\d\d)(?:\:(\d\d)(?:\:(\d\d)(?:\.(\d{3}))?)?)?Z)?$/

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
      return !date ?
                date :
                date.toISOString ?
                  date.toISOString() :
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
  'compile':function(expression) {
    if (isFunction(expression)){
      return expression;
    } else if (expression){
      return expressionCompile(expression).fnSelf;
    } else {
      return identity;
    }
  }
};

function defineApi(dst, chain){
  angular[dst] = angular[dst] || {};
  foreach(chain, function(parent){
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
angular['Date']['toString'] = angularDate['toString'];
defineApi('Function', [angularGlobal, angularCollection, angularFunction]);
