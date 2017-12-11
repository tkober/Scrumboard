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

}]);
