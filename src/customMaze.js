import { Sprite } from "kontra";
import { MAZE_GRID_COUNT, CELL_WIDTH, CELL_HEIGHT } from "./constants";
import generateMaze from "./maze.js";

export const mazeObj = generateMaze(MAZE_GRID_COUNT);

const getCellColor = (value) => {
  switch (value) {
    case "#":
      return "black";
    case "S":
      return "green";
    case "E":
      return "red";
    default:
      return "blue";
  }
};

export const mazeSprite = Array(MAZE_GRID_COUNT)
  .fill()
  .map((_, row) =>
    Array(MAZE_GRID_COUNT)
      .fill()
      .map((_, col) => {
        const value = mazeObj.contents[row][col].value;
        return Sprite({
          x: col * CELL_WIDTH,
          y: row * CELL_HEIGHT,
          color: getCellColor(value),
          width: CELL_WIDTH,
          height: CELL_HEIGHT,
          isWall: value === "#",
        });
      })
  )
  .flat();
