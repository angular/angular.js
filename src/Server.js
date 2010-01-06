// Copyright (C) 2008,2009 BRAT Tech LLC

nglr.Server = function(url, getScript) {
  this.url = url;
  this.nextId = 0;
  this.getScript = getScript;
  this.uuid = "_" + ("" + Math.random()).substr(2) + "_";
  this.maxSize = 1800;
};

nglr.Server.prototype.base64url = function(txt) {
  return Base64.encode(txt);
};

nglr.Server.prototype.request = function(method, url, request, callback) {
  var requestId = this.uuid + (this.nextId++);
  nglr[requestId] = function(response) {
    delete nglr[requestId];
    callback(200, response);
  };
  var payload = {u:url, m:method, p:request};
  payload = this.base64url(nglr.toJson(payload));
  var totalPockets = Math.ceil(payload.length / this.maxSize);
  var baseUrl = this.url + "/$/" + requestId +  "/" + totalPockets + "/";
  for ( var pocketNo = 0; pocketNo < totalPockets; pocketNo++) {
    var pocket = payload.substr(pocketNo * this.maxSize, this.maxSize);
    this.getScript(baseUrl + (pocketNo+1) + "?h=" + pocket, nglr.noop);
  }
};

nglr.FrameServer = function(frame) {
  this.frame = frame;
};
nglr.FrameServer.PREFIX = "$DATASET:";

nglr.FrameServer.prototype = {
  read:function(){
    this.data = nglr.fromJson(this.frame.name.substr(nglr.FrameServer.PREFIX.length));
  },
  write:function(){
    this.frame.name = nglr.FrameServer.PREFIX +  nglr.toJson(this.data);
  }, 
  request: function(method, url, request, callback) {
    //alert(method + " " + url + " " + nglr.toJson(request) + " " + nglr.toJson(callback));
  }
};


nglr.VisualServer = function(delegate, status, update) {
  this.delegate = delegate;
  this.update = update;
  this.status = status;
};

nglr.VisualServer.prototype = {
  request:function(method, url, request, callback) {
    var self = this;
    this.status.beginRequest(request);
    this.delegate.request(method, url, request, function() {
      self.status.endRequest();
      try {
        callback.apply(this, arguments);
      } catch (e) {
        nglr.alert(nglr.toJson(e));
      }
      self.update();
    });
  }
};
