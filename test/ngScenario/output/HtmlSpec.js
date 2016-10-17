'use strict';

describe('angular.scenario.output.html', function() {
  var runner, model, spec, step, listeners, ui, context;

  beforeEach(function() {
    listeners = [];
    spec = {
      name: 'test spec',
      definition: {
        id: 10,
        name: 'child',
        children: [],
        parent: {
          id: 20,
          name: 'parent',
          children: []
        }
      }
    };
    step = {
      name: 'some step',
      line: function() { return 'unknown:-1'; }
    };
    runner = new angular.scenario.testing.MockRunner();
    model = new angular.scenario.ObjectModel(runner);
    context = _jQuery('<div></div>');
    ui = angular.scenario.output.html(context, runner, model);
  });

  it('should create nested describe context', function() {
    runner.emit('SpecBegin', spec);
    expect(context.find('#describe-20 #describe-10 > h2').text()).
      toEqual('describe: child');
    expect(context.find('#describe-20 > h2').text()).toEqual('describe: parent');
    expect(context.find('#describe-10 .tests > li .test-info .test-name').text()).
      toEqual('test spec');
    expect(context.find('#describe-10 .tests > li').hasClass('status-pending')).
      toBeTruthy();
  });

  it('should add link on InteractivePause', function() {
    runner.emit('SpecBegin', spec);
    runner.emit('StepBegin', spec, step);
    runner.emit('StepEnd', spec, step);
    runner.emit('StepBegin', spec, step);
    runner.emit('InteractivePause', spec, step);
    expect(context.find('.test-actions .test-title:first').text()).toEqual('some step');
    expect(lowercase(context.find('.test-actions .test-title:last').html())).toEqual(
      'paused... <a href="javascript:resume()">resume</a> when ready.'
    );
  });

  it('should update totals when steps complete', function() {
    // Failure
    for (var i = 0; i < 3; ++i) {
      runner.emit('SpecBegin', spec);
      runner.emit('StepBegin', spec, step);
      runner.emit('StepFailure', spec, step, 'error');
      runner.emit('StepEnd', spec, step);
      runner.emit('SpecEnd', spec);
    }

    // Error
    runner.emit('SpecBegin', spec);
    runner.emit('SpecError', spec, 'error');
    runner.emit('SpecEnd', spec);

    // Error
    runner.emit('SpecBegin', spec);
    runner.emit('StepBegin', spec, step);
    runner.emit('StepError', spec, step, 'error');
    runner.emit('StepEnd', spec, step);
    runner.emit('SpecEnd', spec);

    // Success
    runner.emit('SpecBegin', spec);
    runner.emit('StepBegin', spec, step);
    runner.emit('StepEnd', spec, step);
    runner.emit('SpecEnd', spec);

    expect(parseInt(context.find('#status-legend .status-failure').text(), 10)).
      toEqual(3);
    expect(parseInt(context.find('#status-legend .status-error').text(), 10)).
      toEqual(2);
    expect(parseInt(context.find('#status-legend .status-success').text(), 10)).
      toEqual(1);
  });

  it('should update timer when test completes', function() {
    // Success
    runner.emit('SpecBegin', spec);
    runner.emit('StepBegin', spec, step);
    runner.emit('StepEnd', spec, step);
    runner.emit('SpecEnd', spec);

    // Failure
    runner.emit('SpecBegin', spec);
    runner.emit('StepBegin', spec, step);
    runner.emit('StepFailure', spec, step, 'error');
    runner.emit('StepEnd', spec, step);
    runner.emit('SpecEnd', spec);

    // Error
    runner.emit('SpecBegin', spec);
    runner.emit('SpecError', spec, 'error');
    runner.emit('SpecEnd', spec);

    context.find('#describe-10 .tests > li .test-info .timer-result').
      each(function(index, timer) {
        expect(timer.innerHTML).toMatch(/ms$/);
      }
    );
  });

  it('should include line if provided', function() {
    runner.emit('SpecBegin', spec);
    runner.emit('StepBegin', spec, step);
    runner.emit('StepFailure', spec, step, 'error');
    runner.emit('StepEnd', spec, step);
    runner.emit('SpecEnd', spec);

    var errorHtml = context.find('#describe-10 .tests li pre').html();
    expect(errorHtml.indexOf('unknown:-1')).toEqual(0);
  });

});
