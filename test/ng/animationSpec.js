'use strict';

describe('$animation', function() {

  it('should allow animation registration', function() {
    var noopCustom = function(){};
    module(function($animationProvider) {
      $animationProvider.register('noop-custom', valueFn(noopCustom));
    });
    inject(function($animation) {
      expect($animation('noop-custom')).toBe(noopCustom);
    }); 
  });

});
