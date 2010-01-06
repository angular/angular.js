LoaderTest = TestCase('LoaderTest');

LoaderTest.prototype.testLoadCss = function(){
  if ($.browser.safari) return;
  var head = jQuery('<head/>')[0];
  var loader = new nglr.Loader(document, head, {});
  var log = '';
  loader.config.server = 'http://';
  loader.loadCss('x');
  assertEquals($(head).find('link').attr('href'), 'http://x');
};

LoaderTest.prototype.testDefaultDatabasePathFromSubdomain = function() {
  var loader = new nglr.Loader(null, null, {server:"http://account.getangular.com", database:"database"});
  loader.computeConfiguration();
  assertEquals("database", loader.config.database);

  loader = new nglr.Loader(null, null, {server:"http://account.getangular.com"});
  loader.computeConfiguration();
  assertEquals("account", loader.config.database);

  loader = new nglr.Loader(null, null, {server:"https://account.getangular.com"});
  loader.computeConfiguration();
  assertEquals("account", loader.config.database);
};



UrlWatcherTest = TestCase('UrlWatcherTest');

UrlWatcherTest.prototype.testUrlWatcher = function () {
  expectAsserts(2);
  var location = {href:"http://server", hash:""};
  var watcher = new nglr.UrlWatcher(location);
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
  var watcher = new nglr.UrlWatcher(location);
  nglr._iframe_notify_1234 = function () {
    assertEquals("undefined", typeof nglr._iframe_notify_1234);
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
  assertEquals("&lt;div&gt;&amp;amp;&lt;/div&gt;", nglr.escapeHtml('<div>&amp;</div>'));
};