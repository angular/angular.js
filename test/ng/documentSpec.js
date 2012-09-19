'use strict';

describe('$document', function() {


  it("should inject $document", inject(function($document) {
    expect($document).toEqual(jqLite(document));
  }));
});
