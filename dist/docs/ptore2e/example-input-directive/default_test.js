describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-input-directive/index.html");
  });
  
var user = element(by.exactBinding('user'));
var userNameValid = element(by.binding('myForm.userName.$valid'));
var lastNameValid = element(by.binding('myForm.lastName.$valid'));
var lastNameError = element(by.binding('myForm.lastName.$error'));
var formValid = element(by.binding('myForm.$valid'));
var userNameInput = element(by.model('user.name'));
var userLastInput = element(by.model('user.last'));

it('should initialize to model', function() {
  expect(user.getText()).toContain('{"name":"guest","last":"visitor"}');
  expect(userNameValid.getText()).toContain('true');
  expect(formValid.getText()).toContain('true');
});

it('should be invalid if empty when required', function() {
  userNameInput.clear();
  userNameInput.sendKeys('');

  expect(user.getText()).toContain('{"last":"visitor"}');
  expect(userNameValid.getText()).toContain('false');
  expect(formValid.getText()).toContain('false');
});

it('should be valid if empty when min length is set', function() {
  userLastInput.clear();
  userLastInput.sendKeys('');

  expect(user.getText()).toContain('{"name":"guest","last":""}');
  expect(lastNameValid.getText()).toContain('true');
  expect(formValid.getText()).toContain('true');
});

it('should be invalid if less than required min length', function() {
  userLastInput.clear();
  userLastInput.sendKeys('xx');

  expect(user.getText()).toContain('{"name":"guest"}');
  expect(lastNameValid.getText()).toContain('false');
  expect(lastNameError.getText()).toContain('minlength');
  expect(formValid.getText()).toContain('false');
});

it('should be invalid if longer than max length', function() {
  userLastInput.clear();
  userLastInput.sendKeys('some ridiculously long name');

  expect(user.getText()).toContain('{"name":"guest"}');
  expect(lastNameValid.getText()).toContain('false');
  expect(lastNameError.getText()).toContain('maxlength');
  expect(formValid.getText()).toContain('false');
});
});