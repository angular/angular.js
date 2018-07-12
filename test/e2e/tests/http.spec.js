'use strict';

describe('$http', function() {
  beforeEach(function() {
    loadFixture('http');
  });

  it('should correctly update the outstanding request count', function() {
    expect(element(by.binding('text')).getText()).toBe('Hello, world!');
  });
});
