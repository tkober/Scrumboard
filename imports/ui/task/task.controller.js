import './task.less';


angular.module('scrumboard').controller('TaskController', ['$scope', '$location', '$reactive', function($scope, $location) {

  $scope.moveTask = function(to) {
    Meteor.call('taskboard.move', $scope.scrum._id, $scope.story.id,
    $scope.index, $scope.taskStatus, to, (error) => {
      $scope.error = error;
      $scope.$apply();
    });
  };

  $scope.removeTask = function() {
    Meteor.call('scrums.userstories.removeTask', $scope.scrum._id, $scope.story.id,
    $scope.index, $scope.taskStatus, (error) => {
      $scope.error = error;
      $scope.$apply();
    });
  };

}]);
