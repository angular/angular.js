'use strict';

var $interpolateMinErr = minErr('$interpolate');

/**
 * @ngdoc provider
 * @name $interpolateProvider
 * @kind function
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


  customInterpolationApp.controller('DemoController', function() {
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

  /**
   * @ngdoc method
   * @name $interpolateProvider#startSymbol
   * @description
   * Symbol to denote start of expression in the interpolated string. Defaults to `{{`.
   *
   * @param {string=} value new value to set the starting symbol to.
   * @returns {string|self} Returns the symbol when used as getter and self if used as setter.
   */
  this.startSymbol = function(value){
    if (value) {
      startSymbol = value;
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
  this.endSymbol = function(value){
    if (value) {
      endSymbol = value;
      return this;
    } else {
      return endSymbol;
    }
  };


  this.$get = ['$parse', '$exceptionHandler', '$sce', function($parse, $exceptionHandler, $sce) {
    var startSymbolLength = startSymbol.length,
        endSymbolLength = endSymbol.length,
        escapedStartRegexp = new RegExp(startSymbol.replace(/./g, escape), 'g'),
        escapedEndRegexp = new RegExp(endSymbol.replace(/./g, escape), 'g');

    function escape(ch) {
      return '\\\\\\' + ch;
    }

    /**
     * @ngdoc service
     * @name $interpolate
     * @kind function
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
     *   expect(exp(context)).toBeUndefined();
     *   context.name = 'Angular';
     *   expect(exp(context)).toEqual('Hello Angular!');
     * ```
     *
     * `allOrNothing` is useful for interpolating URLs. `ngSrc` and `ngSrcset` use this behavior.
     *
     * ####Escaped Interpolation
     * $interpolate provides a mechanism for escaping interpolation markers. Start and end markers
     * can be escaped by preceding each of their characters with a REVERSE SOLIDUS U+005C (backslash).
     * It will be rendered as a regular start/end marker, and will not be interpreted as an expression
     * or binding.
     *
     * This enables web-servers to prevent script injection attacks and defacing attacks, to some
     * degree, while also enabling code examples to work without relying on the
     * {@link ng.directive:ngNonBindable ngNonBindable} directive.
     *
     * **For security purposes, it is strongly encouraged that web servers escape user-supplied data,
     * replacing angle brackets (&lt;, &gt;) with &amp;lt; and &amp;gt; respectively, and replacing all
     * interpolation start/end markers with their escaped counterparts.**
     *
     * Escaped interpolation markers are only replaced with the actual interpolation markers in rendered
     * output when the $interpolate service processes the text. So, for HTML elements interpolated
     * by {@link ng.$compile $compile}, or otherwise interpolated with the `mustHaveExpression` parameter
     * set to `true`, the interpolated text must contain an unescaped interpolation expression. As such,
     * this is typically useful only when user-data is used in rendering a template from the server, or
     * when otherwise untrusted data is used by a directive.
     *
     * <example>
     *  <file name="index.html">
     *    <div ng-init="username='A user'">
     *      <p ng-init="apptitle='Escaping demo'">{{apptitle}}: \{\{ username = "defaced value"; \}\}
     *        </p>
     *      <p><strong>{{username}}</strong> attempts to inject code which will deface the
     *        application, but fails to accomplish their task, because the server has correctly
     *        escaped the interpolation start/end markers with REVERSE SOLIDUS U+005C (backslash)
     *        characters.</p>
     *      <p>Instead, the result of the attempted script injection is visible, and can be removed
     *        from the database by an administrator.</p>
     *    </div>
     *  </file>
     * </example>
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
          exp,
          concat = [];

      while(index < textLength) {
        if ( ((startIndex = text.indexOf(startSymbol, index)) != -1) &&
             ((endIndex = text.indexOf(endSymbol, startIndex + startSymbolLength)) != -1) ) {
          if (index !== startIndex) hasText = true;
          separators.push(text.substring(index, startIndex));
          exp = text.substring(startIndex + startSymbolLength, endIndex);
          expressions.push(exp);
          parseFns.push($parse(exp, parseStringifyInterceptor));
          index = endIndex + endSymbolLength;
          hasInterpolation = true;
        } else {
          // we did not find an interpolation, so we have to add the remainder to the separators array
          if (index !== textLength) {
            hasText = true;
            separators.push(text.substring(index));
          }
          break;
        }
      }

      forEach(separators, function(key, i) {
        separators[i] = separators[i].
          replace(escapedStartRegexp, startSymbol).
          replace(escapedEndRegexp, endSymbol);
      });

      if (separators.length === expressions.length) {
        separators.push('');
      }

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
              "required.  See http://docs.angularjs.org/api/ng.$sce", text);
      }

      if (!mustHaveExpression || hasInterpolation) {
        concat.length = separators.length + expressions.length;

        var compute = function(values) {
          for(var i = 0, ii = expressions.length; i < ii; i++) {
            if (allOrNothing && isUndefined(values[i])) return;
            concat[2*i] = separators[i];
            concat[(2*i)+1] = values[i];
          }
          concat[2*ii] = separators[ii];
          return concat.join('');
        };

        var getValue = function (value) {
          return trustedContext ?
            $sce.getTrusted(trustedContext, value) :
            $sce.valueOf(value);
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
            var i = 0;
            var ii = expressions.length;
            var values = new Array(ii);

            try {
              for (; i < ii; i++) {
                values[i] = parseFns[i](context);
              }

              return compute(values);
            } catch(err) {
              var newErr = $interpolateMinErr('interr', "Can't interpolate: {0}\n{1}", text,
                  err.toString());
              $exceptionHandler(newErr);
            }

          }, {
          // all of these properties are undocumented for now
          exp: text, //just for compatibility with regular watchers created via $watch
          separators: separators,
          expressions: expressions,
          $$watchDelegate: function (scope, listener, objectEquality, deregisterNotifier) {
            var lastValue;
            return scope.$watchGroup(parseFns, function interpolateFnWatcher(values, oldValues) {
              var currValue = compute(values);
              if (isFunction(listener)) {
                listener.call(this, currValue, values !== oldValues ? lastValue : currValue, scope);
              }
              lastValue = currValue;
            }, objectEquality, deregisterNotifier);
          }
        });
      }

      function parseStringifyInterceptor(value) {
        try {
          return stringify(getValue(value));
        } catch(err) {
          var newErr = $interpolateMinErr('interr', "Can't interpolate: {0}\n{1}", text,
            err.toString());
          $exceptionHandler(newErr);
        }
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

