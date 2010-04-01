angularService("$window", bind(window, identity, window));

var URL_MATCH = /^(file|ftp|http|https):\/\/(\w+:{0,1}\w*@)?([\w\.]+)(:([0-9]+))?([^\?#]+)?(\?([^#]*))((#([^\?]*))(\?([^\?]*))?)$/;
angularService("$location", function(){
  var scope = this;
  function location(url){
    if (isDefined(url)) {
      var match = URL_MATCH.exec(url);
      dump(match);
      location.href = url;
      location.protocol = match[1];
      location.host = match[3];
      location.port = match[5];
      location.path = match[6];
      location.search = parseKeyValue(match[8]);
      location.hash = match[9];
      location.hashPath = match[11];
      location.hashSearch = parseKeyValue(match[13]);
      foreach(location, dump);
    }
    var params = [];
    foreach(location.param, function(value, key){
      params.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    });
    return (location.path ? location.path : '') + (params.length ? '?' + params.join('&') : '');
  };
  this.$config.location.watch(function(url){
    location(url);
  });
  this.$onEval(PRIORITY_LAST, function(){
    scope.$config.location.set(location());
  });
  return location;
});
