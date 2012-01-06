var XHR = window.XMLHttpRequest || function() {
  try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e1) {}
  try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e2) {}
  try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e3) {}
  throw new Error("This browser does not support XMLHttpRequest.");
};


/**
 * @ngdoc object
 * @name angular.module.ng.$httpBackend
 * @requires $browser
 * @requires $window
 * @requires $document
 *
 * @description
 */
function $HttpBackendProvider() {
  this.$get = ['$browser', '$window', '$document', function($browser, $window, $document) {
    return createHttpBackend($browser, XHR, $browser.defer, $window.angular.callbacks,
        $document[0].body, $window.location.protocol.replace(':', ''));
  }];
}

function createHttpBackend($browser, XHR, $browserDefer, callbacks, body, locationProtocol) {
  // TODO(vojta): fix the signature
  return function(method, url, post, callback, headers, timeout) {
    $browser.$$incOutstandingRequestCount();

    if (lowercase(method) == 'jsonp') {
      var callbackId = '_' + (callbacks.counter++).toString(36);
      callbacks[callbackId] = function(data) {
        callbacks[callbackId].data = data;
      };

      var script = $browser.addJs(url.replace('JSON_CALLBACK', callbackId), null, function() {
        if (callbacks[callbackId].data) {
          completeRequest(callback, 200, callbacks[callbackId].data);
        } else {
          completeRequest(callback, -2);
        }
        delete callbacks[callbackId];
        body.removeChild(script);
      });
    } else {
      var xhr = new XHR();
      xhr.open(method, url, true);
      forEach(headers, function(value, key) {
          if (value) xhr.setRequestHeader(key, value);
      });

      var status;
      xhr.send(post || '');

      // IE6, IE7 bug - does sync when serving from cache
      if (xhr.readyState == 4) {
        $browserDefer(function() {
          completeRequest(callback, status || xhr.status, xhr.responseText);
        }, 0);
      } else {
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4) {
            completeRequest(callback, status || xhr.status, xhr.responseText);
          }
        };
      }

      if (timeout > 0) {
        $browserDefer(function() {
          status = -1;
          xhr.abort();
        }, timeout);
      }

      return xhr;
    }

    function completeRequest(callback, status, response) {
      // URL_MATCH is defined in src/service/location.js
      var protocol = (url.match(URL_MATCH) || ['', locationProtocol])[1];

      // fix status code for file protocol (it's always 0)
      status = protocol == 'file' ? (response ? 200 : 404) : status;

      // normalize IE bug (http://bugs.jquery.com/ticket/1450)
      status = status == 1223 ? 204 : status;

      callback(status, response);
      $browser.$$completeOutstandingRequest(noop);
    }
  };
}

