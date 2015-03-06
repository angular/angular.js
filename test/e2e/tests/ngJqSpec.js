describe('Customizing the jqlite / jquery version', function() {

  it('should be able to force jqlite', function() {
    loadFixture("ngJq").andWaitForAngular();
    expect(element(by.binding('jqueryVersion')).getText()).toBe('jqLite');
  });

  it('should be able to use a specific version jQuery', function() {
    loadFixture("ngJqJquery").andWaitForAngular();
    expect(element(by.binding('jqueryVersion')).getText()).toBe('2.1.0');
  });
});
