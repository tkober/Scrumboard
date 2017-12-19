import { Scrums } from '../../api/collections.js'

import '../scrum_entry/scrum_entry.directive.js';


angular.module('scrumboard').controller('HomeController', ['$scope', '$reactive', '$location', function($scope, $reactive, $location) {
  $reactive(this).attach($scope);

  Meteor.subscribe("scrums");

  $scope.helpers({
    scrums() {
      return Scrums.find({
        '$or': [
          { owner: Meteor.userId() },
          { participants: Meteor.userId() }
        ]
      },
      {
        sort: {
          createdAt: -1
        }
      });
    }
  }, true);

  $scope.email = function() {
    return Meteor.user() ? Meteor.user().emails[0].address : '';
  };

  $scope.logout = function() {
    Meteor.logout(function(error) {
    });
  };

  $scope.newBoard = function() {
    $location.path('/scrums');
  };

}]);
