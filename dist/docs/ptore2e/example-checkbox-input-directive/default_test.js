describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-checkbox-input-directive/index.html");
  });
  
it('should change state', function() {
  var value1 = element(by.binding('checkboxModel.value1'));
  var value2 = element(by.binding('checkboxModel.value2'));

  expect(value1.getText()).toContain('true');
  expect(value2.getText()).toContain('YES');

  element(by.model('checkboxModel.value1')).click();
  element(by.model('checkboxModel.value2')).click();

  expect(value1.getText()).toContain('false');
  expect(value2.getText()).toContain('NO');
});
});