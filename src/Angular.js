if (typeof document.getAttribute == 'undefined')
  document.getAttribute = function() {};

function noop() {}
function identity($) {return $;}
if (!window['console']) window['console']={'log':noop, 'error':noop};

function extensionMap(angular, name) {
  var extPoint;
  return angular[name] || (extPoint = angular[name] = function (name, fn, prop){
    if (isDefined(fn)) {
      extPoint[name] = extend(fn, prop || {});
    }
    return extPoint[name];
  });
}

var consoleNode,
    NOOP              = 'noop',
    jQuery            = window['jQuery'] || window['$'], // weirdness to make IE happy
    _                 = window['_'],
    jqLite            = jQuery,
    slice             = Array.prototype.slice,
    angular           = window['angular']    || (window['angular']    = {}),
    angularTextMarkup = extensionMap(angular, 'textMarkup'),
    angularAttrMarkup = extensionMap(angular, 'attrMarkup'),
    angularDirective  = extensionMap(angular, 'directive'),
    angularWidget     = extensionMap(angular, 'widget'),
    angularValidator  = extensionMap(angular, 'validator'),
    angularFilter     = extensionMap(angular, 'filter'),
    angularFormatter  = extensionMap(angular, 'formatter'),
    angularCallbacks  = extensionMap(angular, 'callbacks'),
    angularAlert      = angular['alert']     || (angular['alert']     = function(){
        log(arguments); window.alert.apply(window, arguments);
      });
angular['copy'] = copy;

var isVisible = isVisible || function (element) {
  return jQuery(element).is(":visible");
};

function foreach(obj, iterator, context) {
  var key;
  if (obj) {
    if (obj.forEach) {
      obj.forEach(iterator, context);
    } else if (obj instanceof Array) {
      for (key = 0; key < obj.length; key++)
        iterator.call(context, obj[key], key);
    } else {
      for (key in obj)
        iterator.call(context, obj[key], key);
    }
  }
  return obj;
}

function extend(dst, obj) {
  foreach(obj, function(value, key){
    dst[key] = value;
  });
  return dst;
}

function isUndefined(value){ return typeof value == 'undefined'; }
function isDefined(value){ return typeof value != 'undefined'; }
function isObject(value){ return typeof value == 'object';}
function isString(value){ return typeof value == 'string';}
function isArray(value) { return value instanceof Array; }
function isFunction(value){ return typeof value == 'function';}
function lowercase(value){ return isString(value) ? value.toLowerCase() : value; }
function uppercase(value){ return isString(value) ? value.toUpperCase() : value; }
function trim(value) { return isString(value) ? value.replace(/^\s*/, '').replace(/\s*$/, '') : value; };
function includes(array, obj) {
  for ( var i = 0; i < array.length; i++) {
    if (obj === array[i]) return true;
  }
  return false;
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
      foreach(function(value, key){
        delete destination[key];
      });
    }
    return $.extend(true, destination, source);
  }
};

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
  var v = ("" + value).toLowerCase();
  if (v == 'f' || v == '0' || v == 'false' || v == 'no')
    value = false;
  return !!value;
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

/////////////////////////////////////////////////

angular['compile'] = function(element, config) {
  config = extend({
      'onUpdateView': noop,
      'server': "",
      'location': {'get':noop, 'set':noop, 'listen':noop}
    }, config||{});

  var compiler = new Compiler(angularTextMarkup, angularAttrMarkup, angularDirective, angularWidget);
      $element = jqLite(element),
      rootScope = {
        '$window': window
      };
  return rootScope['$root'] = compiler.compile($element)($element, rootScope);
};
