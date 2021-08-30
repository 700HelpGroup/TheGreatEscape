import { init, initKeys } from "kontra";
import { WIDTH, HEIGHT } from "./constants";

export const { canvas, context } = init();
initKeys();

canvas.width = WIDTH;
canvas.height = HEIGHT;
