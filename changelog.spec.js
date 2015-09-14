/* global describe: false, beforeEach: false, afterEach: false, it: false, expect: false */

'use strict';

describe('changelog.js', function() {
  var ch = require('./changelog');

  describe('parseRawCommit', function() {
    it('should parse raw commit', function() {
      var msg = ch.parseRawCommit(
          '9b1aff905b638aa274a5fc8f88662df446d374bd\n' +
          'feat(scope): broadcast $destroy event on scope destruction\n' +
          'perf testing shows that in chrome this change adds 5-15% overhead\n' +
          'when destroying 10k nested scopes where each scope has a $destroy listener\n');

      expect(msg.type).toBe('feat');
      expect(msg.hash).toBe('9b1aff905b638aa274a5fc8f88662df446d374bd');
      expect(msg.subject).toBe('broadcast $destroy event on scope destruction');
      expect(msg.body).toBe('perf testing shows that in chrome this change adds 5-15% overhead\n' +
          'when destroying 10k nested scopes where each scope has a $destroy listener\n');
      expect(msg.component).toBe('scope');
    });


    it('should parse closed issues', function() {
      var msg = ch.parseRawCommit(
          '13f31602f396bc269076ab4d389cfd8ca94b20ba\n' +
          'feat(ng-list): Allow custom separator\n' +
          'bla bla bla\n\n' +
          'Closes #123\nCloses #25\n');

      expect(msg.closes).toEqual([123, 25]);
    });


    it('should parse breaking changes', function() {
      var msg = ch.parseRawCommit(
          '13f31602f396bc269076ab4d389cfd8ca94b20ba\n' +
          'feat(ng-list): Allow custom separator\n' +
          'bla bla bla\n\n' +
          'BREAKING CHANGE: first breaking change\nsomething else\n' +
          'another line with more info\n');

      expect(msg.breaking).toEqual(' first breaking change\nsomething else\nanother line with more info\n');
    });
  });

  describe('printSection', function() {
    var output;
    var streamMock = {
      write: function(str) {
        output += str;
      }
    };

    beforeEach(function() {
      output = '';
    });

    it('should add a new line at the end of each breaking change list item ' +
       'when there is 1 item per component', function() {
      var title = 'test';
      var printCommitLinks = false;

      var section = {
        module1: [{subject: 'breaking change 1'}],
        module2: [{subject: 'breaking change 2'}]
      };
      var expectedOutput =
          '\n' + '## test\n\n' +
          '- **module1:** breaking change 1\n' +
          '- **module2:** breaking change 2\n' +
          '\n';

      ch.printSection(streamMock, title, section, printCommitLinks);
      expect(output).toBe(expectedOutput);
    });

    it('should add a new line at the end of each breaking change list item ' +
       'when there are multiple items per component', function() {
      var title = 'test';
      var printCommitLinks = false;

      var section = {
        module1: [
          {subject: 'breaking change 1.1'},
          {subject: 'breaking change 1.2'}
        ],
        module2: [
          {subject: 'breaking change 2.1'},
          {subject: 'breaking change 2.2'}
        ]
      };
      var expectedOutput =
          '\n' + '## test\n\n' +
          '- **module1:**\n' +
          '  - breaking change 1.1\n' +
          '  - breaking change 1.2\n' +
          '- **module2:**\n' +
          '  - breaking change 2.1\n' +
          '  - breaking change 2.2\n' +
          '\n';

      ch.printSection(streamMock, title, section, printCommitLinks);
      expect(output).toBe(expectedOutput);
    });
  });
});
