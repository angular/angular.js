it('should toggle button', function() {
  expect(element(by.css('button')).getAttribute('disabled')).toBeFalsy();
  element(by.model('checked')).click();
  expect(element(by.css('button')).getAttribute('disabled')).toBeTruthy();
});