// Copyright (C) 2008,2009 BRAT Tech LLC
nglr.Users = function(server, controlBar) {
  this.server = server;
  this.controlBar = controlBar;
};

nglr.Users.prototype = {
  fetchCurrentUser:function(callback) {
    var self = this;
    this.server.request("GET", "/account.json", {}, function(code, response){
      self.current = response.user;
      callback(response.user);
    });
  },
  
  logout: function(callback) {
    var self = this;
    this.controlBar.logout(function(){
      delete self.current;
      (callback||nglr.noop)();
    });
  },
  
  login: function(callback) {
    var self = this;
    this.controlBar.login(function(){
      self.fetchCurrentUser(function(){
        (callback||nglr.noop)();
      });
    });
  },

  notAuthorized: function(){
    this.controlBar.notAuthorized();
  }
};
