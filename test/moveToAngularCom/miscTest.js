ParserTest.prototype.testReturnFunctionsAreNotBound = function(){
  var scope = createScope();
  scope.entity("Group", new DataStore());
  var Group = scope.$get("Group");
  assertEquals("eval Group", "function", typeof scope.$eval("Group"));
  assertEquals("direct Group", "function", typeof Group);
  assertEquals("eval Group.all", "function", typeof scope.$eval("Group.query"));
  assertEquals("direct Group.all", "function", typeof Group.query);
};

ParserTest.prototype.XtestItShouldParseEmptyOnChangeAsNoop = function () {
  var scope = createScope();
  scope.watch("", function(){fail();});
};


ParserTest.prototype.XtestItShouldParseOnChangeIntoHashSet = function () {
  var scope = createScope({count:0});
  scope.watch("$anchor.a:count=count+1;$anchor.a:count=count+20;b:count=count+300");

  scope.watchListeners["$anchor.a"].listeners[0]();
  assertEquals(1, scope.$get("count"));
  scope.watchListeners["$anchor.a"].listeners[1]();
  assertEquals(21, scope.$get("count"));
  scope.watchListeners["b"].listeners[0]({scope:scope});
  assertEquals(321, scope.$get("count"));
};
ParserTest.prototype.XtestItShouldParseOnChangeBlockIntoHashSet = function () {
  var scope = createScope({count:0});
  var listeners = {a:[], b:[]};
  scope.watch("a:{count=count+1;count=count+20;};b:count=count+300",
      function(n, fn){listeners[n].push(fn);});

  assertEquals(1, scope.watchListeners.a.listeners.length);
  assertEquals(1, scope.watchListeners.b.listeners.length);
  scope.watchListeners["a"].listeners[0]();
  assertEquals(21, scope.$get("count"));
  scope.watchListeners["b"].listeners[0]();
  assertEquals(321, scope.$get("count"));
};

FiltersTest.prototype.testBytes = function(){
  var controller = new FileController();
  assertEquals(angular.filter.bytes(123), '123 bytes');
  assertEquals(angular.filter.bytes(1234), '1.2 KB');
  assertEquals(angular.filter.bytes(1234567), '1.1 MB');
};

BinderTest.prototype.testDissableAutoSubmit = function() {
  var c = this.compile('<input type="submit" value="S"/>', null, {autoSubmit:true});
  assertEquals(
      '<input ng-action="$save()" ng-bind-attr="{"disabled":"{{$invalidWidgets}}"}" type="submit" value="S"></input>',
      sortedHtml(c.node));

  c = this.compile('<input type="submit" value="S"/>', null, {autoSubmit:false});
  assertEquals(
      '<input type="submit" value="S"></input>',
      sortedHtml(c.node));
};



