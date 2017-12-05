import { Boards } from '../../api/collections.js';
import { Lines } from '../../api/collections.js';

import './board.less';


angular.module('scrumboard').controller('BoardController', ['$scope', '$location', '$stateParams', '$reactive', function($scope, $location, $stateParams, $reactive) {

  document.body.style.background = '#353535';

  $scope.tints = [
    '#000000',
    '#2196f3',
    '#4caf50',
    '#ff9800',
    '#ff0000',
    '#9C27B0',
    '#9e9e9e',
    '#ffffff'
  ];

  $scope.backgroundColors = [
    '#ffffff',
    '#fff9c4',
    '#000000'
  ];

  $scope.lineWidths = [
    1,
    2,
    4,
    8,
    10,
    12,
    16,
    18,
    20,
    24,
    30,
    40,
    50
  ];

  $scope.lineCaps = [
    { id: 'butt', title: 'Flat' },
    { id: 'round', title: 'Round' },
    { id: 'square', title: 'Square' }
  ];

  $scope.lineJoins = [
    { id: 'bevel', title: 'Bevel' },
    { id: 'round', title: 'Round' },
    { id: 'Miter', title: 'Miter' }
  ];

  $scope.backgroundColor = $scope.backgroundColors[0];
  $scope.strokeStyle = $scope.tints[0];
  $scope.lineWidth = $scope.lineWidths[1];
  $scope.lineCap = $scope.lineCaps[1];
  $scope.lineJoin = $scope.lineJoins[1];


  var canvas = document.getElementById("board-canvas");
  var ctx = canvas.getContext("2d");

  ctx.strokeStyle = $scope.strokeStyle;
  ctx.lineWith = $scope.lineWidth;
  ctx.lineCap = $scope.lineCap;
  ctx.lineJoin = $scope.lineJoin;

  var drawing = false;
  var mousePos = { x:0, y:0 };
  var lastPos = mousePos;

  canvas.addEventListener("mousedown", function (e) {
    drawing = true;
    lastPos = getMousePos(canvas, e);
    startNewLine(lastPos);
  }, false);

  canvas.addEventListener("mouseup", function (e) {
    drawing = false;
    endCurrentLine();
  }, false);

  canvas.addEventListener("mousemove", function (e) {
    mousePos = getMousePos(canvas, e);
  }, false);

  window.requestAnimFrame = (function (callback) {
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimaitonFrame ||
    function (callback) {
      window.setTimeout(callback, 1000/60);
    };
  })();

  // Draw to the canvas
  function renderCanvas() {
    if (drawing && lastPos != mousePos) {
      addPointToCurrentLine(mousePos);
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(mousePos.x, mousePos.y);
      ctx.stroke();
      lastPos = mousePos;
    }
  }

  // Allow for animation
  (function drawLoop () {
    requestAnimFrame(drawLoop);
    renderCanvas();
  })();

  // Set up touch events for mobile, etc
  canvas.addEventListener("touchstart", function (e) {
    mousePos = getTouchPos(canvas, e);
    startNewLine(mousePos);
    var touch = e.touches[0];
    var mouseEvent = new MouseEvent("mousedown", {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
  }, false);

  canvas.addEventListener("touchend", function (e) {
    var mouseEvent = new MouseEvent("mouseup", {});
    canvas.dispatchEvent(mouseEvent);
    endCurrentLine();
  }, false);

  canvas.addEventListener("touchmove", function (e) {
    var touch = e.touches[0];
    var mouseEvent = new MouseEvent("mousemove", {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
  }, false);

  // Get the position of a touch relative to the canvas
  function getTouchPos(canvasDom, touchEvent) {
    var rect = canvasDom.getBoundingClientRect();
    return {
      x: touchEvent.touches[0].clientX - rect.left,
      y: touchEvent.touches[0].clientY - rect.top
    };
  }


  // Prevent scrolling when touching the canvas
  document.body.addEventListener("touchstart", function (e) {
    if (e.target == canvas) {
      e.preventDefault();
    }
  }, false);

  document.body.addEventListener("touchend", function (e) {
    if (e.target == canvas) {
      e.preventDefault();
    }
  }, false);

  document.body.addEventListener("touchmove", function (e) {
    if (e.target == canvas) {
      e.preventDefault();
    }
  }, false);


  clear = function() {
    canvas.width +=0;
  };

  function startNewLine(initialPosition) {
    ctx.strokeStyle = $scope.strokeStyle;
    ctx.lineWidth = $scope.lineWidth;
    ctx.lineCap = $scope.lineCap.id;
    ctx.lineJoin = $scope.lineJoin.id;
    ctx.beginPath();

    $scope.currentLine = {
      points: [initialPosition],
      lineColor: ctx.strokeStyle,
      lineWidth: ctx.lineWidth,
      lineCap: ctx.lineCap,
      lineJoin: ctx.lineJoin
    };
  }

  function addPointToCurrentLine(point) {
    $scope.currentLine.points.push(point);
  }

  function endCurrentLine() {
    $scope.redoStack = [];
    Meteor.call('lines.create', $scope.boardId, angular.toJson($scope.currentLine), (error, result) => {
      if (error) {
        $scope.error = error;
        $scope.$apply();
      } else {
        $scope.undoStack.push(result);
      }
    });
  }

  function getMousePos(canvasDom, mouseEvent) {
    var rect = canvasDom.getBoundingClientRect();
    return {
      x: mouseEvent.clientX - rect.left,
      y: mouseEvent.clientY - rect.top
    };
  }


  drawLines = function(lines) {
    for (var i = 0; i < lines.length; i++) {
      line = lines[i];
      ctx.beginPath();
      ctx.strokeStyle = line.lineColor;
      ctx.lineWidth = line.lineWidth;
      ctx.lineCap = line.lineCap;
      ctx.lineJoin = line.lineJoin;
      drawLine(line.points);
    }
  };

  function drawLine(points) {
    point = points[0];
    ctx.moveTo(point.x, point.y);
    for (var i = 1; i < points.length; i++) {
      point = points[i];
      ctx.lineTo(point.x, point.y);
    }
    ctx.stroke();
  }






  $reactive(this).attach($scope);
  $scope.boardId = $stateParams.boardId;
  $scope.error = null;
  $scope.linesId = null;

  $scope.undoStack = [];
  $scope.redoStack = [];

  Meteor.subscribe("lines");
  Meteor.subscribe("boards");

  this.autorun(() => {
    lines = $scope.getReactively('lines');
    board = $scope.getReactively('board');

    if (lines && board) {
      clear();
      drawLines(lines);
    }
  });

  $scope.helpers({

    board() {
      result =  Boards.findOne({ _id: $scope.boardId });
      if (result) {
        $scope.linesId = result.linesId;
      }
      return result;
    },

    lines() {
      return Lines.find({
        linesId: this.getReactively('linesId')
      },
      {
        sort: {
          createdAt: 1
        }
      });
    }
  }, true);

  $scope.currentLine = null;

  $scope.setLineColor = function(color) {
    $scope.strokeStyle = color;
  };

  $scope.setLineWidth = function(width) {
    $scope.lineWidth = width;
  };

  $scope.setLineCap = function(lineCap) {
    $scope.lineCap = lineCap;
  };

  $scope.setLineJoin = function(lineJoin) {
    console.log(lineJoin);
    $scope.lineJoin = lineJoin;
  };

  $scope.canUndo = function() {
    return $scope.undoStack.length > 0;
  };

  $scope.canRedo = function() {
    return $scope.redoStack.length > 0;
  };

  $scope.isPerformingUndoRedoAction = false;

  $scope.undo = function() {
    $scope.isPerformingUndoRedoAction = true;
    line = $scope.undoStack[$scope.undoStack.length-1];
    Meteor.call('lines.delete', line._id, (error, result) => {
      if (!error) {
        $scope.error = error;
        $scope.redoStack.push($scope.undoStack.pop());
      }
      $scope.isPerformingUndoRedoAction = false;
    });
  };

  $scope.redo = function() {
    $scope.isPerformingUndoRedoAction = true;
    line = $scope.redoStack[$scope.redoStack.length-1];
    Meteor.call('lines.create', $scope.boardId, angular.toJson(line), (error, result) => {
      if (error) {
        $scope.error = error;
      } else {
        $scope.redoStack.pop();
        $scope.undoStack.push(result);
      }
      $scope.isPerformingUndoRedoAction = false;
    });
  };

  $scope.isOwner = function() {
    if ($scope.board) {
      return $scope.board.owner == Meteor.userId();
    }
    return false;
  };

  $scope.changeBackgroundColor = function(color) {
    Meteor.call('boards.change-color', $scope.board._id, color, (error, result) => {
      $scope.error = error;
    });
  };

  $scope.changeDimensions = function(width, height) {
    Meteor.call('boards.resize', $scope.board._id, width, height, (error, result) => {
      $scope.error = error;
    });
  };

  $scope.incrementHeight = function() {
    $scope.changeDimensions($scope.board.width, $scope.board.height+200);
  };

  $scope.decrementHeight = function() {
    $scope.changeDimensions($scope.board.width, Math.max($scope.board.height-200, 0));
  };

  $scope.incrementWidth = function() {
    $scope.changeDimensions($scope.board.width+50, $scope.board.height);
  };

  $scope.decremtenWidth = function() {
    $scope.changeDimensions(Math.max($scope.board.width-50, 0), $scope.board.height);
  };


}]);
