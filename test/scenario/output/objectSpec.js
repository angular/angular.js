'use strict';

describe('angular.scenario.output.object', function() {
  var output;
  var runner, model, $window;
  var spec, step;

  beforeEach(function() {
    $window = {};
    runner = new angular.scenario.testing.MockRunner();
    model = new angular.scenario.ObjectModel(runner);
    runner.$window = $window;
    output = angular.scenario.output.object(null, runner, model);
    spec = {
      name: 'test spec',
      definition: {
        id: 10,
        name: 'describe',
        children: []
      }
    };
    step = {
      name: 'some step',
      line: function() { return 'unknown:-1'; }
    };
  });

  it('should create a global variable $result', function() {
    expect($window.$result).toBeDefined();
  });

  it('should maintain live state in $result', function() {
    runner.emit('SpecBegin', spec);
    runner.emit('StepBegin', spec, step);
    runner.emit('StepEnd', spec, step);

    expect($window.$result.children['describe']
      .specs['test spec'].steps[0].duration).toBeDefined();
  });
});
