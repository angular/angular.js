/**
 * Creates a global value $result with the result of the runner.
 */
angular.scenario.output('object', function(context, runner) {
  runner.$window.$result = new angular.scenario.ObjectModel(runner).value;
});
