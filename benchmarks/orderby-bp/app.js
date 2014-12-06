var app = angular.module('orderByBenchmark', []);

app.controller('DataController', function($rootScope, $scope) {
  this.ngRepeatCount = 5000;
  this.rows = [];
  var self = this;

  $scope.benchmarkType = 'basic';

  $scope.rawProperty = function(key) {
    return function(item) {
      return item[key];
    };
  };

  // Returns a random integer between min (included) and max (excluded)
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  benchmarkSteps.push({
    name: 'setup',
    description: 'Set rows to empty array and apply, then push new rows to be applied in next step',
    fn: function() {
      var oldRows = self.rows;
      $rootScope.$apply(function() {
        self.rows = [];
      });
      self.rows = oldRows;
      if (self.rows.length !== self.ngRepeatCount) {
        self.rows = [];
        for (var i = 0; i < self.ngRepeatCount; i++) {
          self.rows.push({
            'name': getRandomInt(i, (i + 40)),
            'index': i
          });
        }
      }
    }
  })

  benchmarkSteps.push({
    name: '$apply',
    fn: function() {
      $rootScope.$apply();
    }
  });

  $scope.$watch('ctrl.benchmarkType', function(newVal, oldVal) {
    bp.variables.select(newVal);
  });

  bp.variables.addMany([
    {
      value: 'baseline',
      label: 'baseline',
      example: 'ng-repeat="row in ctrl.rows'
    },
    {
      value: 'orderBy',
      label: 'orderBy',
      example: 'ng-repeat="row in ctrl.rows | orderBy:\'name\'"'
    },
    {
      value: 'orderByArray',
      label: 'orderBy array expression',
      example: 'ng-repeat="row in ctrl.rows | orderBy:[\'name\', \'index\']"'
    },
    {
      value: 'orderByFunction',
      label: 'orderBy function expression',
      example: 'ng-repeat="row in ctrl.rows | orderBy:rawProperty(\'name\')"'
    },
    {
      value: 'orderByArrayFunction',
      label: 'orderBy array function expression',
      example: 'ng-repeat="row in ctrl.rows | orderBy:[rawProperty(\'name\'), rawProperty(\'index\')]"'
    }
  ]);

  $scope.variableStates = bp.variables.variables;
  this.benchmarkType = bp.variables.selected? bp.variables.selected.value : undefined;
  setTimeout(function() {
    bp.runner.ready();
  });
});
