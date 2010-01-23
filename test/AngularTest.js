AngularTest = TestCase('AngularTest');


UrlWatcherTest = TestCase('UrlWatcherTest');

UrlWatcherTest.prototype.testUrlWatcher = function () {
  expectAsserts(2);
  var location = {href:"http://server", hash:""};
  var watcher = new UrlWatcher(location);
  watcher.delay = 1;
  watcher.listener = function(url){
    assertEquals('http://getangular.test', url);
  };
  watcher.setTimeout = function(fn, delay){
    assertEquals(1, delay);
    location.href = "http://getangular.test";
    watcher.setTimeout = function(fn, delay) {
    };
    fn();
  };
  watcher.watch();
};

UrlWatcherTest.prototype.testItShouldFireOnUpdateEventWhenSpecialURLSet = function(){
  expectAsserts(2);
  var location = {href:"http://server", hash:"#$iframe_notify=1234"};
  var watcher = new UrlWatcher(location);
  angular.callbacks._iframe_notify_1234 = function () {
    assertEquals("undefined", typeof angularCallbacks._iframe_notify_1234);
    assertEquals("http://server2#", location.href);
  };
  watcher.delay = 1;
  watcher.expectedUrl = "http://server2";
  watcher.setTimeout = function(fn, delay){
    watcher.setTimeout = function(fn, delay) {};
    fn();
  };
  watcher.watch();
};

FunctionTest = TestCase("FunctionTest");

FunctionTest.prototype.testEscapeHtml = function () {
  assertEquals("&lt;div&gt;&amp;amp;&lt;/div&gt;", escapeHtml('<div>&amp;</div>'));
};