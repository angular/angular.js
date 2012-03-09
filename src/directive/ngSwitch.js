'use strict';

/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.ng-switch
 * @restrict EA
 *
 * @description
 * Conditionally change the DOM structure.
 *
 * @usageContent
 * <any ng-switch-when="matchValue1">...</any>
 *   <any ng-switch-when="matchValue2">...</any>
 *   ...
 *   <any ng-switch-default>...</any>
 *
 * @scope
 * @param {*} ng-switch|on expression to match against <tt>ng-switch-when</tt>.
 * @paramDescription
 * On child elments add:
 *
 * * `ng-switch-when`: the case statement to match against. If match then this
 *   case will be displayed.
 * * `ng-switch-default`: the default case when no other casses match.
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
var ngSwitchDirective = valueFn({
  restrict: 'EA',
  compile: function(element, attr) {
    var watchExpr = attr.ngSwitch || attr.on,
        cases = {};

    element.data(NG_SWITCH, cases);
    return function(scope, element){
      var selectedTransclude,
          selectedElement;

      scope.$watch(watchExpr, function(value) {
        if (selectedElement) {
          selectedElement.remove();
          selectedElement = null;
        }
        if ((selectedTransclude = cases['!' + value] || cases['?'])) {
          scope.$eval(attr.change);
          selectedTransclude(scope.$new(), function(caseElement, scope) {
            selectedElement = caseElement;
            element.append(caseElement);
            element.bind('$destroy', bind(scope, scope.$destroy));
          });
        }
      });
    };
  }
});

var ngSwitchWhenDirective = ngDirective({
  transclude: 'element',
  priority: 500,
  compile: function(element, attrs, transclude) {
    var cases = element.inheritedData(NG_SWITCH);
    assertArg(cases);
    cases['!' + attrs.ngSwitchWhen] = transclude;
  }
});

var ngSwitchDefaultDirective = ngDirective({
  transclude: 'element',
  priority: 500,
  compile: function(element, attrs, transclude) {
    var cases = element.inheritedData(NG_SWITCH);
    assertArg(cases);
    cases['?'] = transclude;
  }
});
