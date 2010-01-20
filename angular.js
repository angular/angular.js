/**
 * The MIT License
 * 
 * Copyright (c) 2010 Adam Abrons and Misko Hevery http://getangular.com
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
(function(window, document){
/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/

var Base64 = {

	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",

	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}

		return output;
	},

	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);

		return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while ( i < utftext.length ) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}

		return string;
	}

};if (typeof document.getAttribute == 'undefined')
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
if (!window['console']) window['console']={'log':noop, 'error':noop};

var consoleNode,
    foreach          = _.each,
    extend           = _.extend,
    jQuery           = window['jQuery'],
    msie             = jQuery['browser']['msie'],
    angular          = window['angular']    || (window['angular']    = {}), 
    angularValidator = angular['validator'] || (angular['validator'] = {}), 
    angularFilter    = angular['filter']    || (angular['filter']    = {}), 
    angularCallbacks = angular['callbacks'] || (angular['callbacks'] = {}),
    angularAlert     = angular['alert']     || (angular['alert']     = function(){
        log(arguments); window.alert.apply(window, arguments); 
      });

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
  if (!_this)
    throw "Missing this";
  if (!_.isFunction(_function))
    throw "Missing function";
  return function() {
    return _function.apply(_this, arguments);
  };
}

function shiftBind(_this, _function) {
  return function() {
    var args = [ this ];
    for ( var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    return _function.apply(_this, args);
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
// Angular
// ////////////////////////////

function Angular(document, head, config) {
  this.document = jQuery(document);
  this.head = jQuery(head);
  this.config = config;
  this.location = window.location;
}

Angular.prototype = {
  load: function() {
    this.configureLogging();
    log("Server: " + this.config.server);
    this.configureJQueryPlugins();
    this.computeConfiguration();
    this.bindHtml();
  },
  
  configureJQueryPlugins: function() {
    log('Angular.configureJQueryPlugins()');
    jQuery['fn']['scope'] = function() {
      var element = this;
      while (element && element.get(0)) {
        var scope = element.data("scope");
        if (scope)
          return scope;
        element = element.parent();
      }
      return null;
    };
    jQuery['fn']['controller'] = function() {
      return this.data('controller') || NullController.instance;
    };
  },
  
  uid: function() {
    return "" + new Date().getTime();
  },
  
  computeConfiguration: function() {
    var config = this.config;
    if (!config.database) {
      var match = config.server.match(/https?:\/\/([\w]*)/);
      config.database = match ? match[1] : "$MEMORY";
    }
  },
  
  bindHtml: function() {
    log('Angular.bindHtml()');
    var watcher = this.watcher = new UrlWatcher(this.location);
    var document = this.document;
    var widgetFactory = new WidgetFactory(this.config.server, this.config.database);
    var binder = new Binder(document[0], widgetFactory, watcher, this.config);
    widgetFactory.onChangeListener = shiftBind(binder, binder.updateModel);
    var controlBar = new ControlBar(document.find('body'), this.config.server);
    var onUpdate = function(){binder.updateView();};
    var server = this.config.database=="$MEMORY" ?
        new FrameServer(this.window) :
        new Server(this.config.server, jQuery.getScript);
    server = new VisualServer(server, new Status(jQuery(document.body)), onUpdate);
    var users = new Users(server, controlBar);
    var databasePath = '/data/' + this.config.database;
    var post = function(request, callback){
      server.request("POST", databasePath, request, callback);
    };
    var datastore = new DataStore(post, users, binder.anchor);
    binder.updateListeners.push(function(){datastore.flush();});
    var scope = new Scope( {
      '$anchor' : binder.anchor,
      '$binder' : binder,
      '$config' : this.config,
      '$console' : window.console,
      '$datastore' : datastore,
      '$save' : function(callback) {
        datastore.saveScope(scope.state, callback, binder.anchor);
      },
      '$window' : window,
      '$uid' : this.uid,
      '$users' : users
    }, "ROOT");
  
    document.data('scope', scope);
    log('$binder.entity()');
    binder.entity(scope);
  
    log('$binder.compile()');
    binder.compile();
  
    log('ControlBar.bind()');
    controlBar.bind();
  
    log('$users.fetchCurrentUser()');
    function fetchCurrentUser() {
      users.fetchCurrentUser(function(u) {
        if (!u && document.find("[ng-auth=eager]").length) {
          users.login();
        }
      });
    }
    fetchCurrentUser();
  
    log('PopUp.bind()');
    new PopUp(document).bind();
  
    log('$binder.parseAnchor()');
    binder.parseAnchor();
    
    document.find("body").show();
    log('ready()');
  },
  
  visualPost: function(delegate) {
    var status = new Status(jQuery(document.body));
    return function(request, delegateCallback) {
      status.beginRequest(request);
      var callback = function() {
        status.endRequest();
        try {
          delegateCallback.apply(this, arguments);
        } catch (e) {
          alert(toJson(e));
        }
      };
      delegate(request, callback);
    };
  },
  
  configureLogging: function() {
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
};

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
  
  setUrl: function(url) {
    //TODO: conditionaly?
    var existingURL = window.location.href;
    if (!existingURL.match(/#/))
      existingURL += '#';
    if (existingURL != url)
      window.location.href = url;
    this.existingURL = url;
  },
  
  getUrl: function() {
    return window.location.href;
  }
};
  
angular['compile'] = function(root, config) {
  config = config || {};
  var defaults = {
    'server': "",
    'addUrlChangeListener': noop
  };
  //todo: don't start watcher
  var angular = new Angular(root, jQuery("head"), _(defaults).extend(config));
  //todo: don't load stylesheet by default
  // loader.loadCss('/stylesheets/jquery-ui/smoothness/jquery-ui-1.7.1.css');
  // loader.loadCss('/stylesheets/css');
  angular.load();
  var scope = jQuery(root).scope();
  //TODO: cleanup
  return {
    'updateView':function(){return scope.updateView();},
    'set':function(){return scope.set.apply(scope, arguments);},
    'get':function(){return scope.get.apply(scope, arguments);},
    'init':function(){scope.get('$binder.executeInit')(); scope.updateView();},
    'watchUrl':function(){
      var binder = scope.get('$binder');
      var watcher = angular.watcher;
      watcher.listener = bind(binder, binder.onUrlChange, watcher);
      watcher.onUpdate = function(){alert("update");};
      watcher.watch();
    }
  };
};var angularGlobal = {
  'typeOf':function(obj){
    if (obj === null) return "null";
    var type = typeof obj;
    if (type == "object") {
      if (obj instanceof Array) return "array";
      if (obj instanceof Date) return "date";
      if (obj.nodeType == 1) return "element";
    }
    return type;
  }
};

var angularCollection = {};
var angularObject = {};
var angularArray = {
  'includeIf':function(array, value, condition) {
    var index = _.indexOf(array, value);
    if (condition) {
      if (index == -1)
        array.push(value);
    } else {
      array.splice(index, 1);
    }
    return array;
  },
  'sum':function(array, expression) {
    var fn = angular['Function']['compile'](expression);
    var sum = 0;
    for (var i = 0; i < array.length; i++) {
      var value = 1 * fn(array[i]);
      if (!isNaN(value)){
        sum += value;
      }
    }
    return sum;
  },
  'remove':function(array, value) {
    var index = _.indexOf(array, value);
    if (index >=0)
      array.splice(index, 1);
    return value;
  },
  'find':function(array, condition, defaultValue) {
    if (!condition) return undefined;
    var fn = angular['Function']['compile'](condition);
    _.detect(array, function($){
      if (fn($)){
        defaultValue = $;
        return true;
      }      
    });
    return defaultValue;
  },
  'findById':function(array, id) {
    return angular.Array.find(array, function($){return $.$id == id;}, null);
  },
  'filter':function(array, expression) {
    var predicates = [];
    predicates.check = function(value) {
      for (var j = 0; j < predicates.length; j++) {
        if(!predicates[j](value)) {
          return false;
        }
      }
      return true;
    };
    var getter = Scope.getter;
    var search = function(obj, text){
      if (text.charAt(0) === '!') {
        return !search(obj, text.substr(1));
      }
      switch (typeof obj) {
      case "boolean":
      case "number":
      case "string":
        return ('' + obj).toLowerCase().indexOf(text) > -1;
      case "object":
        for ( var objKey in obj) {
          if (objKey.charAt(0) !== '$' && search(obj[objKey], text)) {
            return true;
          }
        }
        return false;
      case "array":
        for ( var i = 0; i < obj.length; i++) {
          if (search(obj[i], text)) {
            return true;
          }
        }
        return false;
      default:
        return false;
      }
    };
    switch (typeof expression) {
      case "boolean":
      case "number":
      case "string":
        expression = {$:expression};
      case "object":
        for (var key in expression) {
          if (key == '$') {
            (function(){
              var text = (''+expression[key]).toLowerCase();
              if (!text) return;
              predicates.push(function(value) {
                return search(value, text);
              });
            })();
          } else {
            (function(){
              var path = key;
              var text = (''+expression[key]).toLowerCase();
              if (!text) return;
              predicates.push(function(value) {
                return search(getter(value, path), text);
              });
            })();
          }
        }
        break;
      case "function":
        predicates.push(expression);
        break;
      default:
        return array;
    }
    var filtered = [];
    for ( var j = 0; j < array.length; j++) {
      var value = array[j];
      if (predicates.check(value)) {
        filtered.push(value);
      }
    }
    return filtered;
  },
  'add':function(array, value) {
    array.push(_.isUndefined(value)? {} : value);
    return array;
  },
  'count':function(array, condition) {
    if (!condition) return array.length;
    var fn = angular['Function']['compile'](condition);
    return _.reduce(array, 0, function(count, $){return count + (fn($)?1:0);});
  },
  'orderBy':function(array, expression, descend) {
    function reverse(comp, descending) {
      return toBoolean(descending) ? 
          function(a,b){return comp(b,a);} : comp;
    }
    function compare(v1, v2){
      var t1 = typeof v1;
      var t2 = typeof v2;
      if (t1 == t2) {
        if (t1 == "string") v1 = v1.toLowerCase();
        if (t1 == "string") v2 = v2.toLowerCase();
        if (v1 === v2) return 0;
        return v1 < v2 ? -1 : 1;
      } else {
        return t1 < t2 ? -1 : 1;
      }
    }
    expression = _.isArray(expression) ? expression: [expression];
    expression = _.map(expression, function($){
      var descending = false;
      if (typeof $ == "string" && ($.charAt(0) == '+' || $.charAt(0) == '-')) {
        descending = $.charAt(0) == '-';
        $ = $.substring(1);
      }
      var get = $ ? angular['Function']['compile']($) : _.identity;
      return reverse(function(a,b){
        return compare(get(a),get(b));
      }, descending);
    });
    var comparator = function(o1, o2){
      for ( var i = 0; i < expression.length; i++) {
        var comp = expression[i](o1, o2);
        if (comp !== 0) return comp;
      }
      return 0;
    };
    return _.clone(array).sort(reverse(comparator, descend));
  },
  'orderByToggle':function(predicate, attribute) {
    var STRIP = /^([+|-])?(.*)/;
    var ascending = false;
    var index = -1;
    _.detect(predicate, function($, i){
      if ($ == attribute) {
        ascending = true;
        index = i;
        return true;
      }
      if (($.charAt(0)=='+'||$.charAt(0)=='-') && $.substring(1) == attribute) {
        ascending = $.charAt(0) == '+';
        index = i;
        return true;
      }
    });
    if (index >= 0) {
      predicate.splice(index, 1);
    }
    predicate.unshift((ascending ? "-" : "+") + attribute);
    return predicate;
  },
  'orderByDirection':function(predicate, attribute, ascend, descend) {
    ascend = ascend || 'ng-ascend';
    descend = descend || 'ng-descend';
    var att = predicate[0] || '';
    var direction = true;
    if (att.charAt(0) == '-') {
      att = att.substring(1);
      direction = false;
    } else if(att.charAt(0) == '+') {
      att = att.substring(1);
    }
    return att == attribute ? (direction ? ascend : descend) : "";
  },
  'merge':function(array, index, mergeValue) {
    var value = array[index];
    if (!value) {
      value = {};
      array[index] = value;
    }
    merge(mergeValue, value);
    return array;
  }
};

var angularString = {
  'quote':function(string) {
    return '"' + string.replace(/\\/g, '\\\\').
                        replace(/"/g, '\\"').
                        replace(/\n/g, '\\n').
                        replace(/\f/g, '\\f').
                        replace(/\r/g, '\\r').
                        replace(/\t/g, '\\t').
                        replace(/\v/g, '\\v') +
             '"';
  },
  'quoteUnicode':function(string) {
    var str = angular['String']['quote'](string);
    var chars = [];
    for ( var i = 0; i < str.length; i++) {
      var ch = str.charCodeAt(i);
      if (ch < 128) {
        chars.push(str.charAt(i));
      } else {
        var encode = "000" + ch.toString(16);
        chars.push("\\u" + encode.substring(encode.length - 4));
      }
    }
    return chars.join('');
  },
  'toDate':function(string){
    var match;
    if (typeof string == 'string' && 
        (match = string.match(/^(\d\d\d\d)-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)Z$/))){
      var date = new Date(0);
      date.setUTCFullYear(match[1], match[2] - 1, match[3]);
      date.setUTCHours(match[4], match[5], match[6], 0);
      return date;
    }
    return string;
  }
};

var angularDate = {
    'toString':function(date){
      function pad(n) { return n < 10 ? "0" + n : n; }
      return  (date.getUTCFullYear()) + '-' +
        pad(date.getUTCMonth() + 1) + '-' +
        pad(date.getUTCDate()) + 'T' +
        pad(date.getUTCHours()) + ':' +
        pad(date.getUTCMinutes()) + ':' +
        pad(date.getUTCSeconds()) + 'Z';
    }
  };

var angularFunction = {
  'compile':function(expression) {
    if (_.isFunction(expression)){
      return expression;
    } else if (expression){
      var scope = new Scope();
      return function($) {
        scope.state = $;
        return scope.eval(expression);
      };
    } else {
      return function($){return $;};
    }
  }
};

function defineApi(dst, chain, underscoreNames){
  var lastChain = _.last(chain);
  foreach(underscoreNames, function(name){
    lastChain[name] = _[name];
  });
  angular[dst] = angular[dst] || {};
  foreach(chain, function(parent){
    extend(angular[dst], parent);
  });
}
defineApi('Global', [angularGlobal],
    ['extend', 'clone','isEqual', 
     'isElement', 'isArray', 'isFunction', 'isUndefined']);
defineApi('Collection', [angularGlobal, angularCollection], 
    ['each', 'map', 'reduce', 'reduceRight', 'detect', 
     'select', 'reject', 'all', 'any', 'include', 
     'invoke', 'pluck', 'max', 'min', 'sortBy', 
     'sortedIndex', 'toArray', 'size']);
defineApi('Array', [angularGlobal, angularCollection, angularArray], 
    ['first', 'last', 'compact', 'flatten', 'without', 
     'uniq', 'intersect', 'zip', 'indexOf', 'lastIndexOf']);
defineApi('Object', [angularGlobal, angularCollection, angularObject],
    ['keys', 'values']);
defineApi('String', [angularGlobal, angularString], []);
defineApi('Date', [angularGlobal, angularDate], []);
defineApi('Function', [angularGlobal, angularCollection, angularFunction],
    ['bind', 'bindAll', 'delay', 'defer', 'wrap', 'compose']);
function Binder(doc, widgetFactory, urlWatcher, config) {
  this.doc = doc;
  this.urlWatcher = urlWatcher;
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
  
  parseAnchor: function(url) {
    var self = this;
    url = url || this.urlWatcher.getUrl();
  
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
  
  onUrlChange: function (url) {
    this.parseAnchor(url);
    this.updateView();
  },
  
  updateAnchor: function() {
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
  },
  
  updateView: function() {
    var start = new Date().getTime();
    var scope = jQuery(this.doc).scope();
    scope.set("$invalidWidgets", []);
    scope.updateView();
    var end = new Date().getTime();
    this.updateAnchor();
    _.each(this.updateListeners, function(fn) {fn();});
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
    this.docFindWithSelf("[ng-entity]").attr("ng-watch", function() {
      try {
        var jNode = jQuery(this);
        var decl = scope.entity(jNode.attr("ng-entity"));
        return decl + (jNode.attr('ng-watch') || "");
      } catch (e) {
        alert(e);
      }
    });
  },
  
  compile: function() {
    var jNode = jQuery(this.doc);
    var self = this;
    if (this.config.autoSubmit) {
      var submits = this.docFindWithSelf(":submit").not("[ng-action]");
      submits.attr("ng-action", "$save()");
      submits.not(":disabled").not("ng-bind-attr").attr("ng-bind-attr", '{disabled:"{{$invalidWidgets}}"}');
    }
    this.precompile(this.doc)(this.doc, jNode.scope(), "");
    this.docFindWithSelf("a[ng-action]").live('click', function (event) {
      var jNode = jQuery(this);
      try {
        jNode.scope().eval(jNode.attr('ng-action'));
        jNode.removeAttr('ng-error');
        jNode.removeClass("ng-exception");
      } catch (e) {
        jNode.addClass("ng-exception");
        jNode.attr('ng-error', toJson(e, true));
      }
      self.updateView();
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
};function ControlBar(document, serverUrl) {
  this.document = document;
  this.serverUrl = serverUrl;
  this.window = window;
  this.callbacks = [];
};

ControlBar.HTML =
  '<div>' +
    '<div class="ui-widget-overlay"></div>' +
    '<div id="ng-login" ng-non-bindable="true">' +
      '<div class="ng-login-container"></div>' +
    '</div>' +
  '</div>';

ControlBar.FORBIDEN =
  '<div ng-non-bindable="true" title="Permission Error:">' +
    'Sorry, you do not have permission for this!'+
  '</div>';



ControlBar.prototype = {
  bind: function () {
  },
  
  login: function (loginSubmitFn) {
    this.callbacks.push(loginSubmitFn);
    if (this.callbacks.length == 1) {
      this.doTemplate("/user_session/new.mini?return_url=" + encodeURIComponent(this.urlWithoutAnchor()));
    }
  },
  
  logout: function (loginSubmitFn) {
    this.callbacks.push(loginSubmitFn);
    if (this.callbacks.length == 1) {
      this.doTemplate("/user_session/do_destroy.mini");
    }
  },
  
  urlWithoutAnchor: function (path) {
    return this.window.location.href.split("#")[0];
  },
  
  doTemplate: function (path) {
    var self = this;
    var id = new Date().getTime();
    var url = this.urlWithoutAnchor();
    url += "#$iframe_notify=" + id;
    var iframeHeight = 330;
    var loginView = jQuery('<div style="overflow:hidden; padding:2px 0 0 0;"><iframe name="'+ url +'" src="'+this.serverUrl + path + '" width="500" height="'+ iframeHeight +'"/></div>');
    this.document.append(loginView);
    loginView.dialog({
      height:iframeHeight + 33, width:500,
      resizable: false, modal:true,
      title: 'Authentication: <a href="http://www.getangular.com"><tt>&lt;angular/&gt;</tt></a>'
    });
    callbacks["_iframe_notify_" + id] = function() {
      loginView.dialog("destroy");
      loginView.remove();
      foreach(self.callbacks, function(callback){
        callback();
      });
      self.callbacks = [];
    };
  },
  
  notAuthorized: function () {
    if (this.forbidenView) return;
    this.forbidenView = jQuery(ControlBar.FORBIDEN);
    this.forbidenView.dialog({bgiframe:true, height:70, modal:true});
  }
};function DataStore(post, users, anchor) {
  this.post = post;
  this.users = users;
  this._cache = {$collections:[]};
  this.anchor = anchor;
  this.bulkRequest = [];
};

DataStore.NullEntity = extend(function(){}, {
  'all': function(){return [];},
  'query': function(){return [];},
  'load': function(){return {};},
  'title': undefined
});

DataStore.prototype = {
  cache: function(document) {
    if (! document instanceof Model) {
      throw "Parameter must be an instance of Entity! " + toJson(document);
    }
    var key = document.$entity + '/' + document.$id;
    var cachedDocument = this._cache[key];
    if (cachedDocument) {
      Model.copyDirectFields(document, cachedDocument);
    } else {
      this._cache[key] = document;
      cachedDocument = document;
    }
    return cachedDocument;
  },
  
  load: function(instance, id, callback, failure) {
    if (id && id !== '*') {
      var self = this;
      this._jsonRequest(["GET", instance.$entity + "/" + id], function(response) {
        instance.$loadFrom(response);
        instance.$migrate();
        var clone = instance.$$entity(instance);
        self.cache(clone);
        (callback||noop)(instance);
      }, failure);
    }
    return instance;
  },
  
  loadMany: function(entity, ids, callback) {
    var self=this;
    var list = [];
    var callbackCount = 0;
    foreach(ids, function(id){
      list.push(self.load(entity(), id, function(){
        callbackCount++;
        if (callbackCount == ids.length) {
          (callback||noop)(list);
        }
      }));
    });
    return list;
  },
  
  loadOrCreate: function(instance, id, callback) {
    var self=this;
    return this.load(instance, id, callback, function(response){
      if (response.$status_code == 404) {
        instance.$id = id;
        (callback||noop)(instance);
      } else {
        throw response;
      }
    });
  },
  
  loadAll: function(entity, callback) {
    var self = this;
    var list = [];
    list.$$accept = function(doc){
      return doc.$entity == entity.title;
    };
    this._cache.$collections.push(list);
    this._jsonRequest(["GET", entity.title], function(response) {
      var rows = response;
      for ( var i = 0; i < rows.length; i++) {
        var document = entity();
        document.$loadFrom(rows[i]);
        list.push(self.cache(document));
      }
      (callback||noop)(list);
    });
    return list;
  },
  
  save: function(document, callback) {
    var self = this;
    var data = {};
    document.$saveTo(data);
    this._jsonRequest(["POST", "", data], function(response) {
      document.$loadFrom(response);
      var cachedDoc = self.cache(document);
      _.each(self._cache.$collections, function(collection){
        if (collection.$$accept(document)) {
          angular['Array']['includeIf'](collection, cachedDoc, true);
        }
      });
      if (document.$$anchor) {
        self.anchor[document.$$anchor] = document.$id;
      }
      if (callback)
        callback(document);
    });
  },
  
  remove: function(document, callback) {
    var self = this;
    var data = {};
    document.$saveTo(data);
    this._jsonRequest(["DELETE", "", data], function(response) {
      delete self._cache[document.$entity + '/' + document.$id];
      _.each(self._cache.$collections, function(collection){
        for ( var i = 0; i < collection.length; i++) {
          var item = collection[i];
          if (item.$id == document.$id) {
            collection.splice(i, 1);
          }
        }
      });
      (callback||noop)(response);
    });
  },
  
  _jsonRequest: function(request, callback, failure) {
    request.$$callback = callback;
    request.$$failure = failure||function(response){
      throw response;
    };
    this.bulkRequest.push(request);
  },
  
  flush: function() {
    if (this.bulkRequest.length === 0) return;
    var self = this;
    var bulkRequest = this.bulkRequest;
    this.bulkRequest = [];
    log('REQUEST:', bulkRequest);
    function callback(code, bulkResponse){
      log('RESPONSE[' + code + ']: ', bulkResponse);
      if(bulkResponse.$status_code == 401) {
        self.users.login(function(){
          self.post(bulkRequest, callback);
        });
      } else if(bulkResponse.$status_code) {
        alert(toJson(bulkResponse));
      } else {
        for ( var i = 0; i < bulkResponse.length; i++) {
          var response = bulkResponse[i];
          var request = bulkRequest[i];
          var responseCode = response.$status_code;
          if(responseCode) {
            if(responseCode == 403) {
              self.users.notAuthorized();
            } else {
              request.$$failure(response);
            }
          } else {
            request.$$callback(response);
          }
        }
      }
    }
    this.post(bulkRequest, callback);
  },
  
  saveScope: function(scope, callback) {
    var saveCounter = 1;
    function onSaveDone() {
      saveCounter--;
      if (saveCounter === 0 && callback)
        callback();
    }
    for(var key in scope) {
      var item = scope[key];
      if (item && item.$save == Model.prototype.$save) {
        saveCounter++;
        item.$save(onSaveDone);
      }
    }
    onSaveDone();
  },
  
  query: function(type, query, arg, callback){
    var self = this;
    var queryList = [];
    queryList.$$accept = function(doc){
      return false;
    };
    this._cache.$collections.push(queryList);
    var request = type.title + '/' + query + '=' + arg;
    this._jsonRequest(["GET", request], function(response){
      var list = response;
      for(var i = 0; i < list.length; i++) {
        var document = new type().$loadFrom(list[i]);
        queryList.push(self.cache(document));
      }
      if (callback)
        callback(queryList);
    });
    return queryList;
  },
  
  entities: function(callback) {
    var entities = [];
    var self = this;
    this._jsonRequest(["GET", "$entities"], function(response) {
      for (var entityName in response) {
        entities.push(self.entity(entityName));
      }
      entities.sort(function(a,b){return a.title > b.title ? 1 : -1;});
      if (callback) callback(entities);
    });
    return entities;
  },
  
  documentCountsByUser: function(){
    var counts = {};
    var self = this;
    self.post([["GET", "$users"]], function(code, response){
      foreach(response[0], function(value, key){
        counts[key] = value;
      });
    });
    return counts;
  },
  
  userDocumentIdsByEntity: function(user){
    var ids = {};
    var self = this;
    self.post([["GET", "$users/" + user]], function(code, response){
      foreach(response[0], function(value, key){
        ids[key] = value;
      });
    });
    return ids;
  },
  
  entity: function(name, defaults){
    if (!name) {
      return DataStore.NullEntity;
    }
    var self = this;
    var entity = extend(function(initialState){
      return new Model(entity, initialState);
    }, {
      // entity.name does not work as name seems to be reserved for functions
      'title': name,
      '$$factory': true,
      'datastore': this,
      'defaults': defaults || {},
      'load': function(id, callback){
        return self.load(entity(), id, callback);
      },
      'loadMany': function(ids, callback){
        return self.loadMany(entity, ids, callback);
      },
      'loadOrCreate': function(id, callback){
        return self.loadOrCreate(entity(), id, callback);
      },
      'all': function(callback){
        return self.loadAll(entity, callback);
      },
      'query': function(query, queryArgs, callback){
        return self.query(entity, query, queryArgs, callback);
      },
      'properties': function(callback) {
        self._jsonRequest(["GET", name + "/$properties"], callback);
      }
    });
    return entity;
  },
  
  join: function(join){
    function fn(){
      throw "Joined entities can not be instantiated into a document.";
    };
    function base(name){return name ? name.substring(0, name.indexOf('.')) : undefined;}
    function next(name){return name.substring(name.indexOf('.') + 1);}
    var joinOrder = _(join).chain().
      map(function($, name){
        return name;}).
      sortBy(function(name){
        var path = [];
        do {
          if (_(path).include(name)) throw "Infinite loop in join: " + path.join(" -> ");
          path.push(name);
          if (!join[name]) throw _("Named entity '<%=name%>' is undefined.").template({name:name});
          name = base(join[name].on);
        } while(name);
        return path.length;
      }).
      value();
    if (_(joinOrder).select(function($){return join[$].on;}).length != joinOrder.length - 1)
      throw "Exactly one entity needs to be primary.";
    fn['query'] = function(exp, value) {
      var joinedResult = [];
      var baseName = base(exp);
      if (baseName != joinOrder[0]) throw _("Named entity '<%=name%>' is not a primary entity.").template({name:baseName});
      var Entity = join[baseName].join;
      var joinIndex = 1;
      Entity['query'](next(exp), value, function(result){
        var nextJoinName = joinOrder[joinIndex++];
        var nextJoin = join[nextJoinName];
        var nextJoinOn = nextJoin.on;
        var joinIds = {};
        _(result).each(function(doc){
          var row = {};
          joinedResult.push(row);
          row[baseName] = doc;
          var id = Scope.getter(row, nextJoinOn);
          joinIds[id] = id;
        });
        nextJoin.join.loadMany(_.toArray(joinIds), function(result){
          var byId = {};
          _(result).each(function(doc){
            byId[doc.$id] = doc;
          });
          _(joinedResult).each(function(row){
            var id = Scope.getter(row, nextJoinOn);
            row[nextJoinName] = byId[id];
          });
        });
      });
      return joinedResult;
    };
    return fn;
  }
};angularFilter.Meta = function(obj){
  if (obj) {
    for ( var key in obj) {
      this[key] = obj[key];
    }
  }
};
angularFilter.Meta.get = function(obj, attr){
  attr = attr || 'text';
  switch(typeof obj) {
  case "string":
    return attr == "text" ? obj : undefined;
  case "object":
    if (obj && typeof obj[attr] !== "undefined") {
      return obj[attr];
    }
    return undefined;
  default:
    return obj;
  }
};

var angularFilterGoogleChartApi;

foreach({
  'currency': function(amount){
    jQuery(this.element).toggleClass('ng-format-negative', amount < 0);
    return '$' + angularFilter['number'].apply(this, [amount, 2]);
  },
  
  'number': function(amount, fractionSize){
    if (isNaN(amount) || !isFinite(amount)) {
      return '';
    }
    fractionSize = typeof fractionSize == 'undefined' ? 2 : fractionSize;
    var isNegative = amount < 0;
    amount = Math.abs(amount);
    var pow = Math.pow(10, fractionSize);
    var text = "" + Math.round(amount * pow);
    var whole = text.substring(0, text.length - fractionSize);
    whole = whole || '0';
    var frc = text.substring(text.length - fractionSize);
    text = isNegative ? '-' : '';
    for (var i = 0; i < whole.length; i++) {
      if ((whole.length - i)%3 === 0 && i !== 0) {
        text += ',';
      }
      text += whole.charAt(i);
    }
    if (fractionSize > 0) {
      for (var j = frc.length; j < fractionSize; j++) {
        frc += '0';
      }
      text += '.' + frc.substring(0, fractionSize);
    }
    return text;
  },
  
  'date': function(amount) {
  },
  
  'json': function(object) {
    jQuery(this.element).addClass("ng-monospace");
    return toJson(object, true);
  },
  
  'trackPackage': (function(){
    var MATCHERS = [
      { name: "UPS",
        url: "http://wwwapps.ups.com/WebTracking/processInputRequest?sort_by=status&tracknums_displayed=1&TypeOfInquiryNumber=T&loc=en_US&track.x=0&track.y=0&InquiryNumber1=",
        regexp: [
          /^1Z[0-9A-Z]{16}$/i]},
      { name: "FedEx",
        url: "http://www.fedex.com/Tracking?tracknumbers=",
        regexp: [
          /^96\d{10}?$/i,
          /^96\d{17}?$/i,
          /^96\d{20}?$/i,
          /^\d{15}$/i,
          /^\d{12}$/i]},
      { name: "USPS",
        url: "http://trkcnfrm1.smi.usps.com/PTSInternetWeb/InterLabelInquiry.do?origTrackNum=",
        regexp: [
          /^(91\d{20})$/i,
          /^(91\d{18})$/i]}];
    return function(trackingNo, noMatch) {
      trackingNo = trim(trackingNo);
      var tNo = trackingNo.replace(/ /g, '');
      var returnValue;
      foreach(MATCHERS, function(carrier){
        foreach(carrier.regexp, function(regexp){
          if (regexp.test(tNo)) {
            var text = carrier.name + ": " + trackingNo;
            var url = carrier.url + trackingNo;
            returnValue = new angularFilter.Meta({
              text:text,
              url:url,
              html: '<a href="' + escapeAttr(url) + '">' + text + '</a>',
              trackingNo:trackingNo});
            _.breakLoop();
          }
        });
        if (returnValue) _.breakLoop();
      });
      if (returnValue) 
        return returnValue;
      else if (trackingNo)
        return noMatch || new angularFilter.Meta({text:trackingNo + " is not recognized"});
      else
        return null;
    };})(),
  
  'link': function(obj, title) {
    var text = title || angularFilter.Meta.get(obj);
    var url = angularFilter.Meta.get(obj, "url") || angularFilter.Meta.get(obj);
    if (url) {
      if (angular.validator.email(url) === null) {
        url = "mailto:" + url;
      }
      var html = '<a href="' + escapeHtml(url) + '">' + text + '</a>';
      return new angularFilter.Meta({text:text, url:url, html:html});
    }
    return obj;
  },
  
  
  'bytes': (function(){
    var SUFFIX = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    return function(size) {
      if(size === null) return "";
    
      var suffix = 0;
      while (size > 1000) {
        size = size / 1024;
        suffix++;
      }
      var txt = "" + size;
      var dot = txt.indexOf('.');
      if (dot > -1 && dot + 2 < txt.length) {
        txt = txt.substring(0, dot + 2);
      }
      return txt + " " + SUFFIX[suffix];
    };
  })(),
  
  'image': function(obj, width, height) {
    if (obj && obj.url) {
      var style = "";
      if (width) {
        style = ' style="max-width: ' + width +
                'px; max-height: ' + (height || width) + 'px;"';
      }
      return new angularFilter.Meta({url:obj.url, text:obj.url,
        html:'<img src="'+obj.url+'"' + style + '/>'});
    }
    return null;
  },
  
  'lowercase': function (obj) {
    var text = angularFilter.Meta.get(obj);
    return text ? ("" + text).toLowerCase() : text;
  },
  
  'uppercase': function (obj) {
    var text = angularFilter.Meta.get(obj);
    return text ? ("" + text).toUpperCase() : text;
  },
  
  'linecount': function (obj) {
    var text = angularFilter.Meta.get(obj);
    if (text==='' || !text) return 1;
    return text.split(/\n|\f/).length;
  },
  
  'if': function (result, expression) {
    return expression ? result : undefined;
  },
  
  'unless': function (result, expression) {
    return expression ? undefined : result;
  },
  
  'googleChartApi': extend(
    function(type, data, width, height) {
      data = data || {};
      var chart = {
          cht:type, 
          chco:angularFilterGoogleChartApi.collect(data, 'color'),
          chtt:angularFilterGoogleChartApi.title(data),
          chdl:angularFilterGoogleChartApi.collect(data, 'label'),
          chd:angularFilterGoogleChartApi.values(data),
          chf:'bg,s,FFFFFF00'
        };
      if (_.isArray(data.xLabels)) {
        chart.chxt='x';
        chart.chxl='0:|' + data.xLabels.join('|');
      }
      return angularFilterGoogleChartApi['encode'](chart, width, height);
    },
    {
      'values': function(data){
        var seriesValues = [];
        foreach(data.series||[], function(serie){
          var values = [];
          foreach(serie.values||[], function(value){
            values.push(value);
          });
          seriesValues.push(values.join(','));
        });
        var values = seriesValues.join('|');
        return values === "" ? null : "t:" + values;
      },
      
      'title': function(data){
        var titles = [];
        var title = data.title || [];
        foreach(_.isArray(title)?title:[title], function(text){
          titles.push(encodeURIComponent(text));
        });
        return titles.join('|');
      },
      
      'collect': function(data, key){
        var outterValues = [];
        var count = 0;
        foreach(data.series||[], function(serie){
          var innerValues = [];
          var value = serie[key] || [];
          foreach(_.isArray(value)?value:[value], function(color){
              innerValues.push(encodeURIComponent(color));
              count++;
            });
          outterValues.push(innerValues.join('|'));
        });
        return count?outterValues.join(','):null;
      },
      
      'encode': function(params, width, height) {
        width = width || 200;
        height = height || width;
        var url = "http://chart.apis.google.com/chart?";
        var urlParam = [];
        params.chs = width + "x" + height;
        foreach(params, function(value, key){
          if (value) {
            urlParam.push(key + "=" + value);
          }
        });
        urlParam.sort();
        url += urlParam.join("&");
        return new angularFilter.Meta({url:url,
          html:'<img width="' + width + '" height="' + height + '" src="'+url+'"/>'});
      }
    }
  ),
  
  
  'qrcode': function(value, width, height) {
    return angularFilterGoogleChartApi['encode']({cht:'qr', chl:encodeURIComponent(value)}, width, height);
  },
  'chart': {
    pie:function(data, width, height) {
      return angularFilterGoogleChartApi('p', data, width, height);
    },
    pie3d:function(data, width, height) {
      return angularFilterGoogleChartApi('p3', data, width, height);
    },
    pieConcentric:function(data, width, height) {
      return angularFilterGoogleChartApi('pc', data, width, height);
    },
    barHorizontalStacked:function(data, width, height) {
      return angularFilterGoogleChartApi('bhs', data, width, height);
    },
    barHorizontalGrouped:function(data, width, height) {
      return angularFilterGoogleChartApi('bhg', data, width, height);
    },
    barVerticalStacked:function(data, width, height) {
      return angularFilterGoogleChartApi('bvs', data, width, height);
    },
    barVerticalGrouped:function(data, width, height) {
      return angularFilterGoogleChartApi('bvg', data, width, height);
    },
    line:function(data, width, height) {
      return angularFilterGoogleChartApi('lc', data, width, height);
    },
    sparkline:function(data, width, height) {
      return angularFilterGoogleChartApi('ls', data, width, height);
    },
    scatter:function(data, width, height) {
      return angularFilterGoogleChartApi('s', data, width, height);
    }
  },
  
  'html': function(html){
    return new angularFilter.Meta({html:html});
  },
  
  'linky': function(text){
    if (!text) return text;
    function regExpEscape(text) {
      return text.replace(/([\/\.\*\+\?\|\(\)\[\]\{\}\\])/g, '\\$1');
    }
    var URL = /(ftp|http|https|mailto):\/\/([^\(\)|\s]+)/;
    var match;
    var raw = text;
    var html = [];
    while (match=raw.match(URL)) {
      var url = match[0].replace(/[\.\;\,\(\)\{\}\<\>]$/,'');
      var i = raw.indexOf(url);
      html.push(escapeHtml(raw.substr(0, i)));
      html.push('<a href="' + url + '">');
      html.push(url);
      html.push('</a>');
      raw = raw.substring(i + url.length);
    }
    html.push(escapeHtml(raw));
    return new angularFilter.Meta({text:text, html:html.join('')});
  }
}, function(v,k){angularFilter[k] = v;});

angularFilterGoogleChartApi = angularFilter['googleChartApi'];
array = [].constructor;

function toJson(obj, pretty){
  var buf = [];
  toJsonArray(buf, obj, pretty ? "\n  " : null);
  return buf.join('');
};

function toPrettyJson(obj)  {
  return toJson(obj, true);
};

function fromJson(json) {
  try {
    var parser = new Parser(json, true);
    var expression =  parser.primary();
    parser.assertAllConsumed();
    return expression();
  } catch (e) {
    error("fromJson error: ", json, e);
    throw e;
  }
};

angular['toJson'] = toJson;
angular['fromJson'] = fromJson;

function toJsonArray(buf, obj, pretty){
  var type = typeof obj;
  if (obj === null) {
    buf.push("null");
  } else if (type === 'function') {
    return;
  } else if (type === 'boolean') {
    buf.push('' + obj);
  } else if (type === 'number') {
    if (isNaN(obj)) {
      buf.push('null');
    } else {
      buf.push('' + obj);
    }
  } else if (type === 'string') {
    return buf.push(angular['String']['quoteUnicode'](obj));
  } else if (type === 'object') {
    if (obj instanceof Array) {
      buf.push("[");
      var len = obj.length;
      var sep = false;
      for(var i=0; i<len; i++) {
        var item = obj[i];
        if (sep) buf.push(",");
        if (typeof item == 'function' || typeof item == 'undefined') {
          buf.push("null");
        } else {
          toJsonArray(buf, item, pretty);
        }
        sep = true;
      }
      buf.push("]");
    } else if (obj instanceof Date) {
      buf.push(angular['String']['quoteUnicode'](angular['Date']['toString'](obj)));
    } else {
      buf.push("{");
      if (pretty) buf.push(pretty);
      var comma = false;
      var childPretty = pretty ? pretty + "  " : false;
      var keys = [];
      for(var k in obj) {
        if (k.indexOf('$$') === 0)
          continue;
        keys.push(k);
      }
      keys.sort();
      for ( var keyIndex = 0; keyIndex < keys.length; keyIndex++) {
        var key = keys[keyIndex];
        try {
          var value = obj[key];
          if (typeof value != 'function') {
            if (comma) {
              buf.push(",");
              if (pretty) buf.push(pretty);
            }
            buf.push(angular['String']['quote'](key));
            buf.push(":");
            toJsonArray(buf, value, childPretty);
            comma = true;
          }
        } catch (e) {
        }
      }
      buf.push("}");
    }
  }
};
// Single $ is special and does not get searched
// Double $$ is special an is client only (does not get sent to server)

function Model(entity, initial) {
  this['$$entity'] = entity;
  this.$loadFrom(initial||{});
  this.$entity = entity['title'];
  this.$migrate();
};

Model.copyDirectFields = function(src, dst) {
  if (src === dst || !src || !dst) return;
  var isDataField = function(src, dst, field) {
    return (field.substring(0,2) !== '$$') &&
        (typeof src[field] !== 'function') &&
        (typeof dst[field] !== 'function');
  };
  for (var field in dst) {
    if (isDataField(src, dst, field))
      delete dst[field];
  }
  for (field in src) {
    if (isDataField(src, dst, field))
      dst[field] = src[field];
  }
};

Model.prototype = {
  '$migrate': function() {
    merge(this['$$entity'].defaults, this);
    return this;
  },
  
  '$merge': function(other) {
    merge(other, this);
    return this;
  },
  
  '$save': function(callback) {
    this['$$entity'].datastore.save(this, callback === true ? undefined : callback);
    if (callback === true) this['$$entity'].datastore.flush();
    return this;
  },
  
  '$delete': function(callback) {
    this['$$entity'].datastore.remove(this, callback === true ? undefined : callback);
    if (callback === true) this['$$entity'].datastore.flush();
    return this;
  },
  
  '$loadById': function(id, callback) {
    this['$$entity'].datastore.load(this, id, callback);
    return this;
  },
  
  '$loadFrom': function(other) {
    Model.copyDirectFields(other, this);
    return this;
  },
  
  '$saveTo': function(other) {
    Model.copyDirectFields(this, other);
    return this;
  }
};function Lexer(text, parsStrings){
  this.text = text;
  // UTC dates have 20 characters, we send them through parser
  this.dateParseLength = parsStrings ? 20 : -1;
  this.tokens = [];
  this.index = 0;
};

Lexer.OPERATORS = {
    'null':function(self){return null;},
    'true':function(self){return true;},
    'false':function(self){return false;},
    '+':function(self, a,b){return (a||0)+(b||0);},
    '-':function(self, a,b){return (a||0)-(b||0);},
    '*':function(self, a,b){return a*b;},
    '/':function(self, a,b){return a/b;},
    '%':function(self, a,b){return a%b;},
    '^':function(self, a,b){return a^b;},
    '=':function(self, a,b){return self.scope.set(a, b);},
    '==':function(self, a,b){return a==b;},
    '!=':function(self, a,b){return a!=b;},
    '<':function(self, a,b){return a<b;},
    '>':function(self, a,b){return a>b;},
    '<=':function(self, a,b){return a<=b;},
    '>=':function(self, a,b){return a>=b;},
    '&&':function(self, a,b){return a&&b;},
    '||':function(self, a,b){return a||b;},
    '&':function(self, a,b){return a&b;},
//    '|':function(self, a,b){return a|b;},
    '|':function(self, a,b){return b(self, a);},
    '!':function(self, a){return !a;}
};
Lexer.ESCAPE = {"n":"\n", "f":"\f", "r":"\r", "t":"\t", "v":"\v", "'":"'", '"':'"'};

Lexer.prototype = {
  peek: function() {
    if (this.index + 1 < this.text.length) {
      return this.text.charAt(this.index + 1);
    } else {
      return false;
    }
  },
  
  parse: function() {
    var tokens = this.tokens;
    var OPERATORS = Lexer.OPERATORS;
    var canStartRegExp = true;
    while (this.index < this.text.length) {
      var ch = this.text.charAt(this.index);
      if (ch == '"' || ch == "'") {
        this.readString(ch);
        canStartRegExp = true;
      } else if (ch == '(' || ch == '[') {
        tokens.push({index:this.index, text:ch});
        this.index++;
      } else if (ch == '{' ) {
        var peekCh = this.peek();
        if (peekCh == ':' || peekCh == '(') {
          tokens.push({index:this.index, text:ch + peekCh});
          this.index++;
        } else {
          tokens.push({index:this.index, text:ch});
        }
        this.index++;
        canStartRegExp = true;
      } else if (ch == ')' || ch == ']' || ch == '}' ) {
        tokens.push({index:this.index, text:ch});
        this.index++;
        canStartRegExp = false;
      } else if ( ch == ':' || ch == '.' || ch == ',' || ch == ';') {
        tokens.push({index:this.index, text:ch});
        this.index++;
        canStartRegExp = true;
      } else if ( canStartRegExp && ch == '/' ) {
        this.readRegexp();
        canStartRegExp = false;
      } else if ( this.isNumber(ch) ) {
        this.readNumber();
        canStartRegExp = false;
      } else if (this.isIdent(ch)) {
        this.readIdent();
        canStartRegExp = false;
      } else if (this.isWhitespace(ch)) {
        this.index++;
      } else {
        var ch2 = ch + this.peek();
        var fn = OPERATORS[ch];
        var fn2 = OPERATORS[ch2];
        if (fn2) {
          tokens.push({index:this.index, text:ch2, fn:fn2});
          this.index += 2;
        } else if (fn) {
          tokens.push({index:this.index, text:ch, fn:fn});
          this.index += 1;
        } else {
          throw "Lexer Error: Unexpected next character [" +
              this.text.substring(this.index) +
              "] in expression '" + this.text +
              "' at column '" + (this.index+1) + "'.";
        }
        canStartRegExp = true;
      }
    }
    return tokens;
  },
  
  isNumber: function(ch) {
    return '0' <= ch && ch <= '9';
  },
  
  isWhitespace: function(ch) {
    return ch == ' ' || ch == '\r' || ch == '\t' ||
           ch == '\n' || ch == '\v';
  },
  
  isIdent: function(ch) {
    return 'a' <= ch && ch <= 'z' ||
           'A' <= ch && ch <= 'Z' ||
           '_' == ch || ch == '$';
  },
  
  readNumber: function() {
    var number = "";
    var start = this.index;
    while (this.index < this.text.length) {
      var ch = this.text.charAt(this.index);
      if (ch == '.' || this.isNumber(ch)) {
        number += ch;
      } else {
        break;
      }
      this.index++;
    }
    number = 1 * number;
    this.tokens.push({index:start, text:number,
      fn:function(){return number;}});
  },
  
  readIdent: function() {
    var ident = "";
    var start = this.index;
    while (this.index < this.text.length) {
      var ch = this.text.charAt(this.index);
      if (ch == '.' || this.isIdent(ch) || this.isNumber(ch)) {
        ident += ch;
      } else {
        break;
      }
      this.index++;
    }
    var fn = Lexer.OPERATORS[ident];
    if (!fn) {
      fn = function(self){
        return self.scope.get(ident);
      };
      fn.isAssignable = ident;
    }
    this.tokens.push({index:start, text:ident, fn:fn});
  },
  
  readString: function(quote) {
    var start = this.index;
    var dateParseLength = this.dateParseLength;
    this.index++;
    var string = "";
    var escape = false;
    while (this.index < this.text.length) {
      var ch = this.text.charAt(this.index);
      if (escape) {
        if (ch == 'u') {
          var hex = this.text.substring(this.index + 1, this.index + 5);
          this.index += 4;
          string += String.fromCharCode(parseInt(hex, 16));
        } else {
          var rep = Lexer.ESCAPE[ch];
          if (rep) {
            string += rep;
          } else {
            string += ch;
          }
        }
        escape = false;
      } else if (ch == '\\') {
        escape = true;
      } else if (ch == quote) {
        this.index++;
        this.tokens.push({index:start, text:string,
          fn:function(){
            return (string.length == dateParseLength) ?
              angular['String']['toDate'](string) : string;
          }});
        return;
      } else {
        string += ch;
      }
      this.index++;
    }
    throw "Lexer Error: Unterminated quote [" +
        this.text.substring(start) + "] starting at column '" +
        (start+1) + "' in expression '" + this.text + "'.";
  },
  
  readRegexp: function(quote) {
    var start = this.index;
    this.index++;
    var regexp = "";
    var escape = false;
    while (this.index < this.text.length) {
      var ch = this.text.charAt(this.index);
      if (escape) {
        regexp += ch;
        escape = false;
      } else if (ch === '\\') {
        regexp += ch;
        escape = true;
      } else if (ch === '/') {
        this.index++;
        var flags = "";
        if (this.isIdent(this.text.charAt(this.index))) {
          this.readIdent();
          flags = this.tokens.pop().text;
        }
        var compiledRegexp = new RegExp(regexp, flags);
        this.tokens.push({index:start, text:regexp, flags:flags,
          fn:function(){return compiledRegexp;}});
        return;
      } else {
        regexp += ch;
      }
      this.index++;
    }
    throw "Lexer Error: Unterminated RegExp [" +
        this.text.substring(start) + "] starting at column '" +
        (start+1) + "' in expression '" + this.text + "'.";
  }
};

/////////////////////////////////////////

function Parser(text, parseStrings){
  this.text = text;
  this.tokens = new Lexer(text, parseStrings).parse();
  this.index = 0;
};

Parser.ZERO = function(){
  return 0;
};

Parser.prototype = {
  error: function(msg, token) {
    throw "Token '" + token.text + 
      "' is " + msg + " at column='" + 
      (token.index + 1) + "' of expression '" + 
      this.text + "' starting at '" + this.text.substring(token.index) + "'.";
  },
  
  peekToken: function() {
    if (this.tokens.length === 0) 
      throw "Unexpected end of expression: " + this.text;
    return this.tokens[0];
  },
  
  peek: function(e1, e2, e3, e4) {
    var tokens = this.tokens;
    if (tokens.length > 0) {
      var token = tokens[0];
      var t = token.text;
      if (t==e1 || t==e2 || t==e3 || t==e4 ||
          (!e1 && !e2 && !e3 && !e4)) {
        return token;
      }
    }
    return false;
  },
  
  expect: function(e1, e2, e3, e4){
    var token = this.peek(e1, e2, e3, e4);
    if (token) {
      this.tokens.shift();
      this.currentToken = token;
      return token;
    }
    return false;
  },
  
  consume: function(e1){
    if (!this.expect(e1)) {
      var token = this.peek();
      throw "Expecting '" + e1 + "' at column '" +
          (token.index+1) + "' in '" +
          this.text + "' got '" +
          this.text.substring(token.index) + "'.";
    }
  },
  
  _unary: function(fn, right) {
    return function(self) {
      return fn(self, right(self));
    };
  },
  
  _binary: function(left, fn, right) {
    return function(self) {
      return fn(self, left(self), right(self));
    };
  },
  
  hasTokens: function () {
    return this.tokens.length > 0;
  },
  
  assertAllConsumed: function(){
    if (this.tokens.length !== 0) {
      throw "Did not understand '" + this.text.substring(this.tokens[0].index) +
          "' while evaluating '" + this.text + "'.";
    }
  },
  
  statements: function(){
    var statements = [];
    while(true) {
      if (this.tokens.length > 0 && !this.peek('}', ')', ';', ']'))
        statements.push(this.filterChain());
      if (!this.expect(';')) {
        return function (self){
          var value;
          for ( var i = 0; i < statements.length; i++) {
            var statement = statements[i];
            if (statement)
              value = statement(self);
          }
          return value;
        };
      }
    }
  },
  
  filterChain: function(){
    var left = this.expression();
    var token;
    while(true) {
      if ((token = this.expect('|'))) {
        left = this._binary(left, token.fn, this.filter());
      } else {
        return left;
      }
    }
  },
  
  filter: function(){
    return this._pipeFunction(angular['filter']);
  },
  
  validator: function(){
    return this._pipeFunction(angular['validator']);
  },
  
  _pipeFunction: function(fnScope){
    var fn = this.functionIdent(fnScope);
    var argsFn = [];
    var token;
    while(true) {
      if ((token = this.expect(':'))) {
        argsFn.push(this.expression());
      } else {
        var fnInvoke = function(self, input){
          var args = [input];
          for ( var i = 0; i < argsFn.length; i++) {
            args.push(argsFn[i](self));
          }
          return fn.apply(self, args);
        };
        return function(){
          return fnInvoke;
        };
      }
    }
  },
  
  expression: function(){
    return this.throwStmt();
  },
  
  throwStmt: function(){
    if (this.expect('throw')) {
      var throwExp = this.assignment();
      return function (self) {
        throw throwExp(self);
      };
    } else {
     return this.assignment();
    }
  },
  
  assignment: function(){
    var left = this.logicalOR();
    var token;
    if (token = this.expect('=')) {
      if (!left.isAssignable) {
        throw "Left hand side '" +
            this.text.substring(0, token.index) + "' of assignment '" +
            this.text.substring(token.index) + "' is not assignable.";
      }
      var ident = function(){return left.isAssignable;};
      return this._binary(ident, token.fn, this.logicalOR());
    } else {
     return left;
    }
  },
  
  logicalOR: function(){
    var left = this.logicalAND();
    var token;
    while(true) {
      if ((token = this.expect('||'))) {
        left = this._binary(left, token.fn, this.logicalAND());
      } else {
        return left;
      }
    }
  },
  
  logicalAND: function(){
    var left = this.negated();
    var token;
    while(true) {
      if ((token = this.expect('&&'))) {
        left = this._binary(left, token.fn, this.negated());
      } else {
        return left;
      }
    }
  },
  
  negated: function(){
    var token;
    if (token = this.expect('!')) {
      return this._unary(token.fn, this.assignment());
    } else {
      return this.equality();
    }
  },
  
  equality: function(){
    var left = this.relational();
    var token;
    while(true) {
      if ((token = this.expect('==','!='))) {
        left = this._binary(left, token.fn, this.relational());
      } else {
        return left;
      }
    }
  },
  
  relational: function(){
    var left = this.additive();
    var token;
    while(true) {
      if ((token = this.expect('<', '>', '<=', '>='))) {
        left = this._binary(left, token.fn, this.additive());
      } else {
        return left;
      }
    }
  },
  
  additive: function(){
    var left = this.multiplicative();
    var token;
    while(token = this.expect('+','-')) {
      left = this._binary(left, token.fn, this.multiplicative());
    }
    return left;
  },
  
  multiplicative: function(){
    var left = this.unary();
    var token;
    while(token = this.expect('*','/','%')) {
        left = this._binary(left, token.fn, this.unary());
    }
    return left;
  },
  
  unary: function(){
    var token;
    if (this.expect('+')) {
      return this.primary();
    } else if (token = this.expect('-')) {
      return this._binary(Parser.ZERO, token.fn, this.multiplicative());
    } else {
     return this.primary();
    }
  },
  
  functionIdent: function(fnScope) {
    var token = this.expect();
    var element = token.text.split('.');
    var instance = fnScope;
    var key;
    for ( var i = 0; i < element.length; i++) {
      key = element[i];
      if (instance)
        instance = instance[key];
    }
    if (typeof instance != 'function') {
      throw "Function '" + token.text + "' at column '" +
      (token.index+1)  + "' in '" + this.text + "' is not defined.";
    }
    return instance;
  },
  
  primary: function() {
    var primary;
    if (this.expect('(')) {
      var expression = this.filterChain();
      this.consume(')');
      primary = expression;
    } else if (this.expect('[')) {
      primary = this.arrayDeclaration();
    } else if (this.expect('{')) {
      primary = this.object();
    } else if (this.expect('{:')) {
      primary = this.closure(false);
    } else if (this.expect('{(')) {
      primary = this.closure(true);
    } else {
      var token = this.expect();
      primary = token.fn;
      if (!primary) {
        this.error("not a primary expression", token);
      }
    }
    var next;
    while (next = this.expect('(', '[', '.')) {
      if (next.text === '(') {
        primary = this.functionCall(primary);
      } else if (next.text === '[') {
        primary = this.objectIndex(primary);
      } else if (next.text === '.') {
        primary = this.fieldAccess(primary);
      } else {
        throw "IMPOSSIBLE";
      }
    }
    return primary;
  },
  
  closure: function(hasArgs) {
    var args = [];
    if (hasArgs) {
      if (!this.expect(')')) {
        args.push(this.expect().text);
        while(this.expect(',')) {
          args.push(this.expect().text);
        }
        this.consume(')');
      }
      this.consume(":");
    }
    var statements = this.statements();
    this.consume("}");
    return function(self){
      return function($){
        var scope = new Scope(self.scope.state);
        scope.set('$', $);
        for ( var i = 0; i < args.length; i++) {
          scope.set(args[i], arguments[i]);
        }
        return statements({scope:scope});
      };
    };
  },
  
  fieldAccess: function(object) {
    var field = this.expect().text;
    var fn = function (self){
      return Scope.getter(object(self), field);
    };
    fn.isAssignable = field;
    return fn;
  },
  
  objectIndex: function(obj) {
    var indexFn = this.expression();
    this.consume(']');
    if (this.expect('=')) {
      var rhs = this.expression();
      return function (self){
        return obj(self)[indexFn(self)] = rhs(self);
      };
    } else {
      return function (self){
        var o = obj(self);
        var i = indexFn(self);
        return (o) ? o[i] : undefined;
      };
    }
  },
  
  functionCall: function(fn) {
    var argsFn = [];
    if (this.peekToken().text != ')') {
      do {
        argsFn.push(this.expression());
      } while (this.expect(','));
    }
    this.consume(')');
    return function (self){
      var args = [];
      for ( var i = 0; i < argsFn.length; i++) {
        args.push(argsFn[i](self));
      }
      var fnPtr = fn(self);
      if (typeof fnPtr === 'function') {
        return fnPtr.apply(self, args);
      } else {
        throw "Expression '" + fn.isAssignable + "' is not a function.";
      }
    };
  },
  
  // This is used with json array declaration
  arrayDeclaration: function () {
    var elementFns = [];
    if (this.peekToken().text != ']') {
      do {
        elementFns.push(this.expression());
      } while (this.expect(','));
    }
    this.consume(']');
    return function (self){
      var array = [];
      for ( var i = 0; i < elementFns.length; i++) {
        array.push(elementFns[i](self));
      }
      return array;
    };
  },
  
  object: function () {
    var keyValues = [];
    if (this.peekToken().text != '}') {
      do {
        var key = this.expect().text;
        this.consume(":");
        var value = this.expression();
        keyValues.push({key:key, value:value});
      } while (this.expect(','));
    }
    this.consume('}');
    return function (self){
      var object = {};
      for ( var i = 0; i < keyValues.length; i++) {
        var keyValue = keyValues[i];
        var value = keyValue.value(self);
        object[keyValue.key] = value;
      }
      return object;
    };
  },
  
  entityDeclaration: function () {
    var decl = [];
    while(this.hasTokens()) {
      decl.push(this.entityDecl());
      if (!this.expect(';')) {
        this.assertAllConsumed();
      }
    }
    return function (self){
      var code = "";
      for ( var i = 0; i < decl.length; i++) {
        code += decl[i](self);
      }
      return code;
    };
  },
  
  entityDecl: function () {
    var entity = this.expect().text;
    var instance;
    var defaults;
    if (this.expect('=')) {
      instance = entity;
      entity = this.expect().text;
    }
    if (this.expect(':')) {
      defaults = this.primary()(null);
    }
    return function(self) {
      var datastore = self.scope.get('$datastore');
      var Entity = datastore.entity(entity, defaults);
      self.scope.set(entity, Entity);
      if (instance) {
        var document = Entity();
        document.$$anchor = instance;
        self.scope.set(instance, document);
        return "$anchor." + instance + ":{" + 
            instance + "=" + entity + ".load($anchor." + instance + ");" +
            instance + ".$$anchor=" + angular['String']['quote'](instance) + ";" + 
          "};";
      } else {
        return "";
      }
    };
  },
  
  watch: function () {
    var decl = [];
    while(this.hasTokens()) {
      decl.push(this.watchDecl());
      if (!this.expect(';')) {
        this.assertAllConsumed();
      }
    }
    this.assertAllConsumed();
    return function (self){
      for ( var i = 0; i < decl.length; i++) {
        var d = decl[i](self);
        self.addListener(d.name, d.fn);
      }
    };
  },
  
  watchDecl: function () {
    var anchorName = this.expect().text;
    this.consume(":");
    var expression;
    if (this.peekToken().text == '{') {
      this.consume("{");
      expression = this.statements();
      this.consume("}");
    } else {
      expression = this.expression();
    }
    return function(self) {
      return {name:anchorName, fn:expression};
    };
  }
};


function Scope(initialState, name) {
  this.widgets = [];
  this.watchListeners = {};
  this.name = name;
  initialState = initialState || {};
  var State = function(){};
  State.prototype = initialState;
  this.state = new State();
  this.state.$parent = initialState;
  if (name == "ROOT") {
    this.state.$root = this.state;
  }
};

Scope.expressionCache = {};
Scope.getter = function(instance, path) {
  if (!path) return instance;
  var element = path.split('.');
  var key;
  var lastInstance = instance;
  var len = element.length;
  for ( var i = 0; i < len; i++) {
    key = element[i];
    if (!key.match(/^[\$\w][\$\w\d]*$/))
        throw "Expression '" + path + "' is not a valid expression for accesing variables.";
    if (instance) {
      lastInstance = instance;
      instance = instance[key];
    }
    if (_.isUndefined(instance)  && key.charAt(0) == '$') {
      var type = angular['Global']['typeOf'](lastInstance);
      type = angular[type.charAt(0).toUpperCase()+type.substring(1)];
      var fn = type ? type[[key.substring(1)]] : undefined;
      if (fn) {
        instance = _.bind(fn, lastInstance, lastInstance);
        return instance;
      }
    }
  }
  if (typeof instance === 'function' && !instance.$$factory) {
    return bind(lastInstance, instance);
  }
  return instance;
};

Scope.prototype = {
  updateView: function() {
    var self = this;
    this.fireWatchers();
    _.each(this.widgets, function(widget){
      self.evalWidget(widget, "", {}, function(){
        this.updateView(self);
      });
    });
  },
  
  addWidget: function(controller) {
    if (controller) this.widgets.push(controller);
  },
  
  isProperty: function(exp) {
    for ( var i = 0; i < exp.length; i++) {
      var ch = exp.charAt(i);
      if (ch!='.'  && !Lexer.prototype.isIdent(ch)) {
        return false;
      }
    }
    return true;
  },
    
  get: function(path) {
    return Scope.getter(this.state, path);
  },
  
  set: function(path, value) {
    var element = path.split('.');
    var instance = this.state;
    for ( var i = 0; element.length > 1; i++) {
      var key = element.shift();
      var newInstance = instance[key];
      if (!newInstance) {
        newInstance = {};
        instance[key] = newInstance;
      }
      instance = newInstance;
    }
    instance[element.shift()] = value;
    return value;
  },
  
  setEval: function(expressionText, value) {
    this.eval(expressionText + "=" + toJson(value));
  },
  
  eval: function(expressionText, context) {
    var expression = Scope.expressionCache[expressionText];
    if (!expression) {
      var parser = new Parser(expressionText);
      expression = parser.statements();
      parser.assertAllConsumed();
      Scope.expressionCache[expressionText] = expression;
    }
    context = context || {};
    context.scope = this;
    return expression(context);
  },
  
  //TODO: Refactor. This function needs to be an execution closure for widgets
  // move to widgets
  // remove expression, just have inner closure.
  evalWidget: function(widget, expression, context, onSuccess, onFailure) {
    try {
      var value = this.eval(expression, context);
      if (widget.hasError) {
        widget.hasError = false;
        jQuery(widget.view).
          removeClass('ng-exception').
          removeAttr('ng-error');
      }
      if (onSuccess) {
        value = onSuccess.apply(widget, [value]);
      }
      return true;
    } catch (e){
      error('Eval Widget Error:', e);
      var jsonError = toJson(e, true);
      widget.hasError = true;
      jQuery(widget.view).
        addClass('ng-exception').
        attr('ng-error', jsonError);
      if (onFailure) {
        onFailure.apply(widget, [e, jsonError]);
      }
      return false;
    }
  },
  
  validate: function(expressionText, value) {
    var expression = Scope.expressionCache[expressionText];
    if (!expression) {
      expression = new Parser(expressionText).validator();
      Scope.expressionCache[expressionText] = expression;
    }
    var self = {scope:this};
    return expression(self)(self, value);
  },
  
  entity: function(entityDeclaration) {
    var expression = new Parser(entityDeclaration).entityDeclaration();
    return expression({scope:this});
  },
  
  markInvalid: function(widget) {
    this.state.$invalidWidgets.push(widget);
  },
  
  watch: function(declaration) {
    var self = this;
    new Parser(declaration).watch()({
      scope:this,
      addListener:function(watch, exp){
        self.addWatchListener(watch, function(n,o){
          try {
            return exp({scope:self}, n, o);
          } catch(e) {
            alert(e);
          }
        });
      }
    });
  },
  
  addWatchListener: function(watchExpression, listener) {
    var watcher = this.watchListeners[watchExpression];
    if (!watcher) {
      watcher = {listeners:[], expression:watchExpression};
      this.watchListeners[watchExpression] = watcher;
    }
    watcher.listeners.push(listener);
  },
  
  fireWatchers: function() {
    var self = this;
    var fired = false;
    foreach(this.watchListeners, function(watcher) {
      var value = self.eval(watcher.expression);
      if (value !== watcher.lastValue) {
        foreach(watcher.listeners, function(listener){
          listener(value, watcher.lastValue);
          fired = true;
        });
        watcher.lastValue = value;
      }
    });
    return fired;
  }
};function Server(url, getScript) {
  this.url = url;
  this.nextId = 0;
  this.getScript = getScript;
  this.uuid = "_" + ("" + Math.random()).substr(2) + "_";
  this.maxSize = 1800;
};

Server.prototype = {
  base64url: function(txt) {
    return Base64.encode(txt);
  },
  
  request: function(method, url, request, callback) {
    var requestId = this.uuid + (this.nextId++);
    angularCallbacks[requestId] = function(response) {
      delete angular[requestId];
      callback(200, response);
    };
    var payload = {u:url, m:method, p:request};
    payload = this.base64url(toJson(payload));
    var totalPockets = Math.ceil(payload.length / this.maxSize);
    var baseUrl = this.url + "/$/" + requestId +  "/" + totalPockets + "/";
    for ( var pocketNo = 0; pocketNo < totalPockets; pocketNo++) {
      var pocket = payload.substr(pocketNo * this.maxSize, this.maxSize);
      this.getScript(baseUrl + (pocketNo+1) + "?h=" + pocket, noop);
    }
  }
};

function FrameServer(frame) {
  this.frame = frame;
};
FrameServer.PREFIX = "$DATASET:";

FrameServer.prototype = {
  read:function(){
    this.data = fromJson(this.frame.name.substr(FrameServer.PREFIX.length));
  },
  write:function(){
    this.frame.name = FrameServer.PREFIX +  toJson(this.data);
  }, 
  request: function(method, url, request, callback) {
    //alert(method + " " + url + " " + toJson(request) + " " + toJson(callback));
  }
};


function VisualServer(delegate, status, update) {
  this.delegate = delegate;
  this.update = update;
  this.status = status;
};

VisualServer.prototype = {
  request:function(method, url, request, callback) {
    var self = this;
    this.status.beginRequest(request);
    this.delegate.request(method, url, request, function() {
      self.status.endRequest();
      try {
        callback.apply(this, arguments);
      } catch (e) {
        alert(toJson(e));
      }
      self.update();
    });
  }
};
function Users(server, controlBar) {
  this.server = server;
  this.controlBar = controlBar;
};

Users.prototype = {
  'fetchCurrentUser':function(callback) {
    var self = this;
    this.server.request("GET", "/account.json", {}, function(code, response){
      self.current = response.user;
      callback(response.user);
    });
  },
  
  'logout': function(callback) {
    var self = this;
    this.controlBar.logout(function(){
      delete self.current;
      (callback||noop)();
    });
  },
  
  'login': function(callback) {
    var self = this;
    this.controlBar.login(function(){
      self.fetchCurrentUser(function(){
        (callback||noop)();
      });
    });
  },

  'notAuthorized': function(){
    this.controlBar.notAuthorized();
  }
};
foreach({
  'regexp': function(value, regexp, msg) {
    if (!value.match(regexp)) {
      return msg ||
        "Value does not match expected format " + regexp + ".";
    } else {
      return null;
    }
  },
  
  'number': function(value, min, max) {
    var num = 1 * value;
    if (num == value) {
      if (typeof min != 'undefined' && num < min) {
        return "Value can not be less than " + min + ".";
      }
      if (typeof min != 'undefined' && num > max) {
        return "Value can not be greater than " + max + ".";
      }
      return null;
    } else {
      return "Value is not a number.";
    }
  },
  
  'integer': function(value, min, max) {
    var number = angularValidator['number'](value, min, max);
    if (number === null && value != Math.round(value)) {
      return "Value is not a whole number.";
    }
    return number;
  },
  
  'date': function(value, min, max) {
    if (value.match(/^\d\d?\/\d\d?\/\d\d\d\d$/)) {
      return null;
    }
    return "Value is not a date. (Expecting format: 12/31/2009).";
  },
  
  'ssn': function(value) {
    if (value.match(/^\d\d\d-\d\d-\d\d\d\d$/)) {
      return null;
    }
    return "SSN needs to be in 999-99-9999 format.";
  },
  
  'email': function(value) {
    if (value.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/)) {
      return null;
    }
    return "Email needs to be in username@host.com format.";
  },
  
  'phone': function(value) {
    if (value.match(/^1\(\d\d\d\)\d\d\d-\d\d\d\d$/)) {
      return null;
    }
    if (value.match(/^\+\d{2,3} (\(\d{1,5}\))?[\d ]+\d$/)) {
      return null;
    }
    return "Phone number needs to be in 1(987)654-3210 format in North America or +999 (123) 45678 906 internationaly.";
  },
  
  'url': function(value) {
    if (value.match(/^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/)) {
      return null;
    }
    return "URL needs to be in http://server[:port]/path format.";
  },
  
  'json': function(value) {
    try {
      fromJson(value);
      return null;
    } catch (e) {
      return e.toString();
    }
  }
}, function(v,k) {angularValidator[k] = v;});
function WidgetFactory(serverUrl, database) {
  this.nextUploadId = 0;
  this.serverUrl = serverUrl;
  this.database = database;
  if (window.swfobject) {
    this.createSWF = swfobject.createSWF;
  } else {
    this.createSWF = function(){
      alert("ERROR: swfobject not loaded!");
    };
  }
  this.onChangeListener = function(){};
};

WidgetFactory.prototype = {
  createController: function(input, scope) {
    var controller;
    var type = input.attr('type').toLowerCase();
    var exp = input.attr('name');
    if (exp) exp = exp.split(':').pop();
    var event = "change";
    var bubbleEvent = true;
    if (type == 'button' || type == 'submit' || type == 'reset' || type == 'image') {
      controller = new ButtonController(input[0], exp);
      event = "click";
      bubbleEvent = false;
    } else if (type == 'text' || type == 'textarea' || type == 'hidden' || type == 'password') {
      controller = new TextController(input[0], exp);
      event = "keyup change";
    } else if (type == 'checkbox') {
      controller = new CheckboxController(input[0], exp);
      event = "click";
    } else if (type == 'radio') {
      controller = new RadioController(input[0], exp);
      event="click";
    } else if (type == 'select-one') {
      controller = new SelectController(input[0], exp);
    } else if (type == 'select-multiple') {
      controller = new MultiSelectController(input[0], exp);
    } else if (type == 'file') {
      controller = this.createFileController(input, exp);
    } else {
      throw 'Unknown type: ' + type;
    }
    input.data('controller', controller);
    var binder = scope.get('$binder');
    var action = function() {
      if (controller.updateModel(scope)) {
        var action = jQuery(controller.view).attr('ng-action') || "";
        if (scope.evalWidget(controller, action)) {
          binder.updateView(scope);
        }
      }
      return bubbleEvent;
    };
    jQuery(controller.view, ":input").
      bind(event, action);
    return controller;
  },
  
  createFileController: function(fileInput) {
    var uploadId = '__uploadWidget_' + (this.nextUploadId++);
    var view = FileController.template(uploadId);
    fileInput.after(view);
    var att = {
        data:this.serverUrl + "/admin/ServerAPI.swf",
        width:"95", height:"20", align:"top",
        wmode:"transparent"};
    var par = {
        flashvars:"uploadWidgetId=" + uploadId,
        allowScriptAccess:"always"};
    var swfNode = this.createSWF(att, par, uploadId);
    fileInput.remove();
    var cntl = new FileController(view, fileInput[0].name, swfNode, this.serverUrl + "/data/" + this.database);
    jQuery(swfNode).data('controller', cntl);
    return cntl;
  },
  
  createTextWidget: function(textInput) {
    var controller = new TextController(textInput);
    controller.onChange(this.onChangeListener);
    return controller;
  }
};
/////////////////////
// FileController
///////////////////////

function FileController(view, scopeName, uploader, databaseUrl) {
  this.view = view;
  this.uploader = uploader;
  this.scopeName = scopeName;
  this.attachmentsPath = databaseUrl + '/_attachments';
  this.value = null;
  this.lastValue = undefined;
};

FileController.dispatchEvent = function(id, event, args) {
  var object = document.getElementById(id);
  var controller = jQuery(object).data("controller");
  FileController.prototype['_on_' + event].apply(controller, args);
};

FileController.template = function(id) {
  return jQuery('<span class="ng-upload-widget">' +
      '<input type="checkbox" ng-non-bindable="true"/>' +
      '<object id="' + id + '" />' +
      '<a></a>' +
      '<span/>' +
    '</span>');
};

FileController.prototype = {
  '_on_cancel': noop,
  '_on_complete': noop,
  '_on_httpStatus': function(status) {
    alert("httpStatus:" + this.scopeName + " status:" + status);
  },
  '_on_ioError': function() {
    alert("ioError:" + this.scopeName);
  },
  '_on_open': function() {
    alert("open:" + this.scopeName);
  },
  '_on_progress':noop,
  '_on_securityError':  function() {
    alert("securityError:" + this.scopeName);
  },
  '_on_uploadCompleteData': function(data) {
    var value = fromJson(data);
    value.url = this.attachmentsPath + '/' + value.id + '/' + value.text;
    this.view.find("input").attr('checked', true);
    var scope = this.view.scope();
    this.value = value;
    this.updateModel(scope);
    this.value = null;
    scope.get('$binder').updateView();
  },  
  '_on_select': function(name, size, type) {
    this.name = name;
    this.view.find("a").text(name).attr('href', name);
    this.view.find("span").text(angular['filter']['bytes'](size));
    this.upload();
  },
  
  updateModel: function(scope) {
    var isChecked = this.view.find("input").attr('checked');
    var value = isChecked ? this.value : null;
    if (this.lastValue === value) {
      return false;
    } else {
      scope.set(this.scopeName, value);
      return true;
    }
  },
  
  updateView: function(scope) {
    var modelValue = scope.get(this.scopeName);
    if (modelValue && this.value !== modelValue) {
      this.value = modelValue;
      this.view.find("a").
        attr("href", this.value.url).
        text(this.value.text);
      this.view.find("span").text(angular['filter']['bytes'](this.value.size));
    }
    this.view.find("input").attr('checked', !!modelValue);
  },
  
  upload: function() {
    if (this.name) {
      this.uploader.uploadFile(this.attachmentsPath);
    }
  }
};

///////////////////////
// NullController
///////////////////////
function NullController(view) {this.view = view;};
NullController.prototype = {
  updateModel: function() { return true; },
  updateView: noop
};
NullController.instance = new NullController();


///////////////////////
// ButtonController
///////////////////////
var ButtonController = NullController;

///////////////////////
// TextController
///////////////////////
function TextController(view, exp) {
  this.view = view;
  this.exp = exp;
  this.validator = view.getAttribute('ng-validate');
  this.required = typeof view.attributes['ng-required'] != "undefined";
  this.lastErrorText = null;
  this.lastValue = undefined;
  this.initialValue = view.value;
  var widget = view.getAttribute('ng-widget');
  if (widget === 'datepicker') {
    jQuery(view).datepicker();
  }
};

TextController.prototype = {
  updateModel: function(scope) {
    var value = this.view.value;
    if (this.lastValue === value) {
      return false;
    } else {
      scope.setEval(this.exp, value);
      this.lastValue = value;
      return true;
    }
  },
  
  updateView: function(scope) {
    var view = this.view;
    var value = scope.get(this.exp);
    if (typeof value === "undefined") {
      value = this.initialValue;
      scope.setEval(this.exp, value);
    }
    value = value ? value : '';
    if (this.lastValue != value) {
      view.value = value;
      this.lastValue = value;
    }
    var isValidationError = false;
    view.removeAttribute('ng-error');
    if (this.required) {
      isValidationError = !(value && value.length > 0);
    }
    var errorText = isValidationError ? "Required Value" : null;
    if (!isValidationError && this.validator && value) {
      errorText = scope.validate(this.validator, value);
      isValidationError = !!errorText;
    }
    if (this.lastErrorText !== errorText) {
      this.lastErrorText = isValidationError;
      if (errorText !== null) {
        view.setAttribute('ng-error', errorText);
        scope.markInvalid(this);
      }
      jQuery(view).toggleClass('ng-validation-error', isValidationError);
    }
  }
};

///////////////////////
// CheckboxController
///////////////////////
function CheckboxController(view, exp) {
  this.view = view;
  this.exp = exp;
  this.lastValue = undefined;
  this.initialValue = view.checked ? view.value : "";
};

CheckboxController.prototype = {
    updateModel: function(scope) {
    var input = this.view;
    var value = input.checked ? input.value : '';
    if (this.lastValue === value) {
      return false;
    } else {
      scope.setEval(this.exp, value);
      this.lastValue = value;
      return true;
    }
  },
  
  updateView: function(scope) {
    var input = this.view;
    var value = scope.eval(this.exp);
    if (typeof value === "undefined") {
      value = this.initialValue;
      scope.setEval(this.exp, value);
    }
    input.checked = input.value == (''+value);
  }
};

///////////////////////
// SelectController
///////////////////////
function SelectController(view, exp) {
  this.view = view;
  this.exp = exp;
  this.lastValue = undefined;
  this.initialValue = view.value;
};

SelectController.prototype = {
  updateModel: function(scope) {
    var input = this.view;
    if (input.selectedIndex < 0) {
      scope.setEval(this.exp, null);
    } else {
      var value = this.view.value;
      if (this.lastValue === value) {
        return false;
      } else {
        scope.setEval(this.exp, value);
        this.lastValue = value;
        return true;
      }
    }
  },
  
  updateView: function(scope) {
    var input = this.view;
    var value = scope.get(this.exp);
    if (typeof value === 'undefined') {
      value = this.initialValue;
      scope.setEval(this.exp, value);
    }
    if (value !== this.lastValue) {
      input.value = value ? value : "";
      this.lastValue = value;
    }
  }
};

///////////////////////
// MultiSelectController
///////////////////////
function MultiSelectController(view, exp) {
  this.view = view;
  this.exp = exp;
  this.lastValue = undefined;
  this.initialValue = this.selected();
};

MultiSelectController.prototype = {
  selected: function () {
    var value = [];
    var options = this.view.options;
    for ( var i = 0; i < options.length; i++) {
      var option = options[i];
      if (option.selected) {
        value.push(option.value);
      }
    }
    return value;
  },
  
  updateModel: function(scope) {
    var value = this.selected();
    // TODO: This is wrong! no caching going on here as we are always comparing arrays
    if (this.lastValue === value) {
      return false;
    } else {
      scope.setEval(this.exp, value);
      this.lastValue = value;
      return true;
    }
  },
  
  updateView: function(scope) {
    var input = this.view;
    var selected = scope.get(this.exp);
    if (typeof selected === "undefined") {
      selected = this.initialValue;
      scope.setEval(this.exp, selected);
    }
    if (selected !== this.lastValue) {
      var options = input.options;
      for ( var i = 0; i < options.length; i++) {
        var option = options[i];
        option.selected = _.include(selected, option.value);
      }
      this.lastValue = selected;
    }
  }
};

///////////////////////
// RadioController
///////////////////////
function RadioController(view, exp) {
  this.view = view;
  this.exp = exp;
  this.lastChecked = undefined;
  this.lastValue = undefined;
  this.inputValue = view.value;
  this.initialValue = view.checked ? view.value : null;
};

RadioController.prototype = {
  updateModel: function(scope) {
    var input = this.view;
    if (this.lastChecked) {
      return false;
    } else {
      input.checked = true;
      this.lastValue = scope.setEval(this.exp, this.inputValue);
      this.lastChecked = true;
      return true;
    }
  },
  
  updateView: function(scope) {
    var input = this.view;
    var value = scope.get(this.exp);
    if (this.initialValue && typeof value === "undefined") {
      value = this.initialValue;
      scope.setEval(this.exp, value);
    }
    if (this.lastValue != value) {
      this.lastChecked = input.checked = this.inputValue == (''+value);
      this.lastValue = value;
    }
  }
};

///////////////////////
//ElementController
///////////////////////
function BindUpdater(view, exp) {
  this.view = view;
  this.exp = Binder.parseBindings(exp);
  this.hasError = false;
  this.scopeSelf = {element:view};
};

BindUpdater.toText = function(obj) {
  var e = escapeHtml;
  switch(typeof obj) {
    case "string":
    case "boolean":
    case "number":
      return e(obj);
    case "function":
      return BindUpdater.toText(obj());
    case "object":
      if (isNode(obj)) {
        return outerHTML(obj);
      } else if (obj instanceof angular.filter.Meta) {
        switch(typeof obj.html) {
          case "string":
          case "number":
            return obj.html;
          case "function":
            return obj.html();
          case "object":
            if (isNode(obj.html))
              return outerHTML(obj.html);
          default:
            break;
        }
        switch(typeof obj.text) {
          case "string":
          case "number":
            return e(obj.text);
          case "function":
            return e(obj.text());
          default:
            break;
        }
      }
      if (obj === null)
        return "";
      return e(toJson(obj, true));
    default:
      return "";
  }
};

BindUpdater.prototype = {
  updateModel: noop,
  updateView: function(scope) {
    var html = [];
    var parts = this.exp;
    var length = parts.length;
    for(var i=0; i<length; i++) {
      var part = parts[i];
      var binding = Binder.binding(part);
      if (binding) {
        scope.evalWidget(this, binding, this.scopeSelf, function(value){
          html.push(BindUpdater.toText(value));
        }, function(e, text){
          setHtml(this.view, text);
        });
        if (this.hasError) {
          return;
        }
      } else {
        html.push(escapeHtml(part));
      }
    }
    setHtml(this.view, html.join(''));
  }
};

function BindAttrUpdater(view, attrs) {
  this.view = view;
  this.attrs = attrs;
};

BindAttrUpdater.prototype = {
  updateModel: noop,
  updateView: function(scope) {
    var jNode = jQuery(this.view);
    var attributeTemplates = this.attrs;
    if (this.hasError) {
      this.hasError = false;
      jNode.
        removeClass('ng-exception').
        removeAttr('ng-error');
    }
    var isImage = jNode.is('img');
    for (var attrName in attributeTemplates) {
      var attributeTemplate = Binder.parseBindings(attributeTemplates[attrName]);
      var attrValues = [];
      for ( var i = 0; i < attributeTemplate.length; i++) {
        var binding = Binder.binding(attributeTemplate[i]);
        if (binding) {
          try {
            var value = scope.eval(binding, {element:jNode[0], attrName:attrName});
            if (value && (value.constructor !== array || value.length !== 0))
              attrValues.push(value);
          } catch (e) {
            this.hasError = true;
            error('BindAttrUpdater', e);
            var jsonError = toJson(e, true);
            attrValues.push('[' + jsonError + ']');
            jNode.
              addClass('ng-exception').
              attr('ng-error', jsonError);
          }
        } else {
          attrValues.push(attributeTemplate[i]);
        }
      }
      var attrValue = attrValues.length ? attrValues.join('') : null;
      if(isImage && attrName == 'src' && !attrValue)
        attrValue = scope.get('config.server') + '/images/blank.gif';
      jNode.attr(attrName, attrValue);
    } 
  }
};

function EvalUpdater(view, exp) {
  this.view = view;
  this.exp = exp;
  this.hasError = false;
};
EvalUpdater.prototype = {
  updateModel: noop,
  updateView: function(scope) {
    scope.evalWidget(this, this.exp);
  }
};

function HideUpdater(view, exp) { this.view = view; this.exp = exp; };
HideUpdater.prototype = {
  updateModel: noop,
  updateView: function(scope) {
    scope.evalWidget(this, this.exp, {}, function(hideValue){
      var view = jQuery(this.view);
      if (toBoolean(hideValue)) {
        view.hide();
      } else {
        view.show();
      }
    });
  }
};

function ShowUpdater(view, exp) { this.view = view; this.exp = exp; };
ShowUpdater.prototype = {
  updateModel: noop,
  updateView: function(scope) {
    scope.evalWidget(this, this.exp, {}, function(hideValue){
      var view = jQuery(this.view);
      if (toBoolean(hideValue)) {
        view.show();
      } else {
        view.hide();
      }
    });
  }
};

function ClassUpdater(view, exp) { this.view = view; this.exp = exp; };
ClassUpdater.prototype = {
  updateModel: noop,
  updateView: function(scope) {
    scope.evalWidget(this, this.exp, {}, function(classValue){
      if (classValue !== null && classValue !== undefined) {
        this.view.className = classValue;
      }
    });
  }
};

function ClassEvenUpdater(view, exp) { this.view = view; this.exp = exp; };
ClassEvenUpdater.prototype = {
  updateModel: noop,
  updateView: function(scope) {
    scope.evalWidget(this, this.exp, {}, function(classValue){
      var index = scope.get('$index');
      jQuery(this.view).toggleClass(classValue, index % 2 === 1);
    });
  }
};

function ClassOddUpdater(view, exp) { this.view = view; this.exp = exp; };
ClassOddUpdater.prototype = {
  updateModel: noop,
  updateView: function(scope) {
    scope.evalWidget(this, this.exp, {}, function(classValue){
      var index = scope.get('$index');
      jQuery(this.view).toggleClass(classValue, index % 2 === 0);
    });
  }
};

function StyleUpdater(view, exp) { this.view = view; this.exp = exp; };
StyleUpdater.prototype = {
  updateModel: noop,
  updateView: function(scope) {
    scope.evalWidget(this, this.exp, {}, function(styleValue){
      jQuery(this.view).attr('style', "").css(styleValue);
    });
  }
};

///////////////////////
// RepeaterUpdater
///////////////////////
function RepeaterUpdater(view, repeaterExpression, template, prefix) {
  this.view = view;
  this.template = template;
  this.prefix = prefix;
  this.children = [];
  var match = repeaterExpression.match(/^\s*(.+)\s+in\s+(.*)\s*$/);
  if (! match) {
    throw "Expected ng-repeat in form of 'item in collection' but got '" +
      repeaterExpression + "'.";
  }
  var keyValue = match[1];
  this.iteratorExp = match[2];
  match = keyValue.match(/^([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\)$/);
  if (!match) {
    throw "'item' in 'item in collection' should be identifier or (key, value) but get '" +
      keyValue + "'.";
  }
  this.valueExp = match[3] || match[1];
  this.keyExp = match[2];
};

RepeaterUpdater.prototype = {
  updateModel: noop,
  updateView: function(scope) {
    scope.evalWidget(this, this.iteratorExp, {}, function(iterator){
      var self = this;
      if (!iterator) {
        iterator = [];
        if (scope.isProperty(this.iteratorExp)) {
          scope.set(this.iteratorExp, iterator);
        }
      }
      var iteratorLength = iterator.length;
      var childrenLength = this.children.length;
      var cursor = this.view;
      var time = 0;
      var child = null;
      var keyExp = this.keyExp;
      var valueExp = this.valueExp;
      var i = 0;
      foreach(iterator, function(value, key){
        if (i < childrenLength) {
          // reuse children
          child = self.children[i];
          child.scope.set(valueExp, value);
        } else {
          // grow children
          var name = self.prefix +
            valueExp + " in " + self.iteratorExp + "[" + i + "]";
          var childScope = new Scope(scope.state, name);
          childScope.set('$index', i);
          if (keyExp)
            childScope.set(keyExp, key);
          childScope.set(valueExp, value);
          child = { scope:childScope, element:self.template(childScope, self.prefix, i) };
          cursor.after(child.element);
          self.children.push(child);
        }
        cursor = child.element;
        var s = new Date().getTime();
        child.scope.updateView();
        time += new Date().getTime() - s;
        i++;
      });
      // shrink children
      for ( var r = childrenLength; r > iteratorLength; --r) {
        var unneeded = this.children.pop().element[0];
        unneeded.parentNode.removeChild(unneeded);
      }
      // Special case for option in select
      if (child && child.element[0].nodeName === "OPTION") {
        var select = jQuery(child.element[0].parentNode);
        var cntl = select.data('controller');
        if (cntl) {
          cntl.lastValue = undefined;
          cntl.updateView(scope);
        }
      }
    });
  }
};

//////////////////////////////////
// PopUp
//////////////////////////////////

function PopUp(doc) {
  this.doc = doc;
};

PopUp.OUT_EVENT = "mouseleave mouseout click dblclick keypress keyup";

PopUp.onOver = function(e) {
  PopUp.onOut();
  var jNode = jQuery(this);
  jNode.bind(PopUp.OUT_EVENT, PopUp.onOut);
  var position = jNode.position();
  var de = document.documentElement;
  var w = self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
  var hasArea = w - position.left;
  var width = 300;
  var title = jNode.hasClass("ng-exception") ? "EXCEPTION:" : "Validation error...";
  var msg = jNode.attr("ng-error");

  var x;
  var arrowPos = hasArea>(width+75) ? "left" : "right";
  var tip = jQuery(
    "<div id='ng-callout' style='width:"+width+"px'>" +
      "<div class='ng-arrow-"+arrowPos+"'/>" +
      "<div class='ng-title'>"+title+"</div>" +
      "<div class='ng-content'>"+msg+"</div>" +
    "</div>");
  jQuery("body").append(tip);
  if(arrowPos === 'left'){
    x = position.left + this.offsetWidth + 11;
  }else{
    x = position.left - (width + 15);
    tip.find('.ng-arrow-right').css({left:width+1});
  }

  tip.css({left: x+"px", top: (position.top - 3)+"px"});
  return true;
};

PopUp.onOut = function() {
  jQuery('#ng-callout').
    unbind(PopUp.OUT_EVENT, PopUp.onOut).
    remove();
  return true;
};

PopUp.prototype = {
  bind: function () {
    var self = this;
    this.doc.find('.ng-validation-error,.ng-exception').
      live("mouseover", PopUp.onOver);
  }
};

//////////////////////////////////
// Status
//////////////////////////////////


function Status(body) {
  this.loader = body.append(Status.DOM).find("#ng-loading");
  this.requestCount = 0;
};

Status.DOM ='<div id="ng-spacer"></div><div id="ng-loading">loading....</div>';

Status.prototype = {
  beginRequest: function () {
    if (this.requestCount === 0) {
      this.loader.show();
    }
    this.requestCount++;
  },
  
  endRequest: function () {
    this.requestCount--;
    if (this.requestCount === 0) {
      this.loader.hide("fold");
    }
  }
};
})(window, document);