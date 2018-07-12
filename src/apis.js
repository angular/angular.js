'use strict';

/**
 * Computes a hash of an 'obj'.
 * Hash of a:
 *  string is string
 *  number is number as string
 *  object is either result of calling $$hashKey function on the object or uniquely generated id,
 *         that is also assigned to the $$hashKey property of the object.
 *
 * @param obj
 * @returns {string} hash string such that the same input will have the same hash string.
 *         The resulting string key is in 'type:hashKey' format.
 */
function hashKey(obj, nextUidFn) {
  var key = obj && obj.$$hashKey;

  if (key) {
    if (typeof key === 'function') {
      key = obj.$$hashKey();
    }
    return key;
  }

  var objType = typeof obj;
  if (objType === 'function' || (objType === 'object' && obj !== null)) {
    key = obj.$$hashKey = objType + ':' + (nextUidFn || nextUid)();
  } else {
    key = objType + ':' + obj;
  }

  return key;
}

// A minimal ES2015 Map implementation.
// Should be bug/feature equivalent to the native implementations of supported browsers
// (for the features required in Angular).
// See https://kangax.github.io/compat-table/es6/#test-Map
var nanKey = Object.create(null);
function NgMapShim() {
  this._keys = [];
  this._values = [];
  this._lastKey = NaN;
  this._lastIndex = -1;
}
NgMapShim.prototype = {
  _idx: function(key) {
    if (key === this._lastKey) {
      return this._lastIndex;
    }
    this._lastKey = key;
    this._lastIndex = this._keys.indexOf(key);
    return this._lastIndex;
  },
  _transformKey: function(key) {
    return isNumberNaN(key) ? nanKey : key;
  },
  get: function(key) {
    key = this._transformKey(key);
    var idx = this._idx(key);
    if (idx !== -1) {
      return this._values[idx];
    }
  },
  set: function(key, value) {
    key = this._transformKey(key);
    var idx = this._idx(key);
    if (idx === -1) {
      idx = this._lastIndex = this._keys.length;
    }
    this._keys[idx] = key;
    this._values[idx] = value;

    // Support: IE11
    // Do not `return this` to simulate the partial IE11 implementation
  },
  delete: function(key) {
    key = this._transformKey(key);
    var idx = this._idx(key);
    if (idx === -1) {
      return false;
    }
    this._keys.splice(idx, 1);
    this._values.splice(idx, 1);
    this._lastKey = NaN;
    this._lastIndex = -1;
    return true;
  }
};

// For now, always use `NgMapShim`, even if `window.Map` is available. Some native implementations
// are still buggy (often in subtle ways) and can cause hard-to-debug failures. When native `Map`
// implementations get more stable, we can reconsider switching to `window.Map` (when available).
var NgMap = NgMapShim;

var $$MapProvider = [/** @this */function() {
  this.$get = [function() {
    return NgMap;
  }];
}];
