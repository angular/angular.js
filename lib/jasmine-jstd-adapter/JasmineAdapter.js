/**
 * @fileoverview Jasmine JsTestDriver Adapter.
 * @author ibolmo@gmail.com (Olmo Maldonado)
 * @author misko@hevery.com (Misko Hevery)
 */

(function() {

  function bind(_this, _function){
    return function(){
      return _function.call(_this);
    };
  }

  var currentFrame = frame(null, null);

  function frame(parent, name){
    var caseName = (parent && parent.caseName ? parent.caseName + " " : '') + (name ? name : '');
    var frame = {
      name: name,
      caseName: caseName,
      parent: parent,
      testCase: TestCase(caseName),
      before: [],
      after: [],
      runBefore: function(){
        if (parent) parent.runBefore.apply(this);
        for ( var i = 0; i < frame.before.length; i++) {
          frame.before[i].apply(this);
        }
      },
      runAfter: function(){
        for ( var i = 0; i < frame.after.length; i++) {
          frame.after[i].apply(this);
        }
        if (parent) parent.runAfter.apply(this);
      }
    };
    return frame;
  };

  jasmine.Env.prototype.describe = (function(describe){
    return function(description){
      currentFrame = frame(currentFrame, description);
      var val = describe.apply(this, arguments);
      currentFrame = currentFrame.parent;
      return val;
    };

  })(jasmine.Env.prototype.describe);

  var id = 0;

  jasmine.Env.prototype.it = (function(it){
    return function(desc, itFn){
      var self = this;
      var spec = it.apply(this, arguments);
      var currentSpec = this.currentSpec;
      if (!currentSpec.$id) {
        currentSpec.$id = id++;
      }
      var frame = this.jstdFrame = currentFrame;
      var name = 'test that it ' + desc;
      if (this.jstdFrame.testCase.prototype[name])
        throw "Spec with name '" + desc + "' already exists.";
      this.jstdFrame.testCase.prototype[name] = function(){
        jasmine.getEnv().currentSpec = currentSpec;
        frame.runBefore.apply(currentSpec);
        try {
          itFn.apply(currentSpec);
        } finally {
          frame.runAfter.apply(currentSpec);
        }
      };
      return spec;
    };

  })(jasmine.Env.prototype.it);


  jasmine.Env.prototype.beforeEach = (function(beforeEach){
    return function(beforeEachFunction) {
      beforeEach.apply(this, arguments);
      currentFrame.before.push(beforeEachFunction);
    };

  })(jasmine.Env.prototype.beforeEach);


  jasmine.Env.prototype.afterEach = (function(afterEach){
    return function(afterEachFunction) {
      afterEach.apply(this, arguments);
      currentFrame.after.push(afterEachFunction);
    };

  })(jasmine.Env.prototype.afterEach);


  jasmine.NestedResults.prototype.addResult = (function(addResult){
    return function(result) {
      addResult.call(this, result);
      if (result.type != 'MessageResult' && !result.passed()) fail(result.message);
    };

  })(jasmine.NestedResults.prototype.addResult);

  // Reset environment with overriden methods.
  jasmine.currentEnv_ = null;
  jasmine.getEnv();

})();
