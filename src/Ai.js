import { collides, Sprite } from "kontra";
import { CELL_WIDTH, CELL_HEIGHT, ROBOT_COUNT } from "./constants";
import { mazeObj } from "./customMaze";
import { generatePath } from "./pathGenerator";
import { character } from "./character";

const moveDelta = 1;
var playerCaptured = false;

const createRobot = () => {
  const Robot = Sprite({
    x: null,
    y: null,
    direction: 'n/a',
    color: "purple",
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
      this.path = generatePath(mazeObj, start, end).map((cell) => [
        cell.col,
        cell.row,
      ]);
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

    determineDirection: function() {

      if(this.currentIndex < (this.path.length - 2)){
        var nextCell = this.path[(this.currentIndex + 1)]
        var nextX = nextCell[0];
        var nextY = nextCell[1];
        if(this.currentcell[0] > nextX){
          this.direction = 'left';
        }
        if(this.currentcell[0] < nextX){
          this.direction = 'right';
        }
        else{
          if(this.currentcell[1] < nextY){
            this.direction = 'down';
          }

          if(this.currentcell[1] > nextY){
            this.direction = 'up';
          }
        }

      }
    },

    playerDetect: function() {

     // if(collides(character, Robot)){
        //playerCaptured = true;
        //window.alert("You Lose Muthafucka!!!!")
        //console.log('"You Lose Muthafucka!!!!"')
      //}

    //  if((Math.abs(character.x - Robot.x) <= 1) && Math.abs(character.y - Robot.y) <= 1){
      //  playerCaptured = true;
       // console.log('"You Lose Muthafucka!!!!"')

      //}

      switch(this.direction){
        case "up":
          if((character.y - Robot.y >= -1) && (character.y - Robot.y < 0) /*&& (character.x === Robot.x)*/ ){
            playerCaptured = true;
            console.log('You got caught in the up direction')
          }
          break;
        
        case "down":
          if((character.y - Robot.y <= 1) && (character.y - Robot.y > 0) /*&& (character.x === Robot.x)*/){
            playerCaptured = true;
            console.log('You got caught in the down direction')
          }
          break;

        case "left":
          if((character.x - Robot.x >= -1) && (character.x - Robot.x < 0) /*&& (character.y === Robot.y)*/){
            playerCaptured = true;
            console.log('You got caught in the left direction')
          }
          break;

        case "right":
          if((character.x - Robot.x <= 1) && (character.x - Robot.x > 0) /*&& (character.y === Robot.y)*/){
            playerCaptured = true;
            console.log('You got caught in the right direction')
          }
          break;
      }
    },



    update: function () {
      this.travelAlongPath(this.currentcell);
      if (
        this.x === this.currentcell[0] * CELL_WIDTH &&
        this.y === this.currentcell[1] * CELL_HEIGHT
      ) {
        this.determineDirection();
        this.currentIndex++;
        if (this.currentIndex === this.path.length) {
          this.resetPath(
            mazeObj.contents[this.currentcell[1]][this.currentcell[0]]
          );
        }
      }
      this.currentcell = this.path[this.currentIndex];
     this.playerDetect();
     //console.log("player Captured? ", playerCaptured)
     //console.log('robot', (Robot));
     //console.log('player', (character));
     //console.log('direction of the robot is, ', Robot.direction)


    },
  });

  Robot.init();

  return Robot;
};

export const robots = Array(ROBOT_COUNT).fill().map(createRobot);
