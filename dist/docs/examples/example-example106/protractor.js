it('should interpolate binding with custom symbols', function() {
  expect(element(by.binding('demo.label')).getText()).toBe('This binding is brought you by // interpolation symbols.');
});