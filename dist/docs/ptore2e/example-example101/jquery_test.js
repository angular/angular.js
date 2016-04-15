describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-example101/index-jquery.html");
  });
  
it('should jsonify filtered objects', function() {
  expect(element(by.id('default-spacing')).getText()).toMatch(/\{\n  "name": ?"value"\n}/);
  expect(element(by.id('custom-spacing')).getText()).toMatch(/\{\n    "name": ?"value"\n}/);
});
});