'use strict';

describe('angular.scenario.matchers', function() {
  var matchers;

  function expectMatcher(value, test) {
    delete matchers.error;
    delete matchers.future.value;
    if (value !== undefined) {
      matchers.future.value = value;
    }
    test();
    expect(matchers.error).toBeUndefined();
  }

  beforeEach(function() {
    /**
     * Mock up the future system wrapped around matchers.
     *
     * @see Scenario.js#angular.scenario.matcher
     */
    matchers = {
      future: { name: 'test' }
    };
    matchers.addFuture = function(name, callback) {
      callback(function(error) {
        matchers.error = error;
      });
    };
    angular.extend(matchers, angular.scenario.matcher);
  });

  it('should handle basic matching', function() {
    expectMatcher(10, function() { matchers.toEqual(10); });
    expectMatcher('value', function() { matchers.toBeDefined(); });
    expectMatcher([1], function() { matchers.toBeTruthy(); });
    expectMatcher("", function() { matchers.toBeFalsy(); });
    expectMatcher(0, function() { matchers.toBeFalsy(); });
    expectMatcher('foo', function() { matchers.toMatch('.o.'); });
    expectMatcher(null, function() { matchers.toBeNull(); });
    expectMatcher([1, 2, 3], function() { matchers.toContain(2); });
    expectMatcher(3, function() { matchers.toBeLessThan(10); });
    expectMatcher(3, function() { matchers.toBeGreaterThan(-5); });
  });

  it('should have toHaveClass matcher', function() {
    var e = angular.element('<div class="abc">');
    expect(e).not.toHaveClass('none');
    expect(e).toHaveClass('abc');
  });
});
