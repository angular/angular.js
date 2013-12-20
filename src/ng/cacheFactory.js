'use strict';

/**
 * @ngdoc object
 * @name ng.$cacheFactory
 *
 * @description
 * Factory that constructs cache objects and gives access to them.
 * 
 * <pre>
 * 
 *  var cache = $cacheFactory('cacheId');
 *  expect($cacheFactory.get('cacheId')).toBe(cache);
 *  expect($cacheFactory.get('noSuchCacheId')).not.toBeDefined();
 *
 *  cache.put("key", "value");
 *  cache.put("another key", "another value");
 *
 *  // We've specified no options on creation
 *  expect(cache.info()).toEqual({id: 'cacheId', size: 2}); 
 * 
 * </pre>
 *
 *
 * @param {string} cacheId Name or id of the newly created cache.
 * @param {object=} options Options object that specifies the cache behavior. Properties:
 *
 *   - `{number=}` `capacity` — turns the cache into LRU cache.
 *   - `{number=}` `timeToLive` — number of milliseconds after which cached
 *     objects should be invalidated. Cached objects are invalidated on
 *     `get({string} key)`, `put({string} key, {*} value)` and `info()`.
 *
 * @returns {object} Newly created cache object with the following set of methods:
 *
 * - `{object}` `info()` — Returns id, size, and options of cache.
 * - `{{*}}` `put({string} key, {*} value)` — Puts a new key-value pair into the cache and returns
 *   it.
 * - `{{*}}` `get({string} key)` — Returns cached value for `key` or undefined for cache miss.
 * - `{void}` `remove({string} key)` — Removes a key-value pair from the cache.
 * - `{void}` `removeAll()` — Removes all cached values.
 * - `{void}` `destroy()` — Removes references to this cache from $cacheFactory.
 *
 */
function $CacheFactoryProvider() {

  /*
   * A simple linked list implementation which is used to keep track of
   * entry access (for LRU) and entry age (for TTL).
   */
  function LinkedList() {
    var hash = {};
    var freshEnd = null;
    var staleEnd = null;


    /**
     * bidirectionally links two entries of the LRU linked list
     */
    function link(nextEntry, prevEntry) {
      if (nextEntry != prevEntry) {
        if (nextEntry) nextEntry.p = prevEntry; //p stands for previous, 'prev' didn't minify
        if (prevEntry) prevEntry.n = nextEntry; //n stands for next, 'next' didn't minify
      }
    }


    this.add = function(key) {
      var entry = hash[key] || (hash[key] = { key: key });
      this.moveToHead(entry);
      return entry;
    };


    this.get = function(key) {
      return hash[key];
    };


    this.getTail = function() {
      return staleEnd;
    };


    /**
     * makes the `entry` the freshEnd of the linked list
     */
    this.moveToHead = function(entry) {
      if (entry != freshEnd) {
        if (!staleEnd) {
          staleEnd = entry;
        } else if (staleEnd == entry) {
          staleEnd = entry.n;
        }

        link(entry.n, entry.p);
        link(entry, freshEnd);
        freshEnd = entry;
        freshEnd.n = null;
      }
    };


    this.remove = function(entry) {
      if (entry == freshEnd) freshEnd = entry.p;
      if (entry == staleEnd) staleEnd = entry.n;
      link(entry.n,entry.p);
      delete hash[entry.key];
    };


    this.removeAll = function() {
      hash = {};
      freshEnd = staleEnd = null;
    };
  }

  this.$get = function() {
    var caches = {};

    function cacheFactory(cacheId, options) {
      if (cacheId in caches) {
        throw minErr('$cacheFactory')('iid', "CacheId '{0}' is already taken!", cacheId);
      }

      var size = 0,
          stats = extend({}, options, {id: cacheId}),
          data = {},
          capacity = (options && options.capacity) || Number.MAX_VALUE,
          timeToLive = (options && options.timeToLive) || Number.MAX_VALUE,
          lruList = new LinkedList(),
          ttlList = new LinkedList();

      var cache = caches[cacheId] = {

        put: function(key, value) {
          removeExpiredEntries();

          var lruEntry = lruList.add(key);
          var ttlEntry = ttlList.add(key);
          
          ttlEntry.expiration = new Date().getTime() + timeToLive;

          if (isUndefined(value)) return;
          if (!(key in data)) size++;
          data[key] = value;

          if (size > capacity) {
            this.remove(lruList.getTail().key);
          }

          return value;
        },


        get: function(key) {
          removeExpiredEntries();

          var lruEntry = lruList.get(key);
          var ttlEntry = ttlList.get(key);

          if (!lruEntry) return;

          lruList.moveToHead(lruEntry);

          return data[key];
        },


        remove: function(key) {
          var lruEntry = lruList.get(key);
          var ttlEntry = ttlList.get(key);

          if (!lruEntry) return;

          lruList.remove(lruEntry);
          ttlList.remove(ttlEntry);

          delete data[key];
          size--;
        },


        removeAll: function() {
          data = {};
          size = 0;
          lruList.removeAll();
          ttlList.removeAll();
        },


        destroy: function() {
          data = null;
          stats = null;
          lruList = null;
          ttlList = null;
          delete caches[cacheId];
        },


        info: function() {
          removeExpiredEntries();
          return extend({}, stats, {size: size});
        }
      };

      /*
       * Scans the TTL linked list for stale items and removes
       * those through `remove({string} key)`.
       *
       * The TTL linked list always keeps the oldest entries at its tail so
       * that this operation is cheap.
       */
      function removeExpiredEntries() {
        var now = new Date().getTime();
        var tail = ttlList.getTail();
        while (tail && tail.expiration < now) {
          cache.remove(tail.key);
          tail = ttlList.getTail();
        }
      }

      return cache;
    }


  /**
   * @ngdoc method
   * @name ng.$cacheFactory#info
   * @methodOf ng.$cacheFactory
   *
   * @description
   * Get information about all the of the caches that have been created
   *
   * @returns {Object} - key-value map of `cacheId` to the result of calling `cache#info`
   */
    cacheFactory.info = function() {
      var info = {};
      forEach(caches, function(cache, cacheId) {
        info[cacheId] = cache.info();
      });
      return info;
    };


  /**
   * @ngdoc method
   * @name ng.$cacheFactory#get
   * @methodOf ng.$cacheFactory
   *
   * @description
   * Get access to a cache object by the `cacheId` used when it was created.
   *
   * @param {string} cacheId Name or id of a cache to access.
   * @returns {object} Cache object identified by the cacheId or undefined if no such cache.
   */
    cacheFactory.get = function(cacheId) {
      return caches[cacheId];
    };


    return cacheFactory;
  };
}

/**
 * @ngdoc object
 * @name ng.$templateCache
 *
 * @description
 * The first time a template is used, it is loaded in the template cache for quick retrieval. You
 * can load templates directly into the cache in a `script` tag, or by consuming the
 * `$templateCache` service directly.
 * 
 * Adding via the `script` tag:
 * <pre>
 * <html ng-app>
 * <head>
 * <script type="text/ng-template" id="templateId.html">
 *   This is the content of the template
 * </script>
 * </head>
 *   ...
 * </html>
 * </pre>
 * 
 * **Note:** the `script` tag containing the template does not need to be included in the `head` of
 * the document, but it must be below the `ng-app` definition.
 * 
 * Adding via the $templateCache service:
 * 
 * <pre>
 * var myApp = angular.module('myApp', []);
 * myApp.run(function($templateCache) {
 *   $templateCache.put('templateId.html', 'This is the content of the template');
 * });
 * </pre>
 * 
 * To retrieve the template later, simply use it in your HTML:
 * <pre>
 * <div ng-include=" 'templateId.html' "></div>
 * </pre>
 * 
 * or get it via Javascript:
 * <pre>
 * $templateCache.get('templateId.html')
 * </pre>
 * 
 * See {@link ng.$cacheFactory $cacheFactory}.
 *
 */
function $TemplateCacheProvider() {
  this.$get = ['$cacheFactory', function($cacheFactory) {
    return $cacheFactory('templates');
  }];
}

