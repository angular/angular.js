describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-example84/index.html");
  });
  
it('should alias index positions', function() {
  var elements = element.all(by.css('.example-init'));
  expect(elements.get(0).getText()).toBe('list[ 0 ][ 0 ] = a;');
  expect(elements.get(1).getText()).toBe('list[ 0 ][ 1 ] = b;');
  expect(elements.get(2).getText()).toBe('list[ 1 ][ 0 ] = c;');
  expect(elements.get(3).getText()).toBe('list[ 1 ][ 1 ] = d;');
});
});