describe('Customizing the jqLite / jQuery version', function() {
  it('should be able to force jqLite', function() {
    loadFixture('ngJq');
    expect(element(by.binding('jqueryVersion')).getText()).toBe('jqLite');
  });

  it('should be able to use a specific version jQuery', function() {
    loadFixture('ngJqJquery');
    expect(element(by.binding('jqueryVersion')).getText()).toBe('2.1.0');
  });
});
