describe('$cacheFactory', function() {

  var scope, $cacheFactory, cache;

  beforeEach(function() {
    scope = angular.scope();
    $cacheFactory = scope.$service('$cacheFactory');
  });


  it('should be injected', function() {
    expect($cacheFactory).toBeDefined();
  });


  it('should return a new cache whenever called', function() {
    var cache1 = $cacheFactory('cache1');
    var cache2 = $cacheFactory('cache2');
    expect(cache1).not.toEqual(cache2);
  });


  it('should complain if the cache id is being reused', function() {
    $cacheFactory('cache1');
    expect(function() {$cacheFactory('cache1')}).
      toThrow("cacheId cache1 taken");
  });


  it('should provide stats about all created caches', function() {
    expect($cacheFactory.stats()).toEqual({});

    var cache1 = $cacheFactory('cache1');
    expect($cacheFactory.stats()).toEqual({cache1: {size: 0}});

    cache1.put('foo', 'bar');
    expect($cacheFactory.stats()).toEqual({cache1: {size: 1}});
  });


  describe('cache', function() {
    var cache;

    beforeEach(function() {
      cache = $cacheFactory('test');
    });


    describe('put, get & remove', function() {

      it('should add cache entries via add and retrieve them via get', function() {
        cache.put('key1', 'bar');
        cache.put('key2', {bar:'baz'});

        expect(cache.get('key2')).toEqual({bar:'baz'});
        expect(cache.get('key1')).toBe('bar');
      });


      it('should ignore put if the value is undefined', function() {
        cache.put();
        cache.put('key1');
        cache.put('key2', undefined);

        expect(cache.size()).toBe(0);
      });


      it('should remove entries via remove', function() {
        cache.put('k1', 'foo');
        cache.put('k2', 'bar');

        cache.remove('k2');

        expect(cache.get('k1')).toBe('foo');
        expect(cache.get('k2')).toBeUndefined();

        cache.remove('k1');

        expect(cache.get('k1')).toBeUndefined();
        expect(cache.get('k2')).toBeUndefined();
      });


      it('should stringify keys', function() {
        cache.put('123', 'foo');
        cache.put(123, 'bar');

        expect(cache.get('123')).toBe('bar');
        expect(cache.size()).toBe(1);

        cache.remove(123);
        expect(cache.size()).toBe(0);
      })
    });


    describe('size', function() {

      it('should increment with put and decrement with remove', function() {
        expect(cache.size()).toBe(0);

        cache.put('foo', 'bar');
        expect(cache.size()).toBe(1);

        cache.put('baz', 'boo');
        expect(cache.size()).toBe(2);

        cache.remove('baz');
        expect(cache.size()).toBe(1);

        cache.remove('foo');
        expect(cache.size()).toBe(0);
      });
    });


    describe('id', function() {

      it('should return cache id', function() {
        expect(cache.id()).toBe('test');
      })
    });


    describe('removeAll', function() {

      it('should blow away all data', function() {
        cache.put('id1', 1);
        cache.put('id2', 2);
        cache.put('id3', 3);
        expect(cache.size()).toBe(3);

        cache.removeAll();

        expect(cache.size()).toBe(0);
        expect(cache.get('id1')).toBeUndefined();
        expect(cache.get('id2')).toBeUndefined();
        expect(cache.get('id3')).toBeUndefined();
      });
    });
  });


  describe('LRU cache', function() {

    it('should create cache with defined capacity', function() {
      cache = $cacheFactory('cache1', {capacity: 5});
      expect(cache.size()).toBe(0);

      for (var i=0; i<5; i++) {
        cache.put('id' + i, i);
      }

      expect(cache.size()).toBe(5);

      cache.put('id5', 5);
      expect(cache.size()).toBe(5);
      cache.put('id6', 6);
      expect(cache.size()).toBe(5);
    });


    describe('eviction', function() {

      beforeEach(function() {
        cache = $cacheFactory('cache1', {capacity: 2});

        cache.put('id0', 0);
        cache.put('id1', 1);
      });


      it('should kick out the first entry on put', function() {
        cache.put('id2', 2);
        expect(cache.get('id0')).toBeUndefined();
        expect(cache.get('id1')).toBe(1);
        expect(cache.get('id2')).toBe(2);
      });


      it('should refresh an entry via get', function() {
        cache.get('id0');
        cache.put('id2', 2);
        expect(cache.get('id0')).toBe(0);
        expect(cache.get('id1')).toBeUndefined();
        expect(cache.get('id2')).toBe(2);
      });


      it('should refresh an entry via put', function() {
        cache.put('id0', '00');
        cache.put('id2', 2);
        expect(cache.get('id0')).toBe('00');
        expect(cache.get('id1')).toBeUndefined();
        expect(cache.get('id2')).toBe(2);
      });


      it('should not purge an entry if another one was removed', function() {
        cache.remove('id1');
        cache.put('id2', 2);
        expect(cache.get('id0')).toBe(0);
        expect(cache.get('id1')).toBeUndefined();
        expect(cache.get('id2')).toBe(2);
      });


      it('should purge the next entry if the stalest one was removed', function() {
        cache.remove('id0');
        cache.put('id2', 2);
        cache.put('id3', 3);
        expect(cache.get('id0')).toBeUndefined();
        expect(cache.get('id1')).toBeUndefined();
        expect(cache.get('id2')).toBe(2);
        expect(cache.get('id3')).toBe(3);
      });


      it('should correctly recreate the linked list if all cache entries were removed', function() {
        cache.remove('id0');
        cache.remove('id1');
        cache.put('id2', 2);
        cache.put('id3', 3);
        cache.put('id4', 4);
        expect(cache.get('id0')).toBeUndefined();
        expect(cache.get('id1')).toBeUndefined();
        expect(cache.get('id2')).toBeUndefined();
        expect(cache.get('id3')).toBe(3);
        expect(cache.get('id4')).toBe(4);
      });


      it('should blow away the entire cache via removeAll and start evicting when full', function() {
        cache.put('id0', 0);
        cache.put('id1', 1);
        cache.removeAll();

        cache.put('id2', 2);
        cache.put('id3', 3);
        cache.put('id4', 4);

        expect(cache.size()).toBe(2);
        expect(cache.get('id0')).toBeUndefined();
        expect(cache.get('id1')).toBeUndefined();
        expect(cache.get('id2')).toBeUndefined();
        expect(cache.get('id3')).toBe(3);
        expect(cache.get('id4')).toBe(4);
      });


      it('should correctly refresh and evict items if operations are chained', function() {
        cache = $cacheFactory('cache2', {capacity: 3});

        cache.put('id0', 0); //0
        cache.put('id1', 1); //1,0
        cache.put('id2', 2); //2,1,0
        cache.get('id0');    //0,2,1
        cache.put('id3', 3); //3,0,2
        cache.put('id0', 9); //0,3,2
        cache.put('id4', 4); //4,0,3

        expect(cache.get('id3')).toBe(3);
        expect(cache.get('id0')).toBe(9);
        expect(cache.get('id4')).toBe(4);

        cache.remove('id0'); //4,3
        cache.remove('id3'); //4
        cache.put('id5', 5); //5,4
        cache.put('id6', 6); //6,5,4
        cache.get('id4');    //4,6,5
        cache.put('id7', 7); //7,4,6

        expect(cache.get('id0')).toBeUndefined();
        expect(cache.get('id1')).toBeUndefined();
        expect(cache.get('id2')).toBeUndefined();
        expect(cache.get('id3')).toBeUndefined();
        expect(cache.get('id4')).toBe(4);
        expect(cache.get('id5')).toBeUndefined();
        expect(cache.get('id6')).toBe(6);
        expect(cache.get('id7')).toBe(7);

        cache.removeAll();
        cache.put('id0', 0); //0
        cache.put('id1', 1); //1,0
        cache.put('id2', 2); //2,1,0
        cache.put('id3', 3); //3,2,1

        expect(cache.size()).toBe(3);
        expect(cache.get('id0')).toBeUndefined();
        expect(cache.get('id1')).toBe(1);
        expect(cache.get('id2')).toBe(2);
        expect(cache.get('id3')).toBe(3);
      });
    });
  });
});
