(function() {

  var ngBenchmarkTemplateUrl = getCurrentScript().replace('.js', '.html');

  angular.module('ngBench', []).directive('ngBench', function() {
    return {
      scope: {
        'benchmarks': '=ngBench'
      },
      templateUrl: ngBenchmarkTemplateUrl,
      controllerAs: 'ngBenchCtrl',
      controller: ['$scope', '$element', NgBenchController]
    };
  });

  function NgBenchController($scope, $element) {
    var container = $element[0].querySelector('.work');

    this.toggleAll = function() {
      var newState = !$scope.benchmarks[0].active;
      $scope.benchmarks.forEach(function(benchmark) {
        benchmark.active = newState;
      });
    };

    this.run = function() {
      var suite = new Benchmark.Suite();
      $scope.benchmarks.forEach(function(benchmark) {
        var options = {
          'model': benchmark,
          'onStart': function() {
            benchmark.state = 'running';
            $scope.$digest();
          },
          'setup': function() {
            window.gc && window.gc();
          },
          'onComplete': function(event) {
            benchmark.state = '';
            if (this.error) {
              benchmark.lastResult = this.error.stack;
            } else {
              benchmark.lastResult = benchResultToString(this);
            }
            $scope.$digest();
          },
          delegate: createBenchmarkFn(benchmark.factory)
        };
        benchmark.state = '';
        if (benchmark.active) {
          benchmark.state = 'waiting';
          suite.add(benchmark.title, 'this.delegate()', options);
        }
      });
      suite.run({'async': true});
    };

    this.runOnce = function() {
      window.setTimeout(function() {
        $scope.benchmarks.forEach(function(benchmark) {
          benchmark.state = '';
          if (benchmark.active) {
            try {
              createBenchmarkFn(benchmark.factory)();
              benchmark.lastResult = '';
            } catch (e) {
              benchmark.lastResult = e.message;
            }
          }
        });
        $scope.$digest();
      });
    };

    function createBenchmarkFn(factory) {
      var instance = factory();
      return function() {
        container.innerHTML = '';
        instance(container);
      }
    }
  }

  // See benchmark.js, toStringBench,
  // but without showing the name
  function benchResultToString(bench) {
    var me = bench,
        hz = me.hz,
        stats = me.stats,
        size = stats.sample.length;

    return Benchmark.formatNumber(hz.toFixed(hz < 100 ? 2 : 0)) + ' ops/sec +/-' +
      stats.rme.toFixed(2) + '% (' + size + ' run' + (size == 1 ? '' : 's') + ' sampled)';
  }

  function getCurrentScript() {
    var script = document.currentScript;
    if (!script) {
      var scripts = document.getElementsByTagName('script');
      script = scripts[scripts.length - 1];
    }
    return script.src;
  }
})();
