it('should toggle readonly attr', function() {
  expect(element(by.css('[type="text"]')).getAttribute('readonly')).toBeFalsy();
  element(by.model('checked')).click();
  expect(element(by.css('[type="text"]')).getAttribute('readonly')).toBeTruthy();
});