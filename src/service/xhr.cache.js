'use strict';

/**
 * @ngdoc object
 * @name angular.module.NG.$xhr.cache
 * @function
 *
 * @requires $xhr.bulk
 * @requires $defer
 * @requires $xhr.error
 * @requires $log
 *
 * @description
 * Acts just like the {@link angular.module.NG.$xhr $xhr} service but caches responses for `GET`
 * requests. All cache misses are delegated to the $xhr service.
 *
 * @property {function()} delegate Function to delegate all the cache misses to. Defaults to
 *   the {@link angular.module.NG.$xhr $xhr} service.
 * @property {object} data The hashmap where all cached entries are stored.
 *
 * @param {string} method HTTP method.
 * @param {string} url Destination URL.
 * @param {(string|Object)=} post Request body.
 * @param {function(number, (string|Object))} success Response success callback.
 * @param {function(number, (string|Object))=} error Response error callback.
 * @param {boolean=} [verifyCache=false] If `true` then a result is immediately returned from cache
 *   (if present) while a request is sent to the server for a fresh response that will update the
 *   cached entry. The `success` function will be called when the response is received.
 * @param {boolean=} [sync=false] in case of cache hit execute `success` synchronously.
 */
function $XhrCacheProvider() {
  this.$get = ['$xhr.bulk', '$defer', '$xhr.error', '$log',
       function($xhr,        $defer,   $error,       $log) {
    var inflight = {};
    function cache(method, url, post, success, error, verifyCache, sync) {
      if (isFunction(post)) {
        if (!isFunction(success)) {
          verifyCache = success;
          sync = error;
          error = null;
        } else {
          sync = verifyCache;
          verifyCache = error;
          error = success;
        }
        success = post;
        post = null;
      } else if (!isFunction(error)) {
        sync = verifyCache;
        verifyCache = error;
        error = null;
      }

      if (method == 'GET') {
        var data, dataCached;
        if ((dataCached = cache.data[url])) {

          if (sync) {
            success(200, copy(dataCached.value));
          } else {
            $defer(function() { success(200, copy(dataCached.value)); });
          }

          if (!verifyCache)
            return;
        }

        if ((data = inflight[url])) {
          data.successes.push(success);
          data.errors.push(error);
        } else {
          inflight[url] = {successes: [success], errors: [error]};
          cache.delegate(method, url, post,
            function(status, response) {
              if (status == 200)
                cache.data[url] = {value: response};
              var successes = inflight[url].successes;
              delete inflight[url];
              forEach(successes, function(success) {
                try {
                  (success||noop)(status, copy(response));
                } catch(e) {
                  $log.error(e);
                }
              });
            },
            function(status, response) {
              var errors = inflight[url].errors,
                  successes = inflight[url].successes;
              delete inflight[url];

              forEach(errors, function(error, i) {
                try {
                  if (isFunction(error)) {
                    error(status, copy(response));
                  } else {
                    $error(
                      {method: method, url: url, data: post, success: successes[i]},
                      {status: status, body: response});
                  }
                } catch(e) {
                  $log.error(e);
                }
              });
            });
        }

      } else {
        cache.data = {};
        cache.delegate(method, url, post, success, error);
      }
    }
    cache.data = {};
    cache.delegate = $xhr;
    return cache;
  }];

}
