'use strict';

/**
 * @ngdoc directive
 * @name ng.directive:ngRepeat
 *
 * @description
 * The `ngRepeat` directive instantiates a template once per item from a collection. Each template
 * instance gets its own scope, where the given loop variable is set to the current collection item,
 * and `$index` is set to the item index or key.
 *
 * Special properties are exposed on the local scope of each template instance, including:
 *
 *   * `$index` – `{number}` – iterator offset of the repeated element (0..length-1)
 *   * `$first` – `{boolean}` – true if the repeated element is first in the iterator.
 *   * `$middle` – `{boolean}` – true if the repeated element is between the first and last in the iterator.
 *   * `$last` – `{boolean}` – true if the repeated element is last in the iterator.
 *
 * @element ANY
 * @scope
 * @priority 1000
 * @param {repeat_expression} ngRepeat The expression indicating how to enumerate a collection. The
 *   following formats are currently supported:
 *
 *   * **for repeating over an array**:
 *     * `value` **`in`** `array`
 *     * `count` **`for`** `value` **`in`** `array`
 *
 *   * **for repeating over an object**:
 *     * `(key, value)` **`in`** `object`
 *     * `count` **`for`** `(key, value)` **`in`** `object`
 *
 * Where:
 *
 *   * **`array`** / **`object`**: an expression which evaluates to an array / object to iterate over.
 *   * **`value`**: local variable which will refer to each item in the `array` or each property value
 *      of `object` during iteration.
 *   * **`key`**: local variable which will refer to a property name in `object` during iteration.
 *   * **`count`**: local variable which will be assigned the value of the number of  items being
 *     repeated over
 *
 * @example
 * This example initializes the scope to a list of names and
 * then uses `ngRepeat` to display every person:
    <doc:example>
      <doc:source>
        <div ng-init="friends = [{name:'John', age:25}, {name:'Mary', age:28}]">
          I have {{friends.length}} friends. They are:
          <ul>
            <li ng-repeat="friend in friends">
              [{{$index + 1}}] {{friend.name}} who is {{friend.age}} years old.
            </li>
          </ul>
        </div>
      </doc:source>
      <doc:scenario>
         it('should check ng-repeat', function() {
           var r = using('.doc-example-live').repeater('ul li');
           expect(r.count()).toBe(2);
           expect(r.row(0)).toEqual(["1","John","25"]);
           expect(r.row(1)).toEqual(["2","Mary","28"]);
         });
      </doc:scenario>
    </doc:example>
 */
var ngRepeatDirective = ['$parse', function($parse) {
  return {
    transclude: 'element',
    priority: 1000,
    terminal: true,
    compile: function(element, attr, linker) {
      return function(scope, iterStartElement, attr){
        var expression = attr.ngRepeat;
        var match = expression.match(/^(?:(.+)\s+for)?\s*(.+)\s+in\s+(.*)\s*$/),
          lhs, rhs, countSet, valueIdent, keyIdent;
        if (! match) {
          throw Error("Expected ngRepeat in form of '_item_ in _collection_' but got '" +
            expression + "'.");
        }
        countSet = $parse(match[1]).assign;
        lhs = match[2];
        rhs = match[3];
        match = lhs.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/);
        if (!match) {
          throw Error("'item' in 'item in collection' should be identifier or (key, value) but got '" +
              lhs + "'.");
        }
        valueIdent = match[3] || match[1];
        keyIdent = match[2];

        // Store a list of elements from previous run. This is a hash where key is the item from the
        // iterator, and the value is an array of objects with following properties.
        //   - scope: bound scope
        //   - element: previous element.
        //   - index: position
        // We need an array of these objects since the same object can be returned from the iterator.
        // We expect this to be a rare case.
        var lastOrder = new HashQueueMap();

        scope.$watch(function ngRepeatWatch(scope){
          var index, length,
              collection = scope.$eval(rhs),
              cursor = iterStartElement,     // current position of the node
              // Same as lastOrder but it has the current state. It will become the
              // lastOrder on the next iteration.
              nextOrder = new HashQueueMap(),
              arrayLength,
              childScope,
              key, value, // key/value of iteration
              array,
              last;       // last object information {scope, element, index}



          if (!isArray(collection)) {
            // if object, extract keys, sort them and use to determine order of iteration over obj props
            array = [];
            for(key in collection) {
              if (collection.hasOwnProperty(key) && key.charAt(0) != '$') {
                array.push(key);
              }
            }
            array.sort();
          } else {
            array = collection || [];
          }

          arrayLength = array.length;
          if (countSet) countSet(scope, arrayLength);

          // we are not using forEach for perf reasons (trying to avoid #call)
          for (index = 0, length = array.length; index < length; index++) {
            key = (collection === array) ? index : array[index];
            value = collection[key];

            last = lastOrder.shift(value);

            if (last) {
              // if we have already seen this object, then we need to reuse the
              // associated scope/element
              childScope = last.scope;
              nextOrder.push(value, last);

              if (index === last.index) {
                // do nothing
                cursor = last.element;
              } else {
                // existing item which got moved
                last.index = index;
                // This may be a noop, if the element is next, but I don't know of a good way to
                // figure this out,  since it would require extra DOM access, so let's just hope that
                // the browsers realizes that it is noop, and treats it as such.
                cursor.after(last.element);
                cursor = last.element;
              }
            } else {
              // new item which we don't know about
              childScope = scope.$new();
            }

            childScope[valueIdent] = value;
            if (keyIdent) childScope[keyIdent] = key;
            childScope.$index = index;

            childScope.$first = (index === 0);
            childScope.$last = (index === (arrayLength - 1));
            childScope.$middle = !(childScope.$first || childScope.$last);
            childScope.$count = arrayLength;

            if (!last) {
              linker(childScope, function(clone){
                cursor.after(clone);
                last = {
                    scope: childScope,
                    element: (cursor = clone),
                    index: index
                  };
                nextOrder.push(value, last);
              });
            }
          }

          //shrink children
          for (key in lastOrder) {
            if (lastOrder.hasOwnProperty(key)) {
              array = lastOrder[key];
              while(array.length) {
                value = array.pop();
                value.element.remove();
                value.scope.$destroy();
              }
            }
          }

          lastOrder = nextOrder;
        });
      };
    }
  };
}];
