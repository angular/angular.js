'use strict';

var app = angular.module('largetableBenchmark', []);

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

app.controller('DataController', function DataController($scope, $rootScope) {
  var totalRows = 1000;
  var totalColumns = 20;

  var data = $scope.data = [];
  $scope.digestDuration = '?';
  $scope.numberOfBindings = totalRows * totalColumns * 2 + totalRows + 1;
  $scope.numberOfWatches = '?';

  /** @this */
  function iGetter() { return this.i; }
  /** @this */
  function jGetter() { return this.j; }

  for (var i = 0; i < totalRows; i++) {
    data[i] = [];
    for (var j = 0; j < totalColumns; j++) {
      data[i][j] = {
        i: i, j: j,
        iFn: iGetter,
        jFn: jGetter
      };
    }
  }

  var previousType;

  benchmarkSteps.push({
    name: 'destroy',
    fn: function() {
      $scope.$apply(function() {
        previousType = $scope.benchmarkType;
        $scope.benchmarkType = 'none';
      });
    }
  });

  benchmarkSteps.push({
    name: 'create',
    fn: function() {
      $scope.$apply(function() {
        $scope.benchmarkType = previousType;
      });
    }
  });

  benchmarkSteps.push({
    name: '$apply',
    fn: function() {
      $rootScope.$apply();
    }
  });
});


app.directive('baselineBindingTable', function() {
  return {
    restrict: 'E',
    link: function($scope, $element) {
      var i, j, row, cell, comment;
      var document = window.document;
      var template = document.createElement('span');
      template.setAttribute('ng-repeat', 'foo in foos');
      template.classList.add('ng-scope');
      template.appendChild(document.createElement('span'));
      template.appendChild(document.createTextNode(':'));
      template.appendChild(document.createElement('span'));
      template.appendChild(document.createTextNode('|'));

      for (i = 0; i < 1000; i++) {
        row = document.createElement('div');
        $element[0].appendChild(row);
        for (j = 0; j < 20; j++) {
          cell = template.cloneNode(true);
          row.appendChild(cell);
          cell.childNodes[0].textContent = i;
          cell.childNodes[2].textContent = j;
          cell.ng3992 = 'xxx';
          comment = document.createComment('ngRepeat end: bar in foo');
          row.appendChild(comment);
        }

        comment = document.createComment('ngRepeat end: foo in foos');
        $element[0].appendChild(comment);
      }
    }
  };
});


app.directive('baselineInterpolationTable', function() {
  return {
    restrict: 'E',
    link: function($scope, $element) {
      var i, j, row, cell, comment;
      var document = window.document;
      var template = document.createElement('span');
      template.setAttribute('ng-repeat', 'foo in foos');
      template.classList.add('ng-scope');

      for (i = 0; i < 1000; i++) {
        row = document.createElement('div');
        $element[0].appendChild(row);
        for (j = 0; j < 20; j++) {
          cell = template.cloneNode(true);
          row.appendChild(cell);
          cell.textContent = '' + i + ':' + j + '|';
          cell.ng3992 = 'xxx';
          comment = document.createComment('ngRepeat end: bar in foo');
          row.appendChild(comment);
        }

        comment = document.createComment('ngRepeat end: foo in foos');
        $element[0].appendChild(comment);
      }
    }
  };
});



/*

the fastest
240/44

app.directive('baselineTable', function() {
  return function($scope, $element) {
    var i, j, row, cell;

    for (i = 0; i < 1000; i++) {
      row = document.createElement('div');
      for (j = 0; j < 20; j++) {
        cell = document.createElement('span');
        cell.textContent = '' + i + ':' + j;
        row.appendChild(cell);
      }
      $element[0].appendChild(row);
    }
  };
});

 */

/*
with comments and expando
232/90

app.directive('baselineTable', function() {
  return function($scope, $element) {
    var i, j, row, cell, comment;

    for (i = 0; i < 1000; i++) {
      row = document.createElement('div');
      $element[0].appendChild(row);
      for (j = 0; j < 20; j++) {
        cell = document.createElement('span');
        row.appendChild(cell);
        cell.textContent = '' + i + ':' + j;
        cell.ng3992 = 'xxx';
        comment = document.createComment('ngRepeat end: bar in foo');
        row.appendChild(comment);
      }

      comment = document.createComment('ngRepeat end: foo in foos');
      $element[0].appendChild(comment);
    }
  };
});

 */
