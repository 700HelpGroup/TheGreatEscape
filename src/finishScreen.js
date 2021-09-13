import { drawText } from "./canvasObjects";

export function drawFinishScene(context, canvas) {
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawText(
    context,
    canvas,
    "YOU HAVE ESCAPED!",
    1,
    "50px",
    "rgb(65,216,172)",
    220,
    200,
    3,
    "cyan"
  );
}
