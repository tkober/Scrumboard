angular.module('scrumboard').controller('BurndownController', ['$scope', function($scope) {

  $scope.begin = $scope.scrum.sprint.begin;
  $scope.end = $scope.scrum.sprint.end;
  if ($scope.end < new Date()) {
    $scope.end = new Date();
  }

}]);
