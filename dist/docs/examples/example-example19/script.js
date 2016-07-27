(function(angular) {
  'use strict';
angular.module('docsTransclusionExample', [])
  .controller('Controller', ['$scope', function($scope) {
    $scope.name = 'Tobias';
  }])
  .directive('myDialog', function() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      templateUrl: 'my-dialog.html',
      link: function (scope, element) {
        scope.name = 'Jeff';
      }
    };
  });
})(window.angular);