it('should select Greetings!', function() {
  expect(element(by.id('greet')).getAttribute('selected')).toBeFalsy();
  element(by.model('selected')).click();
  expect(element(by.id('greet')).getAttribute('selected')).toBeTruthy();
});