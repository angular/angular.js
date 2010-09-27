/**
 * The MIT License
 *
 * Copyright (c) 2010 Adam Abrons and Misko Hevery http://getangular.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

function MockBrowser() {
  var self = this,
      expectations = {},
      requests = [];

  this.isMock = true;
  self.url = "http://server";
  self.pollFns = [];

  self.xhr = function(method, url, data, callback) {
    if (angular.isFunction(data)) {
      callback = data;
      data = null;
    }
    if (data && angular.isObject(data)) data = angular.toJson(data);
    if (data && angular.isString(data)) url += "|" + data;
    var expect = expectations[method] || {};
    var response = expect[url];
    if (!response) {
      throw "Unexepected request for method '" + method + "' and url '" + url + "'.";
    }
    requests.push(function(){
      callback(response.code, response.response);
    });
  };
  self.xhr.expectations = expectations;
  self.xhr.requests = requests;
  self.xhr.expect = function(method, url, data) {
    if (data && angular.isObject(data)) data = angular.toJson(data);
    if (data && angular.isString(data)) url += "|" + data;
    var expect = expectations[method] || (expectations[method] = {});
    return {
      respond: function(code, response) {
        if (!angular.isNumber(code)) {
          response = code;
          code = 200;
        }
        expect[url] = {code:code, response:response};
      }
    };
  };
  self.xhr.expectGET    = angular.bind(self, self.xhr.expect, 'GET');
  self.xhr.expectPOST   = angular.bind(self, self.xhr.expect, 'POST');
  self.xhr.expectDELETE = angular.bind(self, self.xhr.expect, 'DELETE');
  self.xhr.expectPUT    = angular.bind(self, self.xhr.expect, 'PUT');
  self.xhr.expectJSON   = angular.bind(self, self.xhr.expect, 'JSON');
  self.xhr.flush = function() {
    while(requests.length) {
      requests.pop()();
    }
  };

  self.cookieHash = {};
  self.lastCookieHash = {};
}
MockBrowser.prototype = {

  poll: function poll(){
    foreach(this.pollFns, function(pollFn){ pollFn(); });
  },

  addPollFn: function(pollFn) {
    this.pollFns.push(pollFn);
    return pollFn;
  },

  hover: function(onHover) {
  },

  getUrl: function(){
    return this.url;
  },

  setUrl: function(url){
    this.url = url;
  },

  cookies:  function(name, value) {
    if (name) {
      if (value == undefined) {
        delete this.cookieHash[name];
      } else {
        if (isString(value) &&       //strings only
            value.length <= 4096) {  //strict cookie storage limits
          this.cookieHash[name] = value;
        }
      }
    } else {
      if (!equals(this.cookieHash, this.lastCookieHash)) {
        this.lastCookieHash = copy(this.cookieHash);
        this.cookieHash = copy(this.cookieHash);
      }
      return this.cookieHash;
    }
  }

};

angular.service('$browser', function(){
  return new MockBrowser();
});
