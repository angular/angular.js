'use strict';

describe('errors', function() {
  var originalObjectMaxDepthInErrorMessage = minErrConfig.objectMaxDepth;
  var originalUrlErrorParamsEnabled =  minErrConfig.urlErrorParamsEnabled;

  afterEach(function() {
    minErrConfig.objectMaxDepth = originalObjectMaxDepthInErrorMessage;
    minErrConfig.urlErrorParamsEnabled = originalUrlErrorParamsEnabled;
  });

  describe('errorHandlingConfig', function() {
    describe('objectMaxDepth',function() {
      it('should get default objectMaxDepth', function() {
        expect(errorHandlingConfig().objectMaxDepth).toBe(5);
      });

      it('should set objectMaxDepth', function() {
        errorHandlingConfig({objectMaxDepth: 3});
        expect(errorHandlingConfig().objectMaxDepth).toBe(3);
      });

      it('should not change objectMaxDepth when undefined is supplied', function() {
        errorHandlingConfig({objectMaxDepth: undefined});
        expect(errorHandlingConfig().objectMaxDepth).toBe(originalObjectMaxDepthInErrorMessage);
      });

      they('should set objectMaxDepth to NaN when $prop is supplied',
          [NaN, null, true, false, -1, 0], function(maxDepth) {
            errorHandlingConfig({objectMaxDepth: maxDepth});
            expect(errorHandlingConfig().objectMaxDepth).toBeNaN();
          }
      );
    });


    describe('urlErrorParamsEnabled',function() {

      it('should get default urlErrorParamsEnabled', function() {
        expect(errorHandlingConfig().urlErrorParamsEnabled).toBe(true);
      });

      it('should set urlErrorParamsEnabled', function() {
        errorHandlingConfig({urlErrorParamsEnabled: false});
        expect(errorHandlingConfig().urlErrorParamsEnabled).toBe(false);
        errorHandlingConfig({urlErrorParamsEnabled: true});
        expect(errorHandlingConfig().urlErrorParamsEnabled).toBe(true);
      });

      it('should not change its value when non-boolean is supplied', function() {
        errorHandlingConfig({urlErrorParamsEnabled: 123});
        expect(errorHandlingConfig().urlErrorParamsEnabled).toBe(originalUrlErrorParamsEnabled);
      });
    });

  });

  describe('minErr', function() {

    var supportStackTraces = function() {
      var e = new Error();
      return isDefined(e.stack);
    };
    var emptyTestError = minErr(),
      testError = minErr('test');

    it('should return an Error factory', function() {
      var myError = testError('test', 'Oops');
      expect(myError instanceof Error).toBe(true);
    });

    it('should generate stack trace at the frame where the minErr instance was called', function() {
      var myError;

      function someFn() {
        function nestedFn() {
          myError = testError('fail', 'I fail!');
        }
        nestedFn();
      }

      someFn();

      // only Chrome, Firefox have stack
      if (!supportStackTraces()) return;

      expect(myError.stack).toMatch(/^[.\s\S]+nestedFn[.\s\S]+someFn.+/);
    });

    it('should interpolate string arguments without quotes', function() {
      var myError = testError('1', 'This {0} is "{1}"', 'foo', 'bar');
      expect(myError.message).toMatch(/^\[test:1] This foo is "bar"/);
    });

    it('should interpolate non-string arguments', function() {
      var arr = [1, 2, 3],
          obj = {a: 123, b: 'baar'},
          anonFn = function(something) { return something; },
          namedFn = function foo(something) { return something; },
          myError;

      myError = testError('26', 'arr: {0}; obj: {1}; anonFn: {2}; namedFn: {3}',
                                arr,      obj,      anonFn,      namedFn);

      expect(myError.message).toContain('[test:26] arr: [1,2,3]; obj: {"a":123,"b":"baar"};');
    // Support: IE 9-11 only
      // IE does not add space after "function"
      expect(myError.message).toMatch(/anonFn: function\s?\(something\);/);
      expect(myError.message).toContain('namedFn: function foo(something)');
    });

    it('should not suppress falsy objects', function() {
      var myError = testError('26', 'false: {0}; zero: {1}; null: {2}; undefined: {3}; emptyStr: {4}',
                                    false,      0,         null,      undefined,      '');
      expect(myError.message).
          toMatch(/^\[test:26] false: false; zero: 0; null: null; undefined: undefined; emptyStr: /);
    });

    it('should handle arguments that are objects with cyclic references', function() {
      var a = { b: { } };
      a.b.a = a;

      var myError = testError('26', 'a is {0}', a);
      expect(myError.message).toMatch(/a is {"b":{"a":"..."}}/);
    });

    it('should handle arguments that are objects with max depth', function() {
      var a = {b: {c: {d: {e: {f: {g: 1}}}}}};

      var myError = testError('26', 'a when objectMaxDepth is default=5 is {0}', a);
      expect(myError.message).toMatch(/a when objectMaxDepth is default=5 is {"b":{"c":{"d":{"e":{"f":"..."}}}}}/);

      errorHandlingConfig({objectMaxDepth: 1});
      myError = testError('26', 'a when objectMaxDepth is set to 1 is {0}', a);
      expect(myError.message).toMatch(/a when objectMaxDepth is set to 1 is {"b":"..."}/);

      errorHandlingConfig({objectMaxDepth: 2});
      myError = testError('26', 'a when objectMaxDepth is set to 2 is {0}', a);
      expect(myError.message).toMatch(/a when objectMaxDepth is set to 2 is {"b":{"c":"..."}}/);

      errorHandlingConfig({objectMaxDepth: undefined});
      myError = testError('26', 'a when objectMaxDepth is set to undefined is {0}', a);
      expect(myError.message).toMatch(/a when objectMaxDepth is set to undefined is {"b":{"c":"..."}}/);
    });

    they('should handle arguments that are objects and ignore max depth when objectMaxDepth = $prop',
      [NaN, null, true, false, -1, 0], function(maxDepth) {
        var a = {b: {c: {d: {e: {f: {g: 1}}}}}};

        errorHandlingConfig({objectMaxDepth: maxDepth});
        var myError = testError('26', 'a is {0}', a);
        expect(myError.message).toMatch(/a is {"b":{"c":{"d":{"e":{"f":{"g":1}}}}}}/);
      }
    );

    it('should preserve interpolation markers when fewer arguments than needed are provided', function() {
      // this way we can easily see if we are passing fewer args than needed

      var foo = 'Fooooo',
          myError = testError('26', 'This {0} is {1} on {2}', foo);

      expect(myError.message).toMatch(/^\[test:26] This Fooooo is \{1\} on \{2\}/);
    });


    it('should pass through the message if no interpolation is needed', function() {
      var myError = testError('26', 'Something horrible happened!');
      expect(myError.message).toMatch(/^\[test:26] Something horrible happened!/);
    });

    it('should include a namespace in the message only if it is namespaced', function() {
      var myError = emptyTestError('26', 'This is a {0}', 'Foo');
      var myNamespacedError = testError('26', 'That is a {0}', 'Bar');
      expect(myError.message).toMatch(/^\[26] This is a Foo/);
      expect(myNamespacedError.message).toMatch(/^\[test:26] That is a Bar/);
    });


    it('should accept an optional 2nd argument to construct custom errors', function() {
      var normalMinErr = minErr('normal');
      expect(normalMinErr('acode', 'aproblem') instanceof TypeError).toBe(false);
      var typeMinErr = minErr('type', TypeError);
      expect(typeMinErr('acode', 'aproblem') instanceof TypeError).toBe(true);
    });


    it('should include a properly formatted error reference URL in the message', function() {
      // to avoid maintaining the root URL in two locations, we only validate the parameters
      expect(testError('acode', 'aproblem', 'a', 'b', 'value with space').message)
        .toMatch(/^[\s\S]*\?p0=a&p1=b&p2=value%20with%20space$/);
    });

    it('should strip error reference urls from the error message parameters', function() {
      var firstError = testError('firstcode', 'longer string and so on');

      var error = testError('secondcode', 'description {0}, and {1}', 'a', firstError.message);

      expect(error.message).toBe('[test:secondcode] description a, and [test:firstcode] longer ' +
        'string and so on\n\nhttps://errors.angularjs.org/"NG_VERSION_FULL"/test/' +
        'secondcode?p0=a&p1=%5Btest%3Afirstcode%5D%20longer%20string%20and%20so%20on%0Ahttps' +
        '%3A%2F%2Ferrors.angularjs.org%2F%22NG_VERSION_FULL%22%2Ftest%2Ffirstcode');
    });

    it('should not generate URL query parameters when urlErrorParamsEnabled is  false', function() {

      errorHandlingConfig({urlErrorParamsEnabled: false});

      expect(testError('acode', 'aproblem', 'a', 'b', 'c').message).toBe('[test:acode] aproblem\n' +
        'https://errors.angularjs.org/"NG_VERSION_FULL"/test/acode');
    });

  });
});
