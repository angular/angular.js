'use strict';

/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.ng:include
 * @restrict EA
 *
 * @description
 * Fetches, compiles and includes an external HTML fragment.
 *
 * Keep in mind that Same Origin Policy applies to included resources
 * (e.g. ng:include won't work for file:// access).
 *
 * @scope
 *
 * @param {string} src angular expression evaluating to URL. If the source is a string constant,
 *                 make sure you wrap it in quotes, e.g. `src="'myPartialTemplate.html'"`.
 * @param {Scope=} [scope=new_child_scope] optional expression which evaluates to an
 *                 instance of angular.module.ng.$rootScope.Scope to set the HTML fragment to.
 * @param {string=} onload Expression to evaluate when a new partial is loaded.
 *
 * @param {string=} autoscroll Whether `ng:include` should call {@link angular.module.ng.$anchorScroll
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
       <div ng:controller="Ctrl">
         <select ng:model="template" ng:options="t.name for t in templates">
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
var ngIncludeDirective = ['$http', '$templateCache', '$anchorScroll', '$compile',
                  function($http,   $templateCache,   $anchorScroll,   $compile) {
  return {
    restrict: 'EA',
    compile: function(element, attr) {
      var srcExp = attr.src,
          scopeExp = attr.scope || '',
          autoScrollExp = attr.autoscroll;

      return function(scope, element, attr) {
        var changeCounter = 0,
            childScope;

        function incrementChange() { changeCounter++;}
        scope.$watch(srcExp, incrementChange);
        scope.$watch(function() {
          var includeScope = scope.$eval(scopeExp);
          if (includeScope) return includeScope.$id;
        }, incrementChange);
        scope.$watch(function() {return changeCounter;}, function(newChangeCounter) {
           var src = scope.$eval(srcExp),
               useScope = scope.$eval(scopeExp);

          function clearContent() {
            // if this callback is still desired
            if (newChangeCounter === changeCounter) {
              if (childScope) childScope.$destroy();
              childScope = null;
              element.html('');
            }
          }

           if (src) {
             $http.get(src, {cache: $templateCache}).success(function(response) {
               // if this callback is still desired
               if (newChangeCounter === changeCounter) {
                 element.html(response);
                 if (childScope) childScope.$destroy();
                 childScope = useScope ? useScope : scope.$new();
                 $compile(element.contents())(childScope);
                 if (isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                   $anchorScroll();
                 }
                 scope.$emit('$contentLoaded');
               }
             }).error(clearContent);
           } else {
             clearContent();
           }
        });
      };
    }
  }
}];
