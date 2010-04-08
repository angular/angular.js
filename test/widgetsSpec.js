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
    if (element && element.dealoc) element.dealoc();
    expect(size(jqCache)).toEqual(0);
  });

  it('should input-text auto init and handle keyup/change events', function(){
    compile('<input type="Text" name="name" value="Misko" ng-change="count = count + 1" ng-init="count=0"/>');
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
    expect(element.attr('ng-validation-error')).toEqual('Not a number');

    scope.$set('price', '123');
    scope.$eval();
    expect(element.hasClass('ng-validation-error')).toBeFalsy();
    expect(element.attr('ng-validation-error')).toBeFalsy();

    element.val('x');
    element.trigger('keyup');
    expect(element.hasClass('ng-validation-error')).toBeTruthy();
    expect(element.attr('ng-validation-error')).toEqual('Not a number');
  });

  it("should process ng-required", function(){
    compile('<input type="text" name="price" ng-required/>');
    expect(element.hasClass('ng-validation-error')).toBeTruthy();
    expect(element.attr('ng-validation-error')).toEqual('Required');

    scope.$set('price', 'xxx');
    scope.$eval();
    expect(element.hasClass('ng-validation-error')).toBeFalsy();
    expect(element.attr('ng-validation-error')).toBeFalsy();

    element.val('');
    element.trigger('keyup');
    expect(element.hasClass('ng-validation-error')).toBeTruthy();
    expect(element.attr('ng-validation-error')).toEqual('Required');
  });

  it("should process ng-required2", function() {
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

  it('should call ng-change on button click', function(){
    compile('<input type="button" value="Click Me" ng-change="clicked = true"/>');
    element.click();
    expect(scope.$get('clicked')).toEqual(true);
  });

  it('should support button alias', function(){
    compile('<button ng-change="clicked = true">Click Me</button>');
    element.click();
    expect(scope.$get('clicked')).toEqual(true);
  });

  it('should type="checkbox"', function(){
    compile('<input type="checkbox" name="checkbox" checked ng-change="action = true"/>');
    expect(scope.checkbox).toEqual(true);
    trigger(element, 'click');
    expect(scope.checkbox).toEqual(false);
    expect(scope.action).toEqual(true);
    trigger(element, 'click');
    expect(scope.checkbox).toEqual(true);
  });

  it('should type="radio"', function(){
    compile('<div>' +
        '<input type="radio" name="chose" value="A" ng-change="clicked = 1"/>' +
        '<input type="radio" name="chose" value="B" checked ng-change="clicked = 2"/>' +
        '<input type="radio" name="chose" value="C" ng-change="clicked = 3"/>' +
      '</div>');
    var a = element[0].childNodes[0];
    var b = element[0].childNodes[1];
    expect(b.name.split('@')[1]).toEqual('chose');
    expect(scope.chose).toEqual('B');
    scope.chose = 'A';
    scope.$eval();
    expect(a.checked).toEqual(true);

    scope.chose = 'B';
    scope.$eval();
    expect(a.checked).toEqual(false);
    expect(b.checked).toEqual(true);
    expect(scope.clicked).not.toBeDefined();

    trigger(a, 'click');
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
    compile('<input type="text"/>');
    expect(element.hasClass('ng-exception')).toBeTruthy();
  });

  it('should report error on assignment error', function(){
    compile('<input type="text" name="throw \'\'" value="x"/>');
    expect(element.hasClass('ng-exception')).toBeTruthy();
  });

  it('should report error on ng-change exception', function(){
    compile('<button ng-change="a-2=x">click</button>');
    element.click();
    expect(element.hasClass('ng-exception')).toBeTruthy();
  });

  it('should switch on value change', function(){
    compile('<ng:switch on="select"><div ng-switch-when="1">first:{{name}}</div><div ng-switch-when="2">second:{{name}}</div></ng:switch>');
    expect(element.html()).toEqual('');
    scope.select = 1;
    scope.$eval();
    expect(element.text()).toEqual('first:');
    scope.name="shyam";
    scope.$eval();
    expect(element.text()).toEqual('first:shyam');
    scope.select = 2;
    scope.$eval();
    scope.name = 'misko';
    scope.$eval();
    expect(element.text()).toEqual('second:misko');
  });
});

describe('ng:switch', function(){
  it("should match urls", function(){
    var scope = compile('<ng:switch on="url" using="route"><div ng-switch-when="/Book/:name">{{name}}</div></ng:include>');
    scope.url = '/Book/Moby';
    scope.$init();
//    jstestdriver.console.log('text');
    expect(scope.$element.text()).toEqual('Moby');
  });

  it('should call init on switch', function(){
    var scope = compile('<ng:switch on="url" change="name=\'works\'"><div ng-switch-when="a">{{name}}</div></ng:include>');
    scope.url = 'a';
    scope.$init();
    expect(scope.name).toEqual(undefined);
    expect(scope.$element.text()).toEqual('works');
  });
});

describe('ng:include', function(){
  it('should include on external file', function() {
    var element = jqLite('<ng:include src="myUrl"></ng:include>');
    var scope = compile(element);
    scope.$browser.xhr.expect('GET', 'myUrl').respond('{{1+2}}');
    scope.$init();
    expect(sortedHtml(element)).toEqual('<ng:include src="myUrl" switch-instance="compiled"></ng:include>');
    scope.$browser.xhr.flush();
    expect(element.text()).toEqual('3');
  });
});

