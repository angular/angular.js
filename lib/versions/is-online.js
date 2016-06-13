"use strict";

var isOnlineAsync = require('is-online');

isOnlineAsync(function(err, isOnline) {
  console.log(isOnline ? 'online' : 'offline');
});