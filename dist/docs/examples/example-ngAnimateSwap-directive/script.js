(function(angular) {
  'use strict';
angular.module('ngAnimateSwapExample', ['ngAnimate'])
  .controller('AppCtrl', ['$scope', '$interval', function($scope, $interval) {
    $scope.number = 0;
    $interval(function() {
      $scope.number++;
    }, 1000);

    var colors = ['red','blue','green','yellow','orange'];
    $scope.colorClass = function(number) {
      return colors[number % colors.length];
    };
  }]);
})(window.angular);