nglr.test.ScenarioRunner = function(scenarios, body) {
  this.scenarios = scenarios;
  this.body = body;
};

nglr.test.ScenarioRunner.prototype = {
  run:function(){
    this.setUpUI();
    this.runScenarios();
  },
  setUpUI:function(){
    this.body.html(
      '<div id="runner">' +
        '<div class="console"></div>' +
      '</div>' +
      '<div id="testView">' +
        '<iframe></iframe>' +
      '</div>');
    this.console = this.body.find(".console");
    this.testFrame = this.body.find("iframe");
    this.console.find(".run").live("click", function(){
      jQuery(this).parent().find('.log').toggle();
    });
  },
  runScenarios:function(){
    var runner = new nglr.test.Runner(this.console, this.testFrame);
    _.stepper(this.scenarios, function(next, scenario, name){
        new nglr.test.Scenario(name, scenario).run(runner, next);
      }, function(){
      }
    );
  }
};

nglr.test.Runner = function(console, frame){
  this.console = console;
  this.current = null;
  this.tests = [];
  this.frame = frame;
};
nglr.test.Runner.prototype = {
  start:function(name){
    var current = this.current = {
      name:name,
      start:new Date().getTime(),
      scenario:jQuery('<div class="scenario"></div>')
    };
    current.run = current.scenario.append(
      '<div class="run">' + 
        '<span class="name">.</span>' + 
        '<span class="time">.</span>' + 
        '<span class="state">.</span>' + 
      '</run>').find(".run");
    current.log = current.scenario.append('<div class="log"></div>').find(".log");
    current.run.find(".name").text(name);
    this.tests.push(current);
    this.console.append(current.scenario);
  },
  end:function(name){
    var current = this.current;
    var run = current.run;
    this.current = null;
    current.end = new Date().getTime();
    current.time = current.end - current.start;
    run.find(".time").text(current.time);
    run.find(".state").text(current.error ? "FAIL" : "PASS");
    run.addClass(current.error ? "fail" : "pass");
    if (current.error)
      run.find(".run").append('<span div="error"></span>').text(current.error);
    current.scenario.find(".log").hide();
  },
  log:function(level) {
    var buf = [];
    for ( var i = 1; i < arguments.length; i++) {
      var arg = arguments[i];
      buf.push(typeof arg == "string" ?arg:nglr.toJson(arg));
    }
    var log = jQuery('<div class="' + level + '"></div>');
    log.text(buf.join(" "));
    this.current.log.append(log);
    this.console.scrollTop(this.console[0].scrollHeight);
    if (level == "error") 
      this.current.error = buf.join(" ");
  }
};

nglr.test.Scenario = function(name, scenario){
  this.name = name;
  this.scenario = scenario;
};
nglr.test.Scenario.prototype = {
  run:function(runner, callback) {
    var self = this;
    _.stepper(this.scenario, function(next, steps, name){
      if (name.charAt(0) == '$') {
        next();
      } else {
        runner.start(self.name + "::" + name);
        var allSteps = (self.scenario.$before||[]).concat(steps);
        _.stepper(allSteps, function(next, step){
          self.executeStep(runner, step, next);
        }, function(){
          runner.end();
          next();
        });
      }
    }, callback);
  },
  verb:function(step){
    var fn = null;
  if (!step) fn = function (){ throw "Step is null!"; }
  else if (step.Given) fn = angular.test.GIVEN[step.Given];
  else if (step.When) fn = angular.test.WHEN[step.When];
  else if (step.Then) fn = angular.test.THEN[step.Then];
    return fn || function (){
             throw "ERROR: Need Given/When/Then got: " + nglr.toJson(step);
           };    
  },
  context: function(runner) {
    var frame = runner.frame;
    var window = frame[0].contentWindow;
    var document;
    if (window.jQuery) 
      document = window.jQuery(window.document);
    var context = {
        frame:frame, 
        window:window,
        log:_.bind(runner.log, runner, "info"),
        document:document,
        assert:function(element, path){
          if (element.size() != 1) {
            throw "Expected to find '1' found '"+
              element.size()+"' for '"+path+"'.";
          }
          return element;
        },
        element:function(path){
          var exp = path.replace("{{","[ng-bind=").replace("}}", "]");
          var element = document.find(exp);
          return context.assert(element, path);
        }
    };
    return context;
  },
  executeStep:function(runner, step, callback) {
    if (!step) {
    callback();
    return;
  }
    runner.log("info", nglr.toJson(step));
    var fn = this.verb(step);
    var context = this.context(runner);
    _.extend(context, step);
    try {
      (fn.call(context)||function(c){c();})(callback);
    } catch (e) {
      runner.log("error", "ERROR: " + nglr.toJson(e));
    }
  }
};
