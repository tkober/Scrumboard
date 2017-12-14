import '../task/task.directive.js';


angular.module('scrumboard').controller('TaskrowController', ['$scope', '$location', '$reactive', function($scope, $location) {

  $scope.taskDescription = null;
  $scope.taskDifficulty = 0;

  $scope.personalPronoun = function() {
    return $scope.story.personas.length > 1 ? 'We' : 'I';
  };

  $scope.createTask = function() {
    $('#createTaskModal_' + $scope.story.id).modal('show');
  };

  $scope.DIFFICULTIES = [
    { number: 1, text: "Done that like a 1000 times." },
    { number: 2, text: "Already done that and know how to do it." },
    { number: 3, text: "I know how to do it but didn't do it yet." },
    { number: 4, text: "Doable but there are open questions." },
    { number: 5, text: "No Idea how to build that." }
  ];

  $scope.setTaskDifficulty = function(difficulty) {
    $scope.taskDifficulty = difficulty;
  };

  $scope.isValidTask = function() {
    return $scope.taskDescription != null && $scope.taskDescription.length > 0 &&
      $scope.taskDifficulty > 0;
  };

  $scope.saveTask = function() {
    Meteor.call('scrums.userstories.createTask', $scope.scrum._id,
    $scope.story.id, $scope.taskDescription, $scope.taskDifficulty, (error) => {
      $scope.error = error;
      $scope.$apply();
    });
  };

}]);
