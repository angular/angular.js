UrlWatcherTest = TestCase('UrlWatcherTest');

UrlWatcherTest.prototype.testUrlWatcher = function () {
  expectAsserts(2);
  var location = {href:"http://server", hash:""};
  var watcher = new UrlWatcher(location);
  watcher.delay = 1;
  watcher.watch(function(url){
    assertEquals('http://getangular.test', url);
  });
  watcher.setTimeout = function(fn, delay){
    assertEquals(1, delay);
    location.href = "http://getangular.test";
    watcher.setTimeout = function(fn, delay) {
    };
    fn();
  };
  watcher.start();
};

FunctionTest = TestCase("FunctionTest");

FunctionTest.prototype.testEscapeHtml = function () {
  assertEquals("&lt;div&gt;&amp;amp;&lt;/div&gt;", escapeHtml('<div>&amp;</div>'));
};
