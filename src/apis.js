var angularGlobal = {
  'typeOf':function(obj){
    if (obj === null) return "null";
    var type = typeof obj;
    if (type == "object") {
      if (obj instanceof Array) return "array";
      if (obj instanceof Date) return "date";
      if (obj.nodeType == 1) return "element";
    }
    return type;
  }
};

var angularCollection = {
  'copy': copy,
  'size': size,
  'equals': equals
};
var angularObject = {
  'extend': extend
};
var angularArray = {
  'indexOf': indexOf,
  'sum':function(array, expression) {
    var fn = angular['Function']['compile'](expression);
    var sum = 0;
    for (var i = 0; i < array.length; i++) {
      var value = 1 * fn(array[i]);
      if (!isNaN(value)){
        sum += value;
      }
    }
    return sum;
  },
  'remove':function(array, value) {
    var index = indexOf(array, value);
    if (index >=0)
      array.splice(index, 1);
    return value;
  },
  'filter':function(array, expression) {
    var predicates = [];
    predicates.check = function(value) {
      for (var j = 0; j < predicates.length; j++) {
        if(!predicates[j](value)) {
          return false;
        }
      }
      return true;
    };
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
  'add':function(array, value) {
    array.push(isUndefined(value)? {} : value);
    return array;
  },
  'count':function(array, condition) {
    if (!condition) return array.length;
    var fn = angular['Function']['compile'](condition), count = 0;
    foreach(array, function(value){
      if (fn(value)) {
        count ++;
      }
    });
    return count;
  },
  'orderBy':function(array, expression, descend) {
    function reverse(comp, descending) {
      return toBoolean(descending) ?
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
    expression = isArray(expression) ? expression: [expression];
    expression = map(expression, function($){
      var descending = false;
      if (typeof $ == "string" && ($.charAt(0) == '+' || $.charAt(0) == '-')) {
        descending = $.charAt(0) == '-';
        $ = $.substring(1);
      }
      var get = $ ? expressionCompile($).fnSelf : identity;
      return reverse(function(a,b){
        return compare(get(a),get(b));
      }, descending);
    });
    var comparator = function(o1, o2){
      for ( var i = 0; i < expression.length; i++) {
        var comp = expression[i](o1, o2);
        if (comp !== 0) return comp;
      }
      return 0;
    };
    var arrayCopy = [];
    for ( var i = 0; i < array.length; i++) { arrayCopy.push(array[i]); }
    return arrayCopy.sort(reverse(comparator, descend));
  }
};

var angularString = {
  'quote':function(string) {
    return '"' + string.replace(/\\/g, '\\\\').
                        replace(/"/g, '\\"').
                        replace(/\n/g, '\\n').
                        replace(/\f/g, '\\f').
                        replace(/\r/g, '\\r').
                        replace(/\t/g, '\\t').
                        replace(/\v/g, '\\v') +
             '"';
  },
  'quoteUnicode':function(string) {
    var str = angular['String']['quote'](string);
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
  'toDate':function(string){
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

var angularDate = {
    'toString':function(date){
      function pad(n) { return n < 10 ? "0" + n : n; }
      return  !date ? date :
        date.getUTCFullYear() + '-' +
        pad(date.getUTCMonth() + 1) + '-' +
        pad(date.getUTCDate()) + 'T' +
        pad(date.getUTCHours()) + ':' +
        pad(date.getUTCMinutes()) + ':' +
        pad(date.getUTCSeconds()) + 'Z' ;
    }
  };

var angularFunction = {
  'compile':function(expression) {
    if (isFunction(expression)){
      return expression;
    } else if (expression){
      return expressionCompile(expression).fnSelf;
    } else {
      return identity;
    }
  }
};

function defineApi(dst, chain, underscoreNames){
  if (_) {
    var lastChain = _.last(chain);
    foreach(underscoreNames, function(name){
      lastChain[name] = _[name];
    });
  }
  angular[dst] = angular[dst] || {};
  foreach(chain, function(parent){
    extend(angular[dst], parent);
  });
}
defineApi('Global', [angularGlobal],
    ['extend', 'clone','isEqual',
     'isElement', 'isArray', 'isFunction', 'isUndefined']);
defineApi('Collection', [angularGlobal, angularCollection],
    ['each', 'map', 'reduce', 'reduceRight', 'detect',
     'select', 'reject', 'all', 'any', 'include',
     'invoke', 'pluck', 'max', 'min', 'sortBy',
     'sortedIndex', 'toArray', 'size']);
defineApi('Array', [angularGlobal, angularCollection, angularArray],
    ['first', 'last', 'compact', 'flatten', 'without',
     'uniq', 'intersect', 'zip', 'indexOf', 'lastIndexOf']);
defineApi('Object', [angularGlobal, angularCollection, angularObject],
    ['keys', 'values']);
defineApi('String', [angularGlobal, angularString], []);
defineApi('Date', [angularGlobal, angularDate], []);
//IE bug
angular['Date']['toString'] = angularDate['toString'];
defineApi('Function', [angularGlobal, angularCollection, angularFunction],
    ['bind', 'bindAll', 'delay', 'defer', 'wrap', 'compose']);
