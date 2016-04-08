
describe('$http', function() {
  beforeEach(function() {
    loadFixture("http").andWaitForAngular();
  });

  it('should have the interpolated text', function() {
    expect(element(by.binding('text')).getText())
        .toBe('Hello, world!');
  });
});
