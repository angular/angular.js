(function(angular) {
  'use strict';
angular.module('nonStringSelect', [])
  .run(function($rootScope) {
    $rootScope.model = { id: 2 };
  })
  .directive('convertToNumber', function() {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$parsers.push(function(val) {
          return parseInt(val, 10);
        });
        ngModel.$formatters.push(function(val) {
          return '' + val;
        });
      }
    };
  });
})(window.angular);