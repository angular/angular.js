(function(angular) {
  'use strict';
angular.module('app', []).directive('setFocusIf', function() {
  return function link($scope, $element, $attr) {
    $scope.$watch($attr.setFocusIf, function(value) {
      if ( value ) { $element[0].focus(); }
    });
  };
});
})(window.angular);