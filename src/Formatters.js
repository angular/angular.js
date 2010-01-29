function formater(format, parse) {return {'format':format, 'parse':parse};}
function toString(obj) {return ""+obj;};
extend(angularFormatter, {
  'noop':formater(identity, identity),
  'boolean':formater(toString, toBoolean),
  'number':formater(toString, function(obj){return 1*obj;}),

  'list':formater(
    function(obj) { return obj ? obj.join(", ") : obj; },
    function(value) { 
      return value ? _(_(value.split(',')).map(jQuery.trim)).select(_.identity) : value;
    }
  )  
});
