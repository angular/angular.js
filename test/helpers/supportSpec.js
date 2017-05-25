'use strict';

describe('support test results', function() {
  var expected, version, testName;
  var userAgent = window.navigator.userAgent;

  // Support: iOS 8 only
  if (/iPhone OS 10_1\d(?:_\d+)? /.test(userAgent)) {
    // iOS 8 official simulators have broken user agent (containing something like `iPhone OS 10_12_5`,
    // i.e. the macOS version in place of the iOS version) so they'd fall into an incorrect bucket.
    // Fix the user agent there.
    // NOTE: Make sure the above check doesn't catch the real iOS 10!
    userAgent = userAgent.replace(/iPhone OS 10(?:_\d+)+/, 'iPhone OS 8_1');
  }

  if (/edge\//i.test(userAgent)) {
    expected = {
      classes: true,
      fatArrows: true,
      shorthandMethods: true
    };
  } else if (/msie|trident/i.test(userAgent)) {
    expected = {
      classes: false,
      fatArrows: false,
      shorthandMethods: false
    };
  } else if (/iphone os [78]_/i.test(userAgent)) {
    expected = {
      classes: false,
      fatArrows: false,
      shorthandMethods: false
    };
  } else if (/iphone os 9_/i.test(userAgent)) {
    expected = {
      classes: true,
      fatArrows: false,
      shorthandMethods: true
    };
  } else if (/iphone os/i.test(userAgent)) {
    expected = {
      classes: true,
      fatArrows: true,
      shorthandMethods: true
    };
  } else if (/android 4\.[0-3]/i.test(userAgent)) {
    expected = {
      classes: false,
      fatArrows: false,
      shorthandMethods: false
    };
  } else if (/chrome/i.test(userAgent)) {
    // Catches Chrome on Android as well (i.e. the default
    // Android browser on Android >= 4.4).
    expected = {
      classes: true,
      fatArrows: true,
      shorthandMethods: true
    };
  } else if (/firefox/i.test(userAgent)) {
    version = parseInt(userAgent.match(/firefox\/(\d+)/i)[1], 10);
    expected = {
      classes: version >= 55,
      fatArrows: true,
      shorthandMethods: true
    };
  } else if (/\b8(?:\.\d+)+ safari/i.test(userAgent)) {
    expected = {
      classes: false,
      fatArrows: false,
      shorthandMethods: false
    };
  } else if (/\b9(?:\.\d+)+ safari/i.test(userAgent)) {
    expected = {
      classes: true,
      fatArrows: false,
      shorthandMethods: true
    };
  } else if (/\b\d+(?:\.\d+)+ safari/i.test(userAgent)) {
    expected = {
      classes: true,
      fatArrows: true,
      shorthandMethods: true
    };
  }

  it('should have expected values specified', function() {
      expect(expected).not.toBe(null);
      expect(typeof expected).toBe('object');
  });

  for (testName in expected) {
    it('should report support.' + testName + ' to be ' + expected[testName], function() {
        expect(support[testName]).toBe(expected[testName]);
    });
  }
});
