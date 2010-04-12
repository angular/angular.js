/**
 * The MIT License
 *
 * Copyright (c) 2010 Adam Abrons and Misko Hevery http://getangular.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
(function(window, document, previousOnLoad){
////////////////////////////////////

if (typeof document.getAttribute == 'undefined')
  document.getAttribute = function() {};

if (!window['console']) window['console']={'log':noop, 'error':noop};

var consoleNode,
    PRIORITY_FIRST    = -99999,
    PRIORITY_WATCH    = -1000,
    PRIORITY_LAST     =  99999,
    NOOP              = 'noop',
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
  if (isString(element)) {
    var div = document.createElement('div');
    div.innerHTML = element;
    element = new JQLite(div.childNodes);
  } else if (element instanceof JQLite) {
  } else if (isElement(element)) {
    element =  new JQLite(element);
  }
  return element;
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
function nodeName(element) { return (element[0] || element).nodeName; }
function isElement(node) {
  if (node && node[0]) node = node[0];
  return node && node.nodeName;
}

function isVisible(element) {
  var rect = element[0].getBoundingClientRect();
  return rect.width !=0 && rect.height !=0;
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


function isRenderableElement(element) {
  var name = element && element[0] && element[0].nodeName;
  return name && name.charAt(0) != '#' &&
    !includes(['TR', 'COL', 'COLGROUP', 'TBODY', 'THEAD', 'TFOOT'], name);
}
function elementError(element, type, error) {
  while (!isRenderableElement(element)) {
    element = element.parent() || jqLite(document.body);
  }
  if (error) {
    element.addClass(type);
    element.attr(type, error);
  } else {
    element.removeClass(type);
    element.removeAttr(type);
  }
}

function escapeAttr(html) {
  if (!html || !html.replace)
    return html;
  return html.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g,
      '&quot;');
}

function bind(_this, _function) {
  if (!isFunction(_function))
    throw "Not a function!";
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
  var compiler = new Compiler(angularTextMarkup, angularAttrMarkup, angularDirective, angularWidget),
      $element = jqLite(element),
      parent = extend({}, parentScope);
  parent.$element = $element;
  return compiler.compile($element)($element, parent, overrides);
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
    var scope = compile(window.document, null, {'$config':config});
    scope.$browser.addCss('../css/angular.css');
    scope.$init();
  }
}

function angularJsConfig(document) {
  var filename = /(.*)\/angular(-(.*))?.js(#(.*))?/,
      scripts = document.getElementsByTagName("SCRIPT"),
      match;
  for(var j = 0; j < scripts.length; j++) {
    match = (scripts[j].src || "").match(filename);
    if (match) {
      return match[5];
    }
  }
  return "";
}
array = [].constructor;

function toJson(obj, pretty){
  var buf = [];
  toJsonArray(buf, obj, pretty ? "\n  " : null, []);
  return buf.join('');
}

function toPrettyJson(obj)  {
  return toJson(obj, true);
}

function fromJson(json) {
  if (!json) return json;
  try {
    var parser = new Parser(json, true);
    var expression =  parser.primary();
    parser.assertAllConsumed();
    return expression();
  } catch (e) {
    error("fromJson error: ", json, e);
    throw e;
  }
}

angular['toJson'] = toJson;
angular['fromJson'] = fromJson;

function toJsonArray(buf, obj, pretty, stack){
  if (typeof obj == "object") {
    if (includes(stack, obj)) {
      buf.push("RECURSION");
      return;
    }
    stack.push(obj);
  }
  var type = typeof obj;
  if (obj === null) {
    buf.push("null");
  } else if (type === 'function') {
    return;
  } else if (type === 'boolean') {
    buf.push('' + obj);
  } else if (type === 'number') {
    if (isNaN(obj)) {
      buf.push('null');
    } else {
      buf.push('' + obj);
    }
  } else if (type === 'string') {
    return buf.push(angular['String']['quoteUnicode'](obj));
  } else if (type === 'object') {
    if (obj instanceof Array) {
      buf.push("[");
      var len = obj.length;
      var sep = false;
      for(var i=0; i<len; i++) {
        var item = obj[i];
        if (sep) buf.push(",");
        if (typeof item == 'function' || typeof item == 'undefined') {
          buf.push("null");
        } else {
          toJsonArray(buf, item, pretty, stack);
        }
        sep = true;
      }
      buf.push("]");
    } else if (obj instanceof Date) {
      buf.push(angular['String']['quoteUnicode'](angular['Date']['toString'](obj)));
    } else {
      buf.push("{");
      if (pretty) buf.push(pretty);
      var comma = false;
      var childPretty = pretty ? pretty + "  " : false;
      var keys = [];
      for(var k in obj) {
        if (k.indexOf('$$') === 0)
          continue;
        keys.push(k);
      }
      keys.sort();
      for ( var keyIndex = 0; keyIndex < keys.length; keyIndex++) {
        var key = keys[keyIndex];
        try {
          var value = obj[key];
          if (typeof value != 'function') {
            if (comma) {
              buf.push(",");
              if (pretty) buf.push(pretty);
            }
            buf.push(angular['String']['quote'](key));
            buf.push(":");
            toJsonArray(buf, value, childPretty, stack);
            comma = true;
          }
        } catch (e) {
        }
      }
      buf.push("}");
    }
  }
  if (typeof obj == "object") {
    stack.pop();
  }
}
/**
 * Template provides directions an how to bind to a given element.
 * It contains a list of init functions which need to be called to
 * bind to a new instance of elements. It also provides a list
 * of child paths which contain child templates
 */
function Template() {
  this.paths = [];
  this.children = [];
  this.inits = [];
}

Template.prototype = {
  init: function(element, scope) {
    element = jqLite(element);
    foreach(this.inits, function(fn) {
      scope.$tryEval(fn, element, element);
    });

    var i,
        childNodes = element[0].childNodes,
        children = this.children,
        paths = this.paths,
        length = paths.length;
    for (i = 0; i < length; i++) {
      children[i].init(childNodes[paths[i]], scope);
    }
  },


  addInit:function(init) {
    if (init) {
      this.inits.push(init);
    }
  },


  addChild: function(index, template) {
    if (template) {
      this.paths.push(index);
      this.children.push(template);
    }
  },

  empty: function() {
    return this.inits.length === 0 && this.paths.length === 0;
  }
};

///////////////////////////////////
//Compiler
//////////////////////////////////
function Compiler(textMarkup, attrMarkup, directives, widgets){
  this.textMarkup = textMarkup;
  this.attrMarkup = attrMarkup;
  this.directives = directives;
  this.widgets = widgets;
}

Compiler.prototype = {
  compile: function(rawElement) {
    rawElement = jqLite(rawElement);
    var template = this.templatize(rawElement) || new Template();
    return function(element, parentScope){
      element = jqLite(element);
      var scope = parentScope && parentScope.$eval ?
          parentScope :
          createScope(parentScope || {}, angularService);
      return extend(scope, {
        $element:element,
        $init: function() {
          template.init(element, scope);
          scope.$eval();
          delete scope.$init;
          return scope;
        }
      });
    };
  },

  templatize: function(element){
    var self = this,
        widget,
        directiveFns = self.directives,
        descend = true,
        directives = true,
        template = new Template(),
        selfApi = {
          compile: bind(self, self.compile),
          comment:function(text) {return jqLite(document.createComment(text));},
          element:function(type) {return jqLite(document.createElement(type));},
          text:function(text) {return jqLite(document.createTextNode(text));},
          descend: function(value){ if(isDefined(value)) descend = value; return descend;},
          directives: function(value){ if(isDefined(value)) directives = value; return directives;}
        };

    eachAttribute(element, function(value, name){
      if (!widget) {
        if (widget = self.widgets['@' + name]) {
          widget = bind(selfApi, widget, value, element);
        }
      }
    });
    if (!widget) {
      if (widget = self.widgets[nodeName(element)]) {
        widget = bind(selfApi, widget, element);
      }
    }
    if (widget) {
      descend = false;
      directives = false;
      template.addInit(widget.call(selfApi, element));
    }
    if (descend){
      // process markup for text nodes only
      eachTextNode(element, function(textNode){
        var text = textNode.text();
        foreach(self.textMarkup, function(markup){
          markup.call(selfApi, text, textNode, element);
        });
      });
    }

    if (directives) {
      // Process attributes/directives
      eachAttribute(element, function(value, name){
        foreach(self.attrMarkup, function(markup){
          markup.call(selfApi, value, name, element);
        });
      });
      eachAttribute(element, function(value, name){
        template.addInit((directiveFns[name]||noop).call(selfApi, value, element));
      });
    }
    // Process non text child nodes
    if (descend) {
      eachNode(element, function(child, i){
        template.addChild(i, self.templatize(child));
      });
    }
    return template.empty() ? null : template;
  }
};

function eachTextNode(element, fn){
  var i, chldNodes = element[0].childNodes || [], chld;
  for (i = 0; i < chldNodes.length; i++) {
    if(isTextNode(chld = chldNodes[i])) {
      fn(jqLite(chld), i);
    }
  }
}

function eachNode(element, fn){
  var i, chldNodes = element[0].childNodes || [], chld;
  for (i = 0; i < chldNodes.length; i++) {
    if(!isTextNode(chld = chldNodes[i])) {
      fn(jqLite(chld), i);
    }
  }
}

function eachAttribute(element, fn){
  var i, attrs = element[0].attributes || [], chld, attr, attrValue = {};
  for (i = 0; i < attrs.length; i++) {
    attr = attrs[i];
    attrValue[attr.name] = attr.value;
  }
  foreachSorted(attrValue, fn);
}

function getter(instance, path, unboundFn) {
  if (!path) return instance;
  var element = path.split('.');
  var key;
  var lastInstance = instance;
  var len = element.length;
  for ( var i = 0; i < len; i++) {
    key = element[i];
    if (!key.match(/^[\$\w][\$\w\d]*$/))
        throw "Expression '" + path + "' is not a valid expression for accesing variables.";
    if (instance) {
      lastInstance = instance;
      instance = instance[key];
    }
    if (isUndefined(instance)  && key.charAt(0) == '$') {
      var type = angular['Global']['typeOf'](lastInstance);
      type = angular[type.charAt(0).toUpperCase()+type.substring(1)];
      var fn = type ? type[[key.substring(1)]] : undefined;
      if (fn) {
        instance = bind(lastInstance, fn, lastInstance);
        return instance;
      }
    }
  }
  if (!unboundFn && isFunction(instance) && !instance['$$factory']) {
    return bind(lastInstance, instance);
  }
  return instance;
}

function setter(instance, path, value){
  var element = path.split('.');
  for ( var i = 0; element.length > 1; i++) {
    var key = element.shift();
    var newInstance = instance[key];
    if (!newInstance) {
      newInstance = {};
      instance[key] = newInstance;
    }
    instance = newInstance;
  }
  instance[element.shift()] = value;
  return value;
}

var compileCache = {};
function expressionCompile(exp){
  if (isFunction(exp)) return exp;
  var expFn = compileCache[exp];
  if (!expFn) {
    var parser = new Parser(exp);
    expFn = parser.statements();
    parser.assertAllConsumed();
    compileCache[exp] = expFn;
  }
  return parserNewScopeAdapter(expFn);
}

// return expFn
// TODO(remove this hack)
function parserNewScopeAdapter(fn) {
  return function(){
    return fn({
      state: this,
      scope: {
        set: this.$set,
        get: this.$get
      }
    });
  };
}

function rethrow(e) { throw e; }
function errorHandlerFor(element, error) {
  elementError(element, NG_EXCEPTION, isDefined(error) ? toJson(error) : error);
}

var scopeId = 0;
function createScope(parent, services, existing) {
  function Parent(){}
  function API(){}
  function Behavior(){}

  var instance, behavior, api, evalLists = {}, servicesCache = extend({}, existing);

  parent = Parent.prototype = (parent || {});
  api = API.prototype = new Parent();
  behavior = Behavior.prototype = new API();
  instance = new Behavior();

  extend(api, {
    'this': instance,
    $id: (scopeId++),
    $parent: parent,
    $bind: bind(instance, bind, instance),
    $get: bind(instance, getter, instance),
    $set: bind(instance, setter, instance),

    $eval: function $eval(exp) {
      if (isDefined(exp)) {
        return expressionCompile(exp).apply(instance, slice.call(arguments, 1, arguments.length));
      } else {
        foreachSorted(evalLists, function(list) {
          foreach(list, function(eval) {
            instance.$tryEval(eval.fn, eval.handler);
          });
        });
      }
    },

    $tryEval: function (expression, exceptionHandler) {
      try {
        return expressionCompile(expression).apply(instance, slice.call(arguments, 2, arguments.length));
      } catch (e) {
        error(e);
        if (isFunction(exceptionHandler)) {
          exceptionHandler(e);
        } else if (exceptionHandler) {
          errorHandlerFor(exceptionHandler, e);
        }
      }
    },

    $watch: function(watchExp, listener, exceptionHandler) {
      var watch = expressionCompile(watchExp),
          last;
      function watcher(){
        var value = watch.call(instance);
        if (last !== value) {
          instance.$tryEval(listener, exceptionHandler, value, last);
          last = value;
        }
      }
      instance.$onEval(PRIORITY_WATCH, watcher);
      watcher();
    },

    $onEval: function(priority, expr, exceptionHandler){
      if (!isNumber(priority)) {
        exceptionHandler = expr;
        expr = priority;
        priority = 0;
      }
      var evalList = evalLists[priority] || (evalLists[priority] = []);
      evalList.push({
        fn: expressionCompile(expr),
        handler: exceptionHandler
      });
    },

    $become: function(Class) {
      // remove existing
      foreach(behavior, function(value, key){ delete behavior[key]; });
      foreach((Class || noop).prototype, function(fn, name){
        behavior[name] = bind(instance, fn);
      });
      (Class || noop).call(instance);
    }

  });

  if (!parent.$root) {
    api.$root = instance;
    api.$parent = instance;
  }

  function inject(name){
    var service = getter(servicesCache, name), factory, args = [];
    if (isUndefined(service)) {
      factory = services[name];
      if (!isFunction(factory))
        throw "Don't know how to inject '" + name + "'.";
      foreach(factory.inject, function(dependency){
        args.push(inject(dependency));
      });
      setter(servicesCache, name, service = factory.apply(instance, args));
    }
    return service;
  }

  foreach(services, function(_, name){
    var service = inject(name);
    if (service) {
      instance[name] = service;
    }
  });

  return instance;
}
function Lexer(text, parsStrings){
  this.text = text;
  // UTC dates have 20 characters, we send them through parser
  this.dateParseLength = parsStrings ? 20 : -1;
  this.tokens = [];
  this.index = 0;
}

Lexer.OPERATORS = {
    'null':function(self){return null;},
    'true':function(self){return true;},
    'false':function(self){return false;},
    'undefined':noop,
    '+':function(self, a,b){return (isDefined(a)?a:0)+(isDefined(b)?b:0);},
    '-':function(self, a,b){return (isDefined(a)?a:0)-(isDefined(b)?b:0);},
    '*':function(self, a,b){return a*b;},
    '/':function(self, a,b){return a/b;},
    '%':function(self, a,b){return a%b;},
    '^':function(self, a,b){return a^b;},
    '=':function(self, a,b){return self.scope.set(a, b);},
    '==':function(self, a,b){return a==b;},
    '!=':function(self, a,b){return a!=b;},
    '<':function(self, a,b){return a<b;},
    '>':function(self, a,b){return a>b;},
    '<=':function(self, a,b){return a<=b;},
    '>=':function(self, a,b){return a>=b;},
    '&&':function(self, a,b){return a&&b;},
    '||':function(self, a,b){return a||b;},
    '&':function(self, a,b){return a&b;},
//    '|':function(self, a,b){return a|b;},
    '|':function(self, a,b){return b(self, a);},
    '!':function(self, a){return !a;}
};
Lexer.ESCAPE = {"n":"\n", "f":"\f", "r":"\r", "t":"\t", "v":"\v", "'":"'", '"':'"'};

Lexer.prototype = {
  peek: function() {
    if (this.index + 1 < this.text.length) {
      return this.text.charAt(this.index + 1);
    } else {
      return false;
    }
  },

  parse: function() {
    var tokens = this.tokens;
    var OPERATORS = Lexer.OPERATORS;
    var canStartRegExp = true;
    while (this.index < this.text.length) {
      var ch = this.text.charAt(this.index);
      if (ch == '"' || ch == "'") {
        this.readString(ch);
        canStartRegExp = true;
      } else if (ch == '(' || ch == '[') {
        tokens.push({index:this.index, text:ch});
        this.index++;
      } else if (ch == '{' ) {
        var peekCh = this.peek();
        if (peekCh == ':' || peekCh == '(') {
          tokens.push({index:this.index, text:ch + peekCh});
          this.index++;
        } else {
          tokens.push({index:this.index, text:ch});
        }
        this.index++;
        canStartRegExp = true;
      } else if (ch == ')' || ch == ']' || ch == '}' ) {
        tokens.push({index:this.index, text:ch});
        this.index++;
        canStartRegExp = false;
      } else if ( ch == ':' || ch == '.' || ch == ',' || ch == ';') {
        tokens.push({index:this.index, text:ch});
        this.index++;
        canStartRegExp = true;
      } else if ( canStartRegExp && ch == '/' ) {
        this.readRegexp();
        canStartRegExp = false;
      } else if ( this.isNumber(ch) ) {
        this.readNumber();
        canStartRegExp = false;
      } else if (this.isIdent(ch)) {
        this.readIdent();
        canStartRegExp = false;
      } else if (this.isWhitespace(ch)) {
        this.index++;
      } else {
        var ch2 = ch + this.peek();
        var fn = OPERATORS[ch];
        var fn2 = OPERATORS[ch2];
        if (fn2) {
          tokens.push({index:this.index, text:ch2, fn:fn2});
          this.index += 2;
        } else if (fn) {
          tokens.push({index:this.index, text:ch, fn:fn});
          this.index += 1;
        } else {
          throw "Lexer Error: Unexpected next character [" +
              this.text.substring(this.index) +
              "] in expression '" + this.text +
              "' at column '" + (this.index+1) + "'.";
        }
        canStartRegExp = true;
      }
    }
    return tokens;
  },

  isNumber: function(ch) {
    return '0' <= ch && ch <= '9';
  },

  isWhitespace: function(ch) {
    return ch == ' ' || ch == '\r' || ch == '\t' ||
           ch == '\n' || ch == '\v';
  },

  isIdent: function(ch) {
    return 'a' <= ch && ch <= 'z' ||
           'A' <= ch && ch <= 'Z' ||
           '_' == ch || ch == '$';
  },

  readNumber: function() {
    var number = "";
    var start = this.index;
    while (this.index < this.text.length) {
      var ch = this.text.charAt(this.index);
      if (ch == '.' || this.isNumber(ch)) {
        number += ch;
      } else {
        break;
      }
      this.index++;
    }
    number = 1 * number;
    this.tokens.push({index:start, text:number,
      fn:function(){return number;}});
  },

  readIdent: function() {
    var ident = "";
    var start = this.index;
    while (this.index < this.text.length) {
      var ch = this.text.charAt(this.index);
      if (ch == '.' || this.isIdent(ch) || this.isNumber(ch)) {
        ident += ch;
      } else {
        break;
      }
      this.index++;
    }
    var fn = Lexer.OPERATORS[ident];
    if (!fn) {
      fn = function(self){
        return self.scope.get(ident);
      };
      fn.isAssignable = ident;
    }
    this.tokens.push({index:start, text:ident, fn:fn});
  },

  readString: function(quote) {
    var start = this.index;
    var dateParseLength = this.dateParseLength;
    this.index++;
    var string = "";
    var rawString = quote;
    var escape = false;
    while (this.index < this.text.length) {
      var ch = this.text.charAt(this.index);
      rawString += ch;
      if (escape) {
        if (ch == 'u') {
          var hex = this.text.substring(this.index + 1, this.index + 5);
          this.index += 4;
          string += String.fromCharCode(parseInt(hex, 16));
        } else {
          var rep = Lexer.ESCAPE[ch];
          if (rep) {
            string += rep;
          } else {
            string += ch;
          }
        }
        escape = false;
      } else if (ch == '\\') {
        escape = true;
      } else if (ch == quote) {
        this.index++;
        this.tokens.push({index:start, text:rawString, string:string,
          fn:function(){
            return (string.length == dateParseLength) ?
              angular['String']['toDate'](string) : string;
          }});
        return;
      } else {
        string += ch;
      }
      this.index++;
    }
    throw "Lexer Error: Unterminated quote [" +
        this.text.substring(start) + "] starting at column '" +
        (start+1) + "' in expression '" + this.text + "'.";
  },

  readRegexp: function(quote) {
    var start = this.index;
    this.index++;
    var regexp = "";
    var escape = false;
    while (this.index < this.text.length) {
      var ch = this.text.charAt(this.index);
      if (escape) {
        regexp += ch;
        escape = false;
      } else if (ch === '\\') {
        regexp += ch;
        escape = true;
      } else if (ch === '/') {
        this.index++;
        var flags = "";
        if (this.isIdent(this.text.charAt(this.index))) {
          this.readIdent();
          flags = this.tokens.pop().text;
        }
        var compiledRegexp = new RegExp(regexp, flags);
        this.tokens.push({index:start, text:regexp, flags:flags,
          fn:function(){return compiledRegexp;}});
        return;
      } else {
        regexp += ch;
      }
      this.index++;
    }
    throw "Lexer Error: Unterminated RegExp [" +
        this.text.substring(start) + "] starting at column '" +
        (start+1) + "' in expression '" + this.text + "'.";
  }
};

/////////////////////////////////////////

function Parser(text, parseStrings){
  this.text = text;
  this.tokens = new Lexer(text, parseStrings).parse();
  this.index = 0;
}

Parser.ZERO = function(){
  return 0;
};

Parser.prototype = {
  error: function(msg, token) {
    throw "Token '" + token.text +
      "' is " + msg + " at column='" +
      (token.index + 1) + "' of expression '" +
      this.text + "' starting at '" + this.text.substring(token.index) + "'.";
  },

  peekToken: function() {
    if (this.tokens.length === 0)
      throw "Unexpected end of expression: " + this.text;
    return this.tokens[0];
  },

  peek: function(e1, e2, e3, e4) {
    var tokens = this.tokens;
    if (tokens.length > 0) {
      var token = tokens[0];
      var t = token.text;
      if (t==e1 || t==e2 || t==e3 || t==e4 ||
          (!e1 && !e2 && !e3 && !e4)) {
        return token;
      }
    }
    return false;
  },

  expect: function(e1, e2, e3, e4){
    var token = this.peek(e1, e2, e3, e4);
    if (token) {
      this.tokens.shift();
      this.currentToken = token;
      return token;
    }
    return false;
  },

  consume: function(e1){
    if (!this.expect(e1)) {
      var token = this.peek();
      throw "Expecting '" + e1 + "' at column '" +
          (token.index+1) + "' in '" +
          this.text + "' got '" +
          this.text.substring(token.index) + "'.";
    }
  },

  _unary: function(fn, right) {
    return function(self) {
      return fn(self, right(self));
    };
  },

  _binary: function(left, fn, right) {
    return function(self) {
      return fn(self, left(self), right(self));
    };
  },

  hasTokens: function () {
    return this.tokens.length > 0;
  },

  assertAllConsumed: function(){
    if (this.tokens.length !== 0) {
      throw "Did not understand '" + this.text.substring(this.tokens[0].index) +
          "' while evaluating '" + this.text + "'.";
    }
  },

  statements: function(){
    var statements = [];
    while(true) {
      if (this.tokens.length > 0 && !this.peek('}', ')', ';', ']'))
        statements.push(this.filterChain());
      if (!this.expect(';')) {
        return function (self){
          var value;
          for ( var i = 0; i < statements.length; i++) {
            var statement = statements[i];
            if (statement)
              value = statement(self);
          }
          return value;
        };
      }
    }
  },

  filterChain: function(){
    var left = this.expression();
    var token;
    while(true) {
      if ((token = this.expect('|'))) {
        left = this._binary(left, token.fn, this.filter());
      } else {
        return left;
      }
    }
  },

  filter: function(){
    return this._pipeFunction(angularFilter);
  },

  validator: function(){
    return this._pipeFunction(angularValidator);
  },

  _pipeFunction: function(fnScope){
    var fn = this.functionIdent(fnScope);
    var argsFn = [];
    var token;
    while(true) {
      if ((token = this.expect(':'))) {
        argsFn.push(this.expression());
      } else {
        var fnInvoke = function(self, input){
          var args = [input];
          for ( var i = 0; i < argsFn.length; i++) {
            args.push(argsFn[i](self));
          }
          return fn.apply(self.state, args);
        };
        return function(){
          return fnInvoke;
        };
      }
    }
  },

  expression: function(){
    return this.throwStmt();
  },

  throwStmt: function(){
    if (this.expect('throw')) {
      var throwExp = this.assignment();
      return function (self) {
        throw throwExp(self);
      };
    } else {
     return this.assignment();
    }
  },

  assignment: function(){
    var left = this.logicalOR();
    var token;
    if (token = this.expect('=')) {
      if (!left.isAssignable) {
        throw "Left hand side '" +
            this.text.substring(0, token.index) + "' of assignment '" +
            this.text.substring(token.index) + "' is not assignable.";
      }
      var ident = function(){return left.isAssignable;};
      return this._binary(ident, token.fn, this.logicalOR());
    } else {
     return left;
    }
  },

  logicalOR: function(){
    var left = this.logicalAND();
    var token;
    while(true) {
      if ((token = this.expect('||'))) {
        left = this._binary(left, token.fn, this.logicalAND());
      } else {
        return left;
      }
    }
  },

  logicalAND: function(){
    var left = this.equality();
    var token;
    if ((token = this.expect('&&'))) {
      left = this._binary(left, token.fn, this.logicalAND());
    }
    return left;
  },

  equality: function(){
    var left = this.relational();
    var token;
    if ((token = this.expect('==','!='))) {
      left = this._binary(left, token.fn, this.equality());
    }
    return left;
  },

  relational: function(){
    var left = this.additive();
    var token;
    if (token = this.expect('<', '>', '<=', '>=')) {
      left = this._binary(left, token.fn, this.relational());
    }
    return left;
  },

  additive: function(){
    var left = this.multiplicative();
    var token;
    while(token = this.expect('+','-')) {
      left = this._binary(left, token.fn, this.multiplicative());
    }
    return left;
  },

  multiplicative: function(){
    var left = this.unary();
    var token;
    while(token = this.expect('*','/','%')) {
        left = this._binary(left, token.fn, this.unary());
    }
    return left;
  },

  unary: function(){
    var token;
    if (this.expect('+')) {
      return this.primary();
    } else if (token = this.expect('-')) {
      return this._binary(Parser.ZERO, token.fn, this.unary());
    } else if (token = this.expect('!')) {
      return this._unary(token.fn, this.unary());
    } else {
     return this.primary();
    }
  },

  functionIdent: function(fnScope) {
    var token = this.expect();
    var element = token.text.split('.');
    var instance = fnScope;
    var key;
    for ( var i = 0; i < element.length; i++) {
      key = element[i];
      if (instance)
        instance = instance[key];
    }
    if (typeof instance != 'function') {
      throw "Function '" + token.text + "' at column '" +
      (token.index+1)  + "' in '" + this.text + "' is not defined.";
    }
    return instance;
  },

  primary: function() {
    var primary;
    if (this.expect('(')) {
      var expression = this.filterChain();
      this.consume(')');
      primary = expression;
    } else if (this.expect('[')) {
      primary = this.arrayDeclaration();
    } else if (this.expect('{')) {
      primary = this.object();
    } else if (this.expect('{:')) {
      primary = this.closure(false);
    } else if (this.expect('{(')) {
      primary = this.closure(true);
    } else {
      var token = this.expect();
      primary = token.fn;
      if (!primary) {
        this.error("not a primary expression", token);
      }
    }
    var next;
    while (next = this.expect('(', '[', '.')) {
      if (next.text === '(') {
        primary = this.functionCall(primary);
      } else if (next.text === '[') {
        primary = this.objectIndex(primary);
      } else if (next.text === '.') {
        primary = this.fieldAccess(primary);
      } else {
        throw "IMPOSSIBLE";
      }
    }
    return primary;
  },

  closure: function(hasArgs) {
    var args = [];
    if (hasArgs) {
      if (!this.expect(')')) {
        args.push(this.expect().text);
        while(this.expect(',')) {
          args.push(this.expect().text);
        }
        this.consume(')');
      }
      this.consume(":");
    }
    var statements = this.statements();
    this.consume("}");
    return function(self) {
      return function($){
        var scope = createScope(self.state);
        scope['$'] = $;
        for ( var i = 0; i < args.length; i++) {
          scope.$set(args[i], arguments[i]);
        }
        return statements({scope:{get:scope.$get, set:scope.$set}});
      };
    };
  },

  fieldAccess: function(object) {
    var field = this.expect().text;
    var fn = function (self){
      return getter(object(self), field);
    };
    fn.isAssignable = field;
    return fn;
  },

  objectIndex: function(obj) {
    var indexFn = this.expression();
    this.consume(']');
    if (this.expect('=')) {
      var rhs = this.expression();
      return function (self){
        return obj(self)[indexFn(self)] = rhs(self);
      };
    } else {
      return function (self){
        var o = obj(self);
        var i = indexFn(self);
        return (o) ? o[i] : undefined;
      };
    }
  },

  functionCall: function(fn) {
    var argsFn = [];
    if (this.peekToken().text != ')') {
      do {
        argsFn.push(this.expression());
      } while (this.expect(','));
    }
    this.consume(')');
    return function (self){
      var args = [];
      for ( var i = 0; i < argsFn.length; i++) {
        args.push(argsFn[i](self));
      }
      var fnPtr = fn(self);
      if (typeof fnPtr === 'function') {
        return fnPtr.apply(self, args);
      } else {
        throw "Expression '" + fn.isAssignable + "' is not a function.";
      }
    };
  },

  // This is used with json array declaration
  arrayDeclaration: function () {
    var elementFns = [];
    if (this.peekToken().text != ']') {
      do {
        elementFns.push(this.expression());
      } while (this.expect(','));
    }
    this.consume(']');
    return function (self){
      var array = [];
      for ( var i = 0; i < elementFns.length; i++) {
        array.push(elementFns[i](self));
      }
      return array;
    };
  },

  object: function () {
    var keyValues = [];
    if (this.peekToken().text != '}') {
      do {
        var token = this.expect(),
            key = token.string || token.text;
        this.consume(":");
        var value = this.expression();
        keyValues.push({key:key, value:value});
      } while (this.expect(','));
    }
    this.consume('}');
    return function (self){
      var object = {};
      for ( var i = 0; i < keyValues.length; i++) {
        var keyValue = keyValues[i];
        var value = keyValue.value(self);
        object[keyValue.key] = value;
      }
      return object;
    };
  },

  entityDeclaration: function () {
    var decl = [];
    while(this.hasTokens()) {
      decl.push(this.entityDecl());
      if (!this.expect(';')) {
        this.assertAllConsumed();
      }
    }
    return function (self){
      var code = "";
      for ( var i = 0; i < decl.length; i++) {
        code += decl[i](self);
      }
      return code;
    };
  },

  entityDecl: function () {
    var entity = this.expect().text;
    var instance;
    var defaults;
    if (this.expect('=')) {
      instance = entity;
      entity = this.expect().text;
    }
    if (this.expect(':')) {
      defaults = this.primary()(null);
    }
    return function(self) {
      var Entity = self.datastore.entity(entity, defaults);
      self.scope.set(entity, Entity);
      if (instance) {
        var document = Entity();
        document['$$anchor'] = instance;
        self.scope.set(instance, document);
        return "$anchor." + instance + ":{" +
            instance + "=" + entity + ".load($anchor." + instance + ");" +
            instance + ".$$anchor=" + angular['String']['quote'](instance) + ";" +
          "};";
      } else {
        return "";
      }
    };
  },

  watch: function () {
    var decl = [];
    while(this.hasTokens()) {
      decl.push(this.watchDecl());
      if (!this.expect(';')) {
        this.assertAllConsumed();
      }
    }
    this.assertAllConsumed();
    return function (self){
      for ( var i = 0; i < decl.length; i++) {
        var d = decl[i](self);
        self.addListener(d.name, d.fn);
      }
    };
  },

  watchDecl: function () {
    var anchorName = this.expect().text;
    this.consume(":");
    var expression;
    if (this.peekToken().text == '{') {
      this.consume("{");
      expression = this.statements();
      this.consume("}");
    } else {
      expression = this.expression();
    }
    return function(self) {
      return {name:anchorName, fn:expression};
    };
  }
};

function Route(template, defaults) {
  this.template = template = template + '#';
  this.defaults = defaults || {};
  var urlParams = this.urlParams = {};
  foreach(template.split(/\W/), function(param){
    if (param && template.match(new RegExp(":" + param + "\\W"))) {
      urlParams[param] = true;
    }
  });
}

Route.prototype = {
  url: function(params) {
    var path = [];
    var self = this;
    var url = this.template;
    params = params || {};
    foreach(this.urlParams, function(_, urlParam){
      var value = params[urlParam] || self.defaults[urlParam] || "";
      url = url.replace(new RegExp(":" + urlParam + "(\\W)"), value + "$1");
    });
    url = url.replace(/\/?#$/, '');
    var query = [];
    foreach(params, function(value, key){
      if (!self.urlParams[key]) {
        query.push(encodeURI(key) + '=' + encodeURI(value));
      }
    });
    return url + (query.length ? '?' + query.join('&') : '');
  }
};

function ResourceFactory(xhr) {
  this.xhr = xhr;
}

ResourceFactory.DEFAULT_ACTIONS = {
  'get':    {method:'GET'},
  'save':   {method:'POST'},
  'query':  {method:'GET', isArray:true},
  'remove': {method:'DELETE'},
  'delete': {method:'DELETE'}
};

ResourceFactory.prototype = {
  route: function(url, paramDefaults, actions){
    var self = this;
    var route = new Route(url);
    actions = extend({}, ResourceFactory.DEFAULT_ACTIONS, actions);
    function extractParams(data){
      var ids = {};
      foreach(paramDefaults || {}, function(value, key){
        ids[key] = value.charAt && value.charAt(0) == '@' ? getter(data, value.substr(1)) : value;
      });
      return ids;
    }

    function Resource(value){
      copy(value || {}, this);
    }

    foreach(actions, function(action, name){
      var isGet = action.method == 'GET';
      var isPost = action.method == 'POST';
      Resource[name] = function (a1, a2, a3) {
        var params = {};
        var data;
        var callback = noop;
        switch(arguments.length) {
        case 3: callback = a3;
        case 2:
          if (typeof a2 == 'function') {
            callback = a2;
          } else {
            params = a1;
            data = a2;
            break;
          }
        case 1: if (isPost) data = a1; else params = a1; break;
        case 0: break;
        default:
          throw "Expected between 0-3 arguments [params, data, callback], got " + arguments.length + " arguments.";
        }

        var value = action.isArray ? [] : new Resource(data);
        self.xhr(action.method, route.url(extend({}, action.params || {}, extractParams(data), params)), data, function(response) {
          if (action.isArray) {
            foreach(response, function(item){
              value.push(new Resource(item));
            });
          } else {
            copy(response, value);
          }
          (callback||noop)(value);
        });
        return value;
      };

      Resource.bind = function(additionalParamDefaults){
        return self.route(url, extend({}, paramDefaults, additionalParamDefaults), actions);
      };

      if (!isGet) {
        Resource.prototype['$' + name] = function(a1, a2){
          var params = {};
          var callback = noop;
          switch(arguments.length) {
          case 2: params = a1; callback = a2;
          case 1: if (typeof a1 == 'function') callback = a1; else params = a1;
          case 0: break;
          default:
            throw "Expected between 1-3 arguments [params, data, callback], got " + arguments.length + " arguments.";
          }
          var self = this;
          Resource[name](params, this, function(response){
            copy(response, self);
            callback(self);
          });
        };
      }
    });
    return Resource;
  }
};


//////////////////////////////
// Browser
//////////////////////////////

function Browser(location, document) {
  this.delay = 25;
  this.expectedUrl = location.href;
  this.urlListeners = [];
  this.hoverListener = noop;

  this.XHR = XMLHttpRequest || function () {
    try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e1) {}
    try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e2) {}
    try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e3) {}
    throw new Error("This browser does not support XMLHttpRequest.");
  };
  this.setTimeout = function(fn, delay) {
   window.setTimeout(fn, delay);
  };

  this.location = location;
  this.document = jqLite(document);
  this.body = jqLite(document.body);
}

Browser.prototype = {

  bind: function() {
    var self = this;
    self.document.bind("mouseover", function(event){
      self.hoverListener(jqLite(event.target), true);
      return true;
    });
    self.document.bind("mouseleave mouseout click dblclick keypress keyup", function(event){
      self.hoverListener(jqLite(event.target), false);
      return true;
    });
  },

  hover: function(hoverListener) {
    this.hoverListener = hoverListener;
  },

  addCss: function(url) {
    var head = jqLite(this.document[0].getElementsByTagName('head')[0]),
        link = jqLite('<link rel="stylesheet" type="text/css"></link>');
    link.attr('href', url);
    head.append(link);
  },

  xhr: function(method, url, callback){
    var xhr = new this.XHR();
    xhr.open(method, url, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        callback(xhr.status, xhr.responseText);
      }
    };
    xhr.send('');
  },

  watchUrl: function(fn){
    this.urlListeners.push(fn);
  },

  startUrlWatcher: function() {
   var self = this;
   (function pull () {
     if (self.expectedUrl !== self.location.href) {
       foreach(self.urlListeners, function(listener){
         try {
           listener(self.location.href);
         } catch (e) {
           error(e);
         }
       });
       self.expectedUrl = self.location.href;
     }
     self.setTimeout(pull, self.delay);
   })();
  },

  setUrl: function(url) {
   var existingURL = this.location.href;
   if (!existingURL.match(/#/))
     existingURL += '#';
   if (existingURL != url)
     this.location.href = url;
  },

  getUrl: function() {
   return this.location.href;
  }
};
//////////////////////////////////
//JQLite
//////////////////////////////////

var jqCache = {};
var jqName = 'ng-' + new Date().getTime();
var jqId = 1;
function jqNextId() { return (jqId++); }

var addEventListener = window.document.attachEvent ?
    function(element, type, fn) {
      element.attachEvent('on' + type, fn);
    } : function(element, type, fn) {
      element.addEventListener(type, fn, false);
    };

var removeEventListener = window.document.detachEvent ?
    function(element, type, fn) {
      element.detachEvent('on' + type, fn);
    } : function(element, type, fn) {
      element.removeEventListener(type, fn, false);
    };

function jqClearData(element) {
  var cacheId = element[jqName],
      cache = jqCache[cacheId];
  if (cache) {
    foreach(cache.bind || {}, function(fn, type){
      removeEventListener(element, type, fn);
    });
    delete jqCache[cacheId];
    delete element[jqName];
  }
}

function JQLite(element) {
  if (element.length && element.item) {
    for(var i=0; i < element.length; i++) {
      this[i] = element[i];
    }
    this.length = element.length;
  } else {
    this[0] = element;
    this.length = 1;
  }
}

JQLite.prototype = {
  data: function(key, value) {
    var element = this[0],
        cacheId = element[jqName],
        cache = jqCache[cacheId || -1];
    if (isDefined(value)) {
      if (!cache) {
        element[jqName] = cacheId = jqNextId();
        cache = jqCache[cacheId] = {};
      }
      cache[key] = value;
    } else {
      return cache ? cache[key] : null;
    }
  },

  removeData: function(){
    jqClearData(this[0]);
  },

  dealoc: function(){
    (function dealoc(element){
      jqClearData(element);
      for ( var i = 0, children = element.childNodes; i < children.length; i++) {
        dealoc(children[i]);
      }
    })(this[0]);
  },

  bind: function(type, fn){
    var self = this,
        element = self[0],
        bind = self.data('bind'),
        eventHandler;
    if (!bind) this.data('bind', bind = {});
    foreach(type.split(' '), function(type){
      eventHandler = bind[type];
      if (!eventHandler) {
        bind[type] = eventHandler = function(event) {
          var bubbleEvent = false;
          foreach(eventHandler.fns, function(fn){
            bubbleEvent = bubbleEvent || fn.call(self, event);
          });
          if (!bubbleEvent) {
            event.preventDefault();
            event.stopPropagation();
          }
        };
        eventHandler.fns = [];
        addEventListener(element, type, eventHandler);
      }
      eventHandler.fns.push(fn);
    });
  },

  //TODO: remove
  trigger: function(type) {
    var evnt = document.createEvent('MouseEvent');
    evnt.initMouseEvent(type, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    this[0].dispatchEvent(evnt);
  },

  click: function(fn) {
    if (fn)
      this.bind('click', fn);
    else
      this.trigger('click');
  },

  replaceWith: function(replaceNode) {
    this[0].parentNode.replaceChild(jqLite(replaceNode)[0], this[0]);
  },

  append: function(node) {
    var self = this[0];
    node = jqLite(node);
    foreach(node, function(child){
      self.appendChild(child);
    });
  },

  remove: function() {
    this.dealoc();
    var parentNode = this[0].parentNode;
    if (parentNode) parentNode.removeChild(this[0]);
  },

  removeAttr: function(name) {
    this[0].removeAttribute(name);
  },

  after: function(element) {
    this[0].parentNode.insertBefore(jqLite(element)[0], this[0].nextSibling);
  },

  hasClass: function(selector) {
    var className = " " + selector + " ";
    if ( (" " + this[0].className + " ").replace(/[\n\t]/g, " ").indexOf( className ) > -1 ) {
      return true;
    }
    return false;
  },

  removeClass: function(selector) {
    this[0].className = trim((" " + this[0].className + " ").replace(/[\n\t]/g, " ").replace(" " + selector + " ", ""));
  },

  toggleClass: function(selector, condition) {
   var self = this;
   (condition ? self.addClass : self.removeClass).call(self, selector);
  },

  addClass: function( selector ) {
    if (!this.hasClass(selector)) {
      this[0].className = trim(this[0].className + ' ' + selector);
    }
  },

  css: function(name, value) {
    var style = this[0].style;
    if (isString(name)) {
      if (isDefined(value)) {
        style[name] = value;
      } else {
        return style[name];
      }
    } else {
      extend(style, name);
    }
  },

  attr: function(name, value){
    var e = this[0];
    if (isObject(name)) {
      foreach(name, function(value, name){
        e.setAttribute(name, value);
      });
    } else if (isDefined(value)) {
      e.setAttribute(name, value);
    } else {
      return e.getAttribute(name);
    }
  },

  text: function(value) {
    if (isDefined(value)) {
      this[0].textContent = value;
    }
    return this[0].textContent;
  },

  val: function(value) {
    if (isDefined(value)) {
      this[0].value = value;
    }
    return this[0].value;
  },

  html: function(value) {
    if (isDefined(value)) {
      for ( var i = 0, children = this[0].childNodes; i < children.length; i++) {
        jqLite(children[i]).dealoc();
      }
      this[0].innerHTML = value;
    }
    return this[0].innerHTML;
  },

  parent: function() { return jqLite(this[0].parentNode);},
  clone: function() { return jqLite(this[0].cloneNode(true)); }
};
var angularGlobal = {
  'typeOf':function(obj){
    if (obj === null) return "null";
    var type = typeof obj;
    if (type == "object") {
      if (obj instanceof Array) return "array";
      if (obj instanceof Date) return "date";
      if (obj.nodeType == 1) return "element";
    }
    return type;
  }
};

var angularCollection = {
  'size': size
};
var angularObject = {
  'extend': extend
};
var angularArray = {
  'indexOf': indexOf,
  'include': includes,
  'includeIf':function(array, value, condition) {
    var index = indexOf(array, value);
    if (condition) {
      if (index == -1)
        array.push(value);
    } else {
      array.splice(index, 1);
    }
    return array;
  },
  'sum':function(array, expression) {
    var fn = angular['Function']['compile'](expression);
    var sum = 0;
    for (var i = 0; i < array.length; i++) {
      var value = 1 * fn(array[i]);
      if (!isNaN(value)){
        sum += value;
      }
    }
    return sum;
  },
  'remove':function(array, value) {
    var index = indexOf(array, value);
    if (index >=0)
      array.splice(index, 1);
    return value;
  },
  'find':function(array, condition, defaultValue) {
    if (!condition) return undefined;
    var fn = angular['Function']['compile'](condition);
    foreach(array, function($){
      if (fn($)){
        defaultValue = $;
        return true;
      }
    });
    return defaultValue;
  },
  'findById':function(array, id) {
    return angular.Array.find(array, function($){return $.$id == id;}, null);
  },
  'filter':function(array, expression) {
    var predicates = [];
    predicates.check = function(value) {
      for (var j = 0; j < predicates.length; j++) {
        if(!predicates[j](value)) {
          return false;
        }
      }
      return true;
    };
    var search = function(obj, text){
      if (text.charAt(0) === '!') {
        return !search(obj, text.substr(1));
      }
      switch (typeof obj) {
      case "boolean":
      case "number":
      case "string":
        return ('' + obj).toLowerCase().indexOf(text) > -1;
      case "object":
        for ( var objKey in obj) {
          if (objKey.charAt(0) !== '$' && search(obj[objKey], text)) {
            return true;
          }
        }
        return false;
      case "array":
        for ( var i = 0; i < obj.length; i++) {
          if (search(obj[i], text)) {
            return true;
          }
        }
        return false;
      default:
        return false;
      }
    };
    switch (typeof expression) {
      case "boolean":
      case "number":
      case "string":
        expression = {$:expression};
      case "object":
        for (var key in expression) {
          if (key == '$') {
            (function(){
              var text = (''+expression[key]).toLowerCase();
              if (!text) return;
              predicates.push(function(value) {
                return search(value, text);
              });
            })();
          } else {
            (function(){
              var path = key;
              var text = (''+expression[key]).toLowerCase();
              if (!text) return;
              predicates.push(function(value) {
                return search(getter(value, path), text);
              });
            })();
          }
        }
        break;
      case "function":
        predicates.push(expression);
        break;
      default:
        return array;
    }
    var filtered = [];
    for ( var j = 0; j < array.length; j++) {
      var value = array[j];
      if (predicates.check(value)) {
        filtered.push(value);
      }
    }
    return filtered;
  },
  'add':function(array, value) {
    array.push(isUndefined(value)? {} : value);
    return array;
  },
  'count':function(array, condition) {
    if (!condition) return array.length;
    var fn = angular['Function']['compile'](condition), count = 0;
    foreach(array, function(value){
      if (fn(value)) {
        count ++;
      }
    });
    return count;
  },
  'orderBy':function(array, expression, descend) {
    function reverse(comp, descending) {
      return toBoolean(descending) ?
          function(a,b){return comp(b,a);} : comp;
    }
    function compare(v1, v2){
      var t1 = typeof v1;
      var t2 = typeof v2;
      if (t1 == t2) {
        if (t1 == "string") v1 = v1.toLowerCase();
        if (t1 == "string") v2 = v2.toLowerCase();
        if (v1 === v2) return 0;
        return v1 < v2 ? -1 : 1;
      } else {
        return t1 < t2 ? -1 : 1;
      }
    }
    expression = isArray(expression) ? expression: [expression];
    expression = map(expression, function($){
      var descending = false;
      if (typeof $ == "string" && ($.charAt(0) == '+' || $.charAt(0) == '-')) {
        descending = $.charAt(0) == '-';
        $ = $.substring(1);
      }
      var get = $ ? angular['Function']['compile']($) : identity;
      return reverse(function(a,b){
        return compare(get(a),get(b));
      }, descending);
    });
    var comparator = function(o1, o2){
      for ( var i = 0; i < expression.length; i++) {
        var comp = expression[i](o1, o2);
        if (comp !== 0) return comp;
      }
      return 0;
    };
    return copy(array).sort(reverse(comparator, descend));
  },
  'orderByToggle':function(predicate, attribute) {
    var STRIP = /^([+|-])?(.*)/;
    var ascending = false;
    var index = -1;
    foreach(predicate, function($, i){
      if (index == -1) {
        if ($ == attribute) {
          ascending = true;
          index = i;
          return true;
        }
        if (($.charAt(0)=='+'||$.charAt(0)=='-') && $.substring(1) == attribute) {
          ascending = $.charAt(0) == '+';
          index = i;
          return true;
        }
      }
    });
    if (index >= 0) {
      predicate.splice(index, 1);
    }
    predicate.unshift((ascending ? "-" : "+") + attribute);
    return predicate;
  },
  'orderByDirection':function(predicate, attribute, ascend, descend) {
    ascend = ascend || 'ng-ascend';
    descend = descend || 'ng-descend';
    var att = predicate[0] || '';
    var direction = true;
    if (att.charAt(0) == '-') {
      att = att.substring(1);
      direction = false;
    } else if(att.charAt(0) == '+') {
      att = att.substring(1);
    }
    return att == attribute ? (direction ? ascend : descend) : "";
  },
  'merge':function(array, index, mergeValue) {
    var value = array[index];
    if (!value) {
      value = {};
      array[index] = value;
    }
    merge(mergeValue, value);
    return array;
  }
};

var angularString = {
  'quote':function(string) {
    return '"' + string.replace(/\\/g, '\\\\').
                        replace(/"/g, '\\"').
                        replace(/\n/g, '\\n').
                        replace(/\f/g, '\\f').
                        replace(/\r/g, '\\r').
                        replace(/\t/g, '\\t').
                        replace(/\v/g, '\\v') +
             '"';
  },
  'quoteUnicode':function(string) {
    var str = angular['String']['quote'](string);
    var chars = [];
    for ( var i = 0; i < str.length; i++) {
      var ch = str.charCodeAt(i);
      if (ch < 128) {
        chars.push(str.charAt(i));
      } else {
        var encode = "000" + ch.toString(16);
        chars.push("\\u" + encode.substring(encode.length - 4));
      }
    }
    return chars.join('');
  },
  'toDate':function(string){
    var match;
    if (typeof string == 'string' &&
        (match = string.match(/^(\d\d\d\d)-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)Z$/))){
      var date = new Date(0);
      date.setUTCFullYear(match[1], match[2] - 1, match[3]);
      date.setUTCHours(match[4], match[5], match[6], 0);
      return date;
    }
    return string;
  }
};

var angularDate = {
    'toString':function(date){
      function pad(n) { return n < 10 ? "0" + n : n; }
      return  !date ? date :
        date.getUTCFullYear() + '-' +
        pad(date.getUTCMonth() + 1) + '-' +
        pad(date.getUTCDate()) + 'T' +
        pad(date.getUTCHours()) + ':' +
        pad(date.getUTCMinutes()) + ':' +
        pad(date.getUTCSeconds()) + 'Z' ;
    }
  };

var angularFunction = {
  'compile':function(expression) {
    if (isFunction(expression)){
      return expression;
    } else if (expression){
      return function($) {
        return createScope($).$eval(expression);
      };
    } else {
      return identity;
    }
  }
};

function defineApi(dst, chain, underscoreNames){
  if (_) {
    var lastChain = _.last(chain);
    foreach(underscoreNames, function(name){
      lastChain[name] = _[name];
    });
  }
  angular[dst] = angular[dst] || {};
  foreach(chain, function(parent){
    extend(angular[dst], parent);
  });
}
defineApi('Global', [angularGlobal],
    ['extend', 'clone','isEqual',
     'isElement', 'isArray', 'isFunction', 'isUndefined']);
defineApi('Collection', [angularGlobal, angularCollection],
    ['each', 'map', 'reduce', 'reduceRight', 'detect',
     'select', 'reject', 'all', 'any', 'include',
     'invoke', 'pluck', 'max', 'min', 'sortBy',
     'sortedIndex', 'toArray', 'size']);
defineApi('Array', [angularGlobal, angularCollection, angularArray],
    ['first', 'last', 'compact', 'flatten', 'without',
     'uniq', 'intersect', 'zip', 'indexOf', 'lastIndexOf']);
defineApi('Object', [angularGlobal, angularCollection, angularObject],
    ['keys', 'values']);
defineApi('String', [angularGlobal, angularString], []);
defineApi('Date', [angularGlobal, angularDate], []);
//IE bug
angular['Date']['toString'] = angularDate['toString'];
defineApi('Function', [angularGlobal, angularCollection, angularFunction],
    ['bind', 'bindAll', 'delay', 'defer', 'wrap', 'compose']);
var angularFilterGoogleChartApi;

foreach({
  'currency': function(amount){
    this.$element.toggleClass('ng-format-negative', amount < 0);
    return '$' + angularFilter['number'].apply(this, [amount, 2]);
  },

  'number': function(amount, fractionSize){
    if (isNaN(amount) || !isFinite(amount)) {
      return '';
    }
    fractionSize = typeof fractionSize == 'undefined' ? 2 : fractionSize;
    var isNegative = amount < 0;
    amount = Math.abs(amount);
    var pow = Math.pow(10, fractionSize);
    var text = "" + Math.round(amount * pow);
    var whole = text.substring(0, text.length - fractionSize);
    whole = whole || '0';
    var frc = text.substring(text.length - fractionSize);
    text = isNegative ? '-' : '';
    for (var i = 0; i < whole.length; i++) {
      if ((whole.length - i)%3 === 0 && i !== 0) {
        text += ',';
      }
      text += whole.charAt(i);
    }
    if (fractionSize > 0) {
      for (var j = frc.length; j < fractionSize; j++) {
        frc += '0';
      }
      text += '.' + frc.substring(0, fractionSize);
    }
    return text;
  },

  'date': function(amount) {
  },

  'json': function(object) {
    this.$element.addClass("ng-monospace");
    return toJson(object, true);
  },

  'trackPackage': (function(){
    var MATCHERS = [
      { name: "UPS",
        url: "http://wwwapps.ups.com/WebTracking/processInputRequest?sort_by=status&tracknums_displayed=1&TypeOfInquiryNumber=T&loc=en_US&track.x=0&track.y=0&InquiryNumber1=",
        regexp: [
          /^1Z[0-9A-Z]{16}$/i]},
      { name: "FedEx",
        url: "http://www.fedex.com/Tracking?tracknumbers=",
        regexp: [
          /^96\d{10}?$/i,
          /^96\d{17}?$/i,
          /^96\d{20}?$/i,
          /^\d{15}$/i,
          /^\d{12}$/i]},
      { name: "USPS",
        url: "http://trkcnfrm1.smi.usps.com/PTSInternetWeb/InterLabelInquiry.do?origTrackNum=",
        regexp: [
          /^(91\d{20})$/i,
          /^(91\d{18})$/i]}];
    return function(trackingNo, noMatch) {
      trackingNo = trim(trackingNo);
      var tNo = trackingNo.replace(/ /g, '');
      var returnValue;
      foreach(MATCHERS, function(carrier){
        foreach(carrier.regexp, function(regexp){
          if (!returnValue && regexp.test(tNo)) {
            var text = carrier.name + ": " + trackingNo;
            var url = carrier.url + trackingNo;
            returnValue = jqLite('<a></a>');
            returnValue.text(text);
            returnValue.attr('href', url);
          }
        });
      });
      if (returnValue)
        return returnValue;
      else if (trackingNo)
        return noMatch || trackingNo + " is not recognized";
      else
        return null;
    };})(),

  'link': function(obj, title) {
    if (obj) {
      var text = title || obj.text || obj;
      var url = obj.url || obj;
      if (url) {
        if (angular.validator.email(url) === null) {
          url = "mailto:" + url;
        }
        var a = jqLite('<a></a>');
        a.attr('href', url);
        a.text(text);
        return a;
      }
    }
    return obj;
  },


  'bytes': (function(){
    var SUFFIX = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    return function(size) {
      if(size === null) return "";

      var suffix = 0;
      while (size > 1000) {
        size = size / 1024;
        suffix++;
      }
      var txt = "" + size;
      var dot = txt.indexOf('.');
      if (dot > -1 && dot + 2 < txt.length) {
        txt = txt.substring(0, dot + 2);
      }
      return txt + " " + SUFFIX[suffix];
    };
  })(),

  'image': function(obj, width, height) {
    if (obj && obj.url) {
      var style = "", img = jqLite('<img>');
      if (width) {
        img.css('max-width', width + 'px');
        img.css('max-height', (height || width) + 'px');
      }
      img.attr('src', obj.url);
      return img;
    }
    return null;
  },

  'lowercase': lowercase,

  'uppercase': uppercase,

  'linecount': function (obj) {
    if (isString(obj)) {
      if (obj==='') return 1;
      return obj.split(/\n|\f/).length;
    }
    return 1;
  },

  'if': function (result, expression) {
    return expression ? result : undefined;
  },

  'unless': function (result, expression) {
    return expression ? undefined : result;
  },

  'googleChartApi': extend(
    function(type, data, width, height) {
      data = data || {};
      var chart = {
          'cht':type,
          'chco':angularFilterGoogleChartApi['collect'](data, 'color'),
          'chtt':angularFilterGoogleChartApi['title'](data),
          'chdl':angularFilterGoogleChartApi['collect'](data, 'label'),
          'chd':angularFilterGoogleChartApi['values'](data),
          'chf':'bg,s,FFFFFF00'
        };
      if (_.isArray(data['xLabels'])) {
        chart['chxt']='x';
        chart['chxl']='0:|' + data.xLabels.join('|');
      }
      return angularFilterGoogleChartApi['encode'](chart, width, height);
    },
    {
      'values': function(data){
        var seriesValues = [];
        foreach(data['series']||[], function(serie){
          var values = [];
          foreach(serie['values']||[], function(value){
            values.push(value);
          });
          seriesValues.push(values.join(','));
        });
        var values = seriesValues.join('|');
        return values === "" ? null : "t:" + values;
      },

      'title': function(data){
        var titles = [];
        var title = data['title'] || [];
        foreach(_.isArray(title)?title:[title], function(text){
          titles.push(encodeURIComponent(text));
        });
        return titles.join('|');
      },

      'collect': function(data, key){
        var outterValues = [];
        var count = 0;
        foreach(data['series']||[], function(serie){
          var innerValues = [];
          var value = serie[key] || [];
          foreach(_.isArray(value)?value:[value], function(color){
              innerValues.push(encodeURIComponent(color));
              count++;
            });
          outterValues.push(innerValues.join('|'));
        });
        return count?outterValues.join(','):null;
      },

      'encode': function(params, width, height) {
        width = width || 200;
        height = height || width;
        var url = "http://chart.apis.google.com/chart?",
            urlParam = [],
            img = jqLite('<img>');
        params['chs'] = width + "x" + height;
        foreach(params, function(value, key){
          if (value) {
            urlParam.push(key + "=" + value);
          }
        });
        urlParam.sort();
        url += urlParam.join("&");
        img.attr('src', url);
        img.css({width: width + 'px', height: height + 'px'});
        return img;
      }
    }
  ),


  'qrcode': function(value, width, height) {
    return angularFilterGoogleChartApi['encode']({
      'cht':'qr', 'chl':encodeURIComponent(value)}, width, height);
  },
  'chart': {
    'pie':function(data, width, height) {
      return angularFilterGoogleChartApi('p', data, width, height);
    },
    'pie3d':function(data, width, height) {
      return angularFilterGoogleChartApi('p3', data, width, height);
    },
    'pieConcentric':function(data, width, height) {
      return angularFilterGoogleChartApi('pc', data, width, height);
    },
    'barHorizontalStacked':function(data, width, height) {
      return angularFilterGoogleChartApi('bhs', data, width, height);
    },
    'barHorizontalGrouped':function(data, width, height) {
      return angularFilterGoogleChartApi('bhg', data, width, height);
    },
    'barVerticalStacked':function(data, width, height) {
      return angularFilterGoogleChartApi('bvs', data, width, height);
    },
    'barVerticalGrouped':function(data, width, height) {
      return angularFilterGoogleChartApi('bvg', data, width, height);
    },
    'line':function(data, width, height) {
      return angularFilterGoogleChartApi('lc', data, width, height);
    },
    'sparkline':function(data, width, height) {
      return angularFilterGoogleChartApi('ls', data, width, height);
    },
    'scatter':function(data, width, height) {
      return angularFilterGoogleChartApi('s', data, width, height);
    }
  },

  'html': function(html){
    return jqLite(html);
  },

  'linky': function(text){
    if (!text) return text;
    function regExpEscape(text) {
      return text.replace(/([\/\.\*\+\?\|\(\)\[\]\{\}\\])/g, '\\$1');
    }
    var URL = /(ftp|http|https|mailto):\/\/([^\(\)|\s]+)/;
    var match;
    var raw = text;
    var html = [];
    while (match=raw.match(URL)) {
      var url = match[0].replace(/[\.\;\,\(\)\{\}\<\>]$/,'');
      var i = raw.indexOf(url);
      html.push(escapeHtml(raw.substr(0, i)));
      html.push('<a href="' + url + '">');
      html.push(url);
      html.push('</a>');
      raw = raw.substring(i + url.length);
    }
    html.push(escapeHtml(raw));
    return jqLite(html.join(''));
  }
}, function(v,k){angularFilter[k] = v;});

angularFilterGoogleChartApi = angularFilter['googleChartApi'];
function formater(format, parse) {return {'format':format, 'parse':parse || format};}
function toString(obj) {return isDefined(obj) ? "" + obj : obj;}
extend(angularFormatter, {
  'noop':formater(identity, identity),
  'boolean':formater(toString, toBoolean),
  'number':formater(toString, function(obj){return 1*obj;}),

  'list':formater(
    function(obj) { return obj ? obj.join(", ") : obj; },
    function(value) {
      var list = [];
      foreach((value || '').split(','), function(item){
        item = trim(item);
        if (item) list.push(item);
      });
      return list;
    }
  ),

  'trim':formater(
    function(obj) { return obj ? trim("" + obj) : ""; }
  )
});
foreach({
  'noop': noop,

  'regexp': function(value, regexp, msg) {
    if (!value.match(regexp)) {
      return msg ||
        "Value does not match expected format " + regexp + ".";
    } else {
      return null;
    }
  },

  'number': function(value, min, max) {
    var num = 1 * value;
    if (num == value) {
      if (typeof min != 'undefined' && num < min) {
        return "Value can not be less than " + min + ".";
      }
      if (typeof min != 'undefined' && num > max) {
        return "Value can not be greater than " + max + ".";
      }
      return null;
    } else {
      return "Not a number";
    }
  },

  'integer': function(value, min, max) {
    var numberError = angularValidator['number'](value, min, max);
    if (numberError) return numberError;
    if (!("" + value).match(/^\s*[\d+]*\s*$/) || value != Math.round(value)) {
      return "Not a whole number";
    }
    return null;
  },

  'date': function(value, min, max) {
    if (value.match(/^\d\d?\/\d\d?\/\d\d\d\d$/)) {
      return null;
    }
    return "Value is not a date. (Expecting format: 12/31/2009).";
  },

  'ssn': function(value) {
    if (value.match(/^\d\d\d-\d\d-\d\d\d\d$/)) {
      return null;
    }
    return "SSN needs to be in 999-99-9999 format.";
  },

  'email': function(value) {
    if (value.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/)) {
      return null;
    }
    return "Email needs to be in username@host.com format.";
  },

  'phone': function(value) {
    if (value.match(/^1\(\d\d\d\)\d\d\d-\d\d\d\d$/)) {
      return null;
    }
    if (value.match(/^\+\d{2,3} (\(\d{1,5}\))?[\d ]+\d$/)) {
      return null;
    }
    return "Phone number needs to be in 1(987)654-3210 format in North America or +999 (123) 45678 906 internationaly.";
  },

  'url': function(value) {
    if (value.match(/^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/)) {
      return null;
    }
    return "URL needs to be in http://server[:port]/path format.";
  },

  'json': function(value) {
    try {
      fromJson(value);
      return null;
    } catch (e) {
      return e.toString();
    }
  },

  'asynchronous': function(text, asynchronousFn) {
    var element = this['$element'];
    var cache = element.data('$validateState');
    if (!cache) {
      cache = { state: {}};
      element.data('$validateState', cache);
    }
    var state = cache.state[text];
    cache.lastKey = text;
    if (state === undefined) {
      // we have never seen this before, Request it
      element.addClass('ng-input-indicator-wait');
      state = cache.state[text] = null;
      (asynchronousFn || noop)(text, function(error){
        state = cache.state[text] = error ? error : false;
        if (cache.state[cache.lastKey] !== null) {
          element.removeClass('ng-input-indicator-wait');
        }
        elementError(element, NG_VALIDATION_ERROR, error);
      });
    }

    if (state === null){
      // request in flight, mark widget invalid, but don't show it to user
      (this['$invalidWidgets']||[]).push(this.$element);
    }
    return state;
  }

}, function(v,k) {angularValidator[k] = v;});
angularDirective("ng-init", function(expression){
  return function(element){
    this.$tryEval(expression, element);
  };
});

angularDirective("ng-controller", function(expression){
  return function(element){
    var controller = getter(window, expression, true) || getter(this, expression, true);
    if (!controller)
      throw "Can not find '"+expression+"' controller.";
    if (!isFunction(controller))
      throw "Reference '"+expression+"' is not a class.";
    this.$become(controller);
    (this.init || noop)();
  };
});

angularDirective("ng-eval", function(expression){
  return function(element){
    this.$onEval(expression, element);
  };
});

angularDirective("ng-bind", function(expression){
  return function(element) {
    var lastValue, lastError;
    this.$onEval(function() {
      var error, value = this.$tryEval(expression, function(e){
        error = toJson(e);
      });
      if (value != lastValue || error != lastError) {
        lastValue = value;
        lastError = error;
        elementError(element, NG_EXCEPTION, error);
        if (error) value = error;
        if (isElement(value)) {
          element.html('');
          element.append(value);
        } else {
          element.text(value);
        }
      }
    }, element);
  };
});

var bindTemplateCache = {};
function compileBindTemplate(template){
  var fn = bindTemplateCache[template];
  if (!fn) {
    var bindings = [];
    foreach(parseBindings(template), function(text){
      var exp = binding(text);
      bindings.push(exp ? function(element){
        var error, value = this.$tryEval(exp, function(e){
          error = toJson(e);
        });
        elementError(element, NG_EXCEPTION, error);
        return error ? error : value;
      } : function() {
        return text;
      });
    });
    bindTemplateCache[template] = fn = function(element){
      var parts = [], self = this;
      foreach(bindings, function(fn){
        var value = fn.call(self, element);
        if (isElement(value))
          value = '';
        else if (isObject(value))
          value = toJson(value, true);
        parts.push(value);
      });
      return parts.join('');
    };
  }
  return fn;
}

angularDirective("ng-bind-template", function(expression){
  var templateFn = compileBindTemplate(expression);
  return function(element) {
    var lastValue;
    this.$onEval(function() {
      var value = templateFn.call(this, element);
      if (value != lastValue) {
        element.text(value);
        lastValue = value;
      }
    }, element);
  };
});

var REMOVE_ATTRIBUTES = {
  'disabled':true,
  'readonly':true,
  'checked':true
};
angularDirective("ng-bind-attr", function(expression){
  return function(element){
    this.$onEval(function(){
      foreach(this.$eval(expression), function(bindExp, key) {
        var value = compileBindTemplate(bindExp).call(this, element);
        if (REMOVE_ATTRIBUTES[lowercase(key)] && !toBoolean(value)) {
          element.removeAttr('disabled');
        } else {
          element.attr(key, value);
        }
      }, this);
    }, element);
  };
});

angularWidget("@ng-non-bindable", noop);

angularWidget("@ng-repeat", function(expression, element){
  element.removeAttr('ng-repeat');
  element.replaceWith(this.comment("ng-repeat: " + expression));
  var template = this.compile(element);
  return function(reference){
    var match = expression.match(/^\s*(.+)\s+in\s+(.*)\s*$/),
        lhs, rhs, valueIdent, keyIdent;
    if (! match) {
      throw "Expected ng-repeat in form of 'item in collection' but got '" +
      expression + "'.";
    }
    lhs = match[1];
    rhs = match[2];
    match = lhs.match(/^([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\)$/);
    if (!match) {
      throw "'item' in 'item in collection' should be identifier or (key, value) but got '" +
      keyValue + "'.";
    }
    valueIdent = match[3] || match[1];
    keyIdent = match[2];

    if (isUndefined(this.$eval(rhs))) this.$set(rhs, []);

    var children = [], currentScope = this;
    this.$onEval(function(){
      var index = 0, childCount = children.length, childScope, lastElement = reference;
      foreach(this.$tryEval(rhs, reference), function(value, key){
        function assign(scope) {
          scope[valueIdent] = value;
          if (keyIdent) scope[keyIdent] = key;
        }
        if (index < childCount) {
          // reuse existing child
          assign(childScope = children[index]);
        } else {
          // grow children
          assign(childScope = template(element.clone(), createScope(currentScope)));
          lastElement.after(childScope.$element);
          childScope.$index = index;
          childScope.$element.attr('ng-repeat-index', index);
          childScope.$init();
          children.push(childScope);
        }
        childScope.$eval();
        lastElement = childScope.$element;
        index ++;
      });
      // shrink children
      while(children.length > index) {
        children.pop().$element.remove();
      }
    }, reference);
  };
});

angularDirective("ng-click", function(expression, element){
  return function(element){
    var self = this;
    element.click(function(){
      self.$tryEval(expression, element);
      self.$root.$eval();
      return false;
    });
  };
});

angularDirective("ng-watch", function(expression, element){
  return function(element){
    var self = this;
    new Parser(expression).watch()({
      scope:{get: self.$get, set: self.$set},
      addListener:function(watch, exp){
        self.$watch(watch, function(){
          return exp({scope:{get: self.$get, set: self.$set}, state:self});
        }, element);
      }
    });
  };
});

function ngClass(selector) {
  return function(expression, element){
    var existing = element[0].className + ' ';
    return function(element){
      this.$onEval(function(){
        var value = this.$eval(expression);
        if (selector(this.$index)) {
          if (isArray(value)) value = value.join(' ');
          element[0].className = trim(existing + value);
        }
      }, element);
    };
  };
}

angularDirective("ng-class", ngClass(function(){return true;}));
angularDirective("ng-class-odd", ngClass(function(i){return i % 2 === 0;}));
angularDirective("ng-class-even", ngClass(function(i){return i % 2 === 1;}));

angularDirective("ng-show", function(expression, element){
  return function(element){
    this.$onEval(function(){
      element.css('display', toBoolean(this.$eval(expression)) ? '' : 'none');
    }, element);
  };
});

angularDirective("ng-hide", function(expression, element){
  return function(element){
    this.$onEval(function(){
      element.css('display', toBoolean(this.$eval(expression)) ? 'none' : '');
    }, element);
  };
});

angularDirective("ng-style", function(expression, element){
  return function(element){
    this.$onEval(function(){
      element.css(this.$eval(expression));
    }, element);
  };
});

function parseBindings(string) {
  var results = [];
  var lastIndex = 0;
  var index;
  while((index = string.indexOf('{{', lastIndex)) > -1) {
    if (lastIndex < index)
      results.push(string.substr(lastIndex, index - lastIndex));
    lastIndex = index;

    index = string.indexOf('}}', index);
    index = index < 0 ? string.length : index + 2;

    results.push(string.substr(lastIndex, index - lastIndex));
    lastIndex = index;
  }
  if (lastIndex != string.length)
    results.push(string.substr(lastIndex, string.length - lastIndex));
  return results.length === 0 ? [ string ] : results;
}

function binding(string) {
  var binding = string.replace(/\n/gm, ' ').match(/^\{\{(.*)\}\}$/);
  return binding ? binding[1] : null;
}

function hasBindings(bindings) {
  return bindings.length > 1 || binding(bindings[0]) !== null;
}

angularTextMarkup('{{}}', function(text, textNode, parentElement) {
  var bindings = parseBindings(text),
      self = this;
  if (hasBindings(bindings)) {
    if (isLeafNode(parentElement[0])) {
      parentElement.attr('ng-bind-template', text);
    } else {
      var cursor = textNode, newElement;
      foreach(parseBindings(text), function(text){
        var exp = binding(text);
        if (exp) {
          newElement = self.element('span');
          newElement.attr('ng-bind', exp);
        } else {
          newElement = self.text(text);
        }
        cursor.after(newElement);
        cursor = newElement;
      });
    }
    textNode.remove();
  }
});

// TODO: this should be widget not a markup
angularTextMarkup('OPTION', function(text, textNode, parentElement){
  if (parentElement[0].nodeName == "OPTION") {
    var select = document.createElement('select');
    select.insertBefore(parentElement[0].cloneNode(true), null);
    if (!select.innerHTML.match(/<option(\s.*\s|\s)value\s*=\s*.*>.*<\/\s*option\s*>/gi)) {
      parentElement.attr('value', text);
    }
  }
});

var NG_BIND_ATTR = 'ng-bind-attr';
angularAttrMarkup('{{}}', function(value, name, element){
  if (name.substr(0, 3) != 'ng-') {
    var bindings = parseBindings(value),
        bindAttr;
    if (hasBindings(bindings)) {
      element.removeAttr(name);
      bindAttr = fromJson(element.attr(NG_BIND_ATTR) || "{}");
      bindAttr[name] = value;
      element.attr(NG_BIND_ATTR, toJson(bindAttr));
    }
  }
});
function modelAccessor(scope, element) {
  var expr = element.attr('name'),
      farmatterName = element.attr('ng-format') || NOOP,
      formatter = angularFormatter(farmatterName);
  if (!expr) throw "Required field 'name' not found.";
  if (!formatter) throw "Formatter named '" + farmatterName + "' not found.";
  return {
    get: function() {
      return formatter['format'](scope.$eval(expr));
    },
    set: function(value) {
      scope.$tryEval(expr + '=' + toJson(formatter['parse'](value)), element);
    }
  };
}

function compileValidator(expr) {
  return new Parser(expr).validator()();
}

function valueAccessor(scope, element) {
  var validatorName = element.attr('ng-validate') || NOOP,
      validator = compileValidator(validatorName),
      required = element.attr('ng-required'),
      lastError,
      invalidWidgets = scope.$invalidWidgets || {markValid:noop, markInvalid:noop};
  required = required || required === '';
  if (!validator) throw "Validator named '" + validatorName + "' not found.";
  function validate(value) {
    var error,
        validateScope = extend(new (extend(function(){}, {prototype:scope}))(), {$element:element});
    error = required && !trim(value) ?
          "Required" :
           validator({state:validateScope, scope:{get:validateScope.$get, set:validateScope.$set}}, value);
    if (error !== lastError) {
      elementError(element, NG_VALIDATION_ERROR, error);
      lastError = error;
      if (error)
        invalidWidgets.markInvalid(element);
      else
        invalidWidgets.markValid(element);
    }
    return value;
  }
  return {
    get: function(){ return validate(element.val()); },
    set: function(value){ element.val(validate(value)); }
  };
}

function checkedAccessor(scope, element) {
  var domElement = element[0];
  return {
    get: function(){
      return !!domElement.checked;
    },
    set: function(value){
      domElement.checked = !!value;
    }
  };
}

function radioAccessor(scope, element) {
  var domElement = element[0];
  return {
    get: function(){
      return domElement.checked ? domElement.value : null;
    },
    set: function(value){
      domElement.checked = value == domElement.value;
    }
  };
}

function optionsAccessor(scope, element) {
  var options = element[0].options;
  return {
    get: function(){
      var values = [];
      foreach(options, function(option){
        if (option.selected) values.push(option.value);
      });
      return values;
    },
    set: function(values){
      var keys = {};
      foreach(values, function(value){ keys[value] = true; });
      foreach(options, function(option){
        option.selected = keys[option.value];
      });
    }
  };
}

function noopAccessor() { return { get: noop, set: noop }; }

var textWidget = inputWidget('keyup change', modelAccessor, valueAccessor, initWidgetValue('')),
    buttonWidget = inputWidget('click', noopAccessor, noopAccessor, noop),
    INPUT_TYPE = {
      'text':            textWidget,
      'textarea':        textWidget,
      'hidden':          textWidget,
      'password':        textWidget,
      'button':          buttonWidget,
      'submit':          buttonWidget,
      'reset':           buttonWidget,
      'image':           buttonWidget,
      'checkbox':        inputWidget('click', modelAccessor, checkedAccessor, initWidgetValue(false)),
      'radio':           inputWidget('click', modelAccessor, radioAccessor, radioInit),
      'select-one':      inputWidget('change', modelAccessor, valueAccessor, initWidgetValue(null)),
      'select-multiple': inputWidget('change', modelAccessor, optionsAccessor, initWidgetValue([]))
//      'file':            fileWidget???
    };

function initWidgetValue(initValue) {
  return function (model, view) {
    var value = view.get() || copy(initValue);
    if (isUndefined(model.get()) && isDefined(value))
      model.set(value);
  };
}

function radioInit(model, view, element) {
 var modelValue = model.get(), viewValue = view.get(), input = element[0];
 input.name = this.$id + '@' + input.name;
 if (isUndefined(modelValue)) model.set(null);
 if (viewValue !== null) model.set(viewValue);
}

function inputWidget(events, modelAccessor, viewAccessor, initFn) {
  return function(element) {
    var scope = this,
        model = modelAccessor(scope, element),
        view = viewAccessor(scope, element),
        action = element.attr('ng-change') || '';
    initFn.call(scope, model, view, element);
    this.$eval(element.attr('ng-init')||'');
    // Don't register a handler if we are a button (noopAccessor) and there is no action
    if (action || modelAccessor !== noopAccessor) {
      element.bind(events, function(){
        model.set(view.get());
        scope.$tryEval(action, element);
        scope.$root.$eval();
        // if we have noop initFn than we are just a button,
        // therefore we want to prevent default action
        return initFn != noop;
      });
    }
    view.set(model.get());
    scope.$watch(model.get, view.set);
  };
}

function inputWidgetSelector(element){
  this.directives(true);
  return INPUT_TYPE[lowercase(element[0].type)] || noop;
}

angularWidget('INPUT', inputWidgetSelector);
angularWidget('TEXTAREA', inputWidgetSelector);
angularWidget('BUTTON', inputWidgetSelector);
angularWidget('SELECT', function(element){
  this.descend(true);
  return inputWidgetSelector.call(this, element);
});


angularWidget('NG:INCLUDE', function(element){
  var compiler = this,
      src = element.attr("src");
  if (element.attr('switch-instance')) {
    this.descend(true);
    this.directives(true);
  } else {
    return function(element){
      var scope = this, childScope;
      element.attr('switch-instance', 'compiled');
      scope.$browser.xhr('GET', src, function(code, response){
        element.html(response);
        childScope = createScope(scope);
        compiler.compile(element)(element, childScope);
        childScope.$init();
        scope.$root.$eval();
      });
      scope.$onEval(function(){
        if (childScope) childScope.$eval();
      });
    };
  }
});

angularWidget('NG:SWITCH', function ngSwitch(element){
  var compiler = this,
      watchExpr = element.attr("on"),
      whenExpr = (element.attr("using") || 'equals').split(":");
      whenFn = ngSwitch[whenExpr.shift()];
      changeExpr = element.attr('change') || '',
      cases = [];
  if (!whenFn) throw "Using expression '" + usingExpr + "' unknown.";
  eachNode(element, function(caseElement){
    var when = caseElement.attr('ng-switch-when');
    if (when) {
      cases.push({
        when: function(scope, value){
          var args = [value, when];
          foreach(whenExpr, function(arg){
            args.push(arg);
          });
          return whenFn.apply(scope, args);
        },
        change: changeExpr,
        element: caseElement,
        template: compiler.compile(caseElement)
      });
    }
  });
  element.html('');
  return function(element){
    var scope = this, childScope;
    this.$watch(watchExpr, function(value){
      element.html('');
      childScope = createScope(scope);
      foreach(cases, function(switchCase){
        if (switchCase.when(childScope, value)) {
          element.append(switchCase.element);
          childScope.$tryEval(switchCase.change, element);
          switchCase.template(switchCase.element, childScope);
          childScope.$init();
        }
      });
    });
    scope.$onEval(function(){
      if (childScope) childScope.$eval();
    });
  };
}, {
  equals: function(on, when) {
    return on == when;
  },
  route: function(on, when, dstName) {
    var regex = '^' + when.replace(/[\.\\\(\)\^\$]/g, "\$1") + '$',
        params = [],
        dst = {};
    foreach(when.split(/\W/), function(param){
      if (param) {
        var paramRegExp = new RegExp(":" + param + "([\\W])");
        if (regex.match(paramRegExp)) {
          regex = regex.replace(paramRegExp, "([^\/]*)$1");
          params.push(param);
        }
      }
    });
    var match = on.match(new RegExp(regex));
    if (match) {
      foreach(params, function(name, index){
        dst[name] = match[index + 1];
      });
      if (dstName) this.$set(dstName, dst);
    }
    return match;
  }
});
angularService("$window", bind(window, identity, window));
angularService("$document", function(window){
  return jqLite(window.document);
}, {inject:['$window']});

var URL_MATCH = /^(file|ftp|http|https):\/\/(\w+:{0,1}\w*@)?([\w\.]*)(:([0-9]+))?([^\?#]+)(\?([^#]*))?((#([^\?]*))?(\?([^\?]*))?)$/;
var DEFAULT_PORTS = {'http': 80, 'https': 443, 'ftp':21};
angularService("$location", function(browser){
  var scope = this, location = {parse:parse, toString:toString};
  var lastHash;
  function parse(url){
    if (isDefined(url)) {
      var match = URL_MATCH.exec(url);
      if (match) {
        location.href = url;
        location.protocol = match[1];
        location.host = match[3] || '';
        location.port = match[5] || DEFAULT_PORTS[location.href] || null;
        location.path = match[6];
        location.search = parseKeyValue(match[8]);
        location.hash = match[9];
        if (location.hash)
          location.hash = location.hash.substr(1);
        lastHash = location.hash;
        location.hashPath = match[11] || '';
        location.hashSearch = parseKeyValue(match[13]);
      }
    }
  }
  function toString() {
    if (lastHash === location.hash) {
      var hashKeyValue = toKeyValue(location.hashSearch),
          hash = (location.hashPath ? location.hashPath : '') + (hashKeyValue ? '?' + hashKeyValue : ''),
          url = location.href.split('#')[0] + '#' + (hash ? hash : '');
      if (url !== location.href) parse(url);
      return url;
    } else {
      parse(location.href.split('#')[0] + '#' + location.hash);
      return toString();
    }
  }
  browser.watchUrl(function(url){
    parse(url);
    scope.$root.$eval();
  });
  parse(browser.getUrl());
  this.$onEval(PRIORITY_LAST, function(){
    browser.setUrl(toString());
  });
  return location;
}, {inject: ['$browser']});

angularService("$hover", function(browser) {
  var tooltip, self = this, error, width = 300, arrowWidth = 10;
  browser.hover(function(element, show){
    if (show && (error = element.attr(NG_EXCEPTION) || element.attr(NG_VALIDATION_ERROR))) {
      if (!tooltip) {
        tooltip = {
            callout: jqLite('<div id="ng-callout"></div>'),
            arrow: jqLite('<div></div>'),
            title: jqLite('<div class="ng-title"></div>'),
            content: jqLite('<div class="ng-content"></div>')
        };
        tooltip.callout.append(tooltip.arrow);
        tooltip.callout.append(tooltip.title);
        tooltip.callout.append(tooltip.content);
        self.$browser.body.append(tooltip.callout);
      }
      var docRect = self.$browser.body[0].getBoundingClientRect(),
          elementRect = element[0].getBoundingClientRect(),
          leftSpace = docRect.right - elementRect.right - arrowWidth;
      tooltip.title.text(element.hasClass("ng-exception") ? "EXCEPTION:" : "Validation error...");
      tooltip.content.text(error);
      if (leftSpace < width) {
        tooltip.arrow.addClass('ng-arrow-right');
        tooltip.arrow.css({left: (width + 1)+'px'});
        tooltip.callout.css({
          position: 'fixed',
          left: (elementRect.left - arrowWidth - width - 4) + "px",
          top: (elementRect.top - 3) + "px",
          width: width + "px"
        });
      } else {
        tooltip.arrow.addClass('ng-arrow-left');
        tooltip.callout.css({
          position: 'fixed',
          left: (elementRect.right + arrowWidth) + "px",
          top: (elementRect.top - 3) + "px",
          width: width + "px"
        });
      }
    } else if (tooltip) {
      tooltip.callout.remove();
      tooltip = null;
    }
  });
}, {inject:['$browser']});

angularService("$invalidWidgets", function(){
  var invalidWidgets = [];
  invalidWidgets.markValid = function(element){
    var index = indexOf(invalidWidgets, element);
    if (index != -1)
      invalidWidgets.splice(index, 1);
  };
  invalidWidgets.markInvalid = function(element){
    var index = indexOf(invalidWidgets, element);
    if (index === -1)
      invalidWidgets.push(element);
  };
  invalidWidgets.visible = function() {
    var count = 0;
    foreach(invalidWidgets, function(widget){
      count = count + (isVisible(widget) ? 1 : 0);
    });
    return count;
  };
  return invalidWidgets;
});
var browserSingleton;
angularService('$browser', function browserFactory(){
  if (!browserSingleton) {
    browserSingleton = new Browser(window.location, window.document);
    browserSingleton.startUrlWatcher();
    browserSingleton.bind();
  }
  return browserSingleton;
});

extend(angular, {
  'element': jqLite,
  'compile': compile,
  'scope': createScope,
  'copy': copy,
  'extend': extend,
  'foreach': foreach,
  'noop':noop,
  'identity':identity,
  'isUndefined': isUndefined,
  'isDefined': isDefined,
  'isString': isString,
  'isFunction': isFunction,
  'isNumber': isNumber,
  'isArray': isArray
});


  window.onload = function(){
    try {
      if (previousOnLoad) previousOnLoad();
    } catch(e) {}
    angularInit(parseKeyValue(angularJsConfig(document)));
  };

})(window, document, window.onload);
