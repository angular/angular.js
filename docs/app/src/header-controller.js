angular.
    module('HeaderController', []).
    controller('HeaderController', HeaderController);

function HeaderController() {
  var vm = this;

  vm.learnItems = [
    {label: 'Why AngularJS?', url: '//angularjs.org/'},
    {label: 'Watch', url: '//www.youtube.com/user/angularjs'},
    {label: 'Tutorial', url: 'tutorial'},
    {label: 'Case Studies', url: '//builtwith.angularjs.org/'},
    {label: 'Seed App project template', url: '//github.com/angular/angular-seed'},
    {label: 'FAQ', url: 'misc/faq'}
  ];

  vm.developItems = [
    {label: 'Why AngularJS?', url: '//angularjs.org/'},
    {label: 'Tutorial', url: 'tutorial'},
    {label: 'Developer Guide', url: 'guide'},
    {label: 'API Reference', url: 'api'},
    {label: 'Error Reference', url: 'error'},
    {label: 'Contribute', url: 'misc/contribute'},
    {label: 'Download', url: '//code.angularjs.org/'}
  ];

  vm.discussItems = [
    {label: 'Blog', url: '//blog.angularjs.org'},
    {label: 'Mailing List', url: '//groups.google.com/group/angular'},
    {label: 'Chat Room', url: '//webchat.freenode.net/?channels=angularjs&uio=d4'},
    {label: 'Twitter', url: '//twitter.com/#!/angularjs'},
    {label: 'Google+', url: '//plus.google.com/110323587230527980117'},
    {label: 'GitHub', url: '//github.com/angular/angular.js'},
    {label: 'Issue Tracker', url: '//github.com/angular/angular.js/issues'},
  ];
}
