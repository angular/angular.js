'use strict';

describe('ngScopeAs', function() {
  var element;

  afterEach(function() {
    dealoc(element);
  });

  it('should save scope as alias', inject(function($rootScope, $compile) {
    element = $compile('<div ng-scope-as="abc"></div>')($rootScope);
    expect($rootScope.abc).toBe($rootScope);
  }));

  it('should throw if expression is not assignable', inject(function($rootScope, $compile) {
    expect(function () {
      $compile('<div ng-scope-as="abc=5"></div>')($rootScope);
    }).toThrowMinErr('ngScopeAs', 'nonassign',
          'Expected scope alias to be an assignable expression but got \'abc=5\'.');
  }));

});
