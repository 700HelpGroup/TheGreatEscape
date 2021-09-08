import { Sprite, keyPressed, collides, on, emit, SpriteSheet } from "kontra";
import {
  CELL_WIDTH,
  CELL_HEIGHT,
  MAZE_GRID_COUNT,
  WIDTH as CANVAS_WIDTH,
  HEIGHT as CANVAS_HEIGHT,
} from "./constants";
import { mazeObj } from "./customMaze";
import { tileEngine } from "./customMaze";

const moveDelta = 2;
const sx = 1.3;
const sy = 1.3;

export const character = Sprite({
  x: mazeObj.start.col * CELL_WIDTH,
  y: mazeObj.start.row * CELL_HEIGHT,
  width: Math.min(CELL_WIDTH, CELL_HEIGHT) * 0.65,
  height: Math.min(CELL_WIDTH, CELL_HEIGHT) * 0.65,
  updateCharacterMovement: function () {
    const prevX = this.x;
    const prevY = this.y;
    const animationReady = this.animations !== undefined;
    if (animationReady) {
      if (this.direction === "left") this.playAnimation("idleLeft");
      else if (this.direction === "right") this.playAnimation("idleRight");
      else if (this.direction === "up") this.playAnimation("idleUp");
      else this.playAnimation("idleDown");
    }
    if (keyPressed("left")) {
      this.x -= moveDelta;
      if (
        tileEngine &&
        (tileEngine.layerCollidesWith("wall", this) || tileEngine.layerCollidesWith("props", this))
      ) {
        this.x = prevX;
      } else {
        if (tileEngine && tileEngine.sx - sx >= 0) {
          tileEngine.sx -= sx;
        }
      }
      if (animationReady) this.playAnimation("moveLeft");
      this.direction = "left";
    }
    if (keyPressed("right")) {
      this.x += moveDelta;
      if (
        tileEngine &&
        (tileEngine.layerCollidesWith("wall", this) || tileEngine.layerCollidesWith("props", this))
      ) {
        this.x = prevX;
      } else {
        if (tileEngine && tileEngine.sx + sx <= MAZE_GRID_COUNT * CELL_WIDTH - CANVAS_WIDTH) {
          tileEngine.sx += sx;
        }
      }
      if (animationReady) this.playAnimation("moveRight");
      this.direction = "right";
    }
    if (keyPressed("up")) {
      this.y -= moveDelta;
      if (
        tileEngine &&
        (tileEngine.layerCollidesWith("wall", this) || tileEngine.layerCollidesWith("props", this))
      ) {
        this.y = prevY;
      } else {
        if (tileEngine && tileEngine.sy - sy >= 0) {
          tileEngine.sy -= sy;
        }
      }
      if (animationReady) this.playAnimation("moveUp");
      this.direction = "up";
    }
    if (keyPressed("down")) {
      this.y += moveDelta;
      if (
        tileEngine &&
        (tileEngine.layerCollidesWith("wall", this) || tileEngine.layerCollidesWith("props", this))
      ) {
        this.y = prevY;
      } else {
        if (tileEngine && tileEngine.sy + sy <= CELL_HEIGHT * MAZE_GRID_COUNT - CANVAS_HEIGHT) {
          tileEngine.sy += sy;
        }
      }
      if (animationReady) this.playAnimation("moveDown");
      this.direction = "down";
    }
    if (this.x !== prevX || this.y !== prevY) {
      emit("characterMoved");
    }
  },
});

const characterImage = new Image();
characterImage.src = "assets/character.png";
characterImage.onload = function () {
  const spriteSheet = SpriteSheet({
    image: characterImage,
    frameWidth: 16,
    frameHeight: 16,

    animations: {
      idleDown: {
        frames: 0,
      },
      idleUp: {
        frames: 4,
      },
      idleLeft: {
        frames: 12,
      },
      idleRight: {
        frames: 8,
      },
      moveDown: {
        frames: "0..3",
        frameRate: 10,
      },
      moveUp: {
        frames: "4..7",
        frameRate: 10,
      },
      moveRight: {
        frames: "8..11",
        frameRate: 10,
      },
      moveLeft: {
        frames: "12..15",
        frameRate: 10,
      },
    },
  });

  character.animations = spriteSheet.animations;
};
