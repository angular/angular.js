DataStoreTest = TestCase('DataStoreTest');

DataStoreTest.prototype.testSavePostsToServer = function(){
  expectAsserts(10);
  var response;
  var post = function(data, callback){
    var method = data[0][0];
    var posted = data[0][2];
    assertEquals("POST", method);
    assertEquals("abc", posted.$entity);
    assertEquals("123", posted.$id);
    assertEquals("1", posted.$version);
    assertFalse('function' == typeof posted.save);
    response = nglr.fromJson(nglr.toJson(posted));
    response.$entity = "abc";
    response.$id = "123";
    response.$version = "2";
    callback(200, [response]);
  };
  var model;
  var datastore = new nglr.DataStore(post);
  model = datastore.entity('abc', {name: "value"})();
  model.$id = "123";
  model.$version = "1";

  datastore.save(model, function(obj){
    assertTrue(obj === model);
    assertEquals(obj.$entity, "abc");
    assertEquals(obj.$id, "123");
    assertEquals(obj.$version, "2");
    assertEquals(obj.name, "value");
    obj.after = true;
  });
  datastore.flush();
};

DataStoreTest.prototype.testLoadGetsFromServer = function(){
  expectAsserts(12);
  var post = function(data, callback){
      var method = data[0][0];
      var path = data[0][1];
      assertEquals("GET", method);
      assertEquals("abc/1", path);
      response = [{$entity:'abc', $id:'1', $version:'2', key:"value"}];
      callback(200, response);
    };
  var datastore = new nglr.DataStore(post);

  var model = datastore.entity("abc", {merge:true})();
  assertEquals(datastore.load(model, '1', function(obj){
    assertEquals(obj.$entity, "abc");
    assertEquals(obj.$id, "1");
    assertEquals(obj.$version, "2");
    assertEquals(obj.key, "value");
  }), model);
  datastore.flush();
  assertEquals(model.$entity, "abc");
  assertEquals(model.$id, "1");
  assertEquals(model.$version, "2");
  assertEquals(model.key, "value");
  assertEquals(model.merge, true);
};

DataStoreTest.prototype.testRemove = function(){
  expectAsserts(8);
  var response;
  var post = function(data, callback){
    var method = data[0][0];
    var posted = data[0][2];
    assertEquals("DELETE", method);
    assertEquals("abc", posted.$entity);
    assertEquals("123", posted.$id);
    assertEquals("1", posted.$version);
    assertFalse('function' == typeof posted.save);
    response = nglr.fromJson(nglr.toJson(posted));
    response.$entity = "abc";
    response.$id = "123";
    response.$version = "2";
    callback(200, [response]);
  };
  var model;
  var datastore = new nglr.DataStore(post);
  model = datastore.entity('abc', {name: "value"})();
  model.$id = "123";
  model.$version = "1";

  datastore.remove(model, function(obj){
    assertEquals(obj.$id, "123");
    assertEquals(obj.$version, "2");
    assertEquals(obj.name, "value");
    obj.after = true;
  });
  datastore.flush();

};


DataStoreTest.prototype.test401ResponseDoesNotCallCallback = function(){
  expectAsserts(1);
  var post = function(data, callback) {
    callback(200, {$status_code: 401});
  };

  var datastore = new nglr.DataStore(post, {login:function(){
    assertTrue(true);
  }});

  var onLoadAll = function(){
    assertTrue(false, "onLoadAll should not be called when response is status 401");
  };
  datastore.bulkRequest.push({});
  datastore.flush();
  datastore.loadAll({type: "A"}, onLoadAll);
};

DataStoreTest.prototype.test403ResponseDoesNotCallCallback = function(){
  expectAsserts(1);
  var post = function(data, callback) {
    callback(200, [{$status_code: 403}]);
  };

  var datastore = new nglr.DataStore(post, {notAuthorized:function(){
    assertTrue(true);
  }});

  var onLoadAll = function(){
    assertTrue(false, "onLoadAll should not be called when response is status 403");
  };
  datastore.bulkRequest.push({});
  datastore.flush();
  datastore.loadAll({type: "A"}, onLoadAll);
};

DataStoreTest.prototype.testLoadCalledWithoutIdShouldBeNoop = function(){
  expectAsserts(2);
  var post = function(url, callback){
    assertTrue(false);
  };
  var datastore = new nglr.DataStore(post);
  var model = datastore.entity("abc")();
  assertEquals(datastore.load(model, undefined), model);
  assertEquals(model.$entity, "abc");
};

DataStoreTest.prototype.testEntityFactory = function(){
  var ds = new nglr.DataStore();
  var Recipe = ds.entity("Recipe", {a:1, b:2});
  assertEquals(Recipe.title, "Recipe");
  assertEquals(Recipe.defaults.a, 1);
  assertEquals(Recipe.defaults.b, 2);

  var recipe = Recipe();
  assertEquals(recipe.$entity, "Recipe");
  assertEquals(recipe.a, 1);
  assertEquals(recipe.b, 2);

  recipe = new Recipe();
  assertEquals(recipe.$entity, "Recipe");
  assertEquals(recipe.a, 1);
  assertEquals(recipe.b, 2);
};

DataStoreTest.prototype.testEntityFactoryNoDefaults = function(){
  var ds = new nglr.DataStore();
  var Recipe = ds.entity("Recipe");
  assertEquals(Recipe.title, "Recipe");

  recipe = new Recipe();
  assertEquals(recipe.$entity, "Recipe");
};

DataStoreTest.prototype.testEntityFactoryWithInitialValues = function(){
  var ds = new nglr.DataStore();
  var Recipe = ds.entity("Recipe");

  var recipe = Recipe({name: "name"});
  assertEquals("name", recipe.name);
};

DataStoreTest.prototype.testEntityLoad = function(){
  var ds = new nglr.DataStore();
  var Recipe = ds.entity("Recipe", {a:1, b:2});
  ds.load = function(instance, id, callback){
    callback.apply(instance);
    return instance;
  };
  var instance = null;
  var recipe2 = Recipe.load("ID", function(){
    instance = this;
  });
  assertTrue(recipe2 === instance);
};

DataStoreTest.prototype.testSaveScope = function(){
  var ds = new nglr.DataStore();
  var log = "";
  var Person = ds.entity("Person");
  var person1 = Person({name:"A", $entity:"Person", $id:"1", $version:"1"}, ds);
  person1.$$anchor = "A";
  var person2 = Person({name:"B", $entity:"Person", $id:"2", $version:"2"}, ds);
  person2.$$anchor = "B";
  var anchor = {};
  ds.anchor = anchor;
  ds._jsonRequest = function(request, callback){
    log += "save(" + request[2].$id + ");";
    callback({$id:request[2].$id});
  };
  ds.saveScope({person1:person1, person2:person2,
        ignoreMe:{name: "ignore", save:function(callback){callback();}}}, function(){
    log += "done();";
  });
  assertEquals("save(1);save(2);done();", log);
  assertEquals(1, anchor.A);
  assertEquals(2, anchor.B);
};

DataStoreTest.prototype.testEntityLoadAllRows = function(){
  var ds = new nglr.DataStore();
  var Recipe = ds.entity("Recipe");
  var list = [];
  ds.loadAll = function(entity, callback){
    assertTrue(Recipe === entity);
    callback.apply(list);
    return list;
  };
  var items = Recipe.all(function(){
    assertTrue(list === this);
  });
  assertTrue(items === list);
};

DataStoreTest.prototype.testLoadAll = function(){
  expectAsserts(8);
  var post = function(data, callback){
    assertEquals("GET", data[0][0]);
    assertEquals("A", data[0][1]);
    callback(200, [[{$entity:'A', $id:'1'},{$entity:'A', $id:'2'}]]);
  };
  var datastore = new nglr.DataStore(post);
  var list = datastore.entity("A").all(function(){
    assertTrue(true);
  });
  datastore.flush();
  assertEquals(list.length, 2);
  assertEquals(list[0].$entity, "A");
  assertEquals(list[0].$id, "1");
  assertEquals(list[1].$entity, "A");
  assertEquals(list[1].$id, "2");
};

DataStoreTest.prototype.testQuery = function(){
  expectAsserts(5);
  var post = function(data, callback) {
    assertEquals("GET", data[0][0]);
    assertEquals("Employee/managerId=123abc", data[0][1]);
    callback(200, [[{$entity:"Employee", $id: "456", managerId: "123ABC"}]]);

  };
  var datastore = new nglr.DataStore(post);
  var Employee = datastore.entity("Employee");
  var list = Employee.query('managerId', "123abc", function(){
    assertTrue(true);
  });
  datastore.flush();
  assertJsonEquals([[{$entity:"Employee", $id: "456", managerId: "123ABC"}]], datastore._cache.$collections);
  assertEquals(list[0].$id, "456");
};

DataStoreTest.prototype.testLoadingDocumentRefreshesExistingArrays = function() {
  expectAsserts(12);
  var post;
  var datastore = new nglr.DataStore(function(r, c){post(r,c);});
  var Book = datastore.entity('Book');
  post = function(req, callback) {
    callback(200, [[{$id:1, $entity:"Book", name:"Moby"},
                    {$id:2, $entity:"Book", name:"Dick"}]]);
  };
  var allBooks = Book.all();
  datastore.flush();
  var queryBooks = Book.query("a", "b");
  datastore.flush();
  assertEquals("Moby", allBooks[0].name);
  assertEquals("Dick", allBooks[1].name);
  assertEquals("Moby", queryBooks[0].name);
  assertEquals("Dick", queryBooks[1].name);

  post = function(req, callback) {
    assertEquals('[["GET","Book/1"]]', nglr.toJson(req));
    callback(200, [{$id:1, $entity:"Book", name:"Moby Dick"}]);
  };
  var book = Book.load(1);
  datastore.flush();
  assertEquals("Moby Dick", book.name);
  assertEquals("Moby Dick", allBooks[0].name);
  assertEquals("Moby Dick", queryBooks[0].name);

  post = function(req, callback) {
    assertEquals('POST', req[0][0]);
    callback(200, [{$id:1, $entity:"Book", name:"The Big Fish"}]);
  };
  book.$save();
  datastore.flush();
  assertEquals("The Big Fish", book.name);
  assertEquals("The Big Fish", allBooks[0].name);
  assertEquals("The Big Fish", queryBooks[0].name);
};

DataStoreTest.prototype.testEntityProperties = function() {
  expectAsserts(2);
  var datastore = new nglr.DataStore();
  var callback = {};

  datastore._jsonRequest = function(request, callbackFn) {
    assertJsonEquals(["GET", "Cheese/$properties"], request);
    assertEquals(callback, callbackFn);
  };

  var Cheese = datastore.entity("Cheese");
  Cheese.properties(callback);

};

DataStoreTest.prototype.testLoadInstanceIsNotFromCache = function() {
  var post;
  var datastore = new nglr.DataStore(function(r, c){post(r,c);});
  var Book = datastore.entity('Book');

  post = function(req, callback) {
    assertEquals('[["GET","Book/1"]]', nglr.toJson(req));
    callback(200, [{$id:1, $entity:"Book", name:"Moby Dick"}]);
  };
  var book = Book.load(1);
  datastore.flush();
  assertEquals("Moby Dick", book.name);
  assertFalse(book === datastore._cache['Book/1']);
};

DataStoreTest.prototype.testLoadStarsIsNewDocument = function() {
  var datastore = new nglr.DataStore();
  var Book = datastore.entity('Book');
  var book = Book.load('*');
  assertEquals('Book', book.$entity);
};

DataStoreTest.prototype.testUndefinedEntityReturnsNullValueObject = function() {
  var datastore = new nglr.DataStore();
  var Entity = datastore.entity(undefined);
  var all = Entity.all();
  assertEquals(0, all.length);
};

DataStoreTest.prototype.testFetchEntities = function(){
  expectAsserts(6);
  var post = function(data, callback){
    assertJsonEquals(["GET", "$entities"], data[0]);
    callback(200, [{A:0, B:0}]);
  };
  var datastore = new nglr.DataStore(post);
  var entities = datastore.entities(function(){
    assertTrue(true);
  });
  datastore.flush();
  assertJsonEquals([], datastore.bulkRequest);
  assertEquals(2, entities.length);
  assertEquals("A", entities[0].title);
  assertEquals("B", entities[1].title);
};

DataStoreTest.prototype.testItShouldMigrateSchema = function() {
  var datastore = new nglr.DataStore();
  var Entity = datastore.entity("Entity", {a:[], user:{name:"Misko", email:""}});
  var doc = Entity().$loadFrom({b:'abc', user:{email:"misko@hevery.com"}});
  assertFalse(
      nglr.toJson({a:[], b:'abc', user:{name:"Misko", email:"misko@hevery.com"}}) ==
      nglr.toJson(doc));
  doc.$migrate();
  assertEquals(
      nglr.toJson({a:[], b:'abc', user:{name:"Misko", email:"misko@hevery.com"}}),
      nglr.toJson(doc));
};

DataStoreTest.prototype.testItShouldCollectRequestsForBulk = function() {
  var ds = new nglr.DataStore();
  var Book = ds.entity("Book");
  var Library = ds.entity("Library");
  Book.all();
  Library.load("123");
  assertEquals(2, ds.bulkRequest.length);
  assertJsonEquals(["GET", "Book"], ds.bulkRequest[0]);
  assertJsonEquals(["GET", "Library/123"], ds.bulkRequest[1]);
};

DataStoreTest.prototype.testEmptyFlushShouldDoNothing = function () {
  var ds = new nglr.DataStore(function(){
    fail("expecting noop");
  });
  ds.flush();
};

DataStoreTest.prototype.testFlushShouldCallAllCallbacks = function() {
  var log = "";
  function post(request, callback){
    log += 'BulkRequest:' + nglr.toJson(request) + ';';
    callback(200, [[{$id:'ABC'}], {$id:'XYZ'}]);
  }
  var ds = new nglr.DataStore(post);
  var Book = ds.entity("Book");
  var Library = ds.entity("Library");
  Book.all(function(instance){
    log += nglr.toJson(instance) + ';';
  });
  Library.load("123", function(instance){
    log += nglr.toJson(instance) + ';';
  });
  assertEquals("", log);
  ds.flush();
  assertJsonEquals([], ds.bulkRequest);
  assertEquals('BulkRequest:[["GET","Book"],["GET","Library/123"]];[{"$id":"ABC"}];{"$id":"XYZ"};', log);
};

DataStoreTest.prototype.testSaveOnNotLoggedInRetriesAfterLoggin = function(){
  var log = "";
  var book;
  var ds = new nglr.DataStore(null, {login:function(c){c();}});
  ds.post = function (request, callback){
    assertJsonEquals([["POST", "", book]], request);
    ds.post = function(request, callback){
      assertJsonEquals([["POST", "", book]], request);
      ds.post = function(){fail("too much recursion");};
      callback(200, [{saved:"ok"}]);
    };
    callback(200, {$status_code:401});
  };
  book = ds.entity("Book")({name:"misko"});
  book.$save();
  ds.flush();
  assertJsonEquals({saved:"ok"}, book);
};

DataStoreTest.prototype.testItShouldRemoveItemFromCollectionWhenDeleted = function() {
  expectAsserts(6);
  var ds = new nglr.DataStore();
  ds.post = function(request, callback){
    assertJsonEquals([["GET", "Book"]], request);
    callback(200, [[{name:"Moby Dick", $id:123, $entity:'Book'}]]);
  };
  var Book = ds.entity("Book");
  var books = Book.all();
  ds.flush();
  assertJsonEquals([[{name:"Moby Dick", $id:123, $entity:'Book'}]], ds._cache.$collections);
  assertDefined(ds._cache['Book/123']);
  var book = Book({$id:123});
  ds.post = function(request, callback){
    assertJsonEquals([["DELETE", "", book]], request);
    callback(200, [book]);
  };
  ds.remove(book);
  ds.flush();
  assertUndefined(ds._cache['Book/123']);
  assertJsonEquals([[]],ds._cache.$collections);
};

DataStoreTest.prototype.testItShouldAddToAll = function() {
  expectAsserts(8);
  var ds = new nglr.DataStore();
  ds.post = function(request, callback){
    assertJsonEquals([["GET", "Book"]], request);
    callback(200, [[]]);
  };
  var Book = ds.entity("Book");
  var books = Book.all();
  assertEquals(0, books.length);
  ds.flush();
  var moby = Book({name:'moby'});
  moby.$save();
  ds.post = function(request, callback){
    assertJsonEquals([["POST", "", moby]], request);
    moby.$id = '123';
    callback(200, [moby]);
  };
  ds.flush();
  assertEquals(1, books.length);
  assertEquals(moby, books[0]);
  
  moby.$save();
  ds.flush();
  assertEquals(1, books.length);
  assertEquals(moby, books[0]);
};

DataStoreTest.prototype.testItShouldReturnCreatedDocumentCountByUser = function(){
  expectAsserts(2);
  var datastore = new nglr.DataStore(
      function(request, callback){
        assertJsonEquals([["GET", "$users"]], request);
        callback(200, [{misko:1, adam:1}]);
      });
  var users = datastore.documentCountsByUser();
  assertJsonEquals({misko:1, adam:1}, users);
};


DataStoreTest.prototype.testItShouldReturnDocumentIdsForUeserByEntity = function(){
  expectAsserts(2);
  var datastore = new nglr.DataStore(
      function(request, callback){
        assertJsonEquals([["GET", "$users/misko@hevery.com"]], request);
        callback(200, [{Book:["1"], Library:["2"]}]);
      });
  var users = datastore.userDocumentIdsByEntity("misko@hevery.com");
  assertJsonEquals({Book:["1"], Library:["2"]}, users);
};

DataStoreTest.prototype.testItShouldReturnNewInstanceOn404 = function(){
  expectAsserts(7);
  var log = "";
  var datastore = new nglr.DataStore(
      function(request, callback){
        assertJsonEquals([["GET", "User/misko"]], request);
        callback(200, [{$status_code:404}]);
      });
  var User = datastore.entity("User", {admin:false});
  var user = User.loadOrCreate('misko', function(i){log+="cb "+i.$id+";";});
  datastore.flush();
  assertEquals("misko", user.$id);
  assertEquals("User", user.$entity);
  assertEquals(false, user.admin);
  assertEquals("undefined", typeof user.$secret);
  assertEquals("undefined", typeof user.$version);
  assertEquals("cb misko;", log);
};

DataStoreTest.prototype.testItShouldReturnNewInstanceOn404 = function(){
  var log = "";
  var datastore = new nglr.DataStore(
      function(request, callback){
        assertJsonEquals([["GET", "User/misko"],["GET", "User/adam"]], request);
        callback(200, [{$id:'misko'},{$id:'adam'}]);
      });
  var User = datastore.entity("User");
  var users = User.loadMany(['misko', 'adam'], function(i){log+="cb "+nglr.toJson(i)+";";});
  datastore.flush();
  assertEquals("misko", users[0].$id);
  assertEquals("adam", users[1].$id);
  assertEquals('cb [{"$id":"misko"},{"$id":"adam"}];', log);
};

DataStoreTest.prototype.testItShouldCreateJoinAndQuery = function() {
  var datastore = new nglr.DataStore();
  var Invoice = datastore.entity("Invoice");
  var Customer = datastore.entity("Customer");
  var InvoiceWithCustomer = datastore.join({
    invoice:{join:Invoice},
    customer:{join:Customer, on:"invoice.customer"}
  });
  var invoiceWithCustomer = InvoiceWithCustomer.query("invoice.month", 1);
  assertEquals([], invoiceWithCustomer);
  assertJsonEquals([["GET", "Invoice/month=1"]], datastore.bulkRequest);
  var request = datastore.bulkRequest.shift();
  request.$$callback([{$id:1, customer:1},{$id:2, customer:1},{$id:3, customer:3}]);
  assertJsonEquals([["GET","Customer/1"],["GET","Customer/3"]], datastore.bulkRequest);
  datastore.bulkRequest.shift().$$callback({$id:1});
  datastore.bulkRequest.shift().$$callback({$id:3});
  assertJsonEquals([
    {invoice:{$id:1,customer:1},customer:{$id:1}},
    {invoice:{$id:2,customer:1},customer:{$id:1}},
    {invoice:{$id:3,customer:3},customer:{$id:3}}], invoiceWithCustomer);
};

DataStoreTest.prototype.testItShouldThrowIfMoreThanOneEntityIsPrimary = function() {
  var datastore = new nglr.DataStore();
  var Invoice = datastore.entity("Invoice");
  var Customer = datastore.entity("Customer");
  assertThrows("Exactly one entity needs to be primary.", function(){
    datastore.join({
      invoice:{join:Invoice},
      customer:{join:Customer}
    });
  });  
};

DataStoreTest.prototype.testItShouldThrowIfLoopInReferences = function() {
  var datastore = new nglr.DataStore();
  var Invoice = datastore.entity("Invoice");
  var Customer = datastore.entity("Customer");
  assertThrows("Infinite loop in join: invoice -> customer", function(){
    datastore.join({
      invoice:{join:Invoice, on:"customer.invoice"},
      customer:{join:Customer, on:"invoice.customer"}
    });
  });
};

DataStoreTest.prototype.testItShouldThrowIfReferenceToNonExistantJoin = function() {
  var datastore = new nglr.DataStore();
  var Invoice = datastore.entity("Invoice");
  var Customer = datastore.entity("Customer");
  assertThrows("Named entity 'x' is undefined.", function(){
    datastore.join({
      invoice:{join:Invoice, on:"x.invoice"},
      customer:{join:Customer, on:"invoice.customer"}
    });
  });  
};

DataStoreTest.prototype.testItShouldThrowIfQueryOnNonPrimary = function() {
  var datastore = new nglr.DataStore();
  var Invoice = datastore.entity("Invoice");
  var Customer = datastore.entity("Customer");
  var InvoiceWithCustomer = datastore.join({
    invoice:{join:Invoice},
    customer:{join:Customer, on:"invoice.customer"}
  });
  assertThrows("Named entity 'customer' is not a primary entity.", function(){
    InvoiceWithCustomer.query("customer.month", 1);
  });  
};
