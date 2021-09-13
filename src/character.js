import { Sprite, keyPressed, SpriteSheet } from "kontra";
import { CELL_WIDTH, CELL_HEIGHT, MAZE_GRID_COUNT, CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants";

const moveDelta = 2;

export const createCharacter = function (characterImage) {
  const spriteSheet = SpriteSheet({
    image: characterImage["character"],
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

  const character = Sprite({
    x: CELL_WIDTH,
    y: CELL_HEIGHT,
    width: Math.min(CELL_WIDTH, CELL_HEIGHT) * 0.65,
    height: Math.min(CELL_WIDTH, CELL_HEIGHT) * 0.65,
    animations: spriteSheet.animations,

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
      if (this.direction === "left") this.playAnimation("idleLeft");
      else if (this.direction === "right") this.playAnimation("idleRight");
      else if (this.direction === "up") this.playAnimation("idleUp");
      else this.playAnimation("idleDown");
      if (keyPressed("left")) {
        this.x -= moveDelta;
        if (!this.isCollidingWithObject(tileEngine)) this.updateCameraX(tileEngine);
        if (this.isCollidingWithObject(tileEngine)) this.x = prevX;
        this.direction = "left";
        this.playAnimation("moveLeft");
      }
      if (keyPressed("right")) {
        this.x += moveDelta;
        if (!this.isCollidingWithObject(tileEngine)) this.updateCameraX(tileEngine);
        if (this.isCollidingWithObject(tileEngine)) this.x = prevX;
        this.direction = "right";
        this.playAnimation("moveRight");
      }
      if (keyPressed("up")) {
        this.y -= moveDelta;
        if (!this.isCollidingWithObject(tileEngine)) this.updateCameraY(tileEngine);
        if (this.isCollidingWithObject(tileEngine)) this.y = prevY;
        this.direction = "up";
        this.playAnimation("moveUp");
      }
      if (keyPressed("down")) {
        this.y += moveDelta;
        if (!this.isCollidingWithObject(tileEngine)) this.updateCameraY(tileEngine);
        if (this.isCollidingWithObject(tileEngine)) this.y = prevY;
        this.direction = "down";
        this.playAnimation("moveDown");
      }
    },
  });

  return character;
};
