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
          'when destroying 10k nested scopes where each scope has a $destroy listener\n')
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
});
