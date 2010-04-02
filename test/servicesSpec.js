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
    scope.$location('http://host:123/p/a/t/h.html?query=value#path?key=value');
    expect(scope.$location.href).toEqual("http://host:123/p/a/t/h.html?query=value#path?key=value");
    expect(scope.$location.protocol).toEqual("http");
    expect(scope.$location.host).toEqual("host");
    expect(scope.$location.port).toEqual("123");
    expect(scope.$location.path).toEqual("/p/a/t/h.html");
    expect(scope.$location.search).toEqual({query:'value'});
    expect(scope.$location.hash).toEqual('path?key=value');
    expect(scope.$location.hashPath).toEqual('path');
    expect(scope.$location.hashSearch).toEqual({key:'value'});

    scope.$location.hashPath = 'page=http://path';
    scope.$location.hashSearch = {k:'a=b'};

    expect(scope.$location()).toEqual('http://host:123/p/a/t/h.html?query=value#path?key=valuepage=http://path?k=a%3Db');
  });

  it('should parse file://', function(){
    scope.$location('file:///Users/Shared/misko/work/angular.js/scenario/widgets.html');
    expect(scope.$location.href).toEqual("file:///Users/Shared/misko/work/angular.js/scenario/widgets.html");
    expect(scope.$location.protocol).toEqual("file");
    expect(scope.$location.host).toEqual("");
    expect(scope.$location.port).toEqual(null);
    expect(scope.$location.path).toEqual("/Users/Shared/misko/work/angular.js/scenario/widgets.html");
    expect(scope.$location.search).toEqual({});
    expect(scope.$location.hash).toEqual('');
    expect(scope.$location.hashPath).toEqual('');
    expect(scope.$location.hashSearch).toEqual({});

    expect(scope.$location()).toEqual('file:///Users/Shared/misko/work/angular.js/scenario/widgets.html');
  });
});
