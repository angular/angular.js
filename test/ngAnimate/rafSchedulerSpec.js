'use strict';

describe("$$rAFScheduler", function() {

  beforeEach(module('ngAnimate'));

  it('should accept an array of tasks and run the first task immediately',
    inject(function($$rAFScheduler) {

    var taskSpy = jasmine.createSpy();
    var tasks = [taskSpy];
    $$rAFScheduler(tasks);
    expect(taskSpy).toHaveBeenCalled();
  }));

  it('should run tasks based on how many RAFs have run in comparison to the task index',
    inject(function($$rAFScheduler, $$rAF) {

    var i, tasks = [];

    for (i = 0; i < 5; i++) {
      tasks.push(jasmine.createSpy());
    }

    $$rAFScheduler(tasks);

    for (i = 1; i < 5; i++) {
      var taskSpy = tasks[i];
      expect(taskSpy).not.toHaveBeenCalled();
      $$rAF.flush();
      expect(taskSpy).toHaveBeenCalled();
    }
  }));

  it('should parallelize multiple instances of itself into sequenced RAFs',
    inject(function($$rAFScheduler, $$rAF) {

    var spies = {
      a: spy(),
      b: spy(),
      c: spy(),

      x: spy(),
      y: spy(),
      z: spy()
    };

    var t1 = [spies.a, spies.b, spies.c];
    var t2 = [spies.x, spies.y, spies.z];

    $$rAFScheduler(t1);
    expect(spies.a).toHaveBeenCalled();

    $$rAF.flush();
    $$rAFScheduler(t2);

    expect(spies.b).toHaveBeenCalled();
    expect(spies.x).toHaveBeenCalled();

    $$rAF.flush();

    expect(spies.c).toHaveBeenCalled();
    expect(spies.y).toHaveBeenCalled();

    $$rAF.flush();

    expect(spies.z).toHaveBeenCalled();

    function spy() {
      return jasmine.createSpy();
    }
  }));

  describe('.waitUntilQuiet', function() {

    it('should run the `last` provided function when a RAF fully passes',
      inject(function($$rAFScheduler, $$rAF) {

      var q1 = jasmine.createSpy();
      $$rAFScheduler.waitUntilQuiet(q1);

      expect(q1).not.toHaveBeenCalled();

      var q2 = jasmine.createSpy();
      $$rAFScheduler.waitUntilQuiet(q2);

      expect(q1).not.toHaveBeenCalled();
      expect(q2).not.toHaveBeenCalled();

      var q3 = jasmine.createSpy();
      $$rAFScheduler.waitUntilQuiet(q3);

      expect(q1).not.toHaveBeenCalled();
      expect(q2).not.toHaveBeenCalled();
      expect(q3).not.toHaveBeenCalled();

      $$rAF.flush();

      expect(q1).not.toHaveBeenCalled();
      expect(q2).not.toHaveBeenCalled();
      expect(q3).toHaveBeenCalled();
    }));

    it('should always execute itself before the next RAF task tick occurs',
      inject(function($$rAFScheduler, $$rAF) {

      var log = [];

      var quietFn = logFactory('quiet');
      var tasks = [
        logFactory('task1'),
        logFactory('task2'),
        logFactory('task3'),
        logFactory('task4')
      ];

      $$rAFScheduler(tasks);
      expect(log).toEqual(['task1']);

      $$rAFScheduler.waitUntilQuiet(quietFn);
      expect(log).toEqual(['task1']);

      $$rAF.flush();

      expect(log).toEqual(['task1', 'quiet', 'task2']);

      $$rAF.flush();

      expect(log).toEqual(['task1', 'quiet', 'task2', 'task3']);

      $$rAFScheduler.waitUntilQuiet(quietFn);

      $$rAF.flush();

      expect(log).toEqual(['task1', 'quiet', 'task2', 'task3', 'quiet', 'task4']);

      function logFactory(token) {
        return function() {
          log.push(token);
        };
      }
    }));
  });

});
