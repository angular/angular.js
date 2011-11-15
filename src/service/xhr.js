'use strict';

/**
 * @ngdoc object
 * @name angular.module.ng.$xhr
 * @function
 * @requires $browser $xhr delegates all XHR requests to the `$browser.xhr()`. A mock version
 *                    of the $browser exists which allows setting expectations on XHR requests
 *                    in your tests
 * @requires $xhr.error $xhr delegates all non `2xx` response code to this service.
 * @requires $log $xhr delegates all exceptions to `$log.error()`.
 *
 * @description
 * Generates an XHR request. The $xhr service delegates all requests to
 * {@link angular.module.ng.$browser $browser.xhr()} and adds error handling and security features.
 * While $xhr service provides nicer api than raw XmlHttpRequest, it is still considered a lower
 * level api in angular. For a higher level abstraction that utilizes `$xhr`, please check out the
 * {@link angular.module.ng.$resource $resource} service.
 *
 * # Error handling
 * If no `error callback` is specified, XHR response with response code other then `2xx` will be
 * delegated to {@link angular.module.ng.$xhr.error $xhr.error}. The `$xhr.error` can intercept the
 * request and process it in application specific way, or resume normal execution by calling the
 * request `success` method.
 *
 * # HTTP Headers
 * The $xhr service will automatically add certain http headers to all requests. These defaults can
 * be fully configured by accessing the `$xhr.defaults.headers` configuration object, which
 * currently contains this default configuration:
 *
 * - `$xhr.defaults.headers.common` (headers that are common for all requests):
 *   - `Accept: application/json, text/plain, *\/*`
 *   - `X-Requested-With: XMLHttpRequest`
 * - `$xhr.defaults.headers.post` (header defaults for HTTP POST requests):
 *   - `Content-Type: application/x-www-form-urlencoded`
 *
 * To add or overwrite these defaults, simple add or remove a property from this configuration
 * object. To add headers for an HTTP method other than POST, simple create a new object with name
 * equal to the lowercased http method name, e.g. `$xhr.defaults.headers.get['My-Header']='value'`.
 *
 *
 * # Security Considerations
 * When designing web applications your design needs to consider security threats from
 * {@link http://haacked.com/archive/2008/11/20/anatomy-of-a-subtle-json-vulnerability.aspx
 * JSON Vulnerability} and {@link http://en.wikipedia.org/wiki/Cross-site_request_forgery XSRF}.
 * Both server and the client must cooperate in order to eliminate these threats. Angular comes
 * pre-configured with strategies that address these issues, but for this to work backend server
 * cooperation is required.
 *
 * ## JSON Vulnerability Protection
 * A {@link http://haacked.com/archive/2008/11/20/anatomy-of-a-subtle-json-vulnerability.aspx
 * JSON Vulnerability} allows third party web-site to turn your JSON resource URL into
 * {@link http://en.wikipedia.org/wiki/JSON#JSONP JSONP} request under some conditions. To
 * counter this your server can prefix all JSON requests with following string `")]}',\n"`.
 * Angular will automatically strip the prefix before processing it as JSON.
 *
 * For example if your server needs to return:
 * <pre>
 * ['one','two']
 * </pre>
 *
 * which is vulnerable to attack, your server can return:
 * <pre>
 * )]}',
 * ['one','two']
 * </pre>
 *
 * angular will strip the prefix, before processing the JSON.
 *
 *
 * ## Cross Site Request Forgery (XSRF) Protection
 * {@link http://en.wikipedia.org/wiki/Cross-site_request_forgery XSRF} is a technique by which an
 * unauthorized site can gain your user's private data. Angular provides following mechanism to
 * counter XSRF. When performing XHR requests, the $xhr service reads a token from a cookie
 * called `XSRF-TOKEN` and sets it as the HTTP header `X-XSRF-TOKEN`. Since only JavaScript that
 * runs on your domain could read the cookie, your server can be assured that the XHR came from
 * JavaScript running on your domain.
 *
 * To take advantage of this, your server needs to set a token in a JavaScript readable session
 * cookie called `XSRF-TOKEN` on first HTTP GET request. On subsequent non-GET requests the server
 * can verify that the cookie matches `X-XSRF-TOKEN` HTTP header, and therefore be sure that only
 * JavaScript running on your domain could have read the token. The token must be unique for each
 * user and must be verifiable by the server (to prevent the JavaScript making up its own tokens).
 * We recommend that the token is a digest of your site's authentication cookie with
 * {@link http://en.wikipedia.org/wiki/Rainbow_table salt for added security}.
 *
 * @param {string} method HTTP method to use. Valid values are: `GET`, `POST`, `PUT`, `DELETE`, and
 *   `JSON`. `JSON` is a special case which causes a
 *   [JSONP](http://en.wikipedia.org/wiki/JSON#JSONP) cross domain request using script tag
 *   insertion.
 * @param {string} url Relative or absolute URL specifying the destination of the request.  For
 *   `JSON` requests, `url` should include `JSON_CALLBACK` string to be replaced with a name of an
 *   angular generated callback function.
 * @param {(string|Object)=} post Request content as either a string or an object to be stringified
 *   as JSON before sent to the server.
 * @param {function(number, (string|Object))} success A function to be called when the response is
 *   received. The success function will be called with:
 *
 *   - {number} code [HTTP status code](http://en.wikipedia.org/wiki/List_of_HTTP_status_codes) of
 *     the response. This will currently always be 200, since all non-200 responses are routed to
 *     {@link angular.module.ng.$xhr.error} service (or custom error callback).
 *   - {string|Object} response Response object as string or an Object if the response was in JSON
 *     format.
 * @param {function(number, (string|Object))} error A function to be called if the response code is
 *   not 2xx.. Accepts the same arguments as success, above.
 *
 * @example
   <doc:example>
     <doc:source jsfiddle="false">
       <script>
         function FetchCntl($xhr) {
           var self = this;
           this.url = 'index.html';

           this.fetch = function() {
             self.code = null;
             self.response = null;

             $xhr(self.method, self.url, function(code, response) {
               self.code = code;
               self.response = response;
             }, function(code, response) {
               self.code = code;
               self.response = response || "Request failed";
             });
           };

           this.updateModel = function(method, url) {
             self.method = method;
             self.url = url;
           };
         }
         FetchCntl.$inject = ['$xhr'];
       </script>
       <div ng:controller="FetchCntl">
         <select ng:model="method">
           <option>GET</option>
           <option>JSON</option>
         </select>
         <input type="text" ng:model="url" size="80"/>
         <button ng:click="fetch()">fetch</button><br>
         <button ng:click="updateModel('GET', 'index.html')">Sample GET</button>
         <button ng:click="updateModel('JSON', 'http://angularjs.org/greet.php?callback=JSON_CALLBACK&name=Super%20Hero')">Sample JSONP</button>
         <button ng:click="updateModel('JSON', 'http://angularjs.org/doesntexist&callback=JSON_CALLBACK')">Invalid JSONP</button>
         <pre>code={{code}}</pre>
         <pre>response={{response}}</pre>
       </div>
     </doc:source>
     <doc:scenario>
       it('should make xhr GET request', function() {
         element(':button:contains("Sample GET")').click();
         element(':button:contains("fetch")').click();
         expect(binding('code')).toBe('code=200');
         expect(binding('response')).toMatch(/angularjs.org/);
       });

       it('should make JSONP request to the angularjs.org', function() {
         element(':button:contains("Sample JSONP")').click();
         element(':button:contains("fetch")').click();
         expect(binding('code')).toBe('code=200');
         expect(binding('response')).toMatch(/Super Hero!/);
       });

       it('should make JSONP request to invalid URL and invoke the error handler',
           function() {
         element(':button:contains("Invalid JSONP")').click();
         element(':button:contains("fetch")').click();
         expect(binding('code')).toBe('code=');
         expect(binding('response')).toBe('response=Request failed');
       });
     </doc:scenario>
   </doc:example>
 */
function $XhrProvider() {
  this.$get = ['$rootScope', '$browser', '$xhr.error', '$log',
      function( $rootScope,   $browser,   $error,       $log){
    var xhrHeaderDefaults = {
      common: {
        "Accept": "application/json, text/plain, */*",
        "X-Requested-With": "XMLHttpRequest"
      },
      post: {'Content-Type': 'application/x-www-form-urlencoded'},
      get: {},      // all these empty properties are needed so that client apps can just do:
      head: {},     // $xhr.defaults.headers.head.foo="bar" without having to create head object
      put: {},      // it also means that if we add a header for these methods in the future, it
      'delete': {}, // won't be easily silently lost due to an object assignment.
      patch: {}
    };

    function xhr(method, url, post, success, error) {
      if (isFunction(post)) {
        error = success;
        success = post;
        post = null;
      }
      if (post && isObject(post)) {
        post = toJson(post);
      }

      $browser.xhr(method, url, post, function(code, response){
        try {
          if (isString(response)) {
            if (response.match(/^\)\]\}',\n/)) response=response.substr(6);
            if (/^\s*[\[\{]/.exec(response) && /[\}\]]\s*$/.exec(response)) {
              response = fromJson(response, true);
            }
          }
          $rootScope.$apply(function() {
            if (200 <= code && code < 300) {
                success(code, response);
            } else if (isFunction(error)) {
              error(code, response);
            } else {
              $error(
                {method: method, url: url, data: post, success: success},
                {status: code, body: response});
            }
          });
        } catch (e) {
          $log.error(e);
        }
      }, extend({'X-XSRF-TOKEN': $browser.cookies()['XSRF-TOKEN']},
                xhrHeaderDefaults.common,
                xhrHeaderDefaults[lowercase(method)]));
    }

    xhr.defaults = {headers: xhrHeaderDefaults};

    return xhr;
  }];
}
