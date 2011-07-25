'use strict';

/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$xhr.cache
 * @function
 * @requires $xhr
 *
 * @description
 * Acts just like the {@link angular.service.$xhr $xhr} service but caches responses for `GET`
 * requests. All cache misses are delegated to the $xhr service.
 *
 * @property {function()} delegate Function to delegate all the cache misses to. Defaults to
 *   the {@link angular.service.$xhr $xhr} service.
 * @property {object} data The hashmap where all cached entries are stored.
 *
 * @param {string} method HTTP method.
 * @param {string} url Destination URL.
 * @param {(string|Object)=} post Request body.
 * @param {function(number, (string|Object))} callback Response callback.
 * @param {function(number, (string|Object))=} error Response error callback.
 * @param {boolean=} [verifyCache=false] If `true` then a result is immediately returned from cache
 *   (if present) while a request is sent to the server for a fresh response that will update the
 *   cached entry. The `callback` function will be called when the response is received.
 * @param {boolean=} [sync=false] in case of cache hit execute `callback` synchronously.
 */
angularServiceInject('$xhr.cache', function($xhr, $defer, $log){
  var inflight = {}, self = this;
  function cache(method, url, post, callback, error, verifyCache, sync){
    if (isFunction(post)) {
      if (!isFunction(callback)) {
        verifyCache = callback;
        sync = error;
        error = noop;
      } else {
        sync = verifyCache;
        verifyCache = error;
        error = callback;
      }
      callback = post;
      post = null;
    } else if (!isFunction(error)) {
      sync = verifyCache;
      verifyCache = error;
      error = noop;
    }

    if (method == 'GET') {
      var data, dataCached;
      if (dataCached = cache.data[url]) {

        if (sync) {
          callback(200, copy(dataCached.value));
        } else {
          $defer(function() { callback(200, copy(dataCached.value)); });
        }

        if (!verifyCache)
          return;
      }

      if (data = inflight[url]) {
        data.callbacks.push(callback);
        data.errors.push(error);
      } else {
        inflight[url] = {callbacks: [callback], errors: [error]};
        cache.delegate(method, url, post,
          function(status, response) {
            if (status == 200)
              cache.data[url] = { value: response };
            var callbacks = inflight[url].callbacks;
            delete inflight[url];
            forEach(callbacks, function(callback){
              try {
                (callback||noop)(status, copy(response));
              } catch(e) {
                $log.error(e);
              }
            });
          },
          function(status, response) {
            var errors = inflight[url].errors;
            delete inflight[url];

            forEach(errors, function(error) {
              try {
                (error||noop)(status, copy(response));
              } catch(e) {
                $log.error(e);
              }
            });
          });
      }

    } else {
      cache.data = {};
      cache.delegate(method, url, post, callback, error);
    }
  }
  cache.data = {};
  cache.delegate = $xhr;
  return cache;
}, ['$xhr.bulk', '$defer', '$log']);
