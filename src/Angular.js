if (typeof document.getAttribute == 'undefined')
  document.getAttribute = function() {};
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

function noop() {}
function identity($) {return $;}
if (!window['console']) window['console']={'log':noop, 'error':noop};

function extension(angular, name) {
  var extPoint;
  return angular[name] || (extPoint = angular[name] = function (name, fn, prop){
    if (isDefined(fn)) {
      extPoint[name] = extend(fn, prop || {});
    }
    return extPoint[name];
  });
}

var consoleNode, msie,
    jQuery           = window['jQuery'] || window['$'], // weirdness to make IE happy
    foreach          = _.each,
    extend           = _.extend,
    slice            = Array.prototype.slice,
    angular          = window['angular']    || (window['angular']    = {}),
    angularDirective = extension(angular, 'directive'),
    angularMarkup    = extension(angular, 'markup'),
    angularWidget    = extension(angular, 'widget'),
    angularValidator = extension(angular, 'validator'),
    angularFilter    = extension(angular, 'filter'),
    angularFormatter = extension(angular, 'formatter'),
    angularCallbacks = extension(angular, 'callbacks'),
    angularAlert     = angular['alert']     || (angular['alert']     = function(){
        log(arguments); window.alert.apply(window, arguments);
      });
angular['copy'] = copy;

var isVisible = isVisible || function (element) {
  return jQuery(element).is(":visible");
};

function isDefined(value){
  return typeof value != 'undefined';
}

function isObject(value){
  return typeof value == 'object';
}

function isFunction(value){
  return typeof value == 'function';
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

function isNode(inp) {
  return inp &&
      inp.tagName &&
      inp.nodeName &&
      inp.ownerDocument &&
      inp.removeAttribute;
}

function isLeafNode (node) {
  switch (node.nodeName) {
  case "OPTION":
  case "PRE":
  case "TITLE":
    return true;
  default:
    return false;
  }
}

function copy(source, destination){
  if (!destination) {
    if (!source) {
      return source;
    } else if (_.isArray(source)) {
      return copy(source, []);
    } else {
      return copy(source, {});
    }
  } else {
    if (_.isArray(source)) {
      while(destination.length) {
        destination.pop();
      }
    } else {
      _(destination).each(function(value, key){
        delete destination[key];
      });
    }
    return $.extend(true, destination, source);
  }
};

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

function escapeAttr(html) {
  if (!html || !html.replace)
    return html;
  return html.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g,
      '&quot;');
}

function bind(_this, _function) {
  var curryArgs = slice.call(arguments, 2, arguments.length);
  if (!_this)
    throw "Missing this";
  if (!_.isFunction(_function))
    throw "Missing function";
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

function trim(str) {
  return str.replace(/^ */, '').replace(/ *$/, '');
}

function toBoolean(value) {
  var v = ("" + value).toLowerCase();
  if (v == 'f' || v == '0' || v == 'false' || v == 'no')
    value = false;
  return !!value;
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

// ////////////////////////////
// UrlWatcher
// ////////////////////////////

function UrlWatcher(location) {
  this.location = location;
  this.delay = 25;
  this.setTimeout = function(fn, delay) {
    window.setTimeout(fn, delay);
  };
  this.listener = function(url) {
    return url;
  };
  this.expectedUrl = location.href;
}

UrlWatcher.prototype = {
  listen: function(fn){
    this.listener = fn;
  },
  watch: function() {
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
          var notifyFn = angularCallbacks[id];
          delete angularCallbacks[id];
          try {
            (notifyFn||noop)();
          } catch (e) {
            alert(e);
          }
        } else {
          self.listener(self.location.href);
          self.expectedUrl = self.location.href;
        }
      }
      self.setTimeout(pull, self.delay);
    };
    pull();
  },

  set: function(url) {
    var existingURL = this.location.href;
    if (!existingURL.match(/#/))
      existingURL += '#';
    if (existingURL != url)
      this.location.href = url;
    this.existingURL = url;
  },

  get: function() {
    return window.location.href;
  }
};

/////////////////////////////////////////////////
function configureJQueryPlugins() {
  var fn = jQuery['fn'];
  fn['scope'] = function() {
    var element = this;
    while (element && element.get(0)) {
      var scope = element.data("scope");
      if (scope)
        return scope;
      element = element.parent();
    }
    return null;
  };
  fn['controller'] = function() {
    return this.data('controller') || NullController.instance;
  };
}

function configureLogging(config) {
  if (config.debug == 'console' && !consoleNode) {
    consoleNode = document.createElement("div");
    consoleNode.id = 'ng-console';
    document.getElementsByTagName('body')[0].appendChild(consoleNode);
    log = function() {
      consoleLog('ng-console-info', arguments);
    };
    console.error = function() {
      consoleLog('ng-console-error', arguments);
    };
  }
}

function exposeMethods(obj, methods){
  var bound = {};
  foreach(methods, function(fn, name){
    bound[name] = _(fn).bind(obj);
  });
  return bound;
}

function wireAngular(element, config) {
  var widgetFactory = new WidgetFactory(config['server'], config['database']);
  var binder = new Binder(element[0], widgetFactory, datastore, config['location'], config);
  binder.updateListeners.push(config.onUpdateView);
  var controlBar = new ControlBar(element.find('body'), config['server'], config['database']);
  var onUpdate = function(){binder.updateView();};
  var server = config['database'] =="$MEMORY" ?
      new FrameServer(window) :
      new Server(config['server'], jQuery['getScript']);
  server = new VisualServer(server, new NullStatus(element.find('body')), onUpdate);
  var users = new Users(server, controlBar);
  var databasePath = '/data/' + config['database'];
  var post = function(request, callback){
    server.request("POST", databasePath, request, callback);
  };
  var datastore = new DataStore(post, users, binder.anchor);
  binder.datastore = datastore;
  binder.updateListeners.push(function(){datastore.flush();});
  var scope = new Scope({
    '$anchor'    : binder.anchor,
    '$updateView': _(binder.updateView).bind(binder),
    '$config'    : config,
    '$invalidWidgets': [],
    '$console'   : window.console,
    '$datastore' : exposeMethods(datastore, {
      'load':                    datastore.load,
      'loadMany':                datastore.loadMany,
      'loadOrCreate':            datastore.loadOrCreate,
      'loadAll':                 datastore.loadAll,
      'save':                    datastore.save,
      'remove':                  datastore.remove,
      'flush':                   datastore.flush,
      'query':                   datastore.query,
      'entity':                  datastore.entity,
      'entities':                datastore.entities,
      'documentCountsByUser':    datastore.documentCountsByUser,
      'userDocumentIdsByEntity': datastore.userDocumentIdsByEntity,
      'join':                    datastore.join
    }),
    '$save' : function(callback) {
      datastore.saveScope(scope.state, callback, binder.anchor);
    },
    '$window' : window,
    '$uid' : function() {
      return "" + new Date().getTime();
    },
    '$users' : users
  }, "ROOT");

  element.data('scope', scope);
  binder.entity(scope);
  binder.compile();
  controlBar.bind();

  //TODO: remove this code
  new PopUp(element).bind();

  var self = _(exposeMethods(scope, {
    'set':        scope.set,
    'get':        scope.get,
    'eval':       scope.eval
  })).extend({
    'init':function(){
        config['location']['listen'](_(binder.onUrlChange).bind(binder));
        binder.parseAnchor();
        binder.executeInit();
        binder.updateView();
        return self;
      },
    'element':element[0],
    'updateView': _(binder.updateView).bind(binder),
    'config':config
  });
  return self;
}

angular['startUrlWatcher'] = function(){
  var watcher = new UrlWatcher(window['location']);
  watcher.watch();
  return exposeMethods(watcher, {'listen':watcher.listen, 'set':watcher.set, 'get':watcher.get});
};

angular['compile'] = function(element, config) {
  jQuery = window['jQuery'];
  msie   = jQuery['browser']['msie'];
  config = _({
      'onUpdateView': noop,
      'server': "",
      'location': {'get':noop, 'set':noop, 'listen':noop}
    }).extend(config||{});

  configureLogging(config);
  configureJQueryPlugins();

  return wireAngular(jQuery(element), config);
};
