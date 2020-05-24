'use strict';

// Sample E2E test:
describe('Sample', function() {
  beforeEach(function() {
    loadFixture('sample');
  });

  it('should have the interpolated text', function() {
    expect(element(by.binding('text')).getText()).toBe('Hello, world!');
  });

  it('should insert the ng-cloak styles', function() {
    browser.executeScript(`
      var span = document.createElement('span');
      span.className = 'ng-cloak foo';
      document.body.appendChild(span);
    `);
    expect(element(by.className('foo')).isDisplayed()).toBe(false);
  });
});
