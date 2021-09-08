import { Sprite } from "kontra";
import { CELL_WIDTH, CELL_HEIGHT, ROBOT_COUNT } from "./constants";
import { mazeObj } from "./customMaze";
import { generatePath } from "./pathGenerator";

const moveDelta = 1;

const createRobot = () => {
  const Robot = Sprite({
    x: null,
    y: null,
    color: "purple",
    width: Math.min(CELL_WIDTH, CELL_HEIGHT) * 0.8,
    height: Math.min(CELL_WIDTH, CELL_HEIGHT) * 0.8,
    path: null,
    currentIndex: null,
    currentcell: null,

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

    update: function () {
      this.travelAlongPath(this.currentcell);
      if (
        this.x === this.currentcell[0] * CELL_WIDTH &&
        this.y === this.currentcell[1] * CELL_HEIGHT
      ) {
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

  Robot.init();

  return Robot;
};

export const robots = Array(ROBOT_COUNT).fill().map(createRobot);
