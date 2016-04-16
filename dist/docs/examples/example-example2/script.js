(function(angular) {
  'use strict';
var app = angular.module('ngAria_ngModelExample', ['ngAria'])
.controller('formsController', function($scope){
  $scope.checked = false;
  $scope.toggleCheckbox = function(){
    $scope.checked = !$scope.checked;
  };
})
.directive('someCheckbox', function(){
  return {
    restrict: 'E',
    link: function($scope, $el, $attrs) {
      $el.on('keypress', function(event){
        event.preventDefault();
        if(event.keyCode === 32 || event.keyCode === 13){
          $scope.toggleCheckbox();
          $scope.$apply();
        }
      });
    }
  };
})
.directive('showAttrs', function() {
  return function($scope, $el, $attrs) {
    var pre = document.createElement('pre');
    $el.after(pre);
    $scope.$watch(function() {
      var $attrs = {};
      Array.prototype.slice.call($el[0].attributes, 0).forEach(function(item) {
        if (item.name !== 'show-$attrs') {
          $attrs[item.name] = item.value;
        }
      });
      return $attrs;
    }, function(newAttrs, oldAttrs) {
      pre.textContent = JSON.stringify(newAttrs, null, 2);
    }, true);
  };
});
})(window.angular);