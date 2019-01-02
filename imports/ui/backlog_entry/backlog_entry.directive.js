import './backlog_entry.template.html';
import './backlog_entry.controller.js';


angular.module('scrumboard').directive('backlogEntry', function() {
  return {
    restrict: 'E',
    templateUrl: 'imports/ui/backlog_entry/backlog_entry.template.html',
    controller: 'BacklogEntryController',
    scope: {
      userstory: '=',
      scrum: '=',
      planning: '=',
      initialHideDetails: '=',
      detailsStateLocked: '=',
      itemIndex: '=',
      epics: '=',

      // Dragging
      allowDragging: '=',
      onStartDragging: '=',
      onEndDragging: '=',
      isBeingDragged: '=',
      onInsertBefore: '=',

      // Placement Markers
      showPlacementMarkers: '=',
      onPlacedBehind: '='
    }
  };
});
