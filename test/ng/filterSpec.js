'use strict';

describe('$filter', function() {
  var $filterProvider, $filter;

  beforeEach(module(function(_$filterProvider_) {
    $filterProvider = _$filterProvider_;
  }));

  beforeEach(inject(function(_$filter_) {
    $filter = _$filter_;
  }));

  describe('provider', function() {
    it('should allow registration of filters', function() {
      var FooFilter = function() {
        return function() { return 'foo'; };
      };

      $filterProvider.register('foo', FooFilter);

      var fooFilter = $filter('foo');
      expect(fooFilter()).toBe('foo');
    });

    it('should allow registration of a map of filters', function() {
      var FooFilter = function() {
        return function() { return 'foo'; };
      };

      var BarFilter = function() {
        return function() { return 'bar'; };
      };

      $filterProvider.register({
        'foo': FooFilter,
        'bar': BarFilter
      });

      var fooFilter = $filter('foo');
      expect(fooFilter()).toBe('foo');

      var barFilter = $filter('bar');
      expect(barFilter()).toBe('bar');
    });
  });
});