'use strict';

/*global angular, ngDirective, WrappedArray, WrappedObject, isArray, whatChanged, FlattenedChanges */

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
var ngRepeatDirective = ngDirective({
  transclude: 'element',
  priority: 1000,
  terminal: true,
  compile: function(element, attr, clone) {
    var expression = attr.ngRepeat;
    var match = expression.match(/^\s*(.+)\s+in\s+(.*)\s*$/);
    if (!match) {
      throw new Error("Expected ngRepeat in form of '_item_ in _collection_' but got '" + expression + "'.");
    }
    var identifiers = match[1];
    var sourceExpression = match[2];

    match = identifiers.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/);
    if (!match) {
      throw new Error("'item' in 'item in collection' should be identifier or (key, value) but got '" +
          identifiers + "'.");
    }
    var valueIdentifier = match[3] || match[1];
    var keyIdentifier = match[2];

    var updateScope = function(scope, value, key) {
      scope[valueIdentifier] = value;
      if (keyIdentifier) {
        scope[keyIdentifier] = key;
      }
    };

    // Return the linking function for this directive
    return function(scope, startElement, attr){
      var originalCollection = new WrappedArray([]);
      var originalChildItems = [];
      var containerElement = startElement.parent();

      scope.$watch(function ngRepeatWatch(scope){
        var item, key;
        var source = scope.$eval(sourceExpression);
        var newCollection = isArray(source) ? new WrappedArray(source) : new WrappedObject(source);
        var newChildItems = [];
        var temp = whatChanged(originalCollection, newCollection);
        var changes = new FlattenedChanges(temp).changes;

        // Iterate over the flattened changes array - updating the childscopes and elements accordingly
        var lastChildScope, newChildScope, newChildItem;
        var currentElement = startElement;
        var itemIndex = 0, changeIndex = 0;
        while(changeIndex < changes.length) {
          item = changes[changeIndex];
          if ( !angular.isDefined(item) ) {
            // No change for this item just copy it over
            newChildItem = originalChildItems[itemIndex];
            newChildItems.push(newChildItem);
            currentElement = newChildItem.element;
            itemIndex++;
            changeIndex++;
            continue;
          }
          if ( item.deleted ) {
            // An item has been deleted here - destroy the old scope and remove the old element
            var originalChildItem = originalChildItems[itemIndex];
            originalChildItem.scope.$destroy();
            originalChildItem.element.remove();
            // If an item is added or moved here as well then the index will incremented in the added or moved if statement below
            if ( !item.added && !item.moved ) {
              itemIndex++;
            }
          }
          if ( item.added ) {
            // An item has been added here - create a new scope and clone a new element
            newChildItem = { scope: scope.$new() };
            updateScope(newChildItem.scope, item.value, newCollection.key(item.index));
            clone(newChildItem.scope, function(newChildElement){
              currentElement.after(newChildElement);
              currentElement = newChildItem.element = newChildElement;
            });
            newChildItems.push(newChildItem);
            itemIndex++;
          }
          if ( item.modified ) {
            // This item is a primitive that has been modified - update the scope
            newChildItem = originalChildItems[itemIndex];
            updateScope(newChildItem.scope, item.newValue, newCollection.key(item.index));
            newChildItems.push(newChildItem);
            currentElement = newChildItem.element;
            itemIndex++;
          }
          if ( item.moved ) {
            // An object has moved here from somewhere else - move the element accordingly
            newChildItem = originalChildItems[item.oldIndex];
            if (keyIdentifier && isArray(source)) {
              // We are iterating keys, but over an array rather than an object so we need to fix up the scope
              updateScope(newChildItem.scope, item.value, newCollection.key(item.index));
            }
            newChildItems.push(newChildItem);
            currentElement.after(newChildItem.element);
            currentElement = newChildItem.element;
            itemIndex++;
          }
          changeIndex++;
        }
        while( itemIndex < newCollection.length() ) {
          // No change for this item just copy it over
          newChildItem = originalChildItems[itemIndex];
          newChildItems.push(newChildItem);
          currentElement = newChildItem.element;
          itemIndex++;
        }

        // Update $index, $first, $middle & $last
        for(var index=0; index<newChildItems.length; index++) {
          if (angular.isDefined(newChildItems[index]) ) {
            newChildScope = newChildItems[index].scope;
            newChildScope.$index = index;
            newChildScope.$first = (index === 0);
            newChildScope.$middle = (index !== 0);
            newChildScope.$last = false;
            lastChildScope = newChildScope;
          }
        }
        // Fix up last item
        if ( angular.isDefined(lastChildScope) ) {
          lastChildScope.$last = true;
          lastChildScope.$middle = false;
        }

        // Store originals for next time
        originalCollection = newCollection.copy();
        originalChildItems = newChildItems.slice(0);
      });

    };
  }
});