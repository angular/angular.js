var _ = require('lodash');
var log = require('winston');
var fs = require('fs');
var path = require('canonical-path');

module.exports = {
  name: 'keywords',
  runAfter: ['docs-processed'],
  runBefore: ['adding-extra-docs'],
  description: 'This processor extracts all the keywords from the document',
  process: function(docs, config) {

    // Keywords to ignore
    var wordsToIgnore = [];
    var propertiesToIgnore;
    var areasToSearch;

    // Keywords start with "ng:" or one of $, _ or a letter
    var KEYWORD_REGEX = /^((ng:|[\$_a-z])[\w\-_]+)/;

    // Load up the keywords to ignore, if specified in the config
    if ( config.processing.search && config.processing.search.ignoreWordsFile ) {

      var ignoreWordsPath = path.resolve(config.basePath, config.processing.search.ignoreWordsFile);
      wordsToIgnore = fs.readFileSync(ignoreWordsPath, 'utf8').toString().split(/[,\s\n\r]+/gm);

      log.debug('Loaded ignore words from "' + ignoreWordsPath + '"');
      log.silly(wordsToIgnore);

    }

    areasToSearch = _.indexBy(config.get('processing.search.areasToSearch', ['api', 'guide', 'misc', 'error', 'tutorial']));

    propertiesToIgnore = _.indexBy(config.get('processing.search.propertiesToIgnore', []));
    log.debug('Properties to ignore', propertiesToIgnore);

    var ignoreWordsMap = _.indexBy(wordsToIgnore);

    // If the title contains a name starting with ng, e.g. "ngController", then add the module name
    // without the ng to the title text, e.g. "controller".
    function extractTitleWords(title) {
      var match = /ng([A-Z]\w*)/.exec(title);
      if ( match ) {
        title = title + ' ' + match[1].toLowerCase();
      }
      return title;
    }

    function extractWords(text, words, keywordMap) {

      var tokens = text.toLowerCase().split(/[\.\s,`'"#]+/mg);
      _.forEach(tokens, function(token){
        var match = token.match(KEYWORD_REGEX);
        if (match){
          key = match[1];
          if ( !keywordMap[key]) {
            keywordMap[key] = true;
            words.push(key);
          }
        }
      });
    }


    // We are only interested in docs that live in the right area
    docs = _.filter(docs, function(doc) { return areasToSearch[doc.area]; });

    _.forEach(docs, function(doc) {

      var words = [];
      var keywordMap = _.clone(ignoreWordsMap);

      // Search each top level property of the document for search terms
      _.forEach(doc, function(value, key) {
        if ( _.isString(value) && !propertiesToIgnore[key] ) {
          extractWords(value, words, keywordMap);
        }
      });

      doc.searchTerms = {
        titleWords: extractTitleWords(doc.name),
        keywords: _.sortBy(words).join(' ')
      };

    });

  }
};