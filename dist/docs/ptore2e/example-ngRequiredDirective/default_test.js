describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-ngRequiredDirective/index.html");
  });
  
var required = element(by.binding('form.input.$error.required'));
var model = element(by.binding('model'));
var input = element(by.id('input'));

it('should set the required error', function() {
  expect(required.getText()).toContain('true');

  input.sendKeys('123');
  expect(required.getText()).not.toContain('true');
  expect(model.getText()).toContain('123');
});
});