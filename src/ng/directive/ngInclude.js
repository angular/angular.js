'use strict';

/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.ng-include
 * @restrict EA
 *
 * @description
 * Fetches, compiles and includes an external HTML fragment.
 *
 * Keep in mind that Same Origin Policy applies to included resources
 * (e.g. ng-include won't work for file:// access).
 *
 * @scope
 *
 * @param {string} ng-include|src angular expression evaluating to URL. If the source is a string constant,
 *                 make sure you wrap it in quotes, e.g. `src="'myPartialTemplate.html'"`.
 * @param {string=} onload Expression to evaluate when a new partial is loaded.
 *
 * @param {string=} autoscroll Whether `ng-include` should call {@link angular.module.ng.$anchorScroll
 *                  $anchorScroll} to scroll the viewport after the content is loaded.
 *
 *                  - If the attribute is not set, disable scrolling.
 *                  - If the attribute is set without value, enable scrolling.
 *                  - Otherwise enable scrolling only if the expression evaluates to truthy value.
 *
 * @example
    <doc:example>
      <doc:source jsfiddle="false">
       <script>
         function Ctrl($scope) {
           $scope.templates =
             [ { name: 'template1.html', url: 'examples/ng-include/template1.html'}
             , { name: 'template2.html', url: 'examples/ng-include/template2.html'} ];
           $scope.template = $scope.templates[0];
         }
       </script>
       <div ng-controller="Ctrl">
         <select ng-model="template" ng-options="t.name for t in templates">
          <option value="">(blank)</option>
         </select>
         url of the template: <tt><a href="{{template.url}}">{{template.url}}</a></tt>
         <hr/>
         <div ng-include src="template.url"></div>
       </div>
      </doc:source>
      <doc:scenario>
        it('should load template1.html', function() {
         expect(element('.doc-example-live [ng-include]').text()).
           toBe('Content of template1.html\n');
        });
        it('should load template2.html', function() {
         select('template').option('1');
         expect(element('.doc-example-live [ng-include]').text()).
           toBe('Content of template2.html\n');
        });
        it('should change to blank', function() {
         select('template').option('');
         expect(element('.doc-example-live [ng-include]').text()).toEqual('');
        });
      </doc:scenario>
    </doc:example>
 */


/**
 * @ngdoc event
 * @name angular.module.ng.$compileProvider.directive.ng-include#$includeContentLoaded
 * @eventOf angular.module.ng.$compileProvider.directive.ng-include
 * @eventType emit on the current ng-include scope
 * @description
 * Emitted every time the ng-include content is reloaded.
 */
var ngIncludeDirective = ['$http', '$templateCache', '$anchorScroll', '$compile',
                  function($http,   $templateCache,   $anchorScroll,   $compile) {
  return {
    restrict: 'EA',
    compile: function(element, attr) {
      var srcExp = attr.ngInclude || attr.src,
          onloadExp = attr.onload || '',
          autoScrollExp = attr.autoscroll;

      return function(scope, element, attr) {
        var changeCounter = 0,
            childScope;

        var clearContent = function() {
          if (childScope) {
            childScope.$destroy();
            childScope = null;
          }

          element.html('');
        };

        scope.$watch(srcExp, function(src) {
          var thisChangeId = ++changeCounter;

          if (src) {
            $http.get(src, {cache: $templateCache}).success(function(response) {
              if (thisChangeId !== changeCounter) return;

              if (childScope) childScope.$destroy();
              childScope = scope.$new();

              element.html(response);
              $compile(element.contents())(childScope);

              if (isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                $anchorScroll();
              }

              childScope.$emit('$includeContentLoaded');
              scope.$eval(onloadExp);
            }).error(function() {
              if (thisChangeId === changeCounter) clearContent();
            });
          } else clearContent();
        });
      };
    }
  };
}];
