import {
  drawRoundRect,
  drawPolygon,
  drawCircle,
  fillColor,
  addStroke,
  transformAboutCenter,
} from "./util";

export function drawTitle(_context, _canvas, _opacity = 1) {
  _context.save();
  const xPos = _canvas.width * 0.5 - 240;
  const yPos = 100;
  _context.globalAlpha = _opacity;
  _context.fillStyle = "white";
  _context.shadowColor = "white";
  _context.shadowBlur = 15;
  _context.font = "bold 50px Verdana";
  _context.fillText("THE GREAT ESCAPE", xPos, yPos);
  _context.font = "bold 20px Verdana";
  _context.fillText("Experience escape room in space", xPos, yPos + 30);
  _context.restore();
}

export function drawNightSky(_context, _canvas, _points) {
  _context.save();
  const xMax = _canvas.width;
  const yMax = _canvas.height;

  const grd = _context.createLinearGradient(0, 0, 0, yMax);
  grd.addColorStop(0, "rgb(10,16,21)");
  grd.addColorStop(0.25, "rgb(18,60,61)");
  grd.addColorStop(0.5, "rgb(51,138,128)");
  grd.addColorStop(0.75, "rgb(205,230,221)");
  _context.fillStyle = grd;
  _context.fillRect(0, 0, xMax, yMax);

  const particles = _points;
  particles.forEach((particle) => {
    if (particle.size > 1) {
      _context.shadowBlur = Math.floor(Math.random() * 15 + 5);
      _context.shadowColor = "white";
    }
    _context.fillStyle =
      "hsla(" + particle.hue + ", 30%, 80%, ." + particle.opacity1 + particle.opacity2 + ")";
    _context.fillRect(particle.x, particle.y, particle.size, particle.size);
  });

  _context.restore();
}

export function drawCar(_context, _canvas, _startPosX = 0, _startPosY = 0) {
  _context.save();

  //draw car body
  drawRoundRect(_context, _startPosX, _startPosY, 60, 15, 2, "#6a8fcc");
  drawRoundRect(_context, _startPosX + 15, _startPosY - 10, 25, 15, 4, "#6a8fcc");

  //draw car window
  drawRoundRect(_context, _startPosX + 17, _startPosY - 8, 5, 7, 1, "white");
  drawRoundRect(_context, _startPosX + 25, _startPosY - 8, 12, 7, 1, "white");

  //draw car head light
  drawCircle(_context, _startPosX + 3, _startPosY + 5, 3, "gold");

  //draw car wheels
  drawCircle(_context, _startPosX + 12, _startPosY + 15, 5, "#807f8a", "black");
  drawCircle(_context, _startPosX + 45, _startPosY + 15, 5, "#807f8a", "black");

  //headlight effect
  const grd = _context.createRadialGradient(
    _startPosX,
    _startPosY + 5,
    1,
    _startPosX,
    _startPosY + 5,
    50
  );
  grd.addColorStop(0, "gold");
  grd.addColorStop(1, "rgba(0,0,0,0)");

  drawPolygon(
    _context,
    [
      {
        x: _startPosX,
        y: _startPosY + 5,
        moveTo: true,
      },
      {
        x: _startPosX - 50,
        y: _startPosY - 15,
      },
      {
        x: _startPosX - 50,
        y: _startPosY + 25,
      },
      {
        x: _startPosX,
        y: _startPosY + 5,
      },
    ],
    grd
  );

  _context.restore();
}

export function drawMountainRange(_context, _canvas, _points) {
  if (_points.length === 0) return;

  _context.save();
  const zigzigPositions = _points;

  _context.beginPath();
  _context.moveTo(zigzigPositions[0].x, zigzigPositions[0].y);
  zigzigPositions.forEach((pos) => {
    _context.lineTo(pos.x, pos.y);
  });

  //close the line
  _context.lineTo(_canvas.width, zigzigPositions[zigzigPositions.length - 1].y);
  _context.lineTo(_canvas.width, _canvas.height);
  _context.lineTo(0, _canvas.height);
  _context.lineTo(0, zigzigPositions[0].y);

  const grd = _context.createLinearGradient(0, _canvas.height * 0.5, 0, _canvas.height);
  grd.addColorStop(0, "rgb(10,16,21)");
  grd.addColorStop(0.5, "rgb(18,60,61)");
  grd.addColorStop(1, "rgb(51,138,128)");
  fillColor(_context, grd);

  _context.restore();
}

export function drawFence(_context, _canvas) {
  _context.save();
  const fenceGap = 100;
  const fenceCount = Math.ceil(_canvas.width / fenceGap);

  _context.beginPath();
  _context.fillStyle = "#464d57";
  _context.strokeStyle = "white";
  _context.moveTo(0, _canvas.height - 100);
  _context.lineTo(_canvas.width, _canvas.height - 100);
  _context.moveTo(0, _canvas.height - 92);
  _context.lineTo(_canvas.width, _canvas.height - 92);
  _context.stroke();
  for (let i = 0; i < fenceCount; i++) {
    if (i * fenceGap > _canvas.width) continue;
    _context.fillRect(
      i * fenceGap,
      _canvas.height - 102,
      Math.min(10, _canvas.width - i * fenceGap),
      25
    );
  }
  _context.restore();
}

export function drawGround(_context, _canvas) {
  _context.save();

  _context.beginPath();
  const grd = _context.createLinearGradient(0, _canvas.height - 102, 0, _canvas.height);
  grd.addColorStop(0, "black");
  grd.addColorStop(0.3, "#434a47");
  _context.fillStyle = grd;
  _context.fillRect(0, 0.75 * _canvas.height, _canvas.width, 0.25 * _canvas.height);

  _context.restore();
}

export function drawRoad(_context, _canvas, addRay) {
  _context.save();

  _context.beginPath();
  const grd = _context.createRadialGradient(
    _canvas.width - 500,
    _canvas.height,
    5,
    _canvas.width - 500,
    _canvas.height,
    350
  );
  grd.addColorStop(0, "gold");
  grd.addColorStop(1, "#434a47");
  _context.fillStyle = addRay === true ? grd : "#434a47";
  _context.fillRect(0, 0.82 * _canvas.height, _canvas.width, 0.18 * _canvas.height);

  _context.beginPath();
  _context.moveTo(0, _canvas.height - 60);
  _context.lineTo(_canvas.width, _canvas.height - 60);
  _context.strokeStyle = "orange";
  _context.stroke();

  _context.restore();
}

export function drawRoadtiles(_context, _canvas, _shift = 0) {
  _context.save();

  const roadTileWidth = 30;

  _context.beginPath();
  _context.fillStyle = "white";
  const yPos = _canvas.height - 20;
  const height = 1;
  let x = _shift;

  //draw from shift to canvas width
  while (x < _canvas.width) {
    const width = Math.min(roadTileWidth, _canvas.width - x);
    _context.fillRect(x, yPos, width, height);
    x += roadTileWidth * 2;
  }

  //draw from shift to canvas start
  let x2 = _shift - roadTileWidth;
  while (x2 > 0) {
    const width = Math.min(roadTileWidth, x2);
    _context.fillRect(x2 - width, yPos, width, height);
    x2 -= roadTileWidth * 2;
  }

  _context.restore();
}

export function drawPerson(_context, _canvas) {
  _context.save();

  const startPosX = _canvas.width - 400;
  const startPosY = _canvas.height - 100;

  drawCircle(_context, startPosX, startPosY, 5, "white");

  _context.beginPath();
  _context.strokeStyle = "white";
  _context.moveTo(startPosX - 5, startPosY + 10);
  _context.lineTo(startPosX - 15, startPosY + 30);
  _context.lineWidth = 12;
  _context.stroke();
  _context.moveTo(startPosX - 5, startPosY + 20);
  _context.lineTo(startPosX - 20, startPosY);
  _context.moveTo(startPosX - 5, startPosY + 15);
  _context.lineTo(startPosX + 15, startPosY + 10);
  _context.moveTo(startPosX - 10, startPosY + 28);
  _context.lineTo(startPosX - 10, startPosY + 48);
  _context.moveTo(startPosX - 15, startPosY + 25);
  _context.lineTo(startPosX - 35, startPosY + 35);
  _context.lineWidth = 6;
  _context.stroke();

  _context.restore();
}

export function drawUFOBeam(_context, _canvas) {
  _context.save();

  //light beam
  _context.beginPath();
  drawPolygon(_context, [
    {
      x: _canvas.width - 290,
      y: 120,
      moveTo: true,
    },
    {
      x: _canvas.width - 700,
      y: _canvas.height - 20,
    },
    {
      x: _canvas.width - 300,
      y: _canvas.height - 20,
    },
    {
      x: _canvas.width - 235,
      y: 145,
    },
    {
      x: _canvas.width - 290,
      y: 120,
    },
  ]);
  _context.globalAlpha = "0.5";
  fillColor(_context, "gold");

  //light ring
  _context.beginPath();
  _context.ellipse(_canvas.width - 500, _canvas.height - 20, 198, 25, 0, 0, Math.PI);
  fillColor(_context, "gold");

  _context.beginPath();
  _context.ellipse(_canvas.width - 500, _canvas.height - 20, 198, 25, 0, 0, Math.PI, true);
  addStroke(_context, "white");
  _context.restore();
}

export function drawUFO(_context, _canvas, _size = 1, _xPos = 0, _yPos = 0, _angle = 0) {
  _context.save();

  _context.scale(_size, _size);
  transformAboutCenter(_context, 20, 40, 160, 90, _angle);

  const angleInRad = (_angle / 180) * Math.PI;
  const scaledX = (_xPos + 80) / _size;
  const scaledY = (_yPos + 45) / _size;
  const posAngle = Math.atan2(scaledY, scaledX);
  const posLength = Math.sqrt(Math.pow(scaledX, 2) + Math.pow(scaledY, 2));
  const newXPos = Math.cos(angleInRad - posAngle) * posLength;
  const newYPos = -Math.sin(angleInRad - posAngle) * posLength;

  //glass
  _context.shadowBlur = 15;
  _context.shadowColor = "white";
  drawRoundRect(_context, newXPos + 60, newYPos + 40, 80, 80, 40);
  _context.globalAlpha = "0.3";
  fillColor(_context, "white");
  addStroke(_context, "white");

  //body
  _context.globalAlpha = "1";
  _context.beginPath();
  _context.ellipse(newXPos + 100, newYPos + 100, 80, 25, 0, 0, 2 * Math.PI);
  fillColor(_context, "#BBC2CC");

  //portal
  _context.beginPath();
  _context.ellipse(newXPos + 100, newYPos + 120, 30, 12, 0, 0, 2 * Math.PI);
  fillColor(_context, "gray");

  //light ring
  _context.beginPath();
  _context.moveTo(newXPos + 25, newYPos + 100);
  _context.quadraticCurveTo(newXPos + 100, newYPos + 62, newXPos + 175, newYPos + 100);
  _context.quadraticCurveTo(newXPos + 100, newYPos + 70, newXPos + 25, newYPos + 100);
  fillColor(_context, "cyan");
  addStroke(_context, "white");

  _context.restore();
}

export function drawFlashScreen(_context, _canvas, _maskSize = 0) {
  _context.save();
  _context.fillStyle = "black";
  _context.globalCompositeOperation = "destination-out";
  _context.beginPath();
  _context.moveTo(0, 0);
  _context.lineTo(_canvas.width, 0);
  _context.lineTo(_canvas.width, _canvas.height);
  _context.lineTo(0, _canvas.height);
  _context.closePath();
  _context.arc(_canvas.width / 2, _canvas.height / 2, _maskSize, 0, Math.PI * 2, true);
  _context.closePath();
  _context.fill();

  _context.restore();
}

export function drawStoryLine(_context, _canvas, _scrollAmount = 0) {
  const story = [
    "You are just driving home from work",
    "and unfortunately aliens see you a their",
    "perfect test subject. Gather your courage",
    "as you are going to experience the most",
    "intense escape room in the world.",
  ];

  _context.save();
  const xPos = 50;
  const yPos = 100;
  const textHeight = 40;
  _context.rect(xPos, 100 - textHeight, _canvas.width, textHeight * 3);
  _context.clip();
  for (let i = 0; i < story.length; i++) {
    _context.fillStyle = "white";
    _context.font = "bold 20px Verdana";
    _context.fillText(story[i], xPos, yPos + i * textHeight - _scrollAmount);
  }
  _context.restore();
}
