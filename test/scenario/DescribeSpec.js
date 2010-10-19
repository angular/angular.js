describe('angular.scenario.Describe', function() {
  var log;
  var root;

  beforeEach(function() {
    root = new angular.scenario.Describe();
    
    /**
     * Simple callback logging system. Use to assert proper order of calls.
     */
    log = function(text) { 
      log.text = log.text + text; 
    };
    log.fn = function(text) {
      return function(done){ 
        log(text); 
        (done || angular.noop)(); 
      };
    };
    log.reset = function() { 
      log.text = ''; 
    };
    log.reset();
  });

  it('should handle basic nested case', function() {
    root.describe('A', function(){
      this.beforeEach(log.fn('{'));
      this.afterEach(log.fn('}'));
      this.it('1', log.fn('1'));
      this.describe('B', function(){
        this.beforeEach(log.fn('('));
        this.afterEach(log.fn(')'));
        this.it('2', log.fn('2'));
      });
    });
    var specs = root.getSpecs();
    expect(specs.length).toEqual(2);

    expect(specs[0].name).toEqual('2');
    specs[0].before();
    specs[0].body();
    specs[0].after();
    expect(log.text).toEqual('{(2)}');

    log.reset();
    expect(specs[1].name).toEqual('1');
    specs[1].before();
    specs[1].body();
    specs[1].after();
    expect(log.text).toEqual('{1}');
  });
    
  it('should link nested describe blocks with parent and children', function() {
    root.describe('A', function() {
      this.it('1', angular.noop);
      this.describe('B', function() {
        this.it('2', angular.noop);
        this.describe('C', function() {
          this.it('3', angular.noop);
        });
      });
    });
    var specs = root.getSpecs();
    expect(specs[2].definition.parent).toEqual(root);
    expect(specs[0].definition.parent).toEqual(specs[2].definition.children[0]);
  });
  
  it('should not process xit and xdescribe', function() {
    root.describe('A', function() {
      this.xit('1', angular.noop);
      this.xdescribe('B', function() {
        this.it('2', angular.noop);
        this.describe('C', function() {
          this.it('3', angular.noop);
        });
      });
    });
    var specs = root.getSpecs();
    expect(specs.length).toEqual(0);
  });
  
  it('should create uniqueIds in the tree', function() {
    angular.scenario.Describe.id = 0;
    var a = new angular.scenario.Describe();
    var b = new angular.scenario.Describe();
    expect(a.id).toNotEqual(b.id);
  });
});
