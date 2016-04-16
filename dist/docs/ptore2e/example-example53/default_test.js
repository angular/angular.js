describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-example53/index.html");
  });
  
it('should auto compile', function() {
  var textarea = $('textarea');
  var output = $('div[compile]');
  // The initial state reads 'Hello Angular'.
  expect(output.getText()).toBe('Hello Angular');
  textarea.clear();
  textarea.sendKeys('{{name}}!');
  expect(output.getText()).toBe('Angular!');
});
});