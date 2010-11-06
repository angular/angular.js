////////////////////////////////////

if (typeof document.getAttribute == $undefined)
  document.getAttribute = function() {};

/**
 * @ngdoc
 * @name angular.lowercase
 * @function
 *
 * @description Converts string to lowercase
 * @param {string} value
 * @returns {string} Lowercased string.
 */
var lowercase = function (value){ return isString(value) ? value.toLowerCase() : value; };


/**
 * @ngdoc
 * @name angular#uppercase
 * @function
 *
 * @description Converts string to uppercase.
 * @param {string} value
 * @returns {string} Uppercased string.
 */
var uppercase = function (value){ return isString(value) ? value.toUpperCase() : value; };


var manualLowercase = function (s) {
  return isString(s) ? s.replace(/[A-Z]/g,
      function (ch) {return fromCharCode(ch.charCodeAt(0) | 32); }) : s;
};
var manualUppercase = function (s) {
  return isString(s) ? s.replace(/[a-z]/g,
      function (ch) {return fromCharCode(ch.charCodeAt(0) & ~32); }) : s;
};


// String#toLowerCase and String#toUpperCase don't produce correct results in browsers with Turkish
// locale, for this reason we need to detect this case and redefine lowercase/uppercase methods with
// correct but slower alternatives.
if ('i' !== 'I'.toLowerCase()) {
  lowercase = manualLowercase;
  uppercase = manualUppercase;
}

function fromCharCode(code) { return String.fromCharCode(code); }


var _undefined        = undefined,
    _null             = null,
    $$element         = '$element',
    $angular          = 'angular',
    $array            = 'array',
    $boolean          = 'boolean',
    $console          = 'console',
    $date             = 'date',
    $display          = 'display',
    $element          = 'element',
    $function         = 'function',
    $length           = 'length',
    $name             = 'name',
    $none             = 'none',
    $noop             = 'noop',
    $null             = 'null',
    $number           = 'number',
    $object           = 'object',
    $string           = 'string',
    $undefined        = 'undefined',
    NG_EXCEPTION      = 'ng-exception',
    NG_VALIDATION_ERROR = 'ng-validation-error',
    NOOP              = 'noop',
    PRIORITY_FIRST    = -99999,
    PRIORITY_WATCH    = -1000,
    PRIORITY_LAST     =  99999,
    PRIORITY          = {'FIRST': PRIORITY_FIRST, 'LAST': PRIORITY_LAST, 'WATCH':PRIORITY_WATCH},
    jQuery            = window['jQuery'] || window['$'], // weirdness to make IE happy
    _                 = window['_'],
    /** holds major version number for IE or NaN for real browsers */
    msie              = parseInt((/msie (\d+)/.exec(lowercase(navigator.userAgent)) || [])[1], 10),
    jqLite            = jQuery || jqLiteWrap,
    slice             = Array.prototype.slice,
    push              = Array.prototype.push,
    error             = window[$console] ? bind(window[$console], window[$console]['error'] || noop) : noop,

    /**
     * @name angular
     * @namespace The exported angular namespace.
     */
    angular           = window[$angular]    || (window[$angular] = {}),
    angularTextMarkup = extensionMap(angular, 'markup'),
    angularAttrMarkup = extensionMap(angular, 'attrMarkup'),
    angularDirective  = extensionMap(angular, 'directive'),

    /**
     * @ngdoc overview
     * @name angular.widget
     * @namespace Namespace for all widgets.
     * @description
     * # Overview
     * Widgets allow you to create DOM elements that the browser doesn't 
     * already understand. You create the widget in your namespace and 
     * assign it behavior. You can only bind one widget per DOM element 
     * (unlike directives, in which you can use any number per DOM 
     * element). Widgets are expected to manipulate the DOM tree by 
     * adding new elements whereas directives are expected to only modify
     * element properties.
     * 
     * Widgets come in two flavors: element and attribute.
     * 
     * # Element Widget
     * Let's say we would like to create a new element type in the 
     * namespace `my` that can watch an expression and alert() the user 
     * with each new value.
     * 
     * <pre>
     * &lt;my:watch exp="name"/&gt;
     * </pre>
     * 
     * You can implement `my:watch` like this:
     * <pre>
     * angular.widget('my:watch', function(compileElement) {
     *   var compiler = this;
     *   var exp = compileElement.attr('exp');
     *   return function(linkElement) {
     *     var currentScope = this;
     *     currentScope.$watch(exp, function(value){
     *       alert(value);
     *     }};
     *   };
     * });
     * </pre>
     * 
     * # Attribute Widget
     * Let's implement the same widget, but this time as an attribute 
     * that can be added to any existing DOM element.
     * <pre>
     * &lt;div my-watch="name"&gt;text&lt;/div&gt;
     * </pre>
     * You can implement `my:watch` attribute like this:
     * <pre>
     * angular.widget('@my:watch', function(expression, compileElement) {
     *   var compiler = this;
     *   return function(linkElement) {
     *     var currentScope = this;
     *     currentScope.$watch(expression, function(value){
     *       alert(value);
     *     });
     *   };
     * });
     * </pre>
     */
    angularWidget     = extensionMap(angular, 'widget', lowercase),
    
    /**
     * @ngdoc overview
     * @name angular.validator
     * @namespace Namespace for all filters.
     * @description
     * # Overview
     * Validators are a standard way to check the user input against a specific criteria. For 
     * example, you might need to check that an input field contains a well-formed phone number.
     * 
     * # Syntax
     * Attach a validator on user input widgets using the `ng:validate` attribute.
     * 
     * <doc:example>
     *   <doc:source>
     *    Change me: &lt;input type="text" name="number" ng:validate="integer" value="123"&gt;
     *   </doc:source>
     * </doc:example>
     * 
     * # Writing your own Validators
     * Writing your own validator is easy. To make a function available as a 
     * validator, just define the JavaScript function on the `angular.validator` 
     * object. <angular/> passes in the input to validate as the first argument 
     * to your function. Any additional validator arguments are passed in as 
     * additional arguments to your function.
     * 
     * You can use these variables in the function:
     *
     * * `this` — The current scope.
     * * `this.$element` — The DOM element containing the binding. This allows the filter to manipulate
     *   the DOM in addition to transforming the input.
     *   
     * In this example we have written a upsTrackingNo validator. 
     * It marks the input text "valid" only when the user enters a well-formed 
     * UPS tracking number.
     * 
     * <pre>
     * angular.validator('upsTrackingNo', function(input, format) {
     *  var regexp = new RegExp("^" + format.replace(/9/g, '\\d') + "$");
     *  return input.match(regexp) ? "" : "The format must match " + format;
     * });
     * </pre>
     * 
     * @example
     * <script>
     *  angular.validator('upsTrackingNo', function(input, format) {
     *    var regexp = new RegExp("^" + format.replace(/9/g, '\\d') + "$");
     *    return input.match(regexp)?"":"The format must match " + format;
     *  });
     * </script>
     * <input type="text" name="trackNo" size="40"
     *       ng:validate="upsTrackingNo:'1Z 999 999 99 9999 999 9'" 
     *       value="1Z 123 456 78 9012 345 6"/>
     * 
     */
    angularValidator  = extensionMap(angular, 'validator'),


    /**
     * @ngdoc overview
     * @name angular.filter
     * @namespace Namespace for all filters.
     * @description
     * # Overview
     * Filters are a standard way to format your data for display to the user. For example, you
     * might have the number 1234.5678 and would like to display it as US currency: $1,234.57.
     * Filters allow you to do just that. In addition to transforming the data, filters also modify
     * the DOM. This allows the filters to for example apply css styles to the filtered output if
     * certain conditions were met.
     *
     *
     * # Standard Filters
     *
     * The Angular framework provides a standard set of filters for common operations, including:
     * {@link angular.filter.currency}, {@link angular.filter.json}, {@link angular.filter.number},
     * and {@link angular.filter.html}. You can also add your own filters.
     *
     *
     * # Syntax
     *
     * Filters can be part of any {@link angular.scope} evaluation but are typically used with
     * {{bindings}}. Filters typically transform the data to a new data type, formating the data in
     * the process. Filters can be chained and take optional arguments. Here are few examples:
     *
     * * No filter: {{1234.5678}} => 1234.5678
     * * Number filter: {{1234.5678|number}} => 1,234.57. Notice the “,” and rounding to two
     *   significant digits.
     * * Filter with arguments: {{1234.5678|number:5}} => 1,234.56780. Filters can take optional
     *   arguments, separated by colons in a binding. To number, the argument “5” requests 5 digits
     *   to the right of the decimal point.
     *
     *
     * # Writing your own Filters
     *
     * Writing your own filter is very easy: just define a JavaScript function on `angular.filter`.
     * The framework passes in the input value as the first argument to your function. Any filter
     * arguments are passed in as additional function arguments.
     *
     * You can use these variables in the function:
     *
     * * `this` — The current scope.
     * * `this.$element` — The DOM element containing the binding. This allows the filter to manipulate
     *   the DOM in addition to transforming the input.
     *
     *
     * @exampleDescription
     *  The following example filter reverses a text string. In addition, it conditionally makes the
     *  text upper-case (to demonstrate optional arguments) and assigns color (to demonstrate DOM
     *  modification).
     *
     * @example
         <script type="text/javascript">
           angular.filter('reverse', function(input, uppercase, color) {
             var out = "";
             for (var i = 0; i < input.length; i++) {
               out = input.charAt(i) + out;
             }
             if (uppercase) {
               out = out.toUpperCase();
             }
             if (color) {
               this.$element.css('color', color);
             }
             return out;
           });
         </script>
         <span ng:non-bindable="true">{{"hello"|reverse}}</span>: {{"hello"|reverse}}<br>
         <span ng:non-bindable="true">{{"hello"|reverse:true}}</span>: {{"hello"|reverse:true}}<br>
         <span ng:non-bindable="true">{{"hello"|reverse:true:"blue"}}</span>:
           {{"hello"|reverse:true:"blue"}}

     */
    angularFilter     = extensionMap(angular, 'filter'),
    /**
     * @ngdoc overview
     * @name angular.formatter
     * @namespace Namespace for all formats.
     * @description
     * # Overview
     * The formatters are responsible for translating user readable text in an input widget to a
     * data model stored in an application.
     * 
     * # Writting your own Fromatter
     * Writing your own formatter is easy. Just register a pair of JavaScript functions with 
     * `angular.formatter`. One function for parsing user input text to the stored form, 
     * and one for formatting the stored data to user-visible text.
     * 
     * Here is an example of a "reverse" formatter: The data is stored in uppercase and in 
     * reverse, while it is displayed in lower case and non-reversed. User edits are 
     * automatically parsed into the internal form and data changes are automatically 
     * formatted to the viewed form.
     * 
     * <pre>
     * function reverse(text) {
     *   var reversed = [];
     *   for (var i = 0; i < text.length; i++) {
     *     reversed.unshift(text.charAt(i));
     *   }
     *   return reversed.join('');
     * }
     * 
     * angular.formatter('reverse', {
     *   parse: function(value){
     *     return reverse(value||'').toUpperCase();
     *   },
     *   format: function(value){
     *     return reverse(value||'').toLowerCase();
     *   }
     * });
     * </pre>
     * 
     * @example
     * <script>
     * function reverse(text) {
     *   var reversed = [];
     *   for (var i = 0; i < text.length; i++) {
     *     reversed.unshift(text.charAt(i));
     *   }
     *   return reversed.join('');
     * }
     * 
     * angular.formatter('reverse', {
     *   parse: function(value){
     *     return reverse(value||'').toUpperCase();
     *   },
     *   format: function(value){
     *     return reverse(value||'').toLowerCase();
     *   }
     * });
     * </script>
     *
     * Formatted: <input type="text" name="data" value="&lt;angular/&gt;" ng:format="reverse"/><br/>
     * Stored: <input type="text" name="data"/><br/>
     * <pre>{{data}}</pre>
     *
     * 
     * @scenario
     * it('should store reverse', function(){
     *  expect(element('.doc-example input:first').val()).toEqual('<angular/>');
     *  expect(element('.doc-example input:last').val()).toEqual('>/RALUGNA<');
     *  
     *  this.addFutureAction('change to XYZ', function($window, $document, done){
     *    $document.elements('.doc-example input:last').val('XYZ').trigger('change');
     *    done();
     *  });
     *  expect(element('input:first').val()).toEqual('zyx');
     * });
     */
    angularFormatter  = extensionMap(angular, 'formatter'),
    angularService    = extensionMap(angular, 'service'),
    angularCallbacks  = extensionMap(angular, 'callbacks'),
    nodeName,
    rngScript         = /^(|.*\/)angular(-.*?)?(\.min)?.js(\?[^#]*)?(#(.*))?$/;

function foreach(obj, iterator, context) {
  var key;
  if (obj) {
    if (isFunction(obj)){
      for (key in obj) {
        if (key != 'prototype' && key != $length && key != $name && obj.hasOwnProperty(key)) {
          iterator.call(context, obj[key], key);
        }
      }
    } else if (obj.forEach) {
      obj.forEach(iterator, context);
    } else if (isObject(obj) && isNumber(obj.length)) {
      for (key = 0; key < obj.length; key++)
        iterator.call(context, obj[key], key);
    } else {
      for (key in obj)
        iterator.call(context, obj[key], key);
    }
  }
  return obj;
}

function foreachSorted(obj, iterator, context) {
  var keys = [];
  for (var key in obj) keys.push(key);
  keys.sort();
  for ( var i = 0; i < keys.length; i++) {
    iterator.call(context, obj[keys[i]], keys[i]);
  }
  return keys;
}


function extend(dst) {
  foreach(arguments, function(obj){
    if (obj !== dst) {
      foreach(obj, function(value, key){
        dst[key] = value;
      });
    }
  });
  return dst;
}

function inherit(parent, extra) {
  return extend(new (extend(function(){}, {prototype:parent}))(), extra);
}

function noop() {}
function identity($) {return $;}
function valueFn(value) {return function(){ return value; };}

function extensionMap(angular, name, transform) {
  var extPoint;
  return angular[name] || (extPoint = angular[name] = function (name, fn, prop){
    name = (transform || identity)(name);
    if (isDefined(fn)) {
      if (isDefined(extPoint[name])) {
        foreach(extPoint[name], function(property, key) {
          if (key.charAt(0) == '$' && isUndefined(fn[key]))
            fn[key] = property;
        });
      }
      extPoint[name] = extend(fn, prop || {});
    }
    return extPoint[name];
  });
}

function jqLiteWrap(element) {
  // for some reasons the parentNode of an orphan looks like _null but its typeof is object.
  if (element) {
    if (isString(element)) {
      var div = document.createElement('div');
      div.innerHTML = element;
      element = new JQLite(div.childNodes);
    } else if (!(element instanceof JQLite) && isElement(element)) {
      element =  new JQLite(element);
    }
  }
  return element;
}
function isUndefined(value){ return typeof value == $undefined; }
function isDefined(value){ return typeof value != $undefined; }
function isObject(value){ return value!=_null && typeof value == $object;}
function isString(value){ return typeof value == $string;}
function isNumber(value){ return typeof value == $number;}
function isDate(value){ return value instanceof Date; }
function isArray(value) { return value instanceof Array; }
function isFunction(value){ return typeof value == $function;}
function isBoolean(value) { return typeof value == $boolean;}
function isTextNode(node) { return nodeName(node) == '#text'; }
function trim(value) { return isString(value) ? value.replace(/^\s*/, '').replace(/\s*$/, '') : value; }
function isElement(node) {
  return node && (node.nodeName || node instanceof JQLite || (jQuery && node instanceof jQuery));
}

/**
 * HTML class which is the only class which can be used in ng:bind to inline HTML for security reasons.
 * @constructor
 * @param html raw (unsafe) html
 * @param {string=} option if set to 'usafe' then get method will return raw (unsafe/unsanitized) html
 */
function HTML(html, option) {
  this.html = html;
  this.get = lowercase(option) == 'unsafe' ?
    valueFn(html) :
    function htmlSanitize() {
      var buf = [];
      htmlParser(html, htmlSanitizeWriter(buf));
      return buf.join('');
    };
}

if (msie) {
  nodeName = function(element) {
    element = element.nodeName ? element : element[0];
    return (element.scopeName && element.scopeName != 'HTML' ) ? uppercase(element.scopeName + ':' + element.nodeName) : element.nodeName;
  };
} else {
  nodeName = function(element) {
    return element.nodeName ? element.nodeName : element[0].nodeName;
  };
}

function quickClone(element) {
  return jqLite(element[0].cloneNode(true));
}

function isVisible(element) {
  var rect = element[0].getBoundingClientRect(),
      width = (rect.width || (rect.right||0 - rect.left||0)),
      height = (rect.height || (rect.bottom||0 - rect.top||0));
  return width>0 && height>0;
}

function map(obj, iterator, context) {
  var results = [];
  foreach(obj, function(value, index, list) {
    results.push(iterator.call(context, value, index, list));
  });
  return results;
}
function size(obj) {
  var size = 0;
  if (obj) {
    if (isNumber(obj.length)) {
      return obj.length;
    } else if (isObject(obj)){
      for (key in obj)
        size++;
    }
  }
  return size;
}
function includes(array, obj) {
  for ( var i = 0; i < array.length; i++) {
    if (obj === array[i]) return true;
  }
  return false;
}

function indexOf(array, obj) {
  for ( var i = 0; i < array.length; i++) {
    if (obj === array[i]) return i;
  }
  return -1;
}

function isLeafNode (node) {
  if (node) {
    switch (node.nodeName) {
    case "OPTION":
    case "PRE":
    case "TITLE":
      return true;
    }
  }
  return false;
}

/**
 * Copies stuff.
 *
 * If destination is not provided and source is an object or an array, a copy is created & returned,
 * otherwise the source is returned.
 *
 * If destination is provided, all of its properties will be deleted and if source is an object or
 * an array, all of its members will be copied into the destination object. Finally the destination
 * is returned just for kicks.
 *
 * @param {*} source The source to be used during copy.
 *                   Can be any type including primitives, null and undefined.
 * @param {(Object|Array)=} destination Optional destination into which the source is copied
 * @returns {*}
 */
function copy(source, destination){
  if (!destination) {
    destination = source;
    if (source) {
      if (isArray(source)) {
        destination = copy(source, []);
      } else if (isDate(source)) {
        destination = new Date(source.getTime());
      } else if (isObject(source)) {
        destination = copy(source, {});
      }
    }
  } else {
    if (isArray(source)) {
      while(destination.length) {
        destination.pop();
      }
      for ( var i = 0; i < source.length; i++) {
        destination.push(copy(source[i]));
      }
    } else {
      foreach(destination, function(value, key){
        delete destination[key];
      });
      for ( var key in source) {
        destination[key] = copy(source[key]);
      }
    }
  }
  return destination;
}

function equals(o1, o2) {
  if (o1 == o2) return true;
  var t1 = typeof o1, t2 = typeof o2, length, key, keySet;
  if (t1 == t2 && t1 == 'object') {
    if (o1 instanceof Array) {
      if ((length = o1.length) == o2.length) {
        for(key=0; key<length; key++) {
          if (!equals(o1[key], o2[key])) return false;
        }
        return true;
      }
    } else {
      keySet = {};
      for(key in o1) {
        if (key.charAt(0) !== '$' && !isFunction(o1[key]) && !equals(o1[key], o2[key])) return false;
        keySet[key] = true;
      }
      for(key in o2) {
        if (!keySet[key] && key.charAt(0) !== '$' && !isFunction(o2[key])) return false;
      }
      return true;
    }
  }
  return false;
}

function setHtml(node, html) {
  if (isLeafNode(node)) {
    if (msie) {
      node.innerText = html;
    } else {
      node.textContent = html;
    }
  } else {
    node.innerHTML = html;
  }
}

function isRenderableElement(element) {
  var name = element && element[0] && element[0].nodeName;
  return name && name.charAt(0) != '#' &&
    !includes(['TR', 'COL', 'COLGROUP', 'TBODY', 'THEAD', 'TFOOT'], name);
}
function elementError(element, type, error) {
  while (!isRenderableElement(element)) {
    element = element.parent() || jqLite(document.body);
  }
  if (element[0]['$NG_ERROR'] !== error) {
    element[0]['$NG_ERROR'] = error;
    if (error) {
      element.addClass(type);
      element.attr(type, error);
    } else {
      element.removeClass(type);
      element.removeAttr(type);
    }
  }
}

function concat(array1, array2, index) {
  return array1.concat(slice.call(array2, index, array2.length));
}

function bind(self, fn) {
  var curryArgs = arguments.length > 2 ? slice.call(arguments, 2, arguments.length) : [];
  if (typeof fn == $function) {
    return curryArgs.length ? function() {
      return arguments.length ? fn.apply(self, curryArgs.concat(slice.call(arguments, 0, arguments.length))) : fn.apply(self, curryArgs);
    }: function() {
      return arguments.length ? fn.apply(self, arguments) : fn.call(self);
    };
  } else {
    // in IE, native methods ore not functions and so they can not be bound (but they don't need to be)
    return fn;
  }
}

function toBoolean(value) {
  if (value && value.length !== 0) {
    var v = lowercase("" + value);
    value = !(v == 'f' || v == '0' || v == 'false' || v == 'no' || v == 'n' || v == '[]');
  } else {
    value = false;
  }
  return value;
}

function merge(src, dst) {
  for ( var key in src) {
    var value = dst[key];
    var type = typeof value;
    if (type == $undefined) {
      dst[key] = fromJson(toJson(src[key]));
    } else if (type == 'object' && value.constructor != array &&
        key.substring(0, 1) != "$") {
      merge(src[key], value);
    }
  }
}

function compile(element, existingScope) {
  var compiler = new Compiler(angularTextMarkup, angularAttrMarkup, angularDirective, angularWidget),
      $element = jqLite(element);
  return compiler.compile($element)($element, existingScope);
}
/////////////////////////////////////////////////

/**
 * Parses an escaped url query string into key-value pairs.
 * @returns Object.<(string|boolean)>
 */
function parseKeyValue(/**string*/keyValue) {
  var obj = {}, key_value, key;
  foreach((keyValue || "").split('&'), function(keyValue){
    if (keyValue) {
      key_value = keyValue.split('=');
      key = unescape(key_value[0]);
      obj[key] = isDefined(key_value[1]) ? unescape(key_value[1]) : true;
    }
  });
  return obj;
}

function toKeyValue(obj) {
  var parts = [];
  foreach(obj, function(value, key) {
    parts.push(escape(key) + (value === true ? '' : '=' + escape(value)));
  });
  return parts.length ? parts.join('&') : '';
}

function angularInit(config){
  if (config.autobind) {
    // TODO default to the source of angular.js
    var scope = compile(window.document, _null, {'$config':config}),
        $browser = scope.$inject('$browser');

    if (config.css)
      $browser.addCss(config.base_url + config.css);
    else if(msie<8)
      $browser.addJs(config.base_url + config.ie_compat, config.ie_compat_id);

    scope.$init();
  }
}

function angularJsConfig(document, config) {
  var scripts = document.getElementsByTagName("script"),
      match;
  config = extend({
    ie_compat_id: 'ng-ie-compat'
  }, config);
  for(var j = 0; j < scripts.length; j++) {
    match = (scripts[j].src || "").match(rngScript);
    if (match) {
      config.base_url = match[1];
      config.ie_compat = match[1] + 'angular-ie-compat' + (match[2] || '') + '.js';
      extend(config, parseKeyValue(match[6]));
      eachAttribute(jqLite(scripts[j]), function(value, name){
        if (/^ng:/.exec(name)) {
          name = name.substring(3).replace(/-/g, '_');
          if (name == 'autobind') value = true;
          config[name] = value;
        }
      });
    }
  }
  return config;
}
