'use strict';

/**
 * @ngdoc directive
 * @name ng.directive:ngSwitch
 * @restrict EA
 *
 * @description
 * The ngSwitch directive is used to conditionally swap DOM structure on your template based on a scope expression.
 * The directive itself works similar to ngInclude,
 * however, instead of downloading template code (or loading it from the cache), ngSwitch simply choses one of the
 * nested elements and makes it visible based on which element matches the value obtained from the evaluated expression.
 * In other words, you define a container element (where you place the directive), place an expression on the <strong>on="..." attribute</strong>
 * (or the <strong>ng-switch="..." attribute</strong>), define any inner elements inside of the directive and place a when attribute per element.
 * The when attribute is used to inform ngSwitch which element to display when the on expression is evaluated. If an expression is not found via a when
 * attribute then an element with the default attribute is displayed.
 *
 * The ngSwitch directive also works with ngAnimate allowing custom animations to hooked into the <strong>enter</strong> and <strong>leave</strong>
 * animation events. 
 *
 * @usageContent
 * <ANY ng-switch-when="matchValue1">...</ANY>
 *   <ANY ng-switch-when="matchValue2">...</ANY>
 *   <ANY ng-switch-default>...</ANY>
 *
 * @scope
 * @param {*} ngSwitch|on expression to match against <tt>ng-switch-when</tt>.
 * @paramDescription
 * On child elements add:
 *
 * * `ngSwitchWhen`: the case statement to match against. If match then this
 *   case will be displayed.
 * * `ngSwitchDefault`: the default case when no other casses match.
 *
 * @example
    <doc:example>
      <doc:source>
        <script>
          function Ctrl($scope) {
            $scope.items = ['settings', 'home', 'other'];
            $scope.selection = $scope.items[0];
          }
        </script>
        <div ng-controller="Ctrl">
          <select ng-model="selection" ng-options="item for item in items">
          </select>
          <tt>selection={{selection}}</tt>
          <hr/>
          <div ng-switch on="selection" >
            <div ng-switch-when="settings">Settings Div</div>
            <span ng-switch-when="home">Home Span</span>
            <span ng-switch-default>default</span>
          </div>
        </div>
      </doc:source>
      <doc:scenario>
        it('should start in settings', function() {
         expect(element('.doc-example-live [ng-switch]').text()).toMatch(/Settings Div/);
        });
        it('should change to home', function() {
         select('selection').option('home');
         expect(element('.doc-example-live [ng-switch]').text()).toMatch(/Home Span/);
        });
        it('should select deafault', function() {
         select('selection').option('other');
         expect(element('.doc-example-live [ng-switch]').text()).toMatch(/default/);
        });
      </doc:scenario>
    </doc:example>
 */
var NG_SWITCH = 'ng-switch';
var ngSwitchDirective = ['$defaultAnimator', function($defaultAnimator) {
  return {
    restrict: 'EA',
    require: ['ngSwitch','?ngAnimate'],
    controller: function ngSwitchController() {
      this.cases = {};
    },
    link: function(scope, element, attr, controllers) {
      var ctrl      = controllers[0];
      var animator  = controllers[1] || $defaultAnimator;
      var watchExpr = attr.ngSwitch || attr.on,
          selectedTransclude,
          selectedElement,
          selectedScope;

      scope.$watch(watchExpr, function ngSwitchWatchAction(value) {
        if (selectedElement) {
          selectedScope.$destroy();
          animator.animate('leave', selectedElement, element);
          selectedElement = selectedScope = null;
        }
        if ((selectedTransclude = ctrl.cases['!' + value] || ctrl.cases['?'])) {
          scope.$eval(attr.change);
          selectedScope = scope.$new();
          selectedTransclude(selectedScope, function(caseElement) {
            selectedElement = caseElement;
            animator.animate('enter', caseElement, element);
          });
        }
      });
    }
  };
}];

var ngSwitchWhenDirective = ngDirective({
  transclude: 'element',
  priority: 500,
  require: '^ngSwitch',
  compile: function(element, attrs, transclude) {
    return function(scope, element, attr, ctrl) {
      ctrl.cases['!' + attrs.ngSwitchWhen] = transclude;
    };
  }
});

var ngSwitchDefaultDirective = ngDirective({
  transclude: 'element',
  priority: 500,
  require: '^ngSwitch',
  compile: function(element, attrs, transclude) {
    return function(scope, element, attr, ctrl) {
      ctrl.cases['?'] = transclude;
    };
  }
});
