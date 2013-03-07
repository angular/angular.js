describe('whatChanged - arrays', function() {
  describe('primitive changes', function() {
    var original = new WrappedArray([0,1,2,3,4]);
    it('should have nothing changed if primitive items are the same', function() {
      var changed = new WrappedArray([0,1,2,3,4]);
      var changes = whatChanged(original, changed);
      expect(changes.additions).toEqual([]);
      expect(changes.deletions).toEqual([]);
      expect(changes.moves).toEqual([]);
      expect(changes.modifications).toEqual([]);
    });

    it('should be able to identify indexes of primitives that have changed', function() {
      var changed = new WrappedArray([0,1,3,4,2]);
      var changes = whatChanged(original, changed);
      expect(changes.additions).toEqual([]);
      expect(changes.deletions).toEqual([]);
      expect(changes.moves).toEqual([]);
      expect(changes.modifications).toEqual([
        { index: 2, oldValue: 2, newValue: 3 },
        { index: 3, oldValue: 3, newValue: 4 },
        { index: 4, oldValue: 4, newValue: 2 }
      ]);
    });

    it('should be able to identify added primitives', function() {
      var changed = new WrappedArray([0,1,2,3,4,5,6]);
      var changes = whatChanged(original, changed);
      expect(changes.additions).toEqual([
        { index: 5, value: 5 },
        { index: 6, value: 6 }
      ]);
      expect(changes.deletions).toEqual([]);
      expect(changes.moves).toEqual([]);
      expect(changes.modifications).toEqual([]);
    });

    it('should be able to identify removed primitives', function() {
      var changed = new WrappedArray([0,1,2]);
      var changes = whatChanged(original, changed);
      expect(changes.additions).toEqual([]);
      expect(changes.deletions).toEqual([
        { index: 3, oldValue: 3 },
        { index: 4, oldValue: 4 }
      ]);
      expect(changes.moves).toEqual([]);
      expect(changes.modifications).toEqual([]);
    });

    it('should be able to identify modifications and additions', function () {
      var changed = new WrappedArray([0,7,8,3,4,5,6]);
      var changes = whatChanged(original, changed);
      expect(changes.additions).toEqual([
        { index: 5, value: 5 },
        { index: 6, value: 6 }
      ]);
      expect(changes.deletions).toEqual([]);
      expect(changes.moves).toEqual([]);
      expect(changes.modifications).toEqual([
        { index: 1, oldValue: 1, newValue: 7 },
        { index: 2, oldValue: 2, newValue: 8 }
      ]);
    });

    it('should be able to identify modifications and deletions', function () {
      var changed = new WrappedArray([0,7,8]);
      var changes = whatChanged(original, changed);
      expect(changes.additions).toEqual([]);
      expect(changes.deletions).toEqual([
        { index: 3, oldValue: 3 },
        { index: 4, oldValue: 4 }
      ]);
      expect(changes.moves).toEqual([]);
      expect(changes.modifications).toEqual([
        { index: 1, oldValue: 1, newValue: 7 },
        { index: 2, oldValue: 2, newValue: 8 }
      ]);
    });
  });

  describe('object changes', function() {
    var obj1, obj2, obj3;
    var original;
    beforeEach(function() {
      obj1 = {};
      obj2 = ['a','b'];
      obj3 = {};
      original = new WrappedArray([obj1, obj2, obj3]);
    });

    it('should have nothing changed if the objects are identical', function() {
      var changed = new WrappedArray([obj1, obj2, obj3]);
      var changes = whatChanged(original, changed);
      expect(changes.additions).toEqual([]);
      expect(changes.deletions).toEqual([]);
      expect(changes.moves).toEqual([]);
      expect(changes.modifications).toEqual([]);
    });

    it('should be able to identify if an object moves', function() {
      var changed = new WrappedArray([obj1, obj3, obj2]);
      var changes = whatChanged(original, changed);
      expect(changes.additions).toEqual([]);
      expect(changes.deletions).toEqual([]);
      expect(changes.moves).toEqual([
        { value: obj2, oldIndex: 1, index: 2 },
        { value: obj3, oldIndex: 2, index: 1 }
      ]);
      expect(changes.modifications).toEqual([]);
    });

    it('should be able to identify if a new object is added', function() {
      var obj4 = {};
      var changed = new WrappedArray([obj1, obj2, obj3, obj4]);
      var changes = whatChanged(original, changed);
      expect(changes.additions).toEqual([
        {index: 3, value: obj4 }
      ]);
      expect(changes.deletions).toEqual([]);
      expect(changes.moves).toEqual([]);
      expect(changes.modifications).toEqual([]);
    });

    it('should be able to identify if an object is deleted from the end', function() {
      var changed = new WrappedArray([obj1, obj2]);
      var changes = whatChanged(original, changed);
      expect(changes.additions).toEqual([]);
      expect(changes.deletions).toEqual([
        {index: 2, oldValue: obj3 }
      ]);
      expect(changes.moves).toEqual([]);
      expect(changes.modifications).toEqual([]);
    });

    it('should be able to identify if an object is deleted from the front', function() {
      var changed = new WrappedArray([obj2, obj3]);
      var changes = whatChanged(original, changed);
      expect(changes.additions).toEqual([]);
      expect(changes.deletions).toEqual([
        {index: 0, oldValue: obj1 }
      ]);
      expect(changes.moves).toEqual([
        { value: obj2, oldIndex: 1, index: 0 },
        { value: obj3, oldIndex: 2, index: 1 }
        ]);
      expect(changes.modifications).toEqual([]);
    });

    it('should be able to identify if an object is deleted causing others to move', function() {
      var changed = new WrappedArray([obj1, obj3]);
      var changes = whatChanged(original, changed);
      expect(changes.additions).toEqual([]);
      expect(changes.deletions).toEqual([
        {index: 1, oldValue: obj2 }
      ]);
      expect(changes.moves).toEqual([
        {value: obj3, oldIndex: 2, index: 1}
      ]);
      expect(changes.modifications).toEqual([]);
    });

    it('should be able to cope with multiple copies of the same object', function() {
      original = new WrappedArray([obj1, obj1, obj1]);
      var changed = new WrappedArray([obj1, obj1, obj1]);
      var changes = whatChanged(original, changed);
      expect(changes.additions).toEqual([]);
      expect(changes.deletions).toEqual([]);
      expect(changes.moves).toEqual([]);
      expect(changes.modifications).toEqual([]);
    });

    it('should be able to cope with addition when there are multiple copies', function() {
      original = new WrappedArray([obj1, obj1, obj1]);
      var changed = new WrappedArray([obj1, obj2, obj1]);
      var changes = whatChanged(original, changed);
      expect(changes.additions).toEqual([
        { index: 1, value: obj2 }
      ]);
      expect(changes.deletions).toEqual([
        { index: 1, oldValue: obj1 }
      ]);
      expect(changes.moves).toEqual([]);
      expect(changes.modifications).toEqual([]);
    });

    it('should be able to cope with changing when there are multiple copies', function() {
      original = new WrappedArray([obj1, obj1, obj1]);
      var changed = new WrappedArray([obj1, obj1]);
      var changes = whatChanged(original, changed);
      expect(changes.additions).toEqual([]);
      expect(changes.deletions).toEqual([
        { index: 2, oldValue: obj1 }
      ]);
      expect(changes.moves).toEqual([]);
      expect(changes.modifications).toEqual([]);
    });
  });
});

