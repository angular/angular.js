/**
 * The representation of define blocks. Don't used directly, instead use
 * define() in your tests.
 */
angular.scenario.Describe = function(descName, parent) {
  this.beforeEachFns = [];
  this.afterEachFns = [];
  this.its = [];
  this.children = [];
  this.name = descName;
  this.parent = parent;
  this.id = angular.scenario.Describe.id++;
  
  /**
   * Calls all before functions.
   */
  var beforeEachFns = this.beforeEachFns;
  this.setupBefore = function() {
    if (parent) parent.setupBefore.call(this);
    angular.foreach(beforeEachFns, function(fn) { fn.call(this); }, this);
  };

  /**
   * Calls all after functions.
   */
  var afterEachFns = this.afterEachFns;
  this.setupAfter  = function() {
    angular.foreach(afterEachFns, function(fn) { fn.call(this); }, this);
    if (parent) parent.setupAfter.call(this);
  };
};

// Shared Unique ID generator for every describe block
angular.scenario.Describe.id = 0;

/**
 * Defines a block to execute before each it or nested describe.
 *
 * @param {Function} Body of the block.
 */
angular.scenario.Describe.prototype.beforeEach = function(body) {
  this.beforeEachFns.push(body);
};

/**
 * Defines a block to execute after each it or nested describe.
 *
 * @param {Function} Body of the block.
 */
angular.scenario.Describe.prototype.afterEach = function(body) {
  this.afterEachFns.push(body);
};

/**
 * Creates a new describe block that's a child of this one.
 *
 * @param {String} Name of the block. Appended to the parent block's name.
 * @param {Function} Body of the block.
 */
angular.scenario.Describe.prototype.describe = function(name, body) {
  var child = new angular.scenario.Describe(name, this);
  this.children.push(child);
  body.call(child);
};

/**
 * Use to disable a describe block.
 */
angular.scenario.Describe.prototype.xdescribe = angular.noop;

/**
 * Defines a test.
 *
 * @param {String} Name of the test.
 * @param {Function} Body of the block.
 */
angular.scenario.Describe.prototype.it = function(name, body) {
  var self = this;
  this.its.push({
    definition: this,
    name: name,
    before: self.setupBefore,
    body: body,
    after: self.setupAfter
  });
};

/**
 * Use to disable a test block.
 */
angular.scenario.Describe.prototype.xit = angular.noop;

/**
 * Gets an array of functions representing all the tests (recursively).
 * that can be executed with SpecRunner's.
 */
angular.scenario.Describe.prototype.getSpecs = function() {
  var specs = arguments[0] || [];
  angular.foreach(this.children, function(child) {
    child.getSpecs(specs);
  });
  angular.foreach(this.its, function(it) {
    specs.push(it);
  });
  return specs;
};
