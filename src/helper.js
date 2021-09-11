//drawing utils
export function transformAboutCenter(_context, _x, _y, _width, _height, _angle) {
  const cx = _x + 0.5 * _width;
  const cy = _y + 0.5 * _height;

  _context.translate(cx, cy); //translate to center of shape
  _context.rotate((Math.PI / 180) * _angle); //rotate 25 degrees.
  _context.translate(-cx, -cy); //translate center back to 0,0
}

export function fillColor(_context, _color = "black") {
  _context.fillStyle = _color;
  _context.fill();
}

export function addStroke(_context, _color = "black") {
  _context.strokeStyle = _color;
  _context.stroke();
}

export function drawCircle(_context, _x, _y, _radius, _fillColor, _strokeColor) {
  _context.beginPath();
  _context.arc(_x, _y, _radius, 0, Math.PI * 2);
  _fillColor && fillColor(_context, _fillColor);
  _strokeColor && addStroke(_context, _strokeColor);
}

export function drawRoundRect(
  _context,
  _x,
  _y,
  _width,
  _height,
  _radius,
  _fillColor,
  _strokeColor
) {
  _context.beginPath();
  _context.moveTo(_x, _y + _radius);
  _context.lineTo(_x, _y + _height - _radius);
  _context.arcTo(_x, _y + _height, _x + _radius, _y + _height, _radius);
  _context.lineTo(_x + _width - _radius, _y + _height);
  _context.arcTo(_x + _width, _y + _height, _x + _width, _y + _height - _radius, _radius);
  _context.lineTo(_x + _width, _y + _radius);
  _context.arcTo(_x + _width, _y, _x + _width - _radius, _y, _radius);
  _context.lineTo(_x + _radius, _y);
  _context.arcTo(_x, _y, _x, _y + _radius, _radius);
  _fillColor && fillColor(_context, _fillColor);
  _strokeColor && addStroke(_context, _strokeColor);
}

export function drawPolygon(_context, _lines, _fillColor, _strokeColor) {
  _context.beginPath();

  for (let i = 0; i < _lines.length; i++) {
    if (_lines[i]["moveTo"] === true) {
      _context.moveTo(_lines[i]["x"], _lines[i]["y"]);
    } else {
      _context.lineTo(_lines[i]["x"], _lines[i]["y"]);
    }
  }

  _fillColor && fillColor(_context, _fillColor);
  _strokeColor && addStroke(_context, _strokeColor);
}

//function utils
export function randomParticles(xMax, yMax) {
  const hmTimes = Math.round(xMax + yMax);
  const particales = [];
  for (let i = 0; i <= hmTimes; i++) {
    const randomX = Math.floor(Math.random() * xMax + 1);
    const randomY = Math.floor(Math.random() * yMax + 1);
    const randomSize = Math.floor(Math.random() * 2 + 1);
    const randomOpacityOne = Math.floor(Math.random() * 9 + 1);
    const randomOpacityTwo = Math.floor(Math.random() * 9 + 1);
    const randomHue = Math.floor(Math.random() * 360 + 1);
    particales.push({
      x: randomX,
      y: randomY,
      size: randomSize,
      opacity1: randomOpacityOne,
      opacity2: randomOpacityTwo,
      hue: randomHue,
    });
  }

  return particales;
}

export function randomZigZagLine(width, height, startx, starty, size = 1) {
  let x = startx;
  let y = starty;
  const positions = [
    {
      x: x,
      y: y,
    },
  ];
  while (x < width) {
    let dx = Math.random() * 20 + 50;
    let dy = (Math.random() - 0.5) * 100;
    let highPercentage = Math.max(0.8 + size * 0.15, 0.3);
    let lowPercentage = Math.max(0.3 + size * 0.15, 0);
    x = x + dx;
    y = Math.max(Math.min(y + dy, highPercentage * height), lowPercentage * height);

    if (x > width) {
      x = width;
    }
    positions.push({
      x: x,
      y: y,
    });
  }
  return positions;
}

export function easeOutSine(_x) {
  return Math.sin((_x * Math.PI) / 2);
}

export function canvasDiagnLength(_canvas) {
  return Math.sqrt(Math.pow(_canvas.width / 2, 2) + Math.pow(_canvas.height / 2, 2));
}

//checks if two rectangles intersect
export const intersects = (rectangle1, rectangle2) => {
  const intersectionX1 = Math.max(rectangle1.x, rectangle2.x);
  const intersectionX2 = Math.min(rectangle1.x + rectangle1.width, rectangle2.x + rectangle2.width);
  if (intersectionX2 < intersectionX1) {
    return false;
  }
  const intersectionY1 = Math.max(rectangle1.y, rectangle2.y);
  const intersectionY2 = Math.min(
    rectangle1.y + rectangle1.height,
    rectangle2.y + rectangle2.height
  );
  if (intersectionY2 < intersectionY1) {
    return false;
  }
  return true;
};

//custom throttle function
export const throttle = (callback, limit) => {
  var waiting = false;
  return function () {
    if (!waiting) {
      callback.apply(this, arguments);
      waiting = true;
      setTimeout(function () {
        waiting = false;
      }, limit);
    }
  };
};

export const debounce = (func, timeout = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

export const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];
