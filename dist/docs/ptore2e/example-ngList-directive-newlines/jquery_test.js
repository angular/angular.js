describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-ngList-directive-newlines/index-jquery.html");
  });
  
it("should split the text by newlines", function() {
  var listInput = element(by.model('list'));
  var output = element(by.binding('list | json'));
  listInput.sendKeys('abc\ndef\nghi');
  expect(output.getText()).toContain('[\n  "abc",\n  "def",\n  "ghi"\n]');
});
});