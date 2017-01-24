'use strict';

describe('App where AngularJS is loaded more than once', function() {
  beforeEach(function() {
    loadFixture('angularjs-already-loaded');
  });

  it('should have the interpolated text', function() {
    expect(element(by.binding('text')).getText()).toBe('Hello, world!');
  });
});
