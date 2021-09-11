import { collides, Sprite, SpriteSheet } from "kontra";
import { CELL_WIDTH, CELL_HEIGHT, ROBOT_COUNT } from "./constants";
import { mazeObj } from "./customMaze";
import { generatePath } from "./pathGenerator";
import { character } from "./character";
import { createVision } from "./vision";
import { tileEngine } from "./customMaze";

const moveDelta = 0.5;
var playerCaptured = false;

const createRobot = () => {
  const robot = Sprite({
    x: null,
    y: null,
    direction: "n/a",
    width: Math.min(CELL_WIDTH, CELL_HEIGHT) * 0.8,
    height: Math.min(CELL_WIDTH, CELL_HEIGHT) * 0.8,
    path: null,
    currentIndex: null,
    currentcell: null,

    init: function () {
      this.resetPath();
      this.x = this.path[0][0] * CELL_WIDTH;
      this.y = this.path[0][1] * CELL_HEIGHT;
    },

    resetPath: function (start = null, end = null) {
      this.path = generatePath(mazeObj, start, end).map((cell) => [cell.col, cell.row]);
      this.currentIndex = 0;
      this.currentcell = this.path[this.currentIndex];
    },

    travelAlongPath: function () {
      var x = this.currentcell[0] * CELL_WIDTH;
      var y = this.currentcell[1] * CELL_HEIGHT;

      if (this.x >= x) {
        this.x -= moveDelta;
      } else {
        this.x += moveDelta;
      }
      if (this.y >= y) {
        this.y -= moveDelta;
      } else {
        this.y += moveDelta;
      }
    },

    determineDirection: function () {
      if (this.currentIndex < this.path.length - 1) {
        var nextCell = this.path[this.currentIndex + 1];
        var currX = this.currentcell[0];
        var currY = this.currentcell[1];
        var nextX = nextCell[0];
        var nextY = nextCell[1];
        if (currX > nextX) {
          this.direction = "left";
        }
        if (currX < nextX) {
          this.direction = "right";
        } else {
          if (currY < nextY) {
            this.direction = "down";
          }

          if (currY > nextY) {
            this.direction = "up";
          }
        }
      }
    },

    playerDetect: function () {
      // if(collides(character, Robot)){
      //playerCaptured = true;
      //window.alert("You Lose Muthafucka!!!!")
      //console.log('"You Lose Muthafucka!!!!"')
      //}

      //  if((Math.abs(character.x - Robot.x) <= 1) && Math.abs(character.y - Robot.y) <= 1){
      //  playerCaptured = true;
      // console.log('"You Lose Muthafucka!!!!"')

      //}

      switch (this.direction) {
        case "up":
          if (
            character.y - robot.y >= -1 &&
            character.y - robot.y < 0 /*&& (character.x === Robot.x)*/
          ) {
            playerCaptured = true;
            console.log("You got caught in the up direction");
          }
          break;

        case "down":
          if (
            character.y - robot.y <= 1 &&
            character.y - robot.y > 0 /*&& (character.x === Robot.x)*/
          ) {
            playerCaptured = true;
            console.log("You got caught in the down direction");
          }
          break;

        case "left":
          if (
            character.x - robot.x >= -1 &&
            character.x - robot.x < 0 /*&& (character.y === Robot.y)*/
          ) {
            playerCaptured = true;
            console.log("You got caught in the left direction");
          }
          break;

        case "right":
          if (
            character.x - robot.x <= 1 &&
            character.x - robot.x > 0 /*&& (character.y === Robot.y)*/
          ) {
            playerCaptured = true;
            console.log("You got caught in the right direction");
          }
          break;
      }
    },

    updateMovement: function () {
      const prevX = this.x;
      const prevY = this.y;
      this.travelAlongPath(this.currentcell);
      if (
        this.x === this.currentcell[0] * CELL_WIDTH &&
        this.y === this.currentcell[1] * CELL_HEIGHT
      ) {
        this.determineDirection();
        this.currentIndex++;

        if (this.currentIndex === this.path.length) {
          this.resetPath(mazeObj.contents[this.currentcell[1]][this.currentcell[0]]);
        }

        if (this.animations) {
          if (this.direction === "down") {
            this.playAnimation("moveDown");
          } else if (this.direction === "up") {
            this.playAnimation("moveUp");
          } else if (this.direction === "left") {
            this.playAnimation("moveLeft");
          } else if (this.direction === "right") {
            this.playAnimation("moveRight");
          }
        }
      }
      this.currentcell = this.path[this.currentIndex];
      this.playerDetect();
      //console.log("player Captured? ", playerCaptured)
      //console.log('robot', (Robot));
      //console.log('player', (character));
      console.log("the current cell", this.currentcell);
      console.log("The next Cell is ", this.path[this.currentIndex + 1]);
      console.log("direction of the robot is, ", robot.direction);
    },
  });

  robot.init();

  const vision = createVision(robot);

  return { robot, vision };
};

export const robots = Array(ROBOT_COUNT).fill().map(createRobot);

const robotImage = new Image();
robotImage.src = "assets/robot.png";
robotImage.onload = function () {
  const spriteSheet = SpriteSheet({
    image: robotImage,
    frameWidth: 32,
    frameHeight: 32,

    animations: {
      moveDown: {
        frames: "0..3",
        frameRate: 10,
      },
      moveUp: {
        frames: "4..7",
        frameRate: 10,
      },
      moveRight: {
        frames: "8..11",
        frameRate: 10,
      },
      moveLeft: {
        frames: "12..15",
        frameRate: 10,
      },
    },
  });

  robots.forEach(({ robot }) => {
    robot.animations = spriteSheet.animations;
  });
};
