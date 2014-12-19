/* global $TimeProvider: false */
'use strict';

describe('$date', function() {
  var $window;

  beforeEach(module(function($provide) {
    $window = {};

    $provide.value('$window', $window);
  }));

  it('should return Date.new() when $date.now() is called', inject(
    function() {
      $window.Date = function() {
        return Date(1418998923940);
      };
    },
    function($date) {
      var date = $date.now();
      expect(date).toEqual(Date(1418998923940));
    }
  ));

});
