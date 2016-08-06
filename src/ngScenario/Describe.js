'use strict';

/**
 * The representation of define blocks. Don't used directly, instead use
 * define() in your tests.
 *
 * @param {string} descName Name of the block
 * @param {Object} parent describe or undefined if the root.
 */
angular.scenario.Describe = function(descName, parent) {
  this.only = parent && parent.only;
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
    angular.forEach(beforeEachFns, /** @this */ function(fn) { fn.call(this); }, this);
  };

  /**
   * Calls all after functions.
   */
  var afterEachFns = this.afterEachFns;
  this.setupAfter  = function() {
    angular.forEach(afterEachFns, /** @this */ function(fn) { fn.call(this); }, this);
    if (parent) parent.setupAfter.call(this);
  };
};

// Shared Unique ID generator for every describe block
angular.scenario.Describe.id = 0;

// Shared Unique ID generator for every it (spec)
angular.scenario.Describe.specId = 0;

/**
 * Defines a block to execute before each it or nested describe.
 *
 * @param {function()} body Body of the block.
 */
angular.scenario.Describe.prototype.beforeEach = function(body) {
  this.beforeEachFns.push(body);
};

/**
 * Defines a block to execute after each it or nested describe.
 *
 * @param {function()} body Body of the block.
 */
angular.scenario.Describe.prototype.afterEach = function(body) {
  this.afterEachFns.push(body);
};

/**
 * Creates a new describe block that's a child of this one.
 *
 * @param {string} name Name of the block. Appended to the parent block's name.
 * @param {function()} body Body of the block.
 */
angular.scenario.Describe.prototype.describe = function(name, body) {
  var child = new angular.scenario.Describe(name, this);
  this.children.push(child);
  body.call(child);
};

/**
 * Same as describe() but makes ddescribe blocks the only to run.
 *
 * @param {string} name Name of the test.
 * @param {function()} body Body of the block.
 */
angular.scenario.Describe.prototype.ddescribe = function(name, body) {
  var child = new angular.scenario.Describe(name, this);
  child.only = true;
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
 * @param {string} name Name of the test.
 * @param {function()} body Body of the block.
 */
angular.scenario.Describe.prototype.it = function(name, body) {
  this.its.push({
    id: angular.scenario.Describe.specId++,
    definition: this,
    only: this.only,
    name: name,
    before: this.setupBefore,
    body: body,
    after: this.setupAfter
  });
};

/**
 * Same as it() but makes iit tests the only test to run.
 *
 * @param {string} name Name of the test.
 * @param {function()} body Body of the block.
 */
angular.scenario.Describe.prototype.iit = function(name, body) {
  this.it.apply(this, arguments);
  this.its[this.its.length - 1].only = true;
};

/**
 * Use to disable a test block.
 */
angular.scenario.Describe.prototype.xit = angular.noop;

/**
 * Gets an array of functions representing all the tests (recursively).
 * that can be executed with SpecRunner's.
 *
 * @return {Array<Object>} Array of it blocks {
 *   definition : Object // parent Describe
 *   only: boolean
 *   name: string
 *   before: Function
 *   body: Function
 *   after: Function
 *  }
 */
angular.scenario.Describe.prototype.getSpecs = function() {
  var specs = arguments[0] || [];
  angular.forEach(this.children, function(child) {
    child.getSpecs(specs);
  });
  angular.forEach(this.its, function(it) {
    specs.push(it);
  });
  var only = [];
  angular.forEach(specs, function(it) {
    if (it.only) {
      only.push(it);
    }
  });
  return (only.length && only) || specs;
};
