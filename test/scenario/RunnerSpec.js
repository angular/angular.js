describe('Runner', function(){
  var scenario, runner, log, Describe, It, $scenario;

  function logger(text) {
    return function(){log += text;};
  }

  beforeEach(function(){
    log = '';
    scenario = {};
    runner = new angular.scenario.Runner(scenario);
    Describe = scenario.describe;
    It = scenario.it;
    $scenario = scenario.$scenario;
  });

  describe('describe', function(){
    it('should consume the describe functions', function(){
      Describe('describe name',  logger('body'));

      expect(log).toEqual('body');
    });

    describe('it', function(){
      it('should consume it', function(){
        Describe('describe name', function(){
          It('should text', logger('body'));
        });
        expect(log).toEqual('body');
        var spec = $scenario.specs['describe name: it should text'];
        expect(spec.steps).toEqual([]);
        expect(spec.name).toEqual('describe name: it should text');
      });

      it('should camplain on duplicate it', angular.noop);

    });
  });

  describe('steps building', function(){
    it('should queue steps', function(){
      function step(){};
      Describe('name', function(){
        It('should', function(){
          $scenario.addStep('stepname', step);
        });
      });
      expect($scenario.specs['name: it should'].steps).toEqual([{name:'stepname', fn:step}]);
    });
  });

  describe('execution', function(){
    it('should execute the queued steps', function(){
      var next, firstThis, secondThis, doneThis, spec;
      $scenario.specs['spec'] = {
        steps: [
          {name:'step1', fn: function(done) {
            next = done;
            log += 'first;';
            firstThis = this;
          }},
          {name:'step2', fn:function(done){
            next = done;
            log += 'second;';
            secondThis = this;
          }}
        ]
      };

      spec = $scenario.execute('spec', function(done){
        log += 'done;';
        doneThis = this;
      });
      expect(log).toEqual('first;');
      next();
      expect(log).toEqual('first;second;');
      next();
      expect(log).toEqual('first;second;done;');
      expect(spec).not.toEqual(window);
      expect(spec).toEqual(firstThis);
      expect(spec).toEqual(secondThis);
      expect(spec).toEqual(doneThis);

      expect(spec.result.failed).toEqual(false);
      expect(spec.result.finished).toEqual(true);
      expect(spec.result.error).toBeUndefined();
      expect(spec.result.passed).toEqual(true);
    });

    it('should handle exceptions in a step', function(){
      $scenario.specs['spec'] = {
          steps: [
            {name:'error', fn:function(done) {
              throw "MyError";
            }}
          ]
        };

        var spec = $scenario.execute('spec');

        expect(spec.result.passed).toEqual(false);
        expect(spec.result.failed).toEqual(true);
        expect(spec.result.finished).toEqual(true);
        expect(spec.result.error).toEqual("MyError");
    });
  });

});