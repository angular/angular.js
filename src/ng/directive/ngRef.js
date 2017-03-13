'use strict';

/**
 * @ngdoc directive
 * @name ngRef
 * @restrict A
 *
 * @description
 * The `ngRef` attribute tells AngularJS to assign the element component controller
 * to the given property in the current scope.
 *
 * If the component is destroyed `null` is assigned to the property.
 *
 *
 * @element ANY
 * @param {string} ngRef property name - this must be a valid AngularJS expression identifier
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
 *     angular.module('myApp', []);
 *   </file>
 *   <file name="toggle.js">
 *     function ToggleController() {
 *       var opened = false;
 *       this.isOpen = function() { return opened; };
 *       this.toggle = function() { opened = !opened; };
 *     }
 *
 *     angular.module('myApp').component('myToggle', {
 *       controller: ToggleController
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
 * This example shows how new scopes limits
 * <example name="ng-ref-scopes" module="myApp">
 *   <file name="index.html">
 *     <h3>Outer Toggle</h3>
 *     <my-toggle ng-ref="outerToggle">Outer Toggle</my-toggle>
 *     <div>outerToggle.isOpen(): {{outerToggle.isOpen() | json}}</div>
 *
 *     <h3>ngRepeat toggle</h3>
 *     <ul>
 *     <li ng-repeat="i in [1,2,3]">
 *        <my-toggle ng-ref="ngRepeatToggle">ngRepeat Toggle {{i}}</my-toggle>
 *        <div>ngRepeatToggle.isOpen(): {{ngRepeatToggle.isOpen() | json}}</div>
 *        <div>outerToggle.isOpen(): {{outerToggle.isOpen() | json}}</div>
 *     </li>
 *     </ul>
 *     <div>ngRepeat.isOpen(): {{ngRepeatToggle.isOpen() | json}}</div>
 *
 *     <h3>ngIf toggle</h3>
 *     <div ng-if="true">
 *        <my-toggle ng-ref="ngIfToggle">ngIf Toggle</my-toggle>
 *        <div>ngIfToggle.isOpen(): {{ngIfToggle.isOpen() | json}}</div>
 *        <div>outerToggle.isOpen(): {{outerToggle.isOpen() | json}}</div>
 *     </div>
 *     <div>ngIf.isOpen(): {{ngIf.isOpen() | json}}</div>
 *   </file>
 *   <file name="index.js">
 *     angular.module('myApp', []);
 *   </file>
 *   <file name="toggle.js">
 *     function ToggleController() {
 *       var opened = false;
 *       this.isOpen = function() { return opened; };
 *       this.toggle = function() { opened = !opened; };
 *     }
 *
 *     angular.module('myApp').component('myToggle', {
 *       template: '<button ng-click="$ctrl.toggle()" ng-transclude></button>',
 *       transclude: true,
 *       controller: ToggleController
 *     });
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
 *        var parent = element.all(by.repeater('i in [1,2,3]')).get(i - 1);
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
var ngRefDirective = function() {
  var ngRefMinErr = minErr('ngRef');

  return {
    priority: -1,
    restrict: 'A',
    compile: function(tElement, tAttrs) {
      // gets the expected controller name, converts <data-some-thing> into "someThing"
      var controllerName = directiveNormalize(nodeName_(tElement));

      // get the symbol name where to set the reference in the scope
      var symbolName = tAttrs.ngRef;

      if (symbolName && (!/^[$a-zA-Z_][$a-zA-Z0-9_]*$/.test(symbolName) ||
          /^(null|undefined|this|\$parent|\$root|\$id)$/.test(symbolName))) {
        throw ngRefMinErr('badident', 'alias \'{0}\' is invalid --- must be a valid JS identifier which is not a reserved name.',
          symbolName);
      }

      return function(scope, element) {
        // gets the controller of the current component or the current DOM element
        var controller = element.data('$' + controllerName + 'Controller');
        var value = controller || element[0];
        scope[symbolName] = value;

        // when the element is removed, remove it from the scope assignment (nullify it)
        element.on('$destroy', function() {
          // only remove it if value has not changed,
          // carefully because animations (and other procedures) may duplicate elements
          if (scope[symbolName] === value) {
            scope[symbolName] = null;
          }
        });
      };
    }
  };
};
