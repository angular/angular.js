describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-example85/index.html");
  });
  
var templateSelect = element(by.model('template'));
var includeElem = element(by.css('[ng-include]'));

it('should load template1.html', function() {
  expect(includeElem.getText()).toMatch(/Content of template1.html/);
});

it('should load template2.html', function() {
  if (browser.params.browser == 'firefox') {
    // Firefox can't handle using selects
    // See https://github.com/angular/protractor/issues/480
    return;
  }
  templateSelect.click();
  templateSelect.all(by.css('option')).get(2).click();
  expect(includeElem.getText()).toMatch(/Content of template2.html/);
});

it('should change to blank', function() {
  if (browser.params.browser == 'firefox') {
    // Firefox can't handle using selects
    return;
  }
  templateSelect.click();
  templateSelect.all(by.css('option')).get(0).click();
  expect(includeElem.isPresent()).toBe(false);
});
});