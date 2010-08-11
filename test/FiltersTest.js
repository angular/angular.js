FiltersTest = TestCase('FiltersTest');

FiltersTest.prototype.testCurrency = function(){
  var html = jqLite('<span/>');
  var context = {$element:html};
  var currency = bind(context, angular.filter.currency);

  assertEquals(currency(0), '$0.00');
  assertEquals(html.hasClass('ng:format-negative'), false);
  assertEquals(currency(-999), '$-999.00');
  assertEquals(html.hasClass('ng:format-negative'), true);
  assertEquals(currency(1234.5678), '$1,234.57');
  assertEquals(html.hasClass('ng:format-negative'), false);
};

FiltersTest.prototype.testFilterThisIsContext = function(){
  expectAsserts(1);
  var scope = createScope();
  scope.name = 'misko';
  angular.filter.testFn = function () {
    assertEquals('scope not equal', 'misko', this.name);
  };
  scope.$eval("0|testFn");
  delete angular.filter['testFn'];
};

FiltersTest.prototype.testNumberFormat = function(){
  var context = {jqElement:jqLite('<span/>')};
  var number = bind(context, angular.filter.number);

  assertEquals('0', number(0, 0));
  assertEquals('0.00', number(0));
  assertEquals('-999.00', number(-999));
  assertEquals('1,234.57', number(1234.5678));
  assertEquals('', number(Number.NaN));
  assertEquals('1,234.57', number("1234.5678"));
  assertEquals("", number(1/0));
};

FiltersTest.prototype.testJson = function () {
  assertEquals(toJson({a:"b"}, true), angular.filter.json.call({$element:jqLite('<div></div>')}, {a:"b"}));
};

FiltersTest.prototype.testLowercase = function() {
  assertEquals('abc', angular.filter.lowercase('AbC'));
  assertEquals(null, angular.filter.lowercase(null));
};

FiltersTest.prototype.testUppercase = function() {
  assertEquals('ABC', angular.filter.uppercase('AbC'));
  assertEquals(null, angular.filter.uppercase(null));
};

FiltersTest.prototype.testHtml = function() {
  var html = angular.filter.html("a<b>c</b>d");
  expect(html instanceof HTML).toBeTruthy();
  expect(html.html).toEqual("a<b>c</b>d");
};

FiltersTest.prototype.testLinky = function() {
  var linky = angular.filter.linky;
  assertEquals(
      '<a href="http://ab/">http://ab/</a> ' +
      '(<a href="http://a/">http://a/</a>) ' +
      '&lt;<a href="http://a/">http://a/</a>&gt; ' +
      '<a href="http://1.2/v:~-123">http://1.2/v:~-123</a>. c',
      linky("http://ab/ (http://a/) <http://a/> http://1.2/v:~-123. c").html);
  assertEquals(undefined, linky(undefined));
};

