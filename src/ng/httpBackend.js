'use strict';

/**
 * @ngdoc service
 * @name $xhrFactory
 * @this
 *
 * @description
 * Factory function used to create XMLHttpRequest objects.
 *
 * Replace or decorate this service to create your own custom XMLHttpRequest objects.
 *
 * ```
 * angular.module('myApp', [])
 * .factory('$xhrFactory', function() {
 *   return function createXhr(method, url) {
 *     return new window.XMLHttpRequest({mozSystem: true});
 *   };
 * });
 * ```
 *
 * @param {string} method HTTP method of the request (GET, POST, PUT, ..)
 * @param {string} url URL of the request.
 */
function $xhrFactoryProvider() {
  this.$get = function() {
    return function createXhr() {
      return new window.XMLHttpRequest();
    };
  };
}

/**
 * @ngdoc service
 * @name $httpBackend
 * @requires $jsonpCallbacks
 * @requires $document
 * @requires $xhrFactory
 * @this
 *
 * @description
 * HTTP backend used by the {@link ng.$http service} that delegates to
 * XMLHttpRequest object or JSONP and deals with browser incompatibilities.
 *
 * You should never need to use this service directly, instead use the higher-level abstractions:
 * {@link ng.$http $http} or {@link ngResource.$resource $resource}.
 *
 * During testing this implementation is swapped with {@link ngMock.$httpBackend mock
 * $httpBackend} which can be trained with responses.
 */
function $HttpBackendProvider() {
  this.$get = ['$browser', '$jsonpCallbacks', '$document', '$xhrFactory', function($browser, $jsonpCallbacks, $document, $xhrFactory) {
    return createHttpBackend($browser, $xhrFactory, $browser.defer, $jsonpCallbacks, $document[0]);
  }];
}

function createHttpBackend($browser, createXhr, $browserDefer, callbacks, rawDocument) {
  // TODO(vojta): fix the signature
  return function(method, url, post, callback, headers, timeout, withCredentials, responseType, eventHandlers, uploadEventHandlers) {
    url = url || $browser.url();

    if (lowercase(method) === 'jsonp') {
      var callbackPath = callbacks.createCallback(url);
      var jsonpDone = jsonpReq(url, callbackPath, function(status, text) {
        // jsonpReq only ever sets status to 200 (OK), 404 (ERROR) or -1 (WAITING)
        var response = (status === 200) && callbacks.getResponse(callbackPath);
        completeRequest(callback, status, response, '', text, 'complete');
        callbacks.removeCallback(callbackPath);
      });
    } else {

      var xhr = createXhr(method, url);

      xhr.open(method, url, true);
      forEach(headers, function(value, key) {
        if (isDefined(value)) {
            xhr.setRequestHeader(key, value);
        }
      });

      xhr.onload = function requestLoaded() {
        var statusText = xhr.statusText || '';

        // responseText is the old-school way of retrieving response (supported by IE9)
        // response/responseType properties were introduced in XHR Level2 spec (supported by IE10)
        var response = ('response' in xhr) ? xhr.response : xhr.responseText;

        // normalize IE9 bug (http://bugs.jquery.com/ticket/1450)
        var status = xhr.status === 1223 ? 204 : xhr.status;

        // fix status code when it is 0 (0 status is undocumented).
        // Occurs when accessing file resources or on Android 4.1 stock browser
        // while retrieving files from application cache.
        if (status === 0) {
          status = response ? 200 : urlResolve(url).protocol === 'file' ? 404 : 0;
        }

        completeRequest(callback,
            status,
            response,
            xhr.getAllResponseHeaders(),
            statusText,
            'complete');
      };

      var requestError = function() {
        // The response is always empty
        // See https://xhr.spec.whatwg.org/#request-error-steps and https://fetch.spec.whatwg.org/#concept-network-error
        completeRequest(callback, -1, null, null, '', 'error');
      };

      var requestAborted = function() {
        completeRequest(callback, -1, null, null, '', 'abort');
      };

      var requestTimeout = function() {
        // The response is always empty
        // See https://xhr.spec.whatwg.org/#request-error-steps and https://fetch.spec.whatwg.org/#concept-network-error
        completeRequest(callback, -1, null, null, '', 'timeout');
      };

      xhr.onerror = requestError;
      xhr.onabort = requestAborted;
      xhr.ontimeout = requestTimeout;

      forEach(eventHandlers, function(value, key) {
          xhr.addEventListener(key, value);
      });

      forEach(uploadEventHandlers, function(value, key) {
        xhr.upload.addEventListener(key, value);
      });

      if (withCredentials) {
        xhr.withCredentials = true;
      }

      if (responseType) {
        try {
          xhr.responseType = responseType;
        } catch (e) {
          // WebKit added support for the json responseType value on 09/03/2013
          // https://bugs.webkit.org/show_bug.cgi?id=73648. Versions of Safari prior to 7 are
          // known to throw when setting the value "json" as the response type. Other older
          // browsers implementing the responseType
          //
          // The json response type can be ignored if not supported, because JSON payloads are
          // parsed on the client-side regardless.
          if (responseType !== 'json') {
            throw e;
          }
        }
      }

      xhr.send(isUndefined(post) ? null : post);
    }

    if (timeout > 0) {
      var timeoutId = $browserDefer(timeoutRequest, timeout);
    } else if (isPromiseLike(timeout)) {
      timeout.then(timeoutRequest);
    }


    function timeoutRequest() {
      if (jsonpDone) {
        jsonpDone();
      }
      if (xhr) {
        xhr.abort();
      }
    }

    function completeRequest(callback, status, response, headersString, statusText, xhrStatus) {
      // cancel timeout and subsequent timeout promise resolution
      if (isDefined(timeoutId)) {
        $browserDefer.cancel(timeoutId);
      }
      jsonpDone = xhr = null;

      callback(status, response, headersString, statusText, xhrStatus);
    }
  };

  function jsonpReq(url, callbackPath, done) {
    url = url.replace('JSON_CALLBACK', callbackPath);
    // we can't use jQuery/jqLite here because jQuery does crazy stuff with script elements, e.g.:
    // - fetches local scripts via XHR and evals them
    // - adds and immediately removes script elements from the document
    var script = rawDocument.createElement('script'), callback = null;
    script.type = 'text/javascript';
    script.src = url;
    script.async = true;

    callback = function(event) {
      script.removeEventListener('load', callback);
      script.removeEventListener('error', callback);
      rawDocument.body.removeChild(script);
      script = null;
      var status = -1;
      var text = 'unknown';

      if (event) {
        if (event.type === 'load' && !callbacks.wasCalled(callbackPath)) {
          event = { type: 'error' };
        }
        text = event.type;
        status = event.type === 'error' ? 404 : 200;
      }

      if (done) {
        done(status, text);
      }
    };

    script.addEventListener('load', callback);
    script.addEventListener('error', callback);
    rawDocument.body.appendChild(script);
    return callback;
  }
}
