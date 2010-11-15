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
    
    describe('@describe', function(){
      it('should support pre blocks', function(){
        TAG.description(doc, 'description', '<pre>abc</pre>');
        expect(doc.description).toEqual('<div ng:non-bindable><pre class="brush: js; html-script: true; toolbar: false;">abc</pre></div>');
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
  
  describe('keywords', function(){
    var keywords = collect.keywords;
    it('should collect keywords', function(){
      expect(keywords('\nHello: World! @ignore.')).toEqual('hello world');
      expect(keywords('The `ng:class-odd` and ')).toEqual('and ng:class-odd the');
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
