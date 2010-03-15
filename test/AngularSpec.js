describe('Angular', function(){
  it('should fire on updateEvents', function(){
    var onUpdateView = jasmine.createSpy();
    var scope = angular.compile("<div></div>", { onUpdateView: onUpdateView });
    expect(onUpdateView).wasNotCalled();
    scope.init();
    scope.updateView();
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
});
