import { init, initKeys, load, setImagePath, GameLoop, imageAssets } from "kontra";
import { CANVAS_WIDTH, CANVAS_HEIGHT, GAME_STATES } from "./constants";
import Introduction from "./introduction";
import Game from "./game";

let gameState = GAME_STATES.IDLE;

const { canvas, context } = init();
initKeys();

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

setImagePath("assets/");
load("character.png", "robot.png", "tiles.png").then(() => {
  document.getElementById("startButton")?.addEventListener("click", startGame);
  document.getElementById("restartButton")?.addEventListener("click", () => restartGame);
  document.getElementById("exitButton")?.addEventListener("click", () => exitGame);

  const [updateIntroduction, renderIntroduction] = Introduction(
    context,
    canvas,
    () => (gameState = GAME_STATES.RUNNING)
  );

  const [updateGame, renderGame] = Game(context, canvas, imageAssets);

  const gameLoop = GameLoop({
    update: function (dt) {
      switch (gameState) {
        case GAME_STATES.START:
          updateIntroduction(context, canvas, dt);
          break;
        case GAME_STATES.RUNNING:
          updateGame();
        default:
          break;
      }
    },
    render: function () {
      switch (gameState) {
        case GAME_STATES.START:
          renderIntroduction(context, canvas);
          break;
        case GAME_STATES.RUNNING:
          renderGame();
        default:
          break;
      }
    },
  });

  function startGame() {
    const startButton = document.getElementById("startButton");
    if (startButton !== null) {
      startButton.style.display = "none";
    }
    gameState = GAME_STATES.START;
    gameLoop.start();
  }

  function restartGame() {}

  function exitGame() {}

  function cleanup() {
    const button = document.getElementById("startButton");
    if (button !== null) {
      button.removeEventListener("click", startGame);
    }
  }
});
//   .catch(() => {
//     window.alert("An error occured while loading resources, please refresh and try again");
//   });
