describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-example40/index.html");
  });
  
it('should add Hello to the name', function() {
  expect(element(by.binding("greeting")).getText()).toEqual('Bonjour World!');
});
});