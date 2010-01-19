function noop(){}
$(document).ready(function(){
  var scope = window.scope = angular.compile(document);
  scope.getJSON = function(url, callback) {
    var list = [];
    var self = this;
    self.set('status', 'fetching');
    $.getJSON(url, function(response){
      _(response).forEach(function(v,k){
        list[k] = v;
      });
      (callback||noop)(response);
      self.set('status', '');
      self.updateView();
    });
    return list;
  };

  function fetchTweets(username){
    return scope.getJSON(
        username ?
            "http://twitter.com/statuses/user_timeline/"+username+".json" :
            "http://twitter.com/statuses/home_timeline.json");
  }

  scope.set('fetchTweets', fetchTweets);
  scope.set('users', [
      {screen_name:'mhevery', name:'Mi\u0161ko Hevery', notes:'Author of <angular/>.', 
        profile_image_url:'http://a3.twimg.com/profile_images/54360179/Me_-_Small_Banner_normal.jpg'},
      {screen_name:'abrons', name:'Adam Abrons', notes:'Author of <angular/> & Ruby guru.', 
        profile_image_url:'http://media.linkedin.com/mpr/mpr/shrink_80_80/p/2/000/005/0a8/044278d.jpg'}
    ]);
  scope.watchUrl();
  scope.init();
});
