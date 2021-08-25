import generateMaze from "./maze.js";
import {
  init,
  Sprite,
  GameLoop,
  initKeys,
  keyPressed,
  collides,
  emit,
  on,
} from "kontra";

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

const WIDTH = 2000;
const HEIGHT = 800;
const MAZE_GRID_COUNT = 40;

canvas.width = WIDTH;
canvas.height = HEIGHT;

//object creation
const mazeObj = generateMaze(MAZE_GRID_COUNT);
const numRows = mazeObj.contents.length;
const numCols = mazeObj.contents[0].length;
const cellWidth = WIDTH / numCols;
const cellHeight = HEIGHT / numRows;
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

const adjustWindowScroll = () => {
  const characterPos = {
    x: character.x + character.width / 2,
    y: character.y + character.height / 2,
  };
  scroll(characterPos.x - innerWidth / 2, characterPos.y - innerHeight / 2);
};

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
    if (this.x !== prevX || this.y !== prevY) {
      emit("characterMoved");
    }
  },
});
on("characterMoved", adjustWindowScroll);
addEventListener("resize", adjustWindowScroll);

const handleCharacterMove = () => {
  const radius = 100;
  const x = character.x + character.width / 2;
  const y = character.y + character.height / 2;
  ctxTemp.beginPath();
  ctxTemp.arc(x, y, radius, 0, Math.PI * 2);
  ctxTemp.fill();
};

//fog
const canvasTemp = document.createElement("canvas");
canvasTemp.width = canvas.width;
canvasTemp.height = canvas.height;
const ctxTemp = canvasTemp.getContext("2d");
ctxTemp.fillStyle = "grey";
ctxTemp.fillRect(0, 0, WIDTH, HEIGHT);
ctxTemp.globalCompositeOperation = "destination-out";
ctxTemp.filter = "blur(20px)";
handleCharacterMove();
const fog = Sprite({
  render: function () {
    this.context.drawImage(canvasTemp, 0, 0);
  },
});
on("characterMoved", handleCharacterMove);

//game loop
const loop = GameLoop({
  update: function () {
    character.update();
  },
  render: function () {
    mazeSprite.forEach((sprite) => sprite.render());
    character.render();
    fog.render();
  },
});

console.log(generateMaze(10));

loop.start();
