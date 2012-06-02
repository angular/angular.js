'use strict';

describe('$rootElement', function() {
  it('should publish the bootstrap element into $rootElement', function() {
    var element = jqLite('<div></div>');
    var injector = angular.bootstrap(element);

    expect(injector.get('$rootElement')[0]).toBe(element[0]);

    dealoc(element);
  });
});
