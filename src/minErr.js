'use strict';

/**
 * @description
 *
 * This object provides a utility for producing rich Error messages within
 * AngularJS. It can be called as follows:
 *
 * var exampleMinErr = minErr('example');
 * throw exampleMinErr('one', 'This {0} is {1}', foo, bar);
 *
 * The above creates an instance of minErr in the example namespace. The
 * resulting error will have a namespaced error code of example.one.  The
 * resulting error will replace {0} with the value of foo, and {1} with the
 * value of bar. The object is not restricted in the number of arguments it can
 * take.
 *
 * If fewer arguments are specified than necessary for interpolation, the extra
 * interpolation markers will be preserved in the final string.
 *
 * Since data will be parsed statically during a build step, some restrictions
 * are applied with respect to how minErr instances are created and called.
 * Instances should have names of the form namespaceMinErr for a minErr created
 * using minErr('namespace') . Error codes, namespaces and template strings
 * should all be static strings, not variables or general expressions.
 *
 * @param {string} module The namespace to use for the new minErr instance.
 * @param {function} ErrorConstructor Custom error constructor to be instantiated when returning
 *   error from returned function, for cases when a particular type of error is useful.
 * @returns {function(code:string, template:string, ...templateArgs): Error} minErr instance
 */

function minErr(module, ErrorConstructor) {
  ErrorConstructor = ErrorConstructor || Error;
  return function() {
    var code = arguments[0],
      template = arguments[1],
      message = '[' + (module ? module + ':' : '') + code + '] ',
      templateArgs = sliceArgs(arguments, 2).map(function(arg) {
        return toDebugString(arg, minErrConfig.objectMaxDepth);
      }),
      paramPrefix, i;

    message += template.replace(/\{\d+\}/g, function(match) {
      var index = +match.slice(1, -1);

      if (index < templateArgs.length) {
        return templateArgs[index];
      }

      return match;
    });

    message += '\nhttp://errors.angularjs.org/"NG_VERSION_FULL"/' +
      (module ? module + '/' : '') + code;

    for (i = 0, paramPrefix = '?'; i < templateArgs.length; i++, paramPrefix = '&') {
      message += paramPrefix + 'p' + i + '=' + encodeURIComponent(templateArgs[i]);
    }

    return new ErrorConstructor(message);
  };
}
