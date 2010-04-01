angularService("$window", bind(window, identity, window));

angularService("$anchor", function(){
  var scope = this;
  function anchor(url){
    if (isDefined(url)) {
      if (url.charAt(0) == '#') url = url.substr(1);
      var pathQuery = url.split('?');
      anchor.path = decodeURIComponent(pathQuery[0]);
      anchor.param = {};
      foreach((pathQuery[1] || "").split('&'), function(keyValue){
        if (keyValue) {
          var parts = keyValue.split('=');
          var key = decodeURIComponent(parts[0]);
          var value = parts[1];
          if (!value) value = true;
          anchor.param[key] = decodeURIComponent(value);
        }
      });
    }
    var params = [];
    foreach(anchor.param, function(value, key){
      params.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    });
    return (anchor.path ? anchor.path : '') + (params.length ? '?' + params.join('&') : '');
  };
  this.$config.location.watch(function(url){
    anchor(url);
  });
  this.$onEval(PRIORITY_LAST, function(){
    scope.$config.location.set(anchor());
  });
  return anchor;
});
