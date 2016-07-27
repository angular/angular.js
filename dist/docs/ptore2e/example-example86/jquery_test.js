describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-example86/index-jquery.html");
  });
  
it('should check ng-non-bindable', function() {
  expect(element(by.binding('1 + 2')).getText()).toContain('3');
  expect(element.all(by.css('div')).last().getText()).toMatch(/1 \+ 2/);
});
});