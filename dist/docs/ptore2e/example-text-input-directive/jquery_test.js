describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-text-input-directive/index-jquery.html");
  });
  
var text = element(by.binding('example.text'));
var valid = element(by.binding('myForm.input.$valid'));
var input = element(by.model('example.text'));

it('should initialize to model', function() {
  expect(text.getText()).toContain('guest');
  expect(valid.getText()).toContain('true');
});

it('should be invalid if empty', function() {
  input.clear();
  input.sendKeys('');

  expect(text.getText()).toEqual('text =');
  expect(valid.getText()).toContain('false');
});

it('should be invalid if multi word', function() {
  input.clear();
  input.sendKeys('hello world');

  expect(valid.getText()).toContain('false');
});
});