'use strict';

var esprima = require('esprima'),
  escodegen = require('escodegen'),
  grunt = require('grunt'),
  stripper = require('./strip.js');

module.exports = {
  stripErrors: function (target, NG_VERSION, config) {
    var errorConfig = { id: 'ng' },
      extractedErrors = {},
      productionSource = grunt.file.read('lib/minerr/minerrMin.js')
        .replace(/"NG_MINERR_URL"/g, config.url),
      ast,
      resultSource,
      strip,
      strippedAST,
      subAST;

    subAST = esprima.parse(productionSource).body[0];
    strip = stripper({ logger: grunt.log, minErrAst: subAST });
    
    for (var prop in config.files) {
      if (config.files.hasOwnProperty(prop)) {
        ast = esprima.parse(grunt.file.read(config.files[prop]), {loc: true});
        strippedAST = strip(ast, extractedErrors, config.files[prop]);
        resultSource = escodegen.generate(strippedAST, {
            format: {
              indent: {
                style: '  ',
                base: 0
              }
            }
          });
        grunt.file.write(prop, resultSource);
      }
    }
    errorConfig.version = NG_VERSION.full;
    errorConfig.generated = new Date().toString();
    errorConfig.errors = extractedErrors;
    grunt.file.write(target, JSON.stringify(errorConfig));
  }
};
