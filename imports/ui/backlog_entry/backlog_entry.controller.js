angular.module('scrumboard').controller('BacklogEntryController', ['$scope', '$location', function($scope, $location) {

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

}]);
