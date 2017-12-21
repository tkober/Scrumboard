import './task.less';


angular.module('scrumboard').controller('TaskController', ['$scope', '$location', '$timeout', '$window', function($scope, $location, $timeout, $window) {

  $scope.moveTask = function(to) {
    Meteor.call('taskboard.move', $scope.scrum._id, $scope.story.id,
    $scope.index, $scope.taskStatus, to, (error, result) => {
      $scope.error = error;
      $scope.$apply();

      $timeout(function() {
        if (result) {
          if ($scope.story.intranet || $scope.story.redmine) {
            $('#timeTrackingModal').modal('show');
          }
        }
      }, 500);
    });
  };

  $scope.removeTask = function() {
    Meteor.call('scrums.userstories.removeTask', $scope.scrum._id, $scope.story.id,
    $scope.index, $scope.taskStatus, (error) => {
      $scope.error = error;
      $scope.$apply();
    });
  };

  $scope.openTimeTrackinIntranet = function() {
    $window.open('https://intranet.intern.semvox.de/#!/time-tracker/id/' + $scope.story.intranet, '_blank');
  };

  $scope.openTimeTrackinRedmine = function() {
    $window.open('https://dev.semvox.de/issues/' + $scope.story.redmine + '/time_entries/new', '_blank');
  };

}]);
