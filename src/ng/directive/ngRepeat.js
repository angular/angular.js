'use strict';

/* exported ngRepeatDirective */

/**
 * @ngdoc directive
 * @name ngRepeat
 * @multiElement
 * @restrict A
 *
 * @description
 * The `ngRepeat` directive instantiates a template once per item from a collection. Each template
 * instance gets its own scope, where the given loop variable is set to the current collection item,
 * and `$index` is set to the item index or key.
 *
 * Special properties are exposed on the local scope of each template instance, including:
 *
 * | Variable  | Type            | Details                                                                     |
 * |-----------|-----------------|-----------------------------------------------------------------------------|
 * | `$index`  | {@type number}  | iterator offset of the repeated element (0..length-1)                       |
 * | `$first`  | {@type boolean} | true if the repeated element is first in the iterator.                      |
 * | `$middle` | {@type boolean} | true if the repeated element is between the first and last in the iterator. |
 * | `$last`   | {@type boolean} | true if the repeated element is last in the iterator.                       |
 * | `$even`   | {@type boolean} | true if the iterator position `$index` is even (otherwise false).           |
 * | `$odd`    | {@type boolean} | true if the iterator position `$index` is odd (otherwise false).            |
 *
 * <div class="alert alert-info">
 *   Creating aliases for these properties is possible with {@link ng.directive:ngInit `ngInit`}.
 *   This may be useful when, for instance, nesting ngRepeats.
 * </div>
 *
 *
 * ## Iterating over object properties
 *
 * It is possible to get `ngRepeat` to iterate over the properties of an object using the following
 * syntax:
 *
 * ```js
 * <div ng-repeat="(key, value) in myObj"> ... </div>
 * ```
 *
 * However, there are a few limitations compared to array iteration:
 *
 * - The JavaScript specification does not define the order of keys
 *   returned for an object, so AngularJS relies on the order returned by the browser
 *   when running `for key in myObj`. Browsers generally follow the strategy of providing
 *   keys in the order in which they were defined, although there are exceptions when keys are deleted
 *   and reinstated. See the
 *   [MDN page on `delete` for more info](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete#Cross-browser_notes).
 *
 * - `ngRepeat` will silently *ignore* object keys starting with `$`, because
 *   it's a prefix used by AngularJS for public (`$`) and private (`$$`) properties.
 *
 * - The built-in filters {@link ng.orderBy orderBy} and {@link ng.filter filter} do not work with
 *   objects, and will throw an error if used with one.
 *
 * If you are hitting any of these limitations, the recommended workaround is to convert your object into an array
 * that is sorted into the order that you prefer before providing it to `ngRepeat`. You could
 * do this with a filter such as [toArrayFilter](http://ngmodules.org/modules/angular-toArrayFilter)
 * or implement a `$watch` on the object yourself.
 *
 *
 * ## Tracking and Duplicates
 *
 * `ngRepeat` uses {@link $rootScope.Scope#$watchCollection $watchCollection} to detect changes in
 * the collection. When a change happens, `ngRepeat` then makes the corresponding changes to the DOM:
 *
 * * When an item is added, a new instance of the template is added to the DOM.
 * * When an item is removed, its template instance is removed from the DOM.
 * * When items are reordered, their respective templates are reordered in the DOM.
 *
 * To minimize creation of DOM elements, `ngRepeat` uses a function
 * to "keep track" of all items in the collection and their corresponding DOM elements.
 * For example, if an item is added to the collection, `ngRepeat` will know that all other items
 * already have DOM elements, and will not re-render them.
 *
 * All different types of tracking functions, their syntax, and their support for duplicate
 * items in collections can be found in the
 * {@link ngRepeat#ngRepeat-arguments ngRepeat expression description}.
 *
 * <div class="alert alert-success">
 * **Best Practice:** If you are working with objects that have a unique identifier property, you
 * should track by this identifier instead of the object instance,
 * e.g. `item in items track by item.id`.
 * Should you reload your data later, `ngRepeat` will not have to rebuild the DOM elements for items
 * it has already rendered, even if the JavaScript objects in the collection have been substituted
 * for new ones. For large collections, this significantly improves rendering performance.
 * </div>
 *
 * ### Effects of DOM Element re-use
 *
 * When DOM elements are re-used, ngRepeat updates the scope for the element, which will
 * automatically update any active bindings on the template. However, other
 * functionality will not be updated, because the element is not re-created:
 *
 * - Directives are not re-compiled
 * - {@link guide/expression#one-time-binding one-time expressions} on the repeated template are not
 * updated if they have stabilized.
 *
 * The above affects all kinds of element re-use due to tracking, but may be especially visible
 * when tracking by `$index` due to the way ngRepeat re-uses elements.
 *
 * The following example shows the effects of different actions with tracking:

  <example module="ngRepeat" name="ngRepeat-tracking" deps="angular-animate.js" animations="true">
    <file name="script.js">
      angular.module('ngRepeat', ['ngAnimate']).controller('repeatController', function($scope) {
        var friends = [
          {name:'John', age:25},
          {name:'Mary', age:40},
          {name:'Peter', age:85}
        ];

        $scope.removeFirst = function() {
          $scope.friends.shift();
        };

        $scope.updateAge = function() {
          $scope.friends.forEach(function(el) {
            el.age = el.age + 5;
          });
        };

        $scope.copy = function() {
          $scope.friends = angular.copy($scope.friends);
        };

        $scope.reset = function() {
          $scope.friends = angular.copy(friends);
        };

        $scope.reset();
      });
    </file>
    <file name="index.html">
      <div ng-controller="repeatController">
        <ol>
          <li>When you click "Update Age", only the first list updates the age, because all others have
          a one-time binding on the age property. If you then click "Copy", the current friend list
          is copied, and now the second list updates the age, because the identity of the collection items
          has changed and the list must be re-rendered. The 3rd and 4th list stay the same, because all the
          items are already known according to their tracking functions.
          </li>
          <li>When you click "Remove First", the 4th list has the wrong age on both remaining items. This is
          due to tracking by $index: when the first collection item is removed, ngRepeat reuses the first
          DOM element for the new first collection item, and so on. Since the age property is one-time
          bound, the value remains from the collection item which was previously at this index.
          </li>
        </ol>

        <button ng-click="removeFirst()">Remove First</button>
        <button ng-click="updateAge()">Update Age</button>
        <button ng-click="copy()">Copy</button>
        <br><button ng-click="reset()">Reset List</button>
        <br>
        <code>track by $id(friend)</code> (default):
        <ul class="example-animate-container">
          <li class="animate-repeat" ng-repeat="friend in friends">
            {{friend.name}} is {{friend.age}} years old.
          </li>
        </ul>
        <code>track by $id(friend)</code> (default), with age one-time binding:
        <ul class="example-animate-container">
          <li class="animate-repeat" ng-repeat="friend in friends">
            {{friend.name}} is {{::friend.age}} years old.
          </li>
        </ul>
        <code>track by friend.name</code>, with age one-time binding:
        <ul class="example-animate-container">
          <li class="animate-repeat" ng-repeat="friend in friends track by friend.name">
            {{friend.name}}  is {{::friend.age}} years old.
          </li>
        </ul>
        <code>track by $index</code>, with age one-time binding:
        <ul class="example-animate-container">
          <li class="animate-repeat" ng-repeat="friend in friends track by $index">
            {{friend.name}} is {{::friend.age}} years old.
          </li>
        </ul>
      </div>
    </file>
    <file name="animations.css">
      .example-animate-container {
        background:white;
        border:1px solid black;
        list-style:none;
        margin:0;
        padding:0 10px;
      }

      .animate-repeat {
        line-height:30px;
        list-style:none;
        box-sizing:border-box;
      }

      .animate-repeat.ng-move,
      .animate-repeat.ng-enter,
      .animate-repeat.ng-leave {
        transition:all linear 0.5s;
      }

      .animate-repeat.ng-leave.ng-leave-active,
      .animate-repeat.ng-move,
      .animate-repeat.ng-enter {
        opacity:0;
        max-height:0;
      }

      .animate-repeat.ng-leave,
      .animate-repeat.ng-move.ng-move-active,
      .animate-repeat.ng-enter.ng-enter-active {
        opacity:1;
        max-height:30px;
      }
    </file>
  </example>

 *
 * ## Special repeat start and end points
 * To repeat a series of elements instead of just one parent element, ngRepeat (as well as other ng directives) supports extending
 * the range of the repeater by defining explicit start and end points by using **ng-repeat-start** and **ng-repeat-end** respectively.
 * The **ng-repeat-start** directive works the same as **ng-repeat**, but will repeat all the HTML code (including the tag it's defined on)
 * up to and including the ending HTML tag where **ng-repeat-end** is placed.
 *
 * The example below makes use of this feature:
 * ```html
 *   <header ng-repeat-start="item in items">
 *     Header {{ item }}
 *   </header>
 *   <div class="body">
 *     Body {{ item }}
 *   </div>
 *   <footer ng-repeat-end>
 *     Footer {{ item }}
 *   </footer>
 * ```
 *
 * And with an input of {@type ['A','B']} for the items variable in the example above, the output will evaluate to:
 * ```html
 *   <header>
 *     Header A
 *   </header>
 *   <div class="body">
 *     Body A
 *   </div>
 *   <footer>
 *     Footer A
 *   </footer>
 *   <header>
 *     Header B
 *   </header>
 *   <div class="body">
 *     Body B
 *   </div>
 *   <footer>
 *     Footer B
 *   </footer>
 * ```
 *
 * The custom start and end points for ngRepeat also support all other HTML directive syntax flavors provided in AngularJS (such
 * as **data-ng-repeat-start**, **x-ng-repeat-start** and **ng:repeat-start**).
 *
 * @animations
 * | Animation                        | Occurs                              |
 * |----------------------------------|-------------------------------------|
 * | {@link ng.$animate#enter enter} | when a new item is added to the list or when an item is revealed after a filter |
 * | {@link ng.$animate#leave leave} | when an item is removed from the list or when an item is filtered out |
 * | {@link ng.$animate#move move } | when an adjacent item is filtered out causing a reorder or when the item contents are reordered |
 *
 * See the example below for defining CSS animations with ngRepeat.
 *
 * @element ANY
 * @scope
 * @priority 1000
 * @param {repeat_expression} ngRepeat The expression indicating how to enumerate a collection. These
 *   formats are currently supported:
 *
 *   * `variable in expression` – where variable is the user defined loop variable and `expression`
 *     is a scope expression giving the collection to enumerate.
 *
 *     For example: `album in artist.albums`.
 *
 *   * `(key, value) in expression` – where `key` and `value` can be any user defined identifiers,
 *     and `expression` is the scope expression giving the collection to enumerate.
 *
 *     For example: `(name, age) in {'adam':10, 'amalie':12}`.
 *
 *   * `variable in expression track by tracking_expression` – You can also provide an optional tracking expression
 *     which can be used to associate the objects in the collection with the DOM elements. If no tracking expression
 *     is specified, ng-repeat associates elements by identity. It is an error to have
 *     more than one tracking expression value resolve to the same key. (This would mean that two distinct objects are
 *     mapped to the same DOM element, which is not possible.)
 *
 *     *Default tracking: $id()*: `item in items` is equivalent to `item in items track by $id(item)`.
 *     This implies that the DOM elements will be associated by item identity in the collection.
 *
 *     The built-in `$id()` function can be used to assign a unique
 *     `$$hashKey` property to each item in the collection. This property is then used as a key to associated DOM elements
 *     with the corresponding item in the collection by identity. Moving the same object would move
 *     the DOM element in the same way in the DOM.
 *     Note that the default id function does not support duplicate primitive values (`number`, `string`),
 *     but supports duplictae non-primitive values (`object`) that are *equal* in shape.
 *
 *     *Custom Expression*: It is possible to use any AngularJS expression to compute the tracking
 *     id, for example with a function, or using a property on the collection items.
 *     `item in items track by item.id` is a typical pattern when the items have a unique identifier,
 *     e.g. database id. In this case the object identity does not matter. Two objects are considered
 *     equivalent as long as their `id` property is same.
 *     Tracking by unique identifier is the most performant way and should be used whenever possible.
 *
 *     *$index*: This special property tracks the collection items by their index, and
 *     re-uses the DOM elements that match that index, e.g. `item in items track by $index`. This can
 *     be used for a performance improvement if no unique identfier is available and the identity of
 *     the collection items cannot be easily computed. It also allows duplicates.
 *
 *     <div class="alert alert-warning">
 *       <strong>Note:</strong> Re-using DOM elements can have unforeseen effects. Read the
 *       {@link ngRepeat#tracking-and-duplicates section on tracking and duplicates} for
 *       more info.
 *     </div>
 *
 *     <div class="alert alert-warning">
 *       <strong>Note:</strong> the `track by` expression must come last - after any filters, and the alias expression:
 *       `item in items | filter:searchText as results  track by item.id`
 *     </div>
 *
 *   * `variable in expression as alias_expression` – You can also provide an optional alias expression which will then store the
 *     intermediate results of the repeater after the filters have been applied. Typically this is used to render a special message
 *     when a filter is active on the repeater, but the filtered result set is empty.
 *
 *     For example: `item in items | filter:x as results` will store the fragment of the repeated items as `results`, but only after
 *     the items have been processed through the filter.
 *
 *     Please note that `as [variable name] is not an operator but rather a part of ngRepeat
 *     micro-syntax so it can be used only after all filters (and not as operator, inside an expression).
 *
 *     For example: `item in items | filter : x | orderBy : order | limitTo : limit as results track by item.id` .
 *
 * @example
 * This example uses `ngRepeat` to display a list of people. A filter is used to restrict the displayed
 * results by name or by age. New (entering) and removed (leaving) items are animated.
  <example module="ngRepeat" name="ngRepeat" deps="angular-animate.js" animations="true">
    <file name="index.html">
      <div ng-controller="repeatController">
        I have {{friends.length}} friends. They are:
        <input type="search" ng-model="q" placeholder="filter friends..." aria-label="filter friends" />
        <ul class="example-animate-container">
          <li class="animate-repeat" ng-repeat="friend in friends | filter:q as results track by friend.name">
            [{{$index + 1}}] {{friend.name}} who is {{friend.age}} years old.
          </li>
          <li class="animate-repeat" ng-if="results.length === 0">
            <strong>No results found...</strong>
          </li>
        </ul>
      </div>
    </file>
    <file name="script.js">
      angular.module('ngRepeat', ['ngAnimate']).controller('repeatController', function($scope) {
        $scope.friends = [
          {name:'John', age:25, gender:'boy'},
          {name:'Jessie', age:30, gender:'girl'},
          {name:'Johanna', age:28, gender:'girl'},
          {name:'Joy', age:15, gender:'girl'},
          {name:'Mary', age:28, gender:'girl'},
          {name:'Peter', age:95, gender:'boy'},
          {name:'Sebastian', age:50, gender:'boy'},
          {name:'Erika', age:27, gender:'girl'},
          {name:'Patrick', age:40, gender:'boy'},
          {name:'Samantha', age:60, gender:'girl'}
        ];
      });
    </file>
    <file name="animations.css">
      .example-animate-container {
        background:white;
        border:1px solid black;
        list-style:none;
        margin:0;
        padding:0 10px;
      }

      .animate-repeat {
        line-height:30px;
        list-style:none;
        box-sizing:border-box;
      }

      .animate-repeat.ng-move,
      .animate-repeat.ng-enter,
      .animate-repeat.ng-leave {
        transition:all linear 0.5s;
      }

      .animate-repeat.ng-leave.ng-leave-active,
      .animate-repeat.ng-move,
      .animate-repeat.ng-enter {
        opacity:0;
        max-height:0;
      }

      .animate-repeat.ng-leave,
      .animate-repeat.ng-move.ng-move-active,
      .animate-repeat.ng-enter.ng-enter-active {
        opacity:1;
        max-height:30px;
      }
    </file>
    <file name="protractor.js" type="protractor">
      var friends = element.all(by.repeater('friend in friends'));

      it('should render initial data set', function() {
        expect(friends.count()).toBe(10);
        expect(friends.get(0).getText()).toEqual('[1] John who is 25 years old.');
        expect(friends.get(1).getText()).toEqual('[2] Jessie who is 30 years old.');
        expect(friends.last().getText()).toEqual('[10] Samantha who is 60 years old.');
        expect(element(by.binding('friends.length')).getText())
            .toMatch("I have 10 friends. They are:");
      });

       it('should update repeater when filter predicate changes', function() {
         expect(friends.count()).toBe(10);

         element(by.model('q')).sendKeys('ma');

         expect(friends.count()).toBe(2);
         expect(friends.get(0).getText()).toEqual('[1] Mary who is 28 years old.');
         expect(friends.last().getText()).toEqual('[2] Samantha who is 60 years old.');
       });
      </file>
    </example>
 */
var ngRepeatDirective = ['$parse', '$animate', '$compile', function($parse, $animate, $compile) {
  var NG_REMOVED = '$$NG_REMOVED';
  var ngRepeatMinErr = minErr('ngRepeat');

  var updateScope = function(scope, index, valueIdentifier, value, keyIdentifier, key, arrayLength) {
    // TODO(perf): generate setters to shave off ~40ms or 1-1.5%
    scope[valueIdentifier] = value;
    if (keyIdentifier) scope[keyIdentifier] = key;
    scope.$index = index;
    scope.$first = (index === 0);
    scope.$last = (index === (arrayLength - 1));
    scope.$middle = !(scope.$first || scope.$last);
    // eslint-disable-next-line no-bitwise
    scope.$odd = !(scope.$even = (index & 1) === 0);
  };

  var getBlockStart = function(block) {
    return block.clone[0];
  };

  var getBlockEnd = function(block) {
    return block.clone[block.clone.length - 1];
  };


  return {
    restrict: 'A',
    multiElement: true,
    transclude: 'element',
    priority: 1000,
    terminal: true,
    $$tlb: true,
    compile: function ngRepeatCompile($element, $attr) {
      var expression = $attr.ngRepeat;
      var ngRepeatEndComment = $compile.$$createComment('end ngRepeat', expression);

      var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);

      if (!match) {
        throw ngRepeatMinErr('iexp', 'Expected expression in form of \'_item_ in _collection_[ track by _id_]\' but got \'{0}\'.',
            expression);
      }

      var lhs = match[1];
      var rhs = match[2];
      var aliasAs = match[3];
      var trackByExp = match[4];

      match = lhs.match(/^(?:(\s*[$\w]+)|\(\s*([$\w]+)\s*,\s*([$\w]+)\s*\))$/);

      if (!match) {
        throw ngRepeatMinErr('iidexp', '\'_item_\' in \'_item_ in _collection_\' should be an identifier or \'(_key_, _value_)\' expression, but got \'{0}\'.',
            lhs);
      }
      var valueIdentifier = match[3] || match[1];
      var keyIdentifier = match[2];

      if (aliasAs && (!/^[$a-zA-Z_][$a-zA-Z0-9_]*$/.test(aliasAs) ||
          /^(null|undefined|this|\$index|\$first|\$middle|\$last|\$even|\$odd|\$parent|\$root|\$id)$/.test(aliasAs))) {
        throw ngRepeatMinErr('badident', 'alias \'{0}\' is invalid --- must be a valid JS identifier which is not a reserved name.',
          aliasAs);
      }

      var trackByExpGetter, trackByIdExpFn, trackByIdArrayFn, trackByIdObjFn;
      var hashFnLocals = {$id: hashKey};

      if (trackByExp) {
        trackByExpGetter = $parse(trackByExp);
      } else {
        trackByIdArrayFn = function(key, value) {
          return hashKey(value);
        };
        trackByIdObjFn = function(key) {
          return key;
        };
      }

      return function ngRepeatLink($scope, $element, $attr, ctrl, $transclude) {

        if (trackByExpGetter) {
          trackByIdExpFn = function(key, value, index) {
            // assign key, value, and $index to the locals so that they can be used in hash functions
            if (keyIdentifier) hashFnLocals[keyIdentifier] = key;
            hashFnLocals[valueIdentifier] = value;
            hashFnLocals.$index = index;
            return trackByExpGetter($scope, hashFnLocals);
          };
        }

        // Store a list of elements from previous run. This is a hash where key is the item from the
        // iterator, and the value is objects with following properties.
        //   - scope: bound scope
        //   - clone: previous element.
        //   - index: position
        //
        // We are using no-proto object so that we don't need to guard against inherited props via
        // hasOwnProperty.
        var lastBlockMap = createMap();

        //watch props
        $scope.$watchCollection(rhs, function ngRepeatAction(collection) {
          var index, length,
              previousNode = $element[0],     // node that cloned nodes should be inserted after
                                              // initialized to the comment node anchor
              nextNode,
              // Same as lastBlockMap but it has the current state. It will become the
              // lastBlockMap on the next iteration.
              nextBlockMap = createMap(),
              collectionLength,
              key, value, // key/value of iteration
              trackById,
              trackByIdFn,
              collectionKeys,
              block,       // last object information {scope, element, id}
              nextBlockOrder,
              elementsToRemove;

          if (aliasAs) {
            $scope[aliasAs] = collection;
          }

          if (isArrayLike(collection)) {
            collectionKeys = collection;
            trackByIdFn = trackByIdExpFn || trackByIdArrayFn;
          } else {
            trackByIdFn = trackByIdExpFn || trackByIdObjFn;
            // if object, extract keys, in enumeration order, unsorted
            collectionKeys = [];
            for (var itemKey in collection) {
              if (hasOwnProperty.call(collection, itemKey) && itemKey.charAt(0) !== '$') {
                collectionKeys.push(itemKey);
              }
            }
          }

          collectionLength = collectionKeys.length;
          nextBlockOrder = new Array(collectionLength);

          // locate existing items
          for (index = 0; index < collectionLength; index++) {
            key = (collection === collectionKeys) ? index : collectionKeys[index];
            value = collection[key];
            trackById = trackByIdFn(key, value, index);
            if (lastBlockMap[trackById]) {
              // found previously seen block
              block = lastBlockMap[trackById];
              delete lastBlockMap[trackById];
              nextBlockMap[trackById] = block;
              nextBlockOrder[index] = block;
            } else if (nextBlockMap[trackById]) {
              // if collision detected. restore lastBlockMap and throw an error
              forEach(nextBlockOrder, function(block) {
                if (block && block.scope) lastBlockMap[block.id] = block;
              });
              throw ngRepeatMinErr('dupes',
                  'Duplicates in a repeater are not allowed. Use \'track by\' expression to specify unique keys. Repeater: {0}, Duplicate key: {1}, Duplicate value: {2}',
                  expression, trackById, value);
            } else {
              // new never before seen block
              nextBlockOrder[index] = {id: trackById, scope: undefined, clone: undefined};
              nextBlockMap[trackById] = true;
            }
          }

          // remove leftover items
          for (var blockKey in lastBlockMap) {
            block = lastBlockMap[blockKey];
            elementsToRemove = getBlockNodes(block.clone);
            $animate.leave(elementsToRemove);
            if (elementsToRemove[0].parentNode) {
              // if the element was not removed yet because of pending animation, mark it as deleted
              // so that we can ignore it later
              for (index = 0, length = elementsToRemove.length; index < length; index++) {
                elementsToRemove[index][NG_REMOVED] = true;
              }
            }
            block.scope.$destroy();
          }

          // we are not using forEach for perf reasons (trying to avoid #call)
          for (index = 0; index < collectionLength; index++) {
            key = (collection === collectionKeys) ? index : collectionKeys[index];
            value = collection[key];
            block = nextBlockOrder[index];

            if (block.scope) {
              // if we have already seen this object, then we need to reuse the
              // associated scope/element

              nextNode = previousNode;

              // skip nodes that are already pending removal via leave animation
              do {
                nextNode = nextNode.nextSibling;
              } while (nextNode && nextNode[NG_REMOVED]);

              if (getBlockStart(block) !== nextNode) {
                // existing item which got moved
                $animate.move(getBlockNodes(block.clone), null, previousNode);
              }
              previousNode = getBlockEnd(block);
              updateScope(block.scope, index, valueIdentifier, value, keyIdentifier, key, collectionLength);
            } else {
              // new item which we don't know about
              $transclude(function ngRepeatTransclude(clone, scope) {
                block.scope = scope;
                // http://jsperf.com/clone-vs-createcomment
                var endNode = ngRepeatEndComment.cloneNode(false);
                clone[clone.length++] = endNode;

                $animate.enter(clone, null, previousNode);
                previousNode = endNode;
                // Note: We only need the first/last node of the cloned nodes.
                // However, we need to keep the reference to the jqlite wrapper as it might be changed later
                // by a directive with templateUrl when its template arrives.
                block.clone = clone;
                nextBlockMap[block.id] = block;
                updateScope(block.scope, index, valueIdentifier, value, keyIdentifier, key, collectionLength);
              });
            }
          }
          lastBlockMap = nextBlockMap;
        });
      };
    }
  };
}];
