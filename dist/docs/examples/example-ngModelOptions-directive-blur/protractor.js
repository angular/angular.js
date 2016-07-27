var model = element(by.binding('user.name'));
var input = element(by.model('user.name'));
var other = element(by.model('user.data'));

it('should allow custom events', function() {
  input.sendKeys(' hello');
  input.click();
  expect(model.getText()).toEqual('say');
  other.click();
  expect(model.getText()).toEqual('say hello');
});

it('should $rollbackViewValue when model changes', function() {
  input.sendKeys(' hello');
  expect(input.getAttribute('value')).toEqual('say hello');
  input.sendKeys(protractor.Key.ESCAPE);
  expect(input.getAttribute('value')).toEqual('say');
  other.click();
  expect(model.getText()).toEqual('say');
});