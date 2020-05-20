'use strict';

describe('ngRoute promises', function() {
  beforeEach(function() {
    loadFixture('ng-route-promise');
  });

  it('should wait for route promises', function() {
    expect(element.all(by.tagName('li')).count()).toBe(5);
  });

  it('should time out if the promise takes long enough', function(done) {
    // Don't try this at home kids, I'm a protractor dev
    browser.manage().timeouts().setScriptTimeout(1000);
    browser.waitForAngular().then(function() {
      fail('waitForAngular() should have timed out, but didn\'t');
    }, done);
  });

  it('should wait for route promises when navigating to another route', function() {
    browser.setLocation('/foo2');
    expect(element(by.tagName('body')).getText()).toBe('5');
  });

  afterEach(function(done) {
    // Restore old timeout limit
    browser.getProcessedConfig().then(function(config) {
      return browser.manage().timeouts().setScriptTimeout(config.allScriptsTimeout);
    }).then(done);
  });
});
