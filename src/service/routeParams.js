'use strict';

/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$routeParams
 * @requires $route
 *
 * @description
 * Current set of route parameters. The route parameters are a combination of the
 * {@link angular.service.$location $location} `hashSearch`, and `path`. The `path` parameters
 * are extracted when the {@link angular.service.$route $route} path is matched.
 *
 * In case of parameter name collision, `path` params take precedence over `hashSearch` params.
 *
 * The service guarantees that the identity of the `$routeParams` object will remain unchanged
 * (but its properties will likely change) even when a route change occurs.
 *
 * @example
 * <pre>
 *  // Given:
 *  // URL: http://server.com/index.html#/Chapter/1/Section/2?search=moby
 *  // Route: /Chapter/:chapterId/Section/:sectionId
 *  //
 *  // Then
 *  $routeParams ==> {chapterId:1, sectionId:2, search:'moby'}
 * </pre>
 */
angularService('$routeParams', function(){
  return {};
});
