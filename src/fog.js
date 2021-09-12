import { Sprite, on } from "kontra";
import { CELL_HEIGHT, CELL_WIDTH, MAZE_GRID_COUNT} from "./constants";
import { throttle } from "./helper";

const canvasTemp = document.createElement("canvas");
canvasTemp.width = CELL_WIDTH * MAZE_GRID_COUNT;
canvasTemp.height = CELL_HEIGHT * MAZE_GRID_COUNT;

const ctxTemp = canvasTemp.getContext("2d");
ctxTemp.fillStyle = "grey";
ctxTemp.fillRect(0, 0, canvasTemp.width, canvasTemp.height);
ctxTemp.globalCompositeOperation = "destination-out";
ctxTemp.filter = "blur(20px)";

const handleCharacterMove = (character) => {
  const radius = 100;
  const x = character.x + character.width / 2;
  console.log(character)
  const y = character.y + character.height / 2;
  ctxTemp.beginPath();
  ctxTemp.arc(x, y, radius, 0, Math.PI * 2);
  ctxTemp.fill();
};

//on("characterMoved", throttle(handleCharacterMove, 250));

export const fog = Sprite({
  update: function (character) {
  handleCharacterMove(character);
  },
  render: function () {
    this.context.drawImage(canvasTemp, 0, 0);
  },
});
