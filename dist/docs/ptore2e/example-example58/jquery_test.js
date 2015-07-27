describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-example58/index-jquery.html");
  });
  
it('should initialize to model', function() {
  var userType = element(by.binding('userType'));
  var valid = element(by.binding('myForm.input.$valid'));

  expect(userType.getText()).toContain('guest');
  expect(valid.getText()).toContain('true');
});

it('should be invalid if empty', function() {
  var userType = element(by.binding('userType'));
  var valid = element(by.binding('myForm.input.$valid'));
  var userInput = element(by.model('userType'));

  userInput.clear();
  userInput.sendKeys('');

  expect(userType.getText()).toEqual('userType =');
  expect(valid.getText()).toContain('false');
});
});