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
        expect(new Doc('\nHello: World! @ignore. $abc').keywords()).toEqual('$abc hello world');
        expect(new Doc('The `ng:class-odd` and').keywords()).toEqual('and ng:class-odd the');
      });

      it('should have shortName', function(){
        var d1 = new Doc('@name a.b.c').parse();
        var d2 = new Doc('@name a.b.ng:c').parse();
        var d3 = new Doc('@name some text: more text').parse();
        expect(ngdoc.metadata([d1])[0].shortName).toEqual('c');
        expect(ngdoc.metadata([d2])[0].shortName).toEqual('ng:c');
        expect(ngdoc.metadata([d3])[0].shortName).toEqual('more text');
      });

      it('should have depth information', function(){
        var d1 = new Doc('@name a.b.c').parse();
        var d2 = new Doc('@name a.b.ng:c').parse();
        var d3 = new Doc('@name some text: more text').parse();
        expect(ngdoc.metadata([d1])[0].depth).toEqual(2);
        expect(ngdoc.metadata([d2])[0].depth).toEqual(2);
        expect(ngdoc.metadata([d3])[0].depth).toEqual(1);
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

      it('should parse filename', function(){
        var doc = new Doc('@name friendly name', 'docs/a.b.ngdoc', 1);
        doc.parse(0);
        expect(doc.id).toEqual('a.b');
        expect(doc.name).toEqual('friendly name');
      });

      it('should escape <doc:source> element', function(){
        var doc = new Doc('@description before <doc:example>' +
            '<doc:source>\n<>\n</doc:source></doc:example> after');
        doc.parse();
        expect(doc.description).toContain('<p>before </p><doc:example>' +
            '<pre class="doc-source">\n&lt;&gt;\n</pre></doc:example><p>after</p>');
      });

      it('should escape <doc:scenario> element', function(){
        var doc = new Doc('@description before <doc:example>' +
            '<doc:scenario>\n<>\n</doc:scenario></doc:example> after');
        doc.parse();
        expect(doc.description).toContain('<p>before </p><doc:example>' +
            '<pre class="doc-scenario">\n&lt;&gt;\n</pre></doc:example><p>after</p>');
      });

      it('should store all links', function() {
        var doc = new Doc('@description {@link api/angular.link}');
        doc.parse();

        expect(doc.links).toContain('api/angular.link');
      });

      describe('sorting', function(){
        function property(name) {
          return function(obj) {return obj[name];};
        }
        function noop(){}
        function doc(type, name){
          return {
              id: name,
              ngdoc: type,
              keywords: noop
          };
        }

        var angular_widget = doc('overview', 'angular.widget');
        var angular_x = doc('function', 'angular.x');
        var angular_y = doc('property', 'angular.y');

        it('should put angular.fn() in front of angular.widget, etc', function(){
          expect(ngdoc.metadata([angular_widget, angular_y, angular_x]).map(property('id')))
            .toEqual(['angular.x', 'angular.y', 'angular.widget' ]);
        });
      });
    });
  });

  describe('markdown', function(){
    it('should replace angular in markdown', function(){
      expect(new Doc().markdown('<angular/>')).
        toEqual('<p><tt>&lt;angular/&gt;</tt></p>');
    });

    it('should not replace anything in <pre>, but escape the html escape the content', function(){
      expect(new Doc().markdown('bah x\n<pre>\n<b>angular</b>.k\n</pre>\n asdf x')).
        toEqual(
            '<p>bah x</p>' +
            '<div ng:non-bindable><pre class="brush: js; html-script: true;">\n' +
            '&lt;b&gt;angular&lt;/b&gt;.k\n' +
            '</pre></div>' +
            '<p>asdf x</p>');
    });

    it('should replace text between two <pre></pre> tags', function() {
      expect(new Doc().markdown('<pre>x</pre># One<pre>b</pre>')).
        toMatch('</div><h1>One</h1><div');
    });

    it('should unindent text before processing based on the second line', function() {
      expect(new Doc().markdown('first line\n' +
                                '   second line\n\n' +
                                '       third line\n' +
                                '        fourth line\n\n' +
                                '   fifth line')).
        toMatch('<p>first line\n' +
                'second line</p>\n\n' +
                '<pre><code>third line\n' +
                ' fourth line\n</code></pre>\n\n' +
                '<p>fifth line</p>');
    });

    it('should unindent text before processing based on the first line', function() {
      expect(new Doc().markdown('   first line\n\n' +
                                '       second line\n' +
                                '       third line\n' +
                                '        fourth line\n\n' +
                                '   fifth line')).
        toMatch('<p>first line</p>\n\n' +
                '<pre><code>second line\n' +
                'third line\n' +
                ' fourth line\n</code></pre>\n\n' +
                '<p>fifth line</p>');
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
      var parent = new Doc({id: 'angular.service.abc', name: 'angular.service.abc', section: 'api'});
      var methodA = new Doc({name: 'methodA', methodOf: 'angular.service.abc'});
      var methodB = new Doc({name: 'methodB', methodOf: 'angular.service.abc'});
      var propA = new Doc({name: 'propA', propertyOf: 'angular.service.abc'});
      var propB = new Doc({name: 'propB', propertyOf: 'angular.service.abc'});
      var docs = [methodB, methodA, propB, propA, parent]; // keep wrong order;
      ngdoc.merge(docs);
      expect(docs.length).toEqual(1);
      expect(docs[0].id).toEqual('angular.service.abc');
      expect(docs[0].methods).toEqual([methodA, methodB]);
      expect(docs[0].properties).toEqual([propA, propB]);
    });



    describe('links checking', function() {
      var docs;
      beforeEach(function() {
        spyOn(console, 'log');
        docs = [new Doc({section: 'api', id: 'fake.id1', links: ['non-existing-link']}),
                new Doc({section: 'api', id: 'fake.id2'}),
                new Doc({section: 'api', id: 'fake.id3'})];
      });

      it('should log warning when any link doesn\'t exist', function() {
        ngdoc.merge(docs);
        expect(console.log).toHaveBeenCalled();
        expect(console.log.argsForCall[0][0]).toContain('WARNING:');
      });

      it('should say which link doesn\'t exist', function() {
        ngdoc.merge(docs);
        expect(console.log.argsForCall[0][0]).toContain('non-existing-link');
      });

      it('should say where is the non-existing link', function() {
        ngdoc.merge(docs);
        expect(console.log.argsForCall[0][0]).toContain('api/fake.id1');
      });
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
          description : '<p>Number \nto format.</p>' }]);
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
        var doc = new Doc('@requires $service for \n`A`\n@requires $another for `B`');
        doc.ngdoc = 'service';
        doc.parse();
        expect(doc.requires).toEqual([
          {name:'$service', text:'<p>for \n<code>A</code></p>'},
          {name:'$another', text:'<p>for <code>B</code></p>'}]);
        expect(doc.html()).toContain('<a href="#!angular.service.$service">$service</a>');
        expect(doc.html()).toContain('<a href="#!angular.service.$another">$another</a>');
        expect(doc.html()).toContain('<p>for \n<code>A</code></p>');
        expect(doc.html()).toContain('<p>for <code>B</code></p>');
      });
    });

    describe('@property', function() {
      it('should parse @property tags into array', function() {
        var doc = new Doc("@property {type} name1 desc\n@property {type} name2 desc");
        doc.parse();
        expect(doc.properties.length).toEqual(2);
      });

      it('should not parse @property without a type', function() {
        var doc = new Doc("@property fake");
        expect(function() { doc.parse(); }).
          toThrow(new Error("Not a valid 'property' format: fake"));
      });

      it('should parse @property with type', function() {
        var doc = new Doc("@property {string} name");
        doc.parse();
        expect(doc.properties[0].name).toEqual('name');
        expect(doc.properties[0].type).toEqual('string');
      });

      it('should parse @property with optional description', function() {
        var doc = new Doc("@property {string} name desc rip tion");
        doc.parse();
        expect(doc.properties[0].name).toEqual('name');
        expect(doc.properties[0].description).toEqual('<p>desc rip tion</p>');
      });

      it('should parse @property with type and description both', function() {
        var doc = new Doc("@property {bool} name desc rip tion");
        doc.parse();
        expect(doc.properties[0].name).toEqual('name');
        expect(doc.properties[0].type).toEqual('bool');
        expect(doc.properties[0].description).toEqual('<p>desc rip tion</p>');
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
          toEqual({type: 'string', description: '<p>description\nnew line\nanother line</p>'});
      });
    });

    describe('@description', function(){
      it('should support pre blocks', function(){
        var doc = new Doc("@description <pre><b>abc</b></pre>");
        doc.parse();
        expect(doc.description).
          toBe('<div ng:non-bindable><pre class="brush: js; html-script: true;">&lt;b&gt;abc&lt;/b&gt;</pre></div>');
      });

      it('should support multiple pre blocks', function() {
        var doc = new Doc("@description foo \n<pre>abc</pre>\n#bah\nfoo \n<pre>cba</pre>");
        doc.parse();
        expect(doc.description).
          toBe('<p>foo </p>' +
               '<div ng:non-bindable><pre class="brush: js;">abc</pre></div>' +
               '<h1>bah</h1>\n\n' +
               '<p>foo </p>' +
               '<div ng:non-bindable><pre class="brush: js;">cba</pre></div>');

      });

      it('should support nested @link annotations with or without description', function() {
        var doc = new Doc("@description " +
            'foo {@link angular.foo}\n\n da {@link angular.foo bar foo bar } \n\n' +
            'dad{@link angular.foo}\n\n' +
            'external{@link http://angularjs.org}\n\n' +
            'external{@link ./static.html}\n\n' +
            '{@link angular.directive.ng:foo ng:foo}');
        doc.parse();
        expect(doc.description).
          toContain('foo <a href="#!api/angular.foo"><code>angular.foo</code></a>');
        expect(doc.description).
          toContain('da <a href="#!api/angular.foo"><code>bar foo bar</code></a>');
        expect(doc.description).
          toContain('dad<a href="#!api/angular.foo"><code>angular.foo</code></a>');
        expect(doc.description).
          toContain('<a href="#!api/angular.directive.ng:foo"><code>ng:foo</code></a>');
        expect(doc.description).
          toContain('<a href="http://angularjs.org">http://angularjs.org</a>');
        expect(doc.description).
          toContain('<a href="./static.html">./static.html</a>');
      });

      it('shoul support line breaks in @link', function(){
        var doc = new Doc("@description " +
            '{@link\napi/angular.foo\na\nb}');
        doc.parse();
        expect(doc.description).
          toContain('<a href="#!api/angular.foo">a b</a>');
      });

    });

    describe('@example', function(){
      it('should not remove {{}}', function(){
        var doc = new Doc('@example text {{ abc }}');
        doc.parse();
        expect(doc.example).toEqual('<p>text {{ abc }}</p>');
      });

      it('should support doc:example', function(){
        var doc = new Doc('@ngdoc overview\n@example \n' +
            '<doc:example>\n' +
            ' <doc:source><escapeme></doc:source>\n' +
            ' <doc:scenario><scenario></doc:scenario>\n' +
            '</doc:example>').parse();
        var html = doc.html();
        expect(html).toContain('<pre class="doc-source">&lt;escapeme&gt;</pre>');
        expect(html).toContain('<pre class="doc-scenario">&lt;scenario&gt;</pre>');
        expect(doc.scenarios).toEqual(['<scenario>']);
      });
    });

    describe('@depricated', function() {
      it('should parse @depricated', function() {
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
        expect(doc.html()).toContain('<h3>Method\'s <code>this</code></h3>\n' +
            '<div>' +
            '<p>I am self.</p>' +
            '</div>\n');
        expect(doc.html()).toContain('<h3>Method\'s <code>this</code></h3>\n' +
            '<div><p>I am self.</p></div>');
      });
    });
  });

  describe('usage', function(){
    describe('overview', function(){
      it('should supress description heading', function(){
        var doc = new Doc('@ngdoc overview\n@name angular\n@description\n#heading\ntext');
        doc.parse();
        expect(doc.html()).toContain('text');
        expect(doc.html()).toContain('<h2>heading</h2>');
        expect(doc.html()).not.toContain('Description');
      });
    });


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
