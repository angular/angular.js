'use strict';

describe('SCE', function() {

  // Work around an IE8 bug.  Though window.inject === angular.mock.inject, if it's invoked the
  // window scope, IE8 loses the exception object that bubbles up and replaces it with a TypeError.
  // By using a local alias, it gets invoked on the global scope instead of window.
  // Ref: https://github.com/angular/angular.js/pull/4221#/issuecomment-25515813
  var inject = angular.mock.inject;

  describe('when disabled', function() {
    beforeEach(function() {
      module(function($sceProvider) {
        $sceProvider.enabled(false);
      });
    });

    it('should provide the getter for enabled', inject(function($sce) {
      expect($sce.isEnabled()).toBe(false);
    }));

    it('should not wrap/unwrap any value or throw exception on non-string values', inject(function($sce) {
      var originalValue = { foo: "bar" };
      expect($sce.trustAs($sce.JS, originalValue)).toBe(originalValue);
      expect($sce.getTrusted($sce.JS, originalValue)).toBe(originalValue);
    }));
  });

  describe('IE<11 quirks mode', function() {
    /* global msie: true */
    var msieBackup;

    beforeEach(function() {
      msieBackup = msie;
    });

    afterEach(function() {
      msie = msieBackup;
    });

    function runTest(enabled, documentMode, expectException) {
      msie = documentMode;
      module(function($provide) {
        $provide.value('$sceDelegate', {trustAs: null, valueOf: null, getTrusted: null});
      });

      inject(function($window, $injector) {
        function constructSce() {
          /* global $SceProvider: false */
          var sceProvider = new $SceProvider();
          sceProvider.enabled(enabled);
          return $injector.invoke(sceProvider.$get, sceProvider);
        }

        if (expectException) {
          expect(constructSce).toThrowMinErr(
            '$sce', 'iequirks', 'Strict Contextual Escaping does not support Internet Explorer ' +
              'version < 11 in quirks mode.  You can fix this by adding the text <!doctype html> to ' +
              'the top of your HTML document.  See http://docs.angularjs.org/api/ng.$sce for more ' +
              'information.');
        } else {
          // no exception.
          constructSce();
        }
      });
    }

    it('should throw an exception when sce is enabled in quirks mode', function() {
      runTest(true, 7, true);
    });

    it('should NOT throw an exception when sce is enabled and in standards mode', function() {
      runTest(true, 8, false);
    });

    it('should NOT throw an exception when sce is enabled and documentMode is undefined', function() {
      runTest(true, undefined, false);
    });

    it('should NOT throw an exception when sce is disabled even when in quirks mode', function() {
      runTest(false, 7, false);
    });

    it('should NOT throw an exception when sce is disabled and in standards mode', function() {
      runTest(false, 8, false);
    });

    it('should NOT throw an exception when sce is disabled and documentMode is undefined', function() {
      runTest(false, undefined, false);
    });
  });

  describe('when enabled', function() {
    it('should wrap string values with TrustedValueHolder', inject(function($sce) {
      var originalValue = 'original_value';
      var wrappedValue = $sce.trustAs($sce.HTML, originalValue);
      expect(typeof wrappedValue).toBe('object');
      expect($sce.getTrusted($sce.HTML, wrappedValue)).toBe('original_value');
      expect(function() { $sce.getTrusted($sce.CSS, wrappedValue); }).toThrowMinErr(
          '$sce', 'unsafe', 'Attempting to use an unsafe value in a safe context.');
      wrappedValue = $sce.trustAs($sce.CSS, originalValue);
      expect(typeof wrappedValue).toBe('object');
      expect($sce.getTrusted($sce.CSS, wrappedValue)).toBe('original_value');
      expect(function() { $sce.getTrusted($sce.HTML, wrappedValue); }).toThrowMinErr(
          '$sce', 'unsafe', 'Attempting to use an unsafe value in a safe context.');
      wrappedValue = $sce.trustAs($sce.URL, originalValue);
      expect(typeof wrappedValue).toBe('object');
      expect($sce.getTrusted($sce.URL, wrappedValue)).toBe('original_value');
      wrappedValue = $sce.trustAs($sce.JS, originalValue);
      expect(typeof wrappedValue).toBe('object');
      expect($sce.getTrusted($sce.JS, wrappedValue)).toBe('original_value');
    }));

    it('should NOT wrap non-string values', inject(function($sce) {
      expect(function() { $sce.trustAsCss(123); }).toThrowMinErr(
          '$sce', 'itype', 'Attempted to trust a non-string value in a content requiring a string: ' +
          'Context: css');
    }));

    it('should NOT wrap unknown contexts', inject(function($sce) {
      expect(function() { $sce.trustAs('unknown1', '123'); }).toThrowMinErr(
          '$sce', 'icontext', 'Attempted to trust a value in invalid context. Context: unknown1; Value: 123');
    }));

    it('should NOT wrap undefined context', inject(function($sce) {
      expect(function() { $sce.trustAs(undefined, '123'); }).toThrowMinErr(
          '$sce', 'icontext', 'Attempted to trust a value in invalid context. Context: undefined; Value: 123');
    }));

    it('should wrap undefined into undefined', inject(function($sce) {
      expect($sce.trustAsHtml(undefined)).toBe(undefined);
    }));

    it('should unwrap undefined into undefined', inject(function($sce) {
      expect($sce.getTrusted($sce.HTML, undefined)).toBe(undefined);
    }));

    it('should wrap null into null', inject(function($sce) {
      expect($sce.trustAsHtml(null)).toBe(null);
    }));

    it('should unwrap null into null', inject(function($sce) {
      expect($sce.getTrusted($sce.HTML, null)).toBe(null);
    }));

    it('should wrap "" into ""', inject(function($sce) {
      expect($sce.trustAsHtml("")).toBe("");
    }));

    it('should unwrap "" into ""', inject(function($sce) {
      expect($sce.getTrusted($sce.HTML, "")).toBe("");
    }));

    it('should unwrap values and return the original', inject(function($sce) {
      var originalValue = "originalValue";
      var wrappedValue = $sce.trustAs($sce.HTML, originalValue);
      expect($sce.getTrusted($sce.HTML, wrappedValue)).toBe(originalValue);
    }));

    it('should NOT unwrap values when the type is different', inject(function($sce) {
      var originalValue = "originalValue";
      var wrappedValue = $sce.trustAs($sce.HTML, originalValue);
      expect(function() { $sce.getTrusted($sce.CSS, wrappedValue); }).toThrowMinErr(
          '$sce', 'unsafe', 'Attempting to use an unsafe value in a safe context.');
    }));

    it('should NOT unwrap values that had not been wrapped', inject(function($sce) {
      function TrustedValueHolder(trustedValue) {
        this.$unwrapTrustedValue = function() {
          return trustedValue;
        };
      }
      var wrappedValue = new TrustedValueHolder("originalValue");
      expect(function() { return $sce.getTrusted($sce.HTML, wrappedValue); }).toThrowMinErr(
          '$sce', 'unsafe', 'Attempting to use an unsafe value in a safe context.');
    }));

    it('should implement toString on trusted values', inject(function($sce) {
      var originalValue = '123',
          wrappedValue = $sce.trustAsHtml(originalValue);
      expect($sce.getTrustedHtml(wrappedValue)).toBe(originalValue);
      expect(wrappedValue.toString()).toBe(originalValue.toString());
    }));
  });


  describe('replace $sceDelegate', function() {
    it('should override the default $sce.trustAs/valueOf/etc.', function() {
      module(function($provide) {
        $provide.value('$sceDelegate', {
          trustAs: function(type, value) { return "wrapped:"   + value; },
          getTrusted: function(type, value) { return "unwrapped:" + value; },
          valueOf: function(value) { return "valueOf:" + value; }
        });
      });

      inject(function($sce) {
        expect($sce.trustAsJs("value")).toBe("wrapped:value");
        expect($sce.valueOf("value")).toBe("valueOf:value");
        expect($sce.getTrustedJs("value")).toBe("unwrapped:value");
        expect($sce.parseAsJs("name")({name: "chirayu"})).toBe("unwrapped:chirayu");
      });
    });
  });


  describe('$sce.parseAs', function($sce) {
    it('should parse constant literals as trusted', inject(function($sce) {
      expect($sce.parseAsJs('1')()).toBe(1);
      expect($sce.parseAsJs('1', $sce.ANY)()).toBe(1);
      expect($sce.parseAsJs('1', $sce.HTML)()).toBe(1);
      expect($sce.parseAsJs('1', 'UNDEFINED')()).toBe(1);
      expect($sce.parseAsJs('true')()).toBe(true);
      expect($sce.parseAsJs('false')()).toBe(false);
      expect($sce.parseAsJs('null')()).toBe(null);
      expect($sce.parseAsJs('undefined')()).toBe(undefined);
      expect($sce.parseAsJs('"string"')()).toBe("string");
    }));

    it('should be possible to do one-time binding', function() {
      module(provideLog);
      inject(function($sce, $rootScope, log) {
        $rootScope.$watch($sce.parseAsHtml('::foo'), function(value) {
          log(value + '');
        });

        $rootScope.$digest();
        expect(log).toEqual('undefined'); // initial listener call
        log.reset();

        $rootScope.foo = $sce.trustAs($sce.HTML, 'trustedValue');
        expect($rootScope.$$watchers.length).toBe(1);
        $rootScope.$digest();

        expect($rootScope.$$watchers.length).toBe(0);
        expect(log).toEqual('trustedValue');
        log.reset();

        $rootScope.foo = $sce.trustAs($sce.HTML, 'anotherTrustedValue');
        $rootScope.$digest();
        expect(log).toEqual(''); // watcher no longer active
      });
    });

    it('should NOT parse constant non-literals', inject(function($sce) {
      // Until there's a real world use case for this, we're disallowing
      // constant non-literals.  See $SceParseProvider.
      var exprFn = $sce.parseAsJs('1+1');
      expect(exprFn).toThrow();
    }));

    it('should NOT return untrusted values from expression function', inject(function($sce) {
      var exprFn = $sce.parseAs($sce.HTML, 'foo');
      expect(function() {
        return exprFn({}, {'foo': true});
      }).toThrowMinErr(
          '$sce', 'unsafe', 'Attempting to use an unsafe value in a safe context.');
    }));

    it('should NOT return trusted values of the wrong type from expression function', inject(function($sce) {
      var exprFn = $sce.parseAs($sce.HTML, 'foo');
      expect(function() {
        return exprFn({}, {'foo': $sce.trustAs($sce.JS, '123')});
      }).toThrowMinErr(
          '$sce', 'unsafe', 'Attempting to use an unsafe value in a safe context.');
    }));

    it('should return trusted values from expression function', inject(function($sce) {
      var exprFn = $sce.parseAs($sce.HTML, 'foo');
      expect(exprFn({}, {'foo': $sce.trustAs($sce.HTML, 'trustedValue')})).toBe('trustedValue');
    }));

    it('should support shorthand methods', inject(function($sce) {
      // Test shorthand parse methods.
      expect($sce.parseAsHtml('1')()).toBe(1);
      // Test short trustAs methods.
      expect($sce.trustAsAny).toBeUndefined();
      expect(function() {
        // mismatched types.
        $sce.parseAsCss('foo')({}, {'foo': $sce.trustAsHtml('1')});
      }).toThrowMinErr(
          '$sce', 'unsafe', 'Attempting to use an unsafe value in a safe context.');
    }));

  });

  describe('$sceDelegate resource url policies', function() {
    function runTest(cfg, testFn) {
      return function() {
        module(function($sceDelegateProvider) {
          if (cfg.whiteList !== undefined) {
            $sceDelegateProvider.resourceUrlWhitelist(cfg.whiteList);
          }
          if (cfg.blackList !== undefined) {
            $sceDelegateProvider.resourceUrlBlacklist(cfg.blackList);
          }
        });
        inject(testFn);
      };
    }

    it('should default to "self" which allows relative urls', runTest({}, function($sce, $document) {
      expect($sce.getTrustedResourceUrl('foo/bar')).toEqual('foo/bar');
    }));

    it('should reject everything when whitelist is empty', runTest(
      {
        whiteList: [],
        blackList: []
      }, function($sce) {
        expect(function() { $sce.getTrustedResourceUrl('#'); }).toThrowMinErr(
          '$sce', 'insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: #');
      }
    ));

    it('should match against normalized urls', runTest(
      {
        whiteList: [/^foo$/],
        blackList: []
      }, function($sce) {
        expect(function() { $sce.getTrustedResourceUrl('foo'); }).toThrowMinErr(
          '$sce', 'insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: foo');
      }
    ));

    it('should not accept unknown matcher type', function() {
      expect(function() {
        runTest({whiteList: [{}]}, null)();
      }).toThrowMinErr('$injector', 'modulerr', new RegExp(
          /Failed to instantiate module function ?\(\$sceDelegateProvider\) due to:\n/.source +
          /[^[]*\[\$sce:imatcher\] Matchers may only be "self", string patterns or RegExp objects/.source));
    });

    describe('adjustMatcher', function() {
      /* global adjustMatcher: false */
      it('should rewrite regex into regex and add ^ & $ on either end', function() {
        expect(adjustMatcher(/a.*b/).exec('a.b')).not.toBeNull();
        expect(adjustMatcher(/a.*b/).exec('-a.b-')).toBeNull();
        // Adding ^ & $ onto a regex that already had them should also work.
        expect(adjustMatcher(/^a.*b$/).exec('a.b')).not.toBeNull();
        expect(adjustMatcher(/^a.*b$/).exec('-a.b-')).toBeNull();
      });
    });

    describe('regex matcher', function() {
      it('should support custom regex', runTest(
        {
          whiteList: [/^http:\/\/example\.com\/.*/],
          blackList: []
        }, function($sce) {
          expect($sce.getTrustedResourceUrl('http://example.com/foo')).toEqual('http://example.com/foo');
          // must match entire regex
          expect(function() { $sce.getTrustedResourceUrl('https://example.com/foo'); }).toThrowMinErr(
            '$sce', 'insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: https://example.com/foo');
          // https doesn't match (mismatched protocol.)
          expect(function() { $sce.getTrustedResourceUrl('https://example.com/foo'); }).toThrowMinErr(
            '$sce', 'insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: https://example.com/foo');
        }
      ));

      it('should match entire regex', runTest(
        {
          whiteList: [/https?:\/\/example\.com\/foo/],
          blackList: []
        }, function($sce) {
          expect($sce.getTrustedResourceUrl('http://example.com/foo')).toEqual('http://example.com/foo');
          expect($sce.getTrustedResourceUrl('https://example.com/foo')).toEqual('https://example.com/foo');
          expect(function() { $sce.getTrustedResourceUrl('http://example.com/fo'); }).toThrowMinErr(
            '$sce', 'insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: http://example.com/fo');
          // Suffix not allowed even though original regex does not contain an ending $.
          expect(function() { $sce.getTrustedResourceUrl('http://example.com/foo2'); }).toThrowMinErr(
            '$sce', 'insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: http://example.com/foo2');
          // Prefix not allowed even though original regex does not contain a leading ^.
          expect(function() { $sce.getTrustedResourceUrl('xhttp://example.com/foo'); }).toThrowMinErr(
            '$sce', 'insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: xhttp://example.com/foo');
        }
      ));
    });

    describe('string matchers', function() {
      it('should support strings as matchers', runTest(
        {
          whiteList: ['http://example.com/foo'],
          blackList: []
        }, function($sce) {
          expect($sce.getTrustedResourceUrl('http://example.com/foo')).toEqual('http://example.com/foo');
          // "." is not a special character like in a regex.
          expect(function() { $sce.getTrustedResourceUrl('http://example-com/foo'); }).toThrowMinErr(
            '$sce', 'insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: http://example-com/foo');
          // You can match a prefix.
          expect(function() { $sce.getTrustedResourceUrl('http://example.com/foo2'); }).toThrowMinErr(
            '$sce', 'insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: http://example.com/foo2');
          // You can match a suffix.
          expect(function() { $sce.getTrustedResourceUrl('xhttp://example.com/foo'); }).toThrowMinErr(
            '$sce', 'insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: xhttp://example.com/foo');
        }
      ));

      it('should support the * wildcard', runTest(
        {
          whiteList: ['http://example.com/foo*'],
          blackList: []
        }, function($sce) {
          expect($sce.getTrustedResourceUrl('http://example.com/foo')).toEqual('http://example.com/foo');
          // The * wildcard should match extra characters.
          expect($sce.getTrustedResourceUrl('http://example.com/foo-bar')).toEqual('http://example.com/foo-bar');
          // The * wildcard does not match ':'
          expect(function() { $sce.getTrustedResourceUrl('http://example-com/foo:bar'); }).toThrowMinErr(
            '$sce', 'insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: http://example-com/foo:bar');
          // The * wildcard does not match '/'
          expect(function() { $sce.getTrustedResourceUrl('http://example-com/foo/bar'); }).toThrowMinErr(
            '$sce', 'insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: http://example-com/foo/bar');
          // The * wildcard does not match '.'
          expect(function() { $sce.getTrustedResourceUrl('http://example-com/foo.bar'); }).toThrowMinErr(
            '$sce', 'insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: http://example-com/foo.bar');
          // The * wildcard does not match '?'
          expect(function() { $sce.getTrustedResourceUrl('http://example-com/foo?bar'); }).toThrowMinErr(
            '$sce', 'insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: http://example-com/foo?bar');
          // The * wildcard does not match '&'
          expect(function() { $sce.getTrustedResourceUrl('http://example-com/foo&bar'); }).toThrowMinErr(
            '$sce', 'insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: http://example-com/foo&bar');
          // The * wildcard does not match ';'
          expect(function() { $sce.getTrustedResourceUrl('http://example-com/foo;bar'); }).toThrowMinErr(
            '$sce', 'insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: http://example-com/foo;bar');
        }
      ));

      it('should support the ** wildcard', runTest(
        {
          whiteList: ['http://example.com/foo**'],
          blackList: []
        }, function($sce) {
          expect($sce.getTrustedResourceUrl('http://example.com/foo')).toEqual('http://example.com/foo');
          // The ** wildcard should match extra characters.
          expect($sce.getTrustedResourceUrl('http://example.com/foo-bar')).toEqual('http://example.com/foo-bar');
          // The ** wildcard accepts the ':/.?&' characters.
          expect($sce.getTrustedResourceUrl('http://example.com/foo:1/2.3?4&5-6')).toEqual('http://example.com/foo:1/2.3?4&5-6');
        }
      ));

      it('should not accept *** in the string', function() {
        expect(function() {
          runTest({whiteList: ['http://***']}, null)();
        }).toThrowMinErr('$injector', 'modulerr', new RegExp(
             /Failed to instantiate module function ?\(\$sceDelegateProvider\) due to:\n/.source +
             /[^[]*\[\$sce:iwcard\] Illegal sequence \*\*\* in string matcher\.  String: http:\/\/\*\*\*/.source));
      });
    });

    describe('"self" matcher', function() {
      it('should support the special string "self" in whitelist', runTest(
        {
          whiteList: ['self'],
          blackList: []
        }, function($sce) {
          expect($sce.getTrustedResourceUrl('foo')).toEqual('foo');
        }
      ));

      it('should support the special string "self" in blacklist', runTest(
        {
          whiteList: [/.*/],
          blackList: ['self']
        }, function($sce) {
          expect(function() { $sce.getTrustedResourceUrl('foo'); }).toThrowMinErr(
            '$sce', 'insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: foo');
        }
      ));
    });

    it('should have blacklist override the whitelist', runTest(
      {
        whiteList: ['self'],
        blackList: ['self']
      }, function($sce) {
        expect(function() { $sce.getTrustedResourceUrl('foo'); }).toThrowMinErr(
          '$sce', 'insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: foo');
      }
    ));

    it('should support multiple items in both lists', runTest(
      {
        whiteList: [/^http:\/\/example.com\/1$/, /^http:\/\/example.com\/2$/, /^http:\/\/example.com\/3$/, 'self'],
        blackList: [/^http:\/\/example.com\/3$/, /.*\/open_redirect/]
      }, function($sce) {
        expect($sce.getTrustedResourceUrl('same_domain')).toEqual('same_domain');
        expect($sce.getTrustedResourceUrl('http://example.com/1')).toEqual('http://example.com/1');
        expect($sce.getTrustedResourceUrl('http://example.com/2')).toEqual('http://example.com/2');
        expect(function() { $sce.getTrustedResourceUrl('http://example.com/3'); }).toThrowMinErr(
          '$sce', 'insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: http://example.com/3');
        expect(function() { $sce.getTrustedResourceUrl('open_redirect'); }).toThrowMinErr(
          '$sce', 'insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: open_redirect');
      }
    ));
  });

  describe('sanitizing html', function() {
    describe('when $sanitize is NOT available', function() {
      it('should throw an exception for getTrusted(string) values', inject(function($sce) {
        expect(function() { $sce.getTrustedHtml('<b></b>'); }).toThrowMinErr(
            '$sce', 'unsafe', 'Attempting to use an unsafe value in a safe context.');
      }));
    });

    describe('when $sanitize is available', function() {
      beforeEach(function() { module('ngSanitize'); });
      it('should sanitize html using $sanitize', inject(function($sce) {
        expect($sce.getTrustedHtml('a<xxx><B>b</B></xxx>c')).toBe('a<b>b</b>c');
      }));
    });
  });
});

