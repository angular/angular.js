'use strict';

/* eslint-disable no-script-url */

describe('ngProp*', function() {
  it('should bind boolean properties (input disabled)', inject(function($rootScope, $compile) {
    var element = $compile('<button ng-prop-disabled="isDisabled">Button</button>')($rootScope);
    $rootScope.$digest();
    expect(element.prop('disabled')).toBe(false);
    $rootScope.isDisabled = true;
    $rootScope.$digest();
    expect(element.prop('disabled')).toBe(true);
    $rootScope.isDisabled = false;
    $rootScope.$digest();
    expect(element.prop('disabled')).toBe(false);
  }));

  it('should bind boolean properties (input checked)', inject(function($rootScope, $compile) {
    var element = $compile('<input type="checkbox" ng-prop-checked="isChecked" />')($rootScope);
    expect(element.prop('checked')).toBe(false);
    $rootScope.isChecked = true;
    $rootScope.$digest();
    expect(element.prop('checked')).toBe(true);
    $rootScope.isChecked = false;
    $rootScope.$digest();
    expect(element.prop('checked')).toBe(false);
  }));

  it('should bind string properties (title)', inject(function($rootScope, $compile) {
    var element = $compile('<span ng-prop-title="title" />')($rootScope);
    $rootScope.title = 123;
    $rootScope.$digest();
    expect(element.prop('title')).toBe('123');
    $rootScope.title = 'foobar';
    $rootScope.$digest();
    expect(element.prop('title')).toBe('foobar');
  }));

  it('should bind variable type properties', inject(function($rootScope, $compile) {
    var element = $compile('<span ng-prop-asdf="asdf" />')($rootScope);
    $rootScope.asdf = 123;
    $rootScope.$digest();
    expect(element.prop('asdf')).toBe(123);
    $rootScope.asdf = 'foobar';
    $rootScope.$digest();
    expect(element.prop('asdf')).toBe('foobar');
    $rootScope.asdf = true;
    $rootScope.$digest();
    expect(element.prop('asdf')).toBe(true);
  }));

  // https://github.com/angular/angular.js/issues/16797
  it('should support falsy property values', inject(function($rootScope, $compile) {
    var element = $compile('<span ng-prop-text="myText" />')($rootScope);
    // Initialize to truthy value
    $rootScope.myText = 'abc';
    $rootScope.$digest();
    expect(element.prop('text')).toBe('abc');

    // Assert various falsey values get assigned to the property
    $rootScope.myText = '';
    $rootScope.$digest();
    expect(element.prop('text')).toBe('');
    $rootScope.myText = 0;
    $rootScope.$digest();
    expect(element.prop('text')).toBe(0);
    $rootScope.myText = false;
    $rootScope.$digest();
    expect(element.prop('text')).toBe(false);
    $rootScope.myText = undefined;
    $rootScope.$digest();
    expect(element.prop('text')).toBeUndefined();
    $rootScope.myText = null;
    $rootScope.$digest();
    expect(element.prop('text')).toBe(null);
  }));

  it('should directly map special properties (class)', inject(function($rootScope, $compile) {
    var element = $compile('<span ng-prop-class="myText" />')($rootScope);
    $rootScope.myText = 'abc';
    $rootScope.$digest();
    expect(element[0].class).toBe('abc');
    expect(element).not.toHaveClass('abc');
  }));

  it('should not use jQuery .prop() to avoid jQuery propFix/hooks', inject(function($rootScope, $compile) {
    var element = $compile('<span ng-prop-class="myText" />')($rootScope);
    spyOn(jqLite.prototype, 'prop');
    $rootScope.myText = 'abc';
    $rootScope.$digest();
    expect(jqLite.prototype.prop).not.toHaveBeenCalled();
  }));

  it('should support mixed case using underscore-separated names', inject(function($rootScope, $compile) {
    var element = $compile('<span ng-prop-a_bcd_e="value" />')($rootScope);
    $rootScope.value = 123;
    $rootScope.$digest();
    expect(element.prop('aBcdE')).toBe(123);
  }));

  it('should work with different prefixes', inject(function($rootScope, $compile) {
    $rootScope.name = 'Misko';
    var element = $compile('<span ng:prop:test="name" ng-Prop-test2="name" ng_Prop_test3="name"></span>')($rootScope);
    expect(element.prop('test')).toBe('Misko');
    expect(element.prop('test2')).toBe('Misko');
    expect(element.prop('test3')).toBe('Misko');
  }));

  it('should work with the "href" property', inject(function($rootScope, $compile) {
    $rootScope.value = 'test';
    var element = $compile('<a ng-prop-href="\'test/\' + value"></a>')($rootScope);
    $rootScope.$digest();
    expect(element.prop('href')).toMatch(/\/test\/test$/);
  }));

  it('should work if they are prefixed with x- or data- and different prefixes', inject(function($rootScope, $compile) {
    $rootScope.name = 'Misko';
    var element = $compile('<span data-ng-prop-test2="name" x-ng-prop-test3="name" data-ng:prop-test4="name" ' +
      'x_ng-prop-test5="name" data:ng-prop-test6="name"></span>')($rootScope);
    expect(element.prop('test2')).toBe('Misko');
    expect(element.prop('test3')).toBe('Misko');
    expect(element.prop('test4')).toBe('Misko');
    expect(element.prop('test5')).toBe('Misko');
    expect(element.prop('test6')).toBe('Misko');
  }));

  it('should work independently of attributes with the same name', inject(function($rootScope, $compile) {
    var element = $compile('<span ng-prop-asdf="asdf" asdf="foo" />')($rootScope);
    $rootScope.asdf = 123;
    $rootScope.$digest();
    expect(element.prop('asdf')).toBe(123);
    expect(element.attr('asdf')).toBe('foo');
  }));

  it('should work independently of (ng-)attributes with the same name', inject(function($rootScope, $compile) {
    var element = $compile('<span ng-prop-asdf="asdf" ng-attr-asdf="foo" />')($rootScope);
    $rootScope.asdf = 123;
    $rootScope.$digest();
    expect(element.prop('asdf')).toBe(123);
    expect(element.attr('asdf')).toBe('foo');
  }));

  it('should use the full ng-prop-* attribute name in $attr mappings', function() {
    var attrs;
    module(function($compileProvider) {
      $compileProvider.directive('attrExposer', valueFn({
        link: function($scope, $element, $attrs) {
          attrs = $attrs;
        }
      }));
    });
    inject(function($compile, $rootScope) {
      $compile('<div attr-exposer ng-prop-title="12" ng-prop-super-title="34" ng-prop-my-camel_title="56">')($rootScope);

      expect(attrs.title).toBeUndefined();
      expect(attrs.$attr.title).toBeUndefined();
      expect(attrs.ngPropTitle).toBe('12');
      expect(attrs.$attr.ngPropTitle).toBe('ng-prop-title');

      expect(attrs.superTitle).toBeUndefined();
      expect(attrs.$attr.superTitle).toBeUndefined();
      expect(attrs.ngPropSuperTitle).toBe('34');
      expect(attrs.$attr.ngPropSuperTitle).toBe('ng-prop-super-title');

      expect(attrs.myCamelTitle).toBeUndefined();
      expect(attrs.$attr.myCamelTitle).toBeUndefined();
      expect(attrs.ngPropMyCamelTitle).toBe('56');
      expect(attrs.$attr.ngPropMyCamelTitle).toBe('ng-prop-my-camel_title');
    });
  });

  it('should not conflict with (ng-attr-)attribute mappings of the same name', function() {
    var attrs;
    module(function($compileProvider) {
      $compileProvider.directive('attrExposer', valueFn({
        link: function($scope, $element, $attrs) {
          attrs = $attrs;
        }
      }));
    });
    inject(function($compile, $rootScope) {
      $compile('<div attr-exposer ng-prop-title="42" ng-attr-title="foo" title="bar">')($rootScope);
      expect(attrs.title).toBe('foo');
      expect(attrs.$attr.title).toBe('title');
      expect(attrs.$attr.ngPropTitle).toBe('ng-prop-title');
    });
  });

  it('should disallow property binding to onclick', inject(function($compile, $rootScope) {
    // All event prop bindings are disallowed.
    expect(function() {
        $compile('<button ng-prop-onclick="onClickJs"></button>');
      }).toThrowMinErr(
        '$compile', 'nodomevents', 'Property bindings for HTML DOM event properties are disallowed');
    expect(function() {
        $compile('<button ng-prop-ONCLICK="onClickJs"></button>');
      }).toThrowMinErr(
        '$compile', 'nodomevents', 'Property bindings for HTML DOM event properties are disallowed');
  }));

  it('should process property bindings in pre-linking phase at priority 100', function() {
    module(provideLog);
    module(function($compileProvider) {
      $compileProvider.directive('propLog', function(log, $rootScope) {
        return {
          compile: function($element, $attrs) {
            log('compile=' + $element.prop('myName'));

            return {
              pre: function($scope, $element, $attrs) {
                log('preLinkP0=' + $element.prop('myName'));
                $rootScope.name = 'pre0';
              },
              post: function($scope, $element, $attrs) {
                log('postLink=' + $element.prop('myName'));
                $rootScope.name = 'post0';
              }
            };
          }
        };
      });
    });
    module(function($compileProvider) {
      $compileProvider.directive('propLogHighPriority', function(log, $rootScope) {
        return {
          priority: 101,
          compile: function() {
            return {
              pre: function($scope, $element, $attrs) {
                log('preLinkP101=' + $element.prop('myName'));
                $rootScope.name = 'pre101';
              }
            };
          }
        };
      });
    });
    inject(function($rootScope, $compile, log) {
      var element = $compile('<div prop-log-high-priority prop-log ng-prop-my_name="name"></div>')($rootScope);
      $rootScope.name = 'angular';
      $rootScope.$apply();
      log('digest=' + element.prop('myName'));
      expect(log).toEqual('compile=undefined; preLinkP101=undefined; preLinkP0=pre101; postLink=pre101; digest=angular');
    });
  });


  ['img', 'audio', 'video'].forEach(function(tag) {
    // Support: IE 9 only
    // IE9 rejects the `video` / `audio` tags with "Error: Not implemented"
    if (msie !== 9 || tag === 'img') {
      describe(tag + '[src] context requirement', function() {
        it('should NOT require trusted values for whitelisted URIs', inject(function($rootScope, $compile) {
          var element = $compile('<' + tag + ' ng-prop-src="testUrl"></' + tag + '>')($rootScope);
          $rootScope.testUrl = 'http://example.com/image.mp4'; // `http` is whitelisted
          $rootScope.$digest();
          expect(element.prop('src')).toEqual('http://example.com/image.mp4');
        }));

        it('should accept trusted values', inject(function($rootScope, $compile, $sce) {
          // As a MEDIA_URL URL
          var element = $compile('<' + tag + ' ng-prop-src="testUrl"></' + tag + '>')($rootScope);
          // Some browsers complain if you try to write `javascript:` into an `img[src]`
          // So for the test use something different
          $rootScope.testUrl = $sce.trustAsMediaUrl('untrusted:foo()');
          $rootScope.$digest();
          expect(element.prop('src')).toEqual('untrusted:foo()');

          // As a URL
          element = $compile('<' + tag + ' ng-prop-src="testUrl"></' + tag + '>')($rootScope);
          $rootScope.testUrl = $sce.trustAsUrl('untrusted:foo()');
          $rootScope.$digest();
          expect(element.prop('src')).toEqual('untrusted:foo()');

          // As a RESOURCE URL
          element = $compile('<' + tag + ' ng-prop-src="testUrl"></' + tag + '>')($rootScope);
          $rootScope.testUrl = $sce.trustAsResourceUrl('untrusted:foo()');
          $rootScope.$digest();
          expect(element.prop('src')).toEqual('untrusted:foo()');
        }));

        it('should sanitize non-whitelisted values', inject(function($rootScope, $compile, $sce) {
          // As a MEDIA_URL URL
          var element = $compile('<' + tag + ' ng-prop-src="testUrl"></' + tag + '>')($rootScope);
          // Some browsers complain if you try to write `javascript:` into an `img[src]`
          // So for the test use something different
          $rootScope.testUrl = 'untrusted:foo()';
          $rootScope.$digest();
          expect(element.prop('src')).toEqual('unsafe:untrusted:foo()');
        }));

        it('should sanitize wrongly typed values', inject(function($rootScope, $compile, $sce) {
          // As a MEDIA_URL URL
          var element = $compile('<' + tag + ' ng-prop-src="testUrl"></' + tag + '>')($rootScope);
          // Some browsers complain if you try to write `javascript:` into an `img[src]`
          // So for the test use something different
          $rootScope.testUrl = $sce.trustAsCss('untrusted:foo()');
          $rootScope.$digest();
          expect(element.prop('src')).toEqual('unsafe:untrusted:foo()');
        }));
      });
    }
  });

  // Support: IE 9 only
  // IE 9 rejects the `source` / `track` tags with
  // "Unable to get value of the property 'childNodes': object is null or undefined"
  if (msie !== 9) {
    ['source', 'track'].forEach(function(tag) {
      describe(tag + '[src]', function() {
        it('should NOT require trusted values for whitelisted URIs', inject(function($rootScope, $compile) {
          var element = $compile('<video><' + tag + ' ng-prop-src="testUrl"></' + tag + '></video>')($rootScope);
          $rootScope.testUrl = 'http://example.com/image.mp4'; // `http` is whitelisted
          $rootScope.$digest();
          expect(element.find(tag).prop('src')).toEqual('http://example.com/image.mp4');
        }));

        it('should accept trusted values', inject(function($rootScope, $compile, $sce) {
          // As a MEDIA_URL URL
          var element = $compile('<video><' + tag + ' ng-prop-src="testUrl"></' + tag + '></video>')($rootScope);
          $rootScope.testUrl = $sce.trustAsMediaUrl('javascript:foo()');
          $rootScope.$digest();
          expect(element.find(tag).prop('src')).toEqual('javascript:foo()');

          // As a URL
          element = $compile('<video><' + tag + ' ng-prop-src="testUrl"></' + tag + '></video>')($rootScope);
          $rootScope.testUrl = $sce.trustAsUrl('javascript:foo()');
          $rootScope.$digest();
          expect(element.find(tag).prop('src')).toEqual('javascript:foo()');

          // As a RESOURCE URL
          element = $compile('<video><' + tag + ' ng-prop-src="testUrl"></' + tag + '></video>')($rootScope);
          $rootScope.testUrl = $sce.trustAsResourceUrl('javascript:foo()');
          $rootScope.$digest();
          expect(element.find(tag).prop('src')).toEqual('javascript:foo()');
        }));

        it('should sanitize non-whitelisted values', inject(function($rootScope, $compile, $sce) {
          var element = $compile('<video><' + tag + ' ng-prop-src="testUrl"></' + tag + '></video>')($rootScope);
          $rootScope.testUrl = 'untrusted:foo()';
          $rootScope.$digest();
          expect(element.find(tag).prop('src')).toEqual('unsafe:untrusted:foo()');
        }));

        it('should sanitize wrongly typed values', inject(function($rootScope, $compile, $sce) {
          var element = $compile('<video><' + tag + ' ng-prop-src="testUrl"></' + tag + '></video>')($rootScope);
          $rootScope.testUrl = $sce.trustAsCss('untrusted:foo()');
          $rootScope.$digest();
          expect(element.find(tag).prop('src')).toEqual('unsafe:untrusted:foo()');
        }));
      });
    });
  }

  describe('img[src] sanitization', function() {

    it('should accept trusted values', inject(function($rootScope, $compile, $sce) {
      var element = $compile('<img ng-prop-src="testUrl"></img>')($rootScope);
      // Some browsers complain if you try to write `javascript:` into an `img[src]`
      // So for the test use something different
      $rootScope.testUrl = $sce.trustAsMediaUrl('someuntrustedthing:foo();');
      $rootScope.$digest();
      expect(element.prop('src')).toEqual('someuntrustedthing:foo();');
    }));

    it('should use $$sanitizeUri', function() {
      var $$sanitizeUri = jasmine.createSpy('$$sanitizeUri').and.returnValue('someSanitizedUrl');
      module(function($provide) {
        $provide.value('$$sanitizeUri', $$sanitizeUri);
      });
      inject(function($compile, $rootScope) {
        var element = $compile('<img ng-prop-src="testUrl"></img>')($rootScope);
        $rootScope.testUrl = 'someUrl';

        $rootScope.$apply();
        expect(element.prop('src')).toMatch(/^http:\/\/.*\/someSanitizedUrl$/);
        expect($$sanitizeUri).toHaveBeenCalledWith($rootScope.testUrl, true);
      });
    });

    it('should not use $$sanitizeUri with trusted values', function() {
      var $$sanitizeUri = jasmine.createSpy('$$sanitizeUri').and.throwError('Should not have been called');
      module(function($provide) {
        $provide.value('$$sanitizeUri', $$sanitizeUri);
      });
      inject(function($compile, $rootScope, $sce) {
        var element = $compile('<img ng-prop-src="testUrl"></img>')($rootScope);
        // Assigning javascript:foo to src makes at least IE9-11 complain, so use another
        // protocol name.
        $rootScope.testUrl = $sce.trustAsMediaUrl('untrusted:foo();');
        $rootScope.$apply();
        expect(element.prop('src')).toBe('untrusted:foo();');
      });
    });
  });

  ['img', 'source'].forEach(function(srcsetElement) {
    // Support: IE 9 only
    // IE9 ignores source[srcset] property assignments
    if (msie !== 9 || srcsetElement === 'img') {
      describe(srcsetElement + '[srcset] sanitization', function() {
        it('should not error if srcset is blank', inject(function($compile, $rootScope) {
          var element = $compile('<' + srcsetElement + ' ng-prop-srcset="testUrl"></' + srcsetElement + '>')($rootScope);
          // Set srcset to a value
          $rootScope.testUrl = 'http://example.com/';
          $rootScope.$digest();
          expect(element.prop('srcset')).toBe('http://example.com/');

          // Now set it to blank
          $rootScope.testUrl = '';
          $rootScope.$digest();
          expect(element.prop('srcset')).toBe('');
        }));

        it('should NOT require trusted values for whitelisted values', inject(function($rootScope, $compile, $sce) {
          var element = $compile('<' + srcsetElement + ' ng-prop-srcset="testUrl"></' + srcsetElement + '>')($rootScope);
          $rootScope.testUrl = 'http://example.com/image.png'; // `http` is whitelisted
          $rootScope.$digest();
          expect(element.prop('srcset')).toEqual('http://example.com/image.png');
        }));

        it('should accept trusted values, if they are also whitelisted', inject(function($rootScope, $compile, $sce) {
          var element = $compile('<' + srcsetElement + ' ng-prop-srcset="testUrl"></' + srcsetElement + '>')($rootScope);
          $rootScope.testUrl = $sce.trustAsUrl('http://example.com');
          $rootScope.$digest();
          expect(element.prop('srcset')).toEqual('http://example.com');
        }));

        it('should NOT work with trusted values', inject(function($rootScope, $compile, $sce) {
          // A limitation of the approach used for srcset is that you cannot use `trustAsUrl`.
          // Use trustAsHtml and ng-bind-html to work around this.
          var element = $compile('<' + srcsetElement + ' ng-prop-srcset="testUrl"></' + srcsetElement + '>')($rootScope);
          $rootScope.testUrl = $sce.trustAsUrl('javascript:something');
          $rootScope.$digest();
          expect(element.prop('srcset')).toEqual('unsafe:javascript:something');

          element = $compile('<' + srcsetElement + ' ng-prop-srcset="testUrl + \',\' + testUrl"></' + srcsetElement + '>')($rootScope);
          $rootScope.testUrl = $sce.trustAsUrl('javascript:something');
          $rootScope.$digest();
          expect(element.prop('srcset')).toEqual(
              'unsafe:javascript:something ,unsafe:javascript:something');
        }));

        it('should use $$sanitizeUri', function() {
          var $$sanitizeUri = jasmine.createSpy('$$sanitizeUri').and.returnValue('someSanitizedUrl');
          module(function($provide) {
            $provide.value('$$sanitizeUri', $$sanitizeUri);
          });
          inject(function($compile, $rootScope) {
            var element = $compile('<' + srcsetElement + ' ng-prop-srcset="testUrl"></' + srcsetElement + '>')($rootScope);
            $rootScope.testUrl = 'someUrl';
            $rootScope.$apply();
            expect(element.prop('srcset')).toBe('someSanitizedUrl');
            expect($$sanitizeUri).toHaveBeenCalledWith($rootScope.testUrl, true);

            element = $compile('<' + srcsetElement + ' ng-prop-srcset="testUrl + \',\' + testUrl"></' + srcsetElement + '>')($rootScope);
            $rootScope.testUrl = 'javascript:yay';
            $rootScope.$apply();
            expect(element.prop('srcset')).toEqual('someSanitizedUrl ,someSanitizedUrl');

            element = $compile('<' + srcsetElement + ' ng-prop-srcset="\'java\' + testUrl"></' + srcsetElement + '>')($rootScope);
            $rootScope.testUrl = 'script:yay, javascript:nay';
            $rootScope.$apply();
            expect(element.prop('srcset')).toEqual('someSanitizedUrl ,someSanitizedUrl');
          });
        });

        it('should sanitize all uris in srcset', inject(function($rootScope, $compile) {
          var element = $compile('<' + srcsetElement + ' ng-prop-srcset="testUrl"></' + srcsetElement + '>')($rootScope);
          var testSet = {
            'http://example.com/image.png':'http://example.com/image.png',
            ' http://example.com/image.png':'http://example.com/image.png',
            'http://example.com/image.png ':'http://example.com/image.png',
            'http://example.com/image.png 128w':'http://example.com/image.png 128w',
            'http://example.com/image.png 2x':'http://example.com/image.png 2x',
            'http://example.com/image.png 1.5x':'http://example.com/image.png 1.5x',
            'http://example.com/image1.png 1x,http://example.com/image2.png 2x':'http://example.com/image1.png 1x,http://example.com/image2.png 2x',
            'http://example.com/image1.png 1x ,http://example.com/image2.png 2x':'http://example.com/image1.png 1x ,http://example.com/image2.png 2x',
            'http://example.com/image1.png 1x, http://example.com/image2.png 2x':'http://example.com/image1.png 1x,http://example.com/image2.png 2x',
            'http://example.com/image1.png 1x , http://example.com/image2.png 2x':'http://example.com/image1.png 1x ,http://example.com/image2.png 2x',
            'http://example.com/image1.png 48w,http://example.com/image2.png 64w':'http://example.com/image1.png 48w,http://example.com/image2.png 64w',
            //Test regex to make sure doesn't mistake parts of url for width descriptors
            'http://example.com/image1.png?w=48w,http://example.com/image2.png 64w':'http://example.com/image1.png?w=48w,http://example.com/image2.png 64w',
            'http://example.com/image1.png 1x,http://example.com/image2.png 64w':'http://example.com/image1.png 1x,http://example.com/image2.png 64w',
            'http://example.com/image1.png,http://example.com/image2.png':'http://example.com/image1.png ,http://example.com/image2.png',
            'http://example.com/image1.png ,http://example.com/image2.png':'http://example.com/image1.png ,http://example.com/image2.png',
            'http://example.com/image1.png, http://example.com/image2.png':'http://example.com/image1.png ,http://example.com/image2.png',
            'http://example.com/image1.png , http://example.com/image2.png':'http://example.com/image1.png ,http://example.com/image2.png',
            'http://example.com/image1.png 1x, http://example.com/image2.png 2x, http://example.com/image3.png 3x':
              'http://example.com/image1.png 1x,http://example.com/image2.png 2x,http://example.com/image3.png 3x',
            'javascript:doEvilStuff() 2x': 'unsafe:javascript:doEvilStuff() 2x',
            'http://example.com/image1.png 1x,javascript:doEvilStuff() 2x':'http://example.com/image1.png 1x,unsafe:javascript:doEvilStuff() 2x',
            'http://example.com/image1.jpg?x=a,b 1x,http://example.com/ima,ge2.jpg 2x':'http://example.com/image1.jpg?x=a,b 1x,http://example.com/ima,ge2.jpg 2x',
            //Test regex to make sure doesn't mistake parts of url for pixel density descriptors
            'http://example.com/image1.jpg?x=a2x,b 1x,http://example.com/ima,ge2.jpg 2x':'http://example.com/image1.jpg?x=a2x,b 1x,http://example.com/ima,ge2.jpg 2x'
          };

          forEach(testSet, function(ref, url) {
            $rootScope.testUrl = url;
            $rootScope.$digest();
            expect(element.prop('srcset')).toEqual(ref);
          });
        }));
      });
    }
  });

  describe('a[href] sanitization', function() {
    it('should NOT require trusted values for whitelisted values', inject(function($rootScope, $compile) {
      $rootScope.testUrl = 'http://example.com/image.png'; // `http` is whitelisted
      var element = $compile('<a ng-prop-href="testUrl"></a>')($rootScope);
      $rootScope.$digest();
      expect(element.prop('href')).toEqual('http://example.com/image.png');

      element = $compile('<a ng-prop-href="testUrl"></a>')($rootScope);
      $rootScope.$digest();
      expect(element.prop('href')).toEqual('http://example.com/image.png');
    }));

    it('should accept trusted values for non-whitelisted values', inject(function($rootScope, $compile, $sce) {
      $rootScope.testUrl = $sce.trustAsUrl('javascript:foo()'); // `javascript` is not whitelisted
      var element = $compile('<a ng-prop-href="testUrl"></a>')($rootScope);
      $rootScope.$digest();
      expect(element.prop('href')).toEqual('javascript:foo()');

      element = $compile('<a ng-prop-href="testUrl"></a>')($rootScope);
      $rootScope.$digest();
      expect(element.prop('href')).toEqual('javascript:foo()');
    }));

    it('should sanitize non-whitelisted values', inject(function($rootScope, $compile) {
      $rootScope.testUrl = 'javascript:foo()'; // `javascript` is not whitelisted
      var element = $compile('<a ng-prop-href="testUrl"></a>')($rootScope);
      $rootScope.$digest();
      expect(element.prop('href')).toEqual('unsafe:javascript:foo()');

      element = $compile('<a ng-prop-href="testUrl"></a>')($rootScope);
      $rootScope.$digest();
      expect(element.prop('href')).toEqual('unsafe:javascript:foo()');
    }));

    it('should not sanitize href on elements other than anchor', inject(function($compile, $rootScope) {
      var element = $compile('<div ng-prop-href="testUrl"></div>')($rootScope);
      $rootScope.testUrl = 'javascript:doEvilStuff()';
      $rootScope.$apply();

      expect(element.prop('href')).toBe('javascript:doEvilStuff()');
    }));

    it('should not sanitize properties other then those configured', inject(function($compile, $rootScope) {
      var element = $compile('<a ng-prop-title="testUrl"></a>')($rootScope);
      $rootScope.testUrl = 'javascript:doEvilStuff()';
      $rootScope.$apply();

      expect(element.prop('title')).toBe('javascript:doEvilStuff()');
    }));

    it('should use $$sanitizeUri', function() {
      var $$sanitizeUri = jasmine.createSpy('$$sanitizeUri').and.returnValue('someSanitizedUrl');
      module(function($provide) {
        $provide.value('$$sanitizeUri', $$sanitizeUri);
      });
      inject(function($compile, $rootScope) {
        var element = $compile('<a ng-prop-href="testUrl"></a>')($rootScope);
        $rootScope.testUrl = 'someUrl';
        $rootScope.$apply();
        expect(element.prop('href')).toMatch(/^http:\/\/.*\/someSanitizedUrl$/);
        expect($$sanitizeUri).toHaveBeenCalledWith($rootScope.testUrl, false);

        $$sanitizeUri.calls.reset();

        element = $compile('<a ng-prop-href="testUrl"></a>')($rootScope);
        $rootScope.$apply();
        expect(element.prop('href')).toMatch(/^http:\/\/.*\/someSanitizedUrl$/);
        expect($$sanitizeUri).toHaveBeenCalledWith($rootScope.testUrl, false);
      });
    });

    it('should not have endless digests when given arrays in concatenable context', inject(function($compile, $rootScope) {
      var element = $compile('<foo ng-prop-href="testUrl"></foo><foo ng-prop-href="::testUrl"></foo>' +
        '<foo ng-prop-href="\'http://example.com/\' + testUrl"></foo><foo ng-prop-href="::\'http://example.com/\' + testUrl"></foo>')($rootScope);
      $rootScope.testUrl = [1];
      $rootScope.$digest();

      $rootScope.testUrl = [];
      $rootScope.$digest();

      $rootScope.testUrl = {a:'b'};
      $rootScope.$digest();

      $rootScope.testUrl = {};
      $rootScope.$digest();
    }));
  });

  describe('iframe[src]', function() {
    it('should pass through src properties for the same domain', inject(function($compile, $rootScope, $sce) {
      var element = $compile('<iframe ng-prop-src="testUrl"></iframe>')($rootScope);
      $rootScope.testUrl = 'different_page';
      $rootScope.$apply();
      expect(element.prop('src')).toMatch(/\/different_page$/);
    }));

    it('should clear out src properties for a different domain', inject(function($compile, $rootScope, $sce) {
      var element = $compile('<iframe ng-prop-src="testUrl"></iframe>')($rootScope);
      $rootScope.testUrl = 'http://a.different.domain.example.com';
      expect(function() { $rootScope.$apply(); }).toThrowMinErr(
          '$sce', 'insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.' +
          '  URL: http://a.different.domain.example.com');
    }));

    it('should clear out JS src properties', inject(function($compile, $rootScope, $sce) {
      var element = $compile('<iframe ng-prop-src="testUrl"></iframe>')($rootScope);
      $rootScope.testUrl = 'javascript:alert(1);';
      expect(function() { $rootScope.$apply(); }).toThrowMinErr(
          '$sce', 'insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.' +
          '  URL: javascript:alert(1);');
    }));

    it('should clear out non-resource_url src properties', inject(function($compile, $rootScope, $sce) {
      var element = $compile('<iframe ng-prop-src="testUrl"></iframe>')($rootScope);
      $rootScope.testUrl = $sce.trustAsUrl('javascript:doTrustedStuff()');
      expect(function() { $rootScope.$apply(); }).toThrowMinErr(
          '$sce', 'insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.' +
          '  URL: javascript:doTrustedStuff()');
    }));

    it('should pass through $sce.trustAs() values in src properties', inject(function($compile, $rootScope, $sce) {
      var element = $compile('<iframe ng-prop-src="testUrl"></iframe>')($rootScope);
      $rootScope.testUrl = $sce.trustAsResourceUrl('javascript:doTrustedStuff()');
      $rootScope.$apply();

      expect(element.prop('src')).toEqual('javascript:doTrustedStuff()');
    }));
  });

  describe('base[href]', function() {
    it('should be a RESOURCE_URL context', inject(function($compile, $rootScope, $sce) {
      var element = $compile('<base ng-prop-href="testUrl"/>')($rootScope);

      $rootScope.testUrl = $sce.trustAsResourceUrl('https://example.com/');
      $rootScope.$apply();
      expect(element.prop('href')).toContain('https://example.com/');

      $rootScope.testUrl = 'https://not.example.com/';
      expect(function() { $rootScope.$apply(); }).toThrowMinErr(
          '$sce', 'insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.' +
          '  URL: https://not.example.com/');
    }));
  });

  describe('form[action]', function() {
    it('should pass through action property for the same domain', inject(function($compile, $rootScope, $sce) {
      var element = $compile('<form ng-prop-action="testUrl"></form>')($rootScope);
      $rootScope.testUrl = 'different_page';
      $rootScope.$apply();
      expect(element.prop('action')).toMatch(/\/different_page$/);
    }));

    it('should clear out action property for a different domain', inject(function($compile, $rootScope, $sce) {
      var element = $compile('<form ng-prop-action="testUrl"></form>')($rootScope);
      $rootScope.testUrl = 'http://a.different.domain.example.com';
      expect(function() { $rootScope.$apply(); }).toThrowMinErr(
          '$sce', 'insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.' +
          '  URL: http://a.different.domain.example.com');
    }));

    it('should clear out JS action property', inject(function($compile, $rootScope, $sce) {
      var element = $compile('<form ng-prop-action="testUrl"></form>')($rootScope);
      $rootScope.testUrl = 'javascript:alert(1);';
      expect(function() { $rootScope.$apply(); }).toThrowMinErr(
          '$sce', 'insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.' +
          '  URL: javascript:alert(1);');
    }));

    it('should clear out non-resource_url action property', inject(function($compile, $rootScope, $sce) {
      var element = $compile('<form ng-prop-action="testUrl"></form>')($rootScope);
      $rootScope.testUrl = $sce.trustAsUrl('javascript:doTrustedStuff()');
      expect(function() { $rootScope.$apply(); }).toThrowMinErr(
          '$sce', 'insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.' +
          '  URL: javascript:doTrustedStuff()');
    }));


    it('should pass through $sce.trustAsResourceUrl() values in action property', inject(function($compile, $rootScope, $sce) {
      var element = $compile('<form ng-prop-action="testUrl"></form>')($rootScope);
      $rootScope.testUrl = $sce.trustAsResourceUrl('javascript:doTrustedStuff()');
      $rootScope.$apply();

      expect(element.prop('action')).toEqual('javascript:doTrustedStuff()');
    }));
  });

  describe('link[href]', function() {
    it('should reject invalid RESOURCE_URLs', inject(function($compile, $rootScope) {
      var element = $compile('<link ng-prop-href="testUrl" rel="stylesheet" />')($rootScope);
      $rootScope.testUrl = 'https://evil.example.org/css.css';
      expect(function() { $rootScope.$apply(); }).toThrowMinErr(
          '$sce', 'insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.' +
          '  URL: https://evil.example.org/css.css');
    }));

    it('should accept valid RESOURCE_URLs', inject(function($compile, $rootScope, $sce) {
      var element = $compile('<link ng-prop-href="testUrl" rel="stylesheet" />')($rootScope);

      $rootScope.testUrl = './css1.css';
      $rootScope.$apply();
      expect(element.prop('href')).toContain('css1.css');

      $rootScope.testUrl = $sce.trustAsResourceUrl('https://elsewhere.example.org/css2.css');
      $rootScope.$apply();
      expect(element.prop('href')).toContain('https://elsewhere.example.org/css2.css');
    }));
  });

  describe('*[innerHTML]', function() {
    describe('SCE disabled', function() {
      beforeEach(function() {
        module(function($sceProvider) { $sceProvider.enabled(false); });
      });

      it('should set html', inject(function($rootScope, $compile) {
        var element = $compile('<div ng-prop-inner_h_t_m_l="html"></div>')($rootScope);
        $rootScope.html = '<div onclick="">hello</div>';
        $rootScope.$digest();
        expect(lowercase(element.html())).toEqual('<div onclick="">hello</div>');
      }));

      it('should update html', inject(function($rootScope, $compile, $sce) {
        var element = $compile('<div ng-prop-inner_h_t_m_l="html"></div>')($rootScope);
        $rootScope.html = 'hello';
        $rootScope.$digest();
        expect(lowercase(element.html())).toEqual('hello');
        $rootScope.html = 'goodbye';
        $rootScope.$digest();
        expect(lowercase(element.html())).toEqual('goodbye');
      }));

      it('should one-time bind if the expression starts with two colons', inject(function($rootScope, $compile) {
        var element = $compile('<div ng-prop-inner_h_t_m_l="::html"></div>')($rootScope);
        $rootScope.html = '<div onclick="">hello</div>';
        expect($rootScope.$$watchers.length).toEqual(1);
        $rootScope.$digest();
        expect(element.text()).toEqual('hello');
        expect($rootScope.$$watchers.length).toEqual(0);
        $rootScope.html = '<div onclick="">hello</div>';
        $rootScope.$digest();
        expect(element.text()).toEqual('hello');
      }));
    });


    describe('SCE enabled', function() {
      it('should NOT set html for untrusted values', inject(function($rootScope, $compile) {
        var element = $compile('<div ng-prop-inner_h_t_m_l="html"></div>')($rootScope);
        $rootScope.html = '<div onclick="">hello</div>';
        expect(function() { $rootScope.$digest(); }).toThrowMinErr('$sce', 'unsafe', 'Attempting to use an unsafe value in a safe context.');
      }));

      it('should NOT set html for wrongly typed values', inject(function($rootScope, $compile, $sce) {
        var element = $compile('<div ng-prop-inner_h_t_m_l="html"></div>')($rootScope);
        $rootScope.html = $sce.trustAsCss('<div onclick="">hello</div>');
        expect(function() { $rootScope.$digest(); }).toThrowMinErr('$sce', 'unsafe', 'Attempting to use an unsafe value in a safe context.');
      }));

      it('should set html for trusted values', inject(function($rootScope, $compile, $sce) {
        var element = $compile('<div ng-prop-inner_h_t_m_l="html"></div>')($rootScope);
        $rootScope.html = $sce.trustAsHtml('<div onclick="">hello</div>');
        $rootScope.$digest();
        expect(lowercase(element.html())).toEqual('<div onclick="">hello</div>');
      }));

      it('should update html', inject(function($rootScope, $compile, $sce) {
        var element = $compile('<div ng-prop-inner_h_t_m_l="html"></div>')($rootScope);
        $rootScope.html = $sce.trustAsHtml('hello');
        $rootScope.$digest();
        expect(lowercase(element.html())).toEqual('hello');
        $rootScope.html = $sce.trustAsHtml('goodbye');
        $rootScope.$digest();
        expect(lowercase(element.html())).toEqual('goodbye');
      }));

      it('should not cause infinite recursion for trustAsHtml object watches',
          inject(function($rootScope, $compile, $sce) {
        // Ref: https://github.com/angular/angular.js/issues/3932
        // If the binding is a function that creates a new value on every call via trustAs, we'll
        // trigger an infinite digest if we don't take care of it.
        var element = $compile('<div ng-prop-inner_h_t_m_l="getHtml()"></div>')($rootScope);
        $rootScope.getHtml = function() {
          return $sce.trustAsHtml('<div onclick="">hello</div>');
        };
        $rootScope.$digest();
        expect(lowercase(element.html())).toEqual('<div onclick="">hello</div>');
      }));

      it('should handle custom $sce objects', function() {
        function MySafeHtml(val) { this.val = val; }

        module(function($provide) {
          $provide.decorator('$sce', function($delegate) {
            $delegate.trustAsHtml = function(html) { return new MySafeHtml(html); };
            $delegate.getTrusted = function(type, mySafeHtml) { return mySafeHtml && mySafeHtml.val; };
            $delegate.valueOf = function(v) { return v instanceof MySafeHtml ? v.val : v; };
            return $delegate;
          });
        });

        inject(function($rootScope, $compile, $sce) {
          // Ref: https://github.com/angular/angular.js/issues/14526
          // Previous code used toString for change detection, which fails for custom objects
          // that don't override toString.
          var element = $compile('<div ng-prop-inner_h_t_m_l="getHtml()"></div>')($rootScope);
          var html = 'hello';
          $rootScope.getHtml = function() { return $sce.trustAsHtml(html); };
          $rootScope.$digest();
          expect(lowercase(element.html())).toEqual('hello');
          html = 'goodbye';
          $rootScope.$digest();
          expect(lowercase(element.html())).toEqual('goodbye');
        });
      });

      describe('when $sanitize is available', function() {
        beforeEach(function() { module('ngSanitize'); });

        it('should sanitize untrusted html', inject(function($rootScope, $compile) {
          var element = $compile('<div ng-prop-inner_h_t_m_l="html"></div>')($rootScope);
          $rootScope.html = '<div onclick="">hello</div>';
          $rootScope.$digest();
          expect(lowercase(element.html())).toEqual('<div>hello</div>');
        }));
      });
    });

  });

  describe('*[style]', function() {
    // Support: IE9
    // Some browsers throw when assignging to HTMLElement.style
    function canAssignStyleProp() {
      try {
        window.document.createElement('div').style = 'margin-left: 10px';
        return true;
      } catch (e) {
        return false;
      }
    }

    it('should NOT set style for untrusted values', inject(function($rootScope, $compile) {
      var element = $compile('<div ng-prop-style="style"></div>')($rootScope);
      $rootScope.style = 'margin-left: 10px';
      expect(function() { $rootScope.$digest(); }).toThrowMinErr('$sce', 'unsafe', 'Attempting to use an unsafe value in a safe context.');
    }));

    it('should NOT set style for wrongly typed values', inject(function($rootScope, $compile, $sce) {
      var element = $compile('<div ng-prop-style="style"></div>')($rootScope);
      $rootScope.style = $sce.trustAsHtml('margin-left: 10px');
      expect(function() { $rootScope.$digest(); }).toThrowMinErr('$sce', 'unsafe', 'Attempting to use an unsafe value in a safe context.');
    }));

    if (canAssignStyleProp()) {
      it('should set style for trusted values', inject(function($rootScope, $compile, $sce) {
        var element = $compile('<div ng-prop-style="style"></div>')($rootScope);
        $rootScope.style = $sce.trustAsCss('margin-left: 10px');
        $rootScope.$digest();

        // Support: IE
        // IE allows assignments but does not register the styles
        // Sometimes the value is '0px', sometimes ''
        if (msie) {
          expect(parseInt(element.css('margin-left'), 10) || 0).toBe(0);
        } else {
          expect(element.css('margin-left')).toEqual('10px');
        }
      }));
    }
  });
});
