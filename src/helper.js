export function canvasDiagnLength(_canvas) {
  return Math.sqrt(
    Math.pow(_canvas.width / 2, 2) + Math.pow(_canvas.height / 2, 2)
  );
}

//checks if two rectangles intersect
export const intersects = (rectangle1, rectangle2) => {
  const intersectionX1 = Math.max(rectangle1.x, rectangle2.x);
  const intersectionX2 = Math.min(
    rectangle1.x + rectangle1.width,
    rectangle2.x + rectangle2.width
  );
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
