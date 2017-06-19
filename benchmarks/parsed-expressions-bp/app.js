'use strict';

var app = angular.module('parsedExpressionBenchmark', []);

app.config(function($compileProvider) {
  if ($compileProvider.debugInfoEnabled) {
    $compileProvider.debugInfoEnabled(false);
  }
});

app.filter('noop', function() {
  return function(input) {
    return input;
  };
});

//Executes the specified expression as a watcher
app.directive('bmPeWatch', function() {
  return {
    restrict: 'A',
    compile: function($element, $attrs) {
      $element.text($attrs.bmPeWatch);
      return function($scope, $element, $attrs) {
        $scope.$watch($attrs.bmPeWatch, function(val) {
          $element.text(val);
        });
      };
    }
  };
});

//Executes the specified expression as a collection watcher
app.directive('bmPeWatchCollection', function() {
  return {
    restrict: 'A',
    compile: function($element, $attrs) {
      $element.text($attrs.bmPeWatchCollection);
      return function($scope, $element, $attrs) {
        $scope.$watchCollection($attrs.bmPeWatchCollection, function(val) {
          $element.text(val);
        });
      };
    }
  };
});

app.controller('DataController', function($scope, $rootScope) {
  var totalRows = 10000;

  var data = $scope.data = [];

  var star = '*';

  $scope.func = function() { return star; };

  for (var i = 0; i < totalRows; i++) {
    data.push({
      index: i,
      odd: i % 2 === 0,
      even: i % 2 === 1,
      str0: 'foo-' + Math.random() * Date.now(),
      str1: 'bar-' + Math.random() * Date.now(),
      str2: 'baz-' + Math.random() * Date.now(),
      num0: Math.random() * Date.now(),
      num1: Math.random() * Date.now(),
      num2: Math.random() * Date.now(),
      date0: new Date(Math.random() * Date.now()),
      date1: new Date(Math.random() * Date.now()),
      date2: new Date(Math.random() * Date.now()),
      func: function() { return star; },
      obj: data[i - 1],
      keys: data[i - 1] && (data[i - 1].keys || Object.keys(data[i - 1]))
    });
  }

  benchmarkSteps.push({
    name: '$apply',
    fn: function() {
      for (var i = 0; i < 50; i++) {
        $rootScope.$digest();
      }
    }
  });
});
