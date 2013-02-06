'use strict';

describe('ngSwitch', function() {
  var element;


  afterEach(function(){
    dealoc(element);
  });


  it('should switch on value change', inject(function($rootScope, $compile) {
    element = $compile(
      '<div ng-switch="select">' +
        '<div ng-switch-when="1">first:{{name}}</div>' +
        '<div ng-switch-when="2">second:{{name}}</div>' +
        '<div ng-switch-when="true">true:{{name}}</div>' +
      '</div>')($rootScope);
    expect(element.html()).toEqual(
        '<!-- ngSwitchWhen: 1 --><!-- ngSwitchWhen: 2 --><!-- ngSwitchWhen: true -->');
    $rootScope.select = 1;
    $rootScope.$apply();
    expect(element.text()).toEqual('first:');
    $rootScope.name="shyam";
    $rootScope.$apply();
    expect(element.text()).toEqual('first:shyam');
    $rootScope.select = 2;
    $rootScope.$apply();
    expect(element.text()).toEqual('second:shyam');
    $rootScope.name = 'misko';
    $rootScope.$apply();
    expect(element.text()).toEqual('second:misko');
    $rootScope.select = true;
    $rootScope.$apply();
    expect(element.text()).toEqual('true:misko');
  }));


  it('should show all switch-whens that match the current value', inject(function($rootScope, $compile) {
    element = $compile(
      '<ul ng-switch="select">' +
        '<li ng-switch-when="1">first:{{name}}</li>' +
        '<li ng-switch-when="1">, first too:{{name}}</li>' +
        '<li ng-switch-when="2">second:{{name}}</li>' +
        '<li ng-switch-when="true">true:{{name}}</li>' +
      '</ul>')($rootScope);
    expect(element.html()).toEqual('<!-- ngSwitchWhen: 1 -->' +
                                   '<!-- ngSwitchWhen: 1 -->' +
                                   '<!-- ngSwitchWhen: 2 -->' +
                                   '<!-- ngSwitchWhen: true -->');
    $rootScope.select = 1;
    $rootScope.$apply();
    expect(element.text()).toEqual('first:, first too:');
    $rootScope.name="shyam";
    $rootScope.$apply();
    expect(element.text()).toEqual('first:shyam, first too:shyam');
    $rootScope.select = 2;
    $rootScope.$apply();
    expect(element.text()).toEqual('second:shyam');
    $rootScope.name = 'misko';
    $rootScope.$apply();
    expect(element.text()).toEqual('second:misko');
    $rootScope.select = true;
    $rootScope.$apply();
    expect(element.text()).toEqual('true:misko');
  }));


  it('should switch on switch-when-default', inject(function($rootScope, $compile) {
    element = $compile(
      '<ng:switch on="select">' +
        '<div ng:switch-when="1">one</div>' +
        '<div ng:switch-default>other</div>' +
      '</ng:switch>')($rootScope);
    $rootScope.$apply();
    expect(element.text()).toEqual('other');
    $rootScope.select = 1;
    $rootScope.$apply();
    expect(element.text()).toEqual('one');
  }));


  it('should show all switch-when-default', inject(function($rootScope, $compile) {
    element = $compile(
      '<ul ng-switch="select">' +
        '<li ng-switch-when="1">one</li>' +
        '<li ng-switch-default>other</li>' +
        '<li ng-switch-default>, other too</li>' +
      '</ul>')($rootScope);
    $rootScope.$apply();
    expect(element.text()).toEqual('other, other too');
    $rootScope.select = 1;
    $rootScope.$apply();
    expect(element.text()).toEqual('one');
  }));


  it('should call change on switch', inject(function($rootScope, $compile) {
    element = $compile(
      '<ng:switch on="url" change="name=\'works\'">' +
        '<div ng-switch-when="a">{{name}}</div>' +
      '</ng:switch>')($rootScope);
    $rootScope.url = 'a';
    $rootScope.$apply();
    expect($rootScope.name).toEqual('works');
    expect(element.text()).toEqual('works');
  }));


  it('should properly create and destroy child scopes', inject(function($rootScope, $compile) {
    element = $compile(
      '<ng:switch on="url">' +
        '<div ng-switch-when="a">{{name}}</div>' +
      '</ng:switch>')($rootScope);
    $rootScope.$apply();

    var getChildScope = function() { return element.find('div').scope(); };

    expect(getChildScope()).toBeUndefined();

    $rootScope.url = 'a';
    $rootScope.$apply();
    var child1 = getChildScope();
    expect(child1).toBeDefined();
    spyOn(child1, '$destroy');

    $rootScope.url = 'x';
    $rootScope.$apply();
    expect(getChildScope()).toBeUndefined();
    expect(child1.$destroy).toHaveBeenCalledOnce();

    $rootScope.url = 'a';
    $rootScope.$apply();
    var child2 = getChildScope();
    expect(child2).toBeDefined();
    expect(child2).not.toBe(child1);
  }));


  it('should not leak jq data when compiled but not attached to parent when parent is destroyed',
      inject(function($rootScope, $compile) {
    element = $compile(
      '<div ng-repeat="i in []">' +
        '<ng-switch on="url">' +
          '<div ng-switch-when="a">{{name}}</div>' +
        '</ng-switch>' +
      '</div>')($rootScope);
    $rootScope.$apply();

    // element now contains only empty repeater. this element is dealocated by local afterEach.
    // afterwards a global afterEach will check for leaks in jq data cache object
  }));
});
