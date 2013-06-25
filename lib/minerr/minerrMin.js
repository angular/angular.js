// Production version of minErr.

function minErr(module) {
  var stringify = function (arg) {
    if (isFunction(arg)) {
      return arg.toString().replace(/ \{[\s\S]*$/, '');
    } else if (isUndefined(arg)) {
      return 'undefined';
    } else if (!isString(arg)) {
      return toJson(arg);
    }
    return arg;
  };
  return function () {
    var code = arguments[0],
      prefix = '[' + (module ? module + ':' : '') + code + '] ',
      message,
      i = 1;

    message = prefix + '"NG_MINERR_URL"' + code;
    for(; i < arguments.length; i++) {
      message = message + (i == 1 ? '?' : '&') + 'p' + (i-1) + '=' + stringify(arguments[i]);
    }
    
    return new Error(message);
  };
}
