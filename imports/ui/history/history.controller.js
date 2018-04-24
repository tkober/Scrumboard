import { RetiredSprints } from '../../api/collections.js';


angular.module('scrumboard').controller('HistoryController', ['$scope', '$reactive', '$location', function($scope, $reactive, $location) {
  $reactive(this).attach($scope);

  Meteor.subscribe("retired_sprints", $scope.scrum._id);

  $scope.helpers({
    retiredSprints() {
      return RetiredSprints.find({
      },
      {
        sort: {
          begin: -1
        }
      });
    }
  }, true);

}]);
