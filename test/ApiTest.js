ApiTest = TestCase("ApiTest");

ApiTest.prototype.testItShouldReturnTypeOf = function (){
  assertEquals("undefined", angular.Object.typeOf(undefined));
  assertEquals("null", angular.Object.typeOf(null));
  assertEquals("object", angular.Collection.typeOf({}));
  assertEquals("array", angular.Array.typeOf([]));
  assertEquals("string", angular.Object.typeOf(""));
  assertEquals("date", angular.Object.typeOf(new Date()));
  assertEquals("element", angular.Object.typeOf(document.body));
  assertEquals("function", angular.Object.typeOf(function(){}));
};
  
ApiTest.prototype.testItShouldReturnSize = function(){
  assertEquals(0, angular.Collection.size({}));
  assertEquals(1, angular.Collection.size({a:"b"}));
  assertEquals(0, angular.Object.size({}));
  assertEquals(1, angular.Array.size([0]));
};

ApiTest.prototype.testIncludeIf = function() {
  var array = [];
  var obj = {};

  angular.Array.includeIf(array, obj, true);
  angular.Array.includeIf(array, obj, true);
  assertTrue(_.include(array, obj));
  assertEquals(1, array.length);

  angular.Array.includeIf(array, obj, false);
  assertFalse(_.include(array, obj));
  assertEquals(0, array.length);

  angular.Array.includeIf(array, obj, 'x');
  assertTrue(_.include(array, obj));
  assertEquals(1, array.length);
  angular.Array.includeIf(array, obj, '');
  assertFalse(_.include(array, obj));
  assertEquals(0, array.length);
};

ApiTest.prototype.testSum = function(){
  assertEquals(3, angular.Array.sum([{a:"1"}, {a:"2"}], 'a'));
};

ApiTest.prototype.testSumContainingNaN = function(){
  assertEquals(1, angular.Array.sum([{a:1}, {a:Number.NaN}], 'a'));
  assertEquals(1, angular.Array.sum([{a:1}, {a:Number.NaN}], function($){return $.a;}));
};

ApiTest.prototype.testInclude = function(){
  assertTrue(angular.Array.include(['a'], 'a'));
  assertTrue(angular.Array.include(['a', 'b'], 'a'));
  assertTrue(!angular.Array.include(['c'], 'a'));
  assertTrue(!angular.Array.include(['c', 'b'], 'a'));
};

ApiTest.prototype.testIndex = function(){
  assertEquals(angular.Array.indexOf(['a'], 'a'), 0);
  assertEquals(angular.Array.indexOf(['a', 'b'], 'a'), 0);
  assertEquals(angular.Array.indexOf(['b', 'a'], 'a'), 1);
  assertEquals(angular.Array.indexOf(['b', 'b'],'x'), -1);
};

ApiTest.prototype.testRemove = function(){
  var items = ['a', 'b', 'c'];
  assertEquals(angular.Array.remove(items, 'q'), 'q');
  assertEquals(items.length, 3);

  assertEquals(angular.Array.remove(items, 'b'), 'b');
  assertEquals(items.length, 2);

  assertEquals(angular.Array.remove(items, 'a'), 'a');
  assertEquals(items.length, 1);

  assertEquals(angular.Array.remove(items, 'c'), 'c');
  assertEquals(items.length, 0);

  assertEquals(angular.Array.remove(items, 'q'), 'q');
  assertEquals(items.length, 0);
};

ApiTest.prototype.testFindById = function() {
  var items = [{$id:1}, {$id:2}, {$id:3}];
  assertNull(angular.Array.findById(items, 0));
  assertEquals(items[0], angular.Array.findById(items, 1));
  assertEquals(items[1], angular.Array.findById(items, 2));
  assertEquals(items[2], angular.Array.findById(items, 3));
};

ApiTest.prototype.testFilter = function() {
  var items = ["MIsKO", {name:"shyam"}, ["adam"], 1234];
  assertEquals(4, angular.Array.filter(items, "").length);
  assertEquals(4, angular.Array.filter(items, undefined).length);

  assertEquals(1, angular.Array.filter(items, 'iSk').length);
  assertEquals("MIsKO", angular.Array.filter(items, 'isk')[0]);

  assertEquals(1, angular.Array.filter(items, 'yam').length);
  assertEquals(items[1], angular.Array.filter(items, 'yam')[0]);

  assertEquals(1, angular.Array.filter(items, 'da').length);
  assertEquals(items[2], angular.Array.filter(items, 'da')[0]);

  assertEquals(1, angular.Array.filter(items, '34').length);
  assertEquals(1234, angular.Array.filter(items, '34')[0]);

  assertEquals(0, angular.Array.filter(items, "I don't exist").length);
};

ApiTest.prototype.testShouldNotFilterOnSystemData = function() {
  assertEquals("", "".charAt(0)); // assumption
  var items = [{$name:"misko"}];
  assertEquals(0, angular.Array.filter(items, "misko").length);
};

ApiTest.prototype.testFilterOnSpecificProperty = function() {
  var items = [{ignore:"a", name:"a"}, {ignore:"a", name:"abc"}];
  assertEquals(2, angular.Array.filter(items, {}).length);

  assertEquals(2, angular.Array.filter(items, {name:'a'}).length);

  assertEquals(1, angular.Array.filter(items, {name:'b'}).length);
  assertEquals("abc", angular.Array.filter(items, {name:'b'})[0].name);
};

ApiTest.prototype.testFilterOnFunction = function() {
  var items = [{name:"a"}, {name:"abc", done:true}];
  assertEquals(1, angular.Array.filter(items, function(i){return i.done;}).length);
};

ApiTest.prototype.testFilterIsAndFunction = function() {
  var items = [{first:"misko", last:"hevery"},
               {first:"adam", last:"abrons"}];

  assertEquals(2, angular.Array.filter(items, {first:'', last:''}).length);
  assertEquals(1, angular.Array.filter(items, {first:'', last:'hevery'}).length);
  assertEquals(0, angular.Array.filter(items, {first:'adam', last:'hevery'}).length);
  assertEquals(1, angular.Array.filter(items, {first:'misko', last:'hevery'}).length);
  assertEquals(items[0], angular.Array.filter(items, {first:'misko', last:'hevery'})[0]);
};

ApiTest.prototype.testFilterNot = function() {
  var items = ["misko", "adam"];

  assertEquals(1, angular.Array.filter(items, '!isk').length);
  assertEquals(items[1], angular.Array.filter(items, '!isk')[0]);
};

ApiTest.prototype.testAdd = function() {
  var add = angular.Array.add;
  assertJsonEquals([{}, "a"], add(add([]),"a"));
};

ApiTest.prototype.testCount = function() {
  var array = [{name:'a'},{name:'b'},{name:''}];
  var obj = {};

  assertEquals(3, angular.Array.count(array));
  assertEquals(2, angular.Array.count(array, 'name'));
  assertEquals(1, angular.Array.count(array, 'name=="a"'));
};

ApiTest.prototype.testFind = function() {
  var array = [{name:'a'},{name:'b'},{name:''}];
  var obj = {};

  assertEquals(undefined, angular.Array.find(array, 'false'));
  assertEquals('default', angular.Array.find(array, 'false', 'default'));
  assertEquals('a', angular.Array.find(array, 'name == "a"').name);
  assertEquals('', angular.Array.find(array, 'name == ""').name);
};

ApiTest.prototype.testItShouldSortArray = function() {
  assertEquals([2,15], angular.Array.orderBy([15,2]));
  assertEquals(["a","B", "c"], angular.Array.orderBy(["c","B", "a"]));
  assertEquals([15,"2"], angular.Array.orderBy([15,"2"]));
  assertEquals(["15","2"], angular.Array.orderBy(["15","2"]));
  assertJsonEquals([{a:2},{a:15}], angular.Array.orderBy([{a:15},{a:2}], 'a'));
  assertJsonEquals([{a:2},{a:15}], angular.Array.orderBy([{a:15},{a:2}], 'a', "F"));
};

ApiTest.prototype.testItShouldSortArrayInReverse = function() {
  assertJsonEquals([{a:15},{a:2}], angular.Array.orderBy([{a:15},{a:2}], 'a', true));
  assertJsonEquals([{a:15},{a:2}], angular.Array.orderBy([{a:15},{a:2}], 'a', "T"));
  assertJsonEquals([{a:15},{a:2}], angular.Array.orderBy([{a:15},{a:2}], 'a', "reverse"));
};

ApiTest.prototype.testItShouldSortArrayByPredicate = function() {
  assertJsonEquals([{a:2, b:1},{a:15, b:1}], 
    angular.Array.orderBy([{a:15, b:1},{a:2, b:1}], ['a', 'b']));
  assertJsonEquals([{a:2, b:1},{a:15, b:1}], 
    angular.Array.orderBy([{a:15, b:1},{a:2, b:1}], ['b', 'a']));
  assertJsonEquals([{a:15, b:1},{a:2, b:1}], 
    angular.Array.orderBy([{a:15, b:1},{a:2, b:1}], ['+b', '-a']));
};

ApiTest.prototype.testQuoteString = function(){
  assertEquals(angular.String.quote('a'), '"a"');
  assertEquals(angular.String.quote('\\'), '"\\\\"');
  assertEquals(angular.String.quote("'a'"), '"\'a\'"');
  assertEquals(angular.String.quote('"a"'), '"\\"a\\""');
  assertEquals(angular.String.quote('\n\f\r\t'), '"\\n\\f\\r\\t"');
};

ApiTest.prototype.testQuoteStringBug = function(){
  assertEquals(angular.String.quote('"7\\\\\\\"7"', "7\\\"7"));
};

ApiTest.prototype.testQuoteUnicode = function(){
  assertEquals('"abc\\u00a0def"', angular.String.quoteUnicode('abc\u00A0def'));
};

ApiTest.prototype.testMerge = function() {
  var array = [{name:"misko"}];
  angular.Array.merge(array, 0, {name:"", email:"email1"});
  angular.Array.merge(array, 1, {name:"adam", email:"email2"});
  assertJsonEquals([{"email":"email1","name":"misko"},{"email":"email2","name":"adam"}], array);
};

ApiTest.prototype.testOrderByToggle = function() {
  var orderByToggle = angular.Array.orderByToggle;
  var predicate = [];
  assertEquals(['+a'], orderByToggle(predicate, 'a'));
  assertEquals(['-a'], orderByToggle(predicate, 'a'));

  assertEquals(['-a', '-b'], orderByToggle(['-b', 'a'], 'a'));
};

ApiTest.prototype.testOrderByToggle = function() {
  var orderByDirection = angular.Array.orderByDirection;
  assertEquals("", orderByDirection(['+a','b'], 'x'));
  assertEquals("", orderByDirection(['+a','b'], 'b'));
  assertEquals('ng-ascend', orderByDirection(['a','b'], 'a'));
  assertEquals('ng-ascend', orderByDirection(['+a','b'], 'a'));
  assertEquals('ng-descend', orderByDirection(['-a','b'], 'a'));
  assertEquals('up', orderByDirection(['+a','b'], 'a', 'up', 'down'));
  assertEquals('down', orderByDirection(['-a','b'], 'a', 'up', 'down'));
};

ApiTest.prototype.testDateToUTC = function(){
  var date = new Date("Sep 10 2003 13:02:03 GMT");
  assertEquals("date", angular.Object.typeOf(date));
  assertEquals("2003-09-10T13:02:03Z", angular.Date.toString(date));
};

ApiTest.prototype.testStringFromUTC = function(){
  var date = angular.String.toDate("2003-09-10T13:02:03Z");
  assertEquals("date", angular.Object.typeOf(date));
  assertEquals("2003-09-10T13:02:03Z", angular.Date.toString(date));
  assertEquals("str", angular.String.toDate("str"));
};
