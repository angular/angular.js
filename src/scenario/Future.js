function Future(name, behavior) {
  this.value = undefined;
  this.name = name;
  this.behavior = behavior;
  this.fulfilled = false;
}

Future.prototype = {
  fulfill: function(value){
    this.fulfilled = true;
    this.value = value;
  }
};

function future(name, behavior) {
  return new Future(name, behavior);
};

function repeater(selector) {
  var repeaterFuture = future('repeater ' + selector, function(done) {
    done($(selector));
  });

  repeaterFuture.count =  function(){
    return future(repeaterFuture.name + ' count', function(done) {
      done(repeaterFuture.value.size());
    });
  };

  return repeaterFuture;
}

function Matcher(future, logger) {
  var self = this;
  this.logger = logger;
  this.future = future;
}

Matcher.addMatcher = function(name, matcher){
  Matcher.prototype[name] = function(expected) {
    var future = this.future;
    $scenario.addFuture(
      'expect ' + future.name + ' ' + name + ' ' + expected,
      function(done){
        if (matcher(future.value, expected))
          throw "Expected " + expected + ' but was ' + future.value;
        done();
      }
    );
  };
};

Matcher.addMatcher('toEqual', function(a,b){ return a == b; });

function expect(future) {
  return new Matcher(future, window.alert);
}
