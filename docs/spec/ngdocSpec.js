var ngdoc = require('ngdoc.js');
var DOM = require('dom.js').DOM;

describe('ngdoc', function(){
  var Doc = ngdoc.Doc;
  var dom;

  beforeEach(function(){
    dom = new DOM();
    this.addMatchers({
      toContain: function(text) {
        this.actual = this.actual.toString();
        return this.actual.indexOf(text) > -1;
      }
    });
  });

  describe('Doc', function(){
    describe('metadata', function(){

      it('should find keywords', function(){
        expect(new Doc('\nHello: World! @ignore.').keywords()).toEqual('hello world');
        expect(new Doc('The `ng:class-odd` and').keywords()).toEqual('and ng:class-odd the');
      });
    });

    describe('parse', function(){
      it('should convert @names into properties', function(){
        var doc = new Doc('\n@name name\n@desc\ndesc\ndesc2\n@dep\n');
        doc.parse();
        expect(doc.name).toEqual('name');
        expect(doc.desc).toEqual('desc\ndesc2');
        expect(doc.dep).toEqual('');
      });

      it('should parse parameters', function(){
        var doc = new Doc(
            '@param {*} a short\n' +
            '@param {Type} b med\n' +
            '@param {Class=} [c=2] long\nline');
        doc.parse();
        expect(doc.param).toEqual([
           {name:'a', description:'<p>short</p>', type:'*', optional:false, 'default':undefined},
           {name:'b', description:'<p>med</p>', type:'Type', optional:false, 'default':undefined},
           {name:'c', description:'<p>long\nline</p>', type:'Class', optional:true, 'default':'2'}
         ]);
      });

      it('should parse return', function(){
        var doc = new Doc('@returns {Type} text *bold*.');
        doc.parse();
        expect(doc.returns).toEqual({
          type: 'Type',
          description: '<p>text <em>bold</em>.</p>'
        });
      });

      it('should not remove extra line breaks', function(){
        var doc = new Doc('@example\nA\n\nB');
        doc.parse();
        expect(doc.example).toEqual('A\n\nB');
      });

    });


  });

  describe('markdown', function(){
    var markdown = ngdoc.markdown;

    it('should replace angular in markdown', function(){
      expect(markdown('<angular/>')).
        toEqual('<p><tt>&lt;angular/&gt;</tt></p>');
    });

    it('should not replace anything in <pre>, but escape the html escape the content', function(){
      expect(markdown('bah x\n<pre>\n<b>angular</b>.k\n</pre>\n asdf x')).
        toEqual(
            '<p>bah x</p>' +
            '<div ng:non-bindable><pre class="brush: js; html-script: true;">\n' +
            '&lt;b&gt;angular&lt;/b&gt;.k\n' +
            '</pre></div>' +
            '<p>asdf x</p>');
    });

    it('should replace text between two <pre></pre> tags', function() {
      expect(markdown('<pre>x</pre># One<pre>b</pre>')).
        toMatch('</div><h3>One</h3><div');
    });
  });

  describe('trim', function(){
    var trim = ngdoc.trim;
    it('should remove leading/trailing space', function(){
      expect(trim('  \nabc\n  ')).toEqual('abc');
    });

    it('should remove leading space on every line', function(){
      expect(trim('\n 1\n  2\n   3\n')).toEqual('1\n 2\n  3');
    });
  });

  describe('merge', function(){
    it('should merge child with parent', function(){
      var parent = new Doc({name:'angular.service.abc'});
      var methodA = new Doc({name:'methodA', methodOf:'angular.service.abc'});
      var methodB = new Doc({name:'methodB', methodOf:'angular.service.abc'});
      var propA = new Doc({name:'propA', propertyOf:'angular.service.abc'});
      var propB = new Doc({name:'propB', propertyOf:'angular.service.abc'});
      ;var docs = [methodB, methodA, propB, propA, parent]; // keep wrong order;
      ngdoc.merge(docs);
      expect(docs.length).toEqual(1);
      expect(docs[0].name).toEqual('angular.service.abc');
      expect(docs[0].methods).toEqual([methodA, methodB]);
      expect(docs[0].properties).toEqual([propA, propB]);
    });

  });

  ////////////////////////////////////////

  describe('TAG', function(){
    describe('@param', function(){
      it('should parse with no default', function(){
        var doc = new Doc('@param {(number|string)} number Number \n to format.');
        doc.parse();
        expect(doc.param).toEqual([{
          type : '(number|string)',
          name : 'number',
          optional: false,
          'default' : undefined,
          description : '<p>Number \n to format.</p>' }]);
      });

      it('should parse with default and optional', function(){
        var doc = new Doc('@param {(number|string)=} [fractionSize=2] desc');
        doc.parse();
        expect(doc.param).toEqual([{
          type : '(number|string)',
          name : 'fractionSize',
          optional: true,
          'default' : '2',
          description : '<p>desc</p>' }]);
      });
    });

    describe('@requires', function() {
      it('should parse more @requires tag into array', function() {
        var doc = new Doc('@requires $service\n@requires $another');
        doc.parse();
        expect(doc.requires).toEqual(['$service', '$another']);
      });
    });

    describe('@property', function() {
      it('should parse @property tags into array', function() {
        var doc = new Doc("@property {type} name1 desc\n@property {type} name2 desc");
        doc.parse();
        expect(doc.properties.length).toEqual(2);
      });

      it('should parse @property with only name', function() {
        var doc = new Doc("@property fake");
        doc.parse();
        expect(doc.properties[0].name).toEqual('fake');
      });

      it('should parse @property with optional type', function() {
        var doc = new Doc("@property {string} name");
        doc.parse();
        expect(doc.properties[0].name).toEqual('name');
        expect(doc.properties[0].type).toEqual('string');
      });

      it('should parse @property with optional description', function() {
        var doc = new Doc("@property name desc rip tion");
        doc.parse();
        expect(doc.properties[0].name).toEqual('name');
        expect(doc.properties[0].description).toEqual('desc rip tion');
      });

      it('should parse @property with type and description both', function() {
        var doc = new Doc("@property {bool} name desc rip tion");
        doc.parse();
        expect(doc.properties[0].name).toEqual('name');
        expect(doc.properties[0].type).toEqual('bool');
        expect(doc.properties[0].description).toEqual('desc rip tion');
      });

    });

    describe('@returns', function() {
      it('should not parse @returns without type', function() {
        var doc = new Doc("@returns lala");
        expect(doc.parse).toThrow();
      });

      it('should parse @returns with type and description', function() {
        var doc = new Doc("@returns {string} descrip tion");
        doc.parse();
        expect(doc.returns).toEqual({type: 'string', description: '<p>descrip tion</p>'});
      });

      it('should transform description of @returns with markdown', function() {
        var doc = new Doc("@returns {string} descrip *tion*");
        doc.parse();
        expect(doc.returns).toEqual({type: 'string', description: '<p>descrip <em>tion</em></p>'});
      });

      it('should support multiline content', function() {
        var doc = new Doc("@returns {string} description\n new line\n another line");
        doc.parse();
        expect(doc.returns).
          toEqual({type: 'string', description: '<p>description\n new line\n another line</p>'});
      });
    });

    describe('@description', function(){
      it('should support pre blocks', function(){
        var doc = new Doc("@description <pre>abc</pre>");
        doc.parse();
        expect(doc.description).
          toBe('<div ng:non-bindable><pre class="brush: js; html-script: true;">abc</pre></div>');
      });

      it('should support multiple pre blocks', function() {
        var doc = new Doc("@description foo \n<pre>abc</pre>\n#bah\nfoo \n<pre>cba</pre>");
        doc.parse();
        expect(doc.description).
          toBe('<p>foo </p>' +
               '<div ng:non-bindable><pre class="brush: js; html-script: true;">abc</pre></div>' +
               '<h3>bah</h3>\n\n' +
               '<p>foo </p>' +
               '<div ng:non-bindable><pre class="brush: js; html-script: true;">cba</pre></div>');

      });

      it('should support nested @link annotations with or without description', function() {
        var doc = new Doc("@description " +
            'foo {@link angular.foo}\n\n da {@link angular.foo bar foo bar } \n\n' +
            'dad{@link angular.foo}\n\n' +
            '{@link angular.directive.ng:foo ng:foo}');
        doc.parse();
        expect(doc.description).
          toBe('<p>foo <a href="#!angular.foo"><code>angular.foo</code></a></p>\n\n' +
               '<p>da <a href="#!angular.foo"><code>bar foo bar</code></a> </p>\n\n' +
               '<p>dad<a href="#!angular.foo"><code>angular.foo</code></a></p>\n\n' +
               '<p><a href="#!angular.directive.ng:foo"><code>ng:foo</code></a></p>');
      });

      it('should increment all headings by two', function() {
        var doc = new Doc('@description # foo\nabc\n## bar \n xyz');
        doc.parse();
        expect(doc.description).
          toBe('<h3>foo</h3>\n\n<p>abc</p>\n\n<h4>bar</h4>\n\n<p>xyz</p>');
      });
    });

    describe('@example', function(){
      it('should not remove {{}}', function(){
        var doc = new Doc('@example text {{ abc }}');
        doc.parse();
        expect(doc.example).toEqual('text {{ abc }}');
      });
    });

    describe('@exampleDescription', function(){
      it('should render example description', function(){
        var doc = new Doc('@exampleDescription some\n text');
        doc.ngdoc = "filter";
        doc.parse();
        expect(doc.html()).toContain('<p>some\n text');
      });

      it('should alias @exampleDescription to @exampleDesc', function(){
        var doc = new Doc('@exampleDesc some\n text');
        doc.ngdoc = "filter";
        doc.parse();
        expect(doc.html()).toContain('<p>some\n text');
      });

      it('should render description in related method', function(){
        var doc = new Doc();
        doc.ngdoc = 'service';
        doc.methods = [new Doc('@ngdoc method\n@exampleDescription MDesc\n@example MExmp').parse()];
        doc.properties = [new Doc('@ngdoc property\n@exampleDescription PDesc\n@example PExmp').parse()];
        expect(doc.html()).toContain('<p>MDesc</p><div ng:non-bindable=""><pre class="brush: js; html-script: true;">MExmp</pre>');
        expect(doc.html()).toContain('<p>PDesc</p><div ng:non-bindable=""><pre class="brush: js; html-script: true;">PExmp</pre>');
      });

    });

    describe('@deprecated', function() {
      it('should parse @deprecated', function() {
        var doc = new Doc('@deprecated Replaced with foo.');
        doc.parse();
        expect(doc.deprecated).toBe('Replaced with foo.');
      });
    });

    describe('@this', function(){
      it('should render @this', function() {
        var doc = new Doc('@this I am self.');
        doc.ngdoc = 'filter';
        doc.parse();
        expect(doc.html()).toContain('<h3>Method\'s <code>this</code></h3>\n<p>I am self.</p>');
      });
    });
  });

  describe('usage', function(){
    describe('filter', function(){
      it('should format', function(){
        var doc = new Doc({
          ngdoc:'formatter',
          shortName:'myFilter',
          param: [
            {name:'a'},
            {name:'b'}
          ]
        });
        doc.html_usage_filter(dom);
        expect(dom).toContain('myFilter_expression | myFilter:b');
        expect(dom).toContain('angular.filter.myFilter(a, b)');
      });
    });

    describe('validator', function(){
      it('should format', function(){
        var doc = new Doc({
          ngdoc:'validator',
          shortName:'myValidator',
          param: [
            {name:'a'},
            {name:'b'}
          ]
        });
        doc.html_usage_validator(dom);
        expect(dom).toContain('ng:validate="myValidator:b"');
        expect(dom).toContain('angular.validator.myValidator(a, b)');
      });
    });

    describe('formatter', function(){
      it('should format', function(){
        var doc = new Doc({
          ngdoc:'formatter',
          shortName:'myFormatter',
          param: [
            {name:'a'},
          ]
        });
        doc.html_usage_formatter(dom);
        expect(dom).toContain('ng:format="myFormatter:a"');
        expect(dom).toContain('var userInputString = angular.formatter.myFormatter.format(modelValue, a);');
        expect(dom).toContain('var modelValue = angular.formatter.myFormatter.parse(userInputString, a);');
      });
    });
  });

});
