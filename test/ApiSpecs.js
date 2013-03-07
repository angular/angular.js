'use strict';

describe('api', function() {

  describe('HashMap', function() {
    it('should do basic crud', function() {
      var map = new HashMap();
      var key = {};
      var value1 = {};
      var value2 = {};
      map.put(key, value1);
      map.put(key, value2);
      expect(map.get(key)).toBe(value2);
      expect(map.get({})).toBe(undefined);
      expect(map.remove(key)).toBe(value2);
      expect(map.get(key)).toBe(undefined);
    });

    it('should init from an array', function() {
      var map = new HashMap(['a','b']);
      expect(map.get('a')).toBe(0);
      expect(map.get('b')).toBe(1);
      expect(map.get('c')).toBe(undefined);
    });
  });


  describe('HashQueueMap', function() {
    it('should do basic crud with collections', function() {
      var map = new HashQueueMap();
      map.push('key', 'a');
      map.push('key', 'b');
      expect(map[hashKey('key')]).toEqual(['a', 'b']);
      expect(map.peek('key')).toEqual('a');
      expect(map[hashKey('key')]).toEqual(['a', 'b']);
      expect(map.shift('key')).toEqual('a');
      expect(map.peek('key')).toEqual('b');
      expect(map[hashKey('key')]).toEqual(['b']);
      expect(map.shift('key')).toEqual('b');
      expect(map.shift('key')).toEqual(undefined);
      expect(map[hashKey('key')]).toEqual(undefined);
    });

    it('should support primitive and object keys', function() {
      var obj1 = {},
          obj2 = {};

      var map = new HashQueueMap();
      map.push(obj1, 'a1');
      map.push(obj1, 'a2');
      map.push(obj2, 'b');
      map.push(1, 'c');
      map.push(undefined, 'd');
      map.push(null, 'e');

      expect(map[hashKey(obj1)]).toEqual(['a1', 'a2']);
      expect(map[hashKey(obj2)]).toEqual(['b']);
      expect(map[hashKey(1)]).toEqual(['c']);
      expect(map[hashKey(undefined)]).toEqual(['d']);
      expect(map[hashKey(null)]).toEqual(['e']);
    });
  });

  describe('WrappedArray', function() {
    it('should have same length as wrapped array', function() {
      var array = [0,1,2,3,4,5];
      var wrapped = new WrappedArray(array);
      expect(wrapped.length()).toBe(array.length);
    });

    it('should have same elements as wrapped array', function() {
      var array = [0,1,2,3,4,5];
      var wrapped = new WrappedArray(array);
      expect(wrapped.get(0)).toBe(array[0]);
      expect(wrapped.get(1)).toBe(array[1]);
      expect(wrapped.get(2)).toBe(array[2]);
      expect(wrapped.get(3)).toBe(array[3]);
      expect(wrapped.get(4)).toBe(array[4]);
      expect(wrapped.get(5)).toBe(array[5]);
    });

    it('should return a copy of the array, with a new wrapper', function() {
      var array = [0,1,2,3,4,5];
      var wrapped = new WrappedArray(array);
      var copy = wrapped.copy();
      expect(copy).not.toBe(wrapped);
      expect(copy.collection).not.toBe(wrapped.collection);
      expect(copy.collection).toEqual(wrapped.collection);
    });
  });

  describe('WrappedObject', function() {
    it('should have same length as wrapped array', function() {
      var object = {a:0,b:1,c:2,d:3,e:4,f:5};
      var wrapped = new WrappedObject(object);
      expect(wrapped.length()).toBe(6);
    });

    it('should have same elements as wrapped object', function() {
      var object = {a:0,b:1,c:2,d:3,e:4,f:5};
      var wrapped = new WrappedObject(object);
      expect(wrapped.get(0)).toBe(object['a']);
      expect(wrapped.get(1)).toBe(object['b']);
      expect(wrapped.get(2)).toBe(object['c']);
      expect(wrapped.get(3)).toBe(object['d']);
      expect(wrapped.get(4)).toBe(object['e']);
      expect(wrapped.get(5)).toBe(object['f']);
    });

    it('should return a copy of the array, with a new wrapper', function() {
      var object = {a:0,b:1,c:2,d:3,e:4,f:5};
      var wrapped = new WrappedObject(object);
      var copy = wrapped.copy();
      expect(copy).not.toBe(wrapped);
      expect(copy.collection).not.toBe(wrapped.collection);
      expect(copy.collection).toEqual(wrapped.collection);
    });
  });

  describe('ObjectTracker', function() {
    it ('should initialize correctly', function() {
      var original = new WrappedArray([]);
      var changed = new WrappedArray([]);
      var tracker = new ObjectTracker(original, changed);
      expect(tracker.original).toBe(original);
      expect(tracker.changed).toBe(changed);
      expect(tracker.entries).toEqual([]);
    });

    it('should track a new entry', function() {
      var newEntry = {};
      var original = new WrappedArray([]);
      var changed = new WrappedArray([newEntry]);
      var tracker = new ObjectTracker(original, changed);
      tracker.addNewEntry(0);
      expect(tracker.getEntry(newEntry).obj).toBe(newEntry);
      expect(tracker.getEntry(newEntry).newIndexes[0]).toBe(0);
      expect(tracker.getEntry(newEntry).oldIndexes).toEqual([]);
    });

    it('should track an old entry', function() {
      var oldEntry = {};
      var original = new WrappedArray([oldEntry]);
      var changed = new WrappedArray([]);
      var tracker = new ObjectTracker(original, changed);
      tracker.addOldEntry(0);
      expect(tracker.getEntry(oldEntry).obj).toBe(oldEntry);
      expect(tracker.getEntry(oldEntry).oldIndexes[0]).toBe(0);
      expect(tracker.getEntry(oldEntry).newIndexes).toEqual([]);
    });
  });

  describe('ChangeTracker', function() {
    it('should initialize correctly', function() {
      var original = new WrappedArray([]);
      var changed = new WrappedArray([]);
      var tracker = new ChangeTracker(original, changed);
      expect(tracker.original).toBe(original);
      expect(tracker.changed).toBe(changed);
      expect(tracker.additions).toEqual([]);
      expect(tracker.deletions).toEqual([]);
      expect(tracker.modifications).toEqual([]);
      expect(tracker.moves).toEqual([]);
    });

    it('should track additions', function() {
      var original = new WrappedArray([]);
      var changed = new WrappedArray(['newItem']);
      var tracker = new ChangeTracker(original, changed);
      tracker.pushAddition(0);
      expect(tracker.additions[0]).toEqual({index: 0, value: 'newItem'});
    });

    it('should track deletions', function() {
      var original = new WrappedArray(['oldItem']);
      var changed = new WrappedArray([]);
      var tracker = new ChangeTracker(original, changed);
      tracker.pushDeletion(0);
      expect(tracker.deletions[0]).toEqual({index: 0, oldValue: 'oldItem'});
    });

    it('should track modifications', function() {
      var original = new WrappedArray(['oldItem']);
      var changed = new WrappedArray(['newItem']);
      var tracker = new ChangeTracker(original, changed);
      tracker.pushModification(0);
      expect(tracker.modifications[0]).toEqual({index: 0, newValue: 'newItem', oldValue: 'oldItem'});
    });

    it('should track moves', function() {
      var item1 = {};
      var item2 = {};
      var original = new WrappedArray([item1, item2]);
      var changed = new WrappedArray([item2, item1]);
      var tracker = new ChangeTracker(original, changed);
      tracker.pushMove(0,1);
      tracker.pushMove(1,0);
      expect(tracker.moves[0]).toEqual({oldIndex: 0, index: 1, value: item1});
      expect(tracker.moves[1]).toEqual({oldIndex: 1, index: 0, value: item2});
    });
  });

  describe('FlattenedChanges', function() {
    it('should flatten changes into a single indexed array', function() {
      var changes = {
        additions: [],
        deletions: [],
        modifications: [],
        moves: []
      };

      var flattened = new FlattenedChanges(changes);
      expect(flattened.changes.length).toBe(0);

      changes.additions.push({ index: 2, value: 'someVal'});
      flattened = new FlattenedChanges(changes);
      expect(flattened.changes.length).toBe(3);
      expect(flattened.changes[0]).toBeUndefined();
      expect(flattened.changes[1]).toBeUndefined();
      expect(flattened.changes[2].added).toBe(true);
      expect(flattened.changes[2].value).toBe('someVal');

      changes.deletions.push({ index: 2, oldValue: {}});
      flattened = new FlattenedChanges(changes);
      expect(flattened.changes.length).toBe(3);
      expect(flattened.changes[0]).toBeUndefined();
      expect(flattened.changes[1]).toBeUndefined();
      expect(flattened.changes[2].added).toBe(true);
      expect(flattened.changes[2].value).toBe('someVal');
      expect(flattened.changes[2].deleted).toBe(true);

      changes.modifications.push({ index: 4, oldValue: 'something', newValue: 23 });
      flattened = new FlattenedChanges(changes);
      expect(flattened.changes.length).toBe(5);
      expect(flattened.changes[0]).toBeUndefined();
      expect(flattened.changes[1]).toBeUndefined();
      expect(flattened.changes[2].added).toBe(true);
      expect(flattened.changes[2].value).toBe('someVal');
      expect(flattened.changes[2].deleted).toBe(true);
      expect(flattened.changes[4].modified).toBe(true);
      expect(flattened.changes[4].oldValue).toBe('something');
      expect(flattened.changes[4].newValue).toBe(23);

      changes.moves.push({ oldIndex: 3, index: 1, value: {} });
      flattened = new FlattenedChanges(changes);
      expect(flattened.changes.length).toBe(5);
      expect(flattened.changes[0]).toBeUndefined();
      expect(flattened.changes[1].moved).toBe(true);
      expect(flattened.changes[1].value).toEqual({});
      expect(flattened.changes[1].oldIndex).toBe(3);
      expect(flattened.changes[1].index).toBe(1);
      expect(flattened.changes[2].added).toBe(true);
      expect(flattened.changes[2].value).toBe('someVal');
      expect(flattened.changes[2].deleted).toBe(true);
      expect(flattened.changes[4].modified).toBe(true);
      expect(flattened.changes[4].oldValue).toBe('something');
      expect(flattened.changes[4].newValue).toBe(23);
    });

    it('should be able to identify if an object is deleted from the front', function() {
      var obj1 = {}, obj2 = {}, obj3 = {};
      var changes = {
        additions:[],
        deletions: [
          {index: 0, oldValue: obj1 }
        ],
        moves: [
          { value: obj2, oldIndex: 1, index: 0 },
          { value: obj3, oldIndex: 2, index: 1 }
        ],
        modifications: []
      };
      var flattened = new FlattenedChanges(changes);
      expect(flattened.changes.length).toBe(2);
      expect(flattened.changes[0].deleted).toBe(true);
      expect(flattened.changes[0].moved).toBe(true);
      expect(flattened.changes[1].moved).toBe(true);
    });

    it('should not be affected by previous calls', function() {
      var changes = {
        additions: [],
        deletions: [],
        modifications: [],
        moves: []
      };

      var flattened = new FlattenedChanges(changes);
      expect(flattened.changes.length).toBe(0);

      changes.additions.push({ index: 2, value: 'someVal'});
      flattened = new FlattenedChanges(changes);
      expect(flattened.changes.length).toBe(3);

      changes.additions = [];
      flattened = new FlattenedChanges(changes);
      expect(flattened.changes.length).toBe(0);
    });
  });

});

