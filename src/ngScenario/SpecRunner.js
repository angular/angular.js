'use strict';

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
 * @param {Object} spec A spec object
 * @param {function()} specDone function that is called when the spec finishes,
 *                              of the form `Function(error, index)`
 */
angular.scenario.SpecRunner.prototype.run = function(spec, specDone) {
  var self = this;
  this.spec = spec;

  this.emit('SpecBegin', spec);

  try {
    spec.before.call(this);
    spec.body.call(this);
    this.afterIndex = this.futures.length;
    spec.after.call(this);
  } catch (e) {
    this.emit('SpecError', spec, e);
    this.emit('SpecEnd', spec);
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

  asyncForEach(
    this.futures,
    function(future, futureDone) {
      self.step = future;
      self.emit('StepBegin', spec, future);
      try {
        future.execute(function(error) {
          if (error) {
            self.emit('StepFailure', spec, future, error);
            self.emit('StepEnd', spec, future);
            return handleError(error, futureDone);
          }
          self.emit('StepEnd', spec, future);
          self.$window.setTimeout(function() { futureDone(); }, 0);
        });
      } catch (e) {
        self.emit('StepError', spec, future, e);
        self.emit('StepEnd', spec, future);
        handleError(e, futureDone);
      }
    },
    function(e) {
      if (e) {
        self.emit('SpecError', spec, e);
      }
      self.emit('SpecEnd', spec);
      // Call done in a timeout so exceptions don't recursively
      // call this function
      self.$window.setTimeout(function() { specDone(); }, 0);
    }
  );
};

/**
 * Adds a new future action.
 *
 * Note: Do not pass line manually. It happens automatically.
 *
 * @param {string} name Name of the future
 * @param {function()} behavior Behavior of the future
 * @param {function()} line fn() that returns file/line number
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
 * @param {string} name Name of the future
 * @param {function()} behavior Behavior of the future
 * @param {function()} line fn() that returns file/line number
 */
angular.scenario.SpecRunner.prototype.addFutureAction = function(name, behavior, line) {
  var self = this;
  var NG = /\[ng\\\:/;
  return this.addFuture(name, function(done) {
    this.application.executeAction(function($window, $document) {

      //TODO(esprehn): Refactor this so it doesn't need to be in here.
      $document.elements = function(selector) {
        var args = Array.prototype.slice.call(arguments, 1);
        selector = (self.selector || '') + ' ' + (selector || '');
        selector = _jQuery.trim(selector) || '*';
        angular.forEach(args, function(value, index) {
          selector = selector.replace('$' + (index + 1), value);
        });
        var result = $document.find(selector);
        if (selector.match(NG)) {
          angular.forEach(['[ng-','[data-ng-','[x-ng-'], function(value, index){
            result = result.add(selector.replace(NG, value), $document);
          });
        }
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
