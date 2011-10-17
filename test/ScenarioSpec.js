'use strict';

describe("ScenarioSpec: Compilation", function() {
  describe('compilation', function() {
    it("should compile dom node and return scope", inject(function($rootScope) {
      var node = jqLite('<div ng:init="a=1">{{b=a+1}}</div>')[0];
      angular.compile(node)($rootScope);
      $rootScope.$digest();
      expect($rootScope.a).toEqual(1);
      expect($rootScope.b).toEqual(2);
    }));

    it("should compile jQuery node and return scope", inject(function($rootScope) {
      var element = compile(jqLite('<div>{{a=123}}</div>'))($rootScope);
      $rootScope.$digest();
      expect(jqLite(element).text()).toEqual('123');
    }));

    it("should compile text node and return scope", inject(function($rootScope) {
      var element = angular.compile('<div>{{a=123}}</div>')($rootScope);
      $rootScope.$digest();
      expect(jqLite(element).text()).toEqual('123');
    }));
  });
});
