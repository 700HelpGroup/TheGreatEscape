const warpZ = 12;
const speed = 0.075;
let mStarField = null;

export function drawFinishScene(context, canvas) {
  if (mStarField === null) mStarField = new starfield(context, canvas);

  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.setTransform(1, 0, 0, 1, 0, 0);
  context.fillStyle = "rgba(0,0,0,0.2)";
  context.fillRect(0, 0, canvas.width, canvas.height);
  mStarField.draw();
  drawText(context, canvas);
}

function drawText(context, canvas) {
  context.save();
  const xPos = -300;
  const yPos = -20;
  context.fillStyle = "white";
  context.font = "bold 20px Verdana";
  context.fillText("On our way back to Earth", xPos + 150, yPos + 50);
  context.fillStyle = "rgb(65,216,172)";
  context.shadowColor = "cyan";
  context.shadowBlur = 3;
  context.font = "bold 50px Verdana";
  context.fillText("SUCCESSFUL ESCAPE", xPos, yPos);
  context.restore();
}

function rnd(num1, num2) {
  return Math.floor(Math.random() * num2 * 2) + num1;
}

function getColor() {
  return "hsla(200,100%, " + rnd(50, 100) + "%, 1)";
}

const star = function (context, canvas) {
  const halfw = canvas.width / 2;
  const halfh = canvas.height / 2;

  let v = vec3.fromValues(
    rnd(0 - halfw, halfw),
    rnd(0 - halfh, halfh),
    rnd(1, warpZ)
  );

  this.x = v[0];
  this.y = v[1];
  this.z = v[2];
  this.color = getColor();

  this.reset = function () {
    v = vec3.fromValues(
      rnd(0 - halfw, halfw),
      rnd(0 - halfh, halfh),
      rnd(1, warpZ)
    );

    this.x = v[0];
    this.y = v[1];
    this.color = getColor();
    vel = this.calcVel();
  };

  this.calcVel = function () {
    return vec3.fromValues(0, 0, 0 - speed);
  };

  let vel = this.calcVel();

  this.draw = function () {
    vel = this.calcVel();
    v = vec3.add(vec3.create(), v, vel);
    const x = v[0] / v[2];
    const y = v[1] / v[2];
    const x2 = v[0] / (v[2] + speed * 0.5);
    const y2 = v[1] / (v[2] + speed * 0.5);

    context.strokeStyle = this.color;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x2, y2);
    context.stroke();

    if (x < 0 - halfw || x > halfw || y < 0 - halfh || y > halfh) {
      this.reset();
    }
  };
};

const starfield = function (context, canvas) {
  const numOfStars = 250;
  const stars = [];

  function _init() {
    for (var i = 0, len = numOfStars; i < len; i++) {
      stars.push(new star(context, canvas));
    }
  }

  _init();

  this.draw = function () {
    context.translate(canvas.width / 2, canvas.height / 2);

    for (var i = 0, len = stars.length; i < len; i++) {
      const currentStar = stars[i];
      currentStar.draw();
    }
  };
};

const vec3 = {
  fromValues: function (a, b, c) {
    return [a, b, c];
  },

  add: function (out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
  },

  create: function () {
    return [0, 0, 0];
  },
};
