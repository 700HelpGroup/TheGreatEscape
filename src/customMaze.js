import { MAZE_GRID_COUNT, PROP_VALUE } from "./constants";
import generateMaze from "./maze.js";

export const mazeObj = generateMaze(MAZE_GRID_COUNT);
const objectPosition = [];

function layoutEqualTo(layout, neighbour, value) {
  return Object.entries(layout).reduce((acc, [field, bool]) => {
    const neigbourValue = neighbour[field]["value"];
    return acc && (bool === 0 ? neigbourValue !== value : neigbourValue === value);
  }, true);
}

function isVerticalStraightPath(...arg) {
  return layoutEqualTo({ left: 1, right: 1, top: 0, bottom: 0 }, ...arg);
}

function isHorizontalStraightPath(...arg) {
  return layoutEqualTo({ left: 0, right: 0, top: 1, bottom: 1 }, ...arg);
}

function isTopDeadEnd(...arg) {
  return layoutEqualTo({ left: 1, right: 1, top: 1, bottom: 0 }, ...arg);
}

function isBottomDeadEnd(...arg) {
  return layoutEqualTo({ left: 1, right: 1, top: 0, bottom: 1 }, ...arg);
}

function isLeftDeadEnd(...arg) {
  return layoutEqualTo({ left: 1, right: 0, top: 1, bottom: 1 }, ...arg);
}

function isRightDeadEnd(...arg) {
  return layoutEqualTo({ left: 0, right: 1, top: 1, bottom: 1 }, ...arg);
}

function isBottomLeftTurn(...arg) {
  return layoutEqualTo({ left: 1, right: 0, top: 0, bottom: 1 }, ...arg);
}

function isTopLeftTurn(...arg) {
  return layoutEqualTo({ left: 1, right: 0, top: 1, bottom: 0 }, ...arg);
}

function isBottomRightTurn(...arg) {
  return layoutEqualTo({ left: 0, right: 1, top: 0, bottom: 1 }, ...arg);
}

function isTopRightTurn(...arg) {
  return layoutEqualTo({ left: 0, right: 1, top: 1, bottom: 0 }, ...arg);
}

function isLeft(...arg) {
  return layoutEqualTo({ left: 1, right: 0, top: 0, bottom: 0 }, ...arg);
}

function isRight(...arg) {
  return layoutEqualTo({ left: 0, right: 1, top: 0, bottom: 0 }, ...arg);
}

function isTop(...arg) {
  return layoutEqualTo({ left: 0, right: 0, top: 1, bottom: 0 }, ...arg);
}

function isBottom(...arg) {
  return layoutEqualTo({ left: 0, right: 0, top: 0, bottom: 1 }, ...arg);
}

function isAllClear(...arg) {
  return layoutEqualTo({ left: 0, right: 0, top: 0, bottom: 0 }, ...arg);
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

function wallTile(cell, neighbour, maxRow, maxCol) {
  if (cell.isWall()) {
    if (cell.row === 0 && cell.col === maxCol) return "5";
    if (cell.row === 0 && cell.col === 0) return "6";
    if (cell.row === 0) return neighbour["bottom"].isWall() ? "7" : "12";
    if (cell.row === MAZE_GRID_COUNT - 1 && cell.col === 0) return "11";
    if (cell.row === maxRow && cell.col === maxCol) return "10";
    if (cell.row === maxRow) return neighbour["top"].isWall() ? "9" : "12";
    if (cell.col === 0) return neighbour["right"].isWall() ? "6" : "4";
    if (cell.col === maxCol) return neighbour["left"].isWall() ? "5" : "4";

    if (isTopDeadEnd(neighbour, " ")) return "3";
    else if (isVerticalStraightPath(neighbour, " ")) return "4";
    else if (isRight(neighbour, " ")) return "5";
    else if (isLeft(neighbour, " ")) return "6";
    else if (isAllClear(neighbour, " ")) return "7";
    else if (isBottomDeadEnd(neighbour, " ")) return "8";
    else if (isBottom(neighbour, " ")) return "9";
    else if (isBottomRightTurn(neighbour, " ")) return "10";
    else if (isBottomLeftTurn(neighbour, " ")) return "11";
    else if (
      isHorizontalStraightPath(neighbour, " ") ||
      isLeftDeadEnd(neighbour, " ") ||
      isRightDeadEnd(neighbour, " ")
    )
      return "12";
    else if (isTopLeftTurn(neighbour, " ")) return "13";
    else if (isTopRightTurn(neighbour, " ")) return "14";
    else if (isTop(neighbour, " ")) return "15";
  }
  return 0;
}

function decorationTiles(cell, neighbour) {
  if (cell.isWall() && !neighbour["bottom"].isWall()) {
    if (!alreadyHaveProp(cell, 2, 4) && Math.random() >= 0.4) {
      return "16";
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

export const groundTileLayout = generateTileMap(() => "1");
export const wallTileLayout = generateTileMap(wallTile);
export const decorationsLayout = generateTileMap((cell, neighbour) => {
  const tileIndex = decorationTiles(cell, neighbour);
  if (tileIndex !== 0) objectPosition.push({ x: cell["row"], y: cell["col"] });
  return tileIndex;
});
