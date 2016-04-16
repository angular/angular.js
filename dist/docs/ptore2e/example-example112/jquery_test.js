describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-example112/index-jquery.html");
  });
  
it('should display the greeting in the input box', function() {
 element(by.model('greeting')).sendKeys('Hello, E2E Tests');
 // If we click the button it will block the test runner
 // element(':button').click();
});
});