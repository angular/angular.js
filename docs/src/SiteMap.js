exports.SiteMap = SiteMap;

function SiteMap(docs){
  this.render = function(){
    var map = [];
    map.push('<?xml version="1.0" encoding="UTF-8"?>');
    map.push('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    docs.forEach(function(doc){
      map.push(' <url><loc>http://docs.angularjs.org/#!' +
          encode(doc.name) + '</loc></url>');
    });
    map.push('</sitemapindex>');
    map.push('');
    return map.join('\n');
  };

  function encode(text){
    return text
      .replace(/&/mg, '&amp;')
      .replace(/</mg, '&lt;')
      .replace(/>/mg, '&gt;')
      .replace(/'/mg, '&apos;')
      .replace(/"/mg, '&quot;');
  }
}
