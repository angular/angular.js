//////////////////////////////////
//JQLite
//////////////////////////////////

var jqCache = {},
    jqName = 'ng-' + new Date().getTime(),
    jqId = 1,
    addEventListenerFn = (window.document.addEventListener ?
      function(element, type, fn) {element.addEventListener(type, fn, false);} :
      function(element, type, fn) {element.attachEvent('on' + type, fn);}),
    removeEventListenerFn = (window.document.removeEventListener ?
      function(element, type, fn) {element.removeEventListener(type, fn, false); } :
      function(element, type, fn) {element.detachEvent('on' + type, fn); });

function jqNextId() { return (jqId++); }

function jqClearData(element) {
  var cacheId = element[jqName],
      cache = jqCache[cacheId];
  if (cache) {
    foreach(cache.bind || {}, function(fn, type){
      removeEventListenerFn(element, type, fn);
    });
    delete jqCache[cacheId];
    if (msie)
      element[jqName] = ''; // ie does not allow deletion of attributes on elements.
    else
      delete element[jqName];
  }
}

function getStyle(element) {
  var current = {}, style = element[0].style, value, name, i;
  if (typeof style.length == 'number') {
    for(i = 0; i < style.length; i++) {
      name = style[i];
      current[name] = style[name];
    }
  } else {
    for (name in style) {
      value = style[name];
      if (1*name != name && name != 'cssText' && value && typeof value == 'string' && value !='false')
        current[name] = value;
    }
  }
  return current;
}

function JQLite(element) {
  if (!isElement(element) && isDefined(element.length) && element.item) {
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
      return cache ? cache[key] : _null;
    }
  },

  removeData: function(){
    jqClearData(this[0]);
  },

  dealoc: function(){
    (function dealoc(element){
      jqClearData(element);
      for ( var i = 0, children = element.childNodes || []; i < children.length; i++) {
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
          if (!event.preventDefault) {
            event.preventDefault = function(){
              event.returnValue = false; //ie
            };
          }
          if (!event.stopPropagation) {
            event.stopPropagation = function() {
              event.cancelBubble = true; //ie
            };
          }
          foreach(eventHandler.fns, function(fn){
            fn.call(self, event);
          });
        };
        eventHandler.fns = [];
        addEventListenerFn(element, type, eventHandler);
      }
      eventHandler.fns.push(fn);
    });
  },

  replaceWith: function(replaceNode) {
    this[0].parentNode.replaceChild(jqLite(replaceNode)[0], this[0]);
  },

  children: function() {
    return new JQLite(this[0].childNodes);
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
      // the extra argument is to get the right thing for a.href in IE, see jQuery code
      return e.getAttribute(name, 2);
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
      var i = 0, childNodes = this[0].childNodes;
      for ( ; i < childNodes.length; i++) {
        jqLite(childNodes[i]).dealoc();
      }
      this[0].innerHTML = value;
    }
    return this[0].innerHTML;
  },

  parent: function() {
    return jqLite(this[0].parentNode);
  },

  clone: function() { return jqLite(this[0].cloneNode(true)); }
};

if (msie) {
  extend(JQLite.prototype, {
    text: function(value) {
      var e = this[0];
      // NodeType == 3 is text node
      if (e.nodeType == 3) {
        if (isDefined(value)) e.nodeValue = value;
        return e.nodeValue;
      } else {
        if (isDefined(value)) e.innerText = value;
        return e.innerText;
      }
    }
  });
}
