"use strict";
/* jshint browser: true */
/* global importScripts, onmessage: true, postMessage, lunr */

// Load up the lunr library
importScripts('../components/lunr.js-0.4.2/lunr.min.js');

// Create the lunr index
var index = lunr(function() {
  this.ref('path');
  this.field('titleWords', {boost: 50});
  this.field('members', { boost: 40});
  this.field('keywords', { boost : 20 });
});

// Retrieve the pagesData which contains the information about each
// page to be indexed
var pagesData = {};
var pagesDataRequest = new XMLHttpRequest();
pagesDataRequest.onload = function() {

  // Store the pages data to be used in mapping query
  // results back to pages
  pagesData = JSON.parse(this.responseText);

  // Add search terms from each page to the search index
  for(var path in pagesData) {
    var page = pagesData[path];
    if(page.searchTerms) {
      index.add({
        path : path,  // the path is the unique key for the page
        titleWords : page.searchTerms.titleWords,
        keywords : page.searchTerms.keywords,
        members : page.searchTerms.members
      });
    }
  }
};
pagesDataRequest.open('GET', 'pages-data.json');
pagesDataRequest.send();

// The worker receives a message everytime the web app
// wants to query the index
onmessage = function(oEvent) {
  var q = oEvent.data.q;
  var hits = index.search(q);
  var results = [];
  hits.forEach(function(hit) {
    results.push(pagesData[hit.ref]);
  });
  // The results of the query are sent back to the web app
  // via a new message
  postMessage(results);
};