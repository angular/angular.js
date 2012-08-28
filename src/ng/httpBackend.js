var XHR = window.XMLHttpRequest || function() {
  try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e1) {}
  try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e2) {}
  try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e3) {}
  throw new Error("This browser does not support XMLHttpRequest.");
}, XDR = !window.msPerformance && window.XDomainRequest || null;


/**
 * @ngdoc object
 * @name ng.$httpBackend
 * @requires $browser
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
    return createHttpBackend($browser, XHR, XDR, $browser.defer, $window.angular.callbacks,
        $document[0], $window.location.protocol.replace(':', ''));
  }];
}

function createHttpBackend($browser, XHR, XDR, $browserDefer, callbacks, rawDocument, locationProtocol) {
  // TODO(vojta): fix the signature
  return function(method, url, post, callback, headers, timeout, withCredentials, useXDomain) {
    $browser.$$incOutstandingRequestCount();
    url = url || $browser.url();

    if (lowercase(method) == 'jsonp') {
      var callbackId = '_' + (callbacks.counter++).toString(36);
      callbacks[callbackId] = function(data) {
        callbacks[callbackId].data = data;
      };

      jsonpReq(url.replace('JSON_CALLBACK', 'angular.callbacks.' + callbackId),
          function() {
            if (callbacks[callbackId].data) {
              completeRequest(callback, 200, callbacks[callbackId].data);
            } else {
              completeRequest(callback, -2);
            }
            delete callbacks[callbackId];
          });
     } else {
      var status;
      if (useXDomain && XDR) {
        var xdr = new XDR();        
        xdr.open(method.toLowerCase(), url);

        // Required to XDomainRequest works
        xdr.timeout = timeout;
        xdr.onprogress = function() {};

        xdr.ontimeout = function() {
          completeRequest(callback, 408, 'Timeout', 'Content-Type: text/plain');
          xdr.abort();
        };

        xdr.onload = function() {
          completeRequest(callback, 200, xdr.responseText, 'Content-Type: ' + xdr.contentType);          
        };

        xdr.onerror = function() {
          completeRequest(callback, 500, 'Error', 'Content-Type: text/plain');
          xdr.abort();
        };

        
        $browserDefer(function () {
          xdr.send();
        }, 0); //fix IE bug that raises '$apply already in progress' on cached requests

        if (timeout > 0) {
          $browserDefer(function() {
            status = -1;
            xdr.abort();
          }, timeout);
        }

      } else {
        var xhr = new XHR();
        xhr.open(method, url, true);

        forEach(headers, function(value, key) {
          if (value) xhr.setRequestHeader(key, value);
        });       

        // In IE6 and 7, this might be called synchronously when xhr.send below is called and the
        // response is in the cache. the promise api will ensure that to the app code the api is
        // always async
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4) {
            completeRequest(
                callback, status || xhr.status, xhr.responseText, xhr.getAllResponseHeaders());
          }
        };        

        if (withCredentials) {
          xhr.withCredentials = true;
        }

        xhr.send(post || '');

        if (timeout > 0) {
          $browserDefer(function() {
            status = -1;
            xhr.abort();
          }, timeout);
        }

      }
    }


    function completeRequest(callback, status, response, headersString) {
      // URL_MATCH is defined in src/service/location.js
      var protocol = (url.match(URL_MATCH) || ['', locationProtocol])[1];

      // fix status code for file protocol (it's always 0)
      status = (protocol == 'file') ? (response ? 200 : 404) : status;

      // normalize IE bug (http://bugs.jquery.com/ticket/1450)
      status = status == 1223 ? 204 : status;      

      callback(status, response, headersString);
      $browser.$$completeOutstandingRequest(noop);
    }
  };

  function jsonpReq(url, done) {
    // we can't use jQuery/jqLite here because jQuery does crazy shit with script elements, e.g.:
    // - fetches local scripts via XHR and evals them
    // - adds and immediately removes script elements from the document
    var script = rawDocument.createElement('script'),
        doneWrapper = function() {
          rawDocument.body.removeChild(script);
          if (done) done();
        };

    script.type = 'text/javascript';
    script.src = url;

    if (msie) {
      script.onreadystatechange = function() {
        if (/loaded|complete/.test(script.readyState)) doneWrapper();
      };
    } else {
      script.onload = script.onerror = doneWrapper;
    }

    rawDocument.body.appendChild(script);
  }
}
