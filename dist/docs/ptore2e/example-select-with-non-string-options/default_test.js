describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-select-with-non-string-options/index.html");
  });
  
it('should initialize to model', function() {
  var select = element(by.css('select'));
  expect(element(by.model('model.id')).$('option:checked').getText()).toEqual('Two');
});
});