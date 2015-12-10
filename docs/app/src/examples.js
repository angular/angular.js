angular.module('examples', [])

.factory('formPostData', ['$document', function($document) {
  return function(url, newWindow, fields) {
    /**
     * If the form posts to target="_blank", pop-up blockers can cause it not to work.
     * If a user choses to bypass pop-up blocker one time and click the link, they will arrive at
     * a new default plnkr, not a plnkr with the desired template.  Given this undesired behavior,
     * some may still want to open the plnk in a new window by opting-in via ctrl+click.  The
     * newWindow param allows for this possibility.
     */
    var target = newWindow ? '_blank' : '_self';
    var form = angular.element('<form style="display: none;" method="post" action="' + url + '" target="' + target + '"></form>');
    angular.forEach(fields, function(value, name) {
      var input = angular.element('<input type="hidden" name="' +  name + '">');
      input.attr('value', value);
      form.append(input);
    });
    $document.find('body').append(form);
    form[0].submit();
    form.remove();
  };
}])

.factory('createCopyrightNotice', function() {
    var COPYRIGHT = 'Copyright ' + (new Date()).getFullYear() + ' Google Inc. All Rights Reserved.\n'
     + 'Use of this source code is governed by an MIT-style license that\n'
     + 'can be found in the LICENSE file at http://angular.io/license';
    var COPYRIGHT_JS_CSS = '\n\n/*\n' + COPYRIGHT + '\n*/';
    var COPYRIGHT_HTML = '\n\n<!-- \n' + COPYRIGHT + '\n-->';

    return function getCopyright(filename) {
      switch (filename.substr(filename.lastIndexOf('.'))) {
        case '.html':
          return COPYRIGHT_HTML;
        case '.js':
        case '.css':
          return COPYRIGHT_JS_CSS;
        case '.md':
          return COPYRIGHT;
      }
      return '';
    };
})

.directive('plnkrOpener', ['$q', 'getExampleData', 'formPostData', 'createCopyrightNotice', function($q, getExampleData, formPostData, createCopyrightNotice) {
  return {
    scope: {},
    bindToController: {
      'examplePath': '@'
    },
    controllerAs: 'plnkr',
    template: '<button ng-click="plnkr.open($event)" class="btn pull-right"> <i class="glyphicon glyphicon-edit">&nbsp;</i> Edit in Plunker</button> ',
    controller: [function() {
      var ctrl = this;

      ctrl.example = {
        path: ctrl.examplePath,
        manifest: undefined,
        files: undefined,
        name: 'AngularJS Example'
      };

      ctrl.prepareExampleData = function() {
        if (ctrl.example.manifest) {
          return $q.when(ctrl.example);
        }

        return getExampleData(ctrl.examplePath).then(function(data) {
          ctrl.example.files = data.files;
          ctrl.example.manifest = data.manifest;

          // Build a pretty title for the Plunkr
          var exampleNameParts = data.manifest.name.split('-');
          exampleNameParts.unshift('AngularJS');
          angular.forEach(exampleNameParts, function(part, index) {
            exampleNameParts[index] = part.charAt(0).toUpperCase() + part.substr(1);
          });
          ctrl.example.name = exampleNameParts.join(' - ');

          return ctrl.example;
        });
      };

      ctrl.open = function(clickEvent) {

        var newWindow = clickEvent.ctrlKey || clickEvent.metaKey;

        var postData = {
          'tags[0]': "angularjs",
          'tags[1]': "example",
          'private': true
        };

        // Make sure the example data is available.
        // If an XHR must be made, this might break some pop-up blockers when
        // new window is requested
        ctrl.prepareExampleData()
          .then(function() {
            angular.forEach(ctrl.example.files, function(file) {
              postData['files[' + file.name + ']'] = file.content + createCopyrightNotice(file.name);
            });

            postData.description = ctrl.example.name;

            formPostData('http://plnkr.co/edit/?p=preview', newWindow, postData);
          });

      };

      // Initialize the example data, so it's ready when clicking the open button.
      // Otherwise pop-up blockers will prevent a new window from opening
      ctrl.prepareExampleData(ctrl.example.path);

    }]
  };
}])

.factory('getExampleData', ['$http', '$q', function($http, $q) {
  return function(exampleFolder){
    // Load the manifest for the example
    return $http.get(exampleFolder + '/manifest.json')
      .then(function(response) {
        return response.data;
      })
      .then(function(manifest) {
        var filePromises = [];

        angular.forEach(manifest.files, function(filename) {
          filePromises.push($http.get(exampleFolder + '/' + filename, { transformResponse: [] })
            .then(function(response) {

              // The manifests provide the production index file but Plunkr wants
              // a straight index.html
              if (filename === "index-production.html") {
                filename = "index.html";
              }

              return {
                name: filename,
                content: response.data
              };
            }));
        });

        return $q.all({
          manifest: manifest,
          files: $q.all(filePromises)
        });
      });
  };
}]);