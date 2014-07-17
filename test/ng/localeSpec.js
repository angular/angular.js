'use strict';

describe('$locale', function() {
  /* global $LocaleProvider: false */

  var $locale = new $LocaleProvider().$get();

  it('should have locale id set to en-us', function() {
    expect($locale.id).toBe('en-us');
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


  it('should return correct plural types', function() {
    expect($locale.pluralCat(-1)).toBe('other');
    expect($locale.pluralCat(0)).toBe('other');
    expect($locale.pluralCat(2)).toBe('other');
    expect($locale.pluralCat(1)).toBe('one');
  });
});
