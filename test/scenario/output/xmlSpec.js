describe('angular.scenario.output.json', function() {
  var output, context;
  var runner, model, $window;
  var spec, step;

  beforeEach(function() {
    $window = {};
    context = _jQuery('<div></div>');
    runner = new angular.scenario.testing.MockRunner();
    model = new angular.scenario.ObjectModel(runner);
    output = angular.scenario.output.xml(context, runner, model);
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

  it('should create XML nodes for object model', function() {
    runner.emit('SpecBegin', spec);
    runner.emit('StepBegin', spec, step);
    runner.emit('StepEnd', spec, step);
    runner.emit('SpecEnd', spec);
    runner.emit('RunnerEnd');
    expect(context.find('it').attr('status')).toEqual('success');
    expect(context.find('it step').attr('status')).toEqual('success');
  });
});
