'use strict';

describe('errors', function() {
  // Mock `ngSanitize` module
  angular.
    module('ngSanitize', []).
    value('$sanitize', jasmine.createSpy('$sanitize').and.callFake(angular.identity));

  beforeEach(module('errors'));


  describe('errorDisplay', function() {
    var $sanitize;
    var errorLinkFilter;

    beforeEach(inject(function(_$sanitize_, _errorLinkFilter_) {
      $sanitize = _$sanitize_;
      errorLinkFilter = _errorLinkFilter_;
    }));


    it('should return empty input unchanged', function() {
      var inputs = [undefined, null, false, 0, ''];
      var remaining = inputs.length;

      inputs.forEach(function(falsyValue) {
        expect(errorLinkFilter(falsyValue)).toBe(falsyValue);
        remaining--;
      });

      expect(remaining).toBe(0);
    });


    it('should recognize URLs and convert them to `<a>`', function() {
      var urls = [
        ['ftp://foo/bar?baz#qux'],
        ['http://foo/bar?baz#qux'],
        ['https://foo/bar?baz#qux'],
        ['mailto:foo_bar@baz.qux', null, 'foo_bar@baz.qux'],
        ['foo_bar@baz.qux', 'mailto:foo_bar@baz.qux', 'foo_bar@baz.qux']
      ];
      var remaining = urls.length;

      urls.forEach(function(values) {
        var actualUrl = values[0];
        var expectedUrl = values[1] || actualUrl;
        var expectedText = values[2] || expectedUrl;
        var anchor = '<a href="' + expectedUrl + '">' + expectedText + '</a>';

        var input = 'start ' + actualUrl + ' end';
        var output = 'start ' + anchor + ' end';

        expect(errorLinkFilter(input)).toBe(output);
        remaining--;
      });

      expect(remaining).toBe(0);
    });


    it('should not recognize stack-traces as URLs', function() {
      var urls = [
        'ftp://foo/bar?baz#qux:4:2',
        'http://foo/bar?baz#qux:4:2',
        'https://foo/bar?baz#qux:4:2',
        'mailto:foo_bar@baz.qux:4:2',
        'foo_bar@baz.qux:4:2'
      ];
      var remaining = urls.length;

      urls.forEach(function(url) {
        var input = 'start ' + url + ' end';

        expect(errorLinkFilter(input)).toBe(input);
        remaining--;
      });

      expect(remaining).toBe(0);
    });


    it('should should set `[target]` if specified', function() {
      var url = 'https://foo/bar?baz#qux';
      var target = '_blank';
      var outputWithoutTarget = '<a href="' + url + '">' + url + '</a>';
      var outputWithTarget = '<a target="' + target + '" href="' + url + '">' + url + '</a>';

      expect(errorLinkFilter(url)).toBe(outputWithoutTarget);
      expect(errorLinkFilter(url, target)).toBe(outputWithTarget);
    });


    it('should truncate the contents of the generated `<a>` to 60 characters', function() {
      var looongUrl = 'https://foooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo';
      var truncatedUrl = 'https://foooooooooooooooooooooooooooooooooooooooooooooooo...';
      var output = '<a href="' + looongUrl + '">' + truncatedUrl + '</a>';

      expect(looongUrl.length).toBeGreaterThan(60);
      expect(truncatedUrl.length).toBe(60);
      expect(errorLinkFilter(looongUrl)).toBe(output);
    });


    it('should pass the final string through `$sanitize`', function() {
      $sanitize.calls.reset();

      var input = 'start https://foo/bar?baz#qux end';
      var output = errorLinkFilter(input);

      expect($sanitize).toHaveBeenCalledTimes(1);
      expect($sanitize).toHaveBeenCalledWith(output);
    });
  });


  describe('errorDisplay', function() {
    var $compile;
    var $location;
    var $rootScope;
    var errorLinkFilter;

    beforeEach(module(function($provide) {
      $provide.decorator('errorLinkFilter', function() {
        errorLinkFilter = jasmine.createSpy('errorLinkFilter');
        errorLinkFilter.and.callFake(angular.identity);

        return errorLinkFilter;
      });
    }));
    beforeEach(inject(function(_$compile_, _$location_, _$rootScope_) {
      $compile = _$compile_;
      $location = _$location_;
      $rootScope = _$rootScope_;
    }));


    it('should set the element\'s HTML', function() {
      var elem = $compile('<span error-display="bar">foo</span>')($rootScope);
      expect(elem.html()).toBe('bar');
    });


    it('should interpolate the contents against `$location.search()`', function() {
      spyOn($location, 'search').and.returnValue({p0: 'foo', p1: 'bar'});

      var elem = $compile('<span error-display="foo = {0}, bar = {1}"></span>')($rootScope);
      expect(elem.html()).toBe('foo = foo, bar = bar');
    });


    it('should pass the interpolated text through `errorLinkFilter`', function() {
      $location.search = jasmine.createSpy('search').and.returnValue({p0: 'foo'});

      $compile('<span error-display="foo = {0}"></span>')($rootScope);
      expect(errorLinkFilter).toHaveBeenCalledTimes(1);
      expect(errorLinkFilter).toHaveBeenCalledWith('foo = foo', '_blank');
    });


    it('should encode `<` and `>`', function() {
      var elem = $compile('<span error-display="&lt;xyz&gt;"></span>')($rootScope);
      expect(elem.text()).toBe('<xyz>');
    });
  });
});
