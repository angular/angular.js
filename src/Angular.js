////////////////////////////////////

if (typeof document.getAttribute == 'undefined')
  document.getAttribute = function() {};

if (!window['console']) window['console']={'log':noop, 'error':noop};

var consoleNode,
    PRIORITY_FIRST    = -99999,
    PRIORITY_WATCH    = -1000,
    PRIORITY_LAST     =  99999,
    NOOP              = 'noop',
    NG_ERROR          = 'ng-error',
    NG_EXCEPTION      = 'ng-exception',
    NG_VALIDATION_ERROR = 'ng-validation-error',
    jQuery            = window['jQuery'] || window['$'], // weirdness to make IE happy
    _                 = window['_'],
    msie              = !!/(msie) ([\w.]+)/.exec(lowercase(navigator.userAgent)),
    jqLite            = jQuery || jqLiteWrap,
    slice             = Array.prototype.slice,
    angular           = window['angular']    || (window['angular'] = {}),
    angularTextMarkup = extensionMap(angular, 'textMarkup'),
    angularAttrMarkup = extensionMap(angular, 'attrMarkup'),
    angularDirective  = extensionMap(angular, 'directive'),
    angularWidget     = extensionMap(angular, 'widget'),
    angularValidator  = extensionMap(angular, 'validator'),
    angularFilter     = extensionMap(angular, 'filter'),
    angularFormatter  = extensionMap(angular, 'formatter'),
    angularService    = extensionMap(angular, 'service'),
    angularCallbacks  = extensionMap(angular, 'callbacks');

function angularAlert(){
  log(arguments); window.alert.apply(window, arguments);
}

function foreach(obj, iterator, context) {
  var key;
  if (obj) {
    if (obj.forEach) {
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

function noop() {}
function identity($) {return $;}
function extensionMap(angular, name) {
  var extPoint;
  return angular[name] || (extPoint = angular[name] = function (name, fn, prop){
    if (isDefined(fn)) {
      extPoint[name] = extend(fn, prop || {});
    }
    return extPoint[name];
  });
}

function jqLiteWrap(element) {
  if (typeof element == 'string') {
    var div = document.createElement('div');
    div.innerHTML = element;
    element = div.childNodes[0];
  }
  return element instanceof JQLite ? element : new JQLite(element);
}
function isUndefined(value){ return typeof value == 'undefined'; }
function isDefined(value){ return typeof value != 'undefined'; }
function isObject(value){ return typeof value == 'object';}
function isString(value){ return typeof value == 'string';}
function isNumber(value){ return typeof value == 'number';}
function isArray(value) { return value instanceof Array; }
function isFunction(value){ return typeof value == 'function';}
function isTextNode(node) { return nodeName(node) == '#text'; }
function lowercase(value){ return isString(value) ? value.toLowerCase() : value; }
function uppercase(value){ return isString(value) ? value.toUpperCase() : value; }
function trim(value) { return isString(value) ? value.replace(/^\s*/, '').replace(/\s*$/, '') : value; }
function nodeName(element) { return (element[0] || element || {}).nodeName; }
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

function log(a, b, c){
  var console = window['console'];
  switch(arguments.length) {
  case 1:
    console['log'](a);
    break;
  case 2:
    console['log'](a, b);
    break;
  default:
    console['log'](a, b, c);
    break;
  }
}

function error(a, b, c){
  var console = window['console'];
  switch(arguments.length) {
  case 1:
    console['error'](a);
    break;
  case 2:
    console['error'](a, b);
    break;
  default:
    console['error'](a, b, c);
    break;
  }
}

function consoleLog(level, objs) {
  var log = document.createElement("div");
  log.className = level;
  var msg = "";
  var sep = "";
  for ( var i = 0; i < objs.length; i++) {
    var obj = objs[i];
    msg += sep + (typeof obj == 'string' ? obj : toJson(obj));
    sep = " ";
  }
  log.appendChild(document.createTextNode(msg));
  consoleNode.appendChild(log);
}

function isNode(inp) {
  return inp &&
      inp.tagName &&
      inp.nodeName &&
      inp.ownerDocument &&
      inp.removeAttribute;
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

function copy(source, destination){
  if (!destination) {
    if (!source) {
      return source;
    } else if (isArray(source)) {
      return copy(source, []);
    } else {
      return copy(source, {});
    }
  } else {
    if (isArray(source)) {
      while(destination.length) {
        destination.pop();
      }
    } else {
      foreach(destination, function(value, key){
        delete destination[key];
      });
    }
    foreach(source, function(value, key){
      destination[key] = isArray(value) ? copy(value, []) : (isObject(value) ? copy(value, {}) : value);
    });
    return destination;
  }
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

function elementError(element, type, error) {
  if (error) {
    element.addClass(type);
    element.attr(NG_ERROR, error);
  } else {
    element.removeClass(type);
    element.removeAttr(NG_ERROR);
  }
}

function escapeAttr(html) {
  if (!html || !html.replace)
    return html;
  return html.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g,
      '&quot;');
}

function bind(_this, _function) {
  var curryArgs = slice.call(arguments, 2, arguments.length);
  return function() {
    return _function.apply(_this, curryArgs.concat(slice.call(arguments, 0, arguments.length)));
  };
}

function outerHTML(node) {
  var temp = document.createElement('div');
  temp.appendChild(node);
  var outerHTML = temp.innerHTML;
  temp.removeChild(node);
  return outerHTML;
}

function toBoolean(value) {
  if (value && value.length !== 0) {
    var v = lowercase("" + value);
    value = !(v == 'f' || v == '0' || v == 'false' || v == 'no' || v == '[]');
  } else {
    value = false;
  }
  return value;
}

function merge(src, dst) {
  for ( var key in src) {
    var value = dst[key];
    var type = typeof value;
    if (type == 'undefined') {
      dst[key] = fromJson(toJson(src[key]));
    } else if (type == 'object' && value.constructor != array &&
        key.substring(0, 1) != "$") {
      merge(src[key], value);
    }
  }
}

function compile(element, parentScope, overrides) {
  var compiler = new Compiler(angularTextMarkup, angularAttrMarkup, angularDirective, angularWidget);
      $element = jqLite(element);
  return compiler.compile($element)($element, parentScope, overrides);
}
/////////////////////////////////////////////////

function parseKeyValue(keyValue) {
  var obj = {}, key_value, key;
  foreach((keyValue || "").split('&'), function(keyValue){
    if (keyValue) {
      key_value = keyValue.split('=');
      key = decodeURIComponent(key_value[0]);
      obj[key] = key_value[1] ? decodeURIComponent(key_value[1]) : true;
    }
  });
  return obj;
}

function toKeyValue(obj) {
  var parts = [];
  foreach(obj, function(value, key){
    parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
  });
  return parts.length ? parts.join('&') : '';
}

function angularInit(config){
  if (config.autobind) {
    compile(window.document, null, {'$config':config}).$init();
  }
}
