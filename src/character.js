import { Sprite, keyPressed } from "kontra";
import {
  CELL_WIDTH,
  CELL_HEIGHT,
  MAZE_GRID_COUNT,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} from "./constants";

const moveDelta = 2;

export const createCharacter = function () {
  const character = Sprite({
    x: CELL_WIDTH,
    y: CELL_HEIGHT,
    width: Math.min(CELL_WIDTH, CELL_HEIGHT) * 0.65,
    height: Math.min(CELL_WIDTH, CELL_HEIGHT) * 0.65,
    color: "coral",

    reset: function () {
      this.x = CELL_WIDTH;
      this.y = CELL_HEIGHT;
      this.direction = undefined;
    },

    isCollidingWithObject: function (tileEngine) {
      return tileEngine && tileEngine.layerCollidesWith("wall", this);
    },

    updateCameraY: function (tileEngine) {
      if (MAZE_GRID_COUNT * CELL_HEIGHT > CANVAS_HEIGHT) {
        tileEngine.sy = character.y - CANVAS_HEIGHT / 2;
      }
    },

    updateCameraX: function (tileEngine) {
      if (MAZE_GRID_COUNT * CELL_WIDTH > CANVAS_WIDTH) {
        tileEngine.sx = character.x - CANVAS_WIDTH / 2;
      }
    },

    updateCharacterMovement: function (tileEngine) {
      const prevX = this.x;
      const prevY = this.y;
      if (keyPressed("left")) {
        this.x -= moveDelta;
        if (!this.isCollidingWithObject(tileEngine))
          this.updateCameraX(tileEngine);
        if (this.isCollidingWithObject(tileEngine)) this.x = prevX;
      }
      if (keyPressed("right")) {
        this.x += moveDelta;
        if (!this.isCollidingWithObject(tileEngine))
          this.updateCameraX(tileEngine);
        if (this.isCollidingWithObject(tileEngine)) this.x = prevX;
      }
      if (keyPressed("up")) {
        this.y -= moveDelta;
        if (!this.isCollidingWithObject(tileEngine))
          this.updateCameraY(tileEngine);
        if (this.isCollidingWithObject(tileEngine)) this.y = prevY;
      }
      if (keyPressed("down")) {
        this.y += moveDelta;
        if (!this.isCollidingWithObject(tileEngine))
          this.updateCameraY(tileEngine);
        if (this.isCollidingWithObject(tileEngine)) this.y = prevY;
      }
    },
  });

  return character;
};
