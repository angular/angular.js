/**
 * Mock of all required UI classes/methods. (UI, Spec, Step).
 */
function UIMock() {
  this.log = [];
}
UIMock.prototype = {
  addSpec: function(spec) {
    var log = this.log;
    log.push('addSpec:' + spec.name);
    return {
      addStep: function(name) {
        log.push('addStep:' + name);
        return {
          finish: function(e) {
            log.push('step finish:' + (e ? e : ''));
            return this;
          },
          error: function(e) {
            log.push('step error:' + (e ? e : ''));
            return this;
          }
        };
      },
      finish: function(e) {
        log.push('spec finish:' + (e ? e : ''));
        return this;
      },
      error: function(e) {
        log.push('spec error:' + (e ? e : ''));
        return this;
      }
    };
  }
};

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
  var $window;
  var runner;
  
  function createSpec(name, body) {
    return {
      name: name,
      before: angular.noop,
      body: body || angular.noop,
      after: angular.noop
    };
  }

  beforeEach(function() {
    $window = {};
    $window.setTimeout = function(fn, timeout) {
      fn();
    };
    runner = angular.scope();
    runner.application = new ApplicationMock($window);
    runner.$window = $window;
    runner.$become(angular.scenario.SpecRunner);
  });

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
    var ui = new UIMock();
    var spec = createSpec('test spec', function() { 
      this.test = 'some value'; 
    });
    runner.addFuture('test future', function(done) {
      done();
    });
    runner.run(ui, spec, function() {
      finished = true;
    });
    expect(runner.test).toEqual('some value');
    expect(finished).toBeTruthy();
    expect(ui.log).toEqual([
      'addSpec:test spec',
      'addStep:test future',
      'step finish:',
      'spec finish:'
    ]);
  });

  it('should execute notify UI on spec setup error', function() {
    var finished;
    var ui = new UIMock();
    var spec = createSpec('test spec', function() { 
      throw 'message';
    });
    runner.run(ui, spec, function() {
      finished = true;
    });
    expect(finished).toBeTruthy();
    expect(ui.log).toEqual([
      'addSpec:test spec',
      'spec error:message'
    ]);
  });

  it('should execute notify UI on step failure', function() {
    var finished;
    var ui = new UIMock();
    var spec = createSpec('test spec');
    runner.addFuture('test future', function(done) {
      done('failure message');
    });
    runner.run(ui, spec, function() {
      finished = true;
    });
    expect(finished).toBeTruthy();
    expect(ui.log).toEqual([
      'addSpec:test spec',
      'addStep:test future',
      'step finish:failure message',
      'spec finish:'
    ]);
  });

  it('should execute notify UI on step error', function() {
    var finished;
    var ui = new UIMock();
    var spec = createSpec('test spec', function() {
      this.addFuture('test future', function(done) {
        throw 'error message';
      });
    });
    runner.run(ui, spec, function() {
      finished = true;
    });
    expect(finished).toBeTruthy();
    expect(ui.log).toEqual([
      'addSpec:test spec',
      'addStep:test future',
      'step error:error message',
      'spec finish:'
    ]);
  });
  
  it('should run after handlers even if error in body of spec', function() {
    var finished, after;
    var ui = new UIMock();
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
    runner.run(ui, spec, function() {
      finished = true;
    });
    expect(finished).toBeTruthy();
    expect(after).toBeTruthy();
    expect(ui.log).toEqual([
      'addSpec:test spec',
      'addStep:body',
      'step error:error message',
      'addStep:after',
      'step finish:',
      'spec finish:'
    ]);
  });

});
