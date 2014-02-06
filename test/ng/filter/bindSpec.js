'use strict';

describe('Filter: bind', function() {
  var bind;
  beforeEach(inject(function($filter) {
    bind = $filter('bind');
  }));

  it('should bind the function to the object', function() {
    function originalFn() {
      return this.value;
    }
    var obj = {value: 'Lucas'};
    expect(bind(originalFn, obj)()).toBe('Lucas');
  });

});
