(function(angular) {
  'use strict';
angular.module('heroes', [])
  .service('heroService', HeroService)

  .component('heroes', {
    template: '<h2>Heroes</h2><ng-outlet></ng-outlet>',
    $routeConfig: [
      {path: '/',    name: 'HeroList',   component: 'heroList', useAsDefault: true},
      {path: '/:id', name: 'HeroDetail', component: 'heroDetail'}
    ]
  })

  .component('heroList', {
    template:
      '<div ng-repeat="hero in $ctrl.heroes" ' +
      '     ng-class="{ selected: $ctrl.isSelected(hero) }">\n' +
        '<a ng-link="[\'HeroDetail\', {id: hero.id}]">{{hero.name}}</a>\n' +
      '</div>',
    controller: HeroListComponent
  })

  .component('heroDetail', {
    template:
      '<div ng-if="$ctrl.hero">\n' +
      '  <h3>"{{$ctrl.hero.name}}"</h3>\n' +
      '  <div>\n' +
      '    <label>Id: </label>{{$ctrl.hero.id}}</div>\n' +
      '  <div>\n' +
      '    <label>Name: </label>\n' +
      '    <input ng-model="$ctrl.hero.name" placeholder="name"/>\n' +
      '  </div>\n' +
      '  <button ng-click="$ctrl.gotoHeroes()">Back</button>\n' +
      '</div>\n',
    bindings: { $router: '<' },
    controller: HeroDetailComponent
  });


function HeroService($q) {
  var heroesPromise = $q.when([
    { id: 11, name: 'Mr. Nice' },
    { id: 12, name: 'Narco' },
    { id: 13, name: 'Bombasto' },
    { id: 14, name: 'Celeritas' },
    { id: 15, name: 'Magneta' },
    { id: 16, name: 'RubberMan' }
  ]);

  this.getHeroes = function() {
    return heroesPromise;
  };

  this.getHero = function(id) {
    return heroesPromise.then(function(heroes) {
      for(var i=0; i<heroes.length; i++) {
        if ( heroes[i].id == id) return heroes[i];
      }
    });
  };
}

function HeroListComponent(heroService) {
  var selectedId = null;
  var $ctrl = this;

  this.$routerOnActivate = function(next) {
    // Load up the heroes for this view
    heroService.getHeroes().then(function(heroes) {
      $ctrl.heroes = heroes;
      selectedId = next.params.id;
    });
  };

  this.isSelected = function(hero) {
    return (hero.id == selectedId);
  };
}

function HeroDetailComponent(heroService) {
  var $ctrl = this;

  this.$routerOnActivate = function(next) {
    // Get the hero identified by the route parameter
    var id = next.params.id;
    heroService.getHero(id).then(function(hero) {
      $ctrl.hero = hero;
    });
  };

  this.gotoHeroes = function() {
    var heroId = this.hero && this.hero.id;
    this.$router.navigate(['HeroList', {id: heroId}]);
  };
}
})(window.angular);