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
function hashKey(obj) {
  var objType = typeof obj,
      key;

  if (objType == 'object' && obj !== null) {
    if (typeof (key = obj.$$hashKey) == 'function') {
      // must invoke on object to keep the right this
      key = obj.$$hashKey();
    } else if (key === undefined) {
      key = obj.$$hashKey = nextUid();
    }
  } else {
    key = obj;
  }

  return objType + ':' + key;
}

/**
 * HashMap which can use objects as keys
 */
function HashMap(array){
  forEach(array, this.put, this);
}
HashMap.prototype = {
  /**
   * Store key value pair
   * @param key key to store can be any type
   * @param value value to store can be any type
   */
  put: function(key, value) {
    this[hashKey(key)] = value;
  },

  /**
   * @param key
   * @returns the value for the key
   */
  get: function(key) {
    return this[hashKey(key)];
  },

  /**
   * Remove the key/value pair
   * @param key
   */
  remove: function(key) {
    var value = this[key = hashKey(key)];
    delete this[key];
    return value;
  }
};

/**
 * A map where multiple values can be added to the same key such that they form a queue.
 * @returns {HashQueueMap}
 */
function HashQueueMap() {}
HashQueueMap.prototype = {
  /**
   * Same as array push, but using an array as the value for the hash
   */
  push: function(key, value) {
    var array = this[key = hashKey(key)];
    if (!array) {
      this[key] = [value];
    } else {
      array.push(value);
    }
  },

  /**
   * Same as array shift, but using an array as the value for the hash
   */
  shift: function(key) {
    var array = this[key = hashKey(key)];
    if (array) {
      if (array.length == 1) {
        delete this[key];
        return array[0];
      } else {
        return array.shift();
      }
    }
  },

  /**
   * return the first item without deleting it
   */
  peek: function(key) {
    var array = this[hashKey(key)];
    if (array) {
    return array[0];
    }
  }
};

/**
 * A generic collection that wraps an array
 * @returns an object that wraps an array as a generic collection
 */
var WrappedArray = function(array) {
  this.collection = array;
}
WrappedArray.prototype = {
  get: function(index) {
    return this.collection[index];
  },
  key: function(index) {
    return index;
  },
  length: function() {
    return this.collection.length;
  },
  copy: function() {
    return new WrappedArray(this.collection.slice(0));
  }
};

/**
 * A generic collection that wraps an object so that you can access its keyed values in order
 * @returns an object that wraps an object as a generic collection
 */
var WrappedObject = function(object) {
  this.collection = object;
  this.keys = [];
  for(var key in this.collection) {
    if (this.collection.hasOwnProperty(key) && key.charAt(0) != '$') {
      this.keys.push(key);
    }
  }
  this.keys.sort();
}
WrappedObject.prototype = {
  get: function(index) {
    return this.collection[this.keys[index]];
  },
  key: function(index) {
    return this.keys[index];
  },
  length: function() {
    return this.keys.length;
  },
  copy: function() {
    var dst = {};
    for(var key in this.collection) {
      if (this.collection.hasOwnProperty(key) && key.charAt(0) != '$') {
        dst[key] = this.collection[key];
      }
    }
    return new WrappedObject(dst);
  }
};

  /**
   * Track changes to objects (rather than primitives) in between two collections
   * @param original {object} collection that has a get method
   * @param changed {object} collection that has a get method
   */
  function ObjectTracker(original, changed) {
    this.original = original;
    this.changed = changed;
    this.entries = [];
  }
  ObjectTracker.prototype = {
    getEntry: function (obj) {
      var key = hashKey(obj);
      var entry = this.entries[key];
      if ( !angular.isDefined(entry) ) {
        entry = ({ newIndexes: [], oldIndexes: [], obj: obj });
      }
      this.entries[key] = entry;
      return entry;
    },
    // An object is now at this index where it wasn't before
    addNewEntry: function(index) {
      this.getEntry(this.changed.get(index)).newIndexes.push(index);
    },
    // An object is no longer at this index
    addOldEntry: function(index) {
      this.getEntry(this.original.get(index)).oldIndexes.push(index);
    }
  };

  /*
   * Track all the changes found between the original and changed collections
   * @param original {object} collection that has a get method
   * @param changed {object} collection that has a get method
   */
  function ChangeTracker(original, changed) {
    this.original = original;
    this.changed = changed;
    // All additions in the form {index, value}
    this.additions = [];
    // All deletions in the form {index, oldValue}
    this.deletions = [];
    // All primitive value modifications in the form { index, }
    this.modifications = [];
    // All moved objects in the form {index, oldIndex, value}
    this.moves = [];
  }
  ChangeTracker.prototype = {
    // An addition was found at the given index
    pushAddition: function(index) {
      this.additions.push({ index: index, value: this.changed.get(index)});
    },
    // A deletion was found at the given index
    pushDeletion: function(index) {
      this.deletions.push({ index: index, oldValue: this.original.get(index)});
    },
    // A modification to a primitive value was found at the given index
    pushModification: function(index) {
      this.modifications.push( { index: index, oldValue: this.original.get(index), newValue: this.changed.get(index)});
    },
    // An object has moved from oldIndex to newIndex
    pushMove: function(oldIndex, newIndex) {
      this.moves.push( { oldIndex: oldIndex, index: newIndex, value: this.original.get(oldIndex)});
    }
  };

  /**
   * A flat list of changes ordered by collection key
   */
  function FlattenedChanges(changes) {
    this.changes = [];
    var index, item;
    // Flatten all the changes into a array ordered by index
    for(index = 0; index < changes.modifications.length; index++) {
      item = changes.modifications[index];
      this.modified(item);
    }
    for(index = 0; index < changes.deletions.length; index++) {
      item = changes.deletions[index];
      this.deleted(item);
    }
    for(index = 0; index < changes.additions.length; index++) {
      item = changes.additions[index];
      this.added(item);
    }
    for(index = 0; index < changes.moves.length; index++) {
      item = changes.moves[index];
      this.moved(item);
    }
  }
  FlattenedChanges.prototype = {
    modified: function(item) {
      item.modified = true;
      this.changes[item.index] = item;
    },
    moved: function(change) {
      var item = this.changes[change.index];
      if ( angular.isDefined(item) ) {
        item.value = change.value;
        item.oldIndex = change.oldIndex;
      } else {
        item = change;
      }
      item.moved = true;
      this.changes[change.index] = item;
    },
    added: function(change){
      var item = this.changes[change.index];
      if ( angular.isDefined(item) ) {
        item.value = change.value;
      } else {
        item = change;
      }
      item.added = true;
      this.changes[change.index] = item;
    },
    deleted: function(change) {
      var item = this.changes[change.index];
      if ( !angular.isDefined(item) ) {
        item = change;
      }
      item.deleted = true;
      this.changes[change.index] = item;
    }
  };
