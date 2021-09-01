import { Sprite, keyPressed, collides, on, emit, SpriteSheet } from "kontra";
import { CELL_WIDTH, CELL_HEIGHT } from "./constants";
import { mazeObj, mazeSprite } from "./customMaze";

const moveDelta = 2;

const adjustWindowScroll = () => {
  const characterPos = {
    x: character.x + character.width / 2,
    y: character.y + character.height / 2,
  };
  scroll(characterPos.x - innerWidth / 2, characterPos.y - innerHeight / 2);
};

on("characterMoved", adjustWindowScroll);
addEventListener("resize", adjustWindowScroll);

//prevent browser from preserving scroll position on refresh
addEventListener("beforeunload", () => {
  scroll(0, 0);
});

export const character = Sprite({
  x: mazeObj.start.col * CELL_WIDTH,
  y: mazeObj.start.row * CELL_HEIGHT,
  width: Math.min(CELL_WIDTH, CELL_HEIGHT) * 0.8,
  height: Math.min(CELL_WIDTH, CELL_HEIGHT) * 0.8,
  updateCharacterMovement: function () {
    const prevX = this.x;
    const prevY = this.y;
    const animationReady = this.animations !== undefined;
    if (animationReady) this.playAnimation("idle");
    if (keyPressed("left")) {
      this.x -= moveDelta;
      if (mazeSprite.some((maze) => maze.isWall && collides(maze, this))) {
        this.x = prevX;
      }
      if (animationReady) this.playAnimation("moveLeft");
    }
    if (keyPressed("right")) {
      this.x += moveDelta;
      if (mazeSprite.some((maze) => maze.isWall && collides(maze, this))) {
        this.x = prevX;
      }
      if (animationReady) this.playAnimation("moveRight");
    }
    if (keyPressed("up")) {
      this.y -= moveDelta;
      if (mazeSprite.some((maze) => maze.isWall && collides(maze, this))) {
        this.y = prevY;
      }
      if (animationReady) this.playAnimation("moveUp");
    }
    if (keyPressed("down")) {
      this.y += moveDelta;
      if (mazeSprite.some((maze) => maze.isWall && collides(maze, this))) {
        this.y = prevY;
      }
      if (animationReady) this.playAnimation("moveDown");
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
      idle: {
        frames: 0,
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
