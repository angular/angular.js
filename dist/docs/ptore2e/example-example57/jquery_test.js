describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-example57/index-jquery.html");
  });
  
it('should toggle open', function() {
  expect(element(by.id('details')).getAttribute('open')).toBeFalsy();
  element(by.model('open')).click();
  expect(element(by.id('details')).getAttribute('open')).toBeTruthy();
});
});