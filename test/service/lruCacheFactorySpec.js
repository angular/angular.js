describe('$lruCacheFactory', function() {

  var scope, $lruCacheFactory, cache;

  beforeEach(function() {
    scope = angular.scope();
    $lruCacheFactory = scope.$service('$lruCacheFactory');
  });


  it('should create cache with defined capacity', function() {
    cache = $lruCacheFactory('cache1', 5);
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
      cache = $lruCacheFactory('cache1', 2);

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
      cache = $lruCacheFactory('cache2', 3);

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
