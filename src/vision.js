import { Sprite } from "kontra";
import { CELL_HEIGHT, CELL_WIDTH, HEIGHT, WIDTH } from "./constants";
import { mazeObj } from "./customMaze";

export const createVision = (robot) => {
  return Sprite({
    robot: null,
    x: null,
    y: null,
    maxWidth: 50,
    width: 50,
    height: robot.height,
    rotationLookup: {
      up: -Math.PI / 2,
      down: Math.PI / 2,
      left: Math.PI,
      right: 0,
    },
    findNearestWall() {
      if (robot.direction === "up") {
        let y = this.y;
        while (y > 0) {
          const cell = mazeObj.findCell(this.x, y);
          if (cell.value !== " ") return cell;
          y -= CELL_HEIGHT;
        }
      } else if (robot.direction === "down") {
        let y = this.y;
        while (y < HEIGHT) {
          const cell = mazeObj.findCell(this.x, y);
          if (cell.value !== " ") return cell;
          y += CELL_HEIGHT;
        }
      } else if (robot.direction === "left") {
        let x = this.x;
        while (x > 0) {
          const cell = mazeObj.findCell(x, this.y);
          if (cell.value !== " ") return cell;
          x -= CELL_WIDTH;
        }
      } else if (robot.direction === "right") {
        let x = this.x;
        while (x < WIDTH) {
          const cell = mazeObj.findCell(x, this.y);
          if (cell.value !== " ") return cell;
          x += CELL_WIDTH;
        }
      }
      return null;
    },
    findDistanceToNearestWall() {
      const wall = this.findNearestWall();
      if (!wall) return Number.MAX_SAFE_INTEGER;
      switch (robot.direction) {
        case "up":
          return Math.abs(this.y - (wall.row * CELL_HEIGHT + CELL_HEIGHT));
        case "down":
          return Math.abs(this.y - wall.row * CELL_HEIGHT);
        case "left":
          return Math.abs(this.x - (wall.col * CELL_WIDTH + CELL_WIDTH));
        case "right":
          return Math.abs(this.x - wall.col * CELL_WIDTH);
        default:
          return Number.MAX_SAFE_INTEGER;
      }
    },
    update() {
      this.x = robot.x + robot.width / 2;
      this.y = robot.y + robot.height / 2;
      this.width = Math.min(this.maxWidth, this.findDistanceToNearestWall());
    },
    render() {
      const gradient = this.context.createLinearGradient(0, 0, this.width, 0);
      gradient.addColorStop(0, "rgba(255, 255, 0, 0.25)");
      gradient.addColorStop(0.75, "rgba(255, 255, 0, 0.25)");
      gradient.addColorStop(1, "rgba(255, 255, 0, 0)");
      this.context.fillStyle = gradient;
      this.context.rotate(this.rotationLookup[robot.direction]);
      this.context.beginPath();
      this.context.moveTo(0, 0);
      this.context.lineTo(
        this.width,
        (-this.height * this.width) / this.maxWidth / 2
      );
      this.context.lineTo(
        this.width,
        (this.height * this.width) / this.maxWidth / 2
      );
      this.context.fill();
    },
  });
};
