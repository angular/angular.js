'use strict';

describe("resource", function() {
  var scope, $http, $httpBackend, $resource, CreditCard, callback;

  beforeEach(function() {
    scope = angular.scope();
    $httpBackend = scope.$service('$httpBackend');
    $resource = new ResourceFactory(scope.$service('$http'));
    CreditCard = $resource.route('/CreditCard/:id:verb', {id: '@id.key'}, {
      charge:{
        method:'POST',
        params:{verb:'!charge'}
      }
    });
    callback = jasmine.createSpy();
  });

  afterEach(function() {
    $httpBackend.verifyExpectations();
  });

  it("should build resource", function(){
    expect(typeof CreditCard).toBe('function');
    expect(typeof CreditCard.get).toBe('function');
    expect(typeof CreditCard.save).toBe('function');
    expect(typeof CreditCard.remove).toBe('function');
    expect(typeof CreditCard['delete']).toBe('function');
    expect(typeof CreditCard.query).toBe('function');
  });

  it('should default to empty parameters', function(){
    $httpBackend.expect('GET', 'URL').respond('{}');
    $resource.route('URL').query();
  });

  it('should ignore slashes of undefinend parameters', function(){
    var R = $resource.route('/Path/:a/:b/:c');

    $httpBackend.when('GET').then('{}');
    $httpBackend.expect('GET', '/Path');
    $httpBackend.expect('GET', '/Path/1');
    $httpBackend.expect('GET', '/Path/2/3');
    $httpBackend.expect('GET', '/Path/4/5/6');

    R.get({});
    R.get({a:1});
    R.get({a:2, b:3});
    R.get({a:4, b:5, c:6});
  });

  it('should correctly encode url params', function(){
    var R = $resource.route('/Path/:a');

    $httpBackend.expect('GET', '/Path/foo%231').respond('{}');
    $httpBackend.expect('GET', '/Path/doh!@foo?bar=baz%231').respond('{}');

    R.get({a: 'foo#1'});
    R.get({a: 'doh!@foo', bar: 'baz#1'});
  });

  it('should not encode @ in url params', function() {
    //encodeURIComponent is too agressive and doesn't follow http://www.ietf.org/rfc/rfc3986.txt
    //with regards to the character set (pchar) allowed in path segments
    //so we need this test to make sure that we don't over-encode the params and break stuff like
    //buzz api which uses @self

    var R = $resource.route('/Path/:a');
    $httpBackend.expect('GET', '/Path/doh@fo%20o?!do%26h=g%3Da+h&:bar=$baz@1').respond('{}');
    R.get({a: 'doh@fo o', ':bar': '$baz@1', '!do&h': 'g=a h'});
  });

  it('should encode & in url params', function() {
    var R = $resource.route('/Path/:a');
    $httpBackend.expect('GET', '/Path/doh&foo?bar=baz%261').respond('{}');
    R.get({a: 'doh&foo', bar: 'baz&1'});
  });

  it('should build resource with default param', function(){
    $httpBackend.expect('GET', '/Order/123/Line/456.visa?minimum=0.05').respond({id: 'abc'});
    var LineItem = $resource.route('/Order/:orderId/Line/:id:verb',
                                   {orderId: '123', id: '@id.key', verb:'.visa', minimum: 0.05});
    var item = LineItem.get({id: 456});
    $httpBackend.flush();
    nakedExpect(item).toEqual({id:'abc'});
  });

  it("should create resource", function(){
    $httpBackend.expect('POST', '/CreditCard', '{"name":"misko"}').respond({id: 123, name: 'misko'});

    var cc = CreditCard.save({name: 'misko'}, callback);
    nakedExpect(cc).toEqual({name: 'misko'});
    expect(callback).not.toHaveBeenCalled();

    $httpBackend.flush();
    nakedExpect(cc).toEqual({id: 123, name: 'misko'});
    expect(callback).toHaveBeenCalledWith(cc);
  });

  it("should read resource", function(){
    $httpBackend.expect('GET', '/CreditCard/123').respond({id: 123, number: '9876'});
    var cc = CreditCard.get({id: 123}, callback);

    expect(cc instanceof CreditCard).toBeTruthy();
    nakedExpect(cc).toEqual({});
    expect(callback).not.toHaveBeenCalled();


    $httpBackend.flush();
    nakedExpect(cc).toEqual({id: 123, number: '9876'});
    expect(callback).toHaveBeenCalledWith(cc);
  });

  it("should read partial resource", function(){
    $httpBackend.expect('GET', '/CreditCard').respond([{id:{key:123}}]);
    $httpBackend.expect('GET', '/CreditCard/123').respond({id: {key: 123}, number: '9876'});

    var ccs = CreditCard.query();

    $httpBackend.flush();
    expect(ccs.length).toEqual(1);

    var cc = ccs[0];
    expect(cc instanceof CreditCard).toBe(true);
    expect(cc.number).toBeUndefined();

    cc.$get(callback);
    $httpBackend.flush();
    expect(callback).toHaveBeenCalledWith(cc);
    expect(cc.number).toEqual('9876');
  });

  it("should update resource", function(){
    $httpBackend.expect('POST', '/CreditCard/123', '{"id":{"key":123},"name":"misko"}')
                .respond({id: {key: 123}, name: 'rama'});

    var cc = CreditCard.save({id: {key: 123}, name: 'misko'}, callback);
    nakedExpect(cc).toEqual({id:{key:123}, name:'misko'});
    expect(callback).not.toHaveBeenCalled();
    $httpBackend.flush();
  });

  it("should query resource", function(){
    $httpBackend.expect('GET', '/CreditCard?key=value').respond([{id: 1}, {id: 2}]);

    var ccs = CreditCard.query({key: 'value'}, callback);
    expect(ccs).toEqual([]);
    expect(callback).not.toHaveBeenCalled();

    $httpBackend.flush();
    nakedExpect(ccs).toEqual([{id:1}, {id:2}]);
    expect(callback).toHaveBeenCalledWith(ccs);
  });

  it("should have all arguments optional", function(){
    $httpBackend.expect('GET', '/CreditCard').respond([{id:1}]);

    var log = '';
    var ccs = CreditCard.query(function(){ log += 'cb;'; });

    $httpBackend.flush();
    nakedExpect(ccs).toEqual([{id:1}]);
    expect(log).toEqual('cb;');
  });

  it('should delete resource and call callback', function(){
    $httpBackend.expect('DELETE', '/CreditCard/123').respond({});
    $httpBackend.expect('DELETE', '/CreditCard/333').respond(204, null);

    CreditCard.remove({id:123}, callback);
    expect(callback).not.toHaveBeenCalled();

    $httpBackend.flush();
    nakedExpect(callback.mostRecentCall.args).toEqual([{}]);

    callback.reset();
    CreditCard.remove({id:333}, callback);
    expect(callback).not.toHaveBeenCalled();

    $httpBackend.flush();
    nakedExpect(callback.mostRecentCall.args).toEqual([{}]);
  });

  it('should post charge verb', function(){
    $httpBackend.expect('POST', '/CreditCard/123!charge?amount=10', '{"auth":"abc"}').respond({success: 'ok'});
    CreditCard.charge({id:123, amount:10}, {auth:'abc'}, callback);
  });

  it('should post charge verb on instance', function(){
    $httpBackend.expect('POST', '/CreditCard/123!charge?amount=10',
        '{"id":{"key":123},"name":"misko"}').respond({success: 'ok'});

    var card = new CreditCard({id:{key:123}, name:'misko'});
    card.$charge({amount:10}, callback);
  });

  it('should create on save', function(){
    $httpBackend.expect('POST', '/CreditCard', '{"name":"misko"}').respond({id: 123});

    var cc = new CreditCard();
    expect(cc.$get).toBeDefined();
    expect(cc.$query).toBeDefined();
    expect(cc.$remove).toBeDefined();
    expect(cc.$save).toBeDefined();

    cc.name = 'misko';
    cc.$save(callback);
    nakedExpect(cc).toEqual({name:'misko'});

    $httpBackend.flush();
    nakedExpect(cc).toEqual({id:123});
    expect(callback).toHaveBeenCalledWith(cc);
  });

  it('should not mutate the resource object if response contains no body', function(){
    var data = {id:{key:123}, number:'9876'};
    $httpBackend.expect('GET', '/CreditCard/123').respond(data);
    $httpBackend.expect('POST', '/CreditCard/123', toJson(data)).respond('');

    var cc = CreditCard.get({id:123});
    $httpBackend.flush();
    expect(cc instanceof CreditCard).toBe(true);

    var idBefore = cc.id;
    cc.$save();
    $httpBackend.flush();
    expect(idBefore).toEqual(cc.id);
  });

  it('should bind default parameters', function(){
    $httpBackend.expect('GET', '/CreditCard/123.visa?minimum=0.05').respond({id: 123});
    var Visa = CreditCard.bind({verb:'.visa', minimum:0.05});
    var visa = Visa.get({id:123});
    $httpBackend.flush();
    nakedExpect(visa).toEqual({id:123});
  });

  it('should excersize full stack', function(){
    var $resource = scope.$service('$resource');
    var Person = $resource('/Person/:id');

    $httpBackend.expect('GET', '/Person/123').respond('\n{\n"name":\n"misko"\n}\n');
    var person = Person.get({id:123});
    $httpBackend.flush();
    expect(person.name).toEqual('misko');
  });

  describe('failure mode', function() {
    var ERROR_CODE = 500,
        ERROR_RESPONSE = 'Server Error',
        errorCB;

    beforeEach(function() {
      errorCB = jasmine.createSpy('error').andCallFake(function(response, status) {
        expect(response).toBe(ERROR_RESPONSE);
        expect(status).toBe(ERROR_CODE);
      });
    });

    it('should call the error callback if provided on non 2xx response', function() {
      $httpBackend.expect('GET', '/CreditCard/123').respond(ERROR_CODE, ERROR_RESPONSE);

      CreditCard.get({id:123}, callback, errorCB);
      $httpBackend.flush();
      expect(errorCB).toHaveBeenCalledOnce();
      expect(callback).not.toHaveBeenCalled();
    });

    it('should call the error callback if provided on non 2xx response', function() {
      $httpBackend.expect('GET', '/CreditCard').respond(ERROR_CODE, ERROR_RESPONSE);

      CreditCard.get(callback, errorCB);
      $httpBackend.flush();
      expect(errorCB).toHaveBeenCalledOnce();
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
