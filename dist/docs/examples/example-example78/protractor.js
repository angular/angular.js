it('should check ng-submit', function() {
  expect(element(by.binding('list')).getText()).toBe('list=[]');
  element(by.css('#submit')).click();
  expect(element(by.binding('list')).getText()).toContain('hello');
  expect(element(by.model('text')).getAttribute('value')).toBe('');
});
it('should ignore empty strings', function() {
  expect(element(by.binding('list')).getText()).toBe('list=[]');
  element(by.css('#submit')).click();
  element(by.css('#submit')).click();
  expect(element(by.binding('list')).getText()).toContain('hello');
 });