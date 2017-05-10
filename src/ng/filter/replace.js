'use strict';

/**
 * @ngdoc filter
 * @name ng.filter:replace
 * @function
 *
 * @description
 * Allows you to replace substrings in an expression with other expressions.
 *
 * This is useful when you have strings from a translation dictionary that require
 * substrings to be replaced with expressions
 *
 * @param {object} A JavaScript object with key value pairs that represent from string keys and to values (expressions)
 * @returns {string} String with all from's replaced by their to's
 *
 *
 * @example:
 <doc:example>
 <doc:source>
 <pre>{{ 'Hello %userName%' | replace:{'%userName%': user.userName} }}</pre>
 </doc:source>
 </doc:example>
 *
 */
function replaceFilter(){
  return function(input, replacements){

    // Handle invalid replacements
    if (!angular.isObject(replacements)) {
      return input;
    }

    // Perform replacements
    angular.forEach(replacements, function (to, from) {
      if (to) {

        // Convert to regular expression for global replacement
        var regex = new RegExp(from, "g");
        input = input.replace(regex, to);
      }
    });

    return input;
  };
}
