import { Sprite, on } from "kontra";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants";
import { character } from "./character";
import { throttle } from "./helper";

const canvasTemp = document.createElement("canvas");
canvasTemp.width = CANVAS_WIDTH;
canvasTemp.height = CANVAS_HEIGHT;

const ctxTemp = canvasTemp.getContext("2d");
ctxTemp.fillStyle = "grey";
ctxTemp.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
ctxTemp.globalCompositeOperation = "destination-out";
ctxTemp.filter = "blur(20px)";

const handleCharacterMove = () => {
  const radius = 100;
  const x = character.x + character.width / 2;
  const y = character.y + character.height / 2;
  ctxTemp.beginPath();
  ctxTemp.arc(x, y, radius, 0, Math.PI * 2);
  ctxTemp.fill();
};

handleCharacterMove();
on("characterMoved", throttle(handleCharacterMove, 250));

export const fog = Sprite({
  render: function () {
    this.context.drawImage(canvasTemp, 0, 0);
  },
});
