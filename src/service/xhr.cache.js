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
 * @param {boolean=} [verifyCache=false] If `true` then a result is immediately returned from cache
 *   (if present) while a request is sent to the server for a fresh response that will update the
 *   cached entry. The `callback` function will be called when the response is received.
 */
angularServiceInject('$xhr.cache', function($xhr, $defer, $log){
  var inflight = {}, self = this;
  function cache(method, url, post, callback, verifyCache){
    if (isFunction(post)) {
      callback = post;
      post = _null;
    }
    if (method == 'GET') {
      var data, dataCached;
      if (dataCached = cache.data[url]) {
        $defer(function() { callback(200, copy(dataCached.value)); });
        if (!verifyCache)
          return;
      }

      if (data = inflight[url]) {
        data.callbacks.push(callback);
      } else {
        inflight[url] = {callbacks: [callback]};
        cache.delegate(method, url, post, function(status, response){
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
        });
      }

    } else {
      cache.data = {};
      cache.delegate(method, url, post, callback);
    }
  }
  cache.data = {};
  cache.delegate = $xhr;
  return cache;
}, ['$xhr.bulk', '$defer', '$log']);
