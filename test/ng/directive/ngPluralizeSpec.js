'use strict';

describe('ngPluralize', function() {
  var element,
    elementAlt;


  afterEach(function() {
    dealoc(element);
    dealoc(elementAlt);
  });


  describe('deal with pluralized strings without offset', function() {
    beforeEach(inject(function($rootScope, $compile) {
      element = $compile(
          '<ng:pluralize count="email"' +
                         "when=\"{'-1': 'You have negative email. Whohoo!'," +
                                 "'0': 'You have no new email'," +
                                 "'one': 'You have one new email'," +
                                 "'other': 'You have {} new emails'}\">" +
          '</ng:pluralize>')($rootScope);
      elementAlt = $compile(
          '<ng:pluralize count="email" ' +
                         "when-minus-1='You have negative email. Whohoo!' " +
                         "when-0='You have no new email' " +
                         "when-one='You have one new email' " +
                         "when-other='You have {} new emails'>" +
          '</ng:pluralize>')($rootScope);
    }));


    it('should show single/plural strings', inject(function($rootScope) {
      $rootScope.email = 0;
      $rootScope.$digest();
      expect(element.text()).toBe('You have no new email');
      expect(elementAlt.text()).toBe('You have no new email');

      $rootScope.email = '0';
      $rootScope.$digest();
      expect(element.text()).toBe('You have no new email');
      expect(elementAlt.text()).toBe('You have no new email');

      $rootScope.email = 1;
      $rootScope.$digest();
      expect(element.text()).toBe('You have one new email');
      expect(elementAlt.text()).toBe('You have one new email');

      $rootScope.email = 0.01;
      $rootScope.$digest();
      expect(element.text()).toBe('You have 0.01 new emails');
      expect(elementAlt.text()).toBe('You have 0.01 new emails');

      $rootScope.email = '0.1';
      $rootScope.$digest();
      expect(element.text()).toBe('You have 0.1 new emails');
      expect(elementAlt.text()).toBe('You have 0.1 new emails');

      $rootScope.email = 2;
      $rootScope.$digest();
      expect(element.text()).toBe('You have 2 new emails');
      expect(elementAlt.text()).toBe('You have 2 new emails');

      $rootScope.email = -0.1;
      $rootScope.$digest();
      expect(element.text()).toBe('You have -0.1 new emails');
      expect(elementAlt.text()).toBe('You have -0.1 new emails');

      $rootScope.email = '-0.01';
      $rootScope.$digest();
      expect(element.text()).toBe('You have -0.01 new emails');
      expect(elementAlt.text()).toBe('You have -0.01 new emails');

      $rootScope.email = -2;
      $rootScope.$digest();
      expect(element.text()).toBe('You have -2 new emails');
      expect(elementAlt.text()).toBe('You have -2 new emails');

      $rootScope.email = -1;
      $rootScope.$digest();
      expect(element.text()).toBe('You have negative email. Whohoo!');
      expect(elementAlt.text()).toBe('You have negative email. Whohoo!');
    }));


    it('should show single/plural strings with mal-formed inputs', inject(
      function($log, $rootScope) {
        $rootScope.email = '';
        $rootScope.$digest();
        expect(element.text()).toBe('');
        expect(elementAlt.text()).toBe('');
        expect($log.debug.logs.shift()).toEqual([
          "ngPluralize: no rule defined for 'NaN' in {" +
          "'-1': 'You have negative email. Whohoo!'," +
          "'0': 'You have no new email'," +
          "'one': 'You have one new email'," +
          "'other': 'You have {} new emails'}"
        ]);
        expect($log.debug.logs.shift()).toEqual([
          "ngPluralize: no rule defined for 'NaN' in undefined"
        ]);

        $rootScope.email = null;
        $rootScope.$digest();
        expect(element.text()).toBe('');
        expect(elementAlt.text()).toBe('');

        $rootScope.email = undefined;
        $rootScope.$digest();
        expect(element.text()).toBe('');
        expect(elementAlt.text()).toBe('');

        $rootScope.email = 'a3';
        $rootScope.$digest();
        expect(element.text()).toBe('');
        expect(elementAlt.text()).toBe('');

        $rootScope.email = '011';
        $rootScope.$digest();
        expect(element.text()).toBe('You have 11 new emails');
        expect(elementAlt.text()).toBe('You have 11 new emails');

        $rootScope.email = '-011';
        $rootScope.$digest();
        expect(element.text()).toBe('You have -11 new emails');
        expect(elementAlt.text()).toBe('You have -11 new emails');

        $rootScope.email = '1fff';
        $rootScope.$digest();
        expect(element.text()).toBe('You have one new email');
        expect(elementAlt.text()).toBe('You have one new email');

        $rootScope.email = '0aa22';
        $rootScope.$digest();
        expect(element.text()).toBe('You have no new email');
        expect(elementAlt.text()).toBe('You have no new email');

        $rootScope.email = '000001';
        $rootScope.$digest();
        expect(element.text()).toBe('You have one new email');
        expect(elementAlt.text()).toBe('You have one new email');
      }
    ));
  });


  describe('edge cases', function() {
    it('should be able to handle empty strings as possible values', inject(function($rootScope, $compile) {
      element = $compile(
          '<ng:pluralize count="email"' +
                         "when=\"{'0': ''," +
                                 "'one': 'Some text'," +
                                 "'other': 'Some text'}\">" +
          '</ng:pluralize>')($rootScope);
      $rootScope.email = '0';
      $rootScope.$digest();
      expect(element.text()).toBe('');
    }));

    it('should be able to specify a message for null/undefined values', inject(
      function($compile, $rootScope) {
        element = $compile(
            '<ng:pluralize count="email"' +
                          "when=\"{'NaN': 'Unspecified email count'," +
                                  "'0': ''," +
                                  "'one': 'Some text'," +
                                  "'other': 'Some text'}\">" +
            '</ng:pluralize>')($rootScope);

      $rootScope.email = '0';
      $rootScope.$digest();
      expect(element.text()).toBe('');

      $rootScope.email = undefined;
      $rootScope.$digest();
      expect(element.text()).toBe('Unspecified email count');

      $rootScope.email = '1';
      $rootScope.$digest();
      expect(element.text()).toBe('Some text');

      $rootScope.email = null;
      $rootScope.$digest();
      expect(element.text()).toBe('Unspecified email count');
    }));
  });

  describe('undefined rule cases', function() {
    var $locale, $log;
    beforeEach(inject(function(_$locale_, _$log_) {
      $locale = _$locale_;
      $log = _$log_;
    }));
    afterEach(inject(function($log) {
      $log.reset();
    }));

    it('should generate a warning when being asked to use a rule that is not defined',
      inject(function($rootScope, $compile) {
      element = $compile(
          '<ng:pluralize count="email"' +
                         "when=\"{'0': 'Zero'," +
                                 "'one': 'Some text'," +
                                 "'other': 'Some text'}\">" +
          '</ng:pluralize>')($rootScope);
      $locale.pluralCat = function() {return "few";};

      $rootScope.email = '3';
      expect($log.debug.logs).toEqual([]);
      $rootScope.$digest();
      expect(element.text()).toBe('');
      expect($log.debug.logs.shift())
        .toEqual(["ngPluralize: no rule defined for 'few' in {'0': 'Zero','one': 'Some text','other': 'Some text'}"]);
    }));

    it('should empty the element content when using a rule that is not defined',
      inject(function($rootScope, $compile) {
      element = $compile(
          '<ng:pluralize count="email"' +
                         "when=\"{'0': 'Zero'," +
                                 "'one': 'Some text'," +
                                 "'other': 'Some text'}\">" +
          '</ng:pluralize>')($rootScope);
      $locale.pluralCat = function(count) {return count === 1 ? "one" : "few";};

      $rootScope.email = '0';
      $rootScope.$digest();
      expect(element.text()).toBe('Zero');

      $rootScope.email = '3';
      $rootScope.$digest();
      expect(element.text()).toBe('');

      $rootScope.email = '1';
      $rootScope.$digest();
      expect(element.text()).toBe('Some text');

      $rootScope.email = null;
      $rootScope.$digest();
      expect(element.text()).toBe('');
    }));
  });

  describe('deal with pluralized strings with offset', function() {
    it('should show single/plural strings with offset', inject(function($rootScope, $compile) {
      element = $compile(
        "<ng:pluralize count='viewCount'  offset='2' " +
            "when=\"{'0': 'Nobody is viewing.'," +
                    "'1': '{{p1}} is viewing.'," +
                    "'2': '{{p1}} and {{p2}} are viewing.'," +
                    "'one': '{{p1}}, {{p2}} and one other person are viewing.'," +
                    "'other': '{{p1}}, {{p2}} and {} other people are viewing.'}\">" +
        "</ng:pluralize>")($rootScope);
      elementAlt = $compile(
        "<ng:pluralize count='viewCount'  offset='2' " +
            "when-0='Nobody is viewing.'" +
            "when-1='{{p1}} is viewing.'" +
            "when-2='{{p1}} and {{p2}} are viewing.'" +
            "when-one='{{p1}}, {{p2}} and one other person are viewing.'" +
            "when-other='{{p1}}, {{p2}} and {} other people are viewing.'>" +
        "</ng:pluralize>")($rootScope);
      $rootScope.p1 = 'Igor';
      $rootScope.p2 = 'Misko';

      $rootScope.viewCount = 0;
      $rootScope.$digest();
      expect(element.text()).toBe('Nobody is viewing.');
      expect(elementAlt.text()).toBe('Nobody is viewing.');

      $rootScope.viewCount = 1;
      $rootScope.$digest();
      expect(element.text()).toBe('Igor is viewing.');
      expect(elementAlt.text()).toBe('Igor is viewing.');

      $rootScope.viewCount = 2;
      $rootScope.$digest();
      expect(element.text()).toBe('Igor and Misko are viewing.');
      expect(elementAlt.text()).toBe('Igor and Misko are viewing.');

      $rootScope.viewCount = 3;
      $rootScope.$digest();
      expect(element.text()).toBe('Igor, Misko and one other person are viewing.');
      expect(elementAlt.text()).toBe('Igor, Misko and one other person are viewing.');

      $rootScope.viewCount = 4;
      $rootScope.$digest();
      expect(element.text()).toBe('Igor, Misko and 2 other people are viewing.');
      expect(elementAlt.text()).toBe('Igor, Misko and 2 other people are viewing.');

      $rootScope.viewCount = null;
      $rootScope.$digest();
      expect(element.text()).toBe('');
      expect(elementAlt.text()).toBe('');
    }));
  });


  describe('interpolation', function() {

    it('should support custom interpolation symbols', function() {
      module(function($interpolateProvider) {
        $interpolateProvider.startSymbol('[[').endSymbol('%%');
      });

      inject(function($compile, $rootScope) {
        element = $compile(
            "<ng:pluralize count=\"viewCount\" offset=\"1\"" +
              "when=\"{'0': 'Nobody is viewing.'," +
                      "'1': '[[p1%% is viewing.'," +
                      "'one': '[[p1%% and one other person are viewing.'," +
                      "'other': '[[p1%% and {} other people are viewing.'}\">" +
            "</ng:pluralize>")($rootScope);
        elementAlt = $compile(
            "<ng:pluralize count='viewCount' offset='1'" +
              "when-0='Nobody is viewing.'" +
              "when-1='[[p1%% is viewing.'" +
              "when-one='[[p1%% and one other person are viewing.'" +
              "when-other='[[p1%% and {} other people are viewing.'>" +
            "</ng:pluralize>")($rootScope);
        $rootScope.p1 = 'Igor';

        $rootScope.viewCount = 0;
        $rootScope.$digest();
        expect(element.text()).toBe('Nobody is viewing.');
        expect(elementAlt.text()).toBe('Nobody is viewing.');

        $rootScope.viewCount = 1;
        $rootScope.$digest();
        expect(element.text()).toBe('Igor is viewing.');
        expect(elementAlt.text()).toBe('Igor is viewing.');

        $rootScope.viewCount = 2;
        $rootScope.$digest();
        expect(element.text()).toBe('Igor and one other person are viewing.');
        expect(elementAlt.text()).toBe('Igor and one other person are viewing.');

        $rootScope.viewCount = 3;
        $rootScope.$digest();
        expect(element.text()).toBe('Igor and 2 other people are viewing.');
        expect(elementAlt.text()).toBe('Igor and 2 other people are viewing.');
      });
    });
  });


  describe('bind-once', function() {
    it('should support for `count` to be a one-time expression',
      inject(function($compile, $rootScope) {
        element = $compile(
            '<ng:pluralize count="::email"' +
                           "when=\"{'one': 'You have one new email'," +
                                   "'other': 'You have {} new emails'}\">" +
            '</ng:pluralize>')($rootScope);
        elementAlt = $compile(
            '<ng:pluralize count="::email" ' +
                           "when-one='You have one new email' " +
                           "when-other='You have {} new emails'>" +
            '</ng:pluralize>')($rootScope);

        $rootScope.email = undefined;
        $rootScope.$digest();
        expect(element.text()).toBe('');
        expect(elementAlt.text()).toBe('');

        $rootScope.email = 3;
        $rootScope.$digest();
        expect(element.text()).toBe('You have 3 new emails');
        expect(elementAlt.text()).toBe('You have 3 new emails');

        $rootScope.email = null;
        $rootScope.$digest();
        expect(element.text()).toBe('You have 3 new emails');
        expect(elementAlt.text()).toBe('You have 3 new emails');

        $rootScope.email = 2;
        $rootScope.$digest();
        expect(element.text()).toBe('You have 3 new emails');
        expect(elementAlt.text()).toBe('You have 3 new emails');

        $rootScope.email = 1;
        $rootScope.$digest();
        expect(element.text()).toBe('You have 3 new emails');
        expect(elementAlt.text()).toBe('You have 3 new emails');
      })
    );


    it('should still update other embedded expressions',
      inject(function($compile, $rootScope) {
        element = $compile(
            '<ng:pluralize count="::email"' +
                           "when=\"{'one': 'You, {{user}}, have one new email'," +
                                   "'other': 'You, {{user}}, have {} new emails'}\">" +
            '</ng:pluralize>')($rootScope);
        elementAlt = $compile(
            '<ng:pluralize count="::email" ' +
                           "when-one='You, {{user}}, have one new email' " +
                           "when-other='You, {{user}}, have {} new emails'>" +
            '</ng:pluralize>')($rootScope);

        $rootScope.user = 'Lucas';
        $rootScope.email = undefined;
        $rootScope.$digest();
        expect(element.text()).toBe('');
        expect(elementAlt.text()).toBe('');

        $rootScope.email = 3;
        $rootScope.$digest();
        expect(element.text()).toBe('You, Lucas, have 3 new emails');
        expect(elementAlt.text()).toBe('You, Lucas, have 3 new emails');

        $rootScope.user = 'Pete';
        $rootScope.email = 2;
        $rootScope.$digest();
        expect(element.text()).toBe('You, Pete, have 3 new emails');
        expect(elementAlt.text()).toBe('You, Pete, have 3 new emails');
      })
    );
  });
});
