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
      scope.apply(fn, nodeLite(element));
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
    this.paths.push(index);
    this.children.push(template);
  },

  empty: function() {
    return this.inits.length == 0 && this.paths.length == 0;
  }
};

///////////////////////////////////
//NodeLite
//////////////////////////////////

function NodeLite(element) {
  this.element = element;
}

function nodeLite(element) {
  return element instanceof NodeLite ? element : new NodeLite(element);
}

NodeLite.prototype = {
  eachTextNode: function(fn){
    var i, chldNodes = this.element.childNodes || [], size = chldNodes.length, chld;
    for (i = 0; i < size; i++) {
      if((chld = new NodeLite(chldNodes[i])).isText()) {
        fn(chld, i);
      }
    }
  },

  eachNode: function(fn){
    var i, chldNodes = this.element.childNodes || [], size = chldNodes.length, chld;
    for (i = 0; i < size; i++) {
      if(!(chld = new NodeLite(chldNodes[i])).isText()) {
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
    this.element.parentNode.replaceChild(nodeLite(replaceNode).element, this.element);
  },

  removeAttribute: function(name) {
    this.element.removeAttribute(name);
  },

  after: function(element) {
    this.element.parentNode.insertBefore(nodeLite(element).element, this.element.nextSibling);
  },

  attr: function(name, value){
    if (isDefined(value)) {
      this.element.setAttribute(name, value);
    } else {
      return this.element.getAttribute(name);
    }
  },

  text: function(value) {
    if (isDefined(value)) {
      this.element.nodeValue = value;
    }
    return this.element.nodeValue;
  },

  isText: function() { return this.element.nodeType == Node.TEXT_NODE; },
  clone: function() { return nodeLite(this.element.cloneNode(true)); }
};

///////////////////////////////////
//Compiler
//////////////////////////////////

function Compiler(markup, directives, widgets){
  this.markup = markup;
  this.directives = directives;
  this.widgets = widgets;
}

DIRECTIVE = /^ng-(.*)$/;

Compiler.prototype = {
  compile: function(element) {
    var template = this.templetize(nodeLite(element)) || new Template();
    return function(element){
      var scope = new Scope();
      scope.element = element;
      return {
        scope: scope,
        element:element,
        init: bind(template, template.init, element, scope)
      };
    };
  },

  templetize: function(element){
    var self = this,
        markup = self.markup,
        markupSize = markup.length,
        directives = self.directives,
        widgets = self.widgets,
        recurse = true,
        exclusive = false,
        directiveQueue = [],
        template = new Template();

    // process markup for text nodes only
    element.eachTextNode(function(textNode){
      for (var i = 0, text = textNode.text(); i < markupSize; i++) {
        markup[i].call(self, text, textNode, element);
      }
    });

    // Process attributes/directives
    element.eachAttribute(function(name, value){
      var match = name.match(DIRECTIVE),
          directive;
      if (!exclusive && match) {
        directive = directives[match[1]];
        if (directive) {
          if (directive.exclusive) {
            exclusive = true;
            directiveQueue = [];
          }
          directiveQueue.push(bind(self, directive, value, element));
        } else {
          error("Directive '" + match[0] + "' is not recognized.");
        }
      }
    });

    // Execute directives
    foreach(directiveQueue, function(directive){
      var init = directive();
      template.addInit(init);
      recurse = recurse && init;
    });

    // Process non text child nodes
    if (recurse) {
      element.eachNode(function(child, i){
        var childTemplate = self.templetize(child);
        if(childTemplate) {
          template.addChild(i, childTemplate);
        }
      });
    }
    return template.empty() ? null : template;
  }
};
