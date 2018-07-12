'use strict';

describe('SCE URL policy when base tags are present', function() {
  beforeEach(function() {
    loadFixture('base-tag');
  });


  it('allows the page URL (location.href)', function() {
    expectToBeTrusted(browser.getLocationAbsUrl(), true);
  });

  it('blocks off-origin URLs', function() {
    expectToBeTrusted('http://evil.com', false);
  });

  it('allows relative URLs ("/relative")', function() {
    expectToBeTrusted('/relative', true);
  });

  it('allows absolute URLs from the base origin', function() {
    expectToBeTrusted('http://www.example.com/path/to/file.html', true);
  });

  it('tracks changes to the base URL', function() {
    browser.executeScript(
        'document.getElementsByTagName("base")[0].href = "http://xxx.example.com/";');
    expectToBeTrusted('http://xxx.example.com/path/to/file.html', true);
    expectToBeTrusted('http://www.example.com/path/to/file.html', false);
  });


  // Helpers
  function expectToBeTrusted(url, isTrusted) {
    var urlIsTrusted = browser.executeScript('return isTrustedUrl(arguments[0])', url);
    expect(urlIsTrusted).toBe(isTrusted);
  }
});
