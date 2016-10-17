'use strict';

/**
 * @ngdoc service
 * @name $jsonpCallbacks
 * @requires $window
 * @description
 * This service handles the lifecycle of callbacks to handle JSONP requests.
 * Override this service if you wish to customise where the callbacks are stored and
 * how they vary compared to the requested url.
 */
var $jsonpCallbacksProvider = /** @this */ function() {
  this.$get = ['$window', function($window) {
    var callbacks = $window.angular.callbacks;
    var callbackMap = {};

    function createCallback(callbackId) {
      var callback = function(data) {
        callback.data = data;
        callback.called = true;
      };
      callback.id = callbackId;
      return callback;
    }

    return {
      /**
       * @ngdoc method
       * @name $jsonpCallbacks#createCallback
       * @param {string} url the url of the JSONP request
       * @returns {string} the callback path to send to the server as part of the JSONP request
       * @description
       * {@link $httpBackend} calls this method to create a callback and get hold of the path to the callback
       * to pass to the server, which will be used to call the callback with its payload in the JSONP response.
       */
      createCallback: function(url) {
        var callbackId = '_' + (callbacks.$$counter++).toString(36);
        var callbackPath = 'angular.callbacks.' + callbackId;
        var callback = createCallback(callbackId);
        callbackMap[callbackPath] = callbacks[callbackId] = callback;
        return callbackPath;
      },
      /**
       * @ngdoc method
       * @name $jsonpCallbacks#wasCalled
       * @param {string} callbackPath the path to the callback that was sent in the JSONP request
       * @returns {boolean} whether the callback has been called, as a result of the JSONP response
       * @description
       * {@link $httpBackend} calls this method to find out whether the JSONP response actually called the
       * callback that was passed in the request.
       */
      wasCalled: function(callbackPath) {
        return callbackMap[callbackPath].called;
      },
      /**
       * @ngdoc method
       * @name $jsonpCallbacks#getResponse
       * @param {string} callbackPath the path to the callback that was sent in the JSONP request
       * @returns {*} the data received from the response via the registered callback
       * @description
       * {@link $httpBackend} calls this method to get hold of the data that was provided to the callback
       * in the JSONP response.
       */
      getResponse: function(callbackPath) {
        return callbackMap[callbackPath].data;
      },
      /**
       * @ngdoc method
       * @name $jsonpCallbacks#removeCallback
       * @param {string} callbackPath the path to the callback that was sent in the JSONP request
       * @description
       * {@link $httpBackend} calls this method to remove the callback after the JSONP request has
       * completed or timed-out.
       */
      removeCallback: function(callbackPath) {
        var callback = callbackMap[callbackPath];
        delete callbacks[callback.id];
        delete callbackMap[callbackPath];
      }
    };
  }];
};
