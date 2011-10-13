function noop() {}
$(document).ready(function() {
  function xhr(method, url, data, callback){
    jQuery.getJSON(url, function() {
      callback.apply(this, arguments);
      scope.updateView();
    });
  }

  var resourceFactory = new ResourceFactory(xhr);

  var Tweeter = resourceFactory.route("http://twitter.com/statuses/:service:username.json", {}, {
    home: {method:'GET', params: {service:'home_timeline'}, isArray:true },
    user: {method:'GET', params: {service:'user_timeline/'}, isArray:true }
  });


  var scope = window.scope = angular.compile(document, {
    location:angular.startUrlWatcher()
  });

  function fetchTweets(username){
    return username ? Tweeter.user({username: username}) : Tweeter.home();
  }

  scope.set('fetchTweets', fetchTweets);
  scope.set('users', [
      {screen_name:'mhevery', name:'Mi\u0161ko Hevery',
       notes:'Author of <angular/> http://www.getangular.com.',
       profile_image_url:'http://a3.twimg.com/profile_images/54360179/Me_-_Small_Banner_normal.jpg'},
      {screen_name:'abrons', name:'Adam Abrons',
       notes:'Author of <angular/> & Ruby guru see:  http://www.angularjs.org.',
       profile_image_url:'http://media.linkedin.com/mpr/mpr/shrink_80_80/p/2/000/005/0a8/044278d.jpg'}
    ]);
  scope.init();
});
