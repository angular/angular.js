'use strict';

var lettersApp = angular.module('lettersApp', ['ngRoute']);

lettersApp.config(function($routeProvider) {
  $routeProvider.
    when('/', {
      template: '<ul><li ng-repeat="letter in letters">{{letter}}</li><ul>',
      controller: 'LettersCtrl',
      resolve: {
        letters: function($q) {
          var deferred = $q.defer();
          window.setTimeout(function() {
            deferred.resolve(['a', 'b', 'c', 'd', 'e']);
          }, 1000);
          return deferred.promise;
        }
      }
    }).
    otherwise({
      redirectTo: '/'
    });
});

lettersApp.controller('LettersCtrl', function($scope, letters) {
  $scope.letters = letters;
});
