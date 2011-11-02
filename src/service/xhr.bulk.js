'use strict';

/**
 * @ngdoc service
 * @name angular.service.$xhr.bulk
 * @requires $xhr
 * @requires $xhr.error
 * @requires $log
 *
 * @description
 *
 * @example
 */
function $XhrBulkProvider() {
  this.$get = ['$rootScope', '$xhr', '$xhr.error', '$log',
      function( $rootScope,   $xhr,   $error,       $log) {
    var requests = [];
    function bulkXHR(method, url, post, success, error) {
      if (isFunction(post)) {
        error = success;
        success = post;
        post = null;
      }
      var currentQueue;
      forEach(bulkXHR.urls, function(queue){
        if (isFunction(queue.match) ? queue.match(url) : queue.match.exec(url)) {
          currentQueue = queue;
        }
      });
      if (currentQueue) {
        if (!currentQueue.requests) currentQueue.requests = [];
        var request = {
            method: method,
            url: url,
            data: post,
            success: success};
        if (error) request.error = error;
        currentQueue.requests.push(request);
      } else {
        $xhr(method, url, post, success, error);
      }
    }
    bulkXHR.urls = {};
    bulkXHR.flush = function(success, errorback) {
      assertArgFn(success = success || noop, 0);
      assertArgFn(errorback = errorback || noop, 1);
      forEach(bulkXHR.urls, function(queue, url) {
        var currentRequests = queue.requests;
        if (currentRequests && currentRequests.length) {
          queue.requests = [];
          queue.callbacks = [];
          $xhr('POST', url, {requests: currentRequests},
            function(code, response) {
              forEach(response, function(response, i) {
                try {
                  if (response.status == 200) {
                    (currentRequests[i].success || noop)(response.status, response.response);
                  } else if (isFunction(currentRequests[i].error)) {
                      currentRequests[i].error(response.status, response.response);
                  } else {
                    $error(currentRequests[i], response);
                  }
                } catch(e) {
                  $log.error(e);
                }
              });
              success();
            },
            function(code, response) {
              forEach(currentRequests, function(request, i) {
                try {
                  if (isFunction(request.error)) {
                    request.error(code, response);
                  } else {
                    $error(request, response);
                  }
                } catch(e) {
                  $log.error(e);
                }
              });
              noop();
            });
        }
      });
    };
    $rootScope.$watch(function() { bulkXHR.flush(); });
    return bulkXHR;
  }];
}
