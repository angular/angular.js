'use strict';

/**
 * @ngdoc directive
 * @name ng.directive:ngShow
 *
 * @description
 * The `ngShow` and `ngHide` directives show or hide a portion of the DOM tree (HTML)
 * conditionally based on **"truthy"** values evaluated within an {expression}. In other
 * words, if the expression assigned to **ngShow evaluates to a true value** then **the element is set to visible**
 * (via `display:block` in css) and **if false** then **the element is set to hidden** (so display:none).
 * With ngHide this is the reverse whereas true values cause the element itself to become
 * hidden.
 *
 * Additionally, you can also provide animations via the ngAnimate attribute to animate the **show**
 * and **hide** effects.
 *
 * @animations
 * show - happens after the ngShow expression evaluates to a truthy value and the contents are set to visible
 * hide - happens before the ngShow expression evaluates to a non truthy value and just before the contents are set to hidden
 *
 * @element ANY
 * @param {expression} ngShow If the {@link guide/expression expression} is truthy
 *     then the element is shown or hidden respectively.
 *
 * @example
   <doc:example>
     <doc:source>
        Click me: <input type="checkbox" ng-model="checked"><br/>
        Show: <span ng-show="checked">I show up when your checkbox is checked.</span> <br/>
        Hide: <span ng-hide="checked">I hide when your checkbox is checked.</span>
     </doc:source>
     <doc:scenario>
       it('should check ng-show / ng-hide', function() {
         expect(element('.doc-example-live span:first:hidden').count()).toEqual(1);
         expect(element('.doc-example-live span:last:visible').count()).toEqual(1);

         input('checked').check();

         expect(element('.doc-example-live span:first:visible').count()).toEqual(1);
         expect(element('.doc-example-live span:last:hidden').count()).toEqual(1);
       });
     </doc:scenario>
   </doc:example>
 */
//TODO(misko): refactor to remove element from the DOM
var ngShowDirective = ['$animator', function($animator) {
  return function(scope, element, attr) {
    var animate = $animator(scope, attr);
    scope.$watch(attr.ngShow, function ngShowWatchAction(value){
      animate[toBoolean(value) ? 'show' : 'hide'](element);
    });
  };
}];


/**
 * @ngdoc directive
 * @name ng.directive:ngHide
 *
 * @description
 * The `ngShow` and `ngHide` directives show or hide a portion of the DOM tree (HTML)
 * conditionally based on **"truthy"** values evaluated within an {expression}. In other
 * words, if the expression assigned to **ngShow evaluates to a true value** then **the element is set to visible**
 * (via `display:block` in css) and **if false** then **the element is set to hidden** (so display:none).
 * With ngHide this is the reverse whereas true values cause the element itself to become
 * hidden.
 *
 * Additionally, you can also provide animations via the ngAnimate attribute to animate the **show**
 * and **hide** effects.
 *
 * @animations
 * show - happens after the ngHide expression evaluates to a non truthy value and the contents are set to visible
 * hide - happens after the ngHide expression evaluates to a truthy value and just before the contents are set to hidden
 *
 * @element ANY
 * @param {expression} ngHide If the {@link guide/expression expression} is truthy then
 *     the element is shown or hidden respectively.
 *
 * @example
   <doc:example>
     <doc:source>
        Click me: <input type="checkbox" ng-model="checked"><br/>
        Show: <span ng-show="checked">I show up when you checkbox is checked?</span> <br/>
        Hide: <span ng-hide="checked">I hide when you checkbox is checked?</span>
     </doc:source>
     <doc:scenario>
       it('should check ng-show / ng-hide', function() {
         expect(element('.doc-example-live span:first:hidden').count()).toEqual(1);
         expect(element('.doc-example-live span:last:visible').count()).toEqual(1);

         input('checked').check();

         expect(element('.doc-example-live span:first:visible').count()).toEqual(1);
         expect(element('.doc-example-live span:last:hidden').count()).toEqual(1);
       });
     </doc:scenario>
   </doc:example>
 */
//TODO(misko): refactor to remove element from the DOM
var ngHideDirective = ['$animator', function($animator) {
  return function(scope, element, attr) {
    var animate = $animator(scope, attr);
    scope.$watch(attr.ngHide, function ngHideWatchAction(value){
      animate[toBoolean(value) ? 'hide' : 'show'](element);
    });
  };
}];
