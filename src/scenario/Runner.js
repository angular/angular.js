angular['scenario'] = angular['scenario'] || (angular['scenario'] = {});
angular.scenario['dsl'] = angular.scenario['dsl'] || (angular.scenario['dsl'] = {});

angular.scenario.Runner = function(scope, jQuery){
  var self = scope.$scenario = this;
  this.scope = scope;
  this.jQuery = jQuery;

  var specs = this.specs = {};
  var path = [];
  this.scope.describe = function describe(name, body){
    path.push(name);
    body();
    path.pop();
  };
  this.scope.it = function it(name, body) {
    var specName = path.join(' ') + ': it ' + name;
    self.currentSpec = specs[specName] = {
        name: specName,
        steps:[]
     };
    try {
      body();
    } catch(err) {
      self.addStep(err.message || 'ERROR', function(){
        throw err;
      });
    }
    self.currentSpec = null;
  };
  this.logger = function returnNoop(){
    return _(returnNoop).extend({close:_.identity, fail:_.identity});;
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
    this.testWindow = this.testFrame[0].contentWindow;
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
        return _(logger(element)).extend({
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
    _(this.specs).each(function(spec, name){
      specNames.push(name);
    }, this);
    specNames.sort();
    var self = this;
    function callback(){
      var next = specNames.shift();
      if(next) {
        self.execute(next, callback);
      }
    };
    callback();
  },

  addStep: function(name, step) {
    this.currentSpec.steps.push({name:name, fn:step});
  },

  execute: function(name, callback) {
   var spec = this.specs[name],
       result = {
           passed: false,
           failed: false,
           finished: false,
           fail: function(error) {
             result.passed = false;
             result.failed = true;
             result.error = error;
             result.log('fail', _(error).isString() ? error : toJson(error)).fail();
           }
         };
       specThis = {
         result: result,
         testWindow: this.testWindow,
         testFrame: this.testFrame
       };
   var stepLogger = this.logger('spec', name);
   spec.nextStepIndex = 0;
   function done() {
     result.finished = true;
     stepLogger.close();
     (callback||_.identity).call(specThis);
   }
   function next(){
     var step = spec.steps[spec.nextStepIndex];
     (result.log || {close:_.identity}).close();
     result.log = null;
     if (step) {
       spec.nextStepIndex ++;
       result.log = stepLogger('step', step.name);
       try {
         step.fn.call(specThis, next);
       } catch (e) {
         console.error(e);
         result.fail(e);
         done();
       }
     } else {
       result.passed = !result.failed;
       done();
     }
   };
   next();
   return specThis;
  }
};