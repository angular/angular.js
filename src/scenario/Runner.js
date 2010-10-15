/**
 * Runner for scenarios.
 */
angular.scenario.Runner = function($window) {
  this.$window = $window;
  this.rootDescribe = new angular.scenario.Describe();
  this.currentDescribe = this.rootDescribe;
  this.api = {
    it: this.it,
    xit: angular.noop,
    describe: this.describe,
    xdescribe: angular.noop,
    beforeEach: this.beforeEach,
    afterEach: this.afterEach
  };
  angular.foreach(this.api, angular.bind(this, function(fn, key) {
    this.$window[key] = angular.bind(this, fn);
  }));
};

/**
 * Defines a describe block of a spec.
 *
 * @param {String} Name of the block
 * @param {Function} Body of the block
 */
angular.scenario.Runner.prototype.describe = function(name, body) {
  var self = this;
  this.currentDescribe.describe(name, function() {
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
 * @param {String} Name of the block
 * @param {Function} Body of the block
 */
angular.scenario.Runner.prototype.it = function(name, body) {
  this.currentDescribe.it(name, body);
};

/**
 * Defines a function to be called before each it block in the describe
 * (and before all nested describes).
 *
 * @param {Function} Callback to execute
 */
angular.scenario.Runner.prototype.beforeEach = function(body) {
  this.currentDescribe.beforeEach(body);
};

/**
 * Defines a function to be called after each it block in the describe
 * (and before all nested describes).
 *
 * @param {Function} Callback to execute
 */
angular.scenario.Runner.prototype.afterEach = function(body) {
  this.currentDescribe.afterEach(body);
};

/**
 * Defines a function to be called before each it block in the describe
 * (and before all nested describes).
 *
 * @param {Function} Callback to execute
 */
angular.scenario.Runner.prototype.run = function(ui, application, specRunnerClass, specsDone) {
  var $root = angular.scope({}, angular.service);
  var self = this;
  var specs = this.rootDescribe.getSpecs();
  $root.application = application;
  $root.ui = ui;
  $root.setTimeout = function() {
    return self.$window.setTimeout.apply(self.$window, arguments);
  };
  asyncForEach(specs, angular.bind(this, function(spec, specDone) {
    var runner = angular.scope($root);
    runner.$become(specRunnerClass);
    angular.foreach(angular.scenario.dsl, angular.bind(this, function(fn, key) {
      this.$window[key] = function() {
        return fn.call($root).apply(angular.scope(runner), arguments);
      };
    }));
    runner.run(ui, spec, specDone);
  }), specsDone || angular.noop);
};
