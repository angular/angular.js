describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-location-html5-mode/index-jquery.html");
  });
  
var addressBar = element(by.css("#addressBar")),
    url = 'http://www.example.com/base/path?a=b#h';


it("should show fake browser info on load", function(){
  expect(addressBar.getAttribute('value')).toBe(url);

  expect(element(by.binding('$location.protocol()')).getText()).toBe('http');
  expect(element(by.binding('$location.host()')).getText()).toBe('www.example.com');
  expect(element(by.binding('$location.port()')).getText()).toBe('80');
  expect(element(by.binding('$location.path()')).getText()).toBe('/path');
  expect(element(by.binding('$location.search()')).getText()).toBe('{"a":"b"}');
  expect(element(by.binding('$location.hash()')).getText()).toBe('h');

});

it("should change $location accordingly", function(){
  var navigation = element.all(by.css("#navigation a"));

  navigation.get(0).click();

  expect(addressBar.getAttribute('value')).toBe("http://www.example.com/base/first?a=b");

  expect(element(by.binding('$location.protocol()')).getText()).toBe('http');
  expect(element(by.binding('$location.host()')).getText()).toBe('www.example.com');
  expect(element(by.binding('$location.port()')).getText()).toBe('80');
  expect(element(by.binding('$location.path()')).getText()).toBe('/first');
  expect(element(by.binding('$location.search()')).getText()).toBe('{"a":"b"}');
  expect(element(by.binding('$location.hash()')).getText()).toBe('');


  navigation.get(1).click();

  expect(addressBar.getAttribute('value')).toBe("http://www.example.com/base/sec/ond?flag#hash");

  expect(element(by.binding('$location.protocol()')).getText()).toBe('http');
  expect(element(by.binding('$location.host()')).getText()).toBe('www.example.com');
  expect(element(by.binding('$location.port()')).getText()).toBe('80');
  expect(element(by.binding('$location.path()')).getText()).toBe('/sec/ond');
  expect(element(by.binding('$location.search()')).getText()).toBe('{"flag":true}');
  expect(element(by.binding('$location.hash()')).getText()).toBe('hash');
});
});