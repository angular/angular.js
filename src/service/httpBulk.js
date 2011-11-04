'use strict';

angular.service('httpBulk', function($http, $log) {
  var buckets = {},
      defaultReceiver,
      rootScope = this;

  /**
   * @param {Object} config HTTP config object
   * @returns {function(string, function)} HTTP promise with `on` method
   */
  function httpBulk(config) {
    var name, bucket, matched,
        //TODO(i): lame since just one pair of success and error callbacks can be registered
        callbacks = {'success': angular.noop, 'error': angular.noop};

    for (name in buckets) {
      bucket = buckets[name];
      if (bucket.matcher.test(config.url)) {
        matched = true;
        break;
      }
    }

    if (!matched) return $http(config);

    bucket.queue.push({config: config, callbacks: callbacks});

    var promise = {
      on: function onFn(resolution, callback) {
        callbacks[resolution] = callback;
        return promise;
      }
    };

    return promise;
  }


  /**
   * @param {string} name
   * @param {RegExp} matcher
   * @param {string} receiver
   * @returns httpBulk
   */
  httpBulk.bucket = function(name, matcher, receiver) {
    buckets[name] = {
      matcher: matcher,
      receiver: receiver || defaultReceiver,
      queue: []
    };
    return httpBulk;
  };


  /**
   * @param {string} receiverUrl
   * @returns httpBulk
   */
  httpBulk.receiver = function(receiverUrl) {
    defaultReceiver = receiverUrl;
    return httpBulk;
  };


  /**
   * @param {object} bucket
   */
  function flush(bucket) {
    if (!bucket.queue.length) return;

    var requests = [],
        callbacks = [];

    angular.forEach(bucket.queue, function(request) {
      requests.push(request.config);
      callbacks.push(request.callbacks);
    });

    bucket.queue = [];
    $http.post(bucket.receiver, {requests: requests}).
      on('success', function(responses) {
        var i, n, response, status, callback;

        for (i = 0, n = responses.length; i < n; i++) {
          response = responses[i];
          status = response.status;
          callback = (200 <= status && status < 300) ? callbacks[i].success : callbacks[i].error;

          try {
            callback(response.response, status);
          } catch(e) {
            $log.error(e);
          }
        }
      }
    );
  }

  // register the flush method
  rootScope.$watch(function() {
    angular.forEach(buckets, flush);
  });

  return httpBulk;
}, {$inject: ['$http', '$log']});
