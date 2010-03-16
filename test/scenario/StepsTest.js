StepsTest = TestCase("StepsTest");

StepsTest.prototype.testGivenDataset=function(){
  var self = {frame:{}, dataset:[]};
  angular.test.GIVEN.dataset.call(self);
  assertEquals('$DATASET:{"dataset":[]}', self.frame.name);
};
