'use strict';

describe('$window', function() {
  it('should inject $window', inject(function($window) {
    expect($window).toBe(window);
  }));

  it('should be able to mock $window without errors', function() {
    module({$window: {}});
    inject(['$sce', angular.noop]);
  });
});
