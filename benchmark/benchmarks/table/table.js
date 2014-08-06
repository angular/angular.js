angular.module('tableSteps', []).
  run(['$rootScope', '$window', function($rootScope, $window) {
    $window.benchmarkSteps.push({
      name: 'table',
      fn: function () {
        $rootScope.$apply(function() {
          $rootScope.ii = new Array(100);
          $rootScope.jj = new Array(20);
        });
      }
    });
    $window.benchmarkSteps.push({
      name: 'cleanup',
      fn: function() {
        $rootScope.$apply(function() {
          $rootScope.ii = [];
          $rootScope.jj = [];
        });
      }
    });
  }]).
  directive('cell', function () {
    return {
      restrict: 'A',
      templateUrl: 'cell-tmpl.html'
    };
  });
