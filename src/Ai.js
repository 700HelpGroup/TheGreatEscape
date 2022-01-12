import { Sprite } from "kontra";
import { CELL_WIDTH, CELL_HEIGHT } from "./constants";
import { generatePath } from "./pathGenerator";
import { createVision } from "./vision";

const moveDelta = 0.5;

//function creates a robot
//make robotlings
//waiting for new feature
export const createRobot = (mazeObj) => {
  const robot = Sprite({
    x: null,
    y: null,
    direction: "n/a",
    width: Math.min(CELL_WIDTH, CELL_HEIGHT) * 0.8,
    height: Math.min(CELL_WIDTH, CELL_HEIGHT) * 0.8,
    path: null,
    currentIndex: null,
    currentcell: null,
    color: "royalblue",

    init: function () {
      this.resetPath();
      this.x = this.path[0][0] * CELL_WIDTH;
      this.y = this.path[0][1] * CELL_HEIGHT;
    },

    resetPath: function (start = null, end = null) {
      this.path = generatePath(mazeObj, start, end).map((cell) => [
        cell.col,
        cell.row,
      ]);
      this.currentIndex = 0;
      this.currentcell = this.path[this.currentIndex];
    },

    travelAlongPath: function () {
      var x = this.currentcell[0] * CELL_WIDTH;
      var y = this.currentcell[1] * CELL_HEIGHT;

      if (this.x >= x) {
        this.x -= moveDelta;
      } else {
        this.x += moveDelta;
      }
      if (this.y >= y) {
        this.y -= moveDelta;
      } else {
        this.y += moveDelta;
      }
    },

    determineDirection: function () {
      if (this.currentIndex < this.path.length - 1) {
        var nextCell = this.path[this.currentIndex + 1];
        var currX = this.currentcell[0];
        var currY = this.currentcell[1];
        var nextX = nextCell[0];
        var nextY = nextCell[1];
        if (currX > nextX) {
          this.direction = "left";
        }
        if (currX < nextX) {
          this.direction = "right";
        } else {
          if (currY < nextY) {
            this.direction = "down";
          }

          if (currY > nextY) {
            this.direction = "up";
          }
        }
      }
    },

    updateMovement: function () {
      const prevX = this.x;
      const prevY = this.y;
      this.travelAlongPath(this.currentcell);
      if (
        this.x === this.currentcell[0] * CELL_WIDTH &&
        this.y === this.currentcell[1] * CELL_HEIGHT
      ) {
        this.determineDirection();
        this.currentIndex++;

        if (this.currentIndex === this.path.length) {
          this.resetPath(
            mazeObj.contents[this.currentcell[1]][this.currentcell[0]]
          );
        }
      }
      this.currentcell = this.path[this.currentIndex];
    },
  });

  robot.init();

  const vision = createVision(robot);

  return { robot, vision };
};
