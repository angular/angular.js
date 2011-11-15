'use strict';

describe('$window', function() {
  it("should inject $window", inject(function($window) {
    expect($window).toBe(window);
  }));
});
