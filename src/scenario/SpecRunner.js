/**
 * This class is the "this" of the it/beforeEach/afterEach method.
 * Responsibilities:
 *   - "this" for it/beforeEach/afterEach
 *   - keep state for single it/beforeEach/afterEach execution
 *   - keep track of all of the futures to execute
 *   - run single spec (execute each future)
 */
angular.scenario.SpecRunner = function() {
  this.futures = [];
};

/**
 * Executes a spec which is an it block with associated before/after functions
 * based on the describe nesting.
 *
 * @param {Object} An angular.scenario.UI implementation
 * @param {Object} A spec object
 * @param {Object} An angular.scenario.Application instance
 * @param {Function} Callback function that is called when the  spec finshes.
 */
angular.scenario.SpecRunner.prototype.run = function(ui, spec, specDone) {
  var specUI = ui.addSpec(spec);
  
  try {
    spec.fn.call(this);
  } catch (e) {
    specUI.error(e);
    specDone();
    return;
  }
  
  asyncForEach(
    this.futures, 
    function(future, futureDone) {
      var stepUI = specUI.addStep(future.name);
      try {
        future.execute(function(error) {
          stepUI.finish(error);
          futureDone(error);
        });
      } catch (e) {
        stepUI.error(e);
        rethrow(e);
      }
    }, 
    function(e) {
      specUI.finish(e); 
      specDone(); 
    }
  );
};

/**
 * Adds a new future action.
 *
 * @param {String} Name of the future
 * @param {Function} Behavior of the future
 */
angular.scenario.SpecRunner.prototype.addFuture = function(name, behavior) {
  var future = new angular.scenario.Future(name, angular.bind(this, behavior));
  this.futures.push(future);
  return future;
};

/**
 * Adds a new future action to be executed on the application window.
 *
 * @param {String} Name of the future
 * @param {Function} Behavior of the future
 */
angular.scenario.SpecRunner.prototype.addFutureAction = function(name, behavior) {
  return this.addFuture(name, function(done) {
    this.application.executeAction(function() {
      behavior.call(this, done);
    });
  });
};
