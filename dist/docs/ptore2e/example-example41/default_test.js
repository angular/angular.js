describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.rootEl = '[ng-app]';
    browser.get("build/docs/examples/example-example41/index.html");
  });
  afterEach(function() { browser.rootEl = rootEl; });
it('should add Hello to the name', function() {
  expect(element(by.binding("'World' | greet")).getText()).toEqual('Hello, World!');
});
});