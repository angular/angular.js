'use strict';

/**
 * Mock Application
 */
function ApplicationMock($window) {
  this.$window = $window;
}
ApplicationMock.prototype = {
  executeAction: function(callback) {
    callback.call(this.$window, _jQuery(this.$window.document), this.$window);
  }
};

describe('angular.scenario.SpecRunner', function() {
  var $window, $root, log;
  var runner;

  function createSpec(name, body) {
    return {
      name: name,
      before: angular.noop,
      body: body || angular.noop,
      after: angular.noop
    };
  }

  beforeEach(inject(function($rootScope) {
    log = [];
    $window = {};
    $window.setTimeout = function(fn, timeout) {
      fn();
    };
    $root = $rootScope;
    $root.emit = function(eventName) {
      log.push(eventName);
    };
    $root.on = function(eventName) {
      log.push('Listener Added for ' + eventName);
    };
    $root.application = new ApplicationMock($window);
    $root.$window = $window;
    runner = $root.$new();

    var Cls = angular.scenario.SpecRunner;
    for (var name in Cls.prototype)
      runner[name] = angular.bind(runner, Cls.prototype[name]);

    Cls.call(runner);
  }));

  it('should bind futures to the spec', function() {
    runner.addFuture('test future', function(done) {
      this.value = 10;
      done();
    });
    runner.futures[0].execute(angular.noop);
    expect(runner.value).toEqual(10);
  });

  it('should pass done to future action behavior', function() {
    runner.addFutureAction('test future', function($window, $document, done) {
      expect(angular.isFunction(done)).toBeTruthy();
      done(10, 20);
    });
    runner.futures[0].execute(function(error, result) {
      expect(error).toEqual(10);
      expect(result).toEqual(20);
    });
  });

  it('should execute spec function and notify UI', function() {
    var finished;
    var spec = createSpec('test spec', function() {
      this.test = 'some value';
    });
    runner.addFuture('test future', function(done) {
      done();
    });
    runner.run(spec, function() {
      finished = true;
    });
    expect(runner.test).toEqual('some value');
    expect(finished).toBeTruthy();
    expect(log).toEqual([
      'SpecBegin',
      'StepBegin',
      'StepEnd',
      'SpecEnd'
    ]);
  });

  it('should execute notify UI on spec setup error', function() {
    var finished;
    var spec = createSpec('test spec', function() {
      throw 'message';
    });
    runner.run(spec, function() {
      finished = true;
    });
    expect(finished).toBeTruthy();
    expect(log).toEqual([
      'SpecBegin',
      'SpecError',
      'SpecEnd'
    ]);
  });

  it('should execute notify UI on step failure', function() {
    var finished;
    var spec = createSpec('test spec');
    runner.addFuture('test future', function(done) {
      done('failure message');
    });
    runner.run(spec, function() {
      finished = true;
    });
    expect(finished).toBeTruthy();
    expect(log).toEqual([
      'SpecBegin',
      'StepBegin',
      'StepFailure',
      'StepEnd',
      'SpecEnd'
    ]);
  });

  it('should execute notify UI on step error', function() {
    var finished;
    var spec = createSpec('test spec', function() {
      this.addFuture('test future', function(done) {
        throw 'error message';
      });
    });
    runner.run(spec, function() {
      finished = true;
    });
    expect(finished).toBeTruthy();
    expect(log).toEqual([
      'SpecBegin',
      'StepBegin',
      'StepError',
      'StepEnd',
      'SpecEnd'
    ]);
  });

  it('should run after handlers even if error in body of spec', function() {
    var finished, after;
    var spec = createSpec('test spec', function() {
      this.addFuture('body', function(done) {
        throw 'error message';
      });
    });
    spec.after = function() {
      this.addFuture('after', function(done) {
        after = true;
        done();
      });
    };
    runner.run(spec, function() {
      finished = true;
    });
    expect(finished).toBeTruthy();
    expect(after).toBeTruthy();
    expect(log).toEqual([
      'SpecBegin',
      'StepBegin',
      'StepError',
      'StepEnd',
      'StepBegin',
      'StepEnd',
      'SpecEnd'
    ]);
  });
});
