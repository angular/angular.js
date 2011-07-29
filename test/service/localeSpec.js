'use strict';

describe('$locale', function() {
  var $locale = angular.service('$locale')();


  it('should have default locale as en_US', function() {
    var localeService = angular.service('$locale');
    expect(localeService.$locale).toBe('en_US');
    expect(localeService.$regLocale).toBe('en');
  });


  it('should have NUMBER_FORMATS', function() {
    var numberFormats = $locale.NUMBER_FORMATS;
    expect(numberFormats).toBeDefined();
    expect(numberFormats.PATTERNS.length).toBe(2);
    angular.forEach(numberFormats.PATTERNS, function(pattern) {
      expect(pattern.minInt).toBeDefined();
      expect(pattern.minFrac).toBeDefined();
      expect(pattern.maxFrac).toBeDefined();
      expect(pattern.posPre).toBeDefined();
      expect(pattern.posSuf).toBeDefined();
      expect(pattern.negPre).toBeDefined();
      expect(pattern.negSuf).toBeDefined();
      expect(pattern.gSize).toBeDefined();
      expect(pattern.lgSize).toBeDefined();
    });
  });


  it('should have DATETIME_FORMATS', function() {
    var datetime = $locale.DATETIME_FORMATS;
    expect(datetime).toBeDefined();
    expect(datetime.DAY.length).toBe(7);
    expect(datetime.SHORTDAY.length).toBe(7);
    expect(datetime.SHORTMONTH.length).toBe(12);
    expect(datetime.MONTH.length).toBe(12);
    expect(datetime.AMPMS.length).toBe(2);
  });
});

