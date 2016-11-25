'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('canonical-path');

/**
 * @dgProcessor generateKeywordsProcessor
 * @description
 * This processor extracts all the keywords from each document and creates
 * a new document that will be rendered as a JavaScript file containing all
 * this data.
 */
module.exports = function generateKeywordsProcessor(log, readFilesProcessor) {
  return {
    ignoreWordsFile: undefined,
    areasToSearch: ['api', 'guide', 'misc', 'error', 'tutorial'],
    propertiesToIgnore: [],
    docTypesToIgnore: [],
    $validate: {
      ignoreWordsFile: { },
      areasToSearch: { presence: true },
      docTypesToIgnore: { },
      propertiesToIgnore: {  }
    },
    $runAfter: ['memberDocsProcessor'],
    $runBefore: ['rendering-docs'],
    $process: function(docs) {

      // Keywords to ignore
      var wordsToIgnore = [];
      var propertiesToIgnore;
      var docTypesToIgnore;
      var areasToSearch;

      // Keywords start with "ng:" or one of $, _ or a letter
      var KEYWORD_REGEX = /^((ng:|[$_a-z])[\w\-_]+)/;

      // Load up the keywords to ignore, if specified in the config
      if (this.ignoreWordsFile) {

        var ignoreWordsPath = path.resolve(readFilesProcessor.basePath, this.ignoreWordsFile);
        wordsToIgnore = fs.readFileSync(ignoreWordsPath, 'utf8').toString().split(/[,\s\n\r]+/gm);

        log.debug('Loaded ignore words from "' + ignoreWordsPath + '"');
        log.silly(wordsToIgnore);

      }

      areasToSearch = _.indexBy(this.areasToSearch);
      propertiesToIgnore = _.indexBy(this.propertiesToIgnore);
      log.debug('Properties to ignore', propertiesToIgnore);
      docTypesToIgnore = _.indexBy(this.docTypesToIgnore);
      log.debug('Doc types to ignore', docTypesToIgnore);

      var ignoreWordsMap = _.indexBy(wordsToIgnore);

      // If the title contains a name starting with ng, e.g. "ngController", then add the module name
      // without the ng to the title text, e.g. "controller".
      function extractTitleWords(title) {
        var match = /ng([A-Z]\w*)/.exec(title);
        if (match) {
          title = title + ' ' + match[1].toLowerCase();
        }
        return title;
      }

    function extractWords(text, words, keywordMap) {

      var tokens = text.toLowerCase().split(/[.\s,`'"#]+/mg);
      _.forEach(tokens, function(token) {
        var match = token.match(KEYWORD_REGEX);
        if (match) {
          var key = match[1];
          if (!keywordMap[key]) {
            keywordMap[key] = true;
            words.push(key);
          }
          }
        });
      }


      // We are only interested in docs that live in the right area
      docs = _.filter(docs, function(doc) { return areasToSearch[doc.area]; });
      docs = _.filter(docs, function(doc) { return !docTypesToIgnore[doc.docType]; });

      _.forEach(docs, function(doc) {


        var words = [];
        var keywordMap = _.clone(ignoreWordsMap);
        var members = [];
        var membersMap = {};

        // Search each top level property of the document for search terms
        _.forEach(doc, function(value, key) {

          if (_.isString(value) && !propertiesToIgnore[key]) {
            extractWords(value, words, keywordMap);
          }

          if (key === 'methods' || key === 'properties' || key === 'events') {
            _.forEach(value, function(member) {
              extractWords(member.name, members, membersMap);
            });
          }
        });


        doc.searchTerms = {
          titleWords: extractTitleWords(doc.name),
          keywords: _.sortBy(words).join(' '),
          members: _.sortBy(members).join(' ')
        };

      });

    }
  };
};
