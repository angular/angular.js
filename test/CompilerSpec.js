function Template() {
  this.paths = [];
  this.children = [];
  this.inits = [];
}

Template.prototype = {
  init: function(element, scope) {
    foreach(this.inits, function(fn) {
      scope.apply(fn, element);
    });

    var i,
        childNodes = element.childNodes,
        children = this.children,
        paths = this.paths,
        length = paths.length;
    for (i = 0; i < length; i++) {
      children[i].init(childNodes[paths[i]], scope);
    }
  },

  addInit:function(init) {
    if (init) {
      this.inits.push(init);
    }
  },


  addChild: function(index, template) {
    this.paths.push(index);
    this.children.push(template);
  }
};

function Compiler(directives){
  this.directives = directives;
}

DIRECTIVE = /^ng-(.*)$/;

/**
 * return {
 *   element:
 *   init: function(element){...}
 * }
 *
 * internal data structure: {
 *  paths: [4, 5, 6],
 *  directive: name,
 *  init: function(expression, element){}
 * }
 *
 * template : {
 *   inits: [fn(), fn()}
 *   paths: [1, 5],
 *   templates: [
 *     inits: []
 *     paths: []
 *     templates:
 *   ]
 * }
 */
Compiler.prototype = {
  compile: function(element) {
    var template = this.templetize(element);
    return function(){
      var scope = new Scope();
      return {
        scope: scope,
        element:element,
        init: bind(template, template.init, element, scope)
      };
    };
  },

  templetize: function(element){
    var items, item, length, i, directive, init, template,
        childTemplate, recurse = true;

    // Process attributes/directives
    for (i = 0, items = element.attributes, length = items.length;
         i < length; i++) {
      item = items[i];
      var match = item.name.match(DIRECTIVE);
      if (match) {
        directive = this.directives[match[1]];
        if (directive) {
          init = directive.call({}, item.value, element);
          template = template || new Template();
          template.addInit(init);
          recurse = recurse && init;
        }
      }
    }

    // Process children
    if (recurse) {
      for (i = 0, items = element.childNodes, length = items.length;
           i < length; i++) {
        if(childTemplate = this.templetize(items[i])) {
          template = template || new Template();
          template.addChild(i, childTemplate);
        }
      }
    }
    return template;
  }
};

describe('compiler', function(){
  function element(html) {
    return jQuery(html)[0];
  }

  var compiler, directives, compile, log;

  beforeEach(function(){
    log = "";
    directives = {
      hello: function(expression, element){
        log += "hello ";
        return function() {
          log += expression;
        };
      },

      watch: function(expression, element){
        return function() {
          this.$watch(expression, function(val){
            log += ":" + val;
          });
        };
      }

    };
    compiler = new Compiler(directives);
    compile = function(html){
      var e = element(html);
      var view = compiler.compile(e)(e);
      view.init();
      return view.scope;
    };
  });

  it('should recognize a directive', function(){
    var e = element('<div ng-directive="expr" ignore="me"></div>');
    directives.directive = function(expression, element){
      log += "found";
      expect(expression).toEqual("expr");
      expect(element).toEqual(e);
      return function initFn() {
        log += ":init";
      };
    };
    var template = compiler.compile(e);
    var init = template(e).init;
    expect(log).toEqual("found");
    init();
    expect(log).toEqual("found:init");
  });

  it('should recurse to children', function(){
    var scope = compile('<div><span ng-hello="misko"/></div>');
    expect(log).toEqual("hello misko");
  });

  it('should watch scope', function(){
    var scope = compile('<span ng-watch="name"/>');
    expect(log).toEqual("");
    scope.updateView();
    scope.set('name', 'misko');
    scope.updateView();
    scope.updateView();
    scope.set('name', 'adam');
    scope.updateView();
    scope.updateView();
    expect(log).toEqual(":misko:adam");
  });

  it('should prevent recursion', function(){
    directives.stop = function(){ return false; };
    var scope = compile('<span ng-hello="misko" ng-stop="true"><span ng-hello="adam"/></span>');
    expect(log).toEqual("hello misko");
  });
});
