'use strict';

describe('ngError', function() {

  var supportStackTraces = function() {
    var e = new Error();
    return isDefined(e.stack);
  };

  it('should return an Error instance', function() {
    var myError = ngError();
    expect(myError instanceof Error).toBe(true);
  });


  it('should generate stack trace at the frame where ngError was called', function() {
    var myError;

    function someFn() {
      function nestedFn() {
        myError = ngError(0, "I fail!");
      }
      nestedFn();
    }

    someFn();

    // only Chrome, Firefox have stack
    if (!supportStackTraces()) return;

    expect(myError.stack).toMatch(/^[.\s\S]+nestedFn[.\s\S]+someFn.+/);
  });


  it('should interpolate string arguments without quotes', function() {
    var myError = ngError(26, 'This {0} is "{1}"', 'foo', 'bar');
    expect(myError.message).toBe('[NgErr26] This foo is "bar"');
  });


  it('should interpolate non-string arguments', function() {
    var arr = [1, 2, 3],
        obj = {a: 123, b: 'baar'},
        anonFn = function(something) { return something; },
        namedFn = function foo(something) { return something; },
        myError;

    myError = ngError(26, 'arr: {0}; obj: {1}; anonFn: {2}; namedFn: {3}',
                               arr,      obj,      anonFn,      namedFn);

    expect(myError.message).toContain('[NgErr26] arr: [1,2,3]; obj: {"a":123,"b":"baar"};');
    // IE does not add space after "function"
    expect(myError.message).toMatch(/anonFn: function\s?\(something\);/);
    expect(myError.message).toContain('namedFn: function foo(something)');
  });


  it('should not suppress falsy objects', function() {
    var myError = ngError(26, 'false: {0}; zero: {1}; null: {2}; undefined: {3}; emptyStr: {4}',
                                   false,      0,         null,      undefined,      '');
    expect(myError.message).
        toBe('[NgErr26] false: false; zero: 0; null: null; undefined: undefined; emptyStr: ');
  });


  it('should preserve interpolation markers when fewer arguments than needed are provided', function() {
    // this way we can easily see if we are passing fewer args than needed

    var foo = 'Fooooo',
        myError = ngError(26, 'This {0} is {1} on {2}', foo);

    expect(myError.message).toBe('[NgErr26] This Fooooo is {1} on {2}');
  });


  it('should pass through the message if no interpolation is needed', function() {
    var myError = ngError(26, 'Something horrible happened!');
    expect(myError.message).toBe('[NgErr26] Something horrible happened!');
  });
});
