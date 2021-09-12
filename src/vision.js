import { Sprite } from "kontra";
import { CELL_HEIGHT, CELL_WIDTH, CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants";
import { mazeObj } from "./customMaze";

export const createVision = (robot) => {
  return Sprite({
    robot: null,
    x: null,
    y: null,
    maxWidth: 50,
    width: 50,
    height: robot.height,
    boundingRect: { x: 0, y: 0, width: 0, height: 0 },
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
        while (y < CANVAS_HEIGHT) {
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
        while (x < CANVAS_WIDTH) {
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
    getBoundingRect() {
      switch (robot.direction) {
        case "up":
          return {
            x: this.x - this.height / 2,
            y: this.y - this.width,
            width: this.height,
            height: this.width,
          };
        case "down":
          return {
            x: this.x - this.height / 2,
            y: this.y,
            width: this.height,
            height: this.width,
          };
        case "left":
          return {
            x: this.x - this.width,
            y: this.y - this.height / 2,
            width: this.width,
            height: this.height,
          };
        case "right":
          return {
            x: this.x,
            y: this.y - this.height / 2,
            width: this.width,
            height: this.height,
          };
        default:
          return null;
      }
    },
    update() {
      this.x = robot.x + robot.width / 2;
      this.y = robot.y + robot.height / 2;
      this.width = Math.min(this.maxWidth, this.findDistanceToNearestWall());
      this.boundingRect = this.getBoundingRect() ?? this.boundingRect;
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
      this.context.lineTo(this.width, (-this.height * this.width) / this.maxWidth / 2);
      this.context.lineTo(this.width, (this.height * this.width) / this.maxWidth / 2);
      this.context.fill();
    },
  });
};
