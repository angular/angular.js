'use strict';

describe('base_tag', function() {
  it('SCE self URL policy should correctly handle base tags', function() {
    loadFixture('base_tag');

    var url = browser.getLocationAbsUrl();
    var urlIsTrusted = browser.executeScript('return isTrustedUrl(arguments[0])', url);
    expect(urlIsTrusted).toBe(true);  // sanity check

    urlIsTrusted = browser.executeScript('return isTrustedUrl("/relative")');
    expect(urlIsTrusted).toBe(true);
  });
});
