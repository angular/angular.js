'use strict';

/**
 * @ngdoc directive
 * @name ngSwitch
 * @restrict EA
 *
 * @description
 * The `ngSwitch` directive is used to conditionally swap DOM structure on your template based on a scope expression.
 * Elements within `ngSwitch` but without `ngSwitchWhen` or `ngSwitchDefault` directives will be preserved at the location
 * as specified in the template.
 *
 * The directive itself works similar to ngInclude, however, instead of downloading template code (or loading it
 * from the template cache), `ngSwitch` simply chooses one of the nested elements and makes it visible based on which element
 * matches the value obtained from the evaluated expression. In other words, you define a container element
 * (where you place the directive), place an expression on the **`on="..."` attribute**
 * (or the **`ng-switch="..."` attribute**), define any inner elements inside of the directive and place
 * a when attribute per element. The when attribute is used to inform ngSwitch which element to display when the on
 * expression is evaluated. If a matching expression is not found via a when attribute then an element with the default
 * attribute is displayed.
 *
 * <div class="alert alert-info">
 * Be aware that the attribute values to match against cannot be expressions. They are interpreted
 * as literal string values to match against.
 * For example, **`ng-switch-when="someVal"`** will match against the string `"someVal"` not against the
 * value of the expression `$scope.someVal`.
 * </div>

 * @animations
 * | Animation                        | Occurs                              |
 * |----------------------------------|-------------------------------------|
 * | {@link ng.$animate#enter enter}  | after the ngSwitch contents change and the matched child element is placed inside the container |
 * | {@link ng.$animate#leave leave}  | after the ngSwitch contents change and just before the former contents are removed from the DOM |
 *
 * @usage
 *
 * ```
 * <ANY ng-switch="expression">
 *   <ANY ng-switch-when="matchValue1">...</ANY>
 *   <ANY ng-switch-when="matchValue2">...</ANY>
 *   <ANY ng-switch-default>...</ANY>
 * </ANY>
 * ```
 *
 *
 * @scope
 * @priority 1200
 * @param {*} ngSwitch|on expression to match against <code>ng-switch-when</code>.
 * On child elements add:
 *
 * * `ngSwitchWhen`: the case statement to match against. If match then this
 *   case will be displayed. If the same match appears multiple times, all the
 *   elements will be displayed. It is possible to associate multiple values to
 *   the same `ngSwitchWhen` by defining the optional attribute
 *   `ngSwitchWhenSeparator`. The separator will be used to split the value of
 *   the `ngSwitchWhen` attribute into multiple tokens, and the element will show
 *   if any of the `ngSwitch` evaluates to any of these tokens.
 * * `ngSwitchDefault`: the default case when no other case match. If there
 *   are multiple default cases, all of them will be displayed when no other
 *   case match.
 *
 *
 * @example
  <example module="switchExample" deps="angular-animate.js" animations="true" name="ng-switch">
    <file name="index.html">
      <div ng-controller="ExampleController">
        <select ng-model="selection" ng-options="item for item in items">
        </select>
        <code>selection={{selection}}</code>
        <hr/>
        <div class="animate-switch-container"
          ng-switch on="selection">
            <div class="animate-switch" ng-switch-when="settings|options" ng-switch-when-separator="|">Settings Div</div>
            <div class="animate-switch" ng-switch-when="home">Home Span</div>
            <div class="animate-switch" ng-switch-default>default</div>
        </div>
      </div>
    </file>
    <file name="script.js">
      angular.module('switchExample', ['ngAnimate'])
        .controller('ExampleController', ['$scope', function($scope) {
          $scope.items = ['settings', 'home', 'options', 'other'];
          $scope.selection = $scope.items[0];
        }]);
    </file>
    <file name="animations.css">
      .animate-switch-container {
        position:relative;
        background:white;
        border:1px solid black;
        height:40px;
        overflow:hidden;
      }

      .animate-switch {
        padding:10px;
      }

      .animate-switch.ng-animate {
        transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;

        position:absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
      }

      .animate-switch.ng-leave.ng-leave-active,
      .animate-switch.ng-enter {
        top:-50px;
      }
      .animate-switch.ng-leave,
      .animate-switch.ng-enter.ng-enter-active {
        top:0;
      }
    </file>
    <file name="protractor.js" type="protractor">
      var switchElem = element(by.css('[ng-switch]'));
      var select = element(by.model('selection'));

      it('should start in settings', function() {
        expect(switchElem.getText()).toMatch(/Settings Div/);
      });
      it('should change to home', function() {
        select.all(by.css('option')).get(1).click();
        expect(switchElem.getText()).toMatch(/Home Span/);
      });
      it('should change to settings via "options"', function() {
        select.all(by.css('option')).get(2).click();
        expect(switchElem.getText()).toMatch(/Settings Div/);
      });
      it('should select default', function() {
        select.all(by.css('option')).get(3).click();
        expect(switchElem.getText()).toMatch(/default/);
      });
    </file>
  </example>
 */
var ngSwitchDirective = ['$animate', '$compile', function($animate, $compile) {
  return {
    require: 'ngSwitch',

    // asks for $scope to fool the BC controller module
    controller: ['$scope', function NgSwitchController() {
     this.cases = {};
    }],
    link: function(scope, element, attr, ngSwitchController) {
      var watchExpr = attr.ngSwitch || attr.on,
          selectedTranscludes = [],
          selectedElements = [],
          previousLeaveAnimations = [],
          selectedScopes = [];

      var spliceFactory = function(array, index) {
          return function(response) {
            if (response !== false) array.splice(index, 1);
          };
      };

      scope.$watch(watchExpr, function ngSwitchWatchAction(value) {
        var i, ii;

        // Start with the last, in case the array is modified during the loop
        while (previousLeaveAnimations.length) {
          $animate.cancel(previousLeaveAnimations.pop());
        }

        for (i = 0, ii = selectedScopes.length; i < ii; ++i) {
          var selected = getBlockNodes(selectedElements[i].clone);
          selectedScopes[i].$destroy();
          var runner = previousLeaveAnimations[i] = $animate.leave(selected);
          runner.done(spliceFactory(previousLeaveAnimations, i));
        }

        selectedElements.length = 0;
        selectedScopes.length = 0;

        if ((selectedTranscludes = ngSwitchController.cases['!' + value] || ngSwitchController.cases['?'])) {
          forEach(selectedTranscludes, function(selectedTransclude) {
            selectedTransclude.transclude(function(caseElement, selectedScope) {
              selectedScopes.push(selectedScope);
              var anchor = selectedTransclude.element;
              caseElement[caseElement.length++] = $compile.$$createComment('end ngSwitchWhen');
              var block = { clone: caseElement };

              selectedElements.push(block);
              $animate.enter(caseElement, anchor.parent(), anchor);
            });
          });
        }
      });
    }
  };
}];

var ngSwitchWhenDirective = ngDirective({
  transclude: 'element',
  priority: 1200,
  require: '^ngSwitch',
  multiElement: true,
  link: function(scope, element, attrs, ctrl, $transclude) {

    var cases = attrs.ngSwitchWhen.split(attrs.ngSwitchWhenSeparator).sort().filter(
      // Filter duplicate cases
      function(element, index, array) { return array[index - 1] !== element; }
    );

    forEach(cases, function(whenCase) {
      ctrl.cases['!' + whenCase] = (ctrl.cases['!' + whenCase] || []);
      ctrl.cases['!' + whenCase].push({ transclude: $transclude, element: element });
    });
  }
});

var ngSwitchDefaultDirective = ngDirective({
  transclude: 'element',
  priority: 1200,
  require: '^ngSwitch',
  multiElement: true,
  link: function(scope, element, attr, ctrl, $transclude) {
    ctrl.cases['?'] = (ctrl.cases['?'] || []);
    ctrl.cases['?'].push({ transclude: $transclude, element: element });
   }
});
