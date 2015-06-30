'use strict';

describe('$$body', function() {
  it("should inject $document", inject(function($$body, $document) {
    expect($$body).toEqual(jqLite($document[0].body));
  }));
});
