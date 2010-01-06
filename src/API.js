angular.Global = {
  typeOf:function(obj){
    var type = typeof obj;
    switch(type) {
    case "object":
      if (obj === null) return "null";
      if (obj instanceof Array) return "array";
      if (obj instanceof Date) return "date";
      if (obj.nodeType == 1) return "element";
    }
    return type;
  }
};

angular.Collection = {};
angular.Object = {};
angular.Array = {
  includeIf:function(array, value, condition) {
    var index = _.indexOf(array, value);
    if (condition) {
      if (index == -1)
        array.push(value);
    } else {
      array.splice(index, 1);
    }
    return array;
  },
  sum:function(array, expression) {
    var fn = angular.Function.compile(expression);
    var sum = 0;
    for (var i = 0; i < array.length; i++) {
      var value = 1 * fn(array[i]);
      if (!isNaN(value)){
        sum += value;
      }
    }
    return sum;
  },
  remove:function(array, value) {
    var index = _.indexOf(array, value);
    if (index >=0)
      array.splice(index, 1);
    return value;
  },
  find:function(array, condition, defaultValue) {
    if (!condition) return undefined;
    var fn = angular.Function.compile(condition);
    _.detect(array, function($){
      if (fn($)){
        defaultValue = $;
        return true;
      }      
    });
    return defaultValue;
  },
  findById:function(array, id) {
    return angular.Array.find(array, function($){return $.$id == id;}, null);
  },
  filter:function(array, expression) {
    var predicates = [];
    predicates.check = function(value) {
      for (var j = 0; j < predicates.length; j++) {
        if(!predicates[j](value)) {
          return false;
        }
      }
      return true;
    };
    var getter = nglr.Scope.getter;
    var search = function(obj, text){
      if (text.charAt(0) === '!') {
        return !search(obj, text.substr(1));
      }
      switch (typeof obj) {
      case "boolean":
      case "number":
      case "string":
        return ('' + obj).toLowerCase().indexOf(text) > -1;
      case "object":
        for ( var objKey in obj) {
          if (objKey.charAt(0) !== '$' && search(obj[objKey], text)) {
            return true;
          }
        }
        return false;
      case "array":
        for ( var i = 0; i < obj.length; i++) {
          if (search(obj[i], text)) {
            return true;
          }
        }
        return false;
      default:
        return false;
      }
    };
    switch (typeof expression) {
      case "boolean":
      case "number":
      case "string":
        expression = {$:expression};
      case "object":
        for (var key in expression) {
          if (key == '$') {
            (function(){
              var text = (''+expression[key]).toLowerCase();
              if (!text) return;
              predicates.push(function(value) {
                return search(value, text);
              });
            })();
          } else {
            (function(){
              var path = key;
              var text = (''+expression[key]).toLowerCase();
              if (!text) return;
              predicates.push(function(value) {
                return search(getter(value, path), text);
              });
            })();
          }
        }
        break;
      case "function":
        predicates.push(expression);
        break;
      default:
        return array;
    }
    var filtered = [];
    for ( var j = 0; j < array.length; j++) {
      var value = array[j];
      if (predicates.check(value)) {
        filtered.push(value);
      }
    }
    return filtered;
  },
  add:function(array, value) {
    array.push(_.isUndefined(value)? {} : value);
    return array;
  },
  count:function(array, condition) {
    if (!condition) return array.length;
    var fn = angular.Function.compile(condition);
    return _.reduce(array, 0, function(count, $){return count + (fn($)?1:0);});
  },
  orderBy:function(array, expression, descend) {
    function reverse(comp, descending) {
      return nglr.toBoolean(descending) ? 
          function(a,b){return comp(b,a);} : comp;
    }
    function compare(v1, v2){
      var t1 = typeof v1;
      var t2 = typeof v2;
      if (t1 == t2) {
        if (t1 == "string") v1 = v1.toLowerCase();
        if (t1 == "string") v2 = v2.toLowerCase();
        if (v1 === v2) return 0;
        return v1 < v2 ? -1 : 1;
      } else {
        return t1 < t2 ? -1 : 1;
      }
    }
    expression = _.isArray(expression) ? expression: [expression];
    expression = _.map(expression, function($){
      var descending = false;
      if (typeof $ == "string" && ($.charAt(0) == '+' || $.charAt(0) == '-')) {
        descending = $.charAt(0) == '-';
        $ = $.substring(1);
      }
      var get = $ ? angular.Function.compile($) : _.identity;
      return reverse(function(a,b){
        return compare(get(a),get(b));
      }, descending);
    });
    var comparator = function(o1, o2){
      for ( var i = 0; i < expression.length; i++) {
        var comp = expression[i](o1, o2);
        if (comp != 0) return comp;
      }
      return 0;
    };
    return _.clone(array).sort(reverse(comparator, descend));
  },
  orderByToggle:function(predicate, attribute) {
    var STRIP = /^([+|-])?(.*)/;
    var ascending = false;
    var index = -1;
    _.detect(predicate, function($, i){
      if ($ == attribute) {
        ascending = true;
        index = i;
        return true;
      }
      if (($.charAt(0)=='+'||$.charAt(0)=='-') && $.substring(1) == attribute) {
        ascending = $.charAt(0) == '+';
        index = i;
        return true;
      };
    });
    if (index >= 0) {
      predicate.splice(index, 1);
    }
    predicate.unshift((ascending ? "-" : "+") + attribute);
    return predicate;
  },
  orderByDirection:function(predicate, attribute, ascend, descend) {
    ascend = ascend || 'ng-ascend';
    descend = descend || 'ng-descend';
    var att = predicate[0] || '';
    var direction = true;
    if (att.charAt(0) == '-') {
      att = att.substring(1);
      direction = false;
    } else if(att.charAt(0) == '+') {
      att = att.substring(1);
    }
    return att == attribute ? (direction ? ascend : descend) : "";
  },
  merge:function(array, index, mergeValue) {
    var value = array[index];
    if (!value) {
      value = {};
      array[index] = value;
    }
    nglr.merge(mergeValue, value);
    return array;
  }
};
angular.String = {
  quote:function(string) {
    return '"' + string.replace(/\\/g, '\\\\').
                        replace(/"/g, '\\"').
                        replace(/\n/g, '\\n').
                        replace(/\f/g, '\\f').
                        replace(/\r/g, '\\r').
                        replace(/\t/g, '\\t').
                        replace(/\v/g, '\\v') +
             '"';
  },
  quoteUnicode:function(string) {
    var str = angular.String.quote(string);
    var chars = [];
    for ( var i = 0; i < str.length; i++) {
      var ch = str.charCodeAt(i);
      if (ch < 128) {
        chars.push(str.charAt(i));
      } else {
        var encode = "000" + ch.toString(16);
        chars.push("\\u" + encode.substring(encode.length - 4));
      }
    }
    return chars.join('');
  },
  toDate:function(string){
    var match;
    if (typeof string == 'string' && 
        (match = string.match(/^(\d\d\d\d)-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)Z$/))){
      var date = new Date(0);
      date.setUTCFullYear(match[1], match[2] - 1, match[3]);
      date.setUTCHours(match[4], match[5], match[6], 0);
      return date;
    }
    return string;
  }
};
angular.Date = {
    toString:function(date){
      function pad(n) { return n < 10 ? "0" + n : n; }
      return  (date.getUTCFullYear()) + '-' +
        pad(date.getUTCMonth() + 1) + '-' +
        pad(date.getUTCDate()) + 'T' +
        pad(date.getUTCHours()) + ':' +
        pad(date.getUTCMinutes()) + ':' +
        pad(date.getUTCSeconds()) + 'Z';
    }
  };
angular.Function = {
  compile:function(expression) {
    if (_.isFunction(expression)){
      return expression;
    } else if (expression){
      var scope = new nglr.Scope();
      return function($) {
        scope.state = $;
        return scope.eval(expression);
      };
    } else {
      return function($){return $;};
    }
  }
};

(function(){
  function extend(dst, src, names){
    _.extend(dst, src);
    _.each((names||[]), function(name){
      dst[name] = _[name];
    });
  };
  extend(angular.Global, {}, 
      ['extend', 'clone','isEqual', 
       'isElement', 'isArray', 'isFunction', 'isUndefined']);
  extend(angular.Collection, angular.Global, 
      ['each', 'map', 'reduce', 'reduceRight', 'detect', 
       'select', 'reject', 'all', 'any', 'include', 
       'invoke', 'pluck', 'max', 'min', 'sortBy', 
       'sortedIndex', 'toArray', 'size']);
  extend(angular.Array, angular.Collection, 
      ['first', 'last', 'compact', 'flatten', 'without', 
       'uniq', 'intersect', 'zip', 'indexOf', 'lastIndexOf']);
  extend(angular.Object, angular.Collection,
      ['keys', 'values']);
  extend(angular.String, angular.Global);
  extend(angular.Function, angular.Global,
      ['bind', 'bindAll', 'delay', 'defer', 'wrap', 'compose']);
})();