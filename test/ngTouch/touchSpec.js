'use strict';

describe('ngTouch', function() {
  beforeEach(module('ngTouch'));
  var _$touchProvider;

  describe('$touchProvider', function() {


    it('should expose the $touchProvider', function() {
      module(function($touchProvider) {
        _$touchProvider = $touchProvider;
      });

      inject(function() {
        expect(_$touchProvider).toBeDefined();
      });
    });


    it('should expose the $touch service', function() {
      inject(function($touch) {
        expect($touch).toBeDefined();
      });
    });
  });
});
