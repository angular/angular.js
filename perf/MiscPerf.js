describe('perf misc', function(){
  it('operation speeds', function(){
    perf(
      function typeByTypeof(){ return typeof noop == 'function'; }, // WINNER
      function typeByProperty() { return noop.apply && noop.call; },
      function typeByConstructor() { return noop.constructor == Function; }
    );
  });

  it('property access', function(){
    var name = 'value';
    var none = 'x';
    var scope = {};
    perf(
      function direct(){ return scope.value; }, // WINNER
      function byName() { return scope[name]; },
      function undefinedDirect(){ return scope.x; },
      function undefiendByName() { return scope[none]; }
    );
  });
});
