'use strict';

/*global toString*/

var escodegen = require('escodegen');

function isAST(obj) {
  return obj && typeof(obj) === 'object' && obj.type !== undefined;
}

function isASTArray(value) {
  if (toString.apply(value) === '[object Array]') {
    return value.every(isAST);
  }
  return false;
}

function isMinErrCall(ast) {
  // Returns true if the AST represents a call to 'minErr', false otherwise.
  // Code example:
  //
  //    minErr('test'); // isMinErrCall() returns true
  //
  if (ast.type !== 'CallExpression') {
    return false;
  }
  if (ast.callee.type === 'Identifier' && ast.callee.name === 'minErr') {
    return true;
  }
  return false;
}

function isMinErrInstance(ast) {
  // MinErr instance must be a call expression.
  // throw minErr([module])(code, template, ...)
  // throw moduleMinErr(code, template, ...)
  if (ast.type !== 'CallExpression') {
    return false;
  }
  if (ast.callee.type === 'Identifier' && ast.callee.name.match(/^\S+MinErr$/)) {
    return true;
  }
  if (isMinErrCall(ast.callee)) {
    return true;
  }
  return false;
}

function toCode(ast) {
  return escodegen.generate(ast, {
      format: {
        indent: {
          style: '  ',
          base: 0,
        }
      }
    });
}

function getString(ast) {
  if (ast.type === 'Literal') {
    return ast.value;
  } else if (ast.type === 'BinaryExpression' && ast.operator === '+') {
    return getString(ast.left) + getString(ast.right);
  }
  throw new Error('Can\'t determine static value of expression: ' + toCode(ast));
}

function getNamespace(instance) {
  if (instance.callee.type === 'Identifier') {
    return instance.callee.name.match(/^(\S+)MinErr$/)[1];
  } else if (instance.callee.arguments) {
    return getString(instance.callee.arguments[0]);
  }
  return undefined;
}

function makeLogMessage(filename, loc, message) {
  if (loc && filename) {
    return filename + ':' + loc.start.line + ':' + loc.start.column + ': ' + message;
  }
  if (loc) {
    return loc.start.line + ':' + loc.start.column + ': ' + message;
  }
  if (filename) {
    return filename + ': ' + message;
  }
  return message;
}

module.exports = function (props) {
  var filename = '',
    logger,
    minErrAst,
    transform,
    transformHandlers,
    updateErrors,
    updateErrorsInNamespace;

  props = props || {};
  logger = props.logger || { error: console.error };
  minErrAst = props.minErrAst;

  updateErrorsInNamespace = function (code, message, instance, namespacedErrors) {
    if (namespacedErrors[code]) {
      if (namespacedErrors[code] !== message) {
        logger.error(makeLogMessage(filename, instance.loc,
          'Errors with the same code have different messages'));
      }
    } else {
      namespacedErrors[code] = message;
    }
  };

  updateErrors = function (instance, extractedErrors) {
    var code = getString(instance.arguments[0]),
      message = getString(instance.arguments[1]),
      namespace = getNamespace(instance);
  
    if (namespace === undefined) {
      updateErrorsInNamespace(code, message, instance, extractedErrors);
    }
    if (!extractedErrors[namespace]) {
      extractedErrors[namespace] = {};
    }
    updateErrorsInNamespace(code, message, instance, extractedErrors[namespace]);
  };

  transformHandlers = {
    ThrowStatement: function (ast, extractedErrors) {
      if (isMinErrInstance(ast.argument)) {
        transform(ast.argument, extractedErrors);
      } else {
        logger.error(makeLogMessage(filename, ast.loc, 'Error is not a minErr instance'));
      }
    },
    CallExpression: function (ast, extractedErrors) {
      // If this is a MinErr instance, delete the template string.
      if (isMinErrInstance(ast)) {
        updateErrors(ast, extractedErrors);
        ast.arguments.splice(1, 1);
      } else {
        transform(ast.callee, extractedErrors);
        ast.arguments.forEach(function (argument) {
            transform(argument, extractedErrors);
          });
      }
    },
    FunctionDeclaration: function (ast, extractedErrors) {
      if (ast.id && ast.id.type === 'Identifier' && ast.id.name === 'minErr') {
        if (minErrAst) {
          ast.params = minErrAst.params;
          ast.body = minErrAst.body;
        }
      } else {
        ast.params.forEach(function (ast) {
            transform(ast, extractedErrors);
          });
        transform(ast.body, extractedErrors);
      }
    }
  };

  transform = function (ast, extractedErrors) {
    var transformWithErrors = function (ast) {
      transform(ast, extractedErrors);
    };

    if (transformHandlers[ast.type]) {
      transformHandlers[ast.type](ast, extractedErrors);
      return;
    }
    for (var property in ast) {
      if (isAST(ast[property])) {
        transformWithErrors(ast[property]);
      }
      if (isASTArray(ast[property])) {
        ast[property].forEach(transformWithErrors);
      }
    }
  };

  return function (ast, errors, sourceFilename) {
    filename = sourceFilename || '';
    transform(ast, errors);
    filename = '';
    return ast;
  };
};
