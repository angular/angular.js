(function(angular) {
  'use strict';
angular.module('filterExample', [])
.controller('MainCtrl', function($scope, $filter) {
  $scope.originalText = 'hello';
  $scope.filteredText = $filter('uppercase')($scope.originalText);
});
})(window.angular);