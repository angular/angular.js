console.log(__dirname);
require.paths.push(__dirname + "/../");
require.paths.push(__dirname + "/../../");
var fs = require('fs');
var Script = process.binding('evals').Script;
var collect = load('docs/collect.js');

describe('collect', function(){
  describe('markdown', function(){
    it('should replace angular in markdown', function(){
      expect(collect.markdown('<angular/>')).
        toEqual('<p><tt>&lt;angular/&gt;</tt></p>');
    });
  });
  
  describe('processNgDoc', function() {
    var processNgDoc = collect.processNgDoc,
        documentation;

    beforeEach(function() {
      documentation = {
        section: {},
        all: [],
        byName: {}
      };
    });
    
    it('should store references to docs by name', function() {
      var doc = {ngdoc: 'section', name: 'fake', raw: {}};
      processNgDoc(documentation, doc);
      expect(documentation.byName.fake).toBe(doc);
    });
    
    it('should connect doc to owner (specified by @methodOf)', function() {
      var parentDoc = {ngdoc: 'section', name: 'parent', raw: {}};
      var doc = {ngdoc: 'section', name: 'child', methodOf: 'parent', raw: {}};
      processNgDoc(documentation, parentDoc);
      processNgDoc(documentation, doc);
      expect(documentation.byName.parent.method).toBeDefined();
      expect(documentation.byName.parent.method[0]).toBe(doc);
    });
    
    it('should throw exception if owner does not exist', function() {
      expect(function() {
        processNgDoc(documentation, {ngdoc: 'section', methodOf: 'not.exist', raw: {}});
      }).toThrow('Owner "not.exist" is not defined.');
    });
    
    it('should ignore non-ng docs', function() {
      var doc = {name: 'anything'};
      expect(function() {
        processNgDoc(documentation, doc);
      }).not.toThrow();
      expect(documentation.all).not.toContain(doc);
    });
  });
  
  describe('TAG', function(){
    var TAG = collect.TAG;
    var doc;
    beforeEach(function(){
      doc = {};
    });
    
    describe('@param', function(){
      it('should parse with no default', function(){
        TAG.param(doc, 'param', 
            '{(number|string)} number Number \n to format.');
        expect(doc.param).toEqual([{ 
          type : '(number|string)', 
          name : 'number', 
          'default' : undefined, 
          description : 'Number \n to format.' }]);
      });
      it('should parse with default', function(){
        TAG.param(doc, 'param', 
            '{(number|string)=} [fractionSize=2] desc');
        expect(doc.param).toEqual([{ 
          type : '(number|string)', 
          name : 'fractionSize', 
          'default' : '2', 
          description : 'desc' }]);
      });
    });
    
    describe('@requires', function() {
      it('should parse more @requires tag into array', function() {
        TAG.requires(doc, 'requires', '$service');
        TAG.requires(doc, 'requires', '$another');
        
        expect(doc.requires).toEqual([
          {name: '$service'},
          {name: '$another'}
        ]);
      });
    });

    describe('@property', function() {
      it('should parse @property tags into array', function() {
        TAG.property(doc, 'property', '{type} name1 desc');
        TAG.property(doc, 'property', '{type} name2 desc');
        expect(doc.property.length).toEqual(2);
      });
      
      it('should parse @property with only name', function() {
        TAG.property(doc, 'property', 'fake');
        expect(doc.property[0].name).toEqual('fake');
      });
      
      it('should parse @property with optional type', function() {
        TAG.property(doc, 'property', '{string} name');
        expect(doc.property[0].name).toEqual('name');
        expect(doc.property[0].type).toEqual('string');
      });
      
      it('should parse @property with optional description', function() {
        TAG.property(doc, 'property', 'name desc rip tion');
        expect(doc.property[0].name).toEqual('name');
        expect(doc.property[0].description).toEqual('desc rip tion');
      });
      
      it('should parse @property with type and description both', function() {
        TAG.property(doc, 'property', '{bool} name desc rip tion');
        expect(doc.property[0].name).toEqual('name');
        expect(doc.property[0].type).toEqual('bool');
        expect(doc.property[0].description).toEqual('desc rip tion');
      });
      
      /**
       * If property description is undefined, this variable is not set in the template,
       * so the whole @description tag is used instead
       */
      it('should set undefined description to "false"', function() {
        TAG.property(doc, 'property', 'name');
        expect(doc.property[0].description).toBe(false);
      });
    });
    
    describe('@methodOf', function() {
      it('should parse @methodOf tag', function() {
        expect(function() {
          TAG.methodOf(doc, 'methodOf', 'parentName');
        }).not.toThrow();
        expect(doc.methodOf).toEqual('parentName');
      });
    });
    
    describe('@describe', function(){
      it('should support pre blocks', function(){
        TAG.description(doc, 'description', '<pre class="brush: xml;" ng:non-bindable>abc</pre>');
        expect(doc.description).toEqual('<pre class="brush: xml;" ng:non-bindable>abc</pre>');
      });
      
      describe('@example', function(){
        it('should not remove {{}}', function(){
          TAG.example(doc, 'example', 'text {{ abc }}');
          expect(doc.example).toEqual('text {{ abc }}');
        });
        
      });
    });

  });
  
  describe('trim', function(){
    var trim = collect.trim;
    it('should remove leading/trailing space', function(){
      expect(trim('  \nabc\n  ')).toEqual('abc');
    });
    
    it('should remove leading space on every line', function(){
      expect(trim('\n 1\n  2\n   3\n')).toEqual('1\n 2\n  3');
    });
  });
  
});

function load(path){
  var sandbox = {
      require: require,
      console: console,
      __dirname: __dirname,
      testmode: true
  };
  Script.runInNewContext(fs.readFileSync(path), sandbox, path);
  return sandbox;
}
