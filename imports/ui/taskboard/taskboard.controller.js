import '../taskrow/taskrow.directive.js';
import './taskboard.less';
import Epics from '../Epics.js';


angular.module('scrumboard').controller('TaskboardController', ['$scope', '$location', '$reactive', function($scope, $location) {

  $scope.epics = new Epics($scope.scrum.sprint.backlog);

  $scope.createTask = function(storyId) {
    $scope.$parent.createTask(storyId);
  };

  $scope.showPersona = function(persona) {
    $scope.$parent.showPersona(persona);
  };

}]);
