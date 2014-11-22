describe('Hash Fragment Scrolling', function() {
  beforeEach(function() {
    loadFixture("ng/location/hashFragmentScrolling").andWaitForAngular();
  });

  it('should scroll to the element whose id appears in the hash part of the link', function() {
    var initialScrollTop = null;
    // Firefox requires window.pageYOffset (document.body.scrollTop is always 0)
    browser.executeScript('return document.body.scrollTop||window.pageYOffset;').then(function(scrollTop) {
      initialScrollTop = scrollTop;
    });
    element(by.id('click-me')).click();
    browser.executeScript('return document.body.scrollTop||window.pageYOffset;').then(function(scrollTop) {
      expect(scrollTop).toBeGreaterThan(initialScrollTop);
    });
    expect(browser.executeScript('return document.location.hash;')).toBe('##some-section');
  });
});
