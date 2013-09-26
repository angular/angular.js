'use strict';

describe('ngCsp', function() {

  it('it should turn on CSP mode in $sniffer', inject(function($sniffer, $compile) {
    expect($sniffer.csp).toBe(false);
    $compile('<div ng-csp></div>');
    expect($sniffer.csp).toBe(true);
  }));
});
