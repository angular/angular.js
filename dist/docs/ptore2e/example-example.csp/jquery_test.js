describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-example.csp/index-jquery.html");
  });
  
var util, webdriver;

var incBtn = element(by.id('inc'));
var counter = element(by.id('counter'));
var evilBtn = element(by.id('evil'));
var evilError = element(by.id('evilError'));

function getAndClearSevereErrors() {
  return browser.manage().logs().get('browser').then(function(browserLog) {
    return browserLog.filter(function(logEntry) {
      return logEntry.level.value > webdriver.logging.Level.WARNING.value;
    });
  });
}

function clearErrors() {
  getAndClearSevereErrors();
}

function expectNoErrors() {
  getAndClearSevereErrors().then(function(filteredLog) {
    expect(filteredLog.length).toEqual(0);
    if (filteredLog.length) {
      console.log('browser console errors: ' + util.inspect(filteredLog));
    }
  });
}

function expectError(regex) {
  getAndClearSevereErrors().then(function(filteredLog) {
    var found = false;
    filteredLog.forEach(function(log) {
      if (log.message.match(regex)) {
        found = true;
      }
    });
    if (!found) {
      throw new Error('expected an error that matches ' + regex);
    }
  });
}

beforeEach(function() {
  util = require('util');
  webdriver = require('protractor/node_modules/selenium-webdriver');
});

// For now, we only test on Chrome,
// as Safari does not load the page with Protractor's injected scripts,
// and Firefox webdriver always disables content security policy (#6358)
if (browser.params.browser !== 'chrome') {
  return;
}

it('should not report errors when the page is loaded', function() {
  // clear errors so we are not dependent on previous tests
  clearErrors();
  // Need to reload the page as the page is already loaded when
  // we come here
  browser.driver.getCurrentUrl().then(function(url) {
    browser.get(url);
  });
  expectNoErrors();
});

it('should evaluate expressions', function() {
  expect(counter.getText()).toEqual('0');
  incBtn.click();
  expect(counter.getText()).toEqual('1');
  expectNoErrors();
});

it('should throw and report an error when using "eval"', function() {
  evilBtn.click();
  expect(evilError.getText()).toMatch(/Content Security Policy/);
  expectError(/Content Security Policy/);
});
});