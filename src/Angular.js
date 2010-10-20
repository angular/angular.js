////////////////////////////////////

if (typeof document.getAttribute == $undefined)
  document.getAttribute = function() {};

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
    angular           = window[$angular]    || (window[$angular] = {}),
    angularTextMarkup = extensionMap(angular, 'markup'),
    angularAttrMarkup = extensionMap(angular, 'attrMarkup'),
    angularDirective  = extensionMap(angular, 'directive'),
    angularWidget     = extensionMap(angular, 'widget', lowercase),
    angularValidator  = extensionMap(angular, 'validator'),
    angularFilter     = extensionMap(angular, 'filter'),
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
function isArray(value) { return value instanceof Array; }
function isFunction(value){ return typeof value == $function;}
function isTextNode(node) { return nodeName(node) == '#text'; }
function lowercase(value){ return isString(value) ? value.toLowerCase() : value; }
function uppercase(value){ return isString(value) ? value.toUpperCase() : value; }
function trim(value) { return isString(value) ? value.replace(/^\s*/, '').replace(/\s*$/, '') : value; }
function isElement(node) {
  return node && (node.nodeName || node instanceof JQLite || (jQuery && node instanceof jQuery));
}

function HTML(html) {
  this.html = html;
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
 * @return {*}
 */
function copy(source, destination){
  if (!destination) {
    destination = source;
    if (source) {
      if (isArray(source)) {
        destination = copy(source, []);
      } else if (source instanceof Date) {
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

function escapeHtml(html) {
  if (!html || !html.replace)
    return html;
  return html.
      replace(/&/g, '&amp;').
      replace(/</g, '&lt;').
      replace(/>/g, '&gt;');
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

function escapeAttr(html) {
  if (!html || !html.replace)
    return html;
  return html.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g,
      '&quot;');
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
 * @return Object.<(string|boolean)>
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
