angular.service('myApplication', function($resource){
  this.Activity = $resource(
      'https://www.googleapis.com/buzz/v1/activities/:userId/:visibility/:activityId/:comments',
      {alt:'json', callback:'JSON_CALLBACK'},
      {
        get:     {method:'JSON', params:{visibility:'@self'}},
        replies: {method:'JSON', params:{visibility:'@self', comments:'@comments'}}
      });
}, {inject:['$resource']});

function BuzzController(){
  this.$watch('$location.hashPath', this.userChange);
}
BuzzController.prototype = {
  userChange: function(){
    this.userId = this.$location.hashPath;
    this.activities = this.Activity.get({userId:this.userId});
  }
};
