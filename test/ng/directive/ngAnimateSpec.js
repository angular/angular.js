'use strict';

xdescribe("ngAnimate", function() {

  var element;

  afterEach(function(){
    dealoc(element);
  });

  it("should throw an error when an invalid ng-animate syntax is provided", inject(function($compile, $rootScope) {
    var html = '<div ng-animate="..."></div>';
    try {
      element = $compile(html)($rootScope);
      expect(false).toBe(true); //throw an error
    }
    catch(e) {
      expect(e).toMatch(/Expected ngAnimate in form of/i);
    }
  }));

});
