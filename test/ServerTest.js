ServerTest = TestCase("ServerTest");
ServerTest.prototype.testBreakLargeRequestIntoPackets = function() {
  var log = "";
  var server = new nglr.Server("http://server", function(url){
    log += "|" + url;
  });
  server.maxSize = 30;
  server.uuid = "uuid";
  server.request("POST", "/data/database", {}, function(code, r){
    assertEquals(200, code);
    assertEquals("response", r);
  });
  nglr.uuid0("response");
  assertEquals(
      "|http://server/$/uuid0/2/1?h=eyJtIjoiUE9TVCIsInAiOnt9LCJ1Ij" +
      "|http://server/$/uuid0/2/2?h=oiL2RhdGEvZGF0YWJhc2UifQ==",
      log);
};

ServerTest.prototype.testItShouldEncodeUsingUrlRules = function() {
  var server = new nglr.Server("http://server");
  assertEquals("fn5-fn5-", server.base64url("~~~~~~"));
  assertEquals("fn5_fn5_", server.base64url("~~\u007f~~\u007f"));
};

FrameServerTest = TestCase("FrameServerTest");

FrameServerTest.prototype = {
  testRead:function(){
    var window = {name:'$DATASET:"MyData"'};
    var server = new nglr.FrameServer(window);
    server.read();
    assertEquals("MyData", server.data);
  },
  testWrite:function(){
    var window = {};
    var server = new nglr.FrameServer(window);
    server.data = "TestData"
    server.write();
    assertEquals('$DATASET:"TestData"', window.name);
  }
};
