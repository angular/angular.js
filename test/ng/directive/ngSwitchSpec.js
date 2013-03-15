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

describe('ngSwitch ngAnimate', function() {
  var element;

  afterEach(function(){
    dealoc(element);
  });

  it('should fire off the enter animation + set and remove the classes', function() {
    var timeouts = [];

    module(function($animationProvider, $provide) {
      $provide.value('$window', extend(window, {
        setTimeout : function(fn, delay) {
          timeouts.push({
            fn: fn,
            delay: delay
          });
        }
      }));
    })

    inject(function($compile, $rootScope, $sniffer) {
      var vendorPrefix = '-' + $sniffer.vendorPrefix.toLowerCase() + '-';

      var $scope = $rootScope.$new();
      var style = vendorPrefix + 'transition: 1s linear all';
      element = $compile(
        '<div ng-switch on="val" ng-animate="enter: coolEnter; leave: coolLeave">' +
          '<div ng-switch-when="one" style="' + style + '">one</div>' +
          '<div ng-switch-when="two" style="' + style + '">two</div>' +
          '<div ng-switch-when="three" style="' + style + '">three</div>' +
        '</div>'
      )($scope);

      $scope.val = 'one';
      $scope.$digest();

      expect(element.children().length).toBe(1);
      var first = element.children()[0];

      expect(first.className).toContain('ng-animate-cool-enter-setup');
      timeouts.pop().fn();

      expect(first.className).toContain('ng-animate-cool-enter-start');
      timeouts.pop().fn();

      expect(first.className).not.toContain('ng-animate-cool-enter-setup');
      expect(first.className).not.toContain('ng-animate-cool-enter-start');
    });
  })


  it('should fire off the leave animation + set and remove the classes', function() {
    var timeouts = [];

    module(function($animationProvider, $provide) {
      $provide.value('$window', extend(window, {
        setTimeout : function(fn, delay) {
          timeouts.push({
            fn: fn,
            delay: delay
          });
        }
      }));
    })

    inject(function($compile, $rootScope, $sniffer) {
      var vendorPrefix = '-' + $sniffer.vendorPrefix.toLowerCase() + '-';

      var $scope = $rootScope.$new();
      var style = vendorPrefix + 'transition: 1s linear all';
      element = $compile(
        '<div ng-switch on="val" ng-animate="enter: coolEnter; leave: coolLeave">' +
          '<div ng-switch-when="one" style="' + style + '">one</div>' +
          '<div ng-switch-when="two" style="' + style + '">two</div>' +
          '<div ng-switch-when="three" style="' + style + '">three</div>' +
        '</div>'
      )($scope);

      $scope.val = 'two';
      $scope.$digest();

      timeouts.pop().fn(); //enter setup for the 1st element
      timeouts.pop().fn(); //enter start for the 1st element

      $scope.val = 'three';
      $scope.$digest();

      expect(element.children().length).toBe(2);
      var first = element.children()[0];

      expect(first.className).toContain('ng-animate-cool-leave-setup');

      timeouts.pop().fn(); //enter setup for the 2nd element
      timeouts.pop().fn(); //enter start for the 2nd element
      timeouts.pop().fn(); //leave start for the 1st element

      expect(first.className).toContain('ng-animate-cool-leave-start');
      timeouts.pop().fn(); //leave end for the 1st element

      expect(first.className).not.toContain('ng-animate-cool-leave-setup');
      expect(first.className).not.toContain('ng-animate-cool-leave-start');
    });
  });

  it('should catch and use the correct duration for animation', function() {
    var timeouts = [];

    module(function($animationProvider, $provide) {
      $provide.value('$window', extend(window, {
        setTimeout : function(fn, delay) {
          timeouts.push({
            fn: fn,
            delay: delay
          });
        }
      }));
    })

    inject(function($compile, $rootScope, $sniffer) {
      var vendorPrefix = '-' + $sniffer.vendorPrefix.toLowerCase() + '-';
      element = $compile(
        '<div ng-switch on="val" ng-animate="enter: coolEnter; leave: coolLeave">' +
          '<div ng-switch-when="one" style="' + vendorPrefix + 'transition: 0.5s linear all">one</div>' +
        '</div>'
      )($rootScope);

      $rootScope.val = 'one';
      $rootScope.$digest();

      timeouts.pop().fn(); //first delay which happens after setup
      expect(timeouts.pop().delay).toBe(500);
    });
  });

});
