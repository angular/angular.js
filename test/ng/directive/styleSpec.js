'use strict';

describe('style', function() {
  var element;


  afterEach(function() {
    dealoc(element);
  });


  it('should compile style element', inject(function($compile, $rootScope) {
    element = jqLite('<style type="text/css">' +
      '.navigation{font-size:1.5em; h3{font-size:1.5em}}' +
      '.footer{h3{font-size:{{fontSize}}em}}' +
      '.header{font-size:1.5em; h3{font-size:{{fontSize}}{{unit}}}}' +
      '</style>');
    $compile(element)($rootScope);
    $rootScope.$digest();

    // read innerHTML and trim to pass on IE8
    expect(trim(element[0].innerHTML)).toBe(
      '.navigation{font-size:1.5em; h3{font-size:1.5em}}' +
      '.footer{h3{font-size:em}}' +
      '.header{font-size:1.5em; h3{font-size:}}');

    $rootScope.$apply(function() {
      $rootScope.fontSize = 1.5;
      $rootScope.unit = 'em';
    });

    // read innerHTML and trim to pass on IE8
    expect(trim(element[0].innerHTML)).toBe(
      '.navigation{font-size:1.5em; h3{font-size:1.5em}}' +
      '.footer{h3{font-size:1.5em}}' +
      '.header{font-size:1.5em; h3{font-size:1.5em}}');
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
