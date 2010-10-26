describe('filter', function(){

  var filter = angular.filter;

  describe('Currency', function(){
    it('should do basic filter', function(){
      var html = jqLite('<span/>');
      var context = {$element:html};
      var currency = bind(context, filter.currency);

      assertEquals(currency(0), '$0.00');
      assertEquals(html.hasClass('ng-format-negative'), false);
      assertEquals(currency(-999), '$-999.00');
      assertEquals(html.hasClass('ng-format-negative'), true);
      assertEquals(currency(1234.5678), '$1,234.57');
      assertEquals(html.hasClass('ng-format-negative'), false);
    });
  });

  describe('FilterThisIsContext', function(){
    it('should do basic filter', function(){
      expectAsserts(1);
      var scope = createScope();
      scope.name = 'misko';
      filter.testFn = function () {
        assertEquals('scope not equal', 'misko', this.name);
      };
      scope.$eval("0|testFn");
      delete angular.filter['testFn'];
    });
  });

  describe('NumberFormat', function(){
    it('should do basic filter', function(){
      var context = {jqElement:jqLite('<span/>')};
      var number = bind(context, filter.number);

      assertEquals('0', number(0, 0));
      assertEquals('0.00', number(0));
      assertEquals('-999.00', number(-999));
      assertEquals('1,234.57', number(1234.5678));
      assertEquals('', number(Number.NaN));
      assertEquals('1,234.57', number("1234.5678"));
      assertEquals("", number(1/0));
    });
  });

  describe('Json', function () {
    it('should do basic filter', function(){
      assertEquals(toJson({a:"b"}, true), filter.json.call({$element:jqLite('<div></div>')}, {a:"b"}));
    });
  });

  describe('Lowercase', function() {
    it('should do basic filter', function(){
      assertEquals('abc', filter.lowercase('AbC'));
      assertEquals(null, filter.lowercase(null));
    });
  });

  describe('Uppercase', function() {
    it('should do basic filter', function(){
      assertEquals('ABC', filter.uppercase('AbC'));
      assertEquals(null, filter.uppercase(null));
    });
  });

  describe('Html', function() {
    it('should do basic filter', function(){
      var html = filter.html("a<b>c</b>d");
      expect(html instanceof HTML).toBeTruthy();
      expect(html.html).toEqual("a<b>c</b>d");
    });
  });

  describe('Linky', function() {
    it('should do basic filter', function(){
      var linky = filter.linky;
      assertEquals(
          '<a href="http://ab/">http://ab/</a> ' +
          '(<a href="http://a/">http://a/</a>) ' +
          '&lt;<a href="http://a/">http://a/</a>&gt; ' +
          '<a href="http://1.2/v:~-123">http://1.2/v:~-123</a>. c',
          linky("http://ab/ (http://a/) <http://a/> http://1.2/v:~-123. c").html);
      assertEquals(undefined, linky(undefined));
    });
  });

  describe('date', function(){

    var morning  = new TzDate(+5, '2010-09-03T12:05:08Z'); //7am
    var noon =     new TzDate(+5, '2010-09-03T17:05:08Z'); //12pm
    var midnight = new TzDate(+5, '2010-09-03T05:05:08Z'); //12am


    it('should ignore falsy inputs', function() {
      expect(filter.date(null)).toEqual(null);
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

    it('should accept format', function() {
      expect(filter.date(morning, "yy-MM-dd HH:mm:ss")).
                           toEqual('10-09-03 07:05:08');

      expect(filter.date(midnight, "yyyy-M-d h=H:m:saZ")).
                           toEqual('2010-9-3 12=0:5:8am0500');

      expect(filter.date(midnight, "yyyy-MM-dd hh=HH:mm:ssaZ")).
                           toEqual('2010-09-03 12=00:05:08am0500');

      expect(filter.date(noon, "yyyy-MM-dd hh=HH:mm:ssaZ")).
                       toEqual('2010-09-03 12=12:05:08pm0500');
    });
  });
});
