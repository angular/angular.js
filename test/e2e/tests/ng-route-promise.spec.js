'use strict';

describe('ngRoute promises', function() {
  beforeEach(function() {
    loadFixture('ng-route-promise');
  });

  it('should wait for promises in resolve blocks', function() {
    expect(element.all(by.tagName('li')).count()).toBe(5);
  });

  it('should time out if the promise takes long enough', function() {
    // Don't try this at home kids, I'm a protractor dev
    browser.manage().timeouts().setScriptTimeout(1500);

    browser.waitForAngular().
      then(onUnexpectedSuccess, onExpectedFailure).
      then(restoreTimeoutLimit);

    // Helpers
    function onUnexpectedSuccess() {
      fail('waitForAngular() should have timed out, but didn\'t');
    }

    function onExpectedFailure(error) {
      expect(error.message).toContain(
          'Timed out waiting for asynchronous Angular tasks to finish after');
    }

    function restoreTimeoutLimit() {
      return browser.getProcessedConfig().then(function(config) {
        browser.manage().timeouts().setScriptTimeout(config.allScriptsTimeout);
      });
    }
  });
});
