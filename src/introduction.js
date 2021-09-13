import { drawTitle, drawNightSky } from "./canvasObjects";
import { randomParticles } from "./helper";

let starPoints = [];

//draw background
function drawBackground(_context, _canvas) {
  if (starPoints.length === 0) starPoints = randomParticles(_canvas.width, _canvas.height);
  drawNightSky(_context, _canvas, starPoints);
  drawTitle(_context, _canvas);
}

function clear() {
  mountainPoints = [];
  starPoints = [];
}

//this function draws a static introduction page
function drawIntroduction(_context, _canvas) {
  drawBackground(_context, _canvas);
  return [clear, drawBackground];
}

export default drawIntroduction;
