'use strict';

angular
  .module('animationBenchmark', ['ngAnimate'], config)
  .controller('BenchmarkController', BenchmarkController);

// Functions - Definitions
function config($compileProvider) {
  $compileProvider
    .commentDirectivesEnabled(false)
    .cssClassDirectivesEnabled(false)
    .debugInfoEnabled(false);
}

function BenchmarkController($scope) {
  var self = this;
  var itemCount = 1000;
  var items = (new Array(itemCount + 1)).join('.').split('');

  benchmarkSteps.push({
    name: 'create',
    fn: function() {
      $scope.$apply(function() {
        self.items = items;
      });
    }
  });

  benchmarkSteps.push({
    name: '$digest',
    fn: function() {
      $scope.$root.$digest();
    }
  });

  benchmarkSteps.push({
    name: 'destroy',
    fn: function() {
      $scope.$apply(function() {
        self.items = [];
      });
    }
  });
}
