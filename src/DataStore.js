// Copyright (C) 2009 BRAT Tech LLC

nglr.DataStore = function(post, users, anchor) {
  this.post = post;
  this.users = users;
  this._cache = {$collections:[]};
  this.anchor = anchor;
  this.bulkRequest = [];
};

nglr.DataStore.prototype.cache = function(document) {
  if (document.constructor != nglr.Model) {
    throw "Parameter must be an instance of Entity! " + nglr.toJson(document);
  }
  var key = document.$entity + '/' + document.$id;
  var cachedDocument = this._cache[key];
  if (cachedDocument) {
    nglr.Model.copyDirectFields(document, cachedDocument);
  } else {
    this._cache[key] = document;
    cachedDocument = document;
  }
  return cachedDocument;
};

nglr.DataStore.prototype.load = function(instance, id, callback, failure) {
  if (id && id !== '*') {
    var self = this;
    this._jsonRequest(["GET", instance.$entity + "/" + id], function(response) {
      instance.$loadFrom(response);
      instance.$migrate();
      var clone = instance.$$entity(instance);
      self.cache(clone);
      (callback||nglr.noop)(instance);
    }, failure);
  }
  return instance;
};

nglr.DataStore.prototype.loadMany = function(entity, ids, callback) {
  var self=this;
  var list = [];
  var callbackCount = 0;
  jQuery.each(ids, function(i, id){
    list.push(self.load(entity(), id, function(){
      callbackCount++;
      if (callbackCount == ids.length) {
        (callback||nglr.noop)(list);
      }
    }));
  });
  return list;
}

nglr.DataStore.prototype.loadOrCreate = function(instance, id, callback) {
  var self=this;
  return this.load(instance, id, callback, function(response){
    if (response.$status_code == 404) {
      instance.$id = id;
      (callback||nglr.noop)(instance);
    } else {
      throw response;
    }
  });
};

nglr.DataStore.prototype.loadAll = function(entity, callback) {
  var self = this;
  var list = [];
  list.$$accept = function(doc){
    return doc.$entity == entity.title;
  };
  this._cache.$collections.push(list);
  this._jsonRequest(["GET", entity.title], function(response) {
    var rows = response;
    for ( var i = 0; i < rows.length; i++) {
      var document = entity();
      document.$loadFrom(rows[i]);
      list.push(self.cache(document));
    }
    (callback||nglr.noop)(list);
  });
  return list;
};

nglr.DataStore.prototype.save = function(document, callback) {
  var self = this;
  var data = {};
  document.$saveTo(data);
  this._jsonRequest(["POST", "", data], function(response) {
    document.$loadFrom(response);
    var cachedDoc = self.cache(document);
    _.each(self._cache.$collections, function(collection){
      if (collection.$$accept(document)) {
        angular.Array.includeIf(collection, cachedDoc, true);
      }
    });
    if (document.$$anchor) {
      self.anchor[document.$$anchor] = document.$id;
    }
    if (callback)
      callback(document);
  });
};

nglr.DataStore.prototype.remove = function(document, callback) {
  var self = this;
  var data = {};
  document.$saveTo(data);
  this._jsonRequest(["DELETE", "", data], function(response) {
    delete self._cache[document.$entity + '/' + document.$id];
    _.each(self._cache.$collections, function(collection){
      for ( var i = 0; i < collection.length; i++) {
        var item = collection[i];
        if (item.$id == document.$id) {
          collection.splice(i, 1);
        }
      }
    });
    (callback||nglr.noop)(response);
  });
};

nglr.DataStore.prototype._jsonRequest = function(request, callback, failure) {
  request.$$callback = callback;
  request.$$failure = failure||function(response){
    throw response;
  };
  this.bulkRequest.push(request);
};

nglr.DataStore.prototype.flush = function() {
  if (this.bulkRequest.length === 0) return;
  var self = this;
  var bulkRequest = this.bulkRequest;
  this.bulkRequest = [];
  console.log('REQUEST:', bulkRequest);
  function callback(code, bulkResponse){
    console.log('RESPONSE[' + code + ']: ', bulkResponse);
    if(bulkResponse.$status_code == 401) {
      self.users.login(function(){
        self.post(bulkRequest, callback);
      });
    } else if(bulkResponse.$status_code) {
      nglr.alert(nglr.toJson(bulkResponse));
    } else {
      for ( var i = 0; i < bulkResponse.length; i++) {
        var response = bulkResponse[i];
        var request = bulkRequest[i];
        var code = response.$status_code;
        if(code) {
          if(code == 403) {
            self.users.notAuthorized();
          } else {
            request.$$failure(response);
          }
        } else {
          request.$$callback(response);
        }
      }
    }
  }
  this.post(bulkRequest, callback);
};

nglr.DataStore.prototype.saveScope = function(scope, callback) {
  var saveCounter = 1;
  function onSaveDone() {
    saveCounter--;
    if (saveCounter === 0 && callback)
      callback();
  }
  for(var key in scope) {
    var item = scope[key];
    if (item && item.$save == nglr.Model.prototype.$save) {
      saveCounter++;
      item.$save(onSaveDone);
    }
  }
  onSaveDone();
};

nglr.DataStore.prototype.query = function(type, query, arg, callback){
  var self = this;
  var queryList = [];
  queryList.$$accept = function(doc){
    return false;
  };
  this._cache.$collections.push(queryList);
  var request = type.title + '/' + query + '=' + arg;
  this._jsonRequest(["GET", request], function(response){
    var list = response;
    for(var i = 0; i < list.length; i++) {
      var document = new type().$loadFrom(list[i]);
      queryList.push(self.cache(document));
    }
    if (callback)
      callback(queryList);
  });
  return queryList;
};

nglr.DataStore.prototype.entities = function(callback) {
  var entities = [];
  var self = this;
  this._jsonRequest(["GET", "$entities"], function(response) {
    for (var entityName in response) {
      entities.push(self.entity(entityName));
    }
    entities.sort(function(a,b){return a.title > b.title ? 1 : -1;});
    if (callback) callback(entities);
  });
  return entities;
};

nglr.DataStore.prototype.documentCountsByUser = function(){
  var counts = {};
  var self = this;
  self.post([["GET", "$users"]], function(code, response){
    jQuery.each(response[0], function(key, value){
      counts[key] = value;
    });
  });
  return counts;
};

nglr.DataStore.prototype.userDocumentIdsByEntity = function(user){
  var ids = {};
  var self = this;
  self.post([["GET", "$users/" + user]], function(code, response){
    jQuery.each(response[0], function(key, value){
      ids[key] = value;
    });
  });
  return ids;
};

nglr.DataStore.NullEntity = function(){};
nglr.DataStore.NullEntity.all = function(){return [];};
nglr.DataStore.NullEntity.query = function(){return [];};
nglr.DataStore.NullEntity.load = function(){return {};};
nglr.DataStore.NullEntity.title = undefined;

nglr.DataStore.prototype.entity = function(name, defaults){
  if (!name) {
    return nglr.DataStore.NullEntity;
  }
  var self = this;
  var entity =  function(initialState){
    return new nglr.Model(entity, initialState);
  };
  // entity.name does not work as name seems to be reserved for functions
  entity.title = name;
  entity.$$factory = true;
  entity.datastore = this;
  entity.defaults = defaults || {};
  entity.load = function(id, callback){
    return self.load(entity(), id, callback);
  };
  entity.loadMany = function(ids, callback){
    return self.loadMany(entity, ids, callback);
  };
  entity.loadOrCreate = function(id, callback){
    return self.loadOrCreate(entity(), id, callback);
  };
  entity.all = function(callback){
    return self.loadAll(entity, callback);
  };
  entity.query = function(query, queryArgs, callback){
    return self.query(entity, query, queryArgs, callback);
  };
  entity.properties = function(callback) {
    self._jsonRequest(["GET", name + "/$properties"], callback);
  };
  return entity;
};

nglr.DataStore.prototype.join = function(join){
  var fn = function(){
    throw "Joined entities can not be instantiated into a document.";
  };
  function base(name){return name ? name.substring(0, name.indexOf('.')) : undefined;}
  function next(name){return name.substring(name.indexOf('.') + 1);}
  var joinOrder = _(join).chain().
    map(function($, name){
      return name;}).
    sortBy(function(name){
      var path = [];
      do {
        if (_(path).include(name)) throw "Infinite loop in join: " + path.join(" -> ");
        path.push(name);
        if (!join[name]) throw _("Named entity '<%=name%>' is undefined.").template({name:name});
        name = base(join[name].on);
      } while(name);
      return path.length;
    }).
    value();
  if (_(joinOrder).select(function($){return join[$].on;}).length != joinOrder.length - 1)
    throw "Exactly one entity needs to be primary.";
  fn.query = function(exp, value) {
    var joinedResult = [];
    var baseName = base(exp);
    if (baseName != joinOrder[0]) throw _("Named entity '<%=name%>' is not a primary entity.").template({name:baseName});
    var Entity = join[baseName].join;
    var joinIndex = 1;
    Entity.query(next(exp), value, function(result){
      var nextJoinName = joinOrder[joinIndex++];
      var nextJoin = join[nextJoinName];
      var nextJoinOn = nextJoin.on;
      var joinIds = {};
      _(result).each(function(doc){
        var row = {};
        joinedResult.push(row);
        row[baseName] = doc;
        var id = nglr.Scope.getter(row, nextJoinOn);
        joinIds[id] = id;
      });
      nextJoin.join.loadMany(_.toArray(joinIds), function(result){
        var byId = {};
        _(result).each(function(doc){
          byId[doc.$id] = doc;
        });
        _(joinedResult).each(function(row){
          var id = nglr.Scope.getter(row, nextJoinOn);
          row[nextJoinName] = byId[id];
        });
      });
    });
    return joinedResult;
  };
  return fn;
};
