var extractor = require('../extractor.js'),
    $ = require('jquery'),
    phraseTags = ('strong,em,dfn,code,pre,samp,kbd,var,cite,address,q,blockquote,acronym,' +
                                                                         'abbr').split(',');

describe('extract method', function() {
  var element,
      rdbObj;


  beforeEach(function() {
    rdbObj = {};
    element = {};
  });


  it('should extract simple msgId and msgDesc without binding', function() {
    var desiredObj = { '#myId': 'Hello',
                       '@myId': {
                         'description': 'msgDescription'
                       } };
    var elements = [$('<div msgId="myId" msgDesc="msgDescription">Hello</div>')];
    expect(extractor.extract(elements)).toEqual(desiredObj);
  });


  describe('checkValid', function() {
    beforeEach(function() {
      spyOn(console, 'error');
    });


    it('should not log error on correct construct', function() {
      element = $('<div msgId="myId">abc</div>');
      extractor.checkValid(element);
      expect(console.error).not.toHaveBeenCalled();

      phraseTags.forEach(function(tag) {
        element = $('<div msgId="myId">abc <' + tag + '>abc</' + tag + '></div>');
        extractor.checkValid(element);
        expect(console.error).not.toHaveBeenCalled();
      });

      element = $('<div msgId="myId"><!-- comment -->abc</div>');
      extractor.checkValid(element);
      expect(console.error).not.toHaveBeenCalled();

    });

    it('should log error on invalid construct', function() {
      element = $('<div msgId="myId"><span>abc</span></div>');
      extractor.checkValid(element);
      expect(console.error).toHaveBeenCalled();
    });
  });


  describe('extractContent', function() {
    it('should extract simple msgId and value pair', function() {
      element = $('<div msgId="myId">Hello</div>');

      extractor.extractContent(rdbObj, element);
      expect(rdbObj).toEqual({'#myId': 'Hello'});

      rdbObj = {};
      element = $('<span msgId="myId">Hello</span>');

      extractor.extractContent(rdbObj, element);
      expect(rdbObj).toEqual({'#myId': 'Hello'});
    })

    it('should remove preceding and trailing line breaks and spaces', function() {
      element = $('<div msgId="myId">\n    Hello\n   </div>');

      extractor.extractContent(rdbObj, element);
      expect(rdbObj).toEqual({'#myId': 'Hello'});
    })

    it('should extract msgId and value pair with phrase tags', function() {
      phraseTags.forEach(function(tag) {
        rdbObj = {};
        element = $('<div msgId="myId">Hello <' + tag + '>man</' + tag + '></div>');
        extractor.extractContent(rdbObj, element);
        expect(rdbObj).toEqual({'#myId': 'Hello {@<' + tag + '>}man{@</' + tag + '>}'});
      });
    })

    it('should extract messages in ng:pluralize', function() {
        rdbObj = {};
        var desiredObj = {'#headCount': '{count,plural,' +
                                         '=0 {Nobody is here.}' +
                                         '=one {One person is here.}' +
                                         '=other {{} people are here.}}'};

        element = $('<ng:pluralize msgId="headCount" msgDesc="description of headcount"' +
                        'count="count" when="{\'0\': \'Nobody is here.\',' +
                                             '\'one\': \'One person is here.\',' +
                                             '\'other\': \'{} people are here.\'}">' +
                    '</ng:pluralize>');

        extractor.extractContent(rdbObj, element);
        expect(rdbObj).toEqual(desiredObj);
    })

    it('should extract messages in ng:pluralize with offsets', function() {
        rdbObj = {};
        var desiredObj = {'#headCount': '{count,plural,offset:2' +
                                         '=0 {Nobody is here.}' +
                                         '=1 {{{p1}} is here.}' +
                                         '=2 {{{p1}} and {{p2}} are here.}' +
                                         '=one {{{p1}}, {{p2}} and one other person are here.}' +
                                         '=other {{{p1}}, {{p2}} and {} other people are here.}}'};

        element = $('<ng:pluralize msgId="headCount" msgDesc="description of headcount" offset=2 ' +
                        'count="count" ' +
                        'when="{\'0\': \'Nobody is here.\',' +
                               '\'1\': \'{{p1}} is here.\',' +
                               '\'2\': \'{{p1}} and {{p2}} are here.\',' +
                               '\'one\': \'{{p1}}, {{p2}} and one other person are here.\',' +
                               '\'other\': \'{{p1}}, {{p2}} and {} other people are here.\'}">' +
                    '</ng:pluralize>');

        extractor.extractContent(rdbObj, element);
        expect(rdbObj).toEqual(desiredObj);
    })

    it('should show error when ng:pluralize with offset lack explicit rules', function() {
        rdbObj = {};
        spyOn(console, 'error');

        element = $('<ng:pluralize msgId="headCount" msgDesc="description of headcount" offset=2 ' +
                        'count="count" ' +
                        'when="{\'0\': \'Nobody is here.\',' +
                               '\'1\': \'{{p1}} is here.\',' +
                               '\'2\': \'{{p1}} and {{p2}} are here.\',' +
                               '\'one\': \'{{p1}}, {{p2}} and one other person are here.\',' +
                               '\'other\': \'{{p1}}, {{p2}} and {} other people are here.\'}">' +
                    '</ng:pluralize>');

        extractor.extractContent(rdbObj, element);
        expect(console.error).not.toHaveBeenCalled();

        rdbObj = {};
        element = $('<ng:pluralize msgId="headCount" msgDesc="description of headcount" offset=2 ' +
                        'count="count" ' +
                        'when="{\'0\': \'Nobody is here.\',' +
                               '\'1\': \'{{p1}} is here.\',' +
                               '\'one\': \'{{p1}}, {{p2}} and one other person are here.\',' +
                               '\'other\': \'{{p1}}, {{p2}} and {} other people are here.\'}">' +
                    '</ng:pluralize>');

        extractor.extractContent(rdbObj, element);
        expect(console.error).toHaveBeenCalledWith('ng:pluralize #headCount ' +
                                                   'is missing explicit number rule for number 2');
    })

    it('should extract msgId and value with placeholders/bindings', function() {
      element = $('<div msgId="myId">Hello {{name}}</div>');
      extractor.extractContent(rdbObj, element);
      expect(rdbObj).toEqual({'#myId': 'Hello {name}'});

      rdbObj = {};
      element = $('<div msgId="myId">Hello {{name}}{{name}}</div>');
      extractor.extractContent(rdbObj, element);
      expect(rdbObj).toEqual({'#myId': 'Hello {name}{name}'});

      rdbObj = {};
      element = $('<div msgId="myId">Hello <strong>{{name}}</strong></div>');
      extractor.extractContent(rdbObj, element);
      expect(rdbObj).toEqual({'#myId': 'Hello {@<strong>}{name}{@</strong>}'});
    })
  });


  describe('extractAttribute', function() {
    it('should extract additional attributes', function() {
      element= $('<span msgId="myId" msgDesc="greeting message">Hello</span>');
      extractor.extractAttribute(rdbObj, element);
      expect(rdbObj).toEqual({'@myId': {description: 'greeting message'}});
    });
  });
});
