/**
 * User Interface for the Scenario Runner.
 *
 * TODO(esprehn): This should be refactored now that ObjectModel exists
 *  to use angular bindings for the UI.
 */
angular.scenario.output('html', function(context, runner) {
  var model = new angular.scenario.ObjectModel(runner);

  context.append(
    '<div id="header">' +
    '  <h1><span class="angular">&lt;angular/&gt;</span>: Scenario Test Runner</h1>' +
    '  <ul id="status-legend" class="status-display">' +
    '    <li class="status-error">0 Errors</li>' +
    '    <li class="status-failure">0 Failures</li>' +
    '    <li class="status-success">0 Passed</li>' +
    '  </ul>' +
    '</div>' +
    '<div id="specs">' +
    '  <div class="test-children"></div>' +
    '</div>'
  );

  runner.on('InteractiveWait', function(spec, step) {
    var ui = model.getSpec(spec.id).getLastStep().ui;
    ui.find('.test-title').
      html('waiting for you to <a href="javascript:resume()">resume</a>.');
  });

  runner.on('SpecBegin', function(spec) {
    var ui = findContext(spec);
    ui.find('> .tests').append(
      '<li class="status-pending test-it"></li>'
    );
    ui = ui.find('> .tests li:last');
    ui.append(
      '<div class="test-info">' +
      '  <p class="test-title">' +
      '    <span class="timer-result"></span>' +
      '    <span class="test-name"></span>' +
      '  </p>' +
      '</div>' +
      '<div class="scrollpane">' +
      '  <ol class="test-actions"></ol>' +
      '</div>'
    );
    ui.find('> .test-info .test-name').text(spec.name);
    ui.find('> .test-info').click(function() {
      var scrollpane = ui.find('> .scrollpane');
      var actions = scrollpane.find('> .test-actions');
      var name = context.find('> .test-info .test-name');
      if (actions.find(':visible').length) {
        actions.hide();
        name.removeClass('open').addClass('closed');
      } else {
        actions.show();
        scrollpane.attr('scrollTop', scrollpane.attr('scrollHeight'));
        name.removeClass('closed').addClass('open');
      }
    });
    model.getSpec(spec.id).ui = ui;
  });

  runner.on('SpecError', function(spec, error) {
    var ui = model.getSpec(spec.id).ui;
    ui.append('<pre></pre>');
    ui.find('> pre').text(formatException(error));
  });

  runner.on('SpecEnd', function(spec) {
    spec = model.getSpec(spec.id);
    spec.ui.removeClass('status-pending');
    spec.ui.addClass('status-' + spec.status);
    spec.ui.find("> .test-info .timer-result").text(spec.duration + "ms");
    if (spec.status === 'success') {
      spec.ui.find('> .test-info .test-name').addClass('closed');
      spec.ui.find('> .scrollpane .test-actions').hide();
    }
    updateTotals(spec.status);
  });

  runner.on('StepBegin', function(spec, step) {
    spec = model.getSpec(spec.id);
    step = spec.getLastStep();
    spec.ui.find('> .scrollpane .test-actions').
      append('<li class="status-pending"></li>');
    step.ui = spec.ui.find('> .scrollpane .test-actions li:last');
    step.ui.append(
      '<div class="timer-result"></div>' +
      '<div class="test-title"></div>'
    );
    step.ui.find('> .test-title').text(step.name);
    var scrollpane = step.ui.parents('.scrollpane');
    scrollpane.attr('scrollTop', scrollpane.attr('scrollHeight'));
  });

  runner.on('StepFailure', function(spec, step, error) {
    var ui = model.getSpec(spec.id).getLastStep().ui;
    addError(ui, step.line, error);
  });

  runner.on('StepError', function(spec, step, error) {
    var ui = model.getSpec(spec.id).getLastStep().ui;
    addError(ui, step.line, error);
  });

  runner.on('StepEnd', function(spec, step) {
    spec = model.getSpec(spec.id);
    step = spec.getLastStep();
    step.ui.find('.timer-result').text(step.duration + 'ms');
    step.ui.removeClass('status-pending');
    step.ui.addClass('status-' + step.status);
    var scrollpane = spec.ui.find('> .scrollpane');
    scrollpane.attr('scrollTop', scrollpane.attr('scrollHeight'));
  });

  /**
   * Finds the context of a spec block defined by the passed definition.
   *
   * @param {Object} The definition created by the Describe object.
   */
  function findContext(spec) {
    var currentContext = context.find('#specs');
    angular.foreach(model.getDefinitionPath(spec), function(defn) {
      var id = 'describe-' + defn.id;
      if (!context.find('#' + id).length) {
        currentContext.find('> .test-children').append(
          '<div class="test-describe" id="' + id + '">' +
          '  <h2></h2>' +
          '  <div class="test-children"></div>' +
          '  <ul class="tests"></ul>' +
          '</div>'
        );
        context.find('#' + id).find('> h2').text('describe: ' + defn.name);
      }
      currentContext = context.find('#' + id);
    });
    return context.find('#describe-' + spec.definition.id);
  };

  /**
   * Updates the test counter for the status.
   *
   * @param {string} the status.
   */
  function updateTotals(status) {
    var legend = context.find('#status-legend .status-' + status);
    var parts = legend.text().split(' ');
    var value = (parts[0] * 1) + 1;
    legend.text(value + ' ' + parts[1]);
  }

  /**
   * Add an error to a step.
   *
   * @param {Object} The JQuery wrapped context
   * @param {Function} fn() that should return the file/line number of the error
   * @param {Object} the error.
   */
  function addError(context, line, error) {
    context.find('.test-title').append('<pre></pre>');
    var message = _jQuery.trim(line() + '\n\n' + formatException(error));
    context.find('.test-title pre:last').text(message);
  };
});
