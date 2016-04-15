describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-number-input-directive/index-jquery.html");
  });
  
var value = element(by.binding('example.value'));
var valid = element(by.binding('myForm.input.$valid'));
var input = element(by.model('example.value'));

it('should initialize to model', function() {
  expect(value.getText()).toContain('12');
  expect(valid.getText()).toContain('true');
});

it('should be invalid if empty', function() {
  input.clear();
  input.sendKeys('');
  expect(value.getText()).toEqual('value =');
  expect(valid.getText()).toContain('false');
});

it('should be invalid if over max', function() {
  input.clear();
  input.sendKeys('123');
  expect(value.getText()).toEqual('value =');
  expect(valid.getText()).toContain('false');
});
});