describe('angular.scenario.ObjectModel', function() {
  var model;
  var runner;
  var spec, step;

  beforeEach(function() {
    spec = {
      name: 'test spec',
      definition: {
        id: 10,
        name: 'describe 1'
      }
    };
    step = {
      name: 'test step',
      line: function() { return ''; }
    };
    runner = new angular.scenario.testing.MockRunner();
    model = new angular.scenario.ObjectModel(runner);
  });

  it('should value default empty value', function() {
    expect(model.value).toEqual({
      name: '',
      children: []
    });
  });

  it('should add spec and create describe blocks on SpecBegin event', function() {
    runner.emit('SpecBegin', {
      name: 'test spec',
      definition: {
        id: 10,
        name: 'describe 2',
        parent: {
          id: 12,
          name: 'describe 1'
        }
      }
    });

    expect(model.value.children['describe 1']).toBeDefined();
    expect(model.value.children['describe 1'].children['describe 2']).toBeDefined();
    expect(model.value.children['describe 1'].children['describe 2'].specs['test spec']).toBeDefined();
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
});
