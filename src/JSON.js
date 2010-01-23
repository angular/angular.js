array = [].constructor;

function toJson(obj, pretty){
  var buf = [];
  toJsonArray(buf, obj, pretty ? "\n  " : null, _([]));
  return buf.join('');
};

function toPrettyJson(obj)  {
  return toJson(obj, true);
};

function fromJson(json) {
  try {
    var parser = new Parser(json, true);
    var expression =  parser.primary();
    parser.assertAllConsumed();
    return expression();
  } catch (e) {
    error("fromJson error: ", json, e);
    throw e;
  }
};

angular['toJson'] = toJson;
angular['fromJson'] = fromJson;

function toJsonArray(buf, obj, pretty, stack){
  if (typeof obj == "object") {
    if (stack.include(obj)) {
      buf.push("RECURSION");
      return;
    }
    stack.push(obj);
  }
  var type = typeof obj;
  if (obj === null) {
    buf.push("null");
  } else if (type === 'function') {
    return;
  } else if (type === 'boolean') {
    buf.push('' + obj);
  } else if (type === 'number') {
    if (isNaN(obj)) {
      buf.push('null');
    } else {
      buf.push('' + obj);
    }
  } else if (type === 'string') {
    return buf.push(angular['String']['quoteUnicode'](obj));
  } else if (type === 'object') {
    if (obj instanceof Array) {
      buf.push("[");
      var len = obj.length;
      var sep = false;
      for(var i=0; i<len; i++) {
        var item = obj[i];
        if (sep) buf.push(",");
        if (typeof item == 'function' || typeof item == 'undefined') {
          buf.push("null");
        } else {
          toJsonArray(buf, item, pretty, stack);
        }
        sep = true;
      }
      buf.push("]");
    } else if (obj instanceof Date) {
      buf.push(angular['String']['quoteUnicode'](angular['Date']['toString'](obj)));
    } else {
      buf.push("{");
      if (pretty) buf.push(pretty);
      var comma = false;
      var childPretty = pretty ? pretty + "  " : false;
      var keys = [];
      for(var k in obj) {
        if (k.indexOf('$$') === 0)
          continue;
        keys.push(k);
      }
      keys.sort();
      for ( var keyIndex = 0; keyIndex < keys.length; keyIndex++) {
        var key = keys[keyIndex];
        try {
          var value = obj[key];
          if (typeof value != 'function') {
            if (comma) {
              buf.push(",");
              if (pretty) buf.push(pretty);
            }
            buf.push(angular['String']['quote'](key));
            buf.push(":");
            toJsonArray(buf, value, childPretty, stack);
            comma = true;
          }
        } catch (e) {
        }
      }
      buf.push("}");
    }
  }
  if (typeof obj == "object") {
    stack.pop();
  }
};
