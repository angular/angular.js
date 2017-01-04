'use strict';

var $interpolateMinErr = angular.$interpolateMinErr = minErr('$interpolate');
$interpolateMinErr.throwNoconcat = function(text) {
  throw $interpolateMinErr('noconcat',
      'Error while interpolating: {0}\nStrict Contextual Escaping disallows ' +
      'interpolations that concatenate multiple expressions when a trusted value is ' +
      'required.  See http://docs.angularjs.org/api/ng.$sce', text);
};

$interpolateMinErr.interr = function(text, err) {
  return $interpolateMinErr('interr', 'Can\'t interpolate: {0}\n{1}', text, err.toString());
};

/**
 * @ngdoc provider
 * @name $interpolateProvider
 * @this
 *
 * @description
 *
 * Used for configuring the interpolation markup. Defaults to `{{` and `}}`.
 *
 * <div class="alert alert-danger">
 * This feature is sometimes used to mix different markup languages, e.g. to wrap an Angular
 * template within a Python Jinja template (or any other template language). Mixing templating
 * languages is **very dangerous**. The embedding template language will not safely escape Angular
 * expressions, so any user-controlled values in the template will cause Cross Site Scripting (XSS)
 * security bugs!
 * </div>
 *
 * @example
<example name="custom-interpolation-markup" module="customInterpolationApp">
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
<div ng-controller="DemoController as demo">
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
  this.startSymbol = function(value) {
    if (value) {
      startSymbol = value;
      return this;
    }
    return startSymbol;
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
  this.endSymbol = function(value) {
    if (value) {
      endSymbol = value;
      return this;
    }
    return endSymbol;
  };


  this.$get = ['$parse', '$exceptionHandler', '$sce', function($parse, $exceptionHandler, $sce) {
    var startSymbolLength = startSymbol.length,
        endSymbolLength = endSymbol.length,
        escapedStartRegexp = new RegExp(startSymbol.replace(/./g, escape), 'g'),
        escapedEndRegexp = new RegExp(endSymbol.replace(/./g, escape), 'g');

    function escape(ch) {
      return '\\\\\\' + ch;
    }

    function unescapeText(text) {
      return text.replace(escapedStartRegexp, startSymbol).
        replace(escapedEndRegexp, endSymbol);
    }

    // TODO: this is the same as the constantWatchDelegate in parse.js
    function constantWatchDelegate(scope, listener, objectEquality, constantInterp) {
      var unwatch = scope.$watch(function constantInterpolateWatch(scope) {
        unwatch();
        return constantInterp(scope);
      }, listener, objectEquality);
      return unwatch;
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
     *   expect(exp({name:'Angular'})).toEqual('Hello ANGULAR!');
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
     * #### Escaped Interpolation
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
     * <example name="interpolation">
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
     * @knownIssue
     * It is currently not possible for an interpolated expression to contain the interpolation end
     * symbol. For example, `{{ '}}' }}` will be incorrectly interpreted as `{{ ' }}` + `' }}`, i.e.
     * an interpolated expression consisting of a single-quote (`'`) and the `' }}` string.
     *
     * @knownIssue
     * All directives and components must use the standard `{{` `}}` interpolation symbols
     * in their templates. If you change the application interpolation symbols the {@link $compile}
     * service will attempt to denormalize the standard symbols to the custom symbols.
     * The denormalization process is not clever enough to know not to replace instances of the standard
     * symbols where they would not normally be treated as interpolation symbols. For example in the following
     * code snippet the closing braces of the literal object will get incorrectly denormalized:
     *
     * ```
     * <div data-context='{"context":{"id":3,"type":"page"}}">
     * ```
     *
     * The workaround is to ensure that such instances are separated by whitespace:
     * ```
     * <div data-context='{"context":{"id":3,"type":"page"} }">
     * ```
     *
     * See https://github.com/angular/angular.js/pull/14610#issuecomment-219401099 for more information.
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
      // Provide a quick exit and simplified result function for text with no interpolation
      if (!text.length || text.indexOf(startSymbol) === -1) {
        var constantInterp;
        if (!mustHaveExpression) {
          var unescapedText = unescapeText(text);
          constantInterp = valueFn(unescapedText);
          constantInterp.exp = text;
          constantInterp.expressions = [];
          constantInterp.$$watchDelegate = constantWatchDelegate;
        }
        return constantInterp;
      }

      allOrNothing = !!allOrNothing;
      var startIndex,
          endIndex,
          index = 0,
          expressions = [],
          parseFns = [],
          textLength = text.length,
          exp,
          concat = [],
          expressionPositions = [];

      while (index < textLength) {
        if (((startIndex = text.indexOf(startSymbol, index)) !== -1) &&
             ((endIndex = text.indexOf(endSymbol, startIndex + startSymbolLength)) !== -1)) {
          if (index !== startIndex) {
            concat.push(unescapeText(text.substring(index, startIndex)));
          }
          exp = text.substring(startIndex + startSymbolLength, endIndex);
          expressions.push(exp);
          parseFns.push($parse(exp, parseStringifyInterceptor));
          index = endIndex + endSymbolLength;
          expressionPositions.push(concat.length);
          concat.push('');
        } else {
          // we did not find an interpolation, so we have to add the remainder to the separators array
          if (index !== textLength) {
            concat.push(unescapeText(text.substring(index)));
          }
          break;
        }
      }

      // Concatenating expressions makes it hard to reason about whether some combination of
      // concatenated values are unsafe to use and could easily lead to XSS.  By requiring that a
      // single expression be used for iframe[src], object[src], etc., we ensure that the value
      // that's used is assigned or constructed by some JS code somewhere that is more testable or
      // make it obvious that you bound the value to some user controlled value.  This helps reduce
      // the load when auditing for XSS issues.
      if (trustedContext && concat.length > 1) {
          $interpolateMinErr.throwNoconcat(text);
      }

      if (!mustHaveExpression || expressions.length) {
        var compute = function(values) {
          for (var i = 0, ii = expressions.length; i < ii; i++) {
            if (allOrNothing && isUndefined(values[i])) return;
            concat[expressionPositions[i]] = values[i];
          }
          return concat.join('');
        };

        var getValue = function(value) {
          return trustedContext ?
            $sce.getTrusted(trustedContext, value) :
            $sce.valueOf(value);
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
            } catch (err) {
              $exceptionHandler($interpolateMinErr.interr(text, err));
            }

          }, {
          // all of these properties are undocumented for now
          exp: text, //just for compatibility with regular watchers created via $watch
          expressions: expressions,
          $$watchDelegate: function(scope, listener) {
            var lastValue;
            return scope.$watchGroup(parseFns, /** @this */ function interpolateFnWatcher(values, oldValues) {
              var currValue = compute(values);
              if (isFunction(listener)) {
                listener.call(this, currValue, values !== oldValues ? lastValue : currValue, scope);
              }
              lastValue = currValue;
            });
          }
        });
      }

      function parseStringifyInterceptor(value) {
        try {
          value = getValue(value);
          return allOrNothing && !isDefined(value) ? value : stringify(value);
        } catch (err) {
          $exceptionHandler($interpolateMinErr.interr(text, err));
        }
      }
    }


    /**
     * @ngdoc method
     * @name $interpolate#startSymbol
     * @description
     * Symbol to denote the start of expression in the interpolated string. Defaults to `{{`.
     *
     * Use {@link ng.$interpolateProvider#startSymbol `$interpolateProvider.startSymbol`} to change
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
     * Use {@link ng.$interpolateProvider#endSymbol `$interpolateProvider.endSymbol`} to change
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

