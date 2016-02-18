'use strict';

/**
 * @ngdoc directive
 * @name ngAs
 * @restrict A
 *
 * @description
 * The `ngAs` attribute tells Angular to assign element component controller
 * to a given property.
 *
 * Using this directive you can use the controller of existing components
 * in your template (children components).
 *
 * If the children component is destroyed
 * a `null` is assigned to the property.
 *
 * Note that this is the reverse of `require:`:
 * with `require:` is the children who references the parent
 * but with `ngAs`is the parent who references the children.
 * It is very useful when you want to reuse the same component
 * in different situations,
 * and they do not need to know which exact parent they have.
 *
 *
 * @element ANY
 * @param {expression} ngAs {@link guide/expression Expression} to assign the controller.
 *
 *
 * @example
 * ### Use inside the scope
 * This example shows how the controller of the component toggle
 * is reused in the template through the scope to use its logic.
 * <example name="ngAsDirectiveComponentExample" module="ngAsExample">
 *   <file name="index.html">
 *     <toggle ng-as="myToggle"></toggle>
 *     <button ng-click="myToggle.toggle()">Toggle</button>
 *     <div ng-show="myToggle.isOpen()">You are using a children component to show it.</div>
 *   </file>
 *   <file name="script.js">
 *     angular.module('ngAsExample', [])
 *      .component('toggle', {
 *         controller: function() {
 *           var opened = false;
 *           this.isOpen = function() { return opened; };
 *           this.toggle = function() { opened = !opened; };
 *         }
 *       });
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
 * ### Parent interacts with child via member
 * This example shows how the parent controller can have access
 * to children component controllers.
 * <example name="ngAsDirectiveComponentCounterExample" module="ngAsVoteExample">
 *   <file name="index.html">
 *    <competition></competition>
 *   </file>
 *   <file name="script.js">
 *     angular.module('ngAsVoteExample', [])
 *      .component('voteTaker', {
 *         controller: function() {
 *           this.vote = null;
 *           this.agree = function() { this.vote = 'agree'; };
 *           this.disagree = function() { this.vote = 'disagree'; };
 *           this.clear = function() { this.vote = null; };
 *         },
 *         template:
 *           '<button ng-disabled="$ctrl.vote" ng-click="$ctrl.agree()">Agree</button>' +
 *           '<button ng-disabled="$ctrl.vote" ng-click="$ctrl.disagree()">Disagree</button>'
 *       })
 *       .component('competition', {
 *          controller: function() {
 *            this.redVoteTaker = null;
 *            this.blueVoteTaker = null;
 *            this.match = function() {
 *              return this.redVoteTaker.vote === this.blueVoteTaker.vote && this.redVoteTaker.vote;
 *            };
 *            this.next = function() {
 *              this.sentence++;
 *              this.redVoteTaker.clear();
 *              this.blueVoteTaker.clear();
 *            };
 *          },
 *          template:
 *            '<p>Red team: <vote-taker ng-as="$ctrl.redVoteTaker"></vote-taker></p>' +
 *            '<p>Blue team: <vote-taker ng-as="$ctrl.blueVoteTaker"></vote-taker></p>' +
 *            '<p ng-show="$ctrl.match()">There is a match!</p>' +
 *            '<button ng-click="$ctrl.next()">Next</button>'
 *       });
 *   </file>
 *   <file name="protractor.js" type="protractor">
 *      var agrees = element.all(by.buttonText('Agree'));
 *      var matchMessage = element(by.css('[ng-show]'));
 *      var next = element(by.buttonText('Next'));
 *
 *      it('should show match message if both agree', function() {
 *        expect(matchMessage.isDisplayed()).toBeFalsy();
 *        agrees.click();
 *        expect(matchMessage.isDisplayed()).toBeTruthy();
 *      });
 *
 *      it('should hide match message after next is clicked', function() {
 *        agrees.click();
 *        next.click();
 *        expect(matchMessage.isDisplayed()).toBeFalsy();
 *      });
 *   </file>
 * </example>
 */
var ngAsDirective = ['$parse', function($parse) {
  return {
    priority: -1,
    restrict: 'A',
    compile: function(tElement, tAttrs) {
      // gets the expected controller name, converts <data-some-thing> into "someThing"
      var controllerName = directiveNormalize(nodeName_(tElement));

      // get the setter for the as attribute
      var getter = $parse(tAttrs.ngAs);
      var setter = getter.assign;

      return function(scope, element) {
        // gets the controller of the current element (see jqLiteController for details)
        var controller = element.data('$' + controllerName + 'Controller');
        setter(scope, controller);

        // when the element is removed, remove it from the scope assignment (nullify it)
        element.on('$destroy', function() {
          // only remove it if controller has not changed,
          // because it can happen that animations (and other procedures) may duplicate elements
          if (getter(scope) === controller) {
            setter(scope, null);
          }
        });
      };
    }
  };
}];
