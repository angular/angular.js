function formater(format, parse) {return {'format':format, 'parse':parse || format};}
function toString(obj) {return ""+obj;};
extend(angularFormatter, {
  'noop':formater(identity, identity),
  'boolean':formater(toString, toBoolean),
  'number':formater(toString, function(obj){return 1*obj;}),

  'list':formater(
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

  'trim':formater(
    function(obj) { return obj ? trim("" + obj) : ""; }
  )
});
