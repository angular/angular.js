/**
 * A future action in a spec.
 *
 * @param {string} name of the future action
 * @param {Function} future callback(error, result)
 * @param {Function} Optional. function that returns the file/line number.
 */
angular.scenario.Future = function(name, behavior, line) {
  this.name = name;
  this.behavior = behavior;
  this.fulfilled = false;
  this.value = undefined;
  this.parser = angular.identity;
  this.line = line || function() { return ''; };
};

/**
 * Executes the behavior of the closure.
 *
 * @param {Function} doneFn Callback function(error, result)
 */
angular.scenario.Future.prototype.execute = function(doneFn) {
  var self = this;
  this.behavior(function(error, result) {
    self.fulfilled = true;
    if (result) {
      try {
        result = self.parser(result);
      } catch(e) {
        error = e;
      }
    }
    self.value = error || result;
    doneFn(error, result);
  });
};

/**
 * Configures the future to convert it's final with a function fn(value)
 *
 * @param {Function} fn function(value) that returns the parser
 */
angular.scenario.Future.prototype.parsedWith = function(fn) {
  this.parser = fn;
  return this;
};

/**
 * Configures the future to parse it's final value from JSON
 * into objects.
 */
angular.scenario.Future.prototype.fromJson = function() {
  return this.parsedWith(angular.fromJson);
};

/**
 * Configures the future to convert it's final value from objects
 * into JSON.
 */
angular.scenario.Future.prototype.toJson = function() {
  return this.parsedWith(angular.toJson);
};
