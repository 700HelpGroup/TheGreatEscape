import { Sprite, TileEngine } from "kontra";
import { MAZE_GRID_COUNT, CELL_WIDTH, CELL_HEIGHT } from "./constants";
import generateMaze from "./maze.js";
import { generatePath } from "./pathGenerator";

export const mazeObj = generateMaze(MAZE_GRID_COUNT);
export let tileEngine = null;

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

function isFacingFrontAllSidesClear(_neighbour, _value) {
  return (
    _neighbour.bottom["value"] === _value &&
    _neighbour.left["value"] !== _value &&
    _neighbour.right["value"] !== _value &&
    _neighbour.top["value"] !== _value
  );
}

const maxRow = mazeObj["contents"].length - 1;
const maxcol = mazeObj["contents"][0].length - 1;

const groundTileLayout = mazeObj["contents"]
  .map((cells) =>
    cells.map((cell) => {
      if (cell["value"] === " ") {
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
        else return "16";
      } else if (cell["value"] === "S" || cell["value"] === "E") {
        return "32";
      } else return "33";
    })
  )
  .flat();

const wallTileLayout = mazeObj["contents"]
  .map((cells) =>
    cells.map((cell) => {
      if (cell["value"] === "#") {
        const neighbour = cell.getNeighboringCells(mazeObj);
        if (cell.row === 0 && cell.col === 0) return " 20";
        if (cell.row === 0 && cell.col === maxcol) return " 19";
        if (cell.row === maxRow && cell.col === 0) return "25";
        if (cell.row === maxRow && cell.col === maxcol) return "24";
        if (cell.col === 0) {
          if (neighbour.right["value"] === "#") {
            return "20";
          } else {
            return "18";
          }
        }
        if (cell.col === maxcol) {
          if (neighbour.left["value"] === "#") {
            return "19";
          } else {
            return "18";
          }
        }
        if (cell.row === maxRow) {
          if (neighbour.top["value"] === "#") {
            return "23";
          } else {
            return "26";
          }
        }
        if (cell.row === 0) {
          if (neighbour.bottom["value"] === "#") {
            return "21";
          } else {
            return "26";
          }
        }

        if (isLeftDeadEnd(neighbour, " ")) return "26";
        else if (isRightDeadEnd(neighbour, " ")) return "26";
        else if (isTopDeadEnd(neighbour, " ")) return "17";
        else if (isBottomDeadEnd(neighbour, " ")) return "22";
        else if (isFacingFrontAllSidesClear(neighbour, " ")) return "23";
        else if (isVerticalStraightPath(neighbour, " ")) return "18";
        else if (isLeftPath(neighbour, " ")) return "20";
        else if (isRightPath(neighbour, " ")) return "19";
        else if (isHorizontalStraightPath(neighbour, " ")) return "26";
        else if (isAllClear(neighbour, " ")) return "21";
        else if (isTopPath(neighbour, " ")) return "31";
        else if (isTopLeftTurn(neighbour, " ")) return "29";
        else if (isTopRightTurn(neighbour, " ")) return "30";
        else if (isBottomLeftTurn(neighbour, " ")) return "25";
        else if (isBottomRightTurn(neighbour, " ")) return "24";
        else return 0;
      } else return 0;
    })
  )
  .flat();

const objectPosition = [];

function alreadyHaveProp(_cell, _xRange = 0, _yRange = 0) {
  const result = objectPosition.some((deco) => {
    return (
      (deco["x"] === _cell["row"] ||
        deco["x"] === _cell["row"] - _xRange ||
        deco["x"] === _cell["row"] + _xRange) &&
      (deco["y"] === _cell["col"] ||
        deco["y"] === _cell["col"] - _yRange ||
        deco["y"] === _cell["col"] + _yRange)
    );
  });
  return result;
}

const glassContainers = [];
const doors = generatePath(
  mazeObj,
  mazeObj["contents"][1][1],
  mazeObj["contents"][MAZE_GRID_COUNT - 2][Math.floor(MAZE_GRID_COUNT / 2)]
)
  .map((d) => {
    const cell = mazeObj["contents"][d["row"]][d["col"]];
    const neighbour = cell.getNeighboringCells(mazeObj);
    if (
      neighbour.left["value"] === "#" &&
      neighbour.right["value"] === "#" &&
      neighbour.topLeft["value"] !== "#" &&
      neighbour.bottomLeft["value"] !== "#" &&
      neighbour.topRight["value"] !== "#" &&
      neighbour.bottomRight["value"] !== "#"
    )
      return cell;
    else return null;
  })
  .filter((cell) => cell !== null);

const propsLayout = mazeObj["contents"]
  .map((cells) => {
    return cells.map((cell) => {
      if (
        cell.row === 0 ||
        cell.row === maxRow ||
        cell.col === 0 ||
        cell.col === maxcol ||
        cell.value === "E" ||
        cell.value === "S"
      )
        return 0;
      const neighbour = cell.getNeighboringCells(mazeObj);
      if (
        cell["value"] !== "#" &&
        (isLeftDeadEnd(neighbour, "#") ||
          isTopDeadEnd(neighbour, "#") ||
          isRightDeadEnd(neighbour, "#") ||
          isBottomDeadEnd(neighbour, "#"))
      ) {
        if (Math.random() > 0.9) {
          objectPosition.push({ x: cell["row"], y: cell["col"] });
          return "43";
        }
      }

      if (
        cell["value"] === " " &&
        (isTopDeadEnd(neighbour, "#") ||
          isRightDeadEnd(neighbour, "#") ||
          isLeftDeadEnd(neighbour, "#") ||
          isBottomDeadEnd(neighbour, "#")) &&
        !alreadyHaveProp(cell) &&
        !alreadyHaveProp(neighbour["top"])
      ) {
        if (Math.random() > 0.75) {
          glassContainers.push({ row: cell["row"], col: cell["col"] });
        }
      }

      return 0;
    });
  })
  .flat();

doors.forEach((door) => {
  propsLayout[door["row"] * MAZE_GRID_COUNT + door["col"]] = "34";
  propsLayout[door["row"] * MAZE_GRID_COUNT + (door["col"] - 1)] = "36";
  objectPosition.push({ x: door["row"], y: door["col"] });
  objectPosition.push({ x: door["row"], y: door["col"] - 1 });
});

glassContainers.forEach((container) => {
  propsLayout[container["row"] * MAZE_GRID_COUNT + container["col"]] = "46";
  propsLayout[(container["row"] - 1) * MAZE_GRID_COUNT + container["col"]] = "45";
  objectPosition.push({ x: container["row"], y: container["col"] });
});

const decorationsLayout = mazeObj["contents"]
  .map((cells) =>
    cells.map((cell) => {
      const neighbour = cell.getNeighboringCells(mazeObj);
      if (cell["row"] === 0 && cell["col"] !== 0) {
        if (
          neighbour.left["value"] === "#" &&
          neighbour.right["value"] === "#" &&
          neighbour.bottom["value"] !== "#" &&
          neighbour.bottomLeft["value"] === "#" &&
          neighbour.bottomRight["value"] === "#"
        ) {
          objectPosition.push({ x: cell["row"], y: cell["col"] });
          return "40";
        } else if (
          neighbour.left["value"] === "#" &&
          neighbour.bottom !== "#" &&
          neighbour.right["value"] === "#" &&
          neighbour.bottomRight["value"] !== "#" &&
          neighbour.bottomLeft["value"] === "#"
        ) {
          objectPosition.push({ x: cell["row"], y: cell["col"] });
          return "37";
        } else if (
          neighbour.left["value"] === "#" &&
          neighbour.bottom["value"] !== "#" &&
          neighbour.right["value"] === "#" &&
          neighbour.bottomRight["value"] !== "#" &&
          neighbour.bottomLeft["value"] !== "#"
        ) {
          objectPosition.push({ x: cell["row"], y: cell["col"] });
          return "38";
        } else if (
          neighbour.left["value"] === "#" &&
          neighbour.bottom["value"] !== "#" &&
          neighbour.right["value"] === "#" &&
          neighbour.bottomRight["value"] === "#" &&
          neighbour.bottomLeft["value"] !== "#"
        ) {
          objectPosition.push({ x: cell["row"], y: cell["col"] });
          return "39";
        }
      }

      if (
        cell["value"] === "#" &&
        neighbour.bottom["value"] === " " &&
        !alreadyHaveProp(cell, 2, 4)
      ) {
        if (Math.random() > 0.85) {
          objectPosition.push({ x: cell["row"], y: cell["col"] });
          return "41";
        }
      }
      return 0;
    })
  )
  .flat();

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
        data: groundTileLayout,
      },
      {
        name: "wall",
        data: wallTileLayout,
      },
      {
        name: "decoration",
        data: decorationsLayout,
      },
      {
        name: "props",
        data: propsLayout,
      },
    ],
  });
};
