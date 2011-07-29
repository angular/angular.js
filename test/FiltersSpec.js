'use strict';

describe('filter', function() {

  var filter = angular.filter;

  it('should called the filter when evaluating expression', function() {
    var scope = createScope();
    filter.fakeFilter = function(){};
    spyOn(filter, 'fakeFilter');

    scope.$eval('10|fakeFilter');
    expect(filter.fakeFilter).toHaveBeenCalledWith(10);
    delete filter['fakeFilter'];
  });

  it('should call filter on scope context', function() {
    var scope = createScope();
    scope.name = 'misko';
    filter.fakeFilter = function() {
      expect(this.name).toEqual('misko');
    };
    spyOn(filter, 'fakeFilter').andCallThrough();

    scope.$eval('10|fakeFilter');
    expect(filter.fakeFilter).toHaveBeenCalled();
    delete filter['fakeFilter'];
  });

  describe('formatNumber', function() {
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
      var num = formatNumber(1234567.89, pattern, ',', '.');
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

    it('should format according different seperators', function() {
      var num = formatNumber(1234567.1, pattern, '.', ',', 2);
      expect(num).toBe('1.234.567,10');
    });

    it('should format with or without fractionSize', function() {
      var num = formatNumber(123.1, pattern, ',', '.', 3);
      expect(num).toBe('123.100');
      num = formatNumber(123.12, pattern, ',', '.');
      expect(num).toBe('123.12');
      var num = formatNumber(123.1116, pattern, ',', '.');
      expect(num).toBe('123.112');
    });
  });

  describe('currency', function() {
    it('should do basic currency filtering', function() {
      var html = jqLite('<span/>');
      var context = createScope();
      context.$element = html;
      var currency = bind(context, filter.currency);

      expect(currency(0)).toEqual('$0.00');
      expect(html.hasClass('ng-format-negative')).toBeFalsy();
      expect(currency(-999)).toEqual('($999.00)');
      expect(html.hasClass('ng-format-negative')).toBeTruthy();
      expect(currency(1234.5678, "USD$")).toEqual('USD$1,234.57');
      expect(html.hasClass('ng-format-negative')).toBeFalsy();

      dealoc(context);
    });
  });

  describe('number', function() {
    var context, number;

    beforeEach(function() {
      context = createScope();
      number = bind(context, filter.number);
    });


    it('should do basic filter', function() {
      expect(number(0, 0)).toEqual('0');
      expect(number(-999)).toEqual('-999');
      expect(number(123)).toEqual('123');
      expect(number(1234567)).toEqual('1,234,567');
      expect(number(1234)).toEqual('1,234');
      expect(number(1234.5678)).toEqual('1,234.568');
      expect(number(Number.NaN)).toEqual('');
      expect(number("1234.5678")).toEqual('1,234.568');
      expect(number(1/0)).toEqual("");
      expect(number(1,        2)).toEqual("1.00");
      expect(number(.1,       2)).toEqual("0.10");
      expect(number(.01,      2)).toEqual("0.01");
      expect(number(.001,     3)).toEqual("0.001");
      expect(number(.0001,    3)).toEqual("0.000");
      expect(number(9,        2)).toEqual("9.00");
      expect(number(.9,       2)).toEqual("0.90");
      expect(number(.99,      2)).toEqual("0.99");
      expect(number(.999,     3)).toEqual("0.999");
      expect(number(.9999,    3)).toEqual("1.000");
      expect(number(1234.567, 0)).toEqual("1,235");
      expect(number(1234.567, 1)).toEqual("1,234.6");
      expect(number(1234.567, 2)).toEqual("1,234.57");
    });

    it('should filter exponential numbers', function() {
      expect(number(1e50, 0)).toEqual('1e+50');
      expect(number(-2e50, 2)).toEqual('-2e+50');
    });
  });

  describe('json', function () {
    it('should do basic filter', function() {
      expect(filter.json.call({$element:jqLite('<div></div>')}, {a:"b"})).toEqual(toJson({a:"b"}, true));
    });
  });

  describe('lowercase', function() {
    it('should do basic filter', function() {
      expect(filter.lowercase('AbC')).toEqual('abc');
      expect(filter.lowercase(null)).toBeNull();
    });
  });

  describe('uppercase', function() {
    it('should do basic filter', function() {
      expect(filter.uppercase('AbC')).toEqual('ABC');
      expect(filter.uppercase(null)).toBeNull();
    });
  });

  describe('html', function() {
    it('should do basic filter', function() {
      var html = filter.html("a<b>c</b>d");
      expect(html instanceof HTML).toBeTruthy();
      expect(html.html).toEqual("a<b>c</b>d");
    });
  });

  describe('linky', function() {
    var linky = filter.linky;
    it('should do basic filter', function() {
      expect(linky("http://ab/ (http://a/) <http://a/> http://1.2/v:~-123. c").html).
        toEqual('<a href="http://ab/">http://ab/</a> ' +
                '(<a href="http://a/">http://a/</a>) ' +
                '&lt;<a href="http://a/">http://a/</a>&gt; ' +
                '<a href="http://1.2/v:~-123">http://1.2/v:~-123</a>. c');
      expect(linky(undefined)).not.toBeDefined();
    });

    it('should handle mailto:', function() {
      expect(linky("mailto:me@example.com").html).
                      toEqual('<a href="mailto:me@example.com">me@example.com</a>');
      expect(linky("me@example.com").html).
                      toEqual('<a href="mailto:me@example.com">me@example.com</a>');
      expect(linky("send email to me@example.com, but").html).
        toEqual('send email to <a href="mailto:me@example.com">me@example.com</a>, but');
    });
  });

  describe('date', function(){

    var morning  = new TzDate(+5, '2010-09-03T12:05:08.000Z'); //7am
    var noon =     new TzDate(+5, '2010-09-03T17:05:08.000Z'); //12pm
    var midnight = new TzDate(+5, '2010-09-03T05:05:08.000Z'); //12am
    var earlyDate = new TzDate(+5, '0001-09-03T05:05:08.000Z');
    var timZoneDate = new TzDate(+5, '2010-09-03T05:05:08.000Z',
                                     'Mon Sep 3 2010 00:05:08 GMT+0500 (XYZ)'); //12am

    var context, date;

    beforeEach(function() {
      context = createScope();
      date = bind(context, filter.date);
    });

    it('should ignore falsy inputs', function() {
      expect(date(null)).toBeNull();
      expect(date('')).toEqual('');
    });

    it('should do basic filter', function() {
      expect(date(noon)).toEqual(noon.toLocaleDateString());
      expect(date(noon, '')).toEqual(noon.toLocaleDateString());
    });

    it('should accept number or number string representing milliseconds as input', function() {
      expect(date(noon.getTime())).toEqual(noon.toLocaleDateString());
      expect(date(noon.getTime() + "")).toEqual(noon.toLocaleDateString());
    });

    it('should accept various format strings', function() {
      expect(date(morning, "yy-MM-dd HH:mm:ss")).
                      toEqual('10-09-03 07:05:08');

      expect(date(midnight, "yyyy-M-d h=H:m:saZ")).
                      toEqual('2010-9-3 12=0:5:8am0500');

      expect(date(midnight, "yyyy-MM-dd hh=HH:mm:ssaZ")).
                      toEqual('2010-09-03 12=00:05:08am0500');

      expect(date(noon, "yyyy-MM-dd hh=HH:mm:ssaZ")).
                      toEqual('2010-09-03 12=12:05:08pm0500');

      expect(date(timZoneDate, "yyyy-MM-dd hh=HH:mm:ss a z")).
                      toEqual('2010-09-03 12=00:05:08 am XYZ');

      expect(date(noon, "EEE, MMM d, yyyy")).
                      toEqual('Fri, Sep 3, 2010');

      expect(date(noon, "EEEE, MMMM dd, yyyy")).
                      toEqual('Friday, September 03, 2010');

      expect(date(earlyDate, "MMMM dd, y")).
                      toEqual('September 03, 1');
    });

    it('should treat single quoted strings as string literals', function() {
      expect(date(midnight, "yyyy'de' 'a'x'dd' 'adZ' h=H:m:saZ")).
                      toEqual('2010de axdd adZ 12=0:5:8AM0500');
    });

    it('should treat a sequence of two single quotes as a literal single quote', function() {
      expect(date(midnight, "yyyy'de' 'a''dd' 'adZ' h=H:m:saZ")).
                      toEqual("2010de a'dd adZ 12=0:5:8AM0500");
    });

    it('should accept default formats', function() {

      expect(date(timZoneDate, "long")).
                      toEqual('September 3, 2010 12:05:08 am XYZ');

      expect(date(noon, "medium")).
                      toEqual('Sep 3, 2010 12:05:08 pm');

      expect(date(noon, "short")).
                      toEqual('9/3/10 12:05 pm');

      expect(date(noon, "fullDate")).
                      toEqual('Friday, September 3, 2010');

      expect(date(noon, "longDate")).
                      toEqual('September 3, 2010');

      expect(date(noon, "mediumDate")).
                      toEqual('Sep 3, 2010');

      expect(date(noon, "shortDate")).
                      toEqual('9/3/10');

      expect(date(timZoneDate, "longTime")).
                      toEqual('12:05:08 am XYZ');

      expect(date(noon, "mediumTime")).
                      toEqual('12:05:08 pm');

      expect(date(noon, "shortTime")).
                      toEqual('12:05 pm');
    });


    it('should parse timezone identifier from various toString values', function() {
      //chrome and firefox format
      expect(date(new TzDate(+5, '2010-09-03T17:05:08.000Z',
                                    'Mon Sep 3 2010 17:05:08 GMT+0500 (XYZ)'), "z")).toBe('XYZ');

      //opera format
      expect(date(new TzDate(+5, '2010-09-03T17:05:08.000Z',
                                    '2010-09-03T17:05:08Z'), "z")).toBe('0500');

      //ie 8 format
      expect(date(new TzDate(+5, '2010-09-03T17:05:08.000Z',
                                    'Mon Sep 3 17:05:08 XYZ 2010'), "z")).toBe('XYZ');
    });


    it('should be able to parse ISO 8601 dates/times using', function() {
      var isoString = '2010-09-03T05:05:08.872Z';
      expect(date(isoString)).
          toEqual(angular.String.toDate(isoString).toLocaleDateString());
    });

    it('should parse format ending with non-replaced string', function() {
      expect(date(morning, 'yy/xxx')).toEqual('10/xxx');
    });
  });
});
