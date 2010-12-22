function noop(){}

function chain(delegateFn, explicitDone){
  var onDoneFn = noop;
  var onErrorFn = function(e){
    console.error(e.stack || e);
    process.exit(-1);
  };
  var waitForCount = 1;
  delegateFn = delegateFn || noop;
  var stackError = new Error('capture stack');

  function decrementWaitFor() {
    waitForCount--;
    if (waitForCount == 0)
      onDoneFn();
  }

  function self(){
    try {
      return delegateFn.apply(self, arguments);
    } catch (error) {
      self.error(error);
    } finally {
      if (!explicitDone)
        decrementWaitFor();
    }
  };
  self.onDone = function(callback){
    onDoneFn = callback;
    return self;
  };
  self.onError = function(callback){
    onErrorFn = callback;
    return self;
  };
  self.waitFor = function(callback){
    if (waitForCount == 0)
      throw new Error("Can not wait on already called callback.");
    waitForCount++;
    return chain(callback).onDone(decrementWaitFor).onError(self.error);
  };

  self.waitMany = function(callback){
    if (waitForCount == 0)
      throw new Error("Can not wait on already called callback.");
    waitForCount++;
    return chain(callback, true).onDone(decrementWaitFor).onError(self.error);
  };

  self.done = function(callback){
    decrementWaitFor();
  };

  self.error = function(error) {
    var stack = stackError.stack.split(/\n\r?/).splice(2);
    var nakedStack = [];
    stack.forEach(function(frame){
      if (!frame.match(/callback\.js:\d+:\d+\)$/))
        nakedStack.push(frame);
    });
    error.stack = error.stack + '\nCalled from:\n' + nakedStack.join('\n');
    onErrorFn(error);
  };

  return self;
}

exports.chain = chain;
