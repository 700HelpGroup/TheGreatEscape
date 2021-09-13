import { drawText } from "./canvasObjects";

export function drawFinishScene(context, canvas) {
  const xPos = 220;
  const yPos = 180;
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawText(
    context,
    canvas,
    "SUCCESSFUL ESCAPE",
    1,
    "50px",
    "rgb(65,216,172)",
    xPos,
    yPos,
    3,
    "cyan"
  );
  drawText(context, canvas, "On our way back to Earth", 1, "20px", "white", xPos + 150, yPos + 50);
}
