import generateMaze from "./maze.js";
const { init, Sprite, GameLoop , initKeys, keyPressed, collides } = kontra

//states
let moveDelta = 2
let mazeSprite = []

//initialization
const { canvas } = init();
initKeys()

//object creation
const mazeObj = generateMaze(20)
const numRows = mazeObj.contents.length;
const numCols = mazeObj.contents[0].length;
const cellWidth = 1000/numCols;
const cellHeight = 400/numRows;
for (let row = 0; row < numRows; row++){
  for (let col = 0; col < numCols; col++){
    const rectX = col * cellWidth;
    const rectY = row * cellHeight;
    const mazeItem = Sprite({
      x: rectX,       
      y: rectY,
      color: mazeObj.contents[row][col].value === "#" ? 'black' : "blue" ,
      width: cellWidth,     
      height: cellHeight, 
      isWall: mazeObj.contents[row][col].value === "#"
    })
    mazeSprite.push(mazeItem)
  }
}

const character = Sprite({
  x: mazeObj.start.col*cellWidth,       
  y: mazeObj.start.row*cellHeight,
  color: 'white',  
  width: 20,     
  height: 20,   
  update: function() {
    const prevX = this.x;
    const prevY = this.y;
    if (keyPressed('left')){
      this.x -= moveDelta
    }else if (keyPressed('right')){
      this.x += moveDelta
    }else if (keyPressed('up')){
      this.y -= moveDelta
    }else if (keyPressed('down')){
      this.y += moveDelta
    }
    const isColliding = mazeSprite.reduce((acc , val) => {
      if (acc === true) return true;
      if (val.isWall) return collides(this, val)
      return false
    },false)
    if (isColliding){
      this.x = prevX
      this.y = prevY
    }
  }
});

//game loop
const loop = GameLoop({  
  update: function() { 
    character.update()
  },
  render: function() {

    mazeSprite.forEach(sprite => sprite.render())
    character.render();
  }
});

console.log(generateMaze(10))

loop.start(); 