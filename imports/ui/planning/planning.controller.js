import '../backlog_entry/backlog_entry.directive.js';


angular.module('scrumboard').controller('PlanningController', ['$scope', '$location', '$reactive', function($scope, $location, $reactive) {
  $reactive(this).attach($scope);

  $scope.from = new Date();
  var default_duration_days = 14;
  $scope.to = new Date();
  $scope.to.setTime($scope.to.getTime() + (default_duration_days * 24 * 60 * 60 * 1000));

  $scope.allParticipants = []
  $scope.participatesInPlanning = {}

  this.call('users.get', $scope.presettingId, (error, result) => {
    $scope.error = error;
    if (!error) {
      for (var i = 0; i < result.length; i++) {
        var user = result[i];
        if (user._id === $scope.scrum.owner || $scope.scrum.participants.indexOf(user._id) > -1) {
          $scope.allParticipants.push({ name: user.email, id: user._id });
          $scope.participatesInPlanning[user._id] = true;
        }
      }
    }
    $scope.$apply();
  });

  $scope.isValid = function() {
    var participantCount = 0;
    Object.keys($scope.participatesInPlanning).forEach(function(key) {
        value = $scope.participatesInPlanning[key];
        if (value) {
          participantCount += 1;
        }
    });
    return $scope.from && $scope.to && $scope.from < $scope.to && participantCount > 0;
  };

  $scope.startPlanning = function() {
    var planners = [];
    Object.keys($scope.participatesInPlanning).forEach(function(key) {
        value = $scope.participatesInPlanning[key];
        if (value) {
          planners.push(key);
        }
    });

    Meteor.call('scrums.sprint.start_planning', $scope.scrum._id, angular.toJson(planners), (error) => {
      $scope.error = error;
      $scope.$apply();
    });
  };

  $scope.planningStarted = function() {
    return $scope.scrum.sprint && $scope.scrum.sprint.status == 'planning';
  };

  $scope.isPartOfPlanning = function() {
    return $scope.scrum.sprint.planningParticipants.indexOf(Meteor.userId()) > -1;
  }

  $scope.sprintBacklogEstimate = function() {
    var result = 0;
    for (var i = 0; i < $scope.scrum.backlog.length; i++) {
      var story = $scope.scrum.backlog[i];
      if ($scope.scrum.sprint.backlog.indexOf(story.id) != -1) {
        // console.log(story.id);
        result += story.estimates[Meteor.userId()];
      }
    }
    return result;
  };

  $scope.startSprint = function() {
    Meteor.call('scrums.sprint.start', $scope.scrum._id, (error) => {
      $scope.error = error;
      $scope.$apply();
    });
  };

  $scope.cancelSprintPlanning = function() {
    Meteor.call('scrums.sprint.cancel_planning', $scope.scrum._id, (error) => {
      $scope.error = error;
      $scope.$apply();
    });
  };

}]);
