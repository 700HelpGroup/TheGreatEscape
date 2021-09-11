import { Sprite } from "kontra";

export const createVision = (robot) => {
  return Sprite({
    robot: null,
    x: null,
    y: null,
    width: null,
    height: null,
    breadth: robot.width,
    length: 100,
    color: "rgba(255, 255, 0, 0.5)",
    getX() {
      switch (robot.direction) {
        case "up":
        case "down":
          return robot.x;
        case "left":
          return robot.x - this.length;
        case "right":
          return robot.x + robot.width;
      }
    },
    getY() {
      switch (robot.direction) {
        case "up":
          return robot.y - this.length;
        case "down":
          return robot.y + robot.height;
        case "left":
        case "right":
          return robot.y;
      }
    },
    getWidth() {
      return ["up", "down"].includes(robot.direction)
        ? this.breadth
        : this.length;
    },
    getHeight() {
      return ["up", "down"].includes(robot.direction)
        ? this.length
        : this.breadth;
    },
    update() {
      this.x = this.getX();
      this.y = this.getY();
      this.width = this.getWidth();
      this.height = this.getHeight();
    },
    render() {},
  });
};
