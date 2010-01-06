// Copyright (C) 2008,2009 BRAT Tech LLC

if (typeof nglr == 'undefined') nglr = {};

if (typeof console == 'undefined') console = {};
if (typeof console.log == 'undefined')
  console.log = function() {};
if (typeof console.error == 'undefined')
  console.error = function() {};

nglr.XSitePost = function(baseUrl, window, prefix) {
  this.baseUrl = baseUrl;
  this.post = jQuery.post;
  this.window = window;
  this.inQueue = {};
  this.outQueue = [];
  this.maxMsgSize = 100000;
  this.delay = 20;
  this.prefix = prefix;
  this.setTimeout=function(fn, delay){window.setTimeout(fn, delay);};
};

nglr.XSitePost.prototype.init = function() {
  this.window.name = '';
  this.response('ready', 'null');
};

nglr.XSitePost.prototype.incomingFragment = function(fragment) {
  var parts = fragment.split(";");
  this.incomingMsg(parts.shift(), 1*parts.shift(), 1*parts.shift(), parts.shift());
};

nglr.XSitePost.prototype.incomingMsg = function(id, partNo, totalParts, msgPart) {
  var msg = this.inQueue[id];
  if (!msg) {
    msg = {id:id, parts:[], count:0};
    this.inQueue[id] = msg;
  }
  msg.parts[partNo] = msgPart;
  msg.count++;
  if (totalParts === msg.count) {
    delete this.inQueue[id];
    var request = this.decodePost(msg.parts.join(''));
    var self = this;
    this.post(this.baseUrl + request.url, request.params, function(response, status){
      self.response(id, response, status);
    });
  }
};

nglr.XSitePost.prototype.response = function(id, response, status) {
  var start = 0;
  var end;
  var msg = Base64.encode(response);
  var msgLen = msg.length;
  var total = Math.ceil(msgLen / this.maxMsgSize);
  var part = 0;
  while (start < msgLen) {
    end = Math.min(msgLen, start + this.maxMsgSize);
    this.outQueue.push(id + ':'+part+':'+total+':' + msg.substring(start, end));
    start = end;
    part++;
  }
};

nglr.XSitePost.prototype.decodePost = function(post) {
  var parts = post.split(':');
  var url = Base64.decode(parts.shift());
  var params = {};
  while(parts.length !== 0) {
    var key = parts.shift();
    var value = Base64.decode(parts.shift());
    params[key] = value;
  }
  return {url:url, params:params};
};

nglr.XSitePost.prototype.listen = function() {
  console.log("listen()");
  var self = this;
  var window = this.window;
  var outQueue = this.outQueue;
  var setTimeout = this.setTimeout;
  var prefix = this.prefix;
  var prefixLen = prefix.length;
  var prefixRec = prefix + '>';
  var prefixRecLen = prefixRec.length;
  window.name = prefix;
  var pull = function(){
    var value = window.name;
    if (value == prefix && outQueue.length > 0) {
      window.name = prefix + '<' + outQueue.shift();
    } else if (value.substr(0, prefixRecLen) == prefixRec) {
      self.incomingFragment(value.substr(prefixRecLen));
      window.name = prefix;
    }
    setTimeout(pull, self.delay);
  };
  pull();
};
