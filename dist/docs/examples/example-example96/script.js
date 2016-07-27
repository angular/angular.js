(function(angular) {
  'use strict';
angular.module('documentExample', [])
  .controller('ExampleController', ['$scope', '$document', function($scope, $document) {
    $scope.title = $document[0].title;
    $scope.windowTitle = angular.element(window.document)[0].title;
  }]);
})(window.angular);