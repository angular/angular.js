Base64Test = TestCase('Base64Test');

Base64Test.prototype.testEncodeDecode = function(){
  assertEquals(Base64.decode(Base64.encode('hello')), 'hello');
};
