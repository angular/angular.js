describe("input widget", function(){

  var compile, element, scope, model;

  beforeEach(function() {
    scope = null;
    element = null;
    var compiler = new Compiler(angularTextMarkup, angularAttrMarkup, angularDirective, angularWidget);
    compile = function(html) {
      element = jqLite(html);
      var view = compiler.compile(element)(element);
      view.init();
      scope = view.scope;
      model = scope.state;
    };
  });

  afterEach(function(){
    if (element) element.remove();
    expect(_(jqCache).size()).toEqual(0);
  });

  it('should input-text auto init and handle keyup/change events', function(){
    compile('<input type="Text" name="name" value="Misko" ng-action="count = count + 1" ng-init="count=0"/>');
    expect(scope.get('name')).toEqual("Misko");
    expect(scope.get('count')).toEqual(0);

    scope.set('name', 'Adam');
    scope.updateView();
    expect(element.val()).toEqual("Adam");

    element.val('Shyam');
    element.trigger('keyup');
    expect(scope.get('name')).toEqual('Shyam');
    expect(scope.get('count')).toEqual(1);

    element.val('Kai');
    element.trigger('change');
    expect(scope.get('name')).toEqual('Kai');
    expect(scope.get('count')).toEqual(2);
  });

  it("should process ng-format", function(){
    compile('<input type="Text" name="list" value="a,b,c" ng-format="list"/>');
    expect(scope.get('list')).toEqual(['a', 'b', 'c']);

    scope.set('list', ['x', 'y', 'z']);
    scope.updateView();
    expect(element.val()).toEqual("x, y, z");

    element.val('1, 2, 3');
    element.trigger('keyup');
    expect(scope.get('list')).toEqual(['1', '2', '3']);
  });

  it("should process ng-validation", function(){
    compile('<input type="text" name="price" value="abc" ng-validate="number"/>');
    expect(element.hasClass('ng-validation-error')).toBeTruthy();
    expect(element.attr('ng-error')).toEqual('Not a number');

    scope.set('price', '123');
    scope.updateView();
    expect(element.hasClass('ng-validation-error')).toBeFalsy();
    expect(element.attr('ng-error')).toBeFalsy();

    element.val('x');
    element.trigger('keyup');
    expect(element.hasClass('ng-validation-error')).toBeTruthy();
    expect(element.attr('ng-error')).toEqual('Not a number');
  });

  it("should process ng-required", function(){
    compile('<input type="text" name="price" ng-required/>');
    expect(element.hasClass('ng-validation-error')).toBeTruthy();
    expect(element.attr('ng-error')).toEqual('Required');

    scope.set('price', 'xxx');
    scope.updateView();
    expect(element.hasClass('ng-validation-error')).toBeFalsy();
    expect(element.attr('ng-error')).toBeFalsy();

    element.val('');
    element.trigger('keyup');
    expect(element.hasClass('ng-validation-error')).toBeTruthy();
    expect(element.attr('ng-error')).toEqual('Required');
  });

  it("should process ng-required", function() {
    compile('<textarea name="name">Misko</textarea>');
    expect(scope.get('name')).toEqual("Misko");

    scope.set('name', 'Adam');
    scope.updateView();
    expect(element.val()).toEqual("Adam");

    element.val('Shyam');
    element.trigger('keyup');
    expect(scope.get('name')).toEqual('Shyam');

    element.val('Kai');
    element.trigger('change');
    expect(scope.get('name')).toEqual('Kai');
  });

  it('should call ng-action on button click', function(){
    compile('<input type="button" value="Click Me" ng-action="clicked = true"/>');
    element.click();
    expect(scope.get('clicked')).toEqual(true);
  });

  it('should type="checkbox"', function(){
    compile('<input type="checkbox" name="checkbox" checked ng-action="action = true"/>');
    expect(scope.get('checkbox')).toEqual(true);
    element.click();
    expect(scope.get('checkbox')).toEqual(false);
    expect(scope.get('action')).toEqual(true);
    element.click();
    expect(scope.get('checkbox')).toEqual(true);
  });

  it('should type="radio"', function(){
    compile('<div>' +
        '<input type="radio" name="chose" value="A" ng-action="clicked = 1"/>' +
        '<input type="radio" name="chose" value="B" checked ng-action="clicked = 2"/>' +
      '</div>');
    var a = element[0].childNodes[0];
    var b = element[0].childNodes[1];
    expect(model.chose).toEqual('B');
    expect(model.clicked).not.toBeDefined();
    model.chose = 'A';
    model.$updateView();
    expect(a.checked).toEqual(true);

    model.chose = 'B';
    model.$updateView();
    expect(a.checked).toEqual(false);
    expect(b.checked).toEqual(true);
    expect(model.clicked).not.toBeDefined();

    jqLite(a).click();
    expect(model.chose).toEqual('A');
    expect(model.clicked).toEqual(1);
  });

  it('should report error on missing field', function(){

  });

  it('should report error on assignment error', function(){

  });

  it('should report error on ng-action exception', function(){

  });


});
