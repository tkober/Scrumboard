angular.module('scrumboard').controller('BurndownChartController', ['$scope', '$filter', function($scope, $filter) {

  var idFromTimestamp = function(date) {
    return $filter('date')(date, 'dd.MM.yyyy');
  };

  var resultElement = function(date) {
    return {
      id: idFromTimestamp(date),
      label: $filter('date')(date, 'EEE') ,
      counts: {
        "total": 0,
        "todo": 0,
        "inProgress": 0,
        "review": 0
      },
      isFuture: date > new Date()
    };
  }

  var calculateBurndown = function(sprint) {
    var begin = sprint.begin;
    var end = sprint.end;
    if (sprint.status == 'active') {
      if (end < new Date()) {
        end = new Date();
      }  
    }

    var currentDate = new Date(begin);
    var result = [];
    while (currentDate <= end) {
      result.push(resultElement(currentDate));
      currentDate.setTime(currentDate.getTime() + (24 * 60 * 60 * 1000));
    }

    var prevCount = 0;
    var prevId = 0;

    var countMap = {};
    for (var i = 0; i < sprint.burndown.length; i++) {
      var snapshot = sprint.burndown[i];
      var openCount = snapshot.todo + snapshot.inProgress + snapshot.review;
      countMap[idFromTimestamp(snapshot.timestamp)] = {
        "total": openCount,
        "todo": snapshot.todo,
        "inProgress": snapshot.inProgress,
        "review": snapshot.review
      };
    }

    var max = 0;
    var last = 0;
    for (var i = 0; i < result.length; i++) {
      var day = result[i];
      if (countMap[day.id]) {
        var counts = countMap[day.id];
        max = Math.max(max, counts.total);
        day.counts = counts;
        last = counts;
      } else if (!day.isFuture) {
        day.counts = last;
      }
    }

    $scope.begin = begin;
    $scope.end = end;
    $scope.days = result;
    $scope.maximumTaskCount = max;
  };
  calculateBurndown($scope.sprint);

}]);
