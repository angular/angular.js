describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-ngValue-directive/index-jquery.html");
  });
  
var favorite = element(by.binding('my.favorite'));

it('should initialize to model', function() {
  expect(favorite.getText()).toContain('unicorns');
});
it('should bind the values to the inputs', function() {
  element.all(by.model('my.favorite')).get(0).click();
  expect(favorite.getText()).toContain('pizza');
});
});