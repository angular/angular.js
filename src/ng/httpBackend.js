'use strict';

function createXhr() {
    return new window.XMLHttpRequest();
}

/**
 * @ngdoc service
 * @name $httpBackend
 * @requires $window
 * @requires $document
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
  this.$get = ['$browser', '$window', '$document', function($browser, $window, $document) {
    return createHttpBackend($browser, createXhr, $browser.defer, $window.angular.callbacks, $document[0]);
  }];
}

function createHttpBackend($browser, createXhr, $browserDefer, callbacks, rawDocument) {
  // TODO(vojta): fix the signature
  return function(method, url, post, callback, headers, timeout, withCredentials, responseType) {
    $browser.$$incOutstandingRequestCount();
    url = url || $browser.url();

    if (lowercase(method) == 'jsonp') {
      var callbackId = '_' + (callbacks.counter++).toString(36);
      callbacks[callbackId] = function(data) {
        callbacks[callbackId].data = data;
        callbacks[callbackId].called = true;
      };

      var jsonpDone = jsonpReq(url.replace('JSON_CALLBACK', 'angular.callbacks.' + callbackId),
          callbackId, function(status, text) {
        completeRequest(callback, status, callbacks[callbackId].data, "", text);
        callbacks[callbackId] = noop;
      });
    } else {

      var xhr = createXhr();

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
          status = response ? 200 : urlResolve(url).protocol == 'file' ? 404 : 0;
        }

        completeRequest(callback,
            status,
            response,
            xhr.getAllResponseHeaders(),
            statusText);
      };

      var requestError = function() {
        // The response is always empty
        // See https://xhr.spec.whatwg.org/#request-error-steps and https://fetch.spec.whatwg.org/#concept-network-error
        completeRequest(callback, -1, null, null, '');
      };

      xhr.onerror = requestError;
      xhr.onabort = requestError;

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
      jsonpDone && jsonpDone();
      xhr && xhr.abort();
    }

    function completeRequest(callback, status, response, headersString, statusText) {
      // cancel timeout and subsequent timeout promise resolution
      if (isDefined(timeoutId)) {
        $browserDefer.cancel(timeoutId);
      }
      jsonpDone = xhr = null;

      callback(status, response, headersString, statusText);
      $browser.$$completeOutstandingRequest(noop);
    }
  };

  function jsonpReq(url, callbackId, done) {
    // we can't use jQuery/jqLite here because jQuery does crazy stuff with script elements, e.g.:
    // - fetches local scripts via XHR and evals them
    // - adds and immediately removes script elements from the document
    var script = rawDocument.createElement('script'), callback = null;
    script.type = "text/javascript";
    script.src = url;
    script.async = true;

    callback = function(event) {
      removeEventListenerFn(script, "load", callback);
      removeEventListenerFn(script, "error", callback);
      rawDocument.body.removeChild(script);
      script = null;
      var status = -1;
      var text = "unknown";

      if (event) {
        if (event.type === "load" && !callbacks[callbackId].called) {
          event = { type: "error" };
        }
        text = event.type;
        status = event.type === "error" ? 404 : 200;
      }

      if (done) {
        done(status, text);
      }
    };

    addEventListenerFn(script, "load", callback);
    addEventListenerFn(script, "error", callback);
    rawDocument.body.appendChild(script);
    return callback;
  }
}
