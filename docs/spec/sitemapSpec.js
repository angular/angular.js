var SiteMap = require('../src/SiteMap.js').SiteMap;
var Doc = require('../src/ngdoc.js').Doc;


describe('sitemap', function() {
  it('should render empty sitemap', function() {
    var map = new SiteMap([]);
    expect(map.render()).toEqual([
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      '</urlset>', ''].join('\n'));
  });

  it('should render ngdoc url', function() {
    var map = new SiteMap([new Doc({section: 'foo', id: 'a.b.c<>\'"&'})]);
    expect(map.render()).toContain([
      ' <url>',
      '<loc>http://docs.angularjs.org/foo/a.b.c&lt;&gt;&apos;&quot;&amp;</loc>',
      '<changefreq>weekly</changefreq>',
      '</url>'].join(''));

  });
});
