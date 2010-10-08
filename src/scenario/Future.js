/**
 * A future action in a spec.
 */
angular.scenario.Future = function(name, behavior) {
  this.name = name;
  this.behavior = behavior;
  this.fulfilled = false;
  this.value = undefined;
};

/**
 * Executes the behavior of the closure.
 *
 * @param {Function} Callback function(error, result)
 */
angular.scenario.Future.prototype.execute = function(doneFn) {
  this.behavior(angular.bind(this, function(error, result) {
    this.fulfilled = true;
    this.value = error || result;
    doneFn(error, result);
  }));
};
