import { init, initKeys } from "kontra";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants";

export const { canvas, context } = init();
initKeys();

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
