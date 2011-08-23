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
    return createHttpBackend($browser, XHR, $browser.defer, $window, $document[0].body);
  }];
}

function createHttpBackend($browser, XHR, $browserDefer, $window, body) {
  var idCounter = 0;

  function completeRequest(callback, status, response) {
    // normalize IE bug (http://bugs.jquery.com/ticket/1450)
    callback(status == 1223 ? 204 : status, response);
    $browser.$$completeOutstandingRequest(noop);
  }

  // TODO(vojta): fix the signature
  return function(method, url, post, callback, headers, timeout) {
    $browser.$$incOutstandingRequestCount();

    if (lowercase(method) == 'jsonp') {
      var callbackId = ('angular_' + Math.random() + '_' + (idCounter++)).replace(/\d\./, '');
      $window[callbackId] = function(data) {
        $window[callbackId].data = data;
      };

      var script = $browser.addJs(url.replace('JSON_CALLBACK', callbackId), null, function() {
        if ($window[callbackId].data) {
          completeRequest(callback, 200, $window[callbackId].data);
        } else {
          completeRequest(callback, -2);
        }
        delete $window[callbackId];
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
  };
}

