'use strict';

describe('ngToggle', function() {
  var element;

  afterEach(function() {
    dealoc(element);
  });

  it('should toggle contents of an element', inject(function($rootScope, $compile) {
    element = jqLite(
      '<ng-toggle on="exp">' +
        '<div id="foo">foo</div>' +
        '<div id="bar">bar</div>' +
      '</ng-toggle>'
    );

    element = $compile(element)($rootScope);
    $rootScope.$digest();

    var div1 = element.children()[0];
    var div2 = element.children()[1];

    expect(div1.style.display).toEqual('none');
    expect(div2.style.display).toEqual('');

    $rootScope.exp = true;
    $rootScope.$digest();
    expect(div1.style.display).toEqual('');
    expect(div2.style.display).toEqual('none');
  }));

  it('should toggle contents of an element without on attribute', inject(function($rootScope, $compile) {
    element = jqLite(
      '<div ng-toggle="exp">' +
        '<div id="foo">foo</div>' +
        '<div id="bar">bar</div>' +
      '</div>'
    );
    element = $compile(element)($rootScope);
    $rootScope.$digest();

    var div1 = element.children()[0];
    var div2 = element.children()[1];

    expect(div1.style.display).toEqual('none');
    expect(div2.style.display).toEqual('');

    $rootScope.exp = true;
    $rootScope.$digest();
    expect(div1.style.display).toEqual('');
    expect(div2.style.display).toEqual('none');
  }));
});


describe('ngToggle - ngAnimate', function() {
  var window;
  var vendorPrefix;
  var body, element, $rootElement;

  function html(html) {
    body.append($rootElement);
    $rootElement.html(html);
    element = $rootElement.children().eq(0);
    return element;
  }

  beforeEach(function() {
    // we need to run animation on attached elements;
    body = jqLite(document.body);
  });

  afterEach(function(){
    dealoc(body);
    dealoc(element);
    body.removeAttr('ng-animation-running');
  });

  beforeEach(module(function($animationProvider, $provide) {
    $provide.value('$window', window = angular.mock.createMockWindow());
    return function($sniffer, _$rootElement_, $animator) {
      vendorPrefix = '-' + $sniffer.vendorPrefix + '-';
      $rootElement = _$rootElement_;
      $animator.enabled(true);
    };
  }));

  describe('ngToggle', function() {
    it('should fire off the animator.show and animator.hide animation', inject(function($compile, $rootScope, $sniffer) {
      var $scope = $rootScope.$new();
      $scope.on = true;
      var style = vendorPrefix + 'transition: 1s linear all';
      element = $compile(html(
        '<div ng-toggle="on" ng-animate="{show: \'custom-show\', hide: \'custom-hide\'}">' +
          '<div id="foo" style="' + style + '">foo</div>' +
          '<div id="bar" style="' + style + '">bar</div>' +
        '</div>'
      ))($scope);

      var div1 = element.children()[0];
      var div2 = element.children()[1];

      $scope.$digest();

      if ($sniffer.transitions) {
        expect(div1.className).toContain('custom-show');
        window.setTimeout.expect(1).process();

        expect(div1.className).toContain('custom-show-active');
        window.setTimeout.expect(1000).process();
      }

      expect(window.setTimeout.queue).toEqual([]);

      expect(div1.className).not.toContain('custom-show-active');
      expect(div1.className).not.toContain('custom-show');

      $scope.on = false;
      $scope.$digest();
      if ($sniffer.transitions) {
        expect(div1.className).toContain('custom-hide');
        expect(div2.className).toContain('custom-show');

        window.setTimeout.expect(1).process();
        expect(div1.className).toContain('custom-hide-active');

        window.setTimeout.expect(1).process();
        expect(div2.className).toContain('custom-show-active');

        window.setTimeout.expect(1000).process();
        window.setTimeout.expect(1000).process();
      }

      expect(window.setTimeout.queue).toEqual([]);

      expect(div1.className).not.toContain('custom-hide-active');
      expect(div1.className).not.toContain('custom-hide');
      expect(div1.style.display).toEqual('none');

      expect(div2.className).not.toContain('custom-show-active');
      expect(div2.className).not.toContain('custom-show');
      expect(div2.style.display).toEqual('');

    }));

    it('should skip animation if parent animation running', function() {
      var fired = false;
      inject(function($animator, $compile, $rootScope) {
        $animator.enabled(true);
        $rootScope.$digest();
        $rootScope.val = true;

        var style = vendorPrefix + 'transition: 1s linear all';
        element = $compile(html(
          '<div ng-toggle="val" ng-animate="{show: \'custom-show\', hide: \'custom-hide\'}">' +
            '<div id="foo" style="' + style + '">foo</div>' +
            '<div id="bar" style="' + style + '">bar</div>' +
          '</div>'
        ))($rootScope);

        $rootElement.controller('ngAnimate').running = true;

        var div1 = element.children()[0];
        var div2 = element.children()[1];

        $rootScope.$digest();

        expect(div1.style.display).toBe('');
        expect(div2.style.display).toBe('none');
        expect(fired).toBe(false);

        expect(window.setTimeout.queue).toEqual([]);
      });
    });
  });
});
