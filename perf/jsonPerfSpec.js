describe('json', function() {
  xit('should parse json in a reasonable time', function() {
    var totalSubstr = 0,
        totalGetMatch = 0,
        totalConsume = 0,
        totalTime = 0,
        runTimes = [];
    
    for (var i=0; i<10; i++) {
      window.substrTime = 0;
      window.getMatchTime = 0;
      window.consumeTime = 0;
      var start = Date.now();
      expect(angular.fromJson(largeJsonString)).toBeTruthy();
      var time = Date.now() - start;
//      dump('parse time', time, 'consume', window.consumeTime,
//                               'substr', window.substrTime,
//                               'getMatch', window.getMatchTime);
      totalTime += time;
      totalSubstr += window.substrTime;
      totalGetMatch += window.getMatchTime;
      totalConsume += window.consumeTime;
      runTimes.push(time);
    }

    totalGetMatch = totalGetMatch - totalSubstr;

    dump("totals", totalTime,
          "| consume", totalConsume, '' + Math.round(totalConsume/(totalTime/100)) + '%',
          "| substr", totalSubstr, '' + Math.round(totalSubstr/(totalTime/100)) + '%',
          "| getMatch", totalGetMatch, '' + Math.round(totalGetMatch/(totalTime/100)) + '%');
    dump("run times", runTimes);
    delete window.consumeTime;
    delete window.substrTime;
    delete window.getMatchTime;
  });


  it('angular parser', function() {
    var duration = time(function() {
      expect(angular.fromJson(largeJsonString)).toBeTruthy();
    }, 1);

    expect(duration).toBeLessThan(4000);
  });


  it('native json', function() {
    var duration = time(function() {
      expect(JSON.parse(largeJsonString)).toBeTruthy();
    }, 1);

    expect(duration).toBeLessThan(200);
  });
});
