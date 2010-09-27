beforeEach(function(){
  compileCache = {};
});

describe('Angular', function(){
  xit('should fire on updateEvents', function(){
    var onUpdateView = jasmine.createSpy();
    var scope = angular.compile("<div></div>", { onUpdateView: onUpdateView });
    expect(onUpdateView).wasNotCalled();
    scope.$init();
    scope.$eval();
    expect(onUpdateView).wasCalled();
  });
});

describe("copy", function(){
  it("should return same object", function (){
    var obj = {};
    var arr = [];
    assertSame(obj, copy({}, obj));
    assertSame(arr, copy([], arr));
  });

  it("should copy array", function(){
    var src = [1, {name:"value"}];
    var dst = [{key:"v"}];
    assertSame(dst, copy(src, dst));
    assertEquals([1, {name:"value"}], dst);
    assertEquals({name:"value"}, dst[1]);
    assertNotSame(src[1], dst[1]);
  });

  it('should copy empty array', function() {
    var src = [];
    var dst = [{key: "v"}];
    assertEquals([], copy(src, dst));
    assertEquals([], dst);
  });

  it("should copy object", function(){
    var src = {a:{name:"value"}};
    var dst = {b:{key:"v"}};
    assertSame(dst, copy(src, dst));
    assertEquals({a:{name:"value"}}, dst);
    assertEquals(src.a, dst.a);
    assertNotSame(src.a, dst.a);
  });

  it("should copy primitives", function(){
    expect(copy(null)).toEqual(null);
    expect(copy('')).toEqual('');
    expect(copy(123)).toEqual(123);
    expect(copy([{key:null}])).toEqual([{key:null}]);
  });

});

describe('equals', function(){
  it('should return true if same object', function(){
    var o = {};
    expect(equals(o, o)).toEqual(true);
    expect(equals(1, '1')).toEqual(true);
    expect(equals(1, '2')).toEqual(false);
  });

  it('should recurse into object', function(){
    expect(equals({}, {})).toEqual(true);
    expect(equals({name:'misko'}, {name:'misko'})).toEqual(true);
    expect(equals({name:'misko', age:1}, {name:'misko'})).toEqual(false);
    expect(equals({name:'misko'}, {name:'misko', age:1})).toEqual(false);
    expect(equals({name:'misko'}, {name:'adam'})).toEqual(false);
    expect(equals(['misko'], ['misko'])).toEqual(true);
    expect(equals(['misko'], ['adam'])).toEqual(false);
    expect(equals(['misko'], ['misko', 'adam'])).toEqual(false);
  });

  it('should ignore $ member variables', function(){
    expect(equals({name:'misko', $id:1}, {name:'misko', $id:2})).toEqual(true);
    expect(equals({name:'misko'}, {name:'misko', $id:2})).toEqual(true);
    expect(equals({name:'misko', $id:1}, {name:'misko'})).toEqual(true);
  });
});

describe('parseKeyValue', function() {
  it('should parse a string into key-value pairs', function() {
    expect(parseKeyValue('')).toEqual({});
    expect(parseKeyValue('simple=pair')).toEqual({simple: 'pair'});
    expect(parseKeyValue('first=1&second=2')).toEqual({first: '1', second: '2'});
    expect(parseKeyValue('escaped%20key=escaped%20value')).
      toEqual({'escaped key': 'escaped value'});
    expect(parseKeyValue('emptyKey=')).toEqual({emptyKey: ''});
    expect(parseKeyValue('flag1&key=value&flag2')).
      toEqual({flag1: true, key: 'value', flag2: true});
  });
})
