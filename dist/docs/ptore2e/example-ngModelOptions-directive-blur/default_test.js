describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-ngModelOptions-directive-blur/index.html");
  });
  
var model = element(by.binding('user.name'));
var input = element(by.model('user.name'));
var other = element(by.model('user.data'));

it('should allow custom events', function() {
  input.sendKeys(' Doe');
  input.click();
  expect(model.getText()).toEqual('John');
  other.click();
  expect(model.getText()).toEqual('John Doe');
});

it('should $rollbackViewValue when model changes', function() {
  input.sendKeys(' Doe');
  expect(input.getAttribute('value')).toEqual('John Doe');
  input.sendKeys(protractor.Key.ESCAPE);
  expect(input.getAttribute('value')).toEqual('John');
  other.click();
  expect(model.getText()).toEqual('John');
});
});