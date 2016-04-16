describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-example54/index.html");
  });
  
it('should execute ng-click but not reload when href without value', function() {
  element(by.id('link-1')).click();
  expect(element(by.model('value')).getAttribute('value')).toEqual('1');
  expect(element(by.id('link-1')).getAttribute('href')).toBe('');
});

it('should execute ng-click but not reload when href empty string', function() {
  element(by.id('link-2')).click();
  expect(element(by.model('value')).getAttribute('value')).toEqual('2');
  expect(element(by.id('link-2')).getAttribute('href')).toBe('');
});

it('should execute ng-click and change url when ng-href specified', function() {
  expect(element(by.id('link-3')).getAttribute('href')).toMatch(/\/123$/);

  element(by.id('link-3')).click();

  // At this point, we navigate away from an Angular page, so we need
  // to use browser.driver to get the base webdriver.

  browser.wait(function() {
    return browser.driver.getCurrentUrl().then(function(url) {
      return url.match(/\/123$/);
    });
  }, 5000, 'page should navigate to /123');
});

it('should execute ng-click but not reload when href empty string and name specified', function() {
  element(by.id('link-4')).click();
  expect(element(by.model('value')).getAttribute('value')).toEqual('4');
  expect(element(by.id('link-4')).getAttribute('href')).toBe('');
});

it('should execute ng-click but not reload when no href but name specified', function() {
  element(by.id('link-5')).click();
  expect(element(by.model('value')).getAttribute('value')).toEqual('5');
  expect(element(by.id('link-5')).getAttribute('href')).toBe(null);
});

it('should only change url when only ng-href', function() {
  element(by.model('value')).clear();
  element(by.model('value')).sendKeys('6');
  expect(element(by.id('link-6')).getAttribute('href')).toMatch(/\/6$/);

  element(by.id('link-6')).click();

  // At this point, we navigate away from an Angular page, so we need
  // to use browser.driver to get the base webdriver.
  browser.wait(function() {
    return browser.driver.getCurrentUrl().then(function(url) {
      return url.match(/\/6$/);
    });
  }, 5000, 'page should navigate to /6');
});
});