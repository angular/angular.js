/**
 * A future action in a spec.
 */
angular.scenario.Future = function(name, behavior) {
  this.name = name;
  this.behavior = behavior;
  this.fulfilled = false;
  this.value = undefined;
  this.parser = angular.identity;
};

/**
 * Executes the behavior of the closure.
 *
 * @param {Function} Callback function(error, result)
 */
angular.scenario.Future.prototype.execute = function(doneFn) {
  this.behavior(angular.bind(this, function(error, result) {
    this.fulfilled = true;
    if (result) {
      try {
        result = this.parser(result);
      } catch(e) {
        error = e;
      }
    }
    this.value = error || result;
    doneFn(error, result);
  }));
};

/**
 * Configures the future to convert it's final with a function fn(value)
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
