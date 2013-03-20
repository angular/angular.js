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
 *
 * @element ANY
 * @scope
 * @priority 1000
 * @param {repeat_expression} ngRepeat The expression indicating how to enumerate a collection. Two
 *   formats are currently supported:
 *
 *   * `variable in expression` – where variable is the user defined loop variable and `expression`
 *     is a scope expression giving the collection to enumerate.
 *
 *     For example: `track in cd.tracks`.
 *
 *   * `(key, value) in expression` – where `key` and `value` can be any user defined identifiers,
 *     and `expression` is the scope expression giving the collection to enumerate.
 *
 *     For example: `(name, age) in {'adam':10, 'amalie':12}`.
 *
 *   * `hash_expression from variable in expression` – You can also provide an optional hashing function
 *     which can be used to associate the objects in the collection with the DOM elements. If no hashing function
 *     is specified the ng-repeat associates elements by position in the collection. items. It is an error to have
 *     more then one item hash resolve to the same key. (This would mean that two distinct objects are mapped to
 *     the same DOM element, which is not possible.)
 *
 *     For example: `item in items` is equivalent to `$index from item in items'. This implies that the DOM elements
 *     will be associated by item position in array.
 *
 *     For example: `$hash(item) from item in items`. A built in `$hash()` function can be used to assign a unique
 *     `$$hashKey` property to each item in the array. This property is then used as a key to associated DOM elements
 *     with the corresponding item in the array by identity. Moving the same object in array would move the DOM
 *     element in the same way in the DOM.
 *
 *     For example: `item.id from item it items` Is a typical pattern when the items come from the database. In this
 *     case the object identity does not matter. Two objects are considered the equivalent as long as their `id`
 *     is same.
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
        var match = expression.match(/^((.+)\s+from)?\s*(.+)\s+in\s+(.*)\s*$/),
          hashExp, hashExpFn, hashFn, lhs, rhs, valueIdent, keyIdent,
          hashFnLocals = {$hash: hashKey};

        if (! match) {
          throw Error("Expected ngRepeat in form of '(_hash_ from) _item_ in _collection_' but got '" +
            expression + "'.");
        }

        hashExp = match[2];
        lhs = match[3];
        rhs = match[4];

        if (hashExp) {
          hashExpFn = $parse(hashExp);
          hashFn = function(key, value) {
            if (keyIdent) hashFnLocals[keyIdent] = key;
            hashFnLocals[valueIdent] = value;
            return hashExpFn(scope, hashFnLocals);
          };
        } else {
          hashFn = function(key, value) {
            return key;
          }
        }
        
        match = lhs.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/);
        if (!match) {
          throw Error("'item' in 'item in collection' should be identifier or (key, value) but got '" +
              lhs + "'.");
        }
        valueIdent = match[3] || match[1];
        keyIdent = match[2];

        // Store a list of elements from previous run. This is a hash where key is the item from the
        // iterator, and the value is objects with following properties.
        //   - scope: bound scope
        //   - element: previous element.
        //   - index: position
        var lastOrder = new HashMap();

        // Store the list of item orders. Need so that we can compute moves. When an item at position
        // #2 gets removed then item ot old position #3 becomes #2, but that is not considered a move
        var blockHead = {
              element: iterStartElement,
              next: null
            },
            blockRemove = function(block) {
              var right = block.next;
              var left = block.prev;

              if (right) right.prev = left;
              left.next = right;
            },
            blockInsertAfter = function(afterBlock, newBlock) {
              var right = afterBlock.next;

              newBlock.next = right;
              newBlock.prev = afterBlock;

              afterBlock.next = newBlock;
              if (right) right.prev = newBlock;
            },
            iterStartBlock = {element: iterStartElement, next: null, prev: null};

        //watch props
        scope.$watchProps(rhs, function ngRepeatWatch(collection){
          var index, length,
              cursor = iterStartElement,     // current position of the node
              // Same as lastOrder but it has the current state. It will become the
              // lastOrder on the next iteration.
              nextOrder = new HashMap(), //use HashMap
              arrayLength,
              childScope,
              key, value, // key/value of iteration
              hashCode,
              collectionKeys,
              block,       // last object information {scope, element, index}
              blocks = [],
              lastBlock = iterStartBlock;


          if (isArray(collection)) {
            collectionKeys = collection || [];
          } else {
            // if object, extract keys, sort them and use to determine order of iteration over obj props
            collectionKeys = [];
            for (key in collection) {
              if (collection.hasOwnProperty(key) && key.charAt(0) != '$') {
                collectionKeys.push(key);
              }
            }
            collectionKeys.sort();
          }

          arrayLength = collectionKeys.length;

          // locate existing items
          length = blocks.length = collectionKeys.length;
          for(index = 0; index < length; index++) {
           key = (collection === collectionKeys) ? index : collectionKeys[index];
           value = collection[key];
           hashCode = hashFn(key, value);
           if((block = lastOrder.remove(hashCode))) {
             nextOrder.put(hashCode, block);
             blocks[index] = block;
           } else if (nextOrder.get(hashCode)) {
             // restore lastOrder
             forEach(blocks, function(block) {
               if (block && block.element) lastOrder.put(block.hash, block);
             });
             // This is a duplicate and we need to throw an error
             throw new Error('Duplicate hashes in the repeater are not allowed.');
           } else {
             // new never before seen block
             blocks[index] = { hash: hashCode };
           }
         }

          // remove existing items
          for (key in lastOrder) {
            if (lastOrder.hasOwnProperty(key)) {
              block = lastOrder[key];
              block.element.remove();
              block.scope.$destroy();
              blockRemove(block);
            }
          }

          // we are not using forEach for perf reasons (trying to avoid #call)
          for (index = 0, length = collectionKeys.length; index < length; index++) {
            key = (collection === collectionKeys) ? index : collectionKeys[index];
            value = collection[key];
            block = blocks[index];

            if (block.element) {
              // if we have already seen this object, then we need to reuse the
              // associated scope/element
              childScope = block.scope;

              if (block.element == cursor) {
                // do nothing
                cursor = block.element;
              } else {
                // existing item which got moved
                blockRemove(block);
                blockInsertAfter(lastBlock, block);
                cursor.after(block.element);
                cursor = block.element;
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

            if (!block.element) {
              linker(childScope, function(clone){
                cursor.after(clone);
                cursor = clone;
                block.scope = childScope;
                block.element = clone;
                blockInsertAfter(lastBlock, block);
                nextOrder.put(block.hash, block);
              });
            }
          }
          if (block) {
            block.next = null;
          } else {
            iterStartBlock.next = null;
          }
          lastOrder = nextOrder;
        });
      };
    }
  };
}];
