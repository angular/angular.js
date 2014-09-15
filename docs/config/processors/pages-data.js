"use strict";

var _ = require('lodash');
var path = require('canonical-path');

var AREA_NAMES = {
  api: 'API',
  guide: 'Developer Guide',
  misc: 'Miscellaneous',
  tutorial: 'Tutorial',
  error: 'Error Reference'
};

function getNavGroup(pages, area, pageSorter, pageMapper) {

  var navItems = _(pages)
    // We don't want the child to include the index page as this is already catered for
    .omit(function(page) { return page.id === 'index'; })

    // Apply the supplied sorting function
    .sortBy(pageSorter)

    // Apply the supplied mapping function
    .map(pageMapper)

    .value();

  return {
    name: area.name,
    type: 'group',
    href: area.id,
    navItems: navItems
  };
}


/**
 * @dgProcessor generatePagesDataProcessor
 * @description
 * This processor will create a new doc that will be rendered as a JavaScript file
 * containing meta information about the pages and navigation
 */
module.exports = function generatePagesDataProcessor(log) {


  var navGroupMappers = {
    api: function(areaPages, area) {
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
              log.debug(moduleName, _.keys(docTypes));
              // Extract the module page from the collection
              modulePage = docTypes.module[0];
              delete docTypes.module;
            })

            .tap(function(docTypes) {
              if ( docTypes.input ) {
                docTypes.directive = docTypes.directive || [];
                // Combine input docTypes into directive docTypes
                docTypes.directive = docTypes.directive.concat(docTypes.input);
                delete docTypes.input;
              }
            })

            .forEach(function(sectionPages, sectionName) {

              sectionPages = _.sortBy(sectionPages, 'name');

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
    tutorial: function(pages, area) {
      return [getNavGroup(pages, area, 'step', function(page) {
        return {
          name: page.name,
          step: page.step,
          href: page.path,
          type: 'tutorial'
        };
      })];
    },
    error: function(pages, area) {
      return [getNavGroup(pages, area, 'path', function(page) {
        return {
          name: page.name,
          href: page.path,
          type: page.docType === 'errorNamespace' ? 'section' : 'error'
        };
      })];
    },
    pages: function(pages, area) {
      return [getNavGroup(
        pages,
        area,
        function(page) {
          return page.sortOrder || page.path;
        },
        function(page) {
          return {
            name: page.name,
            href: page.path,
            type: 'page'
          };
        }
      )];
    }
  };

  return {
    $runAfter: ['paths-computed'],
    $runBefore: ['rendering-docs'],
    $process: function(docs) {

      _(docs)
      .filter(function(doc) { return doc.area === 'api' && doc.docType === 'module'; })
      .forEach(function(doc) { if ( !doc.path ) {
        log.warn('Missing path property for ', doc.id);
      }})
      .map(function(doc) { return _.pick(doc, ['id', 'module', 'docType', 'area']); })
      .tap(function(docs) {
        log.debug(docs);
      });


      // We are only interested in docs that are in an area and are not landing pages
      var navPages = _.filter(docs, function(page) {
        return page.area && page.docType != 'componentGroup';
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
        .forEach(function(pages, areaId) {
          var area = {
            id: areaId,
            name: AREA_NAMES[areaId]
          };
          areas[areaId] = area;

          var navGroupMapper = navGroupMappers[area.id] || navGroupMappers['pages'];
          area.navGroups = navGroupMapper(pages, area);
        });

      // Extract a list of basic page information for mapping paths to partials and for client side searching
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
  }
};
