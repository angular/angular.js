var ngdoc = require('../src/ngdoc.js');
var gruntUtil = require('../../lib/grunt/utils.js');

describe('Docs Links', function() {

  describe('links', function() {
    var doc;

    beforeEach(function() {
      doc = new ngdoc.Doc("@ngdoc function\n@name ng.filter:a\n@function");
      doc.section = 'api';
      doc.file = 'test.js';
      doc.line = 42;
      doc.parse();
    });

    it('should have an "improve this doc" button', function() {
      expect(doc.html()).
        toContain('<a href="http://github.com/angular/angular.js/edit/master/test.js" class="improve-docs btn btn-primary"><i class="icon-edit"> </i> Improve this doc</a>');
    });

    it('should have an "view source" button', function() {
      spyOn(gruntUtil, 'getVersion').andReturn({cdn: '1.2.299'});

      expect(doc.html()).
        toContain('<a href="http://github.com/angular/angular.js/tree/v1.2.299/test.js#L42" class="view-source btn btn-action"><i class="icon-zoom-in"> </i> View source</a>');
    });
  });

});
