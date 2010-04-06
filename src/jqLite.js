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
  this[0] = element;
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
    this[0].appendChild(jqLite(node)[0]);
  },

  remove: function() {
    this.dealoc();
    this[0].parentNode.removeChild(this[0]);
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
