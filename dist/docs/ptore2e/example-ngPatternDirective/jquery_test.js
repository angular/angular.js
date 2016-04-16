describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-ngPatternDirective/index-jquery.html");
  });
  
var model = element(by.binding('model'));
var input = element(by.id('input'));

it('should validate the input with the default pattern', function() {
  input.sendKeys('aaa');
  expect(model.getText()).not.toContain('aaa');

  input.clear().then(function() {
    input.sendKeys('123');
    expect(model.getText()).toContain('123');
  });
});
});