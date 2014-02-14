var _ = require('lodash');
var path = require('canonical-path');
var log = require('winston');

var AREA_NAMES = {
  api: 'API',
  guide: 'Developer Guide',
  misc: 'Miscellaneous',
  tutorial: 'Tutorial',
  error: 'Error Reference'
};

function getNavGroup(navGroupPages, groupName, pageSorter, pageMapper) {
  
  var navItems = _(navGroupPages)
    .sortBy(pageSorter)
    .map(pageMapper)
    .value();

  return {
    name: groupName,
    type: 'group',
    navItems: navItems
  };
}


var navGroupMappers = {
  api: function(areaPages, areaName) {
    var navGroups = _(areaPages)
      .filter('module') // We are not interested in docs that are not in a module

      .groupBy('module')

      .map(function(modulePages, moduleName) {
        log.debug('moduleName: ' + moduleName);
        var navItems = [];
        var modulePage;

        _(modulePages)

          .groupBy('docType')

          .tap(function(docTypes) {
            log.debug(_.keys(docTypes));
            // Extract the module page from the collection
            modulePage = docTypes.module[0];
            delete docTypes.module;
          })

          .forEach(function(sectionPages, sectionName) {

            if ( sectionPages.length > 0 ) {
              // Push a navItem for this section
              navItems.push({
                name: sectionName,
                type: 'section',
                href: path.dirname(sectionPages[0].path)
              });

              // Push the rest of the sectionPages for this section
              _.forEach(sectionPages, function(sectionPage) {

                navItems.push({
                  name: sectionPage.name,
                  href: sectionPage.path,
                  type: sectionPage.docType
                });

              });
            }
          });
        return {
          name: moduleName,
          href: modulePage.path,
          type: 'group',
          navItems: navItems
        };
      })
      .value();
    return navGroups;
  },
  tutorial: function(pages, areaName) {
    return [getNavGroup(pages, areaName, 'step', function(page) {
      return {
        name: page.name,
        step: page.step,
        href: page.path,
        type: 'tutorial'
      };
    })];
  },
  error: function(pages, areaName) {
    return [getNavGroup(pages, areaName, 'path', function(page) {
      return {
        name: page.name,
        href: page.path,
        type: 'error'
      };
    })];
  },
  pages: function(pages, areaName) {
    return [getNavGroup(pages, areaName, 'path', function(page) {
      return {
        name: page.name,
        href: page.path,
        type: 'page'
      };
    })];
  }
};

var outputFolder;

module.exports = {
  name: 'pages-data',
  description: 'This plugin will create a new doc that will be rendered as an angularjs module ' +
               'which will contain meta information about the pages and navigation',
  runAfter: ['adding-extra-docs', 'component-groups-generate'],
  runBefore: ['extra-docs-added'],
  init: function(config) {
    outputFolder = config.rendering.outputFolder;
  },
  process: function(docs) {

    _(docs)
    .filter(function(doc) { return doc.area === 'api'; })
    .filter(function(doc) { return doc.docType === 'module'; })
    .map(function(doc) { return _.pick(doc, ['id', 'module', 'docType', 'area']); })
    .tap(function(docs) {
      log.debug(docs);
    });


    // We are only interested in docs that are in a area and not landing pages
    var navPages = _.filter(docs, function(page) {
      return page.area && page.docType != 'landingPage';
    });

    // Generate an object collection of pages that is grouped by area e.g.
    // - area "api"
    //  - group "ng"
    //    - section "directive"
    //    - ngApp
    //    - ngBind
    //    - section "global"
    //    - angular.element
    //    - angular.bootstrap
    //    - section "service"
    //    - $compile
    //  - group "ngRoute"
    //    - section "directive"
    //    - ngView
    //    - section "service"
    //    - $route
    //    
    var areas = {};
    _(navPages)
      .groupBy('area')
      .forEach(function(pages, areaName) {
        var navGroupMapper = navGroupMappers[areaName] || navGroupMappers['pages'];
        var areaTitle = AREA_NAMES[areaName];

        areas[areaName] = {
          id: areaName,
          name: areaTitle,
          navGroups: navGroupMapper(pages, areaTitle)
        };
      });

    _.forEach(docs, function(doc) {
      if ( !doc.path ) {
        log.warn('Missing path property for ', doc.id);
      }
    });

    // Extract a list of basic page information for mapping paths to paritals and for client side searching
    var pages = _(docs)
      .map(function(doc) {
        var page = _.pick(doc, [
          'docType', 'id', 'name', 'area', 'outputPath', 'path', 'searchTerms'
        ]);
        return page;
      })
      .indexBy('path')
      .value();


    var docData = {
      docType: 'pages-data',
      id: 'pages-data',
      template: 'pages-data.template.js',
      outputPath: 'js/pages-data.js',

      areas: areas,
      pages: pages
    };
    docs.push(docData);
  }
};
