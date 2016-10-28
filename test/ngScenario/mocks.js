'use strict';

angular.scenario.testing = angular.scenario.testing || {};

angular.scenario.testing.MockAngular = function() {
  this.reset();
  this.element = jqLite;
};

angular.scenario.testing.MockAngular.prototype.reset = function() {
  this.log = [];
};

angular.scenario.testing.MockAngular.prototype.poll = function() {
  this.log.push('$browser.poll()');
  return this;
};

angular.scenario.testing.MockRunner = function() {
  this.listeners = [];
};

angular.scenario.testing.MockRunner.prototype.on = function(eventName, fn) {
  this.listeners[eventName] = this.listeners[eventName] || [];
  this.listeners[eventName].push(fn);
};

angular.scenario.testing.MockRunner.prototype.emit = function(eventName) {
  var args = Array.prototype.slice.call(arguments, 1);
  angular.forEach(this.listeners[eventName] || [], function(fn) {
    fn.apply(this, args);
  });
};
