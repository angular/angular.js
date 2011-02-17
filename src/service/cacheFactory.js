/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$cacheFactory
 *
 * @description
 *
 *
 */
angularServiceInject("$cacheFactory", function() {
  var caches = {};

  function cacheFactory(cacheId) {
    if (cacheId in caches) {
      throw Error('cacheId ' + cacheId + ' taken');
    }

    var stats = caches[cacheId] = {size:0},
        data = {};

    return {
      id: function() { return cacheId; },

      size: function() { return stats.size; },

      put: function(key, value) {
        if (isUndefined(value)) return;
        if (!(key in data)) stats.size++;
        data[key] = value;
      },

      get: function(key) {
        return data[key];
      },

      remove: function(key) {
        delete data[key];
        stats.size--;
      },

      removeAll: function(key) {
        data = {};
        stats.size = 0;
      }
    };
  }

  cacheFactory.stats = function() {
    return copy(caches);
  }

  return cacheFactory;
});
