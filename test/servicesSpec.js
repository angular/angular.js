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

  it("should inject $anchor", function(){
    scope.$anchor('#path?key=value');
    expect(scope.$anchor.path).toEqual("path");
    expect(scope.$anchor.param).toEqual({key:'value'});

    scope.$anchor.path = 'page=http://path';
    scope.$anchor.param = {k:'a=b'};

    expect(scope.$anchor()).toEqual('page=http://path?k=a%3Db');

  });
});
