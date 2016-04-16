describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-multiSlotTranscludeExample/index-jquery.html");
  });
  
it('should have transcluded the title and the body', function() {
  var titleElement = element(by.model('title'));
  titleElement.clear();
  titleElement.sendKeys('TITLE');
  var textElement = element(by.model('text'));
  textElement.clear();
  textElement.sendKeys('TEXT');
  expect(element(by.css('.title')).getText()).toEqual('TITLE');
  expect(element(by.binding('text')).getText()).toEqual('TEXT');
  expect(element(by.css('.footer')).getText()).toEqual('Fallback Footer');
});
});