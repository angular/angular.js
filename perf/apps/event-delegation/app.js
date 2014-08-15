var app = angular.module('perf', ['ngBench'])
.directive('noopDir', function() {
  return {
    compile: function($element, $attrs) {
      return function($scope, $element) {
        return 1;
      }
    }
  };
})
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
}])
.directive('dlgtClick', function() {
  return {
    compile: function($element, $attrs) {
      var evt = $attrs.dlgtClick;
      // We don't setup the global event listeners as the costs are small and one time only...
    }
  };
})
.controller('MainCtrl', ['$compile', '$rootScope', '$templateCache',
  function($compile, $rootScope, $templateCache) {
  // TODO: Make ngRepeatCount configurable via the UI!
  var self = this;
  this.ngRepeatCount = 20;
  this.manualRepeatCount = 5;
  this.benchmarks = [{
    title: 'ng-click',
    factory: function() {
      return createBenchmark({
        directive: 'ng-click="a()"'
      });
    },
    active: true
  },{
    title: 'ng-click without jqLite',
    factory: function() {
      return createBenchmark({
        directive: 'native-click="a()"'
      });
    },
    active: true
  },{
    title: 'baseline: ng-show',
    factory: function() {
      return createBenchmark({
        directive: 'ng-show="true"'
      });
    },
    active: true
  },{
    title: 'baseline: text interpolation',
    factory: function() {
      return createBenchmark({
        text: '{{row}}'
      });
    },
    active: true
  },{
    title: 'delegate event directive (only compile)',
    factory: function() {
      return createBenchmark({
        directive: 'dlgt-click="a()"'
      });
    },
    active: true
  },{
    title: 'baseline: noop directive (compile and link)',
    factory: function() {
      return createBenchmark({
        directive: 'noop-dir'
      });
    },
    active: true
  },{
    title: 'baseline: no directive',
    factory: function() {
      return createBenchmark({});
    },
    active: true
  }];

  function createBenchmark(options) {
    options.directive = options.directive || '';
    options.text = options.text || '';

    var templateHtml = '<div><span ng-repeat="row in rows">';
    for (var i=0; i<self.manualRepeatCount; i++) {
      templateHtml += '<span '+options.directive+'>'+options.text+'</span>';
    }
    templateHtml += '</span></div>';

    var compiledTemplate = $compile(templateHtml);
    var rows = [];
    for (var i=0; i<self.ngRepeatCount; i++) {
      rows.push('row'+i);
    }
    return function(container) {
      var scope = $rootScope.$new();
      try {
        scope.rows = rows;
        compiledTemplate(scope, function(clone) {
          container.appendChild(clone[0]);
        });
        scope.$digest();
      } finally {
        scope.$destroy();
      }
    }
  }
}])