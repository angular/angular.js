describe("resource", function() {
  var xhr, resource, CreditCard, callback;

  beforeEach(function(){
    var browser = new MockBrowser();
    xhr = browser.xhr;
    resource = new ResourceFactory(xhr);
    CreditCard = resource.route('/CreditCard/:id:verb', {id:'@id.key'}, {
      charge:{
        method:'POST',
        params:{verb:'!charge'}
      }
    });
    callback = jasmine.createSpy();
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
    xhr.expectGET('URL').respond({});
    resource.route('URL').query();
  });

  it("should build resource with default param", function(){
    xhr.expectGET('/Order/123/Line/456.visa?minimum=0.05').respond({id:'abc'});
    xhr.expectGET('/Order/123/Line/456.visa?minimum=0.05').respond({id:'ddd'});
    var LineItem = resource.route('/Order/:orderId/Line/:id:verb', {orderId: '123', id: '@id.key', verb:'.visa', minimum:0.05});
    var item = LineItem.get({id:456});
    xhr.flush();
    nakedExpect(item).toEqual({id:'abc'});
  });

  it("should create resource", function(){
    xhr.expectPOST('/CreditCard', {name:'misko'}).respond({id:123, name:'misko'});

    var cc = CreditCard.save({name:'misko'}, callback);
    nakedExpect(cc).toEqual({name:'misko'});
    expect(callback).wasNotCalled();
    xhr.flush();
    nakedExpect(cc).toEqual({id:123, name:'misko'});
    expect(callback).wasCalledWith(cc);
  });

  it("should read resource", function(){
    xhr.expectGET("/CreditCard/123").respond({id:123, number:'9876'});
    var cc = CreditCard.get({id:123}, callback);
    expect(cc instanceof CreditCard).toBeTruthy();
    nakedExpect(cc).toEqual({});
    expect(callback).wasNotCalled();
    xhr.flush();
    nakedExpect(cc).toEqual({id:123, number:'9876'});
    expect(callback).wasCalledWith(cc);
  });

  it("should update resource", function(){
    xhr.expectPOST('/CreditCard/123', {id:{key:123}, name:'misko'}).respond({id:{key:123}, name:'rama'});

    var cc = CreditCard.save({id:{key:123}, name:'misko'}, callback);
    nakedExpect(cc).toEqual({id:{key:123}, name:'misko'});
    expect(callback).wasNotCalled();
    xhr.flush();
  });

  it("should query resource", function(){
    xhr.expectGET("/CreditCard?key=value").respond([{id:1}, {id:2}]);

    var ccs = CreditCard.query({key:'value'}, callback);
    expect(ccs).toEqual([]);
    expect(callback).wasNotCalled();
    xhr.flush();
    nakedExpect(ccs).toEqual([{id:1}, {id:2}]);
    expect(callback).wasCalledWith(ccs);
  });

  it("should have all arguments optional", function(){
    xhr.expectGET('/CreditCard').respond([{id:1}]);
    var log = '';
    var ccs = CreditCard.query(function(){ log += 'cb;'; });
    xhr.flush();
    nakedExpect(ccs).toEqual([{id:1}]);
    expect(log).toEqual('cb;');
  });

  it('should delete resource', function(){
    xhr.expectDELETE("/CreditCard/123").respond({});

    CreditCard.remove({id:123}, callback);
    expect(callback).wasNotCalled();
    xhr.flush();
    nakedExpect(callback.mostRecentCall.args).toEqual([{}]);
  });

  it('should post charge verb', function(){
    xhr.expectPOST('/CreditCard/123!charge?amount=10', {auth:'abc'}).respond({success:'ok'});

    CreditCard.charge({id:123, amount:10},{auth:'abc'}, callback);
  });

  it('should create on save', function(){
    xhr.expectPOST('/CreditCard', {name:'misko'}).respond({id:123});
    var cc = new CreditCard();
    expect(cc.$get).not.toBeDefined();
    expect(cc.$query).not.toBeDefined();
    expect(cc.$remove).toBeDefined();
    expect(cc.$save).toBeDefined();

    cc.name = 'misko';
    cc.$save(callback);
    nakedExpect(cc).toEqual({name:'misko'});
    xhr.flush();
    nakedExpect(cc).toEqual({id:123});
    expect(callback).wasCalledWith(cc);
  });

  it('should bind default parameters', function(){
    xhr.expectGET('/CreditCard/123.visa?minimum=0.05').respond({id:123});
    var Visa = CreditCard.bind({verb:'.visa', minimum:0.05});
    var visa = Visa.get({id:123});
    xhr.flush();
    nakedExpect(visa).toEqual({id:123});
  });

  it('should excersize full stack', function(){
    var scope = angular.compile('<div></div>');
    var Person = scope.$resource('/Person/:id');
    scope.$browser.xhr.expectGET('/Person/123').respond('\n{\nname:\n"misko"\n}\n');
    var person = Person.get({id:123});
    scope.$browser.xhr.flush();
    expect(person.name).toEqual('misko');
  });

  describe('failure mode', function(){
    it('should report error when non 200', function(){
      xhr.expectGET('/CreditCard/123').respond(500, "Server Error");
      var cc = CreditCard.get({id:123});
      try {
        xhr.flush();
        fail('expected exception, non thrown');
      } catch (e) {
        expect(e.status).toEqual(500);
        expect(e.response).toEqual('Server Error');
        expect(e.message).toEqual('500: Server Error');
      }
    });
  });

});
