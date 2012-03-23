'use strict';

/**
 * Mock spec runner.
 */
function MockSpecRunner() {}
MockSpecRunner.prototype.run = function(spec, specDone) {
  spec.before.call(this);
  spec.body.call(this);
  spec.after.call(this);
  specDone();
};

MockSpecRunner.prototype.addFuture = function(name, fn, line) {
  return {name: name, fn: fn, line: line};
};

describe('angular.scenario.Runner', function() {
  var $window;
  var runner;

  beforeEach(function() {
    // Trick to get the scope out of a DSL statement
    angular.scenario.dsl('dslAddFuture', function() {
      return function() {
        return this.addFuture('future name', angular.noop);
      };
    });
    // Trick to get the scope out of a DSL statement
    angular.scenario.dsl('dslScope', function() {
      var scope = this;
      return function() { return scope; };
    });
    // Trick to get the scope out of a DSL statement
    angular.scenario.dsl('dslChain', function() {
      return function() {
        this.chained = 0;
        this.chain = function() { this.chained++; return this; };
        return this;
      };
    });
    $window = {
      location: {}
    };
    runner = new angular.scenario.Runner($window);
    runner.on('SpecError', angular.mock.rethrow);
    runner.on('StepError', angular.mock.rethrow);
  });

  afterEach(function() {
    delete angular.scenario.dsl.dslScope;
    delete angular.scenario.dsl.dslChain;
  });

  it('should publish the functions in the public API', function() {
    angular.forEach(runner.api, function(fn, name) {
      var func;
      if (name in $window) {
        func = $window[name];
      }
      expect(angular.isFunction(func)).toBeTruthy();
    });
  });

  it('should construct valid describe trees with public API', function() {
    var before = [];
    var after = [];
    $window.describe('A', function() {
      $window.beforeEach(function() { before.push('A'); });
      $window.afterEach(function() { after.push('A'); });
      $window.it('1', angular.noop);
      $window.describe('B', function() {
        $window.beforeEach(function() { before.push('B'); });
          $window.afterEach(function() { after.push('B'); });
        $window.it('2', angular.noop);
        $window.describe('C', function() {
          $window.beforeEach(function() { before.push('C'); });
          $window.afterEach(function() { after.push('C'); });
          $window.it('3', angular.noop);
        });
      });
    });
    var specs = runner.rootDescribe.getSpecs();
    specs[0].before();
    specs[0].body();
    specs[0].after();
    expect(before).toEqual(['A', 'B', 'C']);
    expect(after).toEqual(['C', 'B', 'A']);
    expect(specs[2].definition.parent).toEqual(runner.rootDescribe);
    expect(specs[0].definition.parent).toEqual(specs[2].definition.children[0]);
  });

  it('should publish the DSL statements to the $window', function() {
    $window.describe('describe', function() {
      $window.it('1', function() {
        expect($window.dslScope).toBeDefined();
      });
    });
    runner.run(null/*application*/);
  });

  it('should create a new scope for each DSL chain', function() {
    $window.describe('describe', function() {
      $window.it('1', function() {
        var scope = $window.dslScope();
        scope.test = "foo";
        expect($window.dslScope().test).toBeUndefined();
      });
      $window.it('2', function() {
        var scope = $window.dslChain().chain().chain();
        expect(scope.chained).toEqual(2);
      });
    });
    runner.run(null/*application*/);
  });
});
