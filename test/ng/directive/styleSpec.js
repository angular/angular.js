'use strict';

describe('style', function() {
  var element;


  afterEach(function() {
    dealoc(element);
  });


  it('should compile style element', inject(function($compile, $rootScope) {
    element = jqLite('<style type="text/css">.some-container{ width: {{elementWidth}}px; }</style>');
    $compile(element)($rootScope);
    $rootScope.$digest();

    // read innerHTML and trim to pass on IE8
    expect(trim(element[0].innerHTML)).toBe('.some-container{ width: px; }');

    $rootScope.$apply(function() {
      $rootScope.elementWidth = 200;
    });

    // read innerHTML and trim to pass on IE8
    expect(trim(element[0].innerHTML)).toBe('.some-container{ width: 200px; }');
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
