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
    foreach(this.inits, function(fn) {
      scope.apply(fn, jqLite(element));
    });

    var i,
        childNodes = element.childNodes,
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
    return this.inits.length == 0 && this.paths.length == 0;
  }
};

///////////////////////////////////
//JQLite
//////////////////////////////////

var jqCache = {};
var jqName = 'ng-' + new Date().getTime();
var jqId = 1;
function jqNextId() { return jqId++; }

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
};

function JQLite(element) {
  //todo: change to this[0];
  this.element = element;
}

function jqLite(element) {
  if (typeof element == 'string') {
    var div = document.createElement('div');
    div.innerHTML = element;
    element = div.childNodes[0];
  }
  return element instanceof JQLite ? element : new JQLite(element);
}

JQLite.prototype = {
  data: function(key, value) {
    var element = this.element,
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
    jqClearData(this.element);
  },

  dealoc: function(){
    (function dealoc(element){
      jqClearData(element);
      for ( var i = 0, children = element.childNodes; i < children.length; i++) {
        dealoc(children[0]);
      }
    })(this.element);
  },

  bind: function(type, fn){
    var element = this.element,
        bind = this.data('bind'),
        eventHandler;
    if (!bind) this.data('bind', bind = {});
    eventHandler = bind[type];
    if (!eventHandler) {
      bind[type] = eventHandler = function() {
        var self = this;
        foreach(eventHandler.fns, function(fn){
          fn.apply(self, arguments);
        });
      };
      eventHandler.fns = [];
      addEventListener(element, type, eventHandler);
    }
    eventHandler.fns.push(fn);
  },

  trigger: function(type) {
    var cache = this.data('bind');
    if (cache) {
      (cache[type] || noop)();
    }
  },

  click: function(fn) {
    if (fn)
      this.bind('click', fn);
    else
      this.trigger('click');
  },

  eachTextNode: function(fn){
    var i, chldNodes = this.element.childNodes || [], size = chldNodes.length, chld;
    for (i = 0; i < size; i++) {
      if((chld = new JQLite(chldNodes[i])).isText()) {
        fn(chld, i);
      }
    }
  },


  eachNode: function(fn){
    var i, chldNodes = this.element.childNodes || [], size = chldNodes.length, chld;
    for (i = 0; i < size; i++) {
      if(!(chld = new JQLite(chldNodes[i])).isText()) {
        fn(chld, i);
      }
    }
  },

  eachAttribute: function(fn){
    var i, attrs = this.element.attributes || [], size = attrs.length, chld, attr;
    for (i = 0; i < size; i++) {
      var attr = attrs[i];
      fn(attr.name, attr.value);
    }
  },

  replaceWith: function(replaceNode) {
    this.element.parentNode.replaceChild(jqLite(replaceNode).element, this.element);
  },

  remove: function() {
    this.dealoc();
    this.element.parentNode.removeChild(this.element);
  },

  removeAttr: function(name) {
    this.element.removeAttribute(name);
  },

  after: function(element) {
    this.element.parentNode.insertBefore(jqLite(element).element, this.element.nextSibling);
  },

  hasClass: function(selector) {
    var className = " " + selector + " ";
    if ( (" " + this.element.className + " ").replace(/[\n\t]/g, " ").indexOf( className ) > -1 ) {
      return true;
    }
    return false;
  },

  addClass: function( selector ) {
    if (!this.hasClass(selector)) {
      this.element.className += ' ' + selector;
    }
  },

  attr: function(name, value){
    var e = this.element;
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
      this.element.textContent = value;
    }
    return this.element.textContent;
  },

  html: function(value) {
    if (isDefined(value)) {
      this.element.innerHTML = value;
    }
    return this.element.innerHTML;
  },

  parent: function() { return jqLite(this.element.parentNode);},
  isText: function() { return this.element.nodeType == Node.TEXT_NODE; },
  clone: function() { return jqLite(this.element.cloneNode(true)); }
};

///////////////////////////////////
//Compiler
//////////////////////////////////

function Compiler(markup, directives, widgets){
  this.markup = markup;
  this.directives = directives;
  this.widgets = widgets;
}

Compiler.prototype = {
  compile: function(rawElement) {
    rawElement = jqLite(rawElement);
    var template = this.templatize(rawElement) || new Template();
    return function(element, parentScope){
      var scope = new Scope(parentScope);
      scope.element = element;
      // todo return should be a scope with everything already set on it as element
      return {
        scope: scope,
        element:element,
        init: bind(template, template.init, element, scope)
      };
    };
  },

  templatize: function(element){
    var self = this,
        elementName = element.element.nodeName,
        widgets = self.widgets,
        widget = widgets[elementName],
        markup = self.markup,
        markupSize = markup.length,
        directives = self.directives,
        descend = true,
        exclusive = false,
        directiveQueue = [],
        template = new Template(),
        selfApi = {
          compile: bind(self, self.compile),
          reference:function(name) {return jqLite(document.createComment(name));},
          descend: function(value){ if(isDefined(value)) descend = value; return descend;}
        };

    if (widget) {
      template.addInit(widget.call(selfApi, element));
    } else {
      // process markup for text nodes only
      element.eachTextNode(function(textNode){
        for (var i = 0, text = textNode.text(); i < markupSize; i++) {
          markup[i].call(selfApi, text, textNode, element);
        }
      });

      // Process attributes/directives
      element.eachAttribute(function(name, value){
        var directive  = directives[name];
        if (!exclusive && directive) {
          if (directive.exclusive) {
            exclusive = true;
            directiveQueue = [];
          }
          directiveQueue.push(bindTry(selfApi, directive, value, element, errorHandlerFor(element)));
        }
      });

      // Execute directives
      foreach(directiveQueue, function(directive){
        template.addInit(directive());
      });

      // Process non text child nodes
      if (descend) {
        element.eachNode(function(child, i){
          template.addChild(i, self.templatize(child));
        });
      }
    }
    return template.empty() ? null : template;
  }
};
