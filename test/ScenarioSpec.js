describe("ScenarioSpec: Compilation", function(){
  var scope;

  beforeEach(function(){
    scope = null;
  });

  afterEach(function(){
    dealoc(scope);
  });

  describe('compilation', function(){
    it("should compile dom node and return scope", function(){
      var node = jqLite('<div ng:init="a=1">{{b=a+1}}</div>')[0];
      scope = angular.compile(node)();
      expect(scope.a).toEqual(1);
      expect(scope.b).toEqual(2);
    });

    it("should compile jQuery node and return scope", function(){
      scope = compile(jqLite('<div>{{a=123}}</div>'))();
      expect(jqLite(scope.$element).text()).toEqual('123');
    });

    it("should compile text node and return scope", function(){
      scope = angular.compile('<div>{{a=123}}</div>')();
      expect(jqLite(scope.$element).text()).toEqual('123');
    });
  });

  describe('scope', function(){
    it("should have $set, $get, $eval, $updateView methods", function(){
      scope = angular.compile('<div>{{a}}</div>')();
      scope.$eval("$invalidWidgets.push({})");
      expect(scope.$set("a", 2)).toEqual(2);
      expect(scope.$get("a")).toEqual(2);
      expect(scope.$eval("a=3")).toEqual(3);
      scope.$eval();
      expect(jqLite(scope.$element).text()).toEqual('3');
    });

    it("should have $ objects", function(){
      scope = angular.compile('<div></div>')(angular.scope({$config: {a:"b"}}));
      expect(scope.$service('$location')).toBeDefined();
      expect(scope.$get('$eval')).toBeDefined();
      expect(scope.$get('$config')).toBeDefined();
      expect(scope.$get('$config.a')).toEqual("b");
    });
  });

  describe("configuration", function(){
    it("should take location object", function(){
      var url = "http://server/#?book=moby";
      scope = angular.compile("<div>{{$location}}</div>")();
      var $location = scope.$service('$location');
      var $browser = scope.$service('$browser');
      expect($location.hashSearch.book).toBeUndefined();
      $browser.setUrl(url);
      $browser.poll();
      expect($location.hashSearch.book).toEqual('moby');
    });
  });
});
