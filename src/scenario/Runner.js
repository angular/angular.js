angular['scenario']  = (angular['scenario'] = {});

angular.scenario.Runner = function(scope){
  var self = scope.$scenario = this;
  this.scope = scope;

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
    body();
    self.currentSpec = null;
  };
  this.beginSpec = function returnNoop(){
    return returnNoop;
  };
};

angular.scenario.Runner.prototype = {
  run: function(body){
    body.append(
      '<div id="runner">' +
        '<ul class="console"></ul>' +
      '</div>' +
      '<div id="testView">' +
        '<iframe></iframe>' +
      '</div>');
    var console = body.find('#runner .console');
    this.testFrame = body.find('#testView iframe');
    this.testWindow = this.testFrame[0].contentWindow;
    this.beginSpec = function(name){
      var specElement = jQuery('<li class="spec"></li>');
      var stepContainer = jQuery('<ul class="step"></ul>');
      console.append(specElement);
      specElement.text(name);
      specElement.append(stepContainer);
      return function(name){
        var stepElement = jQuery('<li class="step"></li>');
        var logContainer = jQuery('<ul class="log"></ul>');
        stepContainer.append(stepElement);
        stepElement.text(name);
        stepElement.append(logContainer);
        return function(message) {
          var logElement = jQuery('<li class="log"></li>');
          logContainer.append(logElement);
          logElement.text(message);
        };
      };
    };
    this.execute("widgets: it should verify that basic widgets work");
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
             result.log(angular.isString(error) ? error : angular.toJson(error));
           }
         };
       specThis = {
         result: result,
         testWindow: this.testWindow,
         testFrame: this.testFrame
       };
   var beginStep = this.beginSpec(name);
   spec.nextStepIndex = 0;
   function done() {
     result.finished = true;
     (callback||angular.noop).call(specThis);
   }
   function next(){
     var step = spec.steps[spec.nextStepIndex];
       if (step) {
         spec.nextStepIndex ++;
         result.log = beginStep(step.name);
         try {
           step.fn.call(specThis, next);
         } catch (e) {
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