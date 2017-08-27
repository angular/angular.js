'use strict';

describe('ngSwitch', function() {
  var element;


  afterEach(function() {
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
    $rootScope.name = 'shyam';
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
    $rootScope.name = 'shyam';
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


  it('should show all elements between start and end markers that match the current value',
      inject(function($rootScope, $compile) {
    element = $compile(
      '<ul ng-switch="select">' +
        '<li ng-switch-when-start="1">A</li>' +
        '<li>B</li>' +
        '<li ng-switch-when-end>C</li>' +
        '<li ng-switch-when-start="2">D</li>' +
        '<li>E</li>' +
        '<li ng-switch-when-end>F</li>' +
      '</ul>')($rootScope);

    $rootScope.$apply('select = "1"');
    expect(element.find('li').length).toBe(3);
    expect(element.find('li').eq(0).text()).toBe('A');
    expect(element.find('li').eq(1).text()).toBe('B');
    expect(element.find('li').eq(2).text()).toBe('C');

    $rootScope.$apply('select = "2"');
    expect(element.find('li').length).toBe(3);
    expect(element.find('li').eq(0).text()).toBe('D');
    expect(element.find('li').eq(1).text()).toBe('E');
    expect(element.find('li').eq(2).text()).toBe('F');
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


  it('should show all default elements between start and end markers when no match',
      inject(function($rootScope, $compile) {
    element = $compile(
      '<ul ng-switch="select">' +
        '<li ng-switch-when-start="1">A</li>' +
        '<li>B</li>' +
        '<li ng-switch-when-end>C</li>' +
        '<li ng-switch-default-start>D</li>' +
        '<li>E</li>' +
        '<li ng-switch-default-end>F</li>' +
      '</ul>')($rootScope);

    $rootScope.$apply('select = "1"');
    expect(element.find('li').length).toBe(3);
    expect(element.find('li').eq(0).text()).toBe('A');
    expect(element.find('li').eq(1).text()).toBe('B');
    expect(element.find('li').eq(2).text()).toBe('C');

    $rootScope.$apply('select = "2"');
    expect(element.find('li').length).toBe(3);
    expect(element.find('li').eq(0).text()).toBe('D');
    expect(element.find('li').eq(1).text()).toBe('E');
    expect(element.find('li').eq(2).text()).toBe('F');
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
    expect(child1.$destroy).toHaveBeenCalled();

    $rootScope.url = 'a';
    $rootScope.$apply();
    var child2 = getChildScope();
    expect(child2).toBeDefined();
    expect(child2).not.toBe(child1);
  }));


  it('should interoperate with other transclusion directives like ngRepeat', inject(function($rootScope, $compile) {
    element = $compile(
      '<div ng-switch="value">' +
          '<div ng-switch-when="foo" ng-repeat="foo in foos">{{value}}:{{foo}}|</div>' +
          '<div ng-switch-default ng-repeat="bar in bars">{{value}}:{{bar}}|</div>' +
      '</div>'
    )($rootScope);
    $rootScope.$apply('value="foo";foos=["one", "two"]');
    expect(element.text()).toEqual('foo:one|foo:two|');

    $rootScope.$apply('value="foo";foos=["one"]');
    expect(element.text()).toEqual('foo:one|');

    $rootScope.$apply('value="foo";foos=["one","two","three"]');
    expect(element.text()).toEqual('foo:one|foo:two|foo:three|');

    $rootScope.$apply('value="bar";bars=["up", "down"]');
    expect(element.text()).toEqual('bar:up|bar:down|');

    $rootScope.$apply('value="bar";bars=["up", "down", "forwards", "backwards"]');
    expect(element.text()).toEqual('bar:up|bar:down|bar:forwards|bar:backwards|');

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

    // element now contains only empty repeater. this element is deallocated by local afterEach.
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


  it('should not trigger a digest after an element is removed', inject(function($$rAF, $compile, $rootScope, $timeout) {
    var spy = spyOn($rootScope, '$digest').and.callThrough();

    $rootScope.select = 1;
    element = $compile(
      '<div ng-switch="select">' +
        '<div ng-switch-when="1">first</div>' +
        '<div ng-switch-when="2">second</div>' +
      '</div>')($rootScope);
    $rootScope.$apply();

    expect(element.text()).toEqual('first');

    $rootScope.select = 2;
    $rootScope.$apply();
    spy.calls.reset();
    expect(element.text()).toEqual('second');
    // If ngSwitch re-introduces code that triggers a digest after an element is removed (in an
    // animation .then callback), flushing the queue ensures the callback will be called, and the test
    // fails
    $$rAF.flush();

    expect(spy).not.toHaveBeenCalled();
    // A digest may have been triggered asynchronously, so check the queue
    $timeout.verifyNoPendingTasks();
  }));


  it('should handle changes to the switch value in a digest loop with multiple value matches',
    inject(function($compile, $rootScope) {
      var scope = $rootScope.$new();
      scope.value = 'foo';

      scope.$watch('value', function() {
        if (scope.value === 'bar') {
          scope.$evalAsync(function() {
            scope.value = 'baz';
          });
        }
      });

      element = $compile(
        '<div ng-switch="value">' +
          '<div ng-switch-when="foo">FOO 1</div>' +
          '<div ng-switch-when="foo">FOO 2</div>' +
          '<div ng-switch-when="bar">BAR</div>' +
          '<div ng-switch-when="baz">BAZ</div>' +
        '</div>')(scope);

      scope.$apply();
      expect(element.text()).toBe('FOO 1FOO 2');

      scope.$apply('value = "bar"');
      expect(element.text()).toBe('BAZ');
    })
  );


  describe('ngSwitchWhen separator', function() {

    it('should be possible to define a separator', inject(function($rootScope, $compile) {
      element = $compile(
        '<div ng-switch="mode">' +
          '<p ng-switch-when="a|b" ng-switch-when-separator="|">Block1|</p>' +
          '<p ng-switch-when="a">Block2|</p>' +
          '<p ng-switch-default>Block3|</div>' +
        '</div>'
      )($rootScope);

      $rootScope.$apply('mode = "a"');
      expect(element.children().length).toBe(2);
      expect(element.text()).toBe('Block1|Block2|');
      $rootScope.$apply('mode = "b"');

      expect(element.children().length).toBe(1);
      expect(element.text()).toBe('Block1|');
      $rootScope.$apply('mode = "c"');

      expect(element.children().length).toBe(1);
      expect(element.text()).toBe('Block3|');
    }));


    it('should be possible to use a separator at the end of the value', inject(function($rootScope, $compile) {
      element = $compile(
        '<div ng-switch="mode">' +
          '<p ng-switch-when="a|b|" ng-switch-when-separator="|">Block1|</p>' +
          '<p ng-switch-when="a">Block2|</p>' +
          '<p ng-switch-default>Block3|</div>' +
        '</div>'
      )($rootScope);

      $rootScope.$apply('mode = "a"');
      expect(element.children().length).toBe(2);
      expect(element.text()).toBe('Block1|Block2|');
      $rootScope.$apply('mode = ""');

      expect(element.children().length).toBe(1);
      expect(element.text()).toBe('Block1|');
      $rootScope.$apply('mode = "c"');

      expect(element.children().length).toBe(1);
      expect(element.text()).toBe('Block3|');
    }));


    it('should be possible to use the empty string as a separator', inject(function($rootScope, $compile) {
      element = $compile(
        '<div ng-switch="mode">' +
          '<p ng-switch-when="ab" ng-switch-when-separator="">Block1|</p>' +
          '<p ng-switch-when="a">Block2|</p>' +
          '<p ng-switch-default>Block3|</div>' +
        '</div>'
      )($rootScope);

      $rootScope.$apply('mode = "a"');
      expect(element.children().length).toBe(2);
      expect(element.text()).toBe('Block1|Block2|');
      $rootScope.$apply('mode = "b"');

      expect(element.children().length).toBe(1);
      expect(element.text()).toBe('Block1|');
      $rootScope.$apply('mode = "c"');

      expect(element.children().length).toBe(1);
      expect(element.text()).toBe('Block3|');
    }));


    it('should be possible to use separators that are multiple characters long', inject(function($rootScope, $compile) {
      element = $compile(
        '<div ng-switch="mode">' +
          '<p ng-switch-when="a||b|a" ng-switch-when-separator="||">Block1|</p>' +
          '<p ng-switch-when="a">Block2|</p>' +
          '<p ng-switch-default>Block3|</div>' +
        '</div>'
      )($rootScope);

      $rootScope.$apply('mode = "a"');
      expect(element.children().length).toBe(2);
      expect(element.text()).toBe('Block1|Block2|');
      $rootScope.$apply('mode = "b|a"');

      expect(element.children().length).toBe(1);
      expect(element.text()).toBe('Block1|');
      $rootScope.$apply('mode = "c"');

      expect(element.children().length).toBe(1);
      expect(element.text()).toBe('Block3|');
    }));


    it('should ignore multiple appearances of the same item', inject(function($rootScope, $compile) {
      element = $compile(
        '<div ng-switch="mode">' +
          '<p ng-switch-when="a|b|a" ng-switch-when-separator="|">Block1|</p>' +
          '<p ng-switch-when="a">Block2|</p>' +
          '<p ng-switch-default>Block3|</div>' +
        '</div>'
      )($rootScope);

      $rootScope.$apply('mode = "a"');
      expect(element.children().length).toBe(2);
      expect(element.text()).toBe('Block1|Block2|');
      $rootScope.$apply('mode = "b"');

      expect(element.children().length).toBe(1);
      expect(element.text()).toBe('Block1|');
      $rootScope.$apply('mode = "c"');

      expect(element.children().length).toBe(1);
      expect(element.text()).toBe('Block3|');
    }));
  });
});

describe('ngSwitch animation', function() {
  var body, element, $rootElement;

  function html(content) {
    $rootElement.html(content);
    element = $rootElement.children().eq(0);
    return element;
  }

  beforeEach(module(function() {
    // we need to run animation on attached elements;
    return function(_$rootElement_) {
      $rootElement = _$rootElement_;
      body = jqLite(window.document.body);
      body.append($rootElement);
    };
  }));

  afterEach(function() {
    dealoc(body);
    dealoc(element);
  });

  describe('behavior', function() {
    it('should destroy the previous leave animation if a new one takes place', function() {
      module('ngAnimate');
      module(function($animateProvider) {
        $animateProvider.register('.long-leave', function() {
          return {
            leave: function(element, done) {
              //do nothing at all
            }
          };
        });
      });
      inject(function($compile, $rootScope, $animate, $templateCache) {
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

        expect(destroyed).toBe(true);
      });
    });
  });

  describe('events', function() {
    beforeEach(module('ngAnimateMock'));

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

    it('should work with svg elements when the svg container is transcluded', function() {
      module(function($compileProvider) {
        $compileProvider.directive('svgContainer', function() {
          return {
            template: '<svg ng-transclude></svg>',
            replace: true,
            transclude: true
          };
        });
      });
      inject(function($compile, $rootScope) {
        element = $compile('<svg-container ng-switch="inc"><circle ng-switch-when="one"></circle>' +
          '</svg-container>')($rootScope);
        $rootScope.inc = 'one';
        $rootScope.$apply();

        var circle = element.find('circle');
        expect(circle[0].toString()).toMatch(/SVG/);
      });
    });
  });
});
