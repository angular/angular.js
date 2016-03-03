'use strict';

/** @this */
var $$AnimateCacheProvider = function() {

  var KEY = '$$ngAnimateParentKey';
  var parentCounter = 0;
  var cache = Object.create(null);

  this.$get = [function() {
    return {
      cacheKey: function(node, method, addClass, removeClass) {
        var parentNode = node.parentNode;
        var parentID = parentNode[KEY] || (parentNode[KEY] = ++parentCounter);
        var parts = [parentID, method, node.getAttribute('class')];
        if (addClass) {
          parts.push(addClass);
        }
        if (removeClass) {
          parts.push(removeClass);
        }
        return parts.join(' ');
      },

      containsCachedAnimationWithoutDuration: function(key) {
        var entry = cache[key];

        // nothing cached, so go ahead and animate
        // otherwise it should be a valid animation
        return (entry && !entry.isValid) || false;
      },

      flush: function() {
        cache = Object.create(null);
      },

      count: function(key) {
        var entry = cache[key];
        return entry ? entry.total : 0;
      },

      get: function(key) {
        var entry = cache[key];
        return entry && entry.value;
      },

      put: function(key, value, isValid) {
        if (!cache[key]) {
          cache[key] = { total: 1, value: value, isValid: isValid };
        } else {
          cache[key].total++;
          cache[key].value = value;
        }
      }
    };
  }];
};
