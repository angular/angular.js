describe("ScenarioSpec: Compilation", function(){
  it("should compile dom node and return scope", function(){
    var node = jqLite('<div ng-init="a=1">{{b=a+1}}</div>')[0];
    var scope = compile(node);
    scope.$init();
    expect(scope.a).toEqual(1);
    expect(scope.b).toEqual(2);
  });

  it("should compile jQuery node and return scope", function(){
    var scope = compile(jqLite('<div>{{a=123}}</div>')).$init();
    expect(jqLite(scope.$element).text()).toEqual('123');
  });

  it("should compile text node and return scope", function(){
    var scope = compile('<div>{{a=123}}</div>').$init();
    expect(jqLite(scope.$element).text()).toEqual('123');
  });
});

describe("ScenarioSpec: Scope", function(){
  it("should have set, get, eval, $init, updateView methods", function(){
    var scope = compile('<div>{{a}}</div>').$init();
    scope.$eval("$invalidWidgets.push({})");
    expect(scope.$set("a", 2)).toEqual(2);
    expect(scope.$get("a")).toEqual(2);
    expect(scope.$eval("a=3")).toEqual(3);
    scope.$eval();
    expect(jqLite(scope.$element).text()).toEqual('3');
  });

  it("should have $ objects", function(){
    var scope = compile('<div></div>', {$config: {a:"b"}});
    expect(scope.$get('$location')).toBeDefined();
    expect(scope.$get('$eval')).toBeDefined();
    expect(scope.$get('$config')).toBeDefined();
    expect(scope.$get('$config.a')).toEqual("b");
  });
});

describe("ScenarioSpec: configuration", function(){
  it("should take location object", function(){
    var url = "http://server/#?book=moby";
    var scope = compile("<div>{{$location}}</div>");
    var $location = scope.$get('$location');
    expect($location.hashSearch.book).toBeUndefined();
    scope.$browser.setUrl(url);
    scope.$browser.fireUrlWatchers();
    expect($location.hashSearch.book).toEqual('moby');
  });
});
