'use strict';


ngRouteModule.config(['$locationProvider', function ($locationProvider) {
  ngRouteModule.tmpHashPrefix = '#' + $locationProvider.hashPrefix();
}]).

/**
 * @ngdoc directive
 * @name ngGoto
 *
 * @description
 * A more powerful replacement for ngHref when using route names.
 * By defining the alias of a path instead of writing out the full path it is possible to
 * cherry pick individual components of a path without effecting others.
 *
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 *
 * This directive also sets the CSS class `ng-route-active` on elements when the route is
 * active so you can restyle the element if you wish.
 *
 * @element ANY
 * @param {string} ngGoto with the route to navigate to on click (or touch if using ngMobile)
 *
 * @example
    <example module="ngGotoExample" deps="angular-route.js">
      <file name="index.html">
        <a ng-goto="home">Home -> /home</a><br />
        <a ng-goto="many">Many -> /:userId/items</a><br />
        <a ng-goto="single" item-id="item-1234">One -> /:userId/item/:itemId</a><br />
        <span>Route name: {{ $route.current.name }}</span><br />
        <span>User param: {{ $routeParams.userId }}</span><br />
        <span>Item param: {{ $routeParams.itemId }}</span>
      </file>
      <file name="script.js">
        angular.module('ngGotoExample', ['ngRoute']).
          config(function ($routeProvider) {
            $routeProvider.
              when('/home', {
                  name: 'home'
              }).
              when('/:userId/items', {
                  name: 'many'
              }).
              when('/:userId/item/:itemId', {
                  name: 'single'
              }).
              otherwise({
                  redirectTo: '/home'
              });
          });
      </file>
    </example>
 */
directive('ngGoto', ['$route', '$location', '$parse', function ($route, $location, $parse) {
  var hashPrefix = $location.$$html5 ? '' : ngRouteModule.tmpHashPrefix;
  delete ngRouteModule.tmpHashPrefix;

  return {
    scope: true,
    restrict: 'A',
    compile: function compile(tElement, tAttrs, transclude) {
      tElement.attr('ngClick', 'ngGotoHandler($event)');

      return function (scope, element, attrs) {
        var isLink = element[0].tagName === 'A',
            isActive = false,
            searchParams,
            updateActive = function () {
              if ($route.current && attrs.ngGoto === $route.current.name) {
                  element.addClass('ng-route-active');
                  isActive = true;
              } else if (isActive) {
                  element.removeClass('ng-route-active');
                  isActive = false;
              }

              if (isLink) {
                var url = $route.pathTo[attrs.ngGoto](attrs),
                    search = searchParams(scope, {});

                // set the href
                if (search) {
                  if (search === true) {
                    search = '?' + angular.toKeyValue($location.search());
                  } else if (angular.isObject(search)) {
                    search = '?' + angular.toKeyValue(search);
                  } else {
                    search = '?' + search;
                  }
                  if (search === '?') { search = ''; }
                  element.attr('href', hashPrefix + url + search);
                } else {
                  element.attr('href', hashPrefix + url);
                }
              }
            };

        // Process search attribute if defined
        if (attrs.search) {
          searchParams = $parse(attrs.search);
          delete attrs.search;
        } else {
          // no-op function unless search exists
          searchParams = angular.noop;
        }

        // Keep the element up to date
        updateActive();
        scope.$on('$routeChangeSuccess', updateActive);

        // Follow clicks using mobile events where available
        scope.ngGotoHandler = function($event) {
          $route.to[attrs.ngGoto](attrs, searchParams(scope, {}));

          if (isLink) {
            $event.preventDefault();
          }
        };
      };
    }
  };
}]);
