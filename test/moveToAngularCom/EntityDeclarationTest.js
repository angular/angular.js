EntityDeclarationTest = TestCase('EntityDeclarationTest');

EntityDeclarationTest.prototype.testEntityTypeOnly = function(){
  expectAsserts(2);
  var datastore = {entity:function(name){
    assertEquals("Person", name);
  }};
  var scope = new Scope();
  var init = scope.entity("Person", datastore);
  assertEquals("", init);
};

EntityDeclarationTest.prototype.testWithDefaults = function(){
  expectAsserts(4);
  var datastore = {entity:function(name, init){
    assertEquals("Person", name);
    assertEquals("=a:", init.a);
    assertEquals(0, init.b.length);
  }};
  var scope = new Scope();
  var init = scope.entity('Person:{a:"=a:", b:[]}', datastore);
  assertEquals("", init);
};

EntityDeclarationTest.prototype.testWithName = function(){
  expectAsserts(2);
  var datastore = {entity:function(name, init){
    assertEquals("Person", name);
    return function (){ return {}; };
  }};
  var scope = new Scope();
  var init = scope.entity('friend=Person', datastore);
  assertEquals("$anchor.friend:{friend=Person.load($anchor.friend);friend.$$anchor=\"friend\";};", init);
};

EntityDeclarationTest.prototype.testMultipleEntities = function(){
  expectAsserts(3);
  var expect = ['Person', 'Book'];
  var i=0;
  var datastore = {entity:function(name, init){
    assertEquals(expect[i], name);
    i++;
    return function (){ return {}; };
  }};
  var scope = new Scope();
  var init = scope.entity('friend=Person;book=Book;', datastore);
  assertEquals("$anchor.friend:{friend=Person.load($anchor.friend);friend.$$anchor=\"friend\";};" +
               "$anchor.book:{book=Book.load($anchor.book);book.$$anchor=\"book\";};",
               init);
};
