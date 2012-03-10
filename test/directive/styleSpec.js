'use strict';

describe('style', function() {
  var element;


  afterEach(function() {
    dealoc(element);
  });


  it('should not compile style element', inject(function($compile, $rootScope) {
    element = jqLite('<style type="text/css">should {{notBound}}</style>');
    $compile(element)($rootScope);
    $rootScope.$digest();

    // read innerHTML and trim to pass on IE8
    expect(trim(element[0].innerHTML)).toBe('should {{notBound}}');
  }));


  it('should compile content of element with style attr', inject(function($compile, $rootScope) {
    element = jqLite('<div style="some">{{bind}}</div>');
    $compile(element)($rootScope);
    $rootScope.$apply(function() {
      $rootScope.bind = 'value';
    });

    expect(element.text()).toBe('value');
  }));
});
