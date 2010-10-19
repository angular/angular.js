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
  this.afterIndex = 0;
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
  var self = this;
  var specUI = ui.addSpec(spec);

  try {
    spec.before.call(this);
    spec.body.call(this);
    this.afterIndex = this.futures.length;
    spec.after.call(this);
  } catch (e) {
    specUI.error(e);
    specDone();
    return;
  }

  var handleError = function(error, done) {
    if (self.error) {
      return done();
    }
    self.error = true;
    done(null, self.afterIndex);
  };
  
  var spec = this;
  asyncForEach(
    this.futures,
    function(future, futureDone) {
      var stepUI = specUI.addStep(future.name, future.line);
      try {
        future.execute(function(error) {
          stepUI.finish(error);
          if (error) {
            return handleError(error, futureDone);
          }
          spec.$window.setTimeout( function() { futureDone(); }, 0);
        });
      } catch (e) {
        stepUI.error(e);
        handleError(e, futureDone);
      }
    },
    function(e) {
      if (e) {
        specUI.error(e);
      } else {
        specUI.finish();
      }
      specDone();
    }
  );
};

/**
 * Adds a new future action.
 *
 * Note: Do not pass line manually. It happens automatically.
 *
 * @param {String} Name of the future
 * @param {Function} Behavior of the future
 * @param {Function} fn() that returns file/line number
 */
angular.scenario.SpecRunner.prototype.addFuture = function(name, behavior, line) {
  var future = new angular.scenario.Future(name, angular.bind(this, behavior), line);
  this.futures.push(future);
  return future;
};

/**
 * Adds a new future action to be executed on the application window.
 *
 * Note: Do not pass line manually. It happens automatically.
 *
 * @param {String} Name of the future
 * @param {Function} Behavior of the future
 * @param {Function} fn() that returns file/line number 
 */
angular.scenario.SpecRunner.prototype.addFutureAction = function(name, behavior, line) {
  var self = this;
  return this.addFuture(name, function(done) {
    this.application.executeAction(function($window, $document) {
      $document.elements = function(selector) {
        var args = Array.prototype.slice.call(arguments, 1);
        if (self.selector) {
          selector = self.selector + ' ' + (selector || '');
        }
        angular.foreach(args, function(value, index) {
          selector = selector.replace('$' + (index + 1), value);
        });
        var result = $document.find(selector);
        if (!result.length) {
          throw {
            type: 'selector',
            message: 'Selector ' + selector + ' did not match any elements.'
          };
        }

        return result;
      };

      try {
        behavior.call(self, $window, $document, done);
      } catch(e) {
        if (e.type && e.type === 'selector') {
          done(e.message);
        } else {
          throw e;
        }
      }
    });
  }, line);
};
