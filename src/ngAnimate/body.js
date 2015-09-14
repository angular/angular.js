'use strict';

function $$BodyProvider() {
  this.$get = ['$document', function($document) {
    return jqLite($document[0].body);
  }];
}
