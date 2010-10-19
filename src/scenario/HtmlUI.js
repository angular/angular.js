/**
 * User Interface for the Scenario Runner.
 *
 * @param {Object} The jQuery UI object for the UI.
 */
angular.scenario.ui.Html = function(context) {
  this.context = context;
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
};

/**
 * The severity order of an error.
 */
angular.scenario.ui.Html.SEVERITY = ['pending', 'success', 'failure', 'error'];

/**
 * Adds a new spec to the UI.
 *
 * @param {Object} The spec object created by the Describe object.
 */
angular.scenario.ui.Html.prototype.addSpec = function(spec) {
  var self = this;
  var specContext = this.findContext(spec.definition);
  specContext.find('> .tests').append(
    '<li class="status-pending test-it"></li>'
  );
  specContext = specContext.find('> .tests li:last');
  return new angular.scenario.ui.Html.Spec(specContext, spec.name, 
    function(status) {
      status = self.context.find('#status-legend .status-' + status);
      var parts = status.text().split(' ');
      var value = (parts[0] * 1) + 1;
      status.text(value + ' ' + parts[1]);
    }
  );
};

/**
 * Finds the context of a spec block defined by the passed definition.
 *
 * @param {Object} The definition created by the Describe object.
 */
angular.scenario.ui.Html.prototype.findContext = function(definition) {
  var self = this;
  var path = [];
  var currentContext = this.context.find('#specs');
  var currentDefinition = definition;
  while (currentDefinition && currentDefinition.name) {
    path.unshift(currentDefinition);
    currentDefinition = currentDefinition.parent;
  }
  angular.foreach(path, function(defn) {
    var id = 'describe-' + defn.id;
    if (!self.context.find('#' + id).length) {
      currentContext.find('> .test-children').append(
        '<div class="test-describe" id="' + id + '">' +
        '  <h2></h2>' +
        '  <div class="test-children"></div>' +
        '  <ul class="tests"></ul>' +
        '</div>'
      );
      self.context.find('#' + id).find('> h2').text('describe: ' + defn.name);
    }
    currentContext = self.context.find('#' + id);
  });
  return this.context.find('#describe-' + definition.id);
};

/**
 * A spec block in the UI.
 *
 * @param {Object} The jQuery object for the context of the spec.
 * @param {String} The name of the spec.
 * @param {Function} Callback function(status) to call when complete.
 */
angular.scenario.ui.Html.Spec = function(context, name, doneFn) {
  this.status = 'pending';
  this.context = context;
  this.startTime = new Date().getTime();
  this.doneFn = doneFn;
  context.append(
    '<div class="test-info">' +
    '  <p class="test-title">' +
    '    <span class="timer-result"></span>' +
    '    <span class="test-name"></span>' +
    '  </p>' +
    '</div>' +
    '<div class="scrollpane">' +
    '  <ol class="test-actions">' +
    '  </ol>' +
    '</div>'
  );
  context.find('> .test-info').click(function() {
    var scrollpane = context.find('> .scrollpane');
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
  context.find('> .test-info .test-name').text('it ' + name);
};

/**
 * Adds a new Step to this spec and returns it.
 *
 * @param {String} The name of the step.
 * @param {Function} function() that returns a string with the file/line number
 *  where the step was added from.
 */
angular.scenario.ui.Html.Spec.prototype.addStep = function(name, location) {
  this.context.find('> .scrollpane .test-actions').append('<li class="status-pending"></li>');
  var stepContext = this.context.find('> .scrollpane .test-actions li:last');
  var self = this;
  return new angular.scenario.ui.Html.Step(stepContext, name, location, function(status) {
    if (indexOf(angular.scenario.ui.Html.SEVERITY, status) >
      indexOf(angular.scenario.ui.Html.SEVERITY, self.status)) {
      self.status = status;
    }
    var scrollpane = self.context.find('> .scrollpane');
    scrollpane.attr('scrollTop', scrollpane.attr('scrollHeight'));
  });
};

/**
 * Completes the spec and sets the timer value.
 */
angular.scenario.ui.Html.Spec.prototype.complete = function() {
  this.context.removeClass('status-pending');
  var endTime = new Date().getTime();
  this.context.find("> .test-info .timer-result").
    text((endTime - this.startTime) + "ms");
  if (this.status === 'success') {
    this.context.find('> .test-info .test-name').addClass('closed');
    this.context.find('> .scrollpane .test-actions').hide();
  }
};

/**
 * Finishes the spec, possibly with an error.
 *
 * @param {Object} An optional error
 */
angular.scenario.ui.Html.Spec.prototype.finish = function() {
  this.complete();
  this.context.addClass('status-' + this.status);
  this.doneFn(this.status);
};

/**
 * Finishes the spec, but with a Fatal Error.
 *
 * @param {Object} Required error
 */
angular.scenario.ui.Html.Spec.prototype.error = function(error) {
  this.status = 'error';
  this.context.append('<pre></pre>');
  this.context.find('> pre').text(formatException(error));
  this.finish();
};

/**
 * A single step inside an it block (or a before/after function).
 *
 * @param {Object} The jQuery object for the context of the step.
 * @param {String} The name of the step.
 * @param {Function} function() that returns file/line number of step.
 * @param {Function} Callback function(status) to call when complete.
 */
angular.scenario.ui.Html.Step = function(context, name, location, doneFn) {
  this.context = context;
  this.name = name;
  this.location = location;
  this.startTime = new Date().getTime();
  this.doneFn = doneFn;
  context.append(
    '<div class="timer-result"></div>' +
    '<div class="test-title"></div>'
  );
  context.find('> .test-title').text(name);
  var scrollpane = context.parents('.scrollpane');
  scrollpane.attr('scrollTop', scrollpane.attr('scrollHeight'));
};

/**
 * Completes the step and sets the timer value.
 */
angular.scenario.ui.Html.Step.prototype.complete = function(error) {
  this.context.removeClass('status-pending');
  var endTime = new Date().getTime();
  this.context.find(".timer-result").
    text((endTime - this.startTime) + "ms");
  if (error) {
    if (!this.context.find('.test-title pre').length) {
      this.context.find('.test-title').append('<pre></pre>');
    }
    var message = _jQuery.trim(this.location() + '\n\n' + formatException(error));
    this.context.find('.test-title pre').text(message);
  }
};

/**
 * Finishes the step, possibly with an error.
 *
 * @param {Object} An optional error
 */
angular.scenario.ui.Html.Step.prototype.finish = function(error) {
  this.complete(error);
  if (error) {
    this.context.addClass('status-failure');
    this.doneFn('failure');
  } else {
    this.context.addClass('status-success');
    this.doneFn('success');
  }
};

/**
 * Finishes the step, but with a Fatal Error.
 *
 * @param {Object} Required error
 */
angular.scenario.ui.Html.Step.prototype.error = function(error) {
  this.complete(error);
  this.context.addClass('status-error');
  this.doneFn('error');
};
