import { GameLoop } from "kontra";
import "./init";
import { mazeSprite } from "./customMaze";
import { character } from "./character";
import { fog } from "./fog";
import { intersects } from "./utils";

const loop = GameLoop({
  update: function () {
    character.update();
  },
  render: function () {
    const windowRect = {
      x: scrollX,
      y: scrollY,
      width: innerWidth,
      height: innerHeight,
    };
    mazeSprite.forEach((sprite) => {
      if (intersects(sprite, windowRect)) {
        sprite.render();
      }
    });
    character.render();
    fog.render();
  },
});

loop.start();
