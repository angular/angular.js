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
  <example animations="true">
    <file name="index.html">
      Click me: <input type="checkbox" ng-model="checked"><br/>
      <div>
        Show:
        <span class="check-element"
              ng-show="checked"
              ng-animate="{show: 'example-show', hide: 'example-hide'}">
          <span class="icon-thumbs-up"></span> I show up when your checkbox is checked.
        </span>
      </div>
      <div>
        Hide:
        <span class="check-element"
              ng-hide="checked"
              ng-animate="{show: 'example-show', hide: 'example-hide'}">
          <span class="icon-thumbs-down"></span> I hide when your checkbox is checked.
        </span>
      </div>
    </file>
    <file name="animations.css">
      .example-show-setup, .example-hide-setup {
        -webkit-transition:all linear 0.5s;
        -moz-transition:all linear 0.5s;
        -ms-transition:all linear 0.5s;
        -o-transition:all linear 0.5s;
        transition:all linear 0.5s;
      }

      .example-show-setup {
        line-height:0;
        opacity:0;
        padding:0 10px;
      }
      .example-show-start.example-show-start {
        line-height:20px;
        opacity:1;
        padding:10px;
        border:1px solid black;
        background:white;
      }

      .example-hide-setup {
        line-height:20px;
        opacity:1;
        padding:10px;
        border:1px solid black;
        background:white;
      }
      .example-hide-start.example-hide-start {
        line-height:0;
        opacity:0;
        padding:0 10px;
      }

      .check-element {
        padding:10px;
        border:1px solid black;
        background:white;
      }
    </file>
    <file name="scenario.js">
       it('should check ng-show / ng-hide', function() {
         expect(element('.doc-example-live span:first:hidden').count()).toEqual(1);
         expect(element('.doc-example-live span:last:visible').count()).toEqual(1);

         input('checked').check();

         expect(element('.doc-example-live span:first:visible').count()).toEqual(1);
         expect(element('.doc-example-live span:last:hidden').count()).toEqual(1);
       });
    </file>
  </example>
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
  <example animations="true">
    <file name="index.html">
      Click me: <input type="checkbox" ng-model="checked"><br/>
      <div>
        Show:
        <span class="check-element"
              ng-show="checked"
              ng-animate="{show: 'example-show', hide: 'example-hide'}">
          <span class="icon-thumbs-up"></span> I show up when your checkbox is checked.
        </span>
      </div>
      <div>
        Hide:
        <span class="check-element"
              ng-hide="checked"
              ng-animate="{show: 'example-show', hide: 'example-hide'}">
          <span class="icon-thumbs-down"></span> I hide when your checkbox is checked.
        </span>
      </div>
    </file>
    <file name="animations.css">
      .example-show-setup, .example-hide-setup {
        -webkit-transition:all linear 0.5s;
        -moz-transition:all linear 0.5s;
        -ms-transition:all linear 0.5s;
        -o-transition:all linear 0.5s;
        transition:all linear 0.5s;
      }

      .example-show-setup {
        line-height:0;
        opacity:0;
        padding:0 10px;
      }
      .example-show-start.example-show-start {
        line-height:20px;
        opacity:1;
        padding:10px;
        border:1px solid black;
        background:white;
      }

      .example-hide-setup {
        line-height:20px;
        opacity:1;
        padding:10px;
        border:1px solid black;
        background:white;
      }
      .example-hide-start.example-hide-start {
        line-height:0;
        opacity:0;
        padding:0 10px;
      }

      .check-element {
        padding:10px;
        border:1px solid black;
        background:white;
      }
    </file>
    <file name="scenario.js">
       it('should check ng-show / ng-hide', function() {
         expect(element('.doc-example-live .check-element:first:hidden').count()).toEqual(1);
         expect(element('.doc-example-live .check-element:last:visible').count()).toEqual(1);

         input('checked').check();

         expect(element('.doc-example-live .check-element:first:visible').count()).toEqual(1);
         expect(element('.doc-example-live .check-element:last:hidden').count()).toEqual(1);
       });
    </file>
  </example>
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
