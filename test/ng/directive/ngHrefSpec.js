'use strict';

describe('ngHref', function() {
  var element;

  afterEach(function() {
    dealoc(element);
  });


  it('should interpolate the expression and bind to href', inject(function($compile, $rootScope) {
    element = $compile('<a ng-href="some/{{id}}"></div>')($rootScope);
    $rootScope.$digest();
    expect(element.attr('href')).toEqual('some/');

    $rootScope.$apply(function() {
      $rootScope.id = 1;
    });
    expect(element.attr('href')).toEqual('some/1');
  }));


  it('should bind href and merge with other attrs', inject(function($rootScope, $compile) {
    element = $compile('<a ng-href="{{url}}" rel="{{rel}}"></a>')($rootScope);
    $rootScope.url = 'http://server';
    $rootScope.rel = 'REL';
    $rootScope.$digest();
    expect(element.attr('href')).toEqual('http://server');
    expect(element.attr('rel')).toEqual('REL');
  }));


  it('should bind href even if no interpolation', inject(function($rootScope, $compile) {
    element = $compile('<a ng-href="http://server"></a>')($rootScope);
    $rootScope.$digest();
    expect(element.attr('href')).toEqual('http://server');
  }));

  it('should not set the href if ng-href is empty', inject(function($rootScope, $compile) {
    $rootScope.url = null;
    element = $compile('<a ng-href="{{url}}">')($rootScope);
    $rootScope.$digest();
    expect(element.attr('href')).toEqual(undefined);
  }));

  it('should remove the href if ng-href changes to empty', inject(function($rootScope, $compile) {
    $rootScope.url = 'http://www.google.com/';
    element = $compile('<a ng-href="{{url}}">')($rootScope);
    $rootScope.$digest();

    $rootScope.url = null;
    $rootScope.$digest();
    expect(element.attr('href')).toEqual(undefined);
  }));

  it('should sanitize interpolated url', inject(function($rootScope, $compile) {
    /* eslint no-script-url: "off" */
    $rootScope.imageUrl = 'javascript:alert(1);';
    element = $compile('<a ng-href="{{imageUrl}}">')($rootScope);
    $rootScope.$digest();
    expect(element.attr('href')).toBe('unsafe:javascript:alert(1);');
  }));

  it('should sanitize non-interpolated url', inject(function($rootScope, $compile) {
    element = $compile('<a ng-href="javascript:alert(1);">')($rootScope);
    $rootScope.$digest();
    expect(element.attr('href')).toBe('unsafe:javascript:alert(1);');
  }));


  // Support: IE 9-11 only, Edge 12-17
  if (msie || /\bEdge\/1[2-7]\.[\d.]+\b/.test(window.navigator.userAgent)) {
    // IE/Edge fail when setting a href to a URL containing a % that isn't a valid escape sequence
    // See https://github.com/angular/angular.js/issues/13388
    it('should throw error if ng-href contains a non-escaped percent symbol', inject(function($rootScope, $compile) {
      expect(function() {
        element = $compile('<a ng-href="http://www.google.com/{{\'a%link\'}}">')($rootScope);
      }).toThrow();
    }));
  }


  it('should bind numbers', inject(function($rootScope, $compile) {
    element = $compile('<a ng-href="{{1234}}"></a>')($rootScope);
    $rootScope.$digest();
    expect(element.attr('href')).toEqual('1234');
  }));


  it('should bind and sanitize the result of a (custom) toString() function', inject(function($rootScope, $compile) {
    $rootScope.value = {};
    element = $compile('<a ng-href="{{value}}"></a>')($rootScope);
    $rootScope.$digest();
    expect(element.attr('href')).toEqual('[object Object]');

    function SafeClass() {}

    SafeClass.prototype.toString = function() {
      return 'custom value';
    };

    $rootScope.value = new SafeClass();
    $rootScope.$digest();
    expect(element.attr('href')).toEqual('custom value');

    function UnsafeClass() {}

    UnsafeClass.prototype.toString = function() {
      return 'javascript:alert(1);';
    };

    $rootScope.value = new UnsafeClass();
    $rootScope.$digest();
    expect(element.attr('href')).toEqual('unsafe:javascript:alert(1);');
  }));


  if (isDefined(window.SVGElement)) {
    describe('SVGAElement', function() {
      it('should interpolate the expression and bind to xlink:href', inject(function($compile, $rootScope) {
        element = $compile('<svg><a ng-href="some/{{id}}"></a></svg>')($rootScope);
        var child = element.children('a');
        $rootScope.$digest();
        expect(child.attr('xlink:href')).toEqual('some/');

        $rootScope.$apply(function() {
          $rootScope.id = 1;
        });
        expect(child.attr('xlink:href')).toEqual('some/1');
      }));


      it('should bind xlink:href even if no interpolation', inject(function($rootScope, $compile) {
        element = $compile('<svg><a ng-href="http://server"></a></svg>')($rootScope);
        var child = element.children('a');
        $rootScope.$digest();
        expect(child.attr('xlink:href')).toEqual('http://server');
      }));
    });
  }
});
