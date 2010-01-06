nglrTest = TestCase('nglrTest');

nglrTest.prototype.testShiftBind = function(){
  expectAsserts(3);
  nglr.shiftBind('this', function(target, arg) {
    assertEquals(this, 'this');
    assertEquals(target, 'target');
    assertEquals(arg, 'arg');
  }).apply('target', ['arg']);
};

nglrTest.prototype.testBind = function(){
  expectAsserts(2);
  nglr.bind('this', function(arg) {
    assertEquals(this, 'this');
    assertEquals(arg, 'arg');
  }).apply('XXX', ['arg']);
};




