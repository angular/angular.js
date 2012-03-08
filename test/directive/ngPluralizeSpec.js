'use strict';

describe('ng:pluralize', function() {
  var element;


  afterEach(function(){
    dealoc(element);
  });


  describe('deal with pluralized strings without offset', function() {
     beforeEach(inject(function($rootScope, $compile) {
        element = $compile(
          '<ng:pluralize count="email"' +
                         "when=\"{'0': 'You have no new email'," +
                                 "'one': 'You have one new email'," +
                                 "'other': 'You have {} new emails'}\">" +
          '</ng:pluralize>')($rootScope);
      }));


      it('should show single/plural strings', inject(function($rootScope) {
        $rootScope.email = 0;
        $rootScope.$digest();
        expect(element.text()).toBe('You have no new email');

        $rootScope.email = '0';
        $rootScope.$digest();
        expect(element.text()).toBe('You have no new email');

        $rootScope.email = 1;
        $rootScope.$digest();
        expect(element.text()).toBe('You have one new email');

        $rootScope.email = 0.01;
        $rootScope.$digest();
        expect(element.text()).toBe('You have 0.01 new emails');

        $rootScope.email = '0.1';
        $rootScope.$digest();
        expect(element.text()).toBe('You have 0.1 new emails');

        $rootScope.email = 2;
        $rootScope.$digest();
        expect(element.text()).toBe('You have 2 new emails');

        $rootScope.email = -0.1;
        $rootScope.$digest();
        expect(element.text()).toBe('You have -0.1 new emails');

        $rootScope.email = '-0.01';
        $rootScope.$digest();
        expect(element.text()).toBe('You have -0.01 new emails');

        $rootScope.email = -2;
        $rootScope.$digest();
        expect(element.text()).toBe('You have -2 new emails');
      }));


      it('should show single/plural strings with mal-formed inputs', inject(function($rootScope) {
        $rootScope.email = '';
        $rootScope.$digest();
        expect(element.text()).toBe('');

        $rootScope.email = null;
        $rootScope.$digest();
        expect(element.text()).toBe('');

        $rootScope.email = undefined;
        $rootScope.$digest();
        expect(element.text()).toBe('');

        $rootScope.email = 'a3';
        $rootScope.$digest();
        expect(element.text()).toBe('');

        $rootScope.email = '011';
        $rootScope.$digest();
        expect(element.text()).toBe('You have 11 new emails');

        $rootScope.email = '-011';
        $rootScope.$digest();
        expect(element.text()).toBe('You have -11 new emails');

        $rootScope.email = '1fff';
        $rootScope.$digest();
        expect(element.text()).toBe('You have one new email');

        $rootScope.email = '0aa22';
        $rootScope.$digest();
        expect(element.text()).toBe('You have no new email');

        $rootScope.email = '000001';
        $rootScope.$digest();
        expect(element.text()).toBe('You have one new email');
      }));
  });


  describe('deal with pluralized strings with offset', function() {
    it('should show single/plural strings with offset', inject(function($rootScope, $compile) {
      element = $compile(
        "<ng:pluralize count=\"viewCount\"  offset=2 " +
            "when=\"{'0': 'Nobody is viewing.'," +
                    "'1': '{{p1}} is viewing.'," +
                    "'2': '{{p1}} and {{p2}} are viewing.'," +
                    "'one': '{{p1}}, {{p2}} and one other person are viewing.'," +
                    "'other': '{{p1}}, {{p2}} and {} other people are viewing.'}\">" +
        "</ng:pluralize>")($rootScope);
      $rootScope.p1 = 'Igor';
      $rootScope.p2 = 'Misko';

      $rootScope.viewCount = 0;
      $rootScope.$digest();
      expect(element.text()).toBe('Nobody is viewing.');

      $rootScope.viewCount = 1;
      $rootScope.$digest();
      expect(element.text()).toBe('Igor is viewing.');

      $rootScope.viewCount = 2;
      $rootScope.$digest();
      expect(element.text()).toBe('Igor and Misko are viewing.');

      $rootScope.viewCount = 3;
      $rootScope.$digest();
      expect(element.text()).toBe('Igor, Misko and one other person are viewing.');

      $rootScope.viewCount = 4;
      $rootScope.$digest();
      expect(element.text()).toBe('Igor, Misko and 2 other people are viewing.');
    }));
  });
});
