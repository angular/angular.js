(function(angular) {
  'use strict';
angular.module('docsIsoFnBindExample', [])
  .controller('Controller', ['$scope', '$timeout', function($scope, $timeout) {
    $scope.name = 'Tobias';
    $scope.message = '';
    $scope.hideDialog = function (message) {
      $scope.message = message;
      $scope.dialogIsHidden = true;
      $timeout(function () {
        $scope.message = '';
        $scope.dialogIsHidden = false;
      }, 2000);
    };
  }])
  .directive('myDialog', function() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        'close': '&onClose'
      },
      templateUrl: 'my-dialog-close.html'
    };
  });
})(window.angular);