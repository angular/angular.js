var app = angular.module('filtersBenchmark', []);

app.controller('DataController', function($rootScope, $scope) {
  this.ngRepeatCount = 1000;
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
    name: '$apply',
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
      $rootScope.$apply();
    }
  });
});
