'use strict';

/* eslint-disable no-script-url */

describe('ngSrc', function() {
  var element;

  afterEach(function() {
    dealoc(element);
  });

  describe('img[ng-src]', function() {
    it('should not result empty string in img src', inject(function($rootScope, $compile) {
      $rootScope.image = {};
      element = $compile('<img ng-src="{{image.url}}">')($rootScope);
      $rootScope.$digest();
      expect(element.attr('src')).not.toBe('');
      expect(element.attr('src')).toBeUndefined();
    }));

    it('should sanitize interpolated url', inject(function($rootScope, $compile) {
      $rootScope.imageUrl = 'javascript:alert(1);';
      element = $compile('<img ng-src="{{imageUrl}}">')($rootScope);
      $rootScope.$digest();
      expect(element.attr('src')).toBe('unsafe:javascript:alert(1);');
    }));

    it('should sanitize non-interpolated url', inject(function($rootScope, $compile) {
      element = $compile('<img ng-src="javascript:alert(1);">')($rootScope);
      $rootScope.$digest();
      expect(element.attr('src')).toBe('unsafe:javascript:alert(1);');
    }));

    it('should interpolate the expression and bind to src with raw same-domain value', inject(function($compile, $rootScope) {
      element = $compile('<img ng-src="{{id}}"></img>')($rootScope);

      $rootScope.$digest();
      expect(element.attr('src')).toBeUndefined();

      $rootScope.$apply(function() {
        $rootScope.id = '/somewhere/here';
      });
      expect(element.attr('src')).toEqual('/somewhere/here');
    }));

    it('should interpolate a multi-part expression for img src attribute (which requires the MEDIA_URL context)', inject(function($compile, $rootScope) {
      element = $compile('<img ng-src="some/{{id}}"></img>')($rootScope);
      expect(element.attr('src')).toBe(undefined);  // URL concatenations are all-or-nothing
      $rootScope.$apply(function() {
        $rootScope.id = 1;
      });
      expect(element.attr('src')).toEqual('some/1');
    }));

    // Support: IE 9-11 only
    if (msie) {
      it('should update the element property as well as the attribute', inject(function($compile, $rootScope, $sce) {
        // on IE, if "ng:src" directive declaration is used and "src" attribute doesn't exist
        // then calling element.setAttribute('src', 'foo') doesn't do anything, so we need
        // to set the property as well to achieve the desired effect

        element = $compile('<img ng-src="{{id}}"></img>')($rootScope);

        $rootScope.$digest();
        expect(element.prop('src')).toBe('');
        dealoc(element);

        element = $compile('<img ng-src="some/"></img>')($rootScope);

        $rootScope.$digest();
        expect(element.prop('src')).toMatch('/some/$');
        dealoc(element);

        element = $compile('<img ng-src="{{id}}"></img>')($rootScope);
        $rootScope.$apply(function() {
          $rootScope.id = $sce.trustAsResourceUrl('http://somewhere/abc');
        });
        expect(element.prop('src')).toEqual('http://somewhere/abc');
      }));
    }

    it('should work with `src` attribute on the same element', inject(function($rootScope, $compile) {
      $rootScope.imageUrl = 'dynamic';
      element = $compile('<img ng-src="{{imageUrl}}" src="static">')($rootScope);
      expect(element.attr('src')).toBe('static');
      $rootScope.$digest();
      expect(element.attr('src')).toBe('dynamic');
      dealoc(element);

      element = $compile('<img src="static" ng-src="{{imageUrl}}">')($rootScope);
      expect(element.attr('src')).toBe('static');
      $rootScope.$digest();
      expect(element.attr('src')).toBe('dynamic');
    }));
  });

  describe('iframe[ng-src]', function() {
    it('should pass through src attributes for the same domain', inject(function($compile, $rootScope) {
      element = $compile('<iframe ng-src="{{testUrl}}"></iframe>')($rootScope);
      $rootScope.testUrl = 'different_page';
      $rootScope.$apply();
      expect(element.attr('src')).toEqual('different_page');
    }));

    it('should error on src attributes for a different domain', inject(function($compile, $rootScope) {
      element = $compile('<iframe ng-src="{{testUrl}}"></iframe>')($rootScope);
      $rootScope.testUrl = 'http://a.different.domain.example.com';
      expect(function() { $rootScope.$apply(); }).toThrowMinErr(
          '$interpolate', 'interr', 'Can\'t interpolate: {{testUrl}}\nError: [$sce:insecurl] Blocked ' +
          'loading resource from url not allowed by $sceDelegate policy.  URL: ' +
          'http://a.different.domain.example.com');
    }));

    it('should error on JS src attributes', inject(function($compile, $rootScope) {
      element = $compile('<iframe ng-src="{{testUrl}}"></iframe>')($rootScope);
      $rootScope.testUrl = 'javascript:alert(1);';
      expect(function() { $rootScope.$apply(); }).toThrowMinErr(
          '$interpolate', 'interr', 'Can\'t interpolate: {{testUrl}}\nError: [$sce:insecurl] Blocked ' +
          'loading resource from url not allowed by $sceDelegate policy.  URL: ' +
          'javascript:alert(1);');
    }));

    it('should error on non-resource_url src attributes', inject(function($compile, $rootScope, $sce) {
      element = $compile('<iframe ng-src="{{testUrl}}"></iframe>')($rootScope);
      $rootScope.testUrl = $sce.trustAsUrl('javascript:doTrustedStuff()');
      expect($rootScope.$apply).toThrowMinErr(
          '$interpolate', 'interr', 'Can\'t interpolate: {{testUrl}}\nError: [$sce:insecurl] Blocked ' +
          'loading resource from url not allowed by $sceDelegate policy.  URL: ' +
          'javascript:doTrustedStuff()');
    }));

    it('should pass through $sce.trustAs() values in src attributes', inject(function($compile, $rootScope, $sce) {
      element = $compile('<iframe ng-src="{{testUrl}}"></iframe>')($rootScope);
      $rootScope.testUrl = $sce.trustAsResourceUrl('javascript:doTrustedStuff()');
      $rootScope.$apply();

      expect(element.attr('src')).toEqual('javascript:doTrustedStuff()');
    }));

    it('should interpolate the expression and bind to src with a trusted value', inject(function($compile, $rootScope, $sce) {
      element = $compile('<iframe ng-src="{{id}}"></iframe>')($rootScope);

      $rootScope.$digest();
      expect(element.attr('src')).toBeUndefined();

      $rootScope.$apply(function() {
        $rootScope.id = $sce.trustAsResourceUrl('http://somewhere');
      });
      expect(element.attr('src')).toEqual('http://somewhere');
    }));


    it('should NOT interpolate a multi-part expression in a `src` attribute that requires a non-MEDIA_URL context', inject(function($compile, $rootScope) {
      expect(function() {
        element = $compile('<iframe ng-src="some/{{id}}"></iframe>')($rootScope);
        $rootScope.$apply(function() {
          $rootScope.id = 1;
        });
      }).toThrowMinErr(
            '$interpolate', 'noconcat', 'Error while interpolating: some/{{id}}\nStrict ' +
            'Contextual Escaping disallows interpolations that concatenate multiple expressions ' +
            'when a trusted value is required.  See http://docs.angularjs.org/api/ng.$sce');
    }));


    it('should NOT interpolate a wrongly typed expression', inject(function($compile, $rootScope, $sce) {
      expect(function() {
        element = $compile('<iframe ng-src="{{id}}"></iframe>')($rootScope);
        $rootScope.$apply(function() {
          $rootScope.id = $sce.trustAsUrl('http://somewhere');
        });
        element.attr('src');
      }).toThrowMinErr(
              '$interpolate', 'interr', 'Can\'t interpolate: {{id}}\nError: [$sce:insecurl] Blocked ' +
                  'loading resource from url not allowed by $sceDelegate policy.  URL: http://somewhere');
    }));
  });
});
