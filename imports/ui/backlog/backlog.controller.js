import '../backlog_entry/backlog_entry.directive.js';


angular.module('scrumboard').controller('BacklogController', ['$scope', '$reactive', '$location', function($scope, $reactive, $location) {

  $scope.createUserStory = function() {
    $location.path('/scrums/' + $scope.scrum._id + '/backlog/story');
  };

  $scope.showPersona = function(persona) {
    $scope.$parent.showPersona(persona);
  };

}]);
