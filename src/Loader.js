// Copyright (C) 2008,2009 BRAT Tech LLC

// IE compatibility

if (typeof document.getAttribute == 'undefined')
  document.getAttribute = function() {
  };
if (typeof Node == 'undefined') {
  Node = {
    ELEMENT_NODE : 1,
    ATTRIBUTE_NODE : 2,
    TEXT_NODE : 3,
    CDATA_SECTION_NODE : 4,
    ENTITY_REFERENCE_NODE : 5,
    ENTITY_NODE : 6,
    PROCESSING_INSTRUCTION_NODE : 7,
    COMMENT_NODE : 8,
    DOCUMENT_NODE : 9,
    DOCUMENT_TYPE_NODE : 10,
    DOCUMENT_FRAGMENT_NODE : 11,
    NOTATION_NODE : 12
  };
}

if (_.isUndefined(window.nglr))       nglr = {};
if (_.isUndefined(window.angular))    angular = {};
if (_.isUndefined(angular.validator)) angular.validator = {};
if (_.isUndefined(angular.filter))    angular.filter = {};
if (_.isUndefined(window.console))
  window.console = {
    log:function() {},
    error:function() {}
  };
if (_.isUndefined(nglr.alert)) {
  nglr.alert = function(){console.log(arguments); window.alert.apply(window, arguments); };
}

nglr.consoleLog = function(level, objs) {
  var log = document.createElement("div");
  log.className = level;
  var msg = "";
  var sep = "";
  for ( var i = 0; i < objs.length; i++) {
    var obj = objs[i];
    msg += sep + (typeof obj == 'string' ? obj : nglr.toJson(obj));
    sep = " ";
  }
  log.appendChild(document.createTextNode(msg));
  nglr.consoleNode.appendChild(log);
};

nglr.isNode = function(inp) {
  return inp &&
      inp.tagName &&
      inp.nodeName &&
      inp.ownerDocument &&
      inp.removeAttribute;
};

nglr.isLeafNode = function(node) {
  switch (node.nodeName) {
  case "OPTION":
  case "PRE":
  case "TITLE":
    return true;
  default:
    return false;
  }
};

nglr.noop = function() {
};
nglr.setHtml = function(node, html) {
  if (nglr.isLeafNode(node)) {
    if (nglr.msie) {
      node.innerText = html;
    } else {
      node.textContent = html;
    }
  } else {
    node.innerHTML = html;
  }
};

nglr.escapeHtml = function(html) {
  if (!html || !html.replace)
    return html;
  return html.
      replace(/&/g, '&amp;').
      replace(/</g, '&lt;').
      replace(/>/g, '&gt;');
};

nglr.escapeAttr = function(html) {
  if (!html || !html.replace)
    return html;
  return html.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g,
      '&quot;');
};

nglr.bind = function(_this, _function) {
  if (!_this)
    throw "Missing this";
  if (!_.isFunction(_function))
    throw "Missing function";
  return function() {
    return _function.apply(_this, arguments);
  };
};

nglr.shiftBind = function(_this, _function) {
  return function() {
    var args = [ this ];
    for ( var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    return _function.apply(_this, args);
  };
};

nglr.outerHTML = function(node) {
  var temp = document.createElement('div');
  temp.appendChild(node);
  var outerHTML = temp.innerHTML;
  temp.removeChild(node);
  return outerHTML;
};

nglr.trim = function(str) {
  return str.replace(/^ */, '').replace(/ *$/, '');
};

nglr.toBoolean = function(value) {
  var v = ("" + value).toLowerCase();
  if (v == 'f' || v == '0' || v == 'false' || v == 'no')
    value = false;
  return !!value;
};

nglr.merge = function(src, dst) {
  for ( var key in src) {
    var value = dst[key];
    var type = typeof value;
    if (type == 'undefined') {
      dst[key] = nglr.fromJson(nglr.toJson(src[key]));
    } else if (type == 'object' && value.constructor != nglr.array &&
        key.substring(0, 1) != "$") {
      nglr.merge(src[key], value);
    }
  }
};

// ////////////////////////////
// Loader
// ////////////////////////////

nglr.Loader = function(document, head, config) {
  this.document = jQuery(document);
  this.head = jQuery(head);
  this.config = config;
  this.location = window.location;
};

nglr.Loader.prototype.load = function() {
  this.configureLogging();
  this.loadCss('/stylesheets/jquery-ui/smoothness/jquery-ui-1.7.1.css');
  this.loadCss('/stylesheets/nglr.css');
  console.log("Server: " + this.config.server);
  jQuery.noConflict();
  nglr.msie = jQuery.browser.msie;
  this.configureJQueryPlugins();
  this.computeConfiguration();
  this.bindHtml();
};

nglr.Loader.prototype.configureJQueryPlugins = function() {
  console.log('Loader.configureJQueryPlugins()');
  jQuery.fn.removeNode = function() {
    var node = this.get(0);
    node.parentNode.removeChild(node);
  };
  jQuery.fn.scope = function() {
    var element = this;
    while (element && element.get(0)) {
      var scope = element.data("scope");
      if (scope)
        return scope;
      element = element.parent();
    }
    return null;
  };
  jQuery.fn.controller = function() {
    return this.data('controller') || nglr.NullController.instance;
  };
};

nglr.Loader.prototype.uid = function() {
  return "" + new Date().getTime();
};

nglr.Loader.prototype.computeConfiguration = function() {
  var config = this.config;
  if (!config.database) {
    var match = config.server.match(/https?:\/\/([\w]*)/)
    config.database = match ? match[1] : "$MEMORY";
  }
};

nglr.Loader.prototype.bindHtml = function() {
  console.log('Loader.bindHtml()');
  var watcher = new nglr.UrlWatcher(this.location);
  var document = this.document;
  var widgetFactory = new nglr.WidgetFactory(this.config.server, this.config.database);
  var binder = new nglr.Binder(document[0], widgetFactory, watcher, this.config);
  widgetFactory.onChangeListener = nglr.shiftBind(binder, binder.updateModel);
  var controlBar = new nglr.ControlBar(document.find('body'), this.config.server, this.config.database);
  var onUpdate = function(){binder.updateView();};
  var server = this.config.database=="$MEMORY" ?
      new nglr.FrameServer(this.window) :
      new nglr.Server(this.config.server, jQuery.getScript);
  server = new nglr.VisualServer(server, new nglr.Status(jQuery(document.body)), onUpdate);
  var users = new nglr.Users(server, controlBar);
  var databasePath = '/data/' + this.config.database;
  var post = function(request, callback){
    server.request("POST", databasePath, request, callback);
  };
  var datastore = new nglr.DataStore(post, users, binder.anchor);
  binder.updateListeners.push(function(){datastore.flush();});
  var scope = new nglr.Scope( {
    $anchor : binder.anchor,
    $binder : binder,
    $config : this.config,
    $console : window.console,
    $datastore : datastore,
    $save : function(callback) {
      datastore.saveScope(scope.state, callback, binder.anchor);
    },
    $window : window,
    $uid : this.uid,
    $users : users
  }, "ROOT");

  jQuery.each(["get", "set", "eval", "addWatchListener", "updateView"],
    function(i, method){
      angular[method] = nglr.bind(scope, scope[method]);
    });

  document.data('scope', scope);
  console.log('$binder.entity()');
  binder.entity(scope);

  console.log('$binder.compile()');
  binder.compile();

  console.log('ControlBar.bind()');
  controlBar.bind();

  console.log('$users.fetchCurrentUser()');
  function fetchCurrentUser() {
    users.fetchCurrentUser(function(u) {
      if (!u && document.find("[ng-auth=eager]").length) {
        users.login();
      }
    });
  }
  fetchCurrentUser();

  console.log('PopUp.bind()');
  new nglr.PopUp(document).bind();

  console.log('$binder.parseAnchor()');
  binder.parseAnchor();

  console.log('$binder.executeInit()');
  binder.executeInit();

  console.log('$binder.updateView()');
  binder.updateView();

  watcher.listener = nglr.bind(binder, binder.onUrlChange, watcher);
  watcher.onUpdate = function(){nglr.alert("update");};
  watcher.watch();
  document.find("body").show();
  console.log('ready()');

};

nglr.Loader.prototype.visualPost = function(delegate) {
  var status = new nglr.Status(jQuery(document.body));
  return function(request, delegateCallback) {
    status.beginRequest(request);
    var callback = function() {
      status.endRequest();
      try {
        delegateCallback.apply(this, arguments);
      } catch (e) {
        nglr.alert(nglr.toJson(e));
      }
    };
    delegate(request, callback);
  };
};

nglr.Loader.prototype.configureLogging = function() {
  var url = window.location.href + '#';
  url = url.split('#')[1];
  var config = {
    debug : null
  };
  var configs = url.split('&');
  for ( var i = 0; i < configs.length; i++) {
    var part = (configs[i] + '=').split('=');
    config[part[0]] = part[1];
  }
  if (config.debug == 'console') {
    nglr.consoleNode = document.createElement("div");
    nglr.consoleNode.id = 'ng-console';
    document.getElementsByTagName('body')[0].appendChild(nglr.consoleNode);
    console.log = function() {
      nglr.consoleLog('ng-console-info', arguments);
    };
    console.error = function() {
      nglr.consoleLog('ng-console-error', arguments);
    };
  }
};

nglr.Loader.prototype.loadCss = function(css) {
  var cssTag = document.createElement('link');
  cssTag.rel = "stylesheet";
  cssTag.type = "text/css";
  if (!css.match(/^http:/))
    css = this.config.server + css;
  cssTag.href = css;
  this.head[0].appendChild(cssTag);
};

nglr.UrlWatcher = function(location) {
  this.location = location;
  this.delay = 25;
  this.setTimeout = function(fn, delay) {
    window.setTimeout(fn, delay);
  };
  this.listener = function(url) {
    return url;
  };
  this.expectedUrl = location.href;
};

nglr.UrlWatcher.prototype.watch = function() {
  var self = this;
  var pull = function() {
    if (self.expectedUrl !== self.location.href) {
      var notify = self.location.hash.match(/^#\$iframe_notify=(.*)$/);
      if (notify) {
        if (!self.expectedUrl.match(/#/)) {
          self.expectedUrl += "#";
        }
        self.location.href = self.expectedUrl;
        var id = '_iframe_notify_' + notify[1];
        var notifyFn = nglr[id];
        delete nglr[id];
        try {
          (notifyFn||nglr.noop)();
        } catch (e) {
          nglr.alert(e);
        }
      } else {
        self.listener(self.location.href);
        self.expectedUrl = self.location.href;
      }
    }
    self.setTimeout(pull, self.delay);
  };
  pull();
};

nglr.UrlWatcher.prototype.setUrl = function(url) {
  var existingURL = window.location.href;
  if (!existingURL.match(/#/))
    existingURL += '#';
  if (existingURL != url)
    window.location.href = url;
  self.existingURL = url;
};

nglr.UrlWatcher.prototype.getUrl = function() {
  return window.location.href;
};
