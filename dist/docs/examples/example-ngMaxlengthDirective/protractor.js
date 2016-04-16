var model = element(by.binding('model'));
var input = element(by.id('input'));

it('should validate the input with the default maxlength', function() {
  input.sendKeys('abcdef');
  expect(model.getText()).not.toContain('abcdef');

  input.clear().then(function() {
    input.sendKeys('abcde');
    expect(model.getText()).toContain('abcde');
  });
});