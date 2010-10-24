/**
 * Generates JSON output into a context.
 */
angular.scenario.output('json', function(context, runner) {
  var model = new angular.scenario.ObjectModel(runner);
  
  runner.on('RunnerEnd', function() {
    context.text(angular.toJson(model.value));
  });
});
