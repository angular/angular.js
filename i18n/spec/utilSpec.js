var util = require('../src/util.js');

describe('findLocaleId', function() {
  it('should find localeId', function() {
    expect(util.findLocaleId('', 'num')).toBeUndefined();
    expect(util.findLocaleId('aa', 'datetime')).toBeUndefined();
    expect(util.findLocaleId('aa', 'randomType')).toBeUndefined();
    expect(util.findLocaleId('NumberFormatSymbols_en', 'datetime')).toBeUndefined();
    expect(util.findLocaleId('DateTimeSymbols_en', 'num')).toBeUndefined();

    expect(util.findLocaleId('DateTimeSymbols_en', 'datetime')).toBe('en');
    expect(util.findLocaleId('NumberFormatSymbols_en_US', 'num')).toBe('en_US');
  });
});
