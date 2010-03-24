describe("input widget", function(){

  var compile, element, scope;

  beforeEach(function() {
    scope = null;
    element = null;
    var compiler = new Compiler(angularTextMarkup, angularAttrMarkup, angularDirective, angularWidget);
    compile = function(html) {
      element = jqLite(html);
      var view = compiler.compile(element)(element);
      view.init();
      scope = view.scope;
    };
  });

  afterEach(function(){
    if (element) element.remove();
    expect(_(jqCache).size()).toEqual(0);
  });

  it('should input-text auto init and handle keyup/change events', function(){
    compile('<input type="Text" name="name" value="Misko"/>');
    expect(scope.get('name')).toEqual("Misko");

    scope.set('name', 'Adam');
    scope.updateView();
    expect(element.attr('value')).toEqual("Adam");

    element.attr('value', 'Shyam');
    element.trigger('keyup');
    expect(scope.get('name')).toEqual('Shyam');

    element.attr('value', 'Kai');
    element.trigger('change');
    expect(scope.get('name')).toEqual('Kai');
  });

  it("should process ng-format", function(){
    compile('<input type="Text" name="list" value="a,b,c" ng-format="list"/>');
    expect(scope.get('list')).toEqual(['a', 'b', 'c']);

    scope.set('list', ['x', 'y', 'z']);
    scope.updateView();
    expect(element.attr('value')).toEqual("x, y, z");

    element.attr('value', '1, 2, 3');
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

    element.attr('value', 'x');
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

    element.attr('value', '');
    element.trigger('keyup');
    expect(element.hasClass('ng-validation-error')).toBeTruthy();
    expect(element.attr('ng-error')).toEqual('Required');
  });

});
