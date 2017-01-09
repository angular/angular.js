'use strict';

angular.
  module('lettersApp', ['ngRoute']).
  config(function($routeProvider) {
    $routeProvider.
      when('/foo', {
        resolveRedirectTo: function($q) {
          return $q(function(resolve) {
            window.setTimeout(resolve, 1000, '/bar');
          });
        }
      }).
      when('/bar', {
        template: '<ul><li ng-repeat="letter in $resolve.letters">{{ letter }}</li></ul>',
        resolve: {
          letters: function($q) {
            return $q(function(resolve) {
              window.setTimeout(resolve, 1000, ['a', 'b', 'c', 'd', 'e']);
            });
          }
        }
      }).
      otherwise('/foo');
  });
