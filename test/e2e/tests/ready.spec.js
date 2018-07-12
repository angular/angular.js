'use strict';

describe('Firing a callback on ready', function() {
  it('should not have the div available immediately', function() {
    loadFixture('ready');
    expect(element(by.className('before-ready')).getText())
      .toBe('');
  });

  it('should wait for document ready', function() {
    loadFixture('ready');
    expect(element(by.className('after-ready')).getText())
      .toBe('This div is loaded after scripts.');
    expect(element(by.className('after-ready-method')).getText())
      .toBe('This div is loaded after scripts.');
  });

  it('should be asynchronous', function() {
    loadFixture('ready');
    expect(element(by.className('after-ready-sync')).getText())
      .toBe('');
    expect(element(by.className('after-ready-method-sync')).getText())
      .toBe('');
  });
});
