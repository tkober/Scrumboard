import { Scrums } from '../../api/collections.js';

import '../personas/personas.directive.js';
import '../backlog/backlog.directive.js';
import '../planning/planning.directive.js';
import '../taskboard/taskboard.directive.js';
import '../burndown/burndown.directive.js';
import '../retrospective/retrospective.directive.js';


angular.module('scrumboard').controller('ScrumController', ['$scope', '$reactive', '$location', '$stateParams', '$timeout', '$window',
  function($scope, $reactive, $location, $stateParams, $timeout, $window) {
  $reactive(this).attach($scope);
  Meteor.subscribe("scrums");

  $scope.scrumId = $stateParams.scrumId;

  $scope.SPRINT_BOARD = 0;
  $scope.RETROSPECTIVE = 1;
  $scope.BURNDOWN = 2;
  $scope.BACKLOG = 3;
  $scope.PERSONAS = 4;
  $scope.HISTORY = 5;
  $scope.SPRINT_PLANNING = 6;

  $scope.DIFFICULTIES = [
    { number: 1, text: "Done that like a 1000 times." },
    { number: 2, text: "Already done that and know how to do it." },
    { number: 3, text: "I know how to do it but didn't do it yet." },
    { number: 4, text: "Doable but there are open questions." },
    { number: 5, text: "No Idea how to build that." }
  ];

  $scope.taskDescription = null;
  $scope.taskDifficulty = 0;

  $scope.helpers({

    scrum() {
      return Scrums.findOne({ _id: $scope.scrumId });
    }
  }, true);

  $scope.email = function() {
    return Meteor.user() ? Meteor.user().emails[0].address : '';
  };

  $scope.logout = function() {
    Meteor.logout(function(error) {
    });
  };

  $scope.hasActiveSprint = function() {
    return $scope.scrum && $scope.scrum.sprint && $scope.scrum.sprint.status == 'active';
  };

  $scope.hasNotStartedSprint = function() {
    return $scope.scrum && $scope.scrum.sprint && $scope.scrum.sprint.status == 'planning';
  };

  $scope.hasEndedSprint = function() {
    return $scope.scrum && $scope.scrum.sprint && $scope.scrum.sprint.status == 'ended';
  };

  $scope.hasNoSprint = function() {
    return $scope.scrum && !$scope.scrum.sprint;
  };

  var setInitialView = function() {
    $scope.view = $scope.SPRINT_BOARD;
    if ($scope.hasNoSprint() || $scope.hasNotStartedSprint()) {
      $scope.view = $scope.SPRINT_PLANNING;
    }
    if ($scope.hasEndedSprint()) {
      $scope.view = $scope.RETROSPECTIVE;
    }
  };

  if (!$scope.scrum) {
    $timeout(function() {
      setInitialView();
    }, 500);
  } else {
    setInitialView();
  }


  var isStoryDone = function(story) {
    return (story.tasks.todo.length +
      story.tasks.inProgress.length +
      story.tasks.review.length) == 0;
  };

  $scope.showEndSprint = function() {
    $scope.undoneStories = [];

    for (var i = 0; i < $scope.scrum.sprint.backlog.length; i++) {
      var story = $scope.scrum.sprint.backlog[i];
      if (!isStoryDone(story)) {
        $scope.undoneStories.push({
          'story': story,
          'putBack': true
        });
      }
    }
    $('#end_sprint_modal').modal('show');
  };

  $scope.showRetireSprint = function() {
    $('#retire_sprint_modal').modal('show');
  };

  $scope.endSprint = function() {
    $timeout(function() {
      var storiesToDelete = [];
      for (var i = 0; i < $scope.undoneStories.length; i++) {
        var item = $scope.undoneStories[i];
        if (!item.putBack) {
          storiesToDelete.push(item.story.id);
        }
      }
      Meteor.call('scrums.sprint.end', $scope.scrum._id, angular.toJson(storiesToDelete), (error) => {
        $scope.error = error;
        if (!error) {
          $window.location.reload();
        }
      });
    }, 500);
  };

  $scope.retireSprint = function() {
    $timeout(function() {
      Meteor.call('scrums.sprint.retire', $scope.scrum._id, (error) => {
        $scope.error = error;
        if (!error) {
          $window.location.reload();
        }
      });
    }, 500);
  };

  $scope.createTask = function(storyId) {
    $scope.taskDescription = null;
    $scope.taskDifficulty = 0;
    $scope.createTask_storyId = storyId;
    $('#createTaskModal').modal('show');
  };

  $scope.setTaskDifficulty = function(difficulty) {
    $scope.taskDifficulty = difficulty;
  };

  $scope.isValidTask = function() {
    return $scope.taskDescription != null && $scope.taskDescription.length > 0 &&
      $scope.taskDifficulty > 0;
  };

  $scope.saveTask = function() {
    $timeout(function() {
      Meteor.call('scrums.userstories.createTask', $scope.scrum._id,
      $scope.createTask_storyId, $scope.taskDescription, $scope.taskDifficulty, (error) => {
        $scope.error = error;
      });
    }, 500);
  };

}]);
