'use strict';

/**
 * A future action in a spec.
 *
 * @param {string} name name of the future action
 * @param {function()} behavior future callback(error, result)
 * @param {function()} line Optional. function that returns the file/line number.
 */
angular.scenario.Future = function(name, behavior, line) {
  this.name = name;
  this.behavior = behavior;
  this.fulfilled = false;
  this.value = undefined;
  this.parser = angular.identity;
  this.line = line || function() { return ''; };
  this.readyHandler = undefined;
};

/**
 * Adds a callback function to be executed when the future has been fulfilled.
 * Example:
 * <code>
 * element('#myElement').html().ready(function(value) {
 *    window.console.log(value);//value will be the result of the future which n this case is the innerHTML of the element.
 * });
 * </code>
 *
 * @param {function()} The callback function to be executed after the future has been fulfilled.
 */
angular.scenario.Future.prototype.ready = function(fn) {
  this.readyHandler = fn;
};

/**
 * Executes the behavior of the closure.
 *
 * @param {function()} doneFn Callback function(error, result)
 */
angular.scenario.Future.prototype.execute = function(doneFn) {
  var self = this;
  this.behavior(function(error, result) {
    self.fulfilled = true;
    if (result) {
      try {
        result = self.parser(result);
      } catch (e) {
        error = e;
      }
    }
    self.value = error || result;
    doneFn(error, result);

    if (self.readyHandler) {
      self.readyHandler(self.value);
    }

  });
};

/**
 * Configures the future to convert its final with a function fn(value)
 *
 * @param {function()} fn function(value) that returns the parsed value
 */
angular.scenario.Future.prototype.parsedWith = function(fn) {
  this.parser = fn;
  return this;
};

/**
 * Configures the future to parse its final value from JSON
 * into objects.
 */
angular.scenario.Future.prototype.fromJson = function() {
  return this.parsedWith(angular.fromJson);
};

/**
 * Configures the future to convert its final value from objects
 * into JSON.
 */
angular.scenario.Future.prototype.toJson = function() {
  return this.parsedWith(angular.toJson);
};
