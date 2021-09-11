import {
  drawTitle,
  drawNightSky,
  drawMountainRange,
  drawGround,
  drawFence,
  drawRoad,
  drawRoadtiles,
  drawUFO,
  drawCar,
  drawUFOBeam,
  drawFlashScreen,
} from "./canvasObjects";
import { randomZigZagLine, randomParticles, easeOutSine, canvasDiagnLength } from "./helper";

let mountainPoints = [];
let starPoints = [];
let timer = 0;
let titleOpacity = 1;
let tileShift = 0;
let UFOXPosition = 100;
let UFOYPosition = -30;
let UFOSize = 0.08;
let UFORotation = 0;
let blackScreenSize = 0;
let finishCallback = null;

//draw background
function drawBackground(_context, _canvas) {
  starPoints = randomParticles(_canvas.width, _canvas.height);
  mountainPoints = randomZigZagLine(_canvas.width, _canvas.height, 0, _canvas.height * 0.5);
  blackScreenSize = canvasDiagnLength(_canvas);
  drawNightSky(_context, _canvas, starPoints);
  drawMountainRange(_context, _canvas, mountainPoints);
  drawGround(_context, _canvas);
  drawFence(_context, _canvas);
  drawRoad(_context, _canvas);
  drawTitle(_context, _canvas);
  drawRoadtiles(_context, _canvas);
  drawUFO(_context, _canvas, UFOSize, UFOXPosition, UFOYPosition, UFORotation);
}

function updateIntroduction(_context, _canvas, _dt) {
  timer += _dt;
  updateFrame1(_context, _canvas, timer);
  updateFrame2(_context, _canvas, timer);
  updateFrame3(_context, _canvas, timer);

  if (timer >= 10 && finishCallback !== null) finishCallback();
}

function renderIntroduction(_context, _canvas) {
  drawNightSky(_context, _canvas, starPoints);
  drawMountainRange(_context, _canvas, mountainPoints);
  drawGround(_context, _canvas);
  drawFence(_context, _canvas);
  drawRoad(_context, _canvas);
  animateFrame1(_context, _canvas);
  animateFrame2(_context, _canvas);
  animateFrame3(_context, _canvas);
  drawFlashScreen(_context, _canvas, blackScreenSize);
}

//this function draws a static introduction page
function drawIntroduction(_context, _canvas, _finishCallback) {
  if (typeof _finishCallback === "function") finishCallback = _finishCallback;
  drawBackground(_context, _canvas);
  return [updateIntroduction, renderIntroduction];
}

//Frame 1 text fades out
function updateFrame1(_context, _canvas, _timer) {
  const duration = 1.5;

  if (_timer >= duration) {
    titleOpacity = 0;
    return;
  }
  titleOpacity = 1 - easeOutSine((1 / duration) * _timer);
}

function animateFrame1(_context, _canvas) {
  if (titleOpacity > 0) drawTitle(_context, _canvas, titleOpacity);
}

//Frame 2 car driving on the road
function updateFrame2(_context, _canvas, _timer) {
  //animate road
  tileShift += 4;
  if (tileShift >= 60) tileShift = 0;

  if (_timer < 2) return;

  //animate ufo
  UFOYPosition = _canvas.height - 430;
  if (UFOXPosition < _canvas.width - 427) UFOXPosition += 5.5;
  if (UFOSize < 1) UFOSize += 0.01;
  if (UFORotation < 25.7) UFORotation += 0.5;
}

function animateFrame2(_context, _canvas) {
  const startPosX = _canvas.width - 500;
  const startPosY = _canvas.height - 50;
  drawUFO(_context, _canvas, UFOSize, UFOXPosition, UFOYPosition, UFORotation);
  drawCar(_context, _canvas, startPosX, startPosY);
  drawRoadtiles(_context, _canvas, tileShift);
}

//Frame 3 black screen and game start
function updateFrame3(_context, _canvas, _timer) {
  if (timer < 7) return;

  if (blackScreenSize > 0) blackScreenSize -= 5;
  if (blackScreenSize < 0) blackScreenSize = 0;
}

function animateFrame3(_context, _canvas) {
  if (timer < 5) return;
  drawUFOBeam(_context, _canvas);
}

export default drawIntroduction;
