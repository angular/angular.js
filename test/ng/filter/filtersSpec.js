'use strict';

describe('filters', function() {
  var filter;

  beforeEach(inject(function($filter) {
    filter = $filter;
  }));

  it('should call the filter when evaluating expression', function() {
    var filter = jasmine.createSpy('myFilter');
    createInjector(['ng', function($filterProvider) {
      $filterProvider.register('myFilter', valueFn(filter));
    }]).invoke(function($rootScope) {
      $rootScope.$eval('10|myFilter');
    });
    expect(filter).toHaveBeenCalledWith(10);
  });

  describe('formatNumber', function() {
    /* global formatNumber: false */
    var pattern;

    beforeEach(function() {
      pattern = { minInt: 1,
                  minFrac: 0,
                  maxFrac: 3,
                  posPre: '',
                  posSuf: '',
                  negPre: '-',
                  negSuf: '',
                  gSize: 3,
                  lgSize: 3 };
    });

    it('should format according to different patterns', function() {
      pattern.gSize = 2;
      var num = formatNumber(99, pattern, ',', '.');
      expect(num).toBe('99');
      num = formatNumber(888, pattern, ',', '.');
      expect(num).toBe('888');
      num = formatNumber(1234567.89, pattern, ',', '.');
      expect(num).toBe('12,34,567.89');
      num = formatNumber(1234.56, pattern, ',', '.');
      expect(num).toBe('1,234.56');

      pattern.negPre = '(';
      pattern.negSuf = '-)';
      num = formatNumber(-1234, pattern, ',', '.');
      expect(num).toBe('(1,234-)');
      pattern.posPre = '+';
      pattern.posSuf = '+';
      num = formatNumber(1234, pattern, ',', '.');
      expect(num).toBe('+1,234+');
      pattern.posPre = pattern.posSuf = '';

      pattern.minFrac = 2;
      num = formatNumber(1, pattern, ',', '.');
      expect(num).toBe('1.00');
      pattern.maxFrac = 4;
      num = formatNumber(1.11119, pattern, ',', '.');
      expect(num).toBe('1.1112');
    });

    it('should format according different separators', function() {
      var num = formatNumber(1234567.1, pattern, '.', ',', 2);
      expect(num).toBe('1.234.567,10');
      num = formatNumber(1e-14, pattern, '.', ',', 14);
      expect(num).toBe('0,00000000000001');
    });

    it('should format with or without fractionSize', function() {
      var num = formatNumber(123.1, pattern, ',', '.', 3);
      expect(num).toBe('123.100');
      num = formatNumber(123.12, pattern, ',', '.');
      expect(num).toBe('123.12');
      num = formatNumber(123.1116, pattern, ',', '.');
      expect(num).toBe('123.112');
    });

    it('should format the same with string as well as numeric fractionSize', function() {
      var num = formatNumber(123.1, pattern, ',', '.', '0');
      expect(num).toBe('123');
      num = formatNumber(123.1, pattern, ',', '.', 0);
      expect(num).toBe('123');
      num = formatNumber(123.1, pattern, ',', '.', '3');
      expect(num).toBe('123.100');
      num = formatNumber(123.1, pattern, ',', '.', 3);
      expect(num).toBe('123.100');
    });

    it('should work with negative fractionSize', function() {
      expect(formatNumber(49, pattern, ',', '.', -2)).toBe('0');
      expect(formatNumber(50, pattern, ',', '.', -2)).toBe('100');
      expect(formatNumber(51, pattern, ',', '.', -2)).toBe('100');
      expect(formatNumber(1234, pattern, ',', '.', -1)).toBe('1,230');
      expect(formatNumber(1234.567, pattern, ',', '.', -1)).toBe('1,230');
      expect(formatNumber(1235, pattern, ',', '.', -1)).toBe('1,240');
      expect(formatNumber(1235, pattern, ',', '.', -2)).toBe('1,200');
      expect(formatNumber(1235, pattern, ',', '.', -3)).toBe('1,000');
      expect(formatNumber(1235, pattern, ',', '.', -4)).toBe('0');
      expect(formatNumber(1250, pattern, ',', '.', -2)).toBe('1,300');
      expect(formatNumber(1000, pattern, ',', '.', -3)).toBe('1,000');
      expect(formatNumber(1000, pattern, ',', '.', -4)).toBe('0');
      expect(formatNumber(1000, pattern, ',', '.', -5)).toBe('0');
      expect(formatNumber(1, pattern, ',', '.', -1)).toBe('0');
      expect(formatNumber(1, pattern, ',', '.', -2)).toBe('0');
      expect(formatNumber(9, pattern, ',', '.', -1)).toBe('10');
      expect(formatNumber(501, pattern, ',', '.', -3)).toBe('1,000');
    });

    it('should format numbers that round to zero as nonnegative', function() {
      expect(formatNumber(-0.01, pattern, ',', '.', 1)).toBe('0.0');
      expect(formatNumber(-1e-10, pattern, ',', '.', 1)).toBe('0.0');
      expect(formatNumber(-0.0001, pattern, ',', '.', 3)).toBe('0.000');
      expect(formatNumber(-0.0000001, pattern, ',', '.', 6)).toBe('0.000000');
    });

    it('should work with numbers that are close to the limit for exponent notation', function() {
      // previously, numbers that n * (10 ^ fractionSize) > localLimitMax
      // were ending up with a second exponent in them, then coercing to
      // NaN when formatNumber rounded them with the safe rounding
      // function.

      var localLimitMax = 999999999999999900000,
          localLimitMin = 10000000000000000000,
          exampleNumber = 444444444400000000000;

      expect(formatNumber(localLimitMax, pattern, ',', '.', 2))
        .toBe('999,999,999,999,999,900,000.00');
      expect(formatNumber(localLimitMin, pattern, ',', '.', 2))
        .toBe('10,000,000,000,000,000,000.00');
      expect(formatNumber(exampleNumber, pattern, ',', '.', 2))
        .toBe('444,444,444,400,000,000,000.00');

    });

    it('should format large number',function() {
      var num;
      num = formatNumber(12345868059685210000, pattern, ',', '.', 2);
      expect(num).toBe('12,345,868,059,685,210,000.00');
      num = formatNumber(79832749837498327498274983793234322432, pattern, ',', '.', 2);
      expect(num).toBe('7.98e+37');
      num = formatNumber(8798327498374983274928, pattern, ',', '.', 2);
      expect(num).toBe('8,798,327,498,374,983,000,000.00');
      num = formatNumber(879832749374983274928, pattern, ',', '.', 2);
      expect(num).toBe('879,832,749,374,983,200,000.00');
      num = formatNumber(879832749374983274928, pattern, ',', '.', 32);
      expect(num).toBe('879,832,749,374,983,200,000.00000000000000000000000000000000');
    });
  });

  describe('currency', function() {
    var currency;

    beforeEach(function() {
      currency = filter('currency');
    });

    it('should do basic currency filtering', function() {
      expect(currency(0)).toEqual('$0.00');
      expect(currency(-999)).toEqual('-$999.00');
      expect(currency(1234.5678, 'USD$')).toEqual('USD$1,234.57');
      expect(currency(1234.5678, 'USD$', 0)).toEqual('USD$1,235');
    });

    it('should pass through null and undefined to be compatible with one-time binding', function() {
      expect(currency(undefined)).toBeUndefined();
      expect(currency(null)).toBe(null);
    });

    it('should return empty string for non-numbers', function() {
      expect(currency('abc')).toBe('');
      expect(currency({})).toBe('');
    });

    it('should handle zero and nearly-zero values properly', function() {
      // This expression is known to yield 4.440892098500626e-16 instead of 0.0.
      expect(currency(1.07 + 1 - 2.07)).toBe('$0.00');
      expect(currency(0.008)).toBe('$0.01');
      expect(currency(0.003)).toBe('$0.00');
    });

    it('should set the default fraction size to the max fraction size of the locale value', inject(function($locale) {
      $locale.NUMBER_FORMATS.PATTERNS[1].maxFrac = 1;

      expect(currency(1.07)).toBe('$1.1');
    }));
  });

  describe('number', function() {
    var number;

    beforeEach(function() {
      number = filter('number');
    });


    it('should do basic filter', function() {
      /* eslint-disable no-floating-decimal */
      expect(number(0, 0)).toEqual('0');
      expect(number(-999)).toEqual('-999');
      expect(number(123)).toEqual('123');
      expect(number(1234567)).toEqual('1,234,567');
      expect(number(1234)).toEqual('1,234');
      expect(number(1234.5678)).toEqual('1,234.568');
      expect(number(Number.NaN)).toEqual('');
      expect(number({})).toEqual('');
      expect(number([])).toEqual('');
      expect(number(+Infinity)).toEqual('∞');
      expect(number(-Infinity)).toEqual('-∞');
      expect(number('1234.5678')).toEqual('1,234.568');
      expect(number(1 / 0)).toEqual('∞');
      expect(number(1,        2)).toEqual('1.00');
      expect(number(.1,       2)).toEqual('0.10');
      expect(number(.01,      2)).toEqual('0.01');
      expect(number(.001,     3)).toEqual('0.001');
      expect(number(.0001,    3)).toEqual('0.000');
      expect(number(9,        2)).toEqual('9.00');
      expect(number(.9,       2)).toEqual('0.90');
      expect(number(.99,      2)).toEqual('0.99');
      expect(number(.999,     3)).toEqual('0.999');
      expect(number(.9999,    3)).toEqual('1.000');
      expect(number(1.9,      2)).toEqual('1.90');
      expect(number(1.99,     2)).toEqual('1.99');
      expect(number(1.999,    3)).toEqual('1.999');
      expect(number(1.9999,   3)).toEqual('2.000');
      expect(number(1234.567, 0)).toEqual('1,235');
      expect(number(1234.567, 1)).toEqual('1,234.6');
      expect(number(1234.567, 2)).toEqual('1,234.57');
      expect(number(1.255,    0)).toEqual('1');
      expect(number(1.255,    1)).toEqual('1.3');
      expect(number(1.255,    2)).toEqual('1.26');
      expect(number(1.255,    3)).toEqual('1.255');
      expect(number(0,        8)).toEqual('0.00000000');
      /* eslint-enable */
    });

    it('should pass through null and undefined to be compatible with one-time binding', function() {
      expect(number(null)).toBe(null);
      expect(number(undefined)).toBeUndefined();
    });

    it('should filter exponentially large numbers', function() {
      expect(number(1.23e50)).toEqual('1.23e+50');
      expect(number(-2.3456e100)).toEqual('-2.346e+100');
      expect(number(1e50, 2)).toEqual('1.00e+50');
      expect(number(-2e100, 5)).toEqual('-2.00000e+100');
    });

    it('should filter exponentially small numbers', function() {
      expect(number(1e-50, 0)).toEqual('0');
      expect(number(1e-6, 6)).toEqual('0.000001');
      expect(number(1e-7, 6)).toEqual('0.000000');
      expect(number(9e-7, 6)).toEqual('0.000001');

      expect(number(-1e-50, 0)).toEqual('0');
      expect(number(-1e-6, 6)).toEqual('-0.000001');
      expect(number(-1e-7, 6)).toEqual('0.000000');
      expect(number(-1e-8, 9)).toEqual('-0.000000010');
    });

    it('should filter exponentially small numbers when no fraction specified', function() {
      expect(number(1e-10)).toEqual('0.000');
      expect(number(0.0000000001)).toEqual('0.000');

      expect(number(-1e-10)).toEqual('0.000');
      expect(number(-0.0000000001)).toEqual('0.000');
    });
  });

  describe('json', function() {
    it('should do basic filter', function() {
      expect(filter('json')({a:'b'})).toEqual(toJson({a:'b'}, true));
    });
    it('should allow custom indentation', function() {
      expect(filter('json')({a:'b'}, 4)).toEqual(toJson({a:'b'}, 4));
    });
  });

  describe('lowercase', function() {
    it('should do basic filter', function() {
      expect(filter('lowercase')('AbC')).toEqual('abc');
      expect(filter('lowercase')(null)).toBeNull();
    });
  });

  describe('uppercase', function() {
    it('should do basic filter', function() {
      expect(filter('uppercase')('AbC')).toEqual('ABC');
      expect(filter('uppercase')(null)).toBeNull();
    });
  });

  describe('date', function() {
    var morning    = new angular.mock.TzDate(+5, '2010-09-03T12:05:08.001Z'); //7am
    var noon       = new angular.mock.TzDate(+5, '2010-09-03T17:05:08.012Z'); //12pm
    var midnight   = new angular.mock.TzDate(+5, '2010-09-03T05:05:08.123Z'); //12am
    var earlyDate  = new angular.mock.TzDate(+5, '0001-09-03T05:05:08.000Z');
    var year0Date  = new angular.mock.TzDate(+5, '0000-12-25T05:05:08.000Z');
    var bcDate     = new angular.mock.TzDate(+5, '-0026-01-16T05:05:08.000Z');
    var secondWeek = new angular.mock.TzDate(+5, '2013-01-11T12:00:00.000Z'); //Friday Jan 11, 2013
    var date;

    beforeEach(function() {
      date = filter('date');
    });

    it('should ignore falsy inputs', function() {
      expect(date(null)).toBeNull();
      expect(date('')).toEqual('');
    });

    it('should ignore invalid dates', function() {
      var invalidDate = new Date('abc');
      expect(date(invalidDate)).toBe(invalidDate);
    });

    it('should do basic filter', function() {
      expect(date(noon)).toEqual(date(noon, 'mediumDate'));
      expect(date(noon, '')).toEqual(date(noon, 'mediumDate'));
    });

    it('should accept number or number string representing milliseconds as input', function() {
      expect(date(noon.getTime())).toEqual(date(noon.getTime(), 'mediumDate'));
      expect(date(noon.getTime() + '')).toEqual(date(noon.getTime() + '', 'mediumDate'));
    });

    it('should accept various format strings', function() {
      expect(date(secondWeek, 'yyyy-Ww')).
                      toEqual('2013-W2');

      expect(date(secondWeek, 'yyyy-Www')).
                      toEqual('2013-W02');

      expect(date(morning, 'yy-MM-dd HH:mm:ss')).
                      toEqual('10-09-03 07:05:08');

      expect(date(morning, 'yy-MM-dd HH:mm:ss.sss')).
                      toEqual('10-09-03 07:05:08.001');

      expect(date(midnight, 'yyyy-M-d h=H:m:saZ')).
                      toEqual('2010-9-3 12=0:5:8AM-0500');

      expect(date(midnight, 'yyyy-MM-dd hh=HH:mm:ssaZ')).
                      toEqual('2010-09-03 12=00:05:08AM-0500');

      expect(date(midnight, 'yyyy-MM-dd hh=HH:mm:ss.sssaZ')).
                      toEqual('2010-09-03 12=00:05:08.123AM-0500');

      expect(date(noon, 'yyyy-MM-dd hh=HH:mm:ssaZ')).
                      toEqual('2010-09-03 12=12:05:08PM-0500');

      expect(date(noon, 'yyyy-MM-dd hh=HH:mm:ss.sssaZ')).
                      toEqual('2010-09-03 12=12:05:08.012PM-0500');

      expect(date(noon, 'EEE, MMM d, yyyy')).
                      toEqual('Fri, Sep 3, 2010');

      expect(date(noon, 'EEEE, MMMM dd, yyyy')).
                      toEqual('Friday, September 03, 2010');

      expect(date(earlyDate, 'MMMM dd, y')).
                      toEqual('September 03, 1');

      expect(date(earlyDate, 'MMMM dd, yyyy')).
                      toEqual('September 03, 0001');

      expect(date(year0Date, 'dd MMMM y G')).
                      toEqual('25 December 1 BC');

      expect(date(bcDate, 'dd MMMM y G')).
                      toEqual('16 January 27 BC');

      expect(date(noon, 'MMMM dd, y G')).
                      toEqual('September 03, 2010 AD');

      expect(date(noon, 'MMMM dd, y GG')).
                      toEqual('September 03, 2010 AD');

      expect(date(noon, 'MMMM dd, y GGG')).
                      toEqual('September 03, 2010 AD');

      expect(date(noon, 'MMMM dd, y GGGG')).
                      toEqual('September 03, 2010 Anno Domini');
    });

    it('should support STANDALONEMONTH in format (`LLLL`)', inject(function($locale) {
      var standAloneMonth = $locale.DATETIME_FORMATS.STANDALONEMONTH;
      var september = standAloneMonth[8];
      var standAloneSeptember = 'StandAlone' + september;

      // Overwrite September in STANDALONEMONTH
      standAloneMonth[8] = standAloneSeptember;

      expect(date(noon, 'MMMM')).toEqual(september);
      expect(date(noon, 'LLLL')).toEqual(standAloneSeptember);

      // Restore September in STANDALONEMONTH
      standAloneMonth[8] = september;
    }));

    it('should accept negative numbers as strings', function() {
      //Note: this tests a timestamp set for 3 days before the unix epoch.
      //The behavior of `date` depends on your timezone, which is why we check just
      //the year and not the whole daye. See Issue #4218
      expect(date('-259200000').split(' ')[2]).toEqual('1969');
    });

    it('should format timezones correctly (as per ISO_8601)', function() {
      //Note: TzDate's first argument is offset, _not_ timezone.
      var utc       = new angular.mock.TzDate(0, '2010-09-03T12:05:08.000Z');
      var eastOfUTC = new angular.mock.TzDate(-5, '2010-09-03T12:05:08.000Z');
      var westOfUTC = new angular.mock.TzDate(+5, '2010-09-03T12:05:08.000Z');
      var eastOfUTCPartial = new angular.mock.TzDate(-5.5, '2010-09-03T12:05:08.000Z');
      var westOfUTCPartial = new angular.mock.TzDate(+5.5, '2010-09-03T12:05:08.000Z');

      expect(date(utc, 'yyyy-MM-ddTHH:mm:ssZ')).
                    toEqual('2010-09-03T12:05:08+0000');

      expect(date(eastOfUTC, 'yyyy-MM-ddTHH:mm:ssZ')).
                    toEqual('2010-09-03T17:05:08+0500');

      expect(date(westOfUTC, 'yyyy-MM-ddTHH:mm:ssZ')).
                    toEqual('2010-09-03T07:05:08-0500');

      expect(date(eastOfUTCPartial, 'yyyy-MM-ddTHH:mm:ssZ')).
                    toEqual('2010-09-03T17:35:08+0530');

      expect(date(westOfUTCPartial, 'yyyy-MM-ddTHH:mm:ssZ')).
                    toEqual('2010-09-03T06:35:08-0530');
    });

    it('should correctly calculate week number', function() {
      function formatWeek(dateToFormat) {
        return date(new angular.mock.TzDate(+5, dateToFormat + 'T12:00:00.000Z'), 'ww (EEE)');
      }

      expect(formatWeek('2007-01-01')).toEqual('01 (Mon)');
      expect(formatWeek('2007-12-31')).toEqual('53 (Mon)');

      expect(formatWeek('2008-01-01')).toEqual('01 (Tue)');
      expect(formatWeek('2008-12-31')).toEqual('53 (Wed)');

      expect(formatWeek('2014-01-01')).toEqual('01 (Wed)');
      expect(formatWeek('2014-12-31')).toEqual('53 (Wed)');

      expect(formatWeek('2009-01-01')).toEqual('01 (Thu)');
      expect(formatWeek('2009-12-31')).toEqual('53 (Thu)');

      expect(formatWeek('2010-01-01')).toEqual('00 (Fri)');
      expect(formatWeek('2010-12-31')).toEqual('52 (Fri)');

      expect(formatWeek('2011-01-01')).toEqual('00 (Sat)');
      expect(formatWeek('2011-01-02')).toEqual('01 (Sun)');
      expect(formatWeek('2011-01-03')).toEqual('01 (Mon)');
      expect(formatWeek('2011-12-31')).toEqual('52 (Sat)');

      expect(formatWeek('2012-01-01')).toEqual('01 (Sun)');
      expect(formatWeek('2012-01-02')).toEqual('01 (Mon)');
      expect(formatWeek('2012-12-31')).toEqual('53 (Mon)');
    });

    it('should treat single quoted strings as string literals', function() {
      expect(date(midnight, 'yyyy\'de\' \'a\'x\'dd\' \'adZ\' h=H:m:saZ')).
                      toEqual('2010de axdd adZ 12=0:5:8AM-0500');
    });

    it('should treat a sequence of two single quotes as a literal single quote', function() {
      expect(date(midnight, 'yyyy\'de\' \'a\'\'dd\' \'adZ\' h=H:m:saZ')).
                      toEqual('2010de a\'dd adZ 12=0:5:8AM-0500');
      expect(date(midnight, 'EEE, MMM d, \'\'yy')).
                      toEqual('Fri, Sep 3, \'10');
    });

    it('should accept default formats', function() {

      expect(date(noon, 'medium')).
                      toEqual('Sep 3, 2010 12:05:08 PM');

      expect(date(noon, 'short')).
                      toEqual('9/3/10 12:05 PM');

      expect(date(noon, 'fullDate')).
                      toEqual('Friday, September 3, 2010');

      expect(date(noon, 'longDate')).
                      toEqual('September 3, 2010');

      expect(date(noon, 'mediumDate')).
                      toEqual('Sep 3, 2010');

      expect(date(noon, 'shortDate')).
                      toEqual('9/3/10');

      expect(date(noon, 'mediumTime')).
                      toEqual('12:05:08 PM');

      expect(date(noon, 'shortTime')).
                      toEqual('12:05 PM');
    });

    it('should parse format ending with non-replaced string', function() {
      expect(date(morning, 'yy/xxx')).toEqual('10/xxx');
    });

    it('should support various iso8061 date strings with timezone as input', function() {
      var format = 'yyyy-MM-dd ss';

      var localDay = new Date(Date.UTC(2003, 9, 10, 13, 2, 3, 0)).getDate();

      //full ISO8061
      expect(date('2003-09-10T13:02:03.000Z', format)).toEqual('2003-09-' + localDay + ' 03');

      expect(date('2003-09-10T13:02:03.000+00:00', format)).toEqual('2003-09-' + localDay + ' 03');

      expect(date('20030910T033203-0930', format)).toEqual('2003-09-' + localDay + ' 03');

      //no millis
      expect(date('2003-09-10T13:02:03Z', format)).toEqual('2003-09-' + localDay + ' 03');

      //no seconds
      expect(date('2003-09-10T13:02Z', format)).toEqual('2003-09-' + localDay + ' 00');

      //no minutes
      expect(date('2003-09-10T13Z', format)).toEqual('2003-09-' + localDay + ' 00');
    });

    it('should parse iso8061 date strings without timezone as local time', function() {
      var format = 'yyyy-MM-dd HH-mm-ss';

      //full ISO8061 without timezone
      expect(date('2003-09-10T03:02:04.000', format)).toEqual('2003-09-10 03-02-04');

      expect(date('20030910T030204', format)).toEqual('2003-09-10 03-02-04');

      //no time
      expect(date('2003-09-10', format)).toEqual('2003-09-10 00-00-00');
    });

    it('should support different degrees of subsecond precision', function() {
      var format = 'yyyy-MM-dd ss';

      var localDay = new Date(Date.UTC(2003, 9 - 1, 10, 13, 2, 3, 123)).getDate();

      expect(date('2003-09-10T13:02:03.12345678Z', format)).toEqual('2003-09-' + localDay + ' 03');
      expect(date('2003-09-10T13:02:03.1234567Z', format)).toEqual('2003-09-' + localDay + ' 03');
      expect(date('2003-09-10T13:02:03.123456Z', format)).toEqual('2003-09-' + localDay + ' 03');
      expect(date('2003-09-10T13:02:03.12345Z', format)).toEqual('2003-09-' + localDay + ' 03');
      expect(date('2003-09-10T13:02:03.1234Z', format)).toEqual('2003-09-' + localDay + ' 03');
      expect(date('2003-09-10T13:02:03.123Z', format)).toEqual('2003-09-' + localDay + ' 03');
      expect(date('2003-09-10T13:02:03.12Z', format)).toEqual('2003-09-' + localDay + ' 03');
      expect(date('2003-09-10T13:02:03.1Z', format)).toEqual('2003-09-' + localDay + ' 03');
    });

    it('should use UTC if the timezone is set to "UTC"', function() {
      expect(date(new Date(2003, 8, 10, 3, 2, 4), 'yyyy-MM-dd HH-mm-ss')).toEqual('2003-09-10 03-02-04');
      expect(date(new Date(Date.UTC(2003, 8, 10, 3, 2, 4)), 'yyyy-MM-dd HH-mm-ss', 'UTC')).toEqual('2003-09-10 03-02-04');
      expect(date(new Date(Date.UTC(2003, 8, 10, 3, 2, 4)), 'yyyy-MM-dd HH-mm-ssZ', 'UTC')).toEqual('2003-09-10 03-02-04+0000');
    });

    it('should support conversion to any timezone', function() {
      var dateObj = new Date(Date.UTC(2003, 8, 10, 3, 2, 4));
      var format = 'yyyy-MM-dd HH-mm-ssZ';

      expect(date(dateObj, format, '+0500')).toEqual('2003-09-10 08-02-04+0500');
      expect(date(dateObj, format, '+05:00')).toEqual('2003-09-10 08-02-04+0500');
      expect(date(dateObj, format, 'GMT+0500')).toEqual('2003-09-10 08-02-04+0500');
      expect(date(dateObj, format, 'GMT+05:00')).toEqual('2003-09-10 08-02-04+0500');
    });

    it('should fallback to default timezone in case an unknown timezone was passed', function() {
      var value = new Date(2003, 8, 10, 3, 2, 4);
      expect(date(value, 'yyyy-MM-dd HH-mm-ssZ', 'WTF')).toEqual(date(value, 'yyyy-MM-dd HH-mm-ssZ'));
    });
  });
});
