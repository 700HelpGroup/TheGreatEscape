import { CELL_HEIGHT, CELL_WIDTH } from "./constants";

const Cell = function (cellType) {
  this.value = cellType;
  this.row = null;
  this.column = null;
  this.distance = null;
  this.pred = null;
  this.bfsColor = "white";
};

Cell.prototype.setPos = function (row, col) {
  this.row = row;
  this.col = col;
};

Cell.prototype.getNeighbors = function () {
  const row = this.row;
  const col = this.col;
  return [
    [row - 1, col - 1],
    [row - 1, col],
    [row - 1, col + 1],
    [row, col - 1],
    [row, col + 1],
    [row + 1, col - 1],
    [row + 1, col],
    [row + 1, col + 1],
  ];
};

Cell.prototype.getNeighboringCells = function (maze) {
  const content = maze["contents"];
  const prevRow = Math.max(this.row - 1, 0);
  const nextRow = Math.min(this.row + 1, content[0].length - 1);
  const prevCol = Math.max(this.col - 1, 0);
  const nextCol = Math.min(this.col + 1, content.length - 1);

  return {
    topLeft: content[prevRow][prevCol],
    top: content[prevRow][this.col],
    topRight: content[prevRow][nextCol],
    left: content[this.row][prevCol],
    right: content[this.row][nextCol],
    bottomLeft: content[nextRow][prevCol],
    bottom: content[nextRow][this.col],
    bottomRight: content[nextRow][nextCol],
  };
};

Cell.prototype.setDistance = function (distance) {
  this.distance = distance;
};

Cell.prototype.getDistance = function () {
  return this.distance;
};

Cell.prototype.getBFSColor = function () {
  return this.bfsColor;
};

Cell.prototype.setBFSColor = function (color) {
  this.bfsColor = color;
};

Cell.prototype.setBFSColor = function (color) {
  this.bfsColor = color;
};

Cell.prototype.setPred = function (pred) {
  this.pred = pred;
};

Cell.prototype.getPred = function () {
  return this.pred;
};

Cell.prototype.isWall = function () {
  return this.value === "#";
};

Cell.prototype.isGround = function () {
  return this.value === " ";
};

Cell.prototype.isStart = function () {
  return this.value === "S";
};

Cell.prototype.isEnd = function () {
  return this.value === "E";
};

var Maze = function () {
  this.contents = [];
  this.start = null;
  this.end = null;
};

var Maze = function () {
  this.contents = [];
  this.start = null;
  this.end = null;
};

Maze.prototype.initContents = function (desiredRes) {
  for (let i = 0; i < desiredRes; i++) {
    this.contents.push([]);
    for (let j = 0; j < desiredRes; j++) {
      if (i == 0 || i == desiredRes - 1 || j == 0 || j == desiredRes - 1) {
        let cell = new Cell("#");
        cell.setPos(i, j);
        this.contents[i].push(cell);
      } else {
        let cell = new Cell(" ");
        cell.setPos(i, j);
        this.contents[i].push(cell);
      }
    }
  }
};

Maze.prototype.generator = function ([x1, x2], [y1, y2], desiredRes) {
  let width = x2 - x1;
  let height = y2 - y1;
  if (width >= height) {
    // vertical bisection
    if (x2 - x1 > 3) {
      let bisection = Math.ceil((x1 + x2) / 2);
      let max = y2 - 1;
      let min = y1 + 1;
      let randomPassage = Math.floor(Math.random() * (max - min + 1)) + min;
      let first = false;
      let second = false;
      if (this.contents[y2][bisection].value == " ") {
        randomPassage = max;
        first = true;
      }
      if (this.contents[y1][bisection].value == " ") {
        randomPassage = min;
        second = true;
      }
      for (let i = y1 + 1; i < y2; i++) {
        if (first && second) {
          if (i == max || i == min) {
            continue;
          }
        } else if (i == randomPassage) {
          continue;
        }
        this.contents[i][bisection].value = "#";
      }
      this.generator([x1, bisection], [y1, y2], desiredRes);
      this.generator([bisection, x2], [y1, y2], desiredRes);
    }
  } else {
    // horizontal bisection
    if (y2 - y1 > 3) {
      let bisection = Math.ceil((y1 + y2) / 2);
      let max = x2 - 1;
      let min = x1 + 1;
      let randomPassage = Math.floor(Math.random() * (max - min + 1)) + min;
      let first = false;
      let second = false;
      if (this.contents[bisection][x2].value == " ") {
        randomPassage = max;
        first = true;
      }
      if (this.contents[bisection][x1].value == " ") {
        randomPassage = min;
        second = true;
      }
      for (let i = x1 + 1; i < x2; i++) {
        if (first && second) {
          if (i == max || i == min) {
            continue;
          }
        } else if (i == randomPassage) {
          continue;
        }
        this.contents[bisection][i].value = "#";
      }
      this.generator([x1, x2], [y1, bisection], desiredRes);
      this.generator([x1, x2], [bisection, y2], desiredRes);
    }
  }
};

Maze.prototype.getEmptySlots = function () {
  let emptySlots = [];
  for (let row = 0; row < this.contents.length; row++) {
    for (let col = 0; col < this.contents[0].length; col++) {
      if (this.contents[row][col].value == " ") {
        emptySlots.push(this.contents[row][col]);
      }
    }
  }
  return emptySlots;
};

Maze.prototype.initPoints = function () {
  let emptySlots = this.getEmptySlots();
  if (emptySlots.length > 1) {
    this.start = emptySlots[0];
    this.end = emptySlots[emptySlots.length - 1];
    this.start.value = "S";
    this.end.value = "E";
  }
};

Maze.prototype.shortestBFS = function (end = this.end) {
  let start = end;
  start.setDistance(0);
  start.setPred(null);
  let cellQueue = []; // enqueue is push - dequeue is shift
  cellQueue.push(start);
  while (cellQueue.length > 0) {
    let currentCell = cellQueue.shift();
    let neighbors = currentCell.getNeighbors();
    for (let neighbor of neighbors) {
      let row = neighbor[0];
      let col = neighbor[1];
      if (row >= 0 && col >= 0 && row < this.contents.length && col < this.contents[0].length) {
        let cell = this.contents[row][col];
        if (cell.getBFSColor() == "white" && cell.value != "#") {
          cell.setBFSColor("gray");
          cell.setDistance(currentCell.getDistance() + 1);
          cell.setPred(currentCell);
          cellQueue.push(cell);
        }
      }
    }
    currentCell.setBFSColor("black");
  }
};

Maze.prototype.bfsTraverse = function (currentCell) {
  currentCell.value = "P";
};

Maze.prototype.clearSolution = function () {
  for (let row of this.contents) {
    for (let element of row) {
      if (element.value == "P") {
        element.value = " ";
      }
      if (element.getPred()) {
        element.setPred(null);
      }
      if (element.getBFSColor() !== "white") {
        element.setBFSColor("white");
      }
      if (element.getDistance() != null) {
        element.setDistance(null);
      }
    }
  }
};

Maze.prototype.findCell = function (x, y) {
  const row = Math.floor(y / CELL_HEIGHT);
  const col = Math.floor(x / CELL_WIDTH);
  return this.contents[row][col];
};

function generateMaze(_size) {
  const myMaze = new Maze();
  myMaze.initContents(_size);
  myMaze.generator([0, _size - 1], [0, _size - 1], _size);
  myMaze.initPoints();
  return myMaze;
}

export default generateMaze;
