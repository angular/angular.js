'use strict';

/**
 * @ngdoc directive
 * @name ng.directive:ngRepeat
 *
 * @description
 * The `ngRepeat` directive instantiates a template once per item from a collection. Each template
 * instance gets its own Scope, where the given loop variable is set to the current collection item,
 * and `$index` is set to the item index or key.
 *
 * Special properties are exposed on the local scope of each template instance, including:
 *
 *   * `$index` – `{number}` – iterator offset of the repeated element (0..length-1)
 *   * `$first` – `{boolean}` – true if the repeated element is first in the iterator.
 *   * `$middle` – `{boolean}` – true if the repeated element is between the first and last in the
 *      iterator.
 *   * `$last` – `{boolean}` – true if the repeated element is last in the iterator.
 *
 *
 * # Comment-based repeater #
 *
 * When used as an attribute, the `ngRepeat` directive can only clone a single element - the element
 * on which it is placed. If you need to clone a set of elements or nodes, an artificial parent
 * element must be created (e.g. `div` or `span`) and the `ngRepeat` directive is placed on this
 * element.
 *
 *     <div ng-repeat="item in items">
 *       <div>{{item.name}}</div>
 *       <div>{{item.description}}</div>
 *     </div>
 *
 * Creating this parent element is however impossible in situations, where the HTML specification
 * only permits certain child elements to be present. In practice, this mainly affects `table` and
 * `select` elements, which may only contain a subset of specified child elements like `tr` or
 * `option`.
 *
 * Because comment nodes are excluded from this limitation, the comment-based repeater is useful
 * in these situations. The syntax for a comment-based repeater is as follows:
 *
 *     ...
 *     <table>
 *       <tr>
 *         <!-- directive: ng-repeat item in items -->
 *           <td>{{item.name}}</td>
 *           <td>{{item.description}}</td>
 *         <!-- /ng-repeat -->
 *       </tr>
 *     </table>
 *     ...
 *
 * The comment-based repeater expects the starting and ending comment to be on the same level in the
 * DOM hierarchy. If this condition is not met, the end comment won't be found and the
 * "Can't find closing tag for ngRepeat" error will be thrown.
 *
 * There are two gotchas to be aware of when using comment-based repeaters:
 *
 * 1. In a handful of situations, browsers auto-correct the DOM by inserting extra elements that the
 *    specification requires at runtime. This is to account for occasions where developers omit
 *    these elements in the HTML source. Unfortunately, this DOM auto-correction can then cause
 *    misalignment between start and end comments within the DOM tree hierarchy. In this case,
 *    again, the end comment won't be found and the "Can't find closing tag for ngRepeat" error will
 *    be thrown.
 *
 *    In practice, this is typically only seen with the `tbody` tag in HTML code, which all browsers
 *    insert between the `table` and `tr` elements if missing.
 *
 *    The following simple template:
 *
          <!-- broken template -->
          <table>
            <!-- directive: ng-repeat item in items -->
              <tr><td></td></tr>
              <tr><td></td></tr>
            <!-- /ng-repeat -->
          </table>
 *
 *    Gets converted into a DOM tree as:
 *
          <table>
            <!-- directive: ng-repeat item in items -->
              <tbody>
                <tr><td></td></tr>
                <tr><td></td></tr>
                <!-- /ng-repeat -->
              </tbody>
          </table>
 *
 *    Which then causes Angular not to find the ending comment tag. If Angular tried to account for
 *    this behavior, invalid templates could get processed with unexpected results.
 *
 *    The correct way to deal with this issue in Angular is to explicitly specify the elements that
 *    browsers add if missing. In the case of `table`, it's the `tbody` element:
 *
          <table>
            <tbody>
              <!-- directive: ng-repeat item in items -->
                <tr><td></td></tr>
                <tr><td></td></tr>
              <!-- /ng-repeat -->
            </tbody>
          </table>
 *
 * 2. Internet Explorer doesn't allow comments within the `select` element. So on IE, the
 *    comment-based repeater won't work within a 'select' element. In practice this typically is not
 *    an issue because repeating over more than one element within a `select` element doesn't make a
 *    whole lot of sense.
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
 *
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


 * @example
 * Examples of comment-based repeaters:
 *
    <doc:example>
     <doc:source>
       Repeating over multiple table cells:
       <table ng-init="friends = [{name:'John', age:25}, {name:'Mary', age:28}]">
         <tr>
          <!-- directive: ng-repeat friend in friends -->
            <td>{{friend.name}}</td>
            <td>{{friend.age}}</td>
          <!-- /ng-repeat -->
        </tr>
       </table>


       Repeating over multiple table rows:
       <table ng-init="friends = [{name:'John', age:25}, {name:'Mary', age:28}]">
         <tr>
           <!-- directive: ng-repeat friend in friends -->
             <td>{{friend.name}}</td>
             <td>{{friend.age}}</td>
           <!-- /ng-repeat -->
         </tr>
       </table>

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
var ngRepeatDirective = ['$compile', function($compile) {
  return {

  restrict: 'AM',
  transclude: 'element',
  priority: 1000,
  terminal: true,
  compile: function($element, attr, linker) {
    var NG_REPEAT_END_TAG_REGEXP = /^(?:<!--)?\s*\/(\S+)\s* (?:-->)?$/,
        element = $element[0],
        sibling = element.nextSibling,
        template, match;

    // comment-based repeater
    if (linker.$$originalNodeType === 8) {

      template = jqLite(document.createDocumentFragment());

      // search for closing comment tag and create the template
      while (sibling) {
        if (sibling.nodeType == 8 &&
            (match = (sibling.textContent || sibling.text).match(NG_REPEAT_END_TAG_REGEXP)) &&
            directiveNormalize(match[1]) === 'ngRepeat')  {

          jqLite(sibling).remove();
          break;
        }

        element = sibling;
        sibling = sibling.nextSibling;

        template.append(element);
      }

      if (!sibling) {
        throw new Error("Can't find closing tag for ngRepeat: " + attr.ngRepeat);
      }

      linker = $compile(template.contents());
    }


    return function(scope, iterStartElement, attr){
      var expression = attr.ngRepeat;
      var match = expression.match(/^\s*(.+)\s+in\s+(.*)\s*$/),
        lhs, rhs, valueIdent, keyIdent;
      if (! match) {
        throw Error("Expected ngRepeat in form of '_item_ in _collection_' but got '" +
          expression + "'.");
      }
      lhs = match[1];
      rhs = match[2];
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
            collectionLength = size(collection, true),
            childScope,
            // Same as lastOrder but it has the current state. It will become the
            // lastOrder on the next iteration.
            nextOrder = new HashQueueMap(),
            key, value, // key/value of iteration
            array, last,       // last object information {scope, element, index}
            cursor = iterStartElement;     // current position of the node

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
              // Also we can't use jQuery#after because it doesn't work well with collections, which
              // breaks comment-based repeater. This is likely a jQuery bug.
              JQLiteAfter(cursor[cursor.length - 1], last.element);
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
          childScope.$last = (index === (collectionLength - 1));
          childScope.$middle = !(childScope.$first || childScope.$last);

          if (!last) {
            linker(childScope, function(clone){
              // can't use jQuery#after because it doesn't work well with collections, which breaks
              // comment-based repeater. This is likely a jQuery bug.
              JQLiteAfter(cursor[cursor.length - 1], clone);

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
  }}];
