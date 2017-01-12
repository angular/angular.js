'use strict';

angular.
  module('lettersApp', ['ngRoute']).
  config(function($routeProvider) {
    $routeProvider.
      otherwise(resolveRedirectTo('/foo1')).
      when('/foo1', resolveRedirectTo('/bar1')).
      when('/bar1', resolveRedirectTo('/baz1')).
      when('/baz1', resolveRedirectTo('/qux1')).
      when('/qux1', {
        template: '<ul><li ng-repeat="letter in $resolve.letters">{{ letter }}</li></ul>',
        resolve: resolveLetters()
      }).
      when('/foo2', resolveRedirectTo('/bar2')).
      when('/bar2', resolveRedirectTo('/baz2')).
      when('/baz2', resolveRedirectTo('/qux2')).
      when('/qux2', {
        template: '{{ $resolve.letters.length }}',
        resolve: resolveLetters()
      });

    // Helpers
    function resolveLetters() {
      return {
        letters: function($q) {
          return $q(function(resolve) {
            window.setTimeout(resolve, 2000, ['a', 'b', 'c', 'd', 'e']);
          });
        }
      };
    }

    function resolveRedirectTo(path) {
      return {
        resolveRedirectTo: function($q) {
          return $q(function(resolve) {
            window.setTimeout(resolve, 250, path);
          });
        }
      };
    }
  });
