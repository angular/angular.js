// Copyright (C) 2009 BRAT Tech LLC
nglr.Binder = function(doc, widgetFactory, urlWatcher, config) {
  this.doc = doc;
  this.urlWatcher = urlWatcher;
  this.anchor = {};
  this.widgetFactory = widgetFactory;
  this.config = config || {};
  this.updateListeners = [];
};

nglr.Binder.parseBindings = function(string) {
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

nglr.Binder.hasBinding = function(string) {
  var bindings = nglr.Binder.parseBindings(string);
  return bindings.length > 1 || nglr.Binder.binding(bindings[0]) !== null;
};

nglr.Binder.binding = function(string) {
  var binding = string.replace(/\n/gm, ' ').match(/^\{\{(.*)\}\}$/);
  return binding ? binding[1] : null;
};


nglr.Binder.prototype.parseQueryString = function(query) {
  var params = {};
  query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,
      function (match, left, right) {
        if (left) params[decodeURIComponent(left)] = decodeURIComponent(right);
      });
  return params;
};

nglr.Binder.prototype.parseAnchor = function(url) {
  var self = this;
  url = url || this.urlWatcher.getUrl();

  var anchorIndex = url.indexOf('#');
  if (anchorIndex < 0) return;
  var anchor = url.substring(anchorIndex + 1);

  var anchorQuery = this.parseQueryString(anchor);
  jQuery.each(self.anchor, function(key, newValue) {
    delete self.anchor[key];
  });
  jQuery.each(anchorQuery, function(key, newValue) {
    self.anchor[key] = newValue;
  });
};

nglr.Binder.prototype.onUrlChange = function (url) {
  console.log("URL change detected", url);
  this.parseAnchor(url);
  this.updateView();
};

nglr.Binder.prototype.updateAnchor = function() {
  var url = this.urlWatcher.getUrl();
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
  this.urlWatcher.setUrl(url);
  return url;
};

nglr.Binder.prototype.updateView = function() {
  var start = new Date().getTime();
  var scope = jQuery(this.doc).scope();
  scope.set("$invalidWidgets", []);
  scope.updateView();
  var end = new Date().getTime();
  this.updateAnchor();
  _.each(this.updateListeners, function(fn) {fn();});
};

nglr.Binder.prototype.executeInit = function() {
  jQuery("[ng-init]", this.doc).each(function() {
    var jThis = jQuery(this);
    var scope = jThis.scope();
    try {
      scope.eval(jThis.attr('ng-init'));
    } catch (e) {
      nglr.alert("EVAL ERROR:\n" + jThis.attr('ng-init') + '\n' + nglr.toJson(e, true));
    }
  });
};

nglr.Binder.prototype.entity = function (scope) {
  jQuery("[ng-entity]", this.doc).attr("ng-watch", function() {
    try {
      var jNode = jQuery(this);
      var decl = scope.entity(jNode.attr("ng-entity"));
      return decl + (jNode.attr('ng-watch') || "");
    } catch (e) {
      nglr.alert(e);
    }
  });
};

nglr.Binder.prototype.compile = function() {
  var jNode = jQuery(this.doc);
  var self = this;
  if (this.config.autoSubmit) {
    var submits = jQuery(":submit", this.doc).not("[ng-action]");
    submits.attr("ng-action", "$save()");
    submits.not(":disabled").not("ng-bind-attr").attr("ng-bind-attr", '{disabled:"{{$invalidWidgets}}"}');
  }
  this.precompile(this.doc)(this.doc, jNode.scope(), "");
  jQuery("a[ng-action]", this.doc).live('click', function (event) {
    var jNode = jQuery(this);
    try {
      jNode.scope().eval(jNode.attr('ng-action'));
      jNode.removeAttr('ng-error');
      jNode.removeClass("ng-exception");
    } catch (e) {
      jNode.addClass("ng-exception");
      jNode.attr('ng-error', nglr.toJson(e, true));
    }
    self.updateView();
    return false;
  });
};

nglr.Binder.prototype.translateBinding = function(node, parentPath, factories) {
  var path = parentPath.concat();
  var offset = path.pop();
  var parts = nglr.Binder.parseBindings(node.nodeValue);
  if (parts.length > 1 || nglr.Binder.binding(parts[0])) {
    var parent = node.parentNode;
    if (nglr.isLeafNode(parent)) {
      parent.setAttribute('ng-bind-template', node.nodeValue);
      factories.push({path:path, fn:function(node, scope, prefix) {
        return new nglr.BindUpdater(node, node.getAttribute('ng-bind-template'));
      }});
    } else {
      for (var i = 0; i < parts.length; i++) {
        var part = parts[i];
        var binding = nglr.Binder.binding(part);
        var newNode;
        if (binding) {
          newNode = document.createElement("span");
          var jNewNode = jQuery(newNode);
          jNewNode.attr("ng-bind", binding);
          if (i === 0) {
            factories.push({path:path.concat(offset + i), fn:nglr.Binder.prototype.ng_bind});
          }
        } else if (nglr.msie && part.charAt(0) == ' ') {
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
};

nglr.Binder.prototype.precompile = function(root) {
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
        nglr.alert(e);
      }
    }
  };
};

nglr.Binder.prototype.precompileNode = function(node, path, factories) {
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
    bindings = bindings ? nglr.fromJson(bindings) : {};
    var attrLen = attributes.length;
    for (var i = 0; i < attrLen; i++) {
      var attr = attributes[i];
      var attrName = attr.name;
      // http://www.glennjones.net/Post/809/getAttributehrefbug.htm
      var attrValue = nglr.msie && attrName == 'href' ?
                      decodeURI(node.getAttribute(attrName, 2)) : attr.value;
      if (nglr.Binder.hasBinding(attrValue)) {
        bindings[attrName] = attrValue;
      }
    }
    var json = nglr.toJson(bindings);
    if (json.length > 2) {
      node.setAttribute("ng-bind-attr", json);
    }
  }

  if (!node.getAttribute) console.log(node);
  var repeaterExpression = node.getAttribute('ng-repeat');
  if (repeaterExpression) {
    node.removeAttribute('ng-repeat');
    var precompiled = this.precompile(node);
    var view = document.createComment("ng-repeat: " + repeaterExpression);
    var parentNode = node.parentNode;
    parentNode.insertBefore(view, node);
    parentNode.removeChild(node);
    var template = function(childScope, prefix, i) {
      var clone = jQuery(node).clone();
      clone.css('display', '');
      clone.attr('ng-repeat-index', "" + i);
      clone.data('scope', childScope);
      precompiled(clone[0], childScope, prefix + i + ":");
      return clone;
    };
    factories.push({path:path, fn:function(node, scope, prefix) {
      return new nglr.RepeaterUpdater(jQuery(node), repeaterExpression, template, prefix);
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
};

nglr.Binder.prototype.ng_eval = function(node) {
  return new nglr.EvalUpdater(node, node.getAttribute('ng-eval'));
};

nglr.Binder.prototype.ng_bind = function(node) {
  return new nglr.BindUpdater(node, "{{" + node.getAttribute('ng-bind') + "}}");
};

nglr.Binder.prototype.ng_bind_attr = function(node) {
  return new nglr.BindAttrUpdater(node, nglr.fromJson(node.getAttribute('ng-bind-attr')));
};

nglr.Binder.prototype.ng_hide = function(node) {
  return new nglr.HideUpdater(node, node.getAttribute('ng-hide'));
};

nglr.Binder.prototype.ng_show = function(node) {
  return new nglr.ShowUpdater(node, node.getAttribute('ng-show'));
};

nglr.Binder.prototype.ng_class = function(node) {
  return new nglr.ClassUpdater(node, node.getAttribute('ng-class'));
};

nglr.Binder.prototype.ng_class_even = function(node) {
  return new nglr.ClassEvenUpdater(node, node.getAttribute('ng-class-even'));
};

nglr.Binder.prototype.ng_class_odd = function(node) {
  return new nglr.ClassOddUpdater(node, node.getAttribute('ng-class-odd'));
};

nglr.Binder.prototype.ng_style = function(node) {
  return new nglr.StyleUpdater(node, node.getAttribute('ng-style'));
};

nglr.Binder.prototype.ng_watch = function(node, scope) {
  scope.watch(node.getAttribute('ng-watch'));
};
