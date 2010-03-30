describe('scope/model', function(){

  it('should create a scope with parent', function(){
    var model = createScope({name:'Misko'});
    expect(model.name).toEqual('Misko');
  });

  it('should have $get/set$/parent$', function(){
    var parent = {};
    var model = createScope(parent);
    model.$set('name', 'adam');
    expect(model.name).toEqual('adam');
    expect(model.$get('name')).toEqual('adam');
    expect(model.$parent).toEqual(parent);
  });

  //$eval
  it('should eval function with correct this and pass arguments', function(){
    var model = createScope();
    model.$eval(function(name){
      this.name = name;
    }, 'works');
    expect(model.name).toEqual('works');
  });

  it('should eval expression with correct this', function(){
    var model = createScope();
    model.$eval('name="works"');
    expect(model.name).toEqual('works');
  });

  //$watch
  it('should watch an expression for change', function(){
    var model = createScope();
    model.oldValue = "";
    var count = 0;
    model.name = 'adam';
    model.$watch('name', function(){ count ++; });
    model.$watch(function(){return model.name;}, function(newValue, oldValue){
      this.newValue = newValue;
      this.oldValue = oldValue;
    });
    model.name = 'misko';
    model.$eval();
    expect(count).toEqual(2); // since watches trigger $eval
    expect(model.newValue).toEqual('misko');
    expect(model.oldValue).toEqual('adam');
  });

  it('should eval with no arguments', function(){
    var model = createScope();
    var count = 0;
    model.$onEval(function(){count++;});
    model.$eval();
    expect(count).toEqual(1);
  });

  //$bind
  it('should curry a function with respect to scope', function(){
    var model = createScope();
    model.name = 'misko';
    expect(model.$bind(function(){return this.name;})()).toEqual('misko');
  });

  //$behavior
  it('should behave as class', function(){
    function Printer(brand){
      this.brand = brand;
    };
    Printer.prototype.print = function(){
      this.printed = true;
    };
    var model = createScope({ name: 'parent' }, Printer, 'hp');
    expect(model.brand).toEqual('hp');
    model.print();
    expect(model.printed).toEqual(true);
  });



  //$tryEval
  it('should report error on element', function(){

  });

  it('should report error on visible element', function(){

  });

});
