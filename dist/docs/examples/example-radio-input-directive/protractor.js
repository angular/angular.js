it('should change state', function() {
  var color = element(by.binding('color.name'));

  expect(color.getText()).toContain('blue');

  element.all(by.model('color.name')).get(0).click();

  expect(color.getText()).toContain('red');
});