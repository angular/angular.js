ModelTest = TestCase('ModelTest');

ModelTest.prototype.testLoadSaveOperations = function(){
  var m1 = new nglr.DataStore().entity('A')();
  m1.a = 1;

  var m2 =  {b:1};

  m1.$loadFrom(m2);

  assertTrue(!m1.a);
  assertEquals(m1.b, 1);
};

ModelTest.prototype.testLoadfromDoesNotClobberFunctions = function(){
  var m1 = new nglr.DataStore().entity('A')();
  m1.id = function(){return 'OK';};
  m1.$loadFrom({id:null});
  assertEquals(m1.id(), 'OK');

  m1.b = 'OK';
  m1.$loadFrom({b:function(){}});
  assertEquals(m1.b, 'OK');
};

ModelTest.prototype.testDataStoreDoesNotGetClobbered = function(){
  var ds = new nglr.DataStore();
  var m = ds.entity('A')();
  assertTrue(m.$$entity.datastore === ds);
  m.$loadFrom({});
  assertTrue(m.$$entity.datastore === ds);
};

ModelTest.prototype.testManagedModelDelegatesMethodsToDataStore = function(){
  expectAsserts(7);
  var datastore = new nglr.DataStore();
  var model = datastore.entity("A", {a:1})();
  var fn = {};
  datastore.save = function(instance, callback) {
    assertTrue(model === instance);
    assertTrue(callback === fn);
  };
  datastore.remove = function(instance, callback) {
    assertTrue(model === instance);
    assertTrue(callback === fn);
  };
  datastore.load = function(instance, id, callback) {
    assertTrue(model === instance);
    assertTrue(id === "123");
    assertTrue(callback === fn);
  };
  model.$save(fn);
  model.$delete(fn);
  model.$loadById("123", fn);
};

ModelTest.prototype.testManagedModelCanBeForcedToFlush = function(){
  expectAsserts(6);
  var datastore = new nglr.DataStore();
  var model = datastore.entity("A", {a:1})();

  datastore.save = function(instance, callback) {
    assertTrue(model === instance);
    assertTrue(callback === undefined);
  };
  datastore.remove = function(instance, callback) {
    assertTrue(model === instance);
    assertTrue(callback === undefined);
  };
  datastore.flush = function(){
    assertTrue(true);
  };
  model.$save(true);
  model.$delete(true);
};


ModelTest.prototype.testItShouldMakeDeepCopyOfInitialValues = function (){
  var initial = {a:[]};
  var entity = new nglr.DataStore().entity("A", initial);
  var model = entity();
  model.a.push(1);
  assertEquals(0, entity().a.length);
};
