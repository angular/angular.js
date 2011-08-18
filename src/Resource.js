'use strict';



function Route(template, defaults) {
  this.template = template = template + '#';
  this.defaults = defaults || {};
  var urlParams = this.urlParams = {};
  forEach(template.split(/\W/), function(param){
    if (param && template.match(new RegExp(":" + param + "\\W"))) {
      urlParams[param] = true;
    }
  });
}

Route.prototype = {
  url: function(params) {
    var self = this,
        url = this.template,
        encodedVal;

    params = params || {};
    forEach(this.urlParams, function(_, urlParam){
      encodedVal = encodeUriSegment(params[urlParam] || self.defaults[urlParam] || "");
      url = url.replace(new RegExp(":" + urlParam + "(\\W)"), encodedVal + "$1");
    });
    url = url.replace(/\/?#$/, '');
    var query = [];
    forEachSorted(params, function(value, key){
      if (!self.urlParams[key]) {
        query.push(encodeUriQuery(key) + '=' + encodeUriQuery(value));
      }
    });
    url = url.replace(/\/*$/, '');
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
      forEach(paramDefaults || {}, function(value, key){
        ids[key] = value.charAt && value.charAt(0) == '@' ? getter(data, value.substr(1)) : value;
      });
      return ids;
    }

    function Resource(value){
      copy(value || {}, this);
    }

    forEach(actions, function(action, name){
      var isPostOrPut = action.method == 'POST' || action.method == 'PUT';
      Resource[name] = function (a1, a2, a3, a4) {
        var params = {};
        var data;
        var success = noop;
        var error = null;
        switch(arguments.length) {
        case 4:
          error = a4;
          success = a3;
          //fallthrough
        case 3:
        case 2:
          if (isFunction(a2)) {
            if (isFunction(a1)) {
              success = a1;
              error = a2;
              break;
            }

            success = a2;
            error = a3;
            //fallthrough
          } else {
            params = a1;
            data = a2;
            success = a3;
            break;
          }
        case 1:
          if (isFunction(a1)) success = a1;
          else if (isPostOrPut) data = a1;
          else params = a1;
          break;
        case 0: break;
        default:
          throw "Expected between 0-4 arguments [params, data, success, error], got " +
            arguments.length + " arguments.";
        }

        var value = this instanceof Resource ? this : (action.isArray ? [] : new Resource(data));
        self.xhr(
          action.method,
          route.url(extend({}, action.params || {}, extractParams(data), params)),
          data,
          function(status, response) {
            if (response) {
              if (action.isArray) {
                value.length = 0;
                forEach(response, function(item) {
                  value.push(new Resource(item));
                });
              } else {
                copy(response, value);
              }
            }
            (success||noop)(value);
          },
          error || action.verifyCache,
          action.verifyCache);
        return value;
      };

      Resource.bind = function(additionalParamDefaults){
        return self.route(url, extend({}, paramDefaults, additionalParamDefaults), actions);
      };

      Resource.prototype['$' + name] = function(a1, a2, a3) {
        var params = extractParams(this),
            success = noop,
            error;

        switch(arguments.length) {
        case 3: params = a1; success = a2; error = a3; break;
        case 2:
        case 1:
          if (isFunction(a1)) {
            success = a1;
            error = a2;
          } else {
            params = a1;
            success = a2 || noop;
          }
        case 0: break;
        default:
          throw "Expected between 1-3 arguments [params, success, error], got " +
            arguments.length + " arguments.";
        }
        var data = isPostOrPut ? this : undefined;
        Resource[name].call(this, params, data, success, error);
      };
    });
    return Resource;
  }
};
