require.paths.push(__dirname + '/../i18n/');

var util = require('util.js');

describe('findLocaleID', function() {
  it('should find localeID', function() {
    expect(util.findLocaleID('', 'num')).toBeUndefined();
    expect(util.findLocaleID('aa', 'datetime')).toBeUndefined();
    expect(util.findLocaleID('aa', 'randomType')).toBeUndefined();
    expect(util.findLocaleID('NumberFormatSymbols_en', 'datetime')).toBeUndefined();
    expect(util.findLocaleID('DateTimeSymbols_en', 'num')).toBeUndefined();

    expect(util.findLocaleID('DateTimeSymbols_en', 'datetime')).toBe('en');
    expect(util.findLocaleID('NumberFormatSymbols_en_US', 'num')).toBe('en_US');
  });
});
