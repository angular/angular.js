var createMockWindow = function() {
  var mockWindow = {};
  var setTimeoutQueue = [];

  mockWindow.location = window.location;
  mockWindow.document = window.document;
  mockWindow.getComputedStyle = angular.bind(window, window.getComputedStyle);
  mockWindow.scrollTo = angular.bind(window, window.scrollTo);
  mockWindow.navigator = window.navigator;
  mockWindow.setTimeout = function(fn, delay) {
    setTimeoutQueue.push({fn: fn, delay: delay});
  };
  mockWindow.setTimeout.queue = setTimeoutQueue;
  mockWindow.setTimeout.expect = function(delay) {
    if (setTimeoutQueue.length > 0) {
      return {
        process: function() {
          var tick = setTimeoutQueue.shift();
          expect(tick.delay).toEqual(delay);
          tick.fn();
        }
      };
    } else {
      expect('SetTimoutQueue empty. Expecting delay of ').toEqual(delay);
    }
  };

  return mockWindow;
};
