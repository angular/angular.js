'use strict';

/**
 * @ngdoc function
 * @name ng.filter:bind
 * @function
 *
 * @description
 * Binds a function to the specified object.
 * It is sometimes needed to send a function as a parameter to another
 * function or filter, and be sure that the function is bound to the
 * right object. This filter makes it possible to bind this function
 * within a template without the need to bind the function elsewhere.
 *
 * @param {function(*)} fn The function to bind.
 * @param {Object} obj The object to bind the function to.
 * @returns {function(*)} A function bound to the specified object.
 *
 * @example
   <doc:example>
     <doc:source>
       <script>
         function List(items) {
           this.items = items;
           this.orderby = 'value';
           this.order = function(item) {
             return item.value;
         });

         function Ctrl($scope) {
           $scope.list = new List([
             {'key': 'three', 'value': 3},
             {'key': 'two', 'value': 2},
             {'key': 'one', 'value': 1}
           ]);
         }
       </script>
       <div ng-controller="Ctrl">
         <pre>Ordered list using the ordered function within the list</pre>
         <hr/>
         <table class="friend">
           <tr>
             <th>Key</th>
             <th>Value</th>
           </tr>
           <tr ng-repeat="item in list.items | orderBy:(list.order | bind:list)">
             <td>{{item.key}}</td>
             <td>{{item.value}}</td>
           </tr>
         </table>
       </div>
     </doc:source>
   </doc:example>
 */
function bindFilter() {
  return function(fn, obj) {
    return bind(obj, fn);
  }
}
