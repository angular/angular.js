angular['scenario'] = angular['scenario'] || (angular['scenario'] = {});
angular.scenario['dsl'] = angular.scenario['dsl'] || (angular.scenario['dsl'] = {});

angular.scenario.Runner = function(scope, jQuery){
  var self = scope.$scenario = this;
  this.scope = scope;
  this.jQuery = jQuery;
  this.scope.$testrun = {done: false, results: []};

  var specs = this.specs = {};
  var path = [];
  this.scope.describe = function(name, body){
    path.push(name);
    body();
    path.pop();
  };
  var beforeEach = noop;
  var afterEach = noop;
  this.scope.beforeEach = function(body) {
    beforeEach = body;
  };
  this.scope.afterEach = function(body) {
    afterEach = body;
  };
  this.scope.it = function(name, body) {
    var specName = path.join(' ') + ': it ' + name;
    self.currentSpec = specs[specName] = {
        name: specName,
        steps:[]
     };
    try {
      beforeEach();
      body();
    } catch(err) {
      self.addStep(err.message || 'ERROR', function(){
        throw err;
      });
    } finally {
      afterEach();
    }
    self.currentSpec = null;
  };
  this.logger = function returnNoop(){
    return extend(returnNoop, {close:noop, fail:noop});
  };
};

angular.scenario.Runner.prototype = {
  run: function(body){
    var jQuery = this.jQuery;
    body.append(
      '<div id="runner">' +
        '<div class="console"></div>' +
      '</div>' +
      '<div id="testView">' +
        '<iframe></iframe>' +
      '</div>');
    var console = body.find('#runner .console');
    console.find('li').live('click', function(){
      jQuery(this).toggleClass('collapsed');
    });
    this.testFrame = body.find('#testView iframe');
    function logger(parent) {
      var container;
      return function(type, text) {
        if (!container) {
          container = jQuery('<ul></ul>');
          parent.append(container);
        }
        var element = jQuery('<li class="running '+type+'"><span></span></li>');
        element.find('span').text(text);
        container.append(element);
        return extend(logger(element), {
          close: function(){
            element.removeClass('running');
            if(!element.hasClass('fail'))
              element.addClass('collapsed');
            console.scrollTop(console[0].scrollHeight);
          },
          fail: function(){
            element.removeClass('running');
            var current = element;
            while (current[0] != console[0]) {
              if (current.is('li'))
                current.addClass('fail');
              current = current.parent();
            }
          }
        });
      };
    }
    this.logger = logger(console);
    var specNames = [];
    foreach(this.specs, function(spec, name){
      specNames.push(name);
    }, this);
    specNames.sort();
    var self = this;
    function callback(){
      var next = specNames.shift();
      if(next) {
        self.execute(next, callback);
      } else {
        self.scope.$testrun.done = true;
      }
    };
    callback();
  },

  addStep: function(name, step) {
    this.currentSpec.steps.push({name:name, fn:step});
  },

  execute: function(name, callback) {
   var spec = this.specs[name],
       self = this,
       stepsDone = [],
       result = {
         passed: false,
         failed: false,
         finished: false,
         fail: function(error) {
           result.passed = false;
           result.failed = true;
           result.error = error;
           result.log('fail', isString(error) ? error : toJson(error)).fail();
         }
       },
       specThis = createScope({
         result: result,
         testFrame: this.testFrame,
         testWindow: this.testWindow
       }, angularService, {});
   this.self = specThis;
   var stepLogger = this.logger('spec', name);
   spec.nextStepIndex = 0;
   function done() {
     result.finished = true;
     stepLogger.close();
     self.self = null;
     (callback||noop).call(specThis);
   }
   function next(){
     var step = spec.steps[spec.nextStepIndex];
     (result.log || {close:noop}).close();
     result.log = null;
     if (step) {
       spec.nextStepIndex ++;
       result.log = stepLogger('step', step.name);
       stepsDone.push(step.name);
       try {
         step.fn.call(specThis, next);
       } catch (e) {
         console.error(e);
         result.fail(e);
         self.scope.$testrun.results.push(
           {name: name, passed: false, error: e, steps: stepsDone});
         done();
       }
     } else {
       result.passed = !result.failed;
       self.scope.$testrun.results.push({
         name: name,
         passed: !result.failed,
         error: result.error,
         steps: stepsDone});
       done();
     }
   };
   next();
   return specThis;
  }
};