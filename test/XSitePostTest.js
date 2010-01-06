XSitePost = TestCase("XSitePost");

var e = function(text){ return Base64.encode(text); };

XSitePost.prototype.testMessageReceived = function () {
  expectAsserts(4);
  var xPost = new nglr.XSitePost();
  xPost.baseUrl = "http://getangular.test";
  xPost.post = function(url, request, callback){
    assertEquals('http://getangular.test/url', url);
    assertEquals('abc', request.a);
    assertEquals('xyz', request.x);
  };
  xPost.incomingFragment('#id;0;1;'+e('/url')+':a:'+e('abc')+':x:'+e('xyz'));
  assertEquals('{}', nglr.toJson(xPost.inQueue));
};

XSitePost.prototype.testMessageReceivedInParts = function () {
  expectAsserts(5);
  var xPost = new nglr.XSitePost();
  xPost.baseUrl = "http://getangular.test";
  xPost.post = function(url, request, callback){
    assertEquals('http://getangular.test/url', url);
    assertEquals('abc', request.a);
    assertEquals('xyz', request.x);
  };
  xPost.incomingFragment('#id;1;2;:x:'+e('xyz'));
  assertNotSame('{}', nglr.toJson(xPost.inQueue));
  xPost.incomingFragment('#id;0;2;'+e('/url')+':a:'+e('abc'));
  assertEquals('{}', nglr.toJson(xPost.inQueue));
};

XSitePost.prototype.testPostResponsIsEnqueued = function () {
  var xPost = new nglr.XSitePost();
  xPost.maxMsgSize = 11;
  xPost.response("id", "response", "status");

  assertEquals('["id:0:2:cmVzcG9uc2U","id:1:2:="]',
      nglr.toJson(xPost.outQueue));
};

XSitePost.prototype.testPush = function () {
  var window = {};
  var xPost = new nglr.XSitePost(window);
  xPost.response("id", "response", "status");
  assertEquals('id:0:1:cmVzcG9uc2U=', xPost.outQueue[0]);
};
