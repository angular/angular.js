ScopeTest = TestCase('ScopeTest');

ScopeTest.prototype.testGetScopeRetrieval = function(){
  var scope = {};
  var form = jQuery("<a><b><c></c></b></a>");
  form.data('scope', scope);
  var c = form.find('c');
  assertTrue(scope === c.scope());
};

ScopeTest.prototype.testGetScopeRetrievalIntermediateNode = function(){
  var scope = {};
  var form = jQuery("<a><b><c></c></b></a>");
  form.find("b").data('scope', scope);
  var b = form.find('b');
  assertTrue(scope === b.scope());
};

ScopeTest.prototype.testNoScopeDoesNotCauseInfiniteRecursion = function(){
  var form = jQuery("<a><b><c></c></b></a>");
  var c = form.find('c');
  assertTrue(!c.scope());
};

ScopeTest.prototype.testScopeEval = function(){
  var scope = new nglr.Scope({b:345});
  assertEquals(scope.eval('b = 123'), 123);
  assertEquals(scope.get('b'), 123);
};

ScopeTest.prototype.testScopeFromPrototype = function(){
  var scope = new nglr.Scope({b:123});
  scope.eval('a = b');
  scope.eval('b = 456');
  assertEquals(scope.get('a'), 123);
  assertEquals(scope.get('b'), 456);
};

ScopeTest.prototype.testSetScopeGet = function(){
  var scope = new nglr.Scope();
  scope.set('a', 987);
  assertEquals(scope.get('a'), 987);
  assertEquals(scope.eval('a'), 987);
};

ScopeTest.prototype.testGetChain = function(){
  var scope = new nglr.Scope({a:{b:987}});
  assertEquals(scope.get('a.b'), 987);
  assertEquals(scope.eval('a.b'), 987);
};

ScopeTest.prototype.testGetUndefinedChain = function(){
  var scope = new nglr.Scope();
  assertEquals(typeof scope.get('a.b'),  'undefined');
};

ScopeTest.prototype.testSetChain = function(){
  var scope = new nglr.Scope({a:{}});
  scope.set('a.b', 987);
  assertEquals(scope.get('a.b'), 987);
  assertEquals(scope.eval('a.b'), 987);
};

ScopeTest.prototype.testSetGetOnChain = function(){
  var scope = new nglr.Scope();
  scope.set('a.b', 987);
  assertEquals(scope.get('a.b'), 987);
  assertEquals(scope.eval('a.b'), 987);
};

ScopeTest.prototype.testGlobalFunctionAccess =function(){
  window['scopeAddTest'] = function (a, b) {return a+b;};
  var scope = new nglr.Scope({window:window});
  assertEquals(scope.eval('window.scopeAddTest(1,2)'), 3);

  scope.set('add', function (a, b) {return a+b;});
  assertEquals(scope.eval('add(1,2)'), 3);

  scope.set('math.add', function (a, b) {return a+b;});
  assertEquals(scope.eval('math.add(1,2)'), 3);
};

ScopeTest.prototype.testValidationEval = function(){
  expectAsserts(4);
  var scope = new nglr.Scope();
  angular.validator.testValidator = function(value, expect){
    assertEquals(scope, this.scope);
    return value == expect ? null : "Error text";
  };

  assertEquals("Error text", scope.validate("testValidator:'abc'", 'x'));
  assertEquals(null, scope.validate("testValidator:'abc'", 'abc'));

  delete angular.validator['testValidator'];
};

ScopeTest.prototype.testCallingNonExistantMethodShouldProduceFriendlyException = function() {
  expectAsserts(1);
  var scope = new nglr.Scope({obj:{}});
  try {
    scope.eval("obj.iDontExist()");
    fail();
  } catch (e) {
    assertEquals("Expression 'obj.iDontExist' is not a function.", e);
  }
};

ScopeTest.prototype.testAccessingWithInvalidPathShouldThrowError = function() {
  var scope = new nglr.Scope();
  try {
    scope.get('a.{{b}}');
    fail();
  } catch (e) {
    assertEquals("Expression 'a.{{b}}' is not a valid expression for accesing variables.", e);
  }
};

ScopeTest.prototype.testItShouldHave$parent = function() {
  var parent = new nglr.Scope({}, "ROOT");
  var child = new nglr.Scope(parent.state);
  assertSame("parent", child.state.$parent, parent.state);
  assertSame("root", child.state.$root, parent.state);
};

ScopeTest.prototype.testItShouldHave$root = function() {
  var scope = new nglr.Scope({}, "ROOT");
  assertSame(scope.state.$root, scope.state);
};

ScopeTest.prototype.testItShouldBuildPathOnUndefined = function(){
  var scope = new nglr.Scope({}, "ROOT");
  scope.setEval("a.$b.c", 1);
  assertJsonEquals({$b:{c:1}}, scope.get("a"));
};

ScopeTest.prototype.testItShouldMapUnderscoreFunctions = function(){
  var scope = new nglr.Scope({}, "ROOT");
  scope.set("a", [1,2,3]);
  assertEquals('function', typeof scope.get("a.$size"));
  scope.eval("a.$includeIf(4,true)");
  assertEquals(4, scope.get("a.$size")());
  assertEquals(4, scope.eval("a.$size()"));
  assertEquals('undefined', typeof scope.get("a.dontExist"));
};
