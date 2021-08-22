import generateMaze from "./maze.js";
import { init, Sprite, GameLoop, initKeys, keyPressed, collides } from "kontra";

//states
let moveDelta = 2;
let mazeSprite = [];

//initialization
const { canvas } = init();
initKeys();

const getCellColor = (value) => {
  switch (value) {
    case "#":
      return "black";
    case "S":
      return "green";
    case "E":
      return "red";
    default:
      return "blue";
  }
};

//object creation
const mazeObj = generateMaze(20);
const numRows = mazeObj.contents.length;
const numCols = mazeObj.contents[0].length;
const cellWidth = 1000 / numCols;
const cellHeight = 400 / numRows;
for (let row = 0; row < numRows; row++) {
  for (let col = 0; col < numCols; col++) {
    const rectX = col * cellWidth;
    const rectY = row * cellHeight;
    const mazeItem = Sprite({
      x: rectX,
      y: rectY,
      color: getCellColor(mazeObj.contents[row][col].value),
      width: cellWidth,
      height: cellHeight,
      isWall: mazeObj.contents[row][col].value === "#",
    });
    mazeSprite.push(mazeItem);
  }
}

const character = Sprite({
  x: mazeObj.start.col * cellWidth,
  y: mazeObj.start.row * cellHeight,
  color: "white",
  width: Math.min(cellWidth, cellHeight) * 0.8,
  height: Math.min(cellWidth, cellHeight) * 0.8,
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
  },
});

//game loop
const loop = GameLoop({
  update: function () {
    character.update();
  },
  render: function () {
    mazeSprite.forEach((sprite) => sprite.render());
    character.render();
  },
});

console.log(generateMaze(10));

loop.start();
