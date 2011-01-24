var SiteMap = require('sitemap.js').SiteMap;
var Doc = require('ngdoc.js').Doc;


describe('sitemap', function(){
  it('should render empty sitemap', function(){
    var map = new SiteMap([]);
    expect(map.render()).toEqual([
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      '</sitemapindex>', ''].join('\n'));
  });

  it('should render ngdoc url', function(){
    var map = new SiteMap([new Doc({name: 'a.b.c<>\'"&'})]);
    expect(map.render()).toContain([
      ' <url>',
      '<loc>http://docs.angularjs.org/#!a.b.c&lt;&gt;&apos;&quot;&amp;</loc>',
      '<changefreq>weekly</changefreq>',
      '</url>'].join(''));

  });
});
