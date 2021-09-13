import { drawTitle, drawNightSky } from "./canvasObjects";

//draw background
function drawBackground(_context, _canvas) {
  drawNightSky(_context, _canvas);
  drawTitle(_context, _canvas);
}

//this function draws a static introduction page
function drawIntroduction(_context, _canvas) {
  drawBackground(_context, _canvas);
  return [() => {}, drawBackground];
}

export default drawIntroduction;
