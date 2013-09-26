describe("docsSearch", function() {

  beforeEach(module('docsApp'));

  var interceptedLunrResults;
  beforeEach(function() {
    interceptedLunrResults = [];
  });

  beforeEach(function() {
    module(function($provide) {
      var results = [];
      results[0] = { section: 'tutorial', shortName: 'item one', keywords: 'item, one, 1' };
      results[1] = { section: 'tutorial', shortName: 'item man', keywords: 'item, man' };
      results[2] = { section: 'api', shortName: 'item other', keywords: 'item, other' };
      results[3] = { section: 'cookbook', shortName: 'item cookbook', keywords: 'item, other' };
      results[4] = { section: 'api', shortName: 'ngRepeat', keywords: 'item, other' };

      $provide.value('NG_PAGES', results);
      $provide.factory('lunrSearch', function() {
        return function() {
          return {
            store : function(value) {
              interceptedLunrResults.push(value);
            },
            search : function(q) {
              var data = [];
              angular.forEach(results, function(res, i) {
                data.push({ ref : i });
              });
              return data;
            }
          } 
        };
      });
    });
  });

  it("should lookup and organize values properly", inject(function(docsSearch) {
    var items = docsSearch('item');
    expect(items['api'].length).toBe(2);
  }));

  it("should place cookbook items in the tutorial", inject(function(docsSearch) {
    var items = docsSearch('item');
    expect(items['tutorial'].length).toBe(3);
  }));

  it("should return all results without a search", inject(function(docsSearch) {
    var items = docsSearch();
    expect(items['tutorial'].length).toBe(3);
    expect(items['api'].length).toBe(2);
  }));

  it("should store values with and without a ng prefix", inject(function(docsSearch) {
    expect(interceptedLunrResults[4].title).toBe('ngRepeat repeat');
  }));

});
