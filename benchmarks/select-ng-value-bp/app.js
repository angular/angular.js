'use strict';

/* globals angular, benchmarkSteps */

var app = angular.module('selectBenchmark', []);

app.config(function($compileProvider) {
  if ($compileProvider.debugInfoEnabled) {
    $compileProvider.debugInfoEnabled(false);
  }
});



app.controller('DataController', function($scope, $element) {
  $scope.groups = [];
  $scope.count = 10000;

  function changeOptions() {
    $scope.groups = [];
    var i = 0;
    var group;
    while (i < $scope.count) {
      if (i % 100 === 0) {
        group = {
          name: 'group-' + $scope.groups.length,
          items: []
        };
        $scope.groups.push(group);
      }
      group.items.push({
        id: i,
        label: 'item-' + i
      });
      i++;
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
        $scope.x = $scope.groups[10].items[0];
      });
    }
  });

  benchmarkSteps.push({
    name: 'set-model-2',
    fn: function() {
      $scope.$apply(function() {
        $scope.x = $scope.groups[0].items[10];
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
