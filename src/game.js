import { TileEngine } from "kontra";
import { tileEngine } from "./customMaze";

let tileEngine = null;

function updateGame(context, canvas, dt) {
  if (tileEngine !== null) {
    // tileEngine.addObject(character);
    // characterAdded = true;
    // robots.forEach(({ robot, vision }) => {
    //   tileEngine.addObject(robot);
    //   tileEngine.addObject(vision);
    // });
  }
}

function renderGame(context, canvas) {
  if (tileEngine !== null) tileEngine.render();
}

export default function Game(context, canavs, assets) {
  tileEngine = TileEngine({
    tilewidth: CELL_WIDTH,
    tileheight: CELL_HEIGHT,
    width: MAZE_GRID_COUNT,
    height: MAZE_GRID_COUNT,
    tilesets: [
      {
        firstgid: 1,
        image: assets["tiles"],
      },
    ],
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
        name: "doorsOpened",
        data: doorsOpenedLayout,
      },
      {
        name: "doors",
        data: doorLayout,
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
  return [updateGame, renderGame];
}
