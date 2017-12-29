import '../taskrow/taskrow.directive.js';
import './taskboard.less';


angular.module('scrumboard').controller('TaskboardController', ['$scope', '$location', '$reactive', function($scope, $location) {

  $scope.createTask = function(storyId) {
    $scope.$parent.createTask(storyId);
  };

}]);
