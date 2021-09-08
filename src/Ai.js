import { Sprite, keyPressed, collides, on, emit } from "kontra";
import { CELL_WIDTH, CELL_HEIGHT } from "./constants";
import { mazeObj, mazeSprite } from "./customMaze";
import { character } from "./character";
import { Cell } from "./maze";
import { generatePath } from "./pathGenerator";

const moveDelta = 1;
//var state = "Stop";
var direction = "right";
var RightCount = 0;
var LeftCount = 0;
var UpCount = 0;
var DownCount = 0;
var listOfDirections = ["left", "right", "up", "down"];
var path;
var currentIndex;
var currentcell;

const resetPath = (start = null, end = null) => {
  path = generatePath(mazeObj, start, end).map((cell) => [cell.col, cell.row]);
  currentIndex = 0;
  currentcell = path[currentIndex];
  console.log("path", path);
};

resetPath();

function travelAlongPath(currentCell) {
  var x = currentCell[0] * CELL_WIDTH;
  var y = currentCell[1] * CELL_HEIGHT;
  if (Robot.x >= x) {
    Robot.x -= moveDelta;
    //}
  } else {
    Robot.x += moveDelta;
    //  }
  }
  if (Robot.y >= y) {
    Robot.y -= moveDelta;
    //}
  } else {
    Robot.y += moveDelta;
  }
}

function checkValue(a, b, c, d) {
  if (a === c && b === d) {
    return true;
  }
}

function GetCell(x, y) {
  //columns are x
  var rowValue = Math.floor(y / 32);
  //rows are y
  var colValue = Math.floor(x / 32);
  return mazeObj.contents[rowValue][colValue];
}

function choose(choices) {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}
var direction = choose(listOfDirections);

const adjustWindowScroll = () => {
  const RobotPos = {
    x: Robot.x + Robot.width / 2,
    y: Robot.y + Robot.height / 2,
  };
  scroll(RobotPos.x - innerWidth / 2, RobotPos.y - innerHeight / 2);
};

export const Robot = Sprite({
  x: path[0][0] * CELL_WIDTH,
  y: path[0][1] * CELL_HEIGHT,
  color: "purple",
  width: Math.min(CELL_WIDTH, CELL_HEIGHT) * 0.8,
  height: Math.min(CELL_WIDTH, CELL_HEIGHT) * 0.8,

  update: function () {
    const prevX = this.x;
    const prevY = this.y;

    travelAlongPath(currentcell);
    if (
      checkValue(
        this.x,
        this.y,
        currentcell[0] * CELL_WIDTH,
        currentcell[1] * CELL_HEIGHT
      )
    ) {
      currentIndex++;
      console.log(currentIndex, path.length);
      if (currentIndex === path.length) {
        console.log(currentcell);
        console.log(mazeObj.contents[currentcell[1]][currentcell[0]]);
        resetPath(mazeObj.contents[currentcell[1]][currentcell[0]]);
      }
    }
    currentcell = path[currentIndex];
  },
});
