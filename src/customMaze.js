import { MAZE_GRID_COUNT } from "./constants";
import generateMaze from "./maze.js";

export const mazeObj = generateMaze(MAZE_GRID_COUNT);
const objectPosition = [];

function layoutEqualTo(layout, neighbour, value) {
  return Object.entries(layout).reduce((acc, [field, bool]) => {
    const neigbourValue = neighbour[field]["value"];
    return (
      acc && (bool === 0 ? neigbourValue !== value : neigbourValue === value)
    );
  }, true);
}

function alreadyHaveProp(cell, xRange = 0, yRange = 0) {
  const result = objectPosition.some((obj) => {
    return (
      obj["x"] >= cell["row"] - xRange &&
      obj["x"] <= cell["row"] + xRange &&
      obj["y"] >= cell["col"] - yRange &&
      obj["y"] <= cell["col"] + yRange
    );
  });
  return result;
}

function floorTile(cell, neighbour) {
  if (cell.isEnd()) {
    return "4";
  } else {
    return "1";
  }
}

function wallTile(cell, neighbour, maxRow, maxCol) {
  if (cell.isWall()) {
    return "2";
  }
  return 0;
}

function decorationTiles(cell, neighbour) {
  if (cell.isWall() && !neighbour["bottom"].isWall()) {
    if (!alreadyHaveProp(cell, 2, 4) && Math.random() >= 0.8) {
      return "3";
    }
  }

  return 0;
}

function generateTileMap(tileFunc) {
  const content = mazeObj["contents"];
  const maxRow = content.length - 1;
  const maxCol = content[0].length - 1;
  return content
    .map((cells) =>
      cells.map((cell) => {
        const neighbour = cell.getNeighboringCells(mazeObj);
        return tileFunc(cell, neighbour, maxRow, maxCol);
      })
    )
    .flat();
}

export const groundTileLayout = generateTileMap(floorTile);
export const wallTileLayout = generateTileMap(wallTile);
export const decorationsLayout = generateTileMap((cell, neighbour) => {
  const tileIndex = decorationTiles(cell, neighbour);
  if (tileIndex !== 0) objectPosition.push({ x: cell["row"], y: cell["col"] });
  return tileIndex;
});
