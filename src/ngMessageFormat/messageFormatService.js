'use strict';

// NOTE: ADVANCED_OPTIMIZATIONS mode.
//
// This file is compiled with Closure compiler's ADVANCED_OPTIMIZATIONS flag! Be wary of using
// constructs incompatible with that mode.

/* global $interpolateMinErr: false */
/* global MessageFormatParser: false */
/* global stringify: false */

/**
 * @ngdoc service
 * @name $$messageFormat
 *
 * @description
 * Angular internal service to recognize MessageFormat extensions in interpolation expressions.
 * For more information, see:
 * https://docs.google.com/a/google.com/document/d/1pbtW2yvtmFBikfRrJd8VAsabiFkKezmYZ_PbgdjQOVU/edit
 */
var $$MessageFormatFactory = ['$parse', '$locale', '$sce', '$exceptionHandler', function $$messageFormat(
                   $parse,   $locale,   $sce,   $exceptionHandler) {

  function getStringifier(trustedContext, allOrNothing, text) {
    return function stringifier(value) {
      try {
        value = trustedContext ? $sce['getTrusted'](trustedContext, value) : $sce['valueOf'](value);
        return allOrNothing && (value === void 0) ? value : stringify(value);
      } catch (err) {
        $exceptionHandler($interpolateMinErr['interr'](text, err));
      }
    };
  }

  function interpolate(text, mustHaveExpression, trustedContext, allOrNothing) {
    var stringifier = getStringifier(trustedContext, allOrNothing, text);
    var parser = new MessageFormatParser(text, 0, $parse, $locale['pluralCat'], stringifier,
                                         mustHaveExpression, trustedContext, allOrNothing);
    parser.run(parser.ruleInterpolate);
    return parser.parsedFn;
  }

  return {
    'interpolate': interpolate
  };
}];

var $$interpolateDecorator = ['$$messageFormat', '$delegate', function $$interpolateDecorator($$messageFormat, $interpolate) {
  if ($interpolate['startSymbol']() != "{{" || $interpolate['endSymbol']() != "}}") {
    throw $interpolateMinErr('nochgmustache', 'angular-messageformat.js currently does not allow you to use custom start and end symbols for interpolation.');
  }
  var interpolate = $$messageFormat['interpolate'];
  interpolate['startSymbol'] = $interpolate['startSymbol'];
  interpolate['endSymbol'] = $interpolate['endSymbol'];
  return interpolate;
}];


/**
 * @ngdoc module
 * @name ngMessageFormat
 * @description
 */
var module = angular['module']('ngMessageFormat', ['ng']);
module['factory']('$$messageFormat', $$MessageFormatFactory);
module['config'](['$provide', function($provide) {
  $provide['decorator']('$interpolate', $$interpolateDecorator);
}]);
