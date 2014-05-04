angular.module('examples', [])

.factory('formPostData', ['$document', function($document) {
  return function(url, fields) {
    var form = angular.element('<form style="display: none;" method="post" action="' + url + '" target="_blank"></form>');
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
  return function(exampleFolder) {

    var exampleName = 'AngularJS Example';

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

        formPostData('http://plnkr.co/edit/?p=preview', postData);
      });
  };
}]);