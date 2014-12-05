function prettyBenchpressLog (name, variable, result) {
  var fmtResult = '\n'+name+':'+variable+'\n';

  Object.keys(result).forEach(function(key){
    fmtResult += '  step: '+key+': \n';
    ['gcTime', 'testTime', 'garbageCount', 'retainedCount'].forEach(function(characteristic) {
      fmtResult += '    '+characteristic+': '+result[key][characteristic].avg.mean+'\n';
    });

    fmtResult += '\n'
  });

  return fmtResult;
}
