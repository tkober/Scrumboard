import { Scrums } from '../../api/collections.js';

import '../personas/personas.directive.js';
import '../backlog/backlog.directive.js';
import '../planning/planning.directive.js';
import '../taskboard/taskboard.directive.js';
import '../burndown/burndown.directive.js';


angular.module('scrumboard').controller('ScrumController', ['$scope', '$reactive', '$location', '$stateParams', function($scope, $reactive, $location, $stateParams) {
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

  $scope.hasNoSprint = function() {
    return $scope.scrum && !$scope.scrum.sprint;
  };

  $scope.view = $scope.hasActiveSprint() ? $scope.SPRINT_BOARD : $scope.SPRINT_PLANNING;

}]);
