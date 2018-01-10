angular.module('scrumboard').controller('ScrumEntryController', ['$scope', '$location', function($scope, $location) {

  $scope.isDeleting = false;

  $scope.startDeleting = function() {
    $scope.isDeleting = true;
  };

  $scope.cancelDeleting = function() {
    $scope.isDeleting = false;
  };

  $scope.delete = function() {
    Meteor.call('scrums.delete', $scope.scrum._id);
  };

  $scope.isOwner = function() {
    return $scope.scrum.owner == Meteor.userId();
  };

  $scope.edit = function() {
    $location.path('/scrums/' + $scope.scrum._id + '/edit');
  };

  $scope.open = function() {
    $location.path('/scrums/' + $scope.scrum._id);
  };

  $scope.scrumSummary = function(scrum) {
    var result = 'No pending sprint, ' + scrum.backlog.length + ' items in product backlog';
    if (scrum.sprint) {
      if (scrum.sprint.status == 'planning') {
        result = 'Planning sprint, ' + scrum.backlog.length + ' items in product backlog';
      }
      if (scrum.sprint.status == 'active') {
        result = 'Active sprint, ' + (scrum.sprint.backlog.length-1) + ' items in sprint backlog';
      }
      if (scrum.sprint.status == 'ended') {
        result = 'Ended sprint, ' + (scrum.sprint.backlog.length-1) + ' items in sprint backlog';
      }
    }
    return result;
  };

}]);
