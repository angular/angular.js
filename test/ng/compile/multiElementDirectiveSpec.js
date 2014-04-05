describe('multi-element directive', function() {

  var element, directive, $compile, $rootScope;

  beforeEach(module(provideLog, function($provide, $compileProvider){
    element = null;
    directive = $compileProvider.directive;

    return function(_$compile_, _$rootScope_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
    };
  }));

  function compile(html) {
    element = angular.element(html);
    $compile(element)($rootScope);
  }

  afterEach(function(){
    dealoc(element);
  });

  it('should group on link function', inject(function($compile, $rootScope) {
    $rootScope.show = false;
    element = $compile(
        '<div>' +
            '<span ng-show-start="show"></span>' +
            '<span ng-show-end></span>' +
        '</div>')($rootScope);
    $rootScope.$digest();
    var spans = element.find('span');
    expect(spans.eq(0)).toBeHidden();
    expect(spans.eq(1)).toBeHidden();
  }));


  it('should group on compile function', inject(function($compile, $rootScope) {
    $rootScope.show = false;
    element = $compile(
        '<div>' +
            '<span ng-repeat-start="i in [1,2]">{{i}}A</span>' +
            '<span ng-repeat-end>{{i}}B;</span>' +
        '</div>')($rootScope);
    $rootScope.$digest();
    expect(element.text()).toEqual('1A1B;2A2B;');
  }));


  it('should support grouping over text nodes', inject(function($compile, $rootScope) {
    $rootScope.show = false;
    element = $compile(
        '<div>' +
            '<span ng-repeat-start="i in [1,2]">{{i}}A</span>' +
            ':' + // Important: proves that we can iterate over non-elements
            '<span ng-repeat-end>{{i}}B;</span>' +
        '</div>')($rootScope);
    $rootScope.$digest();
    expect(element.text()).toEqual('1A:1B;2A:2B;');
  }));


  it('should group on $root compile function', inject(function($compile, $rootScope) {
    $rootScope.show = false;
    element = $compile(
        '<div></div>' +
            '<span ng-repeat-start="i in [1,2]">{{i}}A</span>' +
            '<span ng-repeat-end>{{i}}B;</span>' +
        '<div></div>')($rootScope);
    $rootScope.$digest();
    element = jqLite(element[0].parentNode.childNodes); // reset because repeater is top level.
    expect(element.text()).toEqual('1A1B;2A2B;');
  }));


  it('should group on nested groups of same directive', inject(function($compile, $rootScope) {
    $rootScope.show = false;
    element = $compile(
        '<div></div>' +
            '<div ng-repeat-start="i in [1,2]">{{i}}A</div>' +
            '<span ng-bind-start="\'.\'"></span>' +
            '<span ng-bind-end></span>' +
            '<div ng-repeat-end>{{i}}B;</div>' +
        '<div></div>')($rootScope);
    $rootScope.$digest();
    element = jqLite(element[0].parentNode.childNodes); // reset because repeater is top level.
    expect(element.text()).toEqual('1A..1B;2A..2B;');
  }));


  it('should group on nested groups', inject(function($compile, $rootScope) {
    $rootScope.show = false;
    element = $compile(
        '<div></div>' +
            '<div ng-repeat-start="i in [1,2]">{{i}}(</div>' +
            '<span ng-repeat-start="j in [2,3]">{{j}}-</span>' +
            '<span ng-repeat-end>{{j}}</span>' +
            '<div ng-repeat-end>){{i}};</div>' +
        '<div></div>')($rootScope);
    $rootScope.$digest();
    element = jqLite(element[0].parentNode.childNodes); // reset because repeater is top level.
    expect(element.text()).toEqual('1(2-23-3)1;2(2-23-3)2;');
  }));


  it('should throw error if unterminated', function () {
    module(function($compileProvider) {
      $compileProvider.directive('foo', function() {
        return {
        };
      });
    });
    inject(function($compile, $rootScope) {
      expect(function() {
        element = $compile(
            '<div>' +
              '<span foo-start></span>' +
            '</div>');
      }).toThrowMinErr("$compile", "uterdir", "Unterminated attribute, found 'foo-start' but no matching 'foo-end' found.");
    });
  });


  it('should correctly collect ranges on multiple directives on a single element', function () {
    module(function($compileProvider) {
      $compileProvider.directive('emptyDirective', function() {
        return function (scope, element) {
          element.data('x', 'abc');
        };
      });
      $compileProvider.directive('rangeDirective', function() {
        return {
          link: function (scope) {
            scope.x = 'X';
            scope.y = 'Y';
          }
        };
      });
    });

    inject(function ($compile, $rootScope) {
      element = $compile(
        '<div>' +
          '<div range-directive-start empty-directive>{{x}}</div>' +
          '<div range-directive-end>{{y}}</div>' +
        '</div>'
      )($rootScope);

      $rootScope.$digest();
      expect(element.text()).toBe('XY');
      expect(angular.element(element[0].firstChild).data('x')).toBe('abc');
    });
  });


  it('should throw error if unterminated (containing termination as a child)', function () {
    module(function($compileProvider) {
      $compileProvider.directive('foo', function() {
        return {
        };
      });
    });
    inject(function($compile) {
      expect(function() {
        element = $compile(
            '<div>' +
                '<span foo-start><span foo-end></span></span>' +
            '</div>');
      }).toThrowMinErr("$compile", "uterdir", "Unterminated attribute, found 'foo-start' but no matching 'foo-end' found.");
    });
  });


  it('should support data- and x- prefix', inject(function($compile, $rootScope) {
    $rootScope.show = false;
    element = $compile(
        '<div>' +
            '<span data-ng-show-start="show"></span>' +
            '<span data-ng-show-end></span>' +
            '<span x-ng-show-start="show"></span>' +
            '<span x-ng-show-end></span>' +
        '</div>')($rootScope);
    $rootScope.$digest();
    var spans = element.find('span');
    expect(spans.eq(0)).toBeHidden();
    expect(spans.eq(1)).toBeHidden();
    expect(spans.eq(2)).toBeHidden();
    expect(spans.eq(3)).toBeHidden();
  }));
});
