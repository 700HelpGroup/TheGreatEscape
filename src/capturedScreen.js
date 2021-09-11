import { drawFlashScreen } from "./introProps";
import { canvasDiagnLength } from "./util";

// let blackScreenSize = canvasDiagnLength(canvas);
let blackScreenItr = 0;
let textItr = 0;

export function capturedScene(context, canvas) {
  let blackScreenSize = canvasDiagnLength(canvas) - 5 * blackScreenItr;
  drawFlashScreen(context, canvas, Math.max(blackScreenSize, 0));
  drawText(context, canvas, Math.min(textItr * 0.04, 1));
  blackScreenItr++;
  if (blackScreenSize <= 0) textItr++;
  return textItr >= 25 ? true : false;
}

function drawText(context, canvas, opacity) {
  context.save();
  const xPos = canvas.width * 0.5 - 150;
  const yPos = 100;
  context.globalAlpha = opacity;
  context.fillStyle = "white";
  context.font = "bold 50px Verdana";
  context.fillText("GAME OVER", xPos, yPos);
  context.font = "bold 20px Verdana";
  context.fillText("You have been captured!", xPos + 30, yPos + 50);
  context.restore();
}
