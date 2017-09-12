'use strict';

describe('hidden thingy', function() {
  it('should pass', function() {

    loadFixture('input-hidden');
    expect(element(by.css('input')).getAttribute('value')).toEqual('');

    element(by.css('button')).click();
    expect(element(by.css('input')).getAttribute('value')).toEqual('{{ 7 * 6 }}');

    loadFixture('sample');
    browser.driver.executeScript('history.back()');
    var expectedValue = browser.params.browser === 'safari' ? '{{ 7 * 6 }}' : '';
    expect(element(by.css('input')).getAttribute('value')).toEqual(expectedValue);
  });
});
