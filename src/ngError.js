'use strict';

/**
 * @description
 *
 * This object extends the error class and provides interpolation capability
 * to make it easier to write and read Error messages within Angular. It can
 * be called as follows:
 *
 * throw NgError(13, 'This {0} is {1}', foo, bar);
 *
 * The above will replace {0} with the value of foo, and {1} with the value of
 * bar. The object is not restricted in the number of arguments it can take.
 *
 * If fewer arguments are specified than necessary for interpolation, they are
 * left untouched.
 */
/**
 * @param {...} arguments The first argument to this object is the error
 *     number, the second argument the message with templated points for
 *     Interpolation (of the for {0} for the first, {1} for the second and
 *     so on). The second argument onwards are interpolated into the error
 *     message string in order.
 */
function NgError() {
  var message = '[NgErr' + arguments[0] + '] ' + arguments[1],
      i = 0,
      l = arguments.length - 2,
      curlyRegexp, arg;

  for (; i < l; i++) {
    curlyRegexp = new RegExp("\\{" + i + "\\}", "gm");
    arg = arguments[i + 2];

    if (isFunction(arg)) {
      arg = arg.name
          ? arg.name + '()'
          : arg.toString();
    } else if (!isString(arg)) {
      arg = toJson(arg);
    }

    message = message.replace(curlyRegexp, arg);
  }

  // even if we are called as constructor we can bypass the new NgError instance and return
  // an instance of a real Error that contains correct stack info + extra frame for NgError call
  // TODO(i): can we rewrite the stack string to remove NgError frame?
  return new Error(message);
}
