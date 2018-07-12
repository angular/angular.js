'use strict';

/**
 * This scenario checks the presence of the table of contents for a sample of pages - API and guide.
 * The expectations are kept vague so that they can be easily adjusted when the docs change.
 */

describe('table of contents', function() {

  it('on provider pages', function() {
    browser.get('build/docs/index.html#!/api/ng/provider/$controllerProvider');

    var toc = element.all(by.css('toc-container > div > toc-tree'));
    toc.getText().then(function(text) {
      expect(text.join('')).toContain('Overview');
      expect(text.join('')).toContain('Methods');
    });

    var tocFirstLevel = element.all(by.css('toc-container > div > toc-tree > ul > li'));

    tocFirstLevel.then(function(match) {
      expect(match.length).toBe(2);

      expect(match[1].all(by.css('li')).count()).toBe(2);
    });

  });

  it('on service pages', function() {
    browser.get('build/docs/index.html#!/api/ng/service/$controller');

    var toc = element.all(by.css('toc-container > div > toc-tree'));
    toc.getText().then(function(text) {
      expect(text.join('')).toContain('Overview');
      expect(text.join('')).toContain('Usage');
    });

    var tocFirstLevel = element.all(by.css('toc-container > div > toc-tree > ul > li'));

    tocFirstLevel.then(function(match) {
      expect(match.length).toBe(3);

      expect(match[2].all(by.css('li')).count()).toBe(2);
    });
  });

  it('on directive pages', function() {
    browser.get('build/docs/index.html#!/api/ng/directive/input');

    var toc = element.all(by.css('toc-container > div > toc-tree'));
    toc.getText().then(function(text) {
      expect(text.join('')).toContain('Overview');
      expect(text.join('')).toContain('Usage');
      expect(text.join('')).toContain('Directive Info');
    });

    var tocFirstLevel = element.all(by.css('toc-container > div > toc-tree > ul > li'));

    tocFirstLevel.then(function(match) {
      expect(match.length).toBe(4);

      expect(match[2].all(by.css('li')).count()).toBe(1);
    });
  });

  it('on function pages', function() {
    browser.get('build/docs/index.html#!/api/ng/function/angular.bind');

    var toc = element.all(by.css('toc-container > div > toc-tree'));
    toc.getText().then(function(text) {
      expect(text.join('')).toContain('Overview');
      expect(text.join('')).toContain('Usage');
    });

    var tocFirstLevel = element.all(by.css('toc-container > div > toc-tree > ul > li'));

    tocFirstLevel.then(function(match) {
      expect(match.length).toBe(2);

      expect(match[1].all(by.css('li')).count()).toBe(2);
    });
  });

  it('on type pages', function() {
    browser.get('build/docs/index.html#!/api/ng/type/ModelOptions');

    var toc = element.all(by.css('toc-container > div > toc-tree'));
    toc.getText().then(function(text) {
      expect(text.join('')).toContain('Overview');
      expect(text.join('')).toContain('Methods');
    });

    var tocFirstLevel = element.all(by.css('toc-container > div > toc-tree > ul > li'));

    tocFirstLevel.then(function(match) {
      expect(match.length).toBe(2);

      expect(match[1].all(by.css('li')).count()).toBe(2);
    });
  });

  it('on filter pages', function() {
    browser.get('build/docs/index.html#!/api/ng/filter/date');

    var toc = element.all(by.css('toc-container > div > toc-tree'));
    toc.getText().then(function(text) {
      expect(text.join('')).toContain('Overview');
      expect(text.join('')).toContain('Usage');
    });

    var tocFirstLevel = element.all(by.css('toc-container > div > toc-tree > ul > li'));

    tocFirstLevel.then(function(match) {
      expect(match.length).toBe(3);

      expect(match[1].all(by.css('li')).count()).toBe(2);
    });
  });

  it('on guide pages', function() {
    browser.get('build/docs/index.html#!/guide/services');
    var tocFirstLevel = element.all(by.css('toc-container > div > toc-tree > ul > li'));

    tocFirstLevel.then(function(match) {
      expect(match.length).toBe(5);

      expect(match[1].all(by.css('li')).count()).toBe(3);
    });
  });
});
