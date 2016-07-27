(function(angular) {
  'use strict';
angular.module('cancel-update-example', [])

.controller('CancelUpdateController', ['$scope', function($scope) {
  $scope.resetWithCancel = function(e) {
    if (e.keyCode == 27) {
      $scope.myForm.myInput1.$rollbackViewValue();
      $scope.myValue = '';
    }
  };
  $scope.resetWithoutCancel = function(e) {
    if (e.keyCode == 27) {
      $scope.myValue = '';
    }
  };
}]);
})(window.angular);