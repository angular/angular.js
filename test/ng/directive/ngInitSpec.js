'use strict';

describe('ngInit', function() {
  var element;


  afterEach(function() {
    dealoc(element);
  });


  it('should init model', inject(function($rootScope, $compile) {
    element = $compile('<div ng-init="a=123"></div>')($rootScope);
    expect($rootScope.a).toEqual(123);
  }));


  it('should be evaluated before ngInclude', inject(function($rootScope, $templateCache, $compile) {
    $templateCache.put('template1.tpl', '<span>1</span>');
    $templateCache.put('template2.tpl', '<span>2</span>');
    $rootScope.template = 'template1.tpl';
    element = $compile('<div><div ng-include="template" ' +
                                 'ng-init="template=\'template2.tpl\'"></div></div>')($rootScope);
    $rootScope.$digest();
    expect($rootScope.template).toEqual('template2.tpl');
    expect(element.find('span').text()).toEqual('2');
  }));


  it('should be evaluated after ngController', function() {
    module(function($controllerProvider) {
      $controllerProvider.register('TestCtrl', function($scope) {});
    });
    inject(function($rootScope, $compile) {
      element = $compile('<div><div ng-controller="TestCtrl" ' +
                                   'ng-init="test=123"></div></div>')($rootScope);
      $rootScope.$digest();
      expect($rootScope.test).toBeUndefined();
      expect(element.children('div').scope().test).toEqual(123);
    });
  });
});
