'use strict';

/**
 * @ngdoc directive
 * @name ngAs
 * @restrict A
 *
 * @description
 * The `ngAs` attribute tells Angular to assign the element component controller
 * to the given property.
 *
 * Using this directive you can use the controller of existing components
 * in your template (children components).
 *
 * If the component is destroyed `null` is assigned to the property.
 *
 * Note that this is the reverse of `require`:
 * * with `require` a component can access to the controllers
 * of parent directives or directives in the same element,
 * directives outside the component `template:` or `templateUrl`
 * * with `ngAs`: a component can access to the controllers
 * of components inside its `template` or `templateUrl`
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
 * <example name="ng-as-component" module="myApp">
 *   <file name="index.html">
 *     <my-toggle ng-as="myToggle"></my-toggle>
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
 * ### Parent interacts with child via member
 * This example shows how the parent controller can have access
 * to children component controllers.
 * <example name="ng-as-contest" module="myApp">
 *   <file name="index.js">
 *     angular.module('myApp', []);
 *   </file>
 *   <file name="contest.js">
 *     function ContestController() {
 *       var results = ['y','n','y','y'];
 *
 *       this.$onInit = function() {
 *         this.restart();
 *       };
 *
 *       this.hasQuestion = function() {
 *         return this.currentQuestion <= results.length;
 *       };
 *
 *       this.nextQuestion = function() {
 *         var answer = results[this.currentQuestion - 1];
 *         this.currentQuestion = this.currentQuestion + 1;
 *
 *         this.redScore += score(this.redVoteTaker.vote, answer);
 *         this.redVoteTaker.clear();
 *
 *         this.blueScore += score(this.blueVoteTaker.vote, answer);
 *         this.blueVoteTaker.clear();
 *       };
 *
 *       this.restart = function() {
 *         this.currentQuestion = 1;
 *         this.redScore = 0;
 *         this.blueScore = 0;
 *       };
 *
 *       function score(vote, expected) {
 *         if (vote === expected) {
 *           return +1;
 *         } else if (vote === null) {
 *           return 0;
 *         } else {
 *           return -1;
 *         }
 *       }
 *     }
 *
 *     angular.module('myApp').component('myContest', {
 *         controller: ContestController,
 *         templateUrl: 'contest.html'
 *     });
 *   </file>
 *   <file name="contest.html">
 *     <div ng-show="$ctrl.hasQuestion()">
 *       <p>Question {{$ctrl.currentQuestion}}?</p>
 *       <p>Red team: <my-vote-taker ng-as="$ctrl.redVoteTaker"></my-vote-taker></p>
 *       <p>Blue team: <my-vote-taker ng-as="$ctrl.blueVoteTaker"></my-vote-taker></p>
 *       <p><button ng-click="$ctrl.nextQuestion()">Next Question</button></p>
 *     </div>
 *     <div ng-hide="$ctrl.hasQuestion()">
 *       <p>
 *         <strong ng-show="$ctrl.redScore > $ctrl.blueScore">Red Wins!</strong>
 *         <strong ng-show="$ctrl.redScore < $ctrl.blueScore">Blue Wins!</strong>
 *         <strong ng-show="$ctrl.redScore == $ctrl.blueScore">There is a tie!</strong>
 *       </p>
 *       <p>Red score: {{$ctrl.redScore}}</p>
 *       <p>Blue score: {{$ctrl.blueScore}}</p>
 *       <p><button ng-click="$ctrl.restart()">Restart</button></p>
 *     </div>
 *   </file>
 *   <file name="voteTaker.js">
 *     function VoteTakerController() {
 *       this.vote = null;
 *
 *       this.yes = function() {
 *         this.vote = 'y';
 *       };
 *       this.no = function() {
 *         this.vote = 'n';
 *       };
 *       this.clear = function() {
 *         this.vote = null;
 *       };
 *     }
 *
 *     angular.module('myApp').component('myVoteTaker', {
 *         controller: VoteTakerController,
 *         templateUrl: 'voteTaker.html'
 *     });
 *   </file>
 *   <file name="voteTaker.html">
 *     <button ng-disabled="$ctrl.vote" ng-click="$ctrl.yes()">Yes</button>
 *     <button ng-disabled="$ctrl.vote" ng-click="$ctrl.no()">No</button>
 *   </file>
 *   <file name="index.html">
 *     <my-contest></my-contest>
 *   </file>
 *   <file name="protractor.js" type="protractor">
 *      function VoteTaker(team) {
 *        var voteTaker = element(by.css('[ng-as="$ctrl.' + team + 'VoteTaker"]'));
 *        var yes = voteTaker.element(by.buttonText('Yes'));
 *        var no = voteTaker.element(by.buttonText('No'));
 *
 *        this.yes = function() {
 *          yes.click();
 *        };
 *        this.no = function() {
 *          no.click();
 *        };
 *      }
 *
 *      function Contest() {
 *        var redScore = element(by.binding('$ctrl.redScore'));
 *        var blueScore = element(by.binding('$ctrl.blueScore'));
 *        var nextQuestion = element(by.buttonText('Next Question'));
 *
 *        this.redVoteTaker = new VoteTaker('red');
 *        this.blueVoteTaker = new VoteTaker('blue');
 *
 *        this.getRedScore = function() {
 *          return redScore.getText();
 *        };
 *
 *        this.getBlueScore = function() {
 *          return blueScore.getText();
 *        };
 *
 *        this.nextQuestion = function() {
 *          nextQuestion.click();
 *        };
 *      }
 *
 *      it('should compute score red always yes, blue always pass', function() {
 *        var contest = new Contest();
 *        for (var i = 0; i < 4; i++) {
 *          contest.redVoteTaker.yes();
 *          contest.nextQuestion();
 *        }
 *        expect(contest.getRedScore()).toEqual('Red score: 2');
 *        expect(contest.getBlueScore()).toEqual('Blue score: 0');
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
