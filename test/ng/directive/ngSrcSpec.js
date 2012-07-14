'use strict';

describe('ngSrc', function() {
  var element;

  afterEach(function() {
    dealoc(element);
  });

  it('should not result empty string in img src', inject(function($rootScope, $compile) {
    $rootScope.image = {};
    element = $compile('<img ng-src="{{image.url}}">')($rootScope);
    $rootScope.$digest();
    expect(element.attr('src')).not.toBe('');
    expect(element.attr('src')).toBe(undefined);
  }));
});
