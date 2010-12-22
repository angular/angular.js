if (window.jstestdriver) {
  jstd = jstestdriver;
  dump = angular.bind(jstd.console, jstd.console.log);
}

function time(fn, times) {
  times = times || 1;

  var i,
      start,
      duration = 0;

  for (i=0; i<times; i++) {
    start = Date.now();
    fn();
    duration += Date.now() - start;
  }

  return duration;
}