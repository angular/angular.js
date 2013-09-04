'use strict';

ddescribe('replace filter', function() {

  var filter;

  beforeEach(inject(function($filter){
    filter = $filter;
  }));

  it('should return input when no replacements passed', function() {
      expect(filter('replace')('test')).toEqual('test');
  });

  it('should replace from with to', function() {
    expect(filter('replace')('hello %user%', {'%user%': 'someName'})).toEqual('hello someName');
  });

  it('should accept multiple replacements', function() {
    expect(filter('replace')('%hello% %user%', {'%hello%': 'hello', '%user%': 'someName'})).toEqual('hello someName');
  });

});
