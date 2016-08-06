'use strict';

/**
 * Matchers for implementing specs. Follows the Jasmine spec conventions.
 */

angular.scenario.matcher('toEqual', /** @this */ function(expected) {
  return angular.equals(this.actual, expected);
});

angular.scenario.matcher('toBe', /** @this */ function(expected) {
  return this.actual === expected;
});

angular.scenario.matcher('toBeDefined', /** @this */ function() {
  return angular.isDefined(this.actual);
});

angular.scenario.matcher('toBeTruthy', /** @this */ function() {
  return this.actual;
});

angular.scenario.matcher('toBeFalsy', /** @this */ function() {
  return !this.actual;
});

angular.scenario.matcher('toMatch', /** @this */ function(expected) {
  return new RegExp(expected).test(this.actual);
});

angular.scenario.matcher('toBeNull', /** @this */ function() {
  return this.actual === null;
});

angular.scenario.matcher('toContain', /** @this */ function(expected) {
  return includes(this.actual, expected);
});

angular.scenario.matcher('toBeLessThan', /** @this */ function(expected) {
  return this.actual < expected;
});

angular.scenario.matcher('toBeGreaterThan', /** @this */ function(expected) {
  return this.actual > expected;
});
