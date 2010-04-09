describe("services", function(){
  var scope;

  beforeEach(function(){
    scope = createScope(null, angularService, {});
  });

  it("should inject $window", function(){
    expect(scope.$window).toEqual(window);
  });

  it("should inject $location", function(){
    scope.$location.parse('http://host:123/p/a/t/h.html?query=value#path?key=value');
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

    expect(scope.$location.toString()).toEqual('http://host:123/p/a/t/h.html?query=value#page=http://path?k=a%3Db');
  });

  it('should parse file://', function(){
    scope.$location.parse('file:///Users/Shared/misko/work/angular.js/scenario/widgets.html');
    expect(scope.$location.href).toEqual("file:///Users/Shared/misko/work/angular.js/scenario/widgets.html");
    expect(scope.$location.protocol).toEqual("file");
    expect(scope.$location.host).toEqual("");
    expect(scope.$location.port).toEqual(null);
    expect(scope.$location.path).toEqual("/Users/Shared/misko/work/angular.js/scenario/widgets.html");
    expect(scope.$location.search).toEqual({});
    expect(scope.$location.hash).toEqual('');
    expect(scope.$location.hashPath).toEqual('');
    expect(scope.$location.hashSearch).toEqual({});

    expect(scope.$location.toString()).toEqual('file:///Users/Shared/misko/work/angular.js/scenario/widgets.html#');
  });

  it('should update url on hash change', function(){
    scope.$location.parse('http://server/#path?a=b');
    scope.$location.hash = '';
    expect(scope.$location.toString()).toEqual('http://server/#');
    expect(scope.$location.hashPath).toEqual('');
  });

  it('should update url on hashPath change', function(){
    scope.$location.parse('http://server/#path?a=b');
    scope.$location.hashPath = '';
    expect(scope.$location.toString()).toEqual('http://server/#?a=b');
    expect(scope.$location.hash).toEqual('?a=b');
  });

  xit('should add stylesheets', function(){
    scope.$document = {
      getElementsByTagName: function(name){
        expect(name).toEqual('LINK');
        return [];
      }
    };
    scope.$document.addStyleSheet('css/angular.css');

  });

});

describe("service $invalidWidgets", function(){
  var scope;
  beforeEach(function(){
    scope = null;
  });
  afterEach(function(){
    if (scope && scope.$element)
      scope.$element.remove();
  });

  it("should count number of invalid widgets", function(){
    var scope = compile('<input name="price" ng-required></input>').$init();
    expect(scope.$invalidWidgets.length).toEqual(1);
    scope.price = 123;
    scope.$eval();
    expect(scope.$invalidWidgets.length).toEqual(0);
    scope.$element.remove();
  });
});
