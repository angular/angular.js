'use strict';

var exclusionRegex = /^index|examples\/|ptore2e\//;

module.exports = function createSitemap() {
  return {
    $runAfter: ['paths-computed'],
    $runBefore: ['rendering-docs'],
    $process: function(docs) {
      docs.push({
        id: 'sitemap.xml',
        path: 'sitemap.xml',
        outputPath: '../sitemap.xml',
        template: 'sitemap.template.xml',
        urls: docs.filter(function(doc) {
          return doc.path &&
            doc.outputPath &&
            !exclusionRegex.test(doc.outputPath);
        }).map(function(doc) {
          return doc.path;
        })
      });
    }
  };
};
