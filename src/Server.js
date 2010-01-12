function Server(url, getScript) {
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
