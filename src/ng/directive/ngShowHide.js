'use strict';

var NG_HIDE_CLASS = 'ng-hide';
var NG_HIDE_IN_PROGRESS_CLASS = 'ng-hide-animate';
/**
 * @ngdoc directive
 * @name ngShow
 * @multiElement
 *
 * @description
 * The `ngShow` directive shows or hides the given HTML element based on the expression provided to
 * the `ngShow` attribute.
 *
 * The element is shown or hidden by removing or adding the `.ng-hide` CSS class onto the element.
 * The `.ng-hide` CSS class is predefined in AngularJS and sets the display style to none (using an
 * `!important` flag). For CSP mode please add `angular-csp.css` to your HTML file (see
 * {@link ng.directive:ngCsp ngCsp}).
 *
 * ```html
 * <!-- when $scope.myValue is truthy (element is visible) -->
 * <div ng-show="myValue"></div>
 *
 * <!-- when $scope.myValue is falsy (element is hidden) -->
 * <div ng-show="myValue" class="ng-hide"></div>
 * ```
 *
 * When the `ngShow` expression evaluates to a falsy value then the `.ng-hide` CSS class is added
 * to the class attribute on the element causing it to become hidden. When truthy, the `.ng-hide`
 * CSS class is removed from the element causing the element not to appear hidden.
 *
 * ## Why is `!important` used?
 *
 * You may be wondering why `!important` is used for the `.ng-hide` CSS class. This is because the
 * `.ng-hide` selector can be easily overridden by heavier selectors. For example, something as
 * simple as changing the display style on a HTML list item would make hidden elements appear
 * visible. This also becomes a bigger issue when dealing with CSS frameworks.
 *
 * By using `!important`, the show and hide behavior will work as expected despite any clash between
 * CSS selector specificity (when `!important` isn't used with any conflicting styles). If a
 * developer chooses to override the styling to change how to hide an element then it is just a
 * matter of using `!important` in their own CSS code.
 *
 * ### Overriding `.ng-hide`
 *
 * By default, the `.ng-hide` class will style the element with `display: none !important`. If you
 * wish to change the hide behavior with `ngShow`/`ngHide`, you can simply overwrite the styles for
 * the `.ng-hide` CSS class. Note that the selector that needs to be used is actually
 * `.ng-hide:not(.ng-hide-animate)` to cope with extra animation classes that can be added.
 *
 * ```css
 * .ng-hide:not(.ng-hide-animate) {
 *   /&#42; These are just alternative ways of hiding an element &#42;/
 *   display: block!important;
 *   position: absolute;
 *   top: -9999px;
 *   left: -9999px;
 * }
 * ```
 *
 * By default you don't need to override anything in CSS and the animations will work around the
 * display style.
 *
 * ## A note about animations with `ngShow`
 *
 * Animations in `ngShow`/`ngHide` work with the show and hide events that are triggered when the
 * directive expression is true and false. This system works like the animation system present with
 * `ngClass` except that you must also include the `!important` flag to override the display
 * property so that the elements are not actually hidden during the animation.
 *
 * ```css
 * /&#42; A working example can be found at the bottom of this page. &#42;/
 * .my-element.ng-hide-add, .my-element.ng-hide-remove {
 *   transition: all 0.5s linear;
 * }
 *
 * .my-element.ng-hide-add { ... }
 * .my-element.ng-hide-add.ng-hide-add-active { ... }
 * .my-element.ng-hide-remove { ... }
 * .my-element.ng-hide-remove.ng-hide-remove-active { ... }
 * ```
 *
 * Keep in mind that, as of AngularJS version 1.3, there is no need to change the display property
 * to block during animation states - ngAnimate will automatically handle the style toggling for you.
 *
 * @animations
 * | Animation                                           | Occurs                                                                                                        |
 * |-----------------------------------------------------|---------------------------------------------------------------------------------------------------------------|
 * | {@link $animate#addClass addClass} `.ng-hide`       | After the `ngShow` expression evaluates to a non truthy value and just before the contents are set to hidden. |
 * | {@link $animate#removeClass removeClass} `.ng-hide` | After the `ngShow` expression evaluates to a truthy value and just before contents are set to visible.        |
 *
 * @element ANY
 * @param {expression} ngShow If the {@link guide/expression expression} is truthy/falsy then the
 *                            element is shown/hidden respectively.
 *
 * @example
 * A simple example, animating the element's opacity:
 *
  <example module="ngAnimate" deps="angular-animate.js" animations="true" name="ng-show-simple">
    <file name="index.html">
      Show: <input type="checkbox" ng-model="checked" aria-label="Toggle ngShow"><br />
      <div class="check-element animate-show-hide" ng-show="checked">
        I show up when your checkbox is checked.
      </div>
    </file>
    <file name="animations.css">
      .animate-show-hide.ng-hide {
        opacity: 0;
      }

      .animate-show-hide.ng-hide-add,
      .animate-show-hide.ng-hide-remove {
        transition: all linear 0.5s;
      }

      .check-element {
        border: 1px solid black;
        opacity: 1;
        padding: 10px;
      }
    </file>
    <file name="protractor.js" type="protractor">
      it('should check ngShow', function() {
        var checkbox = element(by.model('checked'));
        var checkElem = element(by.css('.check-element'));

        expect(checkElem.isDisplayed()).toBe(false);
        checkbox.click();
        expect(checkElem.isDisplayed()).toBe(true);
      });
    </file>
  </example>
 *
 * <hr />
 * @example
 * A more complex example, featuring different show/hide animations:
 *
  <example module="ngAnimate" deps="angular-animate.js" animations="true" name="ng-show-complex">
    <file name="index.html">
      Show: <input type="checkbox" ng-model="checked" aria-label="Toggle ngShow"><br />
      <div class="check-element funky-show-hide" ng-show="checked">
        I show up when your checkbox is checked.
      </div>
    </file>
    <file name="animations.css">
      body {
        overflow: hidden;
        perspective: 1000px;
      }

      .funky-show-hide.ng-hide-add {
        transform: rotateZ(0);
        transform-origin: right;
        transition: all 0.5s ease-in-out;
      }

      .funky-show-hide.ng-hide-add.ng-hide-add-active {
        transform: rotateZ(-135deg);
      }

      .funky-show-hide.ng-hide-remove {
        transform: rotateY(90deg);
        transform-origin: left;
        transition: all 0.5s ease;
      }

      .funky-show-hide.ng-hide-remove.ng-hide-remove-active {
        transform: rotateY(0);
      }

      .check-element {
        border: 1px solid black;
        opacity: 1;
        padding: 10px;
      }
    </file>
    <file name="protractor.js" type="protractor">
      it('should check ngShow', function() {
        var checkbox = element(by.model('checked'));
        var checkElem = element(by.css('.check-element'));

        expect(checkElem.isDisplayed()).toBe(false);
        checkbox.click();
        expect(checkElem.isDisplayed()).toBe(true);
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
 * The `ngHide` directive shows or hides the given HTML element based on the expression provided to
 * the `ngHide` attribute.
 *
 * The element is shown or hidden by removing or adding the `.ng-hide` CSS class onto the element.
 * The `.ng-hide` CSS class is predefined in AngularJS and sets the display style to none (using an
 * `!important` flag). For CSP mode please add `angular-csp.css` to your HTML file (see
 * {@link ng.directive:ngCsp ngCsp}).
 *
 * ```html
 * <!-- when $scope.myValue is truthy (element is hidden) -->
 * <div ng-hide="myValue" class="ng-hide"></div>
 *
 * <!-- when $scope.myValue is falsy (element is visible) -->
 * <div ng-hide="myValue"></div>
 * ```
 *
 * When the `ngHide` expression evaluates to a truthy value then the `.ng-hide` CSS class is added
 * to the class attribute on the element causing it to become hidden. When falsy, the `.ng-hide`
 * CSS class is removed from the element causing the element not to appear hidden.
 *
 * ## Why is `!important` used?
 *
 * You may be wondering why `!important` is used for the `.ng-hide` CSS class. This is because the
 * `.ng-hide` selector can be easily overridden by heavier selectors. For example, something as
 * simple as changing the display style on a HTML list item would make hidden elements appear
 * visible. This also becomes a bigger issue when dealing with CSS frameworks.
 *
 * By using `!important`, the show and hide behavior will work as expected despite any clash between
 * CSS selector specificity (when `!important` isn't used with any conflicting styles). If a
 * developer chooses to override the styling to change how to hide an element then it is just a
 * matter of using `!important` in their own CSS code.
 *
 * ### Overriding `.ng-hide`
 *
 * By default, the `.ng-hide` class will style the element with `display: none !important`. If you
 * wish to change the hide behavior with `ngShow`/`ngHide`, you can simply overwrite the styles for
 * the `.ng-hide` CSS class. Note that the selector that needs to be used is actually
 * `.ng-hide:not(.ng-hide-animate)` to cope with extra animation classes that can be added.
 *
 * ```css
 * .ng-hide:not(.ng-hide-animate) {
 *   /&#42; These are just alternative ways of hiding an element &#42;/
 *   display: block!important;
 *   position: absolute;
 *   top: -9999px;
 *   left: -9999px;
 * }
 * ```
 *
 * By default you don't need to override in CSS anything and the animations will work around the
 * display style.
 *
 * ## A note about animations with `ngHide`
 *
 * Animations in `ngShow`/`ngHide` work with the show and hide events that are triggered when the
 * directive expression is true and false. This system works like the animation system present with
 * `ngClass` except that you must also include the `!important` flag to override the display
 * property so that the elements are not actually hidden during the animation.
 *
 * ```css
 * /&#42; A working example can be found at the bottom of this page. &#42;/
 * .my-element.ng-hide-add, .my-element.ng-hide-remove {
 *   transition: all 0.5s linear;
 * }
 *
 * .my-element.ng-hide-add { ... }
 * .my-element.ng-hide-add.ng-hide-add-active { ... }
 * .my-element.ng-hide-remove { ... }
 * .my-element.ng-hide-remove.ng-hide-remove-active { ... }
 * ```
 *
 * Keep in mind that, as of AngularJS version 1.3, there is no need to change the display property
 * to block during animation states - ngAnimate will automatically handle the style toggling for you.
 *
 * @animations
 * | Animation                                           | Occurs                                                                                                     |
 * |-----------------------------------------------------|------------------------------------------------------------------------------------------------------------|
 * | {@link $animate#addClass addClass} `.ng-hide`       | After the `ngHide` expression evaluates to a truthy value and just before the contents are set to hidden.  |
 * | {@link $animate#removeClass removeClass} `.ng-hide` | After the `ngHide` expression evaluates to a non truthy value and just before contents are set to visible. |
 *
 *
 * @element ANY
 * @param {expression} ngHide If the {@link guide/expression expression} is truthy/falsy then the
 *                            element is hidden/shown respectively.
 *
 * @example
 * A simple example, animating the element's opacity:
 *
  <example module="ngAnimate" deps="angular-animate.js" animations="true" name="ng-hide-simple">
    <file name="index.html">
      Hide: <input type="checkbox" ng-model="checked" aria-label="Toggle ngHide"><br />
      <div class="check-element animate-show-hide" ng-hide="checked">
        I hide when your checkbox is checked.
      </div>
    </file>
    <file name="animations.css">
      .animate-show-hide.ng-hide {
        opacity: 0;
      }

      .animate-show-hide.ng-hide-add,
      .animate-show-hide.ng-hide-remove {
        transition: all linear 0.5s;
      }

      .check-element {
        border: 1px solid black;
        opacity: 1;
        padding: 10px;
      }
    </file>
    <file name="protractor.js" type="protractor">
      it('should check ngHide', function() {
        var checkbox = element(by.model('checked'));
        var checkElem = element(by.css('.check-element'));

        expect(checkElem.isDisplayed()).toBe(true);
        checkbox.click();
        expect(checkElem.isDisplayed()).toBe(false);
      });
    </file>
  </example>
 *
 * <hr />
 * @example
 * A more complex example, featuring different show/hide animations:
 *
  <example module="ngAnimate" deps="angular-animate.js" animations="true" name="ng-hide-complex">
    <file name="index.html">
      Hide: <input type="checkbox" ng-model="checked" aria-label="Toggle ngHide"><br />
      <div class="check-element funky-show-hide" ng-hide="checked">
        I hide when your checkbox is checked.
      </div>
    </file>
    <file name="animations.css">
      body {
        overflow: hidden;
        perspective: 1000px;
      }

      .funky-show-hide.ng-hide-add {
        transform: rotateZ(0);
        transform-origin: right;
        transition: all 0.5s ease-in-out;
      }

      .funky-show-hide.ng-hide-add.ng-hide-add-active {
        transform: rotateZ(-135deg);
      }

      .funky-show-hide.ng-hide-remove {
        transform: rotateY(90deg);
        transform-origin: left;
        transition: all 0.5s ease;
      }

      .funky-show-hide.ng-hide-remove.ng-hide-remove-active {
        transform: rotateY(0);
      }

      .check-element {
        border: 1px solid black;
        opacity: 1;
        padding: 10px;
      }
    </file>
    <file name="protractor.js" type="protractor">
      it('should check ngHide', function() {
        var checkbox = element(by.model('checked'));
        var checkElem = element(by.css('.check-element'));

        expect(checkElem.isDisplayed()).toBe(true);
        checkbox.click();
        expect(checkElem.isDisplayed()).toBe(false);
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
