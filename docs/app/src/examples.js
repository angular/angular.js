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


.factory('openPlunkr', ['formPostData', '$http', '$q', function(formPostData, $http, $q) {
  return function(exampleFolder, clickEvent) {

    var exampleName = 'AngularJS Example';
    var newWindow = clickEvent.ctrlKey || clickEvent.metaKey;

    // Load the manifest for the example
    $http.get(exampleFolder + '/manifest.json')
      .then(function(response) {
        return response.data;
      })
      .then(function(manifest) {
        var filePromises = [];

        // Build a pretty title for the Plunkr
        var exampleNameParts = manifest.name.split('-');
        exampleNameParts.unshift('AngularJS');
        angular.forEach(exampleNameParts, function(part, index) {
          exampleNameParts[index] = part.charAt(0).toUpperCase() + part.substr(1);
        });
        exampleName = exampleNameParts.join(' - ');

        angular.forEach(manifest.files, function(filename) {
          filePromises.push($http.get(exampleFolder + '/' + filename, { transformResponse: [] })
            .then(function(response) {

              // The manifests provide the production index file but Plunkr wants
              // a straight index.html
              if (filename === "index-production.html") {
                filename = "index.html"
              }

              return {
                name: filename,
                content: response.data
              };
            }));
        });
        return $q.all(filePromises);
      })
      .then(function(files) {
        var postData = {};

        angular.forEach(files, function(file) {
          postData['files[' + file.name + ']'] = file.content;
        });

        postData['tags[0]'] = "angularjs";
        postData['tags[1]'] = "example";
        postData.private = true;
        postData.description = exampleName;

        formPostData('http://plnkr.co/edit/?p=preview', newWindow, postData);
      });
  };
}]);
