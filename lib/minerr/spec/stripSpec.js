'use strict';

/*global beforeEach, describe, expect, it, jasmine, minErr*/

var esprima = require('esprima');
var minerr = require('../strip.js');

describe('The MinErr parser', function () {

  var strip, logger, toAST;

  toAST = function (code, options) {
    // Converts a function into an AST using Esprima.
    return esprima.parse('(' + code.toString() + ')', options || {});
  };

  beforeEach(function () {
    logger = jasmine.createSpyObj('logger', ['error']);
    strip = minerr({ logger: logger });

    this.addMatchers({
      toTransformTo: function (expected) {
        var actualAST = strip(toAST(this.actual), {}),
          expectedAST = toAST(expected);
        return JSON.stringify(actualAST) === JSON.stringify(expectedAST);
      },
      toExtract: function (expected) {
        var extractedErrors = {};
        strip(toAST(this.actual), extractedErrors);
        return JSON.stringify(extractedErrors) === JSON.stringify(expected);
      }
    });
  });
  
  it('should strip error messages from calls to MinErr instances', function () {
    var ast = {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'fooMinErr'
      },
      arguments: [
        {
          type: 'Literal',
          value: 'test1'
        },
        {
          type: 'Literal',
          value: 'test {0}'
        },
        {
          type: 'Literal',
          value: 'foobaz'
        }
      ]
    };
    var expected = {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'fooMinErr'
      },
      arguments: [
        {
          type: 'Literal',
          value: 'test1'
        },
        {
          type: 'Literal',
          value: 'foobaz'
        }
      ]
    };
    expect(strip(ast, {})).toEqual(expected);
  });

  it('should strip error messages from curried calls to minErr', function () {
    var ast = {
      type: 'CallExpression',
      callee: {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'minErr'
        }
      },
      arguments: [
        {
          type: 'Literal',
          value: 'test1'
        },
        {
          type: 'Literal',
          value: 'test {0}'
        },
        {
          type: 'Literal',
          value: 'foobaz'
        }
      ]
    };
    var expected = {
      type: 'CallExpression',
      callee: {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'minErr'
        }
      },
      arguments: [
        {
          type: 'Literal',
          value: 'test1'
        },
        {
          type: 'Literal',
          value: 'foobaz'
        }
      ]
    };
    expect(strip(ast, {})).toEqual(expected);
  });

  it('should remove the descriptive name', function () {
    expect(function(testMinErr, test) {
      testMinErr('test1', 'This is a {0}', test);
    }).toTransformTo(function (testMinErr, test) {
      testMinErr('test1', test);
    });
  });

  it('should extract error info', function () {
    expect(function(testMinErr, test) {
      testMinErr('test1', 'This is a {0}', test);
    }).toExtract({ test: {
      test1: 'This is a {0}'
    }});
  });

  it('should extract multiple error messages from a single namespace', function () {
    expect(function(testMinErr, test) {
      testMinErr('test1', 'This is a {0}', test);
      minErr('test')('test2', 'The answer is {0}', 42);
    }).toExtract({ test: {
      test1: 'This is a {0}',
      test2: 'The answer is {0}'
    }});
  });

  it('should extract multiple error messages from multiple namespaces', function () {
    expect(function (fooMinErr, barMinErr) {
      fooMinErr('one', 'Too many {0}', 'hippies');
      barMinErr('one', 'Not enough {0}', 'mojo');
      fooMinErr('three', 'The answer is {0}', 42);
    }).toExtract({
      foo: {
        one: 'Too many {0}',
        three: 'The answer is {0}'
      },
      bar: {
        one: 'Not enough {0}'
      }
    });
  });

  it('should warn when it finds an error that is not a MinErr', function () {
    var ast = toAST(function () {
        throw new Error('Oops!');
      });
    strip(ast, {});
    expect(logger.error).toHaveBeenCalledWith('Error is not a minErr instance');
  });

  it('should warn with a filename and syntax location when available', function () {
    var ast = toAST(function () {
        throw new Error('Oops!');
      }, {loc: true});
    strip(ast, {}, 'test1.js');
    expect(logger.error.calls.length).toEqual(1);
    expect(logger.error.mostRecentCall.args[0]).toMatch(
      /test1\.js:\d+:\d+: Error is not a minErr instance/
      );
  });

  it('should not transform non-minErr errors', function () {
    expect(function (testMinErr, test) {
      throw new Error(testMinErr('test1', 'This is a {0}', test));
    }).toTransformTo(function (testMinErr, test) {
      throw new Error(testMinErr('test1', 'This is a {0}', test));
    });
  });

  it('should not modify functions that don\'t use MinErr', function () {
    expect(function (foo, baz) {
      for (var i = 0; i < baz; i++) {
        console.log('Hi there!');
      }
      return 42 - foo;
    }).toTransformTo(function (foo, baz) {
      for (var i = 0; i < baz; i++) {
        console.log('Hi there!');
      }
      return 42 - foo;
    });
  });

  it('should not modify functions that use MinErr instances but do not call them', function () {
    expect(function () {
      var fooMinErr = minErr('foo');
      return fooMinErr;
    }).toTransformTo(function () {
      var fooMinErr = minErr('foo');
      return fooMinErr;
    });
  });

  it('should extract minErr errors from nested call expressions', function () {
    expect(function (testMinErr) {
      (function (foo) {
        testMinErr('nest', 'This {0} should be extracted', foo);
      })('test');
    }).toExtract({ test: {
      nest: 'This {0} should be extracted'
    }});
  });

  it('should handle concatenated error message strings', function () {
    expect(function (testMinErr) {
      testMinErr('test', 'This is' + ' a very long ' + 'string.');
    }).toExtract({ test: {
      test: 'This is a very long string.'
    }});
  });

  it('should throw an error if it finds a variable template string', function () {
    var ast = toAST(function (foo) {
        var testMinErr = minErr('test');
        testMinErr('test', foo, 42);
      });
    expect(function () {
        strip(ast);
      }).toThrow();
  });

  it('should throw an error if it finds a variable error code', function () {
    var ast = toAST(function (foo) {
        var testMinErr = minErr('test');
        testMinErr(foo, 'The answer is {0}', 42);
      });
    expect(function () {
        strip(ast);
      }).toThrow();
  });

  it('should substitute the production minErr AST', function () {
    var ast = esprima.parse(
        ' function minErr(module) {' +
        '   console.log("This should be ripped out.");' +
        ' }'),
      expectedCode = esprima.parse(
        ' function minErr(module) {' +
        '   return module + 42;' +
        ' }'),
      subAst = toAST(function minErr (module) {
          return module + 42;
        }).body[0].expression,
      strip;

    strip = minerr({ logger: logger, minErrAst: subAst });
    expect(JSON.stringify(strip(ast))).toEqual(JSON.stringify(expectedCode));
  });

  it('should preserve regular expressions when substituting a minErr AST', function () {
    // This DOES NOT work for regular expression literals.
    // Use the RegExp constructor when creating regexes in minErr implementations.
    var ast = esprima.parse(
        ' function minErr(module) {' +
        '   console.log("This should be ripped out.");' +
        ' }'),
      expectedCode = esprima.parse(
        ' function minErr(module) {' +
        '   return new RegExp(module + "\\\\d+");' +
        ' }'),
      subAst = toAST(function minErr(module) {
          return new RegExp(module + '\\d+');
        }).body[0].expression,
      strip;

    strip = minerr({ logger: logger, minErrAst: subAst });
    expect(JSON.stringify(strip(ast))).toEqual(JSON.stringify(expectedCode));
  });
});
