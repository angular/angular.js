it('should have transcluded', function() {
  var titleElement = element(by.model('title'));
  titleElement.clear();
  titleElement.sendKeys('TITLE');
  var textElement = element(by.model('text'));
  textElement.clear();
  textElement.sendKeys('TEXT');
  expect(element(by.binding('title')).getText()).toEqual('TITLE');
  expect(element(by.binding('text')).getText()).toEqual('TEXT');
});