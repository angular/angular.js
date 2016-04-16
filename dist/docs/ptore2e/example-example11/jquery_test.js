describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-example11/index-jquery.html");
  });
  
it('should show off bindings', function() {
  var containerElm = element(by.css('div[ng-controller="Controller"]'));
  var nameBindings = containerElm.all(by.binding('name'));

  expect(nameBindings.count()).toBe(5);
  nameBindings.each(function(elem) {
    expect(elem.getText()).toEqual('Max Karl Ernst Ludwig Planck (April 23, 1858 – October 4, 1947)');
  });
});
});