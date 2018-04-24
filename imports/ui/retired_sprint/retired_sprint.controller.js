import * as langs from '../../api/languages.js';
import './retired_sprint.less';


angular.module('scrumboard').controller('RetiredSprintController', ['$scope', function($scope) {

  $scope.STORIES = 1;
  $scope.BURNDOWN = 2;
  $scope.RETROSPECTIVE = 3;

  $scope.view = $scope.STORIES;

  $scope.storypoints = function() {
    var sum = 0;

    for (var i = 0; i < $scope.sprint.backlog.length; i++) {
      var story = $scope.sprint.backlog[i];
      if (story.id != "priority_line") {
        sum += parseInt(story.estimate);
      }
    }

    return sum;
  };

  $scope.getLanguage = function(story) {
    for (var i = 0; i < langs.languages.length; i++) {
      var l = langs.languages[i];
      if (l.id == story.language) {
        return l;
      }
    }
    return langs.EN;
  };

  $scope.storyDone = function(story) {
    return story.tasks.todo.length == 0 && story.tasks.inProgress.length == 0 && story.tasks.review.length == 0;
  };

}]);
