describe("services", function(){
  var scope;

  beforeEach(function(){
    scope = createScope({
      $config: {
        'location': {'get':noop, 'set':noop, 'watch':noop}
      }
    }, serviceAdapter(angularService));
  });

  it("should inject $window", function(){
    expect(scope.$window).toEqual(window);
  });

  it("should inject $location", function(){
    scope.$location('http://host:1234/p/a/t/h?query=value#path?key=value');
    expect(scope.$location.href).toEqual("http://host:123/p/a/t/h?query=value#path?key=value");
    expect(scope.$location.protocol).toEqual("http");
    expect(scope.$location.host).toEqual("host");
    expect(scope.$location.port).toEqual("1234");
    expect(scope.$location.path).toEqual("/p/a/t/h");
    expect(scope.$location.search).toEqual({query:'value'});
    expect(scope.$location.hash).toEqual('path?key=value');
    expect(scope.$location.hashPath).toEqual('path');
    expect(scope.$location.hashSearch).toEqual({key:'value'});

    scope.$anchor.path = 'page=http://path';
    scope.$anchor.param = {k:'a=b'};

    expect(scope.$anchor()).toEqual('page=http://path?k=a%3Db');

  });
});
