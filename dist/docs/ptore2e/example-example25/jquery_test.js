describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-example25/index-jquery.html");
  });
  
it('should calculate expression in binding', function() {
  expect(element(by.binding('1+2')).getText()).toEqual('1+2=3');
});
});