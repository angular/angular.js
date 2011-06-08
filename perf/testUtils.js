if (window.jstestdriver) {
  jstd = jstestdriver;
  dump = bind(jstd.console, jstd.console.log);
}

function time(fn) {
  var count = 1,
      targetTime = 500,
      start = new Date().getTime(),
      stop = start + targetTime,
      elapsed,
      end,
      iterations,
      pad = angularFilter.number;

  // do one iteration to guess how long it will take
  fn();
  while((end=new Date().getTime()) < stop ){
    // how much time has elapsed since we started the test
    elapsed = (end-start) || 1;
    // guess how many more iterations we need before we reach
    // the time limit. We do this so that we spend most of our
    // time in tight loop
    iterations = Math.ceil(
        // how much more time we need
        (targetTime - elapsed)
        /
        2 // to prevent overrun guess low
        /
        // this is how much the cost is so far per iteration
        (elapsed / count)
      );
    count += iterations;
    while(iterations--) {
      fn();
    }
  }
  elapsed = end - start;
  return {
    count: count,
    total: elapsed,
    time: elapsed / count,
    name: fn.name,
    msg: '' + pad(elapsed / count, 3)
      + ' ms [ ' + pad(1 / elapsed * count * 1000, 0) + ' ops/sec ] '
      + '(' + elapsed + ' ms/' + count + ')'
  };

}

function perf() {
  var log = [],
      summary = [],
      i,
      baseline,
      pad = angularFilter.number;

  for (i = 0; i < arguments.length; i++) {
    var fn = arguments[i];
    var info = time(fn);
    if (baseline === undefined) baseline = info.time;
    summary.push(info.name + ': ' + pad(baseline / info.time, 2) + ' X');
    log.push('\n        ' + info.name + ': ' + info.msg);
  }
  log.unshift(summary.join(' - '));
  dump(log.join(' '));
}
