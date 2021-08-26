import { Sprite, keyPressed, collides, on, emit } from "kontra";
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
  color: "white",
  width: Math.min(CELL_WIDTH, CELL_HEIGHT) * 0.8,
  height: Math.min(CELL_WIDTH, CELL_HEIGHT) * 0.8,
  update: function () {
    const prevX = this.x;
    const prevY = this.y;
    if (keyPressed("left")) {
      this.x -= moveDelta;
      if (mazeSprite.some((maze) => maze.isWall && collides(maze, this))) {
        this.x = prevX;
      }
    }
    if (keyPressed("right")) {
      this.x += moveDelta;
      if (mazeSprite.some((maze) => maze.isWall && collides(maze, this))) {
        this.x = prevX;
      }
    }
    if (keyPressed("up")) {
      this.y -= moveDelta;
      if (mazeSprite.some((maze) => maze.isWall && collides(maze, this))) {
        this.y = prevY;
      }
    }
    if (keyPressed("down")) {
      this.y += moveDelta;
      if (mazeSprite.some((maze) => maze.isWall && collides(maze, this))) {
        this.y = prevY;
      }
    }
    if (this.x !== prevX || this.y !== prevY) {
      emit("characterMoved");
    }
  },
});
