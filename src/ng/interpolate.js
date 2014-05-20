'use strict';

var $interpolateMinErr = minErr('$interpolate');

/**
 * @ngdoc provider
 * @name $interpolateProvider
 * @function
 *
 * @description
 *
 * Used for configuring the interpolation markup. Defaults to `{{` and `}}`.
 *
 * @example
<example module="customInterpolationApp">
<file name="index.html">
<script>
  var customInterpolationApp = angular.module('customInterpolationApp', []);

  customInterpolationApp.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('//');
    $interpolateProvider.endSymbol('//');
  });


  customInterpolationApp.controller('DemoController', function DemoController() {
      this.label = "This binding is brought you by // interpolation symbols.";
  });
</script>
<div ng-app="App" ng-controller="DemoController as demo">
    //demo.label//
</div>
</file>
<file name="protractor.js" type="protractor">
  it('should interpolate binding with custom symbols', function() {
    expect(element(by.binding('demo.label')).getText()).toBe('This binding is brought you by // interpolation symbols.');
  });
</file>
</example>
 */
function $InterpolateProvider() {
  var startSymbol = '{{';
  var endSymbol = '}}';
  var escapedStartSymbol = '{{{{';
  var escapedEndSymbol = '}}}}';

  /**
   * @ngdoc method
   * @name $interpolateProvider#startSymbol
   * @description
   * Symbol to denote start of expression in the interpolated string. Defaults to `{{`.
   *
   * @param {string=} value new value to set the starting symbol to.
   * @param {string=} escaped new value to set the escaped starting symbol to.
   * @returns {string|self} Returns the symbol when used as getter and self if used as setter.
   */
  this.startSymbol = function(value, escaped){
    if (value) {
      startSymbol = value;
      if (escaped) {
        escapedStartSymbol = escaped;
      }
      return this;
    } else {
      return startSymbol;
    }
  };

  /**
   * @ngdoc method
   * @name $interpolateProvider#endSymbol
   * @description
   * Symbol to denote the end of expression in the interpolated string. Defaults to `}}`.
   *
   * @param {string=} value new value to set the ending symbol to.
   * @returns {string|self} Returns the symbol when used as getter and self if used as setter.
   */
  this.endSymbol = function(value, escaped){
    if (value) {
      endSymbol = value;
      if (escaped) {
        escapedEndSymbol = escaped;
      }
      return this;
    } else {
      return endSymbol;
    }
  };


  this.$get = ['$parse', '$exceptionHandler', '$sce', function($parse, $exceptionHandler, $sce) {
    var startSymbolLength = startSymbol.length,
        endSymbolLength = endSymbol.length,
        escapedStartLength = escapedStartSymbol.length,
        escapedEndLength = escapedEndSymbol.length,
        escapedLength = escapedStartLength + escapedEndLength,
        ESCAPED_EXPR_REGEXP = new RegExp(lit(escapedStartSymbol) + '((?:.|\n)*?)' + lit(escapedEndSymbol), 'm'),
        EXPR_REGEXP = new RegExp(lit(startSymbol) + '((?:.|\n)*?)' + lit(endSymbol), 'm');

    function lit(str) {
      return str.replace(/([\(\)\[\]\{\}\+\\\^\$\.\!\?\*\=\:\|\-])/g, function(op) {
        return '\\' + op;
      });
    }

    function Piece(text, isExpr) {
      this.text = text;
      this.isExpr = isExpr;
    }

    function addPiece(text, isExpr, pieces) {
      var lastPiece = pieces.length ? pieces[pieces.length - 1] : null;
      if (!isExpr && lastPiece && !lastPiece.isExpr) {
        lastPiece.text += text;
      } else {
        pieces.push(new Piece(text, isExpr));
      }
      return pieces[pieces.length-1];
    }

    /**
     * @ngdoc service
     * @name $interpolate
     * @function
     *
     * @requires $parse
     * @requires $sce
     *
     * @description
     *
     * Compiles a string with markup into an interpolation function. This service is used by the
     * HTML {@link ng.$compile $compile} service for data binding. See
     * {@link ng.$interpolateProvider $interpolateProvider} for configuring the
     * interpolation markup.
     *
     *
     * ```js
     *   var $interpolate = ...; // injected
     *   var exp = $interpolate('Hello {{name | uppercase}}!');
     *   expect(exp({name:'Angular'}).toEqual('Hello ANGULAR!');
     * ```
     *
     * `$interpolate` takes an optional fourth argument, `allOrNothing`. If `allOrNothing` is
     * `true`, the interpolation function will return `undefined` unless all embedded expressions
     * evaluate to a value other than `undefined`.
     *
     * ```js
     *   var $interpolate = ...; // injected
     *   var context = {greeting: 'Hello', name: undefined };
     *
     *   // default "forgiving" mode
     *   var exp = $interpolate('{{greeting}} {{name}}!');
     *   expect(exp(context)).toEqual('Hello !');
     *
     *   // "allOrNothing" mode
     *   exp = $interpolate('{{greeting}} {{name}}!', false, null, true);
     *   expect(exp(context, true)).toBeUndefined();
     *   context.name = 'Angular';
     *   expect(exp(context, true)).toEqual('Hello Angular!');
     * ```
     *
     * `allOrNothing` is useful for interpolating URLs. `ngSrc` and `ngSrcset` use this behavior.
     *
     * @param {string} text The text with markup to interpolate.
     * @param {boolean=} mustHaveExpression if set to true then the interpolation string must have
     *    embedded expression in order to return an interpolation function. Strings with no
     *    embedded expression will return null for the interpolation function.
     * @param {string=} trustedContext when provided, the returned function passes the interpolated
     *    result through {@link ng.$sce#getTrusted $sce.getTrusted(interpolatedResult,
     *    trustedContext)} before returning it.  Refer to the {@link ng.$sce $sce} service that
     *    provides Strict Contextual Escaping for details.
     * @param {boolean=} allOrNothing if `true`, then the returned function returns undefined
     *    unless all embedded expressions evaluate to a value other than `undefined`.
     * @returns {function(context)} an interpolation function which is used to compute the
     *    interpolated string. The function has these parameters:
     *
     * - `context`: evaluation context for all expressions embedded in the interpolated text
     */
    function $interpolate(text, mustHaveExpression, trustedContext, allOrNothing) {
      allOrNothing = !!allOrNothing;
      var startIndex,
          endIndex,
          index = 0,
          separators = [],
          expressions = [],
          parseFns = [],
          textLength = text.length,
          hasInterpolation = false,
          hasText = false,
          exp = text,
          concat,
          lastValuesCache = { values: {}, results: {}},
          pieces = [],
          piece,
          indexes = [],
          last;

      while (text.length) {
        var expr = EXPR_REGEXP.exec(text);
        var escaped = ESCAPED_EXPR_REGEXP.exec(text);
        var until = text.length;
        var chunk;
        var from = 0;
        var start;

        if (!escaped && expr) {
          index = 0;
          from = expr.index;
          while ((start = text.indexOf(escapedStartSymbol, index)) >= 0 && start <= from) {
            index = until = start + escapedStartLength;
            expr = null;
          }
        }

        if (expr) {
          until = expr.index;
        }

        if (escaped && escaped.index <= until) {
          from = escaped.index;
          until = escaped.index + escaped[0].length;
          escaped = startSymbol + escaped[1] + endSymbol;
          expr = null;
        }

        if (until > 0) {
          chunk = isString(escaped) ? text.substring(0, from) + escaped  : text.substring(0, until);
          text = text.slice(until);
          var newChunk = addPiece(chunk, false, pieces);
          if (last && !last.isExpr && separators.length) {
            separators[separators.length - 1] += chunk;
          } else {
            separators.push(chunk);
          }
          last = newChunk;
          newChunk = null;
          hasText = true;
        } else {
          separators.push('');
        }

        if (expr) {
          text = text.slice(expr[0].length);
          last = addPiece(expr[1], true, pieces);
          expr = null;
          hasInterpolation = true;
        }
      }

      concat = new Array(pieces.length);
      for (index = 0; index < pieces.length; ++index) {
        piece = pieces[index];
        if (piece.isExpr) {
          parseFns.push($parse(piece.text));
          expressions.push(piece.text);
          indexes.push(index);
        } else {
          concat[index] = piece.text;
        }
      }

      if (separators.length === expressions.length) {
        separators.push('');
      }

      last = pieces = null;

      // Concatenating expressions makes it hard to reason about whether some combination of
      // concatenated values are unsafe to use and could easily lead to XSS.  By requiring that a
      // single expression be used for iframe[src], object[src], etc., we ensure that the value
      // that's used is assigned or constructed by some JS code somewhere that is more testable or
      // make it obvious that you bound the value to some user controlled value.  This helps reduce
      // the load when auditing for XSS issues.
      if (trustedContext && hasInterpolation && (hasText || expressions.length > 1)) {
          throw $interpolateMinErr('noconcat',
              "Error while interpolating: {0}\nStrict Contextual Escaping disallows " +
              "interpolations that concatenate multiple expressions when a trusted value is " +
              "required.  See http://docs.angularjs.org/api/ng.$sce", exp);
      }

      if (!mustHaveExpression || hasInterpolation) {
        var compute = function(values) {
          for(var i = 0, ii = expressions.length; i < ii; i++) {
            concat[indexes[i]] = values[i];
          }
          return concat.join('');
        };

        var getValue = function (value) {
          if (trustedContext) {
            value = $sce.getTrusted(trustedContext, value);
          } else {
            value = $sce.valueOf(value);
          }

          return value;
        };

        var stringify = function (value) {
          if (value == null) { // null || undefined
            return '';
          }
          switch (typeof value) {
            case 'string': {
              break;
            }
            case 'number': {
              value = '' + value;
              break;
            }
            default: {
              value = toJson(value);
            }
          }

          return value;
        };

        return extend(function interpolationFn(context) {
            var scopeId = (context && context.$id) || 'notAScope';
            var lastValues = lastValuesCache.values[scopeId];
            var lastResult = lastValuesCache.results[scopeId];
            var i = 0;
            var ii = expressions.length;
            var values = new Array(ii);
            var val;
            var inputsChanged = lastResult === undefined ? true: false;


            // if we haven't seen this context before, initialize the cache and try to setup
            // a cleanup routine that purges the cache when the scope goes away.
            if (!lastValues) {
              lastValues = [];
              inputsChanged = true;
              if (context && context.$on) {
                context.$on('$destroy', function() {
                  lastValuesCache.values[scopeId] = null;
                  lastValuesCache.results[scopeId] = null;
                });
              }
            }


            try {
              for (; i < ii; i++) {
                val = getValue(parseFns[i](context));
                if (allOrNothing && isUndefined(val)) {
                  return;
                }
                val = stringify(val);
                if (val !== lastValues[i]) {
                  inputsChanged = true;
                }
                values[i] = val;
              }

              if (inputsChanged) {
                lastValuesCache.values[scopeId] = values;
                lastValuesCache.results[scopeId] = lastResult = compute(values);
              }
            } catch(err) {
              var newErr = $interpolateMinErr('interr', "Can't interpolate: {0}\n{1}", exp,
                  err.toString());
              $exceptionHandler(newErr);
            }

            return lastResult;
          }, {
          // all of these properties are undocumented for now
          exp: exp, //just for compatibility with regular watchers created via $watch
          separators: separators,
          expressions: expressions
        });
      }
    }


    /**
     * @ngdoc method
     * @name $interpolate#startSymbol
     * @description
     * Symbol to denote the start of expression in the interpolated string. Defaults to `{{`.
     *
     * Use {@link ng.$interpolateProvider#startSymbol $interpolateProvider#startSymbol} to change
     * the symbol.
     *
     * @returns {string} start symbol.
     */
    $interpolate.startSymbol = function() {
      return startSymbol;
    };


    /**
     * @ngdoc method
     * @name $interpolate#endSymbol
     * @description
     * Symbol to denote the end of expression in the interpolated string. Defaults to `}}`.
     *
     * Use {@link ng.$interpolateProvider#endSymbol $interpolateProvider#endSymbol} to change
     * the symbol.
     *
     * @returns {string} end symbol.
     */
    $interpolate.endSymbol = function() {
      return endSymbol;
    };

    return $interpolate;
  }];
}

