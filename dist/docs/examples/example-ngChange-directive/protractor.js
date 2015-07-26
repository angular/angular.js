var counter = element(by.binding('counter'));
var debug = element(by.binding('confirmed'));

it('should evaluate the expression if changing from view', function() {
  expect(counter.getText()).toContain('0');

  element(by.id('ng-change-example1')).click();

  expect(counter.getText()).toContain('1');
  expect(debug.getText()).toContain('true');
});

it('should not evaluate the expression if changing from model', function() {
  element(by.id('ng-change-example2')).click();

  expect(counter.getText()).toContain('0');
  expect(debug.getText()).toContain('true');
});