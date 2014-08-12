var bp = window.bp = {
  steps: window.benchmarkSteps = [],
  Statistics: {
    //Taken from z-table where confidence is 95%
    criticalValue: 1.96
  },
  Runner: {
    runState: {
      iterations: 0,
      numSamples: 20,
      recentResult: {}
    }
  },
  Document: {},
  Report: {
    timesPerAction: {}
  },
  Measure: {
    characteristics: ['gcTime','testTime','garbageCount','retainedCount']
  }
};

bp.Measure.numMilliseconds = function() {
  if (window.performance != null && typeof window.performance.now == 'function') {
    return window.performance.now();
  } else if (window.performance != null && typeof window.performance.webkitNow == 'function') {
    return window.performance.webkitNow();
  } else {
    console.log('using Date.now');
    return Date.now();
  }
};

bp.Statistics.getMean = function (sample) {
  var total = 0;
  sample.forEach(function(x) { total += x; });
  return total / sample.length;
};

bp.Statistics.calculateConfidenceInterval = function(standardDeviation, sampleSize) {
  var standardError = standardDeviation / Math.sqrt(sampleSize);
  return bp.Statistics.criticalValue * standardError;
};

bp.Statistics.calculateRelativeMarginOfError = function(marginOfError, mean) {
  /*
   * Converts absolute margin of error to a relative margin of error by
   * converting it to a percentage of the mean.
   */
  return (marginOfError / mean);
};

bp.Statistics.calculateCoefficientOfVariation = function(standardDeviation, mean) {
  return standardDeviation / mean;
};

bp.Statistics.calculateStandardDeviation = function(sample, mean) {
  var deviation = 0;
  sample.forEach(function(x) {
    deviation += Math.pow(x - mean, 2);
  });
  deviation = deviation / (sample.length -1);
  deviation = Math.sqrt(deviation);
  return deviation;
};

bp.Runner.setIterations = function (iterations) {
  bp.Runner.runState.iterations = iterations;
};

bp.Runner.resetIterations = function() {
  bp.Runner.runState.iterations = 0;
};

bp.Runner.loopBenchmark = function () {
  if (bp.Runner.runState.iterations <= -1) {
    //Time to stop looping
    bp.Runner.setIterations(0);
    bp.Document.loopBtn.innerText = 'Loop';
    return;
  }
  bp.Runner.setIterations(-1);
  bp.Document.loopBtn.innerText = 'Pause';
  bp.Runner.runAllTests();
};

bp.Runner.onceBenchmark = function() {
  bp.Runner.setIterations(1);
  bp.Document.onceBtn.innerText = '...';
  bp.Runner.runAllTests(function() {
    bp.Document.onceBtn.innerText = 'Once';
  });
};

bp.Runner.twentyFiveBenchmark = function() {
  var twentyFiveBtn = bp.Document.twentyFiveBtn;
  bp.Runner.setIterations(25);
  twentyFiveBtn.innerText = 'Looping...';
  bp.Runner.runAllTests(function() {
    twentyFiveBtn.innerText = 'Loop 25x';
  }, 5);
};

bp.Runner.runAllTests = function (done) {
  if (bp.Runner.runState.iterations--) {
    bp.steps.forEach(function(bs) {
      var testResults = bp.Runner.runTimedTest(bs);
      bp.Runner.runState.recentResult[bs.name] = testResults;
    });
    bp.Report.markup = bp.Report.calcStats();
    bp.Document.writeReport(bp.Report.markup);
    window.requestAnimationFrame(function() {
      bp.Runner.runAllTests(done);
    });
  }
  else {
    bp.Document.writeReport(bp.Report.markup);
    bp.Runner.resetIterations();
    done && done();
  }
};


bp.Runner.profile = function() {
  console.profile();
  bp.Runner.onceBenchmark();
  console.profileEnd();
};


bp.Runner.runTimedTest = function (bs) {
  var startTime,
      endTime,
      startGCTime,
      endGCTime,
      retainedMemory,
      garbage,
      beforeHeap,
      afterHeap,
      finalHeap;
  if (typeof window.gc === 'function') {
    window.gc();
  }

  beforeHeap = performance.memory.usedJSHeapSize;
  startTime = bp.Measure.numMilliseconds();
  bs.fn();
  endTime = bp.Measure.numMilliseconds() - startTime;
  afterHeap = performance.memory.usedJSHeapSize;

  startGCTime = bp.Measure.numMilliseconds();
  if (typeof window.gc === 'function') {
    window.gc();
  }
  endGCTime = bp.Measure.numMilliseconds() - startGCTime;

  finalHeap = performance.memory.usedJSHeapSize;
  garbage = Math.abs(finalHeap - afterHeap);
  retainedMemory = finalHeap - beforeHeap;
  return {
    testTime: endTime,
    gcTime: endGCTime,
    beforeHeap: beforeHeap,
    garbageCount: garbage,
    retainedCount: retainedMemory
  };
};

bp.Report.generatePartial = function(model) {
  return bp.Document.infoTemplate(model);
};

bp.Document.writeReport = function(reportContent) {
  bp.Document.infoDiv.innerHTML = reportContent;
};

bp.Report.getTimesPerAction = function(name) {
  var tpa = bp.Report.timesPerAction[name];
  if (!tpa) {
    tpa = bp.Report.timesPerAction[name] = {
      name: name,
      nextEntry: 0
    };
    _.each(bp.Measure.characteristics, function(c) {
      tpa[c] = {
        recent: undefined,
        history: [],
        avg: {},
        min: Number.MAX_VALUE,
        max: Number.MIN_VALUE
      };
    });
  }
  return tpa;
};

bp.Report.rightSizeTimes = function(times) {
  var delta = times.length - bp.Runner.runState.numSamples;
  if (delta > 0) {
    return times.slice(delta);
  }

  return times;
};

bp.Report.updateTimes = function(tpa, index, reference, recentTime) {
  var curTpa = tpa[reference];
  curTpa.recent = recentTime;
  curTpa.history[index] = recentTime;
  curTpa.history = bp.Report.rightSizeTimes(curTpa.history);
  curTpa.min = Math.min(curTpa.min, recentTime);
  curTpa.max = Math.max(curTpa.max, recentTime);
};

bp.Report.calcStats = function() {
  var report = '';
  bp.steps.forEach(function(bs) {
    var recentResult = bp.Runner.runState.recentResult[bs.name],
        tpa = bp.Report.getTimesPerAction(bs.name);

    _.each(bp.Measure.characteristics, function(c) {
      bp.Report.updateTimes(tpa, tpa.nextEntry, c, recentResult[c]);
      var mean = bp.Statistics.getMean(tpa[c].history);
      var stdDev = bp.Statistics.calculateStandardDeviation(tpa[c].history, mean);
      tpa[c].avg = {
        mean: mean,
        stdDev: stdDev,
        coefficientOfVariation: bp.Statistics.calculateCoefficientOfVariation(stdDev, mean)
      };
    });

    tpa.nextEntry++;
    tpa.nextEntry %= bp.Runner.runState.numSamples;

    report += bp.Report.generatePartial(tpa);
  });
  return report;
};

bp.Document.addSampleRange = function() {
  bp.Document.sampleRange = bp.Document.container().querySelector('#sampleRange');
  if (bp.Document.sampleRange) {
    bp.Document.sampleRange.value = Math.max(bp.Runner.runState.numSamples, 1);
    bp.Document.sampleRange.addEventListener('input', bp.Document.onSampleInputChanged);
    bp.Document.sampleRangeValue = bp.Document.container().querySelector('#sampleRangeValue');
    bp.Document.sampleRangeValue.innerText = bp.Runner.runState.numSamples;
  }

};

bp.Document.onSampleInputChanged = function (evt) {
  var value = evt.target.value;
  bp.Runner.runState.numSamples = parseInt(value, 10);
  if (bp.Document.sampleRangeValue) {
    bp.Document.sampleRangeValue.innerText = value;
  }
};

bp.Document.container = function() {
  if (!bp.Document._container) {
    bp.Document._container = document.querySelector('#benchmarkContainer');
  }
  return bp.Document._container;
}

bp.Document.addButton = function(reference, handler) {
  var container = bp.Document.container();
  bp.Document[reference] = container.querySelector('button.' + reference);
  if (bp.Document[reference]) {
    bp.Document[reference].addEventListener('click', handler);
  }
}

bp.Document.addInfo = function() {
  bp.Document.infoDiv = bp.Document.container().querySelector('div.info');
  if (bp.Document.infoDiv) {
    bp.Document.infoTemplate = _.template(bp.Document.container().querySelector('#infoTemplate').innerHTML);
  }
};

bp.Document.onDOMContentLoaded = function() {
  if (!bp.Document.container()) return;
  bp.Document.addButton('loopBtn', bp.Runner.loopBenchmark);
  bp.Document.addButton('onceBtn', bp.Runner.onceBenchmark);
  bp.Document.addButton('twentyFiveBtn', bp.Runner.twentyFiveBenchmark);
  bp.Document.addButton('profileBtn', bp.Runner.profile);
  bp.Document.addSampleRange();
  bp.Document.addInfo();

  var params = getParams();
  function loadNext () {
    var config = window.scripts.shift();
    if (!config) return;
    if (config.id && params[config.id]) {
      config.src = params[config.id];
    }
    var tag = document.createElement('script');
    tag.setAttribute('src', config.src);
    tag.onload = loadNext;
    document.head.appendChild(tag);
  }
  loadNext();

  function getParams() {
    var params = {},
        search = window.location.search;
    if (!search) return params;
    if (search.indexOf('?') === 0) {
      search = search.substr(1);
    }

    search = search.split('&');
    search.forEach(function(tuple) {
      tuple = tuple.split('=')
      params[tuple[0]] = tuple[1];
    });

    return params;
  }
};

window.addEventListener('DOMContentLoaded', bp.Document.onDOMContentLoaded);
