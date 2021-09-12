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

function floorTile(cell, neighbour) {
  if (cell.isGround()) {
    if (isTopDeadEnd(neighbour, PROP_VALUE.WALL)) return "1";
    else if (isBottomDeadEnd(neighbour, PROP_VALUE.WALL)) return "2";
    else if (isLeftDeadEnd(neighbour, PROP_VALUE.WALL)) return "3";
    else if (isRightDeadEnd(neighbour, PROP_VALUE.WALL)) return "4";
    else if (isTopLeftTurn(neighbour, PROP_VALUE.WALL)) return "5";
    else if (isBottomLeftTurn(neighbour, PROP_VALUE.WALL)) return "6";
    else if (isBottomRightTurn(neighbour, PROP_VALUE.WALL)) return "7";
    else if (isTopRightTurn(neighbour, PROP_VALUE.WALL)) return "8";
    else if (isVerticalStraightPath(neighbour, PROP_VALUE.WALL)) return "9";
    else if (isHorizontalStraightPath(neighbour, PROP_VALUE.WALL)) return "10";
    else if (isBottom(neighbour, PROP_VALUE.WALL)) return "12";
    else if (isLeft(neighbour, PROP_VALUE.WALL)) return "11";
    else if (isRight(neighbour, PROP_VALUE.WALL)) return "13";
    else if (isTop(neighbour, PROP_VALUE.WALL)) return "14";
    else if (isAllClear(neighbour, PROP_VALUE.WALL)) return "15";
  } else if (cell.isStart() || cell.isEnd()) return "16";
  return "17";
}

function wallTile(cell, neighbour, maxRow, maxCol) {
  if (cell.isWall()) {
    if (cell.row === 0 && cell.col === maxCol) return "21";
    if (cell.row === 0 && cell.col === 0) return "22";
    if (cell.row === 0) return neighbour["bottom"].isWall() ? "23" : "28";
    if (cell.row === MAZE_GRID_COUNT - 1 && cell.col === 0) return "27";
    if (cell.row === maxRow && cell.col === maxCol) return "26";
    if (cell.row === maxRow) return neighbour["top"].isWall() ? "25" : "28";
    if (cell.col === 0) return neighbour["right"].isWall() ? "22" : "20";
    if (cell.col === maxCol) return neighbour["left"].isWall() ? "21" : "20";

    if (isTopDeadEnd(neighbour, " ")) return "19";
    else if (isVerticalStraightPath(neighbour, " ")) return "20";
    else if (isRight(neighbour, " ")) return "21";
    else if (isLeft(neighbour, " ")) return "22";
    else if (isAllClear(neighbour, " ")) return "23";
    else if (isBottomDeadEnd(neighbour, " ")) return "24";
    else if (isBottom(neighbour, " ")) return "25";
    else if (isBottomRightTurn(neighbour, " ")) return "26";
    else if (isBottomLeftTurn(neighbour, " ")) return "27";
    else if (
      isHorizontalStraightPath(neighbour, " ") ||
      isLeftDeadEnd(neighbour, " ") ||
      isRightDeadEnd(neighbour, " ")
    )
      return "28";
    else if (isTopLeftTurn(neighbour, " ")) return "29";
    else if (isTopRightTurn(neighbour, " ")) return "30";
    else if (isTop(neighbour, " ")) return "31";
  }
  return 0;
}

function decorationTiles(cell, neighbour) {
  if (cell.isWall() && !neighbour["bottom"].isWall()) {
    if (
      cell["row"] === 0 &&
      cell["col"] !== 0 &&
      neighbour["left"].isWall() &&
      neighbour["right"].isWall()
    ) {
      const botLeftIsWall = neighbour["bottomLeft"].isWall();
      const botrightIsWall = neighbour["bottomRight"].isWall();
      if (botLeftIsWall && !botrightIsWall) {
        return "32";
      } else if (!botLeftIsWall && !botrightIsWall) {
        return "33";
      } else if (!botLeftIsWall && botrightIsWall) {
        return "34";
      } else if (botLeftIsWall && botrightIsWall) {
        return "35";
      }
    }
    if (!alreadyHaveProp(cell, 2, 4) && Math.random() >= 0.4) {
      return "36";
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
