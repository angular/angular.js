/**
 * Template provides directions an how to bind to a given element.
 * It contains a list of init functions which need to be called to
 * bind to a new instance of elements. It also provides a list
 * of child paths which contain child templates
 */
function Template(priority) {
  this.paths = [];
  this.children = [];
  this.inits = [];
  this.priority = priority;
  this.newScope = false;
}

Template.prototype = {
  attach: function(element, scope) {
    var inits = {};
    this.collectInits(element, inits, scope);
    forEachSorted(inits, function(queue){
      forEach(queue, function(fn) {fn();});
    });
  },

  collectInits: function(element, inits, scope) {
    var queue = inits[this.priority], childScope = scope;
    if (!queue) {
      inits[this.priority] = queue = [];
    }
    element = jqLite(element);
    if (this.newScope) {
      childScope = createScope(scope);
      scope.$onEval(childScope.$eval);
      element.data($$scope, childScope);
    }
    forEach(this.inits, function(fn) {
      queue.push(function() {
        childScope.$tryEval(function(){
          return childScope.$service(fn, childScope, element);
        }, element);
      });
    });
    var i,
        childNodes = element[0].childNodes,
        children = this.children,
        paths = this.paths,
        length = paths.length;
    for (i = 0; i < length; i++) {
      children[i].collectInits(childNodes[paths[i]], inits, childScope);
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
function Compiler(markup, attrMarkup, directives, widgets){
  this.markup = markup;
  this.attrMarkup = attrMarkup;
  this.directives = directives;
  this.widgets = widgets;
}

Compiler.prototype = {
  compile: function(templateElement) {
    templateElement = jqLite(templateElement);
    var index = 0,
        template,
        parent = templateElement.parent();
    if (parent && parent[0]) {
      parent = parent[0];
      for(var i = 0; i < parent.childNodes.length; i++) {
        if (parent.childNodes[i] == templateElement[0]) {
          index = i;
        }
      }
    }
    template = this.templatize(templateElement, index, 0) || new Template();
    return function(scope, element){
      scope = scope || createScope();
      element = element === true
        ? templateElement.cloneNode()
        : (jqLite(element) || templateElement);
      element.data($$scope, scope);
      template.attach(element, scope);
      scope.$element = element;
      scope.$eval();
      return {scope:scope, view:element};
    };
  },


  /**
   * @workInProgress
   * @ngdoc directive
   * @name angular.directive.ng:eval-order
   *
   * @description
   * Normally the view is updated from top to bottom. This usually is
   * not a problem, but under some circumstances the values for data
   * is not available until after the full view is computed. If such
   * values are needed before they are computed the order of
   * evaluation can be change using ng:eval-order
   *
   * @element ANY
   * @param {integer|string=} [priority=0] priority integer, or FIRST, LAST constant
   *
   * @example
   * try changing the invoice and see that the Total will lag in evaluation
   * @example
     <doc:example>
       <doc:source>
        <div>TOTAL: without ng:eval-order {{ items.$sum('total') | currency }}</div>
        <div ng:eval-order='LAST'>TOTAL: with ng:eval-order {{ items.$sum('total') | currency }}</div>
        <table ng:init="items=[{qty:1, cost:9.99, desc:'gadget'}]">
          <tr>
            <td>QTY</td>
            <td>Description</td>
            <td>Cost</td>
            <td>Total</td>
            <td></td>
          </tr>
          <tr ng:repeat="item in items">
            <td><input name="item.qty"/></td>
            <td><input name="item.desc"/></td>
            <td><input name="item.cost"/></td>
            <td>{{item.total = item.qty * item.cost | currency}}</td>
            <td><a href="" ng:click="items.$remove(item)">X</a></td>
          </tr>
          <tr>
            <td colspan="3"><a href="" ng:click="items.$add()">add</a></td>
            <td>{{ items.$sum('total') | currency }}</td>
          </tr>
        </table>
       </doc:source>
       <doc:scenario>
         it('should check ng:format', function(){
           expect(using('.doc-example-live div:first').binding("items.$sum('total')")).toBe('$9.99');
           expect(using('.doc-example-live div:last').binding("items.$sum('total')")).toBe('$9.99');
           input('item.qty').enter('2');
           expect(using('.doc-example-live div:first').binding("items.$sum('total')")).toBe('$9.99');
           expect(using('.doc-example-live div:last').binding("items.$sum('total')")).toBe('$19.98');
         });
       </doc:scenario>
     </doc:example>
   */

  templatize: function(element, elementIndex, priority){
    var self = this,
        widget,
        fn,
        directiveFns = self.directives,
        descend = true,
        directives = true,
        elementName = nodeName_(element),
        template,
        selfApi = {
          compile: bind(self, self.compile),
          descend: function(value){ if(isDefined(value)) descend = value; return descend;},
          directives: function(value){ if(isDefined(value)) directives = value; return directives;},
          scope: function(value){ if(isDefined(value)) template.newScope = template.newScope || value; return template.newScope;}
        };
    try {
      priority = element.attr('ng:eval-order') || priority || 0;
    } catch (e) {
      // for some reason IE throws error under some weird circumstances. so just assume nothing
      priority = priority || 0;
    }
    if (isString(priority)) {
      priority = PRIORITY[uppercase(priority)] || parseInt(priority, 10);
    }
    template = new Template(priority);
    eachAttribute(element, function(value, name){
      if (!widget) {
        if (widget = self.widgets('@' + name)) {
          element.addClass('ng-attr-widget');
          widget = bind(selfApi, widget, value, element);
        }
      }
    });
    if (!widget) {
      if (widget = self.widgets(elementName)) {
        if (elementName.indexOf(':') > 0)
          element.addClass('ng-widget');
        widget = bind(selfApi, widget, element);
      }
    }
    if (widget) {
      descend = false;
      directives = false;
      var parent = element.parent();
      template.addInit(widget.call(selfApi, element));
      if (parent && parent[0]) {
        element = jqLite(parent[0].childNodes[elementIndex]);
      }
    }
    if (descend){
      // process markup for text nodes only
      for(var i=0, child=element[0].childNodes;
          i<child.length; i++) {
        if (isTextNode(child[i])) {
          forEach(self.markup, function(markup){
            if (i<child.length) {
              var textNode = jqLite(child[i]);
              markup.call(selfApi, textNode.text(), textNode, element);
            }
          });
        }
      }
    }

    if (directives) {
      // Process attributes/directives
      eachAttribute(element, function(value, name){
        forEach(self.attrMarkup, function(markup){
          markup.call(selfApi, value, name, element);
        });
      });
      eachAttribute(element, function(value, name){
        fn = directiveFns[name];
        if (fn) {
          element.addClass('ng-directive');
          template.addInit((directiveFns[name]).call(selfApi, value, element));
        }
      });
    }
    // Process non text child nodes
    if (descend) {
      eachNode(element, function(child, i){
        template.addChild(i, self.templatize(child, i, priority));
      });
    }
    return template.empty() ? _null : template;
  }
};

function eachNode(element, fn){
  var i, chldNodes = element[0].childNodes || [], chld;
  for (i = 0; i < chldNodes.length; i++) {
    if(!isTextNode(chld = chldNodes[i])) {
      fn(jqLite(chld), i);
    }
  }
}

function eachAttribute(element, fn){
  var i, attrs = element[0].attributes || [], chld, attr, name, value, attrValue = {};
  for (i = 0; i < attrs.length; i++) {
    attr = attrs[i];
    name = attr.name;
    value = attr.value;
    if (msie && name == 'href') {
      value = decodeURIComponent(element[0].getAttribute(name, 2));
    }
    attrValue[name] = value;
  }
  forEachSorted(attrValue, fn);
}

