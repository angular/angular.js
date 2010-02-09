function Binder(doc, widgetFactory, datastore, location, config) {
  this.doc = doc;
  this.location = location;
  this.datastore = datastore;
  this.anchor = {};
  this.widgetFactory = widgetFactory;
  this.config = config || {};
  this.updateListeners = [];
}

Binder.parseBindings = function(string) {
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
};

Binder.hasBinding = function(string) {
  var bindings = Binder.parseBindings(string);
  return bindings.length > 1 || Binder.binding(bindings[0]) !== null;
};

Binder.binding = function(string) {
  var binding = string.replace(/\n/gm, ' ').match(/^\{\{(.*)\}\}$/);
  return binding ? binding[1] : null;
};


Binder.prototype = {
  parseQueryString: function(query) {
    var params = {};
    query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,
        function (match, left, right) {
          if (left) params[decodeURIComponent(left)] = decodeURIComponent(right);
        });
    return params;
  },
  
  parseAnchor: function() {
    var self = this, url = this.location['get']() || "";
  
    var anchorIndex = url.indexOf('#');
    if (anchorIndex < 0) return;
    var anchor = url.substring(anchorIndex + 1);
  
    var anchorQuery = this.parseQueryString(anchor);
    foreach(self.anchor, function(newValue, key) {
      delete self.anchor[key];
    });
    foreach(anchorQuery, function(newValue, key) {
      self.anchor[key] = newValue;
    });
  },
  
  onUrlChange: function() {
    this.parseAnchor();
    this.updateView();
  },
  
  updateAnchor: function() {
    var url = this.location['get']() || "";
    var anchorIndex = url.indexOf('#');
    if (anchorIndex > -1)
      url = url.substring(0, anchorIndex);
    url += "#";
    var sep = '';
    for (var key in this.anchor) {
      var value = this.anchor[key];
      if (typeof value === 'undefined' || value === null) {
        delete this.anchor[key];
      } else {
        url += sep + encodeURIComponent(key);
        if (value !== true)
          url += "=" + encodeURIComponent(value);
        sep = '&';
      }
    }
    this.location['set'](url);
    return url;
  },
  
  updateView: function() {
    var start = new Date().getTime();
    var scope = jQuery(this.doc).scope();
    scope.clearInvalid();
    scope.updateView();
    var end = new Date().getTime();
    this.updateAnchor();
    foreach(this.updateListeners, function(fn) {fn();});
  },
  
  docFindWithSelf: function(exp){
    var doc = jQuery(this.doc);
    var selection = doc.find(exp);
    if (doc.is(exp)){
      selection = selection.andSelf();
    }
    return selection;
  },
  
  executeInit: function() {
    this.docFindWithSelf("[ng-init]").each(function() {
      var jThis = jQuery(this);
      var scope = jThis.scope();
      try {
        scope.eval(jThis.attr('ng-init'));
      } catch (e) {
        alert("EVAL ERROR:\n" + jThis.attr('ng-init') + '\n' + toJson(e, true));
      }
    });
  },
  
  entity: function (scope) {
    var self = this;
    this.docFindWithSelf("[ng-entity]").attr("ng-watch", function() {
      try {
        var jNode = jQuery(this);
        var decl = scope.entity(jNode.attr("ng-entity"), self.datastore);
        return decl + (jNode.attr('ng-watch') || "");
      } catch (e) {
        log(e);
        alert(e);
      }
    });
  },
  
  compile: function() {
    var jNode = jQuery(this.doc);
    if (this.config['autoSubmit']) {
      var submits = this.docFindWithSelf(":submit").not("[ng-action]");
      submits.attr("ng-action", "$save()");
      submits.not(":disabled").not("ng-bind-attr").attr("ng-bind-attr", '{disabled:"{{$invalidWidgets}}"}');
    }
    this.precompile(this.doc)(this.doc, jNode.scope(), "");
    this.docFindWithSelf("a[ng-action]").live('click', function (event) {
      var jNode = jQuery(this);
      var scope = jNode.scope();
      try {
        scope.eval(jNode.attr('ng-action'));
        jNode.removeAttr('ng-error');
        jNode.removeClass("ng-exception");
      } catch (e) {
        jNode.addClass("ng-exception");
        jNode.attr('ng-error', toJson(e, true));
      }
      scope.get('$updateView')();
      return false;
    });
  },
  
  translateBinding: function(node, parentPath, factories) {
    var path = parentPath.concat();
    var offset = path.pop();
    var parts = Binder.parseBindings(node.nodeValue);
    if (parts.length > 1 || Binder.binding(parts[0])) {
      var parent = node.parentNode;
      if (isLeafNode(parent)) {
        parent.setAttribute('ng-bind-template', node.nodeValue);
        factories.push({path:path, fn:function(node, scope, prefix) {
          return new BindUpdater(node, node.getAttribute('ng-bind-template'));
        }});
      } else {
        for (var i = 0; i < parts.length; i++) {
          var part = parts[i];
          var binding = Binder.binding(part);
          var newNode;
          if (binding) {
            newNode = document.createElement("span");
            var jNewNode = jQuery(newNode);
            jNewNode.attr("ng-bind", binding);
            if (i === 0) {
              factories.push({path:path.concat(offset + i), fn:this.ng_bind});
            }
          } else if (msie && part.charAt(0) == ' ') {
            newNode = document.createElement("span");
            newNode.innerHTML = '&nbsp;' + part.substring(1);
          } else {
            newNode = document.createTextNode(part);
          }
          parent.insertBefore(newNode, node);
        }
      }
      parent.removeChild(node);
    }
  },
  
  precompile: function(root) {
    var factories = [];
    this.precompileNode(root, [], factories);
    return function (template, scope, prefix) {
      var len = factories.length;
      for (var i = 0; i < len; i++) {
        var factory = factories[i];
        var node = template;
        var path = factory.path;
        for (var j = 0; j < path.length; j++) {
          node = node.childNodes[path[j]];
        }
        try {
          scope.addWidget(factory.fn(node, scope, prefix));
        } catch (e) {
          alert(e);
        }
      }
    };
  },
  
  precompileNode: function(node, path, factories) {
    var nodeType = node.nodeType;
    if (nodeType == Node.TEXT_NODE) {
      this.translateBinding(node, path, factories);
      return;
    } else if (nodeType != Node.ELEMENT_NODE && nodeType != Node.DOCUMENT_NODE) {
      return;
    }
  
    if (!node.getAttribute) return;
    var nonBindable = node.getAttribute('ng-non-bindable');
    if (nonBindable || nonBindable === "") return;
  
    var attributes = node.attributes;
    if (attributes) {
      var bindings = node.getAttribute('ng-bind-attr');
      node.removeAttribute('ng-bind-attr');
      bindings = bindings ? fromJson(bindings) : {};
      var attrLen = attributes.length;
      for (var i = 0; i < attrLen; i++) {
        var attr = attributes[i];
        var attrName = attr.name;
        // http://www.glennjones.net/Post/809/getAttributehrefbug.htm
        var attrValue = msie && attrName == 'href' ?
                        decodeURI(node.getAttribute(attrName, 2)) : attr.value;
        if (Binder.hasBinding(attrValue)) {
          bindings[attrName] = attrValue;
        }
      }
      var json = toJson(bindings);
      if (json.length > 2) {
        node.setAttribute("ng-bind-attr", json);
      }
    }
  
    if (!node.getAttribute) log(node);
    var repeaterExpression = node.getAttribute('ng-repeat');
    if (repeaterExpression) {
      node.removeAttribute('ng-repeat');
      var precompiled = this.precompile(node);
      var view = document.createComment("ng-repeat: " + repeaterExpression);
      var parentNode = node.parentNode;
      parentNode.insertBefore(view, node);
      parentNode.removeChild(node);
      function template(childScope, prefix, i) {
        var clone = jQuery(node).clone();
        clone.css('display', '');
        clone.attr('ng-repeat-index', "" + i);
        clone.data('scope', childScope);
        precompiled(clone[0], childScope, prefix + i + ":");
        return clone;
      }
      factories.push({path:path, fn:function(node, scope, prefix) {
        return new RepeaterUpdater(jQuery(node), repeaterExpression, template, prefix);
      }});
      return;
    }
  
    if (node.getAttribute('ng-eval')) factories.push({path:path, fn:this.ng_eval});
    if (node.getAttribute('ng-bind')) factories.push({path:path, fn:this.ng_bind});
    if (node.getAttribute('ng-bind-attr')) factories.push({path:path, fn:this.ng_bind_attr});
    if (node.getAttribute('ng-hide')) factories.push({path:path, fn:this.ng_hide});
    if (node.getAttribute('ng-show')) factories.push({path:path, fn:this.ng_show});
    if (node.getAttribute('ng-class')) factories.push({path:path, fn:this.ng_class});
    if (node.getAttribute('ng-class-odd')) factories.push({path:path, fn:this.ng_class_odd});
    if (node.getAttribute('ng-class-even')) factories.push({path:path, fn:this.ng_class_even});
    if (node.getAttribute('ng-style')) factories.push({path:path, fn:this.ng_style});
    if (node.getAttribute('ng-watch')) factories.push({path:path, fn:this.ng_watch});
    var nodeName = node.nodeName;
    if ((nodeName == 'INPUT' ) ||
        nodeName == 'TEXTAREA' ||
        nodeName == 'SELECT' ||
        nodeName == 'BUTTON') {
      var self = this;
      factories.push({path:path, fn:function(node, scope, prefix) {
        node.name = prefix + node.name.split(":").pop();
        return self.widgetFactory.createController(jQuery(node), scope);
      }});
    }
    if (nodeName == 'OPTION') {
      var html = jQuery('<select/>').append(jQuery(node).clone()).html();
      if (!html.match(/<option(\s.*\s|\s)value\s*=\s*.*>.*<\/\s*option\s*>/gi)) {
        node.value = node.text;
      }
    }
  
    var children = node.childNodes;
    for (var k = 0; k < children.length; k++) {
      this.precompileNode(children[k], path.concat(k), factories);
    }
  },
  
  ng_eval: function(node) {
    return new EvalUpdater(node, node.getAttribute('ng-eval'));
  },
  
  ng_bind: function(node) {
    return new BindUpdater(node, "{{" + node.getAttribute('ng-bind') + "}}");
  },
  
  ng_bind_attr: function(node) {
    return new BindAttrUpdater(node, fromJson(node.getAttribute('ng-bind-attr')));
  },
  
  ng_hide: function(node) {
    return new HideUpdater(node, node.getAttribute('ng-hide'));
  },
  
  ng_show: function(node) {
    return new ShowUpdater(node, node.getAttribute('ng-show'));
  },
  
  ng_class: function(node) {
    return new ClassUpdater(node, node.getAttribute('ng-class'));
  },
  
  ng_class_even: function(node) {
    return new ClassEvenUpdater(node, node.getAttribute('ng-class-even'));
  },
  
  ng_class_odd: function(node) {
    return new ClassOddUpdater(node, node.getAttribute('ng-class-odd'));
  },
  
  ng_style: function(node) {
    return new StyleUpdater(node, node.getAttribute('ng-style'));
  },
  
  ng_watch: function(node, scope) {
    scope.watch(node.getAttribute('ng-watch'));
  }
};