'use strict';

describe('resource', function() {
  var noop = angular.noop;
  var extend = angular.extend;

describe('basic usage', function() {
  var $resource, CreditCard, callback, $httpBackend, resourceProvider, $q;

  beforeEach(module('ngResource'));

  beforeEach(module(function($resourceProvider) {
    resourceProvider = $resourceProvider;
  }));

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    $resource = $injector.get('$resource');
    $q = $injector.get('$q');
    CreditCard = $resource('/CreditCard/:id:verb', {id:'@id.key'}, {
      charge:{
        method:'post',
        params:{verb:'!charge'}
      },
      patch: {
        method: 'PATCH'
      },
      conditionalPut: {
        method: 'PUT',
        headers: {
          'If-None-Match': '*'
        }
      }

    });
    callback = jasmine.createSpy('callback');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
  });


  describe('isValidDottedPath', function() {
    /* global isValidDottedPath: false */
    it('should support arbitrary dotted names', function() {
      expect(isValidDottedPath('')).toBe(false);
      expect(isValidDottedPath('1')).toBe(false);
      expect(isValidDottedPath('1abc')).toBe(false);
      expect(isValidDottedPath('.')).toBe(false);
      expect(isValidDottedPath('$')).toBe(true);
      expect(isValidDottedPath('@')).toBe(true);
      expect(isValidDottedPath('a')).toBe(true);
      expect(isValidDottedPath('A')).toBe(true);
      expect(isValidDottedPath('a1')).toBe(true);
      expect(isValidDottedPath('$a')).toBe(true);
      expect(isValidDottedPath('$1')).toBe(true);
      expect(isValidDottedPath('$$')).toBe(true);
      expect(isValidDottedPath('$.$')).toBe(true);
      expect(isValidDottedPath('.$')).toBe(false);
      expect(isValidDottedPath('$.')).toBe(false);
      expect(isValidDottedPath('@.')).toBe(false);
      expect(isValidDottedPath('.@')).toBe(false);
    });
  });

  describe('lookupDottedPath', function() {
    /* global lookupDottedPath: false */
    var data = {a: {b: 'foo', c: null, '@d':'d-foo'},'@b':'b-foo'};

    it('should throw for invalid path', function() {
      expect(function() {
        lookupDottedPath(data, '.ckck');
      }).toThrowMinErr('$resource', 'badmember',
                       'Dotted member path "@.ckck" is invalid.');
    });

    it('should get dotted paths', function() {
      expect(lookupDottedPath(data, 'a')).toEqual({b: 'foo', c: null, '@d':'d-foo'});
      expect(lookupDottedPath(data, 'a.b')).toBe('foo');
      expect(lookupDottedPath(data, 'a.c')).toBeNull();
      expect(lookupDottedPath(data, 'a.@d')).toBe('d-foo');
      expect(lookupDottedPath(data, '@b')).toBe('b-foo');
    });

    it('should skip over null/undefined members', function() {
      expect(lookupDottedPath(data, 'a.b.c')).toBeUndefined();
      expect(lookupDottedPath(data, 'a.c.c')).toBeUndefined();
      expect(lookupDottedPath(data, 'a.b.c.d')).toBeUndefined();
      expect(lookupDottedPath(data, 'NOT_EXIST')).toBeUndefined();
    });
  });

  it('should not include a request body when calling $delete', function() {
    $httpBackend.expect('DELETE', '/fooresource', null).respond({});
    var Resource = $resource('/fooresource');
    var resource = new Resource({ foo: 'bar' });

    resource.$delete();
    $httpBackend.flush();
  });

  it('should include a request body when calling custom method with hasBody is true', function() {
    var instant = {name: 'info.txt'};
    var condition = {at: '2038-01-19 03:14:08'};

    $httpBackend.expect('CREATE', '/fooresource', instant).respond({fid: 42});
    $httpBackend.expect('DELETE', '/fooresource', condition).respond({});

    var r = $resource('/fooresource', {}, {
      create: {method: 'CREATE', hasBody: true},
      delete: {method: 'DELETE', hasBody: true}
    });

    var creationResponse = r.create(instant);
    var deleteResponse = r.delete(condition);

    $httpBackend.flush();

    expect(creationResponse.fid).toBe(42);
    expect(deleteResponse.$resolved).toBe(true);
  });

  it('should not include a request body if hasBody is false on POST, PUT and PATCH', function() {
    function verifyRequest(method, url, data) {
      expect(data).toBeUndefined();
      return [200, {id: 42}];
    }

    $httpBackend.expect('POST', '/foo').respond(verifyRequest);
    $httpBackend.expect('PUT', '/foo').respond(verifyRequest);
    $httpBackend.expect('PATCH', '/foo').respond(verifyRequest);

    var R = $resource('/foo', {}, {
      post: {method: 'POST', hasBody: false},
      put: {method: 'PUT', hasBody: false},
      patch: {method: 'PATCH', hasBody: false}
    });

    var postResponse = R.post();
    var putResponse = R.put();
    var patchResponse = R.patch();

    $httpBackend.flush();

    expect(postResponse.id).toBe(42);
    expect(putResponse.id).toBe(42);
    expect(patchResponse.id).toBe(42);
  });

  it('should expect a body if hasBody is true', function() {
    var username = 'yathos';
    var loginRequest = {name: username, password: 'Smile'};
    var user = {id: 1, name: username};

    $httpBackend.expect('LOGIN', '/user/me', loginRequest).respond(user);

    $httpBackend.expect('LOGOUT', '/user/me', null).respond(null);

    var UserService = $resource('/user/me', {}, {
      login: {method: 'LOGIN', hasBody: true},
      logout: {method: 'LOGOUT', hasBody: false}
    });

    var loginResponse = UserService.login(loginRequest);
    var logoutResponse = UserService.logout();

    $httpBackend.flush();

    expect(loginResponse.id).toBe(user.id);
    expect(logoutResponse.$resolved).toBe(true);
  });

  it('should build resource', function() {
    expect(typeof CreditCard).toBe('function');
    expect(typeof CreditCard.get).toBe('function');
    expect(typeof CreditCard.save).toBe('function');
    expect(typeof CreditCard.remove).toBe('function');
    expect(typeof CreditCard['delete']).toBe('function');
    expect(typeof CreditCard.query).toBe('function');
  });


  describe('shallow copy', function() {
    /* global shallowClearAndCopy */
    it('should make a copy', function() {
      var original = {key:{}};
      var copy = shallowClearAndCopy(original);
      expect(copy).toEqual(original);
      expect(copy.key).toBe(original.key);
    });


    it('should omit "$$"-prefixed properties', function() {
      var original = {$$some: true, $$: true};
      var clone = {};

      expect(shallowClearAndCopy(original, clone)).toBe(clone);
      expect(clone.$$some).toBeUndefined();
      expect(clone.$$).toBeUndefined();
    });


    it('should copy "$"-prefixed properties from copy', function() {
      var original = {$some: true};
      var clone = {};

      expect(shallowClearAndCopy(original, clone)).toBe(clone);
      expect(clone.$some).toBe(original.$some);
    });


    it('should omit properties from prototype chain', function() {
      var original, clone = {};
      function Func() {}
      Func.prototype.hello = 'world';

      original = new Func();
      original.goodbye = 'world';

      expect(shallowClearAndCopy(original, clone)).toBe(clone);
      expect(clone.hello).toBeUndefined();
      expect(clone.goodbye).toBe('world');
    });
  });


  it('should not throw if response.data is the resource object', function() {
    var data = {id:{key:123}, number:'9876'};
    $httpBackend.expect('GET', '/CreditCard/123').respond(data);

    var cc = CreditCard.get({id:123});
    $httpBackend.flush();
    expect(cc instanceof CreditCard).toBe(true);

    $httpBackend.expect('POST', '/CreditCard/123', angular.toJson(data)).respond(cc);

    cc.$save();
    $httpBackend.flush();
    expect(cc.id).toEqual({key:123});
    expect(cc.number).toEqual('9876');
  });


  it('should default to empty parameters', function() {
    $httpBackend.expect('GET', 'URL').respond({});
    $resource('URL').query();
  });


  it('should ignore slashes of undefined parameters', function() {
    var R = $resource('/Path/:a/:b/:c');

    $httpBackend.when('GET', '/Path').respond('{}');
    $httpBackend.when('GET', '/Path/0').respond('{}');
    $httpBackend.when('GET', '/Path/false').respond('{}');
    $httpBackend.when('GET', '/Path').respond('{}');
    $httpBackend.when('GET', '/Path/').respond('{}');
    $httpBackend.when('GET', '/Path/1').respond('{}');
    $httpBackend.when('GET', '/Path/2/3').respond('{}');
    $httpBackend.when('GET', '/Path/4/5').respond('{}');
    $httpBackend.when('GET', '/Path/6/7/8').respond('{}');

    R.get({});
    R.get({a:0});
    R.get({a:false});
    R.get({a:null});
    R.get({a:undefined});
    R.get({a:''});
    R.get({a:1});
    R.get({a:2, b:3});
    R.get({a:4, c:5});
    R.get({a:6, b:7, c:8});
  });

  it('should not ignore leading slashes of undefined parameters that have non-slash trailing sequence', function() {
    var R = $resource('/Path/:a.foo/:b.bar/:c.baz');

    $httpBackend.when('GET', '/Path/.foo/.bar.baz').respond('{}');
    $httpBackend.when('GET', '/Path/0.foo/.bar.baz').respond('{}');
    $httpBackend.when('GET', '/Path/false.foo/.bar.baz').respond('{}');
    $httpBackend.when('GET', '/Path/.foo/.bar.baz').respond('{}');
    $httpBackend.when('GET', '/Path/.foo/.bar.baz').respond('{}');
    $httpBackend.when('GET', '/Path/1.foo/.bar.baz').respond('{}');
    $httpBackend.when('GET', '/Path/2.foo/3.bar.baz').respond('{}');
    $httpBackend.when('GET', '/Path/4.foo/.bar/5.baz').respond('{}');
    $httpBackend.when('GET', '/Path/6.foo/7.bar/8.baz').respond('{}');

    R.get({});
    R.get({a:0});
    R.get({a:false});
    R.get({a:null});
    R.get({a:undefined});
    R.get({a:''});
    R.get({a:1});
    R.get({a:2, b:3});
    R.get({a:4, c:5});
    R.get({a:6, b:7, c:8});
  });

  it('should not collapsed the url into an empty string', function() {
    var R = $resource('/:foo/:bar/');

    $httpBackend.when('GET', '/').respond('{}');

    R.get({});
  });

  it('should support escaping colons in url template', function() {
    var R = $resource('http://localhost\\:8080/Path/:a/\\:stillPath/:b');

    $httpBackend.expect('GET', 'http://localhost:8080/Path/foo/:stillPath/bar').respond();
    R.get({a: 'foo', b: 'bar'});
  });

  it('should support an unescaped url', function() {
    var R = $resource('http://localhost:8080/Path/:a');

    $httpBackend.expect('GET', 'http://localhost:8080/Path/foo').respond();
    R.get({a: 'foo'});
  });


  it('should correctly encode url params', function() {
    var R = $resource('/Path/:a');

    $httpBackend.expect('GET', '/Path/foo%231').respond('{}');
    $httpBackend.expect('GET', '/Path/doh!@foo?bar=baz%231').respond('{}');
    $httpBackend.expect('GET', '/Path/herp$').respond('{}');
    $httpBackend.expect('GET', '/Path/foo;bar').respond('{}');
    $httpBackend.expect('GET', '/Path/foo?bar=baz;qux').respond('{}');

    R.get({a: 'foo#1'});
    R.get({a: 'doh!@foo', bar: 'baz#1'});
    R.get({a: 'herp$'});
    R.get({a: 'foo;bar'});
    R.get({a: 'foo', bar: 'baz;qux'});
  });

  it('should not encode @ in url params', function() {
    //encodeURIComponent is too aggressive and doesn't follow http://www.ietf.org/rfc/rfc3986.txt
    //with regards to the character set (pchar) allowed in path segments
    //so we need this test to make sure that we don't over-encode the params and break stuff like
    //buzz api which uses @self

    var R = $resource('/Path/:a');
    $httpBackend.expect('GET', '/Path/doh@fo%20o?!do%26h=g%3Da+h&:bar=$baz@1').respond('{}');
    R.get({a: 'doh@fo o', ':bar': '$baz@1', '!do&h': 'g=a h'});
  });

  it('should encode array params', function() {
    var R = $resource('/Path/:a');
    $httpBackend.expect('GET', '/Path/doh&foo?bar=baz1&bar=baz2').respond('{}');
    R.get({a: 'doh&foo', bar: ['baz1', 'baz2']});
  });

  it('should not encode string "null" to "+" in url params', function() {
    var R = $resource('/Path/:a');
    $httpBackend.expect('GET', '/Path/null').respond('{}');
    R.get({a: 'null'});
  });


  it('should implicitly strip trailing slashes from URLs by default', function() {
    var R = $resource('http://localhost:8080/Path/:a/');

    $httpBackend.expect('GET', 'http://localhost:8080/Path/foo').respond();
    R.get({a: 'foo'});
  });

  it('should support explicitly stripping trailing slashes from URLs', function() {
    var R = $resource('http://localhost:8080/Path/:a/', {}, {}, {stripTrailingSlashes: true});

    $httpBackend.expect('GET', 'http://localhost:8080/Path/foo').respond();
    R.get({a: 'foo'});
  });

  it('should support explicitly keeping trailing slashes in URLs', function() {
    var R = $resource('http://localhost:8080/Path/:a/', {}, {}, {stripTrailingSlashes: false});

    $httpBackend.expect('GET', 'http://localhost:8080/Path/foo/').respond();
    R.get({a: 'foo'});
  });

  it('should support provider-level configuration to strip trailing slashes in URLs', function() {
    // Set the new behavior for all new resources created by overriding the
    // provider configuration
    resourceProvider.defaults.stripTrailingSlashes = false;

    var R = $resource('http://localhost:8080/Path/:a/');

    $httpBackend.expect('GET', 'http://localhost:8080/Path/foo/').respond();
    R.get({a: 'foo'});
  });

  it('should support IPv6 URLs', function() {
    test('http://[2620:0:861:ed1a::1]',        {ed1a: 'foo'}, 'http://[2620:0:861:ed1a::1]');
    test('http://[2620:0:861:ed1a::1]/',       {ed1a: 'foo'}, 'http://[2620:0:861:ed1a::1]/');
    test('http://[2620:0:861:ed1a::1]/:ed1a',  {ed1a: 'foo'}, 'http://[2620:0:861:ed1a::1]/foo');
    test('http://[2620:0:861:ed1a::1]/:ed1a',  {},            'http://[2620:0:861:ed1a::1]/');
    test('http://[2620:0:861:ed1a::1]/:ed1a/', {ed1a: 'foo'}, 'http://[2620:0:861:ed1a::1]/foo/');
    test('http://[2620:0:861:ed1a::1]/:ed1a/', {},            'http://[2620:0:861:ed1a::1]/');

    // Helpers
    function test(templateUrl, params, actualUrl) {
      var R = $resource(templateUrl, null, null, {stripTrailingSlashes: false});
      $httpBackend.expect('GET', actualUrl).respond(null);
      R.get(params);
    }
  });

  it('should support params in the `hostname` part of the URL', function() {
    test('http://:hostname',            {hostname: 'foo.com'},              'http://foo.com');
    test('http://:hostname/',           {hostname: 'foo.com'},              'http://foo.com/');
    test('http://:l2Domain.:l1Domain',  {l1Domain: 'com', l2Domain: 'bar'}, 'http://bar.com');
    test('http://:l2Domain.:l1Domain/', {l1Domain: 'com', l2Domain: 'bar'}, 'http://bar.com/');
    test('http://127.0.0.:octet',       {octet: 42},                        'http://127.0.0.42');
    test('http://127.0.0.:octet/',      {octet: 42},                        'http://127.0.0.42/');

    // Helpers
    function test(templateUrl, params, actualUrl) {
      var R = $resource(templateUrl, null, null, {stripTrailingSlashes: false});
      $httpBackend.expect('GET', actualUrl).respond(null);
      R.get(params);
    }
  });

  it('should support overriding provider default trailing-slash stripping configuration', function() {
    // Set the new behavior for all new resources created by overriding the
    // provider configuration
    resourceProvider.defaults.stripTrailingSlashes = false;

    // Specific instances of $resource can still override the provider's default
    var R = $resource('http://localhost:8080/Path/:a/', {}, {}, {stripTrailingSlashes: true});

    $httpBackend.expect('GET', 'http://localhost:8080/Path/foo').respond();
    R.get({a: 'foo'});
  });


  it('should allow relative paths in resource url', function() {
    var R = $resource(':relativePath');
    $httpBackend.expect('GET', 'data.json').respond('{}');
    R.get({ relativePath: 'data.json' });
  });

  it('should handle + in url params', function() {
    var R = $resource('/api/myapp/:myresource?from=:from&to=:to&histlen=:histlen');
    $httpBackend.expect('GET', '/api/myapp/pear+apple?from=2012-04-01&to=2012-04-29&histlen=3').respond('{}');
    R.get({ myresource: 'pear+apple', from: '2012-04-01', to: '2012-04-29', histlen: 3  });
  });


  it('should encode & in query params unless in query param value', function() {
    var R1 = $resource('/Path/:a');
    $httpBackend.expect('GET', '/Path/doh&foo?bar=baz%261').respond('{}');
    R1.get({a: 'doh&foo', bar: 'baz&1'});

    var R2 = $resource('/api/myapp/resource?:query');
    $httpBackend.expect('GET', '/api/myapp/resource?foo&bar').respond('{}');
    R2.get({query: 'foo&bar'});

    var R3 = $resource('/api/myapp/resource?from=:from');
    $httpBackend.expect('GET', '/api/myapp/resource?from=bar%20%26%20blanks').respond('{}');
    R3.get({from: 'bar & blanks'});
  });


  it('should build resource with default param', function() {
    $httpBackend.expect('GET', '/Order/123/Line/456.visa?minimum=0.05').respond({id: 'abc'});
    var LineItem = $resource('/Order/:orderId/Line/:id:verb',
                                  {orderId: '123', id: '@id.key', verb:'.visa', minimum: 0.05});
    var item = LineItem.get({id: 456});
    $httpBackend.flush();
    expect(item).toEqualData({id:'abc'});
  });


  it('should support @_property lookups with underscores', function() {
    $httpBackend.expect('GET', '/Order/123').respond({_id: {_key:'123'}, count: 0});
    var LineItem = $resource('/Order/:_id', {_id: '@_id._key'});
    var item = LineItem.get({_id: 123});
    $httpBackend.flush();
    expect(item).toEqualData({_id: {_key: '123'}, count: 0});
    $httpBackend.expect('POST', '/Order/123').respond({_id: {_key:'123'}, count: 1});
    item.$save();
    $httpBackend.flush();
    expect(item).toEqualData({_id: {_key: '123'}, count: 1});
  });


  it('should not pass default params between actions', function() {
    var R = $resource('/Path', {}, {get: {method: 'GET', params: {objId: '1'}}, perform: {method: 'GET'}});

    $httpBackend.expect('GET', '/Path?objId=1').respond('{}');
    $httpBackend.expect('GET', '/Path').respond('{}');

    R.get({});
    R.perform({});
  });


  it('should build resource with action default param overriding default param', function() {
    $httpBackend.expect('GET', '/Customer/123').respond({id: 'abc'});
    var TypeItem = $resource('/:type/:typeId', {type: 'Order'},
                                  {get: {method: 'GET', params: {type: 'Customer'}}});
    var item = TypeItem.get({typeId: 123});

    $httpBackend.flush();
    expect(item).toEqualData({id: 'abc'});
  });


  it('should build resource with action default param reading the value from instance', function() {
    $httpBackend.expect('POST', '/Customer/123').respond();
    var R = $resource('/Customer/:id', {}, {post: {method: 'POST', params: {id: '@id'}}});

    var inst = new R({id:123});
    expect(inst.id).toBe(123);

    inst.$post();
  });


  it('should not throw TypeError on null default params', function() {
    $httpBackend.expect('GET', '/Path').respond('{}');
    var R = $resource('/Path', {param: null}, {get: {method: 'GET'}});

    expect(function() {
      R.get({});
    }).not.toThrow();
  });


  it('should handle multiple params with same name', function() {
    var R = $resource('/:id/:id');

    $httpBackend.when('GET').respond('{}');
    $httpBackend.expect('GET', '/1/1');

    R.get({id:1});
  });


  it('should throw an exception if a param is called "hasOwnProperty"', function() {
    expect(function() {
      $resource('/:hasOwnProperty').get();
    }).toThrowMinErr('$resource','badname', 'hasOwnProperty is not a valid parameter name');
  });


  it('should create resource', function() {
    $httpBackend.expect('POST', '/CreditCard', '{"name":"misko"}').respond({id: 123, name: 'misko'});

    var cc = CreditCard.save({name: 'misko'}, callback);
    expect(cc).toEqualData({name: 'misko'});
    expect(callback).not.toHaveBeenCalled();

    $httpBackend.flush();
    expect(cc).toEqualData({id: 123, name: 'misko'});
    expect(callback).toHaveBeenCalledOnce();
    expect(callback.calls.mostRecent().args[0]).toEqual(cc);
    expect(callback.calls.mostRecent().args[1]()).toEqual(Object.create(null));
  });


  it('should read resource', function() {
    $httpBackend.expect('GET', '/CreditCard/123').respond({id: 123, number: '9876'});
    var cc = CreditCard.get({id: 123}, callback);

    expect(cc instanceof CreditCard).toBeTruthy();
    expect(cc).toEqualData({});
    expect(callback).not.toHaveBeenCalled();

    $httpBackend.flush();
    expect(cc).toEqualData({id: 123, number: '9876'});
    expect(callback.calls.mostRecent().args[0]).toEqual(cc);
    expect(callback.calls.mostRecent().args[1]()).toEqual(Object.create(null));
  });


  it('should send correct headers', function() {
    $httpBackend.expectPUT('/CreditCard/123', undefined, function(headers) {
      return headers['If-None-Match'] === '*';
    }).respond({id:123});

    CreditCard.conditionalPut({id: {key:123}});
  });


  it('should read partial resource', function() {
    $httpBackend.expect('GET', '/CreditCard').respond([{id:{key:123}}]);
    var ccs = CreditCard.query();

    $httpBackend.flush();
    expect(ccs.length).toEqual(1);

    var cc = ccs[0];
    expect(cc instanceof CreditCard).toBe(true);
    expect(cc.number).toBeUndefined();

    $httpBackend.expect('GET', '/CreditCard/123').respond({id: {key: 123}, number: '9876'});
    cc.$get(callback);
    $httpBackend.flush();
    expect(callback.calls.mostRecent().args[0]).toEqual(cc);
    expect(callback.calls.mostRecent().args[1]()).toEqual(Object.create(null));
    expect(cc.number).toEqual('9876');
  });


  it('should update resource', function() {
    $httpBackend.expect('POST', '/CreditCard/123', '{"id":{"key":123},"name":"misko"}').
                 respond({id: {key: 123}, name: 'rama'});

    var cc = CreditCard.save({id: {key: 123}, name: 'misko'}, callback);
    expect(cc).toEqualData({id:{key:123}, name:'misko'});
    expect(callback).not.toHaveBeenCalled();
    $httpBackend.flush();
  });


  it('should query resource', function() {
    $httpBackend.expect('GET', '/CreditCard?key=value').respond([{id: 1}, {id: 2}]);

    var ccs = CreditCard.query({key: 'value'}, callback);
    expect(ccs).toEqualData([]);
    expect(callback).not.toHaveBeenCalled();

    $httpBackend.flush();
    expect(ccs).toEqualData([{id:1}, {id:2}]);
    expect(callback.calls.mostRecent().args[0]).toEqual(ccs);
    expect(callback.calls.mostRecent().args[1]()).toEqual(Object.create(null));
  });


  it('should have all arguments optional', function() {
    $httpBackend.expect('GET', '/CreditCard').respond([{id:1}]);

    var log = '';
    var ccs = CreditCard.query(function() { log += 'cb;'; });

    $httpBackend.flush();
    expect(ccs).toEqualData([{id:1}]);
    expect(log).toEqual('cb;');
  });


  it('should delete resource and call callback', function() {
    $httpBackend.expect('DELETE', '/CreditCard/123').respond({});
    CreditCard.remove({id:123}, callback);
    expect(callback).not.toHaveBeenCalled();

    $httpBackend.flush();
    expect(callback.calls.mostRecent().args[0]).toEqualData({});
    expect(callback.calls.mostRecent().args[1]()).toEqual(Object.create(null));

    callback.calls.reset();
    $httpBackend.expect('DELETE', '/CreditCard/333').respond(204, null);
    CreditCard.remove({id:333}, callback);
    expect(callback).not.toHaveBeenCalled();

    $httpBackend.flush();
    expect(callback.calls.mostRecent().args[0]).toEqualData({});
    expect(callback.calls.mostRecent().args[1]()).toEqual(Object.create(null));
  });


  it('should post charge verb', function() {
    $httpBackend.expect('POST', '/CreditCard/123!charge?amount=10', '{"auth":"abc"}').respond({success: 'ok'});
    CreditCard.charge({id:123, amount:10}, {auth:'abc'}, callback);
  });


  it('should post charge verb on instance', function() {
    $httpBackend.expect('POST', '/CreditCard/123!charge?amount=10',
        '{"id":{"key":123},"name":"misko"}').respond({success: 'ok'});

    var card = new CreditCard({id:{key:123}, name:'misko'});
    card.$charge({amount:10}, callback);
  });


  it('should patch a resource', function() {
    $httpBackend.expectPATCH('/CreditCard/123', '{"name":"igor"}').
                     respond({id: 123, name: 'rama'});

    var card = CreditCard.patch({id: 123}, {name: 'igor'}, callback);

    expect(card).toEqualData({name: 'igor'});
    expect(callback).not.toHaveBeenCalled();
    $httpBackend.flush();
    expect(callback).toHaveBeenCalled();
    expect(card).toEqualData({id: 123, name: 'rama'});
  });


  it('should create on save', function() {
    $httpBackend.expect('POST', '/CreditCard', '{"name":"misko"}').respond({id: 123}, {header1: 'a'});

    var cc = new CreditCard();
    expect(cc.$get).toBeDefined();
    expect(cc.$query).toBeDefined();
    expect(cc.$remove).toBeDefined();
    expect(cc.$save).toBeDefined();

    cc.name = 'misko';
    cc.$save(callback);
    expect(cc).toEqualData({name:'misko'});

    $httpBackend.flush();
    expect(cc).toEqualData({id:123});
    expect(callback.calls.mostRecent().args[0]).toEqual(cc);
    expect(callback.calls.mostRecent().args[1]()).toEqual(extend(Object.create(null), {header1: 'a'}));
  });


  it('should not mutate the resource object if response contains no body', function() {
    var data = {id:{key:123}, number:'9876'};
    $httpBackend.expect('GET', '/CreditCard/123').respond(data);

    var cc = CreditCard.get({id:123});
    $httpBackend.flush();
    expect(cc instanceof CreditCard).toBe(true);

    $httpBackend.expect('POST', '/CreditCard/123', angular.toJson(data)).respond('');
    var idBefore = cc.id;

    cc.$save();
    $httpBackend.flush();
    expect(idBefore).toEqual(cc.id);
  });


  it('should support dynamic default parameters (global)', function() {
    var currentGroup = 'students',
        Person = $resource('/Person/:group/:id', { group: function() { return currentGroup; }});

    $httpBackend.expect('GET', '/Person/students/fedor').respond({id: 'fedor', email: 'f@f.com'});

    var fedor = Person.get({id: 'fedor'});
    $httpBackend.flush();

    expect(fedor).toEqualData({id: 'fedor', email: 'f@f.com'});
  });


  it('should pass resource object to dynamic default parameters', function() {
    var Person = $resource('/Person/:id', {
      id: function(data) {
        return data ? data.id : 'fedor';
      }
    });

    $httpBackend.expect('GET', '/Person/fedor').respond(
        {id: 'fedor', email: 'f@f.com', count: 1});

    var fedor = Person.get();
    $httpBackend.flush();

    expect(fedor).toEqualData({id: 'fedor', email: 'f@f.com', count: 1});

    $httpBackend.expect('POST', '/Person/fedor2').respond(
        {id: 'fedor2', email: 'f2@f.com', count: 2});

    fedor.id = 'fedor2';
    fedor.$save();
    $httpBackend.flush();

    expect(fedor).toEqualData({id: 'fedor2', email: 'f2@f.com', count: 2});
  });


  it('should support dynamic default parameters (action specific)', function() {
    var currentGroup = 'students',
      Person = $resource('/Person/:group/:id', {}, {
        fetch: {
          method: 'GET',
          params: {group: function() { return currentGroup; }}
        }
      });

    $httpBackend.expect('GET', '/Person/students/fedor').respond({id: 'fedor', email: 'f@f.com'});

    var fedor = Person.fetch({id: 'fedor'});
    $httpBackend.flush();

    expect(fedor).toEqualData({id: 'fedor', email: 'f@f.com'});
  });


  it('should exercise full stack', function() {
    var Person = $resource('/Person/:id');

    $httpBackend.expect('GET', '/Person/123').respond('\n{\n"name":\n"misko"\n}\n');
    var person = Person.get({id:123});
    $httpBackend.flush();
    expect(person.name).toEqual('misko');
  });

  it('should return a resource instance when calling a class method with a resource instance', function() {
    $httpBackend.expect('GET', '/Person/123').respond('{"name":"misko"}');
    var Person = $resource('/Person/:id');
    var person = Person.get({id:123});
    $httpBackend.flush();
    $httpBackend.expect('POST', '/Person').respond('{"name":"misko2"}');

    var person2 = Person.save(person);
    $httpBackend.flush();

    expect(person2).toEqual(jasmine.any(Person));
  });

  it('should not include $promise and $resolved when resource is toJson\'ed', function() {
    $httpBackend.expect('GET', '/CreditCard/123').respond({id: 123, number: '9876'});
    var cc = CreditCard.get({id: 123});
    $httpBackend.flush();

    cc.$myProp = 'still here';

    expect(cc.$promise).toBeDefined();
    expect(cc.$resolved).toBe(true);

    var json = JSON.parse(angular.toJson(cc));
    expect(json.$promise).not.toBeDefined();
    expect(json.$resolved).not.toBeDefined();
    expect(json).toEqual({id: 123, number: '9876', $myProp: 'still here'});
  });

  it('should not include $cancelRequest when resource is toJson\'ed', function() {
    $httpBackend.whenGET('/CreditCard').respond({});

    var CreditCard = $resource('/CreditCard', {}, {
      get: {
        method: 'GET',
        cancellable: true
      }
    });

    var card = CreditCard.get();
    var json = card.toJSON();

    expect(card.$cancelRequest).toBeDefined();
    expect(json.$cancelRequest).toBeUndefined();
  });


  describe('promise api', function() {

    var $rootScope;


    beforeEach(inject(function(_$rootScope_) {
      $rootScope = _$rootScope_;
    }));


    describe('single resource', function() {

      it('should add $promise to the result object', function() {
        $httpBackend.expect('GET', '/CreditCard/123').respond({id: 123, number: '9876'});
        var cc = CreditCard.get({id: 123});

        cc.$promise.then(callback);
        expect(callback).not.toHaveBeenCalled();

        $httpBackend.flush();

        expect(callback).toHaveBeenCalledOnce();
        expect(callback.calls.mostRecent().args[0]).toBe(cc);
      });


      it('should keep $promise around after resolution', function() {
        $httpBackend.expect('GET', '/CreditCard/123').respond({id: 123, number: '9876'});
        var cc = CreditCard.get({id: 123});

        cc.$promise.then(callback);
        $httpBackend.flush();

        callback.calls.reset();

        cc.$promise.then(callback);
        $rootScope.$apply(); //flush async queue

        expect(callback).toHaveBeenCalledOnce();
      });


      it('should keep the original promise after instance action', function() {
        $httpBackend.expect('GET', '/CreditCard/123').respond({id: 123, number: '9876'});
        $httpBackend.expect('POST', '/CreditCard/123').respond({id: 123, number: '9876'});

        var cc = CreditCard.get({id: 123});
        var originalPromise = cc.$promise;

        cc.number = '666';
        cc.$save({id: 123});

        expect(cc.$promise).toBe(originalPromise);
      });


      it('should allow promise chaining', function() {
        $httpBackend.expect('GET', '/CreditCard/123').respond({id: 123, number: '9876'});
        var cc = CreditCard.get({id: 123});

        cc.$promise.then(function(value) { return 'new value'; }).then(callback);
        $httpBackend.flush();

        expect(callback).toHaveBeenCalledOnceWith('new value');
      });


      it('should allow $promise error callback registration', function() {
        $httpBackend.expect('GET', '/CreditCard/123').respond(404, 'resource not found');
        var cc = CreditCard.get({id: 123});

        cc.$promise.then(null, callback);
        $httpBackend.flush();

        var response = callback.calls.mostRecent().args[0];

        expect(response.data).toEqual('resource not found');
        expect(response.status).toEqual(404);
      });


      it('should add $resolved boolean field to the result object', function() {
        $httpBackend.expect('GET', '/CreditCard/123').respond({id: 123, number: '9876'});
        var cc = CreditCard.get({id: 123});

        expect(cc.$resolved).toBe(false);

        cc.$promise.then(callback);
        expect(cc.$resolved).toBe(false);

        $httpBackend.flush();

        expect(cc.$resolved).toBe(true);
      });


      it('should set $resolved field to true when an error occurs', function() {
        $httpBackend.expect('GET', '/CreditCard/123').respond(404, 'resource not found');
        var cc = CreditCard.get({id: 123});

        cc.$promise.then(null, callback);
        $httpBackend.flush();
        expect(callback).toHaveBeenCalledOnce();
        expect(cc.$resolved).toBe(true);
      });


      it('should keep $resolved true in all subsequent interactions', function() {
        $httpBackend.expect('GET', '/CreditCard/123').respond({id: 123, number: '9876'});
        var cc = CreditCard.get({id: 123});
        $httpBackend.flush();
        expect(cc.$resolved).toBe(true);

        $httpBackend.expect('POST', '/CreditCard/123').respond();
        cc.$save({id: 123});
        expect(cc.$resolved).toBe(true);
        $httpBackend.flush();
        expect(cc.$resolved).toBe(true);
      });


      it('should return promise from action method calls', function() {
        $httpBackend.expect('GET', '/CreditCard/123').respond({id: 123, number: '9876'});
        var cc = new CreditCard({name: 'Mojo'});

        expect(cc).toEqualData({name: 'Mojo'});

        cc.$get({id:123}).then(callback);

        $httpBackend.flush();
        expect(callback).toHaveBeenCalledOnce();
        expect(cc).toEqualData({id: 123, number: '9876'});
        callback.calls.reset();

        $httpBackend.expect('POST', '/CreditCard').respond({id: 1, number: '9'});

        cc.$save().then(callback);

        $httpBackend.flush();
        expect(callback).toHaveBeenCalledOnce();
        expect(cc).toEqualData({id: 1, number: '9'});
      });


      it('should allow parsing a value from headers', function() {
        // https://github.com/angular/angular.js/pull/2607#issuecomment-17759933
        $httpBackend.expect('POST', '/CreditCard').respond(201, '', {'Location': '/new-id'});

        var parseUrlFromHeaders = function(response) {
          var resource = response.resource;
          resource.url = response.headers('Location');
          return resource;
        };

        var CreditCard = $resource('/CreditCard', {}, {
          save: {
            method: 'post',
            interceptor: {response: parseUrlFromHeaders}
          }
        });

        var cc = new CreditCard({name: 'Me'});

        cc.$save();
        $httpBackend.flush();

        expect(cc.url).toBe('/new-id');
      });


      it('should pass the same transformed value to success callbacks and to promises', function() {
        $httpBackend.expect('GET', '/CreditCard').respond(200, { value: 'original' });

        var transformResponse = function(response) {
          return { value: 'transformed' };
        };

        var CreditCard = $resource('/CreditCard', {}, {
          call: {
            method: 'get',
            interceptor: { response: transformResponse }
          }
        });

        var successValue,
            promiseValue;

        var cc = new CreditCard({ name: 'Me' });

        var req = cc.$call({}, function(result) {
          successValue = result;
        });
        req.then(function(result) {
          promiseValue = result;
        });

        $httpBackend.flush();
        expect(successValue).toEqual({ value: 'transformed' });
        expect(promiseValue).toEqual({ value: 'transformed' });
        expect(successValue).toBe(promiseValue);
      });
    });


    describe('resource collection', function() {

      it('should add $promise to the result object', function() {
        $httpBackend.expect('GET', '/CreditCard?key=value').respond([{id: 1}, {id: 2}]);
        var ccs = CreditCard.query({key: 'value'});

        ccs.$promise.then(callback);
        expect(callback).not.toHaveBeenCalled();

        $httpBackend.flush();

        expect(callback).toHaveBeenCalledOnce();
        expect(callback.calls.mostRecent().args[0]).toBe(ccs);
      });


      it('should keep $promise around after resolution', function() {
        $httpBackend.expect('GET', '/CreditCard?key=value').respond([{id: 1}, {id: 2}]);
        var ccs = CreditCard.query({key: 'value'});

        ccs.$promise.then(callback);
        $httpBackend.flush();

        callback.calls.reset();

        ccs.$promise.then(callback);
        $rootScope.$apply(); //flush async queue

        expect(callback).toHaveBeenCalledOnce();
      });


      it('should allow promise chaining', function() {
        $httpBackend.expect('GET', '/CreditCard?key=value').respond([{id: 1}, {id: 2}]);
        var ccs = CreditCard.query({key: 'value'});

        ccs.$promise.then(function(value) { return 'new value'; }).then(callback);
        $httpBackend.flush();

        expect(callback).toHaveBeenCalledOnceWith('new value');
      });


      it('should allow $promise error callback registration', function() {
        $httpBackend.expect('GET', '/CreditCard?key=value').respond(404, 'resource not found');
        var ccs = CreditCard.query({key: 'value'});

        ccs.$promise.then(null, callback);
        $httpBackend.flush();

        var response = callback.calls.mostRecent().args[0];

        expect(response.data).toEqual('resource not found');
        expect(response.status).toEqual(404);
      });


      it('should add $resolved boolean field to the result object', function() {
        $httpBackend.expect('GET', '/CreditCard?key=value').respond([{id: 1}, {id: 2}]);
        var ccs = CreditCard.query({key: 'value'}, callback);

        expect(ccs.$resolved).toBe(false);

        ccs.$promise.then(callback);
        expect(ccs.$resolved).toBe(false);

        $httpBackend.flush();

        expect(ccs.$resolved).toBe(true);
      });


      it('should set $resolved field to true when an error occurs', function() {
        $httpBackend.expect('GET', '/CreditCard?key=value').respond(404, 'resource not found');
        var ccs = CreditCard.query({key: 'value'});

        ccs.$promise.then(null, callback);
        $httpBackend.flush();
        expect(callback).toHaveBeenCalledOnce();
        expect(ccs.$resolved).toBe(true);
      });
    });


    describe('requestInterceptor', function() {
      var rejectReason = {'lol':'cat'};
      var successSpy, failureSpy;

      beforeEach(function() {
        successSpy = jasmine.createSpy('successSpy');
        failureSpy = jasmine.createSpy('failureSpy');
      });

      it('should allow per action request interceptor that gets full configuration', function() {
        var CreditCard = $resource('/CreditCard', {}, {
          query: {
            method: 'get',
            isArray: true,
            interceptor: {
              request: function(httpConfig) {
                callback(httpConfig);
                return httpConfig;
              }
            }
          }
        });

        $httpBackend.expect('GET', '/CreditCard').respond([{id: 1}]);

        var resource = CreditCard.query();
        resource.$promise.then(successSpy, failureSpy);

        $httpBackend.flush();
        expect(callback).toHaveBeenCalledOnce();
        expect(successSpy).toHaveBeenCalledOnce();
        expect(failureSpy).not.toHaveBeenCalled();

        expect(callback).toHaveBeenCalledWith({
          'method': 'get',
          'url': '/CreditCard'
        });
      });

      it('should call $http with the value returned from requestInterceptor', function() {
        var CreditCard = $resource('/CreditCard', {}, {
          query: {
            method: 'get',
            isArray: true,
            interceptor: {
              request: function(httpConfig) {
                httpConfig.url = '/DebitCard';
                return httpConfig;
              }
            }
          }
        });

        $httpBackend.expect('GET', '/DebitCard').respond([{id: 1}]);

        var resource = CreditCard.query();
        resource.$promise.then(successSpy, failureSpy);

        $httpBackend.flush();
        expect(successSpy).toHaveBeenCalledOnceWith(jasmine.arrayContaining([
          jasmine.objectContaining({id: 1})
        ]));
        expect(failureSpy).not.toHaveBeenCalled();
      });

      it('should abort the operation if the requestInterceptor rejects the operation', function() {
        var CreditCard = $resource('/CreditCard', {}, {
          query: {
            method: 'get',
            isArray: true,
            interceptor: {
              request: function() {
                return $q.reject(rejectReason);
              }
            }
          }
        });

        var resource = CreditCard.query();
        resource.$promise.then(successSpy, failureSpy);

        // Make sure all promises resolve.
        $rootScope.$apply();

        // Ensure the resource promise was rejected
        expect(resource.$resolved).toBeTruthy();
        expect(successSpy).not.toHaveBeenCalled();
        expect(failureSpy).toHaveBeenCalledOnceWith(rejectReason);

        // Ensure that no requests were made.
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('should call requestErrorInterceptor if requestInterceptor rejects the operation', function() {
        var CreditCard = $resource('/CreditCard', {}, {
          query: {
            method: 'get',
            isArray: true,
            interceptor: {
              request: function() {
                return $q.reject(rejectReason);
              },
              requestError: function(rejection) {
                callback(rejection);
                return $q.reject(rejection);
              }
            }
          }
        });

        var resource = CreditCard.query();
        resource.$promise.then(successSpy, failureSpy);
        $rootScope.$digest();

        expect(callback).toHaveBeenCalledOnceWith(rejectReason);
        expect(successSpy).not.toHaveBeenCalled();
        expect(failureSpy).toHaveBeenCalledOnceWith(rejectReason);

        // Ensure that no requests were made.
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('should abort the operation if a requestErrorInterceptor rejects the operation', function() {
        var CreditCard = $resource('/CreditCard', {}, {
          query: {
            method: 'get',
            isArray: true,
            interceptor: {
              request: function() {
                return $q.reject(rejectReason);
              },
              requestError: function(rejection) {
                return $q.reject(rejection);
              }
            }
          }
        });

        var resource = CreditCard.query();
        resource.$promise.then(successSpy, failureSpy);
        $rootScope.$apply();

        expect(resource.$resolved).toBeTruthy();
        expect(successSpy).not.toHaveBeenCalled();
        expect(failureSpy).toHaveBeenCalledOnceWith(rejectReason);

        // Ensure that no requests were made.
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('should continue the operation if a requestErrorInterceptor rescues it', function() {
        var CreditCard = $resource('/CreditCard', {}, {
          query: {
            method: 'get',
            isArray: true,
            interceptor: {
              request: function(httpConfig) {
                return $q.reject(httpConfig);
              },
              requestError: function(httpConfig) {
                return $q.resolve(httpConfig);
              }
            }
          }
        });

        $httpBackend.expect('GET', '/CreditCard').respond([{id: 1}]);

        var resource = CreditCard.query();
        resource.$promise.then(successSpy, failureSpy);
        $httpBackend.flush();

        expect(resource.$resolved).toBeTruthy();
        expect(successSpy).toHaveBeenCalledOnceWith(jasmine.arrayContaining([
          jasmine.objectContaining({id: 1})
        ]));
        expect(failureSpy).not.toHaveBeenCalled();

        $httpBackend.verifyNoOutstandingRequest();
      });
    });


    describe('responseInterceptor', function() {
      it('should allow per action response interceptor that gets full response', function() {
        var response;

        $httpBackend.expect('GET', '/CreditCard').respond(201, {id: 1}, {foo: 'bar'}, 'Ack');
        CreditCard = $resource('/CreditCard', {}, {
          get: {
            method: 'get',
            interceptor: {response: function(resp) { response = resp; }}
          }
        });

        var cc = CreditCard.get();
        $httpBackend.flush();

        expect(response.resource).toBe(cc);
        expect(response.config).toBeDefined();
        expect(response.status).toBe(201);
        expect(response.statusText).toBe('Ack');
        expect(response.headers()).toEqual({foo: 'bar'});
      });


      it('should allow per action responseError interceptor that gets full response', function() {
        var response;

        $httpBackend.expect('GET', '/CreditCard').respond(404, {ignored: 'stuff'}, {foo: 'bar'}, 'Ack');
        CreditCard = $resource('/CreditCard', {}, {
          get: {
            method: 'get',
            interceptor: {responseError: function(resp) { response = resp; }}
          }
        });

        var cc = CreditCard.get();
        $httpBackend.flush();

        expect(response.resource).toBe(cc);
        expect(response.config).toBeDefined();
        expect(response.status).toBe(404);
        expect(response.statusText).toBe('Ack');
        expect(response.headers()).toEqual({foo: 'bar'});
      });


      it('should fulfill the promise with the value returned by the response interceptor',
        function() {
          $httpBackend.whenGET('/CreditCard').respond(200);
          CreditCard = $resource('/CreditCard', {}, {
            test1: {
              method: 'get',
              interceptor: {response: function() { return 'foo'; }}
            },
            test2: {
              method: 'get',
              interceptor: {response: function() { return $q.resolve('bar'); }}
            },
            test3: {
              method: 'get',
              interceptor: {response: function() { return $q.reject('baz'); }}
            }
          });

          CreditCard.test1().$promise.then(callback);
          $httpBackend.flush();
          expect(callback).toHaveBeenCalledOnceWith('foo');

          callback.calls.reset();

          CreditCard.test2().$promise.then(callback);
          $httpBackend.flush();
          expect(callback).toHaveBeenCalledOnceWith('bar');

          callback.calls.reset();

          CreditCard.test3().$promise.then(null, callback);
          $httpBackend.flush();
          expect(callback).toHaveBeenCalledOnceWith('baz');
        }
      );


      it('should fulfill the promise with the value returned by the responseError interceptor',
        function() {
          $httpBackend.whenGET('/CreditCard').respond(404);
          CreditCard = $resource('/CreditCard', {}, {
            test1: {
              method: 'get',
              interceptor: {responseError: function() { return 'foo'; }}
            },
            test2: {
              method: 'get',
              interceptor: {responseError: function() { return $q.resolve('bar'); }}
            },
            test3: {
              method: 'get',
              interceptor: {responseError: function() { return $q.reject('baz'); }}
            }
          });

          CreditCard.test1().$promise.then(callback);
          $httpBackend.flush();
          expect(callback).toHaveBeenCalledOnceWith('foo');

          callback.calls.reset();

          CreditCard.test2().$promise.then(callback);
          $httpBackend.flush();
          expect(callback).toHaveBeenCalledOnceWith('bar');

          callback.calls.reset();

          CreditCard.test3().$promise.then(null, callback);
          $httpBackend.flush();
          expect(callback).toHaveBeenCalledOnceWith('baz');
        }
      );


      it('should call the success callback when response interceptor succeeds', function() {
        $httpBackend.whenGET('/CreditCard').respond(200);
        CreditCard = $resource('/CreditCard', {}, {
          test1: {
            method: 'get',
            interceptor: {response: function() { return 'foo'; }}
          },
          test2: {
            method: 'get',
            interceptor: {response: function() { return $q.resolve('bar'); }}
          }
        });

        CreditCard.test1(callback);
        $httpBackend.flush();
        expect(callback).toHaveBeenCalledOnceWith('foo', jasmine.any(Function), 200, '');

        callback.calls.reset();

        CreditCard.test2(callback);
        $httpBackend.flush();
        expect(callback).toHaveBeenCalledOnceWith('bar', jasmine.any(Function), 200, '');
      });


      it('should call the error callback when response interceptor fails', function() {
        $httpBackend.whenGET('/CreditCard').respond(200);
        CreditCard = $resource('/CreditCard', {}, {
          test1: {
            method: 'get',
            interceptor: {response: function() { throw 'foo'; }}
          },
          test2: {
            method: 'get',
            interceptor: {response: function() { return $q.reject('bar'); }}
          }
        });

        CreditCard.test1(noop, callback);
        $httpBackend.flush();
        expect(callback).toHaveBeenCalledOnceWith('foo');

        callback.calls.reset();

        CreditCard.test2(noop, callback);
        $httpBackend.flush();
        expect(callback).toHaveBeenCalledOnceWith('bar');
      });


      it('should call the success callback when responseError interceptor succeeds', function() {
        $httpBackend.whenGET('/CreditCard').respond(404);
        CreditCard = $resource('/CreditCard', {}, {
          test1: {
            method: 'get',
            interceptor: {responseError: function() { return 'foo'; }}
          },
          test2: {
            method: 'get',
            interceptor: {responseError: function() { return $q.resolve('bar'); }}
          }
        });

        CreditCard.test1(callback);
        $httpBackend.flush();
        expect(callback).toHaveBeenCalledOnceWith('foo', jasmine.any(Function), 404, '');

        callback.calls.reset();

        CreditCard.test2(callback);
        $httpBackend.flush();
        expect(callback).toHaveBeenCalledOnceWith('bar', jasmine.any(Function), 404, '');
      });


      it('should call the error callback when responseError interceptor fails', function() {
        $httpBackend.whenGET('/CreditCard').respond(404);
        CreditCard = $resource('/CreditCard', {}, {
          test1: {
            method: 'get',
            interceptor: {responseError: function() { throw 'foo'; }}
          },
          test2: {
            method: 'get',
            interceptor: {responseError: function() { return $q.reject('bar'); }}
          }
        });

        CreditCard.test1(noop, callback);
        $httpBackend.flush();
        expect(callback).toHaveBeenCalledOnceWith('foo');

        callback.calls.reset();

        CreditCard.test2(noop, callback);
        $httpBackend.flush();
        expect(callback).toHaveBeenCalledOnceWith('bar');
      });
    });
  });


  describe('success mode', function() {
    it('should call the success callback (as 1st argument) on 2xx responses', function() {
      var instance, headers, status, statusText;
      var successCb = jasmine.createSpy('successCb').and.callFake(function(d, h, s, t) {
        expect(d).toBe(instance);
        expect(h()).toEqual(jasmine.objectContaining(headers));
        expect(s).toBe(status);
        expect(t).toBe(statusText);
      });

      instance = CreditCard.get(successCb);
      headers = {foo: 'bar'};
      status = 200;
      statusText = 'OK';
      $httpBackend.expect('GET', '/CreditCard').respond(status, {}, headers, statusText);
      $httpBackend.flush();

      expect(successCb).toHaveBeenCalledOnce();

      instance = CreditCard.get(successCb);
      headers = {baz: 'qux'};
      status = 299;
      statusText = 'KO';
      $httpBackend.expect('GET', '/CreditCard').respond(status, {}, headers, statusText);
      $httpBackend.flush();

      expect(successCb).toHaveBeenCalledTimes(2);
    });


    it('should call the success callback (as 2nd argument) on 2xx responses', function() {
      var instance, headers, status, statusText;
      var successCb = jasmine.createSpy('successCb').and.callFake(function(d, h, s, t) {
        expect(d).toBe(instance);
        expect(h()).toEqual(jasmine.objectContaining(headers));
        expect(s).toBe(status);
        expect(t).toBe(statusText);
      });

      instance = CreditCard.get({id: 123}, successCb);
      headers = {foo: 'bar'};
      status = 200;
      statusText = 'OK';
      $httpBackend.expect('GET', '/CreditCard/123').respond(status, {}, headers, statusText);
      $httpBackend.flush();

      expect(successCb).toHaveBeenCalledOnce();

      instance = CreditCard.get({id: 456}, successCb);
      headers = {baz: 'qux'};
      status = 299;
      statusText = 'KO';
      $httpBackend.expect('GET', '/CreditCard/456').respond(status, {}, headers, statusText);
      $httpBackend.flush();

      expect(successCb).toHaveBeenCalledTimes(2);
    });
  });

  describe('failure mode', function() {
    var ERROR_CODE = 500,
        ERROR_RESPONSE = 'Server Error',
        errorCB;

    beforeEach(function() {
      errorCB = jasmine.createSpy('error').and.callFake(function(response) {
        expect(response.data).toBe(ERROR_RESPONSE);
        expect(response.status).toBe(ERROR_CODE);
      });
    });


    it('should call the error callback if provided on non 2xx response', function() {
      $httpBackend.expect('GET', '/CreditCard/123').respond(ERROR_CODE, ERROR_RESPONSE);

      CreditCard.get({id:123}, callback, errorCB);
      $httpBackend.flush();
      expect(errorCB).toHaveBeenCalledOnce();
      expect(callback).not.toHaveBeenCalled();
    });


    it('should call the error callback if provided on non 2xx response (without data)', function() {
      $httpBackend.expect('GET', '/CreditCard').respond(ERROR_CODE, ERROR_RESPONSE);

      CreditCard.get(callback, errorCB);
      $httpBackend.flush();
      expect(errorCB).toHaveBeenCalledOnce();
      expect(callback).not.toHaveBeenCalled();
    });
  });

  it('should transform request/response', function() {
    var Person = $resource('/Person/:id', {}, {
      save: {
        method: 'POST',
        params: {id: '@id'},
        transformRequest: function(data) {
          return angular.toJson({ __id: data.id });
        },
        transformResponse: function(data) {
          return { id: data.__id };
        }
      }
    });

    $httpBackend.expect('POST', '/Person/123', { __id: 123 }).respond({ __id: 456 });
    var person = new Person({id:123});
    person.$save();
    $httpBackend.flush();
    expect(person.id).toEqual(456);
  });

  describe('suffix parameter', function() {

    describe('query', function() {
      it('should add a suffix', function() {
        $httpBackend.expect('GET', '/users.json').respond([{id: 1, name: 'user1'}]);
        var UserService = $resource('/users/:id.json', {id: '@id'});
        var user = UserService.query();
        $httpBackend.flush();
        expect(user).toEqualData([{id: 1, name: 'user1'}]);
      });

      it('should not require it if not provided', function() {
        $httpBackend.expect('GET', '/users.json').respond([{id: 1, name: 'user1'}]);
        var UserService = $resource('/users.json');
        var user = UserService.query();
        $httpBackend.flush();
        expect(user).toEqualData([{id: 1, name: 'user1'}]);
      });

      it('should work when query parameters are supplied', function() {
        $httpBackend.expect('GET', '/users.json?red=blue').respond([{id: 1, name: 'user1'}]);
        var UserService = $resource('/users/:user_id.json', {user_id: '@id'});
        var user = UserService.query({red: 'blue'});
        $httpBackend.flush();
        expect(user).toEqualData([{id: 1, name: 'user1'}]);
      });

      it('should work when query parameters are supplied and the format is a resource parameter', function() {
        $httpBackend.expect('GET', '/users.json?red=blue').respond([{id: 1, name: 'user1'}]);
        var UserService = $resource('/users/:user_id.:format', {user_id: '@id', format: 'json'});
        var user = UserService.query({red: 'blue'});
        $httpBackend.flush();
        expect(user).toEqualData([{id: 1, name: 'user1'}]);
      });

      it('should work with the action is overridden', function() {
        $httpBackend.expect('GET', '/users.json').respond([{id: 1, name: 'user1'}]);
        var UserService = $resource('/users/:user_id', {user_id: '@id'}, {
          query: {
            method: 'GET',
            url: '/users/:user_id.json',
            isArray: true
          }
        });
        var user = UserService.query();
        $httpBackend.flush();
        expect(user).toEqualData([{id: 1, name: 'user1'}]);
      });

      it('should not convert string literals in array into Resource objects', function() {
        $httpBackend.expect('GET', '/names.json').respond(['mary', 'jane']);
        var strings = $resource('/names.json').query();
        $httpBackend.flush();
        expect(strings).toEqualData(['mary', 'jane']);
      });

      it('should not convert number literals in array into Resource objects', function() {
        $httpBackend.expect('GET', '/names.json').respond([213, 456]);
        var numbers = $resource('/names.json').query();
        $httpBackend.flush();
        expect(numbers).toEqualData([213, 456]);
      });

      it('should not convert boolean literals in array into Resource objects', function() {
        $httpBackend.expect('GET', '/names.json').respond([true, false]);
        var bools = $resource('/names.json').query();
        $httpBackend.flush();
        expect(bools).toEqualData([true, false]);
      });
    });

    describe('get', function() {
      it('should add them to the id', function() {
        $httpBackend.expect('GET', '/users/1.json').respond({id: 1, name: 'user1'});
        var UserService = $resource('/users/:user_id.json', {user_id: '@id'});
        var user = UserService.get({user_id: 1});
        $httpBackend.flush();
        expect(user).toEqualData({id: 1, name: 'user1'});
      });

      it('should work when an id and query parameters are supplied', function() {
        $httpBackend.expect('GET', '/users/1.json?red=blue').respond({id: 1, name: 'user1'});
        var UserService = $resource('/users/:user_id.json', {user_id: '@id'});
        var user = UserService.get({user_id: 1, red: 'blue'});
        $httpBackend.flush();
        expect(user).toEqualData({id: 1, name: 'user1'});
      });

      it('should work when the format is a parameter', function() {
        $httpBackend.expect('GET', '/users/1.json?red=blue').respond({id: 1, name: 'user1'});
        var UserService = $resource('/users/:user_id.:format', {user_id: '@id', format: 'json'});
        var user = UserService.get({user_id: 1, red: 'blue'});
        $httpBackend.flush();
        expect(user).toEqualData({id: 1, name: 'user1'});
      });

      it('should work with the action is overridden', function() {
        $httpBackend.expect('GET', '/users/1.json').respond({id: 1, name: 'user1'});
        var UserService = $resource('/users/:user_id', {user_id: '@id'}, {
          get: {
            method: 'GET',
            url: '/users/:user_id.json'
          }
        });
        var user = UserService.get({user_id: 1});
        $httpBackend.flush();
        expect(user).toEqualData({id: 1, name: 'user1'});
      });
    });

    describe('save', function() {
      it('should append the suffix', function() {
        $httpBackend.expect('POST', '/users.json', '{"name":"user1"}').respond({id: 123, name: 'user1'});
        var UserService = $resource('/users/:user_id.json', {user_id: '@id'});
        var user = UserService.save({name: 'user1'}, callback);
        expect(user).toEqualData({name: 'user1'});
        expect(callback).not.toHaveBeenCalled();
        $httpBackend.flush();
        expect(user).toEqualData({id: 123, name: 'user1'});
        expect(callback).toHaveBeenCalledOnce();
        expect(callback.calls.mostRecent().args[0]).toEqual(user);
        expect(callback.calls.mostRecent().args[1]()).toEqual(Object.create(null));
      });

      it('should append when an id is supplied', function() {
        $httpBackend.expect('POST', '/users/123.json', '{"id":123,"name":"newName"}').respond({id: 123, name: 'newName'});
        var UserService = $resource('/users/:user_id.json', {user_id: '@id'});
        var user = UserService.save({id: 123, name: 'newName'}, callback);
        expect(callback).not.toHaveBeenCalled();
        $httpBackend.flush();
        expect(user).toEqualData({id: 123, name: 'newName'});
        expect(callback).toHaveBeenCalledOnce();
        expect(callback.calls.mostRecent().args[0]).toEqual(user);
        expect(callback.calls.mostRecent().args[1]()).toEqual(Object.create(null));
      });

      it('should append when an id is supplied and the format is a parameter', function() {
        $httpBackend.expect('POST', '/users/123.json', '{"id":123,"name":"newName"}').respond({id: 123, name: 'newName'});
        var UserService = $resource('/users/:user_id.:format', {user_id: '@id', format: 'json'});
        var user = UserService.save({id: 123, name: 'newName'}, callback);
        expect(callback).not.toHaveBeenCalled();
        $httpBackend.flush();
        expect(user).toEqualData({id: 123, name: 'newName'});
        expect(callback).toHaveBeenCalledOnce();
        expect(callback.calls.mostRecent().args[0]).toEqual(user);
        expect(callback.calls.mostRecent().args[1]()).toEqual(Object.create(null));
      });
    });

    describe('escaping /. with /\\.', function() {
      it('should work with query()', function() {
        $httpBackend.expect('GET', '/users/.json').respond();
        $resource('/users/\\.json').query();
      });
      it('should work with get()', function() {
        $httpBackend.expect('GET', '/users/.json').respond();
        $resource('/users/\\.json').get();
      });
      it('should work with save()', function() {
        $httpBackend.expect('POST', '/users/.json').respond();
        $resource('/users/\\.json').save({});
      });
      it('should work with save() if dynamic params', function() {
        $httpBackend.expect('POST', '/users/.json').respond();
        $resource('/users/:json', {json: '\\.json'}).save({});
      });
      it('should work with query() if dynamic params', function() {
        $httpBackend.expect('GET', '/users/.json').respond();
        $resource('/users/:json', {json: '\\.json'}).query();
      });
      it('should work with get() if dynamic params', function() {
        $httpBackend.expect('GET', '/users/.json').respond();
        $resource('/users/:json', {json: '\\.json'}).get();
      });
    });
  });

  describe('action-level url override', function() {

    it('should support overriding url template with static url', function() {
      $httpBackend.expect('GET', '/override-url?type=Customer&typeId=123').respond({id: 'abc'});
      var TypeItem = $resource('/:type/:typeId', {type: 'Order'}, {
        get: {
          method: 'GET',
          params: {type: 'Customer'},
          url: '/override-url'
        }
      });
      var item = TypeItem.get({typeId: 123});
      $httpBackend.flush();
      expect(item).toEqualData({id: 'abc'});
    });


    it('should support overriding url template with a new template ending in param', function() {
      //    url parameter in action, parameter ending the string
      $httpBackend.expect('GET', '/Customer/123').respond({id: 'abc'});
      var TypeItem = $resource('/foo/:type', {type: 'Order'}, {
        get: {
          method: 'GET',
          params: {type: 'Customer'},
          url: '/:type/:typeId'
        }
      });
      var item = TypeItem.get({typeId: 123});
      $httpBackend.flush();
      expect(item).toEqualData({id: 'abc'});

      //    url parameter in action, parameter not ending the string
      $httpBackend.expect('GET', '/Customer/123/pay').respond({id: 'abc'});
      TypeItem = $resource('/foo/:type', {type: 'Order'}, {
        get: {
          method: 'GET',
          params: {type: 'Customer'},
          url: '/:type/:typeId/pay'
        }
      });
      item = TypeItem.get({typeId: 123});
      $httpBackend.flush();
      expect(item).toEqualData({id: 'abc'});
    });


    it('should support overriding url template with a new template ending in string', function() {
      $httpBackend.expect('GET', '/Customer/123/pay').respond({id: 'abc'});
      var TypeItem = $resource('/foo/:type', {type: 'Order'}, {
        get: {
          method: 'GET',
          params: {type: 'Customer'},
          url: '/:type/:typeId/pay'
        }
      });
      var item = TypeItem.get({typeId: 123});
      $httpBackend.flush();
      expect(item).toEqualData({id: 'abc'});
    });
  });
});

describe('extra params', function() {
  var $http;
  var $httpBackend;
  var $resource;
  var $rootScope;

  beforeEach(module('ngResource'));

  beforeEach(module(function($provide) {
    $provide.decorator('$http', function($delegate) {
      return jasmine.createSpy('$http').and.callFake($delegate);
    });
  }));

  beforeEach(inject(function(_$http_, _$httpBackend_, _$resource_, _$rootScope_) {
    $http = _$http_;
    $httpBackend = _$httpBackend_;
    $resource = _$resource_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
  });


  it('should pass extra params to `$http` as `config.params`', function() {
    $httpBackend.expectGET('/bar?baz=qux').respond('{}');

    var R = $resource('/:foo');
    R.get({foo: 'bar', baz: 'qux'});

    $rootScope.$digest();
    expect($http).toHaveBeenCalledWith(jasmine.objectContaining({params: {baz: 'qux'}}));
  });

  it('should pass extra params even if `Object.prototype` has properties with the same name',
    function() {
      $httpBackend.expectGET('/foo?toString=bar').respond('{}');

      var R = $resource('/foo');
      R.get({toString: 'bar'});
    }
  );
});

describe('errors', function() {
  var $httpBackend, $resource;

  beforeEach(module(function($exceptionHandlerProvider) {
    $exceptionHandlerProvider.mode('log');
  }));

  beforeEach(module('ngResource'));

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    $resource = $injector.get('$resource');
  }));


  it('should fail if action expects an object but response is an array', function() {
    var successSpy = jasmine.createSpy('successSpy');
    var failureSpy = jasmine.createSpy('failureSpy');

    $httpBackend.expect('GET', '/Customer/123').respond({id: 'abc'});

    $resource('/Customer/123').query()
      .$promise.then(successSpy, function(e) { failureSpy(e.message); });
    $httpBackend.flush();

    expect(successSpy).not.toHaveBeenCalled();
    expect(failureSpy).toHaveBeenCalled();
    expect(failureSpy.calls.mostRecent().args[0]).toEqualMinErr('$resource', 'badcfg',
        'Error in resource configuration for action `query`. ' +
        'Expected response to contain an array but got an object (Request: GET /Customer/123)');
  });

  it('should fail if action expects an array but response is an object', function() {
    var successSpy = jasmine.createSpy('successSpy');
    var failureSpy = jasmine.createSpy('failureSpy');

    $httpBackend.expect('GET', '/Customer/123').respond([1,2,3]);

    $resource('/Customer/123').get()
      .$promise.then(successSpy, function(e) { failureSpy(e.message); });
    $httpBackend.flush();

    expect(successSpy).not.toHaveBeenCalled();
    expect(failureSpy).toHaveBeenCalled();
    expect(failureSpy.calls.mostRecent().args[0]).toEqualMinErr('$resource', 'badcfg',
        'Error in resource configuration for action `get`. ' +
        'Expected response to contain an object but got an array (Request: GET /Customer/123)');
  });
});

describe('handling rejections', function() {
  var $exceptionHandler;
  var $httpBackend;
  var $resource;

  beforeEach(module('ngResource'));
  beforeEach(module(function($exceptionHandlerProvider) {
    $exceptionHandlerProvider.mode('log');
  }));

  beforeEach(inject(function(_$exceptionHandler_, _$httpBackend_, _$resource_) {
    $exceptionHandler = _$exceptionHandler_;
    $httpBackend = _$httpBackend_;
    $resource = _$resource_;

    $httpBackend.whenGET('/CreditCard').respond(404);
  }));


  it('should reject the promise even when there is an error callback', function() {
    var errorCb1 = jasmine.createSpy('errorCb1');
    var errorCb2 = jasmine.createSpy('errorCb2');
    var CreditCard = $resource('/CreditCard');

    CreditCard.get(noop, errorCb1).$promise.catch(errorCb2);
    $httpBackend.flush();

    expect(errorCb1).toHaveBeenCalledOnce();
    expect(errorCb2).toHaveBeenCalledOnce();
  });


  it('should report a PUR when no error callback or responseError interceptor is provided',
    function() {
      var CreditCard = $resource('/CreditCard');

      CreditCard.get();
      $httpBackend.flush();

      expect($exceptionHandler.errors.length).toBe(1);
      expect($exceptionHandler.errors[0]).toMatch(/^Possibly unhandled rejection/);
    }
  );


  it('should not report a PUR when an error callback or responseError interceptor is provided',
    function() {
      var CreditCard = $resource('/CreditCard', {}, {
        test1: {
          method: 'GET'
        },
        test2: {
          method: 'GET',
          interceptor: {responseError: function() { return {}; }}
        }
      });

      // With error callback
      CreditCard.test1(noop, noop);
      $httpBackend.flush();

      expect($exceptionHandler.errors.length).toBe(0);

      // With responseError interceptor
      CreditCard.test2();
      $httpBackend.flush();

      expect($exceptionHandler.errors.length).toBe(0);

      // With error callback and responseError interceptor
      CreditCard.test2(noop, noop);
      $httpBackend.flush();

      expect($exceptionHandler.errors.length).toBe(0);
    }
  );


  it('should report a PUR when the responseError interceptor returns a rejected promise',
    inject(function($q) {
      var CreditCard = $resource('/CreditCard', {}, {
        test: {
          method: 'GET',
          interceptor: {responseError: function() { return $q.reject({}); }}
        }
      });

      CreditCard.test();
      $httpBackend.flush();

      expect($exceptionHandler.errors.length).toBe(1);
      expect($exceptionHandler.errors[0]).toMatch(/^Possibly unhandled rejection/);
    })
  );


  it('should not swallow exceptions in success callback when error callback is provided',
    function() {
      $httpBackend.expectGET('/CreditCard/123').respond(null);
      var CreditCard = $resource('/CreditCard/:id');
      CreditCard.get({id: 123},
          function(res) { throw new Error('should be caught'); },
          function() {});

      $httpBackend.flush();
      expect($exceptionHandler.errors.length).toBe(1);
      expect($exceptionHandler.errors[0]).toMatch(/^Error: should be caught/);
    }
  );


  it('should not swallow exceptions in success callback when error callback is not provided',
    function() {
      $httpBackend.expectGET('/CreditCard/123').respond(null);
      var CreditCard = $resource('/CreditCard/:id');
      CreditCard.get({id: 123},
          function(res) { throw new Error('should be caught'); });

      $httpBackend.flush();
      expect($exceptionHandler.errors.length).toBe(1);
      expect($exceptionHandler.errors[0]).toMatch(/^Error: should be caught/);
    }
  );


  it('should not swallow exceptions in success callback when error callback is provided and has responseError interceptor',
    function() {
      $httpBackend.expectGET('/CreditCard/123').respond(null);
      var CreditCard = $resource('/CreditCard/:id', null, {
        get: {
          method: 'GET',
          interceptor: {responseError: function() {}}
        }
      });

      CreditCard.get({id: 123},
          function(res) { throw new Error('should be caught'); },
          function() {});

      $httpBackend.flush();
      expect($exceptionHandler.errors.length).toBe(1);
      expect($exceptionHandler.errors[0]).toMatch(/^Error: should be caught/);
    }
  );


  it('should not swallow exceptions in success callback when error callback is not provided and has responseError interceptor',
    function() {
      $httpBackend.expectGET('/CreditCard/123').respond(null);
      var CreditCard = $resource('/CreditCard/:id', null, {
        get: {
          method: 'GET',
          interceptor: {responseError: function() {}}
        }
      });

      CreditCard.get({id: 123},
          function(res) { throw new Error('should be caught'); });

      $httpBackend.flush();
      expect($exceptionHandler.errors.length).toBe(1);
      expect($exceptionHandler.errors[0]).toMatch(/^Error: should be caught/);
    }
  );


  it('should not propagate exceptions in success callback to the returned promise', function() {
    var successCallbackSpy = jasmine.createSpy('successCallback').and.throwError('error');
    var promiseResolveSpy = jasmine.createSpy('promiseResolve');
    var promiseRejectSpy = jasmine.createSpy('promiseReject');

    $httpBackend.expectGET('/CreditCard/123').respond(null);
    var CreditCard = $resource('/CreditCard/:id');
    CreditCard.get({id: 123}, successCallbackSpy).
      $promise.then(promiseResolveSpy, promiseRejectSpy);

    $httpBackend.flush();
    expect(successCallbackSpy).toHaveBeenCalled();
    expect(promiseResolveSpy).toHaveBeenCalledWith(jasmine.any(CreditCard));
    expect(promiseRejectSpy).not.toHaveBeenCalled();
  });


  it('should not be able to recover from inside the error callback', function() {
    var errorCallbackSpy = jasmine.createSpy('errorCallback').and.returnValue({id: 123});
    var promiseResolveSpy = jasmine.createSpy('promiseResolve');
    var promiseRejectSpy = jasmine.createSpy('promiseReject');

    $httpBackend.expectGET('/CreditCard/123').respond(404);
    var CreditCard = $resource('/CreditCard/:id');
    CreditCard.get({id: 123}, noop, errorCallbackSpy).
      $promise.then(promiseResolveSpy, promiseRejectSpy);

    $httpBackend.flush();
    expect(errorCallbackSpy).toHaveBeenCalled();
    expect(promiseResolveSpy).not.toHaveBeenCalled();
    expect(promiseRejectSpy).toHaveBeenCalledWith(jasmine.objectContaining({status: 404}));
  });


  describe('requestInterceptor', function() {
    var rejectReason = {'lol':'cat'};
    var $q, $rootScope;
    var successSpy, failureSpy, callback;

    beforeEach(inject(function(_$q_, _$rootScope_) {
      $q = _$q_;
      $rootScope = _$rootScope_;

      successSpy = jasmine.createSpy('successSpy');
      failureSpy = jasmine.createSpy('failureSpy');
      callback = jasmine.createSpy();
    }));

    it('should call requestErrorInterceptor if requestInterceptor throws an error', function() {
      var CreditCard = $resource('/CreditCard', {}, {
        query: {
          method: 'get',
          isArray: true,
          interceptor: {
            request: function() {
              throw rejectReason;
            },
            requestError: function(rejection) {
              callback(rejection);
              return $q.reject(rejection);
            }
          }
        }
      });

      var resource = CreditCard.query();
      resource.$promise.then(successSpy, failureSpy);
      $rootScope.$apply();

      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith(rejectReason);
      expect(successSpy).not.toHaveBeenCalled();
      expect(failureSpy).toHaveBeenCalledOnce();
      expect(failureSpy).toHaveBeenCalledWith(rejectReason);

      // Ensure that no requests were made.
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should abort the operation if a requestErrorInterceptor throws an exception', function() {
      var CreditCard = $resource('/CreditCard', {}, {
        query: {
          method: 'get',
          isArray: true,
          interceptor: {
            request: function() {
              return $q.reject();
            },
            requestError: function() {
              throw rejectReason;
            }
          }
        }
      });

      var resource = CreditCard.query();
      resource.$promise.then(successSpy, failureSpy);
      $rootScope.$apply();

      expect(resource.$resolved).toBeTruthy();
      expect(successSpy).not.toHaveBeenCalled();
      expect(failureSpy).toHaveBeenCalledOnce();
      expect(failureSpy).toHaveBeenCalledWith(rejectReason);

      // Ensure that no requests were made.
      $httpBackend.verifyNoOutstandingRequest();
    });
  });
});

describe('cancelling requests', function() {
  var httpSpy;
  var $httpBackend;
  var $resource;
  var $timeout;

  beforeEach(module('ngResource', function($provide) {
    $provide.decorator('$http', function($delegate) {
      httpSpy = jasmine.createSpy('$http').and.callFake($delegate);
      return httpSpy;
    });
  }));

  beforeEach(inject(function(_$httpBackend_, _$resource_, _$timeout_) {
    $httpBackend = _$httpBackend_;
    $resource = _$resource_;
    $timeout = _$timeout_;
  }));

  it('should accept numeric timeouts in actions and pass them to $http', function() {
    $httpBackend.whenGET('/CreditCard').respond({});

    var CreditCard = $resource('/CreditCard', {}, {
      get: {
        method: 'GET',
        timeout: 10000
      }
    });

    CreditCard.get();
    $httpBackend.flush();

    expect(httpSpy).toHaveBeenCalledOnce();
    expect(httpSpy.calls.argsFor(0)[0].timeout).toBe(10000);
  });

  it('should delete non-numeric timeouts in actions and log a $debug message',
    inject(function($log, $q) {
      spyOn($log, 'debug');
      $httpBackend.whenGET('/CreditCard').respond({});

      var CreditCard = $resource('/CreditCard', {}, {
        get: {
          method: 'GET',
          timeout: $q.defer().promise
        }
      });

      CreditCard.get();
      $httpBackend.flush();

      expect(httpSpy).toHaveBeenCalledOnce();
      expect(httpSpy.calls.argsFor(0)[0].timeout).toBeUndefined();
      expect($log.debug).toHaveBeenCalledOnceWith('ngResource:\n' +
          '  Only numeric values are allowed as `timeout`.\n' +
          '  Promises are not supported in $resource, because the same value would ' +
          'be used for multiple requests. If you are looking for a way to cancel ' +
          'requests, you should use the `cancellable` option.');
    })
  );

  it('should use `cancellable` value if passed a non-numeric `timeout` in an action',
    inject(function($log, $q, $rootScope) {
      spyOn($log, 'debug');
      $httpBackend.whenGET('/CreditCard').respond({});

      var CreditCard = $resource('/CreditCard', {}, {
        get: {
          method: 'GET',
          timeout: $q.defer().promise,
          cancellable: true
        }
      });

      var creditCard = CreditCard.get();
      $rootScope.$digest();
      expect(creditCard.$cancelRequest).toBeDefined();
      expect(httpSpy.calls.argsFor(0)[0].timeout).toEqual(jasmine.any($q));
      expect(httpSpy.calls.argsFor(0)[0].timeout.then).toBeDefined();

      expect($log.debug).toHaveBeenCalledOnceWith('ngResource:\n' +
          '  Only numeric values are allowed as `timeout`.\n' +
          '  Promises are not supported in $resource, because the same value would ' +
          'be used for multiple requests. If you are looking for a way to cancel ' +
          'requests, you should use the `cancellable` option.');
    })
  );

  it('should not create a `$cancelRequest` method for instance calls', function() {
    $httpBackend.whenPOST('/CreditCard').respond({});

    var CreditCard = $resource('/CreditCard', {}, {
      save1: {
        method: 'POST',
        cancellable: false
      },
      save2: {
        method: 'POST',
        cancellable: true
      }
    });

    var creditCard = new CreditCard();

    var promise1 = creditCard.$save1();
    expect(promise1.$cancelRequest).toBeUndefined();
    expect(creditCard.$cancelRequest).toBeUndefined();

    var promise2 = creditCard.$save2();
    expect(promise2.$cancelRequest).toBeUndefined();
    expect(creditCard.$cancelRequest).toBeUndefined();

    $httpBackend.flush();
    expect(promise1.$cancelRequest).toBeUndefined();
    expect(promise2.$cancelRequest).toBeUndefined();
    expect(creditCard.$cancelRequest).toBeUndefined();
  });

  it('should not create a `$cancelRequest` method for non-cancellable calls', function() {
    var CreditCard = $resource('/CreditCard', {}, {
      get: {
        method: 'GET',
        cancellable: false
      }
    });

    var creditCard = CreditCard.get();

    expect(creditCard.$cancelRequest).toBeUndefined();
  });

  it('should also take into account `options.cancellable`', function() {
    var options = {cancellable: true};
    var CreditCard = $resource('/CreditCard', {}, {
      get1: {method: 'GET', cancellable: false},
      get2: {method: 'GET', cancellable: true},
      get3: {method: 'GET'}
    }, options);

    var creditCard1 = CreditCard.get1();
    var creditCard2 = CreditCard.get2();
    var creditCard3 = CreditCard.get3();

    expect(creditCard1.$cancelRequest).toBeUndefined();
    expect(creditCard2.$cancelRequest).toBeDefined();
    expect(creditCard3.$cancelRequest).toBeDefined();

    options = {cancellable: false};
    CreditCard = $resource('/CreditCard', {}, {
      get1: {method: 'GET', cancellable: false},
      get2: {method: 'GET', cancellable: true},
      get3: {method: 'GET'}
    }, options);

    creditCard1 = CreditCard.get1();
    creditCard2 = CreditCard.get2();
    creditCard3 = CreditCard.get3();

    expect(creditCard1.$cancelRequest).toBeUndefined();
    expect(creditCard2.$cancelRequest).toBeDefined();
    expect(creditCard3.$cancelRequest).toBeUndefined();
  });

  it('should accept numeric timeouts in cancellable actions and cancel the request when timeout occurs', function() {
    $httpBackend.whenGET('/CreditCard').respond({});

    var CreditCard = $resource('/CreditCard', {}, {
      get: {
        method: 'GET',
        timeout: 10000,
        cancellable: true
      }
    });

    var ccs = CreditCard.get();
    ccs.$promise.catch(noop);
    $timeout.flush();
    expect($httpBackend.flush).toThrow(new Error('No pending request to flush !'));

    CreditCard.get();
    expect($httpBackend.flush).not.toThrow();

  });

  it('should cancel the request (if cancellable), when calling `$cancelRequest`', function() {
    $httpBackend.whenGET('/CreditCard').respond({});

    var CreditCard = $resource('/CreditCard', {}, {
      get: {
        method: 'GET',
        cancellable: true
      }
    });

    var ccs = CreditCard.get();
    ccs.$cancelRequest();
    expect($httpBackend.flush).toThrow(new Error('No pending request to flush !'));

    CreditCard.get();
    expect($httpBackend.flush).not.toThrow();
  });

  it('should cancel the request, when calling `$cancelRequest` in cancellable actions with timeout defined', function() {
    $httpBackend.whenGET('/CreditCard').respond({});

    var CreditCard = $resource('/CreditCard', {}, {
      get: {
        method: 'GET',
        timeout: 10000,
        cancellable: true
      }
    });

    var ccs = CreditCard.get();
    ccs.$cancelRequest();
    expect($httpBackend.flush).toThrow(new Error('No pending request to flush !'));

    CreditCard.get();
    expect($httpBackend.flush).not.toThrow();
  });

  it('should reset `$cancelRequest` after the response arrives', function() {
    $httpBackend.whenGET('/CreditCard').respond({});

    var CreditCard = $resource('/CreditCard', {}, {
      get: {
        method: 'GET',
        cancellable: true
      }
    });

    var creditCard = CreditCard.get();

    expect(creditCard.$cancelRequest).not.toBe(noop);

    $httpBackend.flush();

    expect(creditCard.$cancelRequest).toBe(noop);
  });

  it('should not break when calling old `$cancelRequest` after the response arrives', function() {
    $httpBackend.whenGET('/CreditCard').respond({});

    var CreditCard = $resource('/CreditCard', {}, {
      get: {
        method: 'GET',
        cancellable: true
      }
    });

    var creditCard = CreditCard.get();
    var cancelRequest = creditCard.$cancelRequest;

    $httpBackend.flush();

    expect(cancelRequest).not.toBe(noop);
    expect(cancelRequest).not.toThrow();
  });
});

describe('configuring `cancellable` on the provider', function() {
  var $resource;

  beforeEach(module('ngResource', function($resourceProvider) {
    $resourceProvider.defaults.cancellable = true;
  }));

  beforeEach(inject(function(_$resource_) {
    $resource = _$resource_;
  }));

  it('should also take into account `$resourceProvider.defaults.cancellable`', function() {
    var CreditCard = $resource('/CreditCard', {}, {
      get1: {method: 'GET', cancellable: false},
      get2: {method: 'GET', cancellable: true},
      get3: {method: 'GET'}
    });

    var creditCard1 = CreditCard.get1();
    var creditCard2 = CreditCard.get2();
    var creditCard3 = CreditCard.get3();

    expect(creditCard1.$cancelRequest).toBeUndefined();
    expect(creditCard2.$cancelRequest).toBeDefined();
    expect(creditCard3.$cancelRequest).toBeDefined();
  });
});
});
