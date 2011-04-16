////////////////////////////////////

if (typeof document.getAttribute == $undefined)
  document.getAttribute = function() {};

/**
 * @workInProgress
 * @ngdoc function
 * @name angular.lowercase
 * @function
 *
 * @description Converts string to lowercase
 * @param {string} string String to be lowercased.
 * @returns {string} Lowercased string.
 */
var lowercase = function (string){ return isString(string) ? string.toLowerCase() : string; };


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.uppercase
 * @function
 *
 * @description Converts string to uppercase.
 * @param {string} string String to be uppercased.
 * @returns {string} Uppercased string.
 */
var uppercase = function (string){ return isString(string) ? string.toUpperCase() : string; };


var manualLowercase = function (s) {
  return isString(s)
      ? s.replace(/[A-Z]/g, function (ch) {return fromCharCode(ch.charCodeAt(0) | 32); })
      : s;
};
var manualUppercase = function (s) {
  return isString(s)
      ? s.replace(/[a-z]/g, function (ch) {return fromCharCode(ch.charCodeAt(0) & ~32); })
      : s;
};


// String#toLowerCase and String#toUpperCase don't produce correct results in browsers with Turkish
// locale, for this reason we need to detect this case and redefine lowercase/uppercase methods with
// correct but slower alternatives.
if ('i' !== 'I'.toLowerCase()) {
  lowercase = manualLowercase;
  uppercase = manualUppercase;
}

function fromCharCode(code) { return String.fromCharCode(code); }


var $$element         = '$element',
    $$update          = '$update',
    $$scope           = '$scope',
    $$validate        = '$validate',
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
    $value            = 'value',
    $selected         = 'selected',
    $undefined        = 'undefined',
    NG_EXCEPTION      = 'ng-exception',
    NG_VALIDATION_ERROR = 'ng-validation-error',
    NOOP              = 'noop',
    PRIORITY_FIRST    = -99999,
    PRIORITY_WATCH    = -1000,
    PRIORITY_LAST     =  99999,
    PRIORITY          = {'FIRST': PRIORITY_FIRST, 'LAST': PRIORITY_LAST, 'WATCH':PRIORITY_WATCH},
    Error             = window.Error,
    /** holds major version number for IE or NaN for real browsers */
    msie              = parseInt((/msie (\d+)/.exec(lowercase(navigator.userAgent)) || [])[1], 10),
    jqLite,           // delay binding since jQuery could be loaded after us.
    jQuery,           // delay binding
    slice             = [].slice,
    push              = [].push,
    error             = window[$console]
                           ? bind(window[$console], window[$console]['error'] || noop)
                           : noop,

    /** @name angular */
    angular           = window[$angular] || (window[$angular] = {}),
    /** @name angular.markup */
    angularTextMarkup = extensionMap(angular, 'markup'),
    /** @name angular.attrMarkup */
    angularAttrMarkup = extensionMap(angular, 'attrMarkup'),
    /** @name angular.directive */
    angularDirective  = extensionMap(angular, 'directive'),
    /** @name angular.widget */
    angularWidget     = extensionMap(angular, 'widget', lowercase),
    /** @name angular.validator */
    angularValidator  = extensionMap(angular, 'validator'),
    /** @name angular.fileter */
    angularFilter     = extensionMap(angular, 'filter'),
    /** @name angular.formatter */
    angularFormatter  = extensionMap(angular, 'formatter'),
    /** @name angular.service */
    angularService    = extensionMap(angular, 'service'),
    angularCallbacks  = extensionMap(angular, 'callbacks'),
    nodeName_,
    rngScript         = /^(|.*\/)angular(-.*?)?(\.min)?.js(\?[^#]*)?(#(.*))?$/,
    DATE_ISOSTRING_LN = 24;

/**
 * @workInProgress
 * @ngdoc function
 * @name angular.forEach
 * @function
 *
 * @description
 * Invokes the `iterator` function once for each item in `obj` collection. The collection can either
 * be an object or an array. The `iterator` function is invoked with `iterator(value, key)`, where
 * `value` is the value of an object property or an array element and `key` is the object property
 * key or array element index. Optionally, `context` can be specified for the iterator function.
 *
 * Note: this function was previously known as `angular.foreach`.
 *
   <pre>
     var values = {name: 'misko', gender: 'male'};
     var log = [];
     angular.forEach(values, function(value, key){
       this.push(key + ': ' + value);
     }, log);
     expect(log).toEqual(['name: misko', 'gender:male']);
   </pre>
 *
 * @param {Object|Array} obj Object to iterate over.
 * @param {function()} iterator Iterator function.
 * @param {Object} context Object to become context (`this`) for the iterator function.
 * @returns {Objet|Array} Reference to `obj`.
 */
function forEach(obj, iterator, context) {
  var key;
  if (obj) {
    if (isFunction(obj)){
      for (key in obj) {
        if (key != 'prototype' && key != $length && key != $name && obj.hasOwnProperty(key)) {
          iterator.call(context, obj[key], key);
        }
      }
    } else if (obj.forEach && obj.forEach !== forEach) {
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

function forEachSorted(obj, iterator, context) {
  var keys = [];
  for (var key in obj) keys.push(key);
  keys.sort();
  for ( var i = 0; i < keys.length; i++) {
    iterator.call(context, obj[keys[i]], keys[i]);
  }
  return keys;
}


function formatError(arg) {
  if (arg instanceof Error) {
    if (arg.stack) {
      arg = arg.stack;
    } else if (arg.sourceURL) {
      arg = arg.message + '\n' + arg.sourceURL + ':' + arg.line;
    }
  }
  return arg;
}


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.extend
 * @function
 *
 * @description
 * Extends the destination object `dst` by copying all of the properties from the `src` object(s) to
 * `dst`. You can specify multiple `src` objects.
 *
 * @param {Object} dst The destination object.
 * @param {...Object} src The source object(s).
 */
function extend(dst) {
  forEach(arguments, function(obj){
    if (obj !== dst) {
      forEach(obj, function(value, key){
        dst[key] = value;
      });
    }
  });
  return dst;
}


function inherit(parent, extra) {
  return extend(new (extend(function(){}, {prototype:parent}))(), extra);
}


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.noop
 * @function
 *
 * @description
 * Empty function that performs no operation whatsoever. This function is useful when writing code
 * in the functional style.
   <pre>
     function foo(callback) {
       var result = calculateResult();
       (callback || angular.noop)(result);
     }
   </pre>
 */
function noop() {}


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.identity
 * @function
 *
 * @description
 * A function that does nothing except for returning its first argument. This function is useful
 * when writing code in the functional style.
 *
   <pre>
     function transformer(transformationFn, value) {
       return (transformationFn || identity)(value);
     };
   </pre>
 */
function identity($) {return $;}


function valueFn(value) {return function(){ return value; };}

function extensionMap(angular, name, transform) {
  var extPoint;
  return angular[name] || (extPoint = angular[name] = function (name, fn, prop){
    name = (transform || identity)(name);
    if (isDefined(fn)) {
      extPoint[name] = extend(fn, prop || {});
    }
    return extPoint[name];
  });
}

/**
 * @workInProgress
 * @ngdoc function
 * @name angular.isUndefined
 * @function
 *
 * @description
 * Checks if a reference is undefined.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is undefined.
 */
function isUndefined(value){ return typeof value == $undefined; }


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.isDefined
 * @function
 *
 * @description
 * Checks if a reference is defined.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is defined.
 */
function isDefined(value){ return typeof value != $undefined; }


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.isObject
 * @function
 *
 * @description
 * Checks if a reference is an `Object`. Unlike in JavaScript `null`s are not considered to be
 * objects.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is an `Object` but not `null`.
 */
function isObject(value){ return value!=null && typeof value == $object;}


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.isString
 * @function
 *
 * @description
 * Checks if a reference is a `String`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `String`.
 */
function isString(value){ return typeof value == $string;}


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.isNumber
 * @function
 *
 * @description
 * Checks if a reference is a `Number`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `Number`.
 */
function isNumber(value){ return typeof value == $number;}


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.isDate
 * @function
 *
 * @description
 * Checks if value is a date.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `Date`.
 */
function isDate(value){ return value instanceof Date; }


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.isArray
 * @function
 *
 * @description
 * Checks if a reference is an `Array`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is an `Array`.
 */
function isArray(value) { return value instanceof Array; }


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.isFunction
 * @function
 *
 * @description
 * Checks if a reference is a `Function`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `Function`.
 */
function isFunction(value){ return typeof value == $function;}


/**
 * Checks if `obj` is a window object.
 *
 * @private
 * @param {*} obj Object to check
 * @returns {boolean} True if `obj` is a window obj.
 */
function isWindow(obj) {
  return obj && obj.document && obj.location && obj.alert && obj.setInterval;
}

function isBoolean(value) { return typeof value == $boolean;}
function isTextNode(node) { return nodeName_(node) == '#text'; }
function trim(value) { return isString(value) ? value.replace(/^\s*/, '').replace(/\s*$/, '') : value; }
function isElement(node) {
  return node &&
    (node.nodeName  // we are a direct element
    || (node.bind && node.find));  // we have a bind and find method part of jQuery API
}

/**
 * HTML class which is the only class which can be used in ng:bind to inline HTML for security reasons.
 * @constructor
 * @param html raw (unsafe) html
 * @param {string=} option if set to 'usafe' then get method will return raw (unsafe/unsanitized) html
 */
function HTML(html, option) {
  this.html = html;
  this.get = lowercase(option) == 'unsafe'
    ? valueFn(html)
    : function htmlSanitize() {
        var buf = [];
        htmlParser(html, htmlSanitizeWriter(buf));
        return buf.join('');
      };
}

if (msie < 9) {
  nodeName_ = function(element) {
    element = element.nodeName ? element : element[0];
    return (element.scopeName && element.scopeName != 'HTML' ) ? uppercase(element.scopeName + ':' + element.nodeName) : element.nodeName;
  };
} else {
  nodeName_ = function(element) {
    return element.nodeName ? element.nodeName : element[0].nodeName;
  };
}

function isVisible(element) {
  var rect = element[0].getBoundingClientRect(),
      width = (rect.width || (rect.right||0 - rect.left||0)),
      height = (rect.height || (rect.bottom||0 - rect.top||0));
  return width>0 && height>0;
}

function map(obj, iterator, context) {
  var results = [];
  forEach(obj, function(value, index, list) {
    results.push(iterator.call(context, value, index, list));
  });
  return results;
}


/**
 * @ngdoc function
 * @name angular.Object.size
 * @function
 *
 * @description
 * Determines the number of elements in an array, number of properties of an object or string
 * length.
 *
 * Note: this function is used to augment the Object type in angular expressions. See
 * {@link angular.Object} for more info.
 *
 * @param {Object|Array|string} obj Object, array or string to inspect.
 * @param {boolean} [ownPropsOnly=false] Count only "own" properties in an object
 * @returns {number} The size of `obj` or `0` if `obj` is neither an object or an array.
 *
 * @example
 * <doc:example>
 *  <doc:source>
 *   Number of items in array: {{ [1,2].$size() }}<br/>
 *   Number of items in object: {{ {a:1, b:2, c:3}.$size() }}<br/>
 *  </doc:source>
 *  <doc:scenario>
 *   it('should print correct sizes for an array and an object', function() {
 *     expect(binding('[1,2].$size()')).toBe('2');
 *     expect(binding('{a:1, b:2, c:3}.$size()')).toBe('3');
 *   });
 *  </doc:scenario>
 * </doc:example>
 */
function size(obj, ownPropsOnly) {
  var size = 0, key;

  if (isArray(obj) || isString(obj)) {
    return obj.length;
  } else if (isObject(obj)){
    for (key in obj)
      if (!ownPropsOnly || obj.hasOwnProperty(key))
        size++;
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
 * @ngdoc function
 * @name angular.Object.copy
 * @function
 *
 * @description
 * Creates a deep copy of `source`.
 *
 * If `source` is an object or an array, all of its members will be copied into the `destination`
 * object.
 *
 * If `destination` is not provided and `source` is an object or an array, a copy is created &
 * returned, otherwise the `source` is returned.
 *
 * If `destination` is provided, all of its properties will be deleted.
 *
 * Note: this function is used to augment the Object type in angular expressions. See
 * {@link angular.Object} for more info.
 *
 * @param {*} source The source to be used to make a copy.
 *                   Can be any type including primitives, `null` and `undefined`.
 * @param {(Object|Array)=} destination Optional destination into which the source is copied. If
 *     provided, must be of the same type as `source`.
 * @returns {*} The copy or updated `destination` if `destination` was specified.
 *
 * @example
 * <doc:example>
 *  <doc:source>
     Salutation: <input type="text" name="master.salutation" value="Hello" /><br/>
     Name: <input type="text" name="master.name" value="world"/><br/>
     <button ng:click="form = master.$copy()">copy</button>
     <hr/>

     The master object is <span ng:hide="master.$equals(form)">NOT</span> equal to the form object.

     <pre>master={{master}}</pre>
     <pre>form={{form}}</pre>
 *  </doc:source>
 *  <doc:scenario>
   it('should print that initialy the form object is NOT equal to master', function() {
     expect(element('.doc-example-live input[name=master.salutation]').val()).toBe('Hello');
     expect(element('.doc-example-live input[name=master.name]').val()).toBe('world');
     expect(element('.doc-example-live span').css('display')).toBe('inline');
   });

   it('should make form and master equal when the copy button is clicked', function() {
     element('.doc-example-live button').click();
     expect(element('.doc-example-live span').css('display')).toBe('none');
   });
 *  </doc:scenario>
 * </doc:example>
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
      forEach(destination, function(value, key){
        delete destination[key];
      });
      for ( var key in source) {
        destination[key] = copy(source[key]);
      }
    }
  }
  return destination;
}


/**
 * @ngdoc function
 * @name angular.Object.equals
 * @function
 *
 * @description
 * Determines if two objects or value are equivalent.
 *
 * To be equivalent, they must pass `==` comparison or be of the same type and have all their
 * properties pass `==` comparison. During property comparision properties of `function` type and
 * properties with name starting with `$` are ignored.
 *
 * Supports values types, arrays and objects.
 *
 * Note: this function is used to augment the Object type in angular expressions. See
 * {@link angular.Object} for more info.
 *
 * @param {*} o1 Object or value to compare.
 * @param {*} o2 Object or value to compare.
 * @returns {boolean} True if arguments are equal.
 *
 * @example
 * <doc:example>
 *  <doc:source>
     Salutation: <input type="text" name="greeting.salutation" value="Hello" /><br/>
     Name: <input type="text" name="greeting.name" value="world"/><br/>
     <hr/>

     The <code>greeting</code> object is
     <span ng:hide="greeting.$equals({salutation:'Hello', name:'world'})">NOT</span> equal to
     <code>{salutation:'Hello', name:'world'}</code>.

     <pre>greeting={{greeting}}</pre>
 *  </doc:source>
 *  <doc:scenario>
     it('should print that initialy greeting is equal to the hardcoded value object', function() {
       expect(element('.doc-example-live input[name=greeting.salutation]').val()).toBe('Hello');
       expect(element('.doc-example-live input[name=greeting.name]').val()).toBe('world');
       expect(element('.doc-example-live span').css('display')).toBe('none');
     });

     it('should say that the objects are not equal when the form is modified', function() {
       input('greeting.name').enter('kitty');
       expect(element('.doc-example-live span').css('display')).toBe('inline');
     });
 *  </doc:scenario>
 * </doc:example>
 */
function equals(o1, o2) {
  if (o1 == o2) return true;
  if (o1 === null || o2 === null) return false;
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
  var parent;

  while (!isRenderableElement(element)) {
    parent = element.parent();
    if (parent.length) {
      element = element.parent();
    } else {
      return;
    }
  }

  if (element[0]['$NG_ERROR'] !== error) {
    element[0]['$NG_ERROR'] = error;
    if (error) {
      element.addClass(type);
      element.attr(type, error.message || error);
    } else {
      element.removeClass(type);
      element.removeAttr(type);
    }
  }
}

function concat(array1, array2, index) {
  return array1.concat(slice.call(array2, index, array2.length));
}


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.bind
 * @function
 *
 * @description
 * Returns a function which calls function `fn` bound to `self` (`self` becomes the `this` for `fn`).
 * Optional `args` can be supplied which are prebound to the function, also known as
 * [function currying](http://en.wikipedia.org/wiki/Currying).
 *
 * @param {Object} self Context which `fn` should be evaluated in.
 * @param {function()} fn Function to be bound.
 * @param {...*} args Optional arguments to be prebound to the `fn` function call.
 * @returns {function()} Function that wraps the `fn` with all the specified bindings.
 */
function bind(self, fn) {
  var curryArgs = arguments.length > 2 ? slice.call(arguments, 2, arguments.length) : [];
  if (typeof fn == $function && !(fn instanceof RegExp)) {
    return curryArgs.length ? function() {
      return arguments.length ? fn.apply(self, curryArgs.concat(slice.call(arguments, 0, arguments.length))) : fn.apply(self, curryArgs);
    }: function() {
      return arguments.length ? fn.apply(self, arguments) : fn.call(self);
    };
  } else {
    // in IE, native methods are not functions and so they can not be bound (but they don't need to be)
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


/** @name angular.compile */
function compile(element) {
  return new Compiler(angularTextMarkup, angularAttrMarkup, angularDirective, angularWidget)
    .compile(element);
}
/////////////////////////////////////////////////

/**
 * Parses an escaped url query string into key-value pairs.
 * @returns Object.<(string|boolean)>
 */
function parseKeyValue(/**string*/keyValue) {
  var obj = {}, key_value, key;
  forEach((keyValue || "").split('&'), function(keyValue){
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
  forEach(obj, function(value, key) {
    parts.push(escape(key) + (value === true ? '' : '=' + escape(value)));
  });
  return parts.length ? parts.join('&') : '';
}


/**
 * we need our custom mehtod because encodeURIComponent is too agressive and doesn't follow
 * http://www.ietf.org/rfc/rfc3986.txt with regards to the character set (pchar) allowed in path
 * segments:
 *    segment       = *pchar
 *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
 *    pct-encoded   = "%" HEXDIG HEXDIG
 *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
 *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
 *                     / "*" / "+" / "," / ";" / "="
 */
function encodeUriSegment(val) {
  return encodeUriQuery(val, true).
             replace(/%26/gi, '&').
             replace(/%3D/gi, '=').
             replace(/%2B/gi, '+');
}


/**
 * This method is intended for encoding *key* or *value* parts of query component. We need a custom
 * method becuase encodeURIComponent is too agressive and encodes stuff that doesn't have to be
 * encoded per http://tools.ietf.org/html/rfc3986:
 *    query       = *( pchar / "/" / "?" )
 *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
 *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
 *    pct-encoded   = "%" HEXDIG HEXDIG
 *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
 *                     / "*" / "+" / "," / ";" / "="
 */
function encodeUriQuery(val, pctEncodeSpaces) {
  return encodeURIComponent(val).
             replace(/%40/gi, '@').
             replace(/%3A/gi, ':').
             replace(/%24/g, '$').
             replace(/%2C/gi, ',').
             replace((pctEncodeSpaces ? null : /%20/g), '+');
}


/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:autobind
 * @element script
 *
 * @TODO ng:autobind is not a directive!! it should be documented as bootstrap parameter in a
 *     separate bootstrap section.
 * @TODO rename to ng:autobind to ng:autoboot
 *
 * @description
 * This doc explains how to bootstrap your application with angular. You can either use
 * `ng:autobind` script tag attribute or perform a manual bootstrap.
 *
 * # Auto-bootstrap with `ng:autobind`
 * The simplest way to get an angular application up and running is by adding a script tag in
 * your HTML file that contains `ng:autobind` attribute. This will:
 *
 * * Load the angular script
 * * Tell angular to compile the entire document (or just its portion if the attribute has a value)
 *
 * For example:
 *
 * <pre>
    &lt;!doctype html&gt;
    &lt;html xmlns:ng="http://angularjs.org"&gt;
     &lt;head&gt;
      &lt;script type="text/javascript" src="http://code.angularjs.org/angular-0.9.3.min.js"
              ng:autobind&gt;&lt;/script&gt;
     &lt;/head&gt;
     &lt;body&gt;
       Hello {{'world'}}!
     &lt;/body&gt;
    &lt;/html&gt;
 * </pre>
 *
 * The reason why `ng:autobind` is needed at all is that angular does not want to be over-zealous
 * and assume the entire HTML document should be processed based solely on the fact you have
 * included the angular.js script.
 *
 * The `ng:autobind` attribute without any value tells angular to compile and manage the whole HTML
 * document. The compilation occurs as soon as the document is ready for DOM manipulation. Note that
 * you don't need to explicitly add an `onLoad` event handler; auto bind mode takes care of all the
 * work for you.
 *
 * In order to compile only a part of the document with a root element, specify the id of the root
 * element as the value of the `ng:autobind` attribute, e.g. `ng:autobind="angularContent"`.
 *
 *
 * ## Auto-bootstrap with `#autobind`
 * In some rare cases you can't define the `ng:` prefix before the script tag's attribute  (e.g. in
 * some CMS systems). In these situations it is possible to auto-bootstrap angular by appending
 * `#autobind` to the script `src` URL, like in this snippet:
 *
 * <pre>
    &lt;!doctype html&gt;
    &lt;html&gt;
     &lt;head&gt;
      &lt;script type="text/javascript"
              src="http://code.angularjs.org/angular-0.9.3.min.js#autobind"&gt;&lt;/script&gt;
     &lt;/head&gt;
     &lt;body&gt;
       &lt;div xmlns:ng="http://angularjs.org"&gt;
         Hello {{'world'}}!
       &lt;/div&gt;
     &lt;/body&gt;
    &lt;/html&gt;
 * </pre>
 *
 * In this snippet it is the `#autobind` URL fragment that tells angular to auto-bootstrap.
 *
 * Similarly to `ng:autobind`, you can specify an element id that should be exclusively targeted for
 * compilation as the value of the `#autobind`, e.g. `#autobind=angularContent`.
 *
 * ## Filename Restrictions for Auto-bootstrap
 * In order for us to find the auto-bootstrap script attribute or URL fragment, the value of the
 * `script` `src` attribute that loads the angular script must match one of these naming
 * conventions:
 *
 * - `angular.js`
 * - `angular-min.js`
 * - `angular-x.x.x.js`
 * - `angular-x.x.x.min.js`
 * - `angular-x.x.x-xxxxxxxx.js` (dev snapshot)
 * - `angular-x.x.x-xxxxxxxx.min.js` (dev snapshot)
 * - `angular-bootstrap.js` (used for development of angular)
 *
 * Optionally, any of the filename formats above can be prepended with a relative or absolute URL
 * that ends with `/`.
 *
 *
 * # Manual Bootstrap
 * Using auto-bootstrap is a handy way to start using angular, but advanced users who want more
 * control over the initialization process might prefer to use the manual bootstrap method instead.
 *
 * The best way to get started with manual bootstraping is to look at the magic behind `ng:autobind`,
 * by writing out each step of the autobind process explicitly. Note that the following code is
 * equivalent to the code in the previous section.
 *
 * <pre>
    &lt;!doctype html&gt;
    &lt;html xmlns:ng="http://angularjs.org"&gt;
     &lt;head&gt;
      &lt;script type="text/javascript" src="http://code.angularjs.org/angular-0.9.3.min.js"
              ng:autobind&gt;&lt;/script&gt;
      &lt;script type="text/javascript"&gt;
       (angular.element(document).ready(function() {
         angular.compile(document)();
       })(document);
      &lt;/script&gt;
     &lt;/head&gt;
     &lt;body&gt;
       Hello {{'World'}}!
     &lt;/body&gt;
    &lt;/html&gt;
 * </pre>
 *
 * This is the sequence that your code should follow if you're bootstrapping angular on your own:
 *
 * 1. After the page is loaded, find the root of the HTML template, which is typically the root of
 *    the document.
 * 2. Run the HTML compiler, which converts the templates into an executable, bi-directionally bound
 *    application.
 *
 *
 * ## XML Namespace
 * *IMPORTANT:* When using angular, you must declare the ng namespace using the xmlns tag. If you
 * don't declare the namespace, Internet Explorer older than 9 does not render widgets properly. The
 * namespace must be declared even if you use HTML instead of XHTML.
 *
 * <pre>
 * &lt;html xmlns:ng="http://angularjs.org"&gt;
 * </pre>
 *
 *
 * ### Create your own namespace
 * If you want to define your own widgets, you must create your own namespace and use that namespace
 * to form the fully qualified widget name. For example, you could map the alias `my` to your domain
 * and create a widget called my:widget. To create your own namespace, simply add another xmlsn tag
 * to your page, create an alias, and set it to your unique domain:
 *
 * <pre>
 * &lt;html xmlns:ng="http://angularjs.org" xmlns:my="http://mydomain.com"&gt;
 * </pre>
 *
 *
 * ### Global Object
 * The angular script creates a single global variable `angular` in the global namespace. All
 * APIs are bound to fields of this global object.
 *
 */
function angularInit(config, document){
  var autobind = config.autobind;

  if (autobind) {
    var element = isString(autobind) ? document.getElementById(autobind) : document,
        scope = compile(element)(createScope({'$config':config})),
        $browser = scope.$service('$browser');

    if (config.css)
      $browser.addCss(config.base_url + config.css);
    else if(msie<8)
      $browser.addJs(config.base_url + config.ie_compat, config.ie_compat_id);
  }
}

function angularJsConfig(document, config) {
  bindJQuery();
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
          value = value || true;
          config[name] = value;
        }
      });
    }
  }
  return config;
}

function bindJQuery(){
  // bind to jQuery if present;
  jQuery = window.jQuery;
  // reset to jQuery or default to us.
  if (jQuery) {
    jqLite = jQuery;
    extend(jQuery.fn, {
      scope: JQLitePrototype.scope
    });
  } else {
    jqLite = jqLiteWrap;
  }
  angular.element = jqLite;
}

/**
 * throw error of the argument is falsy.
 */
function assertArg(arg, name, reason) {
  if (!arg) {
    var error = new Error("Argument '" + (name||'?') + "' is " +
        (reason || "required"));
    if (window.console) window.console.log(error.stack);
    throw error;
  }
}

function assertArgFn(arg, name) {
  assertArg(isFunction(arg, name, 'not a function'));
}
