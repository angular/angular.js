describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-example101/index.html");
  });
  
it('should format date', function() {
  expect(element(by.binding("1288323623006 | date:'medium'")).getText()).
     toMatch(/Oct 2\d, 2010 \d{1,2}:\d{2}:\d{2} (AM|PM)/);
  expect(element(by.binding("1288323623006 | date:'yyyy-MM-dd HH:mm:ss Z'")).getText()).
     toMatch(/2010\-10\-2\d \d{2}:\d{2}:\d{2} (\-|\+)?\d{4}/);
  expect(element(by.binding("'1288323623006' | date:'MM/dd/yyyy @ h:mma'")).getText()).
     toMatch(/10\/2\d\/2010 @ \d{1,2}:\d{2}(AM|PM)/);
  expect(element(by.binding("'1288323623006' | date:\"MM/dd/yyyy 'at' h:mma\"")).getText()).
     toMatch(/10\/2\d\/2010 at \d{1,2}:\d{2}(AM|PM)/);
});
});