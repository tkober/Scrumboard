import '../task/task.directive.js';
import './taskrow.less';


angular.module('scrumboard').controller('TaskrowController', ['$scope', function($scope) {

  $scope.personalPronoun = function() {
    return $scope.story.personas.length > 1 ? 'we' : 'I';
  };

  $scope.createTask = function() {
    $scope.$parent.createTask($scope.story.id);
  };

}]);
