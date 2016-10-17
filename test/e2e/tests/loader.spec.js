'use strict';

describe('angular-loader', function() {
  beforeEach(function() {
    loadFixture('loader');
  });

  it('should not be broken by loading the modules before core', function() {
    expect(element(by.binding('text')).getText()).toBe('Hello, world!');
  });
});
