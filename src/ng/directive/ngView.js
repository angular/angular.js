'use strict';

/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.ng-view
 * @restrict ECA
 *
 * @description
 * # Overview
 * `ng-view` is a directive that complements the {@link angular.module.ng.$route $route} service by
 * including the rendered template of the current route into the main layout (`index.html`) file.
 * Every time the current route changes, the included view changes with it according to the
 * configuration of the `$route` service.
 *
 * @scope
 * @example
    <doc:example module="ngView">
      <doc:source>
        <script type="text/ng-template" id="examples/book.html">
          controller: {{name}}<br />
          Book Id: {{params.bookId}}<br />
        </script>

        <script type="text/ng-template" id="examples/chapter.html">
          controller: {{name}}<br />
          Book Id: {{params.bookId}}<br />
          Chapter Id: {{params.chapterId}}
        </script>

        <script>
          angular.module('ngView', [], function($routeProvider, $locationProvider) {
            $routeProvider.when('/Book/:bookId', {
              template: 'examples/book.html',
              controller: BookCntl
            });
            $routeProvider.when('/Book/:bookId/ch/:chapterId', {
              template: 'examples/chapter.html',
              controller: ChapterCntl
            });

            // configure html5 to get links working on jsfiddle
            $locationProvider.html5Mode(true);
          });

          function MainCntl($scope, $route, $routeParams, $location) {
            $scope.$route = $route;
            $scope.$location = $location;
            $scope.$routeParams = $routeParams;
          }

          function BookCntl($scope, $routeParams) {
            $scope.name = "BookCntl";
            $scope.params = $routeParams;
          }

          function ChapterCntl($scope, $routeParams) {
            $scope.name = "ChapterCntl";
            $scope.params = $routeParams;
          }
        </script>

        <div ng-controller="MainCntl">
          Choose:
          <a href="/Book/Moby">Moby</a> |
          <a href="/Book/Moby/ch/1">Moby: Ch1</a> |
          <a href="/Book/Gatsby">Gatsby</a> |
          <a href="/Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
          <a href="/Book/Scarlet">Scarlet Letter</a><br/>

          <div ng-view></div>
          <hr />

          <pre>$location.path() = {{$location.path()}}</pre>
          <pre>$route.current.template = {{$route.current.template}}</pre>
          <pre>$route.current.params = {{$route.current.params}}</pre>
          <pre>$route.current.scope.name = {{$route.current.scope.name}}</pre>
          <pre>$routeParams = {{$routeParams}}</pre>
        </div>
      </doc:source>
      <doc:scenario>
        it('should load and compile correct template', function() {
          element('a:contains("Moby: Ch1")').click();
          var content = element('.doc-example-live [ng-view]').text();
          expect(content).toMatch(/controller\: ChapterCntl/);
          expect(content).toMatch(/Book Id\: Moby/);
          expect(content).toMatch(/Chapter Id\: 1/);

          element('a:contains("Scarlet")').click();
          content = element('.doc-example-live [ng-view]').text();
          expect(content).toMatch(/controller\: BookCntl/);
          expect(content).toMatch(/Book Id\: Scarlet/);
        });
      </doc:scenario>
    </doc:example>
 */


/**
 * @ngdoc event
 * @name angular.module.ng.$compileProvider.directive.ng-view#$viewContentLoaded
 * @eventOf angular.module.ng.$compileProvider.directive.ng-view
 * @eventType emit on the current ng-view scope
 * @description
 * Emitted every time the ng-view content is reloaded.
 */
var ngViewDirective = ['$http', '$templateCache', '$route', '$anchorScroll', '$compile',
                       '$controller',
               function($http,   $templateCache,   $route,   $anchorScroll,   $compile,
                        $controller) {
  return {
    restrict: 'ECA',
    terminal: true,
    link: function(scope, element, attr) {
      var changeCounter = 0,
          lastScope,
          onloadExp = attr.onload || '';

      scope.$on('$afterRouteChange', update);
      update();


      function destroyLastScope() {
        if (lastScope) {
          lastScope.$destroy();
          lastScope = null;
        }
      }

      function update() {
        var template = $route.current && $route.current.template,
            thisChangeId = ++changeCounter;

        function clearContent() {
          // ignore callback if another route change occured since
          if (thisChangeId === changeCounter) {
            element.html('');
            destroyLastScope();
          }
        }

        if (template) {
          $http.get(template, {cache: $templateCache}).success(function(response) {
            // ignore callback if another route change occured since
            if (thisChangeId === changeCounter) {
              element.html(response);
              destroyLastScope();

              var link = $compile(element.contents()),
                  current = $route.current,
                  controller;

              lastScope = current.scope = scope.$new();
              if (current.controller) {
                controller = $controller(current.controller, {$scope: lastScope});
                element.contents().data('$ngControllerController', controller);
              }

              link(lastScope);
              lastScope.$emit('$viewContentLoaded');
              lastScope.$eval(onloadExp);

              // $anchorScroll might listen on event...
              $anchorScroll();
            }
          }).error(clearContent);
        } else {
          clearContent();
        }
      }
    }
  };
}];
