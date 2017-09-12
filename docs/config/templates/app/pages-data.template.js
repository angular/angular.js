'use strict';

// Meta data used by the AngularJS docs app
angular.module('pagesData', [])
  .value('NG_PAGES', {$ doc.pages | json $});
