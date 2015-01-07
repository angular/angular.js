"use strict";

/* globals angular, benchmarkSteps */

var app = angular.module('ngOptionsBenchmark', []);

app.config(function($compileProvider) {
  if ($compileProvider.debugInfoEnabled) {
    $compileProvider.debugInfoEnabled(false);
  }
});



app.controller('DataController', function($scope, $element) {
  $scope.items = [];
  $scope.count = 10000;

  function changeOptions() {
    $scope.items = [];
    for (var i = 0; i < $scope.count; ++i) {
      $scope.items.push({
        id: i,
        label: 'item-' + i,
        group: 'group-' + i % 100
      });
    }
  }

  var selectElement = $element.find('select');
  console.log(selectElement);


  benchmarkSteps.push({
    name: 'add-options',
    fn: function() {
      $scope.$apply(function() {
        $scope.count = 10000;
        changeOptions();
      });
    }
  });

  benchmarkSteps.push({
    name: 'set-model-1',
    fn: function() {
      $scope.$apply(function() {
        $scope.x = $scope.items[1000];
      });
    }
  });

  benchmarkSteps.push({
    name: 'set-model-2',
    fn: function() {
      $scope.$apply(function() {
        $scope.x = $scope.items[10];
      });
    }
  });

  benchmarkSteps.push({
    name: 'remove-options',
    fn: function() {
      $scope.count = 100;
      changeOptions();
    }
  });

  benchmarkSteps.push({
    name: 'add-options',
    fn: function() {
      $scope.$apply(function() {
        $scope.count = 10000;
        changeOptions();
      });
    }
  });

  benchmarkSteps.push({
    name: 'set-view-1',
    fn: function() {
      selectElement.val('2000');
      selectElement.triggerHandler('change');
    }
  });

  benchmarkSteps.push({
    name: 'set-view-2',
    fn: function() {
      selectElement.val('1000');
      selectElement.triggerHandler('change');
    }
  });
});
