describe("errorDisplay", function () {

  var $location, compileHTML;

  beforeEach(module('docsApp'));

  beforeEach(inject(function ($injector) {
    var $rootScope = $injector.get('$rootScope'),
      $compile = $injector.get('$compile');

    $location = $injector.get('$location');

    compileHTML = function (code) {
      var elm = angular.element(code);
      $compile(elm)($rootScope);
      $rootScope.$digest();
      return elm;
    };

    this.addMatchers({
      toInterpolateTo: function (expected) {
        // Given a compiled DOM node with a minerr-display attribute,
        // assert that its interpolated string matches the expected text.
        return this.actual.text() === expected;
      }
    });
  }));

  it('should interpolate a template with no parameters', function () {
    var elm;

    spyOn($location, 'search').andReturn({});
    elm = compileHTML('<div error-display="This is a test"></div>');
    expect(elm).toInterpolateTo('This is a test');
  });

  it('should interpolate a template with no parameters when search parameters are present', function () {
    var elm;

    spyOn($location, 'search').andReturn({ p0: 'foobaz' });
    elm = compileHTML('<div error-display="This is a test"></div>');
    expect(elm).toInterpolateTo('This is a test');
  });

  it('should correctly interpolate search parameters', function () {
    var elm;

    spyOn($location, 'search').andReturn({ p0: '42' });
    elm = compileHTML('<div error-display="The answer is {0}"></div>');
    expect(elm).toInterpolateTo('The answer is 42');
  });

  it('should interpolate parameters in the specified order', function () {
    var elm;

    spyOn($location, 'search').andReturn({ p0: 'second', p1: 'first' });
    elm = compileHTML('<div error-display="{1} {0}"></div>');
    expect(elm).toInterpolateTo('first second');
  });

  it('should preserve interpolation markers when fewer arguments than needed are provided', function () {
    var elm;

    spyOn($location, 'search').andReturn({ p0: 'Fooooo' });
    elm = compileHTML('<div error-display="This {0} is {1} on {2}"></div>');
    expect(elm).toInterpolateTo('This Fooooo is {1} on {2}');
  });

  it('should correctly handle the empty string as an interpolation parameter', function () {
    var elm;

    spyOn($location, 'search').andReturn({ p0: 'test', p1: '' });
    elm = compileHTML('<div error-display="This {0} is a {1}"></div>');
    expect(elm).toInterpolateTo('This test is a ');
  });
});