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


  it('should properly support case labels with different numbers of transclude fns', inject(function($rootScope, $compile) {
    element = $compile(
      '<div ng-switch="mode">' +
        '<p ng-switch-when="a">Block1</p>' +
        '<p ng-switch-when="a">Block2</p>' +
        '<a href ng-switch-when="b">a</a>' +
      '</div>'
    )($rootScope);

    $rootScope.$apply('mode = "a"');
    expect(element.children().length).toBe(2);

    $rootScope.$apply('mode = "b"');
    expect(element.children().length).toBe(1);

    $rootScope.$apply('mode = "a"');
    expect(element.children().length).toBe(2);

    $rootScope.$apply('mode = "b"');
    expect(element.children().length).toBe(1);
  }));
});

describe('ngSwitch animations', function() {
  var body, element, $rootElement;

  function html(content) {
    $rootElement.html(content);
    element = $rootElement.children().eq(0);
    return element;
  }

  beforeEach(module('ngAnimateMock'));

  beforeEach(module(function() {
    // we need to run animation on attached elements;
    return function(_$rootElement_) {
      $rootElement = _$rootElement_;
      body = jqLite(document.body);
      body.append($rootElement);
    };
  }));

  afterEach(function(){
    dealoc(body);
    dealoc(element);
  });

  it('should fire off the enter animation',
    inject(function($compile, $rootScope, $animate) {
      var item;
      var $scope = $rootScope.$new();
      element = $compile(html(
        '<div ng-switch on="val">' +
          '<div ng-switch-when="one">one</div>' +
          '<div ng-switch-when="two">two</div>' +
          '<div ng-switch-when="three">three</div>' +
        '</div>'
      ))($scope);

      $rootScope.$digest(); // re-enable the animations;
      $scope.val = 'one';
      $scope.$digest();

      item = $animate.queue.shift();
      expect(item.event).toBe('enter');
      expect(item.element.text()).toBe('one');
    })
  );


  it('should fire off the leave animation',
    inject(function($compile, $rootScope, $animate) {
      var item;
      var $scope = $rootScope.$new();
      element = $compile(html(
        '<div ng-switch on="val">' +
          '<div ng-switch-when="one">one</div>' +
          '<div ng-switch-when="two">two</div>' +
          '<div ng-switch-when="three">three</div>' +
        '</div>'
      ))($scope);

      $rootScope.$digest(); // re-enable the animations;
      $scope.val = 'two';
      $scope.$digest();

      item = $animate.queue.shift();
      expect(item.event).toBe('enter');
      expect(item.element.text()).toBe('two');

      $scope.val = 'three';
      $scope.$digest();

      item = $animate.queue.shift();
      expect(item.event).toBe('leave');
      expect(item.element.text()).toBe('two');

      item = $animate.queue.shift();
      expect(item.event).toBe('enter');
      expect(item.element.text()).toBe('three');
    })
  );

  it('should destroy the previous leave animation if a new one takes place', function() {
    module(function($provide) {
      $provide.value('$animate', {
        enabled : function() { return true; },
        leave : function() {
          //DOM operation left blank
        },
        enter : function(element, parent, after) {
          angular.element(after).after(element);
        }
      });
    });
    inject(function ($compile, $rootScope, $animate, $templateCache) {
      var item;
      var $scope = $rootScope.$new();
      element = $compile(html(
        '<div ng-switch="inc">' +
          '<div ng-switch-when="one">one</div>' +
          '<div ng-switch-when="two">two</div>' +
        '</div>'
      ))($scope);

      $scope.$apply('inc = "one"');

      var destroyed, inner = element.children(0);
      inner.on('$destroy', function() {
        destroyed = true;
      });

      $scope.$apply('inc = "two"');

      $scope.$apply('inc = "one"');

      $scope.$apply('inc = "two"');

      expect(destroyed).toBe(true);
    });
  });
});
