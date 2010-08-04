function formatter(format, parse) {return {'format':format, 'parse':parse || format};}
function toString(obj) {return (isDefined(obj) && obj !== null) ? "" + obj : obj;}

var NUMBER = /^\s*[-+]?\d*(\.\d*)?\s*$/;

extend(angularFormatter, {
  'noop':formatter(identity, identity),
  'json':formatter(toJson, fromJson),
  'boolean':formatter(toString, toBoolean),
  'number':formatter(toString,
      function(obj){
        if (isString(obj) && NUMBER.exec(obj)) {
          return obj ? 1*obj : null;
        }
        throw "Not a number";
      }),

  'list':formatter(
    function(obj) { return obj ? obj.join(", ") : obj; },
    function(value) {
      var list = [];
      foreach((value || '').split(','), function(item){
        item = trim(item);
        if (item) list.push(item);
      });
      return list;
    }
  ),

  'trim':formatter(
    function(obj) { return obj ? trim("" + obj) : ""; }
  )
});
