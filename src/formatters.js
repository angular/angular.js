function formatter(format, parse) {return {'format':format, 'parse':parse || format};}
function toString(obj) {
  return (isDefined(obj) && obj !== null) ? "" + obj : obj;
}

var NUMBER = /^\s*[-+]?\d*(\.\d*)?\s*$/;

angularFormatter.noop = formatter(identity, identity);
angularFormatter.json = formatter(toJson, fromJson);
angularFormatter['boolean'] = formatter(toString, toBoolean);
angularFormatter.number = formatter(toString, function(obj){
  if (obj == null || NUMBER.exec(obj)) {
    return obj===null || obj === '' ? null : 1*obj;
  } else {
    throw "Not a number";
  }
});

angularFormatter.list = formatter(
  function(obj) { return obj ? obj.join(", ") : obj; },
  function(value) {
    var list = [];
    foreach((value || '').split(','), function(item){
      item = trim(item);
      if (item) list.push(item);
    });
    return list;
  }
);

angularFormatter.trim = formatter(
  function(obj) { return obj ? trim("" + obj) : ""; }
);
