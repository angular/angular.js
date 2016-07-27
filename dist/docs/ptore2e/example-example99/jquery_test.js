describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-example99/index-jquery.html");
  });
  
 it('should format numbers', function() {
   expect(element(by.id('number-default')).getText()).toBe('1,234.568');
   expect(element(by.binding('val | number:0')).getText()).toBe('1,235');
   expect(element(by.binding('-val | number:4')).getText()).toBe('-1,234.5679');
 });

 it('should update', function() {
   element(by.model('val')).clear();
   element(by.model('val')).sendKeys('3374.333');
   expect(element(by.id('number-default')).getText()).toBe('3,374.333');
   expect(element(by.binding('val | number:0')).getText()).toBe('3,374');
   expect(element(by.binding('-val | number:4')).getText()).toBe('-3,374.3330');
});
});