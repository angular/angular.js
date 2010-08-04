function Matcher(scope, future, logger) {
  var self = scope.$scenario = this;
  this.logger = logger;
  this.future = future;
}

Matcher.addMatcher = function(name, matcher) {
  Matcher.prototype[name] = function(expected) {
    var future = this.future;
    $scenario.addFuture(
      'expect ' + future.name + ' ' + name + ' ' + expected,
      function(done){
        if (!matcher(future.value, expected))
          throw "Expected " + expected + ' but was ' + future.value;
        done();
      }
    );
    dump('future added');
  };
};

Matcher.addMatcher('toEqual', function(a,b) { return a == b; });
