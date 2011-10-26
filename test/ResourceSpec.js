'use strict';

describe("resource", function() {
  var resource, CreditCard, callback;

  beforeEach(inject(
    function(service) {
      service('$xhr.error', function(){return jasmine.createSpy('xhr.error')});
      service.alias('$xhr.error', '$xhrError');
    },
    function($xhr) {
      resource = new ResourceFactory($xhr);
      CreditCard = resource.route('/CreditCard/:id:verb', {id:'@id.key'}, {
        charge:{
          method:'POST',
          params:{verb:'!charge'}
        }
      });
      callback = jasmine.createSpy();
    })
  );

  it("should build resource", function() {
    expect(typeof CreditCard).toBe('function');
    expect(typeof CreditCard.get).toBe('function');
    expect(typeof CreditCard.save).toBe('function');
    expect(typeof CreditCard.remove).toBe('function');
    expect(typeof CreditCard['delete']).toBe('function');
    expect(typeof CreditCard.query).toBe('function');
  });

  it('should default to empty parameters', inject(function($browser) {
    $browser.xhr.expectGET('URL').respond({});
    resource.route('URL').query();
  }));

  it('should ignore slashes of undefinend parameters', inject(function($browser) {
    var R = resource.route('/Path/:a/:b/:c');
    $browser.xhr.expectGET('/Path').respond({});
    $browser.xhr.expectGET('/Path/1').respond({});
    $browser.xhr.expectGET('/Path/2/3').respond({});
    $browser.xhr.expectGET('/Path/4/5/6').respond({});
    R.get({});
    R.get({a:1});
    R.get({a:2, b:3});
    R.get({a:4, b:5, c:6});
  }));

  it('should correctly encode url params', inject(function($browser) {
    var R = resource.route('/Path/:a');
    $browser.xhr.expectGET('/Path/foo%231').respond({});
    $browser.xhr.expectGET('/Path/doh!@foo?bar=baz%231').respond({});
    R.get({a: 'foo#1'});
    R.get({a: 'doh!@foo', bar: 'baz#1'});
  }));

  it('should not encode @ in url params', inject(function($browser) {
    //encodeURIComponent is too agressive and doesn't follow http://www.ietf.org/rfc/rfc3986.txt
    //with regards to the character set (pchar) allowed in path segments
    //so we need this test to make sure that we don't over-encode the params and break stuff like
    //buzz api which uses @self

    var R = resource.route('/Path/:a');
    $browser.xhr.expectGET('/Path/doh@fo%20o?!do%26h=g%3Da+h&:bar=$baz@1').respond({});
    R.get({a: 'doh@fo o', ':bar': '$baz@1', '!do&h': 'g=a h'});
  }));

  it('should encode & in url params', inject(function($browser) {
    var R = resource.route('/Path/:a');
    $browser.xhr.expectGET('/Path/doh&foo?bar=baz%261').respond({});
    R.get({a: 'doh&foo', bar: 'baz&1'});
  }));

  it("should build resource with default param", inject(function($browser) {
    $browser.xhr.expectGET('/Order/123/Line/456.visa?minimum=0.05').respond({id:'abc'});
    var LineItem = resource.route('/Order/:orderId/Line/:id:verb', {orderId: '123', id: '@id.key', verb:'.visa', minimum:0.05});
    var item = LineItem.get({id:456});
    $browser.xhr.flush();
    nakedExpect(item).toEqual({id:'abc'});
  }));

  it("should build resource with action default param overriding default param", inject(function($browser) {
    $browser.xhr.expectGET('/Customer/123').respond({id:'abc'});
    var TypeItem = resource.route('/:type/:typeId', {type: 'Order'},
                                  {get: {method: 'GET', params: {type: 'Customer'}}});
    var item = TypeItem.get({typeId:123});
    $browser.xhr.flush();
    nakedExpect(item).toEqual({id:'abc'});
  }));

  it("should create resource", inject(function($browser) {
    $browser.xhr.expectPOST('/CreditCard', {name:'misko'}).respond({id:123, name:'misko'});

    var cc = CreditCard.save({name:'misko'}, callback);
    nakedExpect(cc).toEqual({name:'misko'});
    expect(callback).not.toHaveBeenCalled();
    $browser.xhr.flush();
    nakedExpect(cc).toEqual({id:123, name:'misko'});
    expect(callback).toHaveBeenCalledWith(cc);
  }));

  it("should read resource", inject(function($browser) {
    $browser.xhr.expectGET("/CreditCard/123").respond({id:123, number:'9876'});
    var cc = CreditCard.get({id:123}, callback);
    expect(cc instanceof CreditCard).toBeTruthy();
    nakedExpect(cc).toEqual({});
    expect(callback).not.toHaveBeenCalled();
    $browser.xhr.flush();
    nakedExpect(cc).toEqual({id:123, number:'9876'});
    expect(callback).toHaveBeenCalledWith(cc);
  }));

  it("should read partial resource", inject(function($browser) {
    $browser.xhr.expectGET("/CreditCard").respond([{id:{key:123}}]);
    $browser.xhr.expectGET("/CreditCard/123").respond({id:{key:123}, number:'9876'});
    var ccs = CreditCard.query();
    $browser.xhr.flush();
    expect(ccs.length).toEqual(1);
    var cc = ccs[0];
    expect(cc instanceof CreditCard).toBeTruthy();
    expect(cc.number).not.toBeDefined();
    cc.$get(callback);
    $browser.xhr.flush();
    expect(callback).toHaveBeenCalledWith(cc);
    expect(cc.number).toEqual('9876');
  }));

  it("should update resource", inject(function($browser) {
    $browser.xhr.expectPOST('/CreditCard/123', {id:{key:123}, name:'misko'}).respond({id:{key:123}, name:'rama'});

    var cc = CreditCard.save({id:{key:123}, name:'misko'}, callback);
    nakedExpect(cc).toEqual({id:{key:123}, name:'misko'});
    expect(callback).not.toHaveBeenCalled();
    $browser.xhr.flush();
  }));

  it("should query resource", inject(function($browser) {
    $browser.xhr.expectGET("/CreditCard?key=value").respond([{id:1}, {id:2}]);

    var ccs = CreditCard.query({key:'value'}, callback);
    expect(ccs).toEqual([]);
    expect(callback).not.toHaveBeenCalled();
    $browser.xhr.flush();
    nakedExpect(ccs).toEqual([{id:1}, {id:2}]);
    expect(callback).toHaveBeenCalledWith(ccs);
  }));

  it("should have all arguments optional", inject(function($browser) {
    $browser.xhr.expectGET('/CreditCard').respond([{id:1}]);
    var log = '';
    var ccs = CreditCard.query(function() { log += 'cb;'; });
    $browser.xhr.flush();
    nakedExpect(ccs).toEqual([{id:1}]);
    expect(log).toEqual('cb;');
  }));

  it('should delete resource and call callback', inject(function($browser) {
    $browser.xhr.expectDELETE("/CreditCard/123").respond(200, {});

    CreditCard.remove({id:123}, callback);
    expect(callback).not.toHaveBeenCalled();
    $browser.xhr.flush();
    nakedExpect(callback.mostRecentCall.args).toEqual([{}]);

    callback.reset();
    $browser.xhr.expectDELETE("/CreditCard/333").respond(204, null);
    CreditCard.remove({id:333}, callback);
    expect(callback).not.toHaveBeenCalled();
    $browser.xhr.flush();
    nakedExpect(callback.mostRecentCall.args).toEqual([{}]);
  }));

  it('should post charge verb', inject(function($browser) {
    $browser.xhr.expectPOST('/CreditCard/123!charge?amount=10', {auth:'abc'}).respond({success:'ok'});

    CreditCard.charge({id:123, amount:10},{auth:'abc'}, callback);
  }));

  it('should post charge verb on instance', inject(function($browser) {
    $browser.xhr.expectPOST('/CreditCard/123!charge?amount=10', {id:{key:123}, name:'misko'}).respond({success:'ok'});

    var card = new CreditCard({id:{key:123}, name:'misko'});
    card.$charge({amount:10}, callback);
  }));

  it('should create on save', inject(function($browser) {
    $browser.xhr.expectPOST('/CreditCard', {name:'misko'}).respond({id:123});
    var cc = new CreditCard();
    expect(cc.$get).toBeDefined();
    expect(cc.$query).toBeDefined();
    expect(cc.$remove).toBeDefined();
    expect(cc.$save).toBeDefined();

    cc.name = 'misko';
    cc.$save(callback);
    nakedExpect(cc).toEqual({name:'misko'});
    $browser.xhr.flush();
    nakedExpect(cc).toEqual({id:123});
    expect(callback).toHaveBeenCalledWith(cc);
  }));

  it('should not mutate the resource object if response contains no body', inject(function($browser) {
    var data = {id:{key:123}, number:'9876'};
    $browser.xhr.expectGET("/CreditCard/123").respond(data);
    var cc = CreditCard.get({id:123});
    $browser.xhr.flush();
    expect(cc instanceof CreditCard).toBeTruthy();
    var idBefore = cc.id;

    $browser.xhr.expectPOST("/CreditCard/123", data).respond('');
    cc.$save();
    $browser.xhr.flush();
    expect(idBefore).toEqual(cc.id);
  }));

  it('should bind default parameters', inject(function($browser) {
    $browser.xhr.expectGET('/CreditCard/123.visa?minimum=0.05').respond({id:123});
    var Visa = CreditCard.bind({verb:'.visa', minimum:0.05});
    var visa = Visa.get({id:123});
    $browser.xhr.flush();
    nakedExpect(visa).toEqual({id:123});
  }));

  it('should excersize full stack', inject(function($rootScope, $browser, $resource, $compile) {
    $compile('<div></div>')($rootScope);
    var Person = $resource('/Person/:id');
    $browser.xhr.expectGET('/Person/123').respond('\n{\n"name":\n"misko"\n}\n');
    var person = Person.get({id:123});
    $browser.xhr.flush();
    expect(person.name).toEqual('misko');
  }));

  it('should return the same object when verifying the cache', inject(function($rootScope, $compile) {
    $compile('<div></div>')($rootScope);
    var $browser = $rootScope.$service('$browser');
    var $resource = $rootScope.$service('$resource');
    var Person = $resource('/Person/:id', null, {query: {method:'GET', isArray: true, verifyCache: true}});
    $browser.xhr.expectGET('/Person/123').respond('[\n{\n"name":\n"misko"\n}\n]');
    var person = Person.query({id:123});
    $browser.xhr.flush();
    expect(person[0].name).toEqual('misko');

    $browser.xhr.expectGET('/Person/123').respond('[\n{\n"name":\n"rob"\n}\n]');
    var person2 = Person.query({id:123});
    $browser.defer.flush();

    expect(person2[0].name).toEqual('misko');
    var person2Cache = person2;
    $browser.xhr.flush();
    expect(person2Cache).toEqual(person2);
    expect(person2[0].name).toEqual('rob');
  }));

  describe('failure mode', function() {
    var ERROR_CODE = 500,
        ERROR_RESPONSE = 'Server Error',
        errorCB;

    beforeEach(function() {
      errorCB = jasmine.createSpy();
    });

    it('should report error when non 2xx if error callback is not provided',
        inject(function($browser, $xhrError) {
      $browser.xhr.expectGET('/CreditCard/123').respond(ERROR_CODE, ERROR_RESPONSE);
      CreditCard.get({id:123});
      $browser.xhr.flush();
      expect($xhrError).toHaveBeenCalled();
    }));

    it('should call the error callback if provided on non 2xx response',
        inject(function($browser, $xhrError) {
      $browser.xhr.expectGET('/CreditCard/123').respond(ERROR_CODE, ERROR_RESPONSE);
      CreditCard.get({id:123}, callback, errorCB);
      $browser.xhr.flush();
      expect(errorCB).toHaveBeenCalledWith(500, ERROR_RESPONSE);
      expect(callback).not.toHaveBeenCalled();
      expect($xhrError).not.toHaveBeenCalled();
    }));

    it('should call the error callback if provided on non 2xx response',
        inject(function($browser, $xhrError) {
      $browser.xhr.expectGET('/CreditCard').respond(ERROR_CODE, ERROR_RESPONSE);
      CreditCard.get(callback, errorCB);
      $browser.xhr.flush();
      expect(errorCB).toHaveBeenCalledWith(500, ERROR_RESPONSE);
      expect(callback).not.toHaveBeenCalled();
      expect($xhrError).not.toHaveBeenCalled();
    }));
  });
});
