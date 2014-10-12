describe("code", function() {
  var prettyPrintOne, oldPP;
  var compile, scope;

  var any = jasmine.any;

  beforeEach(module('directives'));

  beforeEach(inject(function($rootScope, $compile, $window) {
    // Provide stub for pretty print function
    oldPP = $window.prettyPrintOne;
    prettyPrintOne = $window.prettyPrintOne = jasmine.createSpy();

    scope = $rootScope.$new();
    compile = $compile;
  }));

  afterEach(inject(function($window) {
    $window.prettyPrintOne = oldPP;
  }));


  it('should pretty print innerHTML', function() {
    compile('<code>var x;</code>')(scope);
    expect(prettyPrintOne).toHaveBeenCalledWith('var x;', null, false);
  });

  it('should allow language declaration', function() {
    compile('<code class="lang-javascript"></code>')(scope);
    expect(prettyPrintOne).toHaveBeenCalledWith(any(String), 'javascript', false);
  });

  it('supports allow line numbers', function() {
    compile('<code class="linenum"></code>')(scope);
    expect(prettyPrintOne).toHaveBeenCalledWith(any(String), null, true);
  });
});

