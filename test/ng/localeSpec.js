'use strict';

describe('$locale', function() {
  it('should have locale id set to en-us', inject(function($locale) {
    expect($locale.id).toBe('en-us');
  }));


  it('should (eventually) be able to change the locale', inject(function($locale) {
    runs(function() {
      $locale.set('es');
    });

    waitsFor(function() {
      return $locale.id === 'es';
    }, 'locale not updated', 2000);

    runs(function() {
      expect($locale.id).toBe('es');
      expect($locale.DATETIME_FORMATS.DAY["0"]).toBe("domingo");
      $locale.set('en-us');
    });

    waitsFor(function() {
      return $locale.id === 'en-us';
    }, 'locale not reverted', 2000);

  }));


  it('should have NUMBER_FORMATS', inject(function($locale) {
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
  }));


  it('should have DATETIME_FORMATS', inject(function($locale) {
    var datetime = $locale.DATETIME_FORMATS;
    expect(datetime).toBeDefined();
    expect(datetime.DAY.length).toBe(7);
    expect(datetime.SHORTDAY.length).toBe(7);
    expect(datetime.SHORTMONTH.length).toBe(12);
    expect(datetime.MONTH.length).toBe(12);
    expect(datetime.AMPMS.length).toBe(2);
  }));


  it('should return correct plural types', inject(function($locale) {
    expect($locale.pluralCat(-1)).toBe('other');
    expect($locale.pluralCat(0)).toBe('other');
    expect($locale.pluralCat(2)).toBe('other');
    expect($locale.pluralCat(1)).toBe('one');
  }));
});
