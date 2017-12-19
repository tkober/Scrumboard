angular.module('scrumboard').controller('MainController', ['$scope', function($scope) {
  $scope.autorun(function() {
    $scope.isLoggedIn = Meteor.userId() != null;
  });

}]);
