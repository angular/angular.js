describe("services", function(){
  var scope;

  beforeEach(function(){
    scope = createScope(null, angularService, {});
  });

  it("should inject $window", function(){
    expect(scope.$window).toEqual(window);
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

  describe("$location", function(){
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

    it('should update hash before any processing', function(){
      var scope = compile('<div>');
      var log = '';
      scope.$watch('$location.hash', function(){
        log += this.$location.hashPath + ';';
      });
      expect(log).toEqual(';');

      log = '';
      scope.$location.hash = '/abc';
      scope.$eval();
      expect(log).toEqual('/abc;');
    });

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
    var scope = compile('<input name="price" ng-required ng-validate="number"></input>').$init();
    expect(scope.$invalidWidgets.length).toEqual(1);
    scope.price = 123;
    scope.$eval();
    expect(scope.$invalidWidgets.length).toEqual(0);
    scope.$element.remove();
    scope.price = 'abc';
    scope.$eval();
    expect(scope.$invalidWidgets.length).toEqual(1);

    jqLite(document.body).append(scope.$element);
    scope.$invalidWidgets.clearOrphans();
    expect(scope.$invalidWidgets.length).toEqual(1);

    jqLite(document.body).html('');
    scope.$invalidWidgets.clearOrphans();
    expect(scope.$invalidWidgets.length).toEqual(0);
  });
});

describe("service $route", function(){
  it('should route and fire change event', function(){
    var log = '';
    function BookChapter() {
      this.log = '<init>';
    }
    BookChapter.prototype.init = function(){
      log += 'init();';
    };
    var scope = compile('<div></div>').$init();
    scope.$route.when('/Book/:book/Chapter/:chapter', {controller: BookChapter, template:'Chapter.html'});
    scope.$route.when('/Blank');
    scope.$route.onChange(function(){
      log += 'onChange();';
    });
    scope.$location.parse('http://server#/Book/Moby/Chapter/Intro?p=123');
    scope.$eval();
    expect(log).toEqual('onChange();init();');
    expect(scope.$route.current.params).toEqual({book:'Moby', chapter:'Intro', p:'123'});
    expect(scope.$route.current.scope.log).toEqual('<init>');
    var lastId = scope.$route.current.scope.$id;

    log = '';
    scope.$location.parse('http://server#/Blank?ignore');
    scope.$eval();
    expect(log).toEqual('onChange();');
    expect(scope.$route.current.params).toEqual({ignore:true});
    expect(scope.$route.current.scope.$id).not.toEqual(lastId);

    log = '';
    scope.$location.parse('http://server#/NONE');
    scope.$eval();
    expect(log).toEqual('onChange();');
    expect(scope.$route.current).toEqual(null);

    scope.$route.when('/NONE', {template:'instant update'});
    expect(scope.$route.current.template).toEqual('instant update');
  });
});
