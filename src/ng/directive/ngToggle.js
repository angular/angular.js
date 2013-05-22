'use strict';

/**
 * @ngdoc directive
 * @name ng.directive:ngToggle
 *
 * @description
 * The `ngToggle` directives is used to conditionally swap DOM visibility on your template based on a
 * scope expression.
 *
 * ngToggle simply choose the first or the second child and make it visible based on "truthy" / "falsy" value
 * evaluated within an {expression}.
 * In other word, if the expression assigned to ngToggle evaluates to true, then the first child is set to visible and
 * the second is set to hidden, otherwise the first child is set to hidden and the second is set to visible.
 *
 * Additionally, you can also provide animations via the ngAnimate attribute to animate the show and hide effects.
 *
 * @usage
 * <ANY ng-toggle="matchValue1">
 *   <ANY>...</ANY>
 *   <ANY>...</ANY>
 * </ANY>
 *
 * @animations
 * hide - happens just after the ngToggle contents change and just before the matched child is set to hidden
 * show - happens after the ngToggle contents change and just before the matched child is set to visible
 *
 * @element ANY
 * @param {expression} ngToggle|on If the {@link guide/expression expression} is truthy then
 *     the first child of element is shown and the second is hidden, otherwise the first child is
 *     hidden and the second is shown.
 *
 * @example
  <example animations="true">
    <file name="index.html">
      Click me: <input type="checkbox" ng-model="checked"><br/>
      <div>
        Toggle:
        <div class="example-animate-container"
              ng-toggle="checked"
              ng-animate="{show: 'example-show', hide: 'example-hide'}">
          <span class="icon-thumbs-up"> Checkbox is checked.</span>
          <span class="icon-thumbs-up"> Checkbox is not checked.</span>
        </div>
      </div>
    </file>
    <file name="animations.css">
      .example-show, .example-hide {
        -webkit-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
        -moz-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
        -ms-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
        -o-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
        transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;

        position:absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
      }

      .example-animate-container > * {
        display:block;
        padding:10px;
      }

      .example-show {
        top:-50px;
      }
      .example-show.example-show-active {
        top:0;
      }

      .example-hide {
        top:0;
      }
      .example-hide.example-hide-active {
        top:50px;
      }
    </file>
    <file name="scenario.js">
       it('should check ng-toggle', function() {
         expect(element('.doc-example-live .icon-thumbs-up:first:hidden').count()).toEqual(1);
         expect(element('.doc-example-live .icon-thumbs-up:last:visible').count()).toEqual(1);

         input('checked').check();

         expect(element('.doc-example-live .icon-thumbs-up:first:visible').count()).toEqual(1);
         expect(element('.doc-example-live .icon-thumbs-up:last:hidden').count()).toEqual(1);
       });
    </file>
  </example>
 */
var ngToggleDirective = ['$animator', function($animator) {
  return {
    restrict: 'EA',
    link: function ($scope, $element, $attr) {
      var animate = $animator($scope, $attr),
          watchExpr = $attr.ngToggle || $attr.on,
          children = $element.children(),
          elements = [ children.eq(0), children.eq(1) ],
          currentVisible;

      // Hide children
      // The child to show will be set to visible in the watcher
      children.css('display', 'none');

      $scope.$watch(watchExpr, function ngToggleWatchAction(value) {
        var idx = toBoolean(value) ? 0 : 1;

        if (currentVisible) {
          animate.hide(currentVisible);
          currentVisible = undefined;
        }

        currentVisible = elements[idx];
        animate.show(currentVisible);
      });
    }
  };
}];
