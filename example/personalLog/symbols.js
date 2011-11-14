function symbol(sym) {
  if (!symbol.syms) {
    var str = "rmLog:i,logs:g,LogCtrl:d,addLog:e,at:f,$inject:c,personalLog:b,msg:h,newMsg:a,rmLogs:j",
        syms = symbol.syms = {};
    
    forEach(str.split(','), function(pair) {
      pair = pair.split(':');
      syms[pair[0]] = pair[1];
    });
  }

  console.log(sym, '->', symbol.syms[sym])
  return symbol.syms[sym] || sym;
}