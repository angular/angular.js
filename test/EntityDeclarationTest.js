EntityDeclarationTest = TestCase('EntityDeclarationTest');

EntityDeclarationTest.prototype.testEntityTypeOnly = function(){
  expectAsserts(2);
  var scope = new nglr.Scope({$datastore:{entity:function(name){
    assertEquals("Person", name);
  }}});
  var init = scope.entity("Person");
  assertEquals("", init);
};

EntityDeclarationTest.prototype.testWithDefaults = function(){
  expectAsserts(4);
  var scope = new nglr.Scope({$datastore:{entity:function(name, init){
    assertEquals("Person", name);
    assertEquals("=a:", init.a);
    assertEquals(0, init.b.length);
  }}});
  var init = scope.entity('Person:{a:"=a:", b:[]}');
  assertEquals("", init);
};

EntityDeclarationTest.prototype.testWithName = function(){
  expectAsserts(2);
  var scope = new nglr.Scope({$datastore:{entity:function(name, init){
    assertEquals("Person", name);
    return function (){ return {}; };
  }}});
  var init = scope.entity('friend=Person');
  assertEquals("$anchor.friend:{friend=Person.load($anchor.friend);friend.$$anchor=\"friend\";};", init);
};

EntityDeclarationTest.prototype.testMultipleEntities = function(){
  expectAsserts(3);
  var expect = ['Person', 'Book'];
  var i=0;
  var scope = new nglr.Scope({$datastore:{entity:function(name, init){
    assertEquals(expect[i], name);
    i++;
    return function (){ return {}; };
  }}});
  var init = scope.entity('friend=Person;book=Book;');
  assertEquals("$anchor.friend:{friend=Person.load($anchor.friend);friend.$$anchor=\"friend\";};" +
               "$anchor.book:{book=Book.load($anchor.book);book.$$anchor=\"book\";};",
               init);
};
