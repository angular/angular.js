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

  describe('currency', function() {
    it('should do basic filter', function() {
      var html = jqLite('<span/>');
      var context = {$element:html};
      var currency = bind(context, filter.currency);

      expect(currency(0)).toEqual('$0.00');
      expect(html.hasClass('ng-format-negative')).toBeFalsy();
      expect(currency(-999)).toEqual('$-999.00');
      expect(html.hasClass('ng-format-negative')).toBeTruthy();
      expect(currency(1234.5678)).toEqual('$1,234.57');
      expect(html.hasClass('ng-format-negative')).toBeFalsy();
    });
  });

  describe('number', function() {
    it('should do basic filter', function() {
      var context = {jqElement:jqLite('<span/>')};
      var number = bind(context, filter.number);

      expect(number(0, 0)).toEqual('0');
      expect(number(0)).toEqual('0.00');
      expect(number(-999)).toEqual('-999.00');
      expect(number(1234.5678)).toEqual('1,234.57');
      expect(number(Number.NaN)).toEqual('');
      expect(number("1234.5678")).toEqual('1,234.57');
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
      expect(number(1e50,     0)).toEqual("1e+50");
      expect(number(1234.567, 0)).toEqual("1,235");
      expect(number(1234.567, 1)).toEqual("1,234.6");
      expect(number(1234.567, 2)).toEqual("1,234.57");
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
      expect(linky("mailto:me@example.com").html).toEqual('<a href="mailto:me@example.com">me@example.com</a>');
      expect(linky("me@example.com").html).toEqual('<a href="mailto:me@example.com">me@example.com</a>');
      expect(linky("send email to me@example.com, but").html).
        toEqual('send email to <a href="mailto:me@example.com">me@example.com</a>, but');
    });
  });

  describe('date', function(){

    var morning  = new TzDate(+5, '2010-09-03T12:05:08.000Z'); //7am
    var noon =     new TzDate(+5, '2010-09-03T17:05:08.000Z'); //12pm
    var midnight = new TzDate(+5, '2010-09-03T05:05:08.000Z'); //12am

    it('should ignore falsy inputs', function() {
      expect(filter.date(null)).toBeNull();
      expect(filter.date('')).toEqual('');
    });

    it('should do basic filter', function() {
      expect(filter.date(noon)).toEqual(noon.toLocaleDateString());
      expect(filter.date(noon, '')).toEqual(noon.toLocaleDateString());
    });

    it('should accept number or number string representing milliseconds as input', function() {
      expect(filter.date(noon.getTime())).toEqual(noon.toLocaleDateString());
      expect(filter.date(noon.getTime() + "")).toEqual(noon.toLocaleDateString());
    });

    it('should accept various format strings', function() {
      expect(filter.date(morning, "yy-MM-dd HH:mm:ss")).
                           toEqual('10-09-03 07:05:08');

      expect(filter.date(midnight, "yyyy-M-d h=H:m:saZ")).
                           toEqual('2010-9-3 12=0:5:8am0500');

      expect(filter.date(midnight, "yyyy-MM-dd hh=HH:mm:ssaZ")).
                           toEqual('2010-09-03 12=00:05:08am0500');

      expect(filter.date(noon, "yyyy-MM-dd hh=HH:mm:ssaZ")).
                       toEqual('2010-09-03 12=12:05:08pm0500');

      expect(filter.date(noon, "EEE, MMM d, yyyy")).
                       toEqual('Fri, Sep 3, 2010');

      expect(filter.date(noon, "EEEE, MMMMM dd, yyyy")).
                       toEqual('Friday, September 03, 2010');
    });

    it('should be able to parse ISO 8601 dates/times using', function() {
      var isoString = '2010-09-03T05:05:08.872Z';
      expect(filter.date(isoString)).
          toEqual(angular.String.toDate(isoString).toLocaleDateString());
    });

    it('should parse format ending with non-replaced string', function() {
      expect(filter.date(morning, 'yy/xxx')).toEqual('10/xxx');
    });
  });
});
