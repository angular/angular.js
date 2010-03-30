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
    return this.inits.length == 0 && this.paths.length == 0;
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
      parentScope = parentScope || {};
      var scope = createScope(parentScope);
      parentScope.$root = parentScope.$root || scope;
      return extend(scope, {
        $element:element,
        $init: function() {
          template.init(element, scope);
          scope.$eval();
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
  var i, chldNodes = element[0].childNodes || [], size = chldNodes.length, chld;
  for (i = 0; i < size; i++) {
    if(isTextNode(chld = chldNodes[i])) {
      fn(jqLite(chld), i);
    }
  }
}

function eachNode(element, fn){
  var i, chldNodes = element[0].childNodes || [], size = chldNodes.length, chld;
  for (i = 0; i < size; i++) {
    if(!isTextNode(chld = chldNodes[i])) {
      fn(jqLite(chld), i);
    }
  }
}

function eachAttribute(element, fn){
  var i, attrs = element[0].attributes || [], size = attrs.length, chld, attr, attrValue = {};
  for (i = 0; i < size; i++) {
    var attr = attrs[i];
    attrValue[attr.name] = attr.value;
  }
  foreach(attrValue, fn);
}

