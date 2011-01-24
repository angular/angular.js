beforeEach(function(){
  compileCache = {};
});

describe('case', function(){
  it('should change case', function(){
    expect(lowercase('ABC90')).toEqual('abc90');
    expect(manualLowercase('ABC90')).toEqual('abc90');
    expect(uppercase('abc90')).toEqual('ABC90');
    expect(manualUppercase('abc90')).toEqual('ABC90');
  });
});

describe("copy", function(){
  it("should return same object", function (){
    var obj = {};
    var arr = [];
    expect(copy({}, obj)).toBe(obj);
    expect(copy([], arr)).toBe(arr);
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
    expect(copy(src, dst)).toBe(dst);
    expect(dst).toEqual([1, {name:"value"}]);
    expect(dst[1]).toEqual({name:"value"});
    expect(dst[1]).not.toBe(src[1]);
  });

  it('should copy empty array', function() {
    var src = [];
    var dst = [{key: "v"}];
    expect(copy(src, dst)).toEqual([]);
    expect(dst).toEqual([]);
  });

  it("should copy object", function(){
    var src = {a:{name:"value"}};
    var dst = {b:{key:"v"}};
    expect(copy(src, dst)).toBe(dst);
    expect(dst).toEqual({a:{name:"value"}});
    expect(dst.a).toEqual(src.a);
    expect(dst.a).not.toBe(src.a);
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

  it('should work well with nulls', function() {
    expect(equals(null, '123')).toBe(false);
    expect(equals('123', null)).toBe(false);

    var obj = {foo:'bar'};
    expect(equals(null, obj)).toBe(false);
    expect(equals(obj, null)).toBe(false);

    expect(equals(null, null)).toBe(true);
  });

  it('should work well with undefined', function() {
    expect(equals(undefined, '123')).toBe(false);
    expect(equals('123', undefined)).toBe(false);

    var obj = {foo:'bar'};
    expect(equals(undefined, obj)).toBe(false);
    expect(equals(obj, undefined)).toBe(false);

    expect(equals(undefined, undefined)).toBe(true);
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

  it('should match angular-scenario.js', function() {
    expect('angular-scenario.js'.match(rngScript)).not.toBeNull();
    expect('angular-scenario.min.js'.match(rngScript)).not.toBeNull();
    expect('../angular-scenario.js'.match(rngScript)).not.toBeNull();
    expect('foo/angular-scenario.min.js'.match(rngScript)).not.toBeNull();
  });

  it('should match angular-scenario-0.9.0(.min).js', function() {
    expect('angular-scenario-0.9.0.js'.match(rngScript)).not.toBeNull();
    expect('angular-scenario-0.9.0.min.js'.match(rngScript)).not.toBeNull();
    expect('../angular-scenario-0.9.0.js'.match(rngScript)).not.toBeNull();
    expect('foo/angular-scenario-0.9.0.min.js'.match(rngScript)).not.toBeNull();
  });

  it('should match angular-scenario-0.9.0-de0a8612(.min).js', function() {
    expect('angular-scenario-0.9.0-de0a8612.js'.match(rngScript)).not.toBeNull();
    expect('angular-scenario-0.9.0-de0a8612.min.js'.match(rngScript)).not.toBeNull();
    expect('../angular-scenario-0.9.0-de0a8612.js'.match(rngScript)).not.toBeNull();
    expect('foo/angular-scenario-0.9.0-de0a8612.min.js'.match(rngScript)).not.toBeNull();
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


  it('should extract angular autobind config from the script hashpath attributes', function() {
    var doc = { getElementsByTagName: function(tagName) {
                  expect(lowercase(tagName)).toEqual('script');
                  return [{nodeName: 'SCRIPT',
                           src: 'angularjs/angular.js#autobind'}];
               }};

    expect(angularJsConfig(doc)).toEqual({base_url: 'angularjs/',
                                          autobind: true,
                                          ie_compat: 'angularjs/angular-ie-compat.js',
                                          ie_compat_id: 'ng-ie-compat'});
  });


  it("should default to versioned ie-compat file if angular file is versioned", function() {
    var doc = { getElementsByTagName: function(tagName) {
                  expect(lowercase(tagName)).toEqual('script');
                  return [{nodeName: 'SCRIPT',
                           src: 'js/angular-0.9.0.js'}];
               }};

    expect(angularJsConfig(doc)).toEqual({base_url: 'js/',
                                          ie_compat: 'js/angular-ie-compat-0.9.0.js',
                                          ie_compat_id: 'ng-ie-compat'});
  });


  it("should default to versioned ie-compat file if angular file is versioned and minified", function() {
    var doc = { getElementsByTagName: function(tagName) {
                  expect(lowercase(tagName)).toEqual('script');
                  return [{nodeName: 'SCRIPT',
                           src: 'js/angular-0.9.0-cba23f00.min.js'}];
               }};

    expect(angularJsConfig(doc)).toEqual({base_url: 'js/',
                                          ie_compat: 'js/angular-ie-compat-0.9.0-cba23f00.js',
                                          ie_compat_id: 'ng-ie-compat'});
  });
});


describe('angular service', function() {
  it('should override services', function() {
    var scope = createScope();
    angular.service('fake', function() { return 'old'; });
    angular.service('fake', function() { return 'new'; });

    expect(scope.$service('fake')).toEqual('new');
  });

  it('should not preserve properties on override', function() {
    angular.service('fake', {$one: true}, {$two: true}, {three: true});
    var result = angular.service('fake', {$four: true});

    expect(result.$one).toBeUndefined();
    expect(result.$two).toBeUndefined();
    expect(result.three).toBeUndefined();
    expect(result.$four).toBe(true);
  });

  it('should not preserve non-angular properties on override', function() {
    angular.service('fake', {one: true}, {two: true});
    var result = angular.service('fake', {third: true});

    expect(result.one).not.toBeDefined();
    expect(result.two).not.toBeDefined();
    expect(result.third).toBeTruthy();
  });
});

describe('isDate', function() {
  it('should return true for Date object', function() {
    expect(isDate(new Date())).toBe(true);
  });

  it('should return false for non Date objects', function() {
    expect(isDate([])).toBe(false);
    expect(isDate('')).toBe(false);
    expect(isDate(23)).toBe(false);
    expect(isDate({})).toBe(false);
  });
});
