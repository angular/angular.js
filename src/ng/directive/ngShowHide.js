'use strict';

/**
 * @ngdoc directive
 * @name ng.directive:ngShow
 *
 * @description
 * The `ngShow` and `ngHide` directives show or hide a portion of the DOM tree (HTML)
 * conditionally based on <strong>"truthy"</strong> values evaluated within an {expression}. In other
 * words, if the expression assigned to <strong>ngShow evaluates to a true value</strong> then <strong>the element is set to visible</strong>
 * (via `display:block` in css) and <strong>if false</strong> then <strong>the element is set to hidden</strong> (so display:none).
 * With ngHide this is the reverse whereas true values cause the element itself to become
 * hidden.
 *
 * Additionally, you can also provide animations via the ngAnimate directive to animate
 * the show and hide effects.
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
var ngShowDirective = ['$defaultAnimator', function($defaultAnimator) {
  return {
    require: '?ngAnimate', // optional
    link: function(scope, element, attr, animator) {
      animator = animator || $defaultAnimator;
      scope.$watch(attr.ngShow, function ngShowWatchAction(value){
        toBoolean(value) ? animator.animate('show', element) : animator.animate('hide', element);
      });
    }
  };
}];


/**
 * @ngdoc directive
 * @name ng.directive:ngHide
 *
 * @description
 * The `ngShow` and `ngHide` directives show or hide a portion of the DOM tree (HTML)
 * conditionally based on <strong>"truthy"</strong> values evaluated within an {expression}. In other
 * words, if the expression assigned to <strong>ngShow evaluates to a true value</strong> then <strong>the element is set to visible</strong>
 * (via `display:block` in css) and <strong>if false</strong> then <strong>the element is set to hidden</strong> (so display:none).
 * With ngHide this is the reverse whereas true values cause the element itself to become
 * hidden.
 *
 * Additionally, you can also provide animations via the ngAnimate directive to animate
 * the show and hide effects.
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
var ngHideDirective = ['$defaultAnimator', function($defaultAnimator) {
  return {
    require: '?ngAnimate', // optional
    link : function(scope, element, attr, animator) {
      animator = animator || $defaultAnimator;
      scope.$watch(attr.ngHide, function ngHideWatchAction(value){
        toBoolean(value) ? animator.animate('hide', element) : animator.animate('show', element);
      });
    }
  };
}];
