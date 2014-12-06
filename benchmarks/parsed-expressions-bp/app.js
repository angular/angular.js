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
      $element.text( $attrs.bmPeWatch );
      return function($scope, $element, $attrs) {
        $scope.$watch($attrs.bmPeWatch, function(val) {
          $element.text(val);

        });
      };
    }
  };
});

//Executes the specified expression as a watcher
//Adds a simple wrapper method to allow use of $watch instead of $watchCollection
app.directive('bmPeWatchLiteral', function($parse) {
  function retZero() {
    return 0;
  }

  return {
    restrict: 'A',
    compile: function($element, $attrs) {
      $element.text( $attrs.bmPeWatchLiteral );
      return function($scope, $element, $attrs) {
        $scope.$watch( $parse($attrs.bmPeWatchLiteral, retZero) );
      };
    }
  };
});

app.controller('DataController', function($scope, $rootScope) {
  var totalRows = 10000;

  var data = $scope.data = [];

  var star = '*';

  $scope.func = function() { return star;};

  for (var i=0; i<totalRows; i++) {
    data.push({
      index: i,
      odd:   i%2 === 0,
      even:  i%2 === 1,
      str0: "foo-" + Math.random()*Date.now(),
      str1: "bar-" + Math.random()*Date.now(),
      str2: "baz-" + Math.random()*Date.now(),
      num0:  Math.random()*Date.now(),
      num1:  Math.random()*Date.now(),
      num2:  Math.random()*Date.now(),
      date0: new Date(Math.random()*Date.now()),
      date1: new Date(Math.random()*Date.now()),
      date2: new Date(Math.random()*Date.now()),
      func: function(){ return star; },
      obj: data[i-1],
      keys: data[i-1] && (data[i-1].keys || Object.keys(data[i-1])),
      constructor: data[i-1]
    });
  }

  benchmarkSteps.push({
    name: '$apply',
    fn: function() {
      for (var i=0; i<50; i++) {
        $rootScope.$digest();
      }
    }
  });

  bp.variables.addMany([
    {
      value: 'simplePath',
      label: 'Simple Paths'
    },
    {
      value: 'complexPath',
      label: 'Complex Paths'
    },
    {
      value: 'constructorPath',
      label: 'Constructor Paths\n($parse special cases "constructor" for security)'
    },
    {
      value: 'fieldAccess',
      label: 'Field Accessors'
    },
    {
      value: 'fieldIndex',
      label: 'Field Indexes'
    },
    {
      value: 'operators',
      label: 'Binary/Unary operators'
    },
    {
      value: 'shortCircuitingOperators',
      label: 'AND/OR short-circuiting operators'
    },
    {
      value: 'filters',
      label: 'Filters'
    },
    {
      value: 'functionCalls',
      label: 'Function calls'
    },
    {
      value: 'objectLiterals',
      label: 'Object Literals'
    },
    {
      value: 'arrayLiterals',
      label: 'Array Literals'
    }
  ]);

  $rootScope.variableStates = bp.variables.variables;
  this.benchmarkType = bp.variables.selected? bp.variables.selected.value : undefined;
  setTimeout(function() {
    bp.runner.ready();
  });
});
