/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$xhr
 * @function
 * @requires $browser
 * @requires $xhr.error
 * @requires $log
 *
 * @description
 * Generates an XHR request. The $xhr service adds error handling then delegates all requests to
 * {@link angular.service.$browser $browser.xhr()}.
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
 * @param {function(number, (string|Object))} callback A function to be called when the response is
 *   received. The callback will be called with:
 *
 *   - {number} code [HTTP status code](http://en.wikipedia.org/wiki/List_of_HTTP_status_codes) of
 *     the response. This will currently always be 200, since all non-200 responses are routed to
 *     {@link angular.service.$xhr.error} service.
 *   - {string|Object} response Response object as string or an Object if the response was in JSON
 *     format.
 *
 * @example
   <doc:example>
     <doc:source>
       <script>
         function FetchCntl($xhr) {
           var self = this;

           this.fetch = function() {
             self.clear();
             $xhr(self.method, self.url, function(code, response) {
               self.code = code;
               self.response = response;
             });
           };

           this.clear = function() {
             self.code = null;
             self.response = null;
           };
         }
         FetchCntl.$inject = ['$xhr'];
       </script>
       <div ng:controller="FetchCntl">
         <select name="method">
           <option>GET</option>
           <option>JSON</option>
         </select>
         <input type="text" name="url" value="index.html" size="80"/><br/>
         <button ng:click="fetch()">fetch</button>
         <button ng:click="clear()">clear</button>
         <a href="" ng:click="method='GET'; url='index.html'">sample</a>
         <a href="" ng:click="method='JSON'; url='https://www.googleapis.com/buzz/v1/activities/googlebuzz/@self?alt=json&callback=JSON_CALLBACK'">buzz</a>
         <pre>code={{code}}</pre>
         <pre>response={{response}}</pre>
       </div>
     </doc:source>
   </doc:example>
 */
angularServiceInject('$xhr', function($browser, $error, $log){
  var self = this;
  return function(method, url, post, callback){
    if (isFunction(post)) {
      callback = post;
      post = _null;
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
        if (code == 200) {
          callback(code, response);
        } else {
          $error(
            {method: method, url:url, data:post, callback:callback},
            {status: code, body:response});
        }
      } catch (e) {
        $log.error(e);
      } finally {
        self.$eval();
      }
    });
  };
}, ['$browser', '$xhr.error', '$log']);
