import { canvas, context } from "./init";
import { load, setImagePath, GameLoop, imageAssets } from "kontra";
import { GAME_STATES } from "./constants";
import Introduction from "./introduction";
import Game from "./game";
import { drawFinishScene } from "./finishScreen";

let gameState = GAME_STATES.IDLE;

setImagePath("assets/");
load("character.png", "robot.png", "tiles.png").then(() => {
  document.getElementById("startButton")?.addEventListener("click", startGame);

  const [clearIntroduction, reDrawIntroduction] = Introduction(context, canvas);

  const [updateGame, renderGame, clearGame, reLaunchGame] = Game(
    context,
    canvas,
    imageAssets,
    exitGame,
    finishGame
  );

  const gameLoop = GameLoop({
    update: function (dt) {
      switch (gameState) {
        case GAME_STATES.RUNNING:
          updateGame();
        default:
          break;
      }
    },
    render: function () {
      switch (gameState) {
        case GAME_STATES.IDLE:
          reDrawIntroduction(context, canvas);
          break;
        case GAME_STATES.RUNNING:
          renderGame(context, canvas);
          break;
        case GAME_STATES.END:
          drawFinishScene(context, canvas);
          break;
        default:
          break;
      }
    },
  });

  function startGame() {
    const startButton = document.getElementById("startButton");
    if (startButton !== null) startButton.style.display = "none";
    gameState = GAME_STATES.RUNNING;
    reLaunchGame(imageAssets);
  }

  function exitGame() {
    clearIntroduction();
    clearGame();
    gameState = GAME_STATES.IDLE;
    const startButton = document.getElementById("startButton");
    if (startButton !== null) startButton.style.display = "block";
  }

  function finishGame() {
    clearIntroduction();
    clearGame();
    gameState = GAME_STATES.END;
  }

  gameLoop.start();
});
