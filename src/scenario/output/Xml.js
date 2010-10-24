/**
 * Generates XML output into a context.
 */
angular.scenario.output('xml', function(context, runner) {
  var model = new angular.scenario.ObjectModel(runner);

  runner.on('RunnerEnd', function() {
    context.append('<scenario></scenario>');
    serializeXml(context.find('> scenario'), model.value);
  });

  /**
   * Convert the tree into XML.
   *
   * @param {Object} context jQuery context to add the XML to.
   * @param {Object} tree node to serialize
   */
  function serializeXml(context, tree) {
     angular.foreach(tree.children, function(child) {
       context.append('<describe></describe>');
       var describeContext = context.find('> describe:last');
       describeContext.attr('id', child.id);
       describeContext.attr('name', child.name);
       serializeXml(describeContext, child);
     });
     context.append('<its></its>');
     context = context.find('> its');
     angular.foreach(tree.specs, function(spec) {
       context.append('<it></it>')
       var specContext = context.find('> it:last');
       specContext.attr('id', spec.id);
       specContext.attr('name', spec.name);
       specContext.attr('duration', spec.duration);
       specContext.attr('status', spec.status);
       angular.foreach(spec.steps, function(step) {
         specContext.append('<step></step>');
         var stepContext = specContext.find('> step:last');
         stepContext.attr('name', step.name);
         stepContext.attr('duration', step.duration);
         stepContext.attr('status', step.status);
         if (step.error) {
           stepContext.append('<error></error');
           stepContext.find('error').text(formatException(step.error));
         }
       });
     });
   }
});
