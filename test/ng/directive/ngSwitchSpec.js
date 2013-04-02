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


  it('should always display the elements that do not match a switch',
      inject(function($rootScope, $compile) {
    element = $compile(
      '<ul ng-switch="select">' +
        '<li>always </li>' +
        '<li ng-switch-when="1">one </li>' +
        '<li ng-switch-when="2">two </li>' +
        '<li ng-switch-default>other, </li>' +
        '<li ng-switch-default>other too </li>' +
      '</ul>')($rootScope);
    $rootScope.$apply();
    expect(element.text()).toEqual('always other, other too ');
    $rootScope.select = 1;
    $rootScope.$apply();
    expect(element.text()).toEqual('always one ');
  }));


  it('should display the elements that do not have ngSwitchWhen nor ' +
     'ngSwitchDefault at the position specified in the template, when the ' +
     'first and last elements in the ngSwitch body do not have a ngSwitch* ' +
     'directive', inject(function($rootScope, $compile) {
    element = $compile(
      '<ul ng-switch="select">' +
        '<li>1</li>' +
        '<li ng-switch-when="1">2</li>' +
        '<li>3</li>' +
        '<li ng-switch-when="2">4</li>' +
        '<li ng-switch-default>5</li>' +
        '<li>6</li>' +
        '<li ng-switch-default>7</li>' +
        '<li>8</li>' +
      '</ul>')($rootScope);
    $rootScope.$apply();
    expect(element.text()).toEqual('135678');
    $rootScope.select = 1;
    $rootScope.$apply();
    expect(element.text()).toEqual('12368');
  }));


  it('should display the elements that do not have ngSwitchWhen nor ' +
     'ngSwitchDefault at the position specified in the template when the ' +
     'first and last elements in the ngSwitch have a ngSwitch* directive',
      inject(function($rootScope, $compile) {
    element = $compile(
      '<ul ng-switch="select">' +
        '<li ng-switch-when="1">2</li>' +
        '<li>3</li>' +
        '<li ng-switch-when="2">4</li>' +
        '<li ng-switch-default>5</li>' +
        '<li>6</li>' +
        '<li ng-switch-default>7</li>' +
      '</ul>')($rootScope);
    $rootScope.$apply();
    expect(element.text()).toEqual('3567');
    $rootScope.select = 1;
    $rootScope.$apply();
    expect(element.text()).toEqual('236');
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
  var element, vendorPrefix, window;

  beforeEach(module(function($animationProvider, $provide) {
    $provide.value('$window', window = angular.mock.createMockWindow());
    return function($sniffer) {
      vendorPrefix = '-' + $sniffer.vendorPrefix + '-';
    };
  }));

  afterEach(function(){
    dealoc(element);
  });

  it('should fire off the enter animation + set and remove the classes',
    inject(function($compile, $rootScope, $sniffer) {
      var $scope = $rootScope.$new();
      var style = vendorPrefix + 'transition: 1s linear all';
      element = $compile(
        '<div ng-switch on="val" ng-animate="{enter: \'cool-enter\', leave: \'cool-leave\'}">' +
          '<div ng-switch-when="one" style="' + style + '">one</div>' +
          '<div ng-switch-when="two" style="' + style + '">two</div>' +
          '<div ng-switch-when="three" style="' + style + '">three</div>' +
        '</div>'
      )($scope);

      $scope.val = 'one';
      $scope.$digest();

      expect(element.children().length).toBe(1);
      var first = element.children()[0];

      if ($sniffer.supportsTransitions) {
        expect(first.className).toContain('cool-enter-setup');
        window.setTimeout.expect(1).process();

        expect(first.className).toContain('cool-enter-start');
        window.setTimeout.expect(1000).process();
      } else {
        expect(window.setTimeout.queue).toEqual([]);
      }

      expect(first.className).not.toContain('cool-enter-setup');
      expect(first.className).not.toContain('cool-enter-start');
  }));


  it('should fire off the leave animation + set and remove the classes',
    inject(function($compile, $rootScope, $sniffer) {
      var $scope = $rootScope.$new();
      var style = vendorPrefix + 'transition: 1s linear all';
      element = $compile(
        '<div ng-switch on="val" ng-animate="{enter: \'cool-enter\', leave: \'cool-leave\'}">' +
          '<div ng-switch-when="one" style="' + style + '">one</div>' +
          '<div ng-switch-when="two" style="' + style + '">two</div>' +
          '<div ng-switch-when="three" style="' + style + '">three</div>' +
        '</div>'
      )($scope);

      $scope.val = 'two';
      $scope.$digest();

      if ($sniffer.supportsTransitions) {
        window.setTimeout.expect(1).process();
        window.setTimeout.expect(1000).process();
      } else {
        expect(window.setTimeout.queue).toEqual([]);
      }

      $scope.val = 'three';
      $scope.$digest();

      expect(element.children().length).toBe($sniffer.supportsTransitions ? 2 : 1);
      var first = element.children()[0];


      if ($sniffer.supportsTransitions) {
        expect(first.className).toContain('cool-leave-setup');
        window.setTimeout.expect(1).process();
        window.setTimeout.expect(1).process();
      } else {
        expect(window.setTimeout.queue).toEqual([]);
      }


      if ($sniffer.supportsTransitions) {
        expect(first.className).toContain('cool-leave-start');
        window.setTimeout.expect(1000).process();
        window.setTimeout.expect(1000).process();
      } else {
        expect(window.setTimeout.queue).toEqual([]);
      }

      expect(first.className).not.toContain('cool-leave-setup');
      expect(first.className).not.toContain('cool-leave-start');
  }));

  it('should catch and use the correct duration for animation',
    inject(function($compile, $rootScope, $sniffer) {
      element = $compile(
        '<div ng-switch on="val" ng-animate="{enter: \'cool-enter\', leave: \'cool-leave\'}">' +
          '<div ng-switch-when="one" style="' + vendorPrefix + 'transition: 0.5s linear all">one</div>' +
        '</div>'
      )($rootScope);

      $rootScope.val = 'one';
      $rootScope.$digest();

      if ($sniffer.supportsTransitions) {
        window.setTimeout.expect(1).process();
        window.setTimeout.expect(500).process();
      } else {
       expect(window.setTimeout.queue).toEqual([]);
      }
  }));

});
