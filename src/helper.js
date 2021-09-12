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
