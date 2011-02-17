angularServiceInject('$lruCacheFactory', function($cacheFactory) {

  return function(cacheId, capacity) {
    var cache = $cacheFactory(cacheId),
        lruHash = {},
        freshEnd = _null,
        staleEnd = _null;

    return {
      id: function() { return cache.id(); },


      size: function() { return cache.size(); },


      put: function(key, value) {
        var lruEntry = lruHash[key] || (lruHash[key] = {key: key});

        refresh(lruEntry);
        cache.put(key, value);

        if (cache.size() > capacity) {
          cache.remove(staleEnd.key);
          delete lruHash[staleEnd.key];
          staleEnd = staleEnd.next;
          staleEnd.prev = _null;
        }
      },


      get: function(key) {
        var lruEntry = lruHash[key];

        if (!lruEntry) return;

        refresh(lruEntry);

        return cache.get(key);
      },


      remove: function(key) {
        var lruEntry = lruHash[key];

        if (lruEntry == freshEnd) freshEnd = lruEntry.prev;
        if (lruEntry == staleEnd) staleEnd = lruEntry.next;
        link(lruEntry.next,lruEntry.prev);

        delete lruHash[key];
        cache.remove(key);
      },


      removeAll: function() {
        cache.removeAll();
        lruHash = {};
        freshEnd = staleEnd = _null;
      }
    }


    function refresh(entry) {
      if (entry != freshEnd) {
        if (!staleEnd) {
          staleEnd = entry;
        } else if (staleEnd == entry) {
          staleEnd = entry.next;
        }

        link(entry.next, entry.prev);
        link(entry, freshEnd);
        freshEnd = entry;
        freshEnd.next = _null;
      }
    }


    function link(nextEntry, prevEntry) {
      if (nextEntry != prevEntry) {
        if (nextEntry) nextEntry.prev = prevEntry;
        if (prevEntry) prevEntry.next = nextEntry;
      }
    }
  }
}, ['$cacheFactory']);
