describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-example53/index.html");
  });
  
it('should toggle button', function() {
  expect(element(by.css('button')).getAttribute('disabled')).toBeFalsy();
  element(by.model('checked')).click();
  expect(element(by.css('button')).getAttribute('disabled')).toBeTruthy();
});
});