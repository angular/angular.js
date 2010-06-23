function Route(template, defaults) {
  this.template = template = template + '#';
  this.defaults = defaults || {};
  var urlParams = this.urlParams = {};
  foreach(template.split(/\W/), function(param){
    if (param && template.match(new RegExp(":" + param + "\\W"))) {
      urlParams[param] = true;
    }
  });
}

Route.prototype = {
  url: function(params) {
    var path = [];
    var self = this;
    var url = this.template;
    params = params || {};
    foreach(this.urlParams, function(_, urlParam){
      var value = params[urlParam] || self.defaults[urlParam] || "";
      url = url.replace(new RegExp(":" + urlParam + "(\\W)"), value + "$1");
    });
    url = url.replace(/\/?#$/, '');
    var query = [];
    foreachSorted(params, function(value, key){
      if (!self.urlParams[key]) {
        query.push(encodeURI(key) + '=' + encodeURI(value));
      }
    });
    return url + (query.length ? '?' + query.join('&') : '');
  }
};

function ResourceFactory(xhr) {
  this.xhr = xhr;
}

ResourceFactory.DEFAULT_ACTIONS = {
  'get':    {method:'GET'},
  'save':   {method:'POST'},
  'query':  {method:'GET', isArray:true},
  'remove': {method:'DELETE'},
  'delete': {method:'DELETE'}
};

ResourceFactory.prototype = {
  route: function(url, paramDefaults, actions){
    var self = this;
    var route = new Route(url);
    actions = extend({}, ResourceFactory.DEFAULT_ACTIONS, actions);
    function extractParams(data){
      var ids = {};
      foreach(paramDefaults || {}, function(value, key){
        ids[key] = value.charAt && value.charAt(0) == '@' ? getter(data, value.substr(1)) : value;
      });
      return ids;
    }

    function Resource(value){
      copy(value || {}, this);
    }

    foreach(actions, function(action, name){
      var isGet = action.method == 'GET';
      var isPost = action.method == 'POST';
      Resource[name] = function (a1, a2, a3) {
        var params = {};
        var data;
        var callback = noop;
        switch(arguments.length) {
        case 3: callback = a3;
        case 2:
          if (isFunction(a2)) {
            callback = a2;
          } else {
            params = a1;
            data = a2;
            break;
          }
        case 1:
          if (isFunction(a1)) callback = a1;
          else if (isPost) data = a1;
          else params = a1;
          break;
        case 0: break;
        default:
          throw "Expected between 0-3 arguments [params, data, callback], got " + arguments.length + " arguments.";
        }

        var value = action.isArray ? [] : new Resource(data);
        self.xhr(
          action.method,
          route.url(extend({}, action.params || {}, extractParams(data), params)),
          data,
          function(status, response) {
            if (status == 200) {
              if (action.isArray) {
                if (action.cacheThenRetrieve)
                  value = [];
                foreach(response, function(item){
                  value.push(new Resource(item));
                });
              } else {
                copy(response, value);
              }
              (callback||noop)(value);
            } else {
              throw {status: status, response:response, message: status + ": " + response};
            }
          },
          action.cacheThenRetrieve
        );
        return value;
      };

      Resource.bind = function(additionalParamDefaults){
        return self.route(url, extend({}, paramDefaults, additionalParamDefaults), actions);
      };

      if (!isGet) {
        Resource.prototype['$' + name] = function(a1, a2){
          var params = {};
          var callback = noop;
          switch(arguments.length) {
          case 2: params = a1; callback = a2;
          case 1: if (typeof a1 == 'function') callback = a1; else params = a1;
          case 0: break;
          default:
            throw "Expected between 1-2 arguments [params, callback], got " + arguments.length + " arguments.";
          }
          var self = this;
          Resource[name](params, this, function(response){
            copy(response, self);
            callback(self);
          });
        };
      }
    });
    return Resource;
  }
};
