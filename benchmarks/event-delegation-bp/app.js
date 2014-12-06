var app = angular.module('eventDelegationBenchmark', []);

app.directive('noopDir', function() {
  return {
    compile: function($element, $attrs) {
      return function($scope, $element) {
        return 1;
      }
    }
  };
});

app.directive('nativeClick', ['$parse', function($parse) {
  return {
    compile: function($element, $attrs) {
      var expr = $parse($attrs.tstEvent);
      return function($scope, $element) {
        $element[0].addEventListener('click', function() {
          console.log('clicked');
        }, false);
      }
    }
  };
}]);

app.directive('dlgtClick', function() {
  return {
    compile: function($element, $attrs) {
      var evt = $attrs.dlgtClick;
      // We don't setup the global event listeners as the costs are small and one time only...
    }
  };
});

app.controller('DataController', function($rootScope) {
  this.ngRepeatCount = 1000;
  this.rows = [];
  var self = this;

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
        for (var i=0; i<self.ngRepeatCount; i++) {
          self.rows.push('row'+i);
        }
      }
      $rootScope.$apply();
    }
  });

  bp.variables.addMany([
    {
      value: 'ngClick',
      label: 'ngClick'
    },
    {
      value: 'ngClickNoJqLite',
      label: 'ngClick without jqLite'
    },
    {
      value: 'ngShow',
      label: 'baseline: ng-show'
    },
    {
      value: 'textInterpolation',
      label: 'baseline: text interpolation'
    },
    {
      value: 'dlgtClick',
      label: 'delegate event directive (only compile)'
    },
    {
      value: 'noopDir',
      label: 'baseline: noop directive (compile and link)'
    },
    {
      value: 'noop',
      label: 'baseline: no directive'
    }
  ]);

  $rootScope.variableStates = bp.variables.variables;
  this.benchmarkType = bp.variables.selected? bp.variables.selected.value : undefined;
  setTimeout(function() {
    bp.runner.ready();
  });
});
