describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-example95/index.html");
  });
  
it('should have different transclude element content', function() {
         expect(element(by.id('fallback')).getText()).toBe('Button1');
         expect(element(by.id('modified')).getText()).toBe('Button2');
       });
});