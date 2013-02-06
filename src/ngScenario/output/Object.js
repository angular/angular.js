'use strict';

goog.provide('angular.scenario.output.Object');

goog.require('angular.scenario.output.Xml');

/**
 * Creates a global value $result with the result of the runner.
 */
angular.scenario.output('object', function(context, runner, model) {
  runner.$window.$result = model.value;
});
