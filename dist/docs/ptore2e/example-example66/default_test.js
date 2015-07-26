describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-example66/index.html");
  });
  
it('should remove the template directive and css class', function() {
  expect($('#template1').getAttribute('ng-cloak')).
    toBeNull();
  expect($('#template2').getAttribute('ng-cloak')).
    toBeNull();
});
});