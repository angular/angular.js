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
    browser.manage().timeouts().setScriptTimeout(1);
    browser.waitForAngular().then(function() {
      fail('waitForAngular() should have timed out, but didn\'t');
    }, function(error) {
      expect(error.message).toContain('Timed out waiting for asynchronous Angular tasks to finish after 0.001 seconds.');
    });
  });
  afterAll(function() {
    // Restore old timeout limit
    browser.manage().timeouts().setScriptTimeout(browser.getProcessedConfig().allScriptsTimeout);
  });
});
