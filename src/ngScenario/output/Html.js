'use strict';

/**
 * User Interface for the Scenario Runner.
 *
 * TODO(esprehn): This should be refactored now that ObjectModel exists
 *  to use AngularJS bindings for the UI.
 */
angular.scenario.output('html', function(context, runner, model) {
  var specUiMap = {},
      lastStepUiMap = {};

  context.append(
    '<div id="header">' +
    '  <h1><span class="angular">AngularJS</span>: Scenario Test Runner</h1>' +
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

  runner.on('InteractivePause', function(spec) {
    var ui = lastStepUiMap[spec.id];
    ui.find('.test-title').
      html('paused... <a href="javascript:resume()">resume</a> when ready.');
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

    specUiMap[spec.id] = ui;
  });

  runner.on('SpecError', function(spec, error) {
    var ui = specUiMap[spec.id];
    ui.append('<pre></pre>');
    ui.find('> pre').text(formatException(error));
  });

  runner.on('SpecEnd', function(spec) {
    var ui = specUiMap[spec.id];
    spec = model.getSpec(spec.id);
    ui.removeClass('status-pending');
    ui.addClass('status-' + spec.status);
    ui.find('> .test-info .timer-result').text(spec.duration + 'ms');
    if (spec.status === 'success') {
      ui.find('> .test-info .test-name').addClass('closed');
      ui.find('> .scrollpane .test-actions').hide();
    }
    updateTotals(spec.status);
  });

  runner.on('StepBegin', function(spec, step) {
    var ui = specUiMap[spec.id];
    spec = model.getSpec(spec.id);
    step = spec.getLastStep();
    ui.find('> .scrollpane .test-actions').append('<li class="status-pending"></li>');
    var stepUi = lastStepUiMap[spec.id] = ui.find('> .scrollpane .test-actions li:last');
    stepUi.append(
      '<div class="timer-result"></div>' +
      '<div class="test-title"></div>'
    );
    stepUi.find('> .test-title').text(step.name);
    var scrollpane = stepUi.parents('.scrollpane');
    scrollpane.attr('scrollTop', scrollpane.attr('scrollHeight'));
  });

  runner.on('StepFailure', function(spec, step, error) {
    var ui = lastStepUiMap[spec.id];
    addError(ui, step.line, error);
  });

  runner.on('StepError', function(spec, step, error) {
    var ui = lastStepUiMap[spec.id];
    addError(ui, step.line, error);
  });

  runner.on('StepEnd', function(spec, step) {
    var stepUi = lastStepUiMap[spec.id];
    spec = model.getSpec(spec.id);
    step = spec.getLastStep();
    stepUi.find('.timer-result').text(step.duration + 'ms');
    stepUi.removeClass('status-pending');
    stepUi.addClass('status-' + step.status);
    var scrollpane = specUiMap[spec.id].find('> .scrollpane');
    scrollpane.attr('scrollTop', scrollpane.attr('scrollHeight'));
  });

  /**
   * Finds the context of a spec block defined by the passed definition.
   *
   * @param {Object} The definition created by the Describe object.
   */
  function findContext(spec) {
    var currentContext = context.find('#specs');
    angular.forEach(model.getDefinitionPath(spec), function(defn) {
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
  }

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
   * @param {function()} fn() that should return the file/line number of the error
   * @param {Object} the error.
   */
  function addError(context, line, error) {
    context.find('.test-title').append('<pre></pre>');
    var message = _jQuery.trim(line() + '\n\n' + formatException(error));
    context.find('.test-title pre:last').text(message);
  }
});
