'use strict';

describe('angular.scenario.output.json', function() {
  var output, context;
  var runner, model, $window;
  var spec, step;

  beforeEach(function() {
    $window = {};
    context = _jQuery('<div></div>');
    runner = new angular.scenario.testing.MockRunner();
    model = new angular.scenario.ObjectModel(runner);
    output = angular.scenario.output.json(context, runner, model);
    spec = {
      name: 'test spec',
      definition: {
        id: 10,
        name: 'describe'
      }
    };
    step = {
      name: 'some step',
      line: function() { return 'unknown:-1'; }
    };
  });

  it('should put json in context on RunnerEnd', function() {
    runner.emit('SpecBegin', spec);
    runner.emit('StepBegin', spec, step);
    runner.emit('StepEnd', spec, step);
    runner.emit('SpecEnd', spec);
    runner.emit('RunnerEnd');

    expect(angular.fromJson(context.html()).children['describe']
      .specs['test spec'].status).toEqual('success');
  });
});
