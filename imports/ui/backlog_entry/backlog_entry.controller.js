angular.module('scrumboard').controller('BacklogEntryController', ['$scope', '$location', function($scope, $location) {

  $scope.error = null;
  $scope.isDeleting = false;

  $scope.startDeleting = function() {
    $scope.isDeleting = true;
  };

  $scope.cancelDeleting = function() {
    $scope.isDeleting = false;
  };

  $scope.delete = function() {
    // Meteor.call('scrums.delete', $scope.scrum._id);
  };

  $scope.isOwner = function() {
    return $scope.scrum.owner == Meteor.userId();
  };

  $scope.edit = function() {
    // $location.path('/scrums/' + $scope.scrum._id + '/userstory/' + $scope.persona.name);
  };

  $scope.personalPronoun = function() {
    return $scope.userstory.personas.length > 1 ? 'We' : 'I';
  };

  $scope.ESTIMATES = [1, 2, 3, 5, 8, 13, 20, 40, 100];

  $scope.isMyEstimate = function(estimate) {
    return estimate == $scope.userstory.estimates[Meteor.userId()];
  };

  $scope.estimate = function(estimate) {
    Meteor.call('scrums.userstories.estimate', $scope.scrum._id, $scope.userstory.id, estimate, (error) => {
      $scope.error = error;
      $scope.$apply();
    });
  };

  $scope.increase_priority = function() {
    Meteor.call('scrums.userstories.upvote', $scope.scrum._id, $scope.userstory.id, (error) => {
      $scope.error = error;
      $scope.$apply();
    });
  };

  $scope.decrease_priority = function() {
    Meteor.call('scrums.userstories.downvote', $scope.scrum._id, $scope.userstory.id, (error) => {
      $scope.error = error;
      $scope.$apply();
    });
  };

  $scope.showEstimatePanel = function() {
    if ($scope.planning) {
      return $scope.userstory.estimates[Meteor.userId()] == null;
    } else {
      return true;
    }
  };

  $scope.missingEstimatesCount = function() {
    var result = 0;
    for (var i = 0; i < $scope.scrum.sprint.planningParticipants.length; i++) {
      var p_id = $scope.scrum.sprint.planningParticipants[i];
      if (!$scope.userstory.estimates[p_id]) {
        result += 1;
      }
    }
    return result;
  };

  $scope.estimateExtrema = function() {
    var min = 9999;
    var max = 0;
    for (var i = 0; i < $scope.scrum.sprint.planningParticipants.length; i++) {
      var p_id = $scope.scrum.sprint.planningParticipants[i];
      if ($scope.userstory.estimates[p_id]) {
        var estimate = $scope.userstory.estimates[p_id];
        max = Math.max(max, estimate);
        min = Math.min(min, estimate);
      }
    }
    return { 'min': min, 'max': max };
  };

  $scope.minimumEstimate = function() {
    return $scope.estimateExtrema().min;
  };

  $scope.maximumEstimate = function() {
    return $scope.estimateExtrema().max;
  };

  $scope.compliantEstimate = function() {
    return $scope.minimumEstimate() == $scope.maximumEstimate();
  };

  $scope.resetEstimate = function () {
    Meteor.call('scrums.userstories.reset_estimate', $scope.scrum._id, $scope.userstory.id, (error) => {
      $scope.error = error;
      $scope.$apply();
    });
  };

  $scope.isInSprintBacklog = function() {
    return $scope.scrum.sprint.backlog.indexOf($scope.userstory.id) != -1;
  };

  $scope.canAddToBacklog = function() {
    return $scope.planning &&
      $scope.missingEstimatesCount() == 0 &&
      $scope.compliantEstimate() &&
      !$scope.isInSprintBacklog();
  }

  $scope.addToSprintBacklog = function() {
    Meteor.call('scrums.sprint.backlog.add', $scope.scrum._id, $scope.userstory.id, (error) => {
      $scope.error = error;
      $scope.$apply();
    });
  };

  $scope.removeFromSprintBacklog = function() {
    Meteor.call('scrums.sprint.backlog.remove', $scope.scrum._id, $scope.userstory.id, (error) => {
      $scope.error = error;
      $scope.$apply();
    });
  };

  $scope.canRemoveFromBacklog = function() {
    return $scope.planning && $scope.isInSprintBacklog();
  };

  $scope.deleteStory = function() {
    Meteor.call('scrums.userstories.delete', $scope.scrum._id, $scope.userstory.id, (error) => {
      $scope.error = error;
      $scope.$apply();
    });
  };

}]);
