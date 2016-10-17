'use strict';

/**
 * Generates XML output into a context.
 */
angular.scenario.output('xml', function(context, runner, model) {
  var $ = function(args) {
    // eslint-disable-next-line new-cap
    return new context.init(args);
  };
  model.on('RunnerEnd', function() {
    var scenario = $('<scenario></scenario>');
    context.append(scenario);
    serializeXml(scenario, model.value);
  });

  /**
   * Convert the tree into XML.
   *
   * @param {Object} context jQuery context to add the XML to.
   * @param {Object} tree node to serialize
   */
  function serializeXml(context, tree) {
     angular.forEach(tree.children, function(child) {
       var describeContext = $('<describe></describe>');
       describeContext.attr('id', child.id);
       describeContext.attr('name', child.name);
       context.append(describeContext);
       serializeXml(describeContext, child);
     });
     var its = $('<its></its>');
     context.append(its);
     angular.forEach(tree.specs, function(spec) {
       var it = $('<it></it>');
       it.attr('id', spec.id);
       it.attr('name', spec.name);
       it.attr('duration', spec.duration);
       it.attr('status', spec.status);
       its.append(it);
       angular.forEach(spec.steps, function(step) {
         var stepContext = $('<step></step>');
         stepContext.attr('name', step.name);
         stepContext.attr('duration', step.duration);
         stepContext.attr('status', step.status);
         it.append(stepContext);
         if (step.error) {
           var error = $('<error></error>');
           stepContext.append(error);
           error.text(formatException(step.error));
         }
       });
     });
   }
});
