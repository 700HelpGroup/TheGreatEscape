import { MAZE_GRID_COUNT, CELL_WIDTH, CELL_HEIGHT } from "./constants";

export function drawText(
  _context,
  _canvas,
  _text,
  _opacity = 1,
  _fontSize = "20px",
  _fill = "black",
  _x = 0,
  _y = 0,
  _blur = 0,
  _shadowColor = "white"
) {
  _context.save();
  _context.globalAlpha = _opacity;
  _context.fillStyle = _fill;
  _context.shadowColor = _shadowColor;
  _context.shadowBlur = _blur;
  _context.font = `bold ${_fontSize} Verdana`;
  _context.fillText(_text, _x, _y);
  _context.restore();
}

export function drawTitle(_context, _canvas, _opacity = 1) {
  const xPos = _canvas.width * 0.5 - 240;
  const yPos = 100;
  drawText(
    _context,
    _canvas,
    "THE GREAT ESCAPE",
    _opacity,
    "50px",
    "white",
    xPos,
    yPos,
    15,
    "white"
  );
  drawText(
    _context,
    _canvas,
    "Experience escape room in space",
    _opacity,
    "20px",
    "white",
    xPos,
    yPos + 30,
    15,
    "white"
  );
}

export function drawNightSky(_context, _canvas) {
  _context.save();
  const xMax = _canvas.width;
  const yMax = _canvas.height;

  const grd = _context.createLinearGradient(0, 0, 0, yMax);
  grd.addColorStop(0, "rgb(10,16,21)");
  grd.addColorStop(0.3, "rgb(18,60,61)");
  grd.addColorStop(0.6, "rgb(51,138,128)");
  grd.addColorStop(1, "rgb(205,230,221)");
  _context.fillStyle = grd;
  _context.fillRect(0, 0, xMax, yMax);

  _context.restore();
}

export function drawFlashScreen(_context, _canvas, _maskSize = 0) {
  _context.save();
  _context.fillStyle = "black";
  _context.beginPath();
  _context.moveTo(0, 0);
  _context.lineTo(_canvas.width, 0);
  _context.lineTo(_canvas.width, _canvas.height);
  _context.lineTo(0, _canvas.height);
  _context.closePath();
  _context.arc(
    _canvas.width / 2,
    _canvas.height / 2,
    _maskSize,
    0,
    Math.PI * 2,
    true
  );
  _context.closePath();
  _context.fill();

  _context.restore();
}

export function drawGuideMap(context, canvas, mazeObj, xPos, yPos) {
  context.save();
  const mapPadding = 10;
  const size = canvas.height - mapPadding * 2;
  const cellSize = size / MAZE_GRID_COUNT;
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
      if (cell.isWall()) {
        context.fillStyle = "#adefd1ff";
      } else if (cell.isStart()) {
        context.fillStyle = "#DFDCE5";
      } else if (cell.isEnd()) {
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
  const xPosRatio = xPos / (CELL_WIDTH * MAZE_GRID_COUNT);
  const yPosRatio = yPos / (CELL_HEIGHT * MAZE_GRID_COUNT);
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
