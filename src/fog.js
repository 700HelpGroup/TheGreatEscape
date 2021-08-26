import { Sprite, on } from "kontra";
import { WIDTH, HEIGHT } from "./constants";
import { character } from "./character";
import { throttle } from "./utils";

const canvasTemp = document.createElement("canvas");
canvasTemp.width = WIDTH;
canvasTemp.height = HEIGHT;

const ctxTemp = canvasTemp.getContext("2d");
ctxTemp.fillStyle = "grey";
ctxTemp.fillRect(0, 0, WIDTH, HEIGHT);
ctxTemp.globalCompositeOperation = "destination-out";
ctxTemp.filter = "blur(20px)";

const handleCharacterMove = () => {
  const radius = 200;
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
