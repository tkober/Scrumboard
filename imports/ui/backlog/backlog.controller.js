import '../backlog_entry/backlog_entry.directive.js';
import Epics from '../Epics.js';


angular.module('scrumboard').controller('BacklogController', ['$scope', '$reactive', '$location', function($scope, $reactive, $location) {

  $scope.showPlacementMarks = true;
  $scope.storyToDrag = null;

  $scope.epics = new Epics($scope.scrum.backlog);

  $scope.createUserStory = function() {
    $location.path('/scrums/' + $scope.scrum._id + '/backlog/story');
  };

  $scope.showPersona = function(persona) {
    $scope.$parent.showPersona(persona);
  };

  $scope.onStartDragging = function(storyId) {
    $scope.storyToDrag = storyId;
  };

  $scope.onEndDragging = function() {
    $scope.storyToDrag = null;
  }

  $scope.onInsertBefore = function(storyId) {
    Meteor.call('scrums.userstories.move_before', $scope.scrum._id, $scope.storyToDrag, storyId, (error, result) => {});
  }

}]);
