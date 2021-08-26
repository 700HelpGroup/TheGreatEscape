import { init, initKeys } from "kontra";
import { WIDTH, HEIGHT } from "./constants";

const { canvas } = init();
initKeys();

canvas.width = WIDTH;
canvas.height = HEIGHT;
