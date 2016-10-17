'use strict';

/**
 * Runner for scenarios
 *
 * Has to be initialized before any test is loaded,
 * because it publishes the API into window (global space).
 */
angular.scenario.Runner = function($window) {
  this.listeners = [];
  this.$window = $window;
  this.rootDescribe = new angular.scenario.Describe();
  this.currentDescribe = this.rootDescribe;
  this.api = {
    it: this.it,
    iit: this.iit,
    xit: angular.noop,
    describe: this.describe,
    ddescribe: this.ddescribe,
    xdescribe: angular.noop,
    beforeEach: this.beforeEach,
    afterEach: this.afterEach
  };
  angular.forEach(this.api, angular.bind(this, /** @this */ function(fn, key) {
    this.$window[key] = angular.bind(this, fn);
  }));
};

/**
 * Emits an event which notifies listeners and passes extra
 * arguments.
 *
 * @param {string} eventName Name of the event to fire.
 */
angular.scenario.Runner.prototype.emit = function(eventName) {
  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);
  eventName = eventName.toLowerCase();
  if (!this.listeners[eventName]) {
    return;
  }
  angular.forEach(this.listeners[eventName], function(listener) {
    listener.apply(self, args);
  });
};

/**
 * Adds a listener for an event.
 *
 * @param {string} eventName The name of the event to add a handler for
 * @param {string} listener The fn(...) that takes the extra arguments from emit()
 */
angular.scenario.Runner.prototype.on = function(eventName, listener) {
  eventName = eventName.toLowerCase();
  this.listeners[eventName] = this.listeners[eventName] || [];
  this.listeners[eventName].push(listener);
};

/**
 * Defines a describe block of a spec.
 *
 * @see Describe.js
 *
 * @param {string} name Name of the block
 * @param {function()} body Body of the block
 */
angular.scenario.Runner.prototype.describe = function(name, body) {
  var self = this;
  this.currentDescribe.describe(name, /** @this */ function() {
    var parentDescribe = self.currentDescribe;
    self.currentDescribe = this;
    try {
      body.call(this);
    } finally {
      self.currentDescribe = parentDescribe;
    }
  });
};

/**
 * Same as describe, but makes ddescribe the only blocks to run.
 *
 * @see Describe.js
 *
 * @param {string} name Name of the block
 * @param {function()} body Body of the block
 */
angular.scenario.Runner.prototype.ddescribe = function(name, body) {
  var self = this;
  this.currentDescribe.ddescribe(name, /** @this */ function() {
    var parentDescribe = self.currentDescribe;
    self.currentDescribe = this;
    try {
      body.call(this);
    } finally {
      self.currentDescribe = parentDescribe;
    }
  });
};

/**
 * Defines a test in a describe block of a spec.
 *
 * @see Describe.js
 *
 * @param {string} name Name of the block
 * @param {function()} body Body of the block
 */
angular.scenario.Runner.prototype.it = function(name, body) {
  this.currentDescribe.it(name, body);
};

/**
 * Same as it, but makes iit tests the only tests to run.
 *
 * @see Describe.js
 *
 * @param {string} name Name of the block
 * @param {function()} body Body of the block
 */
angular.scenario.Runner.prototype.iit = function(name, body) {
  this.currentDescribe.iit(name, body);
};

/**
 * Defines a function to be called before each it block in the describe
 * (and before all nested describes).
 *
 * @see Describe.js
 *
 * @param {function()} Callback to execute
 */
angular.scenario.Runner.prototype.beforeEach = function(body) {
  this.currentDescribe.beforeEach(body);
};

/**
 * Defines a function to be called after each it block in the describe
 * (and before all nested describes).
 *
 * @see Describe.js
 *
 * @param {function()} Callback to execute
 */
angular.scenario.Runner.prototype.afterEach = function(body) {
  this.currentDescribe.afterEach(body);
};

/**
 * Creates a new spec runner.
 *
 * @private
 * @param {Object} scope parent scope
 */
angular.scenario.Runner.prototype.createSpecRunner_ = function(scope) {
  var child = scope.$new();
  var Cls = angular.scenario.SpecRunner;

  // Export all the methods to child scope manually as now we don't mess controllers with scopes
  // TODO(vojta): refactor scenario runner so that these objects are not tightly coupled as current
  for (var name in Cls.prototype) {
    child[name] = angular.bind(child, Cls.prototype[name]);
  }

  Cls.call(child);
  return child;
};

/**
 * Runs all the loaded tests with the specified runner class on the
 * provided application.
 *
 * @param {angular.scenario.Application} application App to remote control.
 */
angular.scenario.Runner.prototype.run = function(application) {
  var self = this;
  var $root = angular.injector(['ng']).get('$rootScope');
  angular.extend($root, this);
  angular.forEach(angular.scenario.Runner.prototype, function(fn, name) {
    $root[name] = angular.bind(self, fn);
  });
  $root.application = application;
  $root.emit('RunnerBegin');
  asyncForEach(this.rootDescribe.getSpecs(), function(spec, specDone) {
    var dslCache = {};
    var runner = self.createSpecRunner_($root);
    angular.forEach(angular.scenario.dsl, function(fn, key) {
      dslCache[key] = fn.call($root);
    });
    angular.forEach(angular.scenario.dsl, function(fn, key) {
      self.$window[key] = function() {
        var line = callerFile(3);
        var scope = runner.$new();

        // Make the dsl accessible on the current chain
        scope.dsl = {};
        angular.forEach(dslCache, function(fn, key) {
          scope.dsl[key] = function() {
            return dslCache[key].apply(scope, arguments);
          };
        });

        // Make these methods work on the current chain
        scope.addFuture = function() {
          Array.prototype.push.call(arguments, line);
          return angular.scenario.SpecRunner.
            prototype.addFuture.apply(scope, arguments);
        };
        scope.addFutureAction = function() {
          Array.prototype.push.call(arguments, line);
          return angular.scenario.SpecRunner.
            prototype.addFutureAction.apply(scope, arguments);
        };

        return scope.dsl[key].apply(scope, arguments);
      };
    });
    runner.run(spec, /** @this */ function() {
      runner.$destroy();
      specDone.apply(this, arguments);
    });
  },
  function(error) {
    if (error) {
      self.emit('RunnerError', error);
    }
    self.emit('RunnerEnd');
  });
};
