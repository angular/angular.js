it('should init with 1234.56', function() {
  expect(element(by.id('currency-default')).getText()).toBe('$1,234.56');
  expect(element(by.id('currency-custom')).getText()).toBe('USD$1,234.56');
  expect(element(by.id('currency-no-fractions')).getText()).toBe('USD$1,235');
});
it('should update', function() {
  if (browser.params.browser == 'safari') {
    // Safari does not understand the minus key. See
    // https://github.com/angular/protractor/issues/481
    return;
  }
  element(by.model('amount')).clear();
  element(by.model('amount')).sendKeys('-1234');
  expect(element(by.id('currency-default')).getText()).toBe('($1,234.00)');
  expect(element(by.id('currency-custom')).getText()).toBe('(USD$1,234.00)');
  expect(element(by.id('currency-no-fractions')).getText()).toBe('(USD$1,234)');
});