// Copyright (C) 2008,2009 BRAT Tech LLC
Users = function(server, controlBar) {
  this.server = server;
  this.controlBar = controlBar;
};

Users.prototype = {
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
      (callback||noop)();
    });
  },
  
  login: function(callback) {
    var self = this;
    this.controlBar.login(function(){
      self.fetchCurrentUser(function(){
        (callback||noop)();
      });
    });
  },

  notAuthorized: function(){
    this.controlBar.notAuthorized();
  }
};
