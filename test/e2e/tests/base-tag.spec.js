'use strict';

describe('SCE URL policy when base tags are present', function() {
  function checkUrl(url, allowed) {
    var urlIsTrusted = browser.executeScript('return isTrustedUrl(arguments[0])', url);
    expect(urlIsTrusted).toBe(allowed);
  }

  beforeAll(function() {
    loadFixture('base-tag');
  });

  it('allows the page URL (location.href)', function() {
    checkUrl(browser.getLocationAbsUrl(), true);
  });

  it('blocks off-origin URLs', function() {
    checkUrl('http://evil.com', false);
  });

  it('allows relative URLs ("/relative")', function() {
    checkUrl('/relative', true);
  });

  it('allows absolute URLs from the base origin', function() {
    checkUrl('http://www.example.com/path/to/file.html', true);
  });

  it('tracks changes to the base URL', function() {
    browser.executeScript(
        'document.getElementsByTagName("base")[0].href = "http://xxx.example.com/";');
    checkUrl('http://xxx.example.com/path/to/file.html', true);
    checkUrl('http://www.example.com/path/to/file.html', false);
  });
});
