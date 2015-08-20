'use strict';

var NG_HIDE_CLASS = 'ng-hide';
var NG_HIDE_IN_PROGRESS_CLASS = 'ng-hide-animate';
/**
 * @ngdoc directive
 * @name ngShow
 * @multiElement
 *
 * @description
 * The `ngShow` directive shows or hides the given HTML element based on the expression
 * provided to the `ngShow` attribute. The element is shown or hidden by removing or adding
 * the `.ng-hide` CSS class onto the element. The `.ng-hide` CSS class is predefined
 * in AngularJS and sets the display style to none (using an !important flag).
 * For CSP mode please add `angular-csp.css` to your html file (see {@link ng.directive:ngCsp ngCsp}).
 *
 * ```html
 * <!-- when $scope.myValue is truthy (element is visible) -->
 * <div ng-show="myValue"></div>
 *
 * <!-- when $scope.myValue is falsy (element is hidden) -->
 * <div ng-show="myValue" class="ng-hide"></div>
 * ```
 *
 * When the `ngShow` expression evaluates to a falsy value then the `.ng-hide` CSS class is added to the class
 * attribute on the element causing it to become hidden. When truthy, the `.ng-hide` CSS class is removed
 * from the element causing the element not to appear hidden.
 *
 * ## Why is !important used?
 *
 * You may be wondering why !important is used for the `.ng-hide` CSS class. This is because the `.ng-hide` selector
 * can be easily overridden by heavier selectors. For example, something as simple
 * as changing the display style on a HTML list item would make hidden elements appear visible.
 * This also becomes a bigger issue when dealing with CSS frameworks.
 *
 * By using !important, the show and hide behavior will work as expected despite any clash between CSS selector
 * specificity (when !important isn't used with any conflicting styles). If a developer chooses to override the
 * styling to change how to hide an element then it is just a matter of using !important in their own CSS code.
 *
 * ### Overriding `.ng-hide`
 *
 * By default, the `.ng-hide` class will style the element with `display: none!important`. If you wish to change
 * the hide behavior with ngShow/ngHide then this can be achieved by restating the styles for the `.ng-hide`
 * class CSS. Note that the selector that needs to be used is actually `.ng-hide:not(.ng-hide-animate)` to cope
 * with extra animation classes that can be added.
 *
 * ```css
 * .ng-hide:not(.ng-hide-animate) {
 *   /&#42; this is just another form of hiding an element &#42;/
 *   display: block!important;
 *   position: absolute;
 *   top: -9999px;
 *   left: -9999px;
 * }
 * ```
 *
 * By default you don't need to override in CSS anything and the animations will work around the display style.
 *
 * ## A note about animations with `ngShow`
 *
 * Animations in ngShow/ngHide work with the show and hide events that are triggered when the directive expression
 * is true and false. This system works like the animation system present with ngClass except that
 * you must also include the !important flag to override the display property
 * so that you can perform an animation when the element is hidden during the time of the animation.
 *
 * ```css
 * //
 * //a working example can be found at the bottom of this page
 * //
 * .my-element.ng-hide-add, .my-element.ng-hide-remove {
 *   /&#42; this is required as of 1.3x to properly
 *      apply all styling in a show/hide animation &#42;/
 *   transition: 0s linear all;
 * }
 *
 * .my-element.ng-hide-add-active,
 * .my-element.ng-hide-remove-active {
 *   /&#42; the transition is defined in the active class &#42;/
 *   transition: 1s linear all;
 * }
 *
 * .my-element.ng-hide-add { ... }
 * .my-element.ng-hide-add.ng-hide-add-active { ... }
 * .my-element.ng-hide-remove { ... }
 * .my-element.ng-hide-remove.ng-hide-remove-active { ... }
 * ```
 *
 * Keep in mind that, as of AngularJS version 1.3.0-beta.11, there is no need to change the display
 * property to block during animation states--ngAnimate will handle the style toggling automatically for you.
 *
 * @animations
 * addClass: `.ng-hide` - happens after the `ngShow` expression evaluates to a truthy value and the just before contents are set to visible
 * removeClass: `.ng-hide` - happens after the `ngShow` expression evaluates to a non truthy value and just before the contents are set to hidden
 *
 * @element ANY
 * @param {expression} ngShow If the {@link guide/expression expression} is truthy
 *     then the element is shown or hidden respectively.
 *
 * @example
  <example module="ngAnimate" deps="angular-animate.js" animations="true">
    <file name="index.html">
      Click me: <input type="checkbox" ng-model="checked" aria-label="Toggle ngHide"><br/>
      <div>
        Show:
        <div class="check-element animate-show" ng-show="checked">
          <span class="glyphicon glyphicon-thumbs-up"></span> I show up when your checkbox is checked.
        </div>
      </div>
      <div>
        Hide:
        <div class="check-element animate-show" ng-hide="checked">
          <span class="glyphicon glyphicon-thumbs-down"></span> I hide when your checkbox is checked.
        </div>
      </div>
    </file>
    <file name="glyphicons.css">
      @import url(../../components/bootstrap-3.1.1/css/bootstrap.css);
    </file>
    <file name="animations.css">
      .animate-show {
        line-height: 20px;
        opacity: 1;
        padding: 10px;
        border: 1px solid black;
        background: white;
      }

      .animate-show.ng-hide-add, .animate-show.ng-hide-remove {
        transition: all linear 0.5s;
      }

      .animate-show.ng-hide {
        line-height: 0;
        opacity: 0;
        padding: 0 10px;
      }

      .check-element {
        padding: 10px;
        border: 1px solid black;
        background: white;
      }
    </file>
    <file name="protractor.js" type="protractor">
      var thumbsUp = element(by.css('span.glyphicon-thumbs-up'));
      var thumbsDown = element(by.css('span.glyphicon-thumbs-down'));

      it('should check ng-show / ng-hide', function() {
        expect(thumbsUp.isDisplayed()).toBeFalsy();
        expect(thumbsDown.isDisplayed()).toBeTruthy();

        element(by.model('checked')).click();

        expect(thumbsUp.isDisplayed()).toBeTruthy();
        expect(thumbsDown.isDisplayed()).toBeFalsy();
      });
    </file>
  </example>
 */
var ngShowDirective = ['$animate', function($animate) {
  return {
    restrict: 'A',
    multiElement: true,
    link: function(scope, element, attr) {
      scope.$watch(attr.ngShow, function ngShowWatchAction(value) {
        // we're adding a temporary, animation-specific class for ng-hide since this way
        // we can control when the element is actually displayed on screen without having
        // to have a global/greedy CSS selector that breaks when other animations are run.
        // Read: https://github.com/angular/angular.js/issues/9103#issuecomment-58335845
        $animate[value ? 'removeClass' : 'addClass'](element, NG_HIDE_CLASS, {
          tempClasses: NG_HIDE_IN_PROGRESS_CLASS
        });
      });
    }
  };
}];


/**
 * @ngdoc directive
 * @name ngHide
 * @multiElement
 *
 * @description
 * The `ngHide` directive shows or hides the given HTML element based on the expression
 * provided to the `ngHide` attribute. The element is shown or hidden by removing or adding
 * the `ng-hide` CSS class onto the element. The `.ng-hide` CSS class is predefined
 * in AngularJS and sets the display style to none (using an !important flag).
 * For CSP mode please add `angular-csp.css` to your html file (see {@link ng.directive:ngCsp ngCsp}).
 *
 * ```html
 * <!-- when $scope.myValue is truthy (element is hidden) -->
 * <div ng-hide="myValue" class="ng-hide"></div>
 *
 * <!-- when $scope.myValue is falsy (element is visible) -->
 * <div ng-hide="myValue"></div>
 * ```
 *
 * When the `ngHide` expression evaluates to a truthy value then the `.ng-hide` CSS class is added to the class
 * attribute on the element causing it to become hidden. When falsy, the `.ng-hide` CSS class is removed
 * from the element causing the element not to appear hidden.
 *
 * ## Why is !important used?
 *
 * You may be wondering why !important is used for the `.ng-hide` CSS class. This is because the `.ng-hide` selector
 * can be easily overridden by heavier selectors. For example, something as simple
 * as changing the display style on a HTML list item would make hidden elements appear visible.
 * This also becomes a bigger issue when dealing with CSS frameworks.
 *
 * By using !important, the show and hide behavior will work as expected despite any clash between CSS selector
 * specificity (when !important isn't used with any conflicting styles). If a developer chooses to override the
 * styling to change how to hide an element then it is just a matter of using !important in their own CSS code.
 *
 * ### Overriding `.ng-hide`
 *
 * By default, the `.ng-hide` class will style the element with `display: none!important`. If you wish to change
 * the hide behavior with ngShow/ngHide then this can be achieved by restating the styles for the `.ng-hide`
 * class in CSS:
 *
 * ```css
 * .ng-hide {
 *   /&#42; this is just another form of hiding an element &#42;/
 *   display: block!important;
 *   position: absolute;
 *   top: -9999px;
 *   left: -9999px;
 * }
 * ```
 *
 * By default you don't need to override in CSS anything and the animations will work around the display style.
 *
 * ## A note about animations with `ngHide`
 *
 * Animations in ngShow/ngHide work with the show and hide events that are triggered when the directive expression
 * is true and false. This system works like the animation system present with ngClass, except that the `.ng-hide`
 * CSS class is added and removed for you instead of your own CSS class.
 *
 * ```css
 * //
 * //a working example can be found at the bottom of this page
 * //
 * .my-element.ng-hide-add, .my-element.ng-hide-remove {
 *   transition: 0.5s linear all;
 * }
 *
 * .my-element.ng-hide-add { ... }
 * .my-element.ng-hide-add.ng-hide-add-active { ... }
 * .my-element.ng-hide-remove { ... }
 * .my-element.ng-hide-remove.ng-hide-remove-active { ... }
 * ```
 *
 * Keep in mind that, as of AngularJS version 1.3.0-beta.11, there is no need to change the display
 * property to block during animation states--ngAnimate will handle the style toggling automatically for you.
 *
 * @animations
 * removeClass: `.ng-hide` - happens after the `ngHide` expression evaluates to a truthy value and just before the contents are set to hidden
 * addClass: `.ng-hide` - happens after the `ngHide` expression evaluates to a non truthy value and just before the contents are set to visible
 *
 * @element ANY
 * @param {expression} ngHide If the {@link guide/expression expression} is truthy then
 *     the element is shown or hidden respectively.
 *
 * @example
  <example module="ngAnimate" deps="angular-animate.js" animations="true">
    <file name="index.html">
      Click me: <input type="checkbox" ng-model="checked" aria-label="Toggle ngShow"><br/>
      <div>
        Show:
        <div class="check-element animate-hide" ng-show="checked">
          <span class="glyphicon glyphicon-thumbs-up"></span> I show up when your checkbox is checked.
        </div>
      </div>
      <div>
        Hide:
        <div class="check-element animate-hide" ng-hide="checked">
          <span class="glyphicon glyphicon-thumbs-down"></span> I hide when your checkbox is checked.
        </div>
      </div>
    </file>
    <file name="glyphicons.css">
      @import url(../../components/bootstrap-3.1.1/css/bootstrap.css);
    </file>
    <file name="animations.css">
      .animate-hide {
        transition: all linear 0.5s;
        line-height: 20px;
        opacity: 1;
        padding: 10px;
        border: 1px solid black;
        background: white;
      }

      .animate-hide.ng-hide {
        line-height: 0;
        opacity: 0;
        padding: 0 10px;
      }

      .check-element {
        padding: 10px;
        border: 1px solid black;
        background: white;
      }
    </file>
    <file name="protractor.js" type="protractor">
      var thumbsUp = element(by.css('span.glyphicon-thumbs-up'));
      var thumbsDown = element(by.css('span.glyphicon-thumbs-down'));

      it('should check ng-show / ng-hide', function() {
        expect(thumbsUp.isDisplayed()).toBeFalsy();
        expect(thumbsDown.isDisplayed()).toBeTruthy();

        element(by.model('checked')).click();

        expect(thumbsUp.isDisplayed()).toBeTruthy();
        expect(thumbsDown.isDisplayed()).toBeFalsy();
      });
    </file>
  </example>
 */
var ngHideDirective = ['$animate', function($animate) {
  return {
    restrict: 'A',
    multiElement: true,
    link: function(scope, element, attr) {
      scope.$watch(attr.ngHide, function ngHideWatchAction(value) {
        // The comment inside of the ngShowDirective explains why we add and
        // remove a temporary class for the show/hide animation
        $animate[value ? 'addClass' : 'removeClass'](element,NG_HIDE_CLASS, {
          tempClasses: NG_HIDE_IN_PROGRESS_CLASS
        });
      });
    }
  };
}];
