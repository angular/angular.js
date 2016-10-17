'use strict';

describe('angular.scenario.ObjectModel', function() {
  var model;
  var runner;
  var spec, step;

  function buildSpec(id, name, definitions) {
    var spec = {
      id: id,
      name: name,
      definition: {
        name: definitions.shift()
      }
    };
    var currentDef = spec.definition;

    forEach(definitions, function(defName) {
      currentDef.parent = {
        name: defName
      };
      currentDef = currentDef.parent;
    });

    return spec;
  }

  function buildStep(name, line) {
    return {
      name: name || 'test step',
      line: function() { return line || ''; }
    };
  }

  beforeEach(function() {
    spec = buildSpec(1, 'test spec', ['describe 1']);
    step = buildStep();
    runner = new angular.scenario.testing.MockRunner();
    model = new angular.scenario.ObjectModel(runner);
  });

  it('should value default empty value', function() {
    expect(model.value).toEqual({
      name: '',
      children: {}
    });
  });

  it('should add spec and create describe blocks on SpecBegin event', function() {
    runner.emit('SpecBegin', buildSpec(1, 'test spec', ['describe 2', 'describe 1']));

    expect(model.value.children['describe 1']).toBeDefined();
    expect(model.value.children['describe 1'].children['describe 2']).toBeDefined();
    expect(model.value.children['describe 1'].children['describe 2'].specs['test spec']).toBeDefined();
  });

  it('should set fullDefinitionName on SpecBegin event', function() {
    runner.emit('SpecBegin', buildSpec(1, 'fake spec', ['describe 2']));
    var spec = model.getSpec(1);

    expect(spec.fullDefinitionName).toBeDefined();
    expect(spec.fullDefinitionName).toEqual('describe 2');
  });

  it('should set fullDefinitionName on SpecBegin event (join more names by space)', function() {
    runner.emit('SpecBegin', buildSpec(1, 'fake spec', ['describe 2', 'describe 1']));
    var spec = model.getSpec(1);

    expect(spec.fullDefinitionName).toEqual('describe 1 describe 2');
  });

  it('should add step to spec on StepBegin', function() {
    runner.emit('SpecBegin', spec);
    runner.emit('StepBegin', spec, step);
    runner.emit('StepEnd', spec, step);
    runner.emit('SpecEnd', spec);

    expect(model.value.children['describe 1'].specs['test spec'].steps.length).toEqual(1);
  });

  it('should update spec timer duration on SpecEnd event', function() {
    runner.emit('SpecBegin', spec);
    runner.emit('SpecEnd', spec);

    expect(model.value.children['describe 1'].specs['test spec'].duration).toBeDefined();
  });

  it('should update step timer duration on StepEnd event', function() {
    runner.emit('SpecBegin', spec);
    runner.emit('StepBegin', spec, step);
    runner.emit('StepEnd', spec, step);
    runner.emit('SpecEnd', spec);

    expect(model.value.children['describe 1'].specs['test spec'].steps[0].duration).toBeDefined();
  });

  it('should set spec status on SpecEnd to success if no status set', function() {
    runner.emit('SpecBegin', spec);
    runner.emit('SpecEnd', spec);

    expect(model.value.children['describe 1'].specs['test spec'].status).toEqual('success');
  });

  it('should set status to error after SpecError', function() {
    runner.emit('SpecBegin', spec);
    runner.emit('SpecError', spec, 'error');

    expect(model.value.children['describe 1'].specs['test spec'].status).toEqual('error');
  });

  it('should set spec status to failure if step fails', function() {
    runner.emit('SpecBegin', spec);
    runner.emit('StepBegin', spec, step);
    runner.emit('StepEnd', spec, step);
    runner.emit('StepBegin', spec, step);
    runner.emit('StepFailure', spec, step, 'error');
    runner.emit('StepEnd', spec, step);
    runner.emit('StepBegin', spec, step);
    runner.emit('StepEnd', spec, step);
    runner.emit('SpecEnd', spec);

    expect(model.value.children['describe 1'].specs['test spec'].status).toEqual('failure');
  });

  it('should set spec status to error if step errors', function() {
    runner.emit('SpecBegin', spec);
    runner.emit('StepBegin', spec, step);
    runner.emit('StepError', spec, step, 'error');
    runner.emit('StepEnd', spec, step);
    runner.emit('StepBegin', spec, step);
    runner.emit('StepFailure', spec, step, 'error');
    runner.emit('StepEnd', spec, step);
    runner.emit('SpecEnd', spec);

    expect(model.value.children['describe 1'].specs['test spec'].status).toEqual('error');
  });

  describe('events', function() {
    var Spec = angular.scenario.ObjectModel.Spec,
        Step = angular.scenario.ObjectModel.Step,
        callback;

    beforeEach(function() {
      callback = jasmine.createSpy('listener');
    });

    it('should provide method for registering a listener', function() {
      expect(model.on).toBeDefined();
      expect(model.on instanceof Function).toBe(true);
    });

    it('should forward SpecBegin event', function() {
      model.on('SpecBegin', callback);
      runner.emit('SpecBegin', spec);

      expect(callback).toHaveBeenCalled();
    });

    it('should forward SpecBegin event with ObjectModel.Spec as a param', function() {
      model.on('SpecBegin', callback);
      runner.emit('SpecBegin', spec);

      expect(callback.calls.mostRecent().args[0] instanceof Spec).toBe(true);
      expect(callback.calls.mostRecent().args[0].name).toEqual(spec.name);
    });

    it('should forward SpecError event', function() {
      model.on('SpecError', callback);
      runner.emit('SpecBegin', spec);
      runner.emit('SpecError', spec, {});

      expect(callback).toHaveBeenCalled();
    });

    it('should forward SpecError event with ObjectModel.Spec and error as a params', function() {
      var error = {};
      model.on('SpecError', callback);
      runner.emit('SpecBegin', spec);
      runner.emit('SpecError', spec, error);

      var param = callback.calls.mostRecent().args[0];
      expect(param instanceof Spec).toBe(true);
      expect(param.name).toEqual(spec.name);
      expect(param.status).toEqual('error');
      expect(param.error).toBe(error);
    });

    it('should forward SpecEnd event', function() {
      model.on('SpecEnd', callback);
      runner.emit('SpecBegin', spec);
      runner.emit('SpecEnd', spec);

      expect(callback).toHaveBeenCalled();
    });

    it('should forward SpecEnd event with ObjectModel.Spec as a param', function() {
      model.on('SpecEnd', callback);
      runner.emit('SpecBegin', spec);
      runner.emit('SpecEnd', spec);

      expect(callback.calls.mostRecent().args[0] instanceof Spec).toBe(true);
      expect(callback.calls.mostRecent().args[0].name).toEqual(spec.name);
    });

    it('should forward StepBegin event', function() {
      model.on('StepBegin', callback);
      runner.emit('SpecBegin', spec);
      runner.emit('StepBegin', spec, step);

      expect(callback).toHaveBeenCalled();
    });

    it('should forward StepBegin event with Spec and Step as params', function() {
      model.on('StepBegin', callback);
      runner.emit('SpecBegin', spec);
      runner.emit('StepBegin', spec, step);

      var params = callback.calls.mostRecent().args;
      expect(params[0] instanceof Spec).toBe(true);
      expect(params[0].name).toEqual(spec.name);
      expect(params[1] instanceof Step).toBe(true);
    });

    it('should forward StepError event', function() {
      model.on('StepError', callback);
      runner.emit('SpecBegin', spec);
      runner.emit('StepBegin', spec, step);
      runner.emit('StepError', spec, step, {});

      expect(callback).toHaveBeenCalled();
    });

    it('should forward StepError event with Spec, Step and error as params', function() {
      var error = {};
      model.on('StepError', callback);
      runner.emit('SpecBegin', spec);
      runner.emit('StepBegin', spec, step);
      runner.emit('StepError', spec, step, error);

      var params = callback.calls.mostRecent().args;
      expect(params[0] instanceof Spec).toBe(true);
      expect(params[0].name).toEqual(spec.name);
      expect(params[1] instanceof Step).toBe(true);
      expect(params[1].status).toEqual('error');
      expect(params[2]).toBe(error);
    });

    it('should forward StepFailure event', function() {
      model.on('StepFailure', callback);
      runner.emit('SpecBegin', spec);
      runner.emit('StepBegin', spec, step);
      runner.emit('StepFailure', spec, step, {});

      expect(callback).toHaveBeenCalled();
    });

    it('should forward StepFailure event with Spec, Step and error as params', function() {
      var error = {};
      model.on('StepFailure', callback);
      runner.emit('SpecBegin', spec);
      runner.emit('StepBegin', spec, step);
      runner.emit('StepFailure', spec, step, error);

      var params = callback.calls.mostRecent().args;
      expect(params[0] instanceof Spec).toBe(true);
      expect(params[0].name).toEqual(spec.name);
      expect(params[1] instanceof Step).toBe(true);
      expect(params[1].status).toEqual('failure');
      expect(params[2]).toBe(error);
    });

    it('should forward StepEnd event', function() {
      model.on('StepEnd', callback);
      runner.emit('SpecBegin', spec);
      runner.emit('StepBegin', spec, step);
      runner.emit('StepEnd', spec, step);

      expect(callback).toHaveBeenCalled();
    });

    it('should forward StepEnd event with Spec and Step as params', function() {
      model.on('StepEnd', callback);
      runner.emit('SpecBegin', spec);
      runner.emit('StepBegin', spec, step);
      runner.emit('StepEnd', spec, step);

      var params = callback.calls.mostRecent().args;
      expect(params[0] instanceof Spec).toBe(true);
      expect(params[0].name).toEqual(spec.name);
      expect(params[1] instanceof Step).toBe(true);
    });

    it('should forward RunnerEnd event', function() {
      model.on('RunnerEnd', callback);
      runner.emit('RunnerEnd');
      expect(callback).toHaveBeenCalled();
    });

    it('should set error of first failure', function() {
      var error = 'first-error',
          step2 = buildStep();

      model.on('SpecEnd', function(spec) {
        expect(spec.error).toBeDefined();
        expect(spec.error).toBe(error);
      });

      runner.emit('SpecBegin', spec);
      runner.emit('StepBegin', spec, step);
      runner.emit('StepFailure', spec, step, error);
      runner.emit('StepBegin', spec, step2);
      runner.emit('StepFailure', spec, step2, 'second-error');
      runner.emit('SpecEnd', spec);
    });

    it('should set line number of first failure', function() {
      var step = buildStep('fake', 'first-line'),
          step2 = buildStep('fake2', 'second-line');

      model.on('SpecEnd', function(spec) {
        expect(spec.line).toBeDefined();
        expect(spec.line).toBe('first-line');
      });

      runner.emit('SpecBegin', spec);
      runner.emit('StepBegin', spec, step);
      runner.emit('StepFailure', spec, step, null);
      runner.emit('StepBegin', spec, step2);
      runner.emit('StepFailure', spec, step2, null);
      runner.emit('SpecEnd', spec);
    });
  });
});
