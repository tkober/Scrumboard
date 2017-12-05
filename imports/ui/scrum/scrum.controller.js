import { Scrums } from '../../api/collections.js';

import '../personas/personas.directive.js';
import '../backlog/backlog.directive.js';


angular.module('scrumboard').controller('ScrumController', ['$scope', '$reactive', '$location', '$stateParams', function($scope, $reactive, $location, $stateParams) {
  $reactive(this).attach($scope);

  $scope.scrumId = $stateParams.scrumId;

  $scope.SPRINT_BOARD = 0;
  $scope.RETROSPECTIVE = 1;
  $scope.BURNDOWN = 2;
  $scope.BACKLOG = 3;
  $scope.PERSONAS = 4;
  $scope.HISTORY = 5;
  $scope.view = $scope.SPRINT_BOARD;

  Meteor.subscribe("scrums");

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

}]);
