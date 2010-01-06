FiltersTest = TestCase('FiltersTest');

FiltersTest.prototype.testCurrency = function(){
  var html = $('<span/>');
  var context = {element:html[0]};
  var currency = nglr.bind(context, angular.filter.currency);

  assertEquals(currency(0), '$0.00');
  assertEquals(html.hasClass('ng-format-negative'), false);
  assertEquals(currency(-999), '$-999.00');
  assertEquals(html.hasClass('ng-format-negative'), true);
  assertEquals(currency(1234.5678), '$1,234.57');
  assertEquals(html.hasClass('ng-format-negative'), false);
};

FiltersTest.prototype.testFilterThisIsContext = function(){
  expectAsserts(2);
  var scope = new nglr.Scope();
  nglr.Scope.expressionCache = {};
  var context = {element:123};
  angular.filter.testFn = function () {
    assertEquals('Context not equal', this, context);
    assertEquals('scope not equal', this.scope, scope);
  };
  scope.eval("0|testFn", context);
  delete angular.filter['testFn'];
};

FiltersTest.prototype.testNumberFormat = function(){
  var context = {jqElement:$('<span/>')};
  var number = nglr.bind(context, angular.filter.number);

  assertEquals('0', number(0, 0));
  assertEquals('0.00', number(0));
  assertEquals('-999.00', number(-999));
  assertEquals('1,234.57', number(1234.5678));
  assertEquals('', number(Number.NaN));
  assertEquals('1,234.57', number("1234.5678"));
  assertEquals("", number(1/0));
};

FiltersTest.prototype.testJson = function () {
  assertEquals(nglr.toJson({a:"b"}, true), angular.filter.json({a:"b"}));
};

FiltersTest.prototype.testPackageTracking = function () {
  var assert = function(title, trackingNo) {
    var val = angular.filter.trackPackage(trackingNo, title);
    assertNotNull("Did Not Match: " + trackingNo, val);
    assertEquals(angular.filter.Meta.TAG, val.TAG);
    assertEquals(title + ": " + nglr.trim(trackingNo), val.text);
    assertNotNull(val.url);
    assertEquals(nglr.trim(trackingNo), val.trackingNo);
    assertEquals('<a href="' + val.url + '">' + val.text + '</a>', val.html);
  };
  assert('UPS', ' 1Z 999 999 99 9999 999 9 ');
  assert('UPS', '1ZW5w5220379084747');

  assert('FedEx', '418822131061812');
  assert('FedEx', '9612019 5935 3267 2473 738');
  assert('FedEx', '9612019593532672473738');
  assert('FedEx', '235354667129449');
  assert('FedEx', '915368880571');
  assert('FedEx', '901712142390');
  assert('FedEx', '297391510063413');

  assert('USPS', '9101 8052 1390 7402 4335 49');
  assert('USPS', '9101010521297963339560');
  assert('USPS', '9102901001301038667029');
  assert('USPS', '910 27974 4490 3000 8916 56');
  assert('USPS', '9102801438635051633253');
};

FiltersTest.prototype.testLink = function() {
  var assert = function(text, url, obj){
    var val = angular.filter.link(obj);
    assertEquals(angular.filter.Meta.TAG, val.TAG);
    assertEquals('<a href="' + url + '">' + text + '</a>', val.html);
  };
  assert("url", "url", "url");
  assert("hello", "url", {text:"hello", url:"url"});
  assert("a@b.com", "mailto:a@b.com", "a@b.com");
};

FiltersTest.prototype.testBytes = function(){
  var controller = new nglr.FileController();
  assertEquals(angular.filter.bytes(123), '123 bytes');
  assertEquals(angular.filter.bytes(1234), '1.2 KB');
  assertEquals(angular.filter.bytes(1234567), '1.1 MB');
};

FiltersTest.prototype.testImage = function(){
  assertEquals(null, angular.filter.image());
  assertEquals(null, angular.filter.image({}));
  assertEquals(null, angular.filter.image(""));
  assertEquals('<img src="abc"/>', angular.filter.image({url:"abc"}).html);
  assertEquals(
      '<img src="abc" style="max-width: 10px; max-height: 10px;"/>',
      angular.filter.image({url:"abc"}, 10).html);
  assertEquals(
      '<img src="abc" style="max-width: 10px; max-height: 20px;"/>',
      angular.filter.image({url:"abc"}, 10, 20).html);
};

FiltersTest.prototype.testQRcode = function() {
  assertEquals(
      '<img width="200" height="200" src="http://chart.apis.google.com/chart?chl=Hello%20world&chs=200x200&cht=qr"/>',
      angular.filter.qrcode('Hello world').html);
  assertEquals(
      '<img width="100" height="100" src="http://chart.apis.google.com/chart?chl=http%3A%2F%2Fserver%3Fa%26b%3Dc&chs=100x100&cht=qr"/>',
      angular.filter.qrcode('http://server?a&b=c', 100).html);
};

FiltersTest.prototype.testLowercase = function() {
  assertEquals('abc', angular.filter.lowercase('AbC'));
  assertEquals(null, angular.filter.lowercase(null));
};

FiltersTest.prototype.testUppercase = function() {
  assertEquals('ABC', angular.filter.uppercase('AbC'));
  assertEquals(null, angular.filter.uppercase(null));
};

FiltersTest.prototype.testLineCount = function() {
  assertEquals(1, angular.filter.linecount(null));
  assertEquals(1, angular.filter.linecount(''));
  assertEquals(1, angular.filter.linecount('a'));
  assertEquals(2, angular.filter.linecount('a\nb'));
  assertEquals(3, angular.filter.linecount('a\nb\nc'));
};

FiltersTest.prototype.testIf = function() {
  assertEquals('A', angular.filter['if']('A', true));
  assertEquals(undefined, angular.filter['if']('A', false));
};

FiltersTest.prototype.testUnless = function() {
  assertEquals('A', angular.filter.unless('A', false));
  assertEquals(undefined, angular.filter.unless('A', true));
};

FiltersTest.prototype.testGoogleChartApiEncode = function() {
  assertEquals(
      '<img width="200" height="200" src="http://chart.apis.google.com/chart?chl=Hello world&chs=200x200&cht=qr"/>',
      angular.filter.googleChartApi.encode({cht:"qr", chl:"Hello world"}).html);
};

FiltersTest.prototype.testHtml = function() {
  assertEquals(
      "a<b>c</b>d",
      angular.filter.html("a<b>c</b>d").html);
  assertTrue(angular.filter.html("a<b>c</b>d") instanceof angular.filter.Meta);
};
