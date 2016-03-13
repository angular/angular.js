describe('App where angular is loaded more than once', function() {
  beforeEach(function() {
    loadFixture("angular-already-loaded").andWaitForAngular();
  });

  it('should have the interpolated text', function() {
    expect(element(by.binding('text')).getText())
        .toBe('Hello, world!');
  });
});
