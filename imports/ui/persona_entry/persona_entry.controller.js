angular.module('scrumboard').controller('PersonaEntryController', ['$scope', '$location', function($scope, $location) {

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
    $location.path('/scrums/' + $scope.scrum._id + '/personas/' + $scope.persona.name);
  };

}]);
