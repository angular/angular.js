'use strict';

(function() {
  var app = angular.module('repeatAnimateBenchmark');

  app.config(function($compileProvider, $animateProvider) {
    if ($compileProvider.debugInfoEnabled) {
      $compileProvider.debugInfoEnabled(false);
    }

  });

  app.run(function($animate) {
    if ($animate.enabled) {
      $animate.enabled(true);
    }
  });

  app.controller('DataController', function($scope, $rootScope, $animate) {
    var totalRows = 500;
    var totalColumns = 20;

    var data = $scope.data = [];

    function fillData() {
      if ($animate.enabled) {
        $animate.enabled($scope.benchmarkType !== 'globallyDisabled');
      }

      for (var i = 0; i < totalRows; i++) {
        data[i] = [];
        for (var j = 0; j < totalColumns; j++) {
          data[i][j] = {
            i: i
          };
        }
      }
    }

    benchmarkSteps.push({
      name: 'enter',
      fn: function() {
        $scope.$apply(function() {
          fillData();
        });
      }
    });

    benchmarkSteps.push({
      name: 'leave',
      fn: function() {
        $scope.$apply(function() {
          data = $scope.data = [];
        });
      }
    });
  });

  app.directive('disableAnimations', function($animate) {
    return {
      link: {
        pre: function(s, e) {
          $animate.enabled(e, false);
        }
      }
    };
  });

  app.directive('noop', function($animate) {
    return {
      link: {
        pre: angular.noop
      }
    };
  });

  app.directive('baseline', function($document) {
    return {
      restrict: 'E',
      link: function($scope, $element) {
        var document = $document[0];

        var i, j, row, cell, comment;
        var template = document.createElement('span');
        template.setAttribute('ng-repeat', 'foo in foos');
        template.classList.add('ng-scope');
        template.appendChild(document.createElement('span'));
        template.appendChild(document.createTextNode(':'));

        function createList() {
          for (i = 0; i < $scope.data.length; i++) {
            row = document.createElement('div');
            $element[0].appendChild(row);
            for (j = 0; j < $scope.data[i].length; j++) {
              cell = template.cloneNode(true);
              row.appendChild(cell);
              cell.childNodes[0].textContent = i;
              cell.ng339 = 'xxx';
              comment = document.createComment('ngRepeat end: bar in foo');
              row.appendChild(comment);
            }

            comment = document.createComment('ngRepeat end: foo in foos');
            $element[0].appendChild(comment);
          }
        }

        $scope.$watch('data.length', function(newVal) {
          if (newVal === 0) {
            while ($element[0].firstChild) {
                $element[0].removeChild($element[0].firstChild);
            }
          } else {
            createList();
          }
        });
      }
    };
  });
})();
