/**
 * Maintains an object tree from the runner events.
 *
 * @param {Object} runner The scenario Runner instance to connect to.
 *
 * TODO(esprehn): Every output type creates one of these, but we probably
 *  want one glonal shared instance. Need to handle events better too
 *  so the HTML output doesn't need to do spec model.getSpec(spec.id)
 *  silliness.
 */
angular.scenario.ObjectModel = function(runner) {
  var self = this;

  this.specMap = {};
  this.value = {
    name: '',
    children: {}
  };

  runner.on('SpecBegin', function(spec) {
    var block = self.value;
    angular.forEach(self.getDefinitionPath(spec), function(def) {
      if (!block.children[def.name]) {
        block.children[def.name] = {
          id: def.id,
          name: def.name,
          children: {},
          specs: {}
        };
      }
      block = block.children[def.name];
    });
    self.specMap[spec.id] = block.specs[spec.name] =
      new angular.scenario.ObjectModel.Spec(spec.id, spec.name);
  });

  runner.on('SpecError', function(spec, error) {
    var it = self.getSpec(spec.id);
    it.status = 'error';
    it.error = error;
  });

  runner.on('SpecEnd', function(spec) {
    var it = self.getSpec(spec.id);
    complete(it);
  });

  runner.on('StepBegin', function(spec, step) {
    var it = self.getSpec(spec.id);
    it.steps.push(new angular.scenario.ObjectModel.Step(step.name));
  });

  runner.on('StepEnd', function(spec, step) {
    var it = self.getSpec(spec.id);
    if (it.getLastStep().name !== step.name)
      throw 'Events fired in the wrong order. Step names don\' match.';
    complete(it.getLastStep());
  });

  runner.on('StepFailure', function(spec, step, error) {
    var it = self.getSpec(spec.id);
    var item = it.getLastStep();
    item.error = error;
    if (!it.status) {
      it.status = item.status = 'failure';
    }
  });

  runner.on('StepError', function(spec, step, error) {
    var it = self.getSpec(spec.id);
    var item = it.getLastStep();
    it.status = 'error';
    item.status = 'error';
    item.error = error;
  });

  function complete(item) {
    item.endTime = new Date().getTime();
    item.duration = item.endTime - item.startTime;
    item.status = item.status || 'success';
  }
};

/**
 * Computes the path of definition describe blocks that wrap around
 * this spec.
 *
 * @param spec Spec to compute the path for.
 * @return {Array<Describe>} The describe block path
 */
angular.scenario.ObjectModel.prototype.getDefinitionPath = function(spec) {
  var path = [];
  var currentDefinition = spec.definition;
  while (currentDefinition && currentDefinition.name) {
    path.unshift(currentDefinition);
    currentDefinition = currentDefinition.parent;
  }
  return path;
};

/**
 * Gets a spec by id.
 *
 * @param {string} The id of the spec to get the object for.
 * @return {Object} the Spec instance
 */
angular.scenario.ObjectModel.prototype.getSpec = function(id) {
  return this.specMap[id];
};

/**
 * A single it block.
 *
 * @param {string} id Id of the spec
 * @param {string} name Name of the spec
 */
angular.scenario.ObjectModel.Spec = function(id, name) {
  this.id = id;
  this.name = name;
  this.startTime = new Date().getTime();
  this.steps = [];
};

/**
 * Adds a new step to the Spec.
 *
 * @param {string} step Name of the step (really name of the future)
 * @return {Object} the added step
 */
angular.scenario.ObjectModel.Spec.prototype.addStep = function(name) {
  var step = new angular.scenario.ObjectModel.Step(name);
  this.steps.push(step);
  return step;
};

/**
 * Gets the most recent step.
 *
 * @return {Object} the step
 */
angular.scenario.ObjectModel.Spec.prototype.getLastStep = function() {
  return this.steps[this.steps.length-1];
};

/**
 * A single step inside a Spec.
 *
 * @param {string} step Name of the step
 */
angular.scenario.ObjectModel.Step = function(name) {
  this.name = name;
  this.startTime = new Date().getTime();
};
