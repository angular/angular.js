'use strict';

/**
 * @ngdoc directive
 * @name ngRef
 * @restrict A
 *
 * @description
 * The `ngRef` attribute tells AngularJS to assign the controller of a component (or a directive)
 * to the given property in the current scope. It is also possible to add the jqlite-wrapped DOM
 * element to the scope.
 *
 * If the element with `ngRef` is destroyed `null` is assigned to the property.
 *
 * Note that if you want to assign from a child into the parent scope, you must initialize the
 * target property on the parent scope, otherwise `ngRef` will assign on the child scope.
 * This commonly happens when assigning elements or components wrapped in {@link ngIf} or
 * {@link ngRepeat}. See the second example below.
 *
 *
 * @element ANY
 * @param {string} ngRef property name - A valid AngularJS expression identifier to which the
 *                       controller or jqlite-wrapped DOM element will be bound.
 * @param {string=} ngRefRead read value - The name of a directive (or component) on this element,
 *                            or the special string `$element`. If a name is provided, `ngRef` will
 *                            assign the matching controller. If `$element` is provided, the element
 *                            itself is assigned (even if a controller is available).
 *
 *
 * @example
 * ### Simple toggle
 * This example shows how the controller of the component toggle
 * is reused in the template through the scope to use its logic.
 * <example name="ng-ref-component" module="myApp">
 *   <file name="index.html">
 *     <my-toggle ng-ref="myToggle"></my-toggle>
 *     <button ng-click="myToggle.toggle()">Toggle</button>
 *     <div ng-show="myToggle.isOpen()">
 *       You are using a component in the same template to show it.
 *     </div>
 *   </file>
 *   <file name="index.js">
 *     angular.module('myApp', [])
 *     .component('myToggle', {
 *       controller: function ToggleController() {
 *         var opened = false;
 *         this.isOpen = function() { return opened; };
 *         this.toggle = function() { opened = !opened; };
 *       }
 *     });
 *   </file>
 *   <file name="protractor.js" type="protractor">
 *      it('should publish the toggle into the scope', function() {
 *        var toggle = element(by.buttonText('Toggle'));
 *        expect(toggle.evaluate('myToggle.isOpen()')).toEqual(false);
 *        toggle.click();
 *        expect(toggle.evaluate('myToggle.isOpen()')).toEqual(true);
 *      });
 *   </file>
 * </example>
 *
 * @example
 * ### ngRef inside scopes
 * This example shows how `ngRef` works with child scopes. The `ngRepeat`-ed `myWrapper` components
 * are assigned to the scope of `myRoot`, because the `toggles` property has been initialized.
 * The repeated `myToggle` components are published to the child scopes created by `ngRepeat`.
 * `ngIf` behaves similarly - the assignment of `myToggle` happens in the `ngIf` child scope,
 * because the target property has not been initialized on the `myRoot` component controller.
 *
 * <example name="ng-ref-scopes" module="myApp">
 *   <file name="index.html">
 *     <my-root></my-root>
 *   </file>
 *   <file name="index.js">
 *     angular.module('myApp', [])
 *     .component('myRoot', {
 *       templateUrl: 'root.html',
 *       controller: function() {
 *         this.wrappers = []; // initialize the array so that the wrappers are assigned into the parent scope
 *       }
 *     })
 *     .component('myToggle', {
 *       template: '<strong>myToggle</strong><button ng-click="$ctrl.toggle()" ng-transclude></button>',
 *       transclude: true,
 *       controller: function ToggleController() {
 *         var opened = false;
 *         this.isOpen = function() { return opened; };
 *         this.toggle = function() { opened = !opened; };
 *       }
 *     })
 *     .component('myWrapper', {
 *       transclude: true,
 *       template: '<strong>myWrapper</strong>' +
 *         '<div>ngRepeatToggle.isOpen(): {{$ctrl.ngRepeatToggle.isOpen() | json}}</div>' +
 *         '<my-toggle ng-ref="$ctrl.ngRepeatToggle"><ng-transclude></ng-transclude></my-toggle>'
 *     });
 *   </file>
 *   <file name="root.html">
 *     <strong>myRoot</strong>
 *     <my-toggle ng-ref="$ctrl.outerToggle">Outer Toggle</my-toggle>
 *     <div>outerToggle.isOpen(): {{$ctrl.outerToggle.isOpen() | json}}</div>
 *     <div><em>wrappers assigned to root</em><br>
 *     <div ng-repeat="wrapper in $ctrl.wrappers">
 *       wrapper.ngRepeatToggle.isOpen(): {{wrapper.ngRepeatToggle.isOpen() | json}}
 *     </div>
 *
 *     <ul>
 *       <li ng-repeat="(index, value) in [1,2,3]">
 *         <strong>ngRepeat</strong>
 *         <div>outerToggle.isOpen(): {{$ctrl.outerToggle.isOpen() | json}}</div>
 *         <my-wrapper ng-ref="$ctrl.wrappers[index]">ngRepeat Toggle {{$index + 1}}</my-wrapper>
 *       </li>
 *     </ul>
 *
 *     <div>ngIfToggle.isOpen(): {{ngIfToggle.isOpen()}} // This is always undefined because it's
 *       assigned to the child scope created by ngIf.
 *     </div>
 *     <div ng-if="true">
          <strong>ngIf</strong>
 *        <my-toggle ng-ref="ngIfToggle">ngIf Toggle</my-toggle>
 *        <div>ngIfToggle.isOpen(): {{ngIfToggle.isOpen() | json}}</div>
 *        <div>outerToggle.isOpen(): {{$ctrl.outerToggle.isOpen() | json}}</div>
 *     </div>
 *   </file>
 *   <file name="styles.css">
 *     ul {
 *       list-style: none;
 *       padding-left: 0;
 *     }
 *
 *     li[ng-repeat] {
 *       background: lightgreen;
 *       padding: 8px;
 *       margin: 8px;
 *     }
 *
 *     [ng-if] {
 *       background: lightgrey;
 *       padding: 8px;
 *     }
 *
 *     my-root {
 *       background: lightgoldenrodyellow;
 *       padding: 8px;
 *       display: block;
 *     }
 *
 *     my-wrapper {
 *       background: lightsalmon;
 *       padding: 8px;
 *       display: block;
 *     }
 *
 *     my-toggle {
 *       background: lightblue;
 *       padding: 8px;
 *       display: block;
 *     }
 *   </file>
 *   <file name="protractor.js" type="protractor">
 *      var OuterToggle = function() {
 *        this.toggle = function() {
 *          element(by.buttonText('Outer Toggle')).click();
 *        };
 *        this.isOpen = function() {
 *          return element.all(by.binding('outerToggle.isOpen()')).first().getText();
 *        };
 *      };
 *      var NgRepeatToggle = function(i) {
 *        var parent = element.all(by.repeater('(index, value) in [1,2,3]')).get(i - 1);
 *        this.toggle = function() {
 *          element(by.buttonText('ngRepeat Toggle ' + i)).click();
 *        };
 *        this.isOpen = function() {
 *          return parent.element(by.binding('ngRepeatToggle.isOpen() | json')).getText();
 *        };
 *        this.isOuterOpen = function() {
 *          return parent.element(by.binding('outerToggle.isOpen() | json')).getText();
 *        };
 *      };
 *      var NgRepeatToggles = function() {
 *        var toggles = [1,2,3].map(function(i) { return new NgRepeatToggle(i); });
 *        this.forEach = function(fn) {
 *          toggles.forEach(fn);
 *        };
 *        this.isOuterOpen = function(i) {
 *          return toggles[i - 1].isOuterOpen();
 *        };
 *      };
 *      var NgIfToggle = function() {
 *        var parent = element(by.css('[ng-if]'));
 *        this.toggle = function() {
 *          element(by.buttonText('ngIf Toggle')).click();
 *        };
 *        this.isOpen = function() {
 *          return by.binding('ngIfToggle.isOpen() | json').getText();
 *        };
 *        this.isOuterOpen = function() {
 *          return parent.element(by.binding('outerToggle.isOpen() | json')).getText();
 *        };
 *      };
 *
 *      it('should toggle the outer toggle', function() {
 *        var outerToggle = new OuterToggle();
 *        expect(outerToggle.isOpen()).toEqual('outerToggle.isOpen(): false');
 *        outerToggle.toggle();
 *        expect(outerToggle.isOpen()).toEqual('outerToggle.isOpen(): true');
 *      });
 *
 *      it('should toggle all outer toggles', function() {
 *        var outerToggle = new OuterToggle();
 *        var repeatToggles = new NgRepeatToggles();
 *        var ifToggle = new NgIfToggle();
 *        expect(outerToggle.isOpen()).toEqual('outerToggle.isOpen(): false');
 *        expect(repeatToggles.isOuterOpen(1)).toEqual('outerToggle.isOpen(): false');
 *        expect(repeatToggles.isOuterOpen(2)).toEqual('outerToggle.isOpen(): false');
 *        expect(repeatToggles.isOuterOpen(3)).toEqual('outerToggle.isOpen(): false');
 *        expect(ifToggle.isOuterOpen()).toEqual('outerToggle.isOpen(): false');
 *        outerToggle.toggle();
 *        expect(outerToggle.isOpen()).toEqual('outerToggle.isOpen(): true');
 *        expect(repeatToggles.isOuterOpen(1)).toEqual('outerToggle.isOpen(): true');
 *        expect(repeatToggles.isOuterOpen(2)).toEqual('outerToggle.isOpen(): true');
 *        expect(repeatToggles.isOuterOpen(3)).toEqual('outerToggle.isOpen(): true');
 *        expect(ifToggle.isOuterOpen()).toEqual('outerToggle.isOpen(): true');
 *      });
 *
 *      it('should toggle each repeat iteration separately', function() {
 *        var repeatToggles = new NgRepeatToggles();
 *
 *        repeatToggles.forEach(function(repeatToggle) {
 *          expect(repeatToggle.isOpen()).toEqual('ngRepeatToggle.isOpen(): false');
 *          expect(repeatToggle.isOuterOpen()).toEqual('outerToggle.isOpen(): false');
 *          repeatToggle.toggle();
 *          expect(repeatToggle.isOpen()).toEqual('ngRepeatToggle.isOpen(): true');
 *          expect(repeatToggle.isOuterOpen()).toEqual('outerToggle.isOpen(): false');
 *        });
 *      });
 *   </file>
 * </example>
 *
 */

var ngRefMinErr = minErr('ngRef');

var ngRefDirective = ['$parse', function($parse) {
  return {
    priority: -1, // Needed for compatibility with element transclusion on the same element
    restrict: 'A',
    compile: function(tElement, tAttrs) {
      // Get the expected controller name, converts <data-some-thing> into "someThing"
      var controllerName = directiveNormalize(nodeName_(tElement));

      // Get the expression for value binding
      var getter = $parse(tAttrs.ngRef);
      var setter = getter.assign || function() {
        throw ngRefMinErr('nonassign', 'Expression in ngRef="{0}" is non-assignable!', tAttrs.ngRef);
      };

      return function(scope, element, attrs) {
        var refValue;

        if (attrs.hasOwnProperty('ngRefRead')) {
          if (attrs.ngRefRead === '$element') {
            refValue = element;
          } else {
            refValue = element.data('$' + attrs.ngRefRead + 'Controller');

            if (!refValue) {
              throw ngRefMinErr(
                'noctrl',
                'The controller for ngRefRead="{0}" could not be found on ngRef="{1}"',
                attrs.ngRefRead,
                tAttrs.ngRef
              );
            }
          }
        } else {
          refValue = element.data('$' + controllerName + 'Controller');
        }

        refValue = refValue || element;

        setter(scope, refValue);

        // when the element is removed, remove it (nullify it)
        element.on('$destroy', function() {
          // only remove it if value has not changed,
          // because animations (and other procedures) may duplicate elements
          if (getter(scope) === refValue) {
            setter(scope, null);
          }
        });
      };
    }
  };
}];
