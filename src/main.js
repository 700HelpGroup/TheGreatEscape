import { GameLoop, keyPressed } from "kontra";
import { canvas, context } from "./init";
import { tileEngine, showGuideMap, mazeObj, toggleDoor, toggleMap } from "./customMaze";
import { character } from "./character";
import { fog } from "./fog";
import drawIntroduction from "./intro.js";
import { robots } from "./Ai";
import { CELL_HEIGHT, CELL_WIDTH, MAZE_GRID_COUNT } from "./constants";

let gameRunning = true;
let characterAdded = false;

const [updateIntroduction, renderIntroduction] = drawIntroduction(context, canvas, onIntroFinish);
document.getElementById("startButton")?.addEventListener("click", startGame);

function onIntroFinish() {
  gameRunning = true;
}

function guideMap() {
  context.save();
  const mapPadding = 10;
  const size = canvas.height - mapPadding * 2;
  const cellSize = Math.floor(size / MAZE_GRID_COUNT);
  const startX = canvas.width / 2 - size / 2;
  const startY = mapPadding;
  const characterSize = cellSize * 0.4;
  context.shadowColor = "white";
  context.shadowBlur = 5;
  context.globalAlpha = 0.2;
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.globalAlpha = 0.8;
  context.fillStyle = "#00203fff";
  context.fillRect(startX, startY, size, size);

  context.beginPath();
  mazeObj["contents"].forEach((rowCell) => {
    rowCell.forEach((cell) => {
      if (cell["value"] === "#") {
        context.fillStyle = "#adefd1ff";
      } else if (cell["value"] === "S") {
        context.fillStyle = "#DFDCE5";
      } else if (cell["value"] === "E") {
        context.fillStyle = "#B9D452";
      } else {
        context.fillStyle = "#00203fff";
      }
      context.fillRect(
        startX + cell["col"] * cellSize,
        startY + cell["row"] * cellSize,
        cellSize,
        cellSize
      );
    });
  });

  context.beginPath();
  context.fillStyle = "#F8BC24";
  const xPosRatio = character.x / (CELL_WIDTH * MAZE_GRID_COUNT);
  const yPosRatio = character.y / (CELL_HEIGHT * MAZE_GRID_COUNT);
  context.arc(
    startX + xPosRatio * size + characterSize,
    startY + yPosRatio * size + characterSize,
    characterSize,
    0,
    2 * Math.PI
  );
  context.fill();

  context.restore();
}

const gameLoop = GameLoop({
  update: function (dt) {
    if (characterAdded === false) {
      if (tileEngine !== null) {
        tileEngine.addObject(character);
        robots.forEach((robot) => tileEngine.addObject(robot));
        characterAdded = true;
        robots.forEach((robot) => tileEngine.addObject(robot));

      }
    }
    if (!gameRunning) {
      updateIntroduction(context, canvas, dt);
    } else {
      if (keyPressed("space")) {
        if (character.direction === "up") {
          toggleDoor(
            Math.floor(character.y / CELL_HEIGHT) - 1,
            Math.floor(character.x / CELL_WIDTH)
          );
          toggleMap(
            Math.floor(character.y / CELL_HEIGHT) - 1,
            Math.floor(character.x / CELL_WIDTH)
          );
        } else if (character.direction === "down") {
          toggleDoor(
            Math.floor(character.y / CELL_HEIGHT) + 1,
            Math.floor(character.x / CELL_WIDTH)
          );
        }
      }
      if (showGuideMap === true) return;
      character.update();
      character.updateCharacterMovement();
      robots.forEach((robot) => {
        robot.update();
        robot.updateMovement();
      });
    }
  },
  render: function () {
    if (!gameRunning) {
      renderIntroduction(context, canvas);
    } else {
      if (tileEngine !== null) tileEngine.render();
      character.render();
      robots.forEach((robot) => robot.render());
      // fog.render();
      if (showGuideMap === true) guideMap();
    }
  },
});

function startGame() {
  //hide the start button on game start
  const startButton = document.getElementById("startButton");
  if (startButton !== null) {
    startButton.style.display = "none";
  }
  gameLoop.start();
}

function cleanup() {
  const button = document.getElementById("startButton");
  if (button !== null) {
    button.removeEventListener("click", startGame);
  }
}
