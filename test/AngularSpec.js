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

  it("should copy Date", function(){
    var date = new Date(123);
    expect(copy(date) instanceof Date).toBeTruthy();
    expect(copy(date).getTime()).toEqual(123);
    expect(copy(date) === date).toBeFalsy();
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
    expect(copy('')).toBe('');
    expect(copy('lala')).toBe('lala');
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

  it('should ignore functions', function(){
    expect(equals({func: function() {}}, {bar: function() {}})).toEqual(true);
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
});

describe('toKeyValue', function() {
  it('should parse key-value pairs into string', function() {
    expect(toKeyValue({})).toEqual('');
    expect(toKeyValue({simple: 'pair'})).toEqual('simple=pair');
    expect(toKeyValue({first: '1', second: '2'})).toEqual('first=1&second=2');
    expect(toKeyValue({'escaped key': 'escaped value'})).
      toEqual('escaped%20key=escaped%20value');
    expect(toKeyValue({emptyKey: ''})).toEqual('emptyKey=');
  });
  
  it('should parse true values into flags', function() {
    expect(toKeyValue({flag1: true, key: 'value', flag2: true})).toEqual('flag1&key=value&flag2');
  });
});


describe ('rngScript', function() {
  it('should match angular.js', function() {
    expect('angular.js'.match(rngScript)).not.toBeNull();
    expect('../angular.js'.match(rngScript)).not.toBeNull();
    expect('foo/angular.js'.match(rngScript)).not.toBeNull();

    expect('foo.js'.match(rngScript)).toBeNull();
    expect('foo/foo.js'.match(rngScript)).toBeNull();
    expect('my-angular-app.js'.match(rngScript)).toBeNull();
    expect('foo/../my-angular-app.js'.match(rngScript)).toBeNull();
  });

  it('should match angular.min.js', function() {
    expect('angular.min.js'.match(rngScript)).not.toBeNull();
    expect('../angular.min.js'.match(rngScript)).not.toBeNull();
    expect('foo/angular.min.js'.match(rngScript)).not.toBeNull();

    expect('my-angular-app.min.js'.match(rngScript)).toBeNull();
    expect('foo/../my-angular-app.min.js'.match(rngScript)).toBeNull();
  });

  it('should match angular-bootstrap.js', function() {
    expect('angular-bootstrap.js'.match(rngScript)).not.toBeNull();
    expect('../angular-bootstrap.js'.match(rngScript)).not.toBeNull();
    expect('foo/angular-bootstrap.js'.match(rngScript)).not.toBeNull();

    expect('my-angular-app-bootstrap.js'.match(rngScript)).toBeNull();
    expect('foo/../my-angular-app-bootstrap.js'.match(rngScript)).toBeNull();
  });

  it('should match angular-0.9.0.js', function() {
    expect('angular-0.9.0.js'.match(rngScript)).not.toBeNull();
    expect('../angular-0.9.0.js'.match(rngScript)).not.toBeNull();
    expect('foo/angular-0.9.0.js'.match(rngScript)).not.toBeNull();

    expect('my-angular-app-0.9.0.js'.match(rngScript)).toBeNull();
    expect('foo/../my-angular-app-0.9.0.js'.match(rngScript)).toBeNull();
  });

  it('should match angular-0.9.0.min.js', function() {
    expect('angular-0.9.0.min.js'.match(rngScript)).not.toBeNull();
    expect('../angular-0.9.0.min.js'.match(rngScript)).not.toBeNull();
    expect('foo/angular-0.9.0.min.js'.match(rngScript)).not.toBeNull();

    expect('my-angular-app-0.9.0.min.js'.match(rngScript)).toBeNull();
    expect('foo/../my-angular-app-0.9.0.min.js'.match(rngScript)).toBeNull();
  });

  it('should match angular-0.9.0-de0a8612.js', function() {
    expect('angular-0.9.0-de0a8612.js'.match(rngScript)).not.toBeNull();
    expect('../angular-0.9.0-de0a8612.js'.match(rngScript)).not.toBeNull();
    expect('foo/angular-0.9.0-de0a8612.js'.match(rngScript)).not.toBeNull();

    expect('my-angular-app-0.9.0-de0a8612.js'.match(rngScript)).toBeNull();
    expect('foo/../my-angular-app-0.9.0-de0a8612.js'.match(rngScript)).toBeNull();
  });

  it('should match angular-0.9.0-de0a8612.min.js', function() {
    expect('angular-0.9.0-de0a8612.min.js'.match(rngScript)).not.toBeNull();
    expect('../angular-0.9.0-de0a8612.min.js'.match(rngScript)).not.toBeNull();
    expect('foo/angular-0.9.0-de0a8612.min.js'.match(rngScript)).not.toBeNull();

    expect('my-angular-app-0.9.0-de0a8612.min.js'.match(rngScript)).toBeNull();
    expect('foo/../my-angular-app-0.9.0-de0a8612.min.js'.match(rngScript)).toBeNull();
  });
});


describe('angularJsConfig', function() {
  it('should find angular.js script tag and config', function() {
    var doc = { getElementsByTagName: function(tagName) {
                  expect(tagName).toEqual('script');
                  return [{nodeName: 'SCRIPT', src: 'random.js'},
                          {nodeName: 'SCRIPT', src: 'angular.js'},
                          {nodeName: 'SCRIPT', src: 'my-angular-app.js'}];
                }
              };

    expect(angularJsConfig(doc)).toEqual({base_url: '',
                                          ie_compat: 'angular-ie-compat.js',
                                          ie_compat_id: 'ng-ie-compat'});
  });


  it('should extract angular config from the ng: attributes', function() {
    var doc = { getElementsByTagName: function(tagName) {
                  expect(lowercase(tagName)).toEqual('script');
                  return [{nodeName: 'SCRIPT',
                           src: 'angularjs/angular.js',
                           attributes: [{name: 'ng:autobind', value:undefined},
                                        {name: 'ng:css', value: 'css/my_custom_angular.css'},
                                        {name: 'ng:ie-compat', value: 'myjs/angular-ie-compat.js'},
                                        {name: 'ng:ie-compat-id', value: 'ngcompat'}] }];
               }};

    expect(angularJsConfig(doc)).toEqual({base_url: 'angularjs/',
                                          autobind: true,
                                          css: 'css/my_custom_angular.css',
                                          ie_compat: 'myjs/angular-ie-compat.js',
                                          ie_compat_id: 'ngcompat'});
  });
});
