import { Sprite, TileEngine } from "kontra";
import { MAZE_GRID_COUNT, CELL_WIDTH, CELL_HEIGHT } from "./constants";
import generateMaze from "./maze.js";

export const mazeObj = generateMaze(MAZE_GRID_COUNT);
export let tileEngine = null;

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

// console.log(mazeObj["contents"][0][0].getNeighboringCells(mazeObj));

function isVerticalStraightPath(_neighbour, _value) {
  return (
    _neighbour.left["value"] === _value &&
    _neighbour.right["value"] === _value &&
    _neighbour.top["value"] !== _value &&
    _neighbour.bottom["value"] !== _value
  );
}

function isHorizontalStraightPath(_neighbour, _value) {
  return (
    _neighbour.left["value"] !== _value &&
    _neighbour.right["value"] !== _value &&
    _neighbour.top["value"] === _value &&
    _neighbour.bottom["value"] === _value
  );
}

function isTopDeadEnd(_neighbour, _value) {
  return (
    _neighbour.left["value"] === _value &&
    _neighbour.right["value"] === _value &&
    _neighbour.top["value"] === _value &&
    _neighbour.bottom["value"] !== _value
  );
}

function isBottomDeadEnd(_neighbour, _value) {
  return (
    _neighbour.left["value"] === _value &&
    _neighbour.right["value"] === _value &&
    _neighbour.top["value"] !== _value &&
    _neighbour.bottom["value"] === _value
  );
}

function isLeftDeadEnd(_neighbour, _value) {
  return (
    _neighbour.left["value"] === _value &&
    _neighbour.right["value"] !== _value &&
    _neighbour.top["value"] === _value &&
    _neighbour.bottom["value"] === _value
  );
}

function isRightDeadEnd(_neighbour, _value) {
  return (
    _neighbour.left["value"] !== _value &&
    _neighbour.right["value"] === _value &&
    _neighbour.top["value"] === _value &&
    _neighbour.bottom["value"] === _value
  );
}

function isBottomLeftTurn(_neighbour, _value) {
  return (
    _neighbour.left["value"] === _value &&
    _neighbour.right["value"] !== _value &&
    _neighbour.top["value"] !== _value &&
    _neighbour.bottom["value"] === _value
  );
}

function isTopLeftTurn(_neighbour, _value) {
  return (
    _neighbour.left["value"] === _value &&
    _neighbour.right["value"] !== _value &&
    _neighbour.top["value"] === _value &&
    _neighbour.bottom["value"] !== _value
  );
}

function isBottomRightTurn(_neighbour, _value) {
  return (
    _neighbour.left["value"] !== _value &&
    _neighbour.right["value"] === _value &&
    _neighbour.top["value"] !== _value &&
    _neighbour.bottom["value"] === _value
  );
}

function isTopRightTurn(_neighbour, _value) {
  return (
    _neighbour.left["value"] !== _value &&
    _neighbour.right["value"] === _value &&
    _neighbour.top["value"] === _value &&
    _neighbour.bottom["value"] !== _value
  );
}

function isLeftPath(_neighbour, _value) {
  return (
    _neighbour.left["value"] === _value &&
    _neighbour.right["value"] !== _value &&
    _neighbour.top["value"] !== _value &&
    _neighbour.bottom["value"] !== _value
  );
}

function isRightPath(_neighbour, _value) {
  return (
    _neighbour.left["value"] !== _value &&
    _neighbour.right["value"] === _value &&
    _neighbour.top["value"] !== _value &&
    _neighbour.bottom["value"] !== _value
  );
}

function isTopPath(_neighbour, _value) {
  return (
    _neighbour.left["value"] !== _value &&
    _neighbour.right["value"] !== _value &&
    _neighbour.top["value"] === _value &&
    _neighbour.bottom["value"] !== _value
  );
}

function isBottomPath(_neighbour, _value) {
  return (
    _neighbour.left["value"] !== _value &&
    _neighbour.right["value"] !== _value &&
    _neighbour.top["value"] !== _value &&
    _neighbour.bottom["value"] === _value
  );
}

function isAllClear(_neighbour, _value) {
  return (
    _neighbour.left["value"] !== _value &&
    _neighbour.right["value"] !== _value &&
    _neighbour.top["value"] !== _value &&
    _neighbour.bottom["value"] !== _value
  );
}

console.log(mazeObj);

const maxRow = mazeObj["contents"].length - 1;
const maxcol = mazeObj["contents"][0].length - 1;

const spaceTiles = new Image();
spaceTiles.src = "assets/tiles.png";
spaceTiles.onload = function () {
  tileEngine = TileEngine({
    // tile size
    tilewidth: CELL_WIDTH,
    tileheight: CELL_HEIGHT,

    // map size in tiles
    width: MAZE_GRID_COUNT,
    height: MAZE_GRID_COUNT,

    // tileset object
    tilesets: [
      {
        firstgid: 1,
        image: spaceTiles,
      },
    ],

    // layer object
    layers: [
      {
        name: "ground",
        data: mazeObj["contents"]
          .map((cells) =>
            cells.map((cell) => {
              if (cell["value"] === "#") {
                if (cell.row === 0 && (cell.col === 0 || cell.col === maxcol)) return " 22";
                if (cell.row === maxRow && cell.col === 0) return "26";
                if (cell.row === maxRow && cell.col === maxcol) return "28";
                if (cell.col === 0 || cell.col === maxcol) return "20";
                if (cell.row === 0) return "30";
                if (cell.row === maxRow) return "21";
                // if (cell.col === 0 && cell.row !== 0 && cell.row !== maxRow) return "20";
                // if (cell.row === 0 && cell.col === 0) return "22";
                // if (cell.row === maxRow && cell.col === 0) "25";
                const neighbour = cell.getNeighboringCells(mazeObj);
                if (neighbour.bottom["value"] === " ") return "30";
                if (isBottomDeadEnd(neighbour, " ")) return "30";
                else if (isTopDeadEnd(neighbour, " ")) return "22";
                else if (isLeftPath(neighbour, " ")) return "16";
                else if (isRightPath(neighbour, " ")) return "17";
                else if (isTopPath(neighbour, " ")) return "18";
                else if (isVerticalStraightPath(neighbour, " ")) return "20";
                else if (isHorizontalStraightPath(neighbour, " ")) return "21";
                else if (isTopRightTurn(neighbour, " ")) return "27";
                else if (isBottomLeftTurn(neighbour, " ")) return "26";
                else if (isTopLeftTurn(neighbour, " ")) return "29";
                else if (isBottomRightTurn(neighbour, " ")) return "28";
                else if (isAllClear(neighbour, " ")) return "25";
                else if (isLeftDeadEnd(neighbour, " ")) return "23";
                else if (isRightDeadEnd(neighbour, " ")) return "24";
                return "30";
              } else if (cell["value"] === " " || cell["value"] === "S" || cell["value"] === "E") {
                const neighbour = cell.getNeighboringCells(mazeObj);
                if (isVerticalStraightPath(neighbour, "#")) return "9";
                else if (isHorizontalStraightPath(neighbour, "#")) return "10";
                else if (isTopDeadEnd(neighbour, "#")) return "1";
                else if (isBottomDeadEnd(neighbour, "#")) return "2";
                else if (isLeftDeadEnd(neighbour, "#")) return "3";
                else if (isRightDeadEnd(neighbour, "#")) return "4";
                else if (isTopLeftTurn(neighbour, "#")) return "5";
                else if (isTopRightTurn(neighbour, "#")) return "8";
                else if (isBottomLeftTurn(neighbour, "#")) return "6";
                else if (isBottomRightTurn(neighbour, "#")) return "7";
                else if (isLeftPath(neighbour, "#")) return "11";
                else if (isRightPath(neighbour, "#")) return "13";
                else if (isBottomPath(neighbour, "#")) return "12";
                else if (isTopPath(neighbour, "#")) return "14";
                else if (isAllClear(neighbour, "#")) return "15";
                else return "31";
              } else return "31";
            })
          )
          .flat(),
      },
    ],
  });
};
