describe("input widget", function(){

  var compile, element, scope;

  beforeEach(function() {
    scope = null;
    element = null;
    var compiler = new Compiler(angularTextMarkup, angularAttrMarkup, angularDirective, angularWidget);
    compile = function(html) {
      element = jqLite(html);
      scope = compiler.compile(element)(element);
      scope.$init();
    };
  });

  afterEach(function(){
    if (element) element.remove();
    expect(_(jqCache).size()).toEqual(0);
  });

  it('should input-text auto init and handle keyup/change events', function(){
    compile('<input type="Text" name="name" value="Misko" ng-action="count = count + 1" ng-init="count=0"/>');
    expect(scope.$get('name')).toEqual("Misko");
    expect(scope.$get('count')).toEqual(0);

    scope.$set('name', 'Adam');
    scope.$eval();
    expect(element.val()).toEqual("Adam");

    element.val('Shyam');
    element.trigger('keyup');
    expect(scope.$get('name')).toEqual('Shyam');
    expect(scope.$get('count')).toEqual(1);

    element.val('Kai');
    element.trigger('change');
    expect(scope.$get('name')).toEqual('Kai');
    expect(scope.$get('count')).toEqual(2);
  });

  it("should process ng-format", function(){
    compile('<input type="Text" name="list" value="a,b,c" ng-format="list"/>');
    expect(scope.$get('list')).toEqual(['a', 'b', 'c']);

    scope.$set('list', ['x', 'y', 'z']);
    scope.$eval();
    expect(element.val()).toEqual("x, y, z");

    element.val('1, 2, 3');
    element.trigger('keyup');
    expect(scope.$get('list')).toEqual(['1', '2', '3']);
  });

  it("should process ng-validation", function(){
    compile('<input type="text" name="price" value="abc" ng-validate="number"/>');
    expect(element.hasClass('ng-validation-error')).toBeTruthy();
    expect(element.attr('ng-error')).toEqual('Not a number');

    scope.$set('price', '123');
    scope.$eval();
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

    scope.$set('price', 'xxx');
    scope.$eval();
    expect(element.hasClass('ng-validation-error')).toBeFalsy();
    expect(element.attr('ng-error')).toBeFalsy();

    element.val('');
    element.trigger('keyup');
    expect(element.hasClass('ng-validation-error')).toBeTruthy();
    expect(element.attr('ng-error')).toEqual('Required');
  });

  it("should process ng-required", function() {
    compile('<textarea name="name">Misko</textarea>');
    expect(scope.$get('name')).toEqual("Misko");

    scope.$set('name', 'Adam');
    scope.$eval();
    expect(element.val()).toEqual("Adam");

    element.val('Shyam');
    element.trigger('keyup');
    expect(scope.$get('name')).toEqual('Shyam');

    element.val('Kai');
    element.trigger('change');
    expect(scope.$get('name')).toEqual('Kai');
  });

  it('should call ng-action on button click', function(){
    compile('<input type="button" value="Click Me" ng-action="clicked = true"/>');
    element.click();
    expect(scope.$get('clicked')).toEqual(true);
  });

  it('should support button alias', function(){
    compile('<button ng-action="clicked = true">Click Me</button>');
    element.click();
    expect(scope.$get('clicked')).toEqual(true);
  });

  it('should type="checkbox"', function(){
    compile('<input type="checkbox" name="checkbox" checked ng-action="action = true"/>');
    expect(scope.$get('checkbox')).toEqual(true);
    element.click();
    expect(scope.$get('checkbox')).toEqual(false);
    expect(scope.$get('action')).toEqual(true);
    element.click();
    expect(scope.$get('checkbox')).toEqual(true);
  });

  it('should type="radio"', function(){
    compile('<div>' +
        '<input type="radio" name="chose" value="A" ng-action="clicked = 1"/>' +
        '<input type="radio" name="chose" value="B" checked ng-action="clicked = 2"/>' +
      '</div>');
    var a = element[0].childNodes[0];
    var b = element[0].childNodes[1];
    expect(scope.chose).toEqual('B');
    expect(scope.clicked).not.toBeDefined();
    scope.chose = 'A';
    scope.$eval();
    expect(a.checked).toEqual(true);

    scope.chose = 'B';
    scope.$eval();
    expect(a.checked).toEqual(false);
    expect(b.checked).toEqual(true);
    expect(scope.clicked).not.toBeDefined();

    jqLite(a).click();
    expect(scope.chose).toEqual('A');
    expect(scope.clicked).toEqual(1);
  });

  it('should type="select-one"', function(){
    compile(
      '<select name="selection">' +
        '<option>A</option>' +
        '<option selected>B</option>' +
      '</select>');
    expect(scope.selection).toEqual('B');
    scope.selection = 'A';
    scope.$eval();
    expect(scope.selection).toEqual('A');
    expect(element[0].childNodes[0].selected).toEqual(true);
  });

  it('should type="select-multiple"', function(){
    compile(
      '<select name="selection" multiple>' +
        '<option>A</option>' +
        '<option selected>B</option>' +
      '</select>');
    expect(scope.selection).toEqual(['B']);
    scope.selection = ['A'];
    scope.$eval();
    expect(element[0].childNodes[0].selected).toEqual(true);
  });

  it('should report error on missing field', function(){
    //compile('<input type="text"/>');
  });

  it('should report error on assignment error', function(){

  });

  it('should report error on ng-action exception', function(){

  });


});
