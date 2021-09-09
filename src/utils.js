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
