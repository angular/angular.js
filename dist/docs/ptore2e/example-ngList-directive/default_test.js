describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-ngList-directive/index.html");
  });
  
var listInput = element(by.model('names'));
var names = element(by.exactBinding('names'));
var valid = element(by.binding('myForm.namesInput.$valid'));
var error = element(by.css('span.error'));

it('should initialize to model', function() {
  expect(names.getText()).toContain('["morpheus","neo","trinity"]');
  expect(valid.getText()).toContain('true');
  expect(error.getCssValue('display')).toBe('none');
});

it('should be invalid if empty', function() {
  listInput.clear();
  listInput.sendKeys('');

  expect(names.getText()).toContain('');
  expect(valid.getText()).toContain('false');
  expect(error.getCssValue('display')).not.toBe('none');
});
});