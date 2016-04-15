it('should jsonify filtered objects', function() {
  expect(element(by.id('default-spacing')).getText()).toMatch(/\{\n  "name": ?"value"\n}/);
  expect(element(by.id('custom-spacing')).getText()).toMatch(/\{\n    "name": ?"value"\n}/);
});