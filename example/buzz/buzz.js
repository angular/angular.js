angular.module.ng('myApplication', function($resource){
  this.Activity = $resource(
      'https://www.googleapis.com/buzz/v1/activities/:userId/:visibility/:activityId/:comments',
      {alt:'json', callback:'JSON_CALLBACK'},
      {
        get:     {method:'JSON', params:{visibility:'@self'}},
        replies: {method:'JSON', params:{visibility:'@self', comments:'@comments'}}
      });
}, {inject:['$resource']});

function BuzzController() {
  this.$watch('$location.hashPath', this.userChange);
}
BuzzController.prototype = {
  userChange: function() {
    this.userId = this.$location.hashPath;
    this.activities = this.Activity.get({userId:this.userId});
  },

  expandReplies: function(activity) {
    var self = this;
    if (activity.replies) {
      activity.replies.show = !activity.replies.show;
    } else {
      activity.replies = this.Activity.replies({userId:this.userId, activityId:activity.id}, function() {
        activity.replies.show = true;
      });
    }
  }
};

angular.widget('my:expand', function(element){
  element.css('display', 'block');
  this.descend(true);
  return function(element) {
    element.hide();
    var watch = element.attr('expand');
    this.$watch(watch, function(value){
      if (value) {
        element.delay(0).slideDown('slow');
      } else {
        element.slideUp('slow');
      }
    });
  };
});
