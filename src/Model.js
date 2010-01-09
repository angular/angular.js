// Copyright (C) 2009 BRAT Tech LLC

// Single $ is special and does not get searched
// Double $$ is special an is client only (does not get sent to server)

Model = function(entity, initial) {
  this.$$entity = entity;
  this.$loadFrom(initial||{});
  this.$entity = entity.title;
  this.$migrate();
};

Model.copyDirectFields = function(src, dst) {
  if (src === dst || !src || !dst) return;
  var isDataField = function(src, dst, field) {
    return (field.substring(0,2) !== '$$') &&
        (typeof src[field] !== 'function') &&
        (typeof dst[field] !== 'function');
  };
  for (var field in dst) {
    if (isDataField(src, dst, field))
      delete dst[field];
  }
  for (field in src) {
    if (isDataField(src, dst, field))
      dst[field] = src[field];
  }
};

Model.prototype.$migrate = function() {
  merge(this.$$entity.defaults, this);
  return this;
};

Model.prototype.$merge = function(other) {
  merge(other, this);
  return this;
};

Model.prototype.$save = function(callback) {
  this.$$entity.datastore.save(this, callback === true ? undefined : callback);
  if (callback === true) this.$$entity.datastore.flush();
  return this;
};

Model.prototype.$delete = function(callback) {
  this.$$entity.datastore.remove(this, callback === true ? undefined : callback);
  if (callback === true) this.$$entity.datastore.flush();
  return this;
};

Model.prototype.$loadById = function(id, callback) {
  this.$$entity.datastore.load(this, id, callback);
  return this;
};

Model.prototype.$loadFrom = function(other) {
  Model.copyDirectFields(other, this);
  return this;
};

Model.prototype.$saveTo = function(other) {
  Model.copyDirectFields(this, other);
  return this;
};
