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
  },
};

/**
 * Mock Application
 */
function ApplicationMock($window) {
  this.$window = $window;
}
ApplicationMock.prototype = {
  executeAction: function(callback) {
    callback.call(this.$window);
  }
};

describe('angular.scenario.SpecRunner', function() {
  var $window;
  var runner;

  beforeEach(function() {
    $window = {};
    runner = angular.scope();
    runner.application = new ApplicationMock($window);
    runner.$become(angular.scenario.SpecRunner);
  });
  
  it('should bind futures to the spec', function() {
    runner.addFuture('test future', function(done) {
      this.application.value = 10;
      done();
    });
    runner.futures[0].execute(angular.noop);
    expect(runner.application.value).toEqual(10);
  });
  
  it('should pass done to future action behavior', function() {
    runner.addFutureAction('test future', function(done) {
      expect(angular.isFunction(done)).toBeTruthy();
      done(10, 20);
    });
    runner.futures[0].execute(function(error, result) {
      expect(error).toEqual(10);
      expect(result).toEqual(20);
    });
  });
  
  it('should pass execute future action on the $window', function() {
    runner.addFutureAction('test future', function(done) {
      this.test = 'test value';
      done();
    });
    runner.futures[0].execute(angular.noop);
    expect($window.test).toEqual('test value');
  });

  it('should execute spec function and notify UI', function() {
    var finished = false;
    var ui = new UIMock();
    var spec = {name: 'test spec', fn: function() {
      this.test = 'some value';
    }};
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
    var finished = false;
    var ui = new UIMock();
    var spec = {name: 'test spec', fn: function() {
      throw 'message';
    }};
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
    var finished = false;
    var ui = new UIMock();
    var spec = {name: 'test spec', fn: angular.noop};
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
      'spec finish:failure message'
    ]);
  });

  it('should execute notify UI on step error', function() {
    var finished = false;
    var ui = new UIMock();
    var spec = {name: 'test spec', fn: angular.noop};
    runner.addFuture('test future', function(done) {
      throw 'error message';
    });
    runner.run(ui, spec, function() {
      finished = true;
    });
    expect(finished).toBeTruthy();
    expect(ui.log).toEqual([
      'addSpec:test spec',
      'addStep:test future',
      'step error:error message',
      'spec finish:error message'
    ]);
  });

});
